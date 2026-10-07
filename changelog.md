# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Alle wichtigen Änderungen dieses Projekts werden in dieser Datei dokumentiert.
Format: [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionierung:
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] — Unveröffentlicht

### Added / Hinzugefügt
### Changed / Geändert
### Deprecated / Veraltet
### Removed / Entfernt
### Fixed / Behoben
### Security / Sicherheit

---

## [1.0.0] — 2026-10-07

Initial release of the "NextGen IT-Ausbildung" training platform.
Erste Veröffentlichung der Ausbildungsplattform "NextGen IT-Ausbildung".

### Added / Hinzugefügt

**Backend (NestJS)**
- NestJS 12 REST API with versioned routes (`/api/v1/...`), unified
  `{ data, meta }` response envelope and a global exception filter
  (`{ statusCode, error, message, path, timestamp, correlationId }`).
  NestJS-12-REST-API mit versionierten Routen, einheitlichem
  `{ data, meta }`-Antwortschleier und globalem Exception-Filter.
- Authentication via JWT (Passport) with RBAC guards (`@Roles`, `@Public`),
  MFA (TOTP) including enrollment and login challenge, audit logging and
  read-only impersonation.
  Authentifizierung über JWT (Passport) mit RBAC-Guards, MFA (TOTP) inkl.
  Enrollment- und Login-Challenge, Audit-Logging und Read-Only-Impersonation.
- 43 domain modules, among them Berichtsheft/work reports, skill matrix and
  courses, deployment planning, exam preparation, onboarding, feedback, wiki,
  grades, certificates, gamification, reminders, reporting/KPIs, notifications
  (in-app + Teams) and data protection (consents, DSFA, export/deletion).
  30 Fachmodule, u. a. Berichtsheft, KI-Skill-Matrix/Kurse, Einsatzplanung,
  Prüfungsvorbereitung, Onboarding, Feedback, Wiki, Noten, Zertifikate,
  Gamification, Erinnerungen, Reporting/KPIs, Benachrichtigungen
  (In-App + Teams) und Datenschutz (Einwilligungen, DSFA, Export/Löschung).
- Central AI/RAG integration behind `AiService` / `LlmGateway`
  (Ollama locally or OpenRouter/LiteLLM).
  Zentrale KI/RAG-Integration hinter `AiService` / `LlmGateway`
  (lokal über Ollama oder OpenRouter/LiteLLM).
- OpenAPI/Swagger documentation (English) at `/api/docs`.
  OpenAPI/Swagger-Dokumentation (Englisch) unter `/api/docs`.

**Database (PostgreSQL + Prisma)**
- Prisma schema with 8 migrations, UUID primary keys, snake_case in the
  database mapped to camelCase in JSON/TypeScript, `synchronize: false`
  (migrations only via `prisma migrate`).
  Prisma-Schema mit 8 Migrationen, UUID-Primary-Keys, `snake_case` in der
  DB gemappt auf `camelCase` in JSON/TypeScript, `synchronize: false`
  (Migrationen ausschließlich via `prisma migrate`).
- Seed script with roles, departments, trainees and AI knowledge documents.
  Seed-Skript mit Rollen, Abteilungen, Azubis und KI-Wissensdokumenten.

**Frontend (Vue 3)**
- Vue 3 + Vite application with Pinia state management, PrimeVue (unstyled
  mode with design tokens), Tailwind CSS 4 and dark/light mode support.
  Vue-3-Anwendung mit Vite, Pinia-State-Management, PrimeVue (Unstyled Mode
  mit Design-Tokens), Tailwind CSS 4 und Dark-/Light-Mode-Unterstützung.

**Tooling & Infrastructure**
- Docker images and Compose setups for development and production
  (PostgreSQL with pgvector, Traefik reverse proxy).
  Docker-Images und Compose-Setups für Development und Produktion
  (PostgreSQL mit pgvector, Traefik-Reverse-Proxy).
- CI pipeline (GitHub Actions) with build, lint (oxlint), type check and
  test gates (Vitest, unit + e2e).
  CI-Pipeline (GitHub Actions) mit Build-, Lint- (oxlint), Typecheck- und
  Test-Gates (Vitest, Unit + E2E).
- Documentation set: `README.md`, `concept.md`, `AGENTS.md`, `Design.md` and
  the binding agent rules in `.opencode/rules/`.
  Dokumentationssatz: `README.md`, `concept.md`, `AGENTS.md`, `Design.md`
  und die verbindlichen Agent-Regeln in `.opencode/rules/`.

[Unreleased]: https://github.com/PrinzMichiDE/ausbildungsapp-ihk/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/PrinzMichiDE/ausbildungsapp-ihk/releases/tag/v1.0.0
