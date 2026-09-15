# Dashboard Modul maximal — Aufgabenliste

> Archiviere Noten-Plan unter `tasks/noten-plan.md` / `tasks/noten-todo.md`. Dieser Plan ist verbindlich für `src/modules/reporting/*` und `prisma/schema.prisma`.

## Phase 1: Foundation — Kontrakte, Refactor, Persistenz

- [ ] **Task 1**: DTO-Foundation & Kontrakt-Härtung — typisierte Dashboard-DTOs, erweiterte ExportKind, Zeitraum/Pagination DTOs
  - **Description**: `DashboardResult` (`reporting.dto.ts:76`) von `Record<string,number>` auf typisierte Rollen-DTOs umstellen (`AzubiDashboardDto`, `BeauftragterDashboardDto`, `AusbilderHrDashboardDto`). Neue KPI-DTOs: `NotenTrendDto`, `NotenVerteilungDto`, `SkillGapDto`, `CourseCompletionDto`, `KohortenDto`, `ZeitreiheDto`, `AmpelStatusDto`. `ReportingExportKind` erweitern um `noten_trend|skill_gap|kohorten`. `ZeitraumQueryDto` (von/bis jahr, halbjahr, fach, abteilungId, beruf, limit/offset) mit `class-validator`. `FruchwarnDto.type` als Enum (`note_fruehwarnung|fehlende_berichte|foerderbedarf|pruefung_frist|onboarding_rueckstand|kapazitaet`) + `severity` (`gut|warnung|kritisch`). Swagger `@ApiProperty` vollständig.
  - **Acceptance criteria**:
    - [ ] `AzubiDashboardDto` enthält: `offeneBerichte{gesamt, ampel{gruen,gelb,rot}}`, `skillCoverage`, `noten{anzahl, schnittGewichtet, halbjahrTrends[]}`, `projekte{pipeline}`, `pruefungen{naechsteFristen[]}`, `onboarding{quote}`, `badges{gesamt, naechstes}`, `anwesenheit{quote30d}`, `foerderbedarfOffen`
    - [ ] `BeauftragterDashboardDto` + `AusbilderHrDashboardDto` analog spezialisiert und mit `warnings: FruchwarnDto[]`
    - [ ] `ReportingExportKind` enum erweitert, `ZeitraumQueryDto` validiert `jahr` 2020-2030
    - [ ] Swagger zeigt neue Schemas, `npm run build` ohne TS-Fehler
  - **Verification**:
    - [ ] Tests pass: `npm run build`
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: `/api/docs` zeigt typisierte Dashboards
  - **Dependencies**: None
  - **Files likely touched**:
    - `src/modules/reporting/dto/reporting.dto.ts`
    - `src/modules/reporting/dto/dashboard.dto.ts` (neu)
    - `src/modules/reporting/dto/kpi.dto.ts` (neu)
    - `src/common/dto/pagination.dto.ts` (optional erweitern)
  - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 2**: ReportingService Refactor — N+1 Fix, Scope-Zentralisierung, gewichtete GPA, Performance-Baseline
  - **Description**: Refactor `reportQuote` (`reporting.service.ts:39`) Loop `count`→ single `groupBy` + `aggregate`; `abteilungsZufriedenheit` (`reporting.service.ts:112`) N+1 `findUnique` je Gruppe → `groupBy` + `include`; `collectWarnings` (`reporting.service.ts:310`) greift alle Azubis → nur `azubiIds in scope`; `azubiDashboard` (`reporting.service.ts:227`) GPA gewichtet statt simpel avg (`Grade.gewichtung`/`gewichtungsKategorie`); `scopedAzubiWhere` (`reporting.service.ts:359`) zentral für alle KPIs; `ISO_WEEKS_PER_YEAR` bleibt 52. Performance Baseline messen: `console.time` → Ziel p95 <500ms für Dashboard. Keine API-Breaking-Changes.
  - **Acceptance criteria**:
    - [ ] `reportQuote` liefert identische Werte wie vorher (Snapshot-Test) aber mit 1 Query statt N
    - [ ] `abteilungsZufriedenheit` mit 1 `groupBy` + 1 `findMany` statt N `findUnique`
    - [ ] GPA gewichtet: `SUM(note*gewichtung)/SUM(gewichtung)`, fallback 1.0, gerundet 2 Dezimal
    - [ ] Keine Regression: bestehende `GET /reporting/dashboard` + `/kpis/*` liefern 200
  - **Verification**:
    - [ ] Tests pass: `npm run test -- src/modules/reporting`
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: `EXPLAIN ANALYZE` zeigt `idx_report_jahr_kw`, `idx_grade_azubi_id` Nutzung
  - **Dependencies**: Task 1
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.ts`
    - `src/modules/reporting/dto/reporting.dto.ts`
  - **Estimated scope**: Small (1-2 files)

- [ ] **Task 3**: Prisma Schema — `DashboardAlertConfig` Modell, Migration, Seed Defaults
  - **Description**: Neues Model `DashboardAlertConfig` in `prisma/schema.prisma` nach `DpiaEntry` (§13.2, §7.3): `id uuid`, `userId String? @map("user_id")` (null=global Default), `typ` Enum (`noten|berichtsheft|kurs|pruefung|foerderbedarf`), `schwelle Json` (`{noteGleich4InZweiFächern?:bool, fehlendeBerichteSchwelle?:int, noteUnter3?:bool, kapazitaetWarn?:int}`), `aktiv Boolean @default(true)`, `createdAt/updatedAt`. `@@index([userId])`, `@@index([typ])`. Migration `npx prisma migrate dev --name dashboard_alert_config`. Seed defaults: global `noten: {noteGleich4InZweiFächern:true, fehlendeBerichteSchwelle:3}`. Relation `user User? @relation(fields:[userId], references:[id], onDelete:Cascade)`.
  - **Acceptance criteria**:
    - [ ] `DashboardAlertConfig` im Schema, `prisma migrate dev` erfolgreich, `prisma generate` ohne Drift
    - [ ] `npx prisma migrate deploy` in CI trockenlauf erfolgreich (`synchronize: false`)
    - [ ] Seed legt 2 Default-Configs an (noten, berichtsheft), `SELECT * FROM dashboard_alert_configs` zeigt sie
  - **Verification**:
    - [ ] Tests pass: `npm run build`
    - [ ] Build succeeds: `npx prisma migrate dev --name test && npx prisma generate`
    - [ ] Manual check: `psql \d dashboard_alert_configs` zeigt Constraints
  - **Dependencies**: None
  - **Files likely touched**:
    - `prisma/schema.prisma`
    - `prisma/migrations/*`
    - `prisma/seed.ts`
  - **Estimated scope**: Small (2-3 files)

**Checkpoint: Foundation**
- [ ] `npm run build` grün, `npx prisma migrate dev` erfolgreich, keine Drift
- [ ] DTOs typisiert, Swagger rendert neue Schemas
- [ ] ReportingService N+1 gefixt, gewichtete GPA verifiziert (Unit-Test `gewichtung 2.0 vs 1.0`)

## Phase 2: Core — Rollen-Dashboards maximal (vertikale Slices)

- [ ] **Task 4**: Azubi Dashboard maximal — Ampel, GPA Zeitreihe, Projekt/Pruefung/Onboarding/Gamification/Abwesenheit/Warnings
  - **Description**: Erweitere `azubiDashboard` (`reporting.service.ts:227`): `offeneBerichte` split `entwurf` Alter Ampel (grün ≤7d, gelb 8-14d, rot >14d via `Report.createdAt`/`datumVon`); `skills: {freigegeben, used, coverage%}` via `ReportTask` zählen; `noten: {anzahl, schnittGewichtet, trends[{halbjahr,fach,schnitt}], verteilung}` via `Grade` weighted; `projekte: {entwurf, eingereicht, freigegeben, abgelehnt}` via `Projekt`; `pruefungen: [{typ,status,ihkTermin, faelligInTagen}]` via `Pruefung`+`PruefungsMeilenstein`; `onboarding: {checklistenGesamt, erledigt, quote}` via `Checklist`+`ChecklistItem`; `badges: {gesamt, earnedAt[]}` via `UserBadge`; `anwesenheit: {quote30d, fehlTage}` via `Abwesenheit`; `foerderbedarfOffen` via `Foerderbedarf`. RBAC: nur `azubiId==currentUser.azubiId`.
  - **Acceptance criteria**:
    - [ ] `GET /api/v1/reporting/dashboard` als `azubi` liefert alle Felder, keine Lecks (versuche fremde `azubiId` → nur eigene)
    - [ ] Ampel korrekt: 1 Report 5d=grün, 1 Report 10d=gelb, 1 Report 20d=rot (Test mit festen Daten)
    - [ ] GPA gewichtet korrekt: Noten 1.0*2.0 + 4.0*1.0 /3 = 2.0
  - **Verification**:
    - [ ] Tests pass: `npm run test -- reporting.service.spec.ts` (Azubi Cases)
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: `curl -H "Authorization: Bearer <azubi>" /api/v1/reporting/dashboard | jq .stats`
  - **Dependencies**: Task 1, Task 2
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.ts`
    - `src/modules/reporting/reporting.controller.ts`
    - `src/modules/reporting/dto/dashboard.dto.ts`
  - **Estimated scope**: Medium (3 files)

- [ ] **Task 5**: Ausbildungsbeauftragter Dashboard maximal — scoped Visa-Ampel, Rotationen 30/90d, Noten/Foerderbedarf/Feedback/Abwesenheit
  - **Description**: Erweitere `ausbildungsbeauftragterDashboard` (`reporting.service.ts:250`): `openVisa: {gesamt, ampel, aeltestesInTagen}` via `Report status=eingereicht` scoped `abteilungIds`; `kommendeRotationen: {next30d, next90d, liste[{azubiId, name, abteilung, von}]}` via `Einsatz von>=now`; `skillCoverageScoped` via `Task`+`ReportTask` nur `visibleAzubiIds`; `notenGruppe: {schnittGewichtet, verteilung, warnCount}` via `Grade`; `foerderbedarfOffen` scoped; `feedbackAbteilung: {avgFachkompetenz, avgSoftskills, count}` via `Feedback` gefiltert `abteilungId in user.abteilungIds`; `abwesenheitenAbteilung: {count30d}` via `Abwesenheit`. Nutzt `scope.getVisibleAzubiIds` (`access-scope.service.ts:14`).
  - **Acceptance criteria**:
    - [ ] `GET /dashboard` als `ausbildungsbeauftragter` mit 0 vs 2 abteilungIds liefert korrekt 0 bzw N Azubis
    - [ ] `openVisa` gefiltert: Report eines fremden Azubi (außerhalb Einsatz) erscheint nicht
    - [ ] Rotationen 30d/90d korrekt gruppiert, sortiert nach `von` asc
  - **Verification**:
    - [ ] Tests pass: `npm run test -- reporting`
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: Beauftragter A sieht nur Abteilung A Azubis, Beauftragter B sieht nicht A
  - **Dependencies**: Task 2, Task 4
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.ts`
    - `src/modules/reporting/dto/dashboard.dto.ts`
  - **Estimated scope**: Medium (2-3 files)

- [ ] **Task 6**: Ausbilder/HR Gesamt-Dashboard maximal — Status-Verteilungen, Pipelines, Kapazität, Übernahme/Alumni (HR)
  - **Description**: Erweitere `ausbilderHrDashboard` (`reporting.service.ts:273`): `azubiGesamt` bleibt, `berichtVerteilung: {entwurf, eingereicht, visiert, archiviert}` via `groupBy status`; `projektPipeline: {entwurf,eingereicht,freigegeben,abgelehnt}`; `pruefungPipeline: {angemeldet,teilgenommen,bestanden,wiederholung}`; `foerderbedarf: {offen,erledigt, nachverfolgungFaellig}`; `onboardingQuote: erledigt/gesamt`; `gamificationCoverage: {badgesAvg, topBadge}`; `abwesenheitRate: {rate30d,rate90d}`; `kapazitaetWarnung: [{abteilungId,name, planAusbilder, istAzubis, status OK/WARNUNG/KRITISCH}]` via `Einsatz` count vs `Abteilung.verantwortliche` count; für `hr` zusätzlich `uebernahmePipeline: {geplant,geblockt,abgeschlossen,widerrufen}` + `alumniQuote: {ausgetreten30d, loeschungFaellig}`. `role: 'ausbilder'|'hr'` im Result unterscheiden.
  - **Acceptance criteria**:
    - [ ] `GET /dashboard` als `ausbilder` vs `hr` unterscheidet `uebernahmePipeline` (nur hr)
    - [ ] Kapazitätswarnung: Abteilung mit 5 Soll vs 2 Ist → KRITISCH, korrekt berechnet
    - [ ] Alle Pipelines scoped korrekt (hr=ALL, ausbilder=ALL, admin=[])
  - **Verification**:
    - [ ] Tests pass: `npm run test`
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: HR Dashboard enthält `uebernahmeGespraeche` Counts, Ausbilder nicht
  - **Dependencies**: Task 2
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.ts`
    - `src/modules/reporting/reporting.controller.ts`
  - **Estimated scope**: Medium (2-3 files)

**Checkpoint: Core Dashboards**
- [ ] Alle 3 Dashboards RBAC-korrekt (Azubi 403 auf fremd, Beauftragter scoped, Admin leer)
- [ ] Manueller Rollen-Switch-Test `GET /dashboard` je Rolle grün
- [ ] Integrationstests `reporting.e2e-spec.ts` neu für 3 Rollen

## Phase 3: Advanced Analytics — Skill-Gap, Completion, Noten-Trends

- [ ] **Task 7**: Skill-Gap & Kompetenzabdeckung V2 — Lernfeld-Soll/Ist, Upskilling-Prioritäten, Zeit-Erfassung
  - **Description**: Erweitere `skillCoverage` (`reporting.service.ts:77`): pro `Framework.lernfeld` aggregieren: `soll` = `Task.count` pro `frameworkId`, `ist` = distinct `ReportTask.taskId` where `report.azubiId in visible`, `deckungProzent`, zusätzlich `istStunden` via `ReportTimeEntry.stunden` summiert; `gapAnalysis: [{lernfeld, frameworkTitel, fehlendeTasks[], priorität hoch wenn deckung<30%, mittel 30-70%, niedrig >70%}]`. DTO `SkillGapDto` + `KompetenzDeckungDto`. Endpoint `GET /kpis/skill-gap?abteilungId=&jahr=&fach=` mit Zeitraum-Filter.
  - **Acceptance criteria**:
    - [ ] `GET /kpis/skill-gap` liefert pro Lernfeld `tasksTotal, reportsUsing, coverage, lernfeld, fehlendeTasks`, sortiert coverage asc
    - [ ] `istStunden` korrekt summiert via `ReportTimeEntry`, 0 wenn keine TimeEntries
    - [ ] Priorität korrekt: <30% hoch, 30-70% mittel
  - **Verification**:
    - [ ] Tests pass: `npm run test -- skill-gap`
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: Coverage für Course X: 5 Tasks, 2 used → 40% mittel
  - **Dependencies**: Task 2
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.ts`
    - `src/modules/reporting/dto/kpi.dto.ts`
    - `src/modules/reporting/reporting.controller.ts`
  - **Estimated scope**: Medium (3 files)

- [ ] **Task 8**: Course-Completion Analytics — Rate Breakdown, Time-to-Completion, Qualitäts-Score Verteilung
  - **Description**: Neuer KPI `GET /kpis/course-completion/:courseId?` + `GET /kpis/course-completion` alle: `completionRate: {azubi,bteilung,gesamt}` via `ReportTask`distinct `azubiId` / visible ; `timeToCompletion: {avgTage, medianTage}` via `ReportTimeEntry` + `Report.datumVon->archiviertAm`; `qualitaetsScoreVerteilung: {avg, histogram[0-50,51-70,71-85,86-100]}` via `Course.qualitaetsScore`; `tasks: [{titel, usedCount}]`. Role-scoped.
  - **Acceptance criteria**:
    - [ ] `GET /kpis/course-completion` liefert für jeden `freigegeben=true` Course Rates 0-1
    - [ ] `qualitaetsScoreVerteilung` korrekt 4 Buckets
    - [ ] Scoped: Beauftragter sieht nur eigene Azubis, Ausbilder alle
  - **Verification**:
    - [ ] Tests pass: `npm run test`
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: Course Y freigegeben, 10 Tasks, 5 Azubis used → rate 0.5
  - **Dependencies**: Task 7
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.ts`
    - `src/modules/reporting/dto/kpi.dto.ts`
  - **Estimated scope**: Small (2 files)

- [ ] **Task 9**: Noten-Trend & Verteilung — Halbjahr-GPA Verlauf, Fach-Zeitreihe, Histogramm
  - **Description**: Neue Endpoints `GET /kpis/noten-trend?azubiId=&fach=&halbjahr=` und `GET /kpis/noten-verteilung`: `trend: [{halbjahr, fach, zeitraum, avgGewichtet, count}]` via `Grade groupBy halbjahr,fach`; `verlauf: [{datum, note, fach}]` sortiert `datum asc`; `verteilung: {histogram: {1.x:count,2.x,...}}`; weighted avg `SUM(note*gewichtung)/SUM(gewichtung)`. Filter `azubiId` nur wenn scope erlaubt (`assertCanAccessAzubi`). Fallback gewichtung 1.0.
  - **Acceptance criteria**:
    - [ ] `GET /kpis/noten-trend?azubiId=X` liefert Halbjahr-Trends gewichtet, 2 Dezimal gerundet
    - [ ] `GET /kpis/noten-verteilung` Histogramm 6 Buckets (1-6), Summe = noten Anzahl
    - [ ] Unauthorized `azubiId` fremd → 403
  - **Verification**:
    - [ ] Tests pass: `npm run test`
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: Noten 1.3,2.7,4.2 → Buckets 1,2,4 korrekt
  - **Dependencies**: Task 2
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.ts`
    - `src/modules/reporting/reporting.controller.ts`
  - **Estimated scope**: Small (2 files)

- [ ] **Task 10**: Zeitreihen & Kohorten-Grundlagen — Quartals-Quote, Kompetenz-Trends
  - **Description**: `GET /kpis/zeitreihe?granularitaet=monat|quartal|jahr&von=&bis=` liefert `[{periode, reportQuoteAvg, kompetenzCoverageAvg, notenSchnitt}]` aggregiert via `Report.jahr+kalenderwoche`, `Grade.datum`, `Course.coverage` snapshots. `GET /kpis/kohorten-basis?jahrFrom=2023&jahrTo=2026` Vorstufe zu Task13: gruppiert `User` nach `Ausbildungsvertrag.startdatum` Jahr oder `createdAt` Jahr + `Ausbildungsberuf`, liefert `azubiCount, avgNotenSchnitt, avgReportQuote`. Kein Persist, reine Aggregation.
  - **Acceptance criteria**:
    - [ ] `GET /kpis/zeitreihe?granularitaet=quartal` 4 Perioden pro Jahr, korrekt Quote
    - [ ] `GET /kpis/kohorten-basis` liefert 3 Jahrgänge 2023-2025 korrekt
    - [ ] `granularitaet` enum validiert, falscher Wert 400
  - **Verification**:
    - [ ] Tests pass: `npm run test`
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: `curl .../zeitreihe?granularitaet=jahr` → 2024,2025 je Objekt
  - **Dependencies**: Task 9
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.ts`
    - `src/modules/reporting/dto/kpi.dto.ts`
  - **Estimated scope**: Medium (2-3 files)

**Checkpoint: Advanced KPIs**
- [ ] `GET /kpis/skill-gap`, `/kpis/course-completion`, `/kpis/noten-trend`, `/kpis/zeitreihe` alle <500ms p95
- [ ] 5 neue Service-Unit-Tests + 2 Controller Tests grün
- [ ] Swagger KPI-Section vollständig

## Phase 4: Warn-Engine, Alert-Config, Kohorten-Vergleich

- [ ] **Task 11**: Frühwarn-Engine V2 — konfigurierbare Schwellen, Ampel-Kategorien gut/warn/kritisch, severity-sortiert
  - **Description**: Refactor `collectWarnings` (`reporting.service.ts:310`): lade `DashboardAlertConfig` (global + user-spezifisch, user überschreibt global). Schwellen: `noteGleich4InZweiFächern` (≥2 Fächer note≥4.0), `noteUnter3InEinem` (note≥5.0), `fehlendeBerichteSchwelle` (default 3), `fehlendeAufgaben` (optional), `kapazitaetWarn` (aus Task6). Kategorien: `gut <3.0`, `warnung 3.0-3.9`, `kritisch ≥4.0`. Ausgabe `FruchwarnDto` + `severity` + `fach` + `wertung`. Sortiert `kritisch first`. Bezieht `Foerderbedarf` offen ein (wenn bereits Foerderbedarf existiert → `warnung` statt `kritisch`). Endpoint bleibt intern für Dashboard, zusätzlich `GET /kpis/warnliste?kategorie=&fach=&severity=`.
  - **Acceptance criteria**:
    - [ ] Warnliste Kategorien: 2 Fächer ≥4.0 → 1 Warnung `kritisch`, 1 Fach 5.0 → `kritisch`, fehlendeBerichte 4 ≥ Schwelle 3 → `warnung`
    - [ ] Severity sortiert: kritische erste
    - [ ] `GET /kpis/warnliste?severity=kritisch` filtert korrekt
  - **Verification**:
    - [ ] Tests pass: `npm run test -- warnliste`
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: 3 Azubis, sortierte Ausgabe prüft Doku
  - **Dependencies**: Task 3, Task 2
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.ts`
    - `src/modules/reporting/dto/reporting.dto.ts`
  - **Estimated scope**: Medium (2 files)

- [ ] **Task 12**: Alert-Konfiguration CRUD — GET/POST/PUT/DELETE /reporting/alert-config
  - **Description**: Controller `GET /reporting/alert-config`, `POST /reporting/alert-config`, `PUT /reporting/alert-config/:id`, `DELETE /alert-config/:id`; DTO `CreateAlertConfigDto {typ: enum, schwelle: Json, aktiv: boolean}` mit `class-validator` (`IsEnum`, `IsBoolean`, `IsObject`). Service lädt `DashboardAlertConfig` via Prisma, `POST` nur für `ausbilder/hr/admin`, `GET` für alle authentifizierten (sehen eigene + globale), `PUT/DELETE` nur owner oder `ausbilder` für globale. Audit-Event `alert_config.create|update|delete`.
  - **Acceptance criteria**:
    - [ ] `POST /alert-config` als `azubi` → 403, als `ausbilder` → 201
    - [ ] `GET /alert-config` als `ausbildungsbeauftragter` sieht globale + eigene
    - [ ] `PUT /alert-config/:id` validiert `schwelle` JSON (z.B. `fehlendeBerichteSchwelle` 1-52)
  - **Verification**:
    - [ ] Tests pass: `npm run test -- alert-config`
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: `curl POST .../alert-config -d '{"typ":"noten","schwelle":{"noteGleich4InZweiFächern":true}}'`
  - **Dependencies**: Task 3, Task 11
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.ts`
    - `src/modules/reporting/reporting.controller.ts`
    - `src/modules/reporting/dto/alert-config.dto.ts` (neu)
    - `prisma/schema.prisma`
  - **Estimated scope**: Medium (3-4 files)

- [ ] **Task 13**: Kohorten-Vergleich Widget — GET /kpis/kohorten-vergleich?beruf&jahrFrom&jahrTo
  - **Description**: `GET /kpis/kohorten-vergleich?beruf=systemintegration&jahrFrom=2023&jahrTo=2026&abteilungId=` aggregiert je Kohorte (Jahr = `Ausbildungsvertrag.startdatum` Jahr else `User.createdAt` Jahr): `azubiCount`, `avgNotenSchnittGewichtet`, `avgReportQuote`, `avgKompetenzCoverage`, `avgAbbruchquote` (via `Alumni` + `User.isActive=false`), `avgZufriedenheit` (via `Feedback` avg), `trend` (Vergleich Vorjahr +/-%). `beruf` Filter optional. RBAC: `ausbilder/hr` alle, `ausbildungsbeauftragter` nur eigene Abteilung Kohorten (gefiltert via Einsatz), `azubi` 403. DTO `KohortenVergleichDto`.
  - **Acceptance criteria**:
    - [ ] `GET /kpis/kohorten-vergleich?jahrFrom=2023&jahrTo=2025` liefert 3 Kohorten je mit `azubiCount>0` und Trends
    - [ ] `beruf=systemintegration` filtert korrekt
    - [ ] Beauftragter sieht nur eigene Abteilung Jahrgänge (Test 2 Abteilungen)
  - **Verification**:
    - [ ] Tests pass: `npm run test`
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: 2023 vs 2024 `trendNotenSchnitt` +0.2 korrekt
  - **Dependencies**: Task 10
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.ts`
    - `src/modules/reporting/dto/kpi.dto.ts`
    - `src/modules/reporting/reporting.controller.ts`
  - **Estimated scope**: Medium (3 files)

**Checkpoint: Warn & Kohorten**
- [ ] Warnings severity sortiert, Filter `?severity=kritisch` korrekt
- [ ] AlertConfig CRUD RBAC 403 für azubi, Audit-Event vorhanden
- [ ] Kohorten 3 Jahrgänge korrekt, Trends berechnet

## Phase 5: Export, Custom Builder, Polish & Quality

- [ ] **Task 14**: Export Ausbau — CSV erweitert, JSON, PDF, Streaming
  - **Description**: Erweitere `exportCsv` (`reporting.service.ts:149`) switch `attendance|grades|competency` um `noten_trend|skill_gap|kohorten|warnliste` + ` grades` Felder erweitern (halbjahr, typ, gewichtung, status, datum). Neuer `exportJson` und `exportPdf` via `pdfkit`: `GET /reporting/export/:kind?format=csv|json|pdf&jahr=&von=&bis=` (Query `format` default csv). `filename` `noten-2026-05-17.{csv,json,pdf}`. `@RawResponse` streaming, `Content-Disposition attachment`. Für `pdf` Tabelle via `pdfkit` oder `PDFDocument`. Large dataset: cursor pagination `take 500`.
  - **Acceptance criteria**:
    - [ ] `GET /reporting/export/grades?format=csv` liefert erweiterte Spalten (halbjahr, gewichtung)
    - [ ] `GET /reporting/export/grades?format=json` liefert JSON Array, `Content-Type application/json`
    - [ ] `GET /reporting/export/grades?format=pdf` liefert PDF magic `%PDF`, `Content-Type application/pdf`
    - [ ] Scope: Beauftragter exportiert nur eigene Azubis (Test)
  - **Verification**:
    - [ ] Tests pass: `npm run test`
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: `curl .../export/grades?format=pdf -o /tmp/x.pdf && file /tmp/x.pdf` → PDF
  - **Dependencies**: Task 9, Task 13
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.ts`
    - `src/modules/reporting/reporting.controller.ts`
    - `src/modules/reporting/dto/reporting.dto.ts`
  - **Estimated scope**: Medium (2-3 files)

- [ ] **Task 15**: Custom Report Builder — POST/GET /reporting/reports/custom
  - **Description**: CRUD für `CustomReportConfig` (MVP ohne neue Tabelle: persist in `SearchIndex` mit `entityType='custom_report'` oder inmemory Map Phase1): `POST /reporting/reports/custom {name, metrics:[reportQuote,skillGap,notenTrend], timeframe:{von,bis}, visualizations:[bar,line], filters:{abteilungId,beruf}}` → `id uuid`, `GET /reporting/reports/custom` liste, `GET /reporting/reports/custom/:id` detail, `GET /reporting/reports/custom/:id/export?format=csv|json|pdf` generiert on-the-fly via Task14 Exporter. RBAC: `ausbilder/hr` create, `beauftragter` nur eigene Abteilung reports, `azubi` 403. Optional `POST /reports/custom/:id/schedule {cron}` -> Verweis auf `RemindersModule` (nicht BLOCK).
  - **Acceptance criteria**:
    - [ ] `POST /reports/custom` als `ausbilder` → 201 mit id, `GET /reports/custom` listet eigenen
    - [ ] `GET /reports/custom/:id/export?format=json` liefert gem. metrics korrekt
    - [ ] `POST` als `azubi` → 403
  - **Verification**:
    - [ ] Tests pass: `npm run test`
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: Custom report 3 metrics → JSON 3 keys
  - **Dependencies**: Task 14
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.ts`
    - `src/modules/reporting/reporting.controller.ts`
    - `src/modules/reporting/dto/custom-report.dto.ts` (neu)
  - **Estimated scope**: Medium (3-4 files)

- [ ] **Task 16**: Performance & RBAC-Härtung — Cache 60s opt-in, Rate-Limit Export, Audit-Events
  - **Description**: In-Memory Cache `Map<string,{data,expiresAt}>` 60s für `getDashboard`, `reportQuote`, `skillCoverage`, `kohorten` mit `?noCache=true` bypass. Export Rate-Limit via `ThrottlerGuard` (`limit 10/min` speziell für `/export`). Audit: `AuditService.create` für `dashboard.view` (je `getDashboard` call) und `reporting.export` (je export) mit `userId, entity='reporting', details=JSON.stringify({kind,format})`, IP/User-Agent via `@Req()`. Index-Review: `@@index([azubiId, createdAt])` falls fehlt. `scope.assertCanAccessAzubi` für alle `azubiId`-Filter.
  - **Acceptance criteria**:
    - [ ] 2 schnelle `GET /dashboard` hintereinander <50ms zweites (cached), `?noCache=true` bypass
    - [ ] 11. Export in 60s → 429 `ThrottlerException`
    - [ ] AuditEvent Tabelle enthält 2 Events nach Dashboard+Export
  - **Verification**:
    - [ ] Tests pass: `npm run test`
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: `SELECT * FROM audit_events WHERE action='dashboard.view' ORDER BY created_at DESC LIMIT 1`
  - **Dependencies**: Task 6, Task 14
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.ts`
    - `src/modules/reporting/reporting.controller.ts`
    - `src/modules/audit/audit.service.ts` (inject)
  - **Estimated scope**: Medium (2-3 files)

- [ ] **Task 17**: Tests, Swagger & Lint — Service 90%, Controller 80%, Guards 100%
  - **Description**: Unit-Tests `reporting.service.spec.ts` für alle neuen KPIs (skillGap, courseCompletion, notenTrend, zeitreihe, kohorten, warnliste, alertConfig, export), Controller-Tests `reporting.controller.spec.ts` für Routing/status/RBAC, E2E `reporting.e2e-spec.ts` für E2E Flows (dashboard je Rolle, kpis, warnliste, export csv/json/pdf, alert-config CRUD, kohorten, custom report). Swagger: `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth`, `@ApiTags('reporting')`, DTO `@ApiProperty` vollständig. `npm run lint`, `npm run typecheck` clean, keine `any`.
  - **Acceptance criteria**:
    - [ ] `npm run test -- --coverage` → Services ≥90%, Controllers ≥80%, Guards 100% (via `vitest run --coverage`)
    - [ ] Kein `it.skip` ohne Ticket, kein `console.log` in tests
    - [ ] Swagger `/api/docs` zeigt alle neuen Endpoints mit Beispiel-Payloads
  - **Verification**:
    - [ ] Tests pass: `npm run test`
    - [ ] Build succeeds: `npm run build && npm run lint && npm run typecheck`
    - [ ] Manual check: `/api/docs` → reporting Tag 12 Operationen sichtbar
  - **Dependencies**: All previous tasks
  - **Files likely touched**:
    - `src/modules/reporting/reporting.service.spec.ts` (neu)
    - `src/modules/reporting/reporting.controller.spec.ts` (neu)
    - `test/reporting.e2e-spec.ts` (neu)
    - `src/modules/reporting/reporting.controller.ts`
  - **Estimated scope**: Large (5+ files) — aufteilen in Sub-PR wenn Large

- [ ] **Task 18**: ADR & Frontend-Kontrakt — ADR Kohorten, OpenAPI Beispiele, Chart-Shapes, README
  - **Description**: ADR `docs/adr/013-dashboard-kohorten-strategy.md` (Berechnung vs Snapshot, Entscheidung Aggregation, Tradeoffs, Monitoring Trigger). `README.md` Abschnitt `## Reporting & Dashboard` Quickstart (`GET /api/v1/reporting/dashboard` curl Beispiele je Rolle). `frontend/README` Pinia Store Spec `useReportingStore` Typen + PrimeVue Chart Data Shapes (`ChartData {labels:string[], datasets:{label,data,backgroundColor}[]}`). `specs/progress-analytics.spec.md` TODO Haken.
  - **Acceptance criteria**:
    - [ ] ADR existiert, folgt `docs/adr/Template`, von `architecture-security-testing.md` konform
    - [ ] README Quickstart copy-paste `curl` Beispiele für dashboard+kpis+export funktionieren
    - [ ] Frontend Chart Shapes dokumentiert (bar für reportQuote, line für notenTrend, pie für verteilung)
  - **Verification**:
    - [ ] Tests pass: `npm run build` (docs lint falls vorhanden)
    - [ ] Build succeeds: `npm run build`
    - [ ] Manual check: `cat docs/adr/013-dashboard-kohorten-strategy.md` existiert
  - **Dependencies**: Task 10, Task 13
  - **Files likely touched**:
    - `docs/adr/013-dashboard-kohorten-strategy.md` (neu)
    - `README.md`
    - `specs/progress-analytics.spec.md`
  - **Estimated scope**: Small (2-3 files)

**Checkpoint: Complete**
- [ ] Alle Tests `npm run test` + `npm run test:e2e` grün, Coverage ≥ Schwellen
- [ ] Build + Lint + TypeCheck clean, `docker build -t nextgen-backend .` grün
- [ ] Swagger `/api/docs` vollständig (12+ Operationen reporting)
- [ ] E2E Manuell: Dashboard je Rolle → KPIs → Warnliste → Export csv/json/pdf → AlertConfig → Kohorten → Custom Report
- [ ] Audit-Log `dashboard.view` + `reporting.export` vorhanden, DSGVO Art.15 Export via `datenschutz` verknüpft
- [ ] Human Review freigegeben, Plan `concept.md §5.4` + `concept2 §13` + `progress-analytics.spec.md` abgehakt

