# Softwarekonzept: Ausbildungsplattform „NextGen IT-Ausbildung“

**Fokus:** Duale Ausbildung zum Fachinformatiker (Systemintegration, Anwendungsentwicklung, Daten- und Prozessanalyse, Digitale Vernetzung)

> Dieses Dokument ist die fachliche Referenz für das Backend-Repo. Die verbindlichen
> technischen Regeln (RBAC, Error-Handling, API-Design, DB, Security, Domänenmodell)
> liegen in `.opencode/rules/` und gehen bei Konflikten diesem Konzept vor.

---

## 1. Einleitung & Zielsetzung

Die Plattform bildet den gesamten Zyklus der dualen IT-Ausbildung ab – von der Versetzungsplanung
über das digitale Berichtsheft bis zur KI-basierten Transformation des IHK-Rahmenplans in konkrete
Lernpfade und Praxisaufgaben. Sie ist zentral, digital, DSGVO-konform und rollenbasiert umgesetzt.

Ziele im Überblick:

- **Entlastung der Ausbilder/HR** durch Automatisierung von Erinnerungen, Freigaben und Statistik.
- **Nachweisführung gesichert** durch unveränderlich archivierte Berichtshefte und IHK-Mapping.
- **Lernfortschritt sichtbar** durch Skill-Matrix, Noten- und Feedback-Tracking.
- **Praxisnähe** durch weitgehend automatisiert generierte Kurse/Tasks, die ein Qualitäts-Gate
  automatisch freigibt (nur Abweichungen landen in der Review-Queue des Ausbilders).
- **Rechtskonform und sicher von Anfang an:** Umsetzung der Anforderungen aus ISO/IEC 27001
  (Informationssicherheit), DSGVO (Datenschutz) und dem EU AI Act (risikobasierter KI-Einsatz)
  als integraler Bestandteil des Konzepts (§6).

---

## 2. Rollen- & Berechtigungskonzept (RBAC)

Die Rollen sind nicht exklusiv (Mehrfachrollen über `user_roles`), werden additiv kombiniert und
zentral in `src/common/constants/roles.ts` definiert.

| Rolle | Kurzbeschreibung | Scope |
|---|---|---|
| `azubi` | Führt das digitale Berichtsheft, verfolgt Lernfortschritt, bearbeitet Praxis-Tasks, reicht Zertifikate/Abwesenheiten ein | nur eigene Daten |
| `ausbildungsbeauftragter` | Betreut Azubis der eigenen Abteilung(en), visiert Wochenberichte, gibt Feedback, bewertet Tasks | Azubis mit aktivem Einsatz in eigener Abteilung |
| `ausbilder` | Gesamtverantwortung, finale Freigabe (Visa), Review-Queue der KI-Kursgenerierung (nur bei Eskalation), Versetzungsplan, Entwicklungsgespräche | alle Azubis |
| `hr` | Übergeordnete Statistiken, Abwesenheiten, Übernahme-Planung, Noten-Frühwarnung | alle Azubis (organisatorisch) |
| `admin` | Systemkonfiguration, Rollen-/Rechteverwaltung, Schnittstellen (Entra ID, Personio, Teams), Break-Glass | technisch, standardmäßig keine fachlichen Daten |

**Wichtigste Prinzipien** (Details in `nestjs-rbac.md`):

- Eine Rolle allein reicht nie – jede Aktion auf Azubi-Daten prüft zusätzlich einen
  `AccessScopeService`-Filter auf DB-Ebene (`WHERE azubi_id IN (...)`).
- Abteilungs-Scoping basiert auf dem **aktiven Einsatz** (`einsatz.von`/`bis`), nicht auf fester Zuordnung.
- Admin sieht standardmäßig **keine** fachlichen Daten; Sonderzugriffe laufen nur über einen
  geloggten Break-Glass-Mechanismus.
- HR sieht organisatorische Daten, aber **nicht** die fachliche Bewertung (Berichtskommentare, Skill-Freigaben).

**Berechtigungsmatrix (Kern-Aktionen):**

| Aktion | Azubi | Ausb.-beauftragter | Ausbilder | HR | Admin |
|---|---|---|---|---|---|
| Bericht erstellen/bearbeiten (eigener, `entwurf`) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Bericht einreichen | ✅ | ❌ | ❌ | ❌ | ❌ |
| Bericht kommentieren/prüfen | ❌ | ✅ (eigener Einsatz) | ✅ (alle) | ❌ | ❌ |
| Bericht final visieren | ❌ | ❌ | ✅ | ❌ | ❌ |
| Bericht nach Archivierung ändern | ❌ | ❌ | ❌ | ❌ | ❌ |
| Versetzungsplan bearbeiten | ❌ | ❌ (nur lesen) | ✅ | ❌ | ❌ |
| Zertifikat hochladen | ✅ (eigenes) | ❌ | ❌ (lesen) | ❌ (lesen) | ❌ |
| Skill-Matrix als „vermittelt“ markieren | ❌ | ✅ (eigene Abt.) | ✅ | ❌ | ❌ |
| Krankeitsmeldung/Vertrag einsehen | ❌ (eigene) | ❌ | ❌ | ✅ | ❌ |
| Rollen/Rechte verwalten | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. Kernmodule der Plattform

