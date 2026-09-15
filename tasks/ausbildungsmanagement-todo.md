# Ausbildungsmanagement & Organisation — Detaillierte Aufgabenliste

## Phase 1: Foundation — Schema-Erweiterung, DTOs, Bestands-Module aufwerten

- [ ] **Task 1**: Prisma Schema erweitern — Berufe, Standorte, Tag, Kompetenzprofil, Schnittstellen, Ausbildungsnachweis, Lernpfad, Prüfungssimulation, LernzeitTracker, Kompetenzabdeckung, Eskalation, Abteilungsuebergabe, Kapazitaetswarnung, Mentoring, FAQ, CustomCourse
   - **Description**: Neue Prisma-Modelle hinzufügen mit 70+ `Ausbildungsberuf`-Enum-Werten, `Standort`, `Tag`, `Kompetenzprofil`, `Schnittstellenkonfiguration`, `Ausbildungsnachweis`, `Lernpfad`, `Pruefungssimulation`, `LernzeitTracker`, `Kompetenzabdeckung`, `Eskalation`, `Abteilungsuebergabe`, `Kapazitaetswarnung`, `Mentoring`, `FAQ`, `CustomCourse`. Bestehende Modelle erweitern: `Ausbildungsplan` um `rahmenlehrplanId`, `Abteilung` um `standortId`, `Einsatz` um `skillLevel`, `Abwesenheit` um `urlaubsanspruch`, `Report` um `ausbildungsnachweisId`.
   - **Acceptance criteria**:
     - [ ] `Ausbildungsberuf`-Enum mit 70+ Berufen (systemintegration, anwendungsentwicklung, daten_prozessanalyse, digitale_vernetzung + 66 weitere)
     - [ ] `Standort`-Modell: id, name, adresse, plz, ort, createdAt, updatedAt
     - [ ] `Tag`-Modell: id, name, typ, createdAt, updatedAt
     - [ ] `Kompetenzprofil`-Modell: id, azubiId, fachkompetenzen, sozialkompetenzen, staerken, schwaechen, erstelltAm
     - [ ] `Schnittstellenkonfiguration`-Modell: id, name, systemTyp (SAP, Personio, DATEV, Workday, HR_Works), oauth2Config, webhookConfig, status, createdAt
     - [ ] `Ausbildungsnachweis`-Modell: id, azubiId, titel, inhaltMarkdown, status, signiertVon, signiertAm, archiviertAm, rahmenlehrplanId, erstelltAm, updatedAt
     - [ ] `Lernpfad`-Modell: id, azubiId, courseId, prioritaet, skipBegruendung, erstelltAm
     - [ ] `Pruefungssimulation`-Modell: id, beruf, typ, aufgaben, loesungen, bewertung, erstelltAm
     - [ ] `LernzeitTracker`-Modell: id, azubiId, courseId, lektionId, durchgehendVerbracht, aktivitaetstyp, erstelltAm
     - [ ] `Kompetenzabdeckung`-Modell: id, azubiId, lernfeldId, sollStunden, istStunden, deckungProzent
     - [ ] `Eskalation`-Modell: id, reportId, stufe, triggermail, manuelleEskalation, erstelltAm
     - [ ] `Abteilungsuebergabe`-Modell: id, vonEinsatzId, bisEinsatzId, datum, wichtigeLernziele, offenePunkte, uebergabeprotokollUrl, erstelltAm
     - [ ] `Kapazitaetswarnung`-Modell: id, abteilungId, jahr, planAusbilder, tatsaechlicheAusbilder, warnSchwelle, status
     - [ ] `Mentoring`-Modell: id, pateId, mentoriId, jahrgang, rollen, aktiv, zugewiesenAm, beendetAm
     - [ ] `FAQ`-Modell: id, frage, antwort, quelleId, aktualisiertVon, aktualisiertAm
     - [ ] `CustomCourse`-Modell: id, ausbilderId, titel, beschreibung, inhalt, verantwortlichkeiten, freigegeben, erstelltAm, genehmigtVon
     - [ ] `Ausbildungsplan` um `rahmenlehrplanId` erweitert
     - [ ] `Abteilung` um `standortId` erweitert
     - [ ] `Einsatz` um `skillLevel` erweitert
     - [ ] `Abwesenheit` um `urlaubsanspruch` erweitert
     - [ ] `Report` um `ausbildungsnachweisId` erweitert
     - [ ] Migration generiert (`npx prisma migrate dev`)
     - [ ] Prisma Client kompiliert ohne Fehler
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npx prisma migrate dev`, `npx prisma generate`, `npm run build`, `npx prisma generate`
   - **Dependencies**: None
   - **Files**: `prisma/schema.prisma`, `prisma/migrations/`, `src/common/constants/`
   - **Estimated scope**: Large (5+ files)

- [ ] **Task 2**: DTOs und Shared-Enums für alle neuen Module
   - **Description**: Alle DTOs mit `class-validator` und `@ApiProperty`. Shared-Enums in `src/common/enums/`: `AusbildungsberufDto`, `StandortDto`, `KompetenzDto`, `LernpfadDto`, `PruefungssimulationDto`, `SchnittstellenDto`, `EinsatzPlanungDto`, `VersetzungDto`, `AusbildungsnachweisDto`. `PaginationQueryDto` erweitern.
   - **Acceptance criteria**:
     - [ ] `CreateAusbildungsnachweisDto` mit allen Feldern: azubiId, titel, inhaltMarkdown, rahmenlehrplanId, typ
     - [ ] `AusbildungsnachweisResponseDto` mit allen Feldern und `@ApiProperty`
     - [ ] `UpdateAusbildungsnachweisDto` als `PartialType`
     - [ ] `CreateStandortDto` mit name, adresse, plz, ort
     - [ ] `CreateKompetenzprofilDto` mit fachkompetenzen, sozialkompetenzen
     - [ ] `CreateLernpfadDto` mit courseId, prioritaet
     - [ ] `CreatePruefungssimulationDto` mit beruf, typ, aufgaben
     - [ ] `CreateSchnittstellenkonfigurationDto` mit name, systemTyp, oauth2Config
     - [ ] `CreateEinsatzPlanungDto` mit beruf, abteilungId, von, bis, skillLevel
     - [ ] `CreateVersetzungDto` mit azubiId, wunschAbteilungen, begruendung
     - [ ] `CreateLernzeitTrackerDto` mit courseId, lektionId, aktivitaetstyp
     - [ ] `CreateKompetenzabdeckungDto` mit lernfeldId, sollStunden, istStunden
     - [ ] `EinsatzPlanungResponseDto` mit plan, kapazitaet, kollisionen
     - [ ] Alle DTOs mit `class-validator` Decorators
     - [ ] `PartialType` für alle Update-DTOs
     - [ ] Enums in `src/common/enums/`
     - [ ] `npm run build` kompiliert ohne Fehler
   - **Verification**: `npm run build`
   - **Dependencies**: Task 1
   - **Files**: `src/common/enums/`, `src/common/dto/`, `src/modules/ausbildungsnachweis/dto/`, `src/modules/standort/dto/`, `src/modules/kompetenz/dto/`, etc.
   - **Estimated scope**: Large (5+ files)

- [ ] **Task 3**: `ausbildungsplan`-Modul vollständig implementieren
   - **Description**: Bestehendes Stub-Modul mit vollständigem Controller, Service mit `AccessScopeService`, CRUD-Endpunkten, Status-Workflow (`entwurf → eingereicht → geprüft → genehmigt`), Rahmenlehrplan-Verknüpfung, IHK-Mapping.
   - **Acceptance criteria**:
     - [ ] `GET /v1/ausbildungsplan` — Liste mit Filter (azubiId, beruf, jahr, status)
     - [ ] `POST /v1/ausbildungsplan` — Erstellung mit Validierung
     - [ ] `GET /v1/ausbildungsplan/:id` — Detailansicht
     - [ ] `PUT /v1/ausbildungsplan/:id` — Update mit Rollenprüfung
     - [ ] `DELETE /v1/ausbildungsplan/:id` — Löschung
     - [ ] `POST :id/einreichen` — Status → eingereicht (nur Azubi)
     - [ ] `POST :id/pruefen` — Status → geprüft (nur Ausbildungsbeauftragter)
     - [ ] `POST :id/genehmigen` — Status → genehmigt (nur Ausbilder/HR)
     - [ ] `GET :id/rahmenlehrplan` — Rahmenlehrplan-Verknüpfung
     - [ ] `AccessScopeService` korrekt integriert
     - [ ] `@Roles()` Guards auf allen Endpunkten
     - [ ] Audit-Logging für alle Statusänderungen
     - [ ] `npm run build` erfolgreich
     - [ ] Swagger-Dokumentation (`@ApiOperation`, `@ApiResponse`, `@ApiTags`)
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 2
   - **Files**: `src/modules/ausbildungsplan/ausbildungsplan.controller.ts`, `src/modules/ausbildungsplan/ausbildungsplan.service.ts`, `src/modules/ausbildungsplan/ausbildungsplan.module.ts`, `src/modules/ausbildungsplan/dto/`
   - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 4**: `ausbildungsvertrag`-Modul vollständig implementieren
   - **Description**: Bestehendes Stub-Modul mit vollständigem Controller, Service, CRUD-Endpunkten, Vertragsstatus-Workflow (`aktiv → beendet → archiviert`).
   - **Acceptance criteria**:
     - [ ] `GET /v1/ausbildungsvertrag` — Liste mit Filter
     - [ ] `POST /v1/ausbildungsvertrag` — Erstellung
     - [ ] `GET /v1/ausbildungsvertrag/:id` — Detail
     - [ ] `PUT /v1/ausbildungsvertrag/:id` — Update
     - [ ] `DELETE /v1/ausbildungsvertrag/:id` — Löschung
     - [ ] `POST :id/aktivieren`, `POST :id/beenden`, `POST :id/archivieren`
     - [ ] Probezeit-Berechnung basierend auf `probezeitMonate`
     - [ ] `@Roles()` Guards korrekt
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 2
   - **Files**: `src/modules/ausbildungsvertrag/ausbildungsvertrag.controller.ts`, `src/modules/ausbildungsvertrag/ausbildungsvertrag.service.ts`
   - **Estimated scope**: Medium

- [ ] **Task 5**: `absence`-Modul erweitern — Urlaubsverwaltung
   - **Description**: Urlaubsansprüche-Berechnung, Abwesenheitsstatistiken, automatische Urlaubsplanung, DSGVO-konforme Löschung. Personio-Integration für Abwesenheits-Sync.
   - **Acceptance criteria**:
     - [ ] `GET /v1/abwesenheit/ansprueche/:azubiId` — Urlaubsansprüche berechnet
     - [ ] `GET /v1/abwesenheit/statistik/:azubiId` — Abwesenheitsstatistiken
     - [ ] `POST /v1/abwesenheit/planen` — Automatische Urlaubsplanung
     - [ ] `POST /v1/abwesenheit/personio/sync` — Personio-Sync
     - [ ] `POST /v1/abwesenheit` mit `CreateUrlaubsantragDto`
     - [ ] `GET /v1/abwesenheit` mit Filter (Typ, Zeitraum, Quelle)
     - [ ] Personio-Integration für automatischen Sync
     - [ ] iCal-Import für Berufsschul-Zeiten
     - [ ] DSGVO-konforme Löschung
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 2
   - **Files**: `src/modules/absence/` (erweitern)
   - **Estimated scope**: Medium

- [ ] **Task 6**: `departments`-Modul erweitern — Standort-Verknüpfung
   - **Description**: `Abteilung` um `standortId` erweitern. Standort-basiertes Scoping. Kapazitätsprüfung.
   - **Acceptance criteria**:
     - [ ] `GET /v1/abteilung/:id/standort` — Standort-Details
     - [ ] `GET /v1/abteilung/:id/kapazitaet` — Kapazitätsprüfung
     - [ ] `GET /v1/abteilung` mit Standort-Filter
     - [ ] `POST /v1/abteilung/mit-arbeitsplaetzen` — Abteilung mit Standort erstellen
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1
   - **Files**: `src/modules/departments/` (erweitern)
   - **Estimated scope**: Small

**## Checkpoint: Foundation**
- [ ] Prisma Migration generiert und angewendet
- [ ] Alle DTOs kompilieren ohne Fehler
- [ ] `ausbildungsplan` mit vollständigen CRUD-Endpunkten und Status-Workflow
- [ ] `ausbildungsvertrag` mit vollständigen CRUD-Endpunkten
- [ ] `absence` mit Urlaubsverwaltung funktionsfähig
- [ ] `departments` mit Standort-Verknüpfung
- [ ] `npm run build` erfolgreich
- [ ] `npm run lint` erfolgreich
- [ ] `npm run typecheck` erfolgreich
- [ ] Review mit Human vor Proceeding

## Phase 2: Core Features — Ausbildungsnachweise, Einsatzplanung, Azubiakte

- [ ] **Task 7**: Digitales Berichtsheft / Ausbildungsnachweise (16 Endpunkte)
   - **Description**: Neues `ausbildungsnachweis`-Modul mit 16 Endpunkten: 8 CRUD, 5 Workflow, 3 Export. IHK/HWK-konforme PDF-Exporte. Digitale Signatur. Anhänge & Medien. Chat- & Notizfunktion.
   - **Acceptance criteria**:
     - [ ] `GET /v1/ausbildungsnachweis` — Liste mit Filter (Status, Beruf, Azubi, Zeitraum)
     - [ ] `POST /v1/ausbildungsnachweis` — Erstellung mit Validierung
     - [ ] `GET /v1/ausbildungsnachweis/:id` — Detailansicht
     - [ ] `PUT /v1/ausbildungsnachweis/:id` — Update (nur entwurf)
     - [ ] `DELETE /v1/ausbildungsnachweis/:id` — Löschung (nur entwurf)
     - [ ] `POST :id/einreichen` — Einreichung (Azubi → eingereicht)
     - [ ] `POST :id/visieren` — Visierung (digitales Signatur, Ausbilder)
     - [ ] `POST :id/archivieren` — Archivierung (Ausbilder/HR)
     - [ ] `POST :id/kommentar` — Kommentar für Ausbilder
     - [ ] `POST :id/anhang` — Anhang-Upload (Signed URL)
     - [ ] `GET :id/anhaenge` — Anhänge auflisten
     - [ ] `GET :id/kommentare` — Kommentare
     - [ ] `GET :id/rahmenlehrplan` — Rahmenlehrplan-Verknüpfung
     - [ ] `GET :id/export/pdf` — IHK/HWK-PDF-Export
     - [ ] `GET :id/export/csv` — CSV-Export
     - [ ] `POST :id/chat` — Chat-Nachricht
     - [ ] Alle Endpunkte mit `@Roles()` Guards
     - [ ] `@ApiOperation`, `@ApiResponse`, `@ApiTags` auf allen Endpunkten
     - [ ] `@ApiBearerAuth` auf allen Endpunkten
     - [ ] Archivierte Nachweise unveränderbar
     - [ ] Audit-Logging für alle Aktionen
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 2, Task 3
   - **Files**: `src/modules/ausbildungsnachweis/` (controller, service, module, dto)
   - **Estimated scope**: Large (5+ files)

- [ ] **Task 8**: Korrektur- & Prüf-Workflow
   - **Description**: Korrektur-Workflow, Prüfungs-Bewertung, Freigabe, Ablehnung, Rückstands-Ampel. Audit-Logging. Notifications.
   - **Acceptance criteria**:
     - [ ] `POST :id/korrigieren` mit Kommentar und Korrektur-Hinweis
     - [ ] `POST :id/pruefen` mit Bewertung, Prüfer-ID, Prüfungsdatum
     - [ ] `POST :id/freigeben` für Kammerprüfung-Freigabe
     - [ ] `POST :id/ablehnen` mit Begründung
     - [ ] `GET :id/rueckstand` — Rückstands-Ampel (grün/gelb/rot)
     - [ ] Audit-Events für alle Workflow-Schritte
     - [ ] Notification bei Statusänderungen an Azubi und Ausbilder
     - [ ] Rollenprüfung korrekt (Ausbilder/HR für Korrektur und Freigabe)
     - [ ] `npm run test` bestanden (Workflow-Tests)
   - **Verification**: `npm run test`
   - **Dependencies**: Task 7
   - **Files**: `src/modules/ausbildungsnachweis/ausbildungsnachweis.service.ts` (erweitern)
   - **Estimated scope**: Medium

- [ ] **Task 9**: Automatisierte Einsatzplanung
   - **Description**: `POST /v1/einsatz/planen` mit Knopfdruck; Kapazitätsprüfung; Kollisionswarnungen; Cron-Job; Manuelle Steuerung.
   - **Acceptance criteria**:
     - [ ] `POST /v1/einsatz/planen` — Generiert Einsatzplan basierend auf Kriterien
     - [ ] `POST /v1/einsatz/uebernehmen` — Manuelle Übernahme des Plans
     - [ ] `GET /v1/einsatz/kapazitaet/:abteilungId` — Kapazitätsprüfung (Azubis pro Abteilung)
     - [ ] `GET /v1/einsatz/kollisionen` — Kollisionswarnungen
     - [ ] `GET /v1/einsatz/dashboard` — Dashboard-Übersicht
     - [ ] Cron-Job für automatische Neuprozessierung (`@nestjs/schedule`)
     - [ ] Sachliche & zeitliche Gliederung berücksichtigt
     - [ ] `AccessScopeService` korrekt
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 3, Task 6
   - **Files**: `src/modules/einsatzplanung/` (controller, service, module, dto)
   - **Estimated scope**: Large (5+ files)

- [ ] **Task 10**: Versetzungs- & Einsatzplanung
   - **Description**: Versetzungsplanung, Azubi-Wünsche, Übergabeprotokolle, Kollisionsprüfungen.
   - **Acceptance criteria**:
     - [ ] `POST /v1/versetzung/planen` — Automatische Versetzungsplanung
     - [ ] `POST /v1/versetzung/wunsch` — Azubi-Wunsch einreichen
     - [ ] `POST /v1/versetzung/stornieren` — Versetzung stornieren
     - [ ] `GET /v1/versetzung/dashboard` — Dashboard mit allen Versetzungen
     - [ ] `GET :id/uebergabe` — Übergabeprotokoll (PDF)
     - [ ] Kollisionsprüfungen basierend auf `Einsatz`-Daten
     - [ ] `Abteilungsuebergabe`-Entity erstellt
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run test`
   - **Dependencies**: Task 1, Task 9
   - **Files**: `src/modules/versetzungsplanung/` (controller, service, module, dto)
   - **Estimated scope**: Medium

