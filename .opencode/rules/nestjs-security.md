---
name: NestJS Security
description: Regeln für Authentifizierung, Autorisierung und sicherheitsrelevanten Code der NestJS-API. Immer beachten bei Guards, JWT/Auth, Secrets/Config, CORS, Rate-Limiting, Logging oder Dependency-Sicherheit.
globs:
  - "src/**/*.guard.ts"
  - "src/**/auth/**"
  - "src/**/decorators/**"
  - "src/**/*.strategy.ts"
  - "src/common/**"
  - "main.ts"
  - "env.validation.ts"
  - ".env*"
---

# Security-Regeln: NestJS

Diese Regeln gelten für jede Authentifizierung, Autorisierung und jeden sicherheitsrelevanten Code in diesem Repository.

## 1. Authentifizierung

- JWT-basiert über `@nestjs/passport` + `passport-jwt`, Access-Token kurzlebig (15 Min.), Refresh-Token separat (7 Tage), im httpOnly-Cookie oder sicher gespeichert — **nie** im `localStorage` des Frontends empfehlen.
- Passwort-Hashing ausschließlich mit `bcrypt` (min. 12 Rounds) oder `argon2` — nie eigene Hash-Logik, nie `md5`/`sha1`.
- Kein Passwort, Token oder Secret jemals im Klartext geloggt (siehe Abschnitt 6).

## 2. Autorisierung (RBAC)

- Auth-Prüfung **immer** über Guards, nie mit manuellen `if (user.role !== 'admin')`-Checks verstreut in Services.
- Zwei Guard-Ebenen:
  - `AuthGuard` (`JwtAuthGuard`): prüft, ob überhaupt ein gültiger User eingeloggt ist.
  - `RolesGuard` + `@Roles(...)`-Decorator: prüft feingranulare Berechtigung.

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete(':id')
remove(@Param('id') id: string) { ... }
```

- `JwtAuthGuard` global registriert (`APP_GUARD`), Endpoints sind **standardmäßig geschützt** — öffentliche Routen explizit mit `@Public()`-Decorator markieren. Whitelist-Prinzip, nicht Blacklist.
- Ressourcen-Ownership (User darf nur eigene Daten sehen/ändern) wird im Service geprüft, nicht nur über Rolle — z. B. `if (order.userId !== currentUser.id) throw new ForbiddenException()`.

## 3. Input-Validation & Sanitization

- `ValidationPipe` global mit `whitelist: true, forbidNonWhitelisted: true` (siehe API-Design-Regeln) — jeder unbekannte Body-Parameter wird abgelehnt, nicht stillschweigend ignoriert.
- Keine rohen SQL-/Mongo-Queries mit String-Konkatenation aus User-Input — ausschließlich parametrisierte Queries / ORM-Query-Builder.
- File-Uploads: Whitelist erlaubter MIME-Types und Dateiendungen, Größenlimit serverseitig erzwingen (nicht nur Frontend-seitig prüfen).
- HTML/Rich-Text-Input, das gerendert wird, immer serverseitig sanitizen (z. B. `sanitize-html`) — nie ungefiltert speichern, wenn es später als HTML ausgegeben wird.

## 4. Secrets & Konfiguration

- Secrets (DB-Passwort, JWT-Secret, API-Keys) **ausschließlich** über `ConfigService` aus `.env`, nie hartkodiert im Code.
- `.env` steht in `.gitignore`, `.env.example` enthält nur Platzhalter-Keys ohne echte Werte.
- Env-Validierung beim Start (`env.validation.ts`, siehe Struktur-Regeln) — App startet **nicht**, wenn ein sicherheitskritischer Wert fehlt.
- Keine Secrets in Fehlermeldungen, Swagger-Beispielen oder Kommentaren.

## 5. Transport & Header-Sicherheit

- `helmet()` global aktiviert in `main.ts`.
- CORS explizit konfiguriert mit Origin-Whitelist — **nie** `origin: '*'` in Produktion.
- `app.set('trust proxy', 1)`, wenn hinter Reverse-Proxy/Load-Balancer, damit Rate-Limiting/IP-Logging korrekt funktioniert.
- HTTPS-Erzwingung auf Infrastruktur-Ebene, nicht im App-Code nachbauen.

## 6. Logging & Sensible Daten

- Niemals loggen: Passwörter, Tokens (JWT, Refresh, API-Keys), volle Kreditkartennummern, Session-IDs.
- Request-Logging-Interceptor maskiert bekannte sensible Felder (`password`, `token`, `authorization`) automatisch, bevor geloggt wird.
- Fehlermeldungen an den Client verraten nie interne Implementierungsdetails (siehe Error-Handling-Regeln) — z. B. bei Login-Fehlern immer generisch: "E-Mail oder Passwort falsch", nie "User existiert nicht" (verhindert Account-Enumeration).

## 7. Rate-Limiting

- `@nestjs/throttler` global aktiv mit sinnvollem Default (z. B. 100 Requests/Minute pro IP).
- Sensible Endpoints (Login, Passwort-Reset, Registrierung) bekommen **strengere** eigene Limits via `@Throttle(...)`.
- Rate-Limit-Überschreitung gibt `429` mit Standard-Error-Format zurück (kein Sonderformat).

## 8. Datenschutz (DSGVO-relevant)

- Personenbezogene Daten (PII) klar kennzeichnen (Kommentar oder Naming-Konvention), damit Lösch-/Export-Anfragen (Recht auf Vergessenwerden) technisch umsetzbar sind.
- Soft-Delete nur, wenn fachlich nötig — bei PII-Löschanfragen tatsächliches Löschen/Anonymisieren vorsehen, nicht nur `deletedAt`-Flag setzen.
- Keine PII in Analytics-/Tracking-Events ohne explizite Freigabe.

## 9. Dependency-Sicherheit

- `npm audit` (oder gleichwertig) fester Bestandteil der CI-Pipeline — Build schlägt bei kritischen Vulnerabilities fehl.
- Keine Dependency mit bekannten kritischen CVEs ohne dokumentierten Grund/Mitigation ins Projekt aufnehmen.

## 10. Verbote

- Keine Auth-Logik verstreut in Controllern/Services — ausschließlich über Guards.
- Kein Secret, Token oder Passwort im Code, in Git-History oder in Logs.
- Kein `eval()`, keine dynamische Code-Ausführung mit User-Input.
- Kein `origin: '*'` bei CORS in produktivem Code.
- Keine eigene Krypto-/Hashing-Implementierung — ausschließlich etablierte, geprüfte Libraries.
- Keine detaillierten internen Fehlermeldungen (Stacktrace, DB-Struktur) im Client-Response.
