import { Module } from '@nestjs/common';
import { ProjektService } from './projects.service.js';
import { ProjektController } from './projects.controller.js';

@Module({
  controllers: [ProjektController],
  providers: [ProjektService],
  exports: [ProjektService],
})
export class ProjekteModule {}