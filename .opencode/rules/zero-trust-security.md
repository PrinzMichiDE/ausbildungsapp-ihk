---
name: Zero-Trust & Defensive Security
description: Zero-Trust AuthZ, OWASP Top 10, DSGVO/GDPR, Supply-Chain-Security, Audit-Logging — immer erzwungen bei jeder Änderung.
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

# Zero-Trust & Defensive Security

Diese Regeln sind **immer erzwungen** — bei jeder Code-Generierung, jedem Review und jeder Änderung.

## 17. Zero-Trust & Defensive Authorization (AuthN & AuthZ)

### 17.1 Never Trust the Client

- Berechtigungen (RBAC/ABAC) **ausschließlich serverseitig** auf der untersten Anwendungsebene validieren.
- Clientseitige Sichten (UI-Hiding, Frontend-Logs) dienen nur der UX, **nicht** der Sicherheit.
- Jeder Request wird als potenziell bösartig behandelt — Auth- und AuthZ-Check vor jeder Business-Logik.

### 17.2 Principle of Least Privilege (PoLP)

- Services, API-Endpunkte und Datenbank-User erhalten **strikt nur die minimal notwendigen Rechte** für ihre spezifische Aufgabe.
- DB-User: kein `SUPERUSER`, kein `CREATEDB` — nur `SELECT/INSERT/UPDATE/DELETE` auf den nötigen Schemas.
- Service-Accounts (z.B. für Externe Systeme) mit eigenem, eingeschränktem Scope.

### 17.3 Session & Token Hygiene

- Access-Tokens: kurze TTL (15 Min.), Refresh-Token-Rotation bei jeder Nutzung.
- Cookies: `HttpOnly`, `SameSite=Strict`, `Secure` Flags — **nie** `SameSite=None` ohne triftigen Grund.
- Tokens nie im `localStorage`/`sessionStorage` speichern.
- Session-Invalidation bei Rollenänderung, Passwort-Reset und Logout.

## 18. Injection-Abwehr & OWASP Top 10 Compliance

### 18.1 Prepared Statements

- Datenbankzugriffe **ausnahmslos** mit Parameterized Queries oder typsicheren ORMs (Prisma Query Builder).
- Das Zusammensetzen von SQL-/NoSQL-Command-Strings ist **verboten** — auch in scheinbar sicheren Kontexten.

```ts
// Verboten
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// Korrekt
const user = await prisma.user.findUnique({ where: { id: userId } });
```

### 18.2 XSS & CSRF Prevention

- Alle Eingaben am Systemrand (Inbound) validieren und sanitizen.
- Konsequentes Output-Encoding bei jeder Ausgabe (HTML, JS, URL, CSS).
- Strikte Content Security Policy (CSP) definieren — `unsafe-inline` und `unsafe-domain` vermeiden.
- CSRF-Token für state-changing Operationen (POST/PUT/DELETE).

### 18.3 Upload- & Path-Security

- Dateiuploads anhand von **Magic Bytes** validieren (nicht nur MIME-Type/Endung).
- Randomisierte Dateinamen außerhalb des Web-Roots speichern.
- Path-Traversal-Versuche (`../`) unterbinden — keine User-Input-Pfade direkt im Dateisystem verwenden.
- Dateigröße und -anzahl pro User limitieren.

## 19. Datenschutz, PII & Privacy by Design (DSGVO/GDPR)

### 19.1 Data Minimization

- Verarbeite und speichere **nur Daten, die für den konkreten Zweck zwingend notwendig** sind.
- Keine "Nice-to-have"-Felder in User-Modellen ohne klaren Use-Case.
- PII-Felder explizit kennzeichnen (Kommentar oder Naming-Konvention).

### 19.2 Verschlüsselung & Log-Sanitization

- Sensible Daten (PII) in-transit (**TLS 1.3**) und at-rest verschlüsseln.
- PII, Tokens, Passwörter und Kreditkartendaten **strikt aus System-Logs, Traces und Error-Messages** verbannen.
- Request-Logging-Interceptor maskiert sensible Felder (`password`, `token`, `authorization`, `creditCard`) automatisch.

### 19.3 Compliance-Architektur

- Datenstrukturen so implementieren, dass Löschanfragen ("Recht auf Vergessenwerden"), Anonymisierung und Datenexporte (DSGVO Art. 15/17) sauber durchführbar sind.
- Soft-Delete nur, wenn fachlich nötig — bei PII-Löschanfragen tatsächliches Löschen/Anonymisieren vorsehen.
- Keine PII in Analytics-/Tracking-Events ohne explizite Freigabe.

## 20. Supply-Chain-Security & Secrets Management

### 20.1 Zero Secrets in Code

- Passwörter, API-Keys und Zertifikate **strikt aus dem Code und der Versionierung (Git)** verbannt.
- Secrets ausschließlich über Environment-Variablen oder Vault-Systeme laden.
- `.env` in `.gitignore`, `.env.example` enthält nur Platzhalter-Keys ohne echte Werte.
- Env-Validierung beim Start — App startet **nicht**, wenn ein sicherheitskritischer Wert fehlt.

### 20.2 Sichere Abhängigkeiten

- Exakte Pinning-Strategien über Lock-Files (`package-lock.json`, `pnpm-lock.yaml`).
- Keine Dependencies mit bekannten High/Critical-Vulnerabilities — `npm audit` fester Bestandteil der CI-Pipeline.
- Bevorzuge etablierte, aktiv gewartete Bibliotheken mit minimalem Dependency-Baum.
- Keine Dependency ohne dokumentierten Grund/Mitigation ins Projekt aufnehmen.

## 21. Audit-Logging & Forensische Observability

### 21.1 Unveränderliche Audit-Trails

- Alle sicherheitsrelevanten Aktionen strukturiert (JSON) protokollieren: Logins, Privilegienänderungen, Datenexports/-löschungen.
- Pflichtfelder pro Audit-Log: `timestamp`, `actorId`, `action`, `resourceType`, `resourceId`, `context`, `outcome`.
- Logs zentral sammeln (ELK, Loki, etc.), nicht nur in lokalen Dateien.

### 21.2 Non-Repudiation

- Audit-Logs müssen **unveränderlich** sein — keine manipulierbaren Eingabedaten, die den Log-Parser beschädigen können.
- Log-Injection Prevention: User-Input wird nie direkt in Log-Strings eingefügt, sondern als strukturierte Felder übergeben.
- Keine direkte Ausgabe von User-Input in `console.log()`/`logger.log()` ohne Escaping.

```ts
// Verboten — Log Injection möglich
logger.log(`User ${req.body.name} performed action`);

// Korrekt — strukturiertes Logging
logger.log({ event: 'user_action', actorId: user.id, action: 'export_data', details: { ... } });
```
