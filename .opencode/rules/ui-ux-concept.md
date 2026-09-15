---
name: UI/UX Konzept (Frontend)
description: Umfassendes UI- und UX-Konzept für die NextGen IT-Ausbildung Plattform. Gilt für alle Frontend-Komponenten, Views, Layouts und Interaktionen (Vue 3 + PrimeVue 4 + Tailwind CSS).
globs:
  - "**/*.vue"
  - "**/components/**"
  - "**/views/**"
  - "**/pages/**"
  - "src/**/*.vue"
  - "frontend/**"
---

# UI/UX Konzept — NextGen IT-Ausbildung

**Fokus:** Fachinformatiker für Systemintegration & IT-Ausbilder
**Technologie-Stack:** Vue 3 (Composition API), Pinia, PrimeVue 4 (Unstyled Modus), Tailwind CSS

---

## 1. Information Architecture (Sitemap)

Die Navigation ist flach gehalten, um kognitive Last zu minimieren. Die Hauptnavigation erfolgt über eine kollabierbare Sidebar.

```
🏠 Dashboard (Rollenspezifische Widgets & Quick-Actions)
📝 Berichtsheft
  ├── Aktuelle Woche (Editor)
  └── Archiv (Historie & PDF-Exporte)
🎯 Skill-Matrix & Lernpfade (IHK-Rahmenplan vs. Firmenrealität)
📅 Einsatzplanung (Abteilungsrotation)
⏱️ Abwesenheiten (Urlaub, Berufsschule, Krankheit)
📂 Dokumente & Zertifikate (IHK-Uploads, AWS/Cisco-Zertifikate)
⚙️ Einstellungen (Profil, Dark/Light Mode, Teams-Benachrichtigungen)
```

**Navigationsprinzipien:**
- Flache Hierarchie (max. 2 Ebenen) zur Minimierung kognitiver Last
- Kollabierbare Sidebar auf Desktop, Bottom-Navigation-Bar auf Mobilgeräten
- Aktive Route visuell hervorgehoben (PrimeVue `Menu` mit `highlight-router`)
- Breadcrumbs nur bei tiefer Verschachtelung (Archiv, Berichtsdetail)

---

## 2. User Journeys & Kern-Interaktionen

### 2.1 User Journey: Azubi schreibt Berichtsheft

| Schritt | Aktion | UI-Komponente |
|---|---|---|
| Einstieg | Azubi öffnet die App (mobil auf dem Rückweg von der Berufsschule oder freitags am Desktop) | PrimeVue `Toast` erinnert: *"Woche 42 ist noch offen."* |
| Dateneingabe | Editor öffnet sich; Berufsschultage farblich markiert, vorab mit Stundenplan befüllt | PrimeVue `Calendar`-Integration via iCal; farbcodierte Tage |
| Markdown & Code | Server-Migration dokumentieren; Konfigurations-Snippets formatiert | Markdown-Shortcuts für Nginx, Docker Compose, etc. |
| IHK-Mapping (KI-gestützt) | Klick auf "Skills verknüpfen" öffnet Sidebar-Overlay; KI schlägt Lernfelder vor | PrimeVue `Sidebar` + `OverlayPanel` mit Checkboxen |
| Abschluss | Klick auf "Zur Freigabe einreichen"; Bestätigung erforderlich | PrimeVue `ConfirmDialog` → Status wechselt auf "Wartet auf Ausbilder" |

**Detail-Workflow IHK-Mapping:**
1. Azubi klickt auf "Skills verknüpfen" im Editor-Header
2. `Sidebar` slide-in rechts mit Suchleiste und Vorschlagsliste
3. KI analysiert den Markdown-Text und gibt Vorschläge zurück (z.B. "Serverdienste bereitstellen", "Netzwerkinfrastruktur planen")
4. Jeder Vorschlag hat eine `Checkbox` und eine Konfidenz-Anzeige
5. Azubi bestätigt gewünschte Zuordnungen → `Toast`: "2 Kompetenzen verknüpft"
6. Verknüpfungen werden als Tags über dem Editor angezeigt

