# Produktionsreifegrade — NextGen IT-Ausbildung Backend

Dieses Dokument definiert die Meilensteine auf dem Weg zum produktiven Einsatz. Jede Phase
hat konkrete Akzeptanzkriterien, verantwortliche Artefakte und eine Schätzung des Aufwands.

---

## Übersicht

| Phase | Bezeichnung | Status | Ziel |
|-------|-------------|--------|------|
| 0 | Basis (umgesetzt) | ✅ fertig | 21 Module, RBAC, Auth, Prisma, CI-lokal |
| 1 | Testabdeckung | 🔲 offen | Service-Layer 90 %, Controller 80 %, Guards 100 % |
| 2 | Containerisierung | 🔲 offen | Dockerfile, prod Docker Compose, Healthchecks |
| 3 | CI/CD Pipeline | 🔲 offen | GitHub Actions: Lint → Test → Build → Deploy |
| 4 | E2E & Integration | 🔲 offen | Supertest-Flows, Testcontainer-DB |
| 5 | Sicherheit & Compliance | 🔲 offen | Audit-Logging, Impersonation, Entra ID, DPIA |
| 6 | Notification & Email | 🔲 offen | SMTP-Transport, Outbox-Pattern |
| 7 | KI-Qualitätspipeline | 🔲 offend | Auto-Release, Quality-Gate, Feedback-Loop |
| 8 | Produktions-Infra | 🔲 offen | Traefik, Backup/DR, Monitoring, Logs |

---

## Phase 0 — Basis (umgesetzt)

**Ziel:** Funktionierende API mit allen 21 Modulen, Auth, RBAC, Prisma.

### Abgeschlossen
- [x] 21 Feature-Module mit Controller/Service/DTO
- [x] JWT + TOTP MFA Auth
- [x] RBAC mit 5 Rollen + AccessScopeService
- [x] Prisma Schema (27 Models, 8 Enums, 4 Migrationen)
- [x] Global Guards/Filters/Interceptors
- [x] Swagger unter `/api/docs`
- [x] Rate Limiting (100 req/min)
- [x] Helmet Security Headers
- [x] CORS Whitelist
- [x] Correlation-ID Middleware
- [x] TOTP Unit-Tests (7 Cases)
- [x] Docker Compose (PostgreSQL + Adminer)
- [x] Seed Script (Admin-User + Badges)

---

## Phase 1 — Testabdeckung

**Ziel:** Mindest-Coverage gemäß `nestjs-testing.md` erreichen.

### 1.1 Unit-Tests für Service-Layer

| Modul | Datei | Priority |
|-------|-------|----------|
| Auth | `auth.service.spec.ts` | hoch |
| Users | `users.service.spec.ts` | hoch |
| Reports | `reports.service.spec.ts` | hoch |
| Learning Content | `learning-content.service.spec.ts` | mittel |
| AI | `ai.service.spec.ts`, `rag.service.spec.ts` | mittel |
| Assignments | `assignments.service.spec.ts` | mittel |
| Notifications | `notifications.service.spec.ts` | mittel |
| Data Privacy | `datenschutz.service.spec.ts` | mittel |
| Reporting | `reporting.service.spec.ts` | niedrig |
| Projects | `projects.service.spec.ts` | niedrig |
| Exams | `exams.service.spec.ts` | niedrig |
| Audit | `audit.service.spec.ts` | niedrig |
| Wiki | `wiki.service.spec.ts` | niedrig |
| Grades | `grades.service.spec.ts` | niedrig |
| Gamification | `gamification.service.spec.ts` | niedrig |
| Feedback | `feedback.service.spec.ts` | niedrig |
| Onboarding | `onboarding.service.spec.ts` | niedrig |
| Absence | `absence.service.spec.ts` | niedrig |
| Certificates | `certificates.service.spec.ts` | niedrig |
| Departments | `departments.service.spec.ts` | niedrig |

**Regel:** Jede Public-Method → mindestens 1 Happy-Path + 1 Error-Case.

