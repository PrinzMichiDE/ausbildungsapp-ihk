# Skill-Matrix Modul — Aufgabenliste

## Phase 1: Foundation — Schema, DTOs, Modul-Struktur

- [ ] **Task 1**: Prisma Schema erweitern — `SkillAssignment`, `SkillMatrixBenchmark`, `Lernpfad` Modelle
  - **Description**: Drei neue Prisma-Modelle erstellen. `SkillAssignment` verknüpft Azubi + Framework (+ optionales Course) mit Fortschritts-Status. `SkillMatrixBenchmark` speichert anonymisierte Peer-Aggregationen. `Lernpfad` speichert individuelle Kurspriorisierungen pro Azubi.
  - **Acceptance criteria**:
    - [ ] `SkillAssignment`-Modell: `id`, `azubiId` (FK→User), `frameworkId` (FK→Framework), `courseId` (FK→Course, optional), `status` (Enum: `nicht_begonnen`, `in_arbeit`, `vermittelt`), `fortschritt` (Int 0-100), `vermitteltVon` (FK→User, nullable), `vermitteltAm` (DateTime, nullable), `bemerkungen` (Text, nullable), `createdAt`, `updatedAt`
    - [ ] `SkillMatrixBenchmark`-Modell: `id`, `jahrgang` (Int), `beruf` (String), `lernfeldId` (FK→Framework), `durchschnittNote` (Float), `durchschnittAbdeckungProzent` (Float), `durchschnittFortschritt` (Float), `azubiAnzahl` (Int), `berechnetAm` (DateTime)
    - [ ] `Lernpfad`-Modell: `id`, `azubiId` (FK→User), `courseId` (FK→Course), `prioritaet` (Enum: `hoch`, `mittel`, `niedrig`), `skipBegründung` (Text, nullable), `ausgeschlossen` (Boolean, default false), `erstelltVon` (FK→User), `createdAt`, `updatedAt`
    - [ ] Enum `SkillStatus`: `nicht_begonnen`, `in_arbeit`, `vermittelt`
    - [ ] Enum `LernpfadPrioritaet`: `hoch`, `mittel`, `niedrig`
    - [ ] Unique-Constraint auf `(azubiId, frameworkId)` in `SkillAssignment`
    - [ ] Indizes auf `azubiId`, `frameworkId`, `status` in `SkillAssignment`
    - [ ] Indizes auf `(jahrgang, beruf, lernfeldId)` in `SkillMatrixBenchmark`
    - [ ] Migration generiert und anwendbar (`npx prisma migrate dev`)
  - **Verification**: `npx prisma migrate dev`, `npx prisma generate`, `npm run build`
  - **Dependencies**: None
  - **Files**: `prisma/schema.prisma`, `prisma/migrations/`
  - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 2**: Error-Codes für Skill-Matrix ergänzen
  - **Description**: Neue Error-Codes in `error-codes.ts` für Skill-Matrix-spezifische Fehler hinzufügen.
  - **Acceptance criteria**:
    - [ ] `SKILL_ASSIGNMENT_NOT_FOUND` hinzugefügt
    - [ ] `SKILL_ASSIGNMENT_CONFLICT` hinzugefügt (doppelte Zuordnung)
    - [ ] `SKILL_NOT_VERMittelbar` hinzugefügt (Status-Übergang ungültig)
    - [ ] `BENCHMARK_NOT_FOUND` hinzugefügt
    - [ ] `LERNPFAD_NOT_FOUND` hinzugefügt
    - [ ] `LERNPFAD_CONFLICT` hinzugefügt (doppelter Kurs im Pfad)
  - **Verification**: `npm run build` (TypeScript kompiliert)
  - **Dependencies**: None
  - **Files**: `src/common/constants/error-codes.ts`
  - **Estimated scope**: XS (1 file)

