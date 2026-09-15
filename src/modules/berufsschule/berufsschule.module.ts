import { Module } from "@nestjs/common";
import { BerufsschuleService } from "./berufsschule.service.js";
import { BerufsschuleController } from "./berufsschule.controller.js";
@Module({controllers:[BerufsschuleController], providers:[BerufsschuleService]}) export class BerufsschuleModule {}
