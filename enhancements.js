// Tilleggsfunksjonar for Vurderingsapp v3
// Fargetema og stadfestingar
// © Alpindata

// ========================================
// FARGETEMA
// ========================================

function initFargetema() {
    const savedTema = localStorage.getItem('fargetema') || 'blaa';
    applyFargetema(savedTema);

    const fargetemaSelect = document.getElementById('fargetema');
    if (fargetemaSelect) {
        fargetemaSelect.value = savedTema;
        fargetemaSelect.addEventListener('change', (e) => {
            const tema = e.target.value;
            applyFargetema(tema);
            localStorage.setItem('fargetema', tema);
            showToast(i18n.t('bekreftingar.lagra'));
        });
    }
}

function applyFargetema(tema) {
    // Fjern alle tema-klasser
    document.body.classList.remove('tema-blaa', 'tema-gronn', 'tema-lilla', 'tema-oransje');
    // Legg til valt tema
    document.body.classList.add(`tema-${tema}`);
}

// ========================================
// FORBEDRA STADFESTINGSMELDINGAR
// ========================================

// Toast-funksjon for å vise meldingar
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.warn('Toast element ikkje funne');
        return;
    }

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Funksjon for å vise stadfesting med ikon
function showConfirmation(message, type = 'success') {
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    const icon = icons[type] || icons.success;
    showToast(`${icon} ${message}`);
}

// Eksporter til window
window.showToast = showToast;

// ========================================
// LAGRE-STADFESTING WRAPPER
// ========================================

// Wrapper for localStorage.setItem som automatisk viser stadfesting
function lagreInnstilling(key, value, showConfirm = true) {
    try {
        localStorage.setItem(key, value);
        if (showConfirm) {
            showConfirmation(i18n.t('bekreftingar.lagra'));
        }
        return true;
    } catch (error) {
        console.error('Feil ved lagring:', error);
        showConfirmation('Feil ved lagring', 'error');
        return false;
    }
}

// ========================================
// SKULENAMN-VISING
// ========================================

function oppdaterSkuleNamnVising() {
    const skuleNamnEl = document.getElementById('skule-namn-visning');
    if (!skuleNamnEl) return;

    const skuleNamn = localStorage.getItem('skoleNavn') || '';
    if (skuleNamn) {
        skuleNamnEl.textContent = skuleNamn;
        skuleNamnEl.style.display = 'inline-block';
    } else {
        skuleNamnEl.style.display = 'none';
    }
}

// ========================================
// DOBBEL STADFESTING FOR KRITISKE SLETTINGAR
// ========================================

async function confirmDelete(message, requireText = null) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';

        let content = `
            <div class="modal-content" style="max-width: 500px;">
                <h2 style="color: #e74c3c;">⚠️ Advarsel</h2>
                <p style="margin: 1.5rem 0;">${message}</p>
        `;

        if (requireText) {
            content += `
                <p style="margin-bottom: 0.5rem;">Skriv <strong>${requireText}</strong> for å stadfeste:</p>
                <input type="text" id="confirm-text" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 2px solid #e74c3c; border-radius: 4px; font-size: 1rem;">
            `;
        }

        content += `
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button id="cancel-btn" class="btn-secondary">Avbryt</button>
                    <button id="confirm-btn" class="btn-danger" ${requireText ? 'disabled' : ''}>Slett</button>
                </div>
            </div>
        `;

        modal.innerHTML = content;
        document.body.appendChild(modal);

        const confirmBtn = modal.querySelector('#confirm-btn');
        const cancelBtn = modal.querySelector('#cancel-btn');
        const confirmTextInput = modal.querySelector('#confirm-text');

        if (confirmTextInput) {
            confirmTextInput.addEventListener('input', (e) => {
                confirmBtn.disabled = e.target.value !== requireText;
            });
        }

        confirmBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            resolve(true);
        });

        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            resolve(false);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                resolve(false);
            }
        });
    });
}

// ========================================
// ARKIVERING VED SKOLEÅRBYTTE
// ========================================

