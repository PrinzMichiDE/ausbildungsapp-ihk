---
name: Code Review Standard
description: Immer wie ein erfahrener Senior Developer prüfen, alles in Englisch, Dokumentation nur in Deutsch und Englisch.
globs:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.md"
  - "**/*.json"
  - "**/*.yml"
  - "**/*.yaml"
  - "src/**/*"
---

# Code Review Standard

Diese Regeln gelten für **jede** Code-Generierung, jedes Review und jede Änderung in diesem Repository.

## 1. Senior-Developer-Prüfung

Jeder Code muss wie von einem erfahrenen Senior Developer geprüft werden. Vor dem Abschluss jeder Aufgabe:

- **Edge Cases**: Sind alle ungültigen Eingaben, Null-Werte, leere Strings, überlaufende Zahlen und unerwartete Typen behandelt?
- **Sicherheit**: Gibt es SQL-Injection-, XSS-, SSRF- oder Injection-Risiken? Werden Secrets nie hartkodiert?
- **Performance**: Gibt es N+1-Queries, unnötige Iterationen, Speicherlecks oder blockierende Operationen?
- **Fehlerbehandlung**: Werden alle Fehler graceful abgefangen? Gibt es keine unbehandelten Promise Rejections?
- **Testbarkeit**: Ist der Code testbar? Sind Dependencies injectierbar? Gibt es ausreichend Unit- und Integrationstests?
- **Maintainability**: Ist der Code lesbar, modulare und folgen die SOLID-Prinzipien? Gibt es Code-Duplizierung?
- **Typsicherheit**: Sind alle TypeScript-Typen streng und korrekt? Kein `any`, keine impliziten `any`-Typen.
- **Seiteneffekte**: Sind alle Nebeneffekte klar benannt und isoliert? Gibt es keine versteckten Mutationen?
- **Zugriffskontrolle**: Sind RBAC und Berechtigungen korrekt implementiert? Jeder Endpoint prüft die richtige Rolle?
- **Logging & Observability**: Wichtige Events und Fehler werden strukturiert geloggt? Gibt es ausreichend Kontext für Debugging?

**Kein Code wird akzeptiert, ohne dass eine dieser Prüfungen durchlaufen wurde.**

## 2. Alles in Englisch

Alle Inhalte im Repository sind in Englisch — ohne Ausnahme. Bestehende deutsche Inhalte sind nachträglich anzupassen.

### 2.1 Ordner- und Dateinamen

- Alle Ordner- und Dateinamen sind in **Englisch** und im **kebab-case** Format.
- Deutsche Ordner- und Dateinamen sind **nicht** erlaubt.

```text
# Gut
src/modules/users/
src/modules/user-management/
src/common/validators/

# Schlecht
src/modules/benutzer/
src/modules/nutzer-verwaltung/
src/common/validatoren/
```

### 2.2 Code

- **Variablennamen, Funktionsnamen, Klassennamen, Interface-Namen, Typnamen**: Englisch.
- **Kommentare im Code**: Englisch.
- **Commit-Nachrichten**: Englisch.
- **Console-Ausgaben, Error-Messages, Log-Messages**: Englisch.
- **Schlüsselwörter in Konfigurationsdateien**: Englisch.

```ts
// Gut
export interface UserProfile {
  id: string;
  displayName: string;
  emailAddress: string;
}

async function updateUserProfile(userId: string, profile: UserProfile): Promise<UserProfile> {
  // Validate email format before saving
  if (!isValidEmail(profile.emailAddress)) {
    throw new BadRequestException('Invalid email address format');
  }
  return this.userRepository.save(profile);
}

// Schlecht
export interface BenutzerProfil { ... }
async function aktualisiereBenutzerProfil(...) { ... }
// E-Mail-Format vor dem Speichern validieren
```

### 2.3 Datenbank

- **Tabellen- und Spaltennamen** (in Prisma Schema, Migrationen): Englisch.
- **Enum-Werte**: Englisch.
- **Seed-Daten**: Englische Werte für Textfelder.

