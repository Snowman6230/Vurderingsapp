# Vurderingsapp v3 - Lokal Webapp for Faglærarar

**© Alpindata, Hans Petter Brunstad Sørensen**

## Om appen

Vurderingsapp v3 er ei lokal webapp for faglærarar som gjer vurderingsarbeid raskare og meir oversiktleg. Appen fungerer **fullstendig offline** etter installasjon og all data lagrast lokalt på PC. Ingen deling, ingen sky, ingen innlogging.

## 🚀 Kom i gang

### Installasjon

1. Last ned heile mappa
2. Opne `index.html` i nettlesar
3. Alt fungerer! Ingen byggesteg, ingen serverkrav.

### Første oppsett

1. Gå til **Innstillingar**
2. Set **skulenamn** og **skoleår**
3. Legg til **fag**
4. Last opp **læreplan** (docx-format)
5. Analyser læreplanen - faget blir aktivt
6. Legg til **elevar** i faget (CSV, Visma eller manuelt)
7. Vel **faggruppe** og **basisgruppe** for kvar elev

## 📋 Viktige prinsipp

### Fag og faggruppe - ikkje klasse

**Viktig:** Appen byggjer på **fag** som primær inngang, ikkje klasse.

- **Fag** er det overordna (t.d. "Samfunnskunnskap")
- **Faggruppe** er ei gruppering innan faget (t.d. "Vg1A", "2ST1")
- **Basisgruppe** er ordinær klasse (valfri å bruke)

### Elever knyttes til fag

Elevar blir knytte til kvart fag separat. Ingen global elevimport.

**Tre metodar for å legge til elevar:**

1. **CSV-import** - Last opp CSV-fil per fag
2. **Visma lim inn** - Lim inn tekst frå Visma PDF
3. **Manuell legg til** - Skriv inn elev manuelt

### Skoleår og semester som metadata

Skoleår og semester er **ikkje pynt** - det er metadata som lagrast på kvar vurdering.

- **Skoleår** (t.d. "2025–2026")
- **Semester** (Vår eller Haust)

**Ved bytte av skoleår:**
- Alle vurderingar frå tidlegare skoleår blir arkiverte
- Ingen data blir sletta
- Arkiv kan opnast for lesing og referanse

## 🌍 Språk

Appen støttar tre språk:

- **Nynorsk** (standard)
- **Bokmål**
- **English**

Språkbyte gjer du ved å klikke på **globusikonet (🌐)** øvst til høgre.

**Språkbyte påverkar:**
- All UI-tekst og tekstforslag

**Språkbyte påverkar IKKJE:**
- Elevnamn, tema, lærar sine fritekstar
- Eigendefinerte verb
- Tidlegare lagra vurderingar

## 🎨 Vising

### Mørk modus

Slå på mørk modus i **Innstillingar**. Valet blir lagra og brukt ved neste oppstart.

### Fargetema

Vel fargetema i **Innstillingar**:
- Blå (standard)
- Grøn
- Lilla
- Oransje

Logo og eigartekst kan **ikkje** fjernast eller endrast.

## 📚 Fag og læreplanar

### Legg til fag

1. Gå til **Innstillingar → Fag**
2. Skriv inn fagnamn
3. Klikk "Legg til"

### Last opp læreplan

1. Last opp læreplanfil i **docx-format**
2. Klikk **"Analyser læreplan"**
3. Appen parsar fila og hentar ut kompetansemål
4. Vel kompetansemål som skal brukast
5. Lagre læreplanen

**Viktig:** Fag blir først aktivt når læreplan er lasta opp og analysert!

### Verbbibliotek

Verb blir automatisk henta frå kompetansemåla i læreplanen. I tillegg finst eit universelt støttebibliotek med Udir-verb.

Lærar kan:
- Leggje til eigne verb
- Fjerne eigne verb
- Søkje i verbbiblioteket

## 👥 Elevadministrasjon

### CSV-import

1. Vel fag
2. Last opp CSV-fil med kolonnar: `Fornamn, Etternamn, Faggruppe, Basisgruppe, Elev-ID`
3. Få oppsummering av import
4. Handter eventuelle duplikat

### Visma lim inn

1. Vel fag
2. Lim inn tekst frå Visma PDF
3. Kontroller namn, elev-ID og faggruppe
4. Lagre

### Manuell legg til

1. Skriv inn fornamn, etternamn, faggruppe, basisgruppe
2. Systemet søkjer etter eksisterande elev med same namn
3. Vel om det er same elev eller ny elev
4. Lagre

### Elev-ID

Elev-ID er **global identitet**. Ein elev kan vere med i fleire fag, men har same elev-ID overalt.

### Elevbilete

Elevbilete kan lastast opp direkte frå elevlista i Hurtigmodus.

**Korleis laste opp:**
1. Hover over ein elev i elevlista
2. Klikk på kamera-ikonet (📷)
3. Vel bilete (JPEG, PNG, GIF) eller PDF
4. Maksimal filstørrelse: 5MB

**Viktig:** Biletet er **globalt per elev-ID** - når du lastar opp eit bilete for ein elev, blir det automatisk synleg i alle fag der eleven er registrert.

Biletet blir vist:
- I elevlista (Hurtigmodus)
- I identitetsdialog ved manuell registrering
- I elevdetaljar og historikk

## ⚡ Hovudfunksjonar

### Hurtigmodus

Primær arbeidsflate for rask vurdering.

