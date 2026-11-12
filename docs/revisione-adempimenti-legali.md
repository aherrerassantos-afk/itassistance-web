# Revisione Adempimenti Legali e Allineamento "Configurazione Struttura" — Piano 4 · Itassistance (`JUL-037`)

> **Direttiva Esecutiva:** `JUL-037` — Semplificazione schermata `"Configurazione Struttura"` in `/app.html`:
> *"email per ricevere le fatture metti. Telefono metti per coordinamenti operativi. URL logo togli, quello non serve. Il ss n.2: togli quella sezione, non ci serve avere info legale perché noi ci limitiamo a fare i report operativi, amministrativi. Il cliente continua a fare tutta la sua parte legale in autonomia."*
> **Riferimento Societario Pubblico Ufficiale (`JUL-009` — Regola Zero):**
> `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, 50122 Firenze (FI) · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.`

---

## 1. Riepilogo Intervento Eseguito su `"Configurazione Struttura"` (`/app.html` — `JUL-037`)

1. **Sezione 1 — Anagrafica e Indirizzo dell'Immobile (con Aiuto Google Maps):**
   - **Ragione sociale / Nome e Cognome titolare** (campo vuoto di default, nessun valore fittizio precompilato).
   - **P.IVA / Codice Fiscale** (campo vuoto di default).
   - **Indirizzo dell'immobile** (unico campo di ricerca indirizzo con autocompletamento Google Maps / geocoding verificato, che popola in automatico **Comune/Città**, **Provincia** e **CAP** in sola lettura con pulsante `"Modifica"` per lo sblocco manuale; eliminata definitivamente qualsiasi dicitura `"Sede Operativa"`).
   - **Telefono per coordinamenti operativi** (dedicato al coordinamento quotidiano con il Property Manager).
   - **Email per ricevere le fatture** (dedicato all'invio delle copie pro-forma `"My Box"` e delle fatture emesse dall'amministrazione).
   - **Eliminato completamente** il campo `"URL Logo e Foto copertina struttura"`.
2. **Sezione 2 — Eliminata Integralmente (`Codici obbligatori e credenziali istituzionali`):**
   - Rimossa l'intera sezione che richiedeva `Codice CIN`, `Codice CIR / Regionale`, `Utente Alloggiati Web`, `Chiave / WSKEY Alloggiati Web`, `Codice struttura ISTAT / Ross1000` e `Aliquota imposta di soggiorno`.
   - **Principio operativo fissato da Julian (`JUL-037`):** `Itassistance` si limita a elaborare i **report operativi e amministrativi** per il proprietario; il cliente continua a gestire tutta la propria parte legale, fiscale e istituzionale in totale autonomia.
3. **Sezione Orari e Parametri Operativi mantenuta con Etichette Brevi e Dirette (`JUL-037`):**
   - Conservata la sezione `"Orari di check-in/check-out, lingue, fuso orario e valuta"` con il pulsante `"Salva e vai a Camere e Unità"`.
   - **Semplificazione Etichette Campi (`JUL-037`):** eliminate parole ridondanti o potenzialmente ambigue come *"limite"* o *"standard"*:
     - `"Orario standard Check-in"` → **`"Orario check-in"`**
     - `"Orario limite Check-out"` → **`"Orario check-out"`**
     - `"Lingue attive comunicazioni ospiti"` → **`"Lingue"`**
     - `"Fuso orario operativo"` → **`"Fuso orario"`**
     - `"Valuta di riferimento"` → **`"Valuta"`**
     - Campi geografici e recapiti diretti: **`"Indirizzo"`** (`"Indirizzo dell'immobile"`), **`"Comune"`**, **`"Provincia"`**, **`"CAP"`**, **`"Email per le fatture"`** (`"Email per ricevere le fatture"`), **`"Telefono per coordinamenti operativi"`**.

---

## 2. Audit Dati Esistenti e Gestione Record Precedenti (Punto 6 `JUL-037`)

È stato eseguito un controllo completo sul codice sorgente, sui file di configurazione e sui flussi di storage (`cloud-sync.js`, `todo-admin-engine.js`, `app.html`, `admin.html`, `site-config.js`) di `Piano 4 · Itassistance`:

| Tipologia di Dato Verificato | Esito Audit nel Repository / Database | Azione Eseguita (`Regola Zero` + `JUL-037`) |
| :--- | :--- | :--- |
| **Valori di seed dimostrativi in `app.html` e `cloud-sync.js`** | Erano presenti stringhe di esempio (`Prestige Living S.r.l.`, `IT048017C2A9B8F3K1`, `048017-ALB-0042`, `FI048017_HOST01`, `WSKEY-QUESTURA-FI-2026-OK`, `ROSS1000-FI-048017`, `proprietario@itadreamteam.com`). | **Rimossi integralmente da tutti i seed e dagli input HTML.** Tutti i campi partono vuoti (`""`) o marcati `[DA CONFERMARE]`. |
| **Scheda Prospect `ARM-2026-MP86` (Marco Palumbo)** | Il campo CIN era già marcato `[DA CONFERMARE]` e non conteneva alcuna credenziale Alloggiati Web o ISTAT. | Mantenuta solo l'anagrafica commerciale/operativa senza campi di credenziali istituzionali. |
| **Credenziali istituzionali di clienti reali su database / server** | **`0 record` di clienti reali presenti.** Non esistono chiavi `WSKEY` o password istituzionali di clienti reali salvate sul server o nel repository. | Nessuna esposizione di dati reali. |
| **Eventuali dati salvati localmente nel browser (`localStorage`: `ita_onboarding_structure` / `ita_structure_config`)** | Eventuali chiavi salvate in sessioni di test precedenti (`cin`, `cir`, `alloggiatiUser`, `alloggiatiWsKey`, `istatCode`). | Il codice di `app.html` e `cloud-sync.js` **ignora e non legge né mostra né trasmette più** tali campi. *(Su conferma di Julian, può essere eseguita anche la cancellazione automatica delle chiavi legacy in `localStorage` al caricamento).* |

---

## 3. Mappa Completa dei Punti di Sito, App e Contratto che Citano i Campi Rimossi e Proposta Operativa (Punto 7 `JUL-037`)

Poiché `Itassistance` **si limita a fornire i report operativi e amministrativi** mentre **il cliente svolge tutta la propria parte legale in autonomia**, di seguito sono mappati tutti i punti dell'ecosistema che facevano riferimento a `CIN`, `CIR`, `Alloggiati Web`, `ISTAT / Ross1000` e `Imposta di soggiorno`, con la relativa proposta di allineamento:

| # | Area / File Coinvolto | Come Funzionava Prima | Proposta di Allineamento (`Report Operativi & Amministrativi` — Parte Legale al Cliente) | Stato |
| :-: | :--- | :--- | :--- | :---: |
| **1** | **Area Proprietario `/app.html` (`#screen-fisco` / `#screen-checkin`) — Sezione Alloggiati Web, ISTAT e Imposta di Soggiorno** | Faceva riferimento a invii/tracciati collegati ai codici struttura inseriti nel passo 1. | Trasformare la vista esclusivamente in **"Report Operativi e Amministrativi Mensili"**: riepilogo presenze, date check-in/check-out e conteggio notti scaricabile in PDF/CSV dal proprietario, affinché il proprietario possa svolgere in autonomia i propri adempimenti legali e fiscali sui portali istituzionali senza mai inserire credenziali in Itassistance. | **Proposta pronta (`[DA CONFERMARE]` da Julian)** |
| **2** | **Flusso Check-in in Presenza / Concierge senza Link Online (`JUL-047` / `JUL-056`)** | Raccoglieva i dati di arrivo tramite un modulo online (`/ospiti.html`). | **Applicato con `JUL-055` e `JUL-056`:** **non si fanno link di check-in online** (`/ospiti.html` rimosso dai flussi). Al proprietario viene indicato **`"Manda sempre il numero di assistenza per gli ospiti"`** (`+39 349 177 5561` · `itassistance@bluearroyo.it`); i dati vengono presi direttamente al check-in e condivisi con il proprietario in formato **foto caricata dal Concierge** da `/admin.html` verso `/app.html` (`1. Operativa` / `4. Reports "My Box"`). | **Già attivo (`JUL-056`)** |
| **3** | **Modulo Booking Interno (`index.html`, `en/index.html`, `app.html` — `JUL-033`)** | Prevedeva un campo opzionale per mostrare il codice `CIN` sull'annuncio se comunicato dal proprietario. | Lasciare l'eventuale indicazione del `CIN` nella scheda pubblica come facoltà libera e autonoma del proprietario quando attiva il consenso alla richiesta di prenotazione, senza alcuna verifica o gestione legale da parte di Itassistance. | **Già non bloccante · `[DA CONFERMARE]`** |
| **4** | **Pagine Guida SEO (`alloggiati-web-firenze-guida.html`, `cin-affitti-brevi-firenze.html`, `istat-ross1000-firenze.html`, `tassa-soggiorno-firenze-affitti-brevi.html`)** | Guide informative pubbliche che spiegano gli obblighi normativi a Firenze e presentano Itassistance. | Mantenere le guide come puro contenuto informativo per posizionamento SEO organico, precisando nel testo che **il proprietario svolge gli adempimenti legali in autonomia** mentre `Itassistance` fornisce il **coordinamento operativo del PM e i report operativi/amministrativi**. | **Proposta pronta (`[DA CONFERMARE]` da Julian)** |
| **5** | **Contratto (`/contratto.html` e PDF `/contratti/`), Home (`index.html`, `en/index.html`) e Prezzi (`/prezzi.html`)** | Nell'elenco di cosa comprende il canone di `99,00 €/mese` compare la voce *"Supporto operativo agli adempimenti burocratici (Alloggiati Web, ISTAT / Ross1000, promemoria imposta di soggiorno)"* e nell'Art. 7 del contratto il riferimento alla conformità normativa dell'immobile in capo al Cliente. | **Applicato con `JUL-055` e `JUL-057`:** sostituito con l'unico inbox **`"My Box"` con Report delle `08:00 AM` e To-Do List del proprietario** (consegna il giorno seguente al check-in delle foto caricate dal Concierge per gli adempimenti di legge del proprietario + spunta dei Pro-Forma il giorno seguente alla chiusura contabile di fine mese), restando ogni adempimento legale, fiscale e istituzionale in capo al proprietario in autonomia. | **Già attivo (`JUL-055` / `JUL-057`)** |

---

## 4. Architettura Ufficiale dei 4 Profili in `ITASSISTANCEDREAMTEAM.IT` (`Task #129` · `JUL-061`)

Con la direttiva `JUL-061`, Julian ha fissato la nomenclatura e i perimetri operativi dei **4 profili ufficiali** di **`ITASSISTANCEDREAMTEAM.IT`**:

1. **Team `ITASSISTANCEDREAMTEAM.IT` (`/admin.html`) — Due profili distinti con la stessa dashboard operativa tipo OM:**
   - **`Super Admin`:** accesso completo alla dashboard operativa di `/admin.html` (`Strutture Associate`, `Clienti`, `Ticket Aperti`, `CRM Nuovi Clienti`, Report `08:00 AM` `"My Box"`, upload foto check-in Concierge) **più** la gestione delle credenziali dei profili e dei parametri amministrativi.
   - **`Customer Care`:** è il **nome ufficiale dell'OM (Operational Manager)** in **`ITASSISTANCEDREAMTEAM.IT`**, con la stessa dashboard operativa di `/admin.html` per coordinare pulizie, accoglienza ospiti, manutenzioni, prenotazioni last-minute, assistenze notturne, caricamento foto documenti al check-in e invio dei task nel Report delle `08:00 AM`.
2. **`Cliente` (`/app.html` — Proprietario):**
   - È il **Proprietario dell'immobile**, ossia **colui che paga le nostre fatture** e gestisce i propri immobili e i propri adempimenti legali in autonomia dal Pannello Clienti (`/app.html`: `1. Operativa · 2. Amministrativa · 3. Fisco · 4. Reports "My Box"` con Report delle `08:00 AM` e To-Do List).
3. **`Usuario` (Turista / Ospite):**
   - È il **Turista / Ospite**, ossia **colui che usufruisce della nostra copertura e del nostro ventaglio di servizi** (assistenza diretta `+39 349 177 5561` · `itassistance@bluearroyo.it`, accoglienza Concierge al check-in senza link online e richiesta di soggiorno).
