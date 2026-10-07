var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
let AzubiAkteService = class AzubiAkteService {
    prisma;
    scope;
    constructor(prisma, scope) {
        this.prisma = prisma;
        this.scope = scope;
    }
    async findAll(user) {
        const isAdmin = user.roles.includes(Role.admin);
        const isAusbilderOrHr = user.roles.some(r => r === Role.ausbilder || r === Role.hr);
        let azubis;
        if (isAdmin || isAusbilderOrHr) {
            azubis = await this.prisma.user.findMany({
                where: { roles: { some: { role: Role.azubi } } },
                include: {
                    ausbildungsvertrag: true,
                    ausbildungsplaeneAzubi: true,
                },
            });
        }
        else {
            const visible = await this.scope.getVisibleAzubiIds(user);
            if (visible === 'ALL') {
                azubis = await this.prisma.user.findMany({
                    where: { roles: { some: { role: Role.azubi } } },
                    include: {
                        ausbildungsvertrag: true,
                        ausbildungsplaeneAzubi: true,
                    },
                });
            }
            else {
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
    async findOne(user, azubiId) {
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
    async overview(user) {
        const isAdmin = user.roles.includes(Role.admin);
        const isAusbilderOrHr = user.roles.some(r => r === Role.ausbilder || r === Role.hr);
        let azubiIds;
        if (isAdmin || isAusbilderOrHr) {
            const azubis = await this.prisma.user.findMany({
                where: { roles: { some: { role: Role.azubi } } },
                select: { id: true },
            });
            azubiIds = azubis.map((a) => a.id);
        }
        else {
            const visible = await this.scope.getVisibleAzubiIds(user);
            if (visible === 'ALL') {
                const azubis = await this.prisma.user.findMany({
                    where: { roles: { some: { role: Role.azubi } } },
                    select: { id: true },
                });
                azubiIds = azubis.map((a) => a.id);
            }
            else {
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
    toResponse(a) {
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
};
AzubiAkteService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService])
], AzubiAkteService);
export { AzubiAkteService };
//# sourceMappingURL=azubi-akte.service.js.map