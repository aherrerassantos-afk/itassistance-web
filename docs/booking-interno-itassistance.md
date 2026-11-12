# Modulo Booking Interno Itassistance — Architettura Operativa, Scudo Privacy & Nota Legale (`JUL-033`)

> **Direttiva Esecutiva:** `JUL-033` — Modulo di **richiesta di prenotazione diretta** dalla Home Page (`index.html` e `en/index.html`) per i soli appartamenti dei proprietari che usano `Itassistance` e hanno rilasciato **consenso esplicito**, **senza pagamento online** e **senza integrazione con `SmartsBookings`**.
> **Piano & Progetto:** `Piano 4 · Itassistance` (`https://www.itadreamteam.com`)
> **Riferimento Societario Pubblico Ufficiale (`JUL-009` — Regola Zero):**
> `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, 50122 Firenze (FI) · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.`

---

## 1. Decisioni di Julian e Architettura del Modulo (`JUL-033`)

### 1.1 Principi Inviolabili del Modulo Booking Interno
1. **Solo Richiesta di Prenotazione (Zero Pagamenti Online, Zero Integrazione SmartsBookings):**
   - Il modulo pubblicato nella Home Page (`index.html` e `en/index.html`) consente esclusivamente di **verificare la disponibilità** e **inviare una richiesta di prenotazione**.
   - **Non c'è alcun gateway di pagamento online per gli ospiti** e non c'è alcun collegamento al portale `SmartsBookings`.
2. **Quali Case Compaiono (Consenso Esplicito Obbligatorio):**
   - Compaiono **esclusivamente** gli appartamenti dei proprietari clienti di `Itassistance` che hanno attivato espressamente l'opzione di consenso nell'Area Proprietario (`/app.html` → `#app-db-consent-chk` · `directBookingConsent === true`), con disponibilità verificata sul calendario reale dell'unità (inclusi blocchi iCal e soggiorni già confermati).
3. **Regola Zero — Nessuna Casa d'Esempio (Stato Vuoto di Default):**
   - In totale aderenza alla `Regola Zero – Solo Info Vera`, **non viene mai caricato alcun appartamento dimostrativo o fittizio**, né foto, prezzi, recensioni o rating inventati.
   - Finché nessun proprietario reale ha attivato il consenso esplicito e confermato i dati dell'alloggio, la ricerca mostra lo stato vuoto ufficiale:
     **`"Presto disponibili · [DA CONFERMARE]"`** (*"Available soon · `[DA CONFERMARE]`"* nella versione inglese).
4. **Prezzo della Notte e Incasso Diretto da parte del Proprietario:**
   - Il prezzo a notte è deciso **esclusivamente dal Proprietario** (oppure visualizzato come **`"Su richiesta"`** / **`"On request"`** qualora il proprietario non abbia indicato una tariffa pubblica).
   - `Itassistance` applica **`0%` commissioni d'intermediazione** e **`0%` maggiorazioni sull'ospite**.
   - Il canone fisso di **`99,00 € / mese`** riguarda esclusivamente il rapporto software/operativo tra `Itassistance` e il Proprietario e non viene mai mostrato né ribaltato nel prezzo dell'ospite.
   - **Il pagamento del soggiorno viene incassato direttamente dal Proprietario**; `Blue Arroyo S.r.l.` (`Itassistance`) non incassa né detiene mai le somme relative ai soggiorni.

### 1.2 Flusso Operativo End-to-End (`Home → App Proprietario / Console Admin → Blocco Calendario`)
1. **Passo 1 — Ricerca Disponibilità sulla Home (`index.html` e `en/index.html`):**
   - L'utente seleziona **Città (`Firenze`)**, **Data Check-in**, **Data Check-out** e **Numero di Ospiti**.
   - Il motore interroga esclusivamente le unità con `directBookingConsent === true` e verifica che l'intervallo `[checkIn, checkOut)` non si sovrapponga a date già bloccate o prenotazioni confermate.
2. **Passo 2 — Invio Modulo di Richiesta Prenotazione:**
   - Sull'alloggio disponibile (o come richiesta generale se lo stato è vuoto), l'ospite compila: **Nome e Cognome**, **Email**, **Telefono**, **Date Check-in / Check-out**, **Numero Ospiti**, **Note eventuali** e spunta il **Consenso Privacy GDPR + Consenso all'inoltro della richiesta al Proprietario**.
3. **Passo 3 — Ricezione in Console Interna (`/admin.html`) e Area Proprietario (`/app.html`):**
   - La richiesta viene salvata con stato iniziale **`PENDING` (`"Richiesta prenotazione in attesa di verifica"`)** e resa immediatamente visibile sia al Team in `/admin.html` (`#adm-direct-booking-requests-panel`), sia al Proprietario in `/app.html` (`#app-direct-booking-panel`).
