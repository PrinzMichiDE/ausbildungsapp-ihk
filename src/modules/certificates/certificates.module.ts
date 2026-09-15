import { Module } from '@nestjs/common';
import { ZertifikateService } from './certificates.service.js';
import { ZertifikateController } from './certificates.controller.js';

@Module({
  controllers: [ZertifikateController],
  providers: [ZertifikateService],
  exports: [ZertifikateService],
})
export class ZertifikateModule {}
