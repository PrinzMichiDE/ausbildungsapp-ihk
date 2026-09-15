# Implementation Plan: Ausbildungsmanagement & Organisation — Detailliert

## Overview
Vollständige Implementierung aller im Konzept geforderten Ausbildungsmanagement- & Organisationsfunktionalitäten: Digitales Berichtsheft mit Ausbildungsnachweisen (IHK/HWK-konform), automatisierte Einsatz- & Versetzungsplanung, elektronische Azubiakte, Urlaubsverwaltung, Standort- & Berufsmanagement (70+ Berufe), Talentmanagement mit Kompetenzmodellen und 360°-Feedback, E-Learning-Plattform mit Prüfungsvorbereitung, HR-Integrationen, SSO/2FA, sowie DSGVO/ISO27001-Konformität.

## Architecture Decisions
- **Modularer Aufbau**: 28 neue/enhanced Module; jedes Modul hat eigenes `controller.ts`, `service.ts`, `module.ts`, `dto/`
- **RBAC**: Bestehende `AccessScopeService` + `@Roles()` Guards; Erweiterung in `src/common/constants/roles.ts`
- **API-Vertrag**: REST unter `/api/v1/`; Response `{ data, meta }`; Fehler `{ statusCode, error, message, path, timestamp, correlationId }`; Swagger unter `/api/docs`
- **DB**: Prisma + PostgreSQL + pgvector; `synchronize: false` (Migrations only); UUID Primary Keys; snake_case → camelCase
- **Workflow**: Status-Maschinen für Ausbildungsnachweise (`entwurf → eingereicht → in_pruefung → visiert → archiviert`), Ausbildungspläne (`entwurf → eingereicht → geprüft → genehmigt`), Projekte (`entwurf → eingereicht → in_pruefung → freigegeben → abgelehnt → archiviert`)
- **KI**: Ollama/LiteLLM hinter `AiService`/`LlmGateway` für automatische Berufszuordnung, Kompetenz-Analyse, Prüfungsauswertung
- **Export**: Bestehende `buildSimplePdf()` und CSV-Infrastruktur; Signed URLs für Dateien

## Online-Anforderungen pro Modul

| Modul | Online-Endpunkte | Integrationen | Online-Ressourcen |
|-------|------------------|---------------|-------------------|
| `ausbildungsplan` | 6 CRUD + 3 Workflow + 1 Rahmenlehrplan | IHK-Rahmenplan-API, `Framework`-Modul | IHK-Lernfelder als JSON, Rahmenlehrplan-Dokumente |
| `ausbildungsnachweis` | 8 CRUD + 5 Workflow + 3 Export + 2 Anhänge | `Report`-Modul, `Framework`-Modul, `Notification`-Modul | IHK/HWK-Export-Templates, digitale Signaturen |
| `einsatzplanung` | 3 Planung + 2 Kapazität + 1 Kollision | `Einsatz`-Modell, `Abteilung`-Modell, `Ausbildungsplan` | Gantt/Kanban-Ansicht, Kapazitäts-Daten |
| `versetzungswunsch` | 5 CRUD + 2 Planen + 1 Dashboard | `Versetzungswunsch`-Modell, `Abteilung` | Abteilungs-Dashboard, Kollisionsprüfungen |
| `azubiakte` | 1 Dashboard + 1 Detail + 5 Sub-Views | Alle Module (aggregiert) | Stammdaten, Einsatzhistorie, Dokumente, Abwesenheiten |
| `standort` | 4 CRUD + 3 Berufe + 2 Tags + 1 Kapazität | `Abteilung`-Modell, `Ausbildungsberuf`-Enum | Standort-Datenbank, 70+ Berufe, Tag-System |
| `kompetenz` | 3 CRUD + 1 Bewertung + 1 Profil | `Feedback`-Modul, `Grade`-Modell | Kompetenz-Modelle, Stärken/Schwächen-Analyse |
| `feedback` | 8 CRUD + 3 360° + 2 Gespräch + 1 Noten | `User`-Modell, `Abteilung`-Modell | Bewertungsbögen, Feedback-Gespräche |
| `talentindex` | 1 Dashboard + 1 Detail + 1 Warnung | `Grade`-Modell, `Feedback`-Modul, `Abwesenheit`-Modul | Learning-Analytics, High-Potential-Kennzahlen |
| `lms` | 4 Fortschritt + 2 Lernpfade + 1 Dashboard | `Course`/`Task`/`Framework`-Module | Lerninhalte, Lernzielkataloge, 2000+ Videos |
| `pruefungsvorbereitung` | 3 Simulation + 1 Auswertung + 1 Statistik | `Pruefung`-Modell, `PruefungsMeilenstein` | IHK-Prüfungssimulationen, Auswertungs-Engine |
| `gamification` | 4 Autoren + 2 Quiz + 1 Badge | `Badge`-Modell, `UserBadge`-Modell | Leitfäden, Quizze, Lernpfade, Leaderboard |
| `nachricht` | 2 Senden + 1 Filtern + 1 Thread | `Notification`-Modul, `User`-Modell | Direktnachrichten, Aufgabenverteilung |
| `schnittstellen` | 3 CRUD + 2 Sync + 1 Status | Personio, DATEV, SAP, Workday, HR Works | OAuth2/Webhook-Konfiguration, APIs |
| `hr-integration` | 3 Personio + 2 Recruiting + 1 Talent | Personio API, `users`, `departments` | Personalakte, Recruiting, Talent Management |
| `sicherheit` | 1 Audit + 1 DSGVO + 1 Konfiguration | `AuditEvent`-Modell, `DatenschutzRequest` | ISO/IEC 27001, DSGVO-Compliance, Verschlüsselung |
| `ausbilder-dashboard` | 1 Dashboard + 1 Warnliste | Alle Module (aggregiert) | Lernaktivität, Fortschritte, Wissenslücken |
| `rahmenlehrplan` | 1 Verknüpfung + 1 Beruf | `Ausbildungsplan`-Modell, `Report`-Modell | Rahmenlehrplan-Daten, Wochenbericht-Zuordnung |

## Task List

### Phase 1: Foundation — Schema-Erweiterung, DTOs, Bestands-Module aufwerten

- [ ] **Task 1**: Prisma Schema erweitern
   - **Beschreibung**: Neue Modelle und Enums: `Ausbildungsberuf` (70+ Berufe: Systemintegration, Anwendungsentwicklung, Daten-Prozessanalyse, Digitale Vernetzung + 70 weitere), `Standort`, `Tag`, `Kompetenzprofil`, `Schnittstellenkonfiguration`, `Ausbildungsnachweis`, `Lernpfad`, `Pruefungssimulation`, `LernzeitTracker`, `Kompetenzabdeckung`, `Eskalation`, `Abteilungsuebergabe`, `Kapazitaetswarnung`, `Mentoring`, `FAQ`, `CustomCourse`. Bestehende Modelle erweitern: `Ausbildungsplan` um `rahmenlehrplanId`, `Abteilung` um `standortId`, `Einsatz` um `skillLevel`, `Abwesenheit` um `urlaubsanspruch`, `Report` um `ausbildungsnachweisId`.
   - **Online-Anforderungen**: Alle neuen Felder als Prisma-Modelle mit korrekten Relationen; UUID-Primary-Keys; `@map()` für snake_case; Migration generiert.
   - **Akzeptanzkriterien**:
     - [ ] `Ausbildungsberuf`-Enum mit 70+ Berufen
     - [ ] Alle neuen Modelle mit korrekten Feldern und Relationen
     - [ ] Migration generiert (`npx prisma migrate dev`)
     - [ ] Prisma Client kompiliert ohne Fehler
     - [ ] `Ausbildungsplan` und `Abteilung` um neue Felder erweitert
   - **Verification**: `npx prisma migrate dev`, `npx prisma generate`, `npm run build`
   - **Dependencies**: None
   - **Files**: `prisma/schema.prisma`, `prisma/migrations/`
   - **Estimated scope**: Large (5+ files)

