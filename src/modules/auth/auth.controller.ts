import {
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator.js';
import { AuthService } from './auth.service.js';
import {
  AuthResponseDto,
  LoginDto,
  MfaPendingResponseDto,
  MfaVerifyDto,
  RefreshDto,
} from './dto/auth.dto.js';
import type { Request } from 'express';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Authentifiziert einen Nutzer (ggf. MFA-Schritt)' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @ApiResponse({ status: 200, type: MfaPendingResponseDto, description: 'MFA erforderlich' })
  @ApiResponse({ status: 401, description: 'Ungültige Zugangsdaten' })
  @Post('login')
  login(@Body() dto: LoginDto, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string) ?? req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.login(dto, ip, userAgent);
  }

  @Public()
  @ApiOperation({ summary: 'Schließt die MFA-Verifikation ab' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @Post('verify-mfa')
  verifyMfa(@Body() dto: MfaVerifyDto) {
    return this.authService.verifyMfa(dto);
  }

  @Public()
  @ApiOperation({ summary: 'Erneuert das Access-Token' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto);
  }
}