### 3.1 Digitales Berichtsheft (`berichte`)
- **Markdown & Code-Highlighting** für strukturierte Einträge (Betrieb, Berufsschule, Schulung).
- **Status-Workflow** (siehe Domänenmodell): `entwurf → eingereicht → in_pruefung → visiert → archiviert`.
- **IHK-Mapping:** Einträge an `Framework`-Kompetenzen/Tasks koppeln → Nachweis der Kompetenzvermittlung.
- **Review:** Ausbildungsbeauftragter/Ausbilder kommentieren; Ausbilder visiert final (serverseitige digitale Signatur).
- **Export:** Automatisierter PDF-Export nach IHK-Vorgaben; nach `archiviert` unveränderbar.

### 3.2 KI-gestützte Skill-Matrix & Kurse — vollautomatischer Kursgenerator (`lerninhalte`, `ai`)

Der Kern der Plattform: abstrakte IHK-Vorgaben werden **weitgehend vollautomatisch** in einen
kompletten, strukturierten und qualitätsgeprüften Kursbaum übersetzt – **ohne manuelles
Kurs-Erstellen**. Der Mensch (Ausbilder) greift nur noch in definierten Ausnahmefällen ein
(bewusste Freigabe, Konflikt, niedrige Qualitäts-Scores).

**Automatisierungsgrad je Stufe:**

| Stufe | Automatisiert | Mensch bei Bedarf |
|---|---|---|
| Dokumenten-Import | ✅ vollständig | — |
| Parsing & Normierung | ✅ vollständig | — |
| Chunking & Vektorisierung | ✅ vollständig | — |
| Kursbaum-Generierung | ✅ vollständig | — |
| Inhalte (Lektionen/Quizzes/Tasks) | ✅ vollständig | — |
| Qualitäts-Gate & Auto-Release | ✅ vollständig | Eskalation bei Score < Schwellwert |
| Firmenspezifische Konfiguration | ✅ per Template/Kontext | Ausbilder bestätigt nur |
| Laufende Verbesserung (Feedback-Loop) | ✅ vollständig | — |

#### 3.2.1 Automatisierte Pipeline

1. **Dokumenten-Import** (`AiDocument`, PDF/Text): IHK-Rahmenplan, Ausbildungsrahmenplan,
   schulspezifische Lehrpläne, interne Schulungs- und Tooling-Vorgaben (z. B. Docker Compose,
   Tailscale, Nginx, Cloud-Provider). Upload per Drag & Drop oder per Sync (Dateiordner/API).
2. **Parsing & Normierung:** Text-Extraktion (layout-erhaltend für PDF), Bereinigung von
   Fußzeilen/Seitenzahlen, einheitliches Quellformat (Ground Truth).
3. **Chunking & Vektorisierung (RAG):** Semantisches Chunking mit Überlappung, Embeddings in
   pgvector (`AiDocumentChunk`), Index für schnelle Similarity-Suche. So bleibt die KI exakt im
   offiziellen Kontext und erfindet keine ausbildungsfremden Inhalte.
4. **Kursbaum-Generierung:** Aus den Lernfeldern/Kompetenzen erzeugt das LLM einen hierarchischen
   Kursbaum: `Framework → Course → Module/Lektionen → Inhalte`. Jede Kompetenz mündet in einen
   abgeschlossenen Kurs mit definierten Lernzielen.
5. **Inhalte-Generierung:** Für jeden Kurs erzeugt die KI vollautomatisch:
   - **Theorie-Bausteine** (Markdown inkl. Code/Config-Beispielen),
   - **Lernziele** (verifizierbar, IHK-konform),
   - **Wissens-Checks/Quizzes** (MC-Fragen, Lückentexte, Fallbeispiele) mit direkter Auswertung,
   - **Praxis-Tasks** (betriebliche Aufgaben, die ins Berichtsheft eingetragen werden können),
   - **Referenz-/Musterlösungen** sowie Quellen-Verknüpfung zu den ursprünglichen Dokumentstellen.
6. **Kohärenz- & Qualitätsprüfung (auto Gate):** Ein validierendes LLM-Pass prüft jede
   Generierung gegen Regeln (Vollständigkeit, fachliche Korrektheit, Konsistenz mit Ground Truth,
   keine Halluzination). **Erst bei bestandener Prüfung** geht der Kurs in den Release-Pfad.

#### 3.2.2 Release-Politik: Auto-Freigabe mit Eskalation

- Jeder Kurs erhält einen **Qualitäts-Score** (0–100), abgeleitet aus Kohärenz, Ground-Truth-Treue
  und Vollständigkeit.
- **Auto-Release:** Kurse mit Score ≥ Schwellwert (z. B. 85) werden **automatisch** freigegeben
  (`freigegeben = true`) und sind sofort für Azubis sichtbar. Der Vorgang wird im Audit-Log erfasst.
- **Eskalation an Ausbilder:** Kurse unter dem Schwellwert oder mit erkannten Konflikten/
  Lücken landen in einer **Review-Queue**. Der Ausbilder kann sie bearbeiten, freigeben oder
  neu generieren lassen (mit konkretem Korrektur-Hinweis zurück an die Pipeline).
- **Firmen-Kontext:** Technologie-Profile (welche Tools der Betrieb einsetzt) sind als Template
  hinterlegt; die KI passt Praxis-Tasks automatisch darauf an. Eventuelle Unklarheiten bündelt die
  Pipeline konsolidiert zur Bestätigung – statt jeden Schritt einzeln zu fragen.
