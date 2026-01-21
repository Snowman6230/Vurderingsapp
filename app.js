// Vurderingsapp v2 - Hovedlogikk
// Versjon 2.0

// Database konfigurasjon
const DB_NAME = 'VurderingsappDB';
const DB_VERSION = 4; // Oppdatert til v4 (faggruppe + arkiv)
let db;


const STANDARD_LAEREPLANAR = [
    {
        "kode": "SAK01-01",
        "tittel": "Samfunnskunnskap (fellesfag Vg1/Vg2)",
        "grunnferdigheter": ["Munnlege ferdigheiter – Munnlege ferdigheiter i samfunnskunnskap inneber å kunne formulere og fremje eigne meiningar og argument. Å lytte til, vurdere, gi respons på og vidareutvikle innspel frå andre bidreg til større forståing og respekt for meiningsmangfald. Elevane utviklar munnlege ferdigheiter i samfunnskunnskap når dei drøftar, reflekterer og presenterer åleine og i fellesskap. Gjennom å delta i munnlege aktivitetar kan elevane setje ord på sin eigen læreprosess og kompetanse i faget.", "Å kunne skrive – Å kunne skrive i samfunnskunnskap inneber å strukturere tankar og å utforme og arbeide med tekstar som er tilpassa formålet. Det inneber òg å drøfte, dele og formidle informasjon skriftleg med digitale verktøy. Elevane tileignar seg fagkompetanse ved å skrive tekstar der dei bruker fagomgrep, faglege metodar og ulike perspektiv og kjelder.", "Å kunne lese – Å kunne lese i samfunnskunnskap inneberer å utforske, tolke, samanlikne informasjon og kritisk vurdere forskjellige kjelder. Vidare inneber det å bruke varierte kjelder for å setje seg inn i faglege og dagsaktuelle tema. Lesing i samfunnskunnskap handlar òg om å reflektere over korleis tekstar med forskjellige perspektiv kan uttrykke ulike tenkjemåtar og argument.", "Å kunne rekne – Å kunne rekne i samfunnskunnskap er å innhente, arbeide med, tolke og analysere data og vurdere informasjon og statistikk som er framstilt i tabellar og grafar. Ved å rekne i samfunnskunnskap kan elevane betre forstå og finne argument for faglege forhold og samanhengar. Elevane må òg kunne rekne for å forvalte pengebruk og få oversikt over personleg økonomi.", "Digitale ferdigheiter – Digitale ferdigheiter i samfunnskunnskap inneber å kunne bruke digitale verktøy til å finne, behandle og navigere i digitale kjelder og å velje ut informasjon og argument. Det inneber òg å kunne utøve digital kjeldekritikk og vise til kjelder på ein påliteleg måte. Elevane skal kunne bruke forskjellige medietypar til å skape digitale produkt og til å vurdere og forbetre sine eigne produkt. Dei skal kunne forstå korleis algoritmar påverkar informasjonssøk, utvikle digital dømmekraft og følgje reglar og normer for digital samhandling og kommunikasjon, personvern og opphavsrett."],
        "kjerneelement": [
            "Undring og utforsking",
            "Perspektivmangfald og samfunnskritisk tenking",
            "Medborgarskap og berekraftig utvikling",
            "Identitet og livsmeistring"
        ],
        "kompetansemaal": [
            "utforske og presentere dagsaktuelle tema eller debatter ved å bruke samfunnsfaglege metodar, kjelder og digitale ressursar, og argumentere for sine eigne og andre sine meiningar og verdiar",
            "utforske korleis interesser og ideologisk ståstad påverkar våre argument og val av kjelder, og reflektere over korleis det gir seg utslag i forskjellige meiningar",
            "gjere greie for sosialisering og drøfte korleis identiteten og sjølvkjensla til ungdom blir påverka gjennom sosialisering",
            "drøfte korleis personleg økonomi, kommersiell påverknad og forbruk påverkar enkeltpersonar, grupper og samfunnet",
            "reflektere over utfordringar i samband med grensesetjing og drøfte ulike verdiar, normer og lover som gjeld kjønn, seksualitet og kropp",
            "reflektere over eigne digitale spor, utforske kven som har tilgang til spora, og drøfte korleis data og personopplysningar kan brukast eller misbrukast",
            "innhente informasjon om forskjellige former for sosial ulikskap i Noreg og drøfte samanhengen mellom ulikskap og utanforskap",
            "reflektere over likskapar og ulikskapar i kulturuttrykk, identitet og levesett innanfor og mellom majoritet og minoritet i Noreg og Sápmi/Sábme/Sáepmie",
            "utforske og beskrive korleis organiseringa av samfunnet og arbeidslivet i Noreg har endra seg, og drøfte korleis den nordiske samfunnsmodellen møter utfordringar enkeltpersonar og samfunnet står overfor",
            "utforske og drøfte korleis næringsgrunnlag, innovasjon og teknologi formar og påverkar arbeidsliv og lokalsamfunn i Noreg",
            "reflektere over kva det inneber å vere medborgar, og samanlikne korleis politiske system er organiserte i forskjellige land og område",
            "vurdere korleis utøving av makt påverkar enkeltpersonar og samfunn",
            "gjere greie for grunnlaget for menneskerettane og utforske og gi døme på brot på menneskerettane nasjonalt eller globalt",
            "vurdere årsaker til og tiltak som kan førebyggje rasisme, diskriminering og hatefulle ytringar, og drøfte grensene for ytringsfridommen",
            "utforske ei utfordring eller ein konflikt på lokalt, nasjonalt eller globalt nivå og drøfte korleis utfordringa eller konflikten påverkar forskjellige grupper",
            "drøfte samanhengen mellom økonomisk vekst, levestandard og livskvalitet i eit globalt og berekraftig perspektiv"
        ],
        "kilde": "udir"
    },
    {
        "kode": "GEO01-02",
        "tittel": "Geografi (fellesfag)",
        "grunnferdigheter": ["Munnlege ferdigheiter – Munnlege ferdigheiter i geografi inneber å kunne presentere eige arbeid med geografiske tema og å kunne forklare og drøfte problemstillingar ved å argumentere, lytte og gi respons. Gjennom å delta i munnlege aktivitetar kan elevane setje ord på sin eigen læringsprosess og kompetanse i geografifaget.", "Å kunne skrive – Å skrive i geografi inneber å utforme og arbeide med faglege tekstar tilpassa formålet, for å dele, formidle og presentere informasjon skriftleg. Ved å skrive i geografi kan elevane strukturere tankar, planleggje arbeid og dokumentere observasjonar. Å skrive i geografi inneber òg å utforske, beskrive, drøfte og vurdere geografiske forhold og å bruke og vise til kjelder.", "Å kunne lese – Å lese i geografi inneber å utforske, tolke og reflektere over innhaldet i ulike kjelder som tekst, kart, bilete, figurar og statistikk. Vidare inneber det å finne informasjon og bevisst velje og velje bort ulike kjelder, å kjenne att argumentasjon og å skilje mellom meiningar, fakta og påstandar.", "Å kunne rekne – Å rekne i geografi inneber å kunne innhente, arbeide med, tolke, samanlikne og vurdere talmateriale, tabellar og grafiske framstillingar. Ved å rekne i geografifaget kan elevane betre forstå geografiske forhold og finne grunngjevingar for geografiske samanhengar.", "Digitale ferdigheiter – Digitale ferdigheiter i geografi inneber å kunne bruke digitale ressursar til å finne, behandle og navigere i digitale kjelder, utøve digital kjeldekritikk og velje ut informasjon i digitale kjelder, inkludert digitale kart. Dei digitale ferdigheitene inneber òg å kunne bruke digitale ressursar til å utforme faglege produkt og lage geografiske illustrasjonar for å presentere og utvikle fagleg kompetanse."],
        "kjerneelement": [
            "Utforsking og geografiske metodar",
            "Naturgitt og menneskeskapt rom",
            "Berekraftig utvikling og globalisering"
        ],
        "kompetansemaal": [
            "utforske og presentere geografiske forhold og prosessar ved å bruke ulike kjelder, inkludert kart",
            "gjere greie for korleis indre og ytre krefter har danna ulike landskap, og utforske og gi døme på korleis menneska som bur der, kan utnytte ressursane",
            "drøfte ulike interesser knytte til ressurs- og arealbruk i Noreg, Sápmi/Sábme/Sáepmie og nordområda",
            "reflektere over eigen ressursbruk og ressursbruken i Noreg i eit globalt og berekraftig perspektiv",
            "utforske kva endringar i klimaet har å seie for natur og samfunn lokalt, regionalt eller globalt",
            "utforske og gjere greie for årsakene til ein aktuell natur- eller miljøkatastrofe og konsekvensar for menneske, samfunn og natur",
            "gjere greie for årsaker til demografiske endringar og drøfte ulike levekår i forskjellige delar av verda",
            "gjennomføre eit feltarbeid for å undersøkje og presentere geografiske forhold"
        ],
        "kilde": "udir"
    },
    {
        "kode": "ENT01-04",
        "tittel": "Entreprenørskap og bedriftsutvikling (1 og 2)",
        "grunnferdigheter": ["Muntlige ferdigheter – Muntlige ferdigheter i entreprenørskap og bedriftsutvikling innebærer å uttrykke egne meninger, lytte til og gi respons i spontan og forberedt samtale. Det innebærer også å bruke fagspråk i drøfting og refleksjon over faglige emner og problemstillinger og bygge opp argumentasjon og tilpasse muntlig tekst til mottaker og formål. Muntlige ferdigheter innebærer og å bruke kilder på en kritisk måte som lar seg etterprøve.", "Å kunne skrive – Å kunne skrive i entreprenørskap og bedriftsutvikling innebærer å bruke fagspråk og varierte skrivestrategier for å utforme tekster tilpasset mottaker og formål. Det betyr å utforske og reflektere over faglige emner og problemstillinger, å bygge opp argumentasjon, å vurdere og begrunne valg av løsninger og anbefalinger, og å bruke kilder på en kritisk måte som lar seg etterprøve.", "Å kunne lese – Å kunne lese i entreprenørskap og bedriftsutvikling innebærer å bruke ulike kilder for å innhente informasjon om næringsliv og dagsaktuelle temaer for virksomheter. Det innebærer å sette seg inn i kjente og ukjente emner knyttet til oppstart og videreutvikling av virksomheter, og å finne, tolke, systematisere og kritisk vurdere informasjon i ulike tekster.", "Å kunne regne – Å kunne regne i entreprenørskap og bedriftsutvikling innebærer å hente ut, beskrive, tolke og analysere tallmateriale i tabeller og grafiske framstillinger. Det innebærer også å bruke og bearbeide informasjon for å forstå og vise sammenhenger, og sammenligne og presentere resultater på ulike måter på bakgrunn av grunnleggende økonomiske beregninger, modeller og statistikk.", "Digitale ferdigheter – Digitale ferdigheter i entreprenørskap og bedriftsutvikling innebærer å bruke digitale ressurser til å søke etter og innhente informasjon og å kommunisere og presentere eget arbeid. Digitale ferdigheter innebærer videre å vurdere, bearbeide og sammenstille informasjon, være kildekritisk, og å vise til kilder slik at informasjonen lar seg etterprøve. Det handler også om å utvikle etisk bevissthet og vise digital dømmekraft ved å følge regler og normer."],
        "kjerneelement": [
            "Innovasjon",
            "Verdiskaping og bærekraft",
            "Strategi og virksomhetsutvikling"
        ],
        "kompetansemaal": [],
        "kilde": "udir"
    }
];

const TEKSTBLOKKER = {
    forstaing: {
        H: "Du viser høg fagleg forståing ved at du forklarer sentrale omgrep presist og set dei inn i ein relevant fagleg samanheng.",
        M: "Du viser grunnleggande fagleg forståing, men forklaringane er delvis overflatiske og nokre omgrep kunne vore brukt meir presist.",
        L: "Du viser avgrensa fagleg forståing, og manglar presis bruk av fagomgrep knytt til temaet."
    },
    resonnering: {
        H: "Du resonerer godt og ser samanhengar mellom årsak og verknad, og drøftar problemstillinga frå fleire relevante perspektiv.",
        M: "Du viser noko resonnering, men ser berre delar av årsak–verknad, og drøftinga er lite utdjupa.",
        L: "Du viser lite resonnering, og framstillinga er prega av oppramsing utan tydeleg årsak–verknad eller drøfting."
    },
    refleksjon: {
        H: "Du reflekterer godt over eiga læring eller val, og viser forståing for både styrkar, svakheiter og vidare utvikling.",
        M: "Du har nokre refleksjonar, men dei er generelle og lite knytte til faglege vurderingar eller konkrete erfaringar.",
        L: "Du viser lite refleksjon og gjer i liten grad greie for eiga læring eller faglege val."
    },
    munnleg: {
        H: "Du deltek aktivt og formidlar fagstoff klart og strukturert, med bruk av relevant fagspråk.",
        M: "Du deltek i samtalar, men formidlinga er ujamn og manglar tidvis presisjon eller struktur.",
        L: "Du deltek lite munnleg, og formidlinga er utydeleg eller manglar fagleg innhald."
    },
    initiativ: {
        H: "Du viser høg grad av initiativ og innsats, arbeider sjølvstendig og bidreg aktivt til framdrift og samarbeid.",
        M: "Du gjer det som blir forventa, men tek i liten grad initiativ eller ansvar utover eigen del.",
        L: "Du viser låg innsats og tek lite initiativ, og treng tett oppfølging for å kome vidare i arbeidet."
    }
};

const TEKSTBLOKKER_SLUTT = {
    "5–6": "I dette faget viser du svært god fagleg kompetanse. Du har god oversikt over sentrale omgrep og samanhengar, og resonerer sjølvstendig og presist. Du reflekterer over faglege problemstillingar og viser evne til å sjå fleire perspektiv. Arbeidet ditt er gjennomgåande på eit høgt nivå.",
    "4–5": "I dette faget viser du god fagleg kompetanse. Du har forståing for sentrale omgrep og samanhengar, og du kan forklare og drøfte faglege problemstillingar på ein strukturert måte. Refleksjonen er til stades, men varierer noko i djupn. Samla sett viser du jamt god måloppnåing.",
    "3–4": "I dette faget viser du grunnleggande til god fagleg kompetanse. Du har forståing for hovudtrekka i faget, men forklaringar og resonnering er til tider ufullstendige. Du viser noko refleksjon, men har potensial for å utdjupe faglege vurderingar ytterlegare.",
    "2–3": "I dette faget viser du låg til noko fagleg kompetanse. Du har delvis forståing for fagstoffet, men manglar presisjon i bruk av omgrep og samanhengar. Resonnering og refleksjon er svak, og du må arbeide meir systematisk for å nå kompetansemåla.",
    "1": "I dette faget viser du svært låg fagleg kompetanse. Du har i liten grad nådd kompetansemåla, og manglar forståing for sentrale omgrep og samanhengar. Det er behov for vesentleg meir arbeid for å oppnå måloppnåing i faget."
};

function hentTekstblokk(fokus, nivaa, tema) {
    if (!fokus || !nivaa) return "";
    const base = (TEKSTBLOKKER[fokus] && TEKSTBLOKKER[fokus][nivaa]) ? TEKSTBLOKKER[fokus][nivaa] : "";
    if (!base) return "";
    if (tema && tema.trim()) return "Tema: " + tema.trim() + "\n" + base;
    return base;
}

function oppdaterTekstforslag() {
    const visEl = document.getElementById('tekstforslag');
    if (!visEl) return;
    const fokusEl = document.getElementById('fokus');
    const temaEl = document.getElementById('tema');
    const fokus = fokusEl ? fokusEl.value : "";
    const tema = temaEl ? temaEl.value : "";
    const nivaa = window.valgtHML || "";
    const tekst = hentTekstblokk(fokus, nivaa, tema);
    visEl.textContent = tekst || "Vel fokus og trykk H, M eller L for å få forslag.";
}


// Globale variabler
let valgtElev = null;
let sisteValgteFaggruppe = '';
let sisteValgteFag = '';
let gjeldendeSkoleaar = '';
let gjeldendeSemester = '';

/* Kjerneelement og verb støtte */
/* Læreplanar kan ligge i innstillingar som innstillinger.laereplaner[fag] = { id, kjerneelement:[], kompetansemaal:[], grunnferdigheter:[] } */

const VERB_ORDBOK = {
    "utforske": "Utforske betyr å undersøkje, prøve ut og stille spørsmål for å finne ny innsikt.",
    "drøfte": "Drøfte betyr å sjå ei sak frå fleire sider, bruke argument og grunngi ei vurdering.",
    "reflektere": "Reflektere betyr å tenkje gjennom og vurdere konsekvensar, perspektiv og eigne val.",
    "analysere": "Analysere betyr å dele opp, sjå mønster og samanhengar og forklare kvifor noko skjer.",
    "vurdere": "Vurdere betyr å ta stilling ut frå kriterium og grunngi konklusjonar.",
    "gjere greie for": "Gjere greie for betyr å forklare og vise forståing med eigne ord og relevante omgrep.",
    "forklare": "Forklare betyr å vise kvifor og korleis, ofte med årsak og verknad og døme.",
    "beskrive": "Beskrive betyr å skildre kjenneteikn og innhald, gjerne med fagomgrep.",
    "presentere": "Presentere betyr å formidle tydeleg til mottakar med struktur og tilpassing.",
    "samanlikne": "Samanlikne betyr å peike på likskapar og skilnader og forklare kva dei betyr.",
    "argumentere": "Argumentere betyr å grunngi standpunkt med påstand, grunn og døme.",
    "bruke": "Bruke betyr å ta i bruk omgrep, teori, metode eller verktøy i ei konkret oppgåve.",
    "identifisere": "Identifisere betyr å kjenne att og peike ut relevante forhold eller element.",
    "gjennomføre": "Gjennomføre betyr å planleggje og utføre ei oppgåve systematisk og etter krav.",
    "dokumentere": "Dokumentere betyr å vise arbeidet med spor, kjelder og resultat som kan etterprøvast.",
    "skildre": "Skildre betyr å beskrive med meir detalj og presisjon."
};

const VERB_TEKST = {
    "utforske": {
        H: "Du utforskar sjølvstendig, stiller gode spørsmål og bruker kjelder eller metodar på ein målretta måte.",
        M: "Du utforskar temaet, men treng fleire spørsmål, betre systematikk eller tydelegare bruk av kjelder eller metodar.",
        L: "Du utforskar i liten grad. Du treng meir systematikk og tydelegare spørsmål eller bruk av kjelder."
    },
    "drøfte": {
        H: "Du drøftar frå fleire perspektiv og grunngir standpunkt med relevante argument og døme.",
        M: "Du drøftar noko, men ser færre perspektiv eller har ujamn grunngiving og argumentasjon.",
        L: "Du drøftar i liten grad. Svaret blir mest oppramsing utan grunngiving eller perspektiv."
    },
    "reflektere": {
        H: "Du reflekterer nyansert og viser forståing for konsekvensar og ulike perspektiv.",
        M: "Du har nokre refleksjonar, men dei er generelle og lite kopla til konkrete konsekvensar eller fagomgrep.",
        L: "Du viser lite refleksjon og treng å grunngi tankar og sjå konsekvensar tydelegare."
    },
    "analysere": {
        H: "Du analyserer og ser mønster og samanhengar, og du forklarer med fagomgrep og relevante døme.",
        M: "Du analyserer noko, men treng tydelegare samanhengar, meir presisjon eller betre bruk av fagomgrep.",
        L: "Du analyserer i liten grad. Du treng å gå frå beskriving til forklaring av samanhengar."
    },
    "vurdere": {
        H: "Du vurderer ved å bruke relevante kriterium og grunngir konklusjonane dine tydeleg.",
        M: "Du vurderer delvis, men kriterium og grunngiving er ujamn eller lite presis.",
        L: "Du vurderer lite og treng å grunngi konklusjonar ut frå kriterium eller faglege omgrep."
    },
    "gjere greie for": {
        H: "Du gjer greie for presist med gode fagomgrep og viser samanhengar.",
        M: "Du gjer greie for hovudtrekka, men treng meir presisjon og fleire samanhengar eller døme.",
        L: "Du gjer greie for i liten grad og treng å få med sentrale omgrep og hovudpoeng."
    },
    "forklare": {
        H: "Du forklarer presist, viser årsak og verknad og bruker relevante døme.",
        M: "Du forklarer hovudtrekka, men årsak og verknad eller døme er delvis uklårt.",
        L: "Du forklarer i liten grad og treng tydelegare årsak og verknad og sentrale omgrep."
    },
    "beskrive": {
        H: "Du beskriv presist med relevante fagomgrep og får fram viktige kjenneteikn.",
        M: "Du beskriv hovudtrekka, men treng meir presisjon og fagomgrep.",
        L: "Du beskriv lite eller svært generelt, og treng fleire fagomgrep og detaljar."
    },
    "samanlikne": {
        H: "Du samanliknar presist og får fram både likskapar og skilnader med forklaring på kvifor dei er viktige.",
        M: "Du peikar på nokre likskapar eller skilnader, men forklaringa er kort eller manglar.",
        L: "Du samanliknar i liten grad, eller du får ikkje fram klare likskapar og skilnader."
    }
};

function finnVerbaItekst(tekst) {
    if (!tekst) return [];
    const t = tekst.toLowerCase();
    const funn = [];
    Object.keys(VERB_ORDBOK).forEach(v => {
        if (t.includes(v)) funn.push(v);
    });
    const prior = ["utforske","drøfte","reflektere","analysere","vurdere","gjere greie for","forklare","beskrive","samanlikne","presentere","argumentere","dokumentere","gjennomføre","identifisere","bruke","skildre"];
    funn.sort((a, b) => prior.indexOf(a) - prior.indexOf(b));
    return funn;
}

