// Verbbibliotek for Vurderingsapp v3.0.3
// Håndterer standard Udir-verb, læreplanverb og eigendefinerte verb
// © Alpindata

const DB_NAME = 'VurderingsappDB';

// ========================================
// STANDARD UDIR-VERB (LK20)
// ========================================

/**
 * Standard verb frå Udir sine retningslinjer for læreplanutforming
 * Organisert etter Blooms taksonomi
 */
const STANDARD_VERB = {
    // Kunnskapsverb (Remembering/Understanding)
    kunnskap: [
        { verb: 'beskrive', tyding: 'fortelje om eigenskapar, samanhengar og prosessar' },
        { verb: 'forklare', tyding: 'gjere greie for årsaker, samanhengar og verknader' },
        { verb: 'gjere greie for', tyding: 'presentere faktakunnskap på ein systematisk måte' },
        { verb: 'kjenne til', tyding: 'ha grunnleggande kunnskap om' },
        { verb: 'presentere', tyding: 'framstille noko munnleg eller skriftleg' },
        { verb: 'samanfatte', tyding: 'gje att dei viktigaste punkta på ein kort og konsis måte' },
        { verb: 'skildre', tyding: 'fortelje om noko på ein detaljert og levande måte' }
    ],

    // Forståingsverb (Understanding/Applying)
    forstaaing: [
        { verb: 'eksemplifisere', tyding: 'gje døme som illustrerer ein regel, ei forklaring eller eit omgrep' },
        { verb: 'illustrere', tyding: 'tydeleggjere ved hjelp av døme, modellar eller visualiseringar' },
        { verb: 'kategorisere', tyding: 'dele inn i grupper etter bestemte kriterium' },
        { verb: 'tolke', tyding: 'forklare og finne meining i ulike typar tekstar og uttrykk' },
        { verb: 'samanlikne', tyding: 'finne likskapar og forskjellar mellom fenomen' },
        { verb: 'utforske', tyding: 'undersøkje systematisk for å finne ny innsikt' }
    ],

    // Anvendingsverb (Applying/Analyzing)
    anvending: [
        { verb: 'bruke', tyding: 'ta i bruk kunnskap, ferdigheiter eller verktøy i nye situasjonar' },
        { verb: 'anvende', tyding: 'nytte kunnskap aktivt i praktiske eller teoretiske samanhengar' },
        { verb: 'lage', tyding: 'skape eller produsere noko nytt' },
        { verb: 'utarbeide', tyding: 'utvikle og framstille noko systematisk' },
        { verb: 'analysere', tyding: 'dele opp i einskilde delar og undersøkje samanhengar' },
        { verb: 'undersøkje', tyding: 'granske systematisk for å finne svar' },
        { verb: 'berekne', tyding: 'finne svar ved hjelp av tal og rekneoperasjonar' }
    ],

    // Evalueringsverb (Evaluating/Creating)
    evaluering: [
        { verb: 'vurdere', tyding: 'gjere ei begrunna vurdering av kvalitet, relevans eller verdi' },
        { verb: 'argumentere', tyding: 'gje grunngjevingar for eiga oppfatning eller påstand' },
        { verb: 'drøfte', tyding: 'vege ulike syn og argument mot kvarandre' },
        { verb: 'diskutere', tyding: 'utforske eit tema gjennom å presentere ulike perspektiv' },
        { verb: 'reflektere', tyding: 'tenkje kritisk over eigne opplevingar og læring' },
        { verb: 'ta stilling til', tyding: 'meir eller mindre spontant uttrykkje ei mening' },
        { verb: 'vurdere kritisk', tyding: 'granske og evaluere på ein analytisk og reflekterande måte' }
    ],

    // Kreativitetsverb (Creating)
    kreativitet: [
        { verb: 'skape', tyding: 'produsere noko originalt og nytt' },
        { verb: 'utforme', tyding: 'gje form og struktur til noko nytt' },
        { verb: 'designe', tyding: 'planleggje og utvikle noko med tanke på funksjon og estetikk' },
        { verb: 'komponere', tyding: 'setje saman ulike element til ein heilskap' },
        { verb: 'konstruere', tyding: 'byggje opp noko systematisk' }
    ],

    // Forskingsverb
    forsking: [
        { verb: 'observere', tyding: 'registrere systematisk ved hjelp av sansane' },
        { verb: 'eksperimentere', tyding: 'prøve ut noko systematisk for å teste ein hypotese' },
        { verb: 'dokumentere', tyding: 'registrere og presentere på ein etterprøvbar måte' },
        { verb: 'konkludere', tyding: 'trekkje slutningar basert på undersøkingar og analyse' }
    ],

    // Kommunikasjonsverb
    kommunikasjon: [
        { verb: 'kommunisere', tyding: 'dele informasjon, tankar eller kjensler med andre' },
        { verb: 'framføre', tyding: 'presentere noko munnleg eller scenisk' },
        { verb: 'formidle', tyding: 'gjere kjent på ein forståeleg måte' },
        { verb: 'uttrykke', tyding: 'gje form til tankar, kjensler eller idear' }
    ]
};