- **Sicherheitsanker (siehe Domänenmodell):** Nichts ist für Azubis sichtbar, solange es nicht
  freigegeben ist. Die Auto-Freigabe ist ein definierter, geloggter Schritt (Audit), keine stille
  Nebenwirkung.
- **Datenschutz- & KI-Guard (DSGVO/EU AI Act, §6):** Die Generierung verarbeitet **grundsätzlich
  keine personenbezogenen Daten** – Eingabe sind ausschließlich IHK-/Schuldokumente und
  fachliche Konfiguration. Werden dennoch personenbezogene oder personenbeziehbare Inhalte
  erkannt, wird der betroffene Kurs automatisch aus dem Auto-Release herausgenommen und
  ausschließlich der Review-Queue zugeführt (menschliche Freigabe).
- **Bewertungs- & Beurteilungsfunktionen** (Noten, Feedback, Kompetenz-Status) unterliegen
  **nie** einer automatischen Generierung/Freigabe durch die KI – hier entscheidet immer ein
  Mensch. Die KI unterstützt nur, trifft aber keine Entscheidung über Einzelpersonen.

#### 3.2.3 Course-Struktur (Datenmodell im Detail)

Ein `Course` bündelt folgende Elemente (Erweiterung des bestehenden Schemas):

```
Framework (IHK-Lernfeld)
└─ Course  (Lernmodul)
   ├─ Lernziele (Mehrfach, verifizierbar)
   ├─ Lernziel-Zuordnung zum Ausbildungsjahr/Prüfungsteil (AP1/AP2)
   ├─ Module (Reihenfolge, Fortschritt)
   │   └─ Lektionen → Theorie (Markdown) & Beispiele
   ├─ Quiz (Wissens-Checks) mit Auswertung & Retry-Logik
   ├─ Praxis-Tasks (betriebliche Übungen, → Berichtsheft)
   ├─ Voraussetzungen (empfohlene Vorkenntnisse/Kurse)
   ├─ Dauer-Schätzung & Schwierigkeitsgrad
   ├─ Qualitäts-Score & Release-Status
   └─ Version & Quellen-Verknüpfung (Ground-Truth-Belege)
```

Jeder Bestandteil trägt automatisch erzeugte **Quellen-Referenzen**, damit Ausbilder und Azubis
jede Aussage auf die ursprüngliche IHK-Vorgabe zurückführen können.

#### 3.2.4 Automatischer Verbesserungs-Zyklus (Feedback-Loop)

- **Lernverhalten:** Quiz-Bestehensquoten und wiederholte Versuche je Lektion fließen automatisch
  in die Kennzahlen ein. Kurse mit dauerhaft schwachen Ergebnissen werden automatisch zur
  **Überarbeitung vorgemerkt** (niedriger Score + Schwelle).
- **Praxis-Nutzung:** Die tatsächliche Nutzung von Praxis-Tasks im Berichtsheft (`ReportTask`)
  wird aggregiert; kaum genutzte/erfolgreiche Tasks geben Hinweis auf Lücken oder guten Zuschnitt.
- **Regeneration:** Die Pipeline kann einen einzelnen Kurs, ein Modul oder eine Lektion auf
  Knopfdruck (oder geplant bei Abweichung) **neu und verbessert generieren** – wieder inkl.
  Qualitäts-Gate. Versionierung erlaubt vorherige Fassungen zu vergleichen.
- Ausbilder bleiben über Verbesserungsvorschläge via Benachrichtigungszentrale informiert, müssen
  aber standardmäßig nicht eingreifen.

#### 3.2.5 Beispiel: Fachinformatiker Systemintegration

| IHK-Kompetenz | KI-generierter Kurs | KI-generierter Praxis-Task | Auto-Quiz |
|---|---|---|---|
| Netzwerkinfrastrukturen planen | Grundlagen TCP/IP & Subnetting | IP-Konzept für ein internes Testnetzwerk (VLAN) erstellen und dokumentieren. | Subnetz-Maske berechnen, Routing-Fallbeispiel |
| Serverdienste bereitstellen | Linux Server Administration | Ubuntu aufsetzen, SSH absichern, Nginx als Reverse Proxy. | SSH-Härtung, Rechte-Konzepte (MC) |
| Virtualisierung & Container | Einführung in Docker | Web-App + DB über Docker Compose lokal deployen. | Docker-Netzwerke, Volumes (Fallbeispiel) |

Der Kursbaum wird **vollautomatisch** erzeugt und mit Qualitäts-Score ≥ 85 ohne menschlichen
Eingriff für Azubis freigeschaltet; nur abweichende Kurse landen in der Review-Queue des Ausbilders.

### 3.3 Versetzungs- & Einsatzplanung (`einsatz`)
- **Rotationsplan:** Gantt/Kanban-Ansicht der Abteilungsrotationen (`Einsatz`: azubi, abteilung, von, bis).
- **Kapazitätsplanung:** Ausbildungsbeauftragte sehen kommende Azubis inkl. aktuellem `skill_level`.
- **Scoping:** Der Ausbildungsbeauftragte sieht nur Azubis mit `aktivem` Einsatz; Plan-Änderungen nur durch Ausbilder.

### 3.4 Projekt- & Zertifikate-Manager (`zertifikate`)
- **Betriebliches Projekt (AP2):** Einreichen, Nachverfolgen, Review der Projektdokumentation.
- **Zertifikate-Safe:** Verwalten von Hersteller-Zertifizierungen (AWS, CCNA, LPIC-1, Scrum Master) mit Dokument-URL.

---

