---
name: UI/UX & Accessibility Standards
description: A11y, Semantisches HTML, Performance, Optimistic UI, State-Management, Responsive, Design-Tokens, Micro-Interactions — immer erzwungen.
globs:
  - "**/*.vue"
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/*.ts"
  - "**/*.js"
  - "**/*.css"
  - "**/*.scss"
  - "**/*.html"
  - "**/*.svelte"
  - "src/**/*"
  - "components/**/*"
  - "views/**/*"
  - "pages/**/*"
  - "layouts/**/*"
  - "assets/**/*"
  - "styles/**/*"
---

# UI/UX & Accessibility Standards

Diese Regeln sind **immer erzwungen** — bei jeder Frontend-Generierung, jedem Review und jeder UI-Änderung.

## 11. Accessibility (Barrierefreiheit) als Standard

### 11.1 Semantisches HTML

- Korrekte HTML5-Tags verwenden: `<button>` statt `<div onClick>`, `<nav>`, `<article>`, `<main>`, `<header>`, `<footer>`, `<section>`.
- Interaktive Elemente müssen als solche erkennbar sein — kein `<span onClick>`.
- Listen (`<ul>`, `<ol>`) für Navigationsmenüs, `<table>` für tabellarische Daten.
- Formularfelder mit zugehörigen `<label>`-Elementen verknüpfen.

### 11.2 Tastaturbedienbarkeit

- Gesamtes UI muss **ohne Maus bedienbar** sein.
- Klare und sichtbare Fokus-State mit `:focus-visible` (nicht `:focus`, der auch bei Mausklick erscheint).
- Bei Modal-Dialogen: **Focus Trapping** implementieren (Fokus rotiert innerhalb des Modals, Escape schließt).
- Skip-Links für Long-Page-Navigation (`<a href="#main-content" class="sr-only focus:not-sr-only">`).
- Logische Tab-Reihenfolge über `tabindex` (nur `0` oder `-1`, keine positiven Werte).

```css
/* Sichtbarer Fokus für Tastaturnutzer */
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* Fokus-Overlay für Custom-Buttons */
button:focus-visible {
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}
```

### 11.3 ARIA & Screenreader

- Fehlenden Kontext für Screenreader durch `aria-labels`, `aria-hidden`, `aria-expanded`, `aria-live` ergänzen.
- Icons ohne begleitenden Text: `aria-label` oder `aria-hidden="true"` + visuell versteckter Text.
- Dynamische Inhalte: `aria-live="polite"` für Toasts/Status-Updates, `aria-live="assertive"` für kritische Fehler.
- Komplexe Widgets (Dropdowns, Tabs, Accordions) mit ARIA-Rollen und -States unterstützen.
- Kein `aria-hidden="true"` auf fokussierbaren Elementen.

## 12. Perceived Performance & Optimistic UI

### 12.1 Ladezustände

- Weiße Bildschirme vermeiden: **Skeleton-Loader** oder Shimmer-Effekte statt generischer Lade-Spinner.
- Skeletons müssen das finale Layout abbilden (korrekte Breite/Höhe/Position).
- progressive Bildanzeige mit `loading="lazy"` und `decoding="async"`.
- Skeletons mit reduzierter Transparenz, um nicht mit echtem Content verwechselt zu werden.

### 12.2 Optimistic Updates

- UI reagiert **sofort** auf Nutzeraktionen (Like-Button direkt aktiv, Text sofort eingeblendet).
- API-Call läuft im Hintergrund.
- Bei Fehlern: unauffälliger Rollback mit Toast-Notification.
- Loading-Indikator nur bei langen Operationen (>500ms), nicht bei schnellen Updates.

```ts
// Optimistic Update mit Rollback
async function toggleLike(postId: string) {
  const previousState = this.post.likes;

  // Sofort aktualisieren
  this.post = { ...this.post, isLiked: !this.post.isLiked, likes: previousState + 1 };

  try {
    await this.api.toggleLike(postId);
  } catch {
    // Rollback
    this.post = { ...this.post, isLiked: this.post.isLiked, likes: previousState };
    this.toast.error('Like could not be saved');
  }
}
```

### 12.3 Keine Layout-Sprünge (CLS)

- Platz für Bilder, Ads und asynchron geladene Komponenten **im Vorfeld** reservieren.
- `aspect-ratio`, `min-height`, `min-width` für dynamische Container verwenden.
- Schriftgrößen nicht ändern, bis der Font geladen ist (`font-display: swap`).
- Lazy-loaded Inhalte mit festem Platzhalter (`<img width="..." height="...">`).

## 13. Lückenloses UI-State-Management

### 13.1 Die 4 essenziellen Zustände

Für **jede** Datenkomponente alle vier Zustände implementieren:

| Zustand | Beschreibung | UI-Muster |
|---------|-------------|-----------|
| **Loading** | Daten werden geladen | Skeleton, Spinner |
| **Empty** | Keine Daten vorhanden | Empty State mit Handlungsaufforderung |
| **Error** | Fehler beim Laden | Error State mit Retry-Button |
| **Success** | Daten vorhanden | Normaler Content |

