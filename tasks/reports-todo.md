# Berichtsheft Modul — Aufgabenliste

## Phase 1: Foundation — Migration, DTOs, Code Quality

- [ ] **Task 1**: Prisma Migration für fehlende Report-Tabellen
  - **Description**: Migration `0006_add_report_attachments_versions_time_entries` erstellen für `report_attachments`, `report_versions`, `report_time_entries`. `prisma migrate dev --create-only` nutzen.
  - **Acceptance criteria**:
    - [ ] Migration-Datei existiert in `prisma/migrations/`
    - [ ] `npx prisma migrate dev` erfolgreich
    - [ ] Prisma Client kompiliert
  - **Verification**: `npx prisma migrate dev`, `npx prisma generate`
  - **Dependencies**: None
  - **Files**: `prisma/migrations/`
  - **Estimated scope**: Small

- [ ] **Task 2**: Fehlende DTOs erstellen — AddAttachmentDto, AddTimeEntryDto, VersionResponseDto
  - **Description**: DTOs mit `class-validator` und `@ApiProperty` für die Endpunkte erstellen, die aktuell `@Body() dto: any` nutzen.
  - **Acceptance criteria**:
    - [ ] `AddAttachmentDto` mit `typ` (enum: screenshot, diagramm, code), `dateiUrl`, `kommentar?`
    - [ ] `AddTimeEntryDto` mit `taskId?`, `stunden` (min 0.5, max 24), `kommentar?`
    - [ ] `VersionResponseDto` mit `id`, `reportId`, `version`, `inhaltMarkdown`, `erstelltVon?`, `createdAt`
    - [ ] `DiffResponseDto` mit `v1`, `v2` (string-Felder)
    - [ ] Alle mit `@ApiProperty` für Swagger
  - **Verification**: `npm run build`
  - **Dependencies**: None
  - **Files**: `src/modules/reports/dto/report.dto.ts` (erweitern)
  - **Estimated scope**: Small

- [ ] **Task 3**: Service Code-Quality — Kompakte Methoden aufteilen
  - **Description**: Die kompakten Einzeilen-Methoden `addAttachment`, `getAttachments`, `addTimeEntry`, `getTimeEntries`, `getVersions`, `getDiff` (Zeilen 188-193) in lesbare mehrzeilige Methoden umwandeln.
  - **Acceptance criteria**:
    - [ ] Jede Methode hat eigene Zeilen mit Einrückung
    - [ ] Keine kompakten Argumente mehr in einer Zeile
    - [ ] `npm run lint` bestanden
  - **Verification**: `npm run lint`, `npm run build`
  - **Dependencies**: Task 2
  - **Files**: `src/modules/reports/reports.service.ts`
  - **Estimated scope**: Small

- [ ] **Task 4**: Controller Code-Quality — Kompakte Endpunkte aufteilen
  - **Description**: Die kompakten Controller-Zeilen 169-178 (addAttachment, getAttachments, addTimeEntry, getTimeEntries, getVersions, getDiff) in lesbare Formate umwandeln. Fehlende `@ApiResponse`, `@ApiBearerAuth` ergänzen.
  - **Acceptance criteria**:
    - [ ] Jeder Endpunkt hat eigene Zeilen
    - [ ] `@ApiResponse` auf jedem Endpunkt
    - [ ] `@ApiBearerAuth` auf jedem Endpunkt
    - [ ] `@ApiBody` mit DTO-Typ auf POST-Endpunkten
  - **Verification**: `npm run lint`, `npm run build`
  - **Dependencies**: Task 2
  - **Files**: `src/modules/reports/reports.controller.ts`
  - **Estimated scope**: Small

**## Checkpoint: Foundation**
- [ ] Migration erfolgreich angewendet
- [ ] Alle DTOs kompilieren
- [ ] Code ist lesbar (keine kompakten Blöcke)
- [ ] `npm run build` erfolgreich
- [ ] `npm run lint` erfolgreich

## Phase 2: Core Features — Validierung, Cancel, Review Queue

- [ ] **Task 5**: datumVon < datumBis Validierung
  - **Description**: Custom-Validator oder Validierungs-Logik in `create` und `update` einbauen. Bei Verstoß `400` mit klarem Fehlercode.
  - **Acceptance criteria**:
    - [ ] `datumVon` muss vor `datumBis` liegen
    - [ ] Fehler: `"datumVon muss vor datumBis liegen"` mit Status 400
    - [ ] Gilt für `create` und `update`
  - **Verification**: `npm run test` (manuell oder Unit-Test)
  - **Dependencies**: Task 2
  - **Files**: `src/modules/reports/reports.service.ts`, `src/modules/reports/dto/report.dto.ts`
  - **Estimated scope**: Small

