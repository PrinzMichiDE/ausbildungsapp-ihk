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
import {
  CreateZertifikatDto,
  UpdateZertifikatDto,
  ZertifikatResponseDto,
} from './dto/zertifikat.dto.js';

@Injectable()
export class ZertifikateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
  ) {}

  async create(
    currentUser: CurrentUser,
    dto: CreateZertifikatDto,
  ): Promise<ZertifikatResponseDto> {
    const azubiId = await this.resolveAzubiId(currentUser, dto.azubiId);
    const zertifikat = await this.prisma.zertifikat.create({
      data: {
        azubiId,
        titel: dto.titel,
        aussteller: dto.aussteller,
        erworbenAm: new Date(dto.erworbenAm),
        dokumentUrl: dto.dokumentUrl,
      },
    });
    return this.toResponse(zertifikat);
  }

  async findAll(currentUser: CurrentUser): Promise<ZertifikatResponseDto[]> {
    const where = await this.scopeWhere(currentUser);
    const items = await this.prisma.zertifikat.findMany({
      where,
      orderBy: { erworbenAm: 'desc' },
    });
    return items.map((z) => this.toResponse(z));
  }

  async findOne(
    id: string,
    currentUser: CurrentUser,
  ): Promise<ZertifikatResponseDto> {
    const zertifikat = await this.prisma.zertifikat.findUnique({
      where: { id },
    });
    if (!zertifikat) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.ZERTIFIKAT_NOT_FOUND,
        message: `Zertifikat ${id} nicht gefunden`,
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, zertifikat.azubiId);
    return this.toResponse(zertifikat);
  }

  async update(
    id: string,
    currentUser: CurrentUser,
    dto: UpdateZertifikatDto,
  ): Promise<ZertifikatResponseDto> {
    const existing = await this.findOne(id, currentUser);
    const isOwner =
      currentUser.roles.includes(Role.azubi) &&
      existing.azubiId === currentUser.azubiId;
    if (!isOwner && !this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Keine Berechtigung',
      });
    }
    const updated = await this.prisma.zertifikat.update({
      where: { id },
      data: {
        ...(dto.titel ? { titel: dto.titel } : {}),
        ...(dto.aussteller ? { aussteller: dto.aussteller } : {}),
        ...(dto.erworbenAm ? { erworbenAm: new Date(dto.erworbenAm) } : {}),
        ...(dto.dokumentUrl !== undefined ? { dokumentUrl: dto.dokumentUrl } : {}),
      },
    });
    return this.toResponse(updated);
  }

  async remove(id: string, currentUser: CurrentUser): Promise<void> {
    const existing = await this.findOne(id, currentUser);
    const isOwner =
      currentUser.roles.includes(Role.azubi) &&
      existing.azubiId === currentUser.azubiId;
    if (!isOwner && !this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Keine Berechtigung',
      });
    }
    await this.prisma.zertifikat.delete({ where: { id } });
  }

  private async resolveAzubiId(
    currentUser: CurrentUser,
    requested?: string,
  ): Promise<string> {
    if (currentUser.roles.includes(Role.azubi)) {
      if (!currentUser.azubiId) {
        throw new ForbiddenException({
          errorCode: ERROR_CODES.ACCESS_DENIED,
          message: 'Kein Azubi-Profil',
        });
      }
      if (requested && requested !== currentUser.azubiId) {
        throw new ForbiddenException({
          errorCode: ERROR_CODES.ACCESS_DENIED,
          message: 'Azubis dürfen nur eigene Zertifikate anlegen',
        });
      }
      return currentUser.azubiId;
    }
    if (!requested) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.BAD_REQUEST,
        message: 'azubiId ist erforderlich',
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, requested);
    return requested;
  }

  private async scopeWhere(currentUser: CurrentUser) {
    if (currentUser.roles.includes(Role.azubi) && currentUser.azubiId) {
      return { azubiId: currentUser.azubiId };
    }
    const visible = await this.scope.getVisibleAzubiIds(currentUser);
    if (visible === 'ALL') {
      return {};
    }
    return { azubiId: { in: [...visible] } };
  }

  private canManage(user: CurrentUser): boolean {
    return user.roles.some(
      (r) => r === Role.ausbilder || r === Role.hr || r === Role.admin,
    );
  }

  private toResponse(z: {
    id: string;
    azubiId: string;
    titel: string;
    aussteller: string;
    erworbenAm: Date;
    dokumentUrl: string | null;
  }): ZertifikatResponseDto {
    return {
      id: z.id,
      azubiId: z.azubiId,
      titel: z.titel,
      aussteller: z.aussteller,
      erworbenAm: z.erworbenAm,
      dokumentUrl: z.dokumentUrl,
    };
  }
}