- [ ] **Task 3**: `skill-matrix` Backend-Modul erstellen
  - **Description**: Neues NestJS-Modul `SkillMatrixModule` mit Service, Controller und DTOs. Analog zu bestehenden Modulen (z.B. `learning-content`). `PrismaModule` und `AccessScopeService` importieren.
  - **Acceptance criteria**:
    - [ ] `SkillMatrixModule` in `src/modules/skill-matrix/` erstellt
    - [ ] `SkillMatrixService` mit Konstruktor-Injektion von `PrismaService` und `AccessScopeService`
    - [ ] `SkillMatrixController` mit `@Controller('api/v1/skill-matrix')` Decorator
    - [ ] Modul in `AppModule` registriert
    - [ ] `npm run build` erfolgreich
  - **Verification**: `npm run build`, `npm run start:dev` (Modul startet ohne Fehler)
  - **Dependencies**: Task 1
  - **Files**: `src/modules/skill-matrix/skill-matrix.module.ts`, `src/modules/skill-matrix/skill-matrix.service.ts`, `src/modules/skill-matrix/skill-matrix.controller.ts`, `src/app.module.ts`
  - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 4**: DTOs für Skill-Matrix erstellen
  - **Description**: Vollständige DTOs für SkillAssignment, Benchmark, Lernpfad mit class-validator Decorators und Swagger-API-Property.
  - **Acceptance criteria**:
    - [ ] `CreateSkillAssignmentDto`: `azubiId`, `frameworkId`, `courseId?`, `status?`, `bemerkungen?`
    - [ ] `UpdateSkillAssignmentDto`: `PartialType(CreateSkillAssignmentDto)`
    - [ ] `SkillAssignmentResponseDto`: Alle Felder inkl. `vermitteltVon`, `vermitteltAm`, `fortschritt`
    - [ ] `MarkVermitteltDto`: `bemerkungen?`
    - [ ] `SkillGapQueryDto`: `azubiId?`, `frameworkId?`, `beruf?`
    - [ ] `SkillGapResponseDto`: `frameworkId`, `frameworkTitel`, `erforderlich` (Boolean), `fortschritt`, `status`, `kursCount`, `fehlendeKurse`
    - [ ] `BenchmarkResponseDto`: `jahrgang`, `beruf`, `lernfeldId`, `durchschnittNote`, `durchschnittAbdeckungProzent`, `durchschnittFortschritt`, `azubiAnzahl`
    - [ ] `CreateLernpfadDto`: `azubiId`, `courseId`, `prioritaet`, `skipBegründung?`
    - [ ] `LernpfadResponseDto`: Alle Felder
    - [ ] Alle DTOs mit `@ApiProperty()` Decorator
    - [ ] `class-validator` Validierung auf allen Pflichtfeldern
  - **Verification**: `npm run build` (TypeScript kompiliert)
  - **Dependencies**: Task 1
  - **Files**: `src/modules/skill-matrix/dto/skill-assignment.dto.ts`, `src/modules/skill-matrix/dto/skill-gap.dto.ts`, `src/modules/skill-matrix/dto/benchmark.dto.ts`, `src/modules/skill-matrix/dto/lernpfad.dto.ts`
  - **Estimated scope**: Medium (3-5 files)

**## Checkpoint: Foundation**
- [ ] Prisma Migration erfolgreich generiert und anwendbar
- [ ] Alle DTOs kompilieren ohne Fehler
- [ ] `skill-matrix` Modul in `AppModule` registriert
- [ ] Build erfolgreich (`npm run build`)

## Phase 2: Core Backend — Skill-Zuordnung & Fortschritts-Tracking

