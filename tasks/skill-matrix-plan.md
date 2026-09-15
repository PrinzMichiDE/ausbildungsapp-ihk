# Implementation Plan: Skill-Matrix Modul maximal ausbauen

## Overview
Das bestehende Skill-Matrix-Modul (nur lesende Accordion-Ansicht von IHK-Lernfeldern) wird zu einem vollständigen Kompetenztrackingsystem ausgebaut: individueller Azubi-Fortschritt pro Skill, Skill-Gap-Analyse, Peer-Benchmarking, „vermittelt"-Markierung durch Ausbilder und ein visuelles TreeTable-Dashboard mit Fortschrittsbalken. Das System verknüpft bestehende Framework/Course/Task-Entitäten mit einer neuen Zuordnungstabelle und ergänzt ein Dedicated Backend-Modul + Frontend-Store + Vue-Komponente.

## Architecture Decisions
- **SkillAssignment als n:m-Entität**: Neues Prisma-Modell `SkillAssignment` verknüpft `User` (Azubi) + `Framework` (IHK-Lernfeld) + `Course` (optional) mit Status (`nicht_begonnen`, `in_arbeit`, `vermittelt`) und Fortschritt (0-100%). Kein direktes Attribut auf `Framework` oder `Course` — saubere Trennung.
- **SkillMatrixBenchmark**: Aggregierte Peer-Daten pro Jahrgang/Beruf/Lernfeld (anonymisiert). Konzept aus `concept2.md` §8.2.
- **Lernpfad**: Individuelle Kurzanpassungen pro Azubi (`concept2.md` §8.1) — priorisierte Kurse, Skip-Optionen.
- **„Vermittelt"-Workflow**: `PATCH :id/vermittelt` durch Ausbildungsbeauftragten/Ausbilder gemäß RBAC-Matrix (§4). Status-Übergang `in_arbeit → vermittelt` mit Audit-Log.
- **Frontend**: PrimeVue `TreeTable` gemäß UI/UX-Konzept (§3.3) mit `Knob`-Fortschriften, `Tag`-Status, qualitative Farbcodierung.
- **Kein KI-Einsatz für Bewertungen**: Skill-Level wird aus Kursfortschritt abgeleitet, nie durch KI entschieden (`concept.md` §3.2.2).

## Task List

### Phase 1: Foundation — Schema, DTOs, Modul-Struktur

- [ ] **Task 1**: Prisma Schema erweitern — `SkillAssignment`, `SkillMatrixBenchmark`, `Lernpfad` Modelle
- [ ] **Task 2**: Error-Codes für Skill-Matrix ergänzen
- [ ] **Task 3**: `skill-matrix` Backend-Modul erstellen (Module, Service, Controller)
- [ ] **Task 4**: DTOs für Skill-Matrix erstellen (Create, Response, Update, Filter)

### Checkpoint: Foundation
- [ ] Prisma Migration erfolgreich (`npx prisma migrate dev`)
- [ ] Modul-Struktur kompiliert (`npm run build`)
- [ ] DTOs validieren korrekt

### Phase 2: Core Backend — Skill-Zuordnung & Fortschritts-Tracking

- [ ] **Task 5**: SkillAssignment CRUD-Endpunkte (Azubi-spezifisch)
- [ ] **Task 6**: Fortschrittsberechnung — Kursfortschritt → Skill-Level-Ableitung
- [ ] **Task 7**: „Vermittelt"-Markierung — `PATCH :id/vermittelt` mit RBAC + Audit
- [ ] **Task 8**: Scope-Integration — `AccessScopeService` für Skill-Daten

### Checkpoint: Core Backend
- [ ] CRUD-Endpunkte funktionieren mit korrekter RBAC-Prüfung
- [ ] Fortschrittsberechnung liefert korrekte Werte
- [ ] „Vermittelt"-Markierung nur durch berechtigte Rollen

### Phase 3: Analytics Backend — Gap-Analyse, Benchmarking, Reporting