- [ ] **Task 11**: Elektronische Azubiakte & Dashboard
   - **Description**: Neues `azubiakte`-Modul: 7 Sub-Views + Dashboard. Rollengefilterte Ansichten.
   - **Acceptance criteria**:
     - [ ] `GET /v1/azubiakte/dashboard` — Aggregierte Dashboard-Daten (Fortschritt, Noten, Abwesenheiten, Kompetenzen)
     - [ ] `GET /v1/azubiakte/:id` — Vollständiges Profil
     - [ ] `GET /v1/azubiakte/:id/stammdaten` — Persönliche Daten
     - [ ] `GET /v1/azubiakte/:id/einsaetze` — Einsatzhistorie
     - [ ] `GET /v1/azubiakte/:id/dokumente` — Dokumente & Zertifikate
     - [ ] `GET /v1/azubiakte/:id/abwesenheiten` — Abwesenheitsübersicht
     - [ ] `GET /v1/azubiakte/:id/entwicklung` — Entwicklungsstände
     - [ ] Rollenbasierte Filterung (Azubi: eigene, Ausbilder: Abteilung, HR: alle)
     - [ ] Aggregierte Daten korrekt aus allen Modulen
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, manueller Test
   - **Dependencies**: Task 1, Task 7, Task 9, Task 10
   - **Files**: `src/modules/azubiakte/` (controller, service, module, dto)
   - **Estimated scope**: Large (5+ files)