- [ ] **Task 5**: SkillAssignment CRUD-Endpunkte
  - **Description**: Vollständige CRUD-Endpunkte für SkillAssignment. Azubis sehen nur eigene Zuordnungen; Ausbildungsbeauftragte/Ausbilder sehen eigene Abteilung/alle.
  - **Acceptance criteria**:
    - [ ] `POST /api/v1/skill-matrix/assignments` — Erstelle SkillAssignment (nur Ausbilder/HR)
    - [ ] `GET /api/v1/skill-matrix/assignments` — Liste eigener/scoped Assignments (GET mit Filter)
    - [ ] `GET /api/v1/skill-matrix/assignments/:id` — Detail-Ansicht
    - [ ] `PATCH /api/v1/skill-matrix/assignments/:id` — Update (nur Status, Fortschritt, Bemerkungen)
    - [ ] `DELETE /api/v1/skill-matrix/assignments/:id` — Soft-Delete (nur Admin)
    - [ ] `GET /api/v1/skill-matrix/assignments/azubi/:azubiId` — Alle Assignments eines Azubis
    - [ ] RBAC: Azubi nur eigene, Ausbildungsbeauftragter eigene Abteilung, Ausbilder/HR alle
    - [ ] `@Public()` auf KEinem Endpoint (Auth Pflicht)
  - **Verification**: `npm run test`, `npm run build`
  - **Dependencies**: Task 3, Task 4
  - **Files**: `src/modules/skill-matrix/skill-matrix.controller.ts`, `src/modules/skill-matrix/skill-matrix.service.ts`
  - **Estimated scope**: Large (5+ files) — aufteilen in CRUD-Unteraufgaben

- [ ] **Task 6**: Fortschrittsberechnung — Kursfortschritt → Skill-Level-Ableitung
  - **Description**: Service-Methode `calculateFortschritt(azubiId, frameworkId)` die den durchschnittlichen Kursfortschritt aller freigegebenen Kurse eines Frameworks für einen Azubi berechnet. Fortschritt = (freigegebene Kurse mit Status `vermittelt` / Gesamtzahl freigegebener Kurse) × 100.
  - **Acceptance criteria**:
    - [ ] Methode `calculateFortschritt` im Service
    - [ ] Berücksichtigt nur freigegebene Kurse (`freigegeben: true`)
    - [ ] Gibt Fortschritt als Integer 0-100 zurück
    - [ ] Aktualisiert `fortschritt`-Feld im `SkillAssignment` bei Status-Änderung
    - [ ] Handle Edge Cases: Keine Kurse → 0%, Alle vermittelt → 100%
  - **Verification**: `npm run test` (mathematische Korrektheit)
  - **Dependencies**: Task 5
  - **Files**: `src/modules/skill-matrix/skill-matrix.service.ts`
  - **Estimated scope**: Small

- [ ] **Task 7**: „Vermittelt"-Markierung — `PATCH :id/vermittelt` mit RBAC + Audit
  - **Description**: Endpoint `PATCH /api/v1/skill-matrix/assignments/:id/vermittelt` der den Status auf `vermittelt` setzt. RBAC: Nur Ausbildungsbeauftragter (eigene Abteilung) oder Ausbilder. Setzt `vermitteltVon` und `vermitteltAm` automatisch. Erzeugt AuditEvent.
  - **Acceptance criteria**:
    - [ ] `PATCH :id/vermittelt` akzeptiert optional `bemerkungen`
    - [ ] Status-Übergang nur `in_arbeit → vermittelt` erlaubt
    - [ ] `vermitteltVon` = aktuelle User-ID
    - [ ] `vermitteltAm` = aktueller Zeitstempel
    - [ ] AuditEvent für „vermittelt"-Aktion
    - [ ] `ForbiddenException` bei ungültigem Status-Übergang
    - [ ] Nur Ausbildungsbeauftragter/Ausbilder (RBAC-Check)
  - **Verification**: `npm run test` (Status-Übergänge, RBAC)
  - **Dependencies**: Task 5
  - **Files**: `src/modules/skill-matrix/skill-matrix.service.ts`, `src/modules/skill-matrix/skill-matrix.controller.ts`
  - **Estimated scope**: Medium

