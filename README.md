# Vurderingsapp v3.0 - Komplett dokumentasjon

## 🎉 Nye funksjoner i versjon 3

Versjon 3 av vurderingsappen representerer eit stort hopp framover med kraftig grafikk, AI-assistert vurdering, og forbedra brukaropplevelse på alle plattformer.

---

## 📊 1. GRAFIKK OG VISUALISERING

### Nytt: Grafikk-fane
Ein heilt ny fane for statistikk og visualisering er lagt til:

#### Statistikk-kort
- **Totalt elevar**: Viser antal unike elevar i utvalget
- **Vurderingar**: Total antal vurderingar
- **Høg måloppnåelse**: Prosentdel vurderingar med "H"
- **Treng oppfølging**: Prosentdel vurderingar med "L"

#### Ferdighets-oversikt (Stolpediagram)
Viser fordelinga av Høg/Middels/Lav på tvers av alle grunnleggjande ferdigheiter:
- 📣 Muntlig
- ✍️ Skrive
- 📖 Lese
- 🔢 Rekne
- 💻 Digital

#### Heatmap - Ferdigheter per elev
Interaktiv heatmap som gir rask oversikt over:
- Kvar enkeltelev sine styrker og svakheiter
- Fargekoda celler (Grøn=Høg, Gul=Middels, Raud=Lav)
- Tooltip med detaljert informasjon ved hover

#### Trendgraf - Utvikling over tid
Linjegraf som viser utvikling av vurderingsnivå over tid:
- Gruppert per månad
- Viser prosentdel for kvart nivå (H/M/L)
- Perfekt for å sjå framgang gjennom skuleåret

### Elevgrafikk i Elevoversikt
Når du vel ein elev får du no:

**Tre grafikk-typar:**
1. **Linjegraf**: Viser utvikling av kvar ferdighet over tid
2. **Radardiagram**: Viser gjennomsnittleg ferdigheitsnivå på alle område
3. **Stolpediagram**: Viser fordelinga H/M/L for kvar ferdighet

---

## 🔍 2. AUTOSØK OG SMART FILTRERING

### Elevsøk med Fuse.js
- **Fuzzy matching**: Finn elevar sjølv med stavefeil
- **Sanntidssøk**: Resultata oppdaterer seg medan du skriv
- Søk i hurtigmodus for rask tilgang

### Dynamisk filtrering i historikk
**Ny: Ferdigheitsfilter**
Kryss av for å filtrere vurderingar basert på spesifikke ferdigheiter:
- Vis berre vurderingar som inkluderer "Muntlig"
- Kombiner fleire ferdigheiter
- Finn område som treng ekstra oppfølging

**Forbedra søkefunksjon**
- Søk i elevar, tema og kommentarar samtidig
- Kombiner med andre filter (klasse, fag, dato)
- Raskare resultat med optimalisert indeksering

---

## 📥 3. EKSPORT TIL EXCEL OG PDF

### Excel-eksport
Klikk "📥 Eksporter til Excel" i Klasseoversikt for å få:
- Alle vurderingar i valt klasse og fag
- Kolonnear: Elev, Dato, Tema, Vurdering, Ferdigheiter (5 kolonnar), Kommentar
- Ferdig formatert for vidare analyse
- Filnamn: `Vurderingar_[Klasse]_[Fag]_[Dato].xlsx`

### PDF-eksport
Klikk "📄 Eksporter til PDF" for å få:
- Profesjonell rapport med header
- Tabell med alle vurderingar
- Metadata: Skoleår, semester, genereringsdato
- Ferdig for utskrift eller digital distribusjon
- Filnamn: `Vurderingar_[Klasse]_[Fag]_[Dato].pdf`

**Tips:** Vel riktig filter (klasse, fag, skoleår, semester) før eksport!

---

## 🌙 4. MØRK MODUS

### Slå på/av
- Finn innstillinga i "⚙️ Innstillingar"
- Kryss av "🌙 Mørk modus"
- Preferansen blir lagra lokalt

### Fordelar
- Reduserer augebelastning ved kveldsvurdering
- Sparer batteri på OLED-skjermar
- Moderne utsjånad
- Automatisk lagra for neste økt

---

## 🎨 5. FORBEDRET FERDIGHETSVISNING

### Ikoner
Kvar ferdighet har no sitt eige ikon:
- 📣 Muntlig
- ✍️ Skrive
- 📖 Lese
- 🔢 Rekne
- 💻 Digital

