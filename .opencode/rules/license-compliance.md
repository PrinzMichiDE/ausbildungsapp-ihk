---
name: Dependency License & Compliance (Commercial Free)
description: Regeln zur Lizenz-/Compliance-Pflicht bei Auswahl, Empfehlung und Integration von Drittanbieter-Abhängigkeiten, Frameworks, Tools und Assets. Immer beachten bei npm/pip/docker-Installationen, Library-Vorschlägen oder eingefügtem Fremdcode.
globs:
  - "package.json"
  - "package-lock.json"
  - "pnpm-lock.yaml"
  - "yarn.lock"
  - "requirements.txt"
  - "Dockerfile*"
  - "docker-compose.*"
  - "*.lock"
---

# Lizenz- und Compliance-Regel für Abhängigkeiten (Commercial Free)

Bei der Auswahl, Empfehlung und Implementierung von Drittanbieter-Bibliotheken, Frameworks, Tools oder Assets muss strikt darauf geachtet werden, dass diese für die kommerzielle Nutzung uneingeschränkt freigegeben sind.

## 1. Zulässige Lizenzen (Permissive Licenses)
- Wähle ausschließlich Abhängigkeiten, die unter freizügigen Open-Source-Lizenzen stehen, welche die kommerzielle Nutzung ohne Offenlegung des eigenen Quellcodes erlauben.
- **Primär erlaubt:** MIT, Apache 2.0, BSD (2-Clause, 3-Clause), ISC, Zlib.

## 2. Verbotene Lizenzen (Copyleft & Non-Commercial)
- Vermeide strikt Lizenzen, die einen viralen Effekt (Copyleft) haben oder die kommerzielle Nutzung explizit ausschließen, da sie rechtliche Risiken für das Unternehmensprojekt darstellen.
- **Strikt verboten (ohne explizite Erlaubnis):** GPL (alle Versionen), AGPL, CC BY-NC (Creative Commons Non-Commercial) sowie Lizenzen für den rein akademischen/persönlichen Gebrauch.
- **Vorsicht bei:** LGPL, MPL, CDDL. Diese dürfen nur nach sorgfältiger Prüfung und im korrekten technischen Kontext (z. B. dynamische Verlinkung) vorgeschlagen werden.

## 3. Warnpflicht und Transparenz
- Wenn ein neues Paket (via `npm`, `pip`, `docker` etc.) vorgeschlagen wird, muss dessen Lizenz in der Antwort immer proaktiv benannt werden.
- Den Nutzer unaufgefordert auf "Dual-License"-Modelle (z. B. Open-Source vs. kostenpflichtige Enterprise-Lizenz) hinweisen.
- Falls es für ein Problem nur Lösungen unter restriktiven Lizenzen gibt, den Nutzer ausdrücklich warnen und nach dem weiteren Vorgehen fragen, bevor der Code integriert wird.

## 4. Generierter Code & Fremdcode
- Keine Code-Snippets einfügen, die urheberrechtlich geschützt sind oder direkt aus Projekten mit GPL/AGPL-Lizenzen stammen.
- Alle generierten Skripte und Architekturen müssen als proprietäres Firmeneigentum behandelt und nicht automatisch unter eine Open-Source-Lizenz gestellt werden.

## 5. Operative Pflichten
- `npm audit`/Lizenz-Scan (`license-checker`, `pip-licenses` o. ä.) fester Bestandteil der CI (siehe Security-Regel §9) — Build schlägt bei verbotenen Lizenzen fehl.
- Vor `npm install <pkg>` die Lizenz des Pakets und seiner transitiven Abhängigkeiten prüfen, nicht nur die des Top-Level-Pakets.

## 6. Verbote
- Keine Abhängigkeit unter GPL/AGPL/CC-BY-NC ohne explizite Freigabe integrieren.
- Kein Fremdcode aus Copyleft-Projekten ungeprüft übernehmen.
- Keine Library mit Dual-License einbauen, ohne das Lizenzmodell transparent zu benennen.
- Kein Verschweigen der Lizenz bei Paketvorschlägen.
