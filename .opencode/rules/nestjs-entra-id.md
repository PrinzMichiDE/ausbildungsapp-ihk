---
name: Entra ID Anbindung
description: Regeln für die zukünftige Anbindung an Microsoft Entra ID (OpenID Connect / OAuth2). Immer beachten bei Auth-Strategie, Token-Mapping, Gruppen-zu-Rollen-Mapping und Fallback-Szenarien.
globs:
  - "src/**/auth/**"
  - "src/**/guards/**"
  - "src/**/decorators/**"
  - "src/**/strategies/**"
  - "src/common/**"
  - "main.ts"
  - "env.validation.ts"
  - ".env*"
---

# Entra ID Anbindung — NextGen IT-Ausbildung

Diese Regeln definieren die zukünftige Integration von Microsoft Entra ID (ehemals Azure Active Directory) als optionaler Authentifizierungs-Provider. Die Implementierung ergänzt die bestehende JWT-Authentifizierung (siehe Security-Regeln §1) und das Rollenmodell (siehe RBAC-Regeln).

## 1. Architektur & Strategien

### 1.1 Dualer Auth-Modus
- **Standard:** Lokale JWT-Authentifizierung (bcrypt/argon2 + `passport-jwt`) bleibt als Primary-Auth bestehen.
- **Optional:** Entra ID als zusätzlicher Auth-Provider via OpenID Connect / OAuth2.
- **Konfigurierbar:** Pro Instanz umschaltbar via `AUTH_PROVIDER` Umgebungsvariable:

```env
# Optionen: local | entra-id
AUTH_PROVIDER=local
```

- **Prinzip:** Die App startet und funktioniert auch ohne Entra ID (lokaler Betrieb, Entwicklung, Datenschutz-Szenarien mit lokalem Ollama).

### 1.2 OIDC Flow
- **Flow:** Authorization Code Flow mit PKCE — kein Implicit Flow, kein Client Credentials für Frontend.
- **Discovery:** Automatische Konfiguration via `.well-known/openid-configuration` Endpoint des Entra ID Tenant.
- **Library:** `@nestjs/passport` + `passport-azure-ad` (oder `openid-client`) — nie eigene OIDC-Client-Logik.
- **Scopes:** `openid profile email` als Basis, ggf. `roles` für Entra-Gruppen-Zuordnung.

### 1.3 Token-Handling
- **Access Token:** Kurzlebig (15 Min.), wie bei lokaler JWT-Auth.
- **ID Token:** Wird geparst um User-Claims (Vorname, Nachname, E-Mail, Entra-ObjectId).
- **Refresh Token:** Wie bestehendes Modell (7 Tage), separat gespeichert.
- **Speicher:** Access Token im httpOnly-Cookie — **nie** im `localStorage`.

## 2. Gruppen-zu-Rollen-Mapping

### 2.1 Mapping-Konfiguration
Entra ID Sicherheitsgruppen werden via Konfiguration in Rollen der Plattform gemappt. Die Zuordnung ist zentral in der `env.validation.ts` oder einer `entra.config.ts` definiert:

```env
ENTRA_GROUP_AZUBI=nextgen-azubis
ENTRA_GROUP_AUSBILDUNGSBEAUFTRAGTER=nextgen-ausbildungsbeauftragte
ENTRA_GROUP_AUSBILDER=nextgen-ausbilder
ENTRA_GROUP_HR=nextgen-hr
ENTRA_GROUP_ADMIN=nextgen-admins
```

### 2.2 Mapping-Logik
- **Algorithmus:** User-Erstellung erfolgt automatisch beim ersten Login via Entra ID (Auto-Provisioning).
- **Rollen-Zuweisung:** Basiert auf der Mitgliedschaft in den konfigurierten Entra-Gruppen.
- **Mehrfachrollen:** Ein User kann Mitglied mehrerer Gruppen sein → additive Rollen-Vergabe (wie bestehendes RBAC-Modell).
- **Änderungen:** Gruppen-Zugehörigkeits-Änderungen beim nächsten Login neu auflösen — JWT-Rollen nicht langfristig cachen.

### 2.3 Admin-Override
- Die `admin`-Gruppe in Entra ID sollte ein separater, streng kontrollierter Kreis sein.
- **Break-Glass:** Ein dediziertes Break-Glass-Admin-Konto (separate Gruppe) für Notfälle, das nie über Entra ID deprovisioniert werden kann, sondern nur manuell.

## 3. User-Provisioning

### 3.1 Automatische Erstellung
- Beim ersten Login via Entra ID wird ein `User`-Record im System erstellt (sofern nicht bereits vorhanden).
- **Gemappte Felder:**
  - `email` → Entra `email` oder `preferredUsername`
  - `firstName` → Entra `givenName`
  - `lastName` → Entra `surname`
  - `externalId` → Entra `oid` (Object-ID) für eindeutige Zuordnung
- **Rollen:** Werden aus den Entra-Gruppen abgeleitet (siehe §2).

