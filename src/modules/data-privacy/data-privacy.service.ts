import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  Consent,
  ConsentAction,
  ConsentLog,
  DatenschutzRequest,
  DatenschutzRequestStatus,
  DpiaEntry,
  LegalBasis,
  ReportStatus,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
import { AuditService } from '../audit/audit.service.js';
import {
  ConsentGrantDto,
  ConsentLogResponseDto,
  ConsentResponseDto,
  CreateDatenschutzRequestDto,
  DatenschutzRequestResponseDto,
  DpiaDto,
  DpiaResponseDto,
  LegalBasisDto,
  LegalBasisResponseDto,
  PersonalDataExport,
  ProcessDatenschutzRequestDto,
  UpdateDpiaDto,
  UpdateLegalBasisDto,
} from './dto/data-privacy.dto.js';

const REQUEST_DUE_DAYS = 30;

@Injectable()
export class DatenschutzService {
  private readonly logger = new Logger(DatenschutzService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
    private readonly audit: AuditService,
  ) {}

  // ---- Betroffenenrechte: Anträge ----

  async createRequest(
    currentUser: CurrentUser,
    dto: CreateDatenschutzRequestDto,
  ): Promise<DatenschutzRequestResponseDto> {
    let targetUserId = currentUser.id;

    if (dto.azubiId && dto.azubiId !== currentUser.id) {
      this.assertProcessor(currentUser, 'Antrag für andere anlegen');
      await this.scope.assertCanAccessAzubi(currentUser, dto.azubiId);
      targetUserId = dto.azubiId;
    } else if (!currentUser.roles.includes(Role.azubi)) {
      this.assertProcessor(currentUser, 'Antrag für sich selbst anlegen');
    }

    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + REQUEST_DUE_DAYS);

    const request = await this.prisma.datenschutzRequest.create({
      data: {
        userId: targetUserId,
        typ: dto.typ,
        details: dto.details ?? null,
        requestedAt: now,
        dueDate,
      },
    });

    await this.audit.create(currentUser, {
      action: 'DATA_REQUEST_CREATED',
      entity: 'datenschutz-request',
      entityId: request.id,
      details: JSON.stringify({ userId: targetUserId, typ: dto.typ }),
    });

