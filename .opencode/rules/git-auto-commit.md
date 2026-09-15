---
name: Git Auto Commit & Push
description: Automatisch git commit und git push machen, wenn sinnvoll. Commits splitten nach logischen Änderungen.
globs:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.json"
  - "**/*.yml"
  - "**/*.yaml"
  - "**/*.md"
  - "prisma/**"
  - "src/**/*"
---

# Git Auto Commit & Push

Diese Regel erzwingt automatisches Committen und Pushen von Änderungen mit sauberer Commit-Architektur.

## 1. Automatisches Committen

Commits werden **pro logischer Änderung** erstellt — nicht am Ende einer Aufgabe. Das Prinzip: *Commit early, commit often.*

### Wann commiten?

- Nach jedem abgeschlossenen, getesteten logischen Schritt
- Nach Hinzufügen neuer Endpoints, Services, Entities oder Module
- Nach Bugfixes, die isoliert getestet wurden
- Nach Migrationen oder Schema-Änderungen (im selben Commit)
- Nach Dokumentationsänderungen, die zum aktuellen Schritt gehören

### Wann NICHT commiten?

- Wenn Tests noch fehlschlagen
- Wenn der Code linter/typechecker-Verletzungen hat
- Wenn Secrets oder Umgebungsvariablen im Diff stehen
- Wenn die Änderung unvollständig und nicht funktionsfähig ist

### Workflow

```
Änderung vornehmen → Testen → Linten → Typecheck → Commit → Weiterarbeiten
```

Jeder erfolgreiche Increment bekommt seinen eigenen Commit. Keine großen uncommitted Änderungsblöcke ansammeln.

## 2. Commits splitten

Jeder Commit macht **genau eine logische Sache**. Große Features werden in mehrere Atom-Commits aufgeteilt.

### Splitting-Kriterien

| Größe | Aktion |
|---|---|
| < 100 Zeilen | Ein Commit |
| 100–300 Zeilen | Ein Commit, wenn logisch zusammenhängend |
| > 300 Zeilen | In mehrere Commits aufteilen |
| > 1000 Zeilen | Zwingend aufteilen |

### Beispiele für Splits

```text
# GUT: Sauber gesplittert
feat: add task creation endpoint with validation
feat: add task creation form component
feat: connect form to API and add loading state
feat: add task creation tests (unit + integration)

# SCHLECHT: Alles in einem
feat: add task feature, fix sidebar, update deps, refactor utils
```

### Trenne Bedenken

- Refactoring von Feature-Änderungen trennen
- Formatting von Logik trennen
- Jede Änderungsart = separater Commit

```bash
# Gut
git commit -m "refactor: extract validation logic to shared utility"
git commit -m "feat: add phone number validation to registration"

# Schlecht
git commit -m "refactor validation and add phone number field"
```

## 3. Commit-Nachrichten-Format

```text
<type>: <short description>

<optional body explaining why, not what>
```

**Typen:**
- `feat` — Neues Feature
- `fix` — Bugfix
- `refactor` — Code-Änderung ohne Bugfix oder Feature
- `test` — Tests hinzufügen/aktualisieren
- `docs` — Nur Dokumentation
- `chore` — Tooling, Abhängigkeiten, Config
- `migration` — Datenbankmigration

**Nachrichten erklären das *Warum*, nicht das *Was*.**

## 4. Automatisches Pushen

Pushen wird automatisch durchgeführt, wenn:

- Der Commit erfolgreich war (alle Tests, Lint, Typecheck bestanden)
- Die aktuelle Branch mit dem Remote synchron ist (kein Merge-Conflict)
- Die Änderung sinnvoll und funktionsfähig ist

### Wann NICHT pushen?

- Wenn die Branch noch nicht mit Remote synchronisiert ist (erst pullen/mergen)
- Wenn der Commit Work-in-Progress ist (warte auf nächsten Schritt)
- Bei laufenden Tests oder unklarem Status

### Pushing-Prozess

```bash
# Nach jedem Commit
git push origin <branch-name>
```

Bei Konflikten zuerst `git pull --rebase` und dann erneut pushen.

## 5. Pre-Commit-Checkliste

Bevor jeder Commit erstellt wird:

- [ ] `git diff --staged` prüfen
- [ ] Keine Secrets im Diff (`password`, `secret`, `api_key`, `token`)
- [ ] Tests bestehen
- [ ] Linting bestehen
- [ ] Typecheck bestehen (`npx tsc --noEmit`)
- [ ] Commit-Nachricht folgt dem Format oben
- [ ] Commit macht nur eine logische Sache

## 6. Prisma Migrationen

Bei Schema-Änderungen immer eine Migration im selben Commit erzeugen:

```bash
npx prisma migrate dev --name <descriptive-name>
git add prisma/migrations/
git commit -m "migration: add <description> to schema"
git push
```

Migrationsdateien dürfen **nicht** isoliert vom zugehörigen Code-Commit committet werden.

## 7. Häufige Fehler vermeiden

| Fehler | Richtig |
|---|---|
| Ein Commit pro Datei | Ein Commit pro logischer Änderung |
| `git commit -m "update"` | `git commit -m "feat: add email validation"` |
| Alle Änderungen auf einmal | In atomare Schritte aufteilen |
| Kein Push nach Commit | Automatisch pushen nach erfolgreichem Commit |
| Secrets committen | Vor jedem Commit auf Secrets prüfen |
| Generated files committen | Nur projektrelevante Dateien committen |

## 8. Change Summary

Nach Abschluss einer größeren Aufgabe eine Change Summary bereitstellen:

```text
CHANGES MADE:
- <Datei>: <Was wurde geändert>

THINGS I DIDN'T TOUCH (intentionally):
- <Datei>: Warum ausgeblendet

POTENTIAL CONCERNS:
- <Mögliche Probleme>
```

Dies hilft bei Reviews und dokumentiert den Änderungsumfang klar.