- [ ] **Task 6**: Cancel Submission Endpoint
  - **Description**: `POST /berichte/:id/cancel` — Erlaubt Azubi (Owner) einen eingereichten Bericht zurückzuziehen (eingereicht → entwurf). Notification an Ausbildungsbeauftragten senden.
  - **Acceptance criteria**:
    - [ ] `POST :id/cancel` existiert mit `@Roles(Role.azubi)`
    - [ ] Status wird auf `entwurf` gesetzt
    - [ ] Nur Owner darf cancellen
    - [ ] Nur Status `eingereicht` ist cancelbar
    - [ ] Notification an Ausbildungsbeauftragten wird gesendet
    - [ ] Audit-Event wird erstellt
  - **Verification**: `npm run build`, manueller Test
  - **Dependencies**: Task 4
  - **Files**: `src/modules/reports/reports.controller.ts`, `src/modules/reports/reports.service.ts`
  - **Estimated scope**: Small

- [ ] **Task 7**: Review Queue Endpoint
  - **Description**: `GET /berichte/review-queue` — Liefert alle Berichte mit Status `eingereicht` für die Prüfung. Filter: `azubiId`, `jahr`, `kalenderwoche`. Nur für `ausbildungsbeauftragter` und `ausbilder`.
  - **Acceptance criteria**:
    - [ ] `GET /berichte/review-queue` existiert
    - [ ] Nur `eingereicht` Status wird angezeigt
    - [ ] Filter nach azubiId, jahr, kalenderwoche
    - [ ] Pagination unterstützt
    - [ ] Nur autorisierte Rollen
    - [ ] Response enthält Azubi-Info (Name)
  - **Verification**: `npm run build`, manueller Test
  - **Dependencies**: Task 4
  - **Files**: `src/modules/reports/reports.controller.ts`, `src/modules/reports/reports.service.ts`
  - **Estimated scope**: Medium

- [ ] **Task 8**: Audit-Logging für alle Aktionen
  - **Description**: Für `create`, `update`, `delete`, `submit`, `cancel` Audit-Events erstellen. `visieren` und `archivieren` haben bereits Audit.
  - **Acceptance criteria**:
    - [ ] `create` → `REPORT_CREATED`
    - [ ] `update` → `REPORT_UPDATED`
    - [ ] `delete` → `REPORT_DELETED`
    - [ ] `submit` → `REPORT_SUBMITTED`
    - [ ] `cancel` → `REPORT_CANCELLED`
    - [ ] IP, User-Agent, Entity-ID in Event
  - **Verification**: `npm run build`
  - **Dependencies**: Task 6
  - **Files**: `src/modules/reports/reports.service.ts`
  - **Estimated scope**: Small

**## Checkpoint: Core Features**
- [ ] Cancel Submission funktioniert
- [ ] Review Queue liefert korrekte Daten
- [ ] Audit-Logging für alle Aktionen
- [ ] datumVon/datumBis Validierung funktioniert
- [ ] `npm run build` erfolgreich

## Phase 3: Advanced Features — Batch Review, Reminder, Strukturierte Kommentare

- [ ] **Task 9**: Batch Review Endpoint
  - **Description**: `POST /berichte/batch-review` — Nimmt Array von Report-IDs und Aktion (`freigeben` | `zurueck`). Verarbeitet alle Berichte mit Audit-Logging und Notifications.
  - **Acceptance criteria**:
    - [ ] `POST /berichte/batch-review` existiert
    - [ ] DTO: `{ reportIds: string[], entscheidung: 'freigeben' | 'zurueck', kommentar?: string }`
    - [ ] Max. 100 Berichte pro Batch
    - [ ] Jeder Bericht wird einzeln validiert
    - [ ] Audit-Events für jeden Bericht
    - [ ] Bulk-Notifications
    - [ ] Response mit Erfolgs/Fehler-Statistik
  - **Verification**: `npm run build`
  - **Dependencies**: Task 7
  - **Files**: `src/modules/reports/reports.controller.ts`, `src/modules/reports/reports.service.ts`
  - **Estimated scope**: Medium

- [ ] **Task 10**: Strukturierte Kommentar-Typen
  - **Description**: Kommentar-Typen erweitern: `allgemein`, `fachlich`, `formal`, `aufgabenkopplung`. `AddCommentDto.art` als Enum validieren.
  - **Acceptance criteria**:
    - [ ] Enum `KommentarArt` mit 4 Werten
    - [ ] `AddCommentDto.art` validiert gegen Enum
    - [ ] Standard: `allgemein`
  - **Verification**: `npm run build`
  - **Dependencies**: Task 2
  - **Files**: `src/modules/reports/dto/report.dto.ts`
  - **Estimated scope**: Small