function lagAutoKommentar(hml, kompetansemaalTekst) {
    const verbFunn = finnVerbaItekst(kompetansemaalTekst);
    const verb = verbFunn.length ? verbFunn[0] : "";
    if (verb && VERB_TEKST[verb] && VERB_TEKST[verb][hml]) return VERB_TEKST[verb][hml];

    if (hml === "H") return "Du viser høg måloppnåing og bruker fagomgrep presist. Du grunngir vala dine og ser samanhengar.";
    if (hml === "M") return "Du viser middels måloppnåing. Du har fleire relevante poeng, men treng meir presisjon og grunngiving.";
    return "Du er på veg, men treng å arbeide meir med fagomgrep, presisjon og grunngiving for å nå måla.";
}

let sisteAutoKommentar = "";
let kommentarErAuto = false;
let valtHML = "";

function hentLaereplanForFag(fag, innstillinger) {
    const lp = (innstillinger && innstillinger.laereplaner && innstillinger.laereplaner[fag]) ? innstillinger.laereplaner[fag] : null;
    return lp;
}

function fyllSelect(selectEl, items, idPrefix) {
    if (!selectEl) return;
    selectEl.innerHTML = "";
    const opt0 = document.createElement("option");
    opt0.value = "";
    opt0.textContent = "Ingen";
    selectEl.appendChild(opt0);

    (items || []).forEach((txt, i) => {
        const opt = document.createElement("option");
        opt.value = `${idPrefix}${i}`;
        opt.textContent = txt;
        opt.title = txt;
        selectEl.appendChild(opt);
    });
}

function oppdaterVerbHjelp() {
    const kmSel = document.getElementById("kompetansemaal");
    const box = document.getElementById("verb-hjelp");
    if (!box) return;

    const opt = kmSel && kmSel.selectedOptions && kmSel.selectedOptions[0] ? kmSel.selectedOptions[0] : null;
    const tekst = opt ? (opt.title || "") : "";
    const funn = finnVerbaItekst(tekst);

    if (!tekst || funn.length === 0) {
        box.style.display = "none";
        box.innerHTML = "";
        return;
    }

    box.style.display = "block";
    box.innerHTML = `💡 <strong>Verb i kompetansemålet:</strong><br>` + funn.map(v => {
        const fork = VERB_ORDBOK[v] || "";
        return `• <strong>${v}</strong>: ${fork}`;
    }).join("<br>");
}

function oppdaterAutoKommentarVedEndring() {
    const kommentarEl = document.getElementById("vurd-kommentar");
    const kmSel = document.getElementById("kompetansemaal");
    if (!kommentarEl) return;
    if (!valtHML) return;

    const opt = kmSel && kmSel.selectedOptions && kmSel.selectedOptions[0] ? kmSel.selectedOptions[0] : null;
    const kmTekst = opt ? (opt.title || "") : "";
    const ny = lagAutoKommentar(valtHML, kmTekst);

    if (!kommentarEl.value.trim() || (kommentarErAuto && kommentarEl.value === sisteAutoKommentar)) {
        kommentarEl.value = ny;
        sisteAutoKommentar = ny;
        kommentarErAuto = true;
    }
}

// Standard fagliste
const standardFag = [
    'Samfunnskunnskap',
    'Geografi',
    'Entreprenørskap og bedriftsutvikling 2',
    'Norsk',
    'Engelsk',
    'Matematikk',
    'Naturfag',
    'Kunst og håndverk',
    'Kroppsøving',
    'Musikk'
];

// Grunnleggende ferdigheter
const ferdigheter = [
    { id: 'munnleg', navn: 'Munnlege ferdigheiter' },
    { id: 'skriftleg', navn: 'Skriftlege ferdigheiter' },
    { id: 'lesing', navn: 'Lesing' },
    { id: 'rekning', navn: 'Rekning' },
    { id: 'digital', navn: 'Digitale ferdigheiter' }
];

// Autoforslag regler
const autoforslagRegler = {
    'H': {
        munnleg: 'H',
        digital: 'H',
        skriftleg: 'ikke_vurdert',
        lesing: 'ikke_vurdert',
        rekning: 'ikke_vurdert'
    },
    'M': {
        munnleg: 'M',
        digital: 'M',
        skriftleg: 'ikke_vurdert',
        lesing: 'ikke_vurdert',
        rekning: 'ikke_vurdert'
    },
    'L': {
        munnleg: 'L',
        digital: 'L',
        skriftleg: 'ikke_vurdert',
        lesing: 'ikke_vurdert',
        rekning: 'ikke_vurdert'
    }
};

// Initialiser app
document.addEventListener('DOMContentLoaded', async () => {
    await initDB();
    await initApp();
    setupEventListeners();
    
    

console.log('🚀 Startar Vurderingsapp v3.0.3...');

console.log('✅ Database initialisert');
console.log('✅ Hovudapp initialisert');
console.log('✅ Event listeners satt opp');

// v3-init (konsolidert initialisering)
try { initDarkMode(); console.log('✅ Mørk modus initialisert'); } catch (e) { console.warn('⚠️ Mørk modus feila:', e); }
try { initGrafikkView(); console.log('✅ Grafikk-view initialisert'); } catch (e) { console.warn('⚠️ Grafikk-view feila:', e); }

// Fyll skoleår-dropdowns (inkl. grafikk/innstillingar)
try {
    const skoleaarSelects = [
        document.getElementById('innstillinger-skoleaar'),
        document.getElementById('hurtig-skoleaar'),
        document.getElementById('oversikt-skoleaar'),
        document.getElementById('historikk-skoleaar'),
        document.getElementById('grafikk-skoleaar')
    ];
    skoleaarSelects.forEach(sel => { if (sel) fyllSkoleaarListe(sel); });
    console.log('✅ Skoleår-dropdowns fylt');
} catch (e) { console.warn('⚠️ Skoleår-dropdown feila:', e); }

// Administrasjonsfunksjonar
try {
    await initKlasseadministrasjon();
    await initFagadministrasjon();
    await initLaereplanKopling();
    await initAdministrerLaereplaner();
    console.log('✅ Administrasjon initialisert');
} catch (e) { console.warn('⚠️ Administrasjon feila:', e); }

// Elevsøk (Fuse.js)
const elevSokInput = document.getElementById('elev-sok');
if (elevSokInput) elevSokInput.addEventListener('input', (e) => sokElever(e.target.value));

// Graftype-endring i elevgrafikk
document.querySelectorAll('input[name="graftype"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const elevId = document.getElementById('elevoversikt-elev')?.value;
        if (elevId) visElevGraf(elevId);
    });
});

// Eksport
document.getElementById('eksport-excel')?.addEventListener('click', eksporterTilExcel);
document.getElementById('eksport-pdf')?.addEventListener('click', eksporterTilPDF);

// Ferdigheits-UI (ikon og fargar)
try { leggTilFerdighetsIkoner(); fargekodFerdigheter(); } catch (e) {}

console.log('🎉 Vurderingsapp v3.0.3 fullstendig lasta!');
    const temaEl = document.getElementById('tema');
    const fokusEl = document.getElementById('fokus');
    if (temaEl) temaEl.addEventListener('input', oppdaterTekstforslag);
    if (fokusEl) fokusEl.addEventListener('change', oppdaterTekstforslag);

    oppdaterTekstforslag();
initSlettingUI();
    await oppdaterSletteKontroller();
    // Registrer service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker registrert'))
            .catch(err => console.error('Service Worker feil:', err));
    }
});

// Hent fag som array av namn (til bruk i dropdowns osv)
async function hentFagNamn() {
    if (!db) await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['fag'], 'readonly');
        const fagStore = transaction.objectStore('fag');
        const request = fagStore.getAll();

        request.onsuccess = () => {
            const fagObjekter = request.result || [];
            const fagNamn = fagObjekter.map(f => f.namn);

            // Fallback til standardFag om ingen fag finst
            if (fagNamn.length === 0) {
                resolve(standardFag);
            } else {
                resolve(fagNamn);
            }
        };

        request.onerror = () => {
            console.error('Feil ved henting av fagnamn:', request.error);
            resolve(standardFag);
        };
    });
}

// Migrer fagliste frå innstillingar til fag object store
async function migrerFaglisteTilFagStore() {
    if (!db) return;

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['fag', 'innstillinger'], 'readwrite');
        const fagStore = transaction.objectStore('fag');
        const innstillingarStore = transaction.objectStore('innstillinger');

        // Sjekk om fag object store allereie har data
        const countRequest = fagStore.count();

        countRequest.onsuccess = () => {
            if (countRequest.result > 0) {
                // Fag finst allereie, ingen migrasjon nødvendig
                console.log('✓ Fag object store har allereie data, hoppar over migrasjon');
                resolve();
                return;
            }

            // Hent fagliste frå innstillingar
            const innstillingarRequest = innstillingarStore.get('fagliste');

            innstillingarRequest.onsuccess = () => {
                let fagliste = [];

                if (innstillingarRequest.result && innstillingarRequest.result.value) {
                    fagliste = innstillingarRequest.result.value;
                    console.log('Migrerer fagliste frå innstillingar:', fagliste);
                } else {
                    // Bruk standardFag om ingen fagliste finst
                    fagliste = standardFag;
                    console.log('Ingen fagliste funne, brukar standardFag:', fagliste);
                }

                // Legg til kvar fag i fag object store
                let migrerteTal = 0;
                fagliste.forEach((fagNamn, index) => {
                    const fagObjekt = {
                        namn: fagNamn,
                        aktiv: true,
                        læreplanKopla: false
                    };

                    const addRequest = fagStore.add(fagObjekt);

                    addRequest.onsuccess = () => {
                        migrerteTal++;
                        if (migrerteTal === fagliste.length) {
                            console.log(`✓ Migrert ${migrerteTal} fag til fag object store`);
                            resolve();
                        }
                    };

                    addRequest.onerror = () => {
                        console.error(`Feil ved migrasjon av fag "${fagNamn}":`, addRequest.error);
                        migrerteTal++;
                        if (migrerteTal === fagliste.length) {
                            resolve();
                        }
                    };
                });

                // Handsam tom fagliste
                if (fagliste.length === 0) {
                    console.log('✓ Ingen fag å migrere');
                    resolve();
                }
            };

            innstillingarRequest.onerror = () => {
                console.error('Feil ved henting av fagliste:', innstillingarRequest.error);
                resolve(); // Fortsett sjølv om migrasjon feilar
            };
        };

        countRequest.onerror = () => {
            console.error('Feil ved sjekk av fag object store:', countRequest.error);
            resolve(); // Fortsett sjølv om migrasjon feilar
        };
    });
}

// Initialiser IndexedDB
async function initDB() {
    return new Promise((resolve, reject) => {
        console.log(`Opnar database: ${DB_NAME}, versjon: ${DB_VERSION}`);
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('Database feil:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = async () => {
            db = request.result;
            console.log(`✓ Database opna: ${db.name}, versjon: ${db.version}`);
            console.log('Object stores:', Array.from(db.objectStoreNames));

            // Migrer fagliste frå innstillingar til fag object store
            await migrerFaglisteTilFagStore();

            resolve();
        };
        
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            console.log(`🔄 Oppgraderer database frå versjon ${event.oldVersion} til ${event.newVersion}`);
            
            // Opprett object stores
            if (!db.objectStoreNames.contains('elever')) {
                console.log('Opprettar object store: elever');
                const elevStore = db.createObjectStore('elever', { keyPath: 'elev_id' });
                elevStore.createIndex('klasse', 'klasse', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('vurderinger')) {
                console.log('Opprettar object store: vurderinger');
                const vurdStore = db.createObjectStore('vurderinger', { keyPath: 'vurdering_id' });
                vurdStore.createIndex('elev_id', 'elev_id', { unique: false });
                vurdStore.createIndex('dato', 'dato', { unique: false });
                vurdStore.createIndex('klasse', 'klasse', { unique: false });
                vurdStore.createIndex('fag', 'fag', { unique: false });
                vurdStore.createIndex('skoleaar', 'skoleaar', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('innstillinger')) {
                console.log('Opprettar object store: innstillinger');
                db.createObjectStore('innstillinger', { keyPath: 'key' });
            }

        if (!db.objectStoreNames.contains('sluttvurderingar')) {
            console.log('Opprettar object store: sluttvurderingar');
            const store = db.createObjectStore('sluttvurderingar', { keyPath: 'id' });
            store.createIndex('elev_id', 'elev_id', { unique: false });
            store.createIndex('fag', 'fag', { unique: false });
            store.createIndex('skoleaar', 'skoleaar', { unique: false });
            store.createIndex('semester', 'semester', { unique: false });
            store.createIndex('elev_fag_skoleaar_semester', 'elev_fag_skoleaar_semester', { unique: true });
        }

        if (!db.objectStoreNames.contains('laereplaner')) {
            console.log('Opprettar object store: laereplaner');
            const store = db.createObjectStore('laereplaner', { keyPath: 'id' });
            store.createIndex('id', 'id', { unique: true });
            store.createIndex('kode', 'kode', { unique: false });
            store.createIndex('tittel', 'tittel', { unique: false });
        } else {
            console.log('✓ Object store laereplaner eksisterer allereie');
        }

        console.log('✓ Database-oppgradering fullført');
        };
    });
}

// Initialiser app komponenter
async function initApp() {
    await lastInnstillinger();

    // Migrer eksisterande data frå klasse til faggruppe
    if (typeof migrerEksisterandeData === 'function') {
        await migrerEksisterandeData();
    }

    await oppdaterSkoleaarOgSemester();
    await lastKlasser();
    await lastElever();
    visHurtigmodus();
    oppdaterHeaderInfo();
}

// Beregn skoleår og semester
function beregnSkoleaar() {
    const dato = new Date();
    const år = dato.getFullYear();
    const måned = dato.getMonth() + 1;
    
    // Skoleår starter i august
    if (måned >= 8) {
        return `${år}-${år + 1}`;
    } else {
        return `${år - 1}-${år}`;
    }
}

function beregnSemester(dato = new Date()) {
    const måned = dato.getMonth() + 1;
    // Standard: Høst = aug-des (8-12), Vår = jan-jul (1-7)
    return måned >= 8 || måned <= 1 ? 'Høst' : 'Vår';
}

async function oppdaterSkoleaarOgSemester() {
    const innstillinger = await hentInnstillinger();
    gjeldendeSkoleaar = innstillinger.gjeldende_skoleaar || beregnSkoleaar();
    
    const dato = new Date();
    const grenseMåned = innstillinger.semester_grense_mnd || 7;
    gjeldendeSemester = dato.getMonth() + 1 >= grenseMåned ? 'Høst' : 'Vår';
    
    // Oppdater alle skoleår-selects
    oppdaterSkoleaarSelects();
}

function oppdaterSkoleaarSelects() {
    const selects = [
        document.getElementById('hurtig-skoleaar'),
        document.getElementById('oversikt-skoleaar'),
        document.getElementById('historikk-skoleaar'),
        document.getElementById('gjeldende-skoleaar')
    ];
    
    const år = new Date().getFullYear();
    const skoleårListe = [];
    
    // Generer liste med skoleår (3 år bakover, nåværende, 1 år fremover)
    for (let i = -3; i <= 1; i++) {
        const startÅr = år + i;
        skoleårListe.push(`${startÅr}-${startÅr + 1}`);
    }
    
    selects.forEach(select => {
        if (!select) return;
        
        const currentValue = select.value;
        
        if (select.id === 'historikk-skoleaar') {
            select.innerHTML = '<option value="">Alle skoleår</option>';
        } else {
            select.innerHTML = '';
        }
        
        skoleårListe.forEach(skoleår => {
            const option = document.createElement('option');
            option.value = skoleår;
            option.textContent = skoleår;
            if (skoleår === gjeldendeSkoleaar) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        
        if (currentValue) {
            select.value = currentValue;
        }
    });
    
    // Sett semester
    const semesterSelect = document.getElementById('hurtig-semester');
    if (semesterSelect) {
        semesterSelect.value = gjeldendeSemester;
    }
}

function oppdaterHeaderInfo() {
    document.getElementById('skoleaar-visning').textContent = `Skoleår: ${gjeldendeSkoleaar}`;
    document.getElementById('semester-visning').textContent = `Semester: ${gjeldendeSemester}`;
}

// Event listeners
function setupEventListeners() {
    // Navigasjon
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.dataset.view;
            visView(view);
        });
    });
    
    // Hurtigmodus
    const hurtigFaggruppe = document.getElementById('hurtig-faggruppe');
    if (hurtigFaggruppe) {
        hurtigFaggruppe.addEventListener('change', (e) => {
            sisteValgteFaggruppe = e.target.value;
            visEleverIHurtigmodus(e.target.value);
        });
    }

    // Elevoversikt
    const elevoversiktFaggruppe = document.getElementById('elevoversikt-faggruppe');
    if (elevoversiktFaggruppe) {
        elevoversiktFaggruppe.addEventListener('change', async (e) => {
            await oppdaterElevSelect(e.target.value);
        });
    }

    const elevoversiktElev = document.getElementById('elevoversikt-elev');
    if (elevoversiktElev) {
        elevoversiktElev.addEventListener('change', (e) => {
            if (e.target.value) {
                visElevDetaljer(e.target.value);
            }
        });
    }

    // Klasseoversikt
    const oversiktFaggruppe = document.getElementById('oversikt-faggruppe');
    const oversiktFag = document.getElementById('oversikt-fag');
    const oversiktSkoleaar = document.getElementById('oversikt-skoleaar');
    const oversiktSemester = document.getElementById('oversikt-semester');
    const oversiktSortering = document.getElementById('oversikt-sortering');
    if (oversiktFaggruppe) oversiktFaggruppe.addEventListener('change', oppdaterKlasseoversikt);
    if (oversiktFag) oversiktFag.addEventListener('change', oppdaterKlasseoversikt);
    if (oversiktSkoleaar) oversiktSkoleaar.addEventListener('change', oppdaterKlasseoversikt);
    if (oversiktSemester) oversiktSemester.addEventListener('change', oppdaterKlasseoversikt);
    if (oversiktSortering) oversiktSortering.addEventListener('change', oppdaterKlasseoversikt);

    // Historikk
    const historikkSok = document.getElementById('historikk-sok');
    const historikkFaggruppe = document.getElementById('historikk-faggruppe');
    const historikkFag = document.getElementById('historikk-fag');
    const historikkSkoleaar = document.getElementById('historikk-skoleaar');
    const historikkSemester = document.getElementById('historikk-semester');
    const historikkFra = document.getElementById('historikk-fra');
    const historikkTil = document.getElementById('historikk-til');
    if (historikkSok) historikkSok.addEventListener('input', oppdaterHistorikk);
    if (historikkFaggruppe) historikkFaggruppe.addEventListener('change', oppdaterHistorikk);
    if (historikkFag) historikkFag.addEventListener('change', oppdaterHistorikk);
    if (historikkSkoleaar) historikkSkoleaar.addEventListener('change', oppdaterHistorikk);
    if (historikkSemester) historikkSemester.addEventListener('change', oppdaterHistorikk);
    if (historikkFra) historikkFra.addEventListener('change', oppdaterHistorikk);
    if (historikkTil) historikkTil.addEventListener('change', oppdaterHistorikk);

    // Innstillinger (ID-ar varierer mellom v2 og v3, så alt er defensivt)
    const leggTilFagV2 = document.getElementById('legg-til-fag-btn');
    const leggTilFagV3 = document.getElementById('legg-til-fag');
    if (leggTilFagV2) leggTilFagV2.addEventListener('click', leggTilFag);
    if (leggTilFagV3) leggTilFagV3.addEventListener('click', leggTilFag);

    const importCsv = document.getElementById('import-csv');
    if (importCsv) importCsv.addEventListener('change', importerEleverCSV);

    const autofToggle = document.getElementById('autoforslag-toggle');
    if (autofToggle) autofToggle.addEventListener('change', lagreAutoforslag);

    const varselDager = document.getElementById('varsel-dager') || document.getElementById('varsel-dager');
    if (varselDager) varselDager.addEventListener('change', lagreVarselDager);

    const gjeldSkoleaar = document.getElementById('gjeldende-skoleaar');
    if (gjeldSkoleaar) gjeldSkoleaar.addEventListener('change', lagreGjeldendeSkoleaar);

    const semGrense = document.getElementById('semester-grense');
    if (semGrense) semGrense.addEventListener('change', lagreSemesterGrense);

    const oppsumLen = document.getElementById('oppsummering-lengde');
    if (oppsumLen) oppsumLen.addEventListener('change', lagreOppsummeringLengde);

    // Backup/gjenopprett (v3: eksporter-data/importer-data)
    const eksportAltV2 = document.getElementById('eksporter-alt');
    const eksportAltV3 = document.getElementById('eksporter-data');
    if (eksportAltV2) eksportAltV2.addEventListener('click', eksporterAlt);
    if (eksportAltV3) eksportAltV3.addEventListener('click', eksporterAlt);

    const eksportCsvV2 = document.getElementById('eksporter-csv');
    if (eksportCsvV2) eksportCsvV2.addEventListener('click', eksporterVurderingerCSV);

    const importerBackupV2 = document.getElementById('importer-backup');
    const importerBackupV3 = document.getElementById('importer-data');
    if (importerBackupV2) importerBackupV2.addEventListener('change', importerBackup);
    if (importerBackupV3) importerBackupV3.addEventListener('change', importerBackup);

    const importerBtn = document.getElementById('importer-btn');
    if (importerBtn && importerBackupV2) {
        importerBtn.addEventListener('click', () => importerBackupV2.click());
    }

    // Modaler
    const closeBtn = document.querySelector('.close');
    if (closeBtn) closeBtn.addEventListener('click', lukkModal);
    const closeOppsumBtn = document.querySelector('.close-oppsummering');
    if (closeOppsumBtn) closeOppsumBtn.addEventListener('click', lukkOppsummeringModal);

    // Support-knapp (viser hjelpevisning)
    const supportBtn = document.getElementById('support-btn');
    if (supportBtn) supportBtn.addEventListener('click', () => visView('hjelp'));
    
    // Tastatursnarveger
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('#hurtigmodus.active') && valgtElev) {
            switch(e.key.toUpperCase()) {
                case 'H':
                    document.querySelector('.vurdering-btn.h')?.click();
                    break;
                case 'M':
                    document.querySelector('.vurdering-btn.m')?.click();
                    break;
                case 'L':
                    document.querySelector('.vurdering-btn.l')?.click();
                    break;
                case 'ENTER':
                    if (e.target.tagName !== 'TEXTAREA') {
                        e.preventDefault();
                        document.querySelector('.lagre-btn')?.click();
                    }
                    break;
            }
        }
    });
}