### 1.2 Unit-Tests für Controller

- [ ] Jeder Controller: Routing-Test (Status-Codes, DTO-Weitergabe, Response-Shape)
- [ ] Business-Logik wird gemockt, nicht mitgetestet

### 1.3 Guards & Interceptors

- [ ] `JwtAuthGuard` → 100 % Coverage
- [ ] `RolesGuard` → 100 % Coverage
- [ ] `TransformInterceptor` → 100 % Coverage
- [ ] `AllExceptionsFilter` → 100 % Coverage

### 1.4 Fixtures

```
src/modules/<feature>/test/fixtures/<feature>.fixture.ts
```

- Factory-Funktionen mit `Partial<T>` Overrides
- Keine Produktionsdaten
- `randomUUID()` für IDs

### 1.5 Akzeptanzkriterien

- [ ] `vitest run --coverage` → Services ≥ 90 %
- [ ] `vitest run --coverage` → Controllers ≥ 80 %
- [ ] `vitest run --coverage` → Guards/Pipes/Interceptors = 100 %
- [ ] Kein `it.skip` ohne Ticket-Referenz
- [ ] Kein `console.log` in Tests

---

## Phase 2 — Containerisierung

**Ziel:** Multi-Stage Dockerfile + produktives Docker Compose mit Traefik.

### 2.1 Dockerfile (Repo-Root)

```dockerfile
# Build-Stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run prisma:generate
RUN npm run build

# Runtime-Stage
FROM node:22-alpine AS runtime
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/main"]
```

### 2.2 Prod Docker Compose

```yaml
services:
  traefik:
    image: traefik:v3.0
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro

  app:
    build: .
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://app:secret@db:5432/nextgen
      - JWT_SECRET=${JWT_SECRET}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`api.example.com`)"
      - "traefik.http.routers.app.tls=true"
    depends_on:
      db:
        condition: service_healthy

  db:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: nextgen
    volumes:
      - nextgen-db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d nextgen"]
      interval: 5s
      timeout: 5s
      retries: 10
```

### 2.3 Healthcheck Endpoint

- [ ] `GET /health` → `{ status: "ok", db: "connected", uptime: ... }`
- [ ] `GET /readiness` → prüft DB-Verbindung
- [ ] In `main.ts` registrieren

### 2.4 Akzeptanzkriterien

- [ ] `docker build -t nextgen-backend .` erfolgreich
- [ ] `docker compose -f docker-compose.prod.yml up` startet sauber
- [ ] Healthcheck antwortet grün
- [ ] Traefik routet auf App-Container
- [ ] Kein Host-Port-Publishing für App/DB (nur über Traefik)
- [ ] `trust proxy` in `main.ts` gesetzt

---

## Phase 3 — CI/CD Pipeline

**Ziel:** Automatisierte Pipeline für jeden Push/PR.

### 3.1 GitHub Actions Workflow

```yaml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
    services:
      postgres:
        image: pgvector/pgvector:pg16
        env:
          POSTGRES_USER: app
          POSTGRES_PASSWORD: test
          POSTGRES_DB: nextgen_test
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://app:test@localhost:5432/nextgen_test
      - run: npm test
      - run: npm run test:e2e

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t nextgen-backend .
```

### 3.2 Security Scanning

- [ ] `npm audit` im CI (bei Advisory → Fail)
- [ ] `oxlint` Lint-Pass
- [ ] Dependabot/Renovate für Dependency-Updates

### 3.3 Akzeptanzkriterien

- [ ] Jeder PR löst Lint → Test → Build aus
- [ ] Merge-Block bei fehlgeschlagenem Test
- [ ] Coverage-Report als PR-Comment (optional)
- [ ] Docker-Build in CI validiert

---

## Phase 4 — E2E & Integration

**Ziel:** Kritische Workflows als E2E-Tests, DB-Integration mit Testcontainer.

### 4.1 E2E-Tests