### Fargekoding
Visuell koding gjer det enklare å sjå nivå med eit blikk:
- **Grøn**: Høg måloppnåelse
- **Gul**: Middels måloppnåelse
- **Raud**: Lav måloppnåelse / treng oppfølging

### Gradient-effektar
- Moderne utsjånad med gradient-bakgrunnar
- Høg kontrast for god lesbarheit
- Konsekvent på tvers av heile appen

---

## ✨ 6. AUTOMATISK FERDIGHETSFLAGGING

### Intelligent forslag
Når du vel eit kompetansemål får du automatisk forslag til relevante ferdigheiter:
- Analyser nøkkelord i kompetansemål-teksten
- Foreslår ferdigheiter som passar
- Du avgjer kva som skal inkluderast

### Aktivering
1. Gå til "⚙️ Innstillingar"
2. Kryss av "✨ Automatisk forslag til ferdigheiter basert på kompetansemål"
3. Forslag vil no visast i vurderingsskjemaet

### Eksempel-mønster
- **"presentere", "formidle", "drøfte"** → Foreslår Muntlig
- **"skrive", "formulere", "utforme"** → Foreslår Skrive
- **"lese", "utforske", "analysere"** → Foreslår Lese
- **"rekne", "beregne", "statistikk"** → Foreslår Rekne
- **"digital", "nett", "teknologi"** → Foreslår Digital

---

## 📱 7. MOBILOPTIMALISERING

### Kortvisning for vurderingsskjema
- Kompakt layout på små skjermar
- Swipe-venleg navigasjon
- Accordion-design for betre oversikt

### Sticky lagre-knapp
- Lagre-knappen er alltid synleg nedst på skjermen
- Enklare å fullføre vurderingar på mobil
- Slepp å scrolle tilbake til toppen

### Responsiv tabell
- Vertikale tabeller på små skjermar
- Touch-venleg interaksjon
- Optimalisert fontstorleik

### Kompakt heatmap
- Horizontal scrolling på små skjermar
- Mindre celler som framleis er klikkbare
- Touch-zoom støtte

---

## 🎯 8. PEDAGOGISKE FORBEDRINGER

### Kjerneelement og kompetansemål
Alle eksisterande pedagogiske funksjonar er beholdte og forbedra:
- Kjerneelement-visning
- Kompetansemål med verbhjelp
- Grunnferdigheiter
- Autotekst basert på nivå (H/M/L)

### Framovermelding-generator
- Automatiske forslag basert på verb og nivå
- Kontekst-sensitive kommentarar
- Pedagogisk solide formuleringar

### Sluttvurdering med ferdigheitsanalyse
- Automatisk vekta teljing
- Føreslått karakterintervall
- Oversikt over ferdigheitsutvikling

---

## 💾 9. BACKUP OG DATAHANDTERING

### Eksporter data
- Last ned komplett backup som JSON
- Inkluderer alle elevar, vurderingar, og innstillingar
- Tryggleik for data

### Importer data
- Gjenopprett frå tidlegare backup
- Migrer data mellom einingar
- Merge med eksisterande data

### Personvern
- All data lagres kun lokalt på eininga
- Ingen data sendast til internett
- Full kontroll over dine data

---

## 🚀 TEKNISKE FORBEDRINGER

### Nye bibliotek
- **Chart.js 4.4.0**: Moderne grafikk-bibliotek
- **Fuse.js 7.0**: Fuzzy search
- **jsPDF 2.5.1**: PDF-generering
- **SheetJS (XLSX)**: Excel-eksport

### Ytelse
- Optimalisert database-query
- Raskare filtrering og søk
- Cachet grafikk for smidigare oppdateringar

### Progressive Web App (PWA)
- Oppdatert service worker
- Offline-støtte for alle nye funksjonar
- Installérbar på alle plattformer

---

## 📋 BRUKSRETTLEIING

### Kom i gang
1. **Opne appen** i nettlesaren
2. **Legg til klassar** i Innstillingar
3. **Legg til fag** i Innstillingar
4. **Last opp læreplan** (valfritt, men anbefalt)
5. **Legg til elevar** i vald klasse

### Dagleg bruk
1. **Hurtigmodus**: Snøgg vurdering av heile klassa
2. **Elevoversikt**: Djupgåande oversikt per elev med grafikk
3. **Klasseoversikt**: Tabell-visning, eksporter data
4. **Grafikk**: Statistikk og visualisering
5. **Historikk**: Søk og filtrer i alle vurderingar

