// i18n System for Vurderingsapp v3 (Embedded translations - no CORS issues)
// Alpindata - Hans Petter Brunstad Sørensen

// Embedded translations
const TRANSLATIONS = {
    nn: {"app":{"title":"Vurderingsapp v3","subtitle":"© Alpindata, Hans Petter Brunstad Sørensen"},"nav":{"hurtigmodus":"Hurtigmodus","elevoversikt":"Elevoversikt","fagoversikt":"Fagoversikt","grafikk":"Grafikk","historikk":"Historikk","innstillingar":"Innstillingar","hjelp":"Hjelp"},"context":{"skulenamn":"Skulenamn","skoleaar":"Skoleår","semester":"Semester","semesterVaar":"Vår","semesterHaust":"Haust","fag":"Fag","faggruppe":"Faggruppe","basisgruppe":"Basisgruppe"},"hurtigmodus":{"title":"Hurtigmodus","velFaggruppe":"Vel faggruppe","velElev":"← Vel ein elev først","elevliste":"Elevar","sokElev":"🔍 Søk elev...","nyVurdering":"Ny vurdering","ingenElevar":"Ingen elevar i denne faggruppa","velFaggruppeForst":"-- Vel faggruppe --"},"vurdering":{"tema":"Tema","dato":"Dato","vurderingstype":"Vurderingstype","klasserom":"Klasseromsvurdering","skriftleg":"Skriftleg prøve","niva":"Nivå","poeng":"Poeng","maksPoeng":"Maks poeng","karakter":"Karakter","grunnleggjandeFerdigheiter":"Grunnleggjande ferdigheiter","verb":"Verb","kommentar":"Kommentar","lagre":"Lagre vurdering","muntleg":"📣 Muntleg","skrive":"✍️ Skrive","lese":"📖 Lese","rekne":"🔢 Rekne","digital":"💻 Digital"},"elevoversikt":{"title":"Elevoversikt","velFag":"Vel fag","velFaggruppe":"Vel faggruppe","ingenElevar":"Ingen elevar registrert","ingenVurderingar":"Ingen vurderingar","sisteVurdering":"Siste vurdering","antallVurderingar":"Tal vurderingar","manglarVurdering":"Manglar vurdering siste {days} dagar"},"fagoversikt":{"title":"Fagoversikt","fag":"Fag","status":"Status","lereplan":"Læreplan","elevtal":"Elevtal","verbtal":"Verbtal","lereplanKopla":"Læreplan kopla","ingenLereplan":"Ingen læreplan","aktivt":"Aktivt","inaktivt":"Inaktivt","leggTilFag":"Legg til fag"},"grafikk":{"title":"Grafikk og statistikk","totaltElevar":"Totalt elevar","vurderingar":"Vurderingar","hogMaloppnaelse":"Høg måloppnåelse","trengOppfolging":"Treng oppfølging","ferdigheitOversikt":"Ferdigheitsoversikt","heatmap":"Heatmap - Ferdigheiter per elev","trendgraf":"Trendgraf - Utvikling over tid"},"historikk":{"title":"Historikk","sokVurderingar":"Søk i vurderingar...","filtrer":"Filtrer","arkiv":"Arkiv","apneArkiv":"Opne arkiv","ingenVurderingar":"Ingen vurderingar funne"},"innstillingar":{"title":"Innstillingar","generelt":"Generelt","sprak":"Språk og vising","fag":"Fag og læreplanar","elevar":"Elevar per fag","data":"Data, tryggleik og automatisering","skulenamn":"Skulenamn","skoleaar":"Skoleår","visFaggrupper":"Vis faggrupper","visElevbilete":"Vis elevbilete","sprakval":"Språkval","nynorsk":"Nynorsk","bokmal":"Bokmål","english":"English","morkModus":"🌙 Mørk modus","fargetema":"Fargetema","temaBlaa":"Blå","temaGronn":"Grøn","temaLilla":"Lilla","temaOransje":"Oransje","leggTilFag":"Legg til fag","lastOppLereplan":"Last opp læreplan (docx)","analyserLereplan":"Analyser læreplan","slettLereplan":"Slett læreplan","verbbibliotek":"Verbbibliotek","importElevar":"Importer elevar","csvImport":"CSV-import","vismaLimInn":"Visma lim inn","manuellLeggTil":"Manuell legg til","backup":"Backup og gjenopprett","lastNedBackup":"Last ned backup","gjenopprett":"Gjenopprett frå backup","automatiskeForslag":"Aktiver automatiske forslag for detaljvurdering","varselManglande":"Marker elevar som ikkje er vurdert på","dagar":"dagar","fagoppsummeringLengde":"Fagoppsummering lengde","kort":"Kort","middels":"Middels","lang":"Lang","personvern":"All data blir lagra lokalt på denne PC-en. Appen bruker ikkje skytenester og deler ingen data med tredjepart.","support":"Support: Alpindata, Hans Petter Brunstad Sørensen, epost: post@alpindata.no","lisens":"Lisens og rettar: Denne appen er utvikla og eigd av Alpindata. All bruk er underlagt gjeldande lisensvilkår. Kjeldekode, design og funksjonalitet er verna av opphavsrett."},"bekreftingar":{"lagra":"Endringar er lagra","sprakEndra":"Språket er endra til {language}","skoleaarEndra":"Skoleåret er endra. Tidlegare vurderingar er arkiverte.","lereplanAnalysert":"Læreplan er analysert og lagra","lereplanKopla":"Læreplan er kopla til fag","lereplanSletta":"Læreplan er sletta","backupLasta":"Backup er lasta ned","backupGjenoppretta":"Backup er gjenoppretta","elevImportert":"Elevar importert: {nye} nye, {oppdaterte} oppdaterte","vurderingLagra":"Vurdering er lagra"},"dialogar":{"stadfest":"Stadfest","avbryt":"Avbryt","slett":"Slett","slettFaggruppe":"Er du sikker på at du vil slette denne faggruppa? Denne handlinga kan ikkje angrast.","slettElev":"Er du sikker på at du vil slette denne eleven? All historikk vil gå tapt. Denne handlinga kan ikkje angrast.","slettAlt":"ADVARSEL: Dette vil slette ALLE data i appen. Denne handlinga kan IKKJE angrast. Er du heilt sikker?","slettLereplan":"Er du sikker på at du vil slette læreplanen? Verb frå læreplanen blir fjerna frå verbbiblioteket.","bytteSkoleaar":"Når du bytter skoleår blir alle vurderingar frå tidlegare skoleår arkiverte. Vil du fortsette?"},"errors":{"ingenFagValt":"Du må velje eit fag først","ingenFaggruppeValt":"Du må velje ei faggruppe først","ingenElevValt":"Du må velje ein elev først","manglarFelt":"Du må fylle ut alle påkravde felt","lastOppFeil":"Feil ved opplasting av fil","importFeil":"Feil ved import av data"}},
    nb: {"app":{"title":"Vurderingsapp v3","subtitle":"© Alpindata, Hans Petter Brunstad Sørensen"},"nav":{"hurtigmodus":"Hurtigmodus","elevoversikt":"Elevoversikt","fagoversikt":"Fagoversikt","grafikk":"Grafikk","historikk":"Historikk","innstillingar":"Innstillinger","hjelp":"Hjelp"},"context":{"skulenamn":"Skolenavn","skoleaar":"Skoleår","semester":"Semester","semesterVaar":"Vår","semesterHaust":"Høst","fag":"Fag","faggruppe":"Faggruppe","basisgruppe":"Basisgruppe"},"hurtigmodus":{"title":"Hurtigmodus","velFaggruppe":"Velg faggruppe","velElev":"← Velg en elev først","elevliste":"Elever","sokElev":"🔍 Søk elev...","nyVurdering":"Ny vurdering","ingenElevar":"Ingen elever i denne faggruppen","velFaggruppeForst":"-- Velg faggruppe --"},"vurdering":{"tema":"Tema","dato":"Dato","vurderingstype":"Vurderingstype","klasserom":"Klasseromsvurdering","skriftleg":"Skriftlig prøve","niva":"Nivå","poeng":"Poeng","maksPoeng":"Maks poeng","karakter":"Karakter","grunnleggjandeFerdigheiter":"Grunnleggende ferdigheter","verb":"Verb","kommentar":"Kommentar","lagre":"Lagre vurdering","muntleg":"📣 Muntlig","skrive":"✍️ Skrive","lese":"📖 Lese","rekne":"🔢 Regne","digital":"💻 Digital"},"elevoversikt":{"title":"Elevoversikt","velFag":"Velg fag","velFaggruppe":"Velg faggruppe","ingenElevar":"Ingen elever registrert","ingenVurderingar":"Ingen vurderinger","sisteVurdering":"Siste vurdering","antallVurderingar":"Antall vurderinger","manglarVurdering":"Mangler vurdering siste {days} dager"},"fagoversikt":{"title":"Fagoversikt","fag":"Fag","status":"Status","lereplan":"Læreplan","elevtal":"Elevtall","verbtal":"Verbtall","lereplanKopla":"Læreplan koblet","ingenLereplan":"Ingen læreplan","aktivt":"Aktivt","inaktivt":"Inaktivt","leggTilFag":"Legg til fag"},"grafikk":{"title":"Grafikk og statistikk","totaltElevar":"Totalt elever","vurderingar":"Vurderinger","hogMaloppnaelse":"Høy måloppnåelse","trengOppfolging":"Trenger oppfølging","ferdigheitOversikt":"Ferdighetsoversikt","heatmap":"Heatmap - Ferdigheter per elev","trendgraf":"Trendgraf - Utvikling over tid"},"historikk":{"title":"Historikk","sokVurderingar":"Søk i vurderinger...","filtrer":"Filtrer","arkiv":"Arkiv","apneArkiv":"Åpne arkiv","ingenVurderingar":"Ingen vurderinger funnet"},"innstillingar":{"title":"Innstillinger","generelt":"Generelt","sprak":"Språk og visning","fag":"Fag og læreplaner","elevar":"Elever per fag","data":"Data, sikkerhet og automatisering","skulenamn":"Skolenavn","skoleaar":"Skoleår","visFaggrupper":"Vis faggrupper","visElevbilete":"Vis elevbilder","sprakval":"Språkvalg","nynorsk":"Nynorsk","bokmal":"Bokmål","english":"English","morkModus":"🌙 Mørk modus","fargetema":"Fargetema","temaBlaa":"Blå","temaGronn":"Grønn","temaLilla":"Lilla","temaOransje":"Oransje","leggTilFag":"Legg til fag","lastOppLereplan":"Last opp læreplan (docx)","analyserLereplan":"Analyser læreplan","slettLereplan":"Slett læreplan","verbbibliotek":"Verbbibliotek","importElevar":"Importer elever","csvImport":"CSV-import","vismaLimInn":"Visma lim inn","manuellLeggTil":"Manuell legg til","backup":"Backup og gjenopprett","lastNedBackup":"Last ned backup","gjenopprett":"Gjenopprett fra backup","automatiskeForslag":"Aktiver automatiske forslag for detaljvurdering","varselManglande":"Marker elever som ikke er vurdert på","dagar":"dager","fagoppsummeringLengde":"Fagoppsummering lengde","kort":"Kort","middels":"Middels","lang":"Lang","personvern":"All data blir lagret lokalt på denne PC-en. Appen bruker ikke skytjenester og deler ingen data med tredjepart.","support":"Support: Alpindata, Hans Petter Brunstad Sørensen, epost: post@alpindata.no","lisens":"Lisens og rettigheter: Denne appen er utviklet og eid av Alpindata. All bruk er underlagt gjeldende lisensvilkår. Kildekode, design og funksjonalitet er beskyttet av opphavsrett."},"bekreftingar":{"lagra":"Endringer er lagret","sprakEndra":"Språket er endret til {language}","skoleaarEndra":"Skoleåret er endret. Tidligere vurderinger er arkivert.","lereplanAnalysert":"Læreplan er analysert og lagret","lereplanKopla":"Læreplan er koblet til fag","lereplanSletta":"Læreplan er slettet","backupLasta":"Backup er lastet ned","backupGjenoppretta":"Backup er gjenopprettet","elevImportert":"Elever importert: {nye} nye, {oppdaterte} oppdaterte","vurderingLagra":"Vurdering er lagret"},"dialogar":{"stadfest":"Bekreft","avbryt":"Avbryt","slett":"Slett","slettFaggruppe":"Er du sikker på at du vil slette denne faggruppen? Denne handlingen kan ikke angres.","slettElev":"Er du sikker på at du vil slette denne eleven? All historikk vil gå tapt. Denne handlingen kan ikke angres.","slettAlt":"ADVARSEL: Dette vil slette ALLE data i appen. Denne handlingen kan IKKE angres. Er du helt sikker?","slettLereplan":"Er du sikker på at du vil slette læreplanen? Verb fra læreplanen blir fjernet fra verbbiblioteket.","bytteSkoleaar":"Når du bytter skoleår blir alle vurderinger fra tidligere skoleår arkivert. Vil du fortsette?"},"errors":{"ingenFagValt":"Du må velge et fag først","ingenFaggruppeValt":"Du må velge en faggruppe først","ingenElevValt":"Du må velge en elev først","manglarFelt":"Du må fylle ut alle påkrevde felt","lastOppFeil":"Feil ved opplasting av fil","importFeil":"Feil ved import av data"}},
    en: {"app":{"title":"Assessment App v3","subtitle":"© Alpindata, Hans Petter Brunstad Sørensen"},"nav":{"hurtigmodus":"Quick Mode","elevoversikt":"Student Overview","fagoversikt":"Subject Overview","grafikk":"Graphics","historikk":"History","innstillingar":"Settings","hjelp":"Help"},"context":{"skulenamn":"School Name","skoleaar":"School Year","semester":"Semester","semesterVaar":"Spring","semesterHaust":"Fall","fag":"Subject","faggruppe":"Subject Group","basisgruppe":"Base Group"},"hurtigmodus":{"title":"Quick Mode","velFaggruppe":"Select subject group","velElev":"← Select a student first","elevliste":"Students","sokElev":"🔍 Search student...","nyVurdering":"New assessment","ingenElevar":"No students in this subject group","velFaggruppeForst":"-- Select subject group --"},"vurdering":{"tema":"Topic","dato":"Date","vurderingstype":"Assessment Type","klasserom":"Classroom Assessment","skriftleg":"Written Test","niva":"Level","poeng":"Points","maksPoeng":"Max Points","karakter":"Grade","grunnleggjandeFerdigheiter":"Basic Skills","verb":"Verb","kommentar":"Comment","lagre":"Save Assessment","muntleg":"📣 Oral","skrive":"✍️ Writing","lese":"📖 Reading","rekne":"🔢 Numeracy","digital":"💻 Digital"},"elevoversikt":{"title":"Student Overview","velFag":"Select subject","velFaggruppe":"Select subject group","ingenElevar":"No students registered","ingenVurderingar":"No assessments","sisteVurdering":"Last assessment","antallVurderingar":"Number of assessments","manglarVurdering":"Missing assessment last {days} days"},"fagoversikt":{"title":"Subject Overview","fag":"Subject","status":"Status","lereplan":"Curriculum","elevtal":"Students","verbtal":"Verbs","lereplanKopla":"Curriculum linked","ingenLereplan":"No curriculum","aktivt":"Active","inaktivt":"Inactive","leggTilFag":"Add subject"},"grafikk":{"title":"Graphics and Statistics","totaltElevar":"Total Students","vurderingar":"Assessments","hogMaloppnaelse":"High Achievement","trengOppfolging":"Needs Follow-up","ferdigheitOversikt":"Skills Overview","heatmap":"Heatmap - Skills per Student","trendgraf":"Trendgraph - Development Over Time"},"historikk":{"title":"History","sokVurderingar":"Search assessments...","filtrer":"Filter","arkiv":"Archive","apneArkiv":"Open archive","ingenVurderingar":"No assessments found"},"innstillingar":{"title":"Settings","generelt":"General","sprak":"Language and Display","fag":"Subjects and Curriculums","elevar":"Students per subject","data":"Data, Security and Automation","skulenamn":"School Name","skoleaar":"School Year","visFaggrupper":"Show subject groups","visElevbilete":"Show student photos","sprakval":"Language Selection","nynorsk":"Nynorsk","bokmal":"Bokmål","english":"English","morkModus":"🌙 Dark Mode","fargetema":"Color Theme","temaBlaa":"Blue","temaGronn":"Green","temaLilla":"Purple","temaOransje":"Orange","leggTilFag":"Add subject","lastOppLereplan":"Upload curriculum (docx)","analyserLereplan":"Analyze curriculum","slettLereplan":"Delete curriculum","verbbibliotek":"Verb Library","importElevar":"Import students","csvImport":"CSV import","vismaLimInn":"Visma paste","manuellLeggTil":"Manual add","backup":"Backup and Restore","lastNedBackup":"Download backup","gjenopprett":"Restore from backup","automatiskeForslag":"Enable automatic suggestions for detailed assessment","varselManglande":"Mark students not assessed in","dagar":"days","fagoppsummeringLengde":"Subject summary length","kort":"Short","middels":"Medium","lang":"Long","personvern":"All data is stored locally on this PC. The app does not use cloud services and shares no data with third parties.","support":"Support: Alpindata, Hans Petter Brunstad Sørensen, email: post@alpindata.no","lisens":"License and Rights: This app is developed and owned by Alpindata. All use is subject to applicable license terms. Source code, design and functionality are protected by copyright."},"bekreftingar":{"lagra":"Changes saved","sprakEndra":"Language changed to {language}","skoleaarEndra":"School year changed. Previous assessments are archived.","lereplanAnalysert":"Curriculum analyzed and saved","lereplanKopla":"Curriculum linked to subject","lereplanSletta":"Curriculum deleted","backupLasta":"Backup downloaded","backupGjenoppretta":"Backup restored","elevImportert":"Students imported: {nye} new, {oppdaterte} updated","vurderingLagra":"Assessment saved"},"dialogar":{"stadfest":"Confirm","avbryt":"Cancel","slett":"Delete","slettFaggruppe":"Are you sure you want to delete this subject group? This action cannot be undone.","slettElev":"Are you sure you want to delete this student? All history will be lost. This action cannot be undone.","slettAlt":"WARNING: This will delete ALL data in the app. This action CANNOT be undone. Are you absolutely sure?","slettLereplan":"Are you sure you want to delete the curriculum? Verbs from the curriculum will be removed from the verb library.","bytteSkoleaar":"When you change school year, all assessments from previous school years are archived. Do you want to continue?"},"errors":{"ingenFagValt":"You must select a subject first","ingenFaggruppeValt":"You must select a subject group first","ingenElevValt":"You must select a student first","manglarFelt":"You must fill out all required fields","lastOppFeil":"Error uploading file","importFeil":"Error importing data"}}
};

