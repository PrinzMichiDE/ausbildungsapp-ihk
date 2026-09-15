var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { AiImportService } from './ai-import.service.js';
import { GenerateFromDocDto, UploadAiDocumentDto } from './dto/learning-content.dto.js';
let AiDocumentsController = class AiDocumentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    upload(dto) {
        return this.service.uploadDocument(dto);
    }
    index(id) {
        return this.service.indexDocument(id);
    }
    generate(dto) {
        return this.service.generateFromDoc(dto);
    }
};
__decorate([
    ApiOperation({ summary: 'Lädt ein IHK-Dokument (Volltext) hoch' }),
    ApiResponse({ status: 201 }),
    Roles(Role.admin, Role.ausbilder),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UploadAiDocumentDto]),
    __metadata("design:returntype", void 0)
], AiDocumentsController.prototype, "upload", null);
__decorate([
    ApiOperation({ summary: 'Vektorisiert ein Dokument (RAG-Indexierung)' }),
    ApiResponse({ status: 201 }),
    Roles(Role.admin, Role.ausbilder),
    Post(':id/index'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiDocumentsController.prototype, "index", null);
__decorate([
    ApiOperation({
        summary: 'Generiert Rahmenplan/Kurse/Aufgaben aus dem Dokument (Human-in-the-Loop Entwurf)',
    }),
    ApiResponse({ status: 201 }),
    Roles(Role.admin, Role.ausbilder),
    Post('generate-from-doc'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenerateFromDocDto]),
    __metadata("design:returntype", void 0)
], AiDocumentsController.prototype, "generate", null);
AiDocumentsController = __decorate([
    ApiTags('ai-documents'),
    ApiBearerAuth(),
    Controller({ path: 'ai-documents', version: '1' }),
    __metadata("design:paramtypes", [AiImportService])
], AiDocumentsController);
export { AiDocumentsController };
//# sourceMappingURL=ai-documents.controller.js.map