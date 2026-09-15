import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateUserDto, MfaDisableDto, MfaEnableDto, MfaSecretDto, UpdateUserDto, UserResponseDto } from './dto/user.dto.js';
interface UserWithRelations {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    passwordHash: string;
    azubiId: string | null;
    mfaSecret: string | null;
    mfaActive: boolean;
    roles: Array<{
        role: Role;
    }>;
    abteilungen: Array<{
        id: string;
    }>;
}
export declare class UsersService {
    private readonly prisma;
    private readonly scope;
    private readonly audit;
    constructor(prisma: PrismaService, scope: AccessScopeService, audit: AuditService);
    create(dto: CreateUserDto): Promise<UserResponseDto>;
    findByEmail(email: string): Promise<UserWithRelations | null>;
    findById(id: string): Promise<UserResponseDto>;
    findAll(currentUser: CurrentUser): Promise<UserResponseDto[]>;
    update(id: string, dto: UpdateUserDto, currentUser: CurrentUser): Promise<UserResponseDto>;
    remove(id: string, currentUser: CurrentUser): Promise<void>;
    toResponse(user: UserWithRelations): UserResponseDto;
    generateMfaSecret(currentUser: CurrentUser): Promise<MfaSecretDto>;
    enableMfa(currentUser: CurrentUser, dto: MfaEnableDto): Promise<UserResponseDto>;
    disableMfa(currentUser: CurrentUser, dto: MfaDisableDto): Promise<UserResponseDto>;
}
export {};
