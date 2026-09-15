var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service.js";
import { AccessScopeService } from "../../common/rbac/access-scope.service.js";
import { Role } from "../../common/constants/roles.js";
import { ERROR_CODES } from "../../common/constants/error-codes.js";
let ErziehungsberechtigteService = class ErziehungsberechtigteService {
    prisma;
    scope;
    constructor(prisma, scope) {
        this.prisma = prisma;
        this.scope = scope;
    }
    async create(u, dto) { if (!u.roles.some(r => r === Role.ausbilder || r === Role.admin))
        throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: "Keine Berechtigung" }); return this.prisma.erziehungsberechtigter.create({ data: { ...dto } }); }
    async findAll(u) { const w = u.roles.includes(Role.azubi) && u.azubiId ? { azubiId: u.azubiId } : {}; return this.prisma.erziehungsberechtigter.findMany({ where: w }); }
};
ErziehungsberechtigteService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService, AccessScopeService])
], ErziehungsberechtigteService);
export { ErziehungsberechtigteService };
//# sourceMappingURL=erziehungsberechtigte.service.js.map