// Feillogg-modul for Vurderingsapp v3
// Fangar og lagrar feilmeldingar for feilsøking og support
// © Alpindata

(function() {
    'use strict';

    // ========================================
    // KONFIGURASJON
    // ========================================
    const LOGG_DB_NAMN = 'VurderingsappLoggDB';
    const LOGG_DB_VERSJON = 1;
    const MAKS_LOGG_OPPFOERINGAR = 500; // Behold maks 500 oppføringar
    const LOGG_STORE_NAMN = 'feillogg';

    let loggDb = null;

    // ========================================
    // DATABASE FOR FEILLOGG
    // ========================================

    async function initLoggDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(LOGG_DB_NAMN, LOGG_DB_VERSJON);

            request.onerror = () => {
                console.warn('Kunne ikkje opne feillogg-database:', request.error);
                resolve(null);
            };

            request.onsuccess = () => {
                loggDb = request.result;
                resolve(loggDb);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(LOGG_STORE_NAMN)) {
                    const store = db.createObjectStore(LOGG_STORE_NAMN, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    store.createIndex('tidspunkt', 'tidspunkt', { unique: false });
                    store.createIndex('type', 'type', { unique: false });
                    store.createIndex('alvorlegheit', 'alvorlegheit', { unique: false });
                }
            };
        });
    }

    // ========================================
    // LOGG-FUNKSJONAR
    // ========================================

    /**
     * Legg til ei oppføring i feilloggen
     * @param {Object} oppfoering
     * @param {string} oppfoering.type - Feiltype: 'error', 'warning', 'info', 'db-error', 'network', 'ui'
     * @param {string} oppfoering.alvorlegheit - 'kritisk', 'alvorleg', 'moderat', 'låg', 'info'
     * @param {string} oppfoering.melding - Feilmelding
     * @param {string} [oppfoering.kjelde] - Kvar feilen oppstod (filnamn, funksjon)
     * @param {string} [oppfoering.stakk] - Stack trace
     * @param {Object} [oppfoering.ekstra] - Tilleggsdata
     */
    async function loggFeil(oppfoering) {
        if (!loggDb) {
            await initLoggDB();
        }
        if (!loggDb) return; // Stille feil om DB ikkje er tilgjengeleg

        const post = {
            tidspunkt: new Date().toISOString(),
            type: oppfoering.type || 'error',
            alvorlegheit: oppfoering.alvorlegheit || 'moderat',
            melding: String(oppfoering.melding || 'Ukjend feil').substring(0, 2000),
            kjelde: String(oppfoering.kjelde || '').substring(0, 500),
            stakk: String(oppfoering.stakk || '').substring(0, 5000),
            ekstra: oppfoering.ekstra || null,
            nettlesar: hentNettlesarInfo(),
            appVersjon: '3.1.0'
        };

        try {
            const tx = loggDb.transaction([LOGG_STORE_NAMN], 'readwrite');
            const store = tx.objectStore(LOGG_STORE_NAMN);
            store.add(post);

            // Rydd opp gamle oppføringar
            await ryddOppLogg();
        } catch (e) {
            // Stille feil - ikkje lag uendeleg løkke
        }
    }

    /**
     * Hent nettlesarinfo for feilrapport
     */
    function hentNettlesarInfo() {
        try {
            return {
                userAgent: navigator.userAgent.substring(0, 300),
                plattform: navigator.platform || '',
                spraak: navigator.language || '',
                online: navigator.onLine,
                skjermBredde: window.innerWidth,
                skjermHogde: window.innerHeight
            };
        } catch (e) {
            return { userAgent: 'ukjend' };
        }
    }

    /**
     * Fjern gamle oppføringar når loggen er for stor
     */
    async function ryddOppLogg() {
        if (!loggDb) return;

        try {
            const tx = loggDb.transaction([LOGG_STORE_NAMN], 'readwrite');
            const store = tx.objectStore(LOGG_STORE_NAMN);
            const countReq = store.count();

            countReq.onsuccess = () => {
                if (countReq.result > MAKS_LOGG_OPPFOERINGAR) {
                    // Slett dei eldste
                    const antallSlette = countReq.result - MAKS_LOGG_OPPFOERINGAR;
                    const index = store.index('tidspunkt');
                    const cursor = index.openCursor();
                    let sletta = 0;

                    cursor.onsuccess = (e) => {
                        const c = e.target.result;
                        if (c && sletta < antallSlette) {
                            c.delete();
                            sletta++;
                            c.continue();
                        }
                    };
                }
            };
        } catch (e) {
            // Stille feil
        }
    }

    /**
     * Hent alle logg-oppføringar
     * @param {Object} [filter] - Filtreringsopsjonar
     * @param {string} [filter.type] - Filtrer på type
     * @param {string} [filter.alvorlegheit] - Filtrer på alvorlegheit
     * @param {number} [filter.maks] - Maks antal
     * @returns {Promise<Array>}
     */
    async function hentLogg(filter = {}) {
        if (!loggDb) {
            await initLoggDB();
        }
        if (!loggDb) return [];

        return new Promise((resolve) => {
            try {
                const tx = loggDb.transaction([LOGG_STORE_NAMN], 'readonly');
                const store = tx.objectStore(LOGG_STORE_NAMN);
                const request = store.getAll();

                request.onsuccess = () => {
                    let resultat = request.result || [];

                    // Sorter nyaste først
                    resultat.sort((a, b) => new Date(b.tidspunkt) - new Date(a.tidspunkt));

                    // Filtrer
                    if (filter.type) {
                        resultat = resultat.filter(r => r.type === filter.type);
                    }
                    if (filter.alvorlegheit) {
                        resultat = resultat.filter(r => r.alvorlegheit === filter.alvorlegheit);
                    }
                    if (filter.maks) {
                        resultat = resultat.slice(0, filter.maks);
                    }

                    resolve(resultat);
                };

                request.onerror = () => resolve([]);
            } catch (e) {
                resolve([]);
            }
        });
    }

    /**
     * Tøm heile feilloggen
     */
    async function toemmLogg() {
        if (!loggDb) return;

        return new Promise((resolve) => {
            try {
                const tx = loggDb.transaction([LOGG_STORE_NAMN], 'readwrite');
                const store = tx.objectStore(LOGG_STORE_NAMN);
                store.clear();
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            } catch (e) {
                resolve(false);
            }
        });
    }

    // ========================================
    // GLOBALE FEILFANGARAR
    // ========================================

    // Fang uhandterte JavaScript-feil
    window.addEventListener('error', (event) => {
        loggFeil({
            type: 'error',
            alvorlegheit: 'alvorleg',
            melding: event.message || 'Ukjend feil',
            kjelde: `${event.filename || 'ukjend'}:${event.lineno || '?'}:${event.colno || '?'}`,
            stakk: event.error?.stack || ''
        });
    });

    // Fang uhandterte Promise-feil
    window.addEventListener('unhandledrejection', (event) => {
        const feilmelding = event.reason?.message || String(event.reason) || 'Ukjend Promise-feil';
        loggFeil({
            type: 'error',
            alvorlegheit: 'alvorleg',
            melding: feilmelding,
            kjelde: 'Uhandtert Promise-avvising',
            stakk: event.reason?.stack || ''
        });
    });

    // ========================================
    // KONSOLL-AVLYTTING
    // ========================================

    // Lagre originale konsollfunksjonar
    const origConsoleError = console.error;
    const origConsoleWarn = console.warn;

    // Avlytt console.error
    console.error = function(...args) {
        origConsoleError.apply(console, args);

        const melding = args.map(a => {
            if (a instanceof Error) return a.message;
            if (typeof a === 'object') {
                try { return JSON.stringify(a).substring(0, 500); } catch(e) { return String(a); }
            }
            return String(a);
        }).join(' ');

        loggFeil({
            type: 'error',
            alvorlegheit: 'moderat',
            melding: melding,
            kjelde: 'console.error',
            stakk: new Error().stack || ''
        });
    };

    // Avlytt console.warn
    console.warn = function(...args) {
        origConsoleWarn.apply(console, args);

        const melding = args.map(a => {
            if (typeof a === 'object') {
                try { return JSON.stringify(a).substring(0, 500); } catch(e) { return String(a); }
            }
            return String(a);
        }).join(' ');

        loggFeil({
            type: 'warning',
            alvorlegheit: 'låg',
            melding: melding,
            kjelde: 'console.warn'
        });
    };

    // ========================================
    // EKSPORT-FUNKSJONAR
    // ========================================

    /**
     * Generer feilrapport som JSON
     */
    async function eksporterFeilrapportJSON() {
        const logg = await hentLogg();
        const rapport = {
            appNamn: 'Vurderingsapp v3',
            appVersjon: '3.1.0',
            generert: new Date().toISOString(),
            nettlesar: hentNettlesarInfo(),
            antalFeil: logg.length,
            oppfoeringar: logg
        };

        const json = JSON.stringify(rapport, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `feilrapport_${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        URL.revokeObjectURL(url);
    }

    /**
     * Generer feilrapport som lesbar tekst
     */
    async function eksporterFeilrapportTekst() {
        const logg = await hentLogg();
        const linjer = [
            '═══════════════════════════════════════════════════════',
            '  FEILRAPPORT - Vurderingsapp v3',
            '═══════════════════════════════════════════════════════',
            '',
            `Generert: ${new Date().toLocaleString('no-NO')}`,
            `App-versjon: 3.1.0`,
            `Nettlesar: ${navigator.userAgent}`,
            `Plattform: ${navigator.platform || 'ukjend'}`,
            `Online: ${navigator.onLine ? 'Ja' : 'Nei'}`,
            `Skjerm: ${window.innerWidth}x${window.innerHeight}`,
            '',
            `Totalt antal oppføringar: ${logg.length}`,
            `  - Feil: ${logg.filter(l => l.type === 'error').length}`,
            `  - Åtvaringar: ${logg.filter(l => l.type === 'warning').length}`,
            `  - Info: ${logg.filter(l => l.type === 'info').length}`,
            `  - Database-feil: ${logg.filter(l => l.type === 'db-error').length}`,
            '',
            '───────────────────────────────────────────────────────',
            '  LOGG-OPPFØRINGAR (nyaste først)',
            '───────────────────────────────────────────────────────',
            ''
        ];

        logg.forEach((post, i) => {
            const ikon = {
                'error': '❌',
                'warning': '⚠️',
                'info': 'ℹ️',
                'db-error': '🗄️',
                'network': '🌐',
                'ui': '🖥️'
            }[post.type] || '📋';

            linjer.push(`${ikon} [${i + 1}] ${post.tidspunkt}`);
            linjer.push(`   Type: ${post.type} | Alvorlegheit: ${post.alvorlegheit}`);
            linjer.push(`   Melding: ${post.melding}`);
            if (post.kjelde) linjer.push(`   Kjelde: ${post.kjelde}`);
            if (post.stakk) {
                linjer.push(`   Stack trace:`);
                post.stakk.split('\n').slice(0, 5).forEach(linje => {
                    linjer.push(`     ${linje.trim()}`);
                });
            }
            linjer.push('');
        });

        linjer.push('═══════════════════════════════════════════════════════');
        linjer.push('  Slutt på feilrapport');
        linjer.push('═══════════════════════════════════════════════════════');

        const tekst = linjer.join('\n');
        const blob = new Blob([tekst], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `feilrapport_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();

        URL.revokeObjectURL(url);
    }

    /**
     * Vis feillogg i ein modal
     */
    async function visFeilloggModal() {
        const logg = await hentLogg({ maks: 100 });

        // Lag modal om den ikkje eksisterer
        let modal = document.getElementById('feillogg-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'feillogg-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 900px; max-height: 85vh;">
                    <span class="close" id="feillogg-lukk">&times;</span>
                    <h2>📋 Feillogg og diagnostikk</h2>

                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                        <button id="feillogg-eksporter-json" class="btn-primary" style="font-size: 0.85rem;">📥 Eksporter JSON</button>
                        <button id="feillogg-eksporter-tekst" class="btn-primary" style="font-size: 0.85rem;">📄 Eksporter tekst</button>
                        <button id="feillogg-toem" class="btn-danger" style="font-size: 0.85rem;">🗑️ Tøm logg</button>
                        <select id="feillogg-filter" style="padding: 0.4rem; border: 1px solid #ddd; border-radius: 4px; font-size: 0.85rem;">
                            <option value="">Alle typar</option>
                            <option value="error">❌ Feil</option>
                            <option value="warning">⚠️ Åtvaringar</option>
                            <option value="info">ℹ️ Info</option>
                            <option value="db-error">🗄️ Database</option>
                        </select>
                    </div>

                    <div id="feillogg-samandrag" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem; margin-bottom: 1rem;">
                    </div>

                    <div id="feillogg-liste" style="max-height: 50vh; overflow-y: auto; border: 1px solid #ddd; border-radius: 6px; background: #fafafa;">
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Event listeners
            document.getElementById('feillogg-lukk').addEventListener('click', () => {
                modal.style.display = 'none';
            });
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.style.display = 'none';
            });
            document.getElementById('feillogg-eksporter-json').addEventListener('click', () => {
                eksporterFeilrapportJSON();
                if (typeof visToast === 'function') visToast('Feilrapport (JSON) eksportert!', 'success');
            });
            document.getElementById('feillogg-eksporter-tekst').addEventListener('click', () => {
                eksporterFeilrapportTekst();
                if (typeof visToast === 'function') visToast('Feilrapport (tekst) eksportert!', 'success');
            });
            document.getElementById('feillogg-toem').addEventListener('click', async () => {
                if (confirm('Er du sikker på at du vil tømme heile feilloggen?')) {
                    await toemmLogg();
                    oppdaterFeilloggVisning([]);
                    if (typeof visToast === 'function') visToast('Feilloggen er tømt', 'success');
                }
            });
            document.getElementById('feillogg-filter').addEventListener('change', async (e) => {
                const filter = e.target.value;
                const filtrert = filter ? await hentLogg({ type: filter, maks: 100 }) : await hentLogg({ maks: 100 });
                oppdaterFeilloggVisning(filtrert);
            });
        }

        oppdaterFeilloggVisning(logg);
        modal.style.display = 'flex';
    }

    /**
     * Oppdater innhaldet i feillogg-modalen
     */
    function oppdaterFeilloggVisning(logg) {
        // Samandrag
        const samandrag = document.getElementById('feillogg-samandrag');
        if (samandrag) {
            const feil = logg.filter(l => l.type === 'error').length;
            const aat = logg.filter(l => l.type === 'warning').length;
            const info = logg.filter(l => l.type === 'info').length;
            const db = logg.filter(l => l.type === 'db-error').length;

            samandrag.innerHTML = `
                <div style="background: ${feil > 0 ? '#ffe0e0' : '#e8f5e9'}; padding: 0.5rem; border-radius: 6px; text-align: center;">
                    <div style="font-size: 1.3rem; font-weight: bold;">${feil}</div>
                    <div style="font-size: 0.75rem; color: #666;">❌ Feil</div>
                </div>
                <div style="background: ${aat > 0 ? '#fff3e0' : '#e8f5e9'}; padding: 0.5rem; border-radius: 6px; text-align: center;">
                    <div style="font-size: 1.3rem; font-weight: bold;">${aat}</div>
                    <div style="font-size: 0.75rem; color: #666;">⚠️ Åtvaringar</div>
                </div>
                <div style="background: #e3f2fd; padding: 0.5rem; border-radius: 6px; text-align: center;">
                    <div style="font-size: 1.3rem; font-weight: bold;">${info}</div>
                    <div style="font-size: 0.75rem; color: #666;">ℹ️ Info</div>
                </div>
                <div style="background: ${db > 0 ? '#fce4ec' : '#e8f5e9'}; padding: 0.5rem; border-radius: 6px; text-align: center;">
                    <div style="font-size: 1.3rem; font-weight: bold;">${db}</div>
                    <div style="font-size: 0.75rem; color: #666;">🗄️ Database</div>
                </div>
            `;
        }

        // Liste
        const liste = document.getElementById('feillogg-liste');
        if (!liste) return;

        if (logg.length === 0) {
            liste.innerHTML = `
                <div style="padding: 3rem; text-align: center; color: #888;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">✅</div>
                    <p>Ingen feil registrert — alt ser bra ut!</p>
                </div>
            `;
            return;
        }

        const ikonMap = {
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️',
            'db-error': '🗄️',
            'network': '🌐',
            'ui': '🖥️'
        };

        const fargMap = {
            'kritisk': '#d32f2f',
            'alvorleg': '#e53935',
            'moderat': '#f57c00',
            'låg': '#fbc02d',
            'info': '#1976d2'
        };

        liste.innerHTML = logg.map((post, i) => {
            const ikon = ikonMap[post.type] || '📋';
            const farge = fargMap[post.alvorlegheit] || '#666';
            const dato = new Date(post.tidspunkt);
            const datoStr = dato.toLocaleDateString('no-NO') + ' ' + dato.toLocaleTimeString('no-NO');

            return `
                <div style="padding: 0.75rem 1rem; border-bottom: 1px solid #eee; ${i === 0 ? 'background: #fffde7;' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                        <span style="font-weight: 600;">${ikon} ${post.type.toUpperCase()}</span>
                        <span style="font-size: 0.75rem; color: #999;">${datoStr}</span>
                    </div>
                    <div style="font-size: 0.9rem; margin-bottom: 0.25rem; word-break: break-word;">${escapeHTML(post.melding)}</div>
                    ${post.kjelde ? `<div style="font-size: 0.75rem; color: #888;">📍 ${escapeHTML(post.kjelde)}</div>` : ''}
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
                        <span style="font-size: 0.7rem; padding: 0.1rem 0.4rem; background: ${farge}22; color: ${farge}; border-radius: 3px; border: 1px solid ${farge}44;">${post.alvorlegheit}</span>
                    </div>
                    ${post.stakk ? `
                        <details style="margin-top: 0.5rem;">
                            <summary style="cursor: pointer; font-size: 0.75rem; color: #666;">Vis stack trace</summary>
                            <pre style="font-size: 0.7rem; background: #f5f5f5; padding: 0.5rem; border-radius: 4px; overflow-x: auto; max-height: 150px; margin-top: 0.25rem;">${escapeHTML(post.stakk)}</pre>
                        </details>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    /**
     * Escape HTML for sikker visning
     */
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str || '';
        return div.innerHTML;
    }

    // ========================================
    // MANUELL LOGGING API
    // ========================================

    /**
     * Logg ein info-melding (for debugging)
     */
    function loggInfo(melding, kjelde = '') {
        loggFeil({
            type: 'info',
            alvorlegheit: 'info',
            melding: melding,
            kjelde: kjelde
        });
    }

    /**
     * Logg ein database-feil
     */
    function loggDBFeil(melding, kjelde = '', error = null) {
        loggFeil({
            type: 'db-error',
            alvorlegheit: 'alvorleg',
            melding: melding,
            kjelde: kjelde,
            stakk: error?.stack || ''
        });
    }

    // ========================================
    // EKSPORTER TIL GLOBALT SCOPE
    // ========================================

    window.Feillogg = {
        logg: loggFeil,
        info: loggInfo,
        dbFeil: loggDBFeil,
        hent: hentLogg,
        toem: toemmLogg,
        visModal: visFeilloggModal,
        eksporterJSON: eksporterFeilrapportJSON,
        eksporterTekst: eksporterFeilrapportTekst
    };

    // Initialiser ved lasting
    initLoggDB().then(() => {
        // Logg at appen starta
        loggInfo('Vurderingsapp starta', 'feillogg.js');
    });

})();
