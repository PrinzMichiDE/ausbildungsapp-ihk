import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { EinsatzplanungController } from './einsatzplanung.controller';
import { EinsatzplanungService } from './einsatzplanung.service';

/**
 * Einsatzplanung Module — Registriert Controller und Service für CRUD-Operationen.
 *
 * Abhängigkeiten:
 * - PrismaModule: Datenbank-Zugriff über Prisma Service
 * - AccessScopeService: RBAC-Datenfilterung (über PrismaModule bereitgestellt)
 */
@Module({
  imports: [PrismaModule],
  controllers: [EinsatzplanungController],
  providers: [EinsatzplanungService],
  exports: [EinsatzplanungService],
})
export class EinsatzplanungModule {}