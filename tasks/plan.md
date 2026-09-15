# Implementation Plan: Dashboard Modul maximal ausbauen

## Overview
Das bestehende `reporting`-Modul (`ReportingService`/`ReportingController` `src/modules/reporting/:32`) liefert bislang nur ein Minimal-Dashboard (3 Rollen, 3 KPIs, CSV-Export attendance/grades/competency, 2 Warntypen). Ziel ist ein maximal ausgebautes, produktionsreifes Dashboard- und Reporting-System gem. Konzept §5.4, §6, Concept2 §13 sowie `progress-analytics.spec.md`: rollenspezifische Dashboards mit Ampel-Logik, erweiterte KPIs (Skill-Gap, Course-Completion, Noten-Trends, Projekt/Pruefung/Foerderbedarf-Pipelines), Kohorten-Vergleiche, konfigurierbare Alert-Schwellen (§7.3), PDF/JSON-Exporte, Custom-Report-Builder und Performance-Härtung — voll RBAC-scoped (`AccessScopeService` `src/common/rbac/access-scope.service.ts:14`), auditierbar und getestet. Ausbau erfolgt schichtweise, jede Task liefert einen vertikalen Slice (DTO → Service → Controller → Test → Swagger).

## Architecture Decisions
- **Kein neues Dashboard-Modul – Erweiterung `reporting`**: `reporting` ist fachlich das Dashboard (Konzept §5.4). Neues Modul würde Duplikation erzeugen. Entscheidung: `reporting` als zentrale Dashboard-Fassade erweitern; optional Unter-Services `reporting/kpis/*.service.ts` für Separation of Concerns.
- **Berechnungs- vs Persistenz-Ansatz**: Kohorten, Trends und Skill-Gap zunächst rein via Aggregation (Prisma `groupBy`/`aggregate`) ohne neue Snapshot-Tabellen — `synchronize: false`, Migrationen nur für tatsächlich benötigte Persistenz (`AlertConfig`). Spart Migrations-Risiko, hält Dashboard stateless; Snapshot-Tabelle nur wenn Performance-Messung es fordert (ADR dokumentiert).
- **AlertConfig Persistenz**: Neue Tabelle `DashboardAlertConfig` ( `userId`, `typ`, `schwelle`, `aktiv` ) für Concept2 §13.2 / Konzept §7.3 — HR/Ausbilder können eigene Schwellen pflegen, Defaults via Seed. Alternative (nur `.env`) verworfen — benutzerindividuelle Konfiguration gefordert.
- **Export-Strategie**: `toCsv` (`src/modules/reporting/dto/reporting.dto.ts:106`) wiederverwenden + ergänzen um `toJson`/`toPdf` (pdfkit, bereits via Projekt/PDF-Infra vorhanden?). PDF zunächst server-generiert, streaming via `@Res()` analog `reporting.controller.ts:77`. Kein Client-PDF.
- **Performance-Prinzip**: N+1 Loops in `reportQuote` (`reporting.service.ts:54`) und `abteilungsZufriedenheit` (`reporting.service.ts:128`) durch `groupBy`/`aggregate` ersetzen; optional 60s In-Memory-Cache (`Map`/`node-cache`) hinter `if (!noCache)` — Monitoring-Phase misst <500ms Ziel.
- **Rückstands-Ampel**: Logik analog `ReportRückstand` (§6.2.2): `entwurf` Alter ≤7d grün, 8-14d gelb, >14d rot; für Ausbildungsbeauftragter scoped.
- **RBAC & Audit by Design**: Jeder neue Endpoint `GET /reporting/dashboard`, `/kpis/*`, `/export/*` mit `@Roles` + `scope.getVisibleAzubiIds()`; `AuditService` loggt `dashboard.view` und `reporting.export` (IP/User-Agent). Keine Admin-Break-Glass Ausnahme.
- **DTO-Design**: Statt `DashboardResult.stats: Record<string,number>` (`reporting.dto.ts:77`) typisierte DTOs je Rolle (`AzubiDashboardDto`, `BeauftragterDashboardDto`, `AusbilderHrDashboardDto`) — ermöglicht Swagger-Typisierung und Frontend-Pinia-Typisierung, backwards-kompatibel via `extends DashboardResult`.

## Task List

### Phase 1: Foundation — Kontrakte, Refactor, Persistenz

- [ ] **Task 1**: DTO-Foundation & Kontrakt-Härtung — typisierte Dashboard-DTOs, erweiterte ExportKind, Zeitraum/Pagination DTOs
- [ ] **Task 2**: ReportingService Refactor — N+1 Fix, Scope-Zentralisierung, gewichtete GPA, Performance-Baseline
- [ ] **Task 3**: Prisma Schema — `DashboardAlertConfig` Modell, Migration, Seed Defaults

