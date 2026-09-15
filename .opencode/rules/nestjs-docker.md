---
name: NestJS Docker-Deployment
description: Verbindliche Regel — das NestJS-Backend läuft auch im produktiven Deployment in einem Docker Container; frontal davor steht Traefik als Reverse Proxy (einziger Zugang nach außen, alle Backends intern). Multi-Stage Production Image, Dockerfile im Repo-Root, ausgerollt via Docker Compose. Immer beachten bei Deployment-, Build- und Infrastruktur-Änderungen.
globs:
  - "Dockerfile*"
  - "docker-compose.*"
  - ".github/**"
  - "package.json"
  - "src/main.ts"
---

# NestJS Docker-Deployment

Verbindliche Regel: Das NestJS-Backend wird **auch im produktiven Deployment in einem Docker Container** betrieben. Es gibt kein produktives Deployment ohne Container (kein Bare-Metal/host-level `node` Start).

**Topologie (verbindlich):** Vor dem NestJS-Backend steht **Traefik als Reverse Proxy** — Traefik ist der einzige Zugang nach außen (exponiert 80/443), APP- und DB-Container bleiben im internen Docker-Netzwerk und werden **nicht** direkt am Host publiziert.

## 1. Container-Image (verbindlich)

- Bau eines **multi-stage** `Dockerfile` im Repo-Root: Build-Stage (devDependencies, TypeScript-Build) → Runtime-Stage (nur Produktions-Dependency mit `npm ci --omit=dev`).
- Runtime-Image auf einem stabilen **Node LTS**-Basisslim-Image (z. B. `node:22-alpine`), nicht `latest`.
- Container startet die NestJS-App mit dem aus `Dockerfile` gebautem `dist/`-Artefakt und **nicht** per dev server (`nest start --watch` ist nur für lokale Entwicklung).
- Geheimnisse (DATABASE_URL, JWT_SECRET, LLM-Keys) nicht ins Image bauen — nur via Umgebungsvariablen/`.env`/Secret-Management (siehe Security-Regel §4).
- Healthcheck im Image/Compose gegen den NestJS-Health-Endpoint, damit Traefik/Docker den Container zuverlässig routen/neustarten kann.

## 2. Betrieb (verbindlich)

- Ausrolle über **Docker Compose** mit **Traefik frontal davor**: Traefik routet auf den internen NestJS-Container (Labels am App-Service, z. B. `traefik.http.routers.nextgen.*`), terminiert TLS und setzt `X-Forwarded-*`; `app.set('trust proxy', 1)` in `main.ts` bleibt aktiv.
- App- und DB-Container publizieren **keine** Host-Ports nach außen — eingehender Traffic läuft ausschließlich über Traefik (80/443). Interne Erreichbarkeit über einen gemeinsamen Compose-/Traefik-Netzwerknamen.
- `restart: unless-stopped`, abhängig von der DB (bereit über Healthcheck), korrekte Container-/Netzwerk-Zuordnung; App ist im Traefik-Service-Netzwerk erreichbar.
- Produktiv-Deploy fährt kein `npm run start:dev`, keine Watch-Modi, keine hostinstallierten globalen npm-Binaries.
- Migrationen laufen vor dem Start des App-Containers (CI: Migration-Run vor Deploy; `synchronize: false`, siehe Datenbank-Regeln).

## 3. Verpflichtung

- Jede Deployment-/Build-Änderung muss das Docker-Bild konsistent halten (Build läuft, Image startet, Healthcheck grün).
- Tests im CI laufen außerhalb, das zu deployende Artefakt ist das Docker-Image.
- Kein PR/Commit in Richtung Produktion, der das Backend außerhalb eines Containers betreibt oder das Repo ohne valides `Dockerfile` lässt.

## 4. Verbote

- Kein produktiver `node dist/main.js` direkt auf dem Host / per Systemd host-level ohne Container.
- Kein direktes Host-Port-Publishing (`ports:` an Traefik vorbei) für App/DB im produktiven Deployment — Zugang nur über Traefik (80/443).
- Kein `dist`-ordner im Image via volume-mount aus dem Host bei Produktion (Reproduzierbarkeit).
- Keine Secrets als Build-ARGS (`--build-arg`) hart im Image ablegen.