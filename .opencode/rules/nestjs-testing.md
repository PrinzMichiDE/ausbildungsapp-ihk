# Test-Regeln: NestJS

Diese Regeln gelten für **jede** Test-Generierung (Unit, Integration, E2E) in diesem Repository.

## 1. Testarten & Ort

| Typ | Ort | Suffix | Zweck |
|---|---|---|---|
| Unit-Test | neben der Quelldatei | `.spec.ts` | einzelne Klasse/Funktion, alle Dependencies gemockt |
| Integration-Test | neben dem Modul, `__tests__/` optional | `.integration-spec.ts` | mehrere Provider echt, z.B. Service + echte DB (Testcontainer) |
| E2E-Test | `test/` auf Root-Ebene | `.e2e-spec.ts` | HTTP-Request über `supertest` gegen laufende App |

Kein Test ohne zugehörige Quelldatei generieren, und keine Quelldatei ohne mindestens ein `.spec.ts`-Grundgerüst.

## 2. Grundstruktur eines Unit-Tests

```ts
describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: createMock<UsersRepository>() },
      ],
    }).compile();

    service = module.get(UsersService);
    repository = module.get(UsersRepository);
  });

  describe('findOne', () => {
    it('gibt den User zurück, wenn er existiert', async () => {
      // Arrange
      repository.findById.mockResolvedValue(userFixture);

      // Act
      const result = await service.findOne('1');

      // Assert
      expect(result).toEqual(userFixture);
    });

    it('wirft NotFoundException, wenn kein User existiert', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
});
```

**Regel: Arrange–Act–Assert** immer als Kommentar-Blöcke oder klar erkennbare Absätze, auch ohne Kommentar.

## 3. Was getestet wird (Pflicht)

- **Controller**: Routing korrekt, DTO wird an Service weitergereicht, Response-Shape stimmt. Business-Logik wird gemockt, nicht mitgetestet.
- **Service**: jeder Public-Method mindestens ein Happy-Path-Test + ein Fehler-/Edge-Case-Test.
- **Guards/Pipes/Interceptors**: isoliert testen, ohne vollen App-Kontext.
- **Repository**: nur in Integration-Tests gegen echte (Test-)DB, nicht in Unit-Tests mocken und dann "testen".

## 4. Mocking-Regeln

- Dependencies **immer über DI mocken** (`Test.createTestingModule`), nie mit `jest.mock()` auf Modulebene, außer bei externen Libraries.
- Für Repository-/externe Service-Mocks: `jest-mock-extended` (`createMock<T>()`) verwenden — keine handgeschriebenen Partial-Mocks mit `as any`.
- Keine echten Netzwerk-/DB-Calls in Unit-Tests. Wenn nötig → Integration-Test.
- Zeit-abhängiger Code: `jest.useFakeTimers()`, niemals `setTimeout` in Tests real ablaufen lassen.

## 5. Fixtures & Test-Daten

```
src/modules/<feature>/test/
└── fixtures/
    └── <feature>.fixture.ts
```

- Test-Daten als Factory-Funktionen, nicht als globale Konstanten mit hartkodierten IDs:
```ts
export const buildUser = (overrides: Partial<User> = {}): User => ({
  id: randomUUID(),
  email: 'test@example.com',
  createdAt: new Date(),
  ...overrides,
});
```
- Keine Produktionsdaten oder echten personenbezogenen Daten in Fixtures.

## 6. E2E-Tests

```ts
describe('OrdersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => await app.close());

  it('POST /orders erstellt eine Bestellung', () => {
    return request(app.getHttpServer())
      .post('/orders')
      .send(validOrderPayload)
      .expect(201)
      .expect((res) => expect(res.body.id).toBeDefined());
  });
});
```

- Datenbank für E2E: Testcontainer oder dedizierte Test-DB, **nie** die Dev-/Prod-DB.
- Nach jedem E2E-Suite-Lauf: DB-State zurücksetzen (Transaktion rollback oder Truncate).

## 7. Naming von Testfällen

- `it('<erwartetes Verhalten>, wenn <Bedingung>')` — auf Deutsch oder Englisch konsistent im ganzen Projekt, nicht gemischt.
- Kein `it('should work')` oder `it('test 1')`.
- `describe`-Block = Klassen-/Methodenname, keine freien Beschreibungen.

## 8. Coverage & Qualität

- Mindest-Coverage: **Service-Layer 90%**, Controller 80%, Guards/Pipes/Interceptors 100% (kleine, kritische Einheiten).
- Coverage ist kein Selbstzweck: kein Test nur um eine Zeile grün zu färben, ohne echte Assertion.
- Jeder Bugfix bekommt **zuerst** einen reproduzierenden Test (Red → Green).

## 9. Verbote

- Keine `console.log` in Tests (stattdessen `expect`-Assertions).
- Kein `it.skip` / `xit` ohne Kommentar, warum und mit Ticket-Referenz.
- Keine Sleep-basierten Waits (`await new Promise(r => setTimeout(r, 1000))`) — stattdessen Fake Timers oder Polling-Utilities.
- Kein Testen von privaten Methoden über `(service as any).privateMethod()` — Verhalten über Public API testen.