4. **Passo 4 — Verifica, Conferma o Rifiuto (`CONFIRMED` / `REJECTED`) e Blocco Calendario:**
   - **Finché la richiesta è `PENDING`, il calendario non viene bloccato** (evitando blocchi abusivi da richieste non verificate).
   - Quando la richiesta viene **Confermata (`CONFIRMED`)**, le date `[checkIn, checkOut)` vengono **bloccate automaticamente nel calendario dell'unità**, l'ospite riceve la notifica di conferma e il Proprietario riceve i riferimenti per perfezionare il contratto di locazione turistica e **incassare direttamente il soggiorno**.
   - Se la richiesta viene **Rifiutata (`REJECTED`)**, le date restano libere e l'ospite riceve notifica di mancata disponibilità.

---

## 2. Scudo Privacy Bidirezionale e Sicurezza Tecnica (`security-review`)

### 2.1 Scudo Privacy in Conformità alla Regola Contratto / Reel (`JUL-011`)
- **Protezione Identità del Proprietario e Sicurezza dell'Immobile:**
  - Nelle schede di disponibilità pubblicate sulla Home Page e prima della conferma definitiva, l'ospite **non vede mai**:
    - il nome e cognome o la ragione sociale del Proprietario;
    - il telefono o l'email privata del Proprietario;
    - il **numero civico esatto**, il piano, il citofono o i codici `Keybox` / `Smart Lock` (viene mostrata unicamente la zona/quartiere generico, es. **`"Firenze · Centro Storico [Civico riservato]"`**).
- **Minimizzazione Dati Ospite (Art. 5 GDPR):**
  - Al Proprietario vengono trasmessi unicamente i dati strettamente necessari alla gestione della richiesta di soggiorno (nome, recapito, date e numero ospiti).