- [ ] **Task 2**: DTOs und Shared-Enums für alle neuen Module
   - **Beschreibung**: Alle DTOs mit `class-validator` und `@ApiProperty`. Shared-Enums in `src/common/enums/`: `AusbildungsberufDto`, `StandortDto`, `KompetenzDto`, `LernpfadDto`, `PruefungssimulationDto`, `SchnittstellenDto`, `EinsatzPlanungDto`, `VersetzungDto`, `AusbildungsnachweisDto`, `AuszubildenderDto`. `PaginationQueryDto` erweitern für alle Module.
   - **Online-Anforderungen**: Alle DTOs mit `@ApiProperty` für Swagger; `class-validator` Decorators; `PartialType` für Updates; Enums als separate DTO-Klassen; alle Felder vom Prisma-Schema abgebildet.
   - **Akzeptanzkriterien**:
     - [ ] Alle neuen DTOs mit `class-validator` und `@ApiProperty`
     - [ ] `PartialType` für alle Update-DTOs
     - [ ] Shared-Enums in `src/common/enums/`
     - [ ] `npm run build` kompiliert ohne Fehler
   - **Verification**: `npm run build`
   - **Dependencies**: Task 1
   - **Files**: `src/common/dto/`, `src/common/enums/`, `src/modules/*/dto/`
   - **Estimated scope**: Large (5+ files)

- [ ] **Task 3**: `ausbildungsplan`-Modul vollständig implementieren
   - **Beschreibung**: Bestehendes Stub-Modul mit vollständigem Controller (`GET /v1/ausbildungsplan`, `POST /v1/ausbildungsplan`, `GET /v1/ausbildungsplan/:id`, `PUT /v1/ausbildungsplan/:id`, `DELETE /v1/ausbildungsplan/:id`), Service mit `AccessScopeService`, CRUD-Endpunkten, Status-Workflow (`entwurf → eingereicht → geprüft → genehmigt`), Rahmenlehrplan-Verknüpfung (`GET /v1/ausbildungsplan/:id/rahmenlehrplan`), IHK-Mapping. Rollen: Azubi (eigene Pläne), Ausbilder (alle), HR (lesen).
   - **Online-Anforderungen**: 6 Endpunkte mit korrektem RBAC; Rahmenlehrplan-Verknüpfung zu IHK-Lernfeldern; IHK-Mapping als JSON in `Ausbildungsplan.inhalte`; Audit-Logging für alle Statusänderungen.
   - **Akzeptanzkriterien**:
     - [ ] Alle 6 CRUD-Endpunkte mit `@Roles()` Guards
     - [ ] Status-Workflow mit `POST :id/einreichen`, `POST :id/pruefen`, `POST :id/genehmigen`
     - [ ] Rahmenlehrplan-Verknüpfung funktioniert
     - [ ] `npm run build` erfolgreich
     - [ ] Swagger-Dokumentation vorhanden
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 2
   - **Files**: `src/modules/ausbildungsplan/ausbildungsplan.controller.ts`, `src/modules/ausbildungsplan/ausbildungsplan.service.ts`, `src/modules/ausbildungsplan/ausbildungsplan.module.ts`, `src/modules/ausbildungsplan/dto/`
   - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 4**: `ausbildungsvertrag`-Modul vollständig implementieren
   - **Beschreibung**: Bestehendes Stub-Modul mit vollständigem Controller (`GET /v1/ausbildungsvertrag`, `POST /v1/ausbildungsvertrag`, `GET /v1/ausbildungsvertrag/:id`, `PUT /v1/ausbildungsvertrag/:id`, `DELETE /v1/ausbildungsvertrag/:id`), Service mit `AccessScopeService`, Vertragsstatus-Workflow (`aktiv → beendet → archiviert`), Probezeit-Berechnung, Versetzungsbezogene Vertragsanpassungen.
   - **Online-Anforderungen**: 6 Endpunkte; Vertragsstatus-Workflow durchgesetzt; `Ausbildungsvertrag` mit `status`, `probezeitMonate`, `dauerMonate`, `verkuerzungMonate`, `verlaengerungGrund`, `vertragsUrl`, `version`, `betriebsnummer`.
   - **Akzeptanzkriterien**:
     - [ ] Alle 6 CRUD-Endpunkte mit Rollenprüfung
     - [ ] Status-Workflow korrekt durchgesetzt
     - [ ] DTOs mit vollständiger Validierung
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 2
   - **Files**: `src/modules/ausbildungsvertrag/ausbildungsvertrag.controller.ts`, `src/modules/ausbildungsvertrag/ausbildungsvertrag.service.ts`
   - **Estimated scope**: Medium

- [ ] **Task 5**: `absence`-Modul erweitern — Urlaubsverwaltung
   - **Beschreibung**: Erweiterung um Urlaubsansprüche-Berechnung (`GET /v1/abwesenheit/ansprueche/:azubiId`), Abwesenheitsstatistiken (`GET /v1/abwesenheit/statistik/:azubiId`), automatische Urlaubsplanung (`POST /v1/abwesenheit/planen`), DSGVO-konforme Löschung. Integration mit Personio für Abwesenheits-Sync (`POST /v1/abwesenheit/personio/sync`). `CreateUrlaubsantragDto` mit `typ`, `von`, `bis`, `grund`, `urlaubsart`.
   - **Online-Anforderungen**: Urlaubsansprüche-Berechnung basierend auf `Ausbildungsvertrag`-Dauer; Personio-Integration für automatischen Sync; iCal-Import für Berufsschul-Zeiten; Abwesenheitsstatistiken mit Filterung (Typ, Zeitraum).
   - **Akzeptanzkriterien**:
     - [ ] Urlaubsansprüche automatisch berechnet
     - [ ] Personio-Sync funktioniert
     - [ ] Abwesenheitsstatistiken korrekt
     - [ ] DSGVO-konforme Löschung
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 2
   - **Files**: `src/modules/absence/` (erweitern)
   - **Estimated scope**: Medium

