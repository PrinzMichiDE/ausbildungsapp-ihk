var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import configuration from './config/configuration.js';
import { validateEnv } from './config/env.validation.js';
import { DatabaseModule } from './database/prisma.module.js';
import { RbacModule } from './common/rbac/rbac.module.js';
import { AiModule } from './modules/ai/ai.module.js';
import { NotificationsModule } from './shared/notifications/notifications.module.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { HealthModule } from './modules/health/health.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { AbteilungenModule } from './modules/departments/departments.module.js';
import { BerichteModule } from './modules/reports/reports.module.js';
import { LerninhalteModule } from './modules/learning-content/learning-content.module.js';
import { EinsatzModule } from './modules/assignments/assignments.module.js';
import { ZertifikateModule } from './modules/certificates/certificates.module.js';
import { AbwesenheitModule } from './modules/absence/absence.module.js';
import { OnboardingModule } from './modules/onboarding/onboarding.module.js';
import { FeedbackModule } from './modules/feedback/feedback.module.js';
import { WikiModule } from './modules/wiki/wiki.module.js';
import { NotenModule } from './modules/grades/grades.module.js';
import { GamificationModule } from './modules/gamification/gamification.module.js';
import { ProjekteModule } from './modules/projects/projects.module.js';
import { AuditModule } from './modules/audit/audit.module.js';
import { PruefungenModule } from './modules/exams/exams.module.js';
import { RemindersModule } from './modules/reminders/reminders.module.js';
import { UserNotificationsModule } from './modules/notifications/notifications.module.js';
import { DatenschutzModule } from './modules/data-privacy/data-privacy.module.js';
import { ReportingModule } from './modules/reporting/reporting.module.js';
import { DocsModule } from './modules/docs/docs.module.js';
import { FeedbackGespraechModule } from './modules/feedback-gespraech/feedback-gespraech.module.js';
import { SearchModule } from './modules/search/search.module.js';
import { ReportTemplatesModule } from './modules/report-templates/report-templates.module.js';
import { BerufsschuleModule } from './modules/berufsschule/berufsschule.module.js';
import { VersetzungswunschModule } from './modules/versetzungswunsch/versetzungswunsch.module.js';
import { GradeEntriesModule } from './modules/grade-entries/grade-entries.module.js';
import { FoerderbedarfModule } from './modules/foerderbedarf/foerderbedarf.module.js';
import { UebernahmeModule } from './modules/uebernahme/uebernahme.module.js';
import { AlumniModule } from './modules/alumni/alumni.module.js';
import { AusbildungsvertragModule } from './modules/ausbildungsvertrag/ausbildungsvertrag.module.js';
import { AusbildungsnachweisModule } from './modules/ausbildungsnachweis/ausbildungsnachweis.module.js';
import { StandortModule } from './modules/standort/standort.module.js';
import { AzubiAkteModule } from './modules/azubiakte/azubi-akte.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ServeStaticModule.forRoot({
                rootPath: join(process.cwd(), 'frontend', 'dist'),
                exclude: ['/api/(.*)'],
                renderPath: 'index.html',
            }),
            ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration],
                validate: validateEnv,
            }),
            ThrottlerModule.forRoot([
                { ttl: 60_000, limit: 100, name: 'global' },
            ]),
            DatabaseModule,
            RbacModule,
            AiModule,
            NotificationsModule,
            AuthModule,
            UsersModule,
            AbteilungenModule,
            BerichteModule,
            LerninhalteModule,
            EinsatzModule,
            ZertifikateModule,
            AbwesenheitModule,
            OnboardingModule,
            FeedbackModule,
            WikiModule,
            NotenModule,
            GamificationModule,
            RemindersModule,
            ProjekteModule,
            AuditModule,
            PruefungenModule,
            UserNotificationsModule,
            DatenschutzModule,
            ReportingModule,
            HealthModule,
            DocsModule,
            FeedbackGespraechModule,
            SearchModule,
            ReportTemplatesModule,
            BerufsschuleModule,
            VersetzungswunschModule,
            GradeEntriesModule,
            FoerderbedarfModule,
            UebernahmeModule,
            AlumniModule,
            AusbildungsvertragModule,
            AusbildungsnachweisModule,
            StandortModule,
            AzubiAkteModule,
        ],
        providers: [
            { provide: APP_GUARD, useClass: ThrottlerGuard },
            { provide: APP_GUARD, useClass: JwtAuthGuard },
            { provide: APP_GUARD, useClass: RolesGuard },
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map