// Elevadministrasjon for Vurderingsapp v3.0.3
// CSV-import, Visma-import, identitetssjekk og elevbilete
// © Alpindata

// ========================================
// CSV-IMPORT PER FAG
// ========================================

/**
 * Parse CSV-data
 * Format: Fornamn,Etternamn,Faggruppe,Basisgruppe,Elev-ID
 */
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
        throw new Error('CSV må ha minst ein header-linje og ein data-linje');
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    // Sjekk at påkravde kolonnar finst
    const requiredHeaders = ['fornamn', 'etternamn', 'faggruppe'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

    if (missingHeaders.length > 0) {
        throw new Error(`Manglar påkravde kolonnar: ${missingHeaders.join(', ')}`);
    }

    // Parse data
    const elevar = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Hopp over tomme linjer

        const values = line.split(',').map(v => v.trim());
        const elev = {};

        headers.forEach((header, index) => {
            elev[header] = values[index] || '';
        });

        elevar.push(elev);
    }

    return elevar;
}

/**
 * Importer elevar frå CSV til eit spesifikt fag
 */
async function importerElevarFraCSV(fag, csvText) {
    try {
        const elevar = parseCSV(csvText);

        if (elevar.length === 0) {
            throw new Error('Ingen elevar funne i CSV-fila');
        }

        // Statistikk
        let nye = 0;
        let oppdaterte = 0;
        let duplikat = [];
        let feil = 0;

        // Hent eksisterande elevar i dette faget
        const eksisterandeElevar = await hentElevarIFag(fag);

        for (const elev of elevar) {
            try {
                // Generer elev-ID om det ikkje finst
                if (!elev['elev-id']) {
                    elev['elev-id'] = genererElevId();
                }

                // Sjekk for duplikat
                const duplikatElev = eksisterandeElevar.find(e =>
                    e.fornamn === elev.fornamn &&
                    e.etternamn === elev.etternamn
                );

                if (duplikatElev) {
                    duplikat.push({
                        ny: elev,
                        eksisterande: duplikatElev
                    });
                } else {
                    // Legg til ny elev
                    await lagreElev({
                        elev_id: elev['elev-id'],
                        fornamn: elev.fornamn,
                        etternamn: elev.etternamn,
                        fag: fag,
                        faggruppe: elev.faggruppe,
                        basisgruppe: elev.basisgruppe || '',
                        aktiv: true,
                        opprettetDato: new Date().toISOString()
                    });
                    nye++;
                }
            } catch (error) {
                console.error('Feil ved import av elev:', elev, error);
                feil++;
            }
        }

        return {
            totalt: elevar.length,
            nye,
            oppdaterte,
            duplikat,
            feil
        };

    } catch (error) {
        throw new Error(`Feil ved CSV-import: ${error.message}`);
    }
}

/**
 * Vis CSV-import dialog
 */
async function visCSVImportDialog(fag) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="close">&times;</span>
            <h2>📥 CSV-import til ${fag}</h2>

            <div style="margin: 1.5rem 0;">
                <p class="hjelpetekst">CSV-fila må ha følgjande kolonnar: <strong>Fornamn, Etternamn, Faggruppe</strong></p>
                <p class="hjelpetekst">Valfrie kolonnar: <strong>Basisgruppe, Elev-ID</strong></p>

                <details style="margin: 1rem 0;">
                    <summary style="cursor: pointer; font-weight: 500; color: #3498db;">💡 Vis eksempel</summary>
                    <pre style="background: #f8f9fa; padding: 0.75rem; border-radius: 4px; margin-top: 0.5rem; overflow-x: auto;">Fornamn,Etternamn,Faggruppe,Basisgruppe,Elev-ID
Ola,Nordmann,Vg1A,2ST1,
Kari,Hansen,Vg1A,2ST1,
Per,Olsen,Vg1B,3ST1,12345</pre>
                </details>

                <label style="font-weight: 500; display: block; margin-bottom: 0.5rem;">Last opp CSV-fil:</label>
                <input type="file" id="csv-file-input" accept=".csv" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">

                <div style="margin-top: 1rem;">
                    <label style="font-weight: 500; display: block; margin-bottom: 0.5rem;">Eller lim inn CSV-data:</label>
                    <textarea id="csv-text-input" rows="8" placeholder="Fornamn,Etternamn,Faggruppe,Basisgruppe