### 2.2 User Journey: Ausbilder prüft Berichte (Batch-Processing)

| Schritt | Aktion | UI-Komponente |
|---|---|---|
| Übersicht | Dashboard zeigt ausstehende Freigaben | PrimeVue `DataView` oder `DataTable` |
| Schnellprüfung | Liste links, Bericht rechts | PrimeVue `Splitter` (horizontal) |
| Inline-Feedback | Text markieren → kontextbezogener Kommentar | PrimeVue `OverlayPanel` mit `Editor` |
| Batch-Freigabe | Mehrere Berichte markieren, Bulk-Aktion | PrimeVue `DataTable` mit Checkboxen + `Button` "Bulk Approve" |

**Batch-Freigabe-Detail:**
1. Ausbilder sieht `DataTable` mit Spalten: Azubi-Name, Woche, Status, eingereicht am
2. Multi-Select via Checkboxen in der ersten Spalte (SelectColumn)
3. Toolbar oben: `Button` "Bulk Approve" mit `Badge` (Anzahl ausgewählt)
4. `ConfirmDialog` mit Zusammenfassung der auszuwertenden Berichte
5. Nach Bestätigung: `Toast` (Bottom-Right) *"X Berichte freigegeben"*, `DataTable` aktualisiert sich

---

## 3. Detailliertes Interface Design (PrimeVue Mapping)

### 3.1 Das Dashboard (Modularer Aufbau)

Das Dashboard nutzt ein Grid-System (Tailwind CSS), das sich auf mobilen Endgeräten stapelt (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).

```
┌──────────────────────────────────────────────┐
│ Hero-Section: Persönliche Begrüßung           │
│ + ProgressBar (Gesamtfortschritt AP1/AP2)     │
├──────────────┬───────────────┬───────────────┤
│ Quick-Action  │ Quick-Action  │ Quick-Action  │
│ Card          │ Card          │ Card          │
│ "Krankmeldung │ "Neues        │ "Kalender"    │
│  einreichen"  │  Zertifikat"  │               │
├──────────────┴───────────────┴───────────────┤
│ To-Do Widget                                  │
│ Timeline / OrderList                          │
│ "Aufgabe: RAG-Pipeline dokumentieren"         │
└──────────────────────────────────────────────┘
```

**Komponenten-Zuordnung:**
- **Hero-Section:** `Card` mit `ProgressBar` (bestimmt Wert: `value="75"`, `showValue=true`); Für Azubis animierter Fortschritt, für Ausbilder Statistiken
- **Quick-Actions:** `Card` Komponenten (`hover:shadow-lg`, `cursor-pointer`), jeweils mit `Icon`, `Title`, `Subtitle` und `Button`
- **To-Do Widget:** `Timeline` oder `OrderList` mit `Chip` für Priorität und `Badge` für Fälligkeitsstatus

### 3.2 Der Berichtsheft-Editor (Desktop-optimiert)

**Layout:** PrimeVue `Splitter` mit zwei Pane-Links (35%) / Rechts (65%).

```
┌───────────────────────┬────────────────────────┐
│                       │                        │
│  Eingabe              │  Live-Rendering        │
│  PrimeVue Textarea    │  Markdown → HTML       │
│  (seamless, no border)│  (sanitized, fenced)   │
│                       │                        │
├───────────────────────┴────────────────────────┤
│ Toolbar: Bold  Italic  Code  Table  ...         │
│ [Auto-Save Badge / Tag]                        │
└────────────────────────────────────────────────┘
```