- [ ] **Task 6**: `departments`-Modul erweitern — Standort-Verknüpfung
   - **Beschreibung**: `Abteilung` um `standortId` erweitern. `GET /v1/abteilung/:id/standort` liefert Standort-Details. `GET /v1/abteilung/:id/kapazitaet` prüft Kapazität. `GET /v1/abteilung` mit Standort-Filterung. `POST /v1/abteilung/mit-arbeitsplaetzen` erstellt Abteilung mit Standort- und Arbeitsplatz-Daten.
   - **Online-Anforderungen**: Abteilungen mit Standort verknüpft; Kapazitätsprüfung basierend auf `Einsatz`-Daten; Standort-basiertes Scoping für Ausbildungsbeauftragte.
   - **Akzeptanzkriterien**:
     - [ ] Abteilungen mit Standort verknüpft
     - [ ] Kapazitätsprüfung pro Abteilung
     - [ ] Standort-Filterung in `GET /v1/abteilung`
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1
   - **Files**: `src/modules/departments/` (erweitern)
   - **Estimated scope**: Small

**Checkpoint: Foundation**
- [ ] Prisma Migration generiert und angewendet
- [ ] Alle DTOs kompilieren ohne Fehler
- [ ] `ausbildungsplan` und `ausbildungsvertrag` mit vollständigen CRUD-Endpunkten
- [ ] `absence` mit Urlaubsverwaltung funktionsfähig
- [ ] `departments` mit Standort-Verknüpfung
- [ ] `npm run build` erfolgreich
- [ ] Lint und TypeCheck clean
- [ ] Review mit Human vor Proceeding

### Phase 2: Core Features — Ausbildungsnachweise, Einsatzplanung, Azubiakte

- [ ] **Task 7**: Digitales Berichtsheft / Ausbildungsnachweise
   - **Beschreibung**: Neues `ausbildungsnachweis`-Modul mit: `Ausbildungsnachweis`-Entity (neben `Report`); Status-Workflow (`entwurf → eingereicht → in_pruefung → visiert → archiviert`); Freigabe-Workflow; Digitale Signatur (`signiertVon`, `signiertAm`); Kommentar- und Exportfunktionen (IHK/HWK-konform); Rahmenlehrplan-Verknüpfung; Anhänge & Medien; Chat- & Notizfunktion pro Bericht. 16 Endpunkte: CRUD (8), Workflow (5), Export (3).
   - **Online-Anforderungen**:
     - `GET /v1/ausbildungsnachweis` — Liste mit Filter (Status, Beruf, Azubi, Zeitraum)
     - `POST /v1/ausbildungsnachweis` — Erstellung mit Validierung
     - `GET /v1/ausbildungsnachweis/:id` — Detailansicht
     - `PUT /v1/ausbildungsnachweis/:id` — Update
     - `DELETE /v1/ausbildungsnachweis/:id` — Löschung
     - `POST :id/einreichen` — Einreichung
     - `POST :id/visieren` — Visierung (digitales Signatur)
     - `POST :id/archivieren` — Archivierung
     - `POST :id/kommentar` — Kommentar
     - `POST :id/anhang` — Anhang-Upload
     - `GET :id/anhaenge` — Anhänge auflisten
     - `GET :id/kommentare` — Kommentare
     - `GET :id/rahmenlehrplan` — Rahmenlehrplan-Verknüpfung
     - `GET :id/export/pdf` — IHK/HWK-PDF-Export
     - `GET :id/export/csv` — CSV-Export
     - `POST :id/chat` — Chat-Nachricht
   - **Akzeptanzkriterien**:
     - [ ] Alle 16 Endpunkte mit korrektem RBAC
     - [ ] IHK/HWK-konformes PDF-Export formatiert
     - [ ] Digitale Signatur serverseitig erzeugt
     - [ ] Anhang-Upload mit Signed URLs
     - [ ] Chat- & Notizfunktion funktioniert
     - [ ] Archivierte Nachweise unveränderbar
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 2, Task 3
   - **Files**: `src/modules/ausbildungsnachweis/` (controller, service, module, dto)
   - **Estimated scope**: Large (5+ files)

- [ ] **Task 8**: Korrektur- & Prüf-Workflow für Ausbildungsnachweise
   - **Beschreibung**: `POST :id/korrigieren` mit Kommentar und Korrektur-Hinweis; `POST :id/pruefen` mit Bewertung (`bewertung`, `prueferId`, `pruefungsdatum`); `POST :id/freigeben` für Kammerprüfung-Freigabe; `POST :id/ablehnen` mit Begründung; `POST :id/ruckstand` für Rückstands-Ampel. Audit-Logging für alle Workflow-Schritte. Notification bei Statusänderungen an Azubi und Ausbilder.
   - **Online-Anforderungen**: Korrektur-Workflow mit Kommentaren und Dokumentation; Prüfungs-Bewertung mit Prüfer-ID und Datum; Freigabe nur durch autorisierte Rollen (Ausbilder/HR); Audit-Events unveränderbar; Rückstands-Ampel (grün/gelb/rot) basierend auf Fristen.
   - **Akzeptanzkriterien**:
     - [ ] Korrektur-Workflow mit Kommentaren
     - [ ] Prüfungs-Bewertung mit Prüfer-ID
     - [ ] Freigabe nur durch autorisierte Rollen
     - [ ] Audit-Events für alle Schritte
     - [ ] Rückstands-Ampel korrekt
     - [ ] `npm run test` bestanden
   - **Verification**: `npm run test`
   - **Dependencies**: Task 7
   - **Files**: `src/modules/ausbildungsnachweis/ausbildungsnachweis.service.ts` (erweitern)
   - **Estimated scope**: Medium

- [ ] **Task 9**: Automatisierte Einsatzplanung
   - **Beschreibung**: Neues `einsatzplanung`-Modul: `POST /v1/einsatz/planen` mit Knopfdruck; Berücksichtigung sachlicher & zeitlicher Gliederung; Manuelle Steuerung (`POST /v1/einsatz/uebernehmen`); Kapazitätsprüfung pro Abteilung (`GET /v1/einsatz/kapazitaet/:abteilungId`); Kollisionswarnungen (`GET /v1/einsatz/kollisionen`). `EinsatzPlanungService` mit `AccessScopeService`. `EinsatzPlanungDto` mit Kriterien (`beruf`, `abteilungId`, `von`, `bis`, `skillLevel`).
   - **Online-Anforderungen**:
     - `POST /v1/einsatz/planen` — Generiert Einsatzplan basierend auf Kriterien
     - `POST /v1/einsatz/uebernehmen` — Manuelle Übernahme des Plans
     - `GET /v1/einsatz/kapazitaet/:abteilungId` — Kapazitätsprüfung
     - `GET /v1/einsatz/kollisionen` — Kollisionswarnungen
     - `GET /v1/einsatz/dashboard` — Dashboard-Übersicht
     - Cron-Job für automatische Neuprozessierung
   - **Akzeptanzkriterien**:
     - [ ] Automatische Planung mit sachlicher & zeitlicher Gliederung
     - [ ] Kapazitätsprüfung korrekt (Azubis pro Abteilung)
     - [ ] Kollisionswarnungen funktionieren
     - [ ] Manuelle Übernahme möglich
     - [ ] Cron-Job funktioniert
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 3, Task 6
   - **Files**: `src/modules/einsatzplanung/` (controller, service, module, dto)
   - **Estimated scope**: Large (5+ files)

