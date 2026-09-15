import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AppConfig } from '../../config/configuration.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';

interface JwtPayload {
  id: string;
  email: string;
  roles: Role[];
  abteilungIds: string[];
  azubiId: string | null;
  type: 'access' | 'refresh';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const config = configService.get<AppConfig['jwt']>('jwt') as AppConfig['jwt'];
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret,
    });
  }

  validate(payload: JwtPayload): CurrentUser {
    return {
      id: payload.id,
      email: payload.email,
      roles: payload.roles,
      abteilungIds: payload.abteilungIds,
      azubiId: payload.azubiId,
    };
  }
}
