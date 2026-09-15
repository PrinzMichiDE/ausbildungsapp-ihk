---
name: UI/UX CSS-Konzept (Frontend)
description: CSS-Architektur und Styling-Konventionen für die NextGen IT-Ausbildung Plattform. Gilt für alle Styling-Entscheidungen, Tailwind-Konfiguration und PrimeVue-Integration (Vue 3 + PrimeVue 4 + Tailwind CSS).
globs:
  - "**/*.vue"
  - "**/components/**"
  - "**/views/**"
  - "**/pages/**"
  - "**/tailwind.config.*"
  - "**/index.css"
  - "src/**/*.vue"
  - "frontend/**"
---

# CSS-Konzept — NextGen IT-Ausbildung

**Projekt:** Ada — Ausbildungsplattform
**Technologie-Stack:** Vue 3 (Composition API), PrimeVue 4 (Unstyled Modus), Tailwind CSS

---

## 1. Architektur & Methodik

### 1.1 Utility-First-Ansatz
- **Prinzip:** Nahezu vollständiger Verzicht auf klassische `.css`- oder `.scss`-Dateien
- **Umsetzung:** Styling erfolgt direkt im Template der Vue Single File Components (SFCs) über Tailwind-Utility-Klassen
- **Ausnahme:** Ein einzige globaler Stylesheet-Einstieg (`src/assets/css/index.css`) für Reset, Font-Imports und CSS-Variable-Definitionen
- **Keine:** Dedicated `.css`-Dateien pro Komponente oder Modul

### 1.2 Komponenten-Kapselung statt @apply
- **Verbot:** Kein `@apply` in globalen Stylesheets zur Erstellung von "Monster-Klassen"
- **Prinzip:** Wiederkehrende UI-Muster (spezielle Buttons, Cards, Badges) werden als **eigene Vue-Komponenten** ausgelagert
- **Beispiele:**
  - `AppButton.vue` — kapselt Primary/Secondary/Danger-Varianten mit festem Tailwind-Setup
  - `AppCard.vue` — kapselt Shadow, Border, Padding, Radius für konsistente Karten
  - `AppBadge.vue` — kapselt Farbvarianten für Status (Success, Warning, Error, Info)
- **Vorteil:** Änderungen an einem Muster erfolgen an einer Stelle; Tailwind-Classes bleiben im Template lesbar

### 1.3 Scoped CSS (Ausnahme)
- **Nur erlaubt:** Für seltene, hochspezifische Animationen oder komplexe Grid-Layouts, die sich mit Tailwind schwer lesen lassen
- **Syntax:** `<style scoped>` in der Vue-SFC
- **Beispiele:**
  - Keyframe-Animationen für Skeleton-Loading-Effekte
  - Komplexe CSS-Grid-Layouts für den Berichtsheft-Editor
  - Spezielle Pseudo-Elemente (z.B. `::after` für visuelle Hinweise)
- **Regel:** Scoped CSS muss immer einen klaren Kommentar enthalten, der den Grund nennt (`/* Warum nicht Tailwind? */`)

---

## 2. PrimeVue Integration (Unstyled Mode)

### 2.1 Pass-Through (PT) Architektur
- **Modus:** PrimeVue 4 wird zwingend im **Unstyled Mode** konfiguriert (`primevue.config.js`: `unstyled: true`)
- **Prinzip:** PrimeVue liefert nur die Logik und Funktionalität (A11y, State-Management, Event-Handling)
- **Styling:** Das visuelle Erscheinungsbild wird über ein globales Tailwind-Preset injiziert (z.B. basierend auf **Aura** oder **Lara** Preset)
- **Vorteil:** Volle Kontrolle über jedes DOM-Element via Tailwind; kein Kampf mit PrimeVue-Default-Styles

### 2.2 Granulare Überschreibungen via PT-Props
- **Mechanismus:** Das `pt`-Prop (Pass-Through) wird genutzt, um Tailwind-Klassen direkt an interne DOM-Elemente einer PrimeVue-Komponente zu übergeben
- **Syntax:**

```vue
<DataTable
  :pt="{
    root: { class: 'border border-slate-200 rounded-lg' },
    header: { class: 'bg-slate-50 dark:bg-slate-800' },
    tbody: { class: 'divide-y divide-slate-100 dark:divide-slate-700' }
  }"
/>
```

- **Regeln:**
  - Globale PT-Konfiguration in `primevue.config.js` für Basis-Styles aller Instanzen
  - Lokale PT-Overrides in Components nur für kontextspezifische Abweichungen
  - Niemals `!important` in PT-Klassen; Tailwind-Spezifität nutzen

### 2.3 Globale PT-Konfiguration (primevue.config.js)

```js
import Aura from '@primevue/themes/aura';

export default {
  unstyled: true,
  theme: {
    preset: Aura,
    options: {
      cssVarPrefix: 'pv'
    }
  },
  pt: {
    Button: {
      root: { class: 'font-medium rounded-lg transition-colors duration-200' }
    },
    Card: {
      root: { class: 'rounded-xl shadow-sm border border-slate-200 dark:border-slate-700' }
    }
  }
};
```

---

## 3. Design-Tokens & Variablen

### 3.1 Zentrale tailwind.config.js
- **Single Source of Truth:** Alle Design-Entscheidungen werden in `tailwind.config.ts` definiert
- **Ziel:** Magic Numbers im Code eliminieren; konsistente Werte über das gesamte Projekt
- **Struktur:**

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}', './frontend/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9'
        },
        semantic: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace']
      },
      borderRadius: {
        DEFAULT: '6px',
        lg: '8px',
        xl: '12px'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      }
    }
  },
  plugins: []
} satisfies Config;
```

### 3.2 Marken- und Semantik-Farben

| Kategorie | Farbe | Verwendung |
|---|---|---|
| **Brand** | `purple-600` (#7c3aed) | Primäre CTAs, Active States, Brand-Elemente |
| **Brand Hell (Dark)** | `purple-400` (#a78bfa) | Brand-Elemente im Dark Mode |
| **Success** | `emerald-500` (#10b981) | Freigegebene Berichtshefte, Bestätigungen |
| **Warning** | `amber-500` (#f59e0b) | Bald ablaufende Fristen, ungelesene Benachrichtigungen |
| **Error** | `red-500` (#ef4444) | Validierungsfehler, abgelehnte Aktionen |
| **Info** | `blue-500` (#3b82f6) | Informationen, Loadings, Links |

**Farbpalette-Regeln:**
- Keine beliebigen Tailwind-Farben verwenden; nur definierte Palette
- Für States immer semantische Farben nutzen (nicht `gray` für Success)
- Dark-Mode-Pendants für jede Farbe definieren (siehe §4)

### 3.3 Typografie-System

| Einsatz | Schriftart | Fallback |
|---|---|---|
| UI / Fließtext | Inter | system-ui, -apple-system, sans-serif |
| Code (Editor, Snippets) | Fira Code | JetBrains Mono, monospace |
| Tabellarische Daten | Inter | system-ui, sans-serif |

- **Base Size:** `text-base` (16px) — verhindert iOS-Zoom bei Eingabefeldern
- **Editor Code:** `font-mono text-sm` für Code-Blöcke im Berichtsheft-Editor
- **Headings:** Hierarchisch von `text-2xl` (H1) bis `text-sm` (Unterüberschriften)
- **Zeilenabstand:** `leading-relaxed` (1.625) für Fließtext, `leading-snug` für Tabellen

### 3.4 CSS-Variablen-Fallback

Falls needed für Legacy-Kompatibilität oder Drittanbieter-Integrationen:

```css
:root {
  --pv-primary: #7c3aed;
  --pv-surface: #ffffff;
  --pv-text: #1e293b;
}

.dark {
  --pv-primary: #a78bfa;
  --pv-surface: #0f172a;
  --pv-text: #e2e8f0;
}
```

---

## 4. Responsive Design & Dark Mode

### 4.1 Mobile-First-Breakpoints

- **Grundregel:** Basis-Klassen definieren immer die mobile Ansicht
- **Erweiterung:** Breakpoints `md:` (Tablet, ≥768px) und `lg:` (Desktop, ≥1024px) für Layout-Erweiterung
- **Syntax-Beispiel:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

**Breakpoint-Referenz:**

| Breakpoint | Wert | Einsatz |
|---|---|---|
| `sm:` | ≥640px | Kleine Anpassungen (z.B. Inline-Formulare) |
| `md:` | ≥768px | Tablet-Layout (2-Spalten-Grid, Side-by-Side Panels) |
| `lg:` | ≥1024px | Desktop-Layout (volle Sidebar, breite Tabellen) |
| `xl:` | ≥1280px | Große Desktop-Bildschirme (maximale Container-Breite) |

- **Verbot:** `lg:`-Klassen ohne vorherige Basis-Klasse; immer mobile-first

### 4.2 Systematischer Dark Mode

- **Strategie:** Tailwind `class`-Strategie (`darkMode: 'class'` in `tailwind.config.ts`)
- **Steuerung:** Pinia `useUiStore` toggelt die Klasse `dark` auf `document.documentElement`
- **Regel:** Jede farbgebende Klasse **braucht** ein `dark:`-Pendant

**Must-have Pattern:**

```vue
<div class="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700">
  <!-- Inhalt -->
</div>
```

**Dark Mode-Validierungs-Checkliste:**
- [ ] Hintergrundfarben haben `dark:`-Pendant (`bg-white` → `dark:bg-slate-900`)
- [ ] Textfarben haben `dark:`-Pendant (`text-slate-800` → `dark:text-slate-100`)
- [ ] Border-Farben haben `dark:`-Pendant (`border-slate-200` → `dark:border-slate-700`)
- [ ] Brand-Farben angepasst (`purple-600` → `purple-400` für Kontrast)
- [ ] Keine `bg-slate-900` mit dunklem Text (verhindert)
- [ ] PrimeVue PT-Klassen haben Dark-Mode-Klassen

### 4.3 Container-Queries (Erweitert)
- **Für Komponenten:** `@container` queries für unabhängige Responsive-Verhaltensweisen
- **Einsatz:** Cards im Dashboard, die sich basierend auf ihrer Grid-Zelle anpassen
- **Fallback:** Tailwind-Breakpoints als Basis

---

## 5. Datei-Struktur & Globale Styles

### 5.1 CSS/Einrichtung

```
src/
├── assets/
│   └── css/
│       ├── index.css          # Reset, Font-Imports, CSS-Variablen
│       └── components.css     # Optionale Tailwind @layer-Komponenten
prisma/
tailwind.config.ts
postcss.config.js
```

### 5.2 index.css (Minimal)

```css
@import "inter-sans";
@import "fira-code";

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scroll-smooth;
  }

  body {
    @apply bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 antialiased;
  }

  /* Verhindert Scrollbar-Overlap bei DataTable */
  ::-webkit-scrollbar {
    @apply w-2 h-2;
  }

  ::-webkit-scrollbar-track {
    @apply bg-transparent;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-slate-300 dark:bg-slate-600 rounded-full;
  }
}
```

### 5.3 components.css (Optional)

```css
@layer components {
  /* Nur hier, wenn ein Pattern wirklich @apply braucht (selten) */
  /* Bevorzugt: eigene Vue-Komponente */
}
```

---

## 6. Performance-Optimierung

### 6.1 Tailwind Purge
- **Content-Scan:** `tailwind.config.ts` scannt exakt alle Vue-Dateien (kein überflüssiger Dead-CSS)
- **Safelist:** Statische Klassen, die dynamisch generiert werden (z.B. `text-${color}-500`), in `safelist` aufnehmen
- **Unstyled Mode:** Reduziert PrimeVue-CSS-Bundle-Größe auf nahezu Null

### 6.2 Style-Effizienz
- **Kein** unnötiges `!important` — Tailwind-Spezifität ausreichen lassen
- **Kein** globales CSS mit hoher Spezifität — blockiert nicht PrimeVue PT-Overrides
- **Kernelselektoren** bevorzugen statt tief verschachtelter Regeln
- **`@layer`** nutzen für explizite Cascade-Ordnung (base → components → utilities)

### 6.3 Font-Loading
- **Inter:** `font-display: swap` für schnelles Rendering ohne FOIT
- **Fira Code:** Nur auf Code-Seiten laden (lazy via `font-display`)
- **Preload:** Kritische Font-Weights (`400`, `500`, `600`) im `<head>` preloaden

---

## 7. Linting & Konventionen

### 7.1 Regeln
- **Oxlint:** Keine `!important` in Tailwind-Klassen erlauben (Ausnahme für PT-Overrides)
- **Prettier:** Konsistentes Indenting (2 Spaces), keine trailing Semicolons im HTML
- **Klasse-Reihenfolge:** Tailwind-Utilities in konsistenter Reihenfolge:
  1. Layout (`flex`, `grid`, `w-`, `h-`, `p-`, `m-`)
  2. Typografie (`text-`, `font-`, `leading-`, `tracking-`)
  3. Farben (`bg-`, `text-`, `border-`, `decoration-`)
  4. Effekte (`shadow-`, `rounded-`, `transition-`, `duration-`)
  5. Zustände (`hover:`, `focus:`, `dark:`, `disabled:`)
  6. Sonstiges (`select-`, `cursor-`, `overflow-`, `container`)

### 7.2 Verbot
- Keine `.css`-Dateien neben Vue-Komponenten (es sei denn als `*.module.css` für seltene Scoped-Styles)
- Kein `@apply` für häufig verwendete Patterns (→ eigene Komponente)
- Keine dynamischen Tailwind-Klassen-Strings ohne `safelist`
- Keine Hex-Farben direkt im Template; immer über Tailwind-Utility oder CSS-Variable

---

## 8. Qualitätssicherung

### 8.1 CSS-Review-Checkliste
- [ ] Alle Farben haben `dark:`-Pendants
- [ ] Keine Hex-Farben im Template (Tailwind-Utilities)
- [ ] `@apply` nur in `components.css` mit Kommentar
- [ ] PrimeVue-Komponenten nutzen Unstyled Mode + PT-Props
- [ ] Font-Loading optimiert (`font-display: swap`)
- [ ] Breakpoints mobile-first (`base:` zuerst, dann `md:`, `lg:`)
- [ ] Klasse-Reihenfolge konsequent (Layout → Typografie → Farben → Effekte → States)
- [ ] Keine `!important` ohne Dokumentation

### 8.2 Visual Regression Testing
- **Bei größeren UI-Änderungen:** Screenshot-Vergleich der kritischen Views
- **Dark Mode:** Immer beide Themes (Light + Dark) auf allen Views testen
- **Responsive:** Mindestens 3 Breakpoints pro View testen (sm, md, lg)