async function arkiverTidlegareSkoleaar(nyttSkoleaar) {
    const gamaltSkoleaar = localStorage.getItem('skoleaar');

    if (!gamaltSkoleaar || gamaltSkoleaar === nyttSkoleaar) {
        return; // Ingen arkivering nødvendig
    }

    // Stadfest med brukar
    const confirm = await confirmDelete(
        `Du er i ferd med å endre skoleår frå ${gamaltSkoleaar} til ${nyttSkoleaar}. Alle vurderingar frå ${gamaltSkoleaar} blir arkiverte. Vil du fortsette?`
    );

    if (!confirm) {
        return false;
    }

    try {
        // Arkiver vurderingar via database-migration.js
        if (typeof arkiverVurderingar === 'function') {
            const resultat = await arkiverVurderingar(gamaltSkoleaar);
            showConfirmation(`Arkivert ${resultat.arkiverte} vurderingar frå ${gamaltSkoleaar}`);

            // Oppdater skoleår
            localStorage.setItem('skoleaar', nyttSkoleaar);
            return true;
        } else {
            console.error('arkiverVurderingar funksjon ikkje funne');
            return false;
        }
    } catch (error) {
        console.error('Feil ved arkivering:', error);
        showConfirmation('Feil ved arkivering', 'error');
        return false;
    }
}

// ========================================
// ARKIV-VISNING
// ========================================

async function visArkiv() {
    if (typeof hentArkiverteSkoleaar !== 'function') {
        showConfirmation('Arkiv-funksjon ikkje tilgjengeleg', 'error');
        return;
    }

    const skoleaar = await hentArkiverteSkoleaar();

    if (skoleaar.length === 0) {
        showConfirmation('Ingen arkiverte vurderingar funne', 'info');
        return;
    }

    // Lag arkiv-modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 80vh; overflow-y: auto;">
            <span class="close">&times;</span>
            <h2>📦 Arkiv</h2>
            <p class="hjelpetekst">Arkiverte vurderingar frå tidlegare skoleår.</p>

            <div style="margin: 1.5rem 0;">
                <label style="font-weight: 500;">Vel skoleår:</label>
                <select id="arkiv-skoleaar" style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="">-- Vel skoleår --</option>
                    ${skoleaar.map(aar => `<option value="${aar}">${aar}</option>`).join('')}
                </select>
            </div>

            <div id="arkiv-innhald" style="margin-top: 1.5rem;">
                <p style="text-align: center; color: #95a5a6;">Vel eit skoleår for å sjå arkiverte vurderingar</p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Lukk-knapp
    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Skoleår-veljar
    modal.querySelector('#arkiv-skoleaar').addEventListener('change', async (e) => {
        const valtSkoleaar = e.target.value;
        if (!valtSkoleaar) return;

        const vurderingar = await hentArkiverteVurderingar(valtSkoleaar);
        visArkiverteVurderingar(modal, vurderingar);
    });
}