**Checkpoint: Foundation**
- [ ] `npm run build` grün, `npx prisma migrate dev` erfolgreich, `npx prisma generate` ohne Drift
- [ ] Neue DTOs kompilieren, Swagger zeigt typisierte Dashboards
- [ ] Bestehende Endpunkte unverändert grün (Regressionstests)

### Phase 2: Core — Rollen-Dashboards maximal (vertikale Slices)

- [ ] **Task 4**: Azubi Dashboard maximal — Ampel-berichte, GPA Zeitreihe, Projekt/Pruefung/Onboarding/Gamification/Abwesenheit/Warnings
- [ ] **Task 5**: Ausbildungsbeauftragter Dashboard maximal — scoped Visa-Ampel, Rotationen 30/90d, scoped Noten/Foerderbedarf/Feedback/Abwesenheit
- [ ] **Task 6**: Ausbilder/HR Gesamt-Dashboard maximal — Status-Verteilungen, Pipelines, Kapazität, Übernahme/Alumni (HR)

**Checkpoint: Core Dashboards**
- [ ] Alle 3 Dashboards liefern RBAC-korrekt, scoped und gem. Konzept §5.4
- [ ] Manueller Check: `GET /api/v1/reporting/dashboard` je Rolle (azubi / beauftragter / ausbilder / hr / admin→leer)
- [ ] Build + 3 neue Integrationstests grün

### Phase 3: Advanced Analytics — Skill-Gap, Completion, Noten-Trends

- [ ] **Task 7**: Skill-Gap & Kompetenzabdeckung V2 — Lernfeld-Soll/Ist, Upskilling-Prioritäten, Zeit-Erfassung via `ReportTimeEntry`
- [ ] **Task 8**: Course-Completion Analytics — Rate Breakdown (azubi/abteilung), Time-to-Completion, Qualitäts-Score Verteilung
- [ ] **Task 9**: Noten-Trend & Verteilung — Halbjahr-GPA Verlauf, Fach-Zeitreihe, Histogramm, Cohort-Vergleichs-Hook
- [ ] **Task 10**: Zeitreihen & Kohorten-Grundlagen — Quartals-Quote, Kompetenz-Trends, Jahrgangs-Aggregation 2023-2026

**Checkpoint: Advanced KPIs**
- [ ] `GET /api/v1/reporting/kpis/skill-gap`, `/kpis/course-completion`, `/kpis/noten-trend` korrekt und <500ms (p95)
- [ ] Keine N+1, `EXPLAIN` zeigt Index-Nutzung (`idx_report_azubi_id`, `idx_grade_azubi_id`, `idx_einsatz_von_bis`)
- [ ] 5 neue Service-Unit-Tests grün

### Phase 4: Warn-Engine, Alert-Config, Kohorten-Vergleich

- [ ] **Task 11**: Frühwarn-Engine V2 — konfigurierbare Schwellen (note≥4 in 2 Fächern, note<3, fehlendeBerichte≥X, Ampel-Kategorien gut/warn/kritisch, severity-sortiert)
- [ ] **Task 12**: Alert-Konfiguration CRUD — `GET/POST/PUT/DELETE /reporting/alert-config`, RBAC, Defaults, Validierung
- [ ] **Task 13**: Kohorten-Vergleich Widget — `GET /kpis/kohorten-vergleich?beruf&jahrFrom&jahrTo` (avgNoten, avgQuote, avgCoverage, avgAbbruch, avgZufriedenheit)

**Checkpoint: Warn & Kohorten**
- [ ] Warnings severity-sortiert, HR sieht alle, Beauftragter nur scoped
- [ ] AlertConfig CRUD RBAC-korrekt (azubi 403), Pflicht-Validierung
- [ ] Kohorten-Vergleich liefert 3 Jahrgänge korrekt

### Phase 5: Export, Custom Builder, Polish & Quality

- [ ] **Task 14**: Export Ausbau — CSV erweitert (alle Felder), JSON, PDF (Gesamt + Einzel-KPI), Streaming, filename `*-YYYY-MM-DD.{csv,json,pdf}`
- [ ] **Task 15**: Custom Report Builder — `POST/GET /reporting/reports/custom` mit metrics+timeframe+visualization Config, Export in csv/json/pdf
- [ ] **Task 16**: Performance & RBAC-Härtung — Cache 60s opt-in, Rate-Limit Export, Audit-Events `dashboard.view`/`reporting.export`
- [ ] **Task 17**: Tests, Swagger & Lint — Service 90% Coverage, Controller 80%, Guards 100%, Swagger Voll-Doku, `npm run lint` + `typecheck` clean
- [ ] **Task 18**: ADR & Frontend-Kontrakt — ADR Kohorten-Entscheidung, OpenAPI Beispiele, Chart-Shapes (bar/pie/line), README Quickstart

