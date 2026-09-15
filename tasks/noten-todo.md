# Notenheft Modul — Aufgabenliste

## Phase 1: Foundation — Schema, DTOs, Infrastruktur

- [ ] **Task 1**: Prisma Schema erweitern — `GradeVersion`-Modell hinzufügen (versions-Historie für Noten)
  - **Description**: Neues Prisma-Modell `GradeVersion` erstellen, das jede Version einer Note speichert (analog `ReportVersion`). Felder: `gradeId`, `version`, `fach`, `note`, `status`, `gewichtung`, `gewichtungsKategorie`, `bemerkungen`, `bemerktVon`, `createdAt`.
  - **Acceptance criteria**:
    - [ ] `GradeVersion`-Modell im Prisma-Schema mit allen Feldern
    - [ ] Migration generiert und angewendet (`npx prisma migrate dev`)
    - [ ] Prisma Client kompiliert ohne Fehler
  - **Verification**: `npm run build`, `npx prisma migrate dev`
  - **Dependencies**: None
  - **Files**: `prisma/schema.prisma`, `prisma/migrations/`
  - **Estimated scope**: Small (1-2 files)

- [ ] **Task 2**: DTOs vollständig erweitern — Alle Grade-Entity-Felder in DTOs aufnehmen
  - **Description**: `CreateGradeDto`, `GradeResponseDto`, `UpdateGradeDto` um alle Prisma-Felder erweitern: `status`, `halbjahr`, `pruefungsart`, `gewichtung`, `gewichtungsKategorie`, `typ`, `bemerkungen`, `prueferId`, `pruefungsdatum`, `wiederholung`, `maßnahme`, `kursId`. `PartialType` für `UpdateGradeDto`. Enums als separate DTO-Klassen.
  - **Acceptance criteria**:
    - [ ] Alle Prisma-Entity-Felder in DTOs abgebildet
    - [ ] `PartialType(CreateGradeDto)` für Updates
    - [ ] `GradeStatusDto`, `GradeTypDto`, `HalbjahrDto`, `GewichtungskategorieDto` erstellt
    - [ ] `class-validator` Decorators auf allen Feldern
  - **Verification**: `npm run build` (TypeScript-Kompilierung)
  - **Dependencies**: Task 1
  - **Files**: `src/modules/grades/dto/grade.dto.ts`, `src/modules/grades/dto/grade-status.dto.ts`, etc.
  - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 3**: `grade-entries` Modul komplett überarbeiten
  - **Description**: `GradeEntry`-Modul auf `grades`-Modul-Niveau bringen: vollständige DTOs, RBAC-Guard, Scope-Check, CRUD-Endpunkte, Service mit `AccessScopeService`.
  - **Acceptance criteria**:
    - [ ] `GradeEntryController` mit allen CRUD-Endpunkten
    - [ ] `GradeEntryService` mit `AccessScopeService`-Integration
    - [ ] Rollenbasierte Zugriffskontrolle (azubi: eigene, ausbilder/HR: scoped)
    - [ ] DTOs mit Validierung
  - **Verification**: `npm run build`, `npm run test`
  - **Dependencies**: Task 2
  - **Files**: `src/modules/grade-entries/`
  - **Estimated scope**: Large (5+ files) — aufteilen in Unteraufgaben

- [ ] **Task 4**: Shared DTOs und Enums erstellen
  - **Description**: Gemeinsame DTOs für beide Grade-Module in `src/common/dto/` bereitstellen. `PaginationQueryDto` für Noten-Sortierung/Pagination.
  - **Acceptance criteria**:
    - [ ] Gemeinsame Enums/DTOs in `src/common/` bereitgestellt
    - [ ] Keine Duplikation zwischen modules
  - **Verification**: `npm run build`
  - **Dependencies**: None
  - **Files**: `src/common/dto/`
  - **Estimated scope**: Small