// Vis view
function visView(view) {
    // Oppdater navigasjon
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    // Oppdater innhold
    document.querySelectorAll('.view').forEach(section => {
        section.classList.toggle('active', section.id === view);
    });
    
    // Last inn data for valgt view
    switch(view) {
        case 'hurtigmodus':
            visHurtigmodus();
            break;
        case 'elevoversikt':
            visElevoversikt();
            break;
        case 'fagoversikt':
            oppdaterFagoversikt();
            break;
		case 'grafikk':
			try { oppdaterGrafikk(); } catch (e) {}
			break;
        case 'historikk':
            oppdaterHistorikk();
            break;
        case 'innstillinger':
            visInnstillinger();
            break;
		case 'hjelp':
			// ingen data å laste, berre vis seksjonen
			break;
    }
}

// Hurtigmodus funksjoner
async function visHurtigmodus() {
    if (sisteValgteFaggruppe) {
        document.getElementById('hurtig-faggruppe').value = sisteValgteFaggruppe;
        visEleverIHurtigmodus(sisteValgteFaggruppe);
    }
}

async function visEleverIHurtigmodus(klasse) {
    const elevListe = document.getElementById('hurtig-elevliste');
    
    if (!klasse) {
        elevListe.innerHTML = '<p>Velg en klasse først</p>';
        return;
    }
    
    const elever = await hentEleverIKlasse(klasse);
    
    if (elever.length === 0) {
        elevListe.innerHTML = '<p>Ingen elever i denne klassen</p>';
        return;
    }
    
    elevListe.innerHTML = '';
    elever.forEach((elev, index) => {
        const elevDiv = document.createElement('div');
        elevDiv.className = 'elev-item';

        // Bygg HTML med bilete om det finst
        let elevHTML = '<div class="elev-item-content">';

        // Elevbilete
        if (elev.bilete) {
            if (elev.bileteType === 'application/pdf') {
                elevHTML += '<div class="elev-bilete pdf-ikon">📄</div>';
            } else {
                elevHTML += `<img src="${elev.bilete}" class="elev-bilete" alt="${elev.fornavn} ${elev.etternavn}">`;
            }
        } else {
            elevHTML += '<div class="elev-bilete placeholder">👤</div>';
        }

        // Elevnamn
        elevHTML += `<span class="elev-namn">${elev.fornavn} ${elev.etternavn}</span>`;

        // Last opp bilete-knapp
        elevHTML += `<button class="btn-mini last-opp-bilete-btn" onclick="event.stopPropagation(); visLastOppBileteDialog('${elev.elev_id}', '${elev.fornavn} ${elev.etternavn}')" title="Last opp bilete">📷</button>`;

        elevHTML += '</div>';

        elevDiv.innerHTML = elevHTML;
        elevDiv.onclick = () => velgElev(elev, index);
        elevListe.appendChild(elevDiv);
    });
}

function velgElev(elev, index) {
    valgtElev = elev;
    
    // Oppdater UI
    document.querySelectorAll('.elev-item').forEach((item, i) => {
        item.classList.toggle('valgt', i === index);
        item.classList.toggle('neste', i === index + 1);
    });
    
    // Vis vurderingsskjema
    visVurderingsskjema();
}

async function visVurderingsskjema() {
    const skjema = document.getElementById('hurtig-skjema');
    const fagliste = await hentFagNamn();

    skjema.innerHTML = `
        <h4>${valgtElev.fornavn} ${valgtElev.etternavn}</h4>

        <div class="skjema-gruppe">
            <label>Fag:</label>
            <select id="vurd-fag">
                <option value="">-- Velg fag --</option>
                ${fagliste.map(fag => `<option value="${fag}">${fag}</option>`).join('')}
            </select>
        </div>
        
        <div class="skjema-gruppe">
            <label>Tema (valgfritt):</label>
            <input type="text" id="vurd-tema" placeholder="Kort beskrivelse av tema">
        </div>
        
        
        
        <div class="skjema-gruppe">
            <label>Dato:</label>
            <input type="date" id="vurd-dato" value="${new Date().toISOString().split('T')[0]}">
        </div>
        
        <div class="skjema-gruppe">
            <label>Hovedvurdering:</label>
            <div class="vurdering-knapper">
                <button class="vurdering-btn h" data-vurd="H">H</button>
                <button class="vurdering-btn m" data-vurd="M">M</button>
                <button class="vurdering-btn l" data-vurd="L">L</button>
            </div>
        </div>
        
        <div class="skjema-gruppe">
            <label>Kommentar (valgfritt):</label>
            <textarea id="vurd-kommentar" placeholder="Maks 500 tegn" maxlength="500"></textarea>
        </div>

        <div class="skjema-gruppe" id="kjerneelement-gruppe" style="display:none;">
            <label>Kjerneelement (valgfritt):</label>
            <select id="kjerneelement">
                <option value="">Ingen</option>
            </select>
        </div>

        <div class="skjema-gruppe">
            <label>Kompetansemål (valgfritt):</label>
            <select id="kompetansemaal">
                <option value="">Ingen</option>
            </select>
            <div id="verb-hjelp" class="verb-hjelp" style="display:none;"></div>
        </div>

        <div class="skjema-gruppe">
            <label>Grunnferdigheit (valgfritt):</label>
            <select id="grunnferdigheit">
                <option value="">Ingen</option>
            </select>
        </div>
        
        <div class="ferdigheter-velger">
            <h4>Hvilke ferdigheter vurderer du? (valgfritt)</h4>
            <div class="ferdigheter-checkbox">
                ${ferdigheter.map(f => `
                    <label>
                        <input type="checkbox" value="${f.id}" class="ferdighet-check">
                        ${f.navn}
                    </label>
                `).join('')}
            </div>
        </div>
        
        <div id="valgte-ferdigheter-panel" style="display:none;" class="ferdigheter-panel">
            <h4>Vurder valgte ferdigheter:</h4>
            <div id="valgte-ferdigheter-innhold"></div>
        </div>
        
        <button class="lagre-btn" onclick="lagreHurtigvurdering()">💾 Lagre vurdering</button>
    `;
    
    // Sett sist valgte fag
    if (sisteValgteFag) {
        document.getElementById('vurd-fag').value = sisteValgteFag;
    }
    
    // Oppdater kompetansemål når fag endres
    document.getElementById('vurd-fag').addEventListener('change', async () => {
        sisteValgteFag = document.getElementById('vurd-fag').value;
        await oppdaterKompetansemaalDropdown();
    });
    
    // Initialiser kompetansemål for allerede valgt fag
    if (sisteValgteFag) {
        await oppdaterKompetansemaalDropdown();
    }
    
    

// Læreplanstyrte val
async function oppdaterLaereplanVal() {
    const innstillinger2 = await hentInnstillinger();
    const fag2 = document.getElementById("vurd-fag").value;
    const lp = hentLaereplanForFag(fag2, innstillinger2);

    const keGrp = document.getElementById("kjerneelement-gruppe");
    const keSel = document.getElementById("kjerneelement");
    const kmSel = document.getElementById("kompetansemaal");
    const gfSel = document.getElementById("grunnferdigheit");

    if (lp) {
        if (keGrp) keGrp.style.display = (lp.kjerneelement && lp.kjerneelement.length) ? "block" : "none";
        fyllSelect(keSel, lp.kjerneelement || [], `${lp.id || fag2}::k::`);
        fyllSelect(kmSel, lp.kompetansemaal || [], `${lp.id || fag2}::m::`);
        fyllSelect(gfSel, lp.grunnferdigheter || [], `${lp.id || fag2}::g::`);
    } else {
        if (keGrp) keGrp.style.display = "none";
        fyllSelect(keSel, [], "");
        fyllSelect(kmSel, [], "");
        fyllSelect(gfSel, [], "");
    }

    oppdaterVerbHjelp();
    oppdaterAutoKommentarVedEndring();
}

document.getElementById("vurd-fag").addEventListener("change", async () => {
    sisteValgteFag = document.getElementById("vurd-fag").value;
    await oppdaterLaereplanVal();
});

await oppdaterLaereplanVal();

const kmSel = document.getElementById("kompetansemaal");
const kommentarEl = document.getElementById("vurd-kommentar");
if (kommentarEl) {
    kommentarEl.addEventListener("input", () => {
        if (kommentarEl.value !== sisteAutoKommentar) {
            kommentarErAuto = false;
        }
    });
}
if (kmSel) {
    kmSel.addEventListener("change", () => {
        oppdaterVerbHjelp();
        oppdaterAutoKommentarVedEndring();
    });
}

// Event listeners for vurderingsknapper
    document.querySelectorAll('.vurdering-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.vurdering-btn').forEach(b => b.classList.remove('valgt'));
            e.target.classList.add('valgt');
            valtHML = e.target.dataset.vurd;
            oppdaterFerdighetsforslag();
            oppdaterAutoKommentarVedEndring();
        });
    });
    
    // Event listener for ferdighetsvelger
    document.querySelectorAll('.ferdighet-check').forEach(check => {
        check.addEventListener('change', oppdaterValgteFerdigheter);
    });
}