**Prosess:**
1. Vel **faggruppe** først
2. Vel **elev**
3. Fyll ut vurdering:
   - Tema
   - Grunnleggjande ferdigheiter
   - Verb
   - Nivå (H/M/L) eller poeng
   - Kommentar
4. Lagre

Alle nye vurderingar får automatisk metadata:
- Skoleår
- Semester
- Fag
- Faggruppe
- Elev-ID

### Elevoversikt

Vis elevar knytte til valt fag, med filter på faggruppe og valfri vising av basisgruppe.

**Funksjonar:**
- Marker elevar utan vurdering siste X dagar (valfri innstilling)
- Sjå elevens historikk
- Lag fagoppsummering

### Fagoversikt

Vis liste over fag med:
- Status (Aktivt/Inaktivt)
- Læreplanstatus (Kopla/Ikkje kopla)
- Elevtal
- Verbtal

### Grafikk

Visualiser utvikling per elev og per fag.

**Funksjonar:**
- Filtrer på tema og periode
- Vising som søyle eller linje
- Eksporter grafikk

### Historikk

Vis alle vurderingar, sortert på dato, fag, elev, tema.

**Filtrering:**
- Skoleår
- Semester
- Faggruppe
- Fag
- Tema
- Dato

### Arkiv

Når skoleår blir endra, arkiveres alle vurderingar frå tidlegare skoleår.

**Funksjonar:**
- Opne arkiv og vel skoleår
- Filtrer på fag og elev
- Les arkiverte vurderingar

## 💾 Data og tryggleik

### Lokal lagring

All data lagrast lokalt på denne PC-en. Appen bruker **ikkje skytenester** og deler **ingen data** med tredjepart.

### Backup og gjenopprett

**Last ned backup:**
1. Gå til **Innstillingar → Backup**
2. Klikk "Last ned backup"
3. Få stadfesting

**Gjenopprett:**
1. Klikk "Gjenopprett frå backup"
2. Vel backupfil
3. Stadfest gjenoppretting

### Automatiske forslag

**Aktiver i Innstillingar:**
- Automatiske forslag for detaljvurdering
- Forslag basert på nivå (H/M/L), verb og grunnleggjande ferdigheiter

### Varsel om manglande vurdering

Set kor mange dagar det skal gå før ein elev blir markert som manglande vurdering.

**Standard:** 30 dagar

### Fagoppsummering lengde

Vel lengde på automatisk genererte fagoppsummeringar:
- **Kort** (inntil 500 teikn)
- **Middels** (inntil 1000 teikn)
- **Lang** (inntil 2000 teikn)

Lang kan ha valfrie tillegg som styrkar, utviklingspunkt og framovermelding.

## ⚠️ Sikra sletting

Kritiske slettingar krev **dobbel stadfesting**:

- Slett faggruppe
- Slett elev
- Slett alt

**Advarsel:** Desse handlingane kan **ikkje angrast**!

## 📞 Support og lisens

**Support:**
Alpindata
Hans Petter Brunstad Sørensen
Epost: post@alpindata.no

**Lisens og rettar:**
Denne appen er utvikla og eigd av Alpindata. All bruk er underlagt gjeldande lisensvilkår. Kjeldekode, design og funksjonalitet er verna av opphavsrett.

## 🧪 Ferdigheitstest (Leveransekrav)

Før levering skal desse testane gjennomførast utan feil:

1. ✅ Set skulenamn, skoleår og semester → Lukk og opne appen → Verdiane skal vere der
2. ✅ Byt språk via globus → Stadfesting skal visast → Lukk og opne → Språket skal vere bevart
3. ✅ Slå på mørk modus og vel fargetema → Lukk og opne → Val skal vere bevart
4. ✅ Legg til fag → Last opp læreplan → Trykk analyser → Status skal bli "bekrefta opplasta og lagra"
5. ✅ Importer elevar via CSV → Få oppsummering → Rediger elev → Lukk og opne → Elevlista skal vere der
6. ✅ Lim inn Visma tekst → Kontroller namn → Lagre → Elevane skal dukke opp i faggrupper
7. ✅ Hurtigmodus: Vel faggruppe → Vel elev → Lag vurdering med tema, ferdigheiter, verb, nivå → Lagre → Historikk skal vise vurderinga med skoleår og semester
8. ✅ Set varsel for manglande vurdering til 30 → Elevar utan vurdering siste 30 dagar blir markerte
9. ✅ Byt skoleår → Gamle vurderingar blir arkiverte → Opne arkiv og finn dei igjen
10. ✅ Ta backup → Få stadfesting → Gjenopprett → Få stadfesting → Data skal kome tilbake

## 📁 Filstruktur

```
Vurderingsapp/
├── index.html          # Hovudfil - opne denne
├── app.js              # Hovudlogikk
├── i18n.js             # Språksystem
├── styles.css          # Stil
├── manifest.json       # PWA manifest
├── service-worker.js   # Offline-støtte
├── i18n/               # Språkfiler
│   ├── nn.json         # Nynorsk
│   ├── nb.json         # Bokmål
│   └── en.json         # English
└── assets/             # Logo og ikoner
    ├── logo.svg        # Alpindata logo
    └── icon.svg        # App-ikon
```

## 🎯 Versjon

**Versjon:** 3.0.3
**Dato:** 2026-01-20
**Utvikla av:** Alpindata, Hans Petter Brunstad Sørensen

---

**© Alpindata. Alle rettar reserverte.**