/**
 * Få alle standard verb som ein flat liste
 */
function hentAlleStandardVerb() {
    const alleVerb = [];
    for (const kategori in STANDARD_VERB) {
        alleVerb.push(...STANDARD_VERB[kategori]);
    }
    return alleVerb;
}

// ========================================
// DATABASE-OPERASJONAR FOR VERB
// ========================================

/**
 * Hent verbbibliotek for eit spesifikt fag
 */
async function hentVerbbibliotekForFag(fagId) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['fag'], 'readonly');
        const fagStore = transaction.objectStore('fag');
        const request = fagStore.get(fagId);

        request.onsuccess = () => {
            const fag = request.result;
            if (!fag) {
                resolve({
                    standard: hentAlleStandardVerb(),
                    fraaLæreplan: [],
                    eigne: []
                });
                return;
            }

            resolve({
                standard: hentAlleStandardVerb(),
                fraaLæreplan: fag.verbFraaLæreplan || [],
                eigne: fag.eigneVerb || []
            });
        };

        request.onerror = () => reject(request.error);
    });
}

/**
 * Lagre eigendefinert verb for eit fag
 */
async function lagreEigentVerb(fagId, verb, tyding) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['fag'], 'readwrite');
        const fagStore = transaction.objectStore('fag');
        const request = fagStore.get(fagId);

        request.onsuccess = () => {
            const fag = request.result;
            if (!fag) {
                reject(new Error('Fag ikkje funne'));
                return;
            }

            if (!fag.eigneVerb) {
                fag.eigneVerb = [];
            }

            // Sjekk om verbet allereie finst
            const finst = fag.eigneVerb.some(v => v.verb === verb);
            if (finst) {
                reject(new Error('Verbet finst allereie'));
                return;
            }

            fag.eigneVerb.push({ verb, tyding, lagt_til: new Date().toISOString() });

            const updateRequest = fagStore.put(fag);
            updateRequest.onsuccess = () => resolve(fag);
            updateRequest.onerror = () => reject(updateRequest.error);
        };

        request.onerror = () => reject(request.error);
    });
}

// ========================================
// LÆREPLAN-PARSING OG VERB-EKSTRAKSJON
// ========================================

/**
 * Parse DOCX-fil og ekstraher verb frå kompetansemål
 */
async function parseDocxOgEkstraherVerb(file) {
    // Sjekk om mammoth.js er tilgjengeleg
    if (typeof mammoth === 'undefined') {
        throw new Error('Mammoth.js er ikkje lasta. Sjekk at CDN-lenkje er inkludert.');
    }

    try {
        // Les fila som ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Parse med mammoth
        const result = await mammoth.extractRawText({ arrayBuffer });
        const tekst = result.value;

        // Ekstraher verb frå teksten
        const verb = ekstraherVerbFraTekst(tekst);

        return {
            tekst,
            verb,
            feil: result.messages
        };

    } catch (error) {
        console.error('Feil ved parsing av DOCX:', error);
        throw error;
    }
}

/**
 * Parse eigen verbliste (DOCX-format)
 * Forventar format: "verb - tyding" eller "verb: tyding" per linje
 */
async function parseVerblisteDocx(file) {
    if (typeof mammoth === 'undefined') {
        throw new Error('Mammoth.js er ikkje lasta');
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const tekst = result.value;

        // Parse linjer med format: "verb - tyding" eller "verb: tyding"
        const linjer = tekst.split('\n');
        const verb = [];

        for (const linje of linjer) {
            const trimmed = linje.trim();
            if (!trimmed) continue;

            // Prøv først "verb - tyding"
            let match = trimmed.match(/^([^-]+?)\s*-\s*(.+)$/);
            if (!match) {
                // Prøv så "verb: tyding"
                match = trimmed.match(/^([^:]+?)\s*:\s*(.+)$/);
            }

            if (match) {
                const verbNavn = match[1].trim();
                const tyding = match[2].trim();
                verb.push({ verb: verbNavn, tyding });
            }
        }

        return verb;

    } catch (error) {
        console.error('Feil ved parsing av verbliste:', error);
        throw error;
    }
}

/**
 * Ekstraher verb frå læreplan-tekst
 * Leitar etter verbmønster i kompetansemål
 */
