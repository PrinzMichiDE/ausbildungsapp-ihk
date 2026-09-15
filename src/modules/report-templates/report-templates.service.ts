import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service.js";
import { CurrentUser } from "../../common/decorators/current-user.type.js";
import { Role } from "../../common/constants/roles.js";
import { ERROR_CODES } from "../../common/constants/error-codes.js";
@Injectable() export class ReporttemplateService {
  constructor(private prisma:PrismaService){}
  create(dto:any){ return this.prisma.reportTemplate.create({data:dto}); }
  findAll(){ return this.prisma.reportTemplate.findMany(); }
  findOne(id:string){ return this.prisma.reportTemplate.findUnique({where:{id}}); }
}