function visArkiverteVurderingar(modal, vurderingar) {
    const innhaldEl = modal.querySelector('#arkiv-innhald');

    if (vurderingar.length === 0) {
        innhaldEl.innerHTML = '<p style="text-align: center; color: #95a5a6;">Ingen vurderingar funne</p>';
        return;
    }

    innhaldEl.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: var(--dark); color: white;">
                    <th style="padding: 0.5rem; text-align: left;">Dato</th>
                    <th style="padding: 0.5rem; text-align: left;">Elev</th>
                    <th style="padding: 0.5rem; text-align: left;">Fag</th>
                    <th style="padding: 0.5rem; text-align: left;">Tema</th>
                    <th style="padding: 0.5rem; text-align: center;">Nivå</th>
                </tr>
            </thead>
            <tbody>
                ${vurderingar.map(v => `
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 0.5rem;">${v.dato || 'Ukjent'}</td>
                        <td style="padding: 0.5rem;">${v.elevNavn || 'Ukjent'}</td>
                        <td style="padding: 0.5rem;">${v.fag || 'Ukjent'}</td>
                        <td style="padding: 0.5rem;">${v.tema || 'Ukjent'}</td>
                        <td style="padding: 0.5rem; text-align: center;">${v.vurdering || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// ========================================
// FAGOVERSIKT
// ========================================

async function oppdaterFagoversikt() {
    const tbody = document.getElementById('fagoversikt-body');
    if (!tbody) return;

    try {
        // Hent alle fag frå localStorage (midlertidig, bør flyttast til database)
        const fagListe = await hentAlleFag();

        if (fagListe.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="padding: 2rem; text-align: center; color: #95a5a6;">
                        Ingen fag registrert enno. Gå til Innstillingar for å leggje til fag.
                    </td>
                </tr>
            `;
            return;
        }

        // Bygg tabell-rader
        let html = '';
        for (const fag of fagListe) {
            const elevtal = await hentElevtalForFag(fag.namn);
            const verbtal = await hentVerbtalForFag(fag.namn);
            const status = fag.aktiv ? '✓ Aktivt' : '⚠ Inaktivt';
            const statusFarge = fag.aktiv ? '#27ae60' : '#f39c12';
            const læreplanStatus = fag.læreplanKopla ? '✓ Kopla' : '✗ Ingen';
            const læreplanFarge = fag.læreplanKopla ? '#27ae60' : '#95a5a6';

            html += `
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 0.75rem; font-weight: 500;">${fag.namn}</td>
                    <td style="padding: 0.75rem; text-align: center; color: ${statusFarge};">${status}</td>
                    <td style="padding: 0.75rem; text-align: center; color: ${læreplanFarge};">${læreplanStatus}</td>
                    <td style="padding: 0.75rem; text-align: center;">${elevtal}</td>
                    <td style="padding: 0.75rem; text-align: center;">${verbtal}</td>
                    <td style="padding: 0.75rem; text-align: center;">
                        <button class="btn-small btn-secondary" onclick="visFagDetaljar('${fag.namn}')">Detaljar</button>
                    </td>
                </tr>
            `;
        }

        tbody.innerHTML = html;

    } catch (error) {
        console.error('Feil ved oppdatering av fagoversikt:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="padding: 2rem; text-align: center; color: #e74c3c;">
                    Feil ved lasting av fag
                </td>
            </tr>
        `;
    }
}

/**
 * Hent alle fag frå database
 */
async function hentAlleFag() {
    const db = await openDatabaseEnhancements();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['fag'], 'readonly');
        const fagStore = transaction.objectStore('fag');
        const request = fagStore.getAll();

        request.onsuccess = () => {
            const fag = request.result;
            if (fag && fag.length > 0) {
                resolve(fag);
            } else {
                // Fallback til localStorage om database er tom
                const fagString = localStorage.getItem('fag') || '[]';
                try {
                    const fagArray = JSON.parse(fagString);
                    resolve(fagArray.map(f => ({
                        namn: typeof f === 'string' ? f : f.namn || f,
                        aktiv: false,
                        læreplanKopla: false
                    })));
                } catch {
                    resolve([]);
                }
            }
        };

        request.onerror = () => {
            console.error('Feil ved henting av fag:', request.error);
            resolve([]);
        };
    });
}

/**
 * Hent elevtal for eit fag
 */
async function hentElevtalForFag(fag) {
    try {
        const elevar = await hentElevarIFag(fag);
        return elevar.length;
    } catch {
        return 0;
    }
}

/**
 * Hent verbtal for eit fag
 */
async function hentVerbtalForFag(fagNamn) {
    try {
        const fagId = await hentFagIdFraNamn(fagNamn);
        if (!fagId) return 0;

        const verbbibliotek = await hentVerbbibliotekForFag(fagId);
        // Tel standard + læreplan + eigne verb
        return verbbibliotek.fraaLæreplan.length + verbbibliotek.eigne.length;
    } catch {
        return 0;
    }
}

/**
 * Vis fagdetaljar-dialog
 */
async function visFagDetaljar(fagNamn) {
    // Hent fagId frå database
    const fagId = await hentFagIdFraNamn(fagNamn);
    console.log(`visFagDetaljar: fagNamn="${fagNamn}", fagId=${fagId}`);

    if (!fagId) {
        showConfirmation(`Fag "${fagNamn}" ikkje funne i database. Prøv å oppdatere sida.`, 'error');
        console.error(`Kunne ikkje finne fagId for fagNamn="${fagNamn}"`);
        return;
    }

    // Hent fag-data for å sjå om læreplan er lasta
    const db = await openDatabaseEnhancements();
    const fagData = await new Promise((resolve, reject) => {
        const transaction = db.transaction(['fag'], 'readonly');
        const fagStore = transaction.objectStore('fag');
        const request = fagStore.get(fagId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    const harLæreplan = fagData && fagData.læreplanKopla;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <span class="close">&times;</span>
            <h2>📚 ${fagNamn}</h2>

            <div style="margin: 1.5rem 0;">
                <h3>Elevadministrasjon</h3>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                    <button onclick="visCSVImportDialog('${fagNamn}')" class="btn-success">📥 CSV-import</button>
                    <button onclick="visVismaPDFDialog('${fagNamn}')" class="btn-success">📄 Last opp Visma PDF</button>
                    <button onclick="visManuellElevDialog('${fagNamn}')" class="btn-secondary">➕ Manuell legg til</button>
                </div>
            </div>

            <div style="margin: 1.5rem 0;">
                <h3>Læreplan og verb</h3>
                <p class="hjelpetekst">Last opp læreplan (DOCX) for å aktivere faget og ekstrahere verb automatisk.</p>
                ${harLæreplan ? `
                    <div style="background: #e8f5e9; padding: 1rem; border-radius: 6px; margin-bottom: 0.75rem;">
                        <p style="margin: 0; color: #2e7d32; font-weight: 500;">
                            ✓ Læreplan lasta opp: ${fagData.verbFraaLæreplan?.length || 0} verb ekstrabert
                        </p>
                    </div>
                ` : ''}
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                    <button id="last-opp-læreplan-btn" class="btn-success">📄 ${harLæreplan ? 'Erstatt' : 'Last opp'} læreplan</button>
                    <button id="vis-verbbibliotek-btn" class="btn-secondary">📖 Verbbibliotek</button>
                    ${harLæreplan ? `<button id="fjern-læreplan-btn" class="btn-danger">🗑️ Fjern læreplan</button>` : ''}
                </div>
                <input type="file" id="læreplan-fil-input" accept=".docx" style="display: none;">
            </div>

            <div style="display: flex; justify-content: flex-end;">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">Lukk</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Last opp læreplan
    const lastOppBtn = modal.querySelector('#last-opp-læreplan-btn');
    const filInput = modal.querySelector('#læreplan-fil-input');

    lastOppBtn.addEventListener('click', () => {
        filInput.click();
    });

    filInput.addEventListener('change', async () => {
        const file = filInput.files[0];
        if (!file) return;

        try {
            showConfirmation('Analyserer læreplan...', 'info');
            const resultat = await lastOppLæreplan(fagId, file);
            showConfirmation(`Læreplan analysert! Fann ${resultat.verbtal} verb. Faget er no aktivt.`, 'success');

            // Lukk modal og oppdater fagoversikt
            document.body.removeChild(modal);
            await oppdaterFagoversikt();

        } catch (error) {
            showConfirmation('Feil ved opplasting: ' + error.message, 'error');
            console.error(error);
        }
    });

    // Fjern læreplan
    if (harLæreplan) {
        const fjernBtn = modal.querySelector('#fjern-læreplan-btn');
        fjernBtn.addEventListener('click', async () => {
            if (!confirm(`Er du sikker på at du vil fjerne læreplanen frå ${fagNamn}?\n\nDette vil slette alle verb og deaktivere faget.`)) {
                return;
            }

            try {
                await fjernLæreplanFråFag(fagId);
                showConfirmation(`Læreplan fjerna frå ${fagNamn}`, 'success');

                // Lukk modal og oppdater fagoversikt
                document.body.removeChild(modal);
                await oppdaterFagoversikt();

            } catch (error) {
                showConfirmation('Feil ved fjerning av læreplan: ' + error.message, 'error');
                console.error(error);
            }
        });
    }

    // Vis verbbibliotek
    modal.querySelector('#vis-verbbibliotek-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
        visVerbbibliotek(fagId, fagNamn);
    });
}

/**
 * Vis dialog for manuell elevregistrering
 */
function visManuellElevDialog(fag) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close">&times;</span>
            <h2>➕ Legg til elev i ${fag}</h2>

            <div style="margin: 1.5rem 0;">
                <div style="margin-bottom: 1rem;">
                    <label style="font-weight: 500; display: block; margin-bottom: 0.25rem;">Fornamn:</label>
                    <input type="text" id="elev-fornamn" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="font-weight: 500; display: block; margin-bottom: 0.25rem;">Etternamn:</label>
                    <input type="text" id="elev-etternamn" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="font-weight: 500; display: block; margin-bottom: 0.25rem;">Faggruppe:</label>
                    <input type="text" id="elev-faggruppe" placeholder="t.d. Vg1A" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="font-weight: 500; display: block; margin-bottom: 0.25rem;">Basisgruppe (valfri):</label>
                    <input type="text" id="elev-basisgruppe" placeholder="t.d. 2ST1" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">Avbryt</button>
                <button id="lagre-elev-btn" class="btn-success">✓ Lagre</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.querySelector('#lagre-elev-btn').addEventListener('click', async () => {
        const fornamn = modal.querySelector('#elev-fornamn').value.trim();
        const etternamn = modal.querySelector('#elev-etternamn').value.trim();
        const faggruppe = modal.querySelector('#elev-faggruppe').value.trim();
        const basisgruppe = modal.querySelector('#elev-basisgruppe').value.trim();

        if (!fornamn || !etternamn || !faggruppe) {
            showConfirmation('Fornamn, etternamn og faggruppe er påkravd', 'error');
            return;
        }

        try {
            await leggTilElevManuelt(fag, fornamn, etternamn, faggruppe, basisgruppe);
            showConfirmation(`${fornamn} ${etternamn} lagt til i ${fag}`, 'success');
            document.body.removeChild(modal);

            // Oppdater fagoversikt
            await oppdaterFagoversikt();

        } catch (error) {
            showConfirmation('Feil ved lagring av elev', 'error');
            console.error(error);
        }
    });
}

/**
 * Vis dialog for opplasting av Visma PDF
 */
async function visVismaPDFDialog(fag) {
    // Fjern eksisterande modals for å unngå stacking
    const eksisterandeModals = document.querySelectorAll('.modal');
    eksisterandeModals.forEach(m => m.remove());

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>📄 Last opp Visma PDF til ${fag}</h2>

            <div style="margin: 1.5rem 0;">
                <p class="hjelpetekst">Last opp PDF-elevliste frå Visma. Appen vil automatisk finne elevnamn, faggrupper og elevbilete.</p>

                <input type="file" id="visma-pdf-input" accept=".pdf" style="margin: 1rem 0; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; width: 100%;">

                <button id="visma-pdf-parse-btn" class="btn-primary" style="margin-top: 0.5rem;">🔍 Analyser PDF</button>
            </div>

            <div id="visma-pdf-resultat" style="margin: 1.5rem 0; display: none;"></div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button id="visma-pdf-lukk-btn" class="btn-secondary" onclick="this.closest('.modal').remove()">Lukk</button>
                <button id="visma-pdf-import-btn" class="btn-success" style="display: none;">✓ Lagre elevar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    let parsedeElevar = [];

    // Parse-knapp event listener
    modal.querySelector('#visma-pdf-parse-btn').addEventListener('click', async () => {
        const fileInput = modal.querySelector('#visma-pdf-input');
        const file = fileInput.files[0];

        if (!file) {
            showConfirmation('Vel ei PDF-fil først', 'error');
            return;
        }

        try {
            showConfirmation('Analyserer PDF...', 'info');
            parsedeElevar = await parseVismaPDF(file);

            if (parsedeElevar.length === 0) {
                showConfirmation('Fann ingen elevar i PDF-en', 'error');
                return;
            }

            visVismaPDFResultat(modal, parsedeElevar);
            modal.querySelector('#visma-pdf-import-btn').style.display = 'inline-block';
            showConfirmation(`Fann ${parsedeElevar.length} elevar med bilete!`, 'success');

        } catch (error) {
            console.error('Feil ved parsing av PDF:', error);
            showConfirmation('Feil ved parsing av PDF: ' + error.message, 'error');
        }
    });

    modal.querySelector('#visma-pdf-import-btn').addEventListener('click', async () => {
        // Lagre elevar med bilete
        console.log(`📝 Startar lagring av ${parsedeElevar.length} elevar...`);
        let lagra = 0;
        for (const elev of parsedeElevar) {
            try {
                console.log(`  Lagrar elev: ${elev.fornamn} ${elev.etternamn} (${elev.faggruppe})`);
                // Bruk bokmål-versjonar for konsistens (fornavn/etternavn)
                await leggTilElevManuelt(fag, elev.fornamn, elev.etternamn, elev.faggruppe, '');
                // TODO: Lagre bilete til database
                lagra++;
            } catch (error) {
                console.error('Feil ved lagring av elev:', elev, error);
            }
        }

        console.log(`✓ Lagra ${lagra} av ${parsedeElevar.length} elevar til database`);
        showConfirmation(`Lagra ${lagra} av ${parsedeElevar.length} elevar`, 'success');

        // Skjul import-knappen når import er ferdig
        modal.querySelector('#visma-pdf-import-btn').style.display = 'none';

        // Oppdater fagoversikt og last klassar på nytt
        await oppdaterFagoversikt();
        if (typeof lastKlasser === 'function') {
            await lastKlasser();
        }

        // Oppdater elevar per fag-visning om den er open
        if (typeof visElevarForFag === 'function') {
            await visElevarForFag(fag);
        }
    });
}

/**
 * Parse Visma PDF og ekstraher elevar med bilete
 */
async function parseVismaPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;

    const elevar = [];

    // Side 1: Hent elevnamn frå tabell
    const page1 = await pdf.getPage(1);
    const textContent1 = await page1.getTextContent();

    // Samle alle tekstelement med posisjon
    const items = textContent1.items;

    // Finn linjer som startar med nummer (01, 02, etc.)
    let currentElev = null;
    for (let i = 0; i < items.length; i++) {
        const text = items[i].str.trim();

        // Sjekk om dette er eit radnummer (01-99)
        if (/^\d{2}$/.test(text)) {
            // Neste 3 element skal vere: Klasse, Fornamn(+), Etternamn
            if (i + 2 < items.length) {
                currentElev = {
                    faggruppe: items[i+1].str.trim(),
                    namnDelar: []
                };
            }
        } else if (currentElev && !text.match(/Hans|Petter|Brunstad|Sørensen/)) {
            // Samle namn-delar til vi treff lærarnamnet
            if (text && text.length > 1) {
                currentElev.namnDelar.push(text);
            }
        } else if (currentElev && text === 'Hans') {
            // Vi har truffe lærarnamnet, lagre eleven
            if (currentElev.namnDelar.length >= 2) {
                const etternamn = currentElev.namnDelar[currentElev.namnDelar.length - 1];
                const fornamn = currentElev.namnDelar.slice(0, -1).join(' ');

                elevar.push({
                    fornamn,
                    etternamn,
                    faggruppe: currentElev.faggruppe,
                    bilete: null
                });
            }
            currentElev = null;
        }
    }

    console.log(`Fann ${elevar.length} elevar frå side 1`);

    // Side 2-3: Hent elevbilete ved å rendere sidene
    const alleBilete = [];

    for (let pageNum = 2; pageNum <= Math.min(pdf.numPages, 3); pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({scale: 2.0}); // Høgare oppløysing
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        // Klipper ut bileta basert på layout
        // Side 2-3 har 7 bilete per rad, ca 120x120px kvar
        const biletePerRad = 7;
        const radHøgde = viewport.height / 4.5; // Ca 4 rader per side
        const bileteBreidd = viewport.width / biletePerRad;
        const bileteHøgde = radHøgde * 0.6; // Bilete tek ca 60% av radhøgda

        for (let rad = 0; rad < 4; rad++) {
            for (let kol = 0; kol < biletePerRad; kol++) {
                const x = kol * bileteBreidd + bileteBreidd * 0.1;
                const y = rad * radHøgde + radHøgde * 0.15;

                // Klipper ut biletet
                const bileteCanvas = document.createElement('canvas');
                bileteCanvas.width = bileteBreidd * 0.8;
                bileteCanvas.height = bileteHøgde;
                const bileteCtx = bileteCanvas.getContext('2d');

                bileteCtx.drawImage(
                    canvas,
                    x, y, bileteBreidd * 0.8, bileteHøgde,
                    0, 0, bileteBreidd * 0.8, bileteHøgde
                );

                // Konverter til base64
                const bileteData = bileteCanvas.toDataURL('image/jpeg', 0.8);
                alleBilete.push(bileteData);
            }
        }
    }

    console.log(`Fann ${alleBilete.length} bilete frå side 2-3`);

    // Matcher bilete med elevar
    elevar.forEach((elev, index) => {
        if (index < alleBilete.length) {
            elev.bilete = alleBilete[index];
        }
    });

    return elevar;
}

/**
 * Vis resultat frå Visma PDF-parsing
 */
function visVismaPDFResultat(modal, elevar) {
    const resultatDiv = modal.querySelector('#visma-pdf-resultat');
    resultatDiv.style.display = 'block';

    let html = `
        <h3>Funne ${elevar.length} elevar</h3>
        <div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; border-radius: 6px;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead style="position: sticky; top: 0; background: var(--dark); color: white;">
                    <tr>
                        <th style="padding: 0.75rem; text-align: left;">Bilete</th>
                        <th style="padding: 0.75rem; text-align: left;">Fornamn</th>
                        <th style="padding: 0.75rem; text-align: left;">Etternamn</th>
                        <th style="padding: 0.75rem; text-align: left;">Faggruppe</th>
                    </tr>
                </thead>
                <tbody>
    `;

    elevar.forEach((elev, index) => {
        html += `
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 0.5rem;">
                    ${elev.bilete ?
                        `<img src="${elev.bilete}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" alt="${elev.fornamn}">` :
                        '👤'
                    }
                </td>
                <td style="padding: 0.75rem;">${elev.fornamn}</td>
                <td style="padding: 0.75rem;">${elev.etternamn}</td>
                <td style="padding: 0.75rem;">${elev.faggruppe}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    resultatDiv.innerHTML = html;
}

// ========================================
// HJELPEFUNKSJONAR FOR FAG
// ========================================

/**
 * Hent fagId frå fagnamn
 */
async function hentFagIdFraNamn(fagNamn) {
    const db = await openDatabaseEnhancements();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['fag'], 'readonly');
        const fagStore = transaction.objectStore('fag');

        // Søk gjennom alle fag
        const request = fagStore.openCursor();
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.namn === fagNamn) {
                    resolve(cursor.value.id);
                    return;
                }
                cursor.continue();
            } else {
                resolve(null);
            }
        };

        request.onerror = () => reject(request.error);
    });
}

