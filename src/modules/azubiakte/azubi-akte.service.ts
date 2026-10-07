import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { AzubiAkteResponseDto, AzubiAkteOverviewDto } from './dto/azubi-akte.dto.js';

@Injectable()
export class AzubiAkteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
  ) {}

  async findAll(user: CurrentUser): Promise<AzubiAkteResponseDto[]> {
    const isAdmin = user.roles.includes(Role.admin);
    const isAusbilderOrHr = user.roles.some(r => r === Role.ausbilder || r === Role.hr);

    let azubis: any[];
    if (isAdmin || isAusbilderOrHr) {
      azubis = await this.prisma.user.findMany({
        where: { roles: { some: { role: Role.azubi } } },
        include: {
          ausbildungsvertrag: true,
          ausbildungsplaeneAzubi: true,
        },
      });
    } else {
      const visible = await this.scope.getVisibleAzubiIds(user);
      if (visible === 'ALL') {
        azubis = await this.prisma.user.findMany({
          where: { roles: { some: { role: Role.azubi } } },
          include: {
            ausbildungsvertrag: true,
            ausbildungsplaeneAzubi: true,
          },
        });
      } else {
        azubis = await this.prisma.user.findMany({
          where: { id: { in: [...visible] } },
          include: {
            ausbildungsvertrag: true,
            ausbildungsplaeneAzubi: true,
          },
        });
      }
    }

    return azubis.map(a => this.toResponse(a));
  }

  async findOne(user: CurrentUser, azubiId: string): Promise<AzubiAkteResponseDto> {
    await this.scope.assertCanAccessAzubi(user, azubiId);

    const azubi = await this.prisma.user.findUnique({
      where: { id: azubiId },
      include: {
        ausbildungsvertrag: true,
        ausbildungsplaeneAzubi: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!azubi) {
      throw new NotFoundException({ errorCode: ERROR_CODES.NOT_FOUND, message: `Azubi ${azubiId} nicht gefunden` });
    }

    const [nachweiseCount, einsaetzeCount, abwesenheitenCount] = await Promise.all([
      this.prisma.ausbildungsnachweis.count({ where: { azubiId } }),
      this.prisma.einsatz.count({ where: { azubiId } }),
      this.prisma.abwesenheit.count({ where: { azubiId } }),
    ]);

    const vertrag = azubi.ausbildungsvertrag;
    const plan = azubi.ausbildungsplaeneAzubi[0] ?? null;

    return {
      id: azubi.id,
      name: `${azubi.firstName ?? ''} ${azubi.lastName ?? ''}`.trim(),
      email: azubi.email,
      beruf: vertrag?.beruf ?? undefined,
      vertragsStart: vertrag?.startdatum ?? undefined,
      vertragsEnde: vertrag?.enddatum ?? undefined,
      planStatus: plan?.status ?? undefined,
      nachweiseCount,
      einsaetzeCount,
      abwesenheitenCount,
    };
  }

  async overview(user: CurrentUser): Promise<AzubiAkteOverviewDto> {
    const isAdmin = user.roles.includes(Role.admin);
    const isAusbilderOrHr = user.roles.some(r => r === Role.ausbilder || r === Role.hr);

    let azubiIds: string[];
    if (isAdmin || isAusbilderOrHr) {
      const azubis = await this.prisma.user.findMany({
        where: { roles: { some: { role: Role.azubi } } },
        select: { id: true },
      });
      azubiIds = azubis.map((a: { id: string }) => a.id);
    } else {
      const visible = await this.scope.getVisibleAzubiIds(user);
      if (visible === 'ALL') {
        const azubis = await this.prisma.user.findMany({
          where: { roles: { some: { role: Role.azubi } } },
          select: { id: true },
        });
        azubiIds = azubis.map((a: { id: string }) => a.id);
      } else {
        azubiIds = [...visible];
      }
    }

    const [gesamtNachweise] = await Promise.all([
      this.prisma.ausbildungsnachweis.count({ where: { azubiId: { in: azubiIds } } }),
    ]);

    return {
      totalAzubis: azubiIds.length,
      aktiveVertraege: await this.prisma.ausbildungsvertrag.count({ where: { status: 'aktiv' } }),
      gesamtNachweise,
      inPruefung: await this.prisma.ausbildungsnachweis.count({ where: { azubiId: { in: azubiIds }, status: 'in_pruefung' } }),
    };
  }

  private toResponse(a: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    beruf?: string | null;
    ausbildungsvertrag?: { beruf?: string; startdatum?: Date; enddatum?: Date } | null;
    ausbildungsplaeneAzubi?: Array<{ status?: string }>;
  }): AzubiAkteResponseDto {
    const vertrag = a.ausbildungsvertrag ?? null;
    const plan = a.ausbildungsplaeneAzubi?.[0] ?? null;
    return {
      id: a.id,
      name: `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim(),
      email: a.email,
      beruf: vertrag?.beruf ?? undefined,
      vertragsStart: vertrag?.startdatum ?? undefined,
      vertragsEnde: vertrag?.enddatum ?? undefined,
      planStatus: plan?.status ?? undefined,
    };
  }
}