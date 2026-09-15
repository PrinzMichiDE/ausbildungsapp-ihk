import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator.js';
import { RawResponse } from '../../common/decorators/raw-response.decorator.js';
import type { HealthStatus } from './health.service.js';
import { HealthService } from './health.service.js';

@ApiTags('Health')
@Controller({ path: 'health', version: '1' })
@RawResponse()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Liveness check — App läuft' })
  @ApiResponse({ status: 200, description: 'App ist erreichbar' })
  check(): HealthStatus {
    return this.healthService.check();
  }

  @Get('readiness')
  @Public()
  @ApiOperation({ summary: 'Readiness check — App + DB sind bereit' })
  @ApiResponse({ status: 200, description: 'App und DB sind verbunden' })
  @ApiResponse({ status: 503, description: 'DB nicht erreichbar' })
  readiness(): Promise<HealthStatus> {
    return this.healthService.readiness();
  }
}