async function openDatabaseEnhancements() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('VurderingsappDB');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Fjern læreplan frå eit fag
 */
async function fjernLæreplanFråFag(fagId) {
    const db = await openDatabaseEnhancements();

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

            // Fjern læreplan-data
            fag.læreplanKopla = false;
            fag.aktiv = false;
            delete fag.verbFraaLæreplan;
            delete fag.læreplanTekst;
            delete fag.læreplanOppdatert;

            const updateRequest = fagStore.put(fag);
            updateRequest.onsuccess = () => {
                console.log(`✓ Læreplan fjerna frå fag ID ${fagId}`);
                resolve();
            };
            updateRequest.onerror = () => reject(updateRequest.error);
        };

        request.onerror = () => reject(request.error);
    });
}

/**
 * Migrer fag frå localStorage til database
 */
async function migrerFagTilDatabase() {
    const fagString = localStorage.getItem('fag');
    if (!fagString) return;

    try {
        const fagArray = JSON.parse(fagString);
        if (!Array.isArray(fagArray) || fagArray.length === 0) return;

        const db = await openDatabaseEnhancements();
        const transaction = db.transaction(['fag'], 'readwrite');
        const fagStore = transaction.objectStore('fag');

        // Sjekk om database allereie har fag
        const countRequest = fagStore.count();
        countRequest.onsuccess = () => {
            if (countRequest.result > 0) {
                // Database har allereie fag, ikkje migrer
                return;
            }

            // Migrer kvart fag
            for (const fag of fagArray) {
                const fagNamn = typeof fag === 'string' ? fag : fag.namn || fag;
                fagStore.add({
                    namn: fagNamn,
                    aktiv: false,
                    læreplanKopla: false,
                    verbFraaLæreplan: [],
                    eigneVerb: [],
                    opprettetDato: new Date().toISOString()
                });
            }

            console.log(`Migrert ${fagArray.length} fag til database`);
        };

    } catch (error) {
        console.error('Feil ved migrering av fag:', error);
    }
}

