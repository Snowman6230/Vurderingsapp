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
    // Dette vil bli implementert i app.js
    // Placeholder for no
    console.log('oppdaterFagoversikt() - implementer i app.js');
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
