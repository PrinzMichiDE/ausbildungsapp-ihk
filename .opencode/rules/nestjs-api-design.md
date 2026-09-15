---
name: NestJS API-Design & DTO
description: Regeln für Controller, Endpoints und DTOs der NestJS-API. Immer beachten beim Anlegen/Ändern von Routen, DTOs, Swagger-Dokumentation oder Pagination.
globs:
  - "src/**/*.controller.ts"
  - "src/**/*.dto.ts"
  - "src/**/*.module.ts"
  - "src/common/**"
  - "main.ts"
---

# API-Design- & DTO-Regeln: NestJS

Diese Regeln gelten für jeden Controller, jeden Endpoint und jedes DTO in diesem Repository.

## 1. Versionierung

- API-Versionierung über URI-Prefix: `/api/v1/...`, aktiviert via `app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })`.
- Breaking Changes → neue Version (`v2`), niemals bestehendes `v1`-Verhalten fachlich ändern.
- Nicht-breaking Erweiterungen (neues optionales Feld) sind **innerhalb** einer Version erlaubt.

## 2. Response-Format

Jede erfolgreiche Antwort folgt demselben Umschlag:

```json
{
  "data": { "id": "123", "name": "Max" },
  "meta": {
    "timestamp": "2026-08-29T10:15:00.000Z"
  }
}
```

Für Listen zusätzlich Pagination-Metadaten in `meta`:

```json
{
  "data": [ { "id": "1" }, { "id": "2" } ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 134,
    "totalPages": 7
  }
}
```

- Ein globaler `TransformInterceptor` erzeugt diesen Umschlag — Controller geben nur die reinen Daten zurück, **nicht** selbst `{ data: ... }` schreiben.
- Fehler-Responses folgen dem separaten Format aus den Error-Handling-Regeln (kein `data`-Feld).

## 3. Pagination-Standard

- Query-Parameter: `page` (1-basiert, Default `1`), `limit` (Default `20`, Max `100`).
- Gemeinsames `PaginationQueryDto` in `src/common/dto/pagination-query.dto.ts`, von jedem Feature wiederverwendet — nicht pro Modul neu erfinden.
- Cursor-Pagination nur für Endpoints mit sehr großen/volatilen Datenmengen (explizit begründen), sonst immer Offset-Pagination wie oben.

```ts
export class PaginationQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit: number = 20;
}
```

## 4. DTO-Konventionen

- Drei DTO-Typen pro Feature, klar getrennt:
  - `create-<feature>.dto.ts` — Input beim Erstellen.
  - `update-<feature>.dto.ts` — Input beim Update, i. d. R. `PartialType(Create<Feature>Dto)`.
  - `<feature>-response.dto.ts` — Output-Shape, falls sich vom Entity unterscheidet (z. B. Passwort-Hash ausblenden).
- Jedes Feld in einem Input-DTO hat **mindestens einen** `class-validator`-Decorator — kein ungetyptes/unvalidiertes Feld.
- Jedes Feld hat einen `@ApiProperty()`-Decorator (Swagger) mit `description` und, wo sinnvoll, `example`.
- Response-DTOs nutzen `@Exclude()`/`@Expose()` (class-transformer) statt manuellem Feld-Mapping, wenn Felder aus dem Entity ausgeblendet werden müssen.

```ts
export class CreateUserDto {
  @ApiProperty({ example: 'max@example.com', description: 'Login-E-Mail' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Max Mustermann' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;
}
```

## 5. Swagger/OpenAPI-Pflicht

Jeder Endpoint hat mindestens:

```ts
@ApiOperation({ summary: 'Erstellt einen neuen User' })
@ApiResponse({ status: 201, type: UserResponseDto })
@ApiResponse({ status: 409, description: 'E-Mail bereits vergeben' })
@Post()
create(@Body() dto: CreateUserDto) { ... }
```

- `@ApiTags('<feature>')` auf jedem Controller.
- `@ApiBearerAuth()` auf jedem geschützten Endpoint.
- Kein Endpoint ohne mindestens Success- und einen relevanten Error-Response dokumentiert.

## 6. Routing-Konventionen

- Ressourcen im Plural: `/users`, `/orders`, nicht `/user`, `/getOrders`.
- Verben nur für echte Aktionen ohne CRUD-Äquivalent: `POST /orders/:id/cancel`, nicht `POST /orders/cancelOrder`.
- Verschachtelung max. eine Ebene: `/orders/:orderId/items`, keine tiefere Verschachtelung — stattdessen Top-Level-Ressource mit Filter-Query.
- HTTP-Methoden korrekt: `GET` (lesen, idempotent), `POST` (erstellen), `PATCH` (Teil-Update), `PUT` (volles Replace, selten genutzt), `DELETE` (löschen).

## 7. Filtering & Sorting

- Einheitliches Schema für Query-Parameter: `?sort=createdAt:desc&status=active`.
- Kein Freitext-SQL/Query-String vom Client — jeder Filter-Parameter wird explizit im DTO definiert und validiert (Whitelist, keine beliebigen Felder).

## 8. Idempotenz & Statuscodes

- `POST` (Create): `201` + erzeugte Ressource in `data`.
- `PATCH`/`PUT`: `200` + aktualisierte Ressource.
- `DELETE`: `204`, kein Body.
- `GET`: `200`, `404` wenn Ressource nicht existiert.
- Konflikte (z. B. Unique-Verletzung): `409`, nie `400` dafür verwenden.

## 9. Verbote

- Kein Entity direkt als Response zurückgeben — immer über Response-DTO/Interceptor gemappt (Gefahr: interne Felder leaken).
- Keine Business-Logik in Query-Parametern, die eigentlich ein eigener Endpoint sein sollte (`?action=cancel` statt `POST /orders/:id/cancel`).
- Kein Mischen von `snake_case` und `camelCase` in Response-Feldern — Standard ist `camelCase` im gesamten JSON.
- Kein Endpoint ohne Swagger-Dokumentation, auch nicht "nur intern genutzt" — dafür `@ApiExcludeEndpoint()` explizit setzen, nicht einfach weglassen.