// ========================================
// INIT
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    // Init fargetema
    initFargetema();

    // Migrer fag frå localStorage til database
    await migrerFagTilDatabase();

    // Oppdater skulenamn-vising
    oppdaterSkuleNamnVising();

    // Legg til event listener for skulenamn-endring
    const skoleNavnInput = document.getElementById('skole-navn');
    if (skoleNavnInput) {
        skoleNavnInput.addEventListener('change', () => {
            lagreInnstilling('skoleNavn', skoleNavnInput.value);
            oppdaterSkuleNamnVising();
        });
    }

    // Oppdater lagre-knapp i innstillingar til å vise stadfesting
    const lagreInnstillingerBtn = document.getElementById('lagre-innstillinger');
    if (lagreInnstillingerBtn) {
        lagreInnstillingerBtn.addEventListener('click', () => {
            // Den opprinnelege lagre-funksjonen vil køyre
            // Me legg berre til ein stadfesting her
            setTimeout(() => {
                showConfirmation(i18n.t('bekreftingar.lagra'));
            }, 100);
        });
    }

    // Arkiv-knapp
    const arkivBtn = document.getElementById('opne-arkiv-btn');
    if (arkivBtn) {
        arkivBtn.addEventListener('click', visArkiv);
    }
});

// ========================================
// EKSPORTER FUNKSJONAR FOR BRUK I APP.JS
// ========================================

window.showConfirmation = showConfirmation;
window.lagreInnstilling = lagreInnstilling;
window.confirmDelete = confirmDelete;
window.arkiverTidlegareSkoleaar = arkiverTidlegareSkoleaar;
window.visArkiv = visArkiv;
window.oppdaterFagoversikt = oppdaterFagoversikt;
window.visFagDetaljar = visFagDetaljar;
window.visManuellElevDialog = visManuellElevDialog;
window.visVismaPDFDialog = visVismaPDFDialog;
window.hentFagIdFraNamn = hentFagIdFraNamn;
window.openDatabaseEnhancements = openDatabaseEnhancements;
window.fjernLæreplanFråFag = fjernLæreplanFråFag;
// hentElevarIFag eksportert frå elevadministrasjon.js
