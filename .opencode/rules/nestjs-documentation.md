---
name: NestJS Documentation
description: Regeln für README-Dateien, JSDoc, Inline-Kommentare und ADRs im Repository. Immer beachten beim Anlegen/Ändern von READMEs, Architektur-Dokumentation, JSDoc oder Code-Kommentaren.
globs:
  - "**/README.md"
  - "docs/**"
  - "src/**/*.ts"
  - "*.md"
---

# Dokumentations-Regeln: NestJS

Diese Regeln gelten für README-Dateien, Code-Kommentare, JSDoc und Architektur-Entscheidungen in diesem Repository.

## 1. README-Ebenen

| Ebene | Ort | Pflicht ab wann |
|---|---|---|
| Projekt-README | `/README.md` | immer |
| Modul-README | `src/modules/<feature>/README.md` | ab "komplexem" Feature (siehe unten) |
| Package-README | bei Monorepo: `packages/<name>/README.md` | immer |

**Ein Feature-Modul gilt als "komplex" und braucht ein README, wenn mindestens eines zutrifft:**
- mehr als 5 Endpoints
- nicht-triviale Business-Regeln (State Machines, komplexe Berechnungen)
- Integration mit externen Systemen (Payment, Third-Party-API)
- eigene Hintergrundjobs/Queues

Einfache CRUD-Module (nur Standard-Create/Read/Update/Delete ohne Sonderlogik) brauchen kein eigenes README — die Swagger-Doku reicht.

## 2. Inhalt Projekt-README

Pflichtabschnitte, in dieser Reihenfolge:
1. Kurzbeschreibung (was macht die App, 2–3 Sätze)
2. Voraussetzungen (Node-Version, DB, externe Dienste)
3. Setup (`.env` einrichten, Install, Migrationen, Seed)
4. Lokal starten
5. Tests ausführen
6. Verweis auf weiterführende Docs (Architektur, ADRs, API-Doku unter `/api/docs`)

## 3. Inhalt Modul-README

```markdown
# Orders-Modul

## Zweck
Verwaltet den Lebenszyklus von Bestellungen: Erstellung, Statuswechsel, Stornierung.

## Zustandsmodell
draft → placed → shipped → delivered
              ↘ cancelled

## Wichtige Business-Regeln
- Eine Bestellung kann nur storniert werden, solange sie nicht "shipped" ist.
- Preisberechnung berücksichtigt aktive Rabattaktionen zum Zeitpunkt der Erstellung (nicht live neu berechnet).

## Externe Abhängigkeiten
- Payment-Provider (Stripe) für Zahlungsabwicklung
- Inventory-Modul (intern) für Bestandsreservierung

## Bekannte Einschränkungen / TODOs
- Teilstornierungen (einzelne Positionen) noch nicht unterstützt — TICKET-456
```

- Modul-README beschreibt **Warum und fachliche Regeln**, nicht den Code selbst (der ist im Code lesbar) — keine Datei-für-Datei-Auflistung.
- README wird im selben PR aktualisiert wie die fachliche Änderung, nie nachträglich "irgendwann".

## 4. JSDoc-Regeln

JSDoc ist **nicht** für jede Methode Pflicht. Verpflichtend nur bei:
- Öffentlichen Service-Methoden mit nicht offensichtlichem Verhalten (Seiteneffekte, Ausnahmefälle, Reihenfolge-Abhängigkeiten).
- Utility-/Helper-Funktionen in `common/` oder `shared/`, die modulübergreifend genutzt werden.
- Komplexen Algorithmen/Berechnungen (Preis-, Steuer-, Scoring-Logik).

```ts
/**
 * Berechnet den Endpreis inkl. aktiver Rabattaktionen.
 * Rabatte werden zum Zeitpunkt des Aufrufs eingefroren (kein Live-Rebasing bei Preisänderung).
 *
 * @throws {NoActivePriceListException} wenn für die Region keine gültige Preisliste existiert
 */
calculateFinalPrice(product: Product, region: Region): Money { ... }
```

- Kein JSDoc, das nur den Typ wiederholt, den TypeScript bereits zeigt (`@param name - der Name`) — nur Mehrwert dokumentieren.
- Controller-Endpoints werden über Swagger-Decorators dokumentiert (siehe API-Design-Regeln), **nicht zusätzlich** per JSDoc — keine Doppelpflege.

## 5. Architecture Decision Records (ADRs)

- Ort: `docs/adr/NNNN-kurzer-titel.md`, fortlaufend nummeriert.
- ADR wird angelegt bei Entscheidungen mit **langfristiger Tragweite**: Wahl von ORM/DB, Auth-Strategie, Monolith-vs-Microservice-Schnitt, Wahl einer zentralen Library (Queue-System, Cache), signifikante Architektur-Refactorings.
- **Kein** ADR nötig für lokale Implementierungsdetails oder leicht reversible Entscheidungen.

Template:

```markdown
# ADR-0001: Wahl von PostgreSQL als primäre Datenbank

## Status
Angenommen

## Kontext
Welches Problem/welche Fragestellung lag vor?

## Entscheidung
Was wurde entschieden?

## Konsequenzen
Was folgt daraus — positiv wie negativ?

## Alternativen
Welche Optionen wurden verworfen und warum?
```

- ADRs werden **nicht rückwirkend verändert**, wenn sich die Entscheidung ändert — neuer ADR mit Verweis auf den alten (`Status: Ersetzt durch ADR-0007`).

## 6. Inline-Kommentare

- Erklären **Warum**, nicht **Was** (siehe Clean-Code-Regeln) — hier nicht dupliziert, gilt aber auch für Dokumentation.
- Komplexe RegEx, nicht-offensichtliche Workarounds (`// Workaround für Bug XY in Library Z, siehe TICKET-789`) bekommen immer einen erklärenden Kommentar mit Referenz.

## 7. Verbote

- Kein README, das nur den Ordnerinhalt auflistet, ohne fachlichen Kontext.
- Keine veralteten READMEs im Repo belassen — bei größeren Refactorings README-Aktualisierung Teil des PRs, sonst PR nicht mergen.
- Kein ADR für triviale, leicht rückgängig zu machende Entscheidungen (führt zu ADR-Inflation und Ignorieren wichtiger ADRs).
- Keine Dokumentation von Implementierungsdetails, die sich mit jeder kleinen Code-Änderung von selbst desynchronisiert (z. B. Variable-für-Variable-Beschreibung) — auf stabiler, fachlicher Ebene dokumentieren.