**## Checkpoint: Foundation**
- [ ] Prisma Migration generiert und angewendet
- [ ] Alle DTOs kompilieren ohne Fehler
- [ ] `grade-entries` Modul funktioniert mit vollständigem CRUD
- [ ] Build erfolgreich (`npm run build`)

## Phase 2: Core Features — Workflow, Statusmaschine, Zeugnis-Upload

- [ ] **Task 5**: Grade-Status-Workflow implementieren
  - **Description**: Service-Methoden `confirm()`, `visieren()`, `archivieren()` mit Status-Maschine `entwurf → bestaetigt → visiert → archiviert`. Rollenprüfung: Azubi kann nur `entwurf`-Status setzen; Ausbilder kann `bestaetigt`; Ausbilder/HR können `visiert`; `archiviert` = unveränderbar. `PATCH :id/status`-Endpoint mit Action-Param.
  - **Acceptance criteria**:
    - [ ] `POST :id/confirm` — Setzt status auf `bestaetigt` (nur Ausbilder)
    - [ ] `POST :id/visieren` — Setzt status auf `visiert` (nur Ausbilder/HR)
    - [ ] `POST :id/archivieren` — Setzt status auf `archiviert` (nur Ausbilder)
    - [ ] Archivierte Noten können nicht mehr bearbeitet/gelöscht werden
    - [ ] Falsche Status-Übergänge werfen `ForbiddenException`
  - **Verification**: `npm run test` (Workflow-Tests)
  - **Dependencies**: Task 2
  - **Files**: `src/modules/grades/grades.service.ts`, `src/modules/grades/grades.controller.ts`
  - **Estimated scope**: Medium

- [ ] **Task 6**: Zeugnis-Upload-Endpunkt
  - **Description**: `POST :id/zeugnis` mit Datei-Upload für Zeugnis. `zeugnisUrl` speichern. `GET :id/zeugnis` zum Download. Nur Ausbilder/HR können Zeugnisse hochladen/löschen. Lokale Datei-Speicherung als Startpunkt.
  - **Acceptance criteria**:
    - [ ] `POST :id/zeugnis` akzeptiert Datei-Upload
    - [ ] Datei gespeichert, URL in DB gespeichert
    - [ ] `GET :id/zeugnis` liefert Datei zurück
    - [ ] Rollenprüfung (nur Ausbilder/HR)
    - [ ] Archivierte Noten: Kein Upload erlaubt
  - **Verification**: Manuell: Datei hochladen und herunterladen
  - **Dependencies**: Task 5
  - **Files**: `src/modules/grades/grades.controller.ts`, `src/modules/grades/grades.service.ts`
  - **Estimated scope**: Medium

- [ ] **Task 7**: Grade-Bewertungsworkflow
  - **Description**: `POST :id/bewerten` mit `bewertung` (String), `prueferId`, `pruefungsdatum`. Felder `bewertetVon`, `bewertetAm`, `bewertung` im Grade-Entity. Nur Ausbilder/HR/Admin.
  - **Acceptance criteria**:
    - [ ] `POST :id/bewerten` akzeptiert Bewertung
    - [ ] `bewertetVon`, `bewertetAm` werden automatisch gesetzt
    - [ ] Nur autorisierte Rollen
  - **Verification**: `npm run test`
  - **Dependencies**: Task 5
  - **Files**: `src/modules/grades/grades.service.ts`, `src/modules/grades/grades.controller.ts`
  - **Estimated scope**: Small

- [ ] **Task 8**: Grade-Wiederholung und Maßnahme
  - **Description**: `POST :id/wiederholung` mit `wiederholung: true` und `maßnahme`. Fördermaßnahmen dokumentieren. Verknüpfung mit `Foerderbedarf`-Modul.
  - **Acceptance criteria**:
    - [ ] `POST :id/wiederholung` setzt `wiederholung: true`
    - [ ] `maßnahme`-Feld dokumentiert
    - [ ] Optionale Verknüpfung zu `Foerderbedarf`
  - **Verification**: `npm run test`
  - **Dependencies**: Task 5
  - **Files**: `src/modules/grades/grades.service.ts`, `src/modules/grades/grades.controller.ts`
  - **Estimated scope**: Small