async function oppdaterValgteFerdigheter() {
    const valgteFerdigheter = [];
    document.querySelectorAll('.ferdighet-check:checked').forEach(check => {
        valgteFerdigheter.push(check.value);
    });
    
    const panel = document.getElementById('valgte-ferdigheter-panel');
    const innhold = document.getElementById('valgte-ferdigheter-innhold');
    
    if (valgteFerdigheter.length > 0) {
        panel.style.display = 'block';
        
        innhold.innerHTML = valgteFerdigheter.map(fId => {
            const ferdighet = ferdigheter.find(f => f.id === fId);
            return `
                <div class="ferdighet-rad">
                    <span class="ferdighet-label">${ferdighet.navn}</span>
                    <div class="ferdighet-knapper">
                        <button class="ferdighet-btn" data-ferdighet="${fId}" data-verdi="H">H</button>
                        <button class="ferdighet-btn" data-ferdighet="${fId}" data-verdi="M">M</button>
                        <button class="ferdighet-btn" data-ferdighet="${fId}" data-verdi="L">L</button>
                        <button class="ferdighet-btn valgt" data-ferdighet="${fId}" data-verdi="ikke_vurdert">
                            Ikke vurdert
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Event listeners for ferdighetsknapper
        innhold.querySelectorAll('.ferdighet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ferdighet = e.target.dataset.ferdighet;
                innhold.querySelectorAll(`.ferdighet-btn[data-ferdighet="${ferdighet}"]`)
                    .forEach(b => b.classList.remove('valgt'));
                e.target.classList.add('valgt');
            });
        });
        
        oppdaterFerdighetsforslag();
    } else {
        panel.style.display = 'none';
    }
}

async function oppdaterFerdighetsforslag() {
    const hovedvurdering = document.querySelector('.vurdering-btn.valgt')?.dataset.vurd;
    if (!hovedvurdering) return;
    
    const innstillinger = await hentInnstillinger();
    if (!innstillinger.autoforslag) return;
    
    const forslag = autoforslagRegler[hovedvurdering];
    if (!forslag) return;
    
    // Oppdater kun valgte ferdigheter
    document.querySelectorAll('.ferdighet-check:checked').forEach(check => {
        const fId = check.value;
        const verdi = forslag[fId] || 'ikke_vurdert';
        
        const knapper = document.querySelectorAll(`.ferdighet-btn[data-ferdighet="${fId}"]`);
        knapper.forEach(btn => {
            btn.classList.toggle('valgt', btn.dataset.verdi === verdi);
        });
    });
}

async function lagreHurtigvurdering() {
    const fag = document.getElementById('vurd-fag').value;
    const tema = document.getElementById('vurd-tema').value;
    const dato = document.getElementById('vurd-dato').value;
    const kommentar = document.getElementById('vurd-kommentar').value;
    const hovedvurdering = document.querySelector('.vurdering-btn.valgt')?.dataset.vurd;
    const skoleaar = document.getElementById('hurtig-skoleaar').value;
    const semester = document.getElementById('hurtig-semester').value;
    
    // Validering
    if (!fag || !hovedvurdering) {
        visToast('Velg fag og hovedvurdering!', 'error');
        return;
    }
    
    // Hent valgte ferdigheter
    const valgteFerdigheter = [];
    document.querySelectorAll('.ferdighet-check:checked').forEach(check => {
        valgteFerdigheter.push(check.value);
    });
    
    // Bygg ferdigheter objekt
    const ferdighetsvurdering = {};
    ferdigheter.forEach(f => {
        if (valgteFerdigheter.includes(f.id)) {
            const valgtBtn = document.querySelector(`.ferdighet-btn.valgt[data-ferdighet="${f.id}"]`);
            ferdighetsvurdering[f.id] = valgtBtn ? valgtBtn.dataset.verdi : 'ikke_vurdert';
        } else {
            ferdighetsvurdering[f.id] = 'ikke_vurdert';
        }
    });
    


// Hent pedagogiske val med både id og full tekst
const keSel = document.getElementById("kjerneelement");
const kmSel2 = document.getElementById("kompetansemaal");
const gfSel2 = document.getElementById("grunnferdigheit");

const keOpt = keSel && keSel.selectedOptions && keSel.selectedOptions[0] ? keSel.selectedOptions[0] : null;
const kmOpt = kmSel2 && kmSel2.selectedOptions && kmSel2.selectedOptions[0] ? kmSel2.selectedOptions[0] : null;
const gfOpt = gfSel2 && gfSel2.selectedOptions && gfSel2.selectedOptions[0] ? gfSel2.selectedOptions[0] : null;

const kjerneelement_id = keOpt ? (keOpt.value || "") : "";
const kjerneelement_tekst = keOpt ? (keOpt.title || "") : "";
const kompetansemaal_id = kmOpt ? (kmOpt.value || "") : "";
const kompetansemaal_tekst = kmOpt ? (kmOpt.title || "") : "";
const grunnferdigheit_id = gfOpt ? (gfOpt.value || "") : "";
const grunnferdigheit_tekst = gfOpt ? (gfOpt.title || "") : "";
const verb_funn = finnVerbaItekst(kompetansemaal_tekst);

    // Opprett vurdering
    const vurdering = {
        tema: (document.getElementById('tema') ? document.getElementById('tema').value.trim() : ''),
        fokus: (document.getElementById('fokus') ? document.getElementById('fokus').value : ''),
        vurdering_id: genererID(),
        elev_id: valgtElev.elev_id,
        faggruppe: valgtElev.faggruppe,
        fag: fag,
        skoleaar: skoleaar,
        semester: semester,
        dato: dato,
        tema: tema,
        hovedvurdering: hovedvurdering,
        kommentar: kommentar,
        valgte_ferdigheter: valgteFerdigheter,
        ferdigheter: ferdighetsvurdering,

        // Pedagogiske felt
        kjerneelement_id: kjerneelement_id,
        kjerneelement_tekst: kjerneelement_tekst,
        kompetansemaal_id: kompetansemaal_id,
        kompetansemaal_tekst: kompetansemaal_tekst,
        grunnferdigheit_id: grunnferdigheit_id,
        grunnferdigheit_tekst: grunnferdigheit_tekst,
        verb_funn: verb_funn,

        opprettet: new Date().toISOString()
    };
    
    // Lagre i database
    await lagreVurdering(vurdering);
    
    // Oppdater UI
    sisteValgteFag = fag;
    visToast('Vurdering lagret! ✓', 'success');
    
    // Reset skjema og gå til neste elev
    document.getElementById('vurd-tema').value = '';
    document.getElementById('vurd-kommentar').value = '';
    const keSel3 = document.getElementById('kjerneelement');
    const kmSel3 = document.getElementById('kompetansemaal');
    const gfSel3 = document.getElementById('grunnferdigheit');
    if (keSel3) keSel3.value = '';
    if (kmSel3) kmSel3.value = '';
    if (gfSel3) gfSel3.value = '';
    const vh = document.getElementById('verb-hjelp');
    if (vh) { vh.style.display = 'none'; vh.innerHTML = ''; }
    valtHML = '';
    kommentarErAuto = false;
    sisteAutoKommentar = '';
    document.querySelectorAll('.vurdering-btn').forEach(btn => btn.classList.remove('valgt'));
    document.querySelectorAll('.ferdighet-check').forEach(check => check.checked = false);
    document.getElementById('valgte-ferdigheter-panel').style.display = 'none';
    
    // Marker neste elev
    const elevItems = document.querySelectorAll('.elev-item');
    const currentIndex = Array.from(elevItems).findIndex(item => item.classList.contains('valgt'));
    if (currentIndex < elevItems.length - 1) {
        elevItems[currentIndex + 1].click();
    }
}
// Elevoversikt funksjoner
async function visElevoversikt() {
    await lastKlasser();
}

async function oppdaterElevSelect(klasse) {
    const elevSelect = document.getElementById('elevoversikt-elev');
    
    if (!klasse) {
        elevSelect.innerHTML = '<option value="">-- Velg elev --</option>';
        return;
    }
    
    const elever = await hentEleverIKlasse(klasse);
    
    elevSelect.innerHTML = '<option value="">-- Velg elev --</option>';
    elever.forEach(elev => {
        const option = document.createElement('option');
        option.value = elev.elev_id;
        option.textContent = `${elev.fornavn} ${elev.etternavn}`;
        elevSelect.appendChild(option);
    });
}

async function visElevDetaljer(elevId) {
    const elev = await hentElev(elevId);
    const vurderinger = await hentElevVurderinger(elevId);
    const innstillinger = await hentInnstillinger();
    
    // Grupper vurderinger per fag
    const vurderingerPerFag = {};
    vurderinger.forEach(v => {
        if (!vurderingerPerFag[v.fag]) {
            vurderingerPerFag[v.fag] = [];
        }
        vurderingerPerFag[v.fag].push(v);
    });
    
    // Sorter vurderinger i hvert fag etter dato (nyeste først)
    Object.keys(vurderingerPerFag).forEach(fag => {
        vurderingerPerFag[fag].sort((a, b) => new Date(b.dato) - new Date(a.dato));
    });
    
    const detaljerDiv = document.getElementById('elev-detaljer');

    detaljerDiv.innerHTML = `
        <h2>${elev.fornavn} ${elev.etternavn} - ${elev.faggruppe}</h2>
        
        <div class="fag-accordion">
            ${Object.keys(vurderingerPerFag).map(fag => {
                const fagVurderinger = vurderingerPerFag[fag];
                const sisteVurdering = fagVurderinger[0];
                const antallVurderinger = fagVurderinger.length;
                
                return `
                    <div class="fag-item">
                        <div class="fag-header" onclick="toggleFag('${fag}')">
                            <h3>${fag}</h3>
                            <div class="fag-status">
                                <span>Sist: ${formatDato(sisteVurdering.dato)}</span>
                                <span class="vurdering-badge ${sisteVurdering.hovedvurdering.toLowerCase()}">
                                    ${sisteVurdering.hovedvurdering}
                                </span>
                                <span>${antallVurderinger} vurdering${antallVurderinger > 1 ? 'er' : ''}</span>
                            </div>
                        </div>
                        
                        <div class="fag-innhold" id="fag-${fag}">
                            <div style="margin-bottom: 1rem;">
                                <button class="btn-success" onclick="genererFagoppsummering('${elevId}', '${fag}')">
                                    📝 Generer fagoppsummering
                                </button>
                                <button class="btn-primary btn-small" onclick="nyVurderingForElevFag('${elevId}', '${fag}')">
                                    + Ny vurdering
                                </button>
                            </div>
                            
                            <div class="vurdering-tidslinje">
                                ${fagVurderinger.map(v => `
                                    <div class="tidslinje-item">
                                        <div class="tidslinje-header">
                                            <strong>${formatDato(v.dato)}</strong>
                                            <span>${v.skoleaar} ${v.semester}</span>
                                            <span class="vurdering-badge ${v.hovedvurdering.toLowerCase()}">
                                                ${v.hovedvurdering}
                                            </span>
                                        </div>
                                        ${v.tema ? `<div><strong>Tema:</strong> ${v.tema}</div>` : ''}
                                        
                                        <button onclick="toggleDetaljer('${v.vurdering_id}')" class="btn-small">
                                            Vis mer
                                        </button>
                                        
                                        <div class="tidslinje-detaljer" id="detaljer-${v.vurdering_id}">
                                            ${v.kommentar ? `<p><strong>Kommentar:</strong> ${v.kommentar}</p>` : ''}
                                            ${v.valgte_ferdigheter && v.valgte_ferdigheter.length > 0 ? `
                                                <p><strong>Vurderte ferdigheter:</strong></p>
                                                <ul>
                                                    ${v.valgte_ferdigheter.map(fId => {
                                                        const ferdighet = ferdigheter.find(f => f.id === fId);
                                                        const vurdering = v.ferdigheter[fId];
                                                        return `<li>${ferdighet.navn}: ${vurdering}</li>`;
                                                    }).join('')}
                                                </ul>
                                            ` : ''}
                                            <button onclick="redigerVurdering('${v.vurdering_id}')" class="btn-small">
                                                Rediger
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        ${Object.keys(vurderingerPerFag).length === 0 ? '<p>Ingen vurderinger registrert ennå.</p>' : ''}
    `;
}

// Toggle funksjoner for UI
function toggleFag(fag) {
    const innhold = document.getElementById(`fag-${fag}`);
    innhold.classList.toggle('aktiv');
}

function toggleDetaljer(vurderingId) {
    const detaljer = document.getElementById(`detaljer-${vurderingId}`);
    detaljer.classList.toggle('vis');
}

// Generer fagoppsummering
async function genererFagoppsummering(elevId, fag) {
    const elev = await hentElev(elevId);
    const vurderinger = await hentElevVurderinger(elevId);
    const fagVurderinger = vurderinger.filter(v => v.fag === fag);
    const innstillinger = await hentInnstillinger();
    const lengde = innstillinger.oppsummering_lengde || 'kort';
    
    if (fagVurderinger.length === 0) {
        visToast('Ingen vurderinger å basere oppsummering på', 'error');
        return;
    }
    
    // Analyser vurderinger
    const hovedvurderinger = fagVurderinger.map(v => v.hovedvurdering);
    const flestH = hovedvurderinger.filter(v => v === 'H').length;
    const flestM = hovedvurderinger.filter(v => v === 'M').length;
    const flestL = hovedvurderinger.filter(v => v === 'L').length;
    
    // Finn dominerende nivå
    let nivå = 'middels';
    if (flestH > flestM && flestH > flestL) nivå = 'høg';
    if (flestL > flestM && flestL > flestH) nivå = 'låg';
    
    // Samle tema og kommentarer
    const temaer = [...new Set(fagVurderinger.filter(v => v.tema).map(v => v.tema))];
    const kommentarer = fagVurderinger.filter(v => v.kommentar).map(v => v.kommentar);
    
    // Analyser ferdigheter
    const ferdighetsvurderinger = {};
    ferdigheter.forEach(f => {
        ferdighetsvurderinger[f.id] = [];
    });
    
    fagVurderinger.forEach(v => {
        if (v.valgte_ferdigheter) {
            v.valgte_ferdigheter.forEach(fId => {
                if (v.ferdigheter[fId] && v.ferdigheter[fId] !== 'ikke_vurdert') {
                    ferdighetsvurderinger[fId].push(v.ferdigheter[fId]);
                }
            });
        }
    });
    
    // Generer oppsummeringstekst
    let oppsummering = '';
    
    // Hoveddel
    if (nivå === 'høg') {
        oppsummering = `Du viser svært god kompetanse i ${fag}. `;
        oppsummering += `Gjennom skuleåret har du vist solid forståing`;
        if (temaer.length > 0) {
            oppsummering += ` for emne som ${temaer.slice(0, 2).join(' og ')}`;
        }
        oppsummering += `. Du meistrar faget godt og viser god evne til å anvende kunnskapen. `;
    } else if (nivå === 'låg') {
        oppsummering = `Du har potensial til å utvikle deg vidare i ${fag}. `;
        oppsummering += `Du viser grunnleggande forståing`;
        if (temaer.length > 0) {
            oppsummering += ` for ${temaer[0]}`;
        }
        oppsummering += `, men treng meir øving for å nå høgare kompetansenivå. `;
    } else {
        oppsummering = `Du viser god kompetanse i ${fag}. `;
        oppsummering += `Du har arbeidd med`;
        if (temaer.length > 0) {
            oppsummering += ` tema som ${temaer.slice(0, 2).join(' og ')}`;
        } else {
            oppsummering += ` fleire tema i faget`;
        }
        oppsummering += ` og viser jevn innsats. `;
    }
    
    // Ferdigheter (om dei er vurderte)
    const vurderteFerdigheter = [];
    Object.keys(ferdighetsvurderinger).forEach(fId => {
        if (ferdighetsvurderinger[fId].length > 0) {
            const ferdighet = ferdigheter.find(f => f.id === fId);
            const mestH = ferdighetsvurderinger[fId].filter(v => v === 'H').length;
            const mestM = ferdighetsvurderinger[fId].filter(v => v === 'M').length;
            const mestL = ferdighetsvurderinger[fId].filter(v => v === 'L').length;
            
            let ferdighetNivå = 'middels';
            if (mestH > mestM && mestH > mestL) ferdighetNivå = 'god';
            if (mestL > mestM && mestL > mestH) ferdighetNivå = 'utviklingspotensial i';
            
            vurderteFerdigheter.push({ navn: ferdighet.navn.toLowerCase(), nivå: ferdighetNivå });
        }
    });
    
    if (vurderteFerdigheter.length > 0) {
        oppsummering += `Når det gjeld grunnleggande ferdigheiter, viser du `;
        oppsummering += vurderteFerdigheter.map(f => `${f.nivå} ${f.navn}`).join(', ');
        oppsummering += '. ';
    }
    
    // Framovermelding
    if (nivå === 'høg') {
        oppsummering += `Hald fram det gode arbeidet og utfordre deg sjølv med meir avanserte oppgåver. `;
    } else if (nivå === 'låg') {
        oppsummering += `Du bør jobbe meir med grunnleggande omgrep og øve regelmessig på fagstoffet. Ta kontakt om du treng ekstra hjelp. `;
    } else {
        oppsummering += `For å nå neste nivå bør du arbeide meir sjølvstendig med fagstoffet og delta meir aktivt i undervisninga. `;
    }
    
    // Tilpass lengde
    if (lengde === 'kort' && oppsummering.length > 500) {
        oppsummering = oppsummering.substring(0, 497) + '...';
    } else if (lengde === 'medium' && oppsummering.length < 700) {
        // Legg til meir detaljer om nødvendig
        if (kommentarer.length > 0) {
            oppsummering += `Tidlegare tilbakemeldingar har peikt på at ${kommentarer[0].toLowerCase()}. `;
        }
    }
    
    // Vis i modal
    visOppsummeringModal(oppsummering, elev, fag);
}

function visOppsummeringModal(tekst, elev, fag) {
    const modal = document.getElementById('oppsummering-modal');
    const innhold = document.getElementById('oppsummering-innhold');
    
    innhold.innerHTML = `
        <h3>${elev.fornavn} ${elev.etternavn} - ${fag}</h3>
        
        <div class="oppsummering-kontroller">
            <select id="oppsummering-filter">
                <option value="alle">Alle vurderinger</option>
                <option value="30">Siste 30 dager</option>
                <option value="90">Siste 90 dager</option>
                <option value="semester">Dette semesteret</option>
            </select>
            <button onclick="kopierOppsummering()" class="btn-success">📋 Kopier</button>
        </div>
        
        <textarea class="oppsummering-tekstfelt" id="oppsummering-tekst">${tekst}</textarea>
        
        <p class="hjelpetekst">
            Teksten kan redigerast før kopiering. 
            Lengde: <span id="tegn-teller">${tekst.length}</span> tegn
        </p>
    `;
    
    // Oppdater tegnteller ved endring
    document.getElementById('oppsummering-tekst').addEventListener('input', (e) => {
        document.getElementById('tegn-teller').textContent = e.target.value.length;
    });
    
    modal.style.display = 'block';
}

function kopierOppsummering() {
    const tekst = document.getElementById('oppsummering-tekst');
    tekst.select();
    document.execCommand('copy');
    visToast('Oppsummering kopiert til utklippstavle!', 'success');
}

function lukkOppsummeringModal() {
    document.getElementById('oppsummering-modal').style.display = 'none';
}

// Klasseoversikt funksjoner
// KOMMENTERT UT: Denne funksjonen kolliderte med oppdaterFagoversikt() i enhancements.js
// og forårsaka null-referanse feil. Elementane den prøvde å lese finst ikkje i HTML.
/*
async function oppdaterElevoversikt() {
    const klasseSel = document.getElementById('oversikt-faggruppe');
    const fagSel = document.getElementById('oversikt-fag');
    const skoleaarSel = document.getElementById('oversikt-skoleaar');
    const semesterSel = document.getElementById('oversikt-semester');
    const sorteringSel = document.getElementById('oversikt-sortering');
    const tabell = document.getElementById('oversikt-tabell');

    // Null-sjekk - returner om vi ikkje er i elevoversikt-view
    if (!klasseSel || !fagSel || !tabell) {
        return;
    }

    const klasse = klasseSel.value;
    const fag = fagSel.value;
    const skoleaar = skoleaarSel ? skoleaarSel.value : '';
    const semester = semesterSel ? semesterSel.value : '';
    const sortering = sorteringSel ? sorteringSel.value : 'etternavn';

    // Oppdater fagliste
    await oppdaterFagSelect();

    if (!klasse || !fag) {
        tabell.innerHTML = '<p>Velg klasse og fag</p>';
        return;
    }

    const elever = await hentEleverIKlasse(klasse);
    const alleVurderinger = await hentAlleVurderinger();
    const innstillinger = await hentInnstillinger();
    const varselDager = innstillinger.varselDager || 30;

    // Filtrer vurderinger
    const vurderinger = alleVurderinger.filter(v => {
        if (v.fag !== fag) return false;
        if (skoleaar && v.skoleaar !== skoleaar) return false;
        if (semester && v.semester !== semester) return false;
        return true;
    });

    // Bygg oversiktsdata
    const oversiktData = elever.map(elev => {
        const elevVurderinger = vurderinger.filter(v => v.elev_id === elev.elev_id);
        const sisteVurdering = elevVurderinger.sort((a, b) => new Date(b.dato) - new Date(a.dato))[0];

        return {
            elev: elev,
            sisteVurdering: sisteVurdering,
            dagerSiden: sisteVurdering ?
                Math.floor((new Date() - new Date(sisteVurdering.dato)) / (1000 * 60 * 60 * 24)) :
                999
        };
    });

    // Sorter data
    oversiktData.sort((a, b) => {
        switch(sortering) {
            case 'navn':
                return `${a.elev.etternavn} ${a.elev.fornavn}`.localeCompare(
                    `${b.elev.etternavn} ${b.elev.fornavn}`
                );
            case 'dato':
                return b.dagerSiden - a.dagerSiden;
            case 'vurdering':
                const order = { 'H': 0, 'M': 1, 'L': 2, null: 3 };
                return order[a.sisteVurdering?.hovedvurdering] - order[b.sisteVurdering?.hovedvurdering];
            default:
                return 0;
        }
    });

    // Generer tabell
    tabell.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Elev</th>
                    <th>Sist vurdert</th>
                    <th>Vurdering</th>
                    <th>Tema</th>
                    <th>Handlingar</th>
                </tr>
            </thead>
            <tbody>
                ${oversiktData.map(data => {
                    const manglerVurdering = data.dagerSiden > varselDager;
                    const klasse = manglerVurdering ? 'mangler-vurdering' : '';

                    return `
                        <tr class="${klasse}">
                            <td><strong>${data.elev.fornavn} ${data.elev.etternavn}</strong></td>
                            <td>${data.sisteVurdering ?
                                `${formatDato(data.sisteVurdering.dato)} (${data.dagerSiden} dager siden)` :
                                'Aldri vurdert'
                            }</td>
                            <td>${data.sisteVurdering ?
                                `<span class="vurdering-badge ${data.sisteVurdering.hovedvurdering.toLowerCase()}">
                                    ${data.sisteVurdering.hovedvurdering}
                                </span>` :
                                '-'
                            }</td>
                            <td>${data.sisteVurdering?.tema || '-'}</td>
                            <td>
                                <button onclick="nyVurderingForElevFag('${data.elev.elev_id}', '${fag}')">
                                    Ny vurdering
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}
*/

async function oppdaterFagSelect() {
    const fagliste = await hentFagNamn();
    const fagSelect = document.getElementById('oversikt-fag');
    const currentFag = fagSelect.value;

    fagSelect.innerHTML = '<option value="">-- Velg fag --</option>';
    fagliste.forEach(fag => {
        const option = document.createElement('option');
        option.value = fag;
        option.textContent = fag;
        fagSelect.appendChild(option);
    });

    if (currentFag) {
        fagSelect.value = currentFag;
    }
}

function nyVurderingForElevFag(elevId, fag) {
    // Gå til hurtigmodus med forhåndsvalgt elev og fag
    visView('hurtigmodus');
    sisteValgteFag = fag;
    
    setTimeout(async () => {
        const elev = await hentElev(elevId);
        document.getElementById('hurtig-faggruppe').value = elev.faggruppe;
        await visEleverIHurtigmodus(elev.faggruppe);
        
        // Finn og klikk på eleven
        const elevItems = document.querySelectorAll('.elev-item');
        elevItems.forEach((item, index) => {
            if (item.textContent === `${elev.fornavn} ${elev.etternavn}`) {
                item.click();
            }
        });
    }, 100);
}

// Historikk funksjoner
async function oppdaterHistorikk() {
    const sok = document.getElementById('historikk-sok').value.toLowerCase();
    const klasseFilter = document.getElementById('historikk-faggruppe').value;
    const fagFilter = document.getElementById('historikk-fag').value;
    const skoleaarFilter = document.getElementById('historikk-skoleaar').value;
    const semesterFilter = document.getElementById('historikk-semester').value;
    const fraDate = document.getElementById('historikk-fra').value;
    const tilDate = document.getElementById('historikk-til').value;
    
    let vurderinger = await hentAlleVurderinger();
    const elever = await hentAlleElever();
    
    // Filtrer vurderinger
    vurderinger = vurderinger.filter(v => {
        // Søkefilter
        if (sok) {
            const elev = elever.find(e => e.elev_id === v.elev_id);
            const elevNavn = elev ? `${elev.fornavn} ${elev.etternavn}`.toLowerCase() : '';
            if (!elevNavn.includes(sok) && 
                !v.tema?.toLowerCase().includes(sok) && 
                !v.kommentar?.toLowerCase().includes(sok)) {
                return false;
            }
        }
        
        // Andre filtre
        if (klasseFilter && v.faggruppe !== klasseFilter) return false;
        if (fagFilter && v.fag !== fagFilter) return false;
        if (skoleaarFilter && v.skoleaar !== skoleaarFilter) return false;
        if (semesterFilter && v.semester !== semesterFilter) return false;
        if (fraDate && v.dato < fraDate) return false;
        if (tilDate && v.dato > tilDate) return false;
        
        return true;
    });
    
    // Sorter etter dato (nyeste først)
    vurderinger.sort((a, b) => new Date(b.dato) - new Date(a.dato));
    
    // Vis resultater
    const liste = document.getElementById('historikk-liste');
    
    if (vurderinger.length === 0) {
        liste.innerHTML = '<p>Ingen vurderinger funnet</p>';
        return;
    }
    
    liste.innerHTML = vurderinger.map(v => {
        const elev = elever.find(e => e.elev_id === v.elev_id);
        const elevNavn = elev ? `${elev.fornavn} ${elev.etternavn}` : 'Ukjent elev';
        
        return `
            <div class="historikk-item">
                <div class="historikk-header">
                    <span class="historikk-elev">${elevNavn}</span>
                    <span class="historikk-dato">${formatDato(v.dato)}</span>
                </div>
                <div class="historikk-detaljer">
                    <span>Faggruppe: ${v.faggruppe}</span>
                    <span>Fag: ${v.fag}</span>
                    <span>${v.skoleaar || ''} ${v.semester || ''}</span>
                    <span class="vurdering-badge ${v.hovedvurdering.toLowerCase()}">
                        ${v.hovedvurdering}
                    </span>
                    ${v.tema ? `<span>Tema: ${v.tema}</span>` : ''}
                </div>
                ${(v.kjerneelement_tekst || v.kompetansemaal_tekst || v.grunnferdigheit_tekst) ? `
                    <div class="pedagogikk-boks">
                        ${v.kjerneelement_tekst ? `<div>🎯 <strong>Kjerneelement:</strong> ${v.kjerneelement_tekst}</div>` : ''}
                        ${v.kompetansemaal_tekst ? `<div>📌 <strong>Kompetansemål:</strong> ${v.kompetansemaal_tekst}</div>` : ''}
                        ${v.grunnferdigheit_tekst ? `<div>🧩 <strong>Grunnferdigheit:</strong> ${v.grunnferdigheit_tekst}</div>` : ''}
                    </div>
                ` : ''}
                ${v.kommentar ? `<p style="margin-top: 0.5rem;">${v.kommentar}</p>` : ''}
                <button onclick="redigerVurdering('${v.vurdering_id}')" style="margin-top: 0.5rem;">
                    Rediger detaljer
                </button>
            </div>
        `;
    }).join('');
    
    // Oppdater filterlister
    await oppdaterFilterlister();
}

async function oppdaterFilterlister() {
    const vurderinger = await hentAlleVurderinger();
    const innstillinger = await hentInnstillinger();
    
    // Oppdater fagfilter
    const fagSelect = document.getElementById('historikk-fag');
    const currentFag = fagSelect.value;
    
    fagSelect.innerHTML = '<option value="">Alle fag</option>';
    const brukteFag = [...new Set(vurderinger.map(v => v.fag))];
    brukteFag.sort().forEach(fag => {
        const option = document.createElement('option');
        option.value = fag;
        option.textContent = fag;
        fagSelect.appendChild(option);
    });
    
    if (currentFag) {
        fagSelect.value = currentFag;
    }
}

// Modal for redigering
async function redigerVurdering(vurderingId) {
    const vurdering = await hentVurdering(vurderingId);
    const elev = await hentElev(vurdering.elev_id);
    const fagliste = await hentFagNamn();
    
    const modal = document.getElementById('detalj-modal');
    const innhold = document.getElementById('detalj-innhold');
    
    innhold.innerHTML = `
        <h3>${elev.fornavn} ${elev.etternavn}</h3>
        <p><strong>Dato:</strong> ${formatDato(vurdering.dato)}</p>
        <p><strong>Fag:</strong> ${vurdering.fag}</p>
        <p><strong>Skoleår:</strong> ${vurdering.skoleaar} ${vurdering.semester}</p>
        <p><strong>Hovedvurdering:</strong> 
            <span class="vurdering-badge ${vurdering.hovedvurdering.toLowerCase()}">
                ${vurdering.hovedvurdering}
            </span>
        </p>
        
        <div class="skjema-gruppe">
            <label>Tema:</label>
            <input type="text" id="rediger-tema" value="${vurdering.tema || ''}">
        </div>
        
        <div class="skjema-gruppe">
            <label>Kommentar:</label>
            <textarea id="rediger-kommentar" maxlength="500">${vurdering.kommentar || ''}</textarea>
        </div>
        
        ${vurdering.valgte_ferdigheter && vurdering.valgte_ferdigheter.length > 0 ? `
            <div class="ferdigheter-panel">
                <h4>Detaljvurdering - Valgte ferdigheter</h4>
                ${vurdering.valgte_ferdigheter.map(fId => {
                    const ferdighet = ferdigheter.find(f => f.id === fId);
                    return `
                        <div class="ferdighet-rad">
                            <span class="ferdighet-label">${ferdighet.navn}</span>
                            <div class="ferdighet-knapper">
                                <button class="ferdighet-btn ${vurdering.ferdigheter?.[fId] === 'H' ? 'valgt' : ''}" 
                                    data-ferdighet="${fId}" data-verdi="H">H</button>
                                <button class="ferdighet-btn ${vurdering.ferdigheter?.[fId] === 'M' ? 'valgt' : ''}" 
                                    data-ferdighet="${fId}" data-verdi="M">M</button>
                                <button class="ferdighet-btn ${vurdering.ferdigheter?.[fId] === 'L' ? 'valgt' : ''}" 
                                    data-ferdighet="${fId}" data-verdi="L">L</button>
                                <button class="ferdighet-btn ${(!vurdering.ferdigheter?.[fId] || vurdering.ferdigheter[fId] === 'ikke_vurdert') ? 'valgt' : ''}" 
                                    data-ferdighet="${fId}" data-verdi="ikke_vurdert">
                                    Ikke vurdert
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        ` : '<p>Ingen ferdigheter vurdert for denne vurderingen</p>'}
        
        <button class="btn-primary" onclick="lagreRedigertVurdering('${vurderingId}')">
            Lagre endringer
        </button>
    `;
    
    // Event listeners for ferdighetsknapper
    innhold.querySelectorAll('.ferdighet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const ferdighet = e.target.dataset.ferdighet;
            innhold.querySelectorAll(`.ferdighet-btn[data-ferdighet="${ferdighet}"]`)
                .forEach(b => b.classList.remove('valgt'));
            e.target.classList.add('valgt');
        });
    });
    
    modal.style.display = 'block';
}

async function lagreRedigertVurdering(vurderingId) {
    const vurdering = await hentVurdering(vurderingId);
    
    vurdering.tema = document.getElementById('rediger-tema').value;
    vurdering.kommentar = document.getElementById('rediger-kommentar').value;
    
    // Oppdater ferdigheter
    if (vurdering.valgte_ferdigheter) {
        vurdering.valgte_ferdigheter.forEach(fId => {
            const valgtBtn = document.querySelector(`.ferdighet-btn.valgt[data-ferdighet="${fId}"]`);
            if (valgtBtn) {
                vurdering.ferdigheter[fId] = valgtBtn.dataset.verdi;
            }
        });
    }
    
    vurdering.sist_endret = new Date().toISOString();
    
    await oppdaterVurdering(vurdering);
    
    lukkModal();
    visToast('Vurdering oppdatert!', 'success');
    oppdaterHistorikk();
}

function lukkModal() {
    document.getElementById('detalj-modal').style.display = 'none';
}

// Innstillinger funksjoner
async function visInnstillinger() {
    // Oppdater sletteval når innstillinger blir opna
    oppdaterSletteKontroller();

    const innstillinger = await hentInnstillinger();

    if (!db) await initDB();

    // Hent fagliste frå fag object store
    const transaction = db.transaction(['fag'], 'readonly');
    const fagStore = transaction.objectStore('fag');
    const request = fagStore.getAll();

    request.onsuccess = () => {
        const fagArray = request.result || [];

        // Vis fagliste
        const faglisteDiv = document.getElementById('fagliste');
        if (faglisteDiv) {
            faglisteDiv.innerHTML = fagArray.map(fagObjekt => `
                <div class="fag-tag">
                    <span>${fagObjekt.namn}</span>
                    <button onclick="fjernFag('${fagObjekt.namn}')">×</button>
                </div>
            `).join('');
        }
    };

    request.onerror = () => {
        console.error('Feil ved henting av fag:', request.error);
    };

    // Sett innstillinger (med null-sjekk)
    const autoforslagToggle = document.getElementById('autoforslag-toggle');
    const varselDager = document.getElementById('varsel-dager');
    const semesterGrenseMnd = document.getElementById('semester-grense');
    const oppsummeringLengde = document.getElementById('oppsummering-lengde');

    if (autoforslagToggle) autoforslagToggle.checked = innstillinger.autoforslag !== false;
    if (varselDager) varselDager.value = innstillinger.varselDager || 30;
    if (semesterGrenseMnd) semesterGrenseMnd.value = innstillinger.semester_grense_mnd || 7;
    if (oppsummeringLengde) oppsummeringLengde.value = innstillinger.oppsummering_lengde || 'kort';

    // Initialiser læreplan-UI
    await initLaereplanUI();
}

async function leggTilFag() {
    const nyttFag = document.getElementById('nytt-fag').value.trim();
    if (!nyttFag) return;

    if (!db) await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['fag'], 'readwrite');
        const fagStore = transaction.objectStore('fag');
        const index = fagStore.index('namn');
        const request = index.get(nyttFag);

        request.onsuccess = () => {
            if (request.result) {
                // Fag finst allereie
                visToast('Faget finst allereie!', 'warning');
                resolve();
            } else {
                // Legg til nytt fag
                const fagObjekt = {
                    namn: nyttFag,
                    aktiv: true,
                    læreplanKopla: false
                };
                const addRequest = fagStore.add(fagObjekt);

                addRequest.onsuccess = () => {
                    document.getElementById('nytt-fag').value = '';
                    visInnstillingar();
                    visToast('Fag lagt til!', 'success');
                    resolve();
                };

                addRequest.onerror = () => {
                    console.error('Feil ved lagring av fag:', addRequest.error);
                    visToast('Feil ved lagring av fag', 'error');
                    reject(addRequest.error);
                };
            }
        };

        request.onerror = () => {
            console.error('Feil ved sjekk av fag:', request.error);
            reject(request.error);
        };
    });
}

async function fjernFag(fagNamn) {
    if (!db) await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['fag'], 'readwrite');
        const fagStore = transaction.objectStore('fag');
        const index = fagStore.index('namn');
        const request = index.get(fagNamn);

        request.onsuccess = () => {
            if (request.result) {
                const deleteRequest = fagStore.delete(request.result.id);

                deleteRequest.onsuccess = () => {
                    visInnstillingar();
                    visToast('Fag fjernet!', 'success');
                    resolve();
                };

                deleteRequest.onerror = () => {
                    console.error('Feil ved sletting av fag:', deleteRequest.error);
                    visToast('Feil ved sletting av fag', 'error');
                    reject(deleteRequest.error);
                };
            } else {
                visToast('Fag ikkje funne', 'warning');
                resolve();
            }
        };

        request.onerror = () => {
            console.error('Feil ved søk etter fag:', request.error);
            reject(request.error);
        };
    });
}

async function lagreGjeldendeSkoleaar() {
    const skoleaar = document.getElementById('gjeldende-skoleaar').value;
    await lagreInnstilling('gjeldende_skoleaar', skoleaar);
    gjeldendeSkoleaar = skoleaar;
    oppdaterHeaderInfo();
    visToast('Skoleår oppdatert!', 'success');
}

async function lagreSemesterGrense() {
    const grense = parseInt(document.getElementById('semester-grense').value);
    await lagreInnstilling('semester_grense_mnd', grense);
    await oppdaterSkoleaarOgSemester();
    visToast('Semestergrense oppdatert!', 'success');
}

async function lagreOppsummeringLengde() {
    const lengde = document.getElementById('oppsummering-lengde').value;
    await lagreInnstilling('oppsummering_lengde', lengde);
    visToast('Innstilling lagret!', 'success');
}

async function lagreAutoforslag() {
    const checked = document.getElementById('autoforslag-toggle').checked;
    await lagreInnstilling('autoforslag', checked);
    visToast('Innstilling lagret!', 'success');
}

async function lagreVarselDager() {
    const dager = parseInt(document.getElementById('varsel-dager').value);
    await lagreInnstilling('varselDager', dager);
    visToast('Innstilling lagret!', 'success');
}

// Import/eksport funksjoner
async function importerEleverCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            
            // Valider headers
            const requiredHeaders = ['elev_id', 'fornavn', 'etternavn', 'klasse'];
            const hasAllHeaders = requiredHeaders.every(h => 
                headers.map(header => header.toLowerCase()).includes(h.toLowerCase())
            );
            
            if (!hasAllHeaders) {
                throw new Error('CSV må ha kolonner: elev_id, fornavn, etternavn, klasse');
            }
            
            // Parse elever
            const elever = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const values = line.split(',').map(v => v.trim());
                const elev = {};
                headers.forEach((header, index) => {
                    elev[header.toLowerCase()] = values[index];
                });

                // Migrer klasse til faggruppe om nødvendig
                if (elev.klasse && !elev.faggruppe) {
                    elev.faggruppe = elev.klasse;
                }

                if (elev.elev_id && elev.fornavn && elev.etternavn && elev.faggruppe) {
                    elever.push(elev);
                }
            }
            
            // Lagre elever
            const transaction = db.transaction(['elever'], 'readwrite');
            const store = transaction.objectStore('elever');
            
            for (const elev of elever) {
                await store.put(elev);
            }
            
            visToast(`${elever.length} elever importert!`, 'success');
            await lastKlasser();
            event.target.value = '';
        } catch (error) {
            visToast('Feil ved import: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

async function eksporterAlt() {
    const elever = await hentAlleElever();
    const vurderinger = await hentAlleVurderinger();
    const innstillinger = await hentInnstillinger();
    
    const data = {
        versjon: '2.0',
        eksportert: new Date().toISOString(),
        elever: elever,
        vurderinger: vurderinger,
        innstillinger: innstillinger
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `vurderingsapp_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    visToast('Backup eksportert!', 'success');
}

async function eksporterVurderingerCSV() {
    const vurderinger = await hentAlleVurderinger();
    const elever = await hentAlleElever();
    
    // Generer CSV
    const headers = [
        'elev_id', 'fornavn', 'etternavn', 'klasse', 'fag', 
        'skoleaar', 'semester', 'dato', 'tema', 
        'hovedvurdering', 'kommentar',
        'munnleg', 'skriftleg', 'lesing', 'rekning', 'digital'
    ];
    
    const rows = vurderinger.map(v => {
        const elev = elever.find(e => e.elev_id === v.elev_id) || {};
        return [
            v.elev_id,
            elev.fornavn || '',
            elev.etternavn || '',
            v.faggruppe,
            v.fag,
            v.skoleaar || '',
            v.semester || '',
            v.dato,
            v.tema || '',
            v.hovedvurdering,
            v.kommentar || '',
            v.ferdigheter?.munnleg || 'ikke_vurdert',
            v.ferdigheter?.skriftleg || 'ikke_vurdert',
            v.ferdigheter?.lesing || 'ikke_vurdert',
            v.ferdigheter?.rekning || 'ikke_vurdert',
            v.ferdigheter?.digital || 'ikke_vurdert'
        ].map(val => `"${val}"`).join(',');
    });
    
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `vurderinger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    URL.revokeObjectURL(url);
    visToast('Vurderinger eksportert til CSV!', 'success');
}

async function importerBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            // Valider data
            if (!data.versjon || !data.elever || !data.vurderinger) {
                throw new Error('Ugyldig backup-fil');
            }
            
            // Slett eksisterende data
            await slettAlleDataUtenBekreftelse();
            
            // Importer elever
            const elevTransaction = db.transaction(['elever'], 'readwrite');
            const elevStore = elevTransaction.objectStore('elever');
            for (const elev of data.elever) {
                await elevStore.add(elev);
            }
            
            // Importer vurderinger
            const vurdTransaction = db.transaction(['vurderinger'], 'readwrite');
            const vurdStore = vurdTransaction.objectStore('vurderinger');
            for (const vurdering of data.vurderinger) {
                await vurdStore.add(vurdering);
            }
            
            // Importer innstillinger
            if (data.innstillinger) {
                for (const key in data.innstillinger) {
                    await lagreInnstilling(key, data.innstillinger[key]);
                }
            }
            
            visToast('Backup importert!', 'success');
            await initApp();
        } catch (error) {
            visToast('Feil ved import: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
    event.target.value = '';
}

async function slettAlleData() {
    if (confirm('Er du HELT sikker? Dette sletter ALLE data permanent!')) {
        if (confirm('Siste sjanse - vil du virkelig slette alt?')) {
            await slettAlleDataUtenBekreftelse();
            visToast('Alle data slettet!', 'success');
            await initApp();
        }
    }
}

async function slettAlleDataUtenBekreftelse() {
    const transaction = db.transaction(['elever', 'vurderinger', 'innstillinger'], 'readwrite');
    
    await transaction.objectStore('elever').clear();
    await transaction.objectStore('vurderinger').clear();
    await transaction.objectStore('innstillinger').clear();
}

// Database hjelpefunksjoner
async function hentAlleElever() {
    const transaction = db.transaction(['elever'], 'readonly');
    const store = transaction.objectStore('elever');
    const request = store.getAll();
    
    return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result);
    });
}

async function hentEleverIKlasse(klasse) {
    const transaction = db.transaction(['elever'], 'readonly');
    const store = transaction.objectStore('elever');
    const index = store.index('faggruppe');
    const request = index.getAll(klasse);
    
    return new Promise((resolve) => {
        request.onsuccess = () => {
            const elever = request.result;
            elever.sort((a, b) => 
                `${a.etternavn} ${a.fornavn}`.localeCompare(`${b.etternavn} ${b.fornavn}`)
            );
            resolve(elever);
        };
    });
}

async function hentElev(elevId) {
    const transaction = db.transaction(['elever'], 'readonly');
    const store = transaction.objectStore('elever');
    const request = store.get(elevId);
    
    return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result);
    });
}

async function lagreVurdering(vurdering) {
    const transaction = db.transaction(['vurderinger'], 'readwrite');
    const store = transaction.objectStore('vurderinger');
    return store.add(vurdering);
}

async function hentVurdering(vurderingId) {
    const transaction = db.transaction(['vurderinger'], 'readonly');
    const store = transaction.objectStore('vurderinger');
    const request = store.get(vurderingId);
    
    return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result);
    });
}

async function oppdaterVurdering(vurdering) {
    const transaction = db.transaction(['vurderinger'], 'readwrite');
    const store = transaction.objectStore('vurderinger');
    return store.put(vurdering);
}

async function hentAlleVurderinger() {
    const transaction = db.transaction(['vurderinger'], 'readonly');
    const store = transaction.objectStore('vurderinger');
    const request = store.getAll();
    
    return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result);
    });
}

async function hentElevVurderinger(elevId) {
    const transaction = db.transaction(['vurderinger'], 'readonly');
    const store = transaction.objectStore('vurderinger');
    const index = store.index('elev_id');
    const request = index.getAll(elevId);
    
    return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result);
    });
}

async function hentInnstillinger() {
    const transaction = db.transaction(['innstillinger'], 'readonly');
    const store = transaction.objectStore('innstillinger');
    const request = store.getAll();
    
    return new Promise((resolve) => {
        request.onsuccess = () => {
            const innstillinger = {};
            request.result.forEach(item => {
                innstillinger[item.key] = item.value;
            });
            resolve(innstillinger);
        };
    });
}

async function lagreInnstilling(key, value) {
    const transaction = db.transaction(['innstillinger'], 'readwrite');
    const store = transaction.objectStore('innstillinger');
    return store.put({ key: key, value: value });
}

async function lastInnstillinger() {
    const innstillinger = await hentInnstillinger();

    // Sett standard verdier om nødvendig
    // Merk: fagliste er no lagra i 'fag' object store, ikkje her
    if (innstillinger.autoforslag === undefined) {
        await lagreInnstilling('autoforslag', true);
    }
    if (!innstillinger.varselDager) {
        await lagreInnstilling('varselDager', 30);
    }
    if (!innstillinger.gjeldende_skoleaar) {
        await lagreInnstilling('gjeldende_skoleaar', beregnSkoleaar());
    }
    if (!innstillinger.semester_grense_mnd) {
        await lagreInnstilling('semester_grense_mnd', 7);
    }
    if (!innstillinger.oppsummering_lengde) {
        await lagreInnstilling('oppsummering_lengde', 'kort');
    }
}

// UI hjelpefunksjoner
async function lastKlasser() {
    const elever = await hentAlleElever();
    const klasser = [...new Set(elever.map(e => e.faggruppe))].sort();
    
    // Oppdater alle klassevelgere
    const selects = [
        document.getElementById('hurtig-faggruppe'),
        document.getElementById('elevoversikt-faggruppe'),
        document.getElementById('oversikt-faggruppe'),
        document.getElementById('historikk-faggruppe')
    ];
    
    selects.forEach(select => {
        if (!select) return;
        const currentValue = select.value;
        
        if (select.id === 'historikk-faggruppe') {
            select.innerHTML = '<option value="">Alle klasser</option>';
        } else {
            select.innerHTML = '<option value="">-- Velg klasse --</option>';
        }
        
        klasser.forEach(klasse => {
            const option = document.createElement('option');
            option.value = klasse;
            option.textContent = klasse;
            select.appendChild(option);
        });
        
        if (currentValue) {
            select.value = currentValue;
        }
    });
}

async function lastElever() {
    const elever = await hentAlleElever();
    console.log(`Lastet ${elever.length} elever`);
}

function formatDato(dato) {
    const d = new Date(dato);
    const dag = d.getDate().toString().padStart(2, '0');
    const mnd = (d.getMonth() + 1).toString().padStart(2, '0');
    const år = d.getFullYear();
    return `${dag}.${mnd}.${år}`;
}

function genererID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function visToast(melding, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = melding;
    toast.className = 'toast show';
    if (type === 'error') {
        toast.classList.add('error');
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


// Sletting av data
function txnDone(tx) {
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
}

async function slettVurderingerForKlasse(klasse) {
    if (!klasse) return 0;

    const tx = db.transaction(['vurderinger'], 'readwrite');
    const store = tx.objectStore('vurderinger');
    const index = store.index('faggruppe');

    let sletta = 0;
    await new Promise((resolve, reject) => {
        const req = index.openCursor(IDBKeyRange.only(klasse));
        req.onerror = () => reject(req.error);
        req.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                cursor.delete();
                sletta += 1;
                cursor.continue();
            } else {
                resolve();
            }
        };
    });

    await txnDone(tx);
    return sletta;
}

async function slettVurderingerIPeriode(fraDato, tilDato) {
    if (!fraDato || !tilDato) return 0;

    const fra = fraDato;
    const til = tilDato;

    const tx = db.transaction(['vurderinger'], 'readwrite');
    const store = tx.objectStore('vurderinger');
    const index = store.index('dato');

    let sletta = 0;
    const range = IDBKeyRange.bound(fra, til, false, false);

    await new Promise((resolve, reject) => {
        const req = index.openCursor(range);
        req.onerror = () => reject(req.error);
        req.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                cursor.delete();
                sletta += 1;
                cursor.continue();
            } else {
                resolve();
            }
        };
    });

    await txnDone(tx);
    return sletta;
}

async function slettEleverForKlasse(klasse) {
    if (!klasse) return { elever: 0, vurderinger: 0 };

    const vurderingerSletta = await slettVurderingerForKlasse(klasse);

    const tx = db.transaction(['elever'], 'readwrite');
    const store = tx.objectStore('elever');
    const index = store.index('faggruppe');

    let eleverSletta = 0;
    await new Promise((resolve, reject) => {
        const req = index.openCursor(IDBKeyRange.only(klasse));
        req.onerror = () => reject(req.error);
        req.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                cursor.delete();
                eleverSletta += 1;
                cursor.continue();
            } else {
                resolve();
            }
        };
    });

    await txnDone(tx);
    return { elever: eleverSletta, vurderinger: vurderingerSletta };
}

async function slettEnkelElev(elevId) {
    if (!elevId) return { elev: 0, vurderinger: 0 };

    const txV = db.transaction(['vurderinger'], 'readwrite');
    const storeV = txV.objectStore('vurderinger');
    const indexV = storeV.index('elev_id');

    let vurderingerSletta = 0;
    await new Promise((resolve, reject) => {
        const req = indexV.openCursor(IDBKeyRange.only(elevId));
        req.onerror = () => reject(req.error);
        req.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                cursor.delete();
                vurderingerSletta += 1;
                cursor.continue();
            } else {
                resolve();
            }
        };
    });
    await txnDone(txV);

    const txE = db.transaction(['elever'], 'readwrite');
    const storeE = txE.objectStore('elever');
    storeE.delete(elevId);
    await txnDone(txE);

    return { elev: 1, vurderinger: vurderingerSletta };
}

async function slettAltDataFullt() {
    const tx = db.transaction(['elever', 'vurderinger', 'innstillinger'], 'readwrite');
    tx.objectStore('elever').clear();
    tx.objectStore('vurderinger').clear();
    tx.objectStore('innstillinger').clear();
    await txnDone(tx);
}

// Innstillinger: set opp slettekontroller
async function oppdaterSletteKontroller() {
    const klasseValg1 = document.getElementById('slett-vurd-klasse');
    const klasseValg2 = document.getElementById('slett-elev-klasse');
    const elevValg = document.getElementById('slett-enkel-elev');

    if (!klasseValg1 || !klasseValg2 || !elevValg) return;

    const elever = await hentAlleElever();
    const klasser = [...new Set(elever.map(e => e.faggruppe))].sort();

    const fyllKlasser = (sel) => {
        const valgt = sel.value;
        sel.innerHTML = '<option value="">Vel klasse</option>';
        klasser.forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = k;
            sel.appendChild(opt);
        });
        if (valgt && klasser.includes(valgt)) sel.value = valgt;
    };

    fyllKlasser(klasseValg1);
    fyllKlasser(klasseValg2);

    const elevValgt = elevValg.value;
    elevValg.innerHTML = '<option value="">Vel elev</option>';
    elever
        .slice()
        .sort((a, b) => (`${a.etternavn} ${a.fornavn}`).localeCompare(`${b.etternavn} ${b.fornavn}`))
        .forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.elev_id;
            opt.textContent = `${e.etternavn}, ${e.fornavn} (${e.faggruppe})`;
            elevValg.appendChild(opt);
        });
    if (elevValgt) elevValg.value = elevValgt;
}

function initSlettingUI() {
    const btnVurdKlasse = document.getElementById('btn-slett-vurd-klasse');
    const btnVurdPeriode = document.getElementById('btn-slett-vurd-periode');
    const btnElevKlasse = document.getElementById('btn-slett-elev-klasse');
    const btnEnkelElev = document.getElementById('btn-slett-enkel-elev');
    const slettAltBtn = document.getElementById('slett-alt');
    const slettAltTekst = document.getElementById('slett-alt-tekst');

    if (slettAltTekst && slettAltBtn) {
        slettAltTekst.addEventListener('input', () => {
            const ok = slettAltTekst.value.trim() === 'SLETT ALT';
            slettAltBtn.disabled = !ok;
        });
    }

    if (btnVurdKlasse) {
        btnVurdKlasse.addEventListener('click', async () => {
            const klasse = document.getElementById('slett-vurd-klasse').value;
            if (!klasse) return visToast('Vel klasse først', 'error');

            const ok = confirm(`Slette alle vurderingar for ${klasse}. Elevane blir ståande. Stadfeste`);
            if (!ok) return;

            const n = await slettVurderingerForKlasse(klasse);
            await oppdaterSletteKontroller();
            await oppdaterUIEtterSletting();
            visToast(`Sletta ${n} vurderingar`, 'success');
        });
    }

    if (btnVurdPeriode) {
        btnVurdPeriode.addEventListener('click', async () => {
            const fra = document.getElementById('slett-vurd-fra').value;
            const til = document.getElementById('slett-vurd-til').value;
            if (!fra || !til) return visToast('Vel frå og til dato', 'error');
            if (fra > til) return visToast('Frå dato må vere før til dato', 'error');

            const ok = confirm(`Slette vurderingar frå ${fra} til ${til}. Stadfeste`);
            if (!ok) return;

            const n = await slettVurderingerIPeriode(fra, til);
            await oppdaterSletteKontroller();
            await oppdaterUIEtterSletting();
            visToast(`Sletta ${n} vurderingar`, 'success');
        });
    }

    if (btnElevKlasse) {
        btnElevKlasse.addEventListener('click', async () => {
            const klasse = document.getElementById('slett-elev-klasse').value;
            if (!klasse) return visToast('Vel klasse først', 'error');

            const ok = confirm(`Slette elevar i ${klasse} og alle vurderingar knytte til klassa. Stadfeste`);
            if (!ok) return;

            const res = await slettEleverForKlasse(klasse);
            await lastKlasser();
            await lastElever();
            await oppdaterSletteKontroller();
            await oppdaterUIEtterSletting();
            visToast(`Sletta ${res.elever} elevar og ${res.vurderinger} vurderingar`, 'success');
        });
    }

    if (btnEnkelElev) {
        btnEnkelElev.addEventListener('click', async () => {
            const elevId = document.getElementById('slett-enkel-elev').value;
            if (!elevId) return visToast('Vel elev først', 'error');

            const elev = await hentElev(elevId);
            const navn = elev ? `${elev.etternavn}, ${elev.fornavn} (${elev.faggruppe})` : elevId;

            const ok = confirm(`Slette ${navn} og alle vurderingar knytte til eleven. Stadfeste`);
            if (!ok) return;

            const res = await slettEnkelElev(elevId);
            await lastKlasser();
            await lastElever();
            await oppdaterSletteKontroller();
            await oppdaterUIEtterSletting();
            visToast(`Sletta elev og ${res.vurderinger} vurderingar`, 'success');
        });
    }

    if (slettAltBtn) {
        slettAltBtn.addEventListener('click', async () => {
            const ok = confirm('Dette slettar absolutt alt lokalt. Er du heilt sikker');
            if (!ok) return;

            await slettAltDataFullt();

            // Reset UI
            if (document.getElementById('slett-alt-tekst')) document.getElementById('slett-alt-tekst').value = '';
            if (slettAltBtn) slettAltBtn.disabled = true;

            await lastInnstillinger();
            await oppdaterSkoleaarOgSemester();
            await lastKlasser();
            await lastElever();
            await oppdaterSletteKontroller();
            await oppdaterUIEtterSletting();

            visToast('Alt sletta', 'success');
        });
    }
}

async function oppdaterUIEtterSletting() {
    try {
        await lastVurderinger();
    } catch (e) {}

    // Oppdater visningar som kan vere opne
    const aktiv = document.querySelector('.nav-btn.active');
    if (aktiv) {
        const view = aktiv.getAttribute('data-view');
        if (view === 'historikk') {
            visHistorikk();
        }
        if (view === 'klasseoversikt') {
            visKlasseoversikt();
        }
        if (view === 'elevoversikt') {
            const elevSel = document.getElementById('elevoversikt-elev');
            if (elevSel && elevSel.value) {
                visElevDetaljer(elevSel.value);
            } else {
                visElevoversikt();
            }
        }
        if (view === 'hurtigmodus') {
            visHurtigmodus();
        }
    }
}




function sluttId(elevId, fag, skoleaar, semester) {
    return `sv_${skoleaar}_${semester}_${elevId}_${fag}`.replace(/\s+/g, '_');
}

function vektDel(i, n) {
    const pos = (i + 1) / (n || 1);
    if (pos > 0.66) return 3;
    if (pos > 0.33) return 2;
    return 1;
}

function summerFokus(vurderinger, fokus) {
    const sum = { H: 0, M: 0, L: 0 };
    const liste = vurderinger.filter(v => (v.fokus || '') === fokus).sort((a, b) => (a.dato || '').localeCompare(b.dato || ''));
    const n = liste.length;
    liste.forEach((v, i) => {
        const w = vektDel(i, n);
        const hml = v.hovedvurdering || v.hml || v.vurdering || '';
        if (hml === 'H') sum.H += w;
        if (hml === 'M') sum.M += w;
        if (hml === 'L') sum.L += w;
    });
    return sum;
}

function foreslaaIntervall(stat) {
    const kjerne = ['forstaing', 'resonnering', 'refleksjon'];
    let score = 0;
    kjerne.forEach(k => {
        const s = stat[k] || { H: 0, M: 0, L: 0 };
        score += (2 * s.H) + (1 * s.M);
    });

    if (score >= 18) return { intervall: "5–6", grunnlag: "Overvekt av høg kompetanse i kjerneområda, og jamn kvalitet over tid." };
    if (score >= 12) return { intervall: "4–5", grunnlag: "Jamt god fagleg forståing og resonnering, med noko variasjon i refleksjon." };
    if (score >= 7) return { intervall: "3–4", grunnlag: "Overvekt av middels kompetanse, med behov for meir stabilitet og djupn i kjerneområda." };
    if (score >= 3) return { intervall: "2–3", grunnlag: "Mange svake vurderingar og ujamn måloppnåing i kjerneområda." };
    return { intervall: "1", grunnlag: "Overvekt av låg kompetanse og manglande måloppnåing." };
}

async function lagreSlutt(obj) {
    const tx = db.transaction(['sluttvurderingar'], 'readwrite');
    tx.objectStore('sluttvurderingar').put(obj);
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
}

async function hentSlutt(key) {
    const tx = db.transaction(['sluttvurderingar'], 'readonly');
    const store = tx.objectStore('sluttvurderingar');
    const idx = store.index('elev_fag_skoleaar_semester');
    const req = idx.get(key);
    return new Promise((resolve) => {
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
    });
}

async function opneSluttvurdering() {
    const modal = document.getElementById('sluttvurdering-modal');
    if (!modal) return;
    if (!valgtElev) {
        visToast('Vel elev først', 'error');
        return;
    }

    const elev = await hentElev(valgtElev);
    document.getElementById('sluttv-elevinfo').textContent = elev ? `${elev.fornavn} ${elev.etternavn} (${elev.faggruppe})` : valgtElev;

    const innstillinger = await hentInnstillinger();
    const fagliste = await hentFagNamn();

    const fagSel = document.getElementById('sluttv-fag');
    fagSel.innerHTML = '';
    fagliste.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f;
        opt.textContent = f;
        fagSel.appendChild(opt);
    });

    const skoleaarEl = document.getElementById('sluttv-skoleaar');
    const semesterEl = document.getElementById('sluttv-semester');

    const skoleHeader = document.getElementById('skoleaar') ? document.getElementById('skoleaar').value : '';
    if (skoleHeader && !skoleaarEl.value) skoleaarEl.value = skoleHeader;

    async function bygg() {
        const fag = fagSel.value;
        const skoleaar = skoleaarEl.value || '';
        const semester = semesterEl.value || 'Haust';

        const alle = await hentElevVurderinger(valgtElev);
        const iFag = alle.filter(v => (v.fag || '') === fag);

        const stat = {
            forstaing: summerFokus(iFag, 'forstaing'),
            resonnering: summerFokus(iFag, 'resonnering'),
            refleksjon: summerFokus(iFag, 'refleksjon'),
            munnleg: summerFokus(iFag, 'munnleg'),
            initiativ: summerFokus(iFag, 'initiativ')
        };

        const oversiktEl = document.getElementById('sluttv-oversikt');
        oversiktEl.innerHTML = '';
        const rad = (t, s) => {
            const d = document.createElement('div');
            d.textContent = `${t}: H ${s.H}, M ${s.M}, L ${s.L}`;
            oversiktEl.appendChild(d);
        };
        rad('Fagleg forståing', stat.forstaing);
        rad('Resonnering og drøfting', stat.resonnering);
        rad('Refleksjon', stat.refleksjon);
        rad('Munnleg', stat.munnleg);
        rad('Initiativ', stat.initiativ);

        const forslag = foreslaaIntervall(stat);
        document.getElementById('sluttv-intervall').textContent = forslag.intervall;
        document.getElementById('sluttv-grunnlag').textContent = forslag.grunnlag;

        const tekstEl = document.getElementById('sluttv-tekst');
        tekstEl.value = TEKSTBLOKKER_SLUTT[forslag.intervall] || TEKSTBLOKKER_SLUTT["3–4"];

        const radios = document.querySelectorAll('input[name="sluttv-kar"]');
        radios.forEach(r => r.checked = false);

        if (skoleaar) {
            const key = `${valgtElev}__${fag}__${skoleaar}__${semester}`;
            const lagra = await hentSlutt(key);
            if (lagra) {
                document.getElementById('sluttv-intervall').textContent = lagra.forslag_intervall || forslag.intervall;
                document.getElementById('sluttv-grunnlag').textContent = lagra.forslag_grunnlag || forslag.grunnlag;
                tekstEl.value = lagra.slutttekst || tekstEl.value;
                if (lagra.karakter_valgt) {
                    const r = document.querySelector(`input[name="sluttv-kar"][value="${lagra.karakter_valgt}"]`);
                    if (r) r.checked = true;
                }
            }
        }
    }

    fagSel.onchange = bygg;
    skoleaarEl.oninput = bygg;
    semesterEl.onchange = bygg;

    await bygg();
    modal.style.display = 'block';
}

function lukkSluttvurdering() {
    const modal = document.getElementById('sluttvurdering-modal');
    if (modal) modal.style.display = 'none';
}

async function lagreSluttKlikk() {
    const fag = document.getElementById('sluttv-fag').value;
    const skoleaar = document.getElementById('sluttv-skoleaar').value || '';
    const semester = document.getElementById('sluttv-semester').value || 'Haust';

    if (!skoleaar) {
        visToast('Skriv skuleår', 'error');
        return;
    }

    const intervall = document.getElementById('sluttv-intervall').textContent || '';
    const grunnlag = document.getElementById('sluttv-grunnlag').textContent || '';
    const slutttekst = document.getElementById('sluttv-tekst').value || '';

    const valgtRadio = document.querySelector('input[name="sluttv-kar"]:checked');
    if (!valgtRadio) {
        visToast('Vel karakter', 'error');
        return;
    }
    const karakter = parseInt(valgtRadio.value, 10);

    const elev = await hentElev(valgtElev);
    const klasse = elev ? elev.faggruppe : '';

    const key = `${valgtElev}__${fag}__${skoleaar}__${semester}`;

    const obj = {
        id: sluttId(valgtElev, fag, skoleaar, semester),
        elev_id: valgtElev,
        klasse: klasse,
        fag: fag,
        skoleaar: skoleaar,
        semester: semester,
        elev_fag_skoleaar_semester: key,
        forslag_intervall: intervall,
        forslag_grunnlag: grunnlag,
        karakter_valgt: karakter,
        slutttekst: slutttekst,
        sist_endra: new Date().toISOString()
    };

    await lagreSlutt(obj);
    visToast('Sluttvurdering lagra', 'success');
    lukkSluttvurdering();
}




async function hentAlleLaereplaner() {
    const tx = db.transaction(['laereplaner'], 'readonly');
    const store = tx.objectStore('laereplaner');
    const req = store.getAll();
    return new Promise((resolve) => {
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
    });
}

async function lagreLaereplan(plan) {
    const tx = db.transaction(['laereplaner'], 'readwrite');
    tx.objectStore('laereplaner').put(plan);
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
}

async function slettLaereplan(id) {
    const tx = db.transaction(['laereplaner'], 'readwrite');
    tx.objectStore('laereplaner').delete(id);
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
}

async function seedLaereplanarOmTom() {
    const eksisterande = await hentAlleLaereplaner();
    if (eksisterande && eksisterande.length) return;

    for (const p of STANDARD_LAEREPLANAR) {
        const id = p.kode ? p.kode : ('LP_' + Math.random().toString(36).slice(2));
        await lagreLaereplan({
            id,
            kode: p.kode || '',
            tittel: p.tittel || '',
            kompetansemaal: p.kompetansemaal || [],
            kjerneelement: p.kjerneelement || [],
            grunnferdigheter: p.grunnferdigheter || [],
            oppretta: new Date().toISOString()
        });
    }
}




async function initLaereplanUI() {
    await seedLaereplanarOmTom();

    const innstillinger = await hentInnstillinger();
    innstillinger.fagTilLaereplan = innstillinger.fagTilLaereplan || {};

    const fagliste = await hentFagNamn();

    const fagSel = document.getElementById('lp-kople-fag');
    const lpValSel = document.getElementById('lp-kople-plan');
    const kopleBtn = document.getElementById('lp-kople-btn');
    const uploadInput = document.getElementById('lp-upload');

    if (!fagSel || !lpValSel) return;

    // Fyll fag
    fagSel.innerHTML = '';
    fagliste.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f;
        opt.textContent = f;
        fagSel.appendChild(opt);
    });

    async function renderLP() {
        const alle = await hentAlleLaereplaner();
        // dropdown for assignment
        lpValSel.innerHTML = '';
        const opt0 = document.createElement('option');
        opt0.value = '';
        opt0.textContent = 'Ingen';
        lpValSel.appendChild(opt0);

        alle.forEach(lp => {
            const opt = document.createElement('option');
            opt.value = lp.id;
            opt.textContent = lp.kode ? `${lp.kode} – ${lp.tittel}` : lp.tittel;
            lpValSel.appendChild(opt);
        });

        // listbox admin
        lpAdminVelg.innerHTML = '';
        alle.forEach(lp => {
            const opt = document.createElement('option');
            opt.value = lp.id;
            opt.textContent = lp.kode ? `${lp.kode} – ${lp.tittel}` : lp.tittel;
            lpAdminVelg.appendChild(opt);
        });

        // set current selection based on fag
        const fag = fagSel.value;
        lpValSel.value = innstillinger.fagTilLaereplan[fag] || '';
        
        // Oppdater kopling-oversikt
        await oppdaterKoplingOversikt();
    }
    
    async function oppdaterKoplingOversikt() {
        const tabellDiv = document.getElementById('aktive-koplingar-tabell');

        if (!tabellDiv) {
            console.error('Element aktive-koplingar-tabell ikkje funne');
            return;
        }

        const fagTilLp = innstillinger.fagTilLaereplan || {};
        const fagMedKopling = Object.keys(fagTilLp).filter(f => fagTilLp[f]);

        if (fagMedKopling.length === 0) {
            tabellDiv.innerHTML = '<p class="hjelpetekst">Ingen aktive koplingar enno</p>';
            return;
        }

        // Bygg tabell med koplingar
        const alle = await hentAlleLaereplaner();
        let html = '<table style="width: 100%; border-collapse: collapse; margin-top: 0.5rem;">';
        html += '<thead><tr style="background: #856404; color: white;">';
        html += '<th style="padding: 0.5rem; text-align: left;">Fag</th>';
        html += '<th style="padding: 0.5rem; text-align: left;">Læreplan</th>';
        html += '<th style="padding: 0.5rem; text-align: center;">Kompetansemål</th>';
        html += '<th style="padding: 0.5rem; text-align: center;">Handling</th>';
        html += '</tr></thead><tbody>';

        for (const fag of fagMedKopling) {
            const lpId = fagTilLp[fag];
            const lp = alle.find(x => x.id === lpId);

            if (lp) {
                const kmCount = lp.kompetansemaal ? lp.kompetansemaal.length : 0;
                const lpNamn = lp.kode ? `${lp.kode} – ${lp.tittel}` : lp.tittel;

                html += '<tr style="border-bottom: 1px solid #ddd;">';
                html += `<td style="padding: 0.5rem;"><strong>${fag}</strong></td>`;
                html += `<td style="padding: 0.5rem;">${lpNamn}</td>`;
                html += `<td style="padding: 0.5rem; text-align: center;">${kmCount}</td>`;
                html += `<td style="padding: 0.5rem; text-align: center;">`;
                html += `<button onclick="fjernKopling('${fag}')" style="background: #dc3545; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 3px; cursor: pointer; font-size: 0.85rem;">✕ Fjern</button>`;
                html += `</td>`;
                html += '</tr>';
            }
        }

        html += '</tbody></table>';
        tabellDiv.innerHTML = html;

        console.log(`✓ Oppdatert koplingoversikt: ${fagMedKopling.length} aktive koplingar`);
    }
    
    // Legg til global funksjon for å fjerne kopling
    window.fjernKopling = async function(fag) {
        if (!confirm(`Vil du fjerne læreplankoplinga for ${fag}?`)) {
            return;
        }
        
        delete innstillinger.fagTilLaereplan[fag];
        await lagreInnstilling('fagTilLaereplan', innstillinger.fagTilLaereplan);
        await oppdaterKoplingOversikt();
        visToast(`✓ Fjerna læreplan frå ${fag}`, 'success');
    };

    async function saveAssignment() {
        const fag = fagSel.value;
        const lpId = lpValSel.value;
        
        if (!fag) {
            visToast('Du må velje eit fag først', 'error');
            return;
        }
        
        if (!lpId) {
            // Fjern kopling
            delete innstillinger.fagTilLaereplan[fag];
            await lagreInnstilling('fagTilLaereplan', innstillinger.fagTilLaereplan);
            await oppdaterKoplingOversikt();
            visToast(`Fjerna læreplan frå ${fag}`, 'success');
            console.log('Fjerna kopling for fag:', fag);
            return;
        }
        
        // Finn læreplan-tittel for bekreftelsesmelding
        const alle = await hentAlleLaereplaner();
        const lp = alle.find(x => x.id === lpId);
        const lpTittel = lp ? (lp.kode || lp.tittel) : lpId;
        
        innstillinger.fagTilLaereplan[fag] = lpId;
        await lagreInnstilling('fagTilLaereplan', innstillinger.fagTilLaereplan);
        await oppdaterKompetansemaalDropdown(); // oppdater i vurderingsskjema
        await oppdaterKoplingOversikt(); // Oppdater oversikta!
        
        visToast(`✓ Læreplan "${lpTittel}" kopla til ${fag}`, 'success');
        console.log(`Kopla læreplan ${lpId} til fag ${fag}:`, innstillinger.fagTilLaereplan);
    }

    fagSel.onchange = async () => {
        const fag = fagSel.value;
        lpValSel.value = innstillinger.fagTilLaereplan[fag] || '';
    };
    
    // Bruk knapp for å kople i staden for automatisk
    if (kopleBtn) {
        kopleBtn.onclick = saveAssignment;
    }

    // Læreplan-analyse knapp
    const parseBtn = document.getElementById('lp-parse-btn');
    if (parseBtn && uploadInput) {
        parseBtn.onclick = () => {
            const file = uploadInput.files[0];
            if (!file) {
                visToast('Du må først velje ei fil (PDF, DOCX eller JSON)', 'warning');
                uploadInput.click(); // Opne filveljar
                return;
            }

            // Trigger onchange event for å parse fila
            const event = new Event('change', { bubbles: true });
            uploadInput.dispatchEvent(event);
        };
    }

    // Opplasting av læreplan
    if (uploadInput) {
        uploadInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const fileName = file.name.toLowerCase();
            
            try {
                if (fileName.endsWith('.json')) {
                    // Handter JSON direkte som før
                    const text = await file.text();
                    const data = JSON.parse(text);

                    if (!data.tittel || !data.kompetansemaal) {
                        visToast('Ugyldig format: treng "tittel" og "kompetansemaal"', 'error');
                        return;
                    }

                    const id = data.kode || data.id || ('LP_' + Math.random().toString(36).slice(2));

                    await lagreLaereplan({
                        id,
                        kode: data.kode || '',
                        tittel: data.tittel,
                        kompetansemaal: Array.isArray(data.kompetansemaal) ? data.kompetansemaal : [],
                        kjerneelement: Array.isArray(data.kjerneelement) ? data.kjerneelement : [],
                        grunnferdigheter: Array.isArray(data.grunnferdigheter) ? data.grunnferdigheter : [],
                        oppretta: new Date().toISOString()
                    });

                    await renderLP();
                    await oppdaterKompetansemaalDropdown();
                    visToast(`✓ Læreplan "${data.tittel}" lasta opp!`, 'success');
                    uploadInput.value = '';
                    
                } else if (fileName.endsWith('.pdf')) {
                    // Handter PDF
                    visToast('Behandlar PDF...', 'success');
                    const text = await parsePDF(file);
                    visParseModal(text, file.name);
                    uploadInput.value = '';
                    
                } else if (fileName.endsWith('.docx')) {
                    // Handter DOCX
                    visToast('Behandlar Word-dokument...', 'success');
                    const text = await parseDOCX(file);
                    visParseModal(text, file.name);
                    uploadInput.value = '';
                    
                } else {
                    visToast('Ugyldig filformat. Bruk PDF, DOCX eller JSON.', 'error');
                }
            } catch (err) {
                console.error('Feil ved opplasting:', err);
                visToast('Kunne ikkje laste opp: ' + err.message, 'error');
                uploadInput.value = '';
            }
        };
    }

    // Admin actions
    const lpAdminVelg = document.getElementById('lp-admin-velg');
    const navnEl = document.getElementById('lp-admin-tittel');
    const kodeEl = document.getElementById('lp-admin-kode');
    const kompEl = document.getElementById('lp-admin-maal');
    const nyBtn = document.getElementById('lp-admin-ny');
    const lagreBtn = document.getElementById('lp-admin-lagre');
    const slettBtn = document.getElementById('lp-admin-slett');

    function clearForm() {
        if (navnEl) navnEl.value = '';
        if (kodeEl) kodeEl.value = '';
        if (kompEl) kompEl.value = '';
        lpAdminVelg.value = '';
    }

    lpAdminVelg.onchange = async () => {
        const id = lpAdminVelg.value;
        if (!id) return;
        const alle = await hentAlleLaereplaner();
        const lp = alle.find(x => x.id === id);
        if (!lp) return;
        navnEl.value = lp.tittel || '';
        kodeEl.value = lp.kode || '';
        kompEl.value = (lp.kompetansemaal || []).join('\n');
    };

    if (nyBtn) nyBtn.onclick = () => clearForm();

    if (lagreBtn) lagreBtn.onclick = async () => {
        const tittel = (navnEl.value || '').trim();
        if (!tittel) {
            visToast('Skriv inn namn/tittel', 'error');
            return;
        }
        const kode = (kodeEl.value || '').trim();
        const kompetansemaal = (kompEl.value || '').split('\n').map(x => x.trim()).filter(Boolean);

        const id = lpAdminVelg.value || (kode || ('LP_' + Math.random().toString(36).slice(2)));
        await lagreLaereplan({
            id,
            kode,
            tittel,
            kompetansemaal,
            oppretta: new Date().toISOString()
        });
        await renderLP();
        lpAdminVelg.value = id;
        visToast('Læreplan lagra', 'success');
        await oppdaterKompetansemaalDropdown();
    };

    const eksporterBtn = document.getElementById('lp-eksporter');
    if (eksporterBtn) eksporterBtn.onclick = async () => {
        const id = lpAdminVelg.value;
        if (!id) {
            visToast('Vel ei læreplan å eksportere', 'error');
            return;
        }
        
        const alle = await hentAlleLaereplaner();
        const lp = alle.find(x => x.id === id);
        if (!lp) return;
        
        // Lag JSON-fil
        const jsonData = {
            kode: lp.kode || '',
            tittel: lp.tittel,
            kompetansemaal: lp.kompetansemaal || [],
            kjerneelement: lp.kjerneelement || [],
            grunnferdigheter: lp.grunnferdigheter || []
        };
        
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `læreplan_${lp.kode || lp.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        visToast('Læreplan eksportert!', 'success');
    };

    if (slettBtn) slettBtn.onclick = async () => {
        const id = lpAdminVelg.value;
        if (!id) {
            visToast('Vel ei læreplan å slette', 'error');
            return;
        }
        
        if (!confirm('Er du sikker på at du vil slette denne læreplanen?')) {
            return;
        }
        
        await slettLaereplan(id);
        clearForm();
        await renderLP();
        // fjern eventuelle mappingar som peikar på sletta plan
        const map = innstillinger.fagTilLaereplan || {};
        Object.keys(map).forEach(k => {
            if (map[k] === id) map[k] = '';
        });
        innstillinger.fagTilLaereplan = map;
        await lagreInnstilling('fagTilLaereplan', innstillinger.fagTilLaereplan);
        await oppdaterKompetansemaalDropdown();
        visToast('Læreplan sletta', 'success');
    };

    await renderLP();
}

// Parsing-funksjoner for PDF og DOCX
async function parsePDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    
    // Set worker path for PDF.js
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }
    
    return fullText;
}

async function parseDOCX(file) {
    const arrayBuffer = await file.arrayBuffer();
    
    if (typeof mammoth === 'undefined') {
        throw new Error('Mammoth-biblioteket er ikkje lasta inn');
    }
    
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}

// Parser for Udir-spesifikke dokument
function parseUdirLaereplan(tekst) {
    const linjer = tekst.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);
    
    let fagkode = '';
    let tittel = '';
    let grunnferdigheter = [];
    let kompetansemaalSett = []; // Kan vere fleire sett (t.d. nivå 1 og 2)
    
    // Finn fagkode og tittel (første linje)
    if (linjer.length > 0) {
        const firstLine = linjer[0];
        // "Læreplan i samfunnskunnskap fellesfag vg1/vg2"
        tittel = firstLine.replace(/^Læreplan i /i, '').trim();
        
        // Prøv å finne fagkode i filnavn eller tekst
        const kodeMatcher = tekst.match(/([A-ZÆØÅ]{3}\d{2}-\d{2})/);
        if (kodeMatcher) {
            fagkode = kodeMatcher[1];
        }
    }
    
    // Finn grunnferdigheiter
    let i = 0;
    let inGrunnferd = false;
    while (i < linjer.length) {
        const linje = linjer[i];
        
        if (linje === 'Grunnleggjande ferdigheiter' || linje === 'Grunnleggende ferdigheter') {
            inGrunnferd = true;
            i++;
            continue;
        }
        
        if (inGrunnferd && (linje.includes('Kompetansemål') || linje.includes('Tverrfaglege tema') || linje.includes('Tverrfaglige tema'))) {
            inGrunnferd = false;
        }
        
        if (inGrunnferd) {
            // Grunnferdigheiter har typisk tittel på ein linje og beskrivelse på neste
            if (linje.match(/^(Munnlege ferdigheiter|Muntlige ferdigheter|Å kunne skrive|Å kunne lese|Å kunne rekne|Å kunne regne|Digitale ferdigheiter|Digitale ferdigheter)/)) {
                const tittelLinje = linje;
                i++;
                let beskrivelse = '';
                while (i < linjer.length && !linjer[i].match(/^(Munnlege|Muntlige|Å kunne|Digitale|Kompetansemål|Tverrfag)/)) {
                    beskrivelse += (beskrivelse ? ' ' : '') + linjer[i];
                    i++;
                }
                grunnferdigheter.push(tittelLinje + ' – ' + beskrivelse);
                continue;
            }
        }
        
        i++;
    }
    
    // Finn kompetansemål
    i = 0;
    while (i < linjer.length) {
        const linje = linjer[i];
        
        // Sjekk for start på kompetansemål-seksjon
        if (linje.match(/^(Mål for opplæringa er at eleven skal kunne|Mål for opplæringen er at eleven skal kunne)/i)) {
            const settTittel = linjer[i-1] || ''; // T.d. "Kompetansemål etter entreprenørskap og bedriftsutvikling 1"
            const kompetansemaal = [];
            
            i++;
            // Samle kompetansemål til neste seksjon
            while (i < linjer.length) {
                const kmLinje = linjer[i];
                
                // Stopp ved neste seksjon
                if (kmLinje.match(/^(Undervegsvurdering|Underveisvurdering|Sluttvurdering|Kompetansemål etter|Kompetansemål og vurdering)/i)) {
                    break;
                }
                
                // Dette er eit kompetansemål dersom det er langt nok
                if (kmLinje.length > 30) {
                    kompetansemaal.push(kmLinje);
                }
                
                i++;
            }
            
            if (kompetansemaal.length > 0) {
                kompetansemaalSett.push({
                    tittel: settTittel,
                    maal: kompetansemaal
                });
            }
        }
        
        i++;
    }
    
    return {
        fagkode,
        tittel,
        grunnferdigheter,
        kompetansemaalSett
    };
}

// Identifiser kompetansemål automatisk (for generelle dokument)
function identifiserKompetansemaal(text) {
    // Del opp teksten i linjer
    const linjer = text.split(/\n+/).map(l => l.trim()).filter(l => l.length > 20);
    
    // Vanlege verb som kompetansemål byrjar med (nynorsk og bokmål)
    const kompetansemaalVerb = [
        'utforske', 'utforska', 'undersøkje', 'undersøke',
        'drøfte', 'drøfta', 'diskutere', 'diskutera',
        'gjere greie for', 'gjøre rede for', 'forklare', 'forklara',
        'vurdere', 'vurdera', 'analysere', 'analysera',
        'beskrive', 'beskriva', 'presentere', 'presentera',
        'reflektere', 'reflektera', 'samtale om', 'samtala om',
        'lage', 'laga', 'skape', 'skapa',
        'bruke', 'bruka', 'anvende', 'anvenda',
        'samanlikne', 'sammenligne', 'samanlikna',
        'formulere', 'formulera', 'uttrykke', 'uttrykkja',
        'delta i', 'delta',
        'gjennomføre', 'gjennomføra',
        'innhente', 'innhenta',
        'kartlegge', 'kartleggja',
        'beregne', 'berekna',
        'lese', 'lesa',
        'utvikle', 'utvikla'
    ];
    
    const resultat = [];
    
    for (const linje of linjer) {
        const linjeLower = linje.toLowerCase();
        
        // Sjekk om linja byrjar med eit kompetansemål-verb
        const erKompetansemaal = kompetansemaalVerb.some(verb => 
            linjeLower.startsWith(verb + ' ') || 
            linjeLower.startsWith(verb + ',')
        );
        
        // Alternativt: sjekk om linja inneheld typiske formuleringar som IKKJE er kompetansemål
        const harEkskluderingsord = linjeLower.includes('eleven skal kunne') || 
                                      linjeLower.includes('elevane skal kunne') ||
                                      linjeLower.includes('kompetansemål') ||
                                      linjeLower.includes('mål for opplæring');
        
        resultat.push({
            tekst: linje,
            erKompetansemaal: erKompetansemaal && !harEkskluderingsord,
            index: resultat.length
        });
    }
    
    return resultat;
}

// Vis modal for parsing
function visParseModal(tekst, filnavn) {
    const modal = document.getElementById('lp-parse-modal');
    const contentDiv = document.getElementById('lp-parse-content');
    const tittelInput = document.getElementById('lp-parse-tittel');
    const kodeInput = document.getElementById('lp-parse-kode');
    
    if (!modal || !contentDiv) return;
    
    // Prøv først å parse som Udir-dokument
    const udirData = parseUdirLaereplan(tekst);
    
    let linjer = [];
    let erUdirFormat = false;
    
    if (udirData.kompetansemaalSett.length > 0) {
        // Dette er eit Udir-dokument!
        erUdirFormat = true;
        
        // Set fagkode og tittel
        kodeInput.value = udirData.fagkode || '';
        tittelInput.value = udirData.tittel || filnavn.replace(/\.(pdf|docx)$/i, '').replace(/_/g, ' ');
        
        // Hvis fleire sett (t.d. nivå 1 og 2), la brukaren velje
        if (udirData.kompetansemaalSett.length > 1) {
            contentDiv.innerHTML = `
                <div style="background: #fff3cd; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <strong>💡 Dette dokumentet inneheld fleire sett med kompetansemål</strong><br>
                    <span style="font-size: 0.9rem;">Vel kva for sett du vil importere, eller vel fleire.</span>
                </div>
            `;
            
            udirData.kompetansemaalSett.forEach((sett, idx) => {
                const settDiv = document.createElement('div');
                settDiv.style.cssText = 'border: 2px solid #ddd; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; background: white;';
                
                const header = document.createElement('div');
                header.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 2px solid #eee;';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `udir-sett-${idx}`;
                checkbox.checked = true;
                checkbox.style.cssText = 'width: 20px; height: 20px; cursor: pointer;';
                
                const label = document.createElement('label');
                label.htmlFor = `udir-sett-${idx}`;
                label.textContent = sett.tittel || `Kompetansemål sett ${idx + 1}`;
                label.style.cssText = 'font-weight: 600; font-size: 1.05rem; cursor: pointer; flex: 1;';
                
                const antall = document.createElement('span');
                antall.textContent = `${sett.maal.length} kompetansemål`;
                antall.style.cssText = 'font-size: 0.9rem; color: #666;';
                
                header.appendChild(checkbox);
                header.appendChild(label);
                header.appendChild(antall);
                
                const maalDiv = document.createElement('div');
                sett.maal.slice(0, 3).forEach(maal => {
                    const p = document.createElement('p');
                    p.textContent = '• ' + maal;
                    p.style.cssText = 'margin: 0.25rem 0; font-size: 0.9rem; color: #555;';
                    maalDiv.appendChild(p);
                });
                
                if (sett.maal.length > 3) {
                    const more = document.createElement('p');
                    more.textContent = `... og ${sett.maal.length - 3} til`;
                    more.style.cssText = 'margin: 0.5rem 0; font-size: 0.9rem; color: #999; font-style: italic;';
                    maalDiv.appendChild(more);
                }
                
                settDiv.appendChild(header);
                settDiv.appendChild(maalDiv);
                contentDiv.appendChild(settDiv);
            });
            
            // Lagre data for seinare bruk
            contentDiv.dataset.udirData = JSON.stringify(udirData);
            
        } else {
            // Berre eitt sett - vis som før
            const sett = udirData.kompetansemaalSett[0];
            contentDiv.innerHTML = `
                <div style="background: #e8f5e9; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <strong>✓ Udir-læreplan detektert!</strong><br>
                    <span style="font-size: 0.9rem;">Fagkode, tittel og ${sett.maal.length} kompetansemål automatisk henta ut.</span>
                </div>
            `;
            
            sett.maal.forEach((maal, idx) => {
                const div = document.createElement('div');
                div.style.cssText = 'display: flex; gap: 0.5rem; padding: 0.5rem; border-bottom: 1px solid #eee; align-items: start; background: #e8f5e9;';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `lp-line-${idx}`;
                checkbox.checked = true;
                checkbox.style.cssText = 'margin-top: 0.25rem; cursor: pointer;';
                
                const label = document.createElement('label');
                label.htmlFor = `lp-line-${idx}`;
                label.textContent = maal;
                label.style.cssText = 'cursor: pointer; flex: 1; font-size: 0.95rem;';
                
                div.appendChild(checkbox);
                div.appendChild(label);
                contentDiv.appendChild(div);
            });
            
            linjer = sett.maal.map((tekst, index) => ({ tekst, erKompetansemaal: true, index }));
        }
        
    } else {
        // Ikkje Udir-format - bruk generell deteksjon
        tittelInput.value = filnavn.replace(/\.(pdf|docx)$/i, '').replace(/_/g, ' ');
        kodeInput.value = '';
        
        linjer = identifiserKompetansemaal(tekst);
        
        linjer.forEach((linje, idx) => {
            const div = document.createElement('div');
            div.style.cssText = 'display: flex; gap: 0.5rem; padding: 0.5rem; border-bottom: 1px solid #eee; align-items: start;';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `lp-line-${idx}`;
            checkbox.checked = linje.erKompetansemaal;
            checkbox.style.cssText = 'margin-top: 0.25rem; cursor: pointer;';
            
            const label = document.createElement('label');
            label.htmlFor = `lp-line-${idx}`;
            label.textContent = linje.tekst;
            label.style.cssText = 'cursor: pointer; flex: 1; font-size: 0.95rem;';
            
            if (linje.erKompetansemaal) {
                div.style.background = '#e8f5e9';
            }
            
            div.appendChild(checkbox);
            div.appendChild(label);
            contentDiv.appendChild(div);
        });
    }
    
    // Vis modal
    modal.style.display = 'block';
    
    // Setup event handlers
    setupParseModalHandlers(linjer, erUdirFormat, udirData);
}

function setupParseModalHandlers(linjer, erUdirFormat, udirData) {
    const modal = document.getElementById('lp-parse-modal');
    const closeBtn = document.getElementById('lp-parse-close');
    const cancelBtn = document.getElementById('lp-parse-cancel');
    const saveBtn = document.getElementById('lp-parse-save');
    const selectAllBtn = document.getElementById('lp-parse-select-all');
    const deselectAllBtn = document.getElementById('lp-parse-deselect-all');
    const contentDiv = document.getElementById('lp-parse-content');
    
    const lukk = () => { modal.style.display = 'none'; };
    
    if (closeBtn) closeBtn.onclick = lukk;
    if (cancelBtn) cancelBtn.onclick = lukk;
    
    // Merk alle / Avmerk alle - fungerer ikkje for Udir-format med fleire sett
    if (selectAllBtn && deselectAllBtn) {
        if (erUdirFormat && udirData && udirData.kompetansemaalSett.length > 1) {
            // For Udir med fleire sett - merk/avmerk sett-checkbox
            selectAllBtn.onclick = () => {
                udirData.kompetansemaalSett.forEach((_, idx) => {
                    const cb = document.getElementById(`udir-sett-${idx}`);
                    if (cb) cb.checked = true;
                });
            };
            deselectAllBtn.onclick = () => {
                udirData.kompetansemaalSett.forEach((_, idx) => {
                    const cb = document.getElementById(`udir-sett-${idx}`);
                    if (cb) cb.checked = false;
                });
            };
        } else {
            // For enkle linjer
            selectAllBtn.onclick = () => {
                linjer.forEach((_, idx) => {
                    const cb = document.getElementById(`lp-line-${idx}`);
                    if (cb) cb.checked = true;
                });
            };
            deselectAllBtn.onclick = () => {
                linjer.forEach((_, idx) => {
                    const cb = document.getElementById(`lp-line-${idx}`);
                    if (cb) cb.checked = false;
                });
            };
        }
    }
    
    if (saveBtn) {
        saveBtn.onclick = async () => {
            const tittel = document.getElementById('lp-parse-tittel').value.trim();
            const kode = document.getElementById('lp-parse-kode').value.trim();
            
            if (!tittel) {
                visToast('Du må skrive inn ein tittel', 'error');
                return;
            }
            
            let alleMaal = [];
            let alleGrunnferdigheter = [];
            
            if (erUdirFormat && udirData && udirData.kompetansemaalSett.length > 1) {
                // Fleire sett - sjekk kva som er valt
                udirData.kompetansemaalSett.forEach((sett, idx) => {
                    const cb = document.getElementById(`udir-sett-${idx}`);
                    if (cb && cb.checked) {
                        alleMaal = alleMaal.concat(sett.maal);
                    }
                });
                
                if (alleMaal.length === 0) {
                    visToast('Du må velje minst eitt kompetansemålsett', 'error');
                    return;
                }
                
                // Bruk grunnferdigheter frå Udir-data
                alleGrunnferdigheter = udirData.grunnferdigheter || [];
                
            } else if (erUdirFormat && udirData && udirData.kompetansemaalSett.length === 1) {
                // Eitt sett - samle valde linjer
                linjer.forEach((linje, idx) => {
                    const cb = document.getElementById(`lp-line-${idx}`);
                    if (cb && cb.checked) {
                        alleMaal.push(linje.tekst);
                    }
                });
                
                if (alleMaal.length === 0) {
                    visToast('Du må velje minst eitt kompetansemål', 'error');
                    return;
                }
                
                alleGrunnferdigheter = udirData.grunnferdigheter || [];
                
            } else {
                // Generell format - samle valde linjer
                linjer.forEach((linje, idx) => {
                    const cb = document.getElementById(`lp-line-${idx}`);
                    if (cb && cb.checked) {
                        alleMaal.push(linje.tekst);
                    }
                });
                
                if (alleMaal.length === 0) {
                    visToast('Du må velje minst eitt kompetansemål', 'error');
                    return;
                }
            }
            
            // Lagre læreplan
            const id = kode || ('LP_' + Math.random().toString(36).slice(2));
            
            await lagreLaereplan({
                id,
                kode: kode || '',
                tittel,
                kompetansemaal: alleMaal,
                kjerneelement: [],
                grunnferdigheter: alleGrunnferdigheter,
                oppretta: new Date().toISOString()
            });
            
            // Oppdater UI
            await initLaereplanUI();
            await oppdaterKompetansemaalDropdown();
            
            const beskrivelse = erUdirFormat ? ' (Udir-format)' : '';
            visToast(`✓ Læreplan "${tittel}" lagra med ${alleMaal.length} kompetansemål${beskrivelse}!`, 'success');
            lukk();
        };
    }
}

async function oppdaterKompetansemaalDropdown() {
    const gfSel = document.getElementById('grunnferdigheit');
    const kmSel = document.getElementById('kompetansemaal');
    if (!kmSel) return;
    
    // Nullstill grunnferdigheit-select
    if (gfSel) {
        gfSel.innerHTML = '';
        const g0 = document.createElement('option');
        g0.value = '';
        g0.textContent = 'Ingen';
        gfSel.appendChild(g0);
    }

    const innstillinger = await hentInnstillinger();
    
    // Prøv å finne fag-select (kan vere 'vurd-fag' i hurtigmodus eller 'fag' andre plassar)
    const fagSel = document.getElementById('vurd-fag') || document.getElementById('fag');
    const fag = fagSel ? fagSel.value : '';

    // Nullstill kompetansemål-select
    kmSel.innerHTML = '';
    const opt0 = document.createElement('option');
    opt0.value = '';
    opt0.textContent = 'Ingen';
    kmSel.appendChild(opt0);

    // Sjekk om vi har eit fag valt
    if (!fag) {
        return;
    }

    const map = innstillinger.fagTilLaereplan || {};
    const lpId = map[fag] || '';
    
    if (!lpId) {
        console.log(`Ingen læreplan kopla til faget "${fag}"`);
        return;
    }

    const alle = await hentAlleLaereplaner();
    const lp = alle.find(x => x.id === lpId);
    
    if (!lp) {
        console.log(`Fann ikkje læreplan med ID: ${lpId}`);
        return;
    }
    
    console.log(`Lasta læreplan "${lp.tittel}" for faget "${fag}"`, lp);
    
    // Legg til grunnferdigheiter
    if (gfSel && lp.grunnferdigheter && lp.grunnferdigheter.length) {
        lp.grunnferdigheter.forEach((g, i) => {
            const opt = document.createElement('option');
            opt.value = `${lp.id}::g::${i}`;
            opt.textContent = g.substring(0, 100) + (g.length > 100 ? '...' : ''); // Kort versjon
            opt.title = g; // Full tekst som tooltip
            gfSel.appendChild(opt);
        });
        console.log(`Lagt til ${lp.grunnferdigheter.length} grunnferdigheiter`);
    }

    // Legg til kompetansemål
    if (lp.kompetansemaal && lp.kompetansemaal.length) {
        lp.kompetansemaal.forEach((m, i) => {
            const opt = document.createElement('option');
            opt.value = `${lp.id}::${i}`;
            opt.textContent = m.substring(0, 100) + (m.length > 100 ? '...' : ''); // Kort versjon
            opt.title = m; // Full tekst som tooltip
            kmSel.appendChild(opt);
        });
        console.log(`Lagt til ${lp.kompetansemaal.length} kompetansemål`);
    }
}


/* ========================================
   NYE FUNKSJONER V3
   - Grafikk og visualisering
   - Autosøk
   - Eksport til Excel/PDF
   - Mørk modus
   - Forbedret ferdighetsvisning
======================================== */

// ============ GRAFIKK OG VISUALISERING ============

let elevGraf = null;
let ferdigheterGraf = null;
let trendGraf = null;

// Initialiser grafikk-view
async function initGrafikkView() {
    // Fyll inn dropdown-menyar
    const faggruppeSel = document.getElementById('grafikk-faggruppe');
    const fagSel = document.getElementById('grafikk-fag');
    const skoleaarSel = document.getElementById('grafikk-skoleaar');

    if (faggruppeSel) {
        await fyllFaggruppeListe(faggruppeSel);
    }

    if (fagSel) {
        await fyllFagListe(fagSel);
    }

    if (skoleaarSel) {
        fyllSkoleaarListe(skoleaarSel);
    }

    // Event listeners
    if (faggruppeSel) faggruppeSel.addEventListener('change', oppdaterGrafikkStatistikk);
    if (fagSel) fagSel.addEventListener('change', oppdaterGrafikkStatistikk);
    if (skoleaarSel) skoleaarSel.addEventListener('change', oppdaterGrafikkStatistikk);

    oppdaterGrafikkStatistikk();
}

// Oppdater statistikk og grafikk
async function oppdaterGrafikkStatistikk() {
    const klasse = document.getElementById('grafikk-faggruppe')?.value || '';
    const fag = document.getElementById('grafikk-fag')?.value || '';
    const skoleaar = document.getElementById('grafikk-skoleaar')?.value || '';
    
    // Hent vurderingar basert på filter
    let vurderinger = await hentAlleVurderingar();

    if (klasse) {
        vurderinger = vurderinger.filter(v => v.faggruppe === klasse);
    }
    
    if (fag) {
        vurderinger = vurderinger.filter(v => v.fag === fag);
    }
    
    if (skoleaar) {
        vurderinger = vurderinger.filter(v => v.skoleaar === skoleaar);
    }
    
    // Oppdater statistikk-kort
    oppdaterStatistikkKort(vurderinger);
    
    // Oppdater grafikk
    oppdaterFerdigheterGraf(vurderinger);
    oppdaterHeatmap(vurderinger);
    oppdaterTrendGraf(vurderinger);
}

// Oppdater statistikk-kort
function oppdaterStatistikkKort(vurderinger) {
    const elever = new Set(vurderinger.map(v => v.elevId)).size;
    const totalt = vurderinger.length;
    const hoye = vurderinger.filter(v => v.vurdering === 'H').length;
    const lave = vurderinger.filter(v => v.vurdering === 'L').length;
    
    const hoyProsent = totalt > 0 ? Math.round((hoye / totalt) * 100) : 0;
    const lavProsent = totalt > 0 ? Math.round((lave / totalt) * 100) : 0;
    
    document.getElementById('stat-elever').textContent = elever;
    document.getElementById('stat-vurderinger').textContent = totalt;
    document.getElementById('stat-hoy').textContent = `${hoyProsent}%`;
    document.getElementById('stat-lav').textContent = `${lavProsent}%`;
}

// Oppdater ferdighets-graf
function oppdaterFerdigheterGraf(vurderinger) {
    const canvas = document.getElementById('ferdigheter-graf');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Tell ferdigheter per nivå
    const ferdigheter = ['Muntlig', 'Skrive', 'Lese', 'Rekne', 'Digital'];
    const data = {
        H: {},
        M: {},
        L: {}
    };
    
    ferdigheter.forEach(f => {
        data.H[f] = 0;
        data.M[f] = 0;
        data.L[f] = 0;
    });
    
    vurderinger.forEach(v => {
        if (v.ferdigheter) {
            Object.keys(v.ferdigheter).forEach(ferd => {
                const nivaa = v.ferdigheter[ferd];
                if (ferdigheter.includes(ferd) && data[nivaa]) {
                    data[nivaa][ferd]++;
                }
            });
        }
    });
    
    // Destroy existing chart
    if (ferdigheterGraf) {
        ferdigheterGraf.destroy();
    }
    
    // Create new chart
    ferdigheterGraf = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ferdigheter.map(f => getFerdighetsIkon(f) + ' ' + f),
            datasets: [
                {
                    label: 'Høy',
                    data: ferdigheter.map(f => data.H[f]),
                    backgroundColor: '#27ae60'
                },
                {
                    label: 'Middels',
                    data: ferdigheter.map(f => data.M[f]),
                    backgroundColor: '#f39c12'
                },
                {
                    label: 'Lav',
                    data: ferdigheter.map(f => data.L[f]),
                    backgroundColor: '#e74c3c'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: false
                }
            }
        }
    });
}

// Oppdater heatmap
async function oppdaterHeatmap(vurderinger) {
    const container = document.getElementById('heatmap-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Finn unike elever
    const elevIder = [...new Set(vurderinger.map(v => v.elevId))];
    
    if (elevIder.length === 0) {
        container.innerHTML = '<p>Ingen data å vise</p>';
        return;
    }
    
    const ferdigheter = ['Muntlig', 'Skrive', 'Lese', 'Rekne', 'Digital'];
    
    // Header row
    const headerRow = document.createElement('div');
    headerRow.className = 'heatmap-row';
    headerRow.innerHTML = '<div class="heatmap-label"></div>';
    ferdigheter.forEach(f => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-label';
        cell.textContent = getFerdighetsIkon(f);
        cell.title = f;
        headerRow.appendChild(cell);
    });
    container.appendChild(headerRow);
    
    // Data rows
    for (const elevId of elevIder) {
        const elev = await hentElev(elevId);
        if (!elev) continue;
        
        const row = document.createElement('div');
        row.className = 'heatmap-row';
        
        const label = document.createElement('div');
        label.className = 'heatmap-label';
        label.textContent = elev.navn;
        row.appendChild(label);
        
        // Finn siste vurdering for kvar ferdighet
        const elevVurderinger = vurderinger.filter(v => v.elevId === elevId);
        
        ferdigheter.forEach(ferd => {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            
            // Finn gjennomsnittsnivå for denne ferdigheita
            const nivaaer = [];
            elevVurderinger.forEach(v => {
                if (v.ferdigheter && v.ferdigheter[ferd]) {
                    nivaaer.push(v.ferdigheter[ferd]);
                }
            });
            
            if (nivaaer.length > 0) {
                const hoye = nivaaer.filter(n => n === 'H').length;
                const middels = nivaaer.filter(n => n === 'M').length;
                const lave = nivaaer.filter(n => n === 'L').length;
                
                let dominerende = '';
                if (hoye >= middels && hoye >= lave) {
                    dominerende = 'H';
                } else if (middels >= lave) {
                    dominerende = 'M';
                } else {
                    dominerende = 'L';
                }
                
                cell.textContent = dominerende;
                cell.className = `heatmap-cell ${dominerende === 'H' ? 'hoy' : dominerende === 'M' ? 'middels' : 'lav'}`;
                cell.title = `${elev.navn} - ${ferd}: ${nivaaer.length} vurdering${nivaaer.length > 1 ? 'er' : ''}`;
            } else {
                cell.textContent = '-';
                cell.className = 'heatmap-cell ingen';
                cell.title = `${elev.navn} - ${ferd}: Ingen vurderingar`;
            }
            
            row.appendChild(cell);
        });
        
        container.appendChild(row);
    }
}

// Oppdater trendgraf
function oppdaterTrendGraf(vurderinger) {
    const canvas = document.getElementById('trend-graf');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Sorter vurderingar etter dato
    const sortert = [...vurderinger].sort((a, b) => new Date(a.dato) - new Date(b.dato));
    
    // Grupper etter månad
    const maanedData = {};
    sortert.forEach(v => {
        const dato = new Date(v.dato);
        const maaned = `${dato.getFullYear()}-${String(dato.getMonth() + 1).padStart(2, '0')}`;
        
        if (!maanedData[maaned]) {
            maanedData[maaned] = { H: 0, M: 0, L: 0, totalt: 0 };
        }
        
        maanedData[maaned][v.vurdering]++;
        maanedData[maaned].totalt++;
    });
    
    // Konverter til arrays
    const labels = Object.keys(maanedData).sort();
    const hoyData = labels.map(m => (maanedData[m].H / maanedData[m].totalt * 100).toFixed(1));
    const middelsData = labels.map(m => (maanedData[m].M / maanedData[m].totalt * 100).toFixed(1));
    const lavData = labels.map(m => (maanedData[m].L / maanedData[m].totalt * 100).toFixed(1));
    
    // Destroy existing chart
    if (trendGraf) {
        trendGraf.destroy();
    }
    
    // Create new chart
    trendGraf = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Høy (%)',
                    data: hoyData,
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Middels (%)',
                    data: middelsData,
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Lav (%)',
                    data: lavData,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Ferdighetsikon hjelpefunksjon
function getFerdighetsIkon(ferdighet) {
    const ikoner = {
        'Muntlig': '📣',
        'Skrive': '✍️',
        'Lese': '📖',
        'Rekne': '🔢',
        'Digital': '💻'
    };
    return ikoner[ferdighet] || '';
}

// Elevgraf med valgfrie typer
async function visElevGraf(elevId) {
    const container = document.getElementById('elev-grafikk-container');
    const canvas = document.getElementById('elev-graf');
    
    if (!container || !canvas) return;
    
    container.style.display = 'block';
    
    const vurderinger = await hentVurderingarForElev(elevId);
    
    if (vurderinger.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    // Get selected graph type
    const graftype = document.querySelector('input[name="graftype"]:checked')?.value || 'line';
    
    tegnElevGraf(vurderinger, graftype);
}

function tegnElevGraf(vurderinger, type) {
    const canvas = document.getElementById('elev-graf');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Tell ferdigheter per nivå
    const ferdigheter = ['Muntlig', 'Skrive', 'Lese', 'Rekne', 'Digital'];
    const data = {
        H: {},
        M: {},
        L: {}
    };
    
    ferdigheter.forEach(f => {
        data.H[f] = 0;
        data.M[f] = 0;
        data.L[f] = 0;
    });
    
    vurderinger.forEach(v => {
        if (v.ferdigheter) {
            Object.keys(v.ferdigheter).forEach(ferd => {
                const nivaa = v.ferdigheter[ferd];
                if (ferdigheter.includes(ferd) && data[nivaa]) {
                    data[nivaa][ferd]++;
                }
            });
        }
    });
    
    // Destroy existing chart
    if (elevGraf) {
        elevGraf.destroy();
    }
    
    if (type === 'radar') {
        // Radardiagram - viser gjennomsnittsnivå
        const radarData = ferdigheter.map(f => {
            const totalt = data.H[f] + data.M[f] + data.L[f];
            if (totalt === 0) return 0;
            // Høy = 3, Middels = 2, Lav = 1
            const score = (data.H[f] * 3 + data.M[f] * 2 + data.L[f] * 1) / totalt;
            return score;
        });
        
        elevGraf = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ferdigheter.map(f => getFerdighetsIkon(f) + ' ' + f),
                datasets: [{
                    label: 'Ferdighetsnivå',
                    data: radarData,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: '#3498db',
                    pointBackgroundColor: '#3498db'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 3,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return ['', 'Lav', 'Middels', 'Høy'][value] || '';
                            }
                        }
                    }
                }
            }
        });
    } else if (type === 'bar') {
        // Stolpediagram
        elevGraf = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ferdigheter.map(f => getFerdighetsIkon(f) + ' ' + f),
                datasets: [
                    {
                        label: 'Høy',
                        data: ferdigheter.map(f => data.H[f]),
                        backgroundColor: '#27ae60'
                    },
                    {
                        label: 'Middels',
                        data: ferdigheter.map(f => data.M[f]),
                        backgroundColor: '#f39c12'
                    },
                    {
                        label: 'Lav',
                        data: ferdigheter.map(f => data.L[f]),
                        backgroundColor: '#e74c3c'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    } else {
        // Linjegraf - vis utvikling over tid
        const sortert = [...vurderinger].sort((a, b) => new Date(a.dato) - new Date(b.dato));
        
        // For hver ferdighet, lag en dataserie
        const datasets = ferdigheter.map(ferd => {
            const ferdData = [];
            let hTeller = 0;
            let mTeller = 0;
            let lTeller = 0;
            
            sortert.forEach(v => {
                if (v.ferdigheter && v.ferdigheter[ferd]) {
                    if (v.ferdigheter[ferd] === 'H') hTeller++;
                    else if (v.ferdigheter[ferd] === 'M') mTeller++;
                    else if (v.ferdigheter[ferd] === 'L') lTeller++;
                    
                    const totalt = hTeller + mTeller + lTeller;
                    const score = totalt > 0 ? (hTeller * 3 + mTeller * 2 + lTeller * 1) / totalt : 0;
                    ferdData.push(score);
                } else {
                    ferdData.push(null);
                }
            });
            
            return {
                label: getFerdighetsIkon(ferd) + ' ' + ferd,
                data: ferdData,
                borderWidth: 2,
                tension: 0.4,
                spanGaps: true
            };
        });
        
        elevGraf = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortert.map((v, i) => `Vurd. ${i + 1}`),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 3,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return ['', 'Lav', 'Middels', 'Høy'][value] || '';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }
}


// ============ EKSPORT TIL EXCEL OG PDF ============

// Eksporter til Excel
async function eksporterTilExcel() {
    const klasse = document.getElementById('oversikt-faggruppe')?.value || '';
    const fag = document.getElementById('oversikt-fag')?.value || '';
    const skoleaar = document.getElementById('oversikt-skoleaar')?.value || '';
    const semester = document.getElementById('oversikt-semester')?.value || '';
    
    if (!klasse || !fag) {
        visMelding('Vel klasse og fag først', 'error');
        return;
    }
    
    let vurderinger = await hentAlleVurderingar();
    
    vurderinger = vurderinger.filter(v =>
        v.faggruppe === klasse &&
        v.fag === fag &&
        (!skoleaar || v.skoleaar === skoleaar) &&
        (!semester || v.semester === semester)
    );
    
    if (vurderinger.length === 0) {
        visMelding('Ingen vurderingar å eksportere', 'error');
        return;
    }
    
    // Lag data for Excel
    const data = [];
    
    // Header
    data.push(['Elev', 'Dato', 'Tema', 'Vurdering', 'Muntlig', 'Skrive', 'Lese', 'Rekne', 'Digital', 'Kommentar']);
    
    // Data rows
    for (const v of vurderinger) {
        const elev = await hentElev(v.elevId);
        const elevNavn = elev ? elev.navn : 'Ukjend';
        
        data.push([
            elevNavn,
            v.dato || '',
            v.tema || '',
            v.vurdering || '',
            v.ferdigheter?.Muntlig || '',
            v.ferdigheter?.Skrive || '',
            v.ferdigheter?.Lese || '',
            v.ferdigheter?.Rekne || '',
            v.ferdigheter?.Digital || '',
            v.kommentar || ''
        ]);
    }
    
    // Lag workbook
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vurderingar');
    
    // Last ned
    const filnavn = `Vurderingar_${klasse}_${fag}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filnavn);
    
    visMelding('Excel-fil lasta ned!', 'success');
}

// Eksporter til PDF
async function eksporterTilPDF() {
    const { jsPDF } = window.jspdf;
    
    const klasse = document.getElementById('oversikt-faggruppe')?.value || '';
    const fag = document.getElementById('oversikt-fag')?.value || '';
    const skoleaar = document.getElementById('oversikt-skoleaar')?.value || '';
    const semester = document.getElementById('oversikt-semester')?.value || '';
    
    if (!klasse || !fag) {
        visMelding('Vel klasse og fag først', 'error');
        return;
    }
    
    let vurderinger = await hentAlleVurderingar();
    
    vurderinger = vurderinger.filter(v =>
        v.faggruppe === klasse &&
        v.fag === fag &&
        (!skoleaar || v.skoleaar === skoleaar) &&
        (!semester || v.semester === semester)
    );
    
    if (vurderinger.length === 0) {
        visMelding('Ingen vurderingar å eksportere', 'error');
        return;
    }
    
    const doc = new jsPDF();
    
    // Tittel
    doc.setFontSize(16);
    doc.text(`Vurderingsrapport - ${klasse} - ${fag}`, 14, 15);
    
    doc.setFontSize(10);
    doc.text(`Skoleår: ${skoleaar || 'Alle'}`, 14, 22);
    doc.text(`Semester: ${semester || 'Alle'}`, 14, 27);
    doc.text(`Generert: ${new Date().toLocaleDateString('no-NO')}`, 14, 32);
    
    // Lag tabell-data
    const tableData = [];
    for (const v of vurderinger) {
        const elev = await hentElev(v.elevId);
        const elevNavn = elev ? elev.navn : 'Ukjend';
        
        tableData.push([
            elevNavn,
            v.dato || '',
            v.tema || '',
            v.vurdering || '',
            Object.entries(v.ferdigheter || {}).map(([k, v]) => `${k}: ${v}`).join(', ') || 'Ingen'
        ]);
    }
    
    // Bruk autoTable plugin
    doc.autoTable({
        startY: 40,
        head: [['Elev', 'Dato', 'Tema', 'Vurdering', 'Ferdigheter']],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [44, 62, 80] }
    });
    
    // Last ned
    const filnavn = `Vurderingar_${klasse}_${fag}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filnavn);
    
    visMelding('PDF-fil lasta ned!', 'success');
}

