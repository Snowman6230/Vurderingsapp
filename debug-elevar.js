/**
 * Debug-script for å sjå kva felt elevane har
 * Køyr dette i nettlesarkonsollen:
 *
 * 1. Opne Developer Console (F12)
 * 2. Gå til Console-fana
 * 3. Lim inn følgjande kode og trykk Enter:
 */

async function debugElevar() {
    // Opne database
    const request = indexedDB.open('VurderingsappDB', 4);

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['elever'], 'readonly');
        const store = transaction.objectStore('elever');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
            const elevar = getAllRequest.result;
            console.log(`📊 DEBUG: ${elevar.length} elevar i database`);

            if (elevar.length > 0) {
                console.log('📋 Første elev:', elevar[0]);
                console.log('📋 Siste elev:', elevar[elevar.length - 1]);

                // Sjekk kva felt dei har
                const førsteElev = elevar[0];
                console.log('🔍 Felt i første elev:');
                console.log('  - fornamn:', førsteElev.fornamn);
                console.log('  - etternamn:', førsteElev.etternamn);
                console.log('  - fag:', førsteElev.fag);
                console.log('  - klasse:', førsteElev.klasse);
                console.log('  - faggruppe:', førsteElev.faggruppe);
                console.log('  - elev_id:', førsteElev.elev_id);

                // Tell opp faggrupper
                const faggrupper = {};
                const klasser = {};
                elevar.forEach(e => {
                    if (e.faggruppe) {
                        faggrupper[e.faggruppe] = (faggrupper[e.faggruppe] || 0) + 1;
                    }
                    if (e.klasse) {
                        klasser[e.klasse] = (klasser[e.klasse] || 0) + 1;
                    }
                });

                console.log('📊 Faggrupper:', faggrupper);
                console.log('📊 Klasser:', klasser);

                // Sjekk om elevane manglar faggruppe
                const manglarFaggruppe = elevar.filter(e => !e.faggruppe).length;
                const harBerreKlasse = elevar.filter(e => e.klasse && !e.faggruppe).length;

                console.log(`⚠️ ${manglarFaggruppe} elevar manglar faggruppe`);
                console.log(`⚠️ ${harBerreKlasse} elevar har klasse men ikkje faggruppe`);

                if (harBerreKlasse > 0) {
                    console.log('🔧 LØYSING: Køyr migrerEksisterandeData()');
                }
            } else {
                console.log('❌ Ingen elevar funne i database!');
            }
        };

        getAllRequest.onerror = () => {
            console.error('❌ Feil ved henting av elevar:', getAllRequest.error);
        };
    };

    request.onerror = () => {
        console.error('❌ Feil ved opning av database:', request.error);
    };
}

// Køyr debug-funksjonen
debugElevar();
