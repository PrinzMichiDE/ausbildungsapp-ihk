---
name: NestJS Database & Migrations
description: Regeln für Entities, Migrationen und DB-Zugriffe der NestJS-API. Immer beachten bei Entities, Migrationen, Repository/Query-Code, Transaktionen, Indexierung oder Seeds.
globs:
  - "src/**/*.entity.ts"
  - "src/**/*.repository.ts"
  - "src/**/*.migration.ts"
  - "database/**"
  - "src/**/*.service.ts"
  - "ormconfig.*"
  - "*.ormconfig.*"
---

# Datenbank- & Migrations-Regeln: NestJS

Diese Regeln gelten für jedes Entity, jede Migration und jeden DB-Zugriff in diesem Repository.

## 1. Migrationen statt Auto-Sync

- `synchronize: false` in **jeder** Umgebung, auch lokal — Schema-Änderungen laufen ausschließlich über Migrationen.
- Jede Entity-Änderung erzeugt eine Migration im selben Commit (`npm run migration:generate -- <Name>`), nie manuell im Nachhinein "reparieren".
- Migrationen sind **append-only**: einmal gemergte Migration wird nicht mehr verändert — Korrekturen als neue Migration.
- Migrationen laufen automatisiert in CI/CD vor dem App-Start, nie manuell in Produktion ausgeführt.

## 2. Naming-Konventionen

| Element | Konvention | Beispiel |
|---|---|---|
| Tabelle | `snake_case`, Plural | `users`, `order_items` |
| Spalte | `snake_case` | `created_at`, `user_id` |
| Foreign Key | `<singular_tabelle>_id` | `user_id`, `order_id` |
| Index | `idx_<tabelle>_<spalten>` | `idx_orders_user_id` |
| Unique Constraint | `uq_<tabelle>_<spalten>` | `uq_users_email` |
| Migration-Datei | Zeitstempel + `PascalCase`-Beschreibung | `1735500000000-CreateUsersTable.ts` |

- TypeORM/Prisma übernehmen das Mapping `snake_case` (DB) ↔ `camelCase` (TS) automatisch — nie manuell durchmischen.

## 3. Pflichtfelder pro Tabelle

Jede Tabelle hat mindestens:

```ts
@PrimaryGeneratedColumn('uuid')
id: string;

@CreateDateColumn({ name: 'created_at' })
createdAt: Date;

@UpdateDateColumn({ name: 'updated_at' })
updatedAt: Date;
```

- UUID als Primary Key (nicht Auto-Increment-Integer), außer explizit anders begründet (z. B. Performance bei sehr großen Tabellen).
- Soft-Delete (`deletedAt`) nur, wenn fachlich gefordert — Standard ist Hard-Delete, es sei denn Audit-/Wiederherstellungs-Anforderung besteht.

## 4. Beziehungen

- Beziehungen immer explizit mit `onDelete`-Verhalten definieren (`CASCADE`, `RESTRICT`, `SET NULL`) — nie DB-Default unkommentiert übernehmen.
- `@ManyToMany` nur bei echter Symmetrie; bei zusätzlichen Attributen auf der Verbindung → explizite Join-Entity statt implizite Pivot-Tabelle.
- Lazy-Loading (`lazy: true`) vermeiden — explizite `relations: [...]` oder Query-Builder mit gezielten Joins, um N+1-Queries zu verhindern.

## 5. Indexierung

- Jede Foreign-Key-Spalte bekommt einen Index.
- Spalten, die häufig in `WHERE`/`ORDER BY` auf großen Tabellen genutzt werden, bekommen einen Index — Entscheidung im PR-Kommentar kurz begründen.
- Composite-Index-Reihenfolge nach Selektivität: häufigste Filterspalte zuerst.
- Migration, die einen Index auf einer potenziell großen Tabelle anlegt, nutzt `CONCURRENTLY` (Postgres), um Locking in Produktion zu vermeiden.

## 6. Transaktionen

- Mehrere zusammengehörige Schreiboperationen (z. B. Order erstellen + Inventory reduzieren) laufen in einer expliziten Transaktion, nie als unabhängige, potenziell inkonsistente Einzel-Saves.

```ts
await this.dataSource.transaction(async (manager) => {
  const order = await manager.save(Order, newOrder);
  await manager.decrement(Inventory, { productId }, 'stock', quantity);
  return order;
});
```

- Transaktionsgrenze liegt im Service, nicht im Repository — Repository-Methoden bleiben transaktionsagnostisch (nehmen optional einen `EntityManager` entgegen).
- Keine externen Netzwerk-Calls (E-Mail, Payment-API) **innerhalb** einer DB-Transaktion — DB-Locks so kurz wie möglich halten.

## 7. Queries & Performance

- Kein `SELECT *`-Äquivalent bei großen Entities in Hot-Paths — explizite `select`-Felder, wenn nicht alle Spalten gebraucht werden.
- Paginierte Endpoints nutzen immer `LIMIT`/`OFFSET` (oder Cursor) auf DB-Ebene — nie alles laden und im Code slicen.
- Aggregationen (Summen, Counts) auf DB-Ebene ausführen, nicht Datensätze laden und in JS aufsummieren.
- Bulk-Operationen (`insert`, `update` vieler Zeilen) über Batch-APIs des ORM, nicht in einer Schleife mit Einzel-Queries.

## 8. Seeds & Testdaten

- Seeds in `database/seeds/`, klar getrennt nach Environment (`dev`, `test`) — **nie** Seed-Skripte, die in Produktion versehentlich lauffähig sind.
- Seeds sind idempotent (mehrfaches Ausführen erzeugt keine Duplikate) — Upsert statt reinem Insert.

## 9. Backups & Destructive Changes

- Migrationen, die Daten löschen oder Spalten droppen, brauchen einen PR-Kommentar mit Backup-/Rollback-Plan.
- Spalten-Umbenennung als zweistufiger Prozess: neue Spalte hinzufügen + befüllen → Code umstellen → alte Spalte in separater, späterer Migration entfernen (kein Breaking-Deploy in einem Schritt).

## 10. Verbote

- Kein `synchronize: true`, auch nicht "nur lokal zum Testen".
- Keine direkten SQL-String-Konkatenationen mit User-Input (SQL-Injection-Risiko) — nur parametrisierte Queries/Query-Builder.
- Keine Migration, die bereits gemergt wurde, nachträglich verändern.
- Keine Business-Logik in Datenbank-Triggern/Stored Procedures, wenn sie stattdessen im Service-Layer klar sichtbar sein sollte.
- Kein direkter DB-Zugriff aus dem Controller — immer über Service → Repository.
