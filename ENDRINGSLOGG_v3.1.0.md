# ENDRINGSLOGG v3.1.0

## 🛠️ Dato: 2026-10-29

Denne oppdateringa legg til konsolidert initialisering, auto-forslag for verb og ferdigheiter, utvida dashboard med verb-fordeling og diagrameksport, og Word-eksport.

---

## ✅ B3: Konsolidert initialisering

**Problem:** Fleire separate `DOMContentLoaded`-lyttarar i ulike filer kunne gje dobbel binding og uføreseieleg oppstartsrekkefølge.

**Løysing:**
- Éin konsolidert init i `app.js` som køyrer migrering, i18n og hovud-init i rett rekkefølge
- Fjerna separate `DOMContentLoaded` frå `database-migration.js` og `i18n-embedded.js`
- Funksjonar er tilgjengelege via `window.`-eksport

---

## ✅ C2: Auto-forslag for ferdigheiter og verb

**Problem:** Lærar måtte manuelt velje grunnleggjande ferdigheiter og verb for kvar vurdering.

**Løysing:**
- Nøkkelordbasert matching i `FERDIGHET_NØKKELORD` og `VERB_NØKKELORD`
- Når kompetansemål blir valt, kjem automatiske forslag for ferdigheiter (avkryssing) og verb
- Lærar kan overstyre alle forslag før lagring
- Støttar både nynorsk og bokmål nøkkelord

---

## ✅ C1: Utvida dashboard — verb-fordeling og diagrameksport

**Problem:** Dashboard mangla verb-fordelingsgraf og eksport av diagram.

**Løysing:**
- **Ny verb-fordelingsgraf** — horisontalt stolpediagram som viser dei 15 mest brukte verba
- **PNG-eksport** for alle diagram (ferdigheiter, trend, verb-fordeling)
- **Eksporter alle diagram** med éin knapp
- Brukar `canvas.toDataURL('image/png')` for direkte nedlasting

---

## ✅ C3: Eksport til Word (.doc)

**Problem:** Berre PDF og Excel var tilgjengeleg for eksport.

**Løysing:**
- Ny `eksporterTilWord()`-funksjon som genererer HTML-basert `.doc`-fil
- Word-fila inneheld:
  - Oppsummeringsstatistikk (H/M/L fordeling)
  - Alle vurderingar i tabell med fargekoding
  - Ferdigheitssamandrag per elev
- Kompatibel med Microsoft Word og LibreOffice
- Eksportknapp lagt til i grafikkvisinga

---

## 🔧 Andre endringar

- Versjon bumpa frå 3.0.5 → 3.1.0 i `index.html`, `app.js` og `feillogg.js`
- Excel- og PDF-eksport brukar no same filter som grafikkvisinga (`grafikk-faggruppe`, `grafikk-fag`, `grafikk-skoleaar`)
