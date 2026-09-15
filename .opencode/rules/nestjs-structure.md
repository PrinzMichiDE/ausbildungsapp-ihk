# Projekt-Struktur-Regeln: NestJS

Diese Regeln gelten für **jede** Code-Generierung, Refactoring- oder Review-Aufgabe in diesem Repository. OpenCode hält sich strikt an dieses Schema, außer der Nutzer weist explizit anders an.

## 1. Grundprinzip

- **Feature-basiert, nicht layer-basiert.** Jedes fachliche Feature bekommt ein eigenes Modul mit allem, was dazugehört.
- Kein globaler `controllers/`-, `services/`-, `dto/`-Ordner auf Top-Level. Diese Ebenen leben **innerhalb** eines Feature-Moduls.
- `common/` und `shared/` sind reserviert für wirklich modulübergreifenden Code (nicht als Ablageplatz für alles Unklare).

## 2. Ordnerstruktur (Top-Level)

```
src/
├── main.ts
├── app.module.ts
├── config/                  # Konfiguration, env-Validation
│   ├── configuration.ts
│   └── env.validation.ts
├── common/                  # Modulübergreifend, framework-nah
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── constants/
├── shared/                  # Modulübergreifend, fachlich (z.B. Mailer, Logger)
│   └── <shared-module>/
├── database/                 # ORM-Setup, Migrationen, Seeds
│   ├── migrations/
│   └── seeds/
└── modules/
    └── <feature>/            # z.B. users, orders, auth
        ├── <feature>.module.ts
        ├── <feature>.controller.ts
        ├── <feature>.controller.spec.ts
        ├── <feature>.service.ts
        ├── <feature>.service.spec.ts
        ├── dto/
        │   ├── create-<feature>.dto.ts
        │   └── update-<feature>.dto.ts
        ├── entities/
        │   └── <feature>.entity.ts
        ├── interfaces/
        │   └── <feature>.interface.ts
        └── repositories/
            └── <feature>.repository.ts
```

## 3. Modul-Regeln

- Jedes Feature-Modul ist **eigenständig verantwortlich** für seinen Slice (Controller, Service, DTOs, Entities).
- Cross-Feature-Zugriffe **nur über exportierte Provider** des jeweiligen Moduls — niemals direkte Imports aus fremden internen Dateien.
- `AppModule` importiert nur Feature-Module, `ConfigModule`, `DatabaseModule` — keine Business-Logik.
- Zirkuläre Abhängigkeiten zwischen Modulen vermeiden; falls nötig, `forwardRef()` explizit begründen.

## 4. Naming Conventions

| Element | Konvention | Beispiel |
|---|---|---|
| Datei | `kebab-case.type.ts` | `create-user.dto.ts` |
| Klasse | `PascalCase` | `CreateUserDto` |
| Modul-Ordner | `kebab-case`, Singular oder Plural konsistent | `users/` |
| Interface | `PascalCase`, kein `I`-Prefix | `UserRepository` |
| Konstanten | `SCREAMING_SNAKE_CASE` | `MAX_LOGIN_ATTEMPTS` |
| Test-Datei | gleicher Name + `.spec.ts` | `users.service.spec.ts` |
| E2E-Test | in `test/`, Suffix `.e2e-spec.ts` | `users.e2e-spec.ts` |

## 5. Schichtenregeln (innerhalb eines Moduls)

- **Controller**: nur Routing, Validation-Trigger (DTO), Response-Mapping. Keine Business-Logik.
- **Service**: enthält die Business-Logik. Kein direkter DB-Zugriff, wenn ein Repository-Layer existiert.
- **Repository**: kapselt ORM-/DB-Zugriff (TypeORM/Prisma-Queries). Wird vom Service injiziert.
- **DTOs**: getrennt für `create-*`, `update-*`, `response-*` (falls Response-Shaping nötig ist). Validierung über `class-validator`.
- **Entities**: reine Datenmodelle, keine Business-Logik.

## 6. Barrel Files

- `index.ts` **nur** auf Modul-Root-Ebene für öffentliche Exporte (was andere Module nutzen dürfen).
- Keine Barrel Files innerhalb von `dto/`, `entities/` etc. — führt zu Zirkularität und unklaren Importpfaden.

## 7. Tests

- Unit-Tests liegen **neben** der zu testenden Datei (Co-location), nicht in separatem `test/`-Baum.
- E2E-Tests liegen zentral in `test/` auf Root-Ebene.
- Jedes neue Service/Controller-File erzeugt automatisch ein `.spec.ts`-Grundgerüst.

## 8. Auto-generierte Artefakte (Nest CLI)

Bei `nest generate` / OpenCode-Codegen gilt dieselbe Struktur — Generierung immer unter `src/modules/<feature>/`, nie im Root.

## 9. Verbote

- Kein „God Module" (ein Modul, das alles importiert).
- Keine Business-Logik in Controllern, Guards, Interceptors oder DTOs.
- Kein direkter Zugriff auf `process.env` außerhalb von `config/` — immer über `ConfigService`.
- Keine zirkulären Imports zwischen Feature-Modulen ohne explizite Begründung im Code-Kommentar.

## 10. Beispiel für ein neues Feature

Anfrage: *"Erstelle ein Feature für Bestellungen (orders)"*
→ OpenCode legt an:
```
src/modules/orders/
├── orders.module.ts
├── orders.controller.ts
├── orders.controller.spec.ts
├── orders.service.ts
├── orders.service.spec.ts
├── dto/
│   ├── create-order.dto.ts
│   └── update-order.dto.ts
├── entities/
│   └── order.entity.ts
└── repositories/
    └── orders.repository.ts
```
und registriert `OrdersModule` im `AppModule`.
