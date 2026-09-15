import { Module } from "@nestjs/common";
import { FoerderbedarfService } from "./foerderbedarf.service.js";
import { FoerderbedarfController } from "./foerderbedarf.controller.js";
@Module({controllers:[FoerderbedarfController], providers:[FoerderbedarfService]}) export class FoerderbedarfModule {}