- [ ] **Task 8**: Scope-Integration — `AccessScopeService` für Skill-Daten
  - **Description**: `AccessScopeService` um SkillAssignment-spezifische Methoden erweitern: `assertCanAccessSkillAssignment(user, assignmentId)`, `getVisibleSkillAssignments(user)`.
  - **Acceptance criteria**:
    - [ ] `assertCanAccessSkillAssignment` prüft Ownership (Azubi) oder Abteilungs-Scope
    - [ ] `getVisibleSkillAssignments` liefert gefilterte Query basierend auf Rolle
    - [ ] Keine NW-Query-Berechnung (Indizes auf azubiId)
    - [ ] `ForbiddenException` bei unberechtigtem Zugriff
  - **Verification**: `npm run test` (Scope-Tests)
  - **Dependencies**: Task 5
  - **Files**: `src/common/rbac/access-scope.service.ts`, `src/modules/skill-matrix/skill-matrix.service.ts`
  - **Estimated scope**: Medium

**## Checkpoint: Core Backend**
- [ ] CRUD-Endpunkte funktionieren mit korrekter RBAC-Prüfung
- [ ] Fortschrittsberechnung liefert korrekte Werte für alle Edge Cases
- [ ] „Vermittelt"-Markierung nur durch Ausbildungsbeauftragten/Ausbilder
- [ ] Scope-Filterung funktioniert für alle Rollen
- [ ] `npm run test` bestanden

## Phase 3: Analytics Backend — Gap-Analyse, Benchmarking, Reporting

- [ ] **Task 9**: Skill-Gap-Analyse — Required vs. Actual pro Azubi/Lernfeld
  - **Description**: Service-Methode `getSkillGap(azubiId?)` die pro Framework den Ist-Soll-Vergleich berechnet. Zeigt: Framework (Pflicht), Status, Fortschritt, fehlende Kurse, Empfehlungen.
  - **Acceptance criteria**:
    - [ ] `GET /api/v1/skill-matrix/gap` — Gap-Analyse für alle sichtbaren Azubis
    - [ ] `GET /api/v1/skill-matrix/gap/:azubiId` — Gap-Analyse für spezifischen Azubi
    - [ ] Response: Array von `{ frameworkId, titel, lernfeld, status, fortschritt, erforderlich, kurseTotal, kurseVermittelt, fehlendeKurse[] }`
    - [ ] Nur freigegebene Kurse werden gezählt
    - [ ] Scope-Filterung für Ausbildungsbeauftragten
  - **Verification**: `npm run test`
  - **Dependencies**: Task 5, Task 6
  - **Files**: `src/modules/skill-matrix/skill-matrix.service.ts`, `src/modules/skill-matrix/skill-matrix.controller.ts`
  - **Estimated scope**: Medium

- [ ] **Task 10**: SkillMatrixBenchmark — Peer-Vergleich pro Jahrgang/Beruf
  - **Description**: Service-Methode `calculateBenchmark(jahrgang, beruf)` die aggregierte Daten pro Lernfeld berechnet: Durchschnittsnote, durchschnittliche Abdeckung, durchschnittlicher Fortschritt. Anonymisiert (keine Einzelvergleiche).
  - **Acceptance criteria**:
    - [ ] `GET /api/v1/skill-matrix/benchmark?jahrgang=X&beruf=Y` — Benchmark-Daten
    - [ ] Aggregation über alle Azubis des Jahrgangs/Berufs
    - [ ] Nur aggreagierte Werte (keine Einzelvergleiche)
    - [ ] `azubiAnzahl` für Mindest-Sample-Size
    - [ ] Benchmark wird bei Bedarf neu berechnet (nicht gecacht)
  - **Verification**: `npm run test`
  - **Dependencies**: Task 5
  - **Files**: `src/modules/skill-matrix/skill-matrix.service.ts`, `src/modules/skill-matrix/skill-matrix.controller.ts`
  - **Estimated scope**: Medium