**Checkpoint: Complete**
- [ ] Alle Tests `npm run test` grün, `vitest run --coverage` ≥ Schwellen
- [ ] Swagger `/api/docs` vollständig (alle neuen DTOs mit `@ApiProperty`)
- [ ] `npm run build` + `docker build -t nextgen-backend .` grün, Healthcheck ok
- [ ] Manueller E2E: Dashboard je Rolle → KPIs → Warnliste → Export csv/json/pdf → AlertConfig → Kohorten → Custom Report
- [ ] Audit-Log enthält `dashboard.view` und `reporting.export` mit IP/User-Agent
- [ ] Human Review freigegeben

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| `AlertConfig` Migration bricht bestehenden Seed | Hoch | Migration mit `synchronize: false`, `@@index([userId])`, FK `onDelete: Cascade`, Test-Migration lokal + CI `migrate deploy` |
| N+1 Refactor regressiert bestehende Quote/Coverage | Hoch | Vor Refactor Baseline-Tests schreiben (Snapshot Quote/Coverage), `EXPLAIN ANALYZE` in CI optional |
| PDF Export Abhängigkeit fehlt / Bundle-Größe | Mittel | `pdfkit` lightweight evaluieren, Fallback JSON/CSV immer verfügbar, Streaming statt Buffer |
| Aggregationen langsam bei 1M+ Reports | Hoch | Composite-Indexes prüfen (`jahr,kalenderwoche`), `groupBy` statt Loops, optional Cache 60s + `noCache` Query-Param |
| RBAC Leak: AusbilderBeauftragter sieht fremde Azubis | Hoch | `AccessScopeService.getVisibleAzubiIds` zentral, jede Query `azubiId in visible`, negative Tests pro Rolle |
| Kohorten ohne Snapshot unperformant | Mittel | Erst Aggregation messen (`performance.mark`), bei p95>500ms ADR für Snapshot-Tabelle + Migration nachziehen |
| Custom Report Builder Scope-Creep | Mittel | MVP: persist als JSON in DB `SearchIndex` Alternative, kein Scheduler im ersten Slice; Scheduler Phase 6 optional |

## Open Questions
- [ ] PDF: Firmen-Logo/Header-Vorgabe für Export-PDF? Vorerst generisch (Titel, Datum, Tabelle).
- [ ] Cache: 60s In-Memory vs Redis? Start In-Memory (stateless ausreichend hinter single instance), Redis erst bei Horizontal-Scale.
- [ ] Kohorten Jahrgang-Schlüssel: `User.createdAt` vs `Ausbildungsvertrag.startdatum`? Prefer Vertrag `startdatum` wenn vorhanden, Fallback `createdAt`-Jahr.
- [ ] Alert Schwellen Defaults: `noteGleich4InZweiFächern=true`, `fehlendeBerichte≥3`, `noteUnter3InEinem=true`? Final mit HR abstimmen, Defaults als Seed.
- [ ] Echtzeit-Push (§5.4 FR-006): SSE/WebSocket oder Polling? MVP Polling (Frontend 30s), SSE nur wenn `specs/progress-analytics.spec.md FR-006` explizit priorisiert.

## Dependency Graph
```
Prisma Schema (AlertConfig)
    │
    ├── DTOs (typed dashboards, Kpi DTOs, Zeitraum, ExportKind)
    │       │
    │       ├── ReportingService Core (scopeWhere, toCsv, warnings)
    │       │       ├── Azubi-Dashboard (GPA gewichtet, Ampel, Pruefung, Onboarding)
    │       │       ├── Beauftragter-Dashboard (scoped Visa, Rotation, Feedback)
    │       │       └── Ausbilder/HR-Dashboard (Pipeline, Kapazität, Übernahme)
    │       │               │
    │       │               ├── Skill-Gap / Course-Completion / Noten-Trend
    │       │               │       │
    │       │               │       ├── Frühwarn-Engine V2 (nutzt AlertConfig Schwellen)
    │       │               │       │       ├── AlertConfig CRUD
    │       │               │       │       └── Kohorten-Vergleich (aggregiert alle KPIs je Jahrgang)
    │       │               │       │
    │       │               │       └── Export (csv/json/pdf) <- Custom Builder (nutzt alle KPIs)
    │       │               │
    │       │               └── Audit + Cache + RateLimit
    │       │
    │       └── Controller + Swagger + Guards
    │
    └── Tests & Docs (parallelisierbar nach Service-Fertigstellung)
```

## Parallelization Opportunities
- **Parallel nach Phase 1**: Task 4/5/6 (Dashboard je Rolle) nur nach Task 2, aber unabhängig voneinander — 3 Agents parallel nach FOUNDATION.
- **Parallel in Phase 3**: Task 7/8/9/10 teilen Aggregation-Utils, aber unterschiedliche Prisma-Queries — Contract (DTOs) zuerst definieren, dann parallel.
- **Sequenziell verpflichtend**: Task 3 Migration vor 12, Task 11 vor 12, Task14 Export vor 15 Builder.

