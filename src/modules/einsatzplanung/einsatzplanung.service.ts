import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService, ALLE } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import {
  CreateEinsatzPlanungDto,
  UpdateEinsatzPlanungDto,
  EinsatzPlanungQueryDto,
  EinsatzUserAssignmentDto,
} from './dto/einsatzplanung.dto.js';
import { Prisma } from '@prisma/client';

/**
 * Einsatzplanung Service — CRUD für Einsatzplanung (Einsatz-Modell).
 *
 * Alle Leseoperationen sind durch AccessScopeService RBAC-gescoped.
 * Erstellen/Aktualisieren/Löschen erfordern Schreibrechte.
 */
@Injectable()
export class EinsatzplanungService {
  private readonly logger = new Logger(EinsatzplanungService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly accessScope: AccessScopeService,
  ) {}

  // ------------------------------------------------------------------
  // List — paginierte Filterung mit RBAC-Scoping
  // ------------------------------------------------------------------

  /**
   * Liest Einsatzplanungseinträge mit Datumspannen-Filter, Status-Filter,
   * Benutzer-Filter und Paginierung.
   */
  async findAll(dto: EinsatzPlanungQueryDto, currentUser: CurrentUser) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;

    // 1. Prüfe ob nach einem spezifischen Azubi gefiltert wird
    let azubiFilter: Prisma.EinsatzWhereInput | undefined;

    if (dto.azubiId) {
      const visibleAzubis =
        await this.accessScope.getVisibleAzubiIds(currentUser);
      azubiFilter = {
        azubiId: { in: visibleAzubis === ALLE ? [] : [...visibleAzubis] },
      };
    } else {
      const visibleAzubis =
        await this.accessScope.getVisibleAzubiIds(currentUser);
      azubiFilter = {
        azubiId: { in: visibleAzubis === ALLE ? [] : [...visibleAzubis] },
      };
    }

    // 2. Kombiniere mit den anderen Filtern
    const where: Prisma.EinsatzWhereInput = {
      ...azubiFilter,
      ...(dto.status && { status: dto.status }),
      ...(dto.von && {
        von: {
          gte: new Date(dto.von),
        },
      }),
      ...(dto.bis && {
        bis: {
          lte: new Date(dto.bis),
        },
      }),
    };

    // 3. Zähle alle Übereinstimmungen
    const total = await this.prisma.einsatz.count({ where });

    // 4. Hole die paginierten Ergebnisse
    const einsaetze = await this.prisma.einsatz.findMany({
      where,
      skip,
      take: limit,
      orderBy: { von: 'desc' },
      include: {
        azubi: {
          select: {
            id: true,
            vorname: true,
            nachname: true,
            email: true,
          },
        },
        abteilung: {
          select: {
            id: true,
            bezeichnung: true,
            kurzzeichen: true,
          },
        },
      },
    });

