import { Module } from "@nestjs/common";
import { ReporttemplateService } from "./report-templates.service.js";
import { ReporttemplateController } from "./report-templates.controller.js";
@Module({controllers:[ReporttemplateController], providers:[ReporttemplateService]}) export class ReportTemplatesModule {}
