// Database Migration Script for Vurderingsapp v3.0.4
// Migrerer frå v3/v4/v5/v6 til v7 (fornamn/etternamn → fornavn/etternavn)
// © Alpindata

const NEW_DB_VERSION = 7;

/**
 * Migrer database frå versjon 3/4 til versjon 5
 * - Legg til arkiv object store
 * - Legg til faggruppe index på elever og vurderinger
 * - Legg til fag object store
 * - Migrer klasse → faggruppe (bakoverkompatibel)
 */
async function migrerDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('VurderingsappDB', NEW_DB_VERSION);

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

            // Migrer frå v4 til v5
            if (oldVersion < 5) {
                migrerTilV5(db, transaction);
            }

            // Migrer frå v5 til v6
            if (oldVersion < 6) {
                migrerTilV6(db, transaction);
            }

            // Migrer frå v6 til v7
            if (oldVersion < 7) {
                migrerTilV7(db, transaction);
            }
        };
    });
}

function migrerTilV4(db, transaction) {
    console.log('Migrerer til versjon 4: Legg til arkiv og faggruppe-støtte');

    // 0. Opprett grunnleggjande object stores om dei ikkje finst (for heilt nye databaser)
    if (!db.objectStoreNames.contains('elever')) {
        const elevStore = db.createObjectStore('elever', {
            keyPath: 'id',
            autoIncrement: true
        });
        elevStore.createIndex('elev_id', 'elev_id', { unique: false });
        elevStore.createIndex('fag', 'fag', { unique: false });
        elevStore.createIndex('faggruppe', 'faggruppe', { unique: false });
        elevStore.createIndex('fornavn', 'fornavn', { unique: false });
        elevStore.createIndex('etternavn', 'etternavn', { unique: false });
        console.log('✓ Elever object store oppretta');
    }

    if (!db.objectStoreNames.contains('vurderinger')) {
        const vurdStore = db.createObjectStore('vurderinger', {
            keyPath: 'id',
            autoIncrement: true
        });
        vurdStore.createIndex('elev_id', 'elev_id', { unique: false });
        vurdStore.createIndex('fag', 'fag', { unique: false });
        vurdStore.createIndex('faggruppe', 'faggruppe', { unique: false });
        vurdStore.createIndex('dato', 'dato', { unique: false });
        vurdStore.createIndex('skoleaar', 'skoleaar', { unique: false });
        console.log('✓ Vurderinger object store oppretta');
    }

    if (!db.objectStoreNames.contains('innstillinger')) {
        db.createObjectStore('innstillinger', { keyPath: 'key' });
        console.log('✓ Innstillinger object store oppretta');
    }

    if (!db.objectStoreNames.contains('sluttvurderingar')) {
        const sluttvurdStore = db.createObjectStore('sluttvurderingar', {
            keyPath: 'id',
            autoIncrement: true
        });
        sluttvurdStore.createIndex('elev_id', 'elev_id', { unique: false });
        sluttvurdStore.createIndex('fag', 'fag', { unique: false });
        sluttvurdStore.createIndex('skoleaar', 'skoleaar', { unique: false });
        console.log('✓ Sluttvurderingar object store oppretta');
    }

    if (!db.objectStoreNames.contains('laereplaner')) {
        const laeStore = db.createObjectStore('laereplaner', {
            keyPath: 'id',
            autoIncrement: true
        });
        laeStore.createIndex('fag', 'fag', { unique: false });
        console.log('✓ Laereplaner object store oppretta');
    }

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

    // 2. Oppdater elever object store (berre om det eksisterer)
    if (db.objectStoreNames.contains('elever')) {
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

    // 3. Oppdater vurderinger object store (berre om det eksisterer)
    if (db.objectStoreNames.contains('vurderinger')) {
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

function migrerTilV5(db, transaction) {
    console.log('Migrerer til versjon 5: Sikrar at fag object store finst');

    // Sikre at fag object store finst (for databaser som blei oppretta med v4 utan fag)
    if (!db.objectStoreNames.contains('fag')) {
        const fagStore = db.createObjectStore('fag', {
            keyPath: 'id',
            autoIncrement: true
        });
        fagStore.createIndex('namn', 'namn', { unique: true });
        console.log('✓ Fag object store oppretta i v5-migrering');
    } else {
        console.log('✓ Fag object store eksisterer allereie');
    }
}

function migrerTilV6(db, transaction) {
    console.log('Migrerer til versjon 6: Sikrar fornavn/etternavn indices');

    // Legg til fornavn/etternavn indices om dei manglar
    if (db.objectStoreNames.contains('elever')) {
        const elevStore = transaction.objectStore('elever');

        if (!elevStore.indexNames.contains('fornavn')) {
            elevStore.createIndex('fornavn', 'fornavn', { unique: false });
            console.log('✓ Fornavn index lagt til elever');
        }

        if (!elevStore.indexNames.contains('etternavn')) {
            elevStore.createIndex('etternavn', 'etternavn', { unique: false });
            console.log('✓ Etternavn index lagt til elever');
        }
    }

    console.log('✓ V6-migrering fullført');
}

function migrerTilV7(db, transaction) {
    console.log('Migrerer til versjon 7: Datamigrasjon frå fornamn/etternamn til fornavn/etternavn');
    console.log('✓ V7-migrering fullført (datamigrering skjer i app.js:migrerEksisterandeData)');
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

/**
 * Migrer eksisterande elevar og vurderingar frå klasse til faggruppe
 * Køyrer automatisk om nødvendig
 */
async function migrerEksisterandeData() {
    const db = await migrerDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['elever', 'vurderinger'], 'readwrite');
        let migrerteElevar = 0;
        let migrerteVurderingar = 0;

        // Migrer elevar
        const elevStore = transaction.objectStore('elever');
        const elevRequest = elevStore.openCursor();

        elevRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const elev = cursor.value;
                // Om eleven har klasse men ikkje faggruppe, kopier verdien
                if (elev.klasse && !elev.faggruppe) {
                    elev.faggruppe = elev.klasse;
                    cursor.update(elev);
                    migrerteElevar++;
                }
                cursor.continue();
            } else {
                // Når alle elevar er migrerte, migrer vurderingar
                const vurdStore = transaction.objectStore('vurderinger');
                const vurdRequest = vurdStore.openCursor();

                vurdRequest.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        const vurd = cursor.value;
                        // Om vurderinga har klasse men ikkje faggruppe, kopier verdien
                        if (vurd.klasse && !vurd.faggruppe) {
                            vurd.faggruppe = vurd.klasse;
                            cursor.update(vurd);
                            migrerteVurderingar++;
                        }
                        cursor.continue();
                    } else {
                        // Ferdig med migrasjon
                        if (migrerteElevar > 0 || migrerteVurderingar > 0) {
                            console.log(`✓ Migrerte ${migrerteElevar} elevar og ${migrerteVurderingar} vurderingar frå klasse til faggruppe`);
                        }
                        resolve({ elevar: migrerteElevar, vurderingar: migrerteVurderingar });
                    }
                };

                vurdRequest.onerror = () => reject(vurdRequest.error);
            }
        };

        elevRequest.onerror = () => reject(elevRequest.error);
    });
}

// Eksporter funksjonar for bruk i app.js
window.migrerDatabase = migrerDatabase;
window.migrerEksisterandeData = migrerEksisterandeData;
window.arkiverVurderingar = arkiverVurderingar;
window.hentArkiverteVurderingar = hentArkiverteVurderingar;
window.hentArkiverteSkoleaar = hentArkiverteSkoleaar;

// Migrering blir kalla frå hovud-init i app.js (konsolidert init B3)
// window.migrerDatabase() er tilgjengeleg via eksport over
