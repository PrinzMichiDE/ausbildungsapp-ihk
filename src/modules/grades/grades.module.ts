import { Module } from '@nestjs/common';
import { NotenService } from './grades.service.js';
import { NotenController } from './grades.controller.js';

@Module({
  controllers: [NotenController],
  providers: [NotenService],
  exports: [NotenService],
})
export class NotenModule {}