// ============ AUTOSØK MED FUSE.JS ============

let fuseElever = null;
let fuseKompetansemaal = null;

// Initialiser Fuse for elevsøk
async function initElevSok() {
    const klasse = document.getElementById('hurtig-faggruppe')?.value;
    if (!klasse) return;
    
    const elever = await hentElevarIKlasse(klasse);
    
    fuseElever = new Fuse(elever, {
        keys: ['navn'],
        threshold: 0.3,
        includeScore: true
    });
}

// Søk i elever
function sokElever(query) {
    if (!fuseElever || !query) {
        visAlleElever();
        return;
    }
    
    const results = fuseElever.search(query);
    const elevListe = document.getElementById('hurtig-elevliste');
    
    if (!elevListe) return;
    
    elevListe.innerHTML = '';
    
    if (results.length === 0) {
        elevListe.innerHTML = '<p class="ingen-elev">Ingen elevar funne</p>';
        return;
    }
    
    results.forEach(result => {
        const elev = result.item;
        const elevDiv = document.createElement('div');
        elevDiv.className = 'elev-item';
        elevDiv.textContent = elev.navn;
        elevDiv.dataset.elevId = elev.id;
        
        elevDiv.addEventListener('click', () => {
            velgElev(elev);
        });
        
        elevListe.appendChild(elevDiv);
    });
}