## 4. Erweiterte Funktionen & Integrationen

### 4.1 Zeit- und Abwesenheitsmanagement (`abwesenheit`)
- **Abwesenheiten:** Urlaub/Krank/Berufsschule, Quelle `manuell|personio|ical`.
- **Optionale Personio-Anbindung:** Synchronisiert Abwesenheiten → Berichtsheft markiert diese Tage automatisch (keine Aufgaben-Einforderung).
- **Berufsschul-Zeiten:** iCal/Stundenplan-Import zur automatischen Blockierung von Anwesenheitszeiten.

### 4.2 Onboarding-Management (`onboarding`)
- **Checklisten:** Automatisierte Workflows für den ersten Arbeitstag (Zugänge, Sicherheitsunterweisung, Einarbeitungspläne) mit fortlaufendem Erledigungsstatus.

### 4.3 Feedback- und Bewertungssystem (`feedback`)
- **Abteilungsbewertungen:** Standardisierte Bewertungsbögen (Fachkompetenz, Soft Skills) nach jedem Abteilungsdurchlauf.
- **Azubi-Feedback:** Bewertung der Betreuung/Aufgabenstellung durch die Fachabteilung (anonymisierbar).

### 4.4 Kollaboration & Kommunikation (`wiki`, `reminders`)
- **Wissensdatenbank/Wiki:** Interne How-Tos, IHK-Prüfungsordnungen, Berichtsheft-Vorlagen (Markdown, Kategorien).
- **Microsoft Teams Integration (vorgesehen):** Push-Benachrichtigungen via Adaptive Cards (fehlende Berichtshefteinträge, anstehende Freigaben, neue Tasks).
- **Automatische Erinnerungen:** Wöchentliche Reminder (Freitag) für fehlende Berichtshefteinträge.

### 4.5 Schul- und Notenverwaltung (`noten`)
- **Zeugnis-Upload:** Zentraler Speicherort für Berufsschulzeugnisse (`zeugnis_url`).
- **Noten-Tracker:** Visualisierung schulischer Leistungen als Frühwarnsystem für HR/Ausbilder.

### 4.6 Gamification (`gamification`)
- **Achievements/Badges:** Auszeichnungen für pünktlich geführte Berichtshefte, bestandene Module, abgeschlossene Zertifizierungen.

### 4.7 Auth & Benutzerverwaltung (`auth`, `users`)
- **JWT-Authentifizierung** (kurzlebig, Claims), Passwort-Hashing über etablierte Library (Argon2/bcrypt).
- **Mehrfachrollen** über `user_roles`; Rollenänderung wirkt ab dem nächsten Request.
- **Optionale Entra ID/SSO-Anbindung** über OpenID Connect/OAuth2.

---

## 5. Neue Features & Verbesserungen (Erweiterung)

Die folgenden Module/Features erweitern das Konzept um Substanz für einen produktiven Roll-out.
Jedes neue fachliche Feature ergänzt zuerst die RBAC-Matrix (§2) und das Domänenmodell, bevor
ein Endpoint implementiert wird.

### 5.1 Audit-Log & Nachvollziehbarkeit
- **Ziel:** Jede sicherheitsrelevante und fachlich kritische Aktion ist nachvollziehbar (wer, wann, was, von welchem IP/User-Agent).
- **Inhalte:** Berichtsvidierung, KI-Freigaben, Rollenänderungen, Break-Glass-/Impersonation-Zugriffe, Löschungen.
- **Umsetzung:** Persistierte Audit-Events (separate Tabelle), append-only, unveränderbar; kein Umschreiben/Löschen.
- **Abgrenzung:** Für normale Report-Kommentare reicht der bestehende Workflow; Audit-Log betrifft administrative/kritische Aktionen.

### 5.2 Prüfungs- & IHK-Terminverwaltung (Neu-Modul `pruefungen`)
- **AP1/AP2-Planung:** Anmeldung, Termine, Status (`angemeldet|teilgenommen|bestanden|wiederholung`), zuständige IHK.
- **Betriebliches Projekt (AP2):** Meilensteine (Antrag → Abgabe → Bewertung), Fristen mit automatischer Warnung.
- **Zuordnung zu Lernfeldern:** Verknüpfung der Prüfungsabschnitte mit der Skill-Matrix als Vorbereitungs-Fortschritt.
- **Rechte:** Azubi sieht eigene Prüfungen; Ausbilder/HR verwalten Anmeldungen & Fristen.

### 5.3 Benachrichtigungszentrale (Neu-Modul `notifications`)
- **Zentrale Inbox:** In-App-Benachrichtigungen mit Priorität und Kategorien (Freigaben, Fristen, Erinnerungen, Abwesenheiten).
- **Kanäle pro Nutzer wählbar:** In-App und/oder E-Mail und/oder Microsoft Teams (Adaptive Card) – per Präferenz konfigurierbar.
- **Ungelesen-Zähler & Quittierung** für Freigaben (wer hat wann gesehen).
- **Recht:** Nutzer sieht nur eigene Benachrichtigungen; Versand ggf. über Outbox-Pattern (Mailing/Teams-Boundary).

### 5.4 Dashboard & Reporting (Neu-Modul `reporting`)
- **Rollenspezifische Dashboards:**
  - *Azubi:* eigener Fortschritt (Skill-Matrix, Noten, offene Berichte).
  - *Ausbildungsbeauftragter:* offene Visa, kommende Rotationen der eigenen Abteilung.
  - *Ausbilder/HR:* Gesamtübersicht, Ausbildungsfortschritt, Frühwarnlisten (Förderbedarf, fehlende Berichte).
