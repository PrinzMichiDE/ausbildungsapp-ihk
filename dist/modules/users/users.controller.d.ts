import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { UsersService } from './users.service.js';
import { CreateUserDto, MfaDisableDto, MfaEnableDto, MfaSecretDto, UpdateUserDto, UserResponseDto } from './dto/user.dto.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<UserResponseDto>;
    findAll(user: CurrentUser): Promise<UserResponseDto[]>;
    findOne(id: string, user: CurrentUser): Promise<UserResponseDto>;
    update(id: string, dto: UpdateUserDto, user: CurrentUser): Promise<UserResponseDto>;
    remove(id: string, user: CurrentUser): Promise<void>;
    generateMfaSecret(user: CurrentUser): Promise<MfaSecretDto>;
    enableMfa(user: CurrentUser, dto: MfaEnableDto): Promise<UserResponseDto>;
    disableMfa(user: CurrentUser, dto: MfaDisableDto): Promise<UserResponseDto>;
}