- [ ] **Task 10**: Versetzungs- & Einsatzplanung
   - **Beschreibung**: `POST /v1/versetzung/planen` mit Abteilungswechsel; `POST /v1/versetzung/wunsch` für Azubi-Wünsche (`Versetzungswunsch`-Modell); `POST /v1/versetzung/stornieren`; Kollisionsprüfungen; Integration mit `versetzungswunsch`-Modul; Dashboard-Ansicht `GET /v1/versetzung/dashboard`. `Abteilungsuebergabe`-Entität für Übergabeprotokolle bei Abteilungswechsel.
   - **Online-Anforderungen**:
     - `POST /v1/versetzung/planen` — Automatische Versetzungsplanung
     - `POST /v1/versetzung/wunsch` — Azubi-Wunsch einreichen
     - `POST /v1/versetzung/stornieren` — Versetzung stornieren
     - `GET /v1/versetzung/dashboard` — Dashboard mit allen Versetzungen
     - `GET /v1/versetzung/:id/uebergabe` — Übergabeprotokoll
     - Kollisionsprüfungen basierend auf `Einsatz`-Daten
   - **Akzeptanzkriterien**:
     - [ ] Versetzungsplanung mit Kollisionsprüfungen
     - [ ] Azubi-Wünsche einreichbar
     - [ ] Dashboard zeigt alle Versetzungen
     - [ ] Übergabeprotokoll verfügbar
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run test`
   - **Dependencies**: Task 1, Task 9
   - **Files**: `src/modules/versetzungsplanung/` (controller, service, module, dto)
   - **Estimated scope**: Medium

- [ ] **Task 11**: Elektronische Azubiakte & Dashboard
   - **Beschreibung**: Neues `azubiakte`-Modul: Zentrale Übersicht über Stammdaten, Einsatzhistorie, Dokumente, Abwesenheiten, Entwicklungsstände. `GET /v1/azubiakte/dashboard` mit aggregierten Daten (Fortschritt, Noten, Abwesenheiten, Kompetenzen). `GET /v1/azubiakte/:id` mit vollständigem Profil (Stammdaten + alle Unter-Kategorien). Rollengefilterte Ansichten: Azubi (eigene), Ausbilder (Azubis der Abteilung), HR (alle).
   - **Online-Anforderungen**:
     - `GET /v1/azubiakte/dashboard` — Aggregierte Dashboard-Daten
     - `GET /v1/azubiakte/:id` — Vollständiges Profil
     - `GET /v1/azubiakte/:id/stammdaten` — Persönliche Daten
     - `GET /v1/azubiakte/:id/einsaetze` — Einsatzhistorie
     - `GET /v1/azubiakte/:id/dokumente` — Dokumente & Zertifikate
     - `GET /v1/azubiakte/:id/abwesenheiten` — Abwesenheitsübersicht
     - `GET /v1/azubiakte/:id/entwicklung` — Entwicklungsstände
     - Rollenbasierte Filterung (Azubi, Ausbilder, HR)
   - **Akzeptanzkriterien**:
     - [ ] Dashboard zeigt alle aggregierten Daten korrekt
     - [ ] Alle 7 Sub-Views verfügbar
     - [ ] Rollenbasierte Filterung korrekt
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, manueller Test
   - **Dependencies**: Task 1, Task 7, Task 9, Task 10
   - **Files**: `src/modules/azubiakte/` (controller, service, module, dto)
   - **Estimated scope**: Large (5+ files)

**Checkpoint: Core Features**
- [ ] Ausbildungsnachweise mit vollständigem Workflow (16 Endpunkte)
- [ ] Korrektur- & Prüf-Workflow funktioniert
- [ ] Automatisierte Einsatzplanung mit Kapazitätsprüfung
- [ ] Versetzungsplanung mit Kollisionswarnungen
- [ ] Azubiakte-Dashboard zeigt alle Daten korrekt
- [ ] `npm run build` erfolgreich
- [ ] Lint und TypeCheck clean
- [ ] Review mit Human vor Proceeding

### Phase 3: Talent Management & Leistungsbeurteilung

- [ ] **Task 12**: Kompetenzmodelle
   - **Beschreibung**: Neues `kompetenzprofil`-Modul: `Kompetenzprofil`-Entity mit Fach- und Sozialkompetenzen; Stärken- & Schwächenprofile; Vordefinierte & individuell anpassbare Modelle. Endpunkte: `POST /v1/kompetenz/erstellen`, `PUT /v1/kompetenz/:id`, `GET /v1/kompetenz/:azubiId`, `POST /v1/kompetenz/bewerten`. Integration mit `feedback`-Modul und `Grade`-Modell. `Kompetenzabdeckung`-Entity für Stunden-Vergleich (Soll vs. Ist).
   - **Online-Anforderungen**:
     - `POST /v1/kompetenz/erstellen` — Neues Kompetenzprofil
     - `GET /v1/kompetenz/:azubiId` — Kompetenzprofil anzeigen
     - `PUT /v1/kompetenz/:id` — Kompetenzprofil aktualisieren
     - `POST /v1/kompetenz/bewerten` — Bewertung durch Ausbilder
     - `GET /v1/kompetenz/:azubiId/staerken` — Stärkenprofil
     - `GET /v1/kompetenz/:azubiId/schwaechen` — Schwächenprofil
     - `GET /v1/kompetenz/modelle` — Vordefinierte Modelle auflisten
     - `POST /v1/kompetenz/abdeckung` — Kompetenzabdeckung berechnen
   - **Akzeptanzkriterien**:
     - [ ] Kompetenzprofile erstellbar und bewertbar
     - [ ] Stärken- und Schwächenprofile korrekt generiert
     - [ ] Vordefinierte Modelle verfügbar
     - [ ] Kompetenzabdeckung korrekt berechnet
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 2
   - **Files**: `src/modules/kompetenz/` (controller, service, module, dto, entity)
   - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 13**: 360°-Feedback & Beurteilungen
   - **Beschreibung**: Erweiterung des `feedback`-Moduls: `POST /v1/feedback/360` für vollständiges 360°-Feedback (Selbst- + Fremdeinschätzung); `POST /v1/feedback/beurteilungsgespräch` mit Termin, Ergebnissen, Vereinbarungen; Notenerfassung (`POST /v1/feedback/noten`); `FeedbackGespraech`-Erweiterung mit vollständiger Durchführung. `Entwicklungsgespräch`-Entity für terminierte Gespräche.
   - **Online-Anforderungen**:
     - `POST /v1/feedback/360` — 360°-Feedback mit Selbst- und Fremdeinschätzung
     - `GET /v1/feedback/360/:azubiId` — 360°-Ergebnisse anzeigen
     - `POST /v1/feedback/beurteilungsgespräch` — Neues Beurteilungsgespräch
     - `GET /v1/feedback/beurteilungsgespräch/:id` — Gesprächsdetail
     - `POST /v1/feedback/beurteilungsgespräch/:id/vereinbarungen` — Vereinbarungen hinzufügen
     - `POST /v1/feedback/noten` — Noten erfassen
     - `GET /v1/feedback/noten/:azubiId` — Notenübersicht
     - `POST /v1/feedback/abteilungsbewertung` — Abteilungsbewertung
   - **Akzeptanzkriterien**:
     - [ ] 360°-Feedback mit Selbst- und Fremdeinschätzung
     - [ ] Beurteilungsgespräch mit Termin und Vereinbarungen
     - [ ] Notenerfassung korrekt
     - [ ] Rollenprüfung korrekt (Azubi, Ausbilder, HR)
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run test`
   - **Dependencies**: Task 1, Task 12
   - **Files**: `src/modules/feedback/` (erweitern: controller, service, dto)
   - **Estimated scope**: Medium