**## Checkpoint: Core Features**
- [ ] Ausbildungsnachweise mit vollständigem Workflow (16 Endpunkte)
- [ ] Korrektur- & Prüf-Workflow funktioniert
- [ ] Automatisierte Einsatzplanung mit Kapazitätsprüfung
- [ ] Versetzungsplanung mit Kollisionswarnungen
- [ ] Azubiakte-Dashboard zeigt alle Daten korrekt
- [ ] `npm run build` erfolgreich
- [ ] `npm run lint` erfolgreich
- [ ] `npm run typecheck` erfolgreich
- [ ] Review mit Human vor Proceeding

## Phase 3: Talent Management & Leistungsbeurteilung

- [ ] **Task 12**: Kompetenzmodelle
   - **Description**: `Kompetenzprofil`-Modul mit Fach- und Sozialkompetenzen; Stärken- & Schwächenprofile; Kompetenzabdeckung. 8 Endpunkte.
   - **Acceptance criteria**:
     - [ ] `POST /v1/kompetenz/erstellen` — Neues Kompetenzprofil
     - [ ] `GET /v1/kompetenz/:azubiId` — Kompetenzprofil anzeigen
     - [ ] `PUT /v1/kompetenz/:id` — Kompetenzprofil aktualisieren
     - [ ] `POST /v1/kompetenz/bewerten` — Bewertung durch Ausbilder
     - [ ] `GET /v1/kompetenz/:azubiId/staerken` — Stärkenprofil
     - [ ] `GET /v1/kompetenz/:azubiId/schwaechen` — Schwächenprofil
     - [ ] `GET /v1/kompetenz/modelle` — Vordefinierte Modelle auflisten
     - [ ] `POST /v1/kompetenz/abdeckung` — Kompetenzabdeckung berechnen
     - [ ] Integration mit `feedback`-Modul und `Grade`-Modell
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 2
   - **Files**: `src/modules/kompetenz/` (controller, service, module, dto)
   - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 13**: 360°-Feedback & Beurteilungen
   - **Description**: 360°-Feedback, Beurteilungsgespräche, Notenerfassung, Entwicklungsgespräche. 8 Endpunkte.
   - **Acceptance criteria**:
     - [ ] `POST /v1/feedback/360` — 360°-Feedback (Selbst- + Fremdeinschätzung)
     - [ ] `GET /v1/feedback/360/:azubiId` — 360°-Ergebnisse
     - [ ] `POST /v1/feedback/beurteilungsgespräch` — Neues Gespräch mit Termin
     - [ ] `GET /v1/feedback/beurteilungsgespräch/:id` — Gesprächsdetail
     - [ ] `POST :id/vereinbarungen` — Vereinbarungen hinzufügen
     - [ ] `POST /v1/feedback/noten` — Noten erfassen
     - [ ] `GET /v1/feedback/noten/:azubiId` — Notenübersicht
     - [ ] `POST /v1/feedback/abteilungsbewertung` — Abteilungsbewertung
     - [ ] Rollenprüfung korrekt (Azubi, Ausbilder, HR)
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run test`
   - **Dependencies**: Task 1, Task 12
   - **Files**: `src/modules/feedback/` (erweitern)
   - **Estimated scope**: Medium

- [ ] **Task 14**: Talentindex
   - **Description**: Learning-Analytics-Kennzahl; High-Potential-Identifikation. 3 Endpunkte.
   - **Acceptance criteria**:
     - [ ] `GET /v1/talentindex/dashboard` — Dashboard mit High-Potentials
     - [ ] `GET /v1/talentindex/:azubiId` — Einzelanalyse mit allen Kennzahlen
     - [ ] `GET /v1/talentindex/warnliste` — Erweiterte Frühwarnung
     - [ ] Algorithmus: Notendurchschnitt + Kompetenzbewertung + Feedback-Scores + Abwesenheitsrate + Fortschritt
     - [ ] Rollenprüfung (Ausbilder, HR, Admin)
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 12, Task 13
   - **Files**: `src/modules/talentindex/` (controller, service, module, dto)
   - **Estimated scope**: Medium (3-5 files)

**## Checkpoint: Talent Management**
- [ ] Kompetenzprofile erstellbar und bewertbar
- [ ] 360°-Feedback mit Selbst- und Fremdeinschätzung
- [ ] Talentindex identifiziert High-Potentials korrekt
- [ ] Alle Dashboards liefern aggregierte Daten
- [ ] `npm run build` erfolgreich
- [ ] Review mit Human vor Proceeding

## Phase 4: E-Learning & Prüfungsvorbereitung

- [ ] **Task 15**: Integrierte Lernplattform (LMS)
   - **Description**: Lernpfade, Fortschrittsverfolgung, Kompetenzabdeckung. 8 Endpunkte. Integration mit 2.000+ Videos, 1.500+ Lektionen.
   - **Acceptance criteria**:
     - [ ] `GET /v1/lms/lernpfade/:beruf` — Lernpfade für Beruf (70+)
     - [ ] `GET /v1/lms/lernpfade/:beruf/:courseId` — Lernpfad-Detail
     - [ ] `POST /v1/lms/fortschritt` — Lernfortschritt erfassen (`LernzeitTracker`)
     - [ ] `GET /v1/lms/fortschritt/:azubiId` — Fortschrittsübersicht
     - [ ] `GET /v1/lms/dashboard` — LMS-Dashboard
     - [ ] `GET /v1/lms/kompetenzabdeckung/:azubiId` — Kompetenzabdeckung
     - [ ] `GET /v1/lms/kurse` — Alle Kurse filtern
     - [ ] `GET /v1/lms/videos` — Videos mit Pagination
     - [ ] Integration mit `Course`/`Task`/`Framework`-Modulen
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 2
   - **Files**: `src/modules/learning-content/` (erweitern)
   - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 16**: Prüfungsvorbereitung
   - **Description**: Prüfungssimulationen, automatische Auswertung nach IHK-Standard, Stärken/Schwächen-Profil. 6 Endpunkte.
   - **Acceptance criteria**:
     - [ ] `POST /v1/pruefung/simulation/:beruf` — Prüfungssimulation generieren
     - [ ] `POST /v1/pruefung/auswertung` — Automatische Auswertung nach IHK-Standard
     - [ ] `GET /v1/pruefung/statistik/:azubiId` — Stärken/Schwächen-Profil
     - [ ] `GET /v1/pruefung/meilensteine/:azubiId` — Prüfungs-Meilensteine
     - [ ] `POST /v1/pruefung/anmelden` — Prüfung anmelden
     - [ ] `GET /v1/pruefung/:id` — Prüfungs-Detail
     - [ ] Integration mit `Pruefung`-Modell und `PruefungsMeilenstein`
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run test`
   - **Dependencies**: Task 1, Task 15
   - **Files**: `src/modules/pruefungsvorbereitung/` (controller, service, module, dto)
   - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 17**: Autoren-Tool & Gamification
   - **Description**: Eigene Inhalte erstellen, Quizze, Lernpfade, Badge-System, Leaderboard. 7 Endpunkte.
   - **Acceptance criteria**:
     - [ ] `POST /v1/autoren/leitfaden` — Eigenen Leitfaden erstellen
     - [ ] `POST /v1/autoren/quiz` — Quiz erstellen
     - [ ] `POST /v1/autoren/lernpfad` — Lernpfad erstellen
     - [ ] `GET /v1/autoren/meine` — Eigene Inhalte auflisten
     - [ ] `GET /v1/gamification/leaderboard` — Leaderboard
     - [ ] `GET /v1/gamification/badges/:azubiId` — Badges anzeigen
     - [ ] `POST /v1/gamification/badge/vergeben` — Badge vergeben
     - [ ] `CustomCourse`-Entity für manuell erstellte Kurse
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 15
   - **Files**: `src/modules/gamification/` (erweitern)
   - **Estimated scope**: Medium