function ekstraherVerbFraTekst(tekst) {
    const verb = new Set();

    // Regex for å finne verb i byrjinga av setningar (typisk kompetansemål)
    // Kompetansemål startar ofte med "Eleven skal kunne [verb]..."
    const kompetansemålMønster = /(?:eleven skal kunne?|mål for opplæringa er at eleven skal kunne?)\s+([a-zæøå]+)/gi;

    let match;
    while ((match = kompetansemålMønster.exec(tekst)) !== null) {
        const verbKandidat = match[1].toLowerCase();

        // Sjekk om verbet finst i standardbiblioteket
        const standardVerb = hentAlleStandardVerb();
        const erStandardVerb = standardVerb.some(v => v.verb === verbKandidat);

        if (erStandardVerb) {
            verb.add(verbKandidat);
        }
    }

    // Også søk etter verb i infinitiv utan kontekst
    const alleStandardVerb = hentAlleStandardVerb();
    for (const verbObj of alleStandardVerb) {
        const regex = new RegExp(`\\b${verbObj.verb}\\b`, 'gi');
        if (regex.test(tekst)) {
            verb.add(verbObj.verb);
        }
    }

    // Konverter Set til Array med tydingar
    return Array.from(verb).map(v => {
        const standardVerbObj = alleStandardVerb.find(sv => sv.verb === v);
        return {
            verb: v,
            tyding: standardVerbObj ? standardVerbObj.tyding : 'Frå læreplan'
        };
    });
}

// ========================================
// LÆREPLAN-OPPLASTING OG FAG-AKTIVERING
// ========================================

/**
 * Last opp og analyser læreplan for eit fag
 */
async function lastOppLæreplan(fagId, docxFile) {
    try {
        // Parse DOCX og ekstraher verb
        const parsedData = await parseDocxOgEkstraherVerb(docxFile);

        // Oppdater fag i database
        const db = await openDatabase();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['fag'], 'readwrite');
            const fagStore = transaction.objectStore('fag');
            const request = fagStore.get(fagId);

            request.onsuccess = () => {
                const fag = request.result;
                if (!fag) {
                    reject(new Error('Fag ikkje funne'));
                    return;
                }

                // Oppdater fag-data
                fag.læreplanKopla = true;
                fag.aktiv = true;
                fag.verbFraaLæreplan = parsedData.verb;
                fag.læreplanTekst = parsedData.tekst;
                fag.læreplanOppdatert = new Date().toISOString();

                const updateRequest = fagStore.put(fag);
                updateRequest.onsuccess = () => {
                    resolve({
                        fag,
                        verbtal: parsedData.verb.length
                    });
                };
                updateRequest.onerror = () => reject(updateRequest.error);
            };

            request.onerror = () => reject(request.error);
        });

    } catch (error) {
        console.error('Feil ved opplasting av læreplan:', error);
        throw error;
    }
}

/**
 * Last opp eigen verbliste for eit fag
 */
async function lastOppVerbliste(fagId, docxFile) {
    try {
        const verb = await parseVerblisteDocx(docxFile);

        // Lagre verb i database
        const db = await openDatabase();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['fag'], 'readwrite');
            const fagStore = transaction.objectStore('fag');
            const request = fagStore.get(fagId);

            request.onsuccess = () => {
                const fag = request.result;
                if (!fag) {
                    reject(new Error('Fag ikkje funne'));
                    return;
                }

                // Overskrive eller merge?
                // Her vel me å merge og fjerne duplikat
                if (!fag.eigneVerb) {
                    fag.eigneVerb = [];
                }

                // Merge og fjern duplikat
                const eksisterandeVerb = new Set(fag.eigneVerb.map(v => v.verb));
                for (const verbObj of verb) {
                    if (!eksisterandeVerb.has(verbObj.verb)) {
                        fag.eigneVerb.push({
                            ...verbObj,
                            lagt_til: new Date().toISOString()
                        });
                    }
                }

                const updateRequest = fagStore.put(fag);
                updateRequest.onsuccess = () => {
                    resolve({
                        fag,
                        verbtal: fag.eigneVerb.length
                    });
                };
                updateRequest.onerror = () => reject(updateRequest.error);
            };

            request.onerror = () => reject(request.error);
        });

    } catch (error) {
        console.error('Feil ved opplasting av verbliste:', error);
        throw error;
    }
}

// ========================================
// UI-FUNKSJONAR FOR VERBBIBLIOTEK
// ========================================

/**
 * Vis verbbibliotek-dialog for eit fag
 */
