---
name: professionelles-design
description: Regeln und Richtlinien für professionelles UI/UX-Design und Layout. Use when generating or modifying UI components, web pages, layouts, CSS, or frontend interfaces.
---

# OpenCode Rule: Professionelles Design & Layout

Verwende diese Prinzipien bei der Generierung und Anpassung von UI-Komponenten, Webseiten und Layouts, um ein modernes, professionelles und nutzerfreundliches Erscheinungsbild sicherzustellen.

## 1. Layout & Struktur (Whitespace & Grid)
- **Konsistentes Spacing:** Verwende ein striktes Abstands-System (meist auf Basis von 4px oder 8px), z. B. 8px, 16px, 24px, 32px, 64px für Margins und Paddings.
- **Weißraum (Whitespace):** Nutze großzügigen Whitespace, um Elemente voneinander zu trennen und kognitive Überlastung beim Nutzer zu vermeiden.
- **Responsive Design:** Gestalte nach dem *Mobile First*-Prinzip. Nutze CSS Flexbox und Grid für flexible, anpassungsfähige Layouts, die auf allen Bildschirmgrößen sauber skalieren.
- **Visuelle Hierarchie:** Wichtige Elemente müssen durch Größe, Platzierung oder Farbe sofort ins Auge fallen.

## 2. Typografie
- **Klare Struktur:** Setze semantische HTML-Tags (`<h1>` bis `<h6>`, `<p>`) für eine logische Gliederung ein.
- **Lesbarkeit:** Nutze eine Zeilenhöhe (`line-height`) von mindestens 1.5 für Fließtext und halte die Zeilenlänge (Line Length) zwischen 60 und 80 Zeichen.
- **Schriftarten:** Verwende maximal zwei gut harmonierende Schriftfamilien (z. B. eine serifenlose Schrift für UI und Überschriften, optional eine Serifenschrift für längere Texte).
- **Hierarchie-Skalierung:** Verwende eine feste Typografie-Skala (z.B. Major Third oder Perfect Fourth) für konsistente Schriftgrößen.

## 3. Farben & Kontrast
- **Reduzierte Palette:** Definiere eine klare Farbpalette: eine Primärfarbe für Markenidentität/CTAs, neutrale Töne (Weiß, Grau, Schwarz) für den Hintergrund/Text und semantische Farben (Rot für Fehler, Grün für Erfolg).
- **Accessibility (WCAG):** Der Kontrast zwischen Text und Hintergrund muss mindestens den WCAG AA-Standards (4.5:1 für normalen Text) entsprechen.
- **Gezielte Akzente:** Setze knallige Farben oder Akzentfarben nur dort ein, wo sie eine Aktion (Call-to-Action) erfordern.

## 4. UI-Komponenten & Interaktion
- **Konsistenz:** Halte Rundungen (`border-radius`), Schatten (`box-shadow`) und Ränder über alle UI-Elemente hinweg einheitlich.
- **States:** Jeder Button und jeder Link muss definierte Zustände für `Hover`, `Focus`, `Active` und `Disabled` besitzen. Visuelles Feedback ist zwingend erforderlich.
- **Barrierefreiheit (a11y):** Alle interaktiven Elemente müssen per Tastatur bedienbar sein. Nutze `aria`-Attribute und sorge für logische Tabulator-Reihenfolgen (`tabindex`).

## Quality Checklist (Vor dem Code-Output prüfen)
- [ ] Semantisches HTML (z. B. `<header>`, `<main>`, `<article>`, `<footer>`) wurde verwendet?
- [ ] 8px-Spacing-System wurde konsequent angewendet (keine krummen Pixelwerte wie 13px oder 17px)?
- [ ] WCAG-Kontrastrichtlinien für Text und Hintergrund sind erfüllt?
- [ ] Alle Buttons/Links haben sichtbare Hover- und Focus-States?
- [ ] Das Layout bricht sauber auf mobilen Viewports um (Media Queries oder Flex/Grid-Wrap vorhanden)?
