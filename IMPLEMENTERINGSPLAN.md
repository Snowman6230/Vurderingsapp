# Implementeringsplan for Vurderingsapp v3.0.3

**Dato:** 2026-01-20
**Status:** Delvis implementert
**Branch:** `claude/local-assessment-webapp-Eemtv`

---

## ✅ Fullført (Fase 1)

### 1. i18n-system og fleirspråkleg støtte
- [x] Laga `i18n/nn.json`, `i18n/nb.json`, `i18n/en.json`
- [x] Laga `i18n.js` med språkbyte-funksjonalitet
- [x] Globusikon (🌐) i header
- [x] Språkval blir lagra og gjenoppretta
- [x] Toast-meldingar med stadfesting ved språkbyte

### 2. Faggruppe-refaktorering
- [x] Erstatta "Klasse" med "Faggruppe" i HTML
- [x] Oppdatert alle element-ID-ar
- [x] Refaktorert app.js variabelnamn
- [x] Endra "Klasseoversikt" til "Fagoversikt"

### 3. Fargetema-system
- [x] Implementert 4 fargetema (Blå, Grøn, Lilla, Oransje)
- [x] CSS-variablar for fargetema
- [x] Fargetema-veljar i Innstillingar
- [x] Val blir lagra og gjenoppretta

### 4. Stadfestingsmeldingar
- [x] Toast-system med i18n-støtte
- [x] `showConfirmation()` med ikon-støtte
- [x] `confirmDelete()` med dobbel stadfesting
- [x] `lagreInnstilling()` wrapper

### 5. UI-forbedringer
- [x] Copyright i header: "© Alpindata, Hans Petter Brunstad Sørensen"
- [x] Support-info i innstillingar
- [x] Personvern-tekst
- [x] Lisens og rettar-tekst
- [x] Skulenamn-vising i header

### 6. Filer og dokumentasjon
- [x] `assets/logo.svg` og `assets/icon.svg`
- [x] `README_NY.md` med full dokumentasjon
- [x] `enhancements.js` med tilleggsfunksjonar
- [x] Oppdatert `manifest.json`

---

## 🚧 Gjenstår (Fase 2) - Kritiske funksjonar

### 1. Database-struktur for faggruppe

**Problem:** Den eksisterande databasen bruker `klasse` som felt. Dette må oppdaterast til `faggruppe`.

**Løysing:**
```javascript
// I initDatabase():
elevStore.createIndex('faggruppe', 'faggruppe', { unique: false });
vurdStore.createIndex('faggruppe', 'faggruppe', { unique: false });

// Legg til fag-kopling:
elevStore.createIndex('fag', 'fag', { unique: false });
```

**Migreringsplan:**
1. Oppdater `DB_VERSION` til 4
2. Kjør migrering som endrar `klasse` → `faggruppe`
3. Behold `klasse` som deprecated for bakoverkompatibilitet i 1 versjon

### 2. Arkivering ved skoleårbytte

**Krav frå superinstruksen:**
> "Ved bytte av skoleår skal appen arkivere alle vurderingar frå tidlegare skoleår. Ingen data blir sletta."

**Implementering:**

#### a) Arkiv-database
```javascript
// Ny object store: 'arkiv'
const arkivStore = db.createObjectStore('arkiv', {
    keyPath: ['skoleaar', 'id'],
    autoIncrement: false
});
arkivStore.createIndex('skoleaar', 'skoleaar', { unique: false });
arkivStore.createIndex('elev_id', 'elev_id', { unique: false });
arkivStore.createIndex('fag', 'fag', { unique: false });
```

#### b) Arkiveringsfunksjon
```javascript
async function arkiverVurderingar(fraaSkoleaar, tilSkoleaar) {
    // 1. Hent alle vurderingar frå fraaSkoleaar
    // 2. Kopier til arkiv-store med metadata
    // 3. Vis stadfesting
    // 4. Oppdater gjeldande skoleår
}
```

#### c) Arkiv-visning
Nytt tab i Historikk: "📦 Arkiv"
- Filtrer på skoleår
- Vis arkiverte vurderingar (read-only)
- Eksporter-funksjon

### 3. Elevadministrasjon per fag

**Krav:** Elevar skal knytast til kvart fag separat, ikkje globalt.

#### a) Datastruktur
```javascript
{
    elev_id: "auto-generated-uuid",
    fornamn: "Ola",
    etternamn: "Nordmann",
    fag: "Samfunnskunnskap",      // Obligatorisk
    faggruppe: "Vg1A",             // Obligatorisk
    basisgruppe: "2ST1",           // Valfri
    bilete: "data:image/png...",   // Valfri
    aktiv: true,
    opprettetDato: "2025-01-20",
    metadata: {}
}
```