**## Checkpoint: E-Learning**
- [ ] LMS mit Lernpfaden für 70+ Berufe
- [ ] Prüfungsvorbereitung mit Simulation und automatischer Auswertung
- [ ] Autoren-Tool für eigene Inhalte
- [ ] Gamification mit Badge-System und Leaderboard
- [ ] `npm run build` erfolgreich
- [ ] Review mit Human vor Proceeding

## Phase 5: Standort- & Tag-Management, Ausbilder-Dashboard, Kommunikation

- [ ] **Task 18**: Standort- & Tag-Management (10 Endpunkte)
   - **Description**: Standort-Verwaltung, Berufe, Tags, Kapazitätsprüfung, Standort-basiertes Scoping.
   - **Acceptance criteria**:
     - [ ] `GET /v1/standort` — Alle Standorte auflisten
     - [ ] `POST /v1/standort` — Neuen Standort erstellen
     - [ ] `GET /v1/standort/:id` — Standort-Detail
     - [ ] `PUT /v1/standort/:id` — Standort aktualisieren
     - [ ] `DELETE /v1/standort/:id` — Standort löschen
     - [ ] `GET /v1/standort/:id/berufe` — 70+ Berufe pro Standort
     - [ ] `POST /v1/standort/:id/tag` — Tag erstellen
     - [ ] `GET /v1/standort/:id/tags` — Tags auflisten
     - [ ] `GET /v1/standort/:id/kapazitaet` — Kapazitätsprüfung
     - [ ] Standort-basiertes Scoping für Ausbildungsbeauftragte
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 6
   - **Files**: `src/modules/standort/` (controller, service, module, dto)
   - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 19**: Ausbilder-Dashboard (5 Endpunkte)
   - **Description**: Lernaktivität, Fortschritte, Wissenslücken, Warnliste, Kohorten-Vergleich.
   - **Acceptance criteria**:
     - [ ] `GET /v1/ausbilder-dashboard` — Dashboard mit Aggregation
     - [ ] `GET /v1/ausbilder-dashboard/lernaktivitaet` — Lernaktivitäts-Übersicht
     - [ ] `GET /v1/ausbilder-dashboard/wissensluecken` — Wissenslücken-Analyse
     - [ ] `GET /v1/ausbilder-dashboard/warnliste` — Warnliste für kritische Azubis
     - [ ] `GET /v1/ausbilder-dashboard/kohorten` — Kohorten-Vergleich
     - [ ] Filter nach Abteilung, Azubi, Zeitraum
     - [ ] Rollen: Ausbilder, Ausbildungsbeauftragter, HR, Admin
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 11, Task 12, Task 14, Task 15
   - **Files**: `src/modules/ausbilder-dashboard/` (controller, service, module, dto)
   - **Estimated scope**: Medium (3-5 files)

