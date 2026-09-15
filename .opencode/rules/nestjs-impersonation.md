---
name: Impersonationsmodus
description: Regeln für den Impersonationsmodus, mit dem Admin, Ausbilder und HR die Perspektive eines beliebigen Azubis einsehen können. Immer beachten bei Impersonation-Endpoints, Audit-Logging, Sichtbarkeit und Exit-Mechanismus.
globs:
  - "src/**/auth/**"
  - "src/**/guards/**"
  - "src/**/decorators/**"
  - "src/**/controllers/**"
  - "src/**/services/**"
  - "src/**/interceptors/**"
  - "src/common/**"
---

# Impersonationsmodus — NextGen IT-Ausbildung

Diese Regeln definieren den Impersonationsmodus: Admin, Ausbilder und HR können die UI- und Datenperspektive eines beliebigen Azubis einsehen, um Probleme zu diagnostizieren, Schulungen nachzuvollziehen oder Support-Fälle zu bearbeiten.

## 1. Prinzip & Zugriff

### 1.1 Wer darf impersonalisieren?
| Rolle | Impersonation erlaubt | Einschränkung |
|---|---|---|
| **Admin** | ✅ | Alle Azubis; keine Einschränkung |
| **Ausbilder** | ✅ | Nur Azubis mit aktivem Einsatz in eigener Abteilung |
| **HR** | ✅ | Alle Azubis |
| **Ausbildungsbeauftragter** | ❌ | Kein Impersonation-Zugriff |
| **Azubi** | ❌ | Kein Impersonation-Zugriff |

- **Prinzip:** Der Impersonator sieht **exakt** das, was der ausgewählte Azubi sieht — keine erweiterten Daten, keine Admin-Bypass-Ansicht.
- **Scope:** Impersonation ist rein lesend (Read-Only). Der Impersonator kann **keine** Daten im Namen des Azubis ändern, erstellen oder löschen.

### 1.2 Technische Umsetzung
- **Mechanismus:** Ein `X-Impersonate-User` Header (oder `impersonatedUserId` im JWT Claims) wird gesetzt, wenn der Impersonationsmodus aktiv ist.
- **Middleware:** `ImpersonationMiddleware` fängt den Header ab und setzt einen `impersonatedBy`-Context in `Request`.
- **Original-User:** Der ursprüngliche User (Impersonator) bleibt im Token/Cookie erhalten; der `impersonatedUserId` wird als zusätzlicher Claim oder Header übergeleitet.
- **Kein neuer Token:** Der Impersonator nutzt seinen bestehenden JWT; die Impersonation ist eine Session-Eigenschaft, kein neuer Login.

```ts
// Request-Context-Erweiterung
interface Request {
  user: CurrentUser;          // Der eingeloggte User (Impersonator)
  impersonatedBy?: string;    // userId des Impersonators
  impersonatedUserId?: string; // userId des gecoverten Azubis
}
```

## 2. Impersonation-Workflow

### 2.1 Starten
1. **Berechtigungsprüfung:** `RolesGuard` prüft, ob der User Admin, Ausbilder oder HR ist.
2. **Azubi-Auswahl:** Der Nutzer wählt einen Azubi aus einer Dropdown-Liste (nur Azubis innerhalb seines Scopes).
3. **Bestätigung:** `ConfirmDialog` mit Warnung: *"Du siehst nun die Ansicht von [Azubi-Name]. Du kannst keine Änderungen vornehmen."*
4. **Activierung:** `POST /api/v1/auth/impersonate` mit Body `{ "azubiId": "..." }`.
5. **Response:** Session-Flag wird gesetzt; nächste Request trägt den `X-Impersonate-User` Header.

### 2.2 Aktive Impersonation-Indikatoren
Während der Impersonation muss die UI den Status klar anzeigen:
- **Banner:** Fixes Banner oben (PrimeVue `Banner` oder `Alert` mit `type="warning"`):
  > 🔍 **Impersonationsmodus aktiv** — Du siehst die Ansicht von *[Vorname Nachname]*. Du kannst keine Änderungen vornehmen. [Beenden]
- **Farbliche Markierung:** Das Banner hat einen `amber-500`/`amber-100` Hintergrund (Warning-Semantik).
- **Navigations-Hintergrund:** Sidebar zeigt ein subtiles Impersonation-Indicator-Icon neben dem Benutzermenü.
- **Keine Aktionen:** Alle Schreib-Endpoints geben `403 Forbidden` mit `impersonation_read_only` Error-Code.

