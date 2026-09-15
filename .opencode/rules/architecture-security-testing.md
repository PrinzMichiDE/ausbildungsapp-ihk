---
name: Architecture, Security & Test-Driven Mindset
description: Design Patterns, DI, SoC, Security by Design, Performance, Pure Functions, Immutability, Zero Hardcoding, Edge Cases — immer erzwungen.
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
  - "**/*.sql"
  - "**/*.prisma"
  - "src/**/*"
  - "prisma/**/*"
  - "scripts/**/*"
  - "config/**/*"
  - "test/**/*"
---

# Architecture, Security & Test-Driven Mindset

Diese Regeln sind **immer erzwungen** — bei jeder Code-Generierung, jedem Review und jeder Änderung.

## 6. Architektur & Design Patterns

### 6.1 Pragmatische Patterns

- Etablierte Design Patterns (Factory, Strategy, Observer, Repository) zielgerichtet einsetzen.
- **Over-Engineering strikt vermeiden.** Kein Pattern, das den aktuellen Anwendungsfall nicht unmittelbar löst.
- Simple Lösung bevorzugen, wenn sie funktioniert — Pattern nur, wenn Komplexität es rechtfertigt.

### 6.2 Dependency Injection

- Abhängigkeiten injizieren, nicht in Modulen hart instanziieren.
- NestJS DI-Container nutzen (`@Injectable()`, `@Inject(TOKEN)`).
- Interfaces/Tokens für Austauschbarkeit (Tests, alternative Implementierungen).
- Keine zentralen Singletons ohne DI — das zerstört Testbarkeit.

### 6.3 Trennung von Belangen (SoC)

- **UI** (Controller, Views, Komponenten), **Business-Logik** (Services, Use Cases), **Datenzugriff** (Repositories, ORM) rigoros trennen.
- Controller enthalten keine Business-Logik — sie delegieren an Services.
- Services greifen nicht direkt auf die DB zu — sie nutzen Repositories.
- Keine Kreuzabhängigkeiten zwischen Schichten (kein Import von UI in Business-Logik).

## 7. Sicherheit & Performance

### 7.1 Security by Design

- Jeder externe Input (User, API, DB) wird als **unsicher** behandelt.
- Daten konsequent sanitizen und validieren (DTOs mit class-validator, Zod, etc.).
- Parameterisierte Queries — niemals Strings concatenieren (`WHERE id = '${id}'` → `WHERE id = $1`).
- Secrets nie im Code oder in Git — nur über Environment-Variablen.
- CORS, CSP, Rate-Limits konfigurieren.

### 7.2 Algorithmische Effizienz

- Big-O-Komplexität bewusst wählen: O(1)/O(log n) für Hot Paths.
- Hash-Maps/Sets statt Arrays für schnelle Lookups (`Map`, `Set`, `{ [key]: value }`).
- Unnötige Iterationen vermeiden: `Array.find()` statt `Array.filter()[0]`, Early Exit in Schleifen.
- N+1-Queries identifizieren und vermeiden (Batch Loading, JOINs).
- Keine redundanten Berechnungen — Caching wo sinnvoll.

### 7.3 Ressourcen-Management

- Memory Leaks aktiv verhindern: Event-Listener entfernen, Timeouts clear-timeout, Streams schließen.
- Datenbankverbindungen/Transaktionen sauber freigeben (nicht nur im Happy Path).
- Large Datasets mit Streaming/Pagination statt `findMany({ take: Infinity })`.
- Unnötige Object-Allokationen in Hot Loops vermeiden.

## 8. State Management & Side Effects

### 8.1 Pure Functions

- Datenverarbeitung als Pure Functions: gleiche Eingaben → gleiche Ausgaben, keine globalen Zustandsänderungen.
- Seiteneffekte klar benennen und isolieren (`saveUser`, `processPayment` — nicht `handleData`).

### 8.2 Immutability

- Bestehende Objekte/Arrays **nicht direkt mutieren**.
- Stattdessen mit Kopien arbeiten: Spread-Operator (`{ ...obj }`), `Array.from()`, Deep Copies bei verschachtelten Strukturen.
- `readonly` für Properties, die nach Konstruktion nicht mutiert werden.

```ts
// Schlecht
user.name = newName;
user.lastModified = new Date();

// Gut
const updatedUser = { ...user, name: newName, lastModified: new Date() };
```

### 8.3 Isolierung von Seiteneffekten

- I/O-Operationen (API-Calls, Dateisystem, DB, DOM) klar von reiner Geschäftslogik abkapseln.
- Nebeneffekte in dedizierte Services/Funktionen auslagern.
- Business-Logik muss ohne Mocking von I/O testbar sein.

## 9. Konfiguration & Umgebung

### 9.1 Zero Hardcoding

- Konfigurationswerte, URLs, API-Keys, Timeouts, Limits — **nie hartkodieren**.
- Immer aus Environment-Variablen oder dedizierten Config-Dateien laden.
- Config-Schema validieren beim App-Start (z.B. mit `zod`, `joi`, NestJS ConfigModule).
- Defaults nur für nicht-sensible Werte, keine Defaults für Secrets oder produktive URLs.

```ts
// Schlecht
const API_URL = 'https://api.example.com/v1';

// Gut
const API_URL = this.configService.get<string>('API_URL');
```

## 10. Test-Driven-Mindset & Randfälle

### 10.1 Inhärente Testbarkeit

- Code so schreiben, als müsste er sofort mit Unit-Tests abgedeckt werden.
- Schwer testbarer Code = Indikator für schlechtes Design (zu viele Dependencies, versteckte Side Effects, fehlende Abstraktionen).
- Dependencies injizieren (nicht importieren), Funktionen klein halten, Seiteneffekte isolieren.
- Öffentliche APIs so gestalten, dass sie einfach gemockt werden können.

### 10.2 Edge Cases First

- **Vor** der Happy-Path-Logik: Randfälle, leere Datensätze, Grenzwerte, extreme Inputs berücksichtigen.
- Checkliste pro Funktion:
  - `null` / `undefined` als Eingabe
  - Leere Strings, leere Arrays, leere Objekte
  - Min/Max-Werte, Negative Zahlen, 0
  - Ungültige Formate (E-Mail, URL, UUID)
  - Maximale String-Längen, Integer-Overflows
  - Race Conditions bei async Operationen
  - Timeout-Szenarien bei externen Aufrufen

```ts
// Schlecht — Happy Path nur
function calculateDiscount(price: number, discount: number): number {
  return price - (price * discount);
}

// Gut — Edge Cases zuerst
function calculateDiscount(price: number, discount: number): number {
  if (price < 0) throw new Error('Price cannot be negative');
  if (discount < 0 || discount > 1) throw new Error('Discount must be between 0 and 1');

  return price - (price * discount);
}
```
