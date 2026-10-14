import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
import { hashPassword } from '../../common/utils/password.js';
import {
  buildOtpauthUrl,
  generateTotpSecret,
  verifyTotp,
} from '../../common/utils/totp.js';
import { AuditService } from '../audit/audit.service.js';
import {
  CreateUserDto,
  MfaDisableDto,
  MfaEnableDto,
  MfaSecretDto,
  UpdateUserDto,
  UserResponseDto,
} from './dto/user.dto.js';

interface UserWithRelations {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  passwordHash: string;
  azubiId: string | null;
  geburtsdatum: Date | null;
  mfaSecret: string | null;
  mfaActive: boolean;
  roles: Array<{ role: Role }>;
  abteilungen: Array<{ id: string }>;
}

const PERSONAL_DATA_ROLES: readonly Role[] = [Role.admin, Role.hr];

function canSeePersonalData(viewer?: CurrentUser): boolean {
  return !!viewer && viewer.roles.some((r) => PERSONAL_DATA_ROLES.includes(r));
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
    private readonly audit: AuditService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new BusinessException(
        ERROR_CODES.USER_EMAIL_TAKEN,
        'E-Mail-Adresse ist bereits vergeben',
        409,
      );
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        azubiId: dto.roles.includes(Role.azubi) ? null : null,
        roles: { create: dto.roles.map((role) => ({ role })) },
        ...(dto.abteilungIds?.length
          ? {
              abteilungen: {
                connect: dto.abteilungIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
      include: { roles: true, abteilungen: true },
    });

    if (dto.roles.includes(Role.azubi)) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { azubiId: user.id },
      });
    }

    return this.toResponse(user);
  }

  async findByEmail(email: string): Promise<UserWithRelations | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { roles: true, abteilungen: true },
    });
  }

  async findById(id: string, viewer?: CurrentUser): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: true, abteilungen: true },
    });
    if (!user) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.USER_NOT_FOUND,
        message: `User ${id} nicht gefunden`,
      });
    }
    return this.toResponse(user, viewer);
  }

  async findAll(currentUser: CurrentUser): Promise<UserResponseDto[]> {
    if (
      !currentUser.roles.some((r) =>
        ([Role.admin, Role.hr, Role.ausbilder] as Role[]).includes(r),
      )
    ) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Keine Berechtigung zum Auflisten von Nutzern',
      });
    }
    const users = await this.prisma.user.findMany({
      include: { roles: true, abteilungen: true },
      orderBy: { lastName: 'asc' },
    });
    return users.map((u) => this.toResponse(u, currentUser));
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    currentUser: CurrentUser,
  ): Promise<UserResponseDto> {
    await this.findById(id);

    if (
      !currentUser.roles.includes(Role.admin) &&
      !currentUser.roles.includes(Role.hr)
    ) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Admin/HR dürfen Nutzer bearbeiten',
      });
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.roles) {
        await tx.userRole.deleteMany({ where: { userId: id } });
        await tx.userRole.createMany({
          data: dto.roles.map((role) => ({ userId: id, role })),
        });
        if (dto.roles.includes(Role.azubi)) {
          await tx.user.update({ where: { id }, data: { azubiId: id } });
        } else {
          await tx.user.update({ where: { id }, data: { azubiId: null } });
        }
      }

      if (dto.abteilungIds) {
        const current = await tx.user.findUnique({
          where: { id },
          include: { abteilungen: true },
        });
        const currentIds = current?.abteilungen.map((a) => a.id) ?? [];
        const next = dto.abteilungIds;
        await tx.user.update({
          where: { id },
          data: {
            abteilungen: {
              disconnect: currentIds
                .filter((cid) => !next.includes(cid))
                .map((cid) => ({ id: cid })),
              connect: next
                .filter((cid) => !currentIds.includes(cid))
                .map((cid) => ({ id: cid })),
            },
          },
        });
      }

      if (typeof dto.isActive === 'boolean') {
        await tx.user.update({
          where: { id },
          data: { isActive: dto.isActive },
        });
      }

      if (dto.geburtsdatum !== undefined) {
        await tx.user.update({
          where: { id },
          data: {
            geburtsdatum: dto.geburtsdatum === null ? null : new Date(`${dto.geburtsdatum}T00:00:00Z`),
          },
        });
      }

      const updated = await tx.user.findUnique({
        where: { id },
        include: { roles: true, abteilungen: true },
      });
      const response = this.toResponse(updated!, currentUser);

      await this.audit.create(currentUser, {
        action: 'USER_UPDATED',
        entity: 'user',
        entityId: id,
        details: JSON.stringify({
          roles: dto.roles,
          abteilungIds: dto.abteilungIds,
          isActive: dto.isActive,
          // Only record that the birth date changed, not its value (data minimisation).
          geburtsdatumGeaendert: dto.geburtsdatum !== undefined || undefined,
        }),
      });

      return response;
    });
  }

  async remove(id: string, currentUser: CurrentUser): Promise<void> {
    if (!currentUser.roles.includes(Role.admin)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Admin darf Nutzer löschen',
      });
    }
    await this.findById(id);
    await this.prisma.user.delete({ where: { id } });
  }

  toResponse(user: UserWithRelations, viewer?: CurrentUser): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      roles: user.roles.map((r) => r.role),
      abteilungIds: user.abteilungen.map((a) => a.id),
      mfaActive: user.mfaActive,
      geburtsdatumHinterlegt: user.geburtsdatum !== null,
      ...(canSeePersonalData(viewer)
        ? { geburtsdatum: user.geburtsdatum ? user.geburtsdatum.toISOString().slice(0, 10) : null }
        : {}),
    };
  }

  // ---- MFA (TOTP) ----

  async generateMfaSecret(
    currentUser: CurrentUser,
  ): Promise<MfaSecretDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { mfaActive: true, mfaSecret: true },
    });
    if (user?.mfaActive) {
      throw new BusinessException(
        ERROR_CODES.MFA_ALREADY_ENABLED,
        'MFA ist bereits aktiviert',
        409,
      );
    }
    const secret = user?.mfaSecret ?? generateTotpSecret();
    if (!user?.mfaSecret) {
      await this.prisma.user.update({
        where: { id: currentUser.id },
        data: { mfaSecret: secret },
      });
    }
    return {
      secret,
      otpauthUrl: buildOtpauthUrl({
        secret,
        account: currentUser.email,
        issuer: 'NextGen IT-Ausbildung',
      }),
    };
  }

  async enableMfa(
    currentUser: CurrentUser,
    dto: MfaEnableDto,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.id },
      include: { roles: true, abteilungen: true },
    });
    if (!user) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.USER_NOT_FOUND,
        message: `User ${currentUser.id} nicht gefunden`,
      });
    }
    if (user.mfaActive) {
      throw new BusinessException(
        ERROR_CODES.MFA_ALREADY_ENABLED,
        'MFA ist bereits aktiviert',
        409,
      );
    }
    if (!user.mfaSecret) {
      throw new BusinessException(
        ERROR_CODES.MFA_NOT_ENABLED,
        'Zuerst ein Geheimnis erzeugen',
        400,
      );
    }
    if (!verifyTotp(user.mfaSecret, dto.code)) {
      throw new BusinessException(
        ERROR_CODES.MFA_INVALID_CODE,
        'Ungültiger TOTP-Code',
        401,
      );
    }

    const updated = await this.prisma.user.update({
      where: { id: currentUser.id },
      data: { mfaActive: true },
      include: { roles: true, abteilungen: true },
    });

    await this.audit.create(currentUser, {
      action: 'MFA_ENABLED',
      entity: 'user',
      entityId: currentUser.id,
    });

    return this.toResponse(updated);
  }

  async disableMfa(
    currentUser: CurrentUser,
    dto: MfaDisableDto,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.id },
      include: { roles: true, abteilungen: true },
    });
    if (!user) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.USER_NOT_FOUND,
        message: `User ${currentUser.id} nicht gefunden`,
      });
    }
    if (!user.mfaActive || !user.mfaSecret) {
      throw new BusinessException(
        ERROR_CODES.MFA_NOT_ENABLED,
        'MFA ist nicht aktiviert',
        400,
      );
    }
    if (!verifyTotp(user.mfaSecret, dto.code)) {
      throw new BusinessException(
        ERROR_CODES.MFA_INVALID_CODE,
        'Ungültiger TOTP-Code',
        401,
      );
    }

    const updated = await this.prisma.user.update({
      where: { id: currentUser.id },
      data: { mfaActive: false, mfaSecret: null },
      include: { roles: true, abteilungen: true },
    });

    await this.audit.create(currentUser, {
      action: 'MFA_DISABLED',
      entity: 'user',
      entityId: currentUser.id,
    });

    return this.toResponse(updated);
  }
}