- [ ] **Task 20**: Rahmenlehrplan-Verknüpfung & Kommunikationsnetzwerk
   - **Description**: Rahmenlehrplan-Verknüpfung, Nachrichten-Modul, Task-Verteilung.
   - **Acceptance criteria**:
     - [ ] `POST /v1/rahmenlehrplan/verknüpfen` — Wochenbericht zu Rahmenlehrplan verknüpfen
     - [ ] `GET /v1/rahmenlehrplan/:beruf` — Rahmenlehrplan-Daten
     - [ ] `POST /v1/nachricht/senden` — Nachricht senden (mit Empfänger, Inhalt)
     - [ ] `GET /v1/nachricht/gefiltert` — Gefilterte Nachrichten (Thread-Ansicht)
     - [ ] `GET /v1/nachricht/ungelesen` — Ungelesene Anzahl
     - [ ] `POST /v1/nachricht/antwort` — Thread-Antwort
     - [ ] Notification bei neuer Nachricht
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 7
   - **Files**: `src/modules/rahmenlehrplan/`, `src/modules/nachricht/`
   - **Estimated scope**: Medium

**## Checkpoint: Standort & Dashboard**
- [ ] Standort- und Berufsmanagement mit 70+ Berufen
- [ ] Ausbilder-Dashboard zeigt Lernaktivität und Wissenslücken
- [ ] Rahmenlehrplan-Verknüpfung funktioniert
- [ ] Kommunikationsnetzwerk mit Nachrichtenfunktion
- [ ] `npm run build` erfolgreich
- [ ] Review mit Human vor Proceeding

