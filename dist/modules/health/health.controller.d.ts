import type { HealthStatus } from './health.service.js';
import { HealthService } from './health.service.js';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    check(): HealthStatus;
    readiness(): Promise<HealthStatus>;
}
