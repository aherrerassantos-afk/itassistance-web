# Revisione "Camere e Unità" (`Nome commerciale` + `Link calendario`) — Piano 4 · Itassistance (`JUL-038`)

> **Direttiva Esecutiva:** `JUL-038` — Semplificazione schermata `"Camere e Unità"` in `/app.html`:
> *"Lasciare esclusivamente per ogni struttura/unità i 2 campi: `Nome commerciale` + `Link calendario` (link di condivisione del calendario `.ics` / `webcal://`), con pulsante `'Aggiungi un'altra struttura'` e `'Rimuovi'`."*
> **Riferimento Societario Pubblico Ufficiale (`JUL-009` — Regola Zero):**
> `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, 50122 Firenze (FI) · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.`

---

## 1. Elenco Completo dei Campi Rimossi dalla Schermata `"Camere e Unità"` (`/app.html` — Punto 3 `JUL-038`)

Dalla schermata `"Camere e Unità"` dell'Area Proprietario (`/app.html`) sono stati **rimossi integralmente** tutti i campi che non appartengono alla coppia essenziale **`Nome commerciale` + `Link calendario`**:

1. **Caratteristiche Fisiche e Capienza dell'Unità:**
   - Tipologia alloggio (appartamento, suite, camera, villa);
   - Metratura (`mq`);
   - Piano e presenza ascensore;
   - Numero massimo di ospiti;
   - Numero di bagni;
   - Numero di letti matrimoniali, letti singoli e divani letto;
   - Servizi e dotazioni interne (Wi-Fi, A/C, cucina, lavatrice, ecc.).
2. **Contenuti Editoriali, Foto e Link Annunci:**
   - Foto principale dell'unità (`URL` immagine, incluso il seed dimostrativo `/assets/florence-window.webp`);
   - `URL` pubblico dell'annuncio OTA;
   - Descrizioni commerciali in Italiano (`IT`) e in Inglese (`EN`).
