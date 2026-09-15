import { Module } from '@nestjs/common';
import { AbwesenheitService } from './absence.service.js';
import { AbwesenheitController } from './absence.controller.js';

@Module({
  controllers: [AbwesenheitController],
  providers: [AbwesenheitService],
  exports: [AbwesenheitService],
})
export class AbwesenheitModule {}
