---
name: Dark & Light Mode — Immer Prüfen
description: Dark- und Light-Modus muss immer funktionieren. Bei jeder Code-Generierung, jedem Review und jeder UI-Änderung den Theme-Modus überprüfen. Immer erzwungen.
globs:
  - "**/*.vue"
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/*.ts"
  - "**/*.js"
  - "**/*.css"
  - "**/*.scss"
  - "**/*.html"
  - "**/tailwind.config.*"
  - "**/primevue.config.*"
  - "src/**/*"
  - "frontend/**/*"
  - "components/**/*"
  - "views/**/*"
  - "pages/**/*"
  - "layouts/**/*"
  - "styles/**/*"
  - "assets/**/*"
---

# Dark & Light Mode — Immer Prüfen

Diese Regeln sind **immer erzwungen** — bei jeder Code-Generierung, jedem Review und jeder UI-Änderung. Der Dark- und Light-Modus muss stets funktionieren und visuell korrekt sein.

## 1. Grundregel

> **Jede Änderung, die Farbe, Hintergrund, Text oder Border betrifft, muss in beiden Modi (Dark + Light) funktionieren.**

- Kein Element darf im Dark Mode unsichtbar, falsch kontrastiert oder kaputt sein.
- Kein Element darf im Light Mode untergehen oder falsch lesbar sein.
- Immer beide Modi testen, bevor Code als fertig gilt.

## 2. Vor jedem Commit — Dark/Light Mode Check

Folgende Checkliste muss **immer** abgearbeitet werden:

### 2.1 Hintergrund & Text
- [ ] Alle `bg-*` Klassen haben ein `dark:`-Pendant
- [ ] Alle `text-*` Klassen haben ein `dark:`-Pendant
- [ ] Alle `border-*` Klassen haben ein `dark:`-Pendant
- [ ] Keine `bg-slate-900` mit dunklem Text (oder umgekehrt)
- [ ] Kontrastverhältnis mindestens WCAG AA (4.5:1 für Normaltext)

### 2.2 PrimeVue Komponenten
- [ ] PrimeVue PT-Props (`pt`-Prop) haben Dark-Mode-Klassen
- [ ] `primevue.config.js` Unstyled Mode + korrektes Theme-Preset konfiguriert
- [ ] DataTable, Card, Button, Input alle im Dark Mode lesbar
- [ ] OverlayPanel, Dialog, Toast im Dark Mode korrekt sichtbar

### 2.3 CSS-Variablen & Design-Tokens
- [ ] `:root` und `.dark` Selektor definiert
- [ ] Alle CSS-Variablen haben Dark-Mode-Werte
- [ ] PrimeVue Design-Tokens (`--pv-*`) für Dark Mode angepasst
- [ ] Keine hartkodierten Farben ohne Dark-Mode-Pendant

### 2.4 Tailwind Konfiguration
- [ ] `tailwind.config.ts` hat `darkMode: 'class'` konfiguriert
- [ ] Brand-Farben haben Dark-Mode-Pendants (z.B. `purple-600` → `purple-400`)
- [ ] Semantic Colors (success, warning, error, info) haben Dark-Varianten
- [ ] Keine `!important` in Dark-Mode-Klassen

## 3. Must-Have Pattern

Jede Komponente mit Farbe muss dieses Pattern folgen:

```vue
<!-- Korrektes Pattern -->
<div class="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700">
  <!-- Inhalt -->
</div>
```

**Falsches Pattern (nicht akzeptiert):**
```vue
<!-- Fehler: Kein Dark-Mode-Pendant -->
<div class="bg-white text-slate-800">
  <!-- Inhalt -->
</div>
```

## 4. Theme-Steuerung

- **Strategie:** Tailwind `class`-Strategie (`darkMode: 'class'` in `tailwind.config.ts`)
- **Steuerung:** Pinia `useUiStore` toggelt die Klasse `dark` auf `document.documentElement`
- **Persistence:** `theme` Zustand in `localStorage` persistieren
- **System-Override:** `prefers-color-scheme` als Fallback beachten

```ts
// useUiStore — Theme-Verwaltung
export const useUiStore = defineStore('ui', {
  state: () => ({
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  }),
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', this.theme === 'dark')
      localStorage.setItem('theme', this.theme)
    },
  },
})
```

## 5. Dark Mode Validierung — Automatisch Prüfen

Bei jeder Code-Generierung oder Änderung:

1. **Vue/TSX/JSX Komponenten:** Alle Klassen mit Farbe auf `dark:`-Pendant prüfen
2. **CSS/SCSS Dateien:** `:root` und `.dark` Selektor auf vollständige Werte prüfen
3. **Tailwind Config:** `darkMode: 'class'` und Farb-Pendants verifizieren
4. **PrimeVue Config:** `unstyled: true` und PT-Props auf Dark Mode prüfen
5. **Store:** `useUiStore` hat korrekten Theme-State und localStorage-Persistenz

## 6. Verbote

- **Kein** Code, der nur im Light Mode funktioniert und im Dark Mode kaputt ist
- **Kein** `bg-slate-900` mit `text-slate-800` (oder andere kontrastierte Kombinationen ohne Dark-Pendant)
- **Kein** Hartcoding von Farben ohne Dark-Mode-Alternative
- **Kein** `!important` zum Überschreiben von Dark-Mode-Styles
- **Kein** Dark Mode nur über CSS-Media-Query ohne `class`-Strategie
- **Keine** `bg-gray-*` ohne `dark:bg-*` Pendant in Komponenten

## 7. Output-Direktive

- Bei jeder Generierung von UI-Code: **Immer** beide Modi (Light + Dark) im Output zeigen oder validieren
- Bei Fehlern im Dark Mode: Sofort korrigieren und den korrekten Dark-Mode-Code ausgeben
- Kurz, prägnant und technisch auf vorgenommene Dark/Light-Mode-Anpassungen hinweisen