### 2.3 Beenden
1. **Button:** `[Beenden]` im Banner oder im Benutzer-Menü.
2. **Endpoint:** `POST /api/v1/auth/impersonate/exit`.
3. **Effekt:** Session-Flag wird zurückgesetzt; nächster Request zeigt die normale Admin-/Ausbilder-/HR-Ansicht.
4. **UI:** Banner verschwindet; Navigation kehrt zum Rollen-Default zurück.
5. **Kein Neu-Login:** Der Impersonator bleibt eingeloggt; nur der Impersonation-Overlay wird entfernt.

### 2.4 Automatisches Timeout
- **Zeitlimit:** Impersonation wird nach **15 Minuten Inaktivität** automatisch beendet.
- **Warning:** 2 Minuten vor Ablauf erscheint ein `Toast` mit Countdown und `ConfirmDialog` zur Verlängerung.
- **Verlängerung:** Einmalig verlängerbar um weitere 15 Minuten (via `POST /api/v1/auth/impersonate/extend`).
- **Maximale Dauer:** 30 Minuten Gesamtzeit; danach zwangsbeendung mit Log-Eintrag.

## 3. Sichtbarkeit im Impersonationsmodus

### 3.1 Was der Impersonator sieht
Der Impersonator sieht **1:1** die gleiche Ansicht wie der gecoverte Azubi:

| Bereich | Sichtbarkeit |
|---|---|
| Dashboard | Rollenspezifisches Azubi-Dashboard (Widget, Fortschritt, Tasks) |
| Berichtsheft | Eigene Berichte des Azubis (nur `entwurf` + `eingereicht` Status) |
| Skill-Matrix | Azubi-spezifischer Fortschritt |
| Abwesenheiten | Eigene Abwesenheitsdaten |
| Dokumente & Zertifikate | Eigene Uploads |
| Einstellungen | Eigene Profil-Einstellungen (nicht die Admin-Einstellungen) |

### 3.2 Was der Impersonator NICHT sieht
- **Admin-Einstellungen:** Keine Systemkonfiguration, keine Nutzerverwaltung, keine Rollenverwaltung.
- **Ausbilder-Tools:** Kein Bulk-Approve, keine Versetzungsplanung, keine KI-Kurs-Generierung.
- **HR-Ansicht:** Keine organisatorischen Übersichten, keine Statistiken aller Azubis.
- **Andere Azubis:** Keine Einblicke in Berichte oder Daten anderer Azubis.
- **Audit-Logs:** Kein Zugriff auf Audit-Logs.

### 3.3 Scoping im Impersonationsmodus
- Der `AccessScopeService` wird **umgehbar**: Im Impersonationsmodus wird der `azubiId` aus dem `impersonatedUserId`-Claim verwendet, nicht aus `currentUser.id`.
- **Ausnahme:** Der Scoping-Layer fügt einen `WHERE azubi_id = impersonatedUserId` Filter hinzu — kein Wildcard-`ALL`-Zugriff.
- **Read-Only Enforcement:** Write/Delete-Guards prüfen zusätzlich, ob `impersonatedBy` gesetzt ist → `403` mit `IMPERSONATION_READ_ONLY`.

## 4. Audit-Logging

### 4.1 Verpflichtende Audit-Events
Jede Impersonation-Aktion wird protokolliert (siehe Audit-Log-Modul):

| Event | Daten |
|---|---|
| `IMPERSONATION_STARTED` | `impersonatorId`, `impersonatedUserId`, `timestamp`, `ip`, `userAgent` |
| `IMPERSONATION_EXITED` | `impersonatorId`, `impersonatedUserId`, `timestamp`, `ip`, `duration` |
| `IMPERSONATION_EXTENDED` | `impersonatorId`, `impersonatedUserId`, `timestamp`, `newExpiry` |
| `IMPERSONATION_EXPIRED` | `impersonatorId`, `impersonatedUserId`, `timestamp`, `reason: timeout` |
| `IMPERSONATION_READ_ATTEMPT` | `impersonatorId`, `impersonatedUserId`, `endpoint`, `timestamp`, `blocked: true` (falls Write-Versuch) |

### 4.2 Audit-Log-Eigenschaften
- **Append-only:** Einträge sind unveränderbar.
- **Felder:** `impersonatorId`, `impersonatedUserId`, `action`, `timestamp`, `ip`, `userAgent`, `additionalData`.
- **Retention:** Wie alle Audit-Events (siehe Audit-Log-Regeln).