**## Checkpoint: Core Features**
- [ ] Alle Workflow-Endpunkte funktionieren mit korrekter Rollenprüfung
- [ ] Zeugnis-Upload funktioniert
- [ ] Status-Übergänge werden durchgesetzt
- [ ] Grade mit Status `archiviert` sind unveränderbar

## Phase 3: Advanced Features — GPA, Versionshistorie, Noten-Tracker

- [ ] **Task 9**: Versionshistorie implementieren
  - **Description**: Jeder `update`-Aufruf erzeugt `GradeVersion`-Eintrag. `GET :id/versions` gibt Historie zurück. `GET :id/versions/:v1/diff/:v2` für Diff-Ansicht. Analog `ReportVersion`.
  - **Acceptance criteria**:
    - [ ] Jede Änderung an einer Note erzeugt Versions-Eintrag
    - [ ] `GET :id/versions` liefert alle Versionen chronologisch
    - [ ] `GET :id/versions/:v1/diff/:v2` zeigt Unterschiede
  - **Verification**: `npm run test`
  - **Dependencies**: Task 1 (GradeVersion-Modell)
  - **Files**: `src/modules/grades/grades.service.ts`, `src/modules/grades/grades.controller.ts`
  - **Estimated scope**: Medium

- [ ] **Task 10**: Gewichteter Durchschnitt (GPA) berechnen
  - **Description**: `GET :gpa`-Endpoint für einen Azubi. Berechnet gewichteten Durchschnitt basierend auf `gewichtung` und `gewichtungsKategorie`. Halbjahres-GPA und Gesamt-GPA. `GET :gpa/:azubiId` für anderen Azubi (scope-berechtigt).
  - **Acceptance criteria**:
    - [ ] Gewichteter Durchschnitt korrekt berechnet
    - [ ] Halbjahres-GPA und Gesamt-GPA verfügbar
    - [ ] Scope-Check für fremde Azubis
  - **Verification**: `npm run test` (mathematische Korrektheit)
  - **Dependencies**: Task 2
  - **Files**: `src/modules/grades/grades.service.ts`, `src/modules/grades/grades.controller.ts`
  - **Estimated scope**: Small

- [ ] **Task 11**: Noten-Tracker-Dashboard
  - **Description**: `GET :dashboard` liefert strukturierte Übersicht: Halbjahresnoten pro Fach, GPA-Verlauf, Warnstufen, Anzahl Noten pro Status. Filterung nach Fach, Halbjahr, Zeitraum.
  - **Acceptance criteria**:
    - [ ] Dashboard-Daten korrekt aggregiert
    - [ ] Filtermöglichkeiten (Fach, Halbjahr, Zeitraum)
    - [ ] Scope-gefilterte Daten
  - **Verification**: `npm run test`
  - **Dependencies**: Task 10
  - **Files**: `src/modules/grades/grades.service.ts`, `src/modules/grades/grades.controller.ts`
  - **Estimated scope**: Medium

- [ ] **Task 12**: Erweiterte Frühwarnung
  - **Description**: `GET :warnliste` erweitert um Kategorien: Note < 3 (gut), 3-4 (warnung), > 4 (kritisch). Fach-spezifische Warnungen. Zeitliche Entwicklung. Sortierung nach Dringlichkeit. `GET :warnliste/:fach` für fachspezifisch.
  - **Acceptance criteria**:
    - [ ] Warnliste nach Kategorien filterbar
    - [ ] Fach-spezifische Warnungen
    - [ ] Sortierung nach Dringlichkeit
  - **Verification**: `npm run test`
  - **Dependencies**: Task 5
  - **Files**: `src/modules/grades/grades.service.ts`, `src/modules/grades/grades.controller.ts`
  - **Estimated scope**: Small