## Phase 6: System & Integrationen

- [ ] **Task 21**: Schnittstellen-Integration (8 Endpunkte)
   - **Description**: Konfiguration von 160+ HRIS-System-Anbindungen. Adapter-Muster. OAuth2/Webhook.
   - **Acceptance criteria**:
     - [ ] `POST /v1/schnittstellen/verbinden` — Neue Integration konfigurieren
     - [ ] `GET /v1/schnittstellen` — Alle Schnittstellen auflisten
     - [ ] `GET /v1/schnittstellen/:id` — Details einer Schnittstelle
     - [ ] `PUT /v1/schnittstellen/:id` — Schnittstelle aktualisieren
     - [ ] `POST /v1/schnittstellen/:id/synchronisieren` — Datenabgleich
     - [ ] `GET /v1/schnittstellen/:id/status` — Verbindungsstatus
     - [ ] `POST /v1/schnittstellen/:id/webhook` — Webhook konfigurieren
     - [ ] OAuth2-Konfiguration für SAP, Personio, DATEV, Workday, HR Works
     - [ ] Retry-Logik bei Fehlschlägen
     - [ ] Fehler-Logging und Alert
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 3
   - **Files**: `src/modules/schnittstellen/` (controller, service, module, dto)
   - **Estimated scope**: Large (5+ files)

- [ ] **Task 22**: Rechte- & Rollenkonzept erweitern — SSO & 2FA
   - **Description**: SSO-Integration (Entra ID/OAuth2); 2FA; Enterprise-Rollen; Rechte-Änderungs-Log.
   - **Acceptance criteria**:
     - [ ] `POST /v1/auth/sso/callback` — SSO-Callback
     - [ ] `POST /v1/auth/mfa/activate` — 2FA aktivieren
     - [ ] `POST /v1/rechte/rolle/:userId` — Rolle zuweisen
     - [ ] `GET /v1/rechte/berechtigungen` — Rollen-Übersicht
     - [ ] `POST /v1/rechte/audit` — Rechte-Änderungs-Log
     - [ ] `src/common/constants/roles.ts` erweitert
     - [ ] `AccessScopeService`-Erweiterung für Enterprise-Scoping
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 1, Task 3
   - **Files**: `src/common/constants/roles.ts`, `src/common/rbac/`, `src/modules/rechte/`, `src/modules/auth/` (erweitern)
   - **Estimated scope**: Medium

