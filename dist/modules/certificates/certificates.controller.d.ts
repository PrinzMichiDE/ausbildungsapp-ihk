import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ZertifikateService } from './certificates.service.js';
import { CreateZertifikatDto, UpdateZertifikatDto, ZertifikatResponseDto } from './dto/zertifikat.dto.js';
export declare class ZertifikateController {
    private readonly service;
    constructor(service: ZertifikateService);
    create(user: CurrentUser, dto: CreateZertifikatDto): Promise<ZertifikatResponseDto>;
    findAll(user: CurrentUser): Promise<ZertifikatResponseDto[]>;
    findOne(id: string, user: CurrentUser): Promise<ZertifikatResponseDto>;
    update(id: string, user: CurrentUser, dto: UpdateZertifikatDto): Promise<ZertifikatResponseDto>;
    remove(id: string, user: CurrentUser): Promise<void>;
}
