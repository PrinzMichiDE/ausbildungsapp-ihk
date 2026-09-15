import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FeedbackTyp } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import {
  CreateFeedbackDto,
  FeedbackResponseDto,
} from './dto/feedback.dto.js';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
  ) {}

  async create(
    currentUser: CurrentUser,
    dto: CreateFeedbackDto,
  ): Promise<FeedbackResponseDto> {
    if (dto.typ === FeedbackTyp.azubi_feedback) {
      if (!currentUser.roles.includes(Role.azubi)) {
        throw new ForbiddenException({
          errorCode: ERROR_CODES.ACCESS_DENIED,
          message: 'Nur Azubis dürfen Azubi-Feedback geben',
        });
      }
    } else {
      const allowed = currentUser.roles.some(
        (r) => r === Role.ausbildungsbeauftragter || r === Role.ausbilder,
      );
      if (!allowed) {
        throw new ForbiddenException({
          errorCode: ERROR_CODES.ACCESS_DENIED,
          message: 'Nur Ausbildungsbeauftragte/Ausbilder dürfen bewerten',
        });
      }
      if (dto.anUserId) {
        await this.scope.assertCanAccessAzubi(currentUser, dto.anUserId);
      }
    }

    const feedback = await this.prisma.feedback.create({
      data: {
        vonUserId: currentUser.id,
        anUserId: dto.anUserId,
        abteilungId: dto.abteilungId,
        typ: dto.typ,
        fachkompetenz: dto.fachkompetenz,
        softskills: dto.softskills,
        kommentar: dto.kommentar,
      },
    });
    return this.toResponse(feedback);
  }

  async findAll(currentUser: CurrentUser): Promise<FeedbackResponseDto[]> {
    const where = await this.scopeWhere(currentUser);
    const items = await this.prisma.feedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return items.map((f) => this.toResponse(f));
  }

  async findOne(
    id: string,
    currentUser: CurrentUser,
  ): Promise<FeedbackResponseDto> {
    const feedback = await this.prisma.feedback.findUnique({ where: { id } });
    if (!feedback) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.FEEDBACK_NOT_FOUND,
        message: `Feedback ${id} nicht gefunden`,
      });
    }
    this.assertVisible(currentUser, feedback);
    return this.toResponse(feedback);
  }

  async remove(id: string, currentUser: CurrentUser): Promise<void> {
    const feedback = await this.prisma.feedback.findUnique({ where: { id } });
    if (!feedback) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.FEEDBACK_NOT_FOUND,
        message: `Feedback ${id} nicht gefunden`,
      });
    }
    if (feedback.vonUserId !== currentUser.id && !this.isPrivileged(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Keine Berechtigung',
      });
    }
    await this.prisma.feedback.delete({ where: { id } });
  }

  private assertVisible(
    currentUser: CurrentUser,
    feedback: { vonUserId: string; anUserId: string | null },
  ): void {
    if (feedback.vonUserId === currentUser.id) {
      return;
    }
    if (this.isPrivileged(currentUser)) {
      return;
    }
    if (
      currentUser.roles.includes(Role.azubi) &&
      feedback.anUserId === currentUser.azubiId
    ) {
      return;
    }
    throw new ForbiddenException({
      errorCode: ERROR_CODES.ACCESS_DENIED,
      message: 'Kein Zugriff auf dieses Feedback',
    });
  }

  private async scopeWhere(currentUser: CurrentUser) {
    if (this.isPrivileged(currentUser)) {
      const visible = await this.scope.getVisibleAzubiIds(currentUser);
      if (visible === 'ALL') {
        return {};
      }
      return {
        OR: [
          { vonUserId: currentUser.id },
          { anUserId: { in: [...visible] } },
        ],
      };
    }
    return { vonUserId: currentUser.id };
  }

  private isPrivileged(user: CurrentUser): boolean {
    return user.roles.some(
      (r) =>
        r === Role.ausbilder ||
        r === Role.ausbildungsbeauftragter ||
        r === Role.hr,
    );
  }

  private toResponse(f: {
    id: string;
    vonUserId: string;
    anUserId: string | null;
    abteilungId: string | null;
    typ: FeedbackTyp;
    fachkompetenz: number | null;
    softskills: number | null;
    kommentar: string | null;
  }): FeedbackResponseDto {
    return {
      id: f.id,
      vonUserId: f.vonUserId,
      anUserId: f.anUserId,
      abteilungId: f.abteilungId,
      typ: f.typ,
      fachkompetenz: f.fachkompetenz,
      softskills: f.softskills,
      kommentar: f.kommentar,
    };
  }
}