// Vis alle elever
async function visAlleElever() {
    const klasse = document.getElementById('hurtig-faggruppe')?.value;
    if (!klasse) return;
    
    const elever = await hentElevarIKlasse(klasse);
    const elevListe = document.getElementById('hurtig-elevliste');
    
    if (!elevListe) return;
    
    elevListe.innerHTML = '';
    
    elever.forEach(elev => {
        const elevDiv = document.createElement('div');
        elevDiv.className = 'elev-item';
        elevDiv.textContent = elev.navn;
        elevDiv.dataset.elevId = elev.id;
        
        elevDiv.addEventListener('click', () => {
            velgElev(elev);
        });
        
        elevListe.appendChild(elevDiv);
    });
}

// Initialiser autosøk i kompetansemål
function initKompetansemaalSok(kompetansemaal) {
    fuseKompetansemaal = new Fuse(kompetansemaal, {
        keys: ['tekst'],
        threshold: 0.4,
        includeScore: true
    });
}

// Søk i kompetansemål
function sokKompetansemaal(query) {
    if (!fuseKompetansemaal || !query) {
        return [];
    }
    
    const results = fuseKompetansemaal.search(query);
    return results.slice(0, 5).map(r => r.item);
}

// ============ MØRK MODUS ============

function initDarkMode() {
    const toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) return;
    
    // Sjekk lagra preferanse
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        toggle.checked = true;
    }
    
    toggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    });
}