**Detail-Spezifikationen:**
- **Linke Seite (Input):** `Textarea` ohne sichtbare Ränder (`border-0`, `ring-0`), `resize-none`, Full-Height innerhalb des Splitter-Pane
- **Rechte Seite (Output):** Live-Rendering via `v-html` mit sanitized Markdown (DOMPurify), Syntax-Highlighting für Code-Blöcke
- **Toolbar:** `Toolbar` Komponente mit `Button` für Markdown-Befehle; alternativ Shortcuts (Strg+B, Strg+C, etc.)
- **Auto-Save:** `Tag` oder `Badge` in der oberen rechten Ecke des Headers zeigt alle 30 Sekunden "Speichert..." oder "Gespeichert" an
- **Wochenanzeige:** Dropdown oder `Select` oben links zur Wochenauswahl, `Calendar`-Integration zur Navigation

### 3.3 Skill-Matrix & KI-Kursgenerator

**Darstellung:** PrimeVue `TreeTable`

| Spalte | Inhalt |
|---|---|
| Lernfeld | IHK-Berufsbildposition (Wurzelknoten) |
| KI-generierter Pfad | Firmenspezifische Lernpfade (Kind-Knoten) |
| Fortschritt | `Knob` Komponente (0–100%) |
| Status | `Tag` (freigegeben, in Bearbeitung, ausstehend) |
| Aktion | `Button` zum Expandieren / KI-Generierung starten |

**Generierungs-UI:**
1. Ausbilder klickt auf "KI-Generierung starten" für ein Lernfeld
2. `Skeleton` Komponente wird angezeigt (Lade-Placeholder)
3. LLM fragt im Hintergrund die Vektordatenbank ab und baut JSON-Struktur auf
4. Nach Abschluss: `Toast` "Kurs generiert" oder `Alert` bei Fehler
5. Neuer Kind-Knoten erscheint mit `Transition`-Animation in der TreeTable

**Qualitätsanzeige:**
- `Knob` in der Fortschrittspalte zeigt Erfüllungsgrad pro Lernfeld
- Farbcodierung: Grün (>85%), Gelb (60–85%), Rot (<60%)
- Tooltip auf `Knob` zeigt Qualitäts-Score und ggf. Eskalations-Hinweis

---

## 4. Interaktionsdesign & Microinteractions

### 4.1 Loading States
- **Prinzip:** Keine blockierenden Lade-Spinner (`ProgressSpinner`) als einzige Feedback-Quelle
- **Primär:** `Skeleton` Komponenten für alle Listen, Karten und Tabellen
- **Sekundär:** `ProgressSpinner` nur für Einzelaktionen mit langer Dauer (z.B. KI-Generierung >10s)
- **Ziel:** Verhinderung von Cumulative Layout Shift (CLS) durch stabile Placeholder-Dimensionen

### 4.2 Feedback-Loops
- **Erfolgreiche Aktionen:** `Toast` (Bottom-Right) mit Lebensdauer 3000ms
  - Farben: Grün (`green-500`) für Erfolg, Rot (`red-500`) für Fehler, Blau (`blue-500`) für Info
  - `icon` mit `check-circle`, `times-circle`, `info-circle`
- **Laufende Aktionen:** `Toast` mit `progress`-Leiste und unbestimmter Dauer (z.B. Upload, Generierung)
- **Inline-Erkenntnisse:** Formularvalidierung inline (`Message` Komponente) direkt unter dem Feld

### 4.3 Destruktive Aktionen
- **Prinzip:** Keine destruktiven Aktionen ohne Bestätigung
- **Mechanismus:** `ConfirmPopup` direkt am Button (kein Separated Dialog)
- **Positionierung:** `ConfirmPopup` erscheint nahe am auslösenden Element (kein Mausweg)
- **Texte:** Klare Frage ("Möchten Sie diesen Eintrag wirklich löschen?"), konsistente Buttons ("Ja, löschen" / "Abbrechen")

