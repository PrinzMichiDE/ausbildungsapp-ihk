import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service.js";
import { AccessScopeService } from "../../common/rbac/access-scope.service.js";
import { CurrentUser } from "../../common/decorators/current-user.type.js";
import { Role } from "../../common/constants/roles.js";
import { ERROR_CODES } from "../../common/constants/error-codes.js";
@Injectable() export class AusbildungsvertragService{
  constructor(private prisma:PrismaService, private scope:AccessScopeService){}
  async create(u:CurrentUser,dto:any){ if(!u.roles.some(r=>r===Role.ausbilder||r===Role.admin)) throw new ForbiddenException({errorCode:ERROR_CODES.ACCESS_DENIED,message:"Keine Berechtigung"}); return this.prisma.ausbildungsvertrag.create({data:{...dto}}); }
  async findAll(u:CurrentUser){ const w= u.roles.includes(Role.azubi) && u.azubiId ? {azubiId:u.azubiId} : {}; return this.prisma.ausbildungsvertrag.findMany({where:w}); }
}
