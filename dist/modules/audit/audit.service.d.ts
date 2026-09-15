import { PrismaService } from '../../database/prisma.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AuditResponseDto } from './dto/audit.dto.js';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(currentUser: CurrentUser): Promise<AuditResponseDto[]>;
    findOne(id: string, currentUser: CurrentUser): Promise<AuditResponseDto>;
    create(currentUser: CurrentUser, dto: {
        action: string;
        entity?: string;
        entityId?: string;
        details?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<AuditResponseDto>;
    private canManage;
    private toResponse;
}
