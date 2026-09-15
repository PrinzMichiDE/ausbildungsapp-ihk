import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CurrentUser } from '../decorators/current-user.type.js';
import { Role } from '../constants/roles.js';
import { ERROR_CODES } from '../constants/error-codes.js';

const ALLE = 'ALL' as const;
type Scope = ReadonlyArray<string> | typeof ALLE;

@Injectable()
export class AccessScopeService {
  constructor(private readonly prisma: PrismaService) {}

  async getVisibleAzubiIds(user: CurrentUser): Promise<Scope> {
    switch (true) {
      case user.roles.includes(Role.azubi):
        return user.azubiId ? [user.azubiId] : [];
      case user.roles.includes(Role.ausbildungsbeauftragter):
        return this.findActiveAzubiIdsForAbteilungen(user.abteilungIds);
      case user.roles.includes(Role.ausbilder):
      case user.roles.includes(Role.hr):
        return ALLE;
      case user.roles.includes(Role.admin):
        return [];
      default:
        return [];
    }
  }

  private async findActiveAzubiIdsForAbteilungen(
    abteilungIds: ReadonlyArray<string>,
  ): Promise<ReadonlyArray<string>> {
    if (!abteilungIds || abteilungIds.length === 0) {
      return [];
    }
    const now = new Date();
    const einsaetze = await this.prisma.einsatz.findMany({
      where: {
        abteilungId: { in: [...abteilungIds] },
        von: { lte: now },
        bis: { gte: now },
      },
      select: { azubiId: true },
      distinct: ['azubiId'],
    });
    return einsaetze.map((e) => e.azubiId);
  }

  async isAzubiVisible(user: CurrentUser, azubiId: string): Promise<boolean> {
    const scope = await this.getVisibleAzubiIds(user);
    if (scope === ALLE) {
      return true;
    }
    return scope.includes(azubiId);
  }

  async assertCanAccessAzubi(
    user: CurrentUser,
    azubiId: string,
  ): Promise<void> {
    const visible = await this.isAzubiVisible(user, azubiId);
    if (!visible) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Kein Zugriff auf diesen Auszubildenden',
      });
    }
  }

  async assertCanAccessBericht(
    user: CurrentUser,
    berichtId: string,
  ): Promise<void> {
    const bericht = await this.prisma.report.findUnique({
      where: { id: berichtId },
      select: { azubiId: true },
    });
    if (!bericht) {
      return;
    }
    await this.assertCanAccessAzubi(user, bericht.azubiId);
  }
}