- **Exporte:** CSV/PDF von Kennzahlen (Anwesenheit, Noten, Kompetenzfortschritt) für Governance und Management.
- **Kennzahlen:** Berichtheft-Quote, Kompetenzabdeckung pro Ausbildungsjahr, Abteilungsdurchlauf-Zufriedenheit.

### 5.5 DSGVO: Auskunft, Export & Löschung (Neu-Modul `datenschutz`)
- **Auskunft/Export:** Ein Azubi kann alle eigenen personenbezogenen Daten als maschinenlesbares Paket exportieren.
- **Löschung:** „Recht auf Vergessenwerden“ – Hard-Delete oder Anonymisierung, mit fachlicher Freigabe (archivierte Berichte/signierte Dokumente behalten nur die zur Nachweispflicht nötigen Metadaten).
- **Doppelte Rollen** (bei Mehrfachrollen) berücksichtigen: Wer mehrere Rollen hat, sieht nur den jeweils autorisierten Teil.
- **Einwilligungen & Nachweis (Art. 7):** Pflicht-Einholung und -Dokumentation von Einwilligungen (z. B. Gamification, anonymisiertes Feedback), jederzeit widerrufbar.
- **DSGVO-Konformität:** Fristgerechte Bearbeitung (1 Monat, verlängerbar), Statusverfolgung aller Betroffenenrechte; Details in §6.2.

### 5.6 Sicherheits-Härtung (Querschnitt)
- **MFA/TOTP** optional für Ausbilder/HR/Admin; Passwort-Policy (Mindestlänge, Komplexität, kein Wiederverwenden).
- **Rate-Limiting & Brute-Force-Schutz** am Login-Endpoint; `trust proxy` hinter Traefik korrekt gesetzt.
- **Sicherheits-Header & CORS-Whitelist** nach Security-Regel; Audit-Events für fehlgeschlagene Logins.
- **Secrets:** LLM-API-Keys, Personio/Entra/Teams-Secrets ausschließlich via `ConfigService`/`.env`, nie im Repo.

---

## 6. Compliance: ISO 27001, DSGVO & EU AI Act

Die Plattform wird so konzipiert, dass sie die Anforderungen der Informationssicherheit
(ISO/IEC 27001), des Datenschutzes (DSGVO) und der KI-Regulierung (EU AI Act) erfüllt. Dieser
Abschnitt ist die fachliche Referenz für Governance, Datenschutz und KI-Verantwortung; er ist
Grundlage für eine ISMS-Zertifizierung, ein datenschutzkonformes Verarbeitungsverzeichnis und die
risikobasierte Einordnung der KI-Komponente.

### 6.1 ISO 27001 (Informationssicherheit / ISMS)

| Anforderung | Umsetzung im Konzept |
|---|---|
| **ISMS & Risikomanagement (Kap. 5/6)** | Einordnung als Baustein in das unternehmensweite ISMS; regelmäßige Risiko-Analyse (Assets, Bedrohungen, Schwachstellen), Zuständigkeiten & Verantwortliche (ISO-Rollen). |
| **Zugriffskontrolle (A.9)** | Least-Privilege & Need-to-know über RBAC + `AccessScopeService` (§2); MFA für privilegierte Rollen (Modul 5.6); regelmäßiges Berechtigungs-Review. |
| **Audit & Nachvollziehbarkeit (A.12.4)** | Append-only Audit-Log (Modul 5.1) mit akkuratem Zeitstempel; keine Manipulation/Löschung. |
| **Sicherer Betrieb (A.12)** | Patch- & Change-Management, Vulnerabilitäts-Scanning (u. a. `npm audit` in CI), Malware-Schutz, regelmäßige Restore-Tests. |
| **Lieferanten (A.15)** | Assessments & Verträge/AVV für Cloud-LLM, Personio, Teams, Entra ID; Kriterien für verarbeitete Daten. |
| **Incident Response (A.16)** | Definierter Ablauf (Erkennen, Melden, Eindämmen, Beseitigen, Lessons Learned) inkl. Kommunikation. |
| **Business Continuity (A.17)** | Backup-/Restore-Konzept, Disaster-Recovery-Verfahren mit klaren RPO/RTO-Zielen (Roadmap Phase 4). |
| **Compliance (A.18)** | Nachweis gesetzlicher/vertraglicher Anforderungen (u. a. DSGVO, EU AI Act). |

### 6.2 DSGVO (Datenschutz)

- **Rechtsgrundlagen (Art. 6):** Verarbeitung für die betriebliche Ausbildung (Vertrag/Durchführung
  des Ausbildungsverhältnisses, Art. 6(1)(b)), gesetzliche Pflichten (Art. 6(1)(c), z. B.
  Aufbewahrungspflichten, IHK) und – klar getrennt geprüft – berechtigte Interessen (Art. 6(1)(f)).
- **Datenminimierung & Zweckbindung (Art. 5):** Nur Daten, die für die Ausbildung tatsächlich nötig
  sind; keine zweckfremde Weiternutzung; konsequente Speicher- und Löschfristen.
- **Betroffenenrechte (Art. 15–21):** Auskunft, Berichtigung, Löschung, Einschränkung,
  Datenübertragbarkeit und Widerspruch werden über das Modul `datenschutz` (§5.5) mit
  Statusverfolgung und fristgerechter Bearbeitung (1 Monat, verlängerbar um 2) umgesetzt.