### 4.4 Transitions
- **Seitenwechsel:** Vue `<Transition name="fade">` mit Opacity-Fade (150ms)
- **Sidebar-Öffnen/Schließen:** Slide-Transition (translateX)
- **Toast-Einblenden:** Slide-In von rechts, Fade-Out nach 3000ms
- **TreeTable Expand/Collapse:** `TransitionGroup` für gleitete Animationen
- **Modal-Öffnen:** Fade-Backdrop + Scale (95% → 100%, 200ms)

**Vue-Transition-Definition:**
```vue
<Transition name="fade" @enter="(el) => el.style.transition = 'opacity 150ms ease'">
  <!-- Content -->
</Transition>
```

---

## 5. Responsive Design & Mobile Strategie

### 5.1 Mobile-First-Ansatz für Datenerfassung

| Feature | Mobile Umsetzung | Desktop Umsetzung |
|---|---|---|
| Krankmeldungen | HTML5 `capture="camera"` in `FileUpload` für AU-Bescheinigungen | Drag & Drop oder Datei-Wähler |
| Navigation | Bottom-Navigation-Bar (4–5 Items) oder Hamburger-Menü | Kollabierbare Sidebar |
| Tabellen | Stack-Modus (`<DataTable responsiveLayout="stack">`, jede Zeile → Card) | Volle Bildschirmbreite |
| Editor | Vollbild-Modus mit Toggle | Splitter-Layout (seitlich) |

### 5.2 Bottom-Navigation-Bar (Mobil)
- 5 Hauptpunkte: Dashboard, Berichtsheft, Skill-Matrix, Abwesenheiten, Einstellungen
- PrimeVue `Menu` mit `panel`-Stil oder `Toolbar` am Footer
- `ripple`-Effekt auf Tap
- Aktives Item: hervorgehobene Farbe + unterstrichener Indikator

### 5.3 Responsive Grid-Breakpoints
- **Sm (<640px):** Einer-Spalten-Layout, kompakte Karten
- **Md (640–1024px):** Zwei-Spalten-Layout, Standard-Splitter
- **Lg (>1024px):** Drei-Spalten-Layout, volle Sidebar, breite Tabellen

### 5.4 DataTable Responsiv
- **Desktop:** Volle Tabelle mit allen Spalten, `stickyHeader`, `scrollable`
- **Mobil:** `responsiveLayout="stack"`, jede Zeile wird zur Card mit Labels für jedes Feld
- **Breakpoint:** Abgebrochen bei `lg` (`<1024px`) in Stack-Modus

---

## 6. Barrierefreiheit (A11y) & Ergonomie

### 6.1 Keyboard Navigation
- **Vollständige Maus-freie Bedienbarkeit** aller Interaktionen
- **Focus-Ringe:** Tailwind `focus:ring-2 focus:ring-blue-500 focus:outline-none` (IT-Blau, 2px)
- **Tab-Reihenfolge:** Logische Reihenfolge von oben-links nach unten-rechts
- **Escape:** Schließt jedes offene Modal, Overlay, Dropdown oder ConfirmDialog

### 6.2 Keyboard Shortcuts

| Shortcut | Aktion | Implementierung |
|---|---|---|
| `Strg + /` | Globale Suchleiste öffnet | VueUse `onKeyStroke` |
| `Strg + Enter` | Berichtsheft einreichen | VueUse `onKeyStroke` |
| `Strg + S` | Auto-Save auslösen | VueUse `onKeyStroke` |
| `Escape` | Schließt Modal / Overlay | VueUse `onKeyStroke` |
| `Strg + N` | Neuer Bericht | VueUse `onKeyStroke` |
| `Alt + 1–5` | Springe zu Hauptnavigation | VueUse `onKeyStroke` |

### 6.3 Farbkontrast & Dark Mode
- **Dark Mode-Grundlage:** `bg-slate-900` als Hintergrund, `text-slate-200` für Fließtext
- **Primärfarben im Dark Mode:** Aufgehellt von `blue-600` auf `blue-400` für WCAG AA-Kontrastverhältnisse
- **Allgemeine Regel:** Immer WCAG AA (min. 4.5:1 für Normaltext, 3:1 für Large Text) prüfen
- **Theme-System:** Pinia `useUiStore` verwaltet aktives Theme; `document.documentElement` Klasse `dark` toggeln