Ola,Nordmann,Vg1A,2ST1
Kari,Hansen,Vg1A,2ST1" style="width: 100%; padding: 0.5rem; font-family: monospace; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                </div>
            </div>

            <div id="import-resultat" style="margin: 1.5rem 0; display: none;"></div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button id="csv-cancel-btn" class="btn-secondary">Avbryt</button>
                <button id="csv-import-btn" class="btn-success">📥 Importer</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.querySelector('#csv-cancel-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // File input
    modal.querySelector('#csv-file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                modal.querySelector('#csv-text-input').value = event.target.result;
            };
            reader.readAsText(file);
        }
    });

    // Import button
    modal.querySelector('#csv-import-btn').addEventListener('click', async () => {
        const csvText = modal.querySelector('#csv-text-input').value;

        if (!csvText.trim()) {
            showConfirmation('Du må laste opp ei fil eller lime inn CSV-data', 'error');
            return;
        }

        try {
            const resultat = await importerElevarFraCSV(fag, csvText);
            visImportResultat(modal, resultat);

            // Oppdater UI
            if (typeof lastKlasser === 'function') {
                await lastKlasser();
            }

            showConfirmation(`Importert ${resultat.nye} nye elevar til ${fag}`, 'success');

        } catch (error) {
            showConfirmation(error.message, 'error');
        }
    });
}

function visImportResultat(modal, resultat) {
    const resultatEl = modal.querySelector('#import-resultat');
    resultatEl.style.display = 'block';

    let html = `
        <div style="background: #e8f5e9; padding: 1rem; border-radius: 6px; border-left: 3px solid #4caf50;">
            <h4 style="margin-top: 0;">✓ Import fullført</h4>
            <p><strong>Totalt behandla:</strong> ${resultat.totalt}</p>
            <p><strong>Nye elevar:</strong> ${resultat.nye}</p>
            <p><strong>Oppdaterte:</strong> ${resultat.oppdaterte}</p>
    `;

    if (resultat.duplikat.length > 0) {
        html += `
            <hr style="margin: 1rem 0; opacity: 0.3;">
            <p style="color: #f39c12;"><strong>⚠ ${resultat.duplikat.length} moglege duplikat:</strong></p>
            <ul style="margin-left: 1.5rem;">
                ${resultat.duplikat.map(d => `
                    <li>${d.ny.fornamn} ${d.ny.etternamn} (${d.ny.faggruppe}) - finst allereie</li>
                `).join('')}
            </ul>
        `;
    }

    if (resultat.feil > 0) {
        html += `<p style="color: #e74c3c;"><strong>✗ Feil:</strong> ${resultat.feil}</p>`;
    }

    html += '</div>';
    resultatEl.innerHTML = html;
}

// ========================================
// IDENTITETSSJEKK VED MANUELL REGISTRERING
// ========================================

/**
 * Søk etter elev basert på namn
 */
async function søkElevEtterNamn(fornamn, etternamn) {
    const db = await migrerDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['elever'], 'readonly');
        const store = transaction.objectStore('elever');
        const request = store.getAll();

        request.onsuccess = () => {
            const alleElevar = request.result;
            const match = alleElevar.filter(e =>
                e.fornamn.toLowerCase() === fornamn.toLowerCase() &&
                e.etternamn.toLowerCase() === etternamn.toLowerCase()
            );
            resolve(match);
        };

        request.onerror = () => reject(request.error);
    });
}

/**
 * Vis identitetsdialog når mogleg duplikat blir funne
 */
