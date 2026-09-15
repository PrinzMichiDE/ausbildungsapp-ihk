---
name: NextGen Domänenmodell
description: Fachliche Module, Datenmodell und Workflows der Ausbildungsplattform "NextGen IT-Ausbildung" (Berichtsheft, KI-Skill-Matrix/Kurse, Versetzungsplanung, IHK-Rahmenplan). Immer beachten beim Modellieren von Entities, Services, Modul-Struktur oder Workflow-Logik.
globs:
  - "src/modules/**"
  - "src/**/*.entity.ts"
  - "src/**/*.service.ts"
  - "prisma/**"
  - "src/common/**"
---

# Domänenmodell-Regeln: NextGen IT-Ausbildung

Quelle: `concept.md`. Diese Regeln definieren die fachlichen Entitäten, Module und Workflows der Plattform und ergänzen die DB-, API- und RBAC-Regeln.

## 1. Kernmodule

Die Plattform besteht aus folgenden Modulen (jeweils ein `src/modules/<feature>/`):

1. **Berichtsheft** (`berichte`) — digitales Wochenberichtsheft der Azubis.
2. **KI-Skill-Matrix & Kurse** (`frameworks`, `courses`, `tasks`) — RAG-basierte Übersetzung IHK-Vorgaben → Lernpfade/Praxisaufgaben.
3. **Versetzungs- & Einsatzplanung** (`einsatz`, `versetzung`) — Abteilungsrotationen/Gantt/Kanban.
4. **Nutzer & Rollen** (`users`, `user_roles`, `abteilungen`) — RBAC (siehe RBAC-Regel).

## 2. Datenmodell (Auszug)

| Entity | Beschreibung | Wichtige Relationen |
|---|---|---|
| `Framework` | IHK-Ausbildungsrahmenplan mit abstrakten Lernfeldern (`title`, `lohfeld`, `kompetenz`) | 1:n → `Course`/`Task` |
| `Course` / `Task` | KI-generierte, vom Ausbilder validierte Lerninhalte & Praxisaufgaben | n:1 → `Framework`; n:1 → `Report` (Nachweis) |
| `Report` | Vom Azubi erstellte Wochenberichte (Markdown) | n:1 → `User` (Azubi); n:m → `Task` (Kompetenznachweis) |
| `User` | Azubi/Ausbilder/HR/Admin, rollenbasiert (RBAC) | n:m → `UserRole`; n:1 → `Abteilung` (Einsatz) |
| `Einsatz` | Abteilungseinsatz: `azubiId`, `abteilungId`, `von`, `bis` | Grundlage für Abteilungs-Scoping (siehe RBAC-Regel §3) |
| `Abteilung` | Fachabteilung (Scoping-Einheit für Ausbildungsbeauftragte) | 1:n → `Einsatz` |

- Entity-Naming folgt den DB-Naming-Konventionen (snake_case Tabellen/Spalten, UUID-PK).
- Relationen werden in `Prisma`-Schema (`prisma/schema.prisma`) oder als TypeORM-Entities definiert — konsistent zum gewählten ORM (siehe Tech-Stack-Regel).

## 3. Berichtsheft-Workflow

Statusmaschine für `Report`:

```
entwurf → eingereicht → in_pruefung → visiert → archiviert
                 ↘ (Änderung) → zurück zu entwurf
```

- Azubi erstellt/bearbeitet nur im Status `entwurf` (siehe RBAC-Matrix §4).
- Nach `archiviert` ist kein Edit mehr möglich (auch nicht durch Ausbilder) — Korrekturen nur über neuen Bericht.
- Jeder Bericht kann direkt an IHK-Rahmenplan-Kompetenzen gekoppelt werden (`ReportTask`-Relation) → Nachweis der Kompetenzvermittlung.
- Bericht-Inhalte sind **Markdown** mit Code-Highlighting — sanitize/escape beim Rendern (siehe Security-Regel §3), niemals ungefiltertes HTML aus Client speichern.
- PDF-Export nach IHK-Richtlinien inkl. digitaler Signatur der Ausbilder ist Pflicht-Feature (Signatur serverseitig, nicht Client-seitig).

## 4. KI-gestützte Kursgenerierung (Human-in-the-Loop)

Workflow (siehe Tech-Stack-Regel für RAG-Details):

```
Dokumenten-Import (PDF) → Vektorisierung (pgvector/RAG) → LLM-Generierung → Review (Ausbilder) → Freigabe für Azubis
```

- KI-generierte `Course`/`Task` sind **nicht** für Azubis sichtbar, bis der Ausbilder sie freigegeben hat (`freigegeben: boolean`).
- Ausbilder kann firmeninterne Werkzeuge anpassen (z. B. Docker Compose, Tailscale, Nginx) — Freigabe ist ein bewusster, geloggter Akt (siehe Audit-Regel).
- KI-Output muss strukturiertes JSON sein (Kurs/Praxisaufgabe) — Validierung der LLM-Antwort über DTO (kein unvalidierter Freitext in die DB).

## 5. Versetzungs- & Einsatzplanung

- `Einsatz`-Datensätze treiben das Gantt/Kanban-Dashboard.
- Ausbildungsbeauftragte sehen im Voraus rotierende Azubis inkl. aktuellem Skill-Level (`skill_level` auf `Einsatz` oder abgeleitet aus `Course`-Fortschritt).
- Versetzungsplan-Änderungen nur durch `ausbilder` (siehe RBAC-Matrix); Ausbildungsbeauftragter nur Lesezugriff.

## 6. IHK-Rahmenplan-Mapping

- `Framework` hält die IHK-Lernfelder als Ground Truth; `Task` referenziert das zugehörige Lernfeld.
- Berichtsheft-Einträge werden über `ReportTask` an `Task` (und damit indirekt an `Framework`-Kompetenz) gemappt → IHK-Nachweisführung.
- Keine hartkodierten IHK-Texte im Code — immer aus `Framework`-Entity laden (kann sich ändern/erweitern).

## 7. Verbote

- Keine KI-generierten Kurse ohne Ausbilder-Freigabe für Azubis sichtbar.
- Kein Bearbeiten archivierter Berichte (auch nicht durch Ausbilder) ohne neuen Bericht/Prozess.
- Keine IHK-Texte/Lernfelder hardcodiert im Code statt in der `Framework`-Entity.
- Keine Berichtsheft-Inhalte als ungefiltertes HTML speichern (XSS-Risiko).