**## Checkpoint: Advanced Features**
- [ ] Versionshistorie korrekt für alle Noten
- [ ] GPA-Berechnung korrekt mit Gewichtung
- [ ] Dashboard liefert alle Metriken
- [ ] Warnliste zeigt korrekte Kategorien

## Phase 4: Export, Integration, DSGVO

- [ ] **Task 13**: CSV-Export
  - **Description**: `GET :export/csv` exportiert Noten als CSV. `GET :export/csv/:azubiId` pro Azubi. `GET :export/csv/halbjahr/:halbjahr` für Halbjahres-Export. Felder: fach, note, zeitraum, halbjahr, typ, gewichtung, status.
  - **Acceptance criteria**:
    - [ ] CSV-Export korrekt mit allen Feldern
    - [ ] Halbjahres- und Gesamt-Export verfügbar
    - [ ] Scope-Check
  - **Verification**: Manuell: CSV herunterladen und prüfen
  - **Dependencies**: Task 2
  - **Files**: `src/modules/grades/grades.controller.ts`, `src/modules/grades/grades.service.ts`
  - **Estimated scope**: Small

- [ ] **Task 14**: PDF-Export
  - **Description**: `GET :export/pdf/:id` generiert PDF-Zeugnis. `GET :export/pdf/all/:azubiId` Gesamtübersicht. Nutzung bestehender PDF-Infrastruktur (falls vorhanden) oder Bibliothek.
  - **Acceptance criteria**:
    - [ ] Einzelnes Zeugnis als PDF
    - [ ] Gesamtübersicht als PDF
    - [ ] Korrektes Format (Name, Fach, Note, Datum, Zeugnisnummer)
  - **Verification**: Manuell: PDF öffnen und prüfen
  - **Dependencies**: Task 6 (Zeugnis-Upload)
  - **Files**: `src/modules/grades/grades.controller.ts`, `src/modules/grades/grades.service.ts`
  - **Estimated scope**: Medium

- [ ] **Task 15**: DSGVO-Export/Deletion
  - **Description**: `GET :export/datenschutz` exportiert alle Notendaten eines Azubis (Art. 15). `DELETE :datenschutz/:id` Anonimierung (ersetze persönliche Daten durch UUIDs) oder Löschung (Art. 17) mit fachlicher Freigabe. Audit-Log für alle Operationen.
  - **Acceptance criteria**:
    - [ ] DSGVO-Export alle Notendaten enthält
    - [ ] Anonimierungs-Option verfügbar
    - [ ] Audit-Log für Lösch-Anfragen
    - [ ] Nur autorisierte Rollen (HR, Admin)
  - **Verification**: `npm run test`
  - **Dependencies**: Task 17 (Audit)
  - **Files**: `src/modules/grades/grades.controller.ts`, `src/modules/grades/grades.service.ts`
  - **Estimated scope**: Medium

- [ ] **Task 16**: Notification-Integration
  - **Description**: Bei Statusänderungen (`bestaetigt`, `visiert`, `archiviert`) Notification an Azubi erzeugen. `NotificationModule` nutzen. Kategorien: `review`, `deadline`. Priorität: `medium`.
  - **Acceptance criteria**:
    - [ ] Notification bei Statusänderung erstellt
    - [ ] Azubi bekommt Benachrichtigung
    - [ ] `NotificationModule` korrekt integriert
  - **Verification**: Manuell: Status ändern, Notification prüfen
  - **Dependencies**: Task 5, Task 16 (Notification-Modul existiert bereits)
  - **Files**: `src/modules/grades/grades.service.ts`
  - **Estimated scope**: Small

**## Checkpoint: Export & Integration**
- [ ] CSV-Export korrekt
- [ ] PDF-Zeugnis korrekt formatiert
- [ ] DSGVO-Export/Deletion funktioniert
- [ ] Notifications bei Statusänderungen ausgelöst

