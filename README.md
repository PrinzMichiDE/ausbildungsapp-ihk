# NextGen IT-Ausbildung – Backend

NestJS-REST-Backend der Ausbildungsplattform "NextGen IT-Ausbildung". Verwaltet
Berichtsheft, KI-Skill-Matrix/Kurse, Einsatzplanung, Prüfungsvorbereitung,
Onboarding, Feedback, Wiki, Noten, Zertifikate, Gamification und Erinnerungen.

> Fachkonzept: `concept.md`. Verbindliche Agent-Regeln: `.opencode/rules/`.

## Stack

- **Framework:** NestJS 12 (TypeScript, ESM `nodenext`)
- **DB:** PostgreSQL + Prisma (`synchronize: false`, Migrationen nur via `prisma migrate`)
- **Auth:** JWT (Passport `jwt`) + RBAC-Guards (`@Roles`, `@Public`)
- **KI/RAG:** zentral hinter `AiService`/`RagService` (Ollama/OpenAI/OpenRouter)
- **Doku:** Swagger unter `/api/docs`

## Schnellstart

```bash
npm install --legacy-peer-deps          # Peer-Konflikt @nestjs/config → legacy-peer-deps nötig
cp .env.example .env                     # Werte anpassen (DB, JWT_SECRET, KI-Provider)
docker compose up -d db                  # PostgreSQL (pgvector) starten
npx prisma migrate deploy                # Schema anlegen
npx prisma db seed                       # Demo-Daten (Rollen, Abteilungen, Azubi, KI-Docs)
npm run start:dev                        # API auf http://localhost:3000/api
```

Swagger: `http://localhost:3000/api/docs`

## Module & Verantwortlichkeit (Auszug)

| Modul | Pfad | Kern |
|---|---|---|
| auth / users / abteilungen | `src/modules/{auth,users,abteilungen}` | Identität, Rollen, Fachabteilungen |
| berichte | `src/modules/berichte` | Berichtsheft-Statusworkflow + PDF-Export |
| lerninhalte | `src/modules/lerninhalte` | Frameworks, Kurse, Aufgaben, IHK-RAG |
| einsatz, zertifikate, abwesenheit | `src/modules/{einsatz,zertifikate,abwesenheit}` | Planung & Nachweise |
| datenschutz | `src/modules/datenschutz` | Einwilligungen, Auskunft/Löschung, DSFA, Export |
| reporting | `src/modules/reporting` | Dashboards, KPIs, Frühwarnlisten, CSV/PDF |
| notifications | `src/modules/notifications` | Benachrichtigungszentrale (In-App + Teams), Präferenzen |
| onboarding, feedback, wiki, noten, gamification, reminders | `src/modules/*` | erweiterte Features |

**Auth/Security:** JWT + RBAC, MFA (TOTP) mit Enrollment- und Login-Challenge
(`/api/v1/auth/verify-mfa`), Audit-Logging, Read-Only-Impersonation.

## Konventionen

- API-Versionierung: `/api/v1/...` (URI-Prefix)
- Response-Umschlag: `{ data, meta }` (`TransformInterceptor`), rohe Antworten via `@RawResponse()` (z. B. PDF)
- Fehlerformat: `{ statusCode, error, message, path, timestamp, correlationId }` (`AllExceptionsFilter`)
- UUID-Primary-Keys; `snake_case` (DB) ↔ `camelCase` (JSON/TS)
- Endpoints standardmäßig geschützt; RBAC-Matrix in `.opencode/rules/nestjs-rbac.md` (§4)

## Bau & Qualität

```bash
npx nest build        # TypeScript-Build
npx oxlint            # Lint (0 errors)
npx prisma generate   # Client aus Schema
```

## Lizenz

MIT (kommerz-freie Abhängigkeiten, s. `license-compliance`-Regel).