- [ ] **Task 9**: Skill-Gap-Analyse — Required vs. Actual pro Azubi/Lernfeld
- [ ] **Task 10**: SkillMatrixBenchmark — Peer-Vergleich pro Jahrgang/Beruf
- [ ] **Task 11**: Lernpfad-Service — Individuelle Kurspriorisierung
- [ ] **Task 12**: Reporting-Integration — Skill-Coverage erweitern um Azubi-Fortschritt

### Checkpoint: Analytics Backend
- [ ] Gap-Analyse liefert korrekte Differenzen
- [ ] Benchmark-Daten anonymisiert aggregiert
- [ ] Lernpfad-Empfehlungen basierend auf Gap-Analyse

### Phase 4: Frontend — TreeTable, Fortschrittsbalken, Gap-Visualisierung

- [ ] **Task 13**: Frontend-Store `skill-matrix.ts` erstellen
- [ ] **Task 14**: `SkillMatrixView.vue` — TreeTable mit Frameworks/Kursen/Fortschritt
- [ ] **Task 15**: „Vermittelt"-Markierungs-UI — Checkbox/Button für Ausbilder
- [ ] **Task 16**: Skill-Gap-Dashboard — Required vs. Actual Visualisierung

### Checkpoint: Frontend Core
- [ ] TreeTable rendert korrekt mit Fortschrittsbalken
- [ ] „Vermittelt"-Aktion funktioniert für Ausbilder
- [ ] Gap-Dashboard zeigt Daten pro Azubi an

### Phase 5: Advanced Frontend — Benchmarking, Lernpfad, Export

- [ ] **Task 17**: Peer-Benchmarking-Ansicht — Anonymisierter Jahrgangsvergleich
- [ ] **Task 18**: Lernpfad-UI — Empfohlene Kurse, Priorisierung
- [ ] **Task 19**: CSV/PDF-Export — Skill-Matrix-Export
- [ ] **Task 20**: Notification-Integration — Bei „Vermittelt"-Markierung

### Checkpoint: Advanced Frontend
- [ ] Benchmark-Ansicht anonymisiert
- [ ] Lernpfad-Empfehlungen sichtbar
- [ ] Export funktioniert korrekt

### Phase 6: Tests, Doku, Code-Qualität

- [ ] **Task 21**: Unit-Tests für SkillAssignmentService
- [ ] **Task 22**: Integrationstests für RBAC/Scope-Prüfungen
- [ ] **Task 23**: Swagger-Dokumentation für alle Endpunkte
- [ ] **Task 24**: Code-Review & Refactoring

### Checkpoint: Complete
- [ ] Alle Tests bestanden (`npm run test`)
- [ ] Build erfolgreich (`npm run build`)
- [ ] Lint und TypeCheck clean
- [ ] Alle Akzeptanzkriterien erfüllt
- [ ] RBAC-Matrix für Skill-Matrix-Aktionen erweitert

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| SkillAssignment-Tabelle wächst schnell bei vielen Azubis/Kursen | Mittel | Indexierung auf `(azubiId, frameworkId)`; Paginierung bei Abfragen |
| Fortschrittsberechnung inkonsistent bei parallelen Kurs Updates | Mittel | Transaktionen für Status-Änderungen; optimistische Locking |
| RBAC-Scope-Überprüfungen für neue Entitäten fehlen | Hoch | AccessScopeService-Methoden für SkillAssignment testen; `assertCanAccessAzubi` nutzen |
| Peer-Benchmarking enthält zu wenig Daten für aussagekräftige Vergleiche | Niedrig | Mindest-Threshold für Aggregation (z.B. ≥3 Azubis); Fallback auf Gesamtansicht |
| TreeTable-Performance bei >50 Frameworks | Niedrig | Virtuelles Scrolling; Lazy-Loading der Kursbäume |

## Open Questions
- [ ] Soll der Fortschritt pro Skill manuell durch Ausbilder ODER automatisch aus Kursfortschritt abgeleitet werden?
- [ ] Soll `SkillMatrixBenchmark` live berechnet oder als Materialized View/Cached Aggregation gespeichert werden?
- [ ] Braucht es eine „Skill-Freigabe"-Stufe analog zur Kurs-Freigabe, oder reicht „vermittelt"?
- [ ] Soll der Lernpfad KI-unterstützt werden (concept2.md §8.1) oder manuell durch Ausbilder?