## Phase 5: Audit, Tests, Dokumentation

- [ ] **Task 17**: Audit-Logging für Noten
  - **Description**: Jeder `create`, `update`, `status-change`, `delete`, `zeugnis-upload` erzeugt `AuditEvent`. IP-Adresse, User-Agent, Aktion, Entity-ID, Details. `AuditModule` nutzen.
  - **Acceptance criteria**:
    - [ ] Alle Grade-Aktionen audit-geloggt
    - [ ] IP, User-Agent, Aktion, Entity-ID in AuditEvent
    - [ ] Audit-Events unveränderbar (append-only)
  - **Verification**: `npm run test`
  - **Dependencies**: Task 1 (AuditEvent-Modell existiert)
  - **Files**: `src/modules/grades/grades.service.ts`
  - **Estimated scope**: Medium

- [ ] **Task 18**: Unit- und Integrationstests
  - **Description**: Tests für Service-Methoden: `create`, `findAll`, `findOne`, `confirm`, `visieren`, `archivieren`, `update`, `remove`, `getGPA`, `getWarnliste`. Test für RBAC-Berechtigungen. Test für Workflow-Guardrails. Test für DSGVO-Export/Deletion. `npm run test` muss alle Tests bestehen.
  - **Acceptance criteria**:
    - [ ] Alle Service-Methoden getestet
    - [ ] RBAC-Berechtigungs-Tests vorhanden
    - [ ] Workflow-Guardrail-Tests vorhanden
    - [ ] DSGVO-Tests vorhanden
    - [ ] `npm run test` bestanden
  - **Verification**: `npm run test`
  - **Dependencies**: All previous tasks
  - **Files**: `tests/grades/`
  - **Estimated scope**: Large (5+ files)

- [ ] **Task 19**: Swagger-Dokumentation
  - **Description**: Alle Endpunkte mit `@ApiOperation`, `@ApiResponse`, `@ApiTags` dokumentiert. `@ApiBearerAuth` auf allen Endpunkten. DTOs mit `@ApiProperty` vollständig. `npm run start:dev` und Swagger-UI unter `/api/docs` prüfen.
  - **Acceptance criteria**:
    - [ ] Alle Endpunkte dokumentiert
    - [ ] DTOs mit vollständigen `@ApiProperty`
    - [ ] Swagger-UI funktionsfähig
  - **Verification**: Manuell: `/api/docs` im Browser prüfen
  - **Dependencies**: Task 2, Task 5
  - **Files**: `src/modules/grades/`
  - **Estimated scope**: Small

- [ ] **Task 20**: Code-Review & Refactoring
  - **Description**: `grade-entries` Modul auf `grades`-Niveau bringen. Unused-DTOs entfernen. Dead-Code aufräumen. Lint- und TypeCheck-Ergebnisse bereinigen. `npm run lint`, `npm run typecheck`.
  - **Acceptance criteria**:
    - [ ] `grade-entries` vollständig mit RBAC, DTOs, Scope-Check
    - [ ] Lint clean
    - [ ] TypeCheck clean
    - [ ] Keine Dead-Codes
  - **Verification**: `npm run lint`, `npm run typecheck`, `npm run build`
  - **Dependencies**: Task 3, Task 18
  - **Files**: `src/modules/grade-entries/`
  - **Estimated scope**: Medium

**## Checkpoint: Complete**
- [ ] Alle Tests bestanden (`npm run test`)
- [ ] Build erfolgreich (`npm run build`)
- [ ] Swagger-Dokumentation vollständig
- [ ] Audit-Log für alle Noten-Aktionen vorhanden
- [ ] Lint und TypeCheck clean
- [ ] Alle Konzept-Anforderungen aus §4.5, §5.4, §5.5 abgedeckt
- [ ] Human Review abgeschlossen