- [ ] **Task 11**: Lernpfad-Service — Individuelle Kurspriorisierung
  - **Description**: Service für `Lernpfad`-CRUD und Empfehlungslogik. `GET /api/v1/skill-matrix/lernpfad/:azubiId` liefert priorisierte Kursliste basierend auf Skill-Gap-Analyse.
  - **Acceptance criteria**:
    - [ ] `POST /api/v1/skill-matrix/lernpfad` — Erstelle Lernpfad-Eintrag
    - [ ] `GET /api/v1/skill-matrix/lernpfad/:azubiId` — Zeige Lernpfad
    - [ ] `PATCH /api/v1/skill-matrix/lernpfad/:id` — Priorität ändern
    - [ ] `DELETE /api/v1/skill-matrix/lernpfad/:id` — Eintrag entfernen
    - [ ] Empfehlungslogik: Sortiert nach Skill-Gap (höchste Defizite zuerst)
    - [ ] Unique-Constraint `(azubiId, courseId)` verhindert doppelte Kurse
  - **Verification**: `npm run test`
  - **Dependencies**: Task 5, Task 9
  - **Files**: `src/modules/skill-matrix/skill-matrix.service.ts`, `src/modules/skill-matrix/skill-matrix.controller.ts`
  - **Estimated scope**: Medium

- [ ] **Task 12**: Reporting-Integration — Skill-Coverage erweitern um Azubi-Fortschritt
  - **Description**: `ReportingService.skillCoverage()` um Azubi-Fortschrittsdaten erweitern. Zusätzlich: `GET /api/v1/reporting/kpis/skill-progress` der aggregierte Fortschrittsdaten pro Azubi liefert.
  - **Acceptance criteria**:
    - [ ] `skillCoverage()` liefert zusätzlich `avgFortschritt` und `azubiAnzahl` pro Kurs
    - [ ] Neuer Endpoint `GET /api/v1/reporting/kpis/skill-progress`
  - **Verification**: `npm run test`
  - **Dependencies**: Task 5
  - **Files**: `src/modules/reporting/reporting.service.ts`, `src/modules/reporting/dto/reporting.dto.ts`
  - **Estimated scope**: Small

**## Checkpoint: Analytics Backend**
- [ ] Gap-Analyse liefert korrekte Differenzen für alle Azubis
- [ ] Benchmark-Daten anonymisiert aggregiert mit Mindest-Sample-Size
- [ ] Lernpfad-Empfehlungen basierend auf Gap-Analyse sortiert
- [ ] Reporting-Endpunkte erweitert

## Phase 4: Frontend — Store, TreeTable, Fortschrittsbalken, „Vermittelt"

- [ ] **Task 13**: Frontend-Store `skill-matrix.ts` erstellen
  - **Description**: Neuer Pinia-Store für Skill-Matrix-Daten. Analog zu `learning.ts`. Enthält State für assignments, gaps, benchmarks, lernpfad.
  - **Acceptance criteria**:
    - [ ] `useSkillMatrixStore` mit `defineStore`
    - [ ] State: `assignments`, `selectedAssignment`, `skillGaps`, `benchmarks`, `lernpfad`, `loading`
    - [ ] Actions: `fetchAssignments()`, `fetchSkillGap(azubiId?)`, `fetchBenchmarks(jahrgang, beruf)`, `markVermittelt(id, dto)`, `fetchLernpfad(azubiId)`
    - [ ] Integration mit `api/client.ts`
    - [ ] TypeScript-Interfaces für alle Response-Typen
  - **Verification**: `npm run build` (Frontend)
  - **Dependencies**: Task 4
  - **Files**: `frontend/src/stores/skill-matrix.ts`
  - **Estimated scope**: Medium

