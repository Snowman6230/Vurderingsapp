// i18n System for Vurderingsapp v3
// Alpindata - Hans Petter Brunstad Sørensen

class I18n {
    constructor() {
        this.currentLanguage = 'nn'; // Default to Nynorsk
        this.translations = {};
        this.fallbackLanguage = 'nn';
    }

    async init() {
        // Load language from localStorage or use default
        const savedLang = localStorage.getItem('appLanguage') || 'nn';
        await this.loadLanguage(savedLang);
    }

    async loadLanguage(lang) {
        try {
            const response = await fetch(`i18n/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language: ${lang}`);
            }
            this.translations = await response.json();
            this.currentLanguage = lang;
            localStorage.setItem('appLanguage', lang);
            this.updatePage();
            return true;
        } catch (error) {
            console.error('Error loading language:', error);
            if (lang !== this.fallbackLanguage) {
                return this.loadLanguage(this.fallbackLanguage);
            }
            return false;
        }
    }

    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations;

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }

        if (typeof value === 'string') {
            // Replace parameters in the string
            return value.replace(/\{(\w+)\}/g, (match, param) => {
                return params[param] !== undefined ? params[param] : match;
            });
        }

        return key;
    }

    updatePage() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;

        // Dispatch event for other parts of the app to react
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getLanguageName(lang) {
        const names = {
            'nn': 'Nynorsk',
            'nb': 'Bokmål',
            'en': 'English'
        };
        return names[lang] || lang;
    }
}

// Global i18n instance
const i18n = new I18n();

// Show toast notification
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = 'toast show';

    setTimeout(() => {
        toast.className = 'toast';
    }, duration);
}

// Initialize i18n when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await i18n.init();

    // Setup language switcher button
    const langBtn = document.getElementById('language-btn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            showLanguagePicker();
        });
    }
});

// Show language picker
function showLanguagePicker() {
    const languages = [
        { code: 'nn', name: 'Nynorsk' },
        { code: 'nb', name: 'Bokmål' },
        { code: 'en', name: 'English' }
    ];

    const currentLang = i18n.getCurrentLanguage();

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <span class="close">&times;</span>
            <h2>${i18n.t('innstillingar.sprakval')}</h2>
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem;">
                ${languages.map(lang => `
                    <button class="language-option ${lang.code === currentLang ? 'selected' : ''}"
                            data-lang="${lang.code}"
                            style="padding: 1rem; border: 2px solid ${lang.code === currentLang ? '#3498db' : '#ddd'};
                                   border-radius: 8px; background: ${lang.code === currentLang ? '#e3f2fd' : 'white'};
                                   cursor: pointer; font-size: 1.1rem; transition: all 0.3s;">
                        ${lang.code === currentLang ? '✓ ' : ''}${lang.name}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close button
    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // Language option buttons
    modal.querySelectorAll('.language-option').forEach(btn => {
        btn.addEventListener('click', async () => {
            const lang = btn.dataset.lang;
            if (lang !== currentLang) {
                await i18n.loadLanguage(lang);
                const langName = i18n.getLanguageName(lang);
                showToast(i18n.t('bekreftingar.sprakEndra', { language: langName }));
                document.body.removeChild(modal);
            }
        });
    });
}