### 2.2 Misure di Sicurezza Informatica e Anti-Abuso
1. **Validazione Rigorosa Input (Client & Engine):** controllo obbligatorio di presenza e formato su Nome, Email (`RFC 5322`), Telefono, coerenza date (`checkOut > checkIn`, date non nel passato) e numero ospiti (`1..16`).
2. **Campo Honeypot Invisibile Anti-Bot (`website_url`):** qualsiasi invio automatico in cui il campo nascosto `website_url` risulti valorizzato viene intercettato e scartato silenziosamente prima di generare ticket o notifiche.
3. **Rate-Limiting Anti-Flood:** blocco automatico di invii ripetuti ravvicinati dallo stesso client/sessione per prevenire spam sulla coda operativa.
4. **Sanitizzazione Anti-XSS:** ogni stringa inserita dall'utente o dal proprietario viene sottoposta a escaping HTML (`&`, `<`, `>`, `"`, `'`) prima del rendering nel DOM di `index.html`, `en/index.html`, `app.html` e `admin.html`.
5. **Integrità Prezzi e Zero Segreti nel Frontend:** nessuna chiave privata è esposta nel client e il prezzo notte viene sempre riletto dall'anagrafica dell'unità (mai fidandosi di campi hidden modificabili dall'utente).

---

## 3. ⚠️ ATTENZIONE LEGALE E FISCALE DA FAR VERIFICARE A UN PROFESSIONISTA (Segnalazione Obbligatoria per Julian — Punto 6 `JUL-033`)

Prima di attivare in produzione la pubblicazione di alloggi reali sul modulo di richiesta prenotazione della Home Page, **Julian deve sottoporre al proprio consulente legale e al commercialista i seguenti 5 profili normativi**:

### 1. Rischio di Qualificazione come Intermediazione Immobiliare (`Art. 1754 c.c.` e `Legge 3 febbraio 1989, n. 39`)
- **Quadro attuale:** il Contratto di Servizio di `Itassistance` (`/contratto.html`) esclude espressamente l'attività di intermediazione immobiliare, l'incasso dei canoni di locazione e l'applicazione di commissioni sulle prenotazioni (`0%`).
- **Rischio normativo:** ai sensi dell'art. 1754 c.c. e della L. 39/1989, mettere in relazione due o più parti per la conclusione di un affare (inclusa una locazione turistica breve di immobili di terzi) svolgendo attività di raccolta e conferma delle prenotazioni sul proprio sito web potrebbe essere riqualificato dalle autorità competenti come **attività di mediazione immobiliare**, per la quale è richiesta l'abilitazione e l'iscrizione nella specifica sezione REA per agenti d'affari in mediazione, anche qualora il compenso verso il proprietario sia pattuito in misura fissa mensile anziché percentuale.
- **Misura cautelativa adottata nel software:** il modulo opera esclusivamente come **strumento tecnologico di inoltro della richiesta di disponibilità al Proprietario** (*"Richiesta di disponibilità inoltrata direttamente al proprietario dell'immobile: il proprietario conferma la disponibilità, stipula il contratto di locazione turistica e incassa direttamente il soggiorno senza alcuna commissione d'intermediazione da parte di Itassistance"*). Qualsiasi eventuale modifica alle clausole di `/contratto.html` resta subordinata a conferma scritta di Julian dopo parere legale (`[DA CONFERMARE]`).

### 2. Obbligo di Esposizione del Codice `CIN` negli Annunci (`Art. 13-ter D.L. 145/2023` convertito in `L. 191/2023`)
- **Obbligo di legge:** la disciplina nazionale sul Codice Identificativo Nazionale (`CIN` – BDSR Ministero del Turismo) impone a chiunque proponga o conceda in locazione breve un'unità immobiliare, ovvero ai soggetti che gestiscono portali telematici, di **indicare il codice `CIN` dell'unità in ogni annuncio ovunque pubblicato e comunicato**, prevedendo sanzioni amministrative pecuniarie in caso di omissione.
- **Misura adottata e verifica richiesta:** nel pannello di attivazione del consenso in `/app.html` è stato predisposto il campo `CIN` dell'alloggio (`IT048017...`) che viene esposto sulla scheda pubblica quando valorizzato; il consulente legale dovrà confermare l'obbligatorietà bloccante del `CIN` prima della pubblicazione di ogni singola scheda (`[DA CONFERMARE]`).

### 3. Titolarità degli Obblighi di Pubblica Sicurezza (`Alloggiati Web` – `Art. 109 TULPS`), `ISTAT Ross1000`, Imposta di Soggiorno e Regime Fiscale (`D.L. 50/2017`)
- **Assenza di incasso da parte di Itassistance (Esclusione Ritenuta 21%):** poiché `Blue Arroyo S.r.l.` **non incassa i canoni o i corrispettivi** né interviene nel pagamento tra ospite e proprietario (art. 4, co. 5-bis, D.L. 50/2017), l'onere fiscale (Cedolare Secca 21%/26% o regime ordinario) e l'emissione della ricevuta/fattura del soggiorno rimangono interamente ed esclusivamente in capo al **Proprietario-Locatore**.
- **Pubblica Sicurezza e Tassa di Soggiorno:** la responsabilità giuridica primaria per l'identificazione degli ospiti, l'invio telematico delle schedine alla Questura di Firenze (`Alloggiati Web` entro 24h o 6h per soggiorni di 1 notte), la trasmissione statistica `ISTAT / Ross1000` e il riversamento dell'Imposta di Soggiorno al Comune di Firenze resta in capo al titolare del `CIN/SCIA` (il Proprietario), che si avvale di `Itassistance` quale mero supporto operativo delegato.

### 4. Qualificazione Privacy `GDPR` (`Reg. UE 2016/679` — Titolare vs Responsabile Esterno `Art. 28`) e Data Retention
- **Flusso dati personali dell'ospite:** raccogliendo sul sito `itadreamteam.com` i dati identificativi e di contatto del potenziale ospite per trasmetterli al Proprietario dell'immobile selezionato, occorre verificare con il DPO/consulente privacy l'aggiornamento di `/privacy.html` per specificare:
  - che il **Proprietario dell'immobile** è il **Titolare autonomo del trattamento** per la gestione della richiesta di locazione e l'eventuale contratto di soggiorno;
  - che **`Blue Arroyo S.r.l.`** agisce quale **Responsabile del trattamento ex art. 28 GDPR** (per la fornitura del canale tecnico di raccolta e inoltro) e Titolare per le sole finalità di sicurezza informatica del sito;
  - il **tempo massimo di conservazione (*Data Retention*)** delle richieste non confermate o rifiutate (`[DA CONFERMARE: es. 30 o 90 giorni]`).

### 5. Esclusione della Disciplina sui Pacchetti Turistici (`D.Lgs. 79/2011 – Codice del Turismo`)
- **Perimetro rigoroso:** il modulo sulla Home Page deve limitarsi alla sola richiesta di disponibilità della singola unità abitativa del Proprietario, senza mai combinare o vendere congiuntamente alloggio + servizi turistici accessori (es. tour guidati, noleggio veicoli, esperienze) nella medesima transazione, così da non ricadere negli obblighi autorizzativi, assicurativi e di fondo di garanzia previsti per i Tour Operator / Agenzie di Viaggio dal Codice del Turismo.