- [ ] **Task 11**: Auto-Reminder Scheduler
  - **Description**: Freitags um 17:00 Uhr alle Berichte mit Status `eingereicht` finden und Erinnerung an Azubis senden. `@nestjs/schedule` oder alternative nutzen.
  - **Acceptance criteria**:
    - [ ] Cron-Job `0 17 * * 5` (Freitag 17:00)
    - [ ] Findet alle `eingereicht` Berichte
    - [ ] Sendet In-App Notification an jeden Azubi
    - [ ] Logging der Erinnerungen
  - **Verification**: `npm run build`, Cron-Job manuell triggern
  - **Dependencies**: None
  - **Files**: `src/modules/reports/reports.service.ts`, `src/modules/reports/reports.module.ts`
  - **Estimated scope**: Medium

- [ ] **Task 12**: CSV-Export für Review-Ergebnisse
  - **Description**: `GET /berichte/export/review-csv` — Exportiert alle Berichte im Review-Status als CSV mit Azubi-Name, KW, Jahr, Status, Kommentaren.
  - **Acceptance criteria**:
    - [ ] `GET /berichte/export/review-csv` existiert
    - [ ] CSV mit: azubiName, kw, jahr, status, kommentar, createdAt
    - [ ] Scope-berechtigt (nur eigene Berichte sehen)
    - [ ] Content-Type: text/csv
  - **Verification**: Manuell: CSV herunterladen
  - **Dependencies**: Task 7
  - **Files**: `src/modules/reports/reports.controller.ts`, `src/modules/reports/reports.service.ts`
  - **Estimated scope**: Small

**## Checkpoint: Advanced Features**
- [ ] Batch Review funktioniert
- [ ] Kommentar-Typen validiert
- [ ] Auto-Reminder Cron-Job läuft
- [ ] CSV-Export korrekt
- [ ] `npm run build` erfolgreich

## Phase 4: Tests & Dokumentation

- [ ] **Task 13**: Unit-Tests für BerichteService
  - **Description**: Tests für alle Service-Methoden: `create`, `findAll`, `findOne`, `update`, `remove`, `submit`, `cancel`, `review`, `visieren`, `archivieren`, `addComment`, `getComments`. Mocks für Prisma, Scope, Notifications, Audit.
  - **Acceptance criteria**:
    - [ ] Tests für jeden Endpunkt
    - [ ] RBAC-Tests (falsche Rolle → Exception)
    - [ ] Status-Machine-Tests (falscher Übergang → Exception)
    - [ ] `npm run test` bestanden
  - **Verification**: `npm run test`
  - **Dependencies**: Task 12
  - **Files**: `src/modules/reports/reports.service.spec.ts`
  - **Estimated scope**: Large

- [ ] **Task 14**: Swagger-Dokumentation vervollständigen
  - **Description**: Alle Endpunkte mit `@ApiOperation`, `@ApiResponse`, `@ApiTags` vollständig dokumentieren. `@ApiBearerAuth` überall.
  - **Acceptance criteria**:
    - [ ] Jeder Endpunkt hat `@ApiOperation` mit deutschem Summary
    - [ ] Jeder Endpunkt hat `@ApiResponse` mit Status und Beschreibung
    - [ ] `@ApiBearerAuth` auf jedem Endpunkt
    - [ ] DTOs mit `@ApiProperty` vollständig
    - [ ] Swagger UI unter `/api/docs` funktionsfähig
  - **Verification**: Manuell: `/api/docs` prüfen
  - **Dependencies**: Task 12
  - **Files**: `src/modules/reports/reports.controller.ts`, `src/modules/reports/dto/report.dto.ts`
  - **Estimated scope**: Medium

- [ ] **Task 15**: Lint & TypeCheck bereinigen
  - **Description**: `npm run lint` und `npm run typecheck` ohne Fehler. Unused-Imports entfernen, Dead-Code aufräumen.
  - **Acceptance criteria**:
    - [ ] `npm run lint` ohne Fehler
    - [ ] `npm run typecheck` ohne Fehler
    - [ ] `npm run build` erfolgreich
  - **Verification**: `npm run lint && npm run typecheck && npm run build`
  - **Dependencies**: Task 14
  - **Files**: Alle geänderten Dateien
  - **Estimated scope**: Small

**## Checkpoint: Complete**
- [ ] Alle Tests bestanden (`npm run test`)
- [ ] Build erfolgreich (`npm run build`)
- [ ] Lint clean (`npm run lint`)
- [ ] TypeCheck clean (`npm run typecheck`)
- [ ] Swagger-Dokumentation vollständig
- [ ] Alle Spec-Anforderungen abgedeckt (report-review.spec.md, enhanced-report-management.spec.md)
- [ ] Human Review abgeschlossen