- [ ] **Task 23**: HR-Integration (6 Endpunkte)
   - **Description**: Personio-API-Integration (Personalakte, Abwesenheiten, Recruiting, Talent Management).
   - **Acceptance criteria**:
     - [ ] `POST /v1/hr/personio/sync` — Datenabgleich
     - [ ] `GET /v1/hr/personio/mitarbeiter/:id` — Mitarbeiterdaten
     - [ ] `POST /v1/hr/recruiting/stelle` — Stellenanzeigen
     - [ ] `POST /v1/hr/talentmanagement/bewertung` — Talent-Bewertungen
     - [ ] `GET /v1/hr/dashboard` — HR-Dashboard
     - [ ] Personio-API-Integration funktioniert
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 21, Task 22
   - **Files**: `src/modules/hr-integration/` (controller, service, module, dto)
   - **Estimated scope**: Large

- [ ] **Task 24**: Datenschutz & Sicherheit (5 Endpunkte)
   - **Description**: ISO/IEC 27001, DSGVO, Audit-Logging, Verschlüsselung.
   - **Acceptance criteria**:
     - [ ] `GET /v1/sicherheit/audit` — Sicherheits-Überblick
     - [ ] `GET /v1/sicherheit/dsgvo/:azubiId` — DSGVO-Status
     - [ ] `POST /v1/sicherheit/dsgvo/export` — DSGVO-Export (Art. 15)
     - [ ] `POST /v1/sicherheit/dsgvo/anonymisieren` — Anonimierung (Art. 17)
     - [ ] `GET /v1/sicherheit/konfiguration` — Sicherheits-Konfiguration
     - [ ] Audit-Logging append-only, unveränderbar
     - [ ] ISO/IEC 27001 Compliance-Status
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, `npm run test`
   - **Dependencies**: Task 7, Task 11, Task 14
   - **Files**: `src/modules/sicherheit/`, `src/modules/data-privacy/` (erweitern)
   - **Estimated scope**: Medium

**## Checkpoint: System & Integrationen**
- [ ] Schnittstellen-Konfiguration funktioniert
- [ ] SSO und 2FA konfiguriert
- [ ] HR-Integration mit Personio, DATEV etc.
- [ ] Datenschutz und Sicherheit erweitert
- [ ] `npm run build` erfolgreich
- [ ] Review mit Human vor Proceeding

## Phase 7: Plattformverfügbarkeit, Export, Tests

