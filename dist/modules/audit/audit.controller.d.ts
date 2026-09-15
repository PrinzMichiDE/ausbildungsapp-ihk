import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { AuditService } from './audit.service.js';
import { AuditResponseDto } from './dto/audit.dto.js';
export declare class AuditController {
    private readonly service;
    constructor(service: AuditService);
    findAll(user: CurrentUser): Promise<AuditResponseDto[]>;
    findOne(id: string, user: CurrentUser): Promise<AuditResponseDto>;
    create(user: CurrentUser, body: {
        action: string;
        entity?: string;
        entityId?: string;
        details?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<AuditResponseDto>;
}
