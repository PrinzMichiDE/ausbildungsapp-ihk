# Implementation Plan: Notenheft Modul maximal ausbauen

## Overview
Das bestehende `grades`-Modul (Notenheft) wird von einem simplen CRUD-Service auf ein vollständiges Notenverwaltungssystem mit Workflow, Statusmaschine, Zeugnis-Upload, GPA-Berechnung, Versionshistorie, Audit-Logging, DSGVO-Konformität und erweiterter Frühwarnung ausgebaut. Das `grade-entries`-Modul wird ebenfalls vollständig überarbeitet.

## Architecture Decisions
- **Workflow-Engine**: Status-Maschine `entwurf → bestaetigt → visiert → archiviert` analog zum Berichtheft-Worksflow, mit `@Post(':id/:action')` Endpoint-Mustern
- **File Upload**: Zeugnisse über `@Up()`-Decorator oder Signed-URL-Ansatz; `zeugnisUrl`-Feld im Grade-Entity nutzen
- **GPA-Berechnung**: Serverseitige gewichtete Durchschnittsberechnung basierend auf `gewichtung` und `gewichtungsKategorie`
- **Audit-Logging**: Alle Statusänderungen und Noten-Erstellungen/Updates im Audit-Log erfassen
- **Versionierung**: Jedes Update erzeugt einen Eintrag in einer `GradeVersion`-Tabelle (analog `ReportVersion`)
- **Export**: CSV-Export als Basis; PDF-Export über bestehende PDF-Infrastruktur
- **DTO-Erweiterung**: Alle Prisma-Entity-Felder müssen in DTOs abgebildet sein; `PartialType` für Updates nutzen

## Task List

### Phase 1: Foundation — Schema, DTOs, Infrastruktur

- [ ] **Task 1**: Prisma Schema erweitern — `GradeVersion`-Modell hinzufügen (versions-Historie für Noten)
- [ ] **Task 2**: DTOs vollständig erweitern — Alle `Grade`-Entity-Felder in `CreateGradeDto`, `GradeResponseDto`, `UpdateGradeDto` aufnehmen; `PartialType` für Updates; `GradeStatus`-Enum-DTO; `GradeTyp`-Enum-DTO
- [ ] **Task 3**: `grade-entries` Modul komplett überarbeiten — DTOs, Service, Controller nach `grades`-Muster; vollständige RBAC-Integration; `GradeEntry` mit vollem Prisma-Schema
- [ ] **Task 4**: Shared DTOs und Enums erstellen — `GradeStatusDto`, `GradeTypDto`, `HalbjahrDto`, `GewichtungskategorieDto`, `PaginationQueryDto` für Noten

**Checkpoint: Foundation**
- [ ] Prisma Migration generiert (`npx prisma migrate dev`)
- [ ] Alle DTOs kompilieren ohne Fehler
- [ ] `grade-entries` Modul funktioniert mit vollständigem CRUD
- [ ] Build erfolgreich (`npm run build`)

### Phase 2: Core Features — Workflow, Statusmaschine, Zeugnis-Upload

- [ ] **Task 5**: Grade-Status-Workflow implementieren — `entwurf → bestaetigt → visiert → archiviert` mit `confirm()`, `visieren()`, `archivieren()` Service-Methoden; Rollen-Berechtigungen (Azubi: entwurf, Ausbilder: bestaetigt, Ausbilder/HR: visiert, Archiviert: unveränderbar)
- [ ] **Task 6**: Zeugnis-Upload-Endpunkt — `POST :id/zeugnis` mit Datei-Upload; `zeugnisUrl` speichern; `GET :id/zeugnis` zum Download; Nur Ausbilder/HR können Zeugnisse hochladen
- [ ] **Task 7**: Grade-Bewertungsworkflow — `POST :id/bewerten` mit Bewertung, Prüfer-ID, Prüfungsdatum; `bewertetVon`, `bewertetAm`, `bewertung` Felder; Nur Ausbilder/HR/Admin
- [ ] **Task 8**: Grade-Wiederholung und Maßnahme — `POST :id/wiederholung` mit `wiederholung: true` und `maßnahme`-Feld; `POST :id/maßnahme` zur Dokumentation von Fördermaßnahmen

**Checkpoint: Core Features**
- [ ] Alle Workflow-Endpunkte funktionieren mit korrekter Rollenprüfung
- [ ] Zeugnis-Upload funktioniert (Datei speichern, URL speichern, Download)
- [ ] Status-Übergänge werden durchgesetzt (z.B. kein Visieren von entwurf)
- [ ] Grade mit Status `archiviert` sind unveränderbar

### Phase 3: Advanced Features — GPA, Versionshistorie, Noten-Tracker