| Test | Endpoint | Flow |
|------|----------|------|
| Login + MFA | `POST /api/v1/auth/login` | Login → TOTP → Token |
| Bericht-Workflow | `POST /api/v1/berichte` | Create → Submit → Review → Visieren → Archive |
| Projekt-Workflow | `POST /api/v1/projekte` | Create → Submit → Review → Archive |
| KI-Import | `POST /api/v1/ai-documents` | Upload → Process → Courses generated |
| RBAC-Scoping | Verschiedene | Azubi sieht nur eigene Daten |

### 4.2 Testcontainer-DB

- [ ] `@testcontainers/postgresql` für E2E
- [ ] Nach jedem Suite: DB reset (Truncate)
- [ ] `vitest.config.e2e.ts` korrekt konfiguriert

### 4.3 Akzeptanzkriterien

- [ ] `app.e2e-spec.ts` repariert (aktuell broken: testet `GET /`)
- [ ] Mindestens 5 kritische E2E-Flows getestet
- [ ] Testcontainer startet und stoppt sauber
- [ ] `npm run test:e2e` grün

---

## Phase 5 — Sicherheit & Compliance

**Ziel:** ISO 27001 / DSGVO / EU AI Act Fit.

### 5.1 Audit-Logging

- [ ] Login-Fehler → AuditEvent
- [ ] Rollenänderungen → AuditEvent
- [ ] Break-Glass-Zugriffe → AuditEvent
- [ ] KI-Freigaben → AuditEvent
- [ ] Append-only (kein Update/Delete auf AuditEvent)

### 5.2 Impersonation (Read-Only)

- [ ] `ImpersonationGuard` implementieren
- [ ] Nur für `admin`-Rolle
- [ ] Jeder Zugriff wird geloggt
- [ ] Keine Schreiboperationen während Impersonation

### 5.3 Entra ID / OIDC

- [ ] OpenID Connect Strategy für Passport
- [ ] Gruppen → Rollen Mapping
- [ ] Fallback auf lokales JWT wenn OIDC nicht konfiguriert

### 5.4 Secrets Management

- [ ] Keine Secrets im Image/Repo
- [ ] Alle via `ConfigService` / Umgebungsvariablen
- [ ] `JWT_SECRET` zwingend geändert in Prod
- [ ] `.env` in `.gitignore`

### 5.5 Akzeptanzkriterien

- [ ] Alle kritischen Aktionen erzeugen AuditEvent
- [ ] Impersonation nur mit Admin + Audit
- [ ] Entra ID funktioniert (wenn konfiguriert)
- [ ] `npm audit` keine kritischen Advisories

---

## Phase 6 — Notification & Email

**Ziel:** Vollständige Benachrichtigungszentrale mit E-Mail.

### 6.1 SMTP-Transport

- [ ] `nodemailer` als Dependency
- [ ] `EmailService` mit SMTP-Config
- [ ] Template-Engine für E-Mails (z.B. `@nestjs-modules/mailer`)
- [ ] Fallback: Wenn SMTP nicht konfiguriert → nur In-App

### 6.2 Outbox-Pattern

- [ ] E-Mails werden async versendet (Queue)
- [ ] Retry-Logik bei Fehler
- [ ] Dead-Letter-Queue für endgültig fehlgeschlagene

### 6.3 Friday-Reminder

- [ ] Cron sendet E-Mail an Azubis ohne Bericht
- [ ] Parallel: In-App + Teams + E-Mail

### 6.4 Akzeptanzkriterien

- [ ] E-Mail wird zugestellt (Test-Server)
- [ ] Outbox-Pattern funktioniert
- [ ] Friday-Reminder erreicht alle Kanäle

---

## Phase 7 — KI-Qualitätspipeline

**Ziel:** Auto-Release mit Quality-Gate gemäß concept.md §3.2.

### 7.1 Quality-Gate

