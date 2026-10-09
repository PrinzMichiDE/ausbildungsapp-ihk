import { Module } from '@nestjs/common';
import { EinsatzplanungController } from './einsatzplanung.controller.js';
import { EinsatzplanungService } from './einsatzplanung.service.js';

/**
 * Einsatzplanung Module — Registriert Controller und Service für CRUD-Operationen.
 *
 * PrismaService wird direkt injiziert (DatabaseModule ist @Global()).
 */
@Module({
  controllers: [EinsatzplanungController],
  providers: [EinsatzplanungService],
  exports: [EinsatzplanungService],
})
export class EinsatzplanungModule {}