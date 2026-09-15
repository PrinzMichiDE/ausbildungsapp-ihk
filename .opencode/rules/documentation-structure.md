---
name: Documentation Structure
description: Gesamtübersicht über alle Dokumentationsarten, Strukturen und Wartungspflichten im Projekt. Immer beachten bei Erstellung/Aktualisierung von Dokumentation.
globs:
  - "**/*.md"
  - "docs/**"
  - "src/**/README.md"
  - ".opencode/rules/*.md"
---

# Dokumentationsstruktur: NextGen IT-Ausbildung / Documentation Structure

Diese Rule definiert die Gesamtübersicht über alle Dokumentationsarten im Projekt und deren Wartungspflichten.

---

## English Section

### 1. Documentation Levels

| Level | Location | Required When |
|---|---|---|
| Project README | `/README.md` | Always |
| Module README | `src/modules/<feature>/README.md` | For complex features (>5 endpoints, business rules, external integrations) |
| API Documentation | `/api/docs` (Swagger) | Always |
| Technical Documentation | `/docs/` | As needed |
| Architecture Decision Records | `/docs/adr/` | For architectural decisions with long-term impact |

### 2. Language Rules

- **Documentation**: German + English (bilingual)
- **Code Comments**: English only
- **Swagger/OpenAPI**: English only
- **Commit Messages**: English only

### 3. Project README Content (Required)

1. **Description** (2-3 sentences what the app does)
2. **Prerequisites** (Node version, DB, external services)
3. **Setup** (`.env`, install, migrations, seed)
4. **Local Development** (start commands)
5. **Testing** (run tests)
6. **Documentation Links** (architecture, ADRs, API docs at `/api/docs`)

### 4. Module README Content (Required for Complex Features)

```markdown
# Module Name

## Purpose
What does this module do?

## State Machine
state1 → state2 → state3

## Business Rules
- Rule 1
- Rule 2

## External Dependencies
- Service X for Y

## Known Limitations
- Limitation 1 — TICKET-123
```

### 5. Maintenance Obligations

**Documentation MUST be kept up-to-date at ALL times.**

| When | What |
|---|---|
| New endpoint | Swagger documentation immediately |
| Changed endpoint | Update Swagger immediately |
| New module | Module README if complex |
| Architecture decision | ADR in same PR |
| Breaking API change | Version bump + migration guide |
| PR review | Check documentation completeness |

**Rule: PRs with outdated or missing documentation will NOT be merged.**

### 6. Related Rules

| Rule | Purpose |
|---|---|
| `nestjs-documentation.md` | JSDoc, ADRs, inline comments |
| `nestjs-api-design.md` | Swagger requirements per endpoint |
| `nestjs-swagger.md` | Detailed Swagger/OpenAPI setup |
| `code-review-standard.md` | Language rules, review checklist |

---

## Deutsche Sektion

### 1. Dokumentationsebenen

| Ebene | Ort | Pflicht ab wann |
|---|---|---|
| Projekt-README | `/README.md` | Immer |
| Modul-README | `src/modules/<feature>/README.md` | Bei komplexen Features (>5 Endpoints, Business-Regeln, externe Integrationen) |
| API-Dokumentation | `/api/docs` (Swagger) | Immer |
| Technische Dokumentation | `/docs/` | Nach Bedarf |
| Architecture Decision Records | `/docs/adr/` | Bei Architektur-Entscheidungen mit langfristiger Tragweite |

### 2. Sprachregelung

- **Dokumentation**: Deutsch + Englisch (zweisprachig)
- **Code-Kommentare**: Nur Englisch
- **Swagger/OpenAPI**: Nur Englisch
- **Commit-Nachrichten**: Nur Englisch

### 3. Projekt-README Inhalt (Pflicht)

1. **Kurzbeschreibung** (2-3 Sätze was die App macht)
2. **Voraussetzungen** (Node-Version, DB, externe Dienste)
3. **Setup** (`.env` einrichten, Install, Migrationen, Seed)
4. **Lokal starten** (Start-Befehle)
5. **Tests ausführen**
6. **Verweis auf Docs** (Architektur, ADRs, API-Doku unter `/api/docs`)

### 4. Modul-README Inhalt (Pflicht bei komplexen Features)

```markdown
# Modul-Name

## Zweck
Was macht dieses Modul?

## Zustandsmodell
status1 → status2 → status3

## Business-Regeln
- Regel 1
- Regel 2

## Externe Abhängigkeiten
- Service X für Y

## Bekannte Einschränkungen
- Einschränkung 1 — TICKET-123
```

### 5. Wartungspflichten

**Dokumentation muss IMMER aktuell gehalten werden.**

| Wann | Was |
|---|---|
| Neuer Endpoint | Sofort Swagger-Dokumentation |
| Geänderter Endpoint | Sofort Swagger aktualisieren |
| Neues Modul | Modul-README wenn komplex |
| Architektur-Entscheidung | ADR im selben PR |
| Breaking API-Änderung | Version bump + Migration Guide |
| PR-Review | Dokumentationsvollständigkeit prüfen |

**Regel: PRs mit veralteter oder fehlender Dokumentation werden NICHT gemergt.**

### 6. Verknüpfte Rules

| Rule | Zweck |
|---|---|
| `nestjs-documentation.md` | JSDoc, ADRs, Inline-Kommentare |
| `nestjs-api-design.md` | Swagger-Pflicht pro Endpoint |
| `nestjs-swagger.md` | Detaillierte Swagger/OpenAPI-Konfiguration |
| `code-review-standard.md` | Sprachregel, Review-Checkliste |

---

## 7. Verbote

- Keine veralteten READMEs im Repo belassen.
- Keine Dokumentation ohne mindestens Englisch.
- Kein PR ohne vollständige Dokumentation.
- Keine ADRs für triviale Entscheidungen.
- Keine Dokumentation von Implementierungsdetails, die sich mit jeder Code-Änderung ändern.