- [ ] Validierendes LLM-Pass prüft Generierung
- [ ] Score 0–100 (Kohärenz, Ground-Truth-Treue, Vollständigkeit)
- [ ] Config Schwellwert (z.B. 85)

### 7.2 Auto-Release

- [ ] Score ≥ Schwellwert → `freigegeben = true` + AuditEvent
- [ ] Score < Schwellwert → Review-Queue
- [ ] Personenbezogene Inhalte → immer Review-Queue

### 7.3 Feedback-Loop

- [ ] Quiz-Bestehensquoten aggregieren
- [ ] Praxis-Task-Nutzung tracken
- [ ] Kurse mit schwachen Ergebnissen → Überarbeitung vormerken

### 7.4 Akzeptanzkriterien

- [ ] Auto-Release funktioniert für Score ≥ 85
- [ ] Eskalation landet in Review-Queue
- [ ] Feedback-Loop generiert Verbesserungsvorschläge

---

## Phase 8 — Produktions-Infra

**Ziel:** Skalierbar, beobachtbar, recoverable.

### 8.1 Monitoring & Observability

- [ ] Prometheus Metrics (`@nestjs/prometheus`)
- [ ] Grafana Dashboards (API-Latenz, Error-Rate, DB-Connections)
- [ ] Strukturiertes Logging (`pino` oder `winston`)
- [ ] Distributed Tracing (optional, `@opentelemetry/sdk-node`)

### 8.2 Backup & Disaster Recovery

- [ ] PostgreSQL Backup-Skript (pg_dump cron)
- [ ] RPO ≤ 24h, RTO ≤ 4h
- [ ] Restore-Test halbjährlich
- [ ] Dokumentiertes DR-Verfahren

### 8.3 Skalierung

- [ ] Horizontal: App-Container hinter Traefik (Stateless)
- [ ] Session/Token statt In-Memory-State
- [ ] DB: Read-Replica (optional)

### 8.4 Akzeptanzkriterien

- [ ] Prometheus scrape läuft
- [ ] Grafana Dashboard zeigt Metriken
- [ ] Backup/Restore getestet
- [ ] Horizontaler Scale-Out möglich

---

## Prioritätsreihenfolge

```
Phase 1 (Tests)           → 2–3 Wochen
Phase 2 (Docker)          → 3–5 Tage
Phase 3 (CI/CD)           → 2–3 Tage
Phase 4 (E2E)             → 1–2 Wochen
Phase 5 (Security)        → 1–2 Wochen
Phase 6 (Email)           → 3–5 Tage
Phase 7 (KI-Quality)      → 1 Woche
Phase 8 (Infra)           → 2–3 Wochen
─────────────────────────────────────
Gesamt (ohne Overlap):    ~8–12 Wochen
```

---

## Offene Bugs / Technische Schulden

| Issue | Beschreibung | Priorität |
|-------|-------------|-----------|
| `app.e2e-spec.ts` broken | Testet `GET /` which existiert nicht | hoch |
| Double Interceptor | `TransformInterceptor` in `app.module` + `main.ts` registriert | mittel |
| Kein Healthcheck Endpoint | Für Docker/K8s Proben nötig | hoch |
| Kein `trust proxy` | Für Traefik hinter Reverse Proxy | mittel |
| Passwort-Hardcoded-Rounds | `password.ts` Fallback auf 12 | niedrig |

---

## Definition of Done (Produktionsreife)

Ein Modul / die Gesamtapp gilt als produktionsreif wenn:

1. **Tests:** Coverage-Ziele gemäß Phase 1 erreicht
2. **Container:** Dockerfile.build + prod Compose laufen
3. **CI/CD:** Pipeline grün auf jedem PR
4. **Security:** Alle kritischen Pfade auditiert, MFA verfügbar
5. **Health:** `/health` + `/readiness` antworten
6. **Docs:** Swagger aktuell, README mit Quickstart
7. **No Critical Bugs:** Kein `it.skip`, kein broken Test
8. **Monitoring:** Metriken und Logs erreichbar
