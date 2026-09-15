---
name: Clean Code & Continuous Refactoring
description: Immer wie ein erfahrener Senior Developer — KISS, SOLID, DRY, proaktives Refactoring, strikte Typisierung, englische Benennung, Fehlerbehandlung.
globs:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
  - "**/*.vue"
  - "**/*.css"
  - "**/*.scss"
  - "**/*.html"
  - "**/*.json"
  - "**/*.yaml"
  - "**/*.yml"
  - "**/*.md"
  - "**/*.sql"
  - "**/*.prisma"
  - "src/**/*"
  - "prisma/**/*"
  - "scripts/**/*"
  - "config/**/*"
  - "test/**/*"
---

# Clean Code & Continuous Refactoring

Diese Regeln sind **immer erzwungen** — bei jeder Code-Generierung, jedem Review und jeder Änderung.

## 1. Clean Code & Strukturierung

### 1.1 KISS & DRY

- Code radikal simpel halten. Keine Wiederholungen, keine überflüssige Komplexität.
- **Rule of Three:** Duplizierter Code ab der 3. Wiederholung extrahieren — bei der 2. Wiederholung erst beobachten.
- Keine verfrühte Abstraktion "für die Zukunft" ohne konkreten Anwendungsfall (YAGNI).

### 1.2 SOLID-Prinzipien

- **Single Responsibility:** Eine Funktion/Klasse hat genau eine Aufgabe. Zerlege monolithische Blöcke in kleine, testbare Module.
- **Open/Closed:** Neues Verhalten durch neue Klassen/Strategien hinzufügen, nicht durch wachsende `if/else`-Ketten.
- **Liskov Substitution:** Untertypen müssen für Basistypen substituierbar sein.
- **Interface Segregation:** Keine fettigen Interfaces — nur das, was tatsächlich benötigt wird.
- **Dependency Inversion:** Abstraktionen über konkrete Implementierungen. Services von Interfaces/Tokens abhängig machen.

### 1.3 Modularität

- Eine Funktion/Klasse hat genau eine Aufgabe.
- Monolithische Blöcke in kleine, testbare und wiederverwendbare Module zerlegen.
- Gemeinsame Logik zwischen Modulen → `shared/`-Modul, nicht Copy-Paste.

### 1.4 Benennung

- Ausschließlich englische, extrem präzise und selbsterklärende Namen.
- Keine kryptischen Abkürzungen: `calculateTotalUserScore` statt `calcScr`, `userIdentifier` statt `uid`.
- Keine Abkürzungen außer allgemein bekannten (`id`, `dto`, `url`).
- Booleans als Frage formulieren: `isActive`, `hasPermission`, `canDelete`.
- Funktionen sind Verben (`createUser`), Klassen sind Substantive (`UserService`).
- Konsistenz im ganzen Projekt: entweder `get`/`find`/`fetch` — nicht wahllos gemischt.

### 1.5 Typisierung

- **Strenge Typisierung** (TypeScript). Die Verwendung von `any` oder impliziten Typen ist strengstens untersagt.
- `unknown` + Type Guard bei echtem Bedarf statt `any`.
- Strikte Typisierung von Rückgabewerten: `Promise<User>` statt implizit.
- DTOs immer mit `class-validator`-Decorators, keine manuelle Validierung im Controller.
- `readonly` für DTO-/Entity-Properties, die nach Konstruktion nicht mutiert werden.
- Enums statt "magische Strings" für feste Wertemengen.

## 2. Continuous Refactoring (Verbesserung von Alt-Code)

### 2.1 Proaktive Optimierung

- Bei jeder Anfrage den umgebenden Alt-Code analysieren.
- Schlechter Code, tiefe Verschachtelungen (Pyramid of Doom) oder veraltete Muster → unaufgefordert mitrefaktorieren.
- Guard Clauses (frühe Rückgabe) statt verschachtelter `if`-Kaskaden.

### 2.2 Code Smells beseitigen

- Magische Zahlen → Konstanten extrahieren.
- Ungenutzte Variablen, toter Code, redundante Logik sofort entfernen.
- Kein auskommentierter Code im Commit — Git behält die Historie.
- Kein `console.log` in Produktionscode — strukturiertes Logging verwenden.

### 2.3 Modernisierung

- Legacy-Code auf modernste Standards aktualisieren (Async/Await, moderne Sprachfeatures).
- Kein Callback-Hell — async/await verwenden.
- Moderne TypeScript-Features nutzen: Template Literal Types, Conditional Types, Utility Types.

