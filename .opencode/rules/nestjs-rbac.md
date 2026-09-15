---
name: NextGen RBAC & Rollenmodell
description: Fachliches Rollenmodell und Scoping-Regeln der Ausbildungsplattform "NextGen IT-Ausbildung". Ergänzt die generische Security-Regel um die Projekt-Rollen (azubi, ausbildungsbeauftragter, ausbilder, hr, admin). Immer beachten bei Guards, Scoping, AccessScopeService und geschützten Endpoints.
globs:
  - "src/**/*.guard.ts"
  - "src/**/auth/**"
  - "src/**/decorators/**"
  - "src/**/*.service.ts"
  - "src/common/constants/roles.ts"
  - "src/modules/**"
---

# RBAC- & Rollenmodell-Regeln: NextGen IT-Ausbildung

Diese Regeln gelten für jede Zugriffsprüfung, jedes Scoping und jede Datensichtbarkeits-Entscheidung in diesem Repository. Sie ergänzen die generische Security-Regel um das fachliche Rollenmodell dieser Plattform.

## 1. Rollen im Überblick

| Rolle | Kurzbeschreibung | Scope |
|---|---|---|
| `azubi` | eigene Berichte, eigener Fortschritt | nur eigene Daten |
| `ausbildungsbeauftragter` | betreut Azubis der eigenen Abteilung(en) während des Einsatzes | Azubis mit aktivem Einsatz in eigener Abteilung |
| `ausbilder` | Gesamtverantwortung, finale Freigabe, Versetzung | alle Azubis |
| `hr` | Statistiken, Verträge, Krankmeldungen, Übernahme-Planung | alle Azubis, keine fachliche Bewertungskompetenz |
| `admin` | Systemkonfiguration, Rollen/Rechte, Schnittstellen | technisch, keine fachlichen Ausbildungsdaten standardmäßig |

- Rollen sind **nicht exklusiv** — eine Person kann z. B. gleichzeitig `ausbildungsbeauftragter` und `hr` sein. Rechte werden additiv, nie subtraktiv kombiniert.
- Rollen sind in `src/common/constants/roles.ts` als Enum zentral definiert — keine Rollen-Strings verstreut im Code.

## 2. Scoping-Prinzip: Rolle allein reicht nicht

- Rollenprüfung (`@Roles(...)` + `RolesGuard`) beantwortet nur "**darf diese Aktion grundsätzlich ausgeführt werden**". Die Frage "**auf welche Datensätze**" wird **immer zusätzlich** über einen Scoping-Layer im Service beantwortet — nie nur über die Rolle.
- Jeder Read/Write auf Azubi-bezogene Daten läuft durch einen zentralen `AccessScopeService`, der basierend auf `currentUser` einen Datenbank-Filter liefert:

```ts
// AccessScopeService
async getVisibleAzubiIds(user: CurrentUser): Promise<string[] | 'ALL'> {
  switch (user.role) {
    case Role.AZUBI:
      return [user.azubiId];
    case Role.AUSBILDUNGSBEAUFTRAGTER:
      return this.einsatzRepository.findActiveAzubiIdsForAbteilung(user.abteilungIds);
    case Role.AUSBILDER:
    case Role.HR:
      return 'ALL';
    case Role.ADMIN:
      return []; // Admin sieht standardmäßig KEINE fachlichen Ausbildungsdaten
  }
}
```

- Dieser Filter wird **immer auf DB-Ebene** angewendet (`WHERE azubi_id IN (...)`), niemals erst nach dem Laden aller Daten im Code gefiltert (Performance + Sicherheitsrisiko bei vergessenem Filter).

## 3. Abteilungs-Scoping (Ausbildungsbeauftragter)

- Sichtbarkeit basiert auf dem **aktiven Einsatz** (`einsatz`-Entity: `azubiId`, `abteilungId`, `von`, `bis`), nicht auf einer statischen Zuordnung — ein Azubi "verschwindet" automatisch aus der Sicht des Ausbildungsbeauftragten, sobald der Einsatz endet (`bis < heute`).
- Zukünftige Einsätze (Rotationsplan) sind für den zuständigen Ausbildungsbeauftragten **lesbar** ("wer kommt demnächst"), aber nicht bearbeitbar/genehmigungsfähig, solange der Einsatz nicht aktiv ist.
- Ein Ausbildungsbeauftragter mit mehreren Abteilungen (`abteilungIds: string[]`) sieht die Vereinigung aller zugeordneten Abteilungen — kein manuelles Umschalten zwischen Abteilungs-Kontexten nötig.

## 4. Berechtigungsmatrix (Kern-Aktionen)