- [ ] **Task 14**: Talentindex
   - **Beschreibung**: Neues `talentindex`-Modul: Learning-Analytics-Kennzahl zur datenbasierten Identifikation von High-Potentials. Kennzahlen: Notendurchschnitt, Kompetenzbewertung, Feedback-Scores, Abwesenheitsrate, Ausbildungsfortschritt. `GET /v1/talentindex/dashboard` mit gefilterten Ergebnissen. `GET /v1/talentindex/:azubiId` für Einzelanalyse. Algorithmus zur High-Potential-Identifikation basierend auf Gewichtung der Kennzahlen.
   - **Online-Anforderungen**:
     - `GET /v1/talentindex/dashboard` — Dashboard mit High-Potentials
     - `GET /v1/talentindex/:azubiId` — Einzelanalyse mit allen Kennzahlen
     - `GET /v1/talentindex/warnliste` — Erweiterte Frühwarnung
     - `GET /v1/talentindex/kennzahlen` — Kennzahlen-Konfiguration
     - Filterung nach Abteilung, Beruf, Ausbildungsjahr
     - Sortierung nach Dringlichkeit
   - **Akzeptanzkriterien**:
     - [ ] Dashboard zeigt High-Potentials korrekt
     - [ ] Einzelanalyse mit allen Kennzahlen
     - [ ] Algorithmus zur Identifikation funktioniert
     - [ ] Rollenprüfung (Ausbilder, HR, Admin)
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 12, Task 13
   - **Files**: `src/modules/talentindex/` (controller, service, module, dto)
   - **Estimated scope**: Medium (3-5 files)

**Checkpoint: Talent Management**
- [ ] Kompetenzprofile erstellbar und bewertbar
- [ ] 360°-Feedback mit Selbst- und Fremdeinschätzung funktioniert
- [ ] Talentindex identifiziert High-Potentials korrekt
- [ ] Alle Dashboards liefern aggregierte Daten
- [ ] `npm run build` erfolgreich
- [ ] Review mit Human vor Proceeding

### Phase 4: E-Learning & Prüfungsvorbereitung

