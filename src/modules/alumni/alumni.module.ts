import { Module } from "@nestjs/common";
import { AlumniService } from "./alumni.service.js";
import { AlumniController } from "./alumni.controller.js";
@Module({controllers:[AlumniController], providers:[AlumniService]}) export class AlumniModule {}