### 3.2 Synchronisation
- **Nur bei Login:** Kein periodischer Sync — Rollen werden bei jedem Auth-Event neu aufgelöst (siehe RBAC-Regeln §7).
- **De-Provisionierung:** Wenn ein User aus allen Entra-Gruppen entfernt wird, verliert er beim nächsten Login alle Rollen. Der User-Record bleibt bestehen (Berichtshistorie, Daten), aber die Rollen werden zurückgesetzt.

### 3.3 Manuelle Nachpflege
- Admin kann User manuell Rollen zuweisen/entziehen (z.B. für Übergangsphasen bei Personalwechsel).
- Dies ist unabhängig vom Entra-ID-Mapping und wird über das bestehende RBAC-Management (Admin-Rolle) gesteuert.

## 4. Fallback & Resilience

### 4.1 Ausfall-Strategie
- **Entra ID nicht erreichbar:** Automatischer Fallback auf lokale JWT-Authentifizierung (vorhandene User können sich einloggen).
- **Konfiguration:** `ENTRA_FALLBACK=local` — bei Error beim OIDC-Handshake wird der lokale Auth-Pfad genutzt.
- **Monitoring:** Entra-ID-Verfügbarkeit wird im Health-Check gemessen; Alerting bei dauerhaftem Ausfall.

### 4.2 Transition-Phase
- Während der Übergangsphase können beide Auth-Provider parallel aktiv sein.
- Ein User kann sich sowohl via lokalem Passwort als auch via Entra ID einloggen.
- Token-Typen werden klar identifiziert: `iss`-Claim im JWT gibt Auskunft über den Provider (`local` vs. `entra-id`).

## 5. Sicherheit

### 5.1 Claims-Validierung
- **Issuer:** `iss` muss dem Entra ID Tenant entsprechen (Whitelist).
- **Audience:** `aud` muss die Client-ID der App enthalten.
- **Nonce:** Immer validieren, um Replay-Angriffe zu verhindern.
- **Token-Replay:** JWT `jti` (JWT ID) prüfen, um Duplicate-Tokens zu erkennen.

### 5.2 Secret-Management
- Entra ID Client-Secret / Certificate Credentials über `ConfigService` aus `.env`, nie hartkodiert.
- Certificate-based Auth bevorzugen gegenüber Client-Secret für Produktion (robuster, kein Secret-Rotation-Problem).
- `TENANT_ID`, `CLIENT_ID`, `CLIENT_SECRET` in `.env.example` nur als Platzhalter.

### 5.3 Session-Management
- **Concurrent Sessions:** Maximal eine aktive Session pro User (neuer Login invalided alte Sessions).
- **Idle Timeout:** Konfigurierbar (Standard: 30 Min. Inaktivität → Re-Auth).
- **Absolute Timeout:** Maximal 8 Stunden Session-Lebensdauer, unabhängig von Aktivität.

## 6. Konfiguration

### 6.1 Env-Variablen

```env
# Entra ID
AUTH_PROVIDER=local|entra-id
ENTRA_TENANT_ID=
ENTRA_CLIENT_ID=
ENTRA_CLIENT_SECRET=
ENTRA_ISSUER=
ENTRA_GROUP_AZUBI=
ENTRA_GROUP_AUSBILDUNGSBEAUFTRAGTER=
ENTRA_GROUP_AUSBILDER=
ENTRA_GROUP_HR=
ENTRA_GROUP_ADMIN=
ENTRA_FALLBACK=local
ENTRA_REDIRECT_URI=http://localhost:3000/auth/entra/callback
```

### 6.2 Validation
- Bei `AUTH_PROVIDER=entra-id`: Alle `ENTRA_*`-Variablen müssen vor App-Start vorhanden sein (`env.validation.ts`).
- `TENANT_ID`, `CLIENT_ID`, `ISSUER` beim Start validieren (Discovery-Request gegen `.well-known/openid-configuration`).
- Fehlende Konfiguration → App startet nicht mit klarem Error (`EntraID_CONFIG_MISSING`).

## 7. Tests

- **Unit-Tests:** Gruppen-zu-Rollen-Mapping mit Mock-Gruppen-Listen für alle 5 Rollen.
- **Integration:** OIDC-Callback-Test mit Mock-Entra-ID (z.B. `msal-mock` oder `test-openid-provider`).
- **Fallback:** Simulation von Entra-ID-Ausfall → lokale Auth muss funktionieren.
- **Claims-Validierung:** Ungültige/expirierte Tokens → `401 Unauthorized`.

## 8. Verbote

- Kein Implicit Flow oder Resource Owner Password Credentials (ROPC) — nur Authorization Code + PKCE.
- Keine Entra-Gruppen-Zuordnungen im Code hartkodieren — ausschließlich via Konfiguration.
- Kein Entra-ID-Provider ohne funktionsfähigen lokalen Fallback.
- Keine Entra-ID-Secrets im Code, in Git-History oder in Logs.
- Kein automatisches Löschen von User-Records bei Entra-De-Provisionierung (Datenintegrität).