async function visVerbbibliotek(fagId, fagNavn) {
    const verbbibliotek = await hentVerbbibliotekForFag(fagId);

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 80vh; overflow-y: auto;">
            <span class="close">&times;</span>
            <h2>📚 Verbbibliotek for ${fagNavn}</h2>
            <p class="hjelpetekst">Verb brukt i kompetansemål og vurderingar.</p>

            <!-- Tabs -->
            <div style="display: flex; gap: 0.5rem; margin: 1.5rem 0; border-bottom: 2px solid #ddd;">
                <button class="verb-tab active" data-tab="standard">Standard (${verbbibliotek.standard.length})</button>
                <button class="verb-tab" data-tab="læreplan">Frå læreplan (${verbbibliotek.fraaLæreplan.length})</button>
                <button class="verb-tab" data-tab="eigne">Eigne (${verbbibliotek.eigne.length})</button>
            </div>

            <!-- Tab-innhald -->
            <div id="verb-tab-standard" class="verb-tab-content active">
                ${lagVerbTabell(verbbibliotek.standard)}
            </div>
            <div id="verb-tab-læreplan" class="verb-tab-content" style="display: none;">
                ${lagVerbTabell(verbbibliotek.fraaLæreplan)}
            </div>
            <div id="verb-tab-eigne" class="verb-tab-content" style="display: none;">
                ${lagVerbTabell(verbbibliotek.eigne)}
                <div style="margin-top: 1.5rem;">
                    <button class="btn-success" onclick="visLeggTilVerbDialog(${fagId}, '${fagNavn}')">➕ Legg til verb</button>
                    <button class="btn-secondary" onclick="visLastOppVerblisteDialog(${fagId})">📥 Last opp verbliste (DOCX)</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Lukk-knapp
    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Tab-bytte
    modal.querySelectorAll('.verb-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;

            // Oppdater aktiv tab
            modal.querySelectorAll('.verb-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Vis rett innhald
            modal.querySelectorAll('.verb-tab-content').forEach(content => {
                content.style.display = 'none';
            });
            modal.querySelector(`#verb-tab-${tabName}`).style.display = 'block';
        });
    });
}

/**
 * Lag HTML-tabell for verb
 */
function lagVerbTabell(verb) {
    if (verb.length === 0) {
        return '<p style="text-align: center; color: #95a5a6; padding: 2rem;">Ingen verb funne</p>';
    }

    return `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: var(--dark); color: white;">
                    <th style="padding: 0.75rem; text-align: left; width: 25%;">Verb</th>
                    <th style="padding: 0.75rem; text-align: left;">Tyding</th>
                </tr>
            </thead>
            <tbody>
                ${verb.map(v => `
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 0.75rem; font-weight: 500;">${v.verb}</td>
                        <td style="padding: 0.75rem;">${v.tyding}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/**
 * Dialog for å laste opp DOCX verbliste
 */
function visLastOppVerblisteDialog(fagId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close">&times;</span>
            <h2>📥 Last opp verbliste</h2>
            <p class="hjelpetekst">Last opp ein DOCX-fil med verb og tydingar. Forventar format: "verb - tyding" eller "verb: tyding" per linje.</p>

            <div style="margin: 1.5rem 0;">
                <input type="file" id="verbliste-fil" accept=".docx" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">Avbryt</button>
                <button id="last-opp-verbliste-btn" class="btn-success">📥 Last opp</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.querySelector('#last-opp-verbliste-btn').addEventListener('click', async () => {
        const fileInput = modal.querySelector('#verbliste-fil');
        const file = fileInput.files[0];

        if (!file) {
            showConfirmation('Vel ei fil først', 'error');
            return;
        }

        try {
            const resultat = await lastOppVerbliste(fagId, file);
            showConfirmation(`Lasta opp ${resultat.verbtal} verb`, 'success');
            document.body.removeChild(modal);

            // Oppdater fagoversikt
            if (typeof oppdaterFagoversikt === 'function') {
                await oppdaterFagoversikt();
            }

        } catch (error) {
            showConfirmation('Feil ved opplasting: ' + error.message, 'error');
            console.error(error);
        }
    });
}

// ========================================
// HJELPEFUNKSJONAR
// ========================================

async function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// ========================================
// EKSPORTER FUNKSJONAR
// ========================================

window.hentAlleStandardVerb = hentAlleStandardVerb;
window.hentVerbbibliotekForFag = hentVerbbibliotekForFag;
window.lagreEigentVerb = lagreEigentVerb;
window.parseDocxOgEkstraherVerb = parseDocxOgEkstraherVerb;
window.parseVerblisteDocx = parseVerblisteDocx;
window.lastOppLæreplan = lastOppLæreplan;
window.lastOppVerbliste = lastOppVerbliste;
window.visVerbbibliotek = visVerbbibliotek;
window.visLastOppVerblisteDialog = visLastOppVerblisteDialog;
window.STANDARD_VERB = STANDARD_VERB;
