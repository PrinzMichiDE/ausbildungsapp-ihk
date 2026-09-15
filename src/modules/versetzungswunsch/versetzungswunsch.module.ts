import { Module } from "@nestjs/common";
import { VersetzungswunschService } from "./versetzungswunsch.service.js";
import { VersetzungswunschController } from "./versetzungswunsch.controller.js";
@Module({controllers:[VersetzungswunschController], providers:[VersetzungswunschService]}) export class VersetzungswunschModule {}
