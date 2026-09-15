import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
    app.setGlobalPrefix('api', { exclude: ['docs', 'docs/(.*)', 'assets', 'favicon.ico'] });
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    const configService = app.get(ConfigService);
    const corsOrigins = configService.get('cors')?.origin ?? [
        'http://localhost:5173',
    ];
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', 1);
    app.use(helmet());
    app.enableCors({ origin: corsOrigins, credentials: true });
    app.use((req, res, next) => {
        new CorrelationIdMiddleware().use(req, res, next);
    });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));
    const swaggerConfig = new DocumentBuilder()
        .setTitle('NextGen IT-Ausbildung API')
        .setDescription('Backend der Ausbildungsplattform (NestJS, Prisma, KI/RAG)')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
    const port = configService.get('port') ?? 3000;
    await app.listen(port);
    console.log(`API läuft auf http://localhost:${port}/api (Docs: /api/docs, /docs)`);
}
void bootstrap();
//# sourceMappingURL=main.js.map