| Aktion | Azubi | Ausb.-beauftragter | Ausbilder | HR | Admin |
|---|---|---|---|---|---|
| Bericht erstellen/bearbeiten (eigener, Status `entwurf`) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Bericht einreichen | ✅ (eigener) | ❌ | ❌ | ❌ | ❌ |
| Bericht kommentieren/prüfen | ❌ | ✅ (Azubi im eigenen Einsatz) | ✅ (alle) | ❌ | ❌ |
| Bericht final visieren | ❌ | ❌ | ✅ | ❌ | ❌ |
| Bericht nach Archivierung ändern | ❌ | ❌ | ❌ | ❌ | ❌ (siehe Workflow-Regeln) |
| Versetzungsplan bearbeiten | ❌ | ❌ (nur lesen) | ✅ | ❌ | ❌ |
| Krankmeldung/Vertrag einsehen | ❌ (eigene) | ❌ | ❌ | ✅ | ❌ |
| Zertifikat hochladen | ✅ (eigenes) | ❌ | ❌ (lesen) | ❌ (lesen) | ❌ |
| Skill-Matrix als "vermittelt" markieren | ❌ | ✅ (eigene Abteilung) | ✅ | ❌ | ❌ |
| Rollen/Rechte verwalten | ❌ | ❌ | ❌ | ❌ | ✅ |

- Diese Matrix ist die **Referenz** für jeden neuen Endpoint — bei Unklarheit wird sie zuerst ergänzt, dann implementiert, nicht umgekehrt.
- Neue Aktionen, die nicht in der Matrix stehen, werden **nicht** implementiert, ohne die Matrix vorher im PR zu erweitern.

## 5. Ownership vs. Rollen-Check — Kombination

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.AUSBILDUNGSBEAUFTRAGTER, Role.AUSBILDER)
@Post(':berichtId/kommentar')
async addKommentar(
  @Param('berichtId') berichtId: string,
  @CurrentUser() user: CurrentUser,
  @Body() dto: AddKommentarDto,
) {
  await this.scopeService.assertCanAccessBericht(user, berichtId); // wirft ForbiddenException
  return this.berichteService.addKommentar(berichtId, dto, user);
}
```

- `RolesGuard` prüft die grobe Rollenberechtigung, `AccessScopeService`/`assertCanAccess*`-Methoden prüfen die feingranulare Sichtbarkeit — **beide Schritte sind Pflicht**, keiner ersetzt den anderen.
- Fehlender Zugriff gibt `403 FORBIDDEN` mit generischem Error-Code (`ACCESS_DENIED`), **nie** unterscheidbar von "Ressource existiert nicht" bei sensiblen Daten (verhindert Informationsleck über Existenz von Datensätzen — insbesondere bei Krankmeldungen/Verträgen).

## 6. HR- und Admin-Sonderregeln

- HR sieht **organisatorische** Daten (Verträge, Krankmeldungen, Statistiken, Übernahme-Status) aller Azubis, aber **keine** fachlich-inhaltlichen Bewertungen (Berichtsheft-Kommentare, Skill-Freigaben) — getrennte Datenbereiche, getrennte Guards (`@Roles(Role.HR)` nur auf HR-eigenen Controllern/Endpoints).
- Admin hat standardmäßig **keinen** Zugriff auf fachliche Ausbildungsdaten (Berichte, Noten, Krankmeldungen) — nur auf Systemkonfiguration, Nutzerverwaltung, Schnittstellen-Settings. Falls ein Admin ausnahmsweise fachliche Daten einsehen muss (Support-Fall), läuft das über einen separaten, geloggten "Impersonation"/"Break-Glass"-Mechanismus (siehe Audit-Log-Regeln) — nie über einen impliziten Admin-Bypass in den normalen Endpoints.

## 7. Rollenwechsel & Mehrfachrollen

- Rollenzuweisung erfolgt über eine separate `user_roles`-Tabelle (n:m), nicht als einzelnes `role`-Feld auf `user` — ermöglicht Mehrfachrollen (siehe Abschnitt 1).
- Bei Rollenänderung eines Users (z. B. Ausbildungsbeauftragter wird zusätzlich HR): sofortige Wirkung beim nächsten Request, kein Neustart/Cache-Invalidierung außer dem üblichen JWT-Claims-Refresh.
- Rollen/Abteilungszuordnung werden **nicht** im JWT hartkodiert für lange Gültigkeitsdauer — Access-Token kurzlebig halten (siehe Security-Regeln) oder Rollen bei jedem Request aus der DB nachladen, damit Rechteentzug sofort wirkt.

## 8. Tests

- Jeder neue geschützte Endpoint bekommt Tests für: (a) autorisierte Rolle mit passendem Scope → Erfolg, (b) autorisierte Rolle mit falschem Scope (anderer Azubi/andere Abteilung) → `403`, (c) falsche Rolle → `403`, (d) kein Auth → `401`.
- `AccessScopeService` wird isoliert mit allen 5 Rollen-Kombinationen unit-getestet — keine Rolle darf ungetestet bleiben.

## 9. Verbote

- Kein Endpoint, der nur über `@Roles(...)` absichert, ohne zusätzliches Scoping bei personenbezogenen/azubi-spezifischen Daten.
- Kein Filtern der Sichtbarkeit erst im Frontend — jede Einschränkung ist serverseitig durchgesetzt.
- Kein impliziter Admin-Vollzugriff auf fachliche Daten "weil es praktisch ist" — Admin-Zugriff auf fachliche Daten immer explizit, begründet und geloggt.
- Keine Rollenprüfung mit String-Vergleich (`user.role === 'admin'`) verstreut im Code — ausschließlich über Guards/`AccessScopeService`.
