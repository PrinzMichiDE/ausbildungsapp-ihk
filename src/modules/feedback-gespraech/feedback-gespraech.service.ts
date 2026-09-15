import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { CreateFeedbackGespraechDto, UpdateFeedbackGespraechDto, CreateVereinbarungDto } from './dto/feedback-gespraech.dto.js';

@Injectable()
export class FeedbackGespraechService {
  constructor(private prisma: PrismaService, private scope: AccessScopeService) {}

  private canManage(u: CurrentUser) { return u.roles.some(r=> r===Role.ausbilder || r===Role.ausbildungsbeauftragter); }

  async create(user: CurrentUser, dto: CreateFeedbackGespraechDto) {
    if (!this.canManage(user)) throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur Ausbilder/Beauftragter' });
    await this.scope.assertCanAccessAzubi(user, dto.azubiId);
    return this.prisma.feedbackGespraech.create({ data: { azubiId: dto.azubiId, durchgefuehrtVonId: user.id, typ: dto.typ, termin: dto.termin ? new Date(dto.termin) : null, ziele: dto.ziele, sichtbarkeitAzubi: dto.sichtbarkeitAzubi ?? true }, include: { vereinbarungen: true } });
  }
  async findAll(user: CurrentUser) {
    const where = await this.scopeWhere(user);
    const items = await this.prisma.feedbackGespraech.findMany({ where, include:{vereinbarungen:true}, orderBy:{termin:'desc'} });
    // Azubi sieht nur freigegebene
    if (user.roles.includes(Role.azubi)) return items.filter(i=> i.sichtbarkeitAzubi);
    return items;
  }
  async findOne(id: string, user: CurrentUser) {
    const g = await this.prisma.feedbackGespraech.findUnique({ where:{id}, include:{vereinbarungen:true} });
    if(!g) throw new NotFoundException({ errorCode: ERROR_CODES.NOT_FOUND, message:'Gespräch nicht gefunden'});
    await this.scope.assertCanAccessAzubi(user, g.azubiId);
    if (user.roles.includes(Role.azubi) && !g.sichtbarkeitAzubi) throw new ForbiddenException({errorCode:ERROR_CODES.ACCESS_DENIED, message:'Kein Zugriff'});
    // HR sieht nur Status/Termin
    if (user.roles.includes(Role.hr) && !user.roles.some(r=> r===Role.ausbilder)) return { id:g.id, azubiId:g.azubiId, status:g.status, termin:g.termin };
    return g;
  }
  async update(id: string, user: CurrentUser, dto: UpdateFeedbackGespraechDto){
    const g= await this.findOne(id,user);
    if (!this.canManage(user)) throw new ForbiddenException({errorCode:ERROR_CODES.ACCESS_DENIED, message:'Keine Berechtigung'});
    return this.prisma.feedbackGespraech.update({ where:{id}, data:{ status: dto.status as any, verlaufsnotiz: dto.verlaufsnotiz, ziele: dto.ziele, durchgefuehrtAm: dto.durchgefuehrtAm ? new Date(dto.durchgefuehrtAm):undefined, sichtbarkeitAzubi: dto.sichtbarkeitAzubi }, include:{vereinbarungen:true}});
  }
  async addVereinbarung(id: string, user: CurrentUser, dto: CreateVereinbarungDto){
    await this.findOne(id,user);
    if(!this.canManage(user) && !user.roles.includes(Role.azubi)) throw new ForbiddenException({errorCode:ERROR_CODES.ACCESS_DENIED, message:'Keine Berechtigung'});
    return this.prisma.gespraechVereinbarung.create({ data:{ gespraechId:id, text:dto.text, faelligAm: dto.faelligAm? new Date(dto.faelligAm):null }});
  }
  async completeVereinbarung(gespraechId:string, vereinbarungId:string, user: CurrentUser){
    const v= await this.prisma.gespraechVereinbarung.findUnique({where:{id:vereinbarungId}});
    if(!v|| v.gespraechId!==gespraechId) throw new NotFoundException({errorCode:ERROR_CODES.NOT_FOUND, message:'Vereinbarung nicht gefunden'});
    return this.prisma.gespraechVereinbarung.update({where:{id:vereinbarungId}, data:{status:'erledigt'}});
  }
  private async scopeWhere(user:CurrentUser){
    if(user.roles.includes(Role.azubi) && user.azubiId) return {azubiId:user.azubiId};
    const visible= await this.scope.getVisibleAzubiIds(user);
    if(visible==='ALL') return {};
    return {azubiId:{in:[...visible]}};
  }
}
