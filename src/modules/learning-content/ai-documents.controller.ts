import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { AiImportService } from './ai-import.service.js';
import { GenerateFromDocDto, UploadAiDocumentDto } from './dto/learning-content.dto.js';

@ApiTags('ai-documents')
@ApiBearerAuth()
@Controller({ path: 'ai-documents', version: '1' })
export class AiDocumentsController {
  constructor(private readonly service: AiImportService) {}

  @ApiOperation({ summary: 'Lädt ein IHK-Dokument (Volltext) hoch' })
  @ApiResponse({ status: 201 })
  @Roles(Role.admin, Role.ausbilder)
  @Post()
  upload(@Body() dto: UploadAiDocumentDto) {
    return this.service.uploadDocument(dto);
  }

  @ApiOperation({ summary: 'Vektorisiert ein Dokument (RAG-Indexierung)' })
  @ApiResponse({ status: 201 })
  @Roles(Role.admin, Role.ausbilder)
  @Post(':id/index')
  index(@Param('id') id: string) {
    return this.service.indexDocument(id);
  }

  @ApiOperation({
    summary:
      'Generiert Rahmenplan/Kurse/Aufgaben aus dem Dokument (Human-in-the-Loop Entwurf)',
  })
  @ApiResponse({ status: 201 })
  @Roles(Role.admin, Role.ausbilder)
  @Post('generate-from-doc')
  generate(@Body() dto: GenerateFromDocDto) {
    return this.service.generateFromDoc(dto);
  }
}
