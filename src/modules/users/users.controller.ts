import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { UsersService } from './users.service.js';
import {
  CreateUserDto,
  MfaDisableDto,
  MfaEnableDto,
  MfaSecretDto,
  UpdateUserDto,
  UserResponseDto,
} from './dto/user.dto.js';

@ApiTags('users')
@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Legt einen neuen Nutzer an (Admin)' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'E-Mail bereits vergeben' })
  @Roles(Role.admin)
  @Post()
  create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'Listet alle Nutzer (Admin/HR/Ausbilder)' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  @Roles(Role.admin, Role.hr, Role.ausbilder)
  @Get()
  findAll(@CurrentUser() user: CurrentUser): Promise<UserResponseDto[]> {
    return this.usersService.findAll(user);
  }

  @ApiOperation({ summary: 'Liefert einen Nutzer' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<UserResponseDto> {
    const isSelf = id === user.id;
    const privileged = user.roles.some((r) =>
      ([Role.admin, Role.hr, Role.ausbilder] as Role[]).includes(r),
    );
    if (!isSelf && !privileged) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Kein Zugriff auf diesen Nutzer',
      });
    }
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Aktualisiert Rollen/Abteilungen (Admin/HR)' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @Roles(Role.admin, Role.hr)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: CurrentUser,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, dto, user);
  }

  @ApiOperation({ summary: 'Löscht einen Nutzer (Admin)' })
  @ApiResponse({ status: 204, description: 'Erfolgreich gelöscht' })
  @Roles(Role.admin)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<void> {
    await this.usersService.remove(id, user);
  }

  @ApiOperation({ summary: 'Erzeugt ein MFA/TOTP-Geheimnis (eigener Nutzer)' })
  @ApiResponse({ status: 200, type: MfaSecretDto })
  @Post('me/mfa/secret')
  generateMfaSecret(
    @CurrentUser() user: CurrentUser,
  ): Promise<MfaSecretDto> {
    return this.usersService.generateMfaSecret(user);
  }

  @ApiOperation({ summary: 'Aktiviert MFA (eigener Nutzer)' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @Post('me/mfa/enable')
  enableMfa(
    @CurrentUser() user: CurrentUser,
    @Body() dto: MfaEnableDto,
  ): Promise<UserResponseDto> {
    return this.usersService.enableMfa(user, dto);
  }

  @ApiOperation({ summary: 'Deaktiviert MFA (eigener Nutzer)' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @Post('me/mfa/disable')
  disableMfa(
    @CurrentUser() user: CurrentUser,
    @Body() dto: MfaDisableDto,
  ): Promise<UserResponseDto> {
    return this.usersService.disableMfa(user, dto);
  }
}