    return {
      data: einsaetze,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ------------------------------------------------------------------
  // Get by ID
  // ------------------------------------------------------------------

  /**
   * Liest einen einzelnen Einsatzplanungseintrag nach ID.
   * RBAC-Prüfung: Azubi darf nur sich selbst sehen, andere Rollen via Scope.
   */
  async findById(id: string, currentUser: CurrentUser) {
    const einsatz = await this.prisma.einsatz.findUnique({
      where: { id },
      include: {
        azubi: {
          select: {
            id: true,
            vorname: true,
            nachname: true,
            email: true,
          },
        },
        abteilung: {
          select: {
            id: true,
            bezeichnung: true,
            kurzzeichen: true,
          },
        },
      },
    });

    if (!einsatz) {
      throw new NotFoundException(
        `Einsatzplanung mit ID ${id} nicht gefunden`,
      );
    }

    // RBAC-Prüfung: Ist der Azubi berechtigt, diesen Einsatz zu sehen?
    const visibleAzubiIds = await this.accessScope.getVisibleAzubiIds(currentUser);
    if (visibleAzubiIds !== ALLE && !visibleAzubiIds.includes(einsatz.azubiId)) {
      throw new NotFoundException(
        `Einsatzplanung mit ID ${id} nicht gefunden`,
      );
    }

    return einsatz;
  }

  // ------------------------------------------------------------------
  // Create
  // ------------------------------------------------------------------

  /**
   * Erstellt einen neuen Einsatzplanungseintrag.
   */
  async create(dto: CreateEinsatzPlanungDto, currentUser: CurrentUser) {
    // Validiere die DTOTWerte — von muss vor bis liegen
    if (dto.von >= dto.bis) {
      throw new Error('Das Startdatum (von) muss vor dem Enddatum (bis) liegen');
    }

    // Prüfe ob der zugewiesene Azubi sichtbar ist (RBAC)
    const visibleAzubiIds =
      await this.accessScope.getVisibleAzubiIds(currentUser);

    if (dto.azubiId && !visibleAzubiIds.includes(dto.azubiId)) {
      throw new Error('Der zugewiesene Azubi ist für diesen Benutzer nicht sichtbar');
    }

    const einsatz = await this.prisma.einsatz.create({
      data: {
        azubiId: dto.azubiId,
        abteilungId: dto.abteilungId,
        von: new Date(dto.von),
        bis: new Date(dto.bis),
        status: dto.status ?? 'geplant',
        bemerkung: dto.kommentar,
      },
      include: {
        azubi: {
          select: {
            id: true,
            vorname: true,
            nachname: true,
            email: true,
          },
        },
        abteilung: {
          select: {
            id: true,
            bezeichnung: true,
            kurzzeichen: true,
          },
        },
      },
    });

    this.logger.log(`Neuer Einsatz erstellt: ${einsatz.id}`);
    return einsatz;
  }

  // ------------------------------------------------------------------
  // Update (PATCH)
  // ------------------------------------------------------------------

  /**
   * Aktualisiert einen vorhandenen Einsatzplanungseintrag.
   * Nur übergebene Felder werden aktualisiert (Partial).
   */
  async update(id: string, dto: UpdateEinsatzPlanungDto, currentUser: CurrentUser) {
    // Prüfe ob der Eintrag existiert
    const existing = await this.prisma.einsatz.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(
        `Einsatzplanung mit ID ${id} nicht gefunden`,
      );
    }

    // RBAC-Prüfung: Darf der User diesen Eintrag ändern?
    const visibleAzubiIds =
      await this.accessScope.getVisibleAzubiIds(currentUser);
    if (!visibleAzubiIds.includes(existing.azubiId)) {
      throw new NotFoundException(
        `Einsatzplanung mit ID ${id} nicht gefunden`,
      );
    }

    // Validiere: wenn von/bis übergeben, muss von < bis sein
    const von = dto.von ?? existing.von;
    const bis = dto.bis ?? existing.bis;
    if (von >= bis) {
      throw new Error('Das Startdatum (von) muss vor dem Enddatum (bis) liegen');
    }

    // Wenn azubiId geändert wird, prüfe RBAC
    const azubiId = dto.azubiId ?? existing.azubiId;
    if (dto.azubiId && !visibleAzubiIds.includes(azubiId)) {
      throw new Error('Der zugewiesene Azubi ist für diesen Benutzer nicht sichtbar');
    }

    const einsatz = await this.prisma.einsatz.update({
      where: { id },
      data: {
        ...(dto.azubiId && { azubiId: dto.azubiId }),
        ...(dto.abteilungId && { abteilungId: dto.abteilungId }),
        ...(dto.von && { von: new Date(dto.von) }),
        ...(dto.bis && { bis: new Date(dto.bis) }),
        ...(dto.status && { status: dto.status }),
        ...(dto.kommentar !== undefined && { bemerkung: dto.kommentar }),
      },
      include: {
        azubi: {
          select: {
            id: true,
            vorname: true,
            nachname: true,
            email: true,
          },
        },
        abteilung: {
          select: {
            id: true,
            bezeichnung: true,
            kurzzeichen: true,
          },
        },
      },
    });

    this.logger.log(`Einsatzplanung aktualisiert: ${einsatz.id}`);
    return einsatz;
  }

  // ------------------------------------------------------------------
  // Delete
  // ------------------------------------------------------------------

  /**
   * Löscht einen Einsatzplanungseintrag.
   * Existiert er nicht, wird NotFoundException geworfen.
   */
  async remove(id: string, currentUser: CurrentUser) {
    const existing = await this.prisma.einsatz.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(
        `Einsatzplanung mit ID ${id} nicht gefunden`,
      );
    }

    // RBAC-Prüfung
    const visibleAzubiIds = [
      ...await this.accessScope.getVisibleAzubiIds(currentUser),
    ];
    if (!visibleAzubiIds.includes(existing.azubiId)) {
      throw new NotFoundException(
        `Einsatzplanung mit ID ${id} nicht gefunden`,
      );
    }