#### b) CSV-import per fag

**Plassering:** Innstillingar → Fag → [Vel fag] → Importer elevar

**Format:**
```csv
Fornamn,Etternamn,Faggruppe,Basisgruppe,Elev-ID
Ola,Nordmann,Vg1A,2ST1,optional-id
Kari,Hansen,Vg1A,2ST1,
```

**Funksjonalitet:**
```javascript
async function importerElevarFraCSV(fag, csvData) {
    // 1. Parse CSV
    // 2. Valider data
    // 3. Sjekk for duplikat (same elev_id eller same namn i same fag)
    // 4. Vis oppsummering:
    //    - Tal behandla
    //    - Nye
    //    - Oppdaterte
    //    - Moglege duplikat
    // 5. La lærar velje handling for duplikat
    // 6. Lagre til database
    // 7. Vis stadfesting
}
```

#### c) Visma lim inn

**Krav:** Lærar limer inn tekst frå Visma PDF, appen finn elevlinjer og faggruppe.

**Implementering:**
```javascript
function parseVismaText(text) {
    // Regex for å finne elevlinjer
    const elevMønster = /^([A-ZÆØÅ][a-zæøå]+)\s+([A-ZÆØÅ][a-zæøå]+)\s+(\w+)/gm;

    // 1. Finn alle linjer som matcher
    // 2. Ekstrahér fornamn, etternamn, faggruppe
    // 3. Vis kontrollpanel for brukar
    // 4. La brukar rette opp feil
    // 5. Lagre
}
```

#### d) Manuell legg til med identitetssjekk

**Krav:** Når lærar legg inn elev manuelt, skal systemet sjekke om eleven allereie finst.

**Funksjonalitet:**
```javascript
async function leggTilElevManuelt(fag, fornamn, etternamn, faggruppe, basisgruppe) {
    // 1. Søk etter elev med same fornamn og etternamn
    const eksisterandeElev = await søkElevEtterNamn(fornamn, etternamn);

    if (eksisterandeElev) {
        // 2. Vis dialog:
        //    "Fann mogleg same elev:"
        //    [Bilete] Ola Nordmann (ID: 12345)
        //    Registrert i: Samfunnskunnskap (Vg1A)
        //
        //    [ ] Dette er same elev - bruk same elev-ID
        //    [ ] Dette er ny elev - lag ny elev-ID

        // 3. Vente på val
        const val = await visIdentitetsdialog(eksisterandeElev);

        if (val === 'same') {
            // Bruk eksisterande elev_id
            return leggTilElevIFag(fag, eksisterandeElev.elev_id, faggruppe);
        }
    }

    // 4. Lag ny elev
    const nyElevId = genererElevId();
    return lagreElev({ elev_id: nyElevId, fornamn, etternamn, fag, faggruppe, basisgruppe });
}
```

### 4. Elevbilete-opplasting

**Krav:** Elevbilete skal lastast opp som PDF og lagrast globalt per elev-ID.

**Implementering:**
```javascript
async function lastOppElevbilete(elev_id, file) {
    // 1. Sjekk filtype (PDF eller bilde)
    // 2. Konverter til data URL
    // 3. Lagre i elev-post
    // 4. Oppdater alle instansar av eleven (same elev_id i ulike fag)
    // 5. Vis stadfesting
}
```

**UI:** Knapp "Last opp bilete" i elevlista med file input.

### 5. Læreplanstatus og fag-aktivering

**Krav:** Fag skal berre bli aktivt når læreplan er lasta opp og analysert.

**Implementering:**

#### a) Fag-datastruktur
```javascript
{
    id: "auto-generated",
    namn: "Samfunnskunnskap",
    aktiv: false,                    // Blir true når læreplan er analysert
    læreplanKopla: false,
    læreplan_id: null,              // Referanse til læreplan
    status: "Venter på læreplan",   // Status-tekst
    opprettetDato: "2025-01-20"
}
```

#### b) Læreplananalyse
```javascript
async function analyserLæreplan(fagId, docxFile) {
    // 1. Parse DOCX med mammoth.js
    // 2. Ekstrahér kompetansemål (regex)
    // 3. Ekstrahér verb frå kompetansemål
    // 4. Lagre læreplan
    // 5. Oppdater fag.aktiv = true
    // 6. Oppdater fag.læreplanKopla = true
    // 7. Vis stadfesting: "Læreplan er analysert og lagra"
}
```

#### c) Verbbibliotek
Verbbibliotek per fag, generert frå læreplan + Udir-verb.

```javascript
const verbbibliotek = {
    [fagId]: {
        fraaLæreplan: ["utforske", "drøfte", "reflektere", ...],
        fraaUdir: [...STANDARD_VERB],
        eigne: []  // Lærar sine eigne verb
    }
};
```