### 2.4 Struktur-Updates

- Wenn die aktuelle Dateistruktur oder Architektur durch neue Anforderung unsauber wird → strukturelle Änderungen vorschlagen oder direkt umsetzen.
- Ein Export pro Datei als Grundsatz (eine Klasse, ein Interface, eine Funktion) — Ausnahme: eng zusammengehörige kleine Typen.

## 3. Fehlerbehandlung (Robustheit)

### 3.1 Fail Fast

- Eingaben sofort am Anfang einer Funktion validieren.
- Aussagekräftige, spezifische Fehler werfen, nicht stillschweigend ignorieren.

### 3.2 Vollständiges Error-Handling

- Keine leeren `catch`-Blöcke. Jeder Fehler muss angemessen geloggt oder behandelt werden.
- Framework-eigene Exceptions verwenden (`NotFoundException`, `BadRequestException` in NestJS).
- Business-Fehler als eigene Exception-Klassen definieren.
- Try/Catch nur dort, wo tatsächlich behandelt/übersetzt wird — nicht als Pflichtritual um jeden Await.

```ts
// Schlecht
try {
  return await this.repo.save(order);
} catch (e) {
  console.log(e);
}

// Gut
try {
  return await this.repo.save(order);
} catch (error) {
  if (error instanceof UniqueConstraintError) {
    throw new ConflictException('Order already exists');
  }
  throw error;
}
```

## 4. Kommentare & Dokumentation

- Code muss selbstdokumentierend sein. Das "Was" erklärt der Code selbst.
- Kommentare ausschließlich das "Warum" erklären: Hintergrundwissen, Business-Logik, unvermeidbare Workarounds.
- Kein Kommentar, der nur den Code nacherzählt.
- TODOs immer mit Kontext: `// TODO(max): remove after Prisma migration — TICKET-123`.
- JSDoc/Docstrings für öffentliche Schnittstellen und komplexe Module.
- Kein `@ts-ignore` ohne Kommentar mit Begründung + Ticket.

## 5. TypeScript-Disziplin

- **Kein `any`**, kein `@ts-ignore` ohne Begründung.
- Strikte Typisierung von Rückgabewerten bei Services.
- DTOs immer mit `class-validator`-Decorators.
- `readonly` für Properties, die nach Konstruktion nicht mutiert werden.
- Enums statt "magische Strings" für feste Wertemengen (Status, Rollen, Typen).

## 6. Immutability & Nebeneffekte

- Funktionen möglichst pure halten: Eingabe → Ausgabe, ohne versteckte Mutation.
- Keine Mutation von Objekten, die als Parameter übergeben wurden — neue Objekte zurückgeben.
- Nebeneffekte (DB-Schreiben, Events, externe API-Calls) klar benennen: `saveUser`, `emitOrderCreated`.
- Command-Query-Separation: Methoden, die etwas zurückgeben, lösen keinen wichtigen Nebeneffekt aus (oder der Name drückt es aus).

## 7. Formatierung & Konsistenz

- Prettier + ESLint sind bindend — kein manuelles Overrulen.
- Import-Reihenfolge: Node-Builtins → externe Packages → interne Absolute-Imports → relative Imports, jede Gruppe durch Leerzeile getrennt.

## 8. Output-Direktiven für die KI

- Überarbeiteten Code vollständig und lauffähig ausgeben. Keine unvollständigen Snippets mit `// ... rest of the code`.
- Kurz, prägnant und technisch auf vorgenommene Refactorings im Alt-Code hinweisen.
- Kein Konversations-Overhead. Direkt den optimierten Code und eine extrem knappe technische Zusammenfassung liefern.

## 9. Verbote

- Kein `any`, kein `@ts-ignore` ohne Begründung + Ticket.
- Keine Business-Logik in Konstruktoren — Konstruktoren sind für DI, nicht für Berechnungen.
- Keine verschachtelten Ternaries (`a ? b : c ? d : e`) — durch if/else oder Lookup-Objekt ersetzen.
- Keine hartkodierten Werte (URLs, Limits, Zeiträume) im Code — über `config/` oder Konstanten.
- Keine Methoden, die sowohl etwas zurückgeben als auch einen wichtigen Nebeneffekt auslösen, ohne dass der Name das ausdrückt.
- Kein `console.log` in Produktionscode.
- Keine deutschen Variablennamen, Funktionsnamen, Klassennamen oder Kommentare im Code.
