---
name: NestJS Swagger/OpenAPI
description: Regeln für die Erstellung und Pflege der Swagger/OpenAPI-Dokumentation. Immer beachten beim Anlegen/Ändern von Endpoints, DTOs oder der API-Dokumentation unter /api/docs.
globs:
  - "src/**/*.controller.ts"
  - "src/**/*.dto.ts"
  - "main.ts"
  - "src/common/**/*.ts"
---

# Swagger/OpenAPI-Regeln: NestJS

Diese Regeln gelten für die Erstellung und Pflege der API-Dokumentation unter `/api/docs`.

## 1. Setup & Konfiguration

### 1.1 Swagger-Registrierung in `main.ts`

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('NextGen IT-Ausbildung API')
  .setDescription('API für die Ausbildungsplattform')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### 1.2 API-Metadaten (Pflicht)

| Feld | Beschreibung |
|---|---|
| `title` | Name der API |
| `description` | Kurze Beschreibung der API |
| `version` | Aktuelle Version |
| `addBearerAuth()` | JWT-Authentifizierung aktivieren |

## 2. Endpoint-Dokumentation (Pflicht)

Jeder Controller und jeder Endpoint muss vollständig dokumentiert sein.

### 2.1 Controller-Dekoratoren

```typescript
@ApiTags('users')
@Controller('api/v1/users')
export class UsersController {
  @Post()
  @ApiOperation({ summary: 'Create a new user', description: 'Creates a user with the provided data' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiBearerAuth()
  create(@Body() dto: CreateUserDto) { ... }
}
```

### 2.2 Pflicht-Dekoratoren pro Endpoint

| Dekorator | Wann | Beispiel |
|---|---|---|
| `@ApiOperation()` | Immer | `{ summary: 'Create user' }` |
| `@ApiResponse()` | Für jeden Statuscode | `{ status: 201, type: UserResponseDto }` |
| `@ApiBearerAuth()` | Auf geschützten Endpoints | - |
| `@ApiTags()` | Pro Controller | `{ tags: ['users'] }` |

### 2.3 Response-Dokumentation

```typescript
// Erfolg
@ApiResponse({ status: 200, type: UserResponseDto })
@ApiResponse({ status: 201, type: UserResponseDto })

// Fehler
@ApiResponse({ status: 400, description: 'Bad Request', type: ErrorResponseDto })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiResponse({ status: 404, description: 'Not Found' })
@ApiResponse({ status: 409, description: 'Conflict' })
```

## 3. DTO-Dokumentation

### 3.1 Input-DTOs

```typescript
export class CreateUserDto {
  @ApiProperty({ example: 'max@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Max Mustermann', minLength: 2, maxLength: 100 })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: '0151-12345678', description: 'Phone number' })
  @IsString()
  @IsOptional()
  phone?: string;
}
```

### 3.2 Response-DTOs

```typescript
export class UserResponseDto {
  @ApiProperty({ example: 'uuid-1234' })
  id: string;

  @ApiProperty({ example: 'max@example.com' })
  email: string;

  @ApiHideResponse() // Ausblenden in Swagger
  internalField: string;
}
```

### 3.3 Enum-Werte

```typescript
export enum UserRole {
  AZUBI = 'azubi',
  AUSBILDER = 'ausbilder',
  HR = 'hr',
  ADMIN = 'admin',
}

export class UpdateUserRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.AZUBI })
  @IsEnum(UserRole)
  role: UserRole;
}
```

## 4. Response-Wrapper

### 4.1 Einzel-Response

```json
{
  "data": { "id": "123", "name": "Max" },
  "meta": { "timestamp": "2026-08-31T10:00:00.000Z" }
}
```

### 4.2 Paginierte Response

```json
{
  "data": [{ "id": "1" }, { "id": "2" }],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 134,
    "totalPages": 7
  }
}
```

### 4.3 Swagger-Typen für Wrapper

```typescript
export class PaginatedResponseDto<T> {
  @ApiProperty({ type: [Object] })
  data: T[];

  @ApiProperty({ example: { page: 1, limit: 20, total: 134, totalPages: 7 })
  meta: PaginationMetaDto;
}
```

## 5. Auth-Dokumentation

### 5.1 JWT-Schema in Swagger

```typescript
// In main.ts
const config = new DocumentBuilder()
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'jwt',
  )
  .build();
```

### 5.2 Login-Endpoint

```typescript
@ApiOperation({ summary: 'Login and get JWT token' })
@ApiResponse({ status: 200, type: LoginResponseDto })
@Post('login')
login(@Body() dto: LoginDto): Promise<LoginResponseDto> { ... }
```

## 6. Wartungspflichten

**Dokumentation muss IMMER aktuell gehalten werden.**

- Jeder neue Endpoint bekommt sofort vollständige Swagger-Dokumentation.
- Geänderte Endpoints werden sofort aktualisiert.
- Veraltete Swagger-Einträge werden nicht gemergt.
- PRs ohne vollständige Swagger-Dokumentation werden nicht akzeptiert.

## 7. Verbote

- Kein Endpoint ohne mindestens Success- und Error-Response-Dokumentation.
- Keine veralteten Swagger-Einträge im Code belassen.
- Keine `@ApiProperty()` ohne `description` oder `example` (wo sinnvoll).
- Keine DTOs mit unvalidierten Feldern in Swagger zeigen.
