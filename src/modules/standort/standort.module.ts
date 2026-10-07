import { Module } from '@nestjs/common';
import { StandortController } from './standort.controller.js';
import { StandortService } from './standort.service.js';

@Module({
  controllers: [StandortController],
  providers: [StandortService],
})
export class StandortModule {}