- [ ] **Task 14**: `SkillMatrixView.vue` — TreeTable mit Frameworks/Kursen/Fortschritt
  - **Description**: Komplette Neugestaltung der `SkillsView.vue` als `SkillMatrixView.vue` mit PrimeVue TreeTable gemäß UI/UX-Konzept (§3.3). Zeigt Frameworks als Wurzelknoten, Kurse als Kind-Knoten, Fortschritt als Knob, Status als Tag.
  - **Acceptance criteria**:
    - [ ] PrimeVue `TreeTable` mit Spalten: Lernfeld, KI-Pfad, Fortschritt, Status, Aktion
    - [ ] `Knob`-Komponente für Fortschritt (0-100%)
    - [ ] `Tag`-Komponente für Status (nicht_begonnen=grau, in_arbeit=blau, vermittelt=grün)
    - [ ] Expand/Collapse für Framework-Bäume
    - [ ] Loading-State mit `Skeleton`-Komponenten
    - [ ] Responsive Design (Stack-Modus auf Mobile)
    - [ ] Farbcodierung: Grün (>85%), Gelb (60-85%), Rot (<60%) für Fortschritt
  - **Verification**: Manuell: UI im Browser prüfen, `npm run build`
  - **Dependencies**: Task 13
  - **Files**: `frontend/src/views/SkillMatrixView.vue` (Rename von SkillsView.vue)
  - **Estimated scope**: Large (5+ files)

- [ ] **Task 15**: „Vermittelt"-Markierungs-UI — Checkbox/Button für Ausbilder
  - **Description**: Inline-Aktion in der TreeTable für Ausbildungsbeauftragte/Ausbilder. „Vermittelt"-Button der Status auf `vermittelt` setzt mit optionalem Kommentar-Dialog.
  - **Acceptance criteria**:
    - [ ] „Vermittelt"-Button nur sichtbar für Ausbildungsbeauftragte/Ausbilder
    - [ ] Klick öffnet `ConfirmPopup` mit optionalen Bemerkungen
    - [ ] Bestätigung ruft `markVermittelt` im Store auf
    - [ ] Erfolgreiche Markierung zeigt `Toast` (grün)
    - [ ] Fehler zeigt `Toast` (rot)
    - [ ] Optimistisches UI-Update (sofortige Anzeige)
  - **Verification**: Manuell: Als Ausbilder einloggen, „Vermittelt" klicken
  - **Dependencies**: Task 14, Task 7
  - **Files**: `frontend/src/views/SkillMatrixView.vue`, `frontend/src/stores/skill-matrix.ts`
  - **Estimated scope**: Medium

- [ ] **Task 16**: Skill-Gap-Dashboard — Required vs. Actual Visualisierung
  - **Description**: Neue Komponente `SkillGapDashboard.vue` die pro Azubi den Ist-Soll-Vergleich anzeigt. Bar-Charts oder Fortschrittsbalken pro Framework.
  - **Acceptance criteria**:
    - [ ] Bar-Chart oder horizontale Fortschrittsbalken pro Framework
    - [ ] Farbmarkierung: Erfüllt (>80%), Teilerfüllt (40-80%), Nicht erfüllt (<40%)
    - [ ] Filter nach Azubi, Framework, Beruf
    - [ ] Tooltip zeigt Details (fehlende Kurse)
    - [ ] Responsive Layout
  - **Verification**: Manuell: Dashboard aufrufen, Filter testen
  - **Dependencies**: Task 14, Task 9
  - **Files**: `frontend/src/views/SkillGapDashboard.vue`, `frontend/src/components/SkillGapBar.vue`
  - **Estimated scope**: Medium

**## Checkpoint: Frontend Core**
- [ ] TreeTable rendert korrekt mit Fortschrittsbalken und Status-Tags
- [ ] „Vermittelt"-Aktion funktioniert für Ausbilder mit RBAC
- [ ] Gap-Dashboard zeigt Daten pro Azubi an
- [ ] Responsive Design auf Mobile getestet