// ============ FORBEDRET FERDIGHETSVISNING ============

// Legg til ikoner i ferdighetsvisning
function leggTilFerdighetsIkoner() {
    const ferdighetsLabels = document.querySelectorAll('.ferdighet-label, .ferdighet-rad label');
    
    ferdighetsLabels.forEach(label => {
        const tekst = label.textContent.trim();
        const ikon = getFerdighetsIkon(tekst);
        
        if (ikon && !label.textContent.startsWith(ikon)) {
            label.textContent = ikon + ' ' + tekst;
        }
    });
}

// Fargekod ferdighets-badges
function fargekodFerdigheter() {
    document.querySelectorAll('.vurdering-badge').forEach(badge => {
        const nivaa = badge.textContent.trim();
        if (nivaa === 'H') {
            badge.classList.add('ferdighet-hoy');
        } else if (nivaa === 'M') {
            badge.classList.add('ferdighet-middels');
        } else if (nivaa === 'L') {
            badge.classList.add('ferdighet-lav');
        }
    });
}

// ============ AUTOMATISK FERDIGHETSFLAGGING ============

// Foreslå ferdigheter basert på kompetansemål
function forslaFerdigheter(kompetansemaalTekst) {
    if (!kompetansemaalTekst) return [];
    
    const tekst = kompetansemaalTekst.toLowerCase();
    const forslag = [];
    
    // Mønstergjenkjenning for ferdigheter
    if (tekst.includes('presentere') || tekst.includes('formidle') || tekst.includes('drøfte')) {
        forslag.push('Muntlig');
    }
    
    if (tekst.includes('skrive') || tekst.includes('formulere') || tekst.includes('utforme')) {
        forslag.push('Skrive');
    }
    
    if (tekst.includes('lese') || tekst.includes('utforske') || tekst.includes('analysere')) {
        forslag.push('Lese');
    }
    
    if (tekst.includes('rekne') || tekst.includes('beregne') || tekst.includes('statistikk')) {
        forslag.push('Rekne');
    }
    
    if (tekst.includes('digital') || tekst.includes('nett') || tekst.includes('teknologi')) {
        forslag.push('Digital');
    }
    
    return [...new Set(forslag)];
}

