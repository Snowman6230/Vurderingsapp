// Database Migration Script for Vurderingsapp v3.0.3
// Migrerer frå v3 (klasse) til v4 (faggruppe + arkiv)
// © Alpindata

const DB_NAME = 'VurderingsappDB';
const NEW_DB_VERSION = 4;

/**
 * Migrer database frå versjon 3 til versjon 4
 * - Legg til arkiv object store
 * - Legg til faggruppe index på elever og vurderinger
 * - Migrer klasse → faggruppe (bakoverkompatibel)
 */
async function migrerDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, NEW_DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const oldVersion = event.oldVersion;
            const transaction = event.target.transaction;

            console.log(`Migrerer database frå versjon ${oldVersion} til ${NEW_DB_VERSION}`);

            // Migrer frå v3 til v4
            if (oldVersion < 4) {
                migrerTilV4(db, transaction);
            }
        };
    });
}

function migrerTilV4(db, transaction) {
    console.log('Migrerer til versjon 4: Legg til arkiv og faggruppe-støtte');

    // 1. Legg til arkiv object store
    if (!db.objectStoreNames.contains('arkiv')) {
        const arkivStore = db.createObjectStore('arkiv', {
            keyPath: 'id',
            autoIncrement: true
        });
        arkivStore.createIndex('skoleaar', 'skoleaar', { unique: false });
        arkivStore.createIndex('elev_id', 'elev_id', { unique: false });
        arkivStore.createIndex('fag', 'fag', { unique: false });
        arkivStore.createIndex('faggruppe', 'faggruppe', { unique: false });
        arkivStore.createIndex('dato', 'dato', { unique: false });
        console.log('✓ Arkiv object store oppretta');
    }

    // 2. Oppdater elever object store
    if (transaction.objectStore('elever')) {
        const elevStore = transaction.objectStore('elever');

        // Legg til faggruppe index om det ikkje finst
        if (!elevStore.indexNames.contains('faggruppe')) {
            elevStore.createIndex('faggruppe', 'faggruppe', { unique: false });
            console.log('✓ Faggruppe index lagt til elever');
        }

        // Legg til fag index om det ikkje finst
        if (!elevStore.indexNames.contains('fag')) {
            elevStore.createIndex('fag', 'fag', { unique: false });
            console.log('✓ Fag index lagt til elever');
        }

        // Migrer klasse → faggruppe
        migrerKlasseTilFaggruppe(elevStore);
    }

    // 3. Oppdater vurderinger object store
    if (transaction.objectStore('vurderinger')) {
        const vurdStore = transaction.objectStore('vurderinger');

        // Legg til faggruppe index om det ikkje finst
        if (!vurdStore.indexNames.contains('faggruppe')) {
            vurdStore.createIndex('faggruppe', 'faggruppe', { unique: false });
            console.log('✓ Faggruppe index lagt til vurderinger');
        }

        // Migrer klasse → faggruppe
        migrerKlasseTilFaggruppe(vurdStore);
    }

    // 4. Legg til fag object store om det ikkje finst
    if (!db.objectStoreNames.contains('fag')) {
        const fagStore = db.createObjectStore('fag', {
            keyPath: 'id',
            autoIncrement: true
        });
        fagStore.createIndex('namn', 'namn', { unique: true });
        console.log('✓ Fag object store oppretta');
    }
}

function migrerKlasseTilFaggruppe(objectStore) {
    const request = objectStore.openCursor();

    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const item = cursor.value;

            // Om posten har klasse men ikkje faggruppe, kopier verdien
            if (item.klasse && !item.faggruppe) {
                item.faggruppe = item.klasse;
                cursor.update(item);
                console.log(`  Migrert: ${item.klasse} → faggruppe`);
            }

            cursor.continue();
        }
    };

    request.onerror = () => {
        console.error('Feil ved migrering av klasse → faggruppe:', request.error);
    };
}

/**
 * Arkiver alle vurderingar frå eit spesifikt skoleår
 */
