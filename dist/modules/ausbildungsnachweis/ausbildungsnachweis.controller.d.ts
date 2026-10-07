import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AusbildungsnachweisService } from './ausbildungsnachweis.service.js';
import { CreateAusbildungsnachweisDto, UpdateAusbildungsnachweisDto, AddCommentDto, AddVersionDto } from './dto/ausbildungsnachweis.dto.js';
export declare class AusbildungsnachweisController {
    private readonly service;
    constructor(service: AusbildungsnachweisService);
    findAll(user: CurrentUser): Promise<import("./dto/ausbildungsnachweis.dto.js").AusbildungsnachweisResponseDto[]>;
    create(user: CurrentUser, dto: CreateAusbildungsnachweisDto): Promise<import("./dto/ausbildungsnachweis.dto.js").AusbildungsnachweisResponseDto>;
    findOne(user: CurrentUser, id: string): Promise<import("./dto/ausbildungsnachweis.dto.js").AusbildungsnachweisResponseDto>;
    update(user: CurrentUser, id: string, dto: UpdateAusbildungsnachweisDto): Promise<import("./dto/ausbildungsnachweis.dto.js").AusbildungsnachweisResponseDto>;
    submit(user: CurrentUser, id: string): Promise<import("./dto/ausbildungsnachweis.dto.js").AusbildungsnachweisResponseDto>;
    review(user: CurrentUser, id: string): Promise<import("./dto/ausbildungsnachweis.dto.js").AusbildungsnachweisResponseDto>;
    approve(user: CurrentUser, id: string): Promise<import("./dto/ausbildungsnachweis.dto.js").AusbildungsnachweisResponseDto>;
    archive(user: CurrentUser, id: string): Promise<import("./dto/ausbildungsnachweis.dto.js").AusbildungsnachweisResponseDto>;
    addComment(user: CurrentUser, id: string, dto: AddCommentDto): Promise<{
        success: boolean;
    }>;
    addVersion(user: CurrentUser, id: string, dto: AddVersionDto): Promise<{
        success: boolean;
    }>;
}
