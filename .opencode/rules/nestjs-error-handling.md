---
name: NestJS Error-Handling
description: Einheitliche Fehlerbehandlung, Exception-Filter und Error-Responses für die NestJS-API. Immer beachten beim Schreiben von Controllern, Services, Exceptions oder Filtern.
globs:
  - "src/**/*.ts"
  - "src/modules/**/exceptions/**"
  - "src/common/constants/**"
  - "main.ts"
---

# Error-Handling-Regeln: NestJS

Diese Regeln gelten für jede Fehlerbehandlung, jeden Exception-Filter und jedes Error-Response in diesem Repository.

## 1. Einheitliches Error-Response-Format

Jede Fehlerantwort der API folgt exakt diesem Schema:

```json
{
  "statusCode": 404,
  "error": "NOT_FOUND",
  "message": "User mit ID 123 nicht gefunden",
  "path": "/users/123",
  "timestamp": "2026-08-29T10:15:00.000Z",
  "correlationId": "a1b2c3d4-..."
}
```

- `error`: stabiler, maschinenlesbarer Code (SCREAMING_SNAKE_CASE), **ändert sich nicht** zwischen Versionen — Frontend darf darauf branchen.
- `message`: menschenlesbar, für Logs/Debug, **kein Vertrag** für das Frontend.
- `correlationId`: für Tracing über Logs hinweg (siehe Logging-Regeln).
- Validation-Fehler zusätzlich mit `details`-Array (Feld + Grund), siehe Abschnitt 5.

## 2. Globaler Exception-Filter

- Genau **ein** globaler `AllExceptionsFilter`, registriert in `main.ts` via `app.useGlobalFilters(...)`.
- Der Filter ist die **einzige Stelle**, die das Response-Format aus Abschnitt 1 erzeugt. Kein Controller baut eigene Error-Responses.
- Unbekannte/nicht abgefangene Fehler (kein `HttpException`) werden als `500 INTERNAL_SERVER_ERROR` ausgegeben, **nie** mit internem Stacktrace oder Fehlermeldung an den Client — nur intern geloggt.

```ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, errorCode, message, details } = this.resolve(exception);

    if (status >= 500) {
      this.logger.error(exception, { correlationId: request.correlationId });
    }

    response.status(status).json({
      statusCode: status,
      error: errorCode,
      message,
      details,
      path: request.url,
      timestamp: new Date().toISOString(),
      correlationId: request.correlationId,
    });
  }
}
```

## 3. Business-Exceptions vs. HTTP-Exceptions

- **HTTP-Exceptions** (`NotFoundException`, `BadRequestException`, ...) nur für generische, nicht-fachliche Fälle (fehlende Route, ungültige ID-Form).
- **Business-Exceptions** für fachliche Fehler: eigene Klasse pro Fehlerfall, die von einer gemeinsamen Basisklasse erbt.

```ts
export abstract class BusinessException extends HttpException {
  abstract readonly errorCode: string;
}

export class OrderAlreadyShippedException extends BusinessException {
  readonly errorCode = 'ORDER_ALREADY_SHIPPED';
  constructor(orderId: string) {
    super(`Bestellung ${orderId} wurde bereits versendet`, HttpStatus.CONFLICT);
  }
}
```

- Business-Exceptions leben in `src/modules/<feature>/exceptions/`.
- Services werfen Business-Exceptions, **nie** generische `Error`-Instanzen.
- Kein `throw new Error('...')` in Controller/Service-Code — immer eine `HttpException`-Ableitung.

## 4. Fehler-Codes

- Zentrales Enum/Konstanten-File `src/common/constants/error-codes.ts` mit allen `errorCode`-Werten — verhindert Duplikate und Tippfehler.
- Codes sind **stabil und versioniert**: einmal veröffentlicht, nicht umbenennen, nur deprecaten und neuen Code ergänzen.
- Namensschema: `<DOMAIN>_<PROBLEM>`, z. B. `ORDER_ALREADY_SHIPPED`, `USER_EMAIL_TAKEN`, `AUTH_TOKEN_EXPIRED`.

## 5. Validation-Fehler

- `ValidationPipe` global aktiv (`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`).
- Validation-Fehler werden im Filter zu `400 VALIDATION_FAILED` mit `details`-Array gemappt:

```json
{
  "statusCode": 400,
  "error": "VALIDATION_FAILED",
  "message": "Validierung fehlgeschlagen",
  "details": [
    { "field": "email", "reason": "muss eine gültige E-Mail-Adresse sein" }
  ]
}
```

## 6. Try/Catch-Disziplin

- Try/Catch nur dort, wo tatsächlich auf einen spezifischen Fehler reagiert wird (z. B. DB-Unique-Constraint → Business-Exception übersetzen).
- Kein Catch-All ohne Weiterwurf oder sinnvolle Behandlung — kein `catch (e) {}`.
- Fehler beim Fangen **anreichern, nicht verschlucken**: Kontext hinzufügen, dann weiterwerfen oder in Business-Exception übersetzen.

```ts
try {
  await this.repo.save(order);
} catch (error) {
  if (isUniqueConstraintError(error, 'orders_reference_unique')) {
    throw new OrderReferenceAlreadyExistsException(order.reference);
  }
  throw error; // unbekannte Fehler weiterreichen, nicht verschlucken
}
```

## 7. Async-Fehler & Nicht-HTTP-Kontexte

- In Queue-Consumern (BullMQ) und Event-Handlern: eigener Fehler-Handling-Wrapper, da der globale HTTP-Filter dort nicht greift. Fehler werden geloggt + retried gemäß Queue-Policy, nicht stillschweigend verschluckt.
- Bei `Promise.all`: bewusst entscheiden, ob ein Fehler alle abbrechen soll oder `Promise.allSettled` mit individueller Fehlerbehandlung nötig ist.

## 8. Logging von Fehlern

- 4xx-Fehler (Client-Fehler): `warn`-Level, kein Stacktrace nötig.
- 5xx-Fehler (Server-Fehler): `error`-Level, mit Stacktrace und `correlationId`.
- Niemals sensible Daten (Passwörter, Tokens, vollständige Request-Bodies mit PII) im Fehler-Log.

## 9. Verbote

- Keine Error-Response-Erzeugung außerhalb des globalen Filters.
- Keine internen Stacktraces oder DB-Fehlermeldungen im Client-Response.
- Keine generischen `Error`-Würfe in Services — immer typisierte Exceptions.
- Kein stilles Fallback auf `null`/`undefined` bei einem Fehler, der eigentlich propagiert werden sollte.
- Keine Wiederverwendung eines `errorCode` für zwei fachlich unterschiedliche Fehler.