async function visIdentitetsdialog(nyElev, eksisterandeElevar) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <h2 style="color: #f39c12;">⚠ Mogleg duplikat funne</h2>

                <p style="margin: 1.5rem 0;">Du er i ferd med å registrere:</p>
                <div style="background: #e3f2fd; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <strong>${nyElev.fornamn} ${nyElev.etternamn}</strong><br>
                    Fag: ${nyElev.fag}<br>
                    Faggruppe: ${nyElev.faggruppe}
                </div>

                <p style="margin-bottom: 1rem;">Fann følgjande elev(ar) med same namn:</p>
                ${eksisterandeElevar.map(e => `
                    <div style="background: #fff9e6; padding: 1rem; border-radius: 6px; margin-bottom: 0.5rem; display: flex; gap: 1rem; align-items: center;">
                        ${e.bilete ? `
                            <div style="flex-shrink: 0;">
                                ${e.bileteType === 'application/pdf' ?
                                    '<div style="width: 60px; height: 60px; background: #e74c3c; color: white; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 1.5rem;">📄</div>' :
                                    `<img src="${e.bilete}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;">`
                                }
                            </div>
                        ` : ''}
                        <div style="flex: 1;">
                            <strong>${e.fornamn} ${e.etternamn}</strong><br>
                            Elev-ID: ${e.elev_id}<br>
                            Fag: ${e.fag}<br>
                            Faggruppe: ${e.faggruppe || 'Ukjent'}
                        </div>
                    </div>
                `).join('')}

                <p style="margin: 1.5rem 0; font-weight: 500;">Er dette same elev?</p>

                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button id="ident-nei-btn" class="btn-primary">Nei, dette er ny elev</button>
                    <button id="ident-ja-btn" class="btn-success">Ja, dette er same elev</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#ident-nei-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            resolve({ erSame: false, elevId: genererElevId() });
        });

        modal.querySelector('#ident-ja-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            resolve({ erSame: true, elevId: eksisterandeElevar[0].elev_id });
        });
    });
}

/**
 * Legg til elev manuelt med identitetssjekk
 */
async function leggTilElevManuelt(fag, fornamn, etternamn, faggruppe, basisgruppe) {
    // 1. Søk etter eksisterande elev
    const eksisterandeElevar = await søkElevEtterNamn(fornamn, etternamn);

    let elevId;

    if (eksisterandeElevar.length > 0) {
        // 2. Vis identitetsdialog
        const valg = await visIdentitetsdialog({
            fornamn,
            etternamn,
            fag,
            faggruppe,
            basisgruppe
        }, eksisterandeElevar);

        elevId = valg.elevId;

        if (valg.erSame) {
            // Bruk eksisterande elev-ID, legg berre til i nytt fag
            showConfirmation(`Elev ${fornamn} ${etternamn} lagt til i ${fag}`, 'success');
        }
    } else {
        elevId = genererElevId();
    }

    // 3. Lagre elev
    await lagreElev({
        elev_id: elevId,
        fornamn,
        etternamn,
        fag,
        faggruppe,
        basisgruppe: basisgruppe || '',
        aktiv: true,
        opprettetDato: new Date().toISOString()
    });

    return elevId;
}

// ========================================
// VISMA LIM INN
// ========================================

/**
 * Parse Visma PDF-tekst
 */
function parseVismaText(text) {
    // Regex for å finne elevlinjer
    // Format: Etternamn Fornamn Faggruppe
    const elevMønster = /([A-ZÆØÅÖ][a-zæøåö]+(?:\s+[A-ZÆØÅÖ][a-zæøåö]+)*)\s+([A-ZÆØÅÖ][a-zæøåö]+)\s+(\w+)/gm;

    const elevar = [];
    let match;

    while ((match = elevMønster.exec(text)) !== null) {
        elevar.push({
            etternamn: match[1].trim(),
            fornamn: match[2].trim(),
            faggruppe: match[3].trim()
        });
    }

    return elevar;
}

/**
 * Vis Visma lim inn-dialog
 */