### 2.4 Konfiguration

- **Environment-Variable-Namen**: Englisch (`DATABASE_URL`, `API_PORT`, nicht `DATENBANK_URL`).
- **Config-Keys und -Werte**: Englisch.

### 2.5 Bestehende deutsche Inhalte anpassen

- Alle vorhandenen deutschen Ordner, Dateinamen, Code-Kommentare und Strings sind schrittweise ins Englische zu übersetzen.
- **Erledigt:** Alle 10 Modul-Ordner unter `src/modules/` wurden umbenannt (z.B. `abteilungen` → `departments`, `berichte` → `reports`, `einsatz` → `assignments`, etc.).
- Bei der Anpassung immer eine Migration oder einen entsprechenden Commit erstellen.
- Der `src/`-Ordner und alle Unterordner haben jetzt englische Namen.

## 3. Dokumentation: Deutsch und Englisch

Dokumentation ist die **einzige Ausnahme** von der Englisch-Regel. Dokumentationsdateien dürfen in **Deutsch und Englisch** angelegt werden.

### 3.1 Sprachregelung

- **README-Dateien**, **ADRs**, **Konzeptionsdokumente** und andere Dokumentationsdateien können **zweisprachig** (Deutsch/Englisch) verfasst werden.
- Es ist erlaubt, Deutsch und Englisch in derselben Dokumentation zu verwenden.
- Empfohlen wird eine klare Trennung (z.B. zwei Abschnitte pro Sprache oder eine Sprach-Kennzeichnung am Anfang).

### 3.2 Empfohlene Struktur für zweisprachige Dokumentation

```markdown
# Document Title / Dokumenttitel

## English Section

English content here...

## Deutsche Sektion

Deutscher Inhalt hier...
```

### 3.3 Code-Kommentare sind NICHT Dokumentation

Code-Kommentare fallen unter Regel 2 (alles in Englisch) und **nicht** unter diese Regel. Kommentare im Code sind immer auf Englisch.

### 3.4 Swagger-API-Dokumentation

- Swagger/OpenAPI-Dokumentation ist in Englisch (technischer Standard).
- Beschreibungen von Endpunkten, Parameters und Responses sind auf Englisch.

## 4. Verbote

- Kein deutscher Code, keine deutschen Variablennamen, keine deutschen Funktionsnamen.
- Keine deutschen Ordner- oder Dateinamen (außer in Dokumentationsdateien).
- Keine deutschen Commit-Nachrichten.
- Keine deutschen Console-Outputs oder Error-Messages.
- Keine deutschen Kommentare im Code.
- Keine ausschließlich deutsche Dokumentation — Dokumentation muss mindestens Englisch enthalten.
- Keine halben Kompromisse: Entweder alles Englisch (Code, Config, Logs) oder beides Deutsch+Englisch (Dokumentation).

## 5. Prüfliste für jede Aufgabe

Bevor Code committet wird, muss diese Checkliste bestätigt sein:

- [ ] Code wurde wie ein Senior Developer geprüft (Edge Cases, Sicherheit, Performance, Fehlerbehandlung)
- [ ] Alle Ordner- und Dateinamen sind auf Englisch
- [ ] Alle Code-Kommentare sind auf Englisch
- [ ] Alle Variablen-, Funktions-, Klassen- und Interface-Namen sind auf Englisch
- [ ] Alle Commit-Nachrichten sind auf Englisch
- [ ] Alle Error-Messages und Log-Ausgaben sind auf Englisch
- [ ] Bei neuen/geänderten Dokumentationen: Deutsch und/oder Englisch verwendet
- [ ] Swagger-Doku ist auf Englisch
- [ ] Kein `any`, keine deutschen Strings im Code, keine deutschen Ordnernamen
- [ ] Bestehende deutsche Inhalte im Code wurden identifiziert und stehen auf der ToDo-Liste für Anpassung