- [ ] **Task 15**: Integrierte Lernplattform (LMS)
   - **Beschreibung**: Erweiterung des `learning-content`-Moduls um Lernpfade und Fortschrittsverfolgung. `GET /v1/lms/lernpfade/:beruf` für Beruf-spezifische Pfade; `POST /v1/lms/fortschritt` für Lernfortschrittsverfolgung (`LernzeitTracker`); `GET /v1/lms/dashboard` mit Fortschrittsübersicht; `GET /v1/lms/kompetenzabdeckung/:azubiId`. Integration mit 2.000+ Videos, 1.500+ Lektionen, Lernkarteikarten über `Course`/`Task`/`Framework`.
   - **Online-Anforderungen**:
     - `GET /v1/lms/lernpfade/:beruf` — Lernpfade für Beruf
     - `GET /v1/lms/lernpfade/:beruf/:courseId` — Lernpfad-Detail
     - `POST /v1/lms/fortschritt` — Lernfortschritt erfassen
     - `GET /v1/lms/fortschritt/:azubiId` — Fortschrittsübersicht
     - `GET /v1/lms/dashboard` — LMS-Dashboard
     - `GET /v1/lms/kompetenzabdeckung/:azubiId` — Kompetenzabdeckung
     - `GET /v1/lms/kurse` — Alle Kurse filtern
     - `GET /v1/lms/videos` — Videos mit Pagination
   - **Akzeptanzkriterien**:
     - [ ] Lernpfade pro Beruf verfügbar (70+)
     - [ ] Lernfortschritt wird erfasst und aggregiert
     - [ ] Dashboard zeigt Fortschritt korrekt
     - [ ] Kompetenzabdeckung korrekt berechnet
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 2
   - **Files**: `src/modules/learning-content/` (erweitern: controller, service, dto)
   - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 16**: Prüfungsvorbereitung
   - **Beschreibung**: Neues `pruefungsvorbereitung`-Modul: Spezifische Module und Prüfungssimulationen; Automatische Auswertung nach IHK-Standard. Endpunkte: `POST /v1/pruefung/simulation/:beruf` für Prüfungsimulation; `POST /v1/pruefung/auswertung` mit automatischer Bewertung; `GET /v1/pruefung/statistik/:azubiId` mit Stärken/Schwächen-Profil; `GET /v1/pruefung/meilensteine/:azubiId` für Meilensteine. Integration mit `Pruefung`-Modell und `PruefungsMeilenstein`.
   - **Online-Anforderungen**:
     - `POST /v1/pruefung/simulation/:beruf` — Prüfungssimulation generieren
     - `POST /v1/pruefung/auswertung` — Automatische Auswertung nach IHK-Standard
     - `GET /v1/pruefung/statistik/:azubiId` — Stärken/Schwächen-Profil
     - `GET /v1/pruefung/meilensteine/:azubiId` — Prüfungs-Meilensteine
     - `POST /v1/pruefung/anmelden` — Prüfung anmelden
     - `GET /v1/pruefung/:id` — Prüfungs-Detail
   - **Akzeptanzkriterien**:
     - [ ] Prüfungssimulationen pro Beruf verfügbar
     - [ ] Automatische Auswertung nach IHK-Standard
     - [ ] Stärken/Schwächen-Profil korrekt
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run test`
   - **Dependencies**: Task 1, Task 15
   - **Files**: `src/modules/pruefungsvorbereitung/` (controller, service, module, dto)
   - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 17**: Autoren-Tool & Gamification
   - **Beschreibung**: Erweiterung des `gamification`-Moduls: Eigene Unterlagen erstellen; Quizze erstellen; Interaktive Lernpfade gestalten. Endpunkte: `POST /v1/autoren/leitfaden` für eigene Inhalte; `POST /v1/autoren/quiz` für Quiz-Erstellung; `POST /v1/autoren/lernpfad` für Lernpfad-Erstellung; `GET /v1/autoren/meine` für eigene Inhalte. Gamification-Integration mit Badge-System und Leaderboard (`GET /v1/gamification/leaderboard`). `CustomCourse`-Entity für manuell erstellte Kurse.
   - **Online-Anforderungen**:
     - `POST /v1/autoren/leitfaden` — Eigenen Leitfaden erstellen
     - `POST /v1/autoren/quiz` — Quiz erstellen
     - `POST /v1/autoren/lernpfad` — Lernpfad erstellen
     - `GET /v1/autoren/meine` — Eigene Inhalte auflisten
     - `GET /v1/gamification/leaderboard` — Leaderboard
     - `GET /v1/gamification/badges/:azubiId` — Badges anzeigen
     - `POST /v1/gamification/badge/vergeben` — Badge vergeben
   - **Akzeptanzkriterien**:
     - [ ] Eigene Leitfäden, Quizze und Lernpfade erstellbar
     - [ ] Badge-System funktioniert
     - [ ] Leaderboard zeigt Top-Azubis
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 15
   - **Files**: `src/modules/gamification/` (erweitern)
   - **Estimated scope**: Medium

**Checkpoint: E-Learning**
- [ ] LMS mit Lernpfaden für 70+ Berufe funktioniert
- [ ] Prüfungsvorbereitung mit Simulation und automatischer Auswertung
- [ ] Autoren-Tool für eigene Inhalte funktioniert
- [ ] Gamification mit Badge-System und Leaderboard integriert
- [ ] `npm run build` erfolgreich
- [ ] Review mit Human vor Proceeding

### Phase 5: Standort- & Tag-Management, Ausbilder-Dashboard, Kommunikation

- [ ] **Task 18**: Standort- & Tag-Management
   - **Beschreibung**: Neues `standort`-Modul: Verwaltung mehrerer Standorte; Abteilungen pro Standort; Über 70 Ausbildungsberufe pro Standort. Endpunkte: `GET /v1/standort` mit allen Standorten; `POST /v1/standort` zum Erstellen; `GET /v1/standort/:id` für Detail; `GET /v1/standort/:id/berufe` für Berufe pro Standort; `GET /v1/standort/:id/tags` für Tags; `POST /v1/standort/:id/tag` zum Erstellen; `POST /v1/standort/:id/kapazitaet` für Kapazitätsprüfung; `GET /v1/standort/:id/abteilungen`.
   - **Online-Anforderungen**:
     - `GET /v1/standort` — Alle Standorte auflisten
     - `POST /v1/standort` — Neuen Standort erstellen
     - `GET /v1/standort/:id` — Standort-Detail
     - `PUT /v1/standort/:id` — Standort aktualisieren
     - `DELETE /v1/standort/:id` — Standort löschen
     - `GET /v1/standort/:id/berufe` — Berufe pro Standort (70+)
     - `POST /v1/standort/:id/tag` — Tag erstellen
     - `GET /v1/standort/:id/tags` — Tags auflisten
     - `GET /v1/standort/:id/kapazitaet` — Kapazitätsprüfung
     - Standort-basiertes Scoping für Ausbildungsbeauftragte
   - **Akzeptanzkriterien**:
     - [ ] Standorte erstellbar und auflistbar
     - [ ] 70+ Berufe pro Standort korrekt zugeordnet
     - [ ] Tags verfügbar und filterbar
     - [ ] Kapazitätsprüfung pro Standort
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 6
   - **Files**: `src/modules/standort/` (controller, service, module, dto)
   - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 19**: Ausbilder-Dashboard
   - **Beschreibung**: Neues `ausbilder-dashboard`-Modul: Einblick in Lernaktivität, Fortschritte und Wissenslücken der Azubis. `GET /v1/ausbilder-dashboard` mit Aggregation; Filter nach Abteilung, Azubi, Zeitraum; Wissenslücken-Analyse basierend auf Noten, Feedback und LMS-Daten; `GET /v1/ausbilder-dashboard/warnliste` für Ausbilder mit kritischen Azubis; `GET /v1/ausbilder-dashboard/kohorten` für Kohorten-Vergleich.
   - **Online-Anforderungen**:
     - `GET /v1/ausbilder-dashboard` — Dashboard mit Aggregation
     - `GET /v1/ausbilder-dashboard/lernaktivitaet` — Lernaktivitäts-Übersicht
     - `GET /v1/ausbilder-dashboard/wissensluecken` — Wissenslücken-Analyse
     - `GET /v1/ausbilder-dashboard/warnliste` — Warnliste für kritische Azubis
     - `GET /v1/ausbilder-dashboard/kohorten` — Kohorten-Vergleich
     - `GET /v1/ausbilder-dashboard/filter` — Filter-Optionen
     - Rollen: Ausbilder, Ausbildungsbeauftragter, HR, Admin
   - **Akzeptanzkriterien**:
     - [ ] Dashboard zeigt Lernaktivität und Fortschritte
     - [ ] Wissenslücken-Analyse korrekt
     - [ ] Warnliste für kritische Azubis funktioniert
     - [ ] Kohorten-Vergleich verfügbar
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 11, Task 12, Task 14, Task 15
   - **Files**: `src/modules/ausbilder-dashboard/` (controller, service, module, dto)
   - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 20**: Rahmenlehrplan-Verknüpfung & Kommunikationsnetzwerk
   - **Beschreibung**: `POST /v1/rahmenlehrplan/verknüpfen` für Wochenbericht-zu-Rahmenlehrplan-Zuordnung; `GET /v1/rahmenlehrplan/:beruf` für Rahmenlehrplan-Daten. Neues `nachricht`-Modul: Direkte Aufgabenverteilung und Ad-hoc-Kommunikation. Endpunkte: `POST /v1/nachricht/senden` mit Empfänger und Inhalt; `GET /v1/nachricht/gefiltert` mit Thread-Ansicht; `GET /v1/nachricht/ungelesen` für ungelesene Anzahl; `POST /v1/nachricht/antwort` als Thread-Antwort.
   - **Online-Anforderungen**:
     - `POST /v1/rahmenlehrplan/verknüpfen` — Wochenbericht zu Rahmenlehrplan verknüpfen
     - `GET /v1/rahmenlehrplan/:beruf` — Rahmenlehrplan-Daten
     - `POST /v1/nachricht/senden` — Nachricht senden
     - `GET /v1/nachricht/gefiltert` — Gefilterte Nachrichten
     - `GET /v1/nachricht/ungelesen` — Ungelesene Anzahl
     - Notification bei neuer Nachricht
   - **Akzeptanzkriterien**:
     - [ ] Rahmenlehrplan-Verknüpfung funktioniert
     - [ ] Nachrichtenfunktion mit Empfänger und Thread
     - [ ] Notification bei neuer Nachricht
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 7
   - **Files**: `src/modules/rahmenlehrplan/`, `src/modules/nachricht/`
   - **Estimated scope**: Medium

**Checkpoint: Standort & Dashboard**
- [ ] Standort- und Berufsmanagement mit 70+ Berufen
- [ ] Ausbilder-Dashboard zeigt Lernaktivität und Wissenslücken
- [ ] Rahmenlehrplan-Verknüpfung funktioniert
- [ ] Kommunikationsnetzwerk mit Nachrichtenfunktion
- [ ] `npm run build` erfolgreich
- [ ] Review mit Human vor Proceeding

### Phase 6: System & Integrationen

- [ ] **Task 21**: Schnittstellen-Integration
   - **Beschreibung**: Neues `schnittstellen`-Modul: Konfiguration von 160+ HRIS/HR-System-Anbindungen. Endpunkte: `POST /v1/schnittstellen/verbinden` für neue Integration; `GET /v1/schnittstellen/status` für Verbindungsstatus; `POST /v1/schnittstellen/synchronisieren` für Datenabgleich; `GET /v1/schnittstellen/:id` für Details; `PUT /v1/schnittstellen/:id` für Update. OAuth2/Webhook-Konfiguration; Fehlerbehandlung und Retry-Logik. Unterstützte Systeme: SAP, Personio, DATEV, Workday, HR Works.
   - **Online-Anforderungen**:
     - `POST /v1/schnittstellen/verbinden` — Neue Integration konfigurieren
     - `GET /v1/schnittstellen` — Alle Schnittstellen auflisten
     - `GET /v1/schnittstellen/:id` — Details einer Schnittstelle
     - `PUT /v1/schnittstellen/:id` — Schnittstelle aktualisieren
     - `POST /v1/schnittstellen/:id/synchronisieren` — Datenabgleich triggern
     - `GET /v1/schnittstellen/:id/status` — Verbindungsstatus
     - `POST /v1/schnittstellen/:id/webhook` — Webhook konfigurieren
     - OAuth2-Konfiguration für jedes System
     - Retry-Logik bei Fehlschlägen
     - Fehler-Logging und Alert
   - **Akzeptanzkriterien**:
     - [ ] Schnittstellen konfigurierbar für SAP, Personio, DATEV, Workday, HR Works
     - [ ] Datenabgleich funktioniert
     - [ ] OAuth2/Webhook-Konfiguration verfügbar
     - [ ] Retry-Logik implementiert
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 3
   - **Files**: `src/modules/schnittstellen/` (controller, service, module, dto)
   - **Estimated scope**: Large (5+ files)

- [ ] **Task 22**: Rechte- & Rollenkonzept erweitern — SSO & 2FA
   - **Beschreibung**: SSO-Integration (Entra ID/OAuth2); 2-Faktor-Authentifizierung (bestehend in `users`-Modul erweitern); Enterprise-Rollenmodell. Endpunkte: `POST /v1/rechte/rolle/:userId` zum Zuweisen; `GET /v1/rechte/berechtigungen` für Rollen-Übersicht; `POST /v1/rechte/audit` für Rechte-Änderungs-Log; `POST /v1/auth/sso/callback` für SSO-Callback; `POST /v1/auth/mfa/activate` für 2FA-Aktivierung.
   - **Online-Anforderungen**:
     - SSO-Login über Entra ID (OpenID Connect/OAuth2)
     - 2FA per TOTP (bestehend, erweitern)
     - Enterprise-Rollenmodell mit zusätzlichen Rollen
     - Rechte-Änderungs-Audit-Log
     - `AccessScopeService`-Erweiterung für Enterprise-Scoping
     - `src/common/constants/roles.ts` erweitern
   - **Akzeptanzkriterien**:
     - [ ] SSO-Integration funktioniert
     - [ ] 2FA aktivierbar und verifizierbar
     - [ ] Enterprise-Rollen verfügbar
     - [ ] Rechte-Änderungs-Log vorhanden
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 3
   - **Files**: `src/common/constants/roles.ts`, `src/common/rbac/`, `src/modules/rechte/`, `src/modules/auth/` (erweitern)
   - **Estimated scope**: Medium

- [ ] **Task 23**: HR-Integration
   - **Beschreibung**: Vollständige Einbindung in Personio Personalakte, Recruiting, Talent Management. Endpunkte: `POST /v1/hr/personio/sync` für Datenabgleich; `GET /v1/hr/personio/mitarbeiter/:id` für Mitarbeiterdaten; `POST /v1/hr/recruiting/stelle` für Stellenanzeigen; `POST /v1/hr/talentmanagement/bewertung` für Talent-Bewertungen; `GET /v1/hr/dashboard` für HR-Dashboard.
   - **Online-Anforderungen**:
     - Personio-API-Integration (Personalakte, Abwesenheiten, Recruiting)
     - Datenabgleich in Echtzeit oder Batch
     - Personalakte mit allen Mitarbeiterdaten
     - Recruiting-Stellenverwaltung
     - Talent-Bewertung mit Scores
     - `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 21, Task 22
   - **Files**: `src/modules/hr-integration/` (controller, service, module, dto)
   - **Estimated scope**: Large

