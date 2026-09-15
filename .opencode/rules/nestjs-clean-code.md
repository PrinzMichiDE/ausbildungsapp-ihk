# Clean-Code-Regeln: NestJS

Diese Regeln gelten für **jede** Code-Erzeugung und jedes Review in diesem Repository.

## 1. Funktionen & Methoden

- **Eine Verantwortung pro Methode.** Wenn eine Methode mit "und" beschrieben werden muss, aufteilen.
- Max. **~20 Zeilen** pro Methode als Richtwert — bei Überschreitung: extrahieren, nicht ignorieren.
- Max. **3 Parameter**. Ab 4 Parametern: Options-Objekt oder DTO verwenden.
- Keine Boolean-Flags als Parameter, die das Verhalten der Methode umschalten (`sendEmail(user, true)`) — stattdessen zwei benannte Methoden oder ein Enum.
- Frühe Rückgabe (Guard Clauses) statt verschachtelter `if`-Kaskaden:

```ts
// Schlecht
async findOne(id: string) {
  if (id) {
    const user = await this.repo.findById(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  } else {
    throw new BadRequestException();
  }
}

// Gut
async findOne(id: string): Promise<User> {
  if (!id) throw new BadRequestException('id ist erforderlich');

  const user = await this.repo.findById(id);
  if (!user) throw new NotFoundException(`User ${id} nicht gefunden`);

  return user;
}
```

## 2. Namensgebung

- Namen beschreiben **was**, nicht **wie**: `getActiveUsers()` statt `getUsersWhereStatusEquals1()`.
- Keine Abkürzungen außer allgemein bekannten (`id`, `dto`, `url`). Kein `usr`, `calc`, `tmp` in Business-Code.
- Booleans als Frage formulieren: `isActive`, `hasPermission`, `canDelete`.
- Funktionen sind Verben (`createUser`), Klassen sind Substantive (`UserService`).
- Konsistenz im ganzen Projekt: entweder `get`/`find`/`fetch` — nicht wahllos gemischt für denselben Zweck.

## 3. Klassen & Verantwortung (SOLID, angewandt auf Nest)

- **Single Responsibility**: Ein Service = ein fachlicher Bereich. `UsersService` verwaltet keine Order-Logik.
- **Dependency Inversion**: Services hängen von Interfaces/Tokens ab, nicht von konkreten Implementierungen — nutze Nest's DI-Tokens (`@Inject(USERS_REPOSITORY)`), wenn Austauschbarkeit gefordert ist (z.B. für Tests oder mehrere DB-Provider).
- **Open/Closed**: neues Verhalten durch neue Klassen/Strategien hinzufügen, nicht durch wachsende `if/else`- oder `switch`-Ketten in bestehendem Code.
- Kein God-Service mit 15+ Methoden — Aufsplitten in fokussierte Services innerhalb desselben Moduls.

## 4. Fehlerbehandlung

- Nest-eigene HTTP-Exceptions verwenden (`NotFoundException`, `BadRequestException`, ...), keine rohen `throw new Error()` in Controllern/Services.
- Business-Fehler als eigene Exception-Klassen definieren, die von `HttpException` erben, statt generische Exceptions mit String-Vergleich abzufangen.
- Kein stilles Verschlucken von Fehlern (`catch {}` ohne Behandlung oder Logging).
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
    throw new ConflictException('Order existiert bereits');
  }
  throw error;
}
```

## 5. Kommentare

- Code erklärt **was**, Kommentare erklären **warum**. Kein Kommentar, der nur den Code nacherzählt.
- Kein auskommentierter Code im Commit — löschen, Git behält die Historie.
- TODOs immer mit Kontext: `// TODO(max): nach Migration auf Prisma entfernen — TICKET-123`.
- Öffentliche APIs (exportierte Services, Controller-Endpunkte) bekommen JSDoc, wenn Verhalten nicht selbsterklärend ist (z.B. Nebeneffekte, Edge Cases).

## 6. TypeScript-Disziplin

- **Kein `any`.** Bei echtem Bedarf: `unknown` + Type Guard, oder präzises Interface.
- Strikte Typisierung von Rückgabewerten bei Services (`Promise<User>` statt implizit).
- DTOs immer mit `class-validator`-Decorators, keine manuelle Validierung im Controller.
- `readonly` für DTO-/Entity-Properties, die nach Konstruktion nicht mutiert werden.
- Enums statt "magische Strings" für feste Wertemengen (Status, Rollen, Typen).

## 7. Immutability & Nebeneffekte

- Funktionen möglichst pure halten: Eingabe → Ausgabe, ohne versteckte Mutation von Parametern.
- Keine Mutation von Objekten, die als Parameter übergeben wurden — neue Objekte zurückgeben (Spread/`Object.assign`).
- Nebeneffekte (DB-Schreiben, Events, externe API-Calls) klar benennen: `saveUser`, `emitOrderCreated` — nicht in einer harmlos klingenden `getX`-Methode verstecken.

## 8. DRY, aber nicht dogmatisch

- Duplizierter Code ab der **3. Wiederholung** extrahieren (Rule of Three) — bei der 2. Wiederholung erst beobachten, nicht überstürzt abstrahieren.
- Keine verfrühte Abstraktion "für die Zukunft" ohne konkreten aktuellen Anwendungsfall (YAGNI).
- Gemeinsame Logik zwischen Modulen → `shared/`-Modul, nicht Copy-Paste.

## 9. Formatierung & Konsistenz

- Prettier + ESLint sind bindend — kein manuelles Overrulen der Formatierung im Code.
- Import-Reihenfolge: Node-Builtins → externe Packages → interne Absolute-Imports → relative Imports, jede Gruppe durch Leerzeile getrennt.
- Ein Export-Typ pro Datei als Grundsatz (eine Klasse, ein Interface, eine Funktion) — Ausnahme: eng zusammengehörige kleine Typen (z.B. DTO + zugehöriger Enum).

## 10. Verbote

- Kein `any`, kein `@ts-ignore` ohne Kommentar mit Begründung + Ticket.
- Keine Business-Logik in Konstruktoren — Konstruktoren sind für Dependency Injection, nicht für Berechnungen.
- Keine verschachtelten Ternaries (`a ? b : c ? d : e`) — durch if/else oder Lookup-Objekt ersetzen.
- Keine hartkodierten Werte (URLs, Limits, Zeiträume) im Code — über `config/` oder Konstanten.
- Keine Methoden, die sowohl etwas zurückgeben als auch einen wichtigen Nebeneffekt auslösen, ohne dass der Name das ausdrückt (Command-Query-Separation).