## Phase 5: Advanced Frontend — Benchmarking, Lernpfad, Export

- [ ] **Task 17**: Peer-Benchmarking-Ansicht — Anonymisierter Jahrgangsvergleich
  - **Description**: Neue Komponente `BenchmarkView.vue` die anonymisierte Peer-Daten pro Jahrgang/Beruf anzeigt. Durchschnittsfortschritt, Durchschnittsabdeckung, Anzahl Azubis.
  - **Acceptance criteria**:
    - [ ] Dropdowns für Jahrgang und Beruf
    - [ ] Tabelle mit Lernfeld, Durchschnittsfortschritt, Abdeckung
    - [ ] Keine Einzelvergleiche (nur Aggregation)
    - [ ] Hinweis auf Mindest-Sample-Size
  - **Verification**: Manuell: Benchmark-Ansicht prüfen
  - **Dependencies**: Task 14, Task 10
  - **Files**: `frontend/src/views/BenchmarkView.vue`
  - **Estimated scope**: Medium

- [ ] **Task 18**: Lernpfad-UI — Empfohlene Kurse, Priorisierung
  - **Description**: Neue Komponente `LernpfadView.vue` die empfohlene Kurse pro Azubi anzeigt, sortiert nach Skill-Gap-Priorität.
  - **Acceptance criteria**:
    - [ ] Liste empfohlener Kurse mit Prioritäts-Tag (hoch/rot, mittel/gelb, niedrig/grau)
    - [ ] Drag-and-Drop für manuelle Priorisierung
    - [ ] „Überspringen" mit Begründung
    - [ ] Integration mit Lernpfad-Store
  - **Verification**: Manuell: Lernpfad-UI testen
  - **Dependencies**: Task 14, Task 11
  - **Files**: `frontend/src/views/LernpfadView.vue`
  - **Estimated scope**: Medium

- [ ] **Task 19**: CSV/PDF-Export — Skill-Matrix-Export
  - **Description**: Export-Endpoints für Skill-Matrix-Daten. CSV mit allen Assignments, PDF mit visueller Matrix-Ansicht.
  - **Acceptance criteria**:
    - [ ] `GET /api/v1/skill-matrix/export/csv` — CSV mit azubiId, name, framework, status, fortschritt
    - [ ] `GET /api/v1/skill-matrix/export/pdf/:azubiId` — PDF mit individueller Matrix-Ansicht
    - [ ] Scope-Check für Export
  - **Verification**: Manuell: CSV herunterladen, PDF öffnen
  - **Dependencies**: Task 5
  - **Files**: `src/modules/skill-matrix/skill-matrix.controller.ts`, `src/modules/skill-matrix/skill-matrix.service.ts`
  - **Estimated scope**: Medium

- [ ] **Task 20**: Notification-Integration — Bei „Vermittelt"-Markierung
  - **Description**: Bei Status-Änderung auf `vermittelt` Notification an den Azubi erzeugen. `NotificationModule` nutzen.
  - **Acceptance criteria**:
    - [ ] Notification bei `vermittelt` mit Framework-Titel
    - [ ] Kategorie: `skill_update`, Priorität: `medium`
    - [ ] `NotificationModule` korrekt integriert
  - **Verification**: Manuell: Status ändern, Notification prüfen
  - **Dependencies**: Task 7
  - **Files**: `src/modules/skill-matrix/skill-matrix.service.ts`
  - **Estimated scope**: Small

**## Checkpoint: Advanced Frontend**
- [ ] Benchmark-Ansicht anonymisiert mit Mindest-Sample-Size
- [ ] Lernpfad-Empfehlungen sichtbar mit Drag-and-Drop
- [ ] Export funktioniert für CSV und PDF
- [ ] Notifications bei „Vermittelt"-Markierung ausgelöst

## Phase 6: Tests, Doku, Code-Qualität