class I18n {
    constructor() {
        this.currentLanguage = 'nn';
        this.translations = TRANSLATIONS.nn;
        this.fallbackLanguage = 'nn';
    }

    async init() {
        const savedLang = localStorage.getItem('appLanguage') || 'nn';
        this.loadLanguage(savedLang);
    }

    loadLanguage(lang) {
        if (TRANSLATIONS[lang]) {
            this.translations = TRANSLATIONS[lang];
            this.currentLanguage = lang;
            localStorage.setItem('appLanguage', lang);
            this.updatePage();
            return true;
        } else {
            console.error('Language not found:', lang);
            return false;
        }
    }

    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations;

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) {
                console.warn(`Translation missing: ${key}`);
                return key;
            }
        }

        if (typeof value === 'string') {
            return this.interpolate(value, params);
        }

        return value;
    }

    interpolate(str, params) {
        return str.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
    }

    updatePage() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.hasAttribute('data-i18n-placeholder')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }
}

const i18n = new I18n();

document.addEventListener('DOMContentLoaded', () => {
    i18n.init();

    const languageBtn = document.getElementById('language-btn');
    if (languageBtn) {
        languageBtn.addEventListener('click', () => {
            showLanguagePicker();
        });
    }
});

function showLanguagePicker() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <span class="close">&times;</span>
            <h2>🌐 Velg språk / Choose language</h2>
            
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem;">
                <button class="btn-primary" data-lang="nn">🇳🇴 Nynorsk</button>
                <button class="btn-primary" data-lang="nb">🇳🇴 Bokmål</button>
                <button class="btn-primary" data-lang="en">🇬🇧 English</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const lang = btn.getAttribute('data-lang');
            i18n.loadLanguage(lang);
            
            const langNames = { nn: 'Nynorsk', nb: 'Bokmål', en: 'English' };
            if (typeof showConfirmation === 'function') {
                showConfirmation(`Språk endra til ${langNames[lang]}`, 'success');
            }
            
            document.body.removeChild(modal);
        });
    });
}

window.i18n = i18n;
window.showLanguagePicker = showLanguagePicker;
