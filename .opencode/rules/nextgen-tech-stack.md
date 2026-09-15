---
name: NextGen Tech-Stack
description: Verbindlicher Technologie-Stack der Plattform "NextGen IT-Ausbildung" (Backend NestJS, PostgreSQL+pgvector, Prisma ORM, LLM/RAG via Ollama/OpenRouter/LiteLLM, Docker Compose/Traefik/GitHub Actions). Immer beachten bei Wahl von Libraries, DB-Schema, Infrastruktur oder KI-Integration.
globs:
  - "package.json"
  - "prisma/**"
  - "docker-compose.*"
  - "Dockerfile*"
  - ".github/**"
  - "src/**/*.service.ts"
  - "src/**/ai/**"
  - "src/**/rag/**"
---

# Tech-Stack-Regeln: NextGen IT-Ausbildung

Quelle: `concept.md` §7 (Technische Architektur). Diese Regeln fassen den verbindlichen Technologie-Stack zusammen und ergänzen die DB-, Security- und Domänen-Regeln.

## 1. Backend

- **NestJS** (Node.js/TypeScript) als API-Framework — die allgemeinen NestJS-Regeln (Error-Handling, API-Design, Security, DB, Dokumentation, RBAC) gelten vollumfänglich.
- API-Stil: **REST** über NestJS-Controller (das `concept.md` nennt "tRPC oder REST" — da dieses Repo auf NestJS steht, gilt REST mit den API-Design-Regeln; tRPC ist nicht im NestJS-Stack).
- Sprache durchgängig **TypeScript**, strikt typisiert.

## 2. Datenbank & ORM

- **PostgreSQL** als relationale DB, inkl. **pgvector** für Vektor-Indexierung der RAG-Dokumente.
- ORM: **Prisma** (oder Drizzle) — Entscheidung projektweit konsistent halten, nicht mischen.
- Schema-Definitions liegen in `prisma/schema.prisma` (bei Prisma) — siehe Datenbank-Regeln für Naming, Migrationen (`synchronize: false`, append-only), Pflichtfelder (UUID-PK, `createdAt`/`updatedAt`).
- `pgvector`-Spalten (embedding) als eigener Feld-Typ im Schema; Embeddings niemals im Normaltext-Log.

## 3. KI-Infrastruktur (LLM & RAG)

- LLM-Anbindung über **Ollama** (lokale Modelle, Datenschutz) oder APIs (**OpenRouter**, **LiteLLM**) — zentral hinter einem `AiService`/`LlmGateway`, nie direkte Provider-Calls verstreut im Code.
- RAG-Pipeline: Dokumenten-Import (PDF) → Chunking → Vektorisierung in pgvector → Retrieval als Ground Truth für das LLM.
- LLM-Output muss **strukturiertes JSON** sein (Kurs/Praxisaufgabe) — Antwort zwingend über DTO validieren, bevor sie persistiert/genutzt wird (kein unvalidierter Freitext).
- Keine Secrets/API-Keys von LLM-Providern im Code — ausschließlich über `ConfigService`/`.env` (siehe Security-Regel §4).
- Datenschutz: lokale LLMs bevorzugt, wenn personenbezogene Ausbildungsdaten verarbeitet werden; bei Cloud-LLM explizit dokumentieren, welche Daten (keine PII unnötig senden).

## 4. Frontend

- **Vue 3** (Vite, TypeScript) mit **PrimeVue** als UI-Komponenten-Bibliothek.
- Abweichung vom `concept.md` (das Next.js/React/Tailwind/Material UI nennt): Frontend-Stack ist Vue 3 + PrimeVue — bei Konflikten gilt diese Regel.
- Frontend liegt außerhalb dieses Backend-Repos (wo anders) — hier nur API-Vertrag relevant (siehe API-Design-Regeln: einheitlicher `data`/`meta`-Umschlag, Swagger unter `/api/docs`).

## 5. Infrastruktur & Deployment

- **Docker Compose** für lokale/self-hosted Stacks; **Traefik** als Reverse Proxy (terminiert TLS, setzt `X-Forwarded-*`).
- In `main.ts`: `app.set('trust proxy', 1)` (hinter Traefik/Proxy) — siehe Security-Regel §5.
- **GitHub Actions** für CI/CD: Build, `npm audit`, Lint, Tests, Migration-Run vor Deploy.
- `.env.example` mit Platzhaltern; `.env` in `.gitignore` (siehe Security-Regel §4).

## 6. Dependency- & Build-Disziplin

- `npm audit` fest in CI (Security-Regel §9) — kritische CVEs lassen Build fehlschlagen.
- Keine Library ohne dokumentierten Grund bei bekanntem kritischen CVE.
- Nur etablierte, geprüfte Libraries für Krypto/Hashing (Security-Regel §10) — nie eigene Implementierung.

## 7. Verbote

- Kein Mix aus Prisma und Drizzle im selben Projekt.
- Kein direkter LLM-Provider-Call außerhalb des zentralen `AiService`/`LlmGateway`.
- Keine KI-Antwort ohne DTO-Validierung in die DB schreiben.
- Kein Cloud-LLM mit PII ohne dokumentierte Freigabe/Datenschutz-Begründung.