- [ ] **Task 24**: Datenschutz & Sicherheit
   - **Beschreibung**: ISO/IEC 27001-Zertifizierungs-Unterstützung: Audit-Logging für alle sensiblen Aktionen; DSGVO-konforme Datenexport/Deletion; Serverstandort-Prüfung; Verschlüsselung sensibler Daten. Endpunkte: `GET /v1/sicherheit/audit` für Sicherheits-Überblick; `GET /v1/sicherheit/dsgvo/:azubiId` für DSGVO-Status; `POST /v1/sicherheit/dsgvo/export` für DSGVO-Export; `POST /v1/sicherheit/dsgvo/anonymisieren` für Anonimisierung; `GET /v1/sicherheit/konfiguration` für Sicherheits-Konfiguration.
   - **Online-Anforderungen**:
     - Audit-Logging für alle sensiblen Aktionen (append-only)
     - DSGVO-Export (Art. 15) und Löschung/Anonymisierung (Art. 17)
     - Serverstandort-Prüfung (Deutschland)
     - Verschlüsselung sensibler Daten (At-Rest & In-Transit)
     - ISO/IEC 27001 Compliance-Status
     - `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 7, Task 11, Task 14
   - **Files**: `src/modules/sicherheit/`, `src/modules/data-privacy/` (erweitern)
   - **Estimated scope**: Medium

**Checkpoint: System & Integrationen**
- [ ] Schnittstellen-Konfiguration funktioniert
- [ ] SSO und 2FA konfiguriert
- [ ] HR-Integration mit Personio, DATEV etc.
- [ ] Datenschutz und Sicherheit erweitert
- [ ] `npm run build` erfolgreich
- [ ] Review mit Human vor Proceeding

### Phase 7: Plattformverfügbarkeit, Export, Tests

- [ ] **Task 25**: Plattformverfügbarkeit (Mobile/PWA)
   - **Beschreibung**: Mobile App-Unterstützung: PWA-Konfiguration, Offline-First-Architektur. Endpunkte: `GET /v1/mobile/ausbildungsplaene` für mobile Ansichten; `GET /v1/mobile/berichte` für mobile Berichtsansichten; `POST /v1/mobile/sync` für Offline-Sync; `GET /v1/mobile/push-benachrichtigungen` für Push-Notifications. Service Worker für Offline-Caching; Background Sync.
   - **Online-Anforderungen**:
     - PWA mit Service Worker für Offline-Caching
     - Mobile API-Endpunkte (`/v1/mobile/*`)
     - Offline-First mit Background Sync
     - Push-Notifications-Integration
     - Responsive API-Design
     - Conflict Resolution (Last-Write-Wins mit Audit-Log)
     - `npm run build` erfolgreich
   - **Verification**: `npm run build`, manuelle Prüfung
   - **Dependencies**: Task 11, Task 22
   - **Files**: `src/mobile/`, `src/common/offline/`
   - **Estimated scope**: Large (5+ files)

- [ ] **Task 26**: Export-Module
   - **Beschreibung**: `GET /v1/ausbildungsnachweis/export/:id/pdf` für IHK/HWK-konforme PDF-Exporte; `GET /v1/einsatz/export/csv` für Einsatzplan-Exporte; `GET /v1/azubiakte/export/pdf/:id` für komplette Azubiakte; `GET /v1/kompetenzprofil/export/csv/:azubiId` für Kompetenzprofil-Export; `GET /v1/datenschutz/export/dsgvo/:azubiId` für DSGVO-Export; `GET /v1/reporting/export/kennzahlen` für Kennzahlen-Export. Nutzung bestehender `buildSimplePdf()` und CSV-Infrastruktur.
   - **Online-Anforderungen**:
     - Alle Export-Endpoints verfügbar
     - PDF-Export korrekt formatiert (IHK/HWK)
     - CSV-Export alle Felder enthält
     - Rollenprüfung korrekt
     - DSGVO-Export maschinenlesbar
     - `npm run build` erfolgreich
   - **Verification**: Manuell: Exporte herunterladen und prüfen
   - **Dependencies**: Task 7, Task 11, Task 12, Task 14, Task 9
   - **Files**: `src/modules/export/` (controller, service)
   - **Estimated scope**: Medium

- [ ] **Task 27**: Unit- und Integrationstests
   - **Beschreibung**: Tests für alle neuen Service-Methoden: Ausbildungsplan-Workflow, Ausbildungsnachweis-Workflow (16 Endpunkte), Einsatzplanung, Versetzungsplanung, Azubiakte, Kompetenzmodelle, Talentindex, LMS, Prüfungsvorbereitung, Standort-Management, Ausbilder-Dashboard, Schnittstellen, HR-Integration, Sicherheit. `npm run test` muss alle Tests bestehen. Mindestens 80% Code-Abdeckung.
   - **Akzeptanzkriterien**:
     - [ ] Tests für alle neuen Service-Methoden
     - [ ] RBAC-Berechtigungs-Tests
     - [ ] Workflow-Guardrail-Tests
     - [ ] `npm run test` bestanden
     - [ ] ≥80% Code-Abdeckung
     - [ ] E2E-Tests für kritische Pfade
   - **Verification**: `npm run test`, `npm run test:e2e`
   - **Dependencies**: All previous tasks
   - **Files**: `tests/ausbildungsmanagement/` (spec files)
   - **Estimated scope**: Large (5+ files)

- [ ] **Task 28**: Swagger-Dokumentation, Lint & TypeCheck
   - **Beschreibung**: Alle neuen Endpunkte mit `@ApiOperation`, `@ApiResponse`, `@ApiTags` dokumentieren; `@ApiBearerAuth` auf allen Endpunkten; DTOs mit `@ApiProperty` vollständig; `npm run lint`, `npm run typecheck`, `npm run build` bereinigen; `npm run start:dev` und Swagger-UI unter `/api/docs` prüfen.
   - **Akzeptanzkriterien**:
     - [ ] Alle Endpunkte dokumentiert (28+ Module)
     - [ ] DTOs mit vollständigen `@ApiProperty`
     - [ ] Swagger-UI unter `/api/docs` funktionsfähig
     - [ ] Lint clean
     - [ ] TypeCheck clean
     - [ ] Build erfolgreich
   - **Verification**: `npm run lint && npm run typecheck && npm run build`, Swagger-UI `/api/docs`
   - **Dependencies**: Task 27
   - **Files**: Alle geänderten Dateien
   - **Estimated scope**: Small

**Checkpoint: Complete**
- [ ] Alle Tests bestanden (`npm run test`, `npm run test:e2e`)
- [ ] Build erfolgreich (`npm run build`)
- [ ] Lint und TypeCheck clean
- [ ] Swagger-Dokumentation vollständig (28+ Module)
- [ ] Alle Feature-Pfade funktionsfähig
- [ ] Human Review abgeschlossen
- [ ] Alle Konzept-Anforderungen aus Konzept.md §4-§7 abgedeckt

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Prisma Schema-Erweiterung bei 70+ Berufen fehlschlägt | Hoch | Migration in Schritten: erst `Ausbildungsberuf`-Enum erweitern, dann neue Modelle; Test-Migration auf lokaler DB |
| Automatisierte Einsatzplanung zu komplex | Hoch | Zuerst manuelle Planung implementieren, dann Automatisierung schrittweise hinzufügen; Kollisionswarnungen als Erstes |
| HR-Integrationen (SAP, Personio etc.) unterschiedliche APIs | Hoch | Standardisierte Schnittstellen-Abstraktionsschicht; Adapter-Muster pro System; zunächst 2-3 Systeme als Proof of Concept |
| Ausbildungsnachweis-Workflow kollidiert mit bestehendem Report-Workflow | Mittel | `Ausbildungsnachweis` als eigenständige Entität; Klare Trennung der Domänen |
| Mobile App-Unterstützung erfordert erhebliche Infrastrukturänderungen | Mittel | PWA als Erstes; Native-App als nachgelagertes Ziel; Offline-First schrittweise implementieren |
| SSO-Integration (Entra ID) erfordert Infrastruktur-Änderungen | Mittel | Bestehende `auth`-Modul-Infrastruktur nutzen; `nestjs-entra-id`-Regel laden; Schrittweise Einführung |
| 28+ Module zu verwalten | Mittel | Klare Modulgrenzen; Gemeinsame DTOs in `src/common/`; Einerheitliche Service-Muster beibehalten |
| IHK/HWK-konforme Exporte komplex | Mittel | Bestehende PDF-Infrastruktur nutzen; Templates als externe Konfiguration |
| Prüfungsauswertung nach IHK-Standard ungenau | Mittel | IHK-Prüfungsordnung als Referenz; Manuelle Validierung vor Freigabe |

## Open Questions
- [ ] Sollen Ausbildungsnachweise und Berichte in derselben Datenbanktabelle oder als separate Entitäten gespeichert werden?
- [ ] Sollen die 70+ Ausbildungsberufe als Enum oder als separate Tabelle mit CRUD-Verwaltung implementiert werden?
- [ ] Welche HR-Systeme sollen als Erstes integriert werden (Personio, DATEV, SAP)?
- [ ] Sollen die Prüfungsmodule IHK-spezifische Vorlagen nutzen oder generische Vorlagen?
- [ ] Ist ein dediziertes Frontend für die Azubiakte erforderlich oder reicht eine bestehende Frontend-Erweiterung?
- [ ] Sollen Standort-Management und Tag-Management in einem Modul oder getrennten Modulen umgesetzt werden?
- [ ] Wie werden die 2.000+ E-Learning-Videos in die bestehende LMS-Infrastruktur integriert?
- [ ] Sollen SSO und 2FA gleichzeitig oder schrittweise eingeführt werden?
- [ ] Welche Datei-Speicher-Lösung für Anhänge (lokal, S3/MinIO)?
- [ ] Sollen die 160+ HRIS-Anbindungen alle gleichzeitig oder in Wellen implementiert werden?
- [ ] Wie wird die Offline-First-Architektur für die Mobile-App umgesetzt?