- [ ] **Task 9**: Versionshistorie implementieren — Jeder Update erzeugt `GradeVersion`-Eintrag; `GET :id/versions` gibt Historie zurück; `GET :id/versions/:v1/diff/:v2` für Diff
- [ ] **Task 10**: Gewichteter Durchschnitt (GPA) berechnen — `GET :gpa`-Endpoint; gewichteter Durchschnitt pro Azubi basierend auf `gewichtung` und `gewichtungsKategorie`; Halbjahres-GPA; Gesamt-GPA
- [ ] **Task 11**: Noten-Tracker-Dashboard — `GET :dashboard` liefert strukturierte Übersicht: Halbjahresnoten, Fachübersicht, GPA-Verlauf, Warnstufen; Filterung nach Fach, Halbjahr, Zeitraum
- [ ] **Task 12**: Erweiterte Frühwarnung — `GET :warnliste` erweitert um: Noten < 3 (gut), 3-4 (warnung), > 4 (kritisch); Fach-spezifische Warnungen; Zeitliche Entwicklung; Sortierung nach Dringlichkeit

**Checkpoint: Advanced Features**
- [ ] Versionshistorie korrekt für alle Grade
- [ ] GPA-Berechnung korrekt mit Gewichtung
- [ ] Dashboard liefert alle benötigten Metriken
- [ ] Warnliste zeigt korrekte Kategorien

### Phase 4: Export, Integration, DSGVO

- [ ] **Task 13**: CSV-Export — `GET :export/csv` exportiert Noten einer Abteilung/eines Azubis als CSV; Halbjahres- und Gesamt-Export; `GET :export/csv/:azubiId` pro Azubi
- [ ] **Task 14**: PDF-Export — `GET :export/pdf/:id` generiert PDF-Zeugnis für einzelne Note; `GET :export/pdf/all/:azubiId` Gesamtübersicht als PDF
- [ ] **Task 15**: DSGVO-Export/Deletion — `GET :export/datenschutz` exportiert alle Notendaten eines Azubis (DSGVO Art. 15); `DELETE :datenschutz` Anonmisierung oder Löschung gemäß DSGVO Art. 17; Audit-Log für Lösch-Anfragen
- [ ] **Task 16**: Notification-Integration — Bei Statusänderungen (bestaetigt, visiert, archiviert) Notification an Azubi erzeugen; Frist-Notifications für bevorstehende Zeugnisfristen; `NotificationModule` nutzen

**Checkpoint: Export & Integration**
- [ ] CSV-Export korrekt mit allen Feldern
- [ ] PDF-Zeugnis korrekt formatiert
- [ ] DSGVO-Export/Deletion funktioniert und wird audit-geloggt
- [ ] Notifications bei Statusänderungen ausgelöst

### Phase 5: Audit, Tests, Dokumentation

- [ ] **Task 17**: Audit-Logging für Noten — Jeder `create`, `update`, `status-change`, `delete`, `zeugnis-upload` erzeugt `AuditEvent`; IP-Adresse, User-Agent, Aktion, Entity-ID logged; `AuditModule` nutzen
- [ ] **Task 18**: Unit- und Integrationstests — Tests für Service-Methoden (create, findAll, findOne, status transitions, GPA calc); Test für RBAC-Berechtigungen; Test für Workflow-Guardrails; Test für DSGVO-Export/Deletion; `npm run test`
- [ ] **Task 19**: Swagger-Dokumentation — Alle Endpunkte mit `@ApiOperation`, `@ApiResponse`, `@ApiTags` dokumentiert; `@ApiBearerAuth` auf allen Endpunkten; DTOs mit `@ApiProperty` vollständig; Swagger UI unter `/api/docs` funktionsfähig
- [ ] **Task 20**: Code-Review & Refactoring — `grade-entries` Modul vollständig auf `grades`-Niveau bringen; Unused-DTOs entfernen; Dead-Code aufräumen; Lint- und Type-Check-Ergebnisse bereinigen

**Checkpoint: Complete**
- [ ] Alle Tests bestanden (`npm run test`)
- [ ] Build erfolgreich (`npm run build`)
- [ ] Swagger-Dokumentation vollständig
- [ ] Audit-Log für alle Noten-Aktionen vorhanden
- [ ] Lint und TypeCheck clean
- [ ] Alle Konzept-Anforderungen aus §4.5, §5.4, §5.5 abgedeckt

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Prisma Migration fehlschlägt bei bestehendem Schema | Hoch | Migration mit `synchronize: false` prüfen; Migration vor jeder Änderung generieren; Test-Migration auf lokaler DB |
| Datei-Upload für Zeugnisse nicht funktionsfähig | Mittel | Zunächst Signed-URL-Ansatz; Dateien lokal speichern als Übergangslösung |
| DSGVO-Löschung bricht Referenzen | Hoch | Anonimierung statt Hard-Delete als Standard; Audit-Log für Lösch-Operation |
| GPA-Berechnung bei fehlenden Gewichtungen | Mittel | Default `gewichtung: 1.0`; Fallback auf einfachen Durchschnitt |
| Notification-Integration erfordert Cross-Module-Dependenzen | Mittel | `NotificationModule` ist bereits global registriert; Service-Injektion nutzen |

## Open Questions
- [ ] Soll Zeugnis-Upload über lokale Dateisystem oder Cloud-Speicher (S3/MinIO) erfolgen?
- [ ] Sollen Noten automatisch an das `feedback`-Modul und `reporting`-Modul weitergegeben werden?
- [ ] Welche Dateiformate werden für Zeugnis-Uploads akzeptiert (PDF, PNG, JPG)?
- [ ] Sollen alte Noten (vor der Migration) automatisch in das neue Schema migriert werden?
