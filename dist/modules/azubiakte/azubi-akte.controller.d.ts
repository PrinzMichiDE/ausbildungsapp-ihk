import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AzubiAkteService } from './azubi-akte.service.js';
import { AzubiAkteOverviewDto } from './dto/azubi-akte.dto.js';
export declare class AzubiAkteController {
    private readonly service;
    constructor(service: AzubiAkteService);
    findAll(user: CurrentUser): Promise<import("./dto/azubi-akte.dto.js").AzubiAkteResponseDto[]>;
    findOne(user: CurrentUser, azubiId: string): Promise<import("./dto/azubi-akte.dto.js").AzubiAkteResponseDto>;
    uebersicht(user: CurrentUser, azubiId: string): Promise<import("./dto/azubi-akte.dto.js").AzubiAkteResponseDto>;
    overview(user: CurrentUser): Promise<AzubiAkteOverviewDto>;
}
