import { Module } from "@nestjs/common";
import { UebernahmegespraechService } from "./uebernahme.service.js";
import { UebernahmegespraechController } from "./uebernahme.controller.js";
@Module({controllers:[UebernahmegespraechController], providers:[UebernahmegespraechService]}) export class UebernahmeModule {}