- [ ] **Task 21**: Unit-Tests für SkillAssignmentService
  - **Description**: Tests für alle Service-Methoden: `create`, `findAll`, `findOne`, `update`, `remove`, `markVermittelt`, `calculateFortschritt`, `getSkillGap`, `calculateBenchmark`.
  - **Acceptance criteria**:
    - [ ] Tests für alle CRUD-Methoden
    - [ ] Tests für Fortschrittsberechnung (Edge Cases: keine Kurse, alle vermittelt, teilweise)
    - [ ] Tests für Status-Übergänge (gültig/ungültig)
    - [ ] Tests für Gap-Analyse
    - [ ] `npm run test` bestanden
  - **Verification**: `npm run test`
  - **Dependencies**: All previous tasks
  - **Files**: `src/modules/skill-matrix/__tests__/skill-matrix.service.spec.ts`
  - **Estimated scope**: Large (5+ files)

- [ ] **Task 22**: Integrationstests für RBAC/Scope-Prüfungen
  - **Description**: Tests für rollenbasierte Zugriffskontrolle auf Skill-Matrix-Endpoints. Verschiedene Rollen (Azubi, Ausbildungsbeauftragter, Ausbilder, HR, Admin) testen.
  - **Acceptance criteria**:
    - [ ] Azubi kann nur eigene Assignments sehen
    - [ ] Ausbildungsbeauftragter sieht eigene Abteilung
    - [ ] Ausbilder/HR sehen alle
    - [ ] Admin hat keinen Zugriff auf fachliche Daten
    - [ ] „Vermittelt" nur durch berechtigte Rollen
    - [ ] `npm run test` bestanden
  - **Verification**: `npm run test`
  - **Dependencies**: Task 21
  - **Files**: `src/modules/skill-matrix/__tests__/skill-matrix.controller.spec.ts`
  - **Estimated scope**: Medium

- [ ] **Task 23**: Swagger-Dokumentation für alle Endpunkte
  - **Description**: Alle Skill-Matrix-Endpunkte mit `@ApiOperation`, `@ApiResponse`, `@ApiTags` dokumentiert.
  - **Acceptance criteria**:
    - [ ] Alle Endpunkte mit Swagger-Decorators
    - [ ] DTOs mit `@ApiProperty` vollständig
    - [ ] Swagger-UI unter `/api/docs` prüfen
  - **Verification**: Manuell: `/api/docs` im Browser
  - **Dependencies**: Task 4, Task 5
  - **Files**: `src/modules/skill-matrix/`
  - **Estimated scope**: Small

- [ ] **Task 24**: Code-Review & Refactoring
  - **Description**: Code-Qualität sicherstellen: Lint clean, TypeCheck clean, keine Dead-Codes, Konsistenz mit bestehenden Modulen.
  - **Acceptance criteria**:
    - [ ] `npm run lint` clean
    - [ ] `npm run typecheck` clean
    - [ ] Keine Dead-Codes
    - [ ] Konsistente Namensgebung mit bestehenden Modulen
    - [ ] RBAC-Matrix in `nestjx-rbac.md` um Skill-Matrix-Aktionen erweitert
  - **Verification**: `npm run lint`, `npm run typecheck`, `npm run build`
  - **Dependencies**: Task 22, Task 23
  - **Files**: `src/modules/skill-matrix/`, `.opencode/rules/nestjx-rbac.md`
  - **Estimated scope**: Medium

**## Checkpoint: Complete**
- [ ] Alle Tests bestanden (`npm run test`)
- [ ] Build erfolgreich (`npm run build` + `npm run build` Frontend)
- [ ] Lint und TypeCheck clean
- [ ] Swagger-Dokumentation vollständig
- [ ] RBAC-Matrix erweitert
- [ ] Alle Akzeptanzkriterien erfüllt
- [ ] Human Review abgeschlossen
