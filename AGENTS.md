# AGENTS.md — NextGen IT-Ausbildung (Backend)

NestJS-basiertes Backend für die Ausbildungsplattform "NextGen IT-Ausbildung".
Details zum Fachkonzept: `concept.md`.

## Stack
- **Backend:** NestJS (Node.js, TypeScript), REST-API
- **DB:** PostgreSQL + pgvector, ORM: Prisma
- **KI/RAG:** Ollama (lokal) oder OpenRouter/LiteLLM, zentral hinter `AiService`/`LlmGateway`
- **Infra:** Docker Compose, Traefik, GitHub Actions

## Projektstruktur
```
src/
  common/         # DTOs, constants (error-codes, roles), interceptors, filters
  modules/        # reports, frameworks, courses, tasks, deployment, users, ...
prisma/           # Schema & Migrations
.opencode/rules/  # Agent rules (see below)
```

## Agent-Regeln (verbindlich)
Alle fachlichen und technischen Entscheidungen folgen den Regeln in `.opencode/rules/`:

> **`code-review-standard.md`** hat Vorrang — sie definiert den Code-Review-Standard, die Englisch-Sprachnutzung und die Dokumentationsregeln.

| Regel | Datei | Gilt für |
|---|---|---|
| **Clean Code & Refactoring** | `clean-code-refactoring.md` | Immer erzwungen — KISS, SOLID, DRY, proaktives Refactoring, strenge Typisierung, Fehlerbehandlung |
| **Architecture, Security & Testing** | `architecture-security-testing.md` | Immer erzwungen — Design Patterns, DI, SoC, Security by Design, Performance, Pure Functions, Immutability, Zero Hardcoding, Edge Cases |
| **UI/UX & Accessibility** | `ui-ux-accessibility.md` | Immer erzwungen — Semantisches HTML, A11y, Tastaturbedienung, Optimistic UI, Responsive, Design-Tokens, Micro-Interactions |
| **Git Auto Commit & Push** | `git-auto-commit.md` | Immer erzwungen — Automatisches commit/push, atomare Commits, Splitten, Commit-Format |
| **Code Review Standard** | `code-review-standard.md` | Alle Code, alle Commits, alle Reviews — Senior-Dev-Prüfung, Englisch-Standard, Doku-Regeln |
| Error-Handling | `nestjs-error-handling.md` | Controller, Filter, Exceptions |
| API-Design & DTO | `nestjs-api-design.md` | Controller, DTOs, Routing, Swagger |
| Security | `nestjs-security.md` | Auth, Guards, Secrets, CORS, Rate-Limit |
| Entra ID | `nestjs-entra-id.md` | OIDC/OAuth2, Gruppen-zu-Rollen-Mapping, Fallback |
| Impersonationsmodus | `nestjs-impersonation.md` | Read-Only-Impersonation, Audit-Logging, Datenschutz |
| Database & Migration | `nestjs-database.md` | Entities, Migrationen, Queries, Transaktionen |
| Documentation | `nestjs-documentation.md` | READMEs, JSDoc, ADRs |
| RBAC & Rollenmodell | `nestjs-rbac.md` | Guards, Scoping, AccessScopeService |
| Domänenmodell | `nextgen-domain.md` | Entities, Services, Module, Workflows |
| Tech-Stack | `nextgen-tech-stack.md` | Libraries, DB-Schema, Infra, KI-Integration |
| Docker-Deployment | `nestjs-docker.md` | Dockerfile, Docker Compose, Traefik, prod Deployment |
| UI/UX Konzept | `ui-ux-concept.md` | Navigation, User Journeys, Interface Design, A11y, Pinia Stores, Theming |
| UI/UX CSS-Konzept | `ui-ux-css-concept.md` | Tailwind-Architektur, PrimeVue Unstyled Mode, Design-Tokens, Dark Mode, Responsive |
| **Dark & Light Mode** | `dark-light-mode.md` | **Immer erzwungen** — Dark- und Light-Modus muss bei jeder UI-Änderung funktionieren |
| UI/UX Enterprise | `ui-ux-enterprise.md` | Frontend-Design, PrimeVue, Accessibility, UX-Grundregeln |
| Lizenz-Compliance | `license-compliance.md` | Abhängigkeiten, Lizenzen, Commercial-Free, Fremdcode |
| **Zero-Trust & Defensive Security** | `zero-trust-security.md` | Immer erzwungen — Zero-Trust AuthZ, OWASP Top 10, DSGVO/GDPR, Supply-Chain, Audit-Logging |

Vor jeder Änderung die passende Regel laden und beachten. Die Regeln `clean-code-refactoring.md`, `architecture-security-testing.md`, `zero-trust-security.md`, `dark-light-mode.md` und `git-auto-commit.md` sind **immer erzwungen** (unabhängig vom geänderten Dateityp). Bei neuen Endpoints zuerst die
RBAC-Berechtigungsmatrix (§4) prüfen/ergänzen, bei Schema-Änderungen eine Migration im selben
Commit erzeugen (`synchronize: false`).

## Konventionen (Kurzfassung)
- API-Versionierung: `/api/v1/...` (URI-Prefix)
- Response-Umschlag: `{ data, meta }` (TransformInterceptor), Fehler: `{ statusCode, error, message, path, timestamp, correlationId }`
- UUID-Primary-Keys, snake_case (DB) ↔ camelCase (JSON/TS)
- Auth via JWT + Guards; Endpoints standardmäßig geschützt (`@Public()` für öffentlich)
- Rollen: `azubi`, `ausbildungsbeauftragter`, `ausbilder`, `hr`, `admin` (n:m über `user_roles`)
- Kein direkter DB-Zugriff aus Controllern; Service → Repository