- **Auftragsverarbeitung (Art. 28):** AVV mit allen Prozessoren (Hosting, Cloud-LLM, Personio,
  Teams/E-Mail) abschließen; Weisungsgebundenheit sicherstellen.
- **Drittlandtransfer (Art. 44 ff.):** Bevorzugt Verarbeitung in EU/EWR (lokales Ollama für
  personenbezogene Daten). Cloud-Provider nur mit geeigneten Garantien (EU-US Data Privacy
  Framework oder SCCs), dokumentiert und überwacht.
- **Datenschutz-Folgenabschätzung / DPIA (Art. 35):** Pflicht für die KI-gestützte Verarbeitung
  (RAG über Ausbildungsdaten) sowie für Noten- und Bewertungs-Tracking (moderate Risiken).
- **Technische & organisatorische Maßnahmen (Art. 32):** Pseudonymisierung, Verschlüsselung
  (At-Rest & In-Transit, TLS), Zugriffskontrolle, Audit-Log, regelmäßige Sicherheitstests,
  sichere Entwicklung.
- **Verarbeitungsverzeichnis (Art. 30):** Jedes Modul dokumentiert Zweck, Kategorien, Empfänger,
  Speicherdauer und Rechtsgrundlage – als laufend gepflegtes Verzeichnis.
- **Meldung von Verletzungen (Art. 33/34):** Prozess zur Meldung an die Aufsichtsbehörde binnen
  72 Stunden und Information Betroffener bei hohem Risiko.

### 6.3 EU AI Act (KI-Verordnung, Verordnung (EU) 2024/1689)

- **Einstufung (risikobasiert):** Die Plattform umfasst KI-Funktionen zur **Inhaltserstellung**
  (Kursgenerierung) und zur **Unterstützung** von Beurteilungen – trifft aber selbst **keine
  Entscheidungen über Personen** im Sinne der Verordnung und erfüllt die Schwellenwerte des
  Anhangs III nicht → Einstufung als **minimales/kein hohes Risiko**. Wichtig: Diese Einordnung
  wird durch eine **Rechtsabteilung/DSB geprüft und dokumentiert** und bei jeder
  Funktionsänderung neu bewertet (Rechtsprechung & Leitlinien des AI Office im Blick).
- **GPAI-Pflichten:** Soweit auf **generative Grundmodelle (GPAI)** zurückgegriffen wird
  (insb. bei cloudbasierten LLMs), werden deren spezifische Pflichten – Transparenz
  (Art. 50/53), Urheberrecht respektierende Trainingskennzeichnung und technische
  Dokumentation (Art. 53, Anhang XI/XII) – vertraglich vom Anbieter verlangt und überprüft.
- **Transparenz (Art. 50):** KI-generierte Lerninhalte sind für Azubis und Ausbilder klar und
  maschinenlesbar als KI-generiert gekennzeichnet (Metadaten); benannter Ansprechpartner und
  einfache Korrektur-/Widerspruchsmöglichkeit.
- **Menschliche Aufsicht (Human Oversight):** Kein KI-Ergebnis wird unbeaufsichtigt wirksam:
  Qualitäts-Gate (§3.2.2) und Review-Queue stellen sicher, dass Inhalte nachvollziehbar,
  zuordenbar und korrigierbar bleiben. **Beurteilungen, Noten und Kompetenz-Freigaben** werden
  nie automatisiert getroffen – hier entscheidet immer ein Mensch (Abgrenzung zu
  automatisierter Entscheidungsfindung nach DSGVO Art. 22).
- **Daten- & Qualitätsmanagement:** IHK-Dokumente als Ground Truth, Halluzinations-Gate,
  Quellen-Zuordnung; Modell- und Prompt-Versionen werden versioniert und in der technischen
  Dokumentation (Anhang IV analog) beschrieben.
- **Protokollierung:** Generierungs- und Freigabe-Events im Audit-Log (Modell- und
  Prompt-Version, Qualitäts-Score, verantwortliche Person/Prozess).
- **Robustheit & Sicherheit:** Prompt-Injection-Schutz, strikte DTO-Validierung (nie unvalidierter
  LLM-Output), Ausfall-/Retry-Handling im zentralen `LlmGateway`, eingeschränkter Datenabruf an
  externe LLMs (keine unnötige PII, siehe DSGVO §6.2).
- **Dokumentation & Aktualisierung:** Modelldokumentation zu Funktion, Datenfluss, Grenzen und
  Datenflüssen ist Bestandteil der technischen Dokumentation und wird bei regulatorischen
  Änderungen sowie neuen AI-Office-Leitlinien fortgeschrieben.
- **Hinweis zur Rechtsverbindlichkeit:** Funktionale Umsetzung ist hier beschrieben; die
  **finale rechtliche Bestätigung** (Einstufung, DPIA, AVV) erfolgt durch Datenschutzbeauftragten
  und Rechtsabteilung vor Produktivbetrieb. Dieses Konzept ist die technische Grundlage, kein
  Rechtsgutachten.

---

## 7. Technische Architektur

> Abweichend von früheren Entwürfen (Next.js/React) gilt als **verbindlicher** Frontend-Stack
> **Vue 3 + PrimeVue** (siehe `nextgen-tech-stack.md`). Das Frontend lebt in einem separaten Repo;
> hier ist nur der API-Vertrag relevant.

