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

// Override den eksisterande showToast-funksjonen om den finst
if (typeof window.showToast !== 'function') {
    window.showToast = showToast; // Bruk den frå i18n.js
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
 * Hent alle fag (midlertidig frå localStorage, bør flyttast til database)
 */
async function hentAlleFag() {
    // Midlertidig implementering
    // Dette bør hentast frå database når fag-object store er implementert
    const fagString = localStorage.getItem('fag') || '[]';
    try {
        const fag = JSON.parse(fagString);
        return fag.map(f => ({
            namn: f,
            aktiv: false, // Skal settast basert på læreplanstatus
            læreplanKopla: false
        }));
    } catch {
        return [];
    }
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
async function hentVerbtalForFag(fag) {
    // Midlertidig - returner 0
    // Dette skal hentast frå verbbibliotek når det er implementert
    return 0;
}

/**
 * Vis fagdetaljar-dialog
 */
function visFagDetaljar(fagNamn) {
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
                    <button onclick="visVismaLimInnDialog('${fagNamn}')" class="btn-success">📋 Visma lim inn</button>
                    <button onclick="visManuellElevDialog('${fagNamn}')" class="btn-secondary">➕ Manuell legg til</button>
                </div>
            </div>

            <div style="margin: 1.5rem 0;">
                <h3>Læreplan</h3>
                <p class="hjelpetekst">Last opp og analyser læreplan i Innstillingar for å aktivere faget.</p>
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

// ========================================
// INIT
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Init fargetema
    initFargetema();

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
window.hentElevarIFag = hentElevarIFag;