async function visVismaLimInnDialog(fag) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="close">&times;</span>
            <h2>📋 Visma lim inn til ${fag}</h2>

            <div style="margin: 1.5rem 0;">
                <p class="hjelpetekst">Lim inn tekst frå Visma PDF. Appen vil automatisk finne elevnamn og faggrupper.</p>

                <textarea id="visma-text-input" rows="12" placeholder="Lim inn tekst frå Visma PDF her..." style="width: 100%; padding: 0.5rem; font-family: monospace; border: 1px solid #ddd; border-radius: 4px;"></textarea>

                <button id="visma-parse-btn" class="btn-primary" style="margin-top: 0.5rem;">🔍 Finn elevar</button>
            </div>

            <div id="visma-resultat" style="margin: 1.5rem 0; display: none;"></div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button id="visma-cancel-btn" class="btn-secondary">Avbryt</button>
                <button id="visma-import-btn" class="btn-success" style="display: none;">✓ Lagre elevar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    let funneElevar = [];

    // Event listeners
    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.querySelector('#visma-cancel-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.querySelector('#visma-parse-btn').addEventListener('click', () => {
        const text = modal.querySelector('#visma-text-input').value;

        if (!text.trim()) {
            showConfirmation('Lim inn tekst frå Visma først', 'error');
            return;
        }

        funneElevar = parseVismaText(text);

        if (funneElevar.length === 0) {
            showConfirmation('Fann ingen elevar i teksten', 'error');
            return;
        }

        visVismaResultat(modal, funneElevar);
        modal.querySelector('#visma-import-btn').style.display = 'inline-block';
    });

    modal.querySelector('#visma-import-btn').addEventListener('click', async () => {
        // Hent redigerte verdiar frå tabell
        const rows = modal.querySelectorAll('#visma-tabell tbody tr');
        const elevar = Array.from(rows).map(row => ({
            fornamn: row.querySelector('.fornamn-input').value,
            etternamn: row.querySelector('.etternamn-input').value,
            faggruppe: row.querySelector('.faggruppe-input').value
        }));

        // Lagre elevar
        let lagra = 0;
        for (const elev of elevar) {
            try {
                await leggTilElevManuelt(fag, elev.fornamn, elev.etternamn, elev.faggruppe, '');
                lagra++;
            } catch (error) {
                console.error('Feil ved lagring av elev:', elev, error);
            }
        }

        showConfirmation(`Lagra ${lagra} av ${elevar.length} elevar`, 'success');
        document.body.removeChild(modal);

        // Oppdater UI
        if (typeof lastKlasser === 'function') {
            await lastKlasser();
        }
    });
}

function visVismaResultat(modal, elevar) {
    const resultatEl = modal.querySelector('#visma-resultat');
    resultatEl.style.display = 'block';

    resultatEl.innerHTML = `
        <h4>Fann ${elevar.length} elevar</h4>
        <p class="hjelpetekst">Kontroller og rediger informasjonen før lagring:</p>

        <table id="visma-tabell" style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
            <thead>
                <tr style="background: var(--dark); color: white;">
                    <th style="padding: 0.5rem; text-align: left;">Fornamn</th>
                    <th style="padding: 0.5rem; text-align: left;">Etternamn</th>
                    <th style="padding: 0.5rem; text-align: left;">Faggruppe</th>
                </tr>
            </thead>
            <tbody>
                ${elevar.map((e, i) => `
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 0.5rem;">
                            <input type="text" class="fornamn-input" value="${e.fornamn}" style="width: 100%; padding: 0.25rem; border: 1px solid #ddd; border-radius: 4px;">
                        </td>
                        <td style="padding: 0.5rem;">
                            <input type="text" class="etternamn-input" value="${e.etternamn}" style="width: 100%; padding: 0.25rem; border: 1px solid #ddd; border-radius: 4px;">
                        </td>
                        <td style="padding: 0.5rem;">
                            <input type="text" class="faggruppe-input" value="${e.faggruppe}" style="width: 100%; padding: 0.25rem; border: 1px solid #ddd; border-radius: 4px;">
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// ========================================
// HJELPEFUNKSJONAR
// ========================================

function genererElevId() {
    return 'elev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function hentElevarIFag(fag) {
    const db = await migrerDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['elever'], 'readonly');
        const store = transaction.objectStore('elever');
        const index = store.index('fag');
        const request = index.getAll(fag);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function lagreElev(elev) {
    const db = await migrerDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['elever'], 'readwrite');
        const store = transaction.objectStore('elever');
        const request = store.add(elev);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// ========================================
// ELEVBILETE-OPPLASTING
// ========================================

/**
 * Last opp elevbilete (PDF eller bilete)
 * Biletet lagrast globalt per elev-ID og oppdaterast i alle fag
 */
async function lastOppElevbilete(elevId, file) {
    if (!file) {
        throw new Error('Ingen fil vald');
    }

    // Sjekk filtype
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        throw new Error('Ugyldig filtype. Berre JPEG, PNG, GIF eller PDF er tillate.');
    }

    // Sjekk filstørrelse (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error('Fila er for stor. Maks 5MB.');
    }

    try {
        // Konverter til data URL
        const dataUrl = await filTilDataUrl(file);

        // Oppdater alle instansar av eleven
        await oppdaterElevbilete(elevId, dataUrl, file.type);

        return { success: true, dataUrl };

    } catch (error) {
        console.error('Feil ved opplasting av elevbilete:', error);
        throw error;
    }
}