    await this.prisma.einsatz.delete({ where: { id } });

    this.logger.log(`Einsatzplanung gelöscht: ${id}`);
    return { deleted: id };
  }

  // ------------------------------------------------------------------
  // Calendar View
  // ------------------------------------------------------------------

  /**
   * Liest alle Einsätze für eine Kalenderansicht in einem Datumsbereich.
   * Optimiert für Frontend-Kalenderkomponenten.
   */
  async getCalendarView(
    dto: EinsatzPlanungQueryDto,
    currentUser: CurrentUser,
  ) {
    if (!dto.von || !dto.bis) {
      throw new Error('Für die Kalenderansicht werden von und bis benötigt');
    }

    const visibleAzubiIds = [
      ...await this.accessScope.getVisibleAzubiIds(currentUser),
    ];
    const azubiFilter = dto.azubiId
      ? { azubiId: dto.azubiId }
      : {};

    const where: Prisma.EinsatzWhereInput = {
      ...azubiFilter,
      ...(dto.status && { status: dto.status }),
      // Überschneidung mit dem Zeitraum: von <= bis AND bis >= von
      OR: [
        {
          von: { gte: new Date(dto.von), lte: new Date(dto.bis) },
        },
        {
          bis: { gte: new Date(dto.von), lte: new Date(dto.bis) },
        },
        {
          von: { lte: new Date(dto.von) },
          bis: { gte: new Date(dto.bis) },
        },
      ],
    };

    const einsaetze = await this.prisma.einsatz.findMany({
      where,
      orderBy: { von: 'asc' },
      include: {
        azubi: {
          select: {
            id: true,
            vorname: true,
            nachname: true,
          },
        },
        abteilung: {
          select: {
            id: true,
            bezeichnung: true,
            kurzzeichen: true,
          },
        },
      },
    });

    return { data: einsaetze };
  }

  // ------------------------------------------------------------------
  // User Assignment
  // ------------------------------------------------------------------

  /**
   * Weist einen Azubi einem Einsatz zu.
   */
  async assignUser(
    id: string,
    dto: EinsatzUserAssignmentDto,
    currentUser: CurrentUser,
  ) {
    const existing = await this.prisma.einsatz.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(
        `Einsatzplanung mit ID ${id} nicht gefunden`,
      );
    }

    // RBAC-Prüfung
    const visibleAzubiIds =
      await this.accessScope.getVisibleAzubiIds(currentUser);
    if (!visibleAzubiIds.includes(existing.azubiId)) {
      throw new NotFoundException(
        `Einsatzplanung mit ID ${id} nicht gefunden`,
      );
    }

    // Neuer Azubi muss auch sichtbar sein
    if (!visibleAzubiIds.includes(dto.azubiId)) {
      throw new Error('Der zugewiesene Azubi ist für diesen Benutzer nicht sichtbar');
    }

    const einsatz = await this.prisma.einsatz.update({
      where: { id },
      data: { azubiId: dto.azubiId },
      include: {
        azubi: {
          select: {
            id: true,
            vorname: true,
            nachname: true,
            email: true,
          },
        },
        abteilung: {
          select: {
            id: true,
            bezeichnung: true,
            kurzzeichen: true,
          },
        },
      },
    });

    this.logger.log(`User zugewiesen zu Einsatz ${id}: ${dto.azubiId}`);
    return einsatz;
  }

  /**
   * Holt alle zugewiesenen Azubis für einen bestimmten Einsatz (mehrfachzuweisung).
   */
  async getUserAssignments(einsatzId: string, currentUser: CurrentUser) {
    const existing = await this.prisma.einsatz.findUnique({
      where: { id: einsatzId },
      include: { azubi: true },
    });

    if (!existing) {
      throw new NotFoundException(
        `Einsatzplanung mit ID ${einsatzId} nicht gefunden`,
      );
    }

    // RBAC-Prüfung
    const visibleAzubiIds =
      await this.accessScope.getVisibleAzubiIds(currentUser);
    if (![...visibleAzubiIds].includes(existing.azubiId)) {
      throw new NotFoundException(
        `Einsatzplanung mit ID ${einsatzId} nicht gefunden`,
      );
    }

    return {
      data: {
        azubiId: existing.azubiId,
        azubi: existing.azubi,
        abteilungId: existing.abteilungId,
        von: existing.von,
        bis: existing.bis,
      },
    };
  }
}