### Best practice
- **Bruk autosøk** for å finne elevar raskt
- **Aktiver automatisk ferdigheitsflagging** for konsistens
- **Sjekk grafikk-fana** regelmessig for å oppdage trendar
- **Eksporter data** etter kvart semester som backup
- **Bruk heatmap** for å identifisere elevar som treng ekstra støtte

---

## 🆕 OPPDATERINGAR FRÅ V2 TIL V3

### Lagt til:
✅ Grafikk-fane med statistikk og visualisering  
✅ Chart.js-integrasjon (linje, stolpe, radar, heatmap)  
✅ Autosøk i elevar med fuzzy matching  
✅ Ferdigheitsfilter i historikk  
✅ Eksport til Excel  
✅ Eksport til PDF  
✅ Mørk modus  
✅ Ferdighetsikoner (📣 ✍️ 📖 🔢 💻)  
✅ Fargekoding av ferdigheiter (grøn/gul/raud)  
✅ Automatisk ferdigheitsflagging  
✅ Elevgrafikk (3 typar)  
✅ Heatmap for ferdigheiter  
✅ Trendgraf for utvikling over tid  
✅ Mobiloptimalisering (sticky buttons, kortvisning)  
✅ Responsiv heatmap  

### Forbedra:
🔧 Database-ytelse  
🔧 Søkefunksjonalitet  
🔧 Mobilgrensesnitt  
🔧 Tabell-visning  
🔧 Filter-funksjonar  
🔧 Pedagogiske tekstar  

### Behalde:
✓ Alle v2-funksjonar  
✓ Læreplan-parsing  
✓ Kjerneelement og kompetansemål  
✓ Verbhjelp  
✓ Offline-funksjonalitet  
✓ Lokal datalagring  

---

## 🎓 TIPS OG TRIKS

### 1. Bruk radardiagram for elevsamtalar
Radardiagrammet gir ein rask visuell oversikt som er lett å forklare for elevar og føresette.

### 2. Eksporter før vinterferien og sommarferien
Sikre data med regelmessige eksportar. Både backup-JSON og Excel/PDF-rapportar.

### 3. Bruk heatmap for å planlegge gruppearbeid
Sjå kven som treng ekstra støtte i kva ferdigheiter, og sett saman grupper strategisk.

### 4. Ferdigheitsfilter for fokusområde
Filtrer historikken på t.d. "Digital" for å sjå alle digitale kompetanse-vurderingar.

### 5. Trendgraf for foreldremøte
Vis utvikling over tid visuelt - meir kraftfullt enn tekst aleine.

---

## 🐛 FEILSØKING

### Grafikk viser ikkje
- Sjekk at Chart.js er lasta (sjekk nettverksfana i devtools)
- Oppdater sida (Ctrl+F5)
- Kontroller at du har vurderingar med ferdigheiter

### Eksport fungerer ikkje
- Kontroller at klasse og fag er valt
- Sjekk at du har vurderingar i det valte filteret
- Prøv i ein annan nettlesar

### Mørk modus ikkje lagra
- Sjekk at localStorage er aktivert i nettlesaren
- Slå av "privat/inkognito-modus"

### Autosøk finn ikkje elev
- Kontroller at klasse er valt i Hurtigmodus
- Sjekk stavinga (fuzzy matching har grenser)
- Prøv å søke på deler av namnet

---

## 📞 SUPPORT

For spørsmål og tilbakemelding:
- Kontakt: Hans Petter Brunstad Sørensen
- Alpindata

---

## 📜 VERSIONSHISTORIKK

### v3.0.0 (2026-01-15)
- Grafikk og visualisering med Chart.js
- Autosøk med Fuse.js
- Eksport til Excel og PDF
- Mørk modus
- Ferdighetsikoner og fargekoding
- Automatisk ferdigheitsflagging
- Mobiloptimalisering
- Heatmap-funksjonalitet

### v2.0.0
- Kjerneelement og kompetansemål
- Verbhjelp
- Læreplan-parsing
- Grunnferdigheiter

### v1.0.0
- Grunnleggjande vurderingsfunksjonalitet

---

## 🎉 TAKK FOR AT DU BRUKER VURDERINGSAPP V3!

Dette er ein betydeleg oppdatering som gjer vurderingsarbeidet meir effektivt, innsiktsfullt og pedagogisk fundert. Vi håpar dei nye funksjonane vil spare deg tid og gi deg betre oversikt over elevane sine ferdigheiter og utvikling.

**Lukke til med vurderingsarbeidet!** 🚀