3. **Intero Blocco `"Dati operativi e collegamento 2. PBA"`:**
   - Codice chiave (`KEY-101`);
   - Gancio armadio chiavi (incluso qualsiasi riferimento all'indirizzo del magazzino interno `Via dell'Agnolo 72R, Firenze`, che è **rigorosamente riservato al solo uso interno operativo** e non compare più in alcun punto dell'app cliente `/app.html`);
   - Codice portone (`4829#`) e Codice Key Box (`KB-9101`);
   - Tempo standard di pulizia ed etichetta turno (`TURNO-11:00-14:00-FI-01`);
   - Istruzioni operative di accesso e dotazione standard biancheria.
4. **Intero Blocco `"Regole di soggiorno e deposito"` e Controlli Ridondanti:**
   - Regole di soggiorno, divieti, note deposito cauzionale;
   - Pulsante `"Duplica questa scheda"`.

### Cosa Resta nella Schermata `"Camere e Unità"` (`JUL-038`):
Per ogni struttura/unità gestita dal proprietario, una **riga pulita e responsive** contenente unicamente:
- **`Nome commerciale`** (campo di testo obbligatorio, vuoto al primo accesso);
- **`Link calendario`** (campo URL obbligatorio per il link `.ics` di condivisione calendario con validazione `https://` o `webcal://` — convertito automaticamente in `https://` — e rifiuto di URL non sicuri `http://` o stringhe invalide);
- Pulsante **`"Aggiungi un'altra struttura"`** (per aggiungere più righe/strutture) e pulsante **`"Rimuovi"`** su ciascuna riga.

---

## 2. Pulizia Seed Fittizi, Rimozione Esposizione Dati Interni e Audit Record Esistenti (Punti 4 e 5 `JUL-038`)

| Verifica Eseguita | Stato Precedente | Intervento Applicato (`JUL-038` + `Regola Zero`) |
| :--- | :--- | :--- |
| **Esposizione indirizzo interno `Via dell'Agnolo 72R` nell'app cliente (`/app.html`)** | Compariva nelle etichette/note del blocco `"Dati operativi e collegamento 2. PBA"` (gancio armadio / logistica chiavi). | **Rimosso al 100% da `/app.html` e da tutte le viste accessibili al cliente.** Sulle pagine pubbliche e nell'area cliente compare esclusivamente la Sede legale: `Via Matteo Palmieri 20R, 50122 Firenze (FI)`. |
| **Valori di seed dimostrativi precompilati (`Suite 101 · Santo Spirito`, `KEY-101`, `4829#`, `KB-9101`, `TURNO-11:00-14:00-FI-01`, `/assets/florence-window.webp`)** | Presenti come placeholder/valori iniziali nel form o nello script di inizializzazione unità. | **Eliminati completamente.** Al primo accesso la schermata presenta una singola riga vuota pronta per l'inserimento reale del cliente. |
| **Audit database server / file di produzione per record reali di clienti** | Verifica su repository e storage cloud/locale. | **`0 record reali di clienti` presenti sul server.** Nessun dato reale di clienti è andato perso. |
| **Gestione eventuali dati legacy nel `localStorage` del browser (`ita_onboarding_units` / `ita_units`)** | Potevano contenere le vecchie proprietà (`sqm`, `beds`, `keyCode`, `keyboxCode`, ecc.) salvate durante sessioni di test. | I vecchi attributi non vengono cancellati silenziosamente ma **non sono più mostrati né utilizzati nella UI**, che legge e salva unicamente `{ commercialName, calendarUrl }`, in attesa della decisione di Julian sull'eventuale pulizia definitiva delle chiavi legacy. |

---

## 3. Mappa delle Dipendenze dai Campi Eliminati e Domande per Julian (Punti 3 e 6 `JUL-038`)

Per garantire che **nessuna funzione già venduta o attiva vada in errore**, tutti i moduli collegati in `app.html` e `cloud-sync.js` sono stati protetti con fallback sicuri basati su `Nome commerciale`, `Link calendario` e sull'indirizzo dell'immobile configurato nel Passo 1 (`JUL-037`). Di seguito il dettaglio punto per punto e le **domande ufficiali per Julian**:

| # | Funzione / Modulo Collegato | Dipendenza Precedente | Stato Attuale (Zero Rotture Tecniche) | Domanda / Decisione Richiesta a Julian (`[DA CONFERMARE]`) |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Generatore PDF `"Istruzioni check-in"` / Guida Ospiti (`/app.html` e `/ospiti.html`)** | Leggeva dalla scheda unità: piano, ascensore, codice portone, codice keybox e istruzioni di accesso. | Non va in errore: utilizza il `Nome commerciale` dell'unità, l'indirizzo dell'immobile del Passo 1 e il `Telefono per coordinamenti operativi`, lasciando eventuali dettagli operativi d'accesso compilabili al volo o gestiti dal PM. | **Domanda 1 per Julian:** *Confermi se il generatore PDF Istruzioni Check-in in `app.html` deve restare attivo con inserimento rapido al momento della stampa, oppure se le istruzioni di accesso vengono gestite direttamente dal Property Manager fuori da "Camere e Unità"?* (`[DA CONFERMARE]`) |
| **2** | **Attivazione Turni Pulizia verso `2. PBA` (`activateBlueArroyoCleaningSuiteOneTap` / `dispatchPbaZtlCleaningShiftsWebhook`)** | Leggeva dalla scheda unità: metratura (`mq`), numero letti/bagni, tempo standard pulizia, etichetta turno e codici chiave/gancio. | Non va in errore: il planner legge le date di check-out/check-in dal **`Link calendario`** associato al **`Nome commerciale`** dell'unità. | **Domanda 2 per Julian:** *Confermi che i dettagli tecnici per il listino pulizie (metratura, numero bagni/letti e modalità di consegna chiavi) vengono rilevati separatamente dal PM / Preventivo Generale PBA, mentre nell'app Itassistance del cliente basta il `Link calendario` per generare i turni alle date di check-out?* (`[DA CONFERMARE]`) |
| **3** | **Skill Ticket Manutenzioni & Network Manutentori (`JUL-010`)** | Usa l'identificativo dell'unità e la zona generica (scudo privacy Cliente ↔ Manutentore). | **100% compatibile senza modifiche:** utilizza il `Nome commerciale` della struttura e la zona ricavata dall'indirizzo dell'immobile (`JUL-037`). | Nessuna criticità — già pienamente operativo. |
| **4** | **Modulo Booking Interno dalla Home Page (`JUL-033` — `#app-direct-booking-panel`)** | Ha il proprio pannello dedicato in `/app.html` con consenso esplicito, titolo pubblico, zona generica, capienza ospiti e prezzo notte indicativo. | **100% indipendente e intatto:** non dipende dai campi rimossi da `"Camere e Unità"` e verifica le disponibilità sul calendario dell'unità. | Nessuna criticità — già pienamente operativo. |
| **5** | **Sincronizzazione del `Link calendario` (`.ics` / `webcal://`)** | Salvava l'URL del feed iCal nella configurazione dell'unità. | In `app.html` e `cloud-sync.js` il `Link calendario` viene validato (`https://` o `webcal://` normalizzato in `https://`, con blocco di `http://` o URL malformati) e salvato nell'elenco strutture sincronizzato con `admin.html`. | **Domanda 3 per Julian (`[DA CONFERMARE]`):** *Per la lettura automatica periodica dei file `.ics` esterni (Airbnb / Booking.com) lato server (evitando i blocchi CORS del browser), confermi l'attivazione di una funzione server-side/cron su Vercel (`/api/ical-proxy` / job di sincronizzazione periodica)?* (`[DA CONFERMARE]`) |

---

## 4. Eliminazione dei Passi `"Motore e Canali"` e `"Revenue"` dal Wizard Struttura — Wizard a 2 Soli Passi (`JUL-039` & `JUL-055`)

In esecuzione degli ordini **`JUL-039`** e **`JUL-055` (Punto A3)**, sono stati eliminati dal wizard di configurazione struttura in `/app.html` sia il vecchio `"Motore e Canali"` sia il passo `"Revenue Automatico"`, portando il Wizard a **2 soli passi**:

### 4.1 Struttura Definitiva del Wizard in 2 Passi (`/app.html` — `JUL-055`)
1. **`Passo 1 di 2 · Struttura` (`JUL-037` / `JUL-055`):** Anagrafica titolare, P.IVA/CF, `Indirizzo dell'immobile` con aiuto Google Maps (`Comune`, `Provincia`, `CAP`), `Telefono per coordinamenti operativi`, `Email per ricevere le fatture`, `Orario check-in`, `Orario check-out`, `Lingue`, `Fuso orario`, `Valuta`.
2. **`Passo 2 di 2 · Camere e Link Calendario` (`JUL-038` / `JUL-055`):** Coppia essenziale `Nome commerciale` + `Link calendario` (`.ics` / `webcal://`) con pulsanti `"Aggiungi un'altra struttura"` e `"Rimuovi"`.

### 4.2 Cosa è Stato Rimosso (`JUL-039` + `JUL-055` + `Regola Zero`)
- **Rimosse tutte le diciture non conformi a `JUL-033` / `JUL-039` / `JUL-055`:**
  - Eliminato ogni riferimento a **`"85%"`**, **`"payout 85%"`**, **`"15% cashback"`**, **`"accredito entro le 12:00"`**;
  - Eliminato l'IBAN dimostrativo di seed **`IT60X0306902887100000007480`**;
  - Eliminati i campi separati per singolo portale OTA con i link/ID fittizi (`12345678.ics`, `87654321`) e il campo *"Compensazione commissioni OTA (`18%`)"*;
  - Eliminata ogni promessa commerciale o tecnica di **`"anti-overbooking"`** automatico non garantito;
  - Rimosso il passo `"Revenue Automatico"` dal wizard struttura (`JUL-055` A3): l'opzione **Revenue Plan (+10% sul netto spettante al proprietario prima delle sue tasse personali)** è regolata direttamente in sede di contratto (`/contratto.html` e `/checkout.html`).
- **Effetto dell'unico `Link calendario` per struttura (`JUL-038` + `JUL-039`):**
  - La condivisione del calendario si basa esclusivamente sull'**unico `Link calendario`** inserito dal proprietario per ciascuna struttura nel `Passo 2 di 2 · Camere e Link Calendario`, utilizzato per leggere le date occupate/check-out ai fini del coordinamento operativo del PM, senza promettere sincronizzazioni multi-portale bidirezionali né garanzie di anti-overbooking.

### 4.3 Audit Record Esistenti sui Passi Eliminati (`Regola Zero`)
- **Database server / file di produzione:** **`0 record reali di clienti`** contenevano IBAN, link iCal separati o percentuali di compensazione OTA nel passo *"Motore e Canali"*.
- **Eventuali dati legacy in `localStorage` (`ita_onboarding_channels`):** non vengono più letti, mostrati né inviate ad alcun servizio esterno.