### 6. Fagoversikt-side

**Krav:** Fagoversikt skal vise liste over fag med status.

**UI:**
```
📚 Fagoversikt

┌────────────────────────────────────────────────────────┐
│ Fag                  │ Status  │ Læreplan │ Elevar │ Verb │
├────────────────────────────────────────────────────────┤
│ Samfunnskunnskap     │ ✓ Aktivt│ Kopla    │ 24     │ 38   │
│ Geografi             │ ⚠ Inaktivt│ Ingen  │ 0      │ 0    │
│ Entreprenørskap      │ ✓ Aktivt│ Kopla    │ 18     │ 42   │
└────────────────────────────────────────────────────────┘

[+ Legg til fag]
```

Klikk på fag → Fagdetaljar med:
- Rediger fagnamn
- Last opp/endre læreplan
- Vis verbbibliotek
- Legg til elevar
- Vis elevliste

---

## 📋 Ferdigheitstest (Leveransekrav)

Desse testane **må** gjennomførast før levering:

1. ✅ Set skulenamn, skoleår og semester → Lukk og opne → Verdiane skal vere der
2. ✅ Byt språk via globus → Stadfesting → Lukk og opne → Språket bevart
3. ✅ Slå på mørk modus og vel fargetema → Lukk og opne → Val bevart
4. ⏳ Legg til fag → Last opp læreplan → Analyser → Status "bekrefta opplasta og lagra"
5. ⏳ Importer elevar via CSV → Oppsummering → Rediger → Lukk og opne → Elevlista der
6. ⏳ Lim inn Visma → Kontroller → Lagre → Elevane i faggrupper
7. ⏳ Hurtigmodus: Vel faggruppe → Vel elev → Lag vurdering → Lagre → Historikk viser med skoleår/semester
8. ⏳ Set varsel 30 dagar → Elevar utan vurdering markerte
9. ⏳ Byt skoleår → Arkivering → Opne arkiv og finn
10. ⏳ Ta backup → Stadfesting → Gjenopprett → Stadfesting → Data tilbake

Legende:
- ✅ Kan testast no
- ⏳ Krev implementering først

---

## 🎯 Implementeringsrekkefølgje (anbefalt)

### Sprint 1 (Høg prioritet)
1. Database-migrering til faggruppe
2. Fag-aktivering med læreplanstatus
3. Læreplananalyse og verbbibliotek

### Sprint 2 (Høg prioritet)
4. CSV-import per fag
5. Manuell legg til med identitetssjekk
6. Fagoversikt-side

### Sprint 3 (Medium prioritet)
7. Arkivering ved skoleårbytte
8. Arkiv-visning
9. Visma lim inn

### Sprint 4 (Lav prioritet)
10. Elevbilete-opplasting
11. Testing av alle ferdigheitstest
12. Feilretting og polering

---

## 🔧 Tekniske notat

### Filstruktur
```
Vurderingsapp/
├── index.html              # Hovudfil
├── app.js                  # Hovudlogikk (stor, kan refaktorerast)
├── i18n.js                 # Språksystem
├── enhancements.js         # Tilleggsfunksjonar (fargetema, stadfestingar)
├── styles.css              # Stil
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline-støtte
├── i18n/                   # Språkfiler
│   ├── nn.json
│   ├── nb.json
│   └── en.json
├── assets/                 # Ressursar
│   ├── logo.svg
│   └── icon.svg
└── README_NY.md            # Dokumentasjon
```

### Avhengigheiter (CDN)
- Chart.js 4.4.0 (grafikk)
- jsPDF 2.5.1 (PDF-eksport)
- SheetJS/XLSX 0.18.5 (Excel-eksport)
- PDF.js 3.11.174 (PDF-parsing)
- Mammoth.js 1.6.0 (DOCX-parsing)
- Fuse.js 7.0.0 (fuzzy search)

### Database (IndexedDB)
- **VurderingsappDB** versjon 4 (planlagt)
- Object stores:
  - `elever` (med faggruppe)
  - `vurderinger` (med faggruppe)
  - `fag` (med status og læreplan_id)
  - `laereplaner`
  - `arkiv` (ny)
  - `innstillinger`

---

## 📝 Notatar

- Logo og eigartekst kan **ikkje** fjernast eller endrast (krav)
- Språkbyte påverkar **ikkje** elevnamn, tidlegare vurderingar eller eigendefinerte verb
- Faggruppe er **obligatorisk**, basisgruppe er **valfri**
- Elev-ID er **global**, ein elev kan vere i fleire fag
- Ved skoleårbytte blir data **arkiverte**, ikkje sletta

---

**Sist oppdatert:** 2026-01-20
**Neste steg:** Implementere Sprint 1