async function arkiverVurderingar(skoleaar) {
    const db = await migrerDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['vurderinger', 'arkiv'], 'readwrite');
        const vurdStore = transaction.objectStore('vurderinger');
        const arkivStore = transaction.objectStore('arkiv');

        const index = vurdStore.index('skoleaar');
        const request = index.getAll(skoleaar);

        request.onsuccess = () => {
            const vurderingar = request.result;

            if (vurderingar.length === 0) {
                resolve({ arkiverte: 0, feil: 0 });
                return;
            }

            let arkiverte = 0;
            let feil = 0;

            vurderingar.forEach((vurdering, index) => {
                // Legg til arkiv-metadata
                const arkivpost = {
                    ...vurdering,
                    arkivertDato: new Date().toISOString(),
                    opprinneligId: vurdering.id
                };

                // Fjern id for auto-increment i arkiv
                delete arkivpost.id;

                const arkivRequest = arkivStore.add(arkivpost);

                arkivRequest.onsuccess = () => {
                    arkiverte++;

                    // Slett frå hovud-database når siste post er arkivert
                    if (index === vurderingar.length - 1) {
                        slettVurderingarFraHovudDatabase(vurdStore, skoleaar)
                            .then(() => resolve({ arkiverte, feil }))
                            .catch(() => resolve({ arkiverte, feil: feil + 1 }));
                    }
                };

                arkivRequest.onerror = () => {
                    feil++;
                    console.error('Feil ved arkivering:', arkivRequest.error);
                };
            });
        };

        request.onerror = () => reject(request.error);
    });
}

async function slettVurderingarFraHovudDatabase(vurdStore, skoleaar) {
    return new Promise((resolve, reject) => {
        const index = vurdStore.index('skoleaar');
        const request = index.openCursor(IDBKeyRange.only(skoleaar));

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            } else {
                resolve();
            }
        };

        request.onerror = () => reject(request.error);
    });
}

/**
 * Hent arkiverte vurderingar for eit spesifikt skoleår
 */
async function hentArkiverteVurderingar(skoleaar, filter = {}) {
    const db = await migrerDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['arkiv'], 'readonly');
        const arkivStore = transaction.objectStore('arkiv');
        const index = arkivStore.index('skoleaar');
        const request = index.getAll(skoleaar);

        request.onsuccess = () => {
            let vurderingar = request.result;

            // Filtrer etter fag, faggruppe, elev om spesifisert
            if (filter.fag) {
                vurderingar = vurderingar.filter(v => v.fag === filter.fag);
            }
            if (filter.faggruppe) {
                vurderingar = vurderingar.filter(v => v.faggruppe === filter.faggruppe);
            }
            if (filter.elev_id) {
                vurderingar = vurderingar.filter(v => v.elev_id === filter.elev_id);
            }

            resolve(vurderingar);
        };

        request.onerror = () => reject(request.error);
    });
}

/**
 * Hent alle unike skoleår som har arkiverte vurderingar
 */
async function hentArkiverteSkoleaar() {
    const db = await migrerDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['arkiv'], 'readonly');
        const arkivStore = transaction.objectStore('arkiv');
        const request = arkivStore.getAll();

        request.onsuccess = () => {
            const vurderingar = request.result;
            const skoleaar = [...new Set(vurderingar.map(v => v.skoleaar))];
            resolve(skoleaar.sort());
        };

        request.onerror = () => reject(request.error);
    });
}

// Eksporter funksjonar for bruk i app.js
window.migrerDatabase = migrerDatabase;
window.arkiverVurderingar = arkiverVurderingar;
window.hentArkiverteVurderingar = hentArkiverteVurderingar;
window.hentArkiverteSkoleaar = hentArkiverteSkoleaar;

// Automatisk migrer database ved lasting
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await migrerDatabase();
        console.log('✓ Database migrert til versjon', NEW_DB_VERSION);
    } catch (error) {
        console.error('✗ Feil ved database-migrering:', error);
    }
});