    return this.toRequestResponse(request);
  }

  async findAllRequests(
    currentUser: CurrentUser,
  ): Promise<DatenschutzRequestResponseDto[]> {
    const where = await this.scopeWhere(currentUser);
    const items = await this.prisma.datenschutzRequest.findMany({
      where,
      orderBy: { requestedAt: 'desc' },
    });
    return items.map((r) => this.toRequestResponse(r));
  }

  async findRequest(
    id: string,
    currentUser: CurrentUser,
  ): Promise<DatenschutzRequestResponseDto> {
    const request = await this.loadRequest(id);
    await this.assertCanRead(request.userId, currentUser);
    return this.toRequestResponse(request);
  }

  async processRequest(
    id: string,
    currentUser: CurrentUser,
    dto: ProcessDatenschutzRequestDto,
  ): Promise<DatenschutzRequestResponseDto> {
    this.assertProcessor(currentUser, 'Antrag bearbeiten');
    const request = await this.loadRequest(id);

    const updated = await this.prisma.datenschutzRequest.update({
      where: { id },
      data: {
        status: dto.status,
        result: dto.result ?? request.result,
        processedBy: currentUser.id,
        completedAt:
          dto.status === DatenschutzRequestStatus.completed ||
          dto.status === DatenschutzRequestStatus.rejected
            ? request.completedAt ?? new Date()
            : null,
      },
    });

    await this.audit.create(currentUser, {
      action: 'DATA_REQUEST_PROCESSED',
      entity: 'datenschutz-request',
      entityId: id,
      details: JSON.stringify({ status: dto.status }),
    });

    return this.toRequestResponse(updated);
  }

  // ---- Datenauskunft / Export ----

  async exportPersonalData(
    id: string,
    currentUser: CurrentUser,
  ): Promise<PersonalDataExport> {
    const request = await this.loadRequest(id);
    if (
      request.userId !== currentUser.id &&
      !(
        currentUser.roles.includes(Role.ausbilder) ||
        currentUser.roles.includes(Role.hr) ||
        currentUser.roles.includes(Role.admin)
      )
    ) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Kein Zugriff auf diese Anfrage',
      });
    }
    if (request.userId !== currentUser.id) {
      await this.scope.assertCanAccessAzubi(currentUser, request.userId);
    }
    const userId = request.userId;
    const exportData = await this.collectPersonalData(userId);

    await this.audit.create(currentUser, {
      action: 'DATA_EXPORT',
      entity: 'datenschutz-request',
      entityId: id,
      details: `Export der Daten von user ${userId}`,
    });

    return exportData;
  }

  // ---- Recht auf Vergessenwerden (Anonymisierung) ----

  async anonymize(
    azubiId: string,
    currentUser: CurrentUser,
  ): Promise<{ ok: boolean; anonymizedUserId: string }> {
    this.assertProcessor(currentUser, 'Anonymisierung durchführen');
    await this.scope.assertCanAccessAzubi(currentUser, azubiId);

    const user = await this.prisma.user.findUnique({
      where: { id: azubiId },
      select: { id: true, email: true },
    });
    if (!user) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.USER_NOT_FOUND,
        message: `User ${azubiId} nicht gefunden`,
      });
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.zertifikat.deleteMany({ where: { azubiId } });
      await tx.abwesenheit.deleteMany({ where: { azubiId } });
      await tx.grade.deleteMany({ where: { azubiId } });
      await tx.checklist.deleteMany({ where: { azubiId } });
      await tx.feedback.deleteMany({
        where: { OR: [{ vonUserId: azubiId }, { anUserId: azubiId }] },
      });
      await tx.pruefung.deleteMany({ where: { azubiId } });
      await tx.projekt.deleteMany({ where: { azubiId } });

      const reports = await tx.report.findMany({
        where: { azubiId },
        select: { id: true, status: true },
      });
      const archivedIds = reports
        .filter((r) => r.status === ReportStatus.archiviert)
        .map((r) => r.id);
      const deletableIds = reports
        .filter((r) => r.status !== ReportStatus.archiviert)
        .map((r) => r.id);

      if (archivedIds.length > 0) {
        await tx.reportTask.deleteMany({
          where: { reportId: { in: archivedIds } },
        });
        await tx.reportComment.deleteMany({
          where: { reportId: { in: archivedIds } },
        });
        await tx.report.updateMany({
          where: { id: { in: archivedIds } },
          data: {
            inhaltMarkdown: '[anonymisiert]',
            titel: 'Anonymisierter Bericht',
          },
        });
      }
      if (deletableIds.length > 0) {
        await tx.report.deleteMany({ where: { id: { in: deletableIds } } });
      }
      await tx.reportComment.deleteMany({ where: { authorId: azubiId } });

      const consents = await tx.consent.findMany({
        where: { userId: azubiId, revokedAt: null },
      });
      for (const consent of consents) {
        await tx.consent.update({
          where: { id: consent.id },
          data: { revokedAt: new Date() },
        });
        await tx.consentLog.create({
          data: {
            userId: azubiId,
            key: consent.key,
            version: consent.version,
            action: ConsentAction.revoked,
          },
        });
      }

      await tx.user.update({
        where: { id: azubiId },
        data: {
          email: `anonym+${randomUUID()}@anonym.local`,
          firstName: 'Anonym',
          lastName: 'User',
          azubiId: null,
          isActive: false,
          passwordHash: `!invalid-${randomUUID()}`,
        },
      });
    });

    await this.audit.create(currentUser, {
      action: 'DATA_ANONYMIZED',
      entity: 'user',
      entityId: azubiId,
    });
    this.logger.warn(`User ${azubiId} wurde anonymisiert`);

    return { ok: true, anonymizedUserId: azubiId };
  }

  // ---- Einwilligungen (Art. 7) ----

  async findConsents(
    currentUser: CurrentUser,
  ): Promise<ConsentResponseDto[]> {
    const consents = await this.prisma.consent.findMany({
      where: { userId: currentUser.id },
      orderBy: { grantedAt: 'desc' },
    });
    return consents.map((c) => this.toConsentResponse(c));
  }

  async grantConsent(
    currentUser: CurrentUser,
    dto: ConsentGrantDto,
    ipAddress?: string,
  ): Promise<ConsentResponseDto> {
    const version = dto.version ?? '1';
    const existing = await this.prisma.consent.findUnique({
      where: {
        userId_key_version: { userId: currentUser.id, key: dto.key, version },
      },
    });

    const consent = await this.prisma.consent.upsert({
      where: {
        userId_key_version: { userId: currentUser.id, key: dto.key, version },
      },
      update: { grantedAt: new Date(), revokedAt: null, text: dto.text ?? null, ipAddress: ipAddress ?? null, source: dto.source ?? 'ui' },
      create: {
        userId: currentUser.id,
        key: dto.key,
        version,
        text: dto.text ?? null,
        grantedAt: new Date(),
        ipAddress: ipAddress ?? null,
        source: dto.source ?? 'ui',
      },
    });

    await this.prisma.consentLog.create({
      data: {
        userId: currentUser.id,
        key: dto.key,
        version,
        action: ConsentAction.granted,
        text: dto.text ?? null,
        ipAddress: ipAddress ?? null,
        source: dto.source ?? 'ui',
      },
    });

    await this.audit.create(currentUser, {
      action: 'CONSENT_GRANTED',
      entity: 'consent',
      entityId: existing?.id ?? consent.id,
      details: JSON.stringify({ key: dto.key, version }),
    });

    return this.toConsentResponse(consent);
  }

  async revokeConsent(
    currentUser: CurrentUser,
    key: string,
    version?: string,
    ipAddress?: string,
  ): Promise<ConsentResponseDto> {
    const where = version
      ? { userId: currentUser.id, key, version }
      : { userId: currentUser.id, key };
    const consents = await this.prisma.consent.findMany({
      where: { ...where, revokedAt: null },
    });
    if (consents.length === 0) {
      throw new BusinessException(
        ERROR_CODES.CONSENT_ALREADY_REVOKED,
        'Keine aktive Einwilligung für diesen Schlüssel',
        409,
      );
    }

    const now = new Date();
    const updated = await this.prisma.$transaction(async (tx) => {
      const events = await Promise.all(
        consents.map(async (consent) => {
          await tx.consentLog.create({
            data: {
              userId: currentUser.id,
              key: consent.key,
              version: consent.version,
              action: ConsentAction.revoked,
              text: consent.text,
              ipAddress: ipAddress ?? null,
              source: consent.source ?? 'ui',
            },
          });
          return tx.consent.update({
            where: { id: consent.id },
            data: { revokedAt: now },
          });
        }),
      );
      return events;
    });

    await this.audit.create(currentUser, {
      action: 'CONSENT_REVOKED',
      entity: 'consent',
      entityId: updated[0].id,
      details: JSON.stringify({ key, version: version ?? 'alle' }),
    });

    return this.toConsentResponse(updated[0]);
  }

  async findConsentLog(
    currentUser: CurrentUser,
  ): Promise<ConsentLogResponseDto[]> {
    const logs = await this.prisma.consentLog.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return logs.map((l) => this.toConsentLogResponse(l));
  }

  // ---- Verarbeitungsverzeichnis (Art. 30) ----

  async findAllLegalBases(): Promise<LegalBasisResponseDto[]> {
    const items = await this.prisma.legalBasis.findMany({
      orderBy: { title: 'asc' },
    });
    return items.map((l) => this.toLegalBasisResponse(l));
  }

  async createLegalBasis(dto: LegalBasisDto): Promise<LegalBasisResponseDto> {
    const item = await this.prisma.legalBasis.create({
      data: {
        title: dto.title,
        purpose: dto.purpose,
        dataCategories: dto.dataCategories,
        recipients: dto.recipients,
        retentionPeriod: dto.retentionPeriod ?? null,
        legalBasis: dto.legalBasis,
        controller: dto.controller ?? null,
        active: dto.active ?? true,
      },
    });
    return this.toLegalBasisResponse(item);
  }

  async updateLegalBasis(
    id: string,
    dto: UpdateLegalBasisDto,
  ): Promise<LegalBasisResponseDto> {
    await this.loadLegalBasis(id);
    const item = await this.prisma.legalBasis.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.purpose !== undefined ? { purpose: dto.purpose } : {}),
        ...(dto.dataCategories !== undefined
          ? { dataCategories: dto.dataCategories }
          : {}),
        ...(dto.recipients !== undefined ? { recipients: dto.recipients } : {}),
        ...(dto.retentionPeriod !== undefined
          ? { retentionPeriod: dto.retentionPeriod }
          : {}),
        ...(dto.legalBasis !== undefined ? { legalBasis: dto.legalBasis } : {}),
        ...(dto.controller !== undefined
          ? { controller: dto.controller }
          : {}),
        ...(dto.active !== undefined ? { active: dto.active } : {}),
      },
    });
    return this.toLegalBasisResponse(item);
  }

  async removeLegalBasis(id: string): Promise<void> {
    await this.loadLegalBasis(id);
    await this.prisma.legalBasis.delete({ where: { id } });
  }

  // ---- DPIA (Art. 35) ----

  async findAllDpia(): Promise<DpiaResponseDto[]> {
    const items = await this.prisma.dpiaEntry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return items.map((d) => this.toDpiaResponse(d));
  }

  async createDpia(
    currentUser: CurrentUser,
    dto: DpiaDto,
  ): Promise<DpiaResponseDto> {
    const item = await this.prisma.dpiaEntry.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        riskLevel: dto.riskLevel,
        measures: dto.measures ?? null,
        status: dto.status,
        assessedAt: dto.assessedAt ? new Date(dto.assessedAt) : null,
        assessedBy: dto.assessedAt ? currentUser.id : null,
      },
    });
    return this.toDpiaResponse(item);
  }

  async updateDpia(
    id: string,
    currentUser: CurrentUser,
    dto: UpdateDpiaDto,
  ): Promise<DpiaResponseDto> {
    await this.loadDpia(id);
    const item = await this.prisma.dpiaEntry.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
        ...(dto.riskLevel !== undefined ? { riskLevel: dto.riskLevel } : {}),
        ...(dto.measures !== undefined ? { measures: dto.measures } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.assessedAt !== undefined
          ? {
              assessedAt: dto.assessedAt ? new Date(dto.assessedAt) : null,
              assessedBy: dto.assessedAt ? currentUser.id : null,
            }
          : {}),
      },
    });
    return this.toDpiaResponse(item);
  }

  async removeDpia(id: string): Promise<void> {
    await this.loadDpia(id);
    await this.prisma.dpiaEntry.delete({ where: { id } });
  }

  // ---- Intern ----

  private async collectPersonalData(userId: string): Promise<PersonalDataExport> {
    const [
      user,
      einsaetze,
      berichte,
      zertifikate,
      abwesenheiten,
      noten,
      checklisten,
      feedbackGegeben,
      feedbackErhalten,
      pruefungen,
      projekte,
      konsente,
    ] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: { id: userId },
        include: { roles: true, abteilungen: true },
      }),
      this.prisma.einsatz.findMany({
        where: { azubiId: userId },
        include: { abteilung: true },
      }),
      this.prisma.report.findMany({
        where: { azubiId: userId },
        include: {
          reportTasks: true,
          kommentare: true,
        },
      }),
      this.prisma.zertifikat.findMany({ where: { azubiId: userId } }),
      this.prisma.abwesenheit.findMany({ where: { azubiId: userId } }),
      this.prisma.grade.findMany({ where: { azubiId: userId } }),
      this.prisma.checklist.findMany({
        where: { azubiId: userId },
        include: { items: true },
      }),
      this.prisma.feedback.findMany({ where: { vonUserId: userId } }),
      this.prisma.feedback.findMany({ where: { anUserId: userId } }),
      this.prisma.pruefung.findMany({
        where: { azubiId: userId },
        include: { meilensteine: true },
      }),
      this.prisma.projekt.findMany({ where: { azubiId: userId } }),
      this.prisma.consent.findMany({ where: { userId } }),
    ]);

    return {
      exportedAt: new Date().toISOString(),
      user: user
        ? {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
          }
        : {},
      profile: user
        ? {
            roles: user.roles.map((r) => r.role),
            abteilungen: user.abteilungen.map((a) => a.id),
            azubiId: user.azubiId,
          }
        : {},
      einsaetze: einsaetze.map((e) => ({
        id: e.id,
        abteilung: e.abteilung?.name,
        von: e.von,
        bis: e.bis,
        skillLevel: e.skillLevel,
      })),
      berichte: berichte.map((r) => ({
        id: r.id,
        titel: r.titel,
        typ: r.typ,
        kalenderwoche: r.kalenderwoche,
        jahr: r.jahr,
        status: r.status,
        inhalt: r.inhaltMarkdown,
        tasks: r.reportTasks.map((rt) => rt.taskId),
        kommentare: r.kommentare,
      })),
      zertifikate,
      abwesenheiten,
      noten,
      checklisten,
      feedbackGegeben,
      feedbackErhalten,
      pruefungen,
      projekte,
      konsente,
    };
  }

  private async scopeWhere(currentUser: CurrentUser) {
    if (currentUser.roles.includes(Role.azubi)) {
      return { userId: currentUser.id };
    }
    const visible = await this.scope.getVisibleAzubiIds(currentUser);
    if (visible === 'ALL') {
      return {};
    }
    return { userId: { in: [...visible] } };
  }

  private async assertCanRead(
    userId: string,
    currentUser: CurrentUser,
  ): Promise<void> {
    if (userId === currentUser.id) {
      return;
    }
    if (
      currentUser.roles.includes(Role.ausbilder) ||
      currentUser.roles.includes(Role.hr) ||
      currentUser.roles.includes(Role.admin)
    ) {
      await this.scope.assertCanAccessAzubi(currentUser, userId);
      return;
    }
    throw new ForbiddenException({
      errorCode: ERROR_CODES.ACCESS_DENIED,
      message: 'Kein Zugriff auf diese Anfrage',
    });
  }

  private assertProcessor(user: CurrentUser, action: string): void {
    const allowed = user.roles.some(
      (r) => r === Role.ausbilder || r === Role.hr || r === Role.admin,
    );
    if (!allowed) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: `Keine Berechtigung: ${action}`,
      });
    }
  }

  private async loadRequest(id: string): Promise<DatenschutzRequest> {
    const request = await this.prisma.datenschutzRequest.findUnique({
      where: { id },
    });
    if (!request) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.DATA_REQUEST_NOT_FOUND,
        message: `Datenschutzanfrage ${id} nicht gefunden`,
      });
    }
    return request;
  }

  private async loadLegalBasis(id: string): Promise<LegalBasis> {
    const item = await this.prisma.legalBasis.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.LEGAL_BASIS_NOT_FOUND,
        message: `Verarbeitung ${id} nicht gefunden`,
      });
    }
    return item;
  }

  private async loadDpia(id: string): Promise<DpiaEntry> {
    const item = await this.prisma.dpiaEntry.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.DPIA_ENTRY_NOT_FOUND,
        message: `DPIA-Eintrag ${id} nicht gefunden`,
      });
    }
    return item;
  }

  private toRequestResponse(
    r: DatenschutzRequest,
  ): DatenschutzRequestResponseDto {
    return {
      id: r.id,
      userId: r.userId,
      typ: r.typ,
      status: r.status,
      details: r.details,
      requestedAt: r.requestedAt,
      dueDate: r.dueDate,
      completedAt: r.completedAt,
      result: r.result,
      processedBy: r.processedBy,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }

  private toConsentResponse(consent: Consent): ConsentResponseDto {
    return {
      id: consent.id,
      userId: consent.userId,
      key: consent.key,
      version: consent.version,
      text: consent.text,
      grantedAt: consent.grantedAt,
      revokedAt: consent.revokedAt,
      ipAddress: consent.ipAddress,
      source: consent.source,
      active: consent.revokedAt === null,
    };
  }

  private toConsentLogResponse(log: ConsentLog): ConsentLogResponseDto {
    return {
      id: log.id,
      userId: log.userId,
      key: log.key,
      version: log.version,
      action: log.action,
      text: log.text,
      ipAddress: log.ipAddress,
      source: log.source,
      createdAt: log.createdAt,
    };
  }

  private toLegalBasisResponse(item: LegalBasis): LegalBasisResponseDto {
    return {
      id: item.id,
      title: item.title,
      purpose: item.purpose,
      dataCategories: item.dataCategories,
      recipients: item.recipients,
      retentionPeriod: item.retentionPeriod,
      legalBasis: item.legalBasis,
      controller: item.controller,
      active: item.active,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  private toDpiaResponse(item: DpiaEntry): DpiaResponseDto {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      riskLevel: item.riskLevel,
      measures: item.measures,
      status: item.status,
      assessedAt: item.assessedAt,
      assessedBy: item.assessedBy,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}