### 6.4 ARIA-Labels
- **TreeTable:** Korrekte `role="tree"`, `aria-expanded`, `aria-selected` für Screenreader
- **DataTable:** `aria-label`, `aria-sort` für sortierbare Spalten
- **Toast:** `role="alert"`, `aria-live="polite"` für Benachrichtigungen
- **Buttons mit Icons:** Immer `aria-label` (z.B. `"Bericht speichern"`)
- **OverlayPanel:** `aria-modal="true"`, `aria-labelledby` für Titel

### 6.5 Ergonomie
- **Touch-Ziele:** Mindestens 44×44px für mobile Interaktionen (PrimeVue Empfehlung)
- **Hover-States:** Nur bei Desktop; auf Mobilgeräten durch Tap-States ersetzt
- **Scroll-Verhalten:** Sanftes Scrollen (`scroll-behavior: smooth`) für In-Page-Navigation
- **Schriftgröße:** Basis 14px für Body-Text, 16px für Eingabefelder (verhindert iOS-Zoom)

---

## 7. State Management (Pinia) & Datenfluss

### 7.1 Store-Architektur

#### `useAuthStore`
- **Verwaltet:** JWT-Tokens, Microsoft Entra ID Status, RBAC-Rollen
- **Zustände:** `token`, `user`, `roles`, `isAuthenticated`, `entraStatus`
- **Gettere:** `isAusbilder`, `isAzubi`, `isAdmin`, `hasRole(role)`, `currentUser`
- **Nutzung:** Bedingtes Rendern `v-if="authStore.isAusbilder"`, Role-Guards
- **Persistence:** Token im `localStorage` (kürzlelebig, Refresh-Logik im Backend)

#### `useReportStore`
- **Verwaltet:** Berichtsheft-Daten, Wochen-Cache, Status-Maschine
- **Zustände:** `reports` (Map<weekId, Report>), `currentWeek`, `loadingStates`, `selectedReport`
- **Caching:** Bereits geladene Wochen werden gecacht; Navigation zwischen Wochen ohne Ladezeiten
- **Offline-Fähigkeit:** Opt-in Speicherung im `localStorage` für das Schreiben von Berichten ohne aktive Internetverbindung
- **Sync:** Bei Re-Connection werden lokal gespeicherte Änderungen mit dem Server synchronisiert (Konfliktlösung: Server-Gewinner oder Merge)

#### `useUiStore`
- **Verwaltet:** UI-Zustände unabhängig von Fachdaten
- **Zustände:**
  - `sidebarOpen: boolean` (Sidebar geöffnet/geschlossen)
  - `theme: 'light' | 'dark'`
  - `modals: Record<string, boolean>` (globale Modal-Zustände)
  - `toastQueue: Toast[]`
  - `searchOpen: boolean`
- **Persistence:** `sidebarOpen` und `theme` in `localStorage` persistieren

### 7.2 Datenfluss
```
Backend API (NestJS) → Pinia Actions → Store Getter → Vue Components
                                              ↓
                                         LocalStorage (Offline-Cache)
```
- **Read:** Getter aus dem Store, bei Cache-Hit ohne API-Call
- **Write:** Aktion ruft API auf, aktualisiert Store, persistiert bei Bedarf
- **Fehler:** Aktion wirft Fehler → Component fängt ab → `Toast` mit Fehlermeldung

### 7.3 Store-Interaktionsmuster
- **Kein direktes State-Mutation** aus Components; nur über Actions
- **Batch-Aktionen:** `useReportStore.bulkApprove(ids)` für effiziente Mehrfach-Freigabe
- **Optimistic Updates:** UI sofort aktualisieren, bei Fehler Rollback mit `Toast`

---

## 8. Design-Tokens & Theming