/**
 * Konverter fil til data URL
 */
function filTilDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Oppdater elevbilete for alle instansar av eleven (same elev_id i ulike fag)
 */
async function oppdaterElevbilete(elevId, dataUrl, fileType) {
    const db = await migrerDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['elever'], 'readwrite');
        const store = transaction.objectStore('elever');
        const index = store.index('elev_id');
        const request = index.openCursor(IDBKeyRange.only(elevId));

        let oppdatert = 0;

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const elev = cursor.value;
                elev.bilete = dataUrl;
                elev.bileteType = fileType;
                elev.bileteOppdatert = new Date().toISOString();

                cursor.update(elev);
                oppdatert++;
                cursor.continue();
            } else {
                console.log(`Oppdatert bilete for ${oppdatert} instansar av elev ${elevId}`);
                resolve(oppdatert);
            }
        };

        request.onerror = () => reject(request.error);
    });
}

/**
 * Vis dialog for å laste opp elevbilete
 */
async function visLastOppBileteDialog(elevId, elevNamn) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close">&times;</span>
            <h2>📷 Last opp bilete</h2>
            <p class="hjelpetekst">Last opp bilete for <strong>${elevNamn}</strong> (ID: ${elevId})</p>
            <p class="hjelpetekst">Biletet blir lagra globalt og vist i alle fag eleven er registrert i.</p>

            <div style="margin: 1.5rem 0;">
                <input type="file" id="elevbilete-fil" accept="image/*,.pdf" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #7f8c8d;">Tillatt: JPEG, PNG, GIF, PDF (maks 5MB)</p>
            </div>

            <div id="bilete-preview" style="display: none; margin: 1rem 0; text-align: center;">
                <img id="bilete-preview-img" style="max-width: 200px; max-height: 200px; border-radius: 4px; border: 1px solid #ddd;">
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">Avbryt</button>
                <button id="last-opp-bilete-btn" class="btn-success" disabled>📤 Last opp</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const filInput = modal.querySelector('#elevbilete-fil');
    const lastOppBtn = modal.querySelector('#last-opp-bilete-btn');
    const preview = modal.querySelector('#bilete-preview');
    const previewImg = modal.querySelector('#bilete-preview-img');

    // Lukk-knapp
    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Førehandsvis bilete
    filInput.addEventListener('change', () => {
        const file = filInput.files[0];
        if (file) {
            lastOppBtn.disabled = false;

            // Vis førehandsvisning om det er eit bilete
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImg.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                preview.style.display = 'none';
            }
        } else {
            lastOppBtn.disabled = true;
            preview.style.display = 'none';
        }
    });

    // Last opp
    lastOppBtn.addEventListener('click', async () => {
        const file = filInput.files[0];
        if (!file) return;

        try {
            lastOppBtn.disabled = true;
            lastOppBtn.textContent = '⏳ Lastar opp...';

            await lastOppElevbilete(elevId, file);

            showConfirmation(`Bilete lasta opp for ${elevNamn}`, 'success');
            document.body.removeChild(modal);

            // Oppdater fagoversikt om funksjon finst
            if (typeof oppdaterFagoversikt === 'function') {
                await oppdaterFagoversikt();
            }

        } catch (error) {
            showConfirmation('Feil: ' + error.message, 'error');
            lastOppBtn.disabled = false;
            lastOppBtn.textContent = '📤 Last opp';
        }
    });
}

// ========================================
// EKSPORTER FUNKSJONAR
// ========================================

window.visCSVImportDialog = visCSVImportDialog;
window.visVismaLimInnDialog = visVismaLimInnDialog;
window.leggTilElevManuelt = leggTilElevManuelt;
window.søkElevEtterNamn = søkElevEtterNamn;
window.lastOppElevbilete = lastOppElevbilete;
window.visLastOppBileteDialog = visLastOppBileteDialog;