| Ebene | Technologie |
|---|---|
| Frontend | Vue 3 (Vite, TypeScript), **PrimeVue** |
| Backend & API | **NestJS** (Node.js, TypeScript), REST, Swagger unter `/api/docs`, Response `{ data, meta }` |
| Datenbank | PostgreSQL mit **pgvector**, ORM **Prisma** (`prisma/schema.prisma`, `synchronize: false`) |
| KI/RAG | **Ollama** (lokal) und/oder **OpenRouter/LiteLLM**, zentral hinter `AiService`/`LlmGateway`; strukturiertes JSON-Output |
| Auth & SSO | JWT + Guards, optional OpenID Connect/OAuth2 (Entra ID) |
| Integrationen | Personio (Abwesenheiten), iCal (Berufsschule), Microsoft Teams (notifications) |
| Infrastruktur | Docker Compose, **Traefik** (Reverse Proxy/TLS), **GitHub Actions** (CI/CD, `npm audit`, Lint, Tests, Migration-Run) |

**Grundprinzipien:**
- Kein direkter DB-Zugriff aus Controllern – Service → Repository.
- Fehler einheitlich `{ statusCode, error, message, path, timestamp, correlationId }`.
- UUID-Primary-Keys, snake_case (DB) ↔ camelCase (JSON/TS).
- KI-Antworten zwingend DTO-validiert; nie unvalidierter LLM-Freitext in die DB.
- Neue Schema-Änderungen erzeugen eine Migration im selben Commit.

---

## 8. Datenmodell (Auszug)

| Entity | Beschreibung | Wichtige Relationen |
|---|---|---|
| `User` / `UserRole` | Nutzer & Mehrfachrollen (RBAC) | n:m Rollen; 1:n zu fast allem |
| `Abteilung` | Fachabteilung (Scoping-Einheit) | 1:n → `Einsatz`, Verantwortliche |
| `Einsatz` | Abteilungsrotation: `azubiId`, `abteilungId`, `von`, `bis`, `skillLevel` | Grundlage Abteilungs-Scoping |
| `Framework` | IHK-Rahmenplan-Lernfeld (Ground Truth) | 1:n → `Course`/`Task` |
| `Course` / `Task` | KI-generierte, freigegebene Lerninhalte/Praxisaufgaben | n:1 → `Framework`; `Task` n:m → `Report` |
| `Report` | Wochenbericht (Markdown) mit Status-Maschine | n:1 → `User`; n:m → `Task`; 1:n → `ReportComment` |
| `ReportTask` | Zuordnung Bericht ↔ Kompetenz (Nachweis) | — |
| `AiDocument` / `AiDocumentChunk` | RAG-Dokumente & Embeddings (pgvector) | 1:n |
| `Zertifikat` | Hersteller-Zertifizierungen | n:1 → `User` |
| `Projekt` | Abschlussprüfung Teil 2 / Betriebliches Projekt | n:1 → `User`; Status-Maschine |
| `Abwesenheit` | Urlaub/Krank/Berufsschule, Quelle | n:1 → `User` |
| `Checklist` / `ChecklistItem` | Onboarding-Checklisten | n:1 → `User` |
| `Feedback` | Abteilungs-/Azubi-Bewertungen | n:1 → `User` (von/an), `Abteilung` |
| `WikiPage` | Wissensdatenbank (Markdown, slug) | — |
| `Grade` | Noten/Zeugnisse | n:1 → `User` |
| `Badge` / `UserBadge` | Gamification-Auszeichnungen | n:m → `User` |

**Geplante Erweiterungen des Datenmodells** (mit Migration je Commit):
- `AuditEvent` (Modul 5.1)
- `Pruefung` / `PruefungsMeilenstein` (Modul 5.2)
- `Notification` / `NotificationPreference` (Modul 5.4)
- `DatenschutzRequest` (Modul 5.6) für Export-/Lösch-Anträge inkl. Status
- `Consent` / `ConsentLog` – Einwilligungen & deren Änderung (Nachweis, DSGVO Art. 7)
- `LegalBasis` / `Verarbeitungsverzeichnis` – Rechtsgrundlage je Verarbeitung (Art. 6, Art. 30)
- `DPIA_Eintraege` – Datenschutz-Folgenabschätzung je Verarbeitung (Art. 35), inkl. Bewertungsdatum

---

## 9. Workflow: Berichtsheft-Freigabe

```
Erstellung (Azubi) → Einreichung (Azubi) → Review (Ausbildungsbeauftragter) →
in_pruefung → Visa (Ausbilder) → Archivierung (unveränderbar)
     ↳ Änderung nötig → zurück zu entwurf
```

1. **Erstellung:** Azubi erfasst Wochenberichte (Betrieb, Berufsschule, Schulungen) mit Markdown, koppelt an Tasks/Kompetenzen.
2. **Einreichung:** Automatische Erinnerung jeden Freitag (E-Mail/Teams/In-App via Benachrichtigungszentrale).
3. **Review:** Ausbildungsbeauftragter prüft, kommentiert, gibt frei oder fordert Überarbeitung an.
4. **Visa:** Ausbilder visiert final (digitale Signatur, serverseitig).
5. **Archivierung:** Nach Freigabe unveränderbar; Korrekturen nur über einen neuen Bericht.

---

## 10. Workflow: Projektabschlussprüfung (Teil 2)

```
Entwurf (Azubi) → Einreichen → Prüfung (Ausbilder/HR/Admin) →
freigegeben | abgelehnt (mit Bewertung) → Überarbeitung → erneut einreichen
     ↳ Archivierung durch Ausbilder/Admin
```

1. **Erstellung:** Azubi erstellt ein neues Projekt mit Titel, Beschreibung, Projektantrag und Projektdokumentation.
2. **Einreichung:** Azubi reicht das Projekt zur Prüfung ein (Status: `entwurf` → `eingereicht`).
3. **Prüfung:** Ausbilder/HR/Admin prüft das Projekt, gibt Feedback und bewertet. Freigabe (Status: `freigegeben`) oder Ablehnung (Status: `abgelehnt`).
4. **Überarbeitung:** Bei Ablehnung kann der Azubi das Projekt überarbeiten und erneut einreichen.
5. **Archivierung:** Ein fertiges Projekt wird durch Ausbilder/Admin archiviert (Status: `archiviert`).

Die Projekt-Entitäten sind im Prisma-Schema als `Projekt` mit den Feldern `azubiId`, `titel`, `beschreibung`, `projektantrag`, `projektdoku`, `status` (Enum), `bewertung`, `bewertetVon`, `bewertetAm`, `freigegeben` abgebildet.

---

## 11. Workflow: KI-Kursgenerierung (weitgehend automatisiert)

```
Dokumenten-Import → Parsing → Chunking/Vektorisierung (pgvector/RAG) →
Kursbaum- & Inhalte-Generierung → Qualitäts-Gate (automatisch) →
   Auto-Release (Score ≥ Schwellwert)  |   Eskalation an Ausbilder (Review-Queue)
```

- **Standardfall (vollautomatisch):** Qualitäts-Score ≥ Schwellwert → automatische Freigabe
  (`freigegeben = true`, im Audit-Log erfasst) → sofort für Azubis sichtbar. **Gilt nur für
  nicht-personenbezogene Lerninhalte**; Inhalte mit erkanntem Personenbezug landen immer in der
  Review-Queue (menschliche Freigabe, DSGVO/EU AI Act, §6).
- **Eskalation (Ausnehmer):** Score < Schwellwert oder Konflikte → Review-Queue des Ausbilders
  (bearbeiten, freigeben oder regenerieren mit konkretem Korrektur-Hinweis).
- **Nichts ist für Azubis sichtbar, solange nicht freigegeben** (siehe Domänenmodell §4).
- **Human Oversight:** Das Qualitäts-Gate entscheidet nur über fachlichen Zuschnitt, nie über
  Personen. Beurteilungen/Noten/Kompetenz-Freigaben werden nie automatisch generiert oder
  freigegeben – hier entscheidet ausschließlich ein Mensch.
- LLM-Output (Kurs, Module, Lektionen, Quiz, Praxis-Task) als strukturiertes JSON, DTO-validiert,
  mit dem validierenden Qualitäts-Gate als zweiter Kontrollstufe.
- Die Freigabe – egal ob automatisch oder manuell – ist ein bewusster, im Audit-Log erfasster Akt.

---

## 12. Nicht-Ziele & klare Abgrenzung

- **Keine** eigene Slack-Integration – ausschließlich Microsoft Teams als externer Kanal.
- **Kein** Asset-Tracking für überlassene Hardware (gezielt nicht im Umfang).
- **Keine** ungeprüfte automatische Freigabe: Die Auto-Release funktioniert nur über das
  Qualitäts-Gate und bleibt im Audit-Log; unter Schwellwert wird immer ein Mensch einbezogen.
- **Keine** subjektive fachliche Bewertung durch HR (HR sieht nur organisatorische Daten).
- **Kein** unbeaufsichtigtes KI-System, das Entscheidungen über Einzelpersonen trifft –
  Beurteilungen, Noten und Kompetenz-Freigaben entscheidet immer ein Mensch (DSGVO Art. 22,
  EU AI Act Human Oversight).
- **Keine** Verarbeitung/Wegabe unnötiger personenbezogener Daten an externe LLM-Provider –
  lokales Ollama ist für personenbezogene Daten der Standard (DSGVO Art. 44 ff.).
- **Keine** Auskunft oder Freigabe ohne dokumentierte Rechtsgrundlage und ohne AVV mit den
  beteiligten Prozessoren.

---

## 13. Roadmap (Empfehlung)

1. **Phase 1 – Basis (umgesetzt):** Auth/Rollen, Berichtsheft mit Workflow, Abteilungen/Einsatz, Zertifikate, Abwesenheiten.
2. **Phase 2 – Lernpfad (umgesetzt):** KI-Kursgenerierung (RAG, Qualitäts-Gate, Auto-Release), Wiki, Onboarding, Feedback, Noten, Gamification, Reminders, Projekte (Abschlussprüfung Teil 2).
3. **Phase 3 – Produktionsreife (geplant):** Audit-Log, Benachrichtigungszentrale, Reporting/Dashboards, Prüfungsverwaltung, Teams-Integration, MFA, Feedback-Loop-Verbesserung, DSGVO-Modul (Betroffenenrechte), AVV/Verarbeitungsverzeichnis, DPIA-Umsetzung.
4. **Phase 4 – DSGVO & Skalierung (geplant):** Datenexport/-löschung, Backup/DR mit klaren RPO/RTO, Load-Balancing hinter Traefik, ISMS-Zertifizierungsvorbereitung (ISO 27001), regelmäßige EU-AI-Act-Neu-Bewertung.