```vue
<template>
  <div>
    <Skeleton v-if="loading" />
    <EmptyState v-else-if="!items.length" message="No items found" />
    <ErrorState v-else-if="error" :error="error" @retry="load" />
    <ItemList v-else :items="items" />
  </div>
</template>
```

### 13.2 Rage-Click-Prävention

- Buttons beim Klick **deaktivieren** (`disabled`) und Ladeindikator anzeigen.
- Doppelte Formularabsendungen und API-Calls verhindern.
- Bei langen Operationen: Button-Text durch Spinner ersetzen, aber Button-Größe beibehalten.

### 13.3 Nutzerzentrierte Fehler

- **Niemals** technische Stack-Traces im UI anzeigen.
- Inline-Validierung direkt an Input-Feldern (Fehlermeldung unterhalb des Felds).
- Unaufdringliche Toast-Notifications für systemweite Meldungen (unten rechts, automatischer Close).
- Fehlermeldungen verständlich und handlungsorientiert formulieren: "Please enter a valid email" statt "Error 422".

## 14. Responsive & Mobile-First Architektur

### 14.1 Progressive Enhancement

- Styling immer bei der **kleinsten Bildschirmgröße** beginnen (Mobile-First).
- Komplexität über Media-Queries (`min-width`) für größere Viewports hinzufügen.
- Breakpoints an Inhalt orientieren, nicht an Geräten (`640px`, `768px`, `1024px`, `1280px`).

```css
/* Mobile-First */
.container { padding: 1rem; }

/* Tablet */
@media (min-width: 640px) {
  .container { padding: 2rem; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { padding: 4rem; }
}
```

### 14.2 Touch-Ergonomie

- Interaktive Elemente: **Mindestens 44×44 CSS-Pixel** Touch-Target-Größe.
- Ausreichender Abstand zwischen interaktiven Elementen (mindestens 8px).
- Keine eng beieinanderliegenden Touch-Targets ohne Abstand.

### 14.3 Safe Areas & Orientierung

- System-UI-Überlagerungen beachten: `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`.
- iPhone Notch, Home-Indikator, Android Navigation Bar berücksichtigen.
- UI muss im Portrait- **und** Landscape-Modus nutzbar bleiben.
- `viewport-fit=cover` in Meta-Tag für notch-fähige Geräte.

## 15. Design-Systeme & Styling-Konsistenz

### 15.1 Design Tokens (Keine Magic Numbers)

- Für Abstände, Farben, Schriftgrößen, Radien ausschließlich **vordefinierte Variablen** verwenden.
- CSS Custom Properties oder Framework-Tokens (Tailwind, etc.) nutzen.
- **Keine** hartkodierten Werte wie `margin-top: 17px`, `color: #3a7bd5`.

```css
/* Schlecht */
.card { margin-top: 17px; color: #3a7bd5; border-radius: 4px; }

/* Gut */
.card { margin-top: var(--spacing-md); color: var(--color-primary); border-radius: var(--radius-md); }
```

### 15.2 DRY im UI

- Wiederkehrende UI-Muster (Cards, Modals, Form-Groups, Buttons) in **wiederverwendbare, isolierte Komponenten** extrahieren.
- Kein Copy-Paste von Markup an verschiedenen Stellen.
- Komponenten-API konsistent gestalten (gleiche Props, gleiche Events).

## 16. Micro-Interactions & Performance im Frontend

### 16.1 Subtiles Feedback

- Weiche und schnelle CSS-Transitions für Hover-, Active- und State-Änderungen.
- Dauer: **max. 150–300ms** — das Interface muss organisch und reaktionsschnell wirken.
- `transition` auf `transform` und `opacity` beschränken (siehe 16.3).

```css
/* Gut — schnelle, subtile Transition */
button {
  transition: transform 150ms ease, opacity 150ms ease;
}
button:hover { transform: translateY(-1px); }
button:active { transform: translateY(0); }
```

### 16.2 Debouncing & Throttling

- Auslöserrate bei hochfrequenten Events begrenzen: Scroll, Resize, Search-Inputs (Typahead).
- **Debounce** bei Input-Validierung (300ms), **Throttle** bei Scroll-Events (16ms = 60fps).
- Ruckeln und unnötige Re-Renders verhindern.

```ts
// Debounce für Search-Input
const debouncedSearch = debounce((query: string) => {
  this.searchResults = await this.api.search(query);
}, 300);
```

### 16.3 Hardware-Beschleunigung

- Ausschließlich `transform` und `opacity` animieren.
- Teure Layout-Neu-Berechnungen (Repaints/Reflows) durch den Browser vermeiden.
- `will-change` nur bei Bedarf setzen (nicht präventiv auf alles).
- Keine Animation von `width`, `height`, `top`, `left`, `margin`, `padding` — das löst Layout-Recalcs aus.

```css
/* Schlecht — triggert Repaints */
.animated { transition: width 300ms, height 300ms; }

/* Gut — hardware-beschleunigt */
.animated { transition: transform 300ms ease; }
.animated:hover { transform: scale(1.05); }
```
