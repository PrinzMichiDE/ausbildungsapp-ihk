import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { CreateZertifikatDto, UpdateZertifikatDto, ZertifikatResponseDto } from './dto/zertifikat.dto.js';
export declare class ZertifikateService {
    private readonly prisma;
    private readonly scope;
    constructor(prisma: PrismaService, scope: AccessScopeService);
    create(currentUser: CurrentUser, dto: CreateZertifikatDto): Promise<ZertifikatResponseDto>;
    findAll(currentUser: CurrentUser): Promise<ZertifikatResponseDto[]>;
    findOne(id: string, currentUser: CurrentUser): Promise<ZertifikatResponseDto>;
    update(id: string, currentUser: CurrentUser, dto: UpdateZertifikatDto): Promise<ZertifikatResponseDto>;
    remove(id: string, currentUser: CurrentUser): Promise<void>;
    private resolveAzubiId;
    private scopeWhere;
    private canManage;
    private toResponse;
}