### 8.1 PrimeVue Unstyled-Modus
- **Modus:** Unstyled (keine vordefinierten Theme-Klassen)
- **Styling:** Ausschließlich über Tailwind CSS Utility Classes und PrimeVue Design-Tokens
- **Design-Tokens (CSS-Variablen):**

```css
:root {
  --pv-primary: #2563eb;
  --pv-primary-contrast: #ffffff;
  --pv-surface: #ffffff;
  --pv-surface-alt: #f8fafc;
  --pv-text: #1e293b;
  --pv-text-secondary: #64748b;
  --p-border: #e2e8f0;
  --p-radius: 6px;
}

.dark {
  --pv-surface: #0f172a;
  --pv-surface-alt: #1e293b;
  --pv-text: #e2e8f0;
  --pv-text-secondary: #94a3b8;
  --p-border: #334155;
  --pv-primary: #60a5fa;
}
```

### 8.2 Tailwind-Konfiguration
- **Erweiterung:** Custom Farben im `tailwind.config.ts` für Brand-Konsistenz
- **Dark Mode:** `class`-basiert (`dark:`-Präfix)
- **Zustandsklassen:** `hover:`, `focus:`, `active:` konsistent über alle Komponenten

---

## 9. Komponenten-Konventionen

### 9.1 Benennung
- **Dateien:** `PascalCase.vue` (z.B. `ReportEditor.vue`, `SkillMatrix.vue`)
- **Komponenten:** `PascalCase` mit Prefix nach Bereich (z.B. `ReportStatusBar`, `SkillTreeTable`)
- **Composables:** `use`-Präfix (z.B. `useAuthStore`, `useReportStore`)

### 9.2 Structure
```vue
<script setup lang="ts">
// 1. Imports
// 2. Props / Defines
// 3. Composables (Stores, VueUse)
// 4. Watch / Effects
// 5. Methods
</script>

<template>
  <!-- 1. Root-Element -->
  <!-- 2. Loading Skeleton / Empty State -->
  <!-- 3. Main Content -->
  <!-- 4. Overlays / Modals -->
  <!-- 5. Toast / ConfirmDialog (Teleport) -->
</template>
```

### 9.3 PrimeVue-Regeln
- **Immer:** `unstyled`-Modus nutzen; eigenes Tailwind-CSS
- **Nie:** Inline-Styles für Layout (`style`-Attribut nur für einmalige, dynamische Werte)
- **Immer:** `v-model` für zwei-Wege-Datenbindung bei PrimeVue-Komponenten
- **Sekundär:** `@update:modelValue` für explizite Event-Handling
- **Immer:** `aria-*` Attribute bei eigenen Komponenten-Wrappern

---

## 10. Qualitätssicherung

### 10.1 Design-Review-Checkliste
- [ ] Alle Interaktionen haben Loading- und Error-States
- [ ] Focus-Ringe sichtbar bei allen interaktiven Elementen
- [ ] Dark Mode getestet (kein bg-slate-900 mit dunklem Text)
- [ ] Mobile-Responsive auf 3 Breakpoints getestet
- [ ] ARIA-Labels vorhanden für komplexe Komponenten
- [ ] ConfirmDialog vor allen destruktiven Aktionen
- [ ] Toast nach erfolgreichen Aktionen (3000ms)
- [ ] Keyboard-Shortcuts implementiert und getestet

### 10.2 Testing
- **Unit-Tests:** `vitest` für Composables und Store-Logik
- **E2E-Tests:** `Playwright` für kritische User Journeys (Berichtseinreichung, Batch-Freigabe)
- **Accessibility:** `axe-core` Integration in Playwright-Tests
- **Visual Regression:** Optional bei größeren UI-Änderungen

### 10.3 Linting
- `oxlint` für Code-Qualität
- Keine `!important` in Tailwind-Klassen
- Konsistente PrimeVue-Imports (keine Wildcard-Imports)
