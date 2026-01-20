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
    // Dette må integrerast med eksisterande database
    // For no berre ein placeholder
    console.log('Arkiverer vurderingar for skoleår før:', nyttSkoleaar);

    // Vis stadfesting
    showConfirmation(i18n.t('bekreftingar.skoleaarEndra'));
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
});

// ========================================
// EKSPORTER FUNKSJONAR FOR BRUK I APP.JS
// ========================================

window.showConfirmation = showConfirmation;
window.lagreInnstilling = lagreInnstilling;
window.confirmDelete = confirmDelete;
window.arkiverTidlegareSkoleaar = arkiverTidlegareSkoleaar;