// ============ DUMMY-FUNKSJONAR FOR BAKOVERKOMPATIBILITET ============

// Desse funksjonane er flytta til andre modular eller er ikkje lenger nødvendige
function fyllSkoleaarListe(selectElement) {
    // Fyller dropdown med skoleår
    const currentYear = new Date().getFullYear();
    for (let i = -2; i <= 2; i++) {
        const year = currentYear + i;
        const option = document.createElement('option');
        option.value = `${year}-${year + 1}`;
        option.textContent = `${year}/${year + 1}`;
        selectElement.appendChild(option);
    }
}

async function fyllFaggruppeListe(selectElement) {
    if (!selectElement) return;

    const elever = await hentAlleElever();
    const faggrupper = [...new Set(elever.map(e => e.faggruppe).filter(Boolean))].sort();

    const currentValue = selectElement.value;
    selectElement.innerHTML = '<option value="">Alle faggrupper</option>';

    faggrupper.forEach(fg => {
        const option = document.createElement('option');
        option.value = fg;
        option.textContent = fg;
        selectElement.appendChild(option);
    });

    if (currentValue && faggrupper.includes(currentValue)) {
        selectElement.value = currentValue;
    }
}

async function fyllFagListe(selectElement) {
    if (!selectElement) return;

    const fagliste = await hentFagNamn();

    const currentValue = selectElement.value;
    selectElement.innerHTML = '<option value="">Alle fag</option>';

    fagliste.forEach(fag => {
        const option = document.createElement('option');
        option.value = fag;
        option.textContent = fag;
        selectElement.appendChild(option);
    });

    if (currentValue && fagliste.includes(currentValue)) {
        selectElement.value = currentValue;
    }
}

async function initKlasseadministrasjon() {
    // Flytta til enhancements.js / elevadministrasjon.js
    return Promise.resolve();
}

async function initFagadministrasjon() {
    // Flytta til enhancements.js
    return Promise.resolve();
}

async function initLaereplanKopling() {
    // Flytta til verbbibliotek.js
    return Promise.resolve();
}

async function initAdministrerLaereplaner() {
    // Flytta til verbbibliotek.js
    return Promise.resolve();
}

async function hentAlleVurderingar() {
    // Hent alle vurderingar frå database
    if (!db) await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['vurderinger'], 'readonly');
        const store = transaction.objectStore('vurderinger');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => {
            console.error('Feil ved henting av vurderingar:', request.error);
            resolve([]);
        };
    });
}

// ============ INITIALISERING ============

// App initialisert via DOMContentLoaded i andre modular
console.log('Vurderingsapp v3 - Hovudmodul lasta');