### 4.3 Benachrichtigung
- **Admin-Benachrichtigung:** Beim Start einer Impersonation durch HR oder Ausbilder → Info-Toast im Admin-Dashboard (optional, konfigurierbar).
- **Azubi-Benachrichtigung:** Der gecoverte Azubi sieht in seinem Dashboard eine subtile Info *"Ein Teammitglied hat deine Ansicht eingesehen"* — **keine** Benachrichtigung mit Impersonator-Name (DSGVO-konform, Datenschutz).

## 5. Datenschutz & Compliance

### 5.1 DSGVO-Konformität
- **Zweckbindung:** Impersonation dient ausschließlich Support, Diagnose und Qualitätssicherung.
- **Transparenz:** Der gecoverte Azubi wird informiert (ohne Namen des Impersonators).
- **Minimierung:** Nur die Daten, die der Azubi sehen würde, werden abgefragt — keine zusätzlichen Daten.
- **Löschung:** Audit-Logs der Impersonation werden nach der definierten Retention-Frist automatisch gelöscht.

### 5.2 EU AI Act
- Impersonation betrifft keine KI-Entscheidungen über Personen — keine spezielle Bewertung erforderlich.

## 6. Implementierung

### 6.1 Guard & Decorator

```ts
// ImpersonationGuard — schützt vor Write-Zugriffen im Impersonationsmodus
@Injectable()
export class ImpersonationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req.impersonatedBy) {
      if (context.switchToHttp().getRequest().method !== 'GET') {
        throw new ForbiddenException('IMPERSONATION_READ_ONLY');
      }
    }
    return true;
  }
}

// @ImpersonatedUser() Decorator zum Zugriff auf den gecoverten User
export function ImpersonatedUser() {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.impersonatedUserId ? req.userRepository.findById(req.impersonatedUserId) : req.user;
  });
}
```

### 6.2 Endpoints

| Method | Endpoint | Beschreibung |
|---|---|---|
| `POST` | `/api/v1/auth/impersonate` | Impersonation starten (Body: `{ azubiId }`) |
| `POST` | `/api/v1/auth/impersonate/exit` | Impersonation beenden |
| `POST` | `/api/v1/auth/impersonate/extend` | Impersonation verlängern (+15 Min.) |
| `GET` | `/api/v1/auth/impersonate/status` | Aktuellen Impersonations-Status prüfen |

### 6.3 Frontend-Integration
- **Dropdown für Azubi-Auswahl:** Nur sichtbar wenn `authStore.canImpersonate` (Admin, Ausbilder, HR).
- **Banner-Komponente:** `ImpersonationBanner.vue` — conditionally rendered via `v-if="useUiStore().isImpersonating"`.
- **Schreib-Blocking:** `ImpersonationGuard` (Frontend) verhindert das Absenden von Formularen im Impersonationsmodus.

## 7. Tests

- **Unit-Tests:**
  - Admin kann jeden Azubi impersonieren → `200`
  - Ausbilder kann nur Azubis eigener Abteilung impersonieren → `200` / `403`
  - Ausbildungsbeauftragter kann nicht impersonieren → `403`
  - Impersonation + Write-Request → `403 IMPERSONATION_READ_ONLY`
  - Impersonation-Timeout nach 15 Min. → `401`
  - Exit-Endpoint setzt Session korrekt zurück → `200`

- **Integration:**
  - Full-Flow: Login → Impersonation starten → Lesen eines Berichts → Beenden → Normalansicht
  - Audit-Log wird bei jedem Impersonations-Event geschrieben
  - `X-Impersonate-User` Header wird korrekt propagiert

- **E2E (Playwright):**
  - Ausbilder impersoniert Azubi → sieht dessen Dashboard → beendet → sieht eigenes Dashboard
  - Schreib-Button ist deaktiviert/versteckt im Impersonationsmodus

## 8. Verbote

- Kein Impersonation-Zugriff für Ausbildungsbeauftragte oder Azubis.
- Kein Schreibzugriff im Impersonationsmodus (Read-Only strikt durchgesetzt).
- Keine Anzeige des Impersonator-Namens an den gecoverten Azubi (DSGVO).
- Kein automatisches Logout des gecoverten Azubis (zwei Sessions parallel erlaubt).
- Kein Umgehen des Audit-Logs — jeder Impersonations-Aufruf muss geloggt werden.
- Keine unlimitierte Impersonations-Dauer (max. 30 Minuten mit Verlängerung).
- Kein Impersonation-Flag im JWT als dauerhafter Claim — immer session-basiert.