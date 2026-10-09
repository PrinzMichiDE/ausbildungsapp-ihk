# Roadmap: NextGen IT-Ausbildungsplattform

**Fokus:** Duale Ausbildung zum Fachinformatiker (Systemintegration, Anwendungsentwicklung, Daten- und Prozessanalyse, Digitale Vernetzung)

> Dieses Dokument fasst Architektur, Features, IHK-Anforderungen, die 3-Phasen-Roadmap und Erfolgsmetriken zusammen. Es ist die strategische Referenz für Produktplanung, Stakeholder-Kommunikation und technische Umsetzung.

---

## Inhaltsverzeichnis

1. [Architektur- & Sicherheitskonzept](#1-architektur--sicherheitskonzept)
2. [Kern-Features nach Zielgruppen](#2-kern-features-nach-zielgruppen)
3. [Fachinformatiker-Spezifika & IHK-Integration](#3-fachinformatiker-spezifika--ihk-integration)
4. [3-Phasen-Roadmap](#4-3-phasen-roadmap)
5. [Erfolgsmetriken & KPIs](#5-erfolgsmetriken--kpis)

---

## 1. Architektur- & Sicherheitskonzept

### 1.1 Technischer Stack

| Schicht | Technologie | Begründung |
|---------|-------------|------------|
| **Backend** | NestJS (Node.js, TypeScript) | Strukturiert, DI-fähig, modularch, Test-bar |
| **Datenbank** | PostgreSQL + pgvector | relationale Integrität + semantische Suche für RAG |
| **ORM** | Prisma | Typsicher, Migrationen, Code-Generation |
| **Auth** | JWT + OIDC/OAuth2 (Entra ID) | Zero-Trust, SAML 2.0, MFA-Unterstützung |
| **KI/RAG** | Ollama (lokal) oder OpenRouter/LiteLLM | Hybrid-Architektur, lokal für DSGVO, cloud als Fallback |
| **Infrastruktur** | Docker Compose, Traefik | Containerisiert, reverse-proxy, TLS termination |
| **CI/CD** | GitHub Actions | Lint → Test → Build → Deploy Pipeline |

### 1.2 Architektur-Prinzipien

- **Modulare Monolith-Architektur:** NestJS-Module mit klarer Trennung (Users, Courses, Tasks, Frameworks, Reports, Deployment, AI). Keine Microservices vor Phase 3.
- **Repository-Pattern:** Kein direkter DB-Zugriff aus Controllern; Services kommunizieren ausschließlich über Repositories.
- **API-Versionierung:** `/api/v1/...` als URI-Prefix. Breaking Changes → neue Version (`/api/v2/`).
- **Response-Umschlag:** `{ data, meta }` via `TransformInterceptor`. Fehler: `{ statusCode, error, message, path, timestamp, correlationId }`.
- **Key-Mapping:** UUID-Primary-Keys, snake_case (DB) ↔ camelCase (JSON/TS).
- **Domain-Driven Design:** Entitäten spiegeln fachliche Konzepte wider (Ausbildungsplan, Lernfeld, Skill, Noten, Berichtsheft).

### 1.3 Rollenmodell (RBAC)

| Rolle | Schlüssel | Beschreibung |
|-------|-----------|--------------|
| `azubi` | Azubi | Lernt, führt Berichtsheft, sieht Noten und Lernpfade |
| `ausbilder` | Ausbilder | Fachabteilung – betreut Azubis, prüft Berichtshefte, bewertet |
| `hr` | HR | Personalverwaltung, Stammdaten, Vertrag, Urlaub, Statistik |
| `ausbildungsbeauftragter` | AB | Gesamtverantwortung, IHK-Kommunikation, Versetzung |
| `admin` | Admin | Systemverwaltung, Konfiguration, Audit-Zugriff |

**n:m-Mapping** über `user_roles` Tabelle. Guards mit Scoping via `AccessScopeService`. Endpoints standardmäßig geschützt; öffentliche Endpoints via `@Public()`.

### 1.4 Sicherheitskonzept (Zero-Trust)

#### 1.4.1 Authentifizierung & Autorisierung

| Konzept | Implementierung |
|---------|-----------------|
| **OIDC/OAuth2** | Entra ID als Identity Provider, SAML 2.0 kompatibel |
| **JWT-Tokens** | Short-lived Access Token (15 Min), Refresh Token (7 Tage) |
| **MFA** | Pflicht für HR, Admin, Ausbildungsbeauftragte; optional für Ausbilder |
| **RBAC Guards** | `@Roles()`, `@Public()`, Scoping via `AccessScopeService` |
| **Entra ID Gruppen-zu-Rollen-Mapping** | Automatisches Mapping via Gruppenmitgliedschaft + Fallback-Handover |

#### 1.4.2 Datenschutz (DSGVO)

| Maßnahme | Umsetzung |
|----------|-----------|
| **Data Minimization** | Nur notwendige Daten pro Rolle sichtbar (column-level access) |
| **Recht auf Vergessenwerden** | Pseudonymisierung statt Löschung (Audit-Logging-Pflicht) |
| **Datenportabilität** | Export aller eigenen Daten als JSON/CSV |
| **Auftragsverarbeitung** | VPA-Verträge mit Cloud-Providern, Hosting in EU/DE |
| **DPIA** | Datenschutz-Folgenabschätzung vor Phase 3-Release |
| **Verschlüsselung** | TLS 1.3 transit, AES-256 at-rest (DB-Volumes) |

#### 1.4.3 Audit-Logging

```typescript
// Audit-Event-Struktur
interface AuditEvent {
  id: UUID;
  userId: UUID;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ' | 'EXPORT' | 'LOGIN' | 'EXPORT';
  entityType: string;
  entityId: UUID;
  oldValue?: string;    // JSON-serialisiert
  newValue?: string;    // JSON-serialisiert
  ip: string;
  userAgent: string;
  timestamp: Date;
  impersonatedBy?: UUID; // Wenn im Impersonations-Modus
}
```

- **Unveränderbar:** Audit-Logs in separater Tabelle, nur append (keine Löschoperationen)
- **Impersonations-Modus:** Read-Only-Zugriff mit vollem Audit-Trail
- **Retention:** 10 Jahre (konform mit BBiG-Archivierungspflicht)

#### 1.4.4 OWASP Top 10 Defense

| Bedrohung | Gegenmaßnahme |
|-----------|---------------|
| Injection | Prisma Parameterized Queries, Input-Validation via class-validator |
| Broken Auth | JWT mit kurzem TTL, Rate-Limit, MFA-Pflicht für Admin-Rollen |
| Sensitive Data Exposure | TLS 1.3, AES-256 at-rest, keine Secrets im Code |
| XXE | XML-Parsing mit safe-Parser, keine DTD-Loading |
| Broken Access Control | RBAC Guards, row-level scoping, ownership-Checks |
| Security Misconfiguration | Hardened Docker Images, Security Headers, CSP |
| XSS | Template-Sanitization, HTML-Escape in Outputs |
| Insecure Deserialization | JSON-Validierung, keine eval()/new Function() |
| Known Vulnerabilities | Dependabot, Snyk, `npm audit` in CI |
| SSRF | URL-Validation, Allowlists für interne Netzwerke |

#### 1.4.5 ISO 27001 Konformität (Zielzustand)

| Asset | Status |
|-------|--------|
| ISMS (Information Security Management System) | Geplant für Phase 3 |
| Risikoanalyse & -behandlung | Geplant für Phase 3 |
| Access Control Policy | ✅ RBAC implementiert |
| Incident Response Plan | Geplant für Phase 3 |
| Business Continuity | Geplant für Phase 3 |
| Supplier Risk Management | Geplant für Phase 3 |

---

## 2. Kern-Features nach Zielgruppen

### 2.1 Azubis

| Feature | Beschreibung | Priorität |
|---------|-------------|-----------|
| **Digitales Berichtsheft** | Tägliche/wöchentliche Erfassung, Strukturierung nach Lernfeldern, automatische IHK-Formatierung | P0 |
| **Lernfeld-Mapping** | Zuordnung von Tätigkeiten zu offiziellen Lernfeldern des Rahmenplans | P0 |
| **Skill-Matrix** | Übersicht über erworbene Kompetenzen vs. Ausbildungsrahmenplan | P1 |
| **Noten- & Leistungsverwaltung** | Sichtbarkeit von Noten, Feedback, Praxis- und Theorie-Ergebnisse | P1 |
| **Lernpfade** | KI-generierte, personalisierte Lernempfehlungen basierend auf Lücken in der Skill-Matrix | P2 |
| **Prüfungsvorbereitung** | Modulare Übungsaufgaben (AP1 + AP2), Wissenslücken-Analyse | P2 |
| **Kalender & Erinnerungen** | IHK-Prüfungstermine, Abgabefristen Berichtsheft, persönliche Meilensteine | P1 |
| **Feedback-Schleife** | Direktes Feedback von Ausbildern auf Berichtsheft-Einträge | P1 |

### 2.2 Ausbilder (Fachabteilung)

| Feature | Beschreibung | Priorität |
|---------|-------------|-----------|
| **Berichtsheft-Prüfung** | Freigabe/Beanstandung mit kommentierenden Anmerkungen, Status-Tracking | P0 |
| **Ausbildungsplan-Verwaltung** | Individueller Plan nach §11 BBiG, Sichtbarkeit und Editierung pro Azubi | P0 |
| **Skill-Tracking** | Übersicht über Kompetenzen aller zugewiesenen Azubis, Lücken-Erkennung | P1 |
| **Praxisaufgaben** | Aufgaben erstellen, zuordnen, Status tracken, mit Bewertung | P1 |
| **Feedback & Bewertung** | Strukturierte Feedback-Vorlagen, Noten-Dokumentation | P1 |
| **Statistiken** | Durchsatz, Berichtsheft-Aktualität, Qualifikationsprofile der Azubi-Gruppe | P2 |

### 2.3 Ausbildungsbeauftragte

| Feature | Beschreibung | Priorität |
|---------|-------------|-----------|
| **Versetzungsplan** | Tracking der Versetzungsvoraussetzungen pro Azubi, IHK-konforme Dokumentation | P0 |
| **IHK-Kommunikation** | Generierung von IHK-konformen Berichten, Einreichungsvorbereitung | P1 |
| **Gesamt-Übersicht** | Dashboard mit allen Azubis, Status, Berichtsheft-Aktualität, offenen Aufgaben | P0 |
| **Ausbildungsrahmenplan-Management** | Synchronisation mit IHK-Rahmenplan, Mapping auf Lernfelder | P1 |
| **Compliance-Reporting** | Automatische Berichte für interne/externe Audits, §8 BBiG Konformität | P2 |

### 2.4 HR

| Feature | Beschreibung | Priorität |
|---------|-------------|-----------|
| **Stammdaten-Management** | Azubi-Stammdaten, Verträge, Notfallkontakte, Qualifikationshistorie | P0 |
| **Urlaubsverwaltung** | Urlaubanträge, Genehmigungen, Integration in Ausbildungsplan | P1 |
| **Onboarding/Offboarding** | Workflow-basierte Onboarding-Prozesse, Exit-Checklisten | P2 |
| **Personalstatistik** | Ausbildungszahlen, Quoten, Durchfallraten, Benchmarking | P2 |
| **DPIA-Management** | Datenschutz-Folgenabschätzung als dokumentierter Prozess | P2 |

### 2.5 Berufsschullehrer / Externe Prüfer

| Feature | Beschreibung | Priorität |
|---------|-------------|-----------|
| **Lesemodus für Berichtshefte** | DSGVO-konformer, eingeschränkter Zugriff zur externen Bewertung | P1 |
| **Digitale Signatur** | Elektronische Bestätigung der Berichtsheft-Prüfung (konform mit SignatureV2-Gesetz) | P2 |
| **Notenimport** | Schnittstelle für Noten aus Berufsschul-Systemen | P2 |

---

## 3. Fachinformatiker-Spezifika & IHK-Integration

### 3.1 Vier Fachrichtungen

| Fachrichtung | Code | Lernfelder (Beispiel) |
|--------------|------|-----------------------|
| **Systemintegration** | SI | Netze, Server, Cloud, Security |
| **Anwendungsentwicklung** | AE | Programmierung, Software-Engineering, Testing |
| **Daten- und Prozessanalyse** | DA | Datenbanken, BI, Automatisierung |
| **Digitale Vernetzung** | DV | IoT, Edge Computing, Kommunikation |

Jede Fachrichtung hat einen eigenen **IHK-Rahmenplan** mit:
- Lernfeldern (thematische Blöcke)
- Zeitrichtwerten (Stunden pro Lernfeld)
- Kompetenzerwartungen
- Prüfungsinhaltsfeldern (AP1 + AP2)

### 3.2 Digitales Berichtsheft mit digitaler Signatur

```prisma
// Entitäts-Entwurf
model Berichtsheft {
  id        UUID      @id @default(uuid())
  azubiId   UUID      @map("azubi_id")
  jahr      Int
  monat     Int
  eintraege BerichtsheftEintrag[]
  status    BerichtsheftStatus @default(ENTWURF)
  // Status: entwurf → eingereicht → geprüft → signiert → archiviert
  signiertVon  UUID?  @map("signiert_von")  // Ausbilder oder AB
  signiertAm   DateTime? @map("signiert_am")
  digitalSignature String? @map("digital_signature") // RSA-SHA256
  ihkFormat     String? @map("ihk_format")     // Generiertes IHK-konformes PDF
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
}

model BerichtsheftEintrag {
  id        UUID      @id @default(uuid())
  berichtsheftId UUID @map("berichtsheft_id")
  datum     DateTime
  beschreibung String
  lernfeldId UUID?   @map("lernfeld_id")       // Optional: Zuordnung zu Lernfeld
  stunden   Decimal   @db.Decimal(3, 1)
  activity  Json?                         // strukturierte Metadaten
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
}
```

**Digitale Signatur-Workflow:**
1. Azubi trägt Tätigkeiten ein (tägliche/wöchentliche Erfassung)
2. Ausbilder prüft und genehmigt
3. Ausbildungsbeauftragte:r signiert digital (RSA-SHA256)
4. Archivierung in unveränderbarer Form (mindestens 5 Jahre, empfohlen 10)
5. Export als IHK-konformes PDF mit Signatur-Nachweis

### 3.3 Ausbildungsrahmenplan & Versetzungsplan

#### Ausbildungsrahmenplan (IHM-konform)

```prisma
model Rahmenplan {
  id          UUID       @id @default(uuid())
  beruf       Beruf      // SI, AE, DA, DV
  jahr        Int        // 1-3 (Ausbildungsjahr)
  lernfelder  Lernfeld[]
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")
}

model Lernfeld {
  id            UUID         @id @default(uuid())
  rahmenplanId  UUID         @map("rahmenplan_id")
  nummer        Int          // z.B. 07, 08, 09
  titel         String       // z.B. "IT-Systeme installieren und betreiben"
  stunden       Int          // Zeitrichtwert
  kompetenzen   Json         // [ { "id": "...", "bezeichnung": "...", "niveau": "B2" } ]
  inhalte       Json?        // didaktische Umsetzung
  createdAt     DateTime     @default(now()) @map("created_at")
  updatedAt     DateTime     @updatedAt @map("updated_at")
}
```

#### Versetzungsplan

- **Automatische Berechnung** der Versetzungsvoraussetzungen basierend auf:
  - Berichtsheft-Vollständigkeit (mindestens 80% der Arbeitsstunden dokumentiert)
  - Noten (Theorie und Praxis)
  - Skill-Matrix (mindestens 70% der geforderten Kompetenzen erworben)
  - Fehlzeiten (unterhalb der Obergrenze)
- **IHK-konforme Dokumentation** als PDF-Export

### 3.4 Prüfungsvorbereitung (AP1 + AP2)

| Feature | Beschreibung | Technologie |
|---------|-------------|-------------|
| **Prüfungsinhaltsfelder** | Mapping der offiziellen Prüfungsinhaltsfelder auf Lernfelder | Manuell + KI-Hilfe |
| **Modulare Übungsaufgaben** | Fragebank mit Kategorien nach Lernfeld und Schwierigkeitsgrad | Relationale DB |
| **Adaptive Prüfungssimulation** | KI generiert angepasste Tests basierend auf Wissenslücken | RAG + LLM |
| **Wissenslücken-Analyse** | Heatmap der nicht-abgedeckten Prüfungsinhalte | pgvector Similarity Search |
| **Praxisaufgabe AP2** | Strukturierter Workflow für die Projektprüfung | Workflow-Engine |

**Prüfungssimulation via KI:**

```typescript
// AI Service: Prüfungsvorbereitung
class ExamPrepService {
  // KI-generierte Übungsaufgaben basierend auf aktuellen Schwächen
  async generatePracticeQuestions(
    azubiId: UUID,
    fachrichtung: Beruf,
    anzahl: number,
    thema?: string,
  ): Promise<PracticeQuestion[]>

  // Wissenslücken-Analyse mit vector similarity
  async analyzeKnowledgeGaps(
    azubiId: UUID,
  ): Promise<KnowledgeGap[]>

  // Prüfungssimulation mit adaptive difficulty
  async runMockExam(
    azubiId: UUID,
    pruefungsTyp: 'AP1' | 'AP2',
  ): Promise<MockExamResult>
}
```

### 3.5 Noten- & Leistungsverwaltung

| Notentyp | Quelle | Gewichtung |
|----------|--------|------------|
| **Theorienote** | Berufsschule, interne Tests | 40% |
| **Praxisnote** | Praxisaufgaben, Projektarbeit | 30% |
| **Berichtsheft** | Qualität und Vollständigkeit | 10% |
| **Sonstige Leistungen** | Arbeitsverhalten, Feedback | 10% |
| **IHK-Prüfung** | AP1 (schriftlich/mündlich), AP2 (Projekt) | 100% (abschließend) |

- **Notenverlauf** mit Zeitstrahl pro Azubi
- **Berechnung** der Gesamtnote nach IHK-Schlüssel
- **Export** für IHK-Prüfungsanmeldung

---

## 4. 3-Phasen-Roadmap

### Phase 1 — MVP & Compliance (Monate 1–6)

> **Ziel:** Funktionsfähige Basisplattform mit Kern-Features und regulatorischer Grundkonformität.

#### Akzeptanzkriterien

| Nr. | Kriterium | Verifikation |
|-----|-----------|--------------|
| 1.1 | User Management mit RBAC (5 Rollen) und JWT-Auth | E2E-Test: Login → Token → Guard-Check |
| 1.2 | Berichtsheft-CRUD mit Status-Workflow (Entwurf → Eingereicht → Geprüft) | E2E-Test: Azubi erstellt → Ausbilder prüft |
| 1.3 | Ausbildungsplan nach §11 BBiG mit Lernfeld-Mapping | Manuelle Prüfung gegen BBiG-Anforderungen |
| 1.4 | Rollenbasierte Zugriffskontrolle auf allen Endpoints | Security-Review aller Guards |
| 1.5 | Audit-Logging aller CRUD-Operationen | Log-Injection-Test: Alle Aktionen protokolliert |
| 1.6 | API-Dokumentation (OpenAPI/Swagger) | Swagger UI erreichbar, alle Endpoints dokumentiert |
| 1.7 | DSGVO-Grundkonformität: TLS, Data Minimization, Logging | DPIA-Dokument erstellt |

#### Deliverables

| Artefakt | Verantwortlich |
|----------|---------------|
| NestJS-Basis mit Modules: Users, Auth, Roles, Report, Framework | Backend-Team |
| Prisma-Schema mit Migrationen | Backend-Team |
| RBAC-Guards mit AccessScopeService | Backend-Team |
| Audit-Logging-Interceptor | Backend-Team |
| Swagger-Dokumentation | Backend-Team |
| Unit-Tests (Coverage >70%) | Backend-Team |
| Docker Compose (Local Dev) | DevOps |
| README mit Setup-Anleitung | Tech Lead |

#### Dependencies

- Bestehende NestJS-Infrastruktur (Phase 0)
- Prisma + PostgreSQL
- Docker Compose

---

### Phase 2 — IHK-Vertiefung (Monate 7–15)

> **Ziel:** Vollständige IHK-konforme Funktionalität mit digitaler Signatur, Prüfungsvorbereitung und Versetzungsmanagement.

#### Akzeptanzkriterien

| Nr. | Kriterium | Verifikation |
|-----|-----------|--------------|
| 2.1 | Digitales Berichtsheft mit digitaler Signatur (RSA-SHA256) | Kryptographischer Verify-Test |
| 2.2 | IHK-konformer PDF-Export des Berichtshefts | Manuelle Prüfung mit IHK-Vorgaben |
| 2.3 | Versetzungsplan mit automatischer Berechnung | Testdaten-Szenario: Berechnung → Ergebnis |
| 2.4 | Prüfungsvorbereitung: Fragebank mit AP1/AP2-Simulation | User-Testing mit Azubi-Gruppe |
| 2.5 | Skill-Matrix mit Lernfeld-Tracking | Vergleich Matrix vs. Rahmenplan |
| 2.6 | Noten- & Leistungsverwaltung mit IHK-Gewichtung | Berechnungs-Test gegen IHK-Schlüssel |
| 2.7 | Export aller Daten (DSGVO Art. 20: Datenportabilität) | JSON/CSV-Export verifiziert |
| 2.8 | Notification-System (Email-Benachrichtigungen) mit Outbox-Pattern | Email-Trigger-Tests, Outbox-Tabelle |

#### Deliverables

| Artefakt | Verantwortlich |
|----------|---------------|
| Digital Signature Service | Backend-Team |
| PDF-Generation Service (Berichtsheft) | Backend-Team |
| Versetzungs-Engine | Backend-Team |
| Fragebank-Service + Prüfungssimulation | Backend-Team |
| Skill-Matrix-Service | Backend-Team |
| Noten-Berechnungs-Service | Backend-Team |
| Notification Service (SMTP, Outbox-Pattern) | Backend-Team |
| Data Export Service (JSON/CSV) | Backend-Team |
| Integration Tests (Supertest + Testcontainers) | QA-Team |
| E2E-Tests für Kern-Workflows | QA-Team |

#### Dependencies

- Phase 1 abgeschlossen
- PDF-Generation Library (z.B. Puppeteer, pdfmake)
- SMTP-Server / E-Mail-Dienst
- RSA-Schlüsselpaar für digitale Signaturen

---

### Phase 3 — Enterprise & KI (Monate 16–24)

> **Ziel:** KI-gestützte Features, Enterprise-Integrationen und ISO 27001-Konformität.

#### Akzeptanzkriterien

| Nr. | Kriterium | Verifikation |
|-----|-----------|--------------|
| 3.1 | KI-generierte Lernpfade (RAG over Rahmenplan) | RAG-Pipeline-Tests, Accuracy-Review |
| 3.2 | Adaptive Prüfungssimulation mit LLM | User-Testing: Lernfortschritt gemessen |
| 3.3 | Wissenslücken-Analyse mit pgvector | Similarity Search: Top-3-Empfehlungen relevant |
| 3.4 | KI-Hilfe für Berichtsheft (Auto-Vervollständigung) | UX-Testing: Azubis nutzen Auto-Fill |
| 3.5 | HR-Onboarding/Offboarding Workflows | Workflow-Engine Test-Flows |
| 3.6 | Personalstatistik & Benchmarking-Dashboard | Dashboard mit korrekten Berechnungen |
| 3.7 | ISO 27001: ISMS dokumentiert, Risikoanalyse durchgeführt | Externes Audit bestanden |
| 3.8 | Business Continuity Plan + Disaster Recovery | DR-Drill durchgeführt |
| 3.9 | Impersonations-Modus mit vollem Audit-Trail | Security-Review: Read-Only, Audit-Log |

#### Deliverables

| Artefakt | Verantwortlich |
|----------|---------------|
| AI Service (RAG, LLM-Gateway) | AI-Team |
| Lernpfad-Engine (KI-generiert) | AI-Team + Backend |
| pgvector-Integration für Similarity Search | Backend-Team |
| Auto-Suggest für Berichtsheft | AI-Team |
| HR-Workflows (Onboarding/Offboarding) | Backend-Team |
| Statistik-Dashboard | Frontend-Team |
| ISO 27001: ISMS-Doku, Risikoanalyse, Access Policy | Security-Team |
| DR-Plan, Backup-Strategy | DevOps |
| Impersonation-Service | Backend-Team |

#### Dependencies

- Phase 2 abgeschlossen
- Ollama/OpenRouter/LiteLLM Integration
- pgvector auf PostgreSQL
- Externes Audit-Team (ISO 27001)

---

## 5. Erfolgsmetriken & KPIs

### 5.1 Produkt-Metriken

| KPI | Ziel (Phase 1) | Ziel (Phase 2) | Ziel (Phase 3) | Messung |
|-----|----------------|----------------|----------------|---------|
| **Aktive Azubis/Monat** | 50 | 200 | 500+ | Analytics Dashboard |
| **Berichtsheft-Aktualität** | 70% in <7 Tagen | 85% in <3 Tagen | 95% in <2 Tagen | Berichtsheft-Service |
| **Ausbildungsplan-Deckung** | 60% aller Lernfelder dokumentiert | 80% | 95% | Framework-Service |
| **Nutzerzufriedenheit (CSAT)** | 3.5 / 5.0 | 4.0 / 5.0 | 4.5 / 5.0 | Quartals-Umfrage |
| **Feature-Adoption Rate** | 50% | 75% | 90% | Usage Analytics |

### 5.2 Qualitäts-Metriken

| KPI | Ziel | Messung |
|-----|------|---------|
| **Unit-Test-Abdeckung** | >80% | Jest Coverage Report |
| **E2E-Test-Abdeckung** | >70% der Kern-Workflows | Playwright/Cypress |
| **CI/CD Success Rate** | >90% | GitHub Actions Dashboard |
| **API Response Time (p95)** | <500ms | APM (Application Performance Monitoring) |
| **Error Rate (5xx)** | <0.1% | Error Tracking (Sentry o.ä.) |
| **Downtime** | <0.5% pro Quartal | Uptime Monitoring |

### 5.3 Sicherheits-Metriken

| KPI | Ziel | Messung |
|-----|------|---------|
| **Critical/High CVEs** | 0 innerhalb von 7 Tagen | Dependabot / Snyk |
| **Audit-Log Vollständigkeit** | 100% aller Aktionen protokolliert | Log-Injection-Test |
| **RBAC-Guard Coverage** | 100% aller Endpoints geschützt | Code-Review + Security-Scan |
| **Penetrationstest** | 0 Critical Findings | Externer Pentest vor Phase 3 |
| **DSGVO-Compliance** | 100% der Anforderungen erfüllt | Interne Compliance-Prüfung |
| **MFA Adoption (Admin/HR)** | 100% | Auth-Service Analytics |

### 5.4 Business-Metriken

| KPI | Ziel | Messung |
|-----|------|---------|
| **IHK-Prüfungsdurchsatz** | +10% bestanden vs. Vorjahr | IHK-Statistik |
| **Ausbildungsabbruchquote** | -15% vs. Vorjahr | HR-Statistik |
| **Zeit für Berichtsheft-Prüfung** | -50% (manuell → digital) | Zeit-Messung (Before/After) |
| **Onboarding-Zeit neuer Azubi** | <1 Tag (statt <1 Woche) | HR-Timer |
| **IHK-Report-Erstellungszeit** | <5 Min (statt <2 Stunden) | Zeit-Messung |

---

## Anhang

### A. Glossar

| Begriff | Bedeutung |
|---------|-----------|
| **BBiG** | Bundesausbildungsförderungsgesetz |
| **KrÄD** | Ausbildungsverordnung (Regelungen zur Ausbildung) |
| **KrAVG** | Verordnung über die Berufsbildungsprüfung |
| **IHK** | Industrie- und Handelskammer |
| **AP1** | Abschlussprüfung Teil 1 (mittlerer Abschluss) |
| **AP2** | Abschlussprüfung Teil 2 (Projektprüfung) |
| **RAG** | Retrieval-Augmented Generation (KI-Architektur) |
| **DPIA** | Data Protection Impact Assessment |
| **ISMS** | Information Security Management System |
| **VPA** | Vertrauliche Partnerschaftsvereinbarung (DSGVO) |

### B. Referenzdokumente

| Dokument | Pfad |
|----------|------|
| Softwarekonzept (Fachlich) | `concept.md` |
| Rechtlich-organisatorische Funktionalitäten | `concept2.md` |
| Produktionsreifegrade | `plan.md` |
| Agent-Regeln (Technisch) | `.opencode/rules/` |

### C. Versionshistorie

| Version | Datum | Autor | Änderungen |
|---------|-------|-------|------------|
| 1.0 | 2026-10-09 | — | Initialversion |