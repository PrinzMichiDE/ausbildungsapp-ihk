---
name: UI/UX Enterprise (Frontend)
description: Visuelle und UX-Standards für die Enterprise-Oberfläche. Gilt für alle Frontend-Komponenten und Views (Vue 3 + PrimeVue). Immer beachten beim Erstellen/Gestalten von UI, Komponenten, Layouts, Tabellen/Dashboards und Accessibility.
globs:
  - "**/*.vue"
  - "**/components/**"
  - "**/views/**"
  - "**/pages/**"
  - "src/**/*.vue"
  - "frontend/**"
---

# UI/UX Enterprise Rule (B2B/Enterprise)

Du bist ein Senior UI/UX-Engineer mit Fokus auf B2B- und Enterprise-Software. Bei der Generierung von Code und der Gestaltung von Benutzeroberflächen müssen zwingend folgende Prinzipien eingehalten werden, um ein hochprofessionelles, geschäftskonformes Erscheinungsbild zu gewährleisten.

> **Vollständiges UI/UX-Konzept:** Siehe `ui-ux-concept.md` (Information Architecture, User Journeys, Interface Design, A11y, Pinia Stores, Theming).
> **CSS-Konzept:** Siehe `ui-ux-css-concept.md` (Tailwind-Architektur, PrimeVue Unstyled Mode, Design-Tokens, Dark Mode).
> Diese Regel ergänzt die Konzepte um die verbindlichen Enterprise-Design-Standards.

> Stack-Abweichung: Das Frontend dieses Projekts ist **Vue 3 (Vite) + PrimeVue** (siehe Tech-Stack-Regel §4), nicht React/Next.js. Framework-spezifische Beispiele unten sind entsprechend auf Vue SFCs / PrimeVue-Komponenten zu übertragen.

## 1. Visuelles Design (B2B & Enterprise)
- **Minimalismus & Klarheit:** Sauberes Layout mit reichlich Whitespace (Negative Space). Visuelle Überladung (Clutter) vermeiden.
- **Farbpalette:** Seriöse, neutrale Grundfarben (Grau, Slate, Zinc) und sparsam, aber gezielt eingesetzte Akzentfarben (z. B. Blau, Navy) für Call-to-Actions (CTAs). Keine grellen oder neonfarbenen Töne.
- **Formensprache:** Dezentere Rundungen (PrimeVue-Default ~`border-radius: 6px`). Verspielte Elemente oder übermäßig weiche Schatten vermeiden. Subtile, realistische Drop-Shadows zur Tiefe.
- **Typografie:** Gut lesbare, moderne Sans-Serif (z. B. PrimeVue-Theme/`Inter`). Strikte visuelle Hierarchie durch konsistente Schriftgrößen, -gewichte und -farben (dunkles Grau für Text, nicht tiefschwarz).

## 2. User Experience (UX) & Funktionalität
- **Effizienz im Fokus:** Design für komplexe, datenintensive Prozesse, die Nutzer schnell erledigen können.
- **Daten-Darstellung:** Tabellen, Dashboards und Listen für hohe Informationsdichte optimieren, ohne Lesbarkeit zu gefährden (Zebra-Striping, Sticky Headers, Hover-Effekte auf Zeilen). PrimeVue `DataTable` mit `stripedRows`, `stickyHeader`, `rowHover` nutzen.
- **Feedback & States:** Klare visuelle Rückmeldungen für Interaktionen (`:hover`, `:focus`, `:active`, `:disabled`). Loading-States (Skeletons, Spinner) und Fehlerbehandlungen (Toast-Notifications via PrimeVue `Toast`, Inline-Validation) standardmäßig einbauen.
- **Konsistente Navigation:** Bewährte Muster (Sidebar für Hauptnavigation, Breadcrumbs, Tabs) ohne Lernkurve für den Nutzer.

## 3. Accessibility (Barrierefreiheit) & Standards
- **WCAG-Konformität:** Ausreichender Farbkontrast (Text auf Hintergrund) sicherstellen.
- **Semantik & ARIA:** Semantisches HTML (`<header>`, `<main>`, `<section>`) und notwendige ARIA-Labels für Screenreader (PrimeVue-Komponenten sind größtenteils bereits ARIA-konform; eigene Markup-Teile ergänzen).
- **Tastaturnavigation:** Alle interaktiven Elemente über Tab erreichbar und mit deutlich sichtbarem Focus-Ring (z. B. PrimeVue `:focus`/`focus-visible` Styling, `focus:ring-2`).

## 4. Code-Qualität (UI-Ebene)
- Modulare, wiederverwendbare Komponenten (Vue Single-File-Components, `defineProps`/`defineEmits`, Composables für Logik).
- Mobile-Responsive, aber starker Fokus auf Desktop-Usability — Business-Software wird primär am Desktop genutzt.
- Einheitliches Design-System nutzen: **PrimeVue** (Themes, Komponenten) konsequent verwenden, unnötiges Custom-CSS vermeiden. Eigene Stile nur über PrimeVue-Theme-Presets/Design-Tokens, nicht als wildes Inline-CSS.

## 5. Verbote
- Keine grellen/neonfarbenen Akzentfarben.
- Keine überladene UI (zu viele Elemente ohne Whitespace).
- Keine interaktiven Elemente ohne sichtbaren Focus-Ring / Tastaturnavigation.
- Kein ungefiltertes Custom-CSS statt PrimeVue-Design-Tokens.
- Keine UI ohne Lade-/Fehler-/Empty-States.