- [ ] **Task 25**: Plattformverfügbarkeit (Mobile/PWA) (4 Endpunkte)
   - **Description**: PWA, Offline-First, Mobile API, Push-Notifications.
   - **Acceptance criteria**:
     - [ ] `GET /v1/mobile/ausbildungsplaene` — Mobile Ansichten
     - [ ] `GET /v1/mobile/berichte` — Mobile Berichtsansichten
     - [ ] `POST /v1/mobile/sync` — Offline-Sync
     - [ ] `GET /v1/mobile/push-benachrichtigungen` — Push-Notifications
     - [ ] PWA mit Service Worker
     - [ ] Offline-First mit Background Sync
     - [ ] Conflict Resolution (Last-Write-Wins)
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run build`, manuelle Prüfung
   - **Dependencies**: Task 11, Task 22
   - **Files**: `src/mobile/`, `src/common/offline/`
   - **Estimated scope**: Large (5+ files)

- [ ] **Task 26**: Export-Module (6 Endpunkte)
   - **Description**: IHK/HWK-PDF-Exporte, CSV-Exporte, DSGVO-Export, Kennzahlen-Export.
   - **Acceptance criteria**:
     - [ ] `GET /v1/ausbildungsnachweis/export/:id/pdf` — IHK/HWK-PDF
     - [ ] `GET /v1/einsatz/export/csv` — Einsatzplan-CSV
     - [ ] `GET /v1/azubiakte/export/pdf/:id` — Komplette Azubiakte
     - [ ] `GET /v1/kompetenzprofil/export/csv/:azubiId` — Kompetenzprofil-CSV
     - [ ] `GET /v1/datenschutz/export/dsgvo/:azubiId` — DSGVO-Export
     - [ ] `GET /v1/reporting/export/kennzahlen` — Kennzahlen-Export
     - [ ] Rollenprüfung korrekt
     - [ ] `npm run build` erfolgreich
   - **Verification**: Manuell: Exporte herunterladen und prüfen
   - **Dependencies**: Task 7, Task 11, Task 12, Task 14, Task 9
   - **Files**: `src/modules/export/` (controller, service)
   - **Estimated scope**: Medium

- [ ] **Task 27**: Unit- und Integrationstests
   - **Description**: Tests für alle 28 Module. RBAC-Tests, Workflow-Tests, E2E-Tests.
   - **Acceptance criteria**:
     - [ ] Tests für alle neuen Service-Methoden (28+ Module)
     - [ ] RBAC-Berechtigungs-Tests
     - [ ] Workflow-Guardrail-Tests
     - [ ] `npm run test` bestanden
     - [ ] `npm run test:e2e` bestanden
     - [ ] ≥80% Code-Abdeckung
     - [ ] `npm run test` erfolgreich
   - **Verification**: `npm run test`, `npm run test:e2e`
   - **Dependencies**: All previous tasks
   - **Files**: `tests/ausbildungsmanagement/` (spec files)
   - **Estimated scope**: Large (5+ files)

- [ ] **Task 28**: Swagger-Dokumentation, Lint & TypeCheck
   - **Description**: Alle 28+ Module mit Swagger-Dokumentation. Lint und TypeCheck bereinigen.
   - **Acceptance criteria**:
     - [ ] Alle Endpunkte mit `@ApiOperation`, `@ApiResponse`, `@ApiTags`
     - [ ] `@ApiBearerAuth` auf allen Endpunkten
     - [ ] DTOs mit `@ApiProperty` vollständig
     - [ ] Swagger-UI unter `/api/docs` funktionsfähig
     - [ ] `npm run lint` ohne Fehler
     - [ ] `npm run typecheck` ohne Fehler
     - [ ] `npm run build` erfolgreich
   - **Verification**: `npm run lint && npm run typecheck && npm run build`, Swagger-UI `/api/docs`
   - **Dependencies**: Task 27
   - **Files**: Alle geänderten Dateien
   - **Estimated scope**: Small

**## Checkpoint: Complete**
- [ ] Alle Tests bestanden (`npm run test`, `npm run test:e2e`)
- [ ] Build erfolgreich (`npm run build`)
- [ ] Lint und TypeCheck clean
- [ ] Swagger-Dokumentation vollständig (28+ Module)
- [ ] Alle Feature-Pfade funktionsfähig
- [ ] Human Review abgeschlossen
- [ ] Alle Konzept-Anforderungen aus Konzept.md §4-§7 und Konzept2.md abgedeckt

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Prisma Schema-Erweiterung bei 70+ Berufen fehlschlägt | Hoch | Migration in Schritten; Test-Migration auf lokaler DB |
| Automatisierte Einsatzplanung zu komplex | Hoch | Zuerst manuelle Planung, dann Automatisierung |
| HR-Integrationen (SAP, Personio etc.) unterschiedliche APIs | Hoch | Adapter-Muster; zunächst 2-3 Systeme als PoC |
| Ausbildungsnachweis-Workflow kollidiert mit Report-Workflow | Mittel | `Ausbildungsnachweis` als eigenständige Entität |
| Mobile App-Unterstützung erfordert Infrastrukturänderungen | Mittel | PWA als Erstes; Offline-First schrittweise |
| SSO-Integration (Entra ID) erfordert Infrastruktur-Änderungen | Mittel | Bestehende `auth`-Modul-Infrastruktur nutzen |
| 28+ Module zu verwalten | Mittel | Klare Modulgrenzen; Gemeinsame DTOs |
| IHK/HWK-konforme Exporte komplex | Mittel | Bestehende PDF-Infrastruktur; Templates extern |
| Prüfungsauswertung nach IHK-Standard ungenau | Mittel | IHK-Prüfungsordnung als Referenz |

## Online-Anforderungen (Zusammenfassung pro Modul)

### Module-Endpunkte-Übersicht

| Modul | Endpunkte | HTTP-Methoden | RBAC-Rollen | Integrationen |
|-------|-----------|---------------|-------------|---------------|
| `ausbildungsplan` | 8 | GET, POST, PUT, DELETE | Azubi, Ausbilder, HR | IHK-Rahmenplan, Framework |
| `ausbildungsvertrag` | 8 | GET, POST, PUT, DELETE | Azubi, Ausbilder, HR | — |
| `absence` | 8 | GET, POST | Azubi, Ausbilder, HR | Personio, iCal |
| `departments` | 6 | GET, POST | Alle | Standort |
| `ausbildungsnachweis` | 16 | GET, POST, PUT, DELETE | Azubi, Ausbilder, HR, Admin | Report, Framework, Notification |
| `einsatzplanung` | 5 | GET, POST | Ausbilder, Admin | Einsatz, Abteilung, Ausbildungsplan |
| `versetzungsplanung` | 5 | GET, POST | Azubi, Ausbilder, HR | Versetzungswunsch, Einsatz |
| `azubiakte` | 8 | GET | Azubi, Ausbilder, HR | Alle Module (aggregiert) |
| `standort` | 10 | GET, POST, PUT, DELETE | Admin, Ausbilder | Abteilung, Ausbildungsberuf |
| `kompetenz` | 8 | GET, POST, PUT | Azubi, Ausbilder, HR | Feedback, Grade |
| `feedback` | 8 | GET, POST | Azubi, Ausbilder, HR | Abteilung, User |
| `talentindex` | 3 | GET | Ausbilder, HR, Admin | Grade, Feedback, Abwesenheit |
| `lms` | 8 | GET, POST | Azubi, Ausbilder, HR | Course, Task, Framework |
| `pruefungsvorbereitung` | 6 | GET, POST | Azubi, Ausbilder, HR | Pruefung, PruefungsMeilenstein |
| `gamification` | 7 | GET, POST | Azubi, Ausbilder, Admin | Badge, UserBadge |
| `nachricht` | 4 | GET, POST | Azubi, Ausbilder, HR | Notification |
| `rahmenlehrplan` | 2 | GET, POST | Ausbilder, HR | Ausbildungsplan, Report |
| `schnittstellen` | 8 | GET, POST, PUT | Admin | SAP, Personio, DATEV, Workday |
| `hr-integration` | 6 | GET, POST | HR, Admin | Personio API |
| `sicherheit` | 5 | GET, POST | Admin, HR | AuditEvent, DatenschutzRequest |
| `ausbilder-dashboard` | 5 | GET | Ausbilder, Ausbildungsbeauftragter, HR | Alle Module (aggregiert) |
| `mobile` | 4 | GET, POST | Azubi, Ausbilder | Alle Module |
| `export` | 6 | GET | Azubi, Ausbilder, HR, Admin | Alle Module |

**Gesamt: 135+ API-Endpunkte über 28 Module**
