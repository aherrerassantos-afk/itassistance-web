# Piano d'Azione & Architettura del Sistema Amministrativo e Contabile di Gruppo per Gabriela (`Yarvis YV-mw9bdirw` & `YV-mw9be3p2`)

> **Richiedente:** Julian (via chiamata telefonica Yarvis `YV-mw9bdirw` e complemento `YV-mw9be3p2`)
> **Responsabile Umano Designato:** **Gabriela** (Responsabile Amministrazione, Contabilità, Fatturazione & Tesoreria della **Palazzina Holding — Blue Arroyo Group**)
> **Società Capogruppo (`JUL-009`):** `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.` *(Nota interna: il Magazzino in `Via dell'Agnolo 72R, Firenze` è **SOLO uso interno operativo** e mai esposto sul sito pubblico o nei contratti clienti)*
> **Numerazione Ufficiale Piani (`JUL-009`):** `Piano 1 · Toscan Costruzioni` · `Piano 2 · PBA` · `Piano 3 · SmartsBookings` · `Piano 4 · Itassistance`
> **Motore Software Integrato:** `todo-admin-engine.js` + `cloud-sync.js` (`getGabrielaAccountingConfig`) + Console Amministrativa `/admin.html` collegata alla Dashboard Centrale della Palazzina Holding (`porta 3000`).

---

## 1. Obiettivo del Sistema Contabile Unificato per Gabriela
Creare dentro la **Palazzina Holding** e in collegamento diretto con i **4 Piani operativi** un unico **Centro di Comando Amministrativo e Contabile** gestito da **Gabriela**, capace di:
1. Registrare e controllare **tutte le fatture attive (emesse) e passive (ricevute)**, gli **incassi**, le **uscite (pagamenti fornitori, F24, imposta di soggiorno, compensi P.IVA, SAL cantiere)** e la **Prima Nota di cassa e banca**.
2. Separare rigorosamente i **fondi operativi di Blue Arroyo SRL** dai **conti dedicati ai Proprietari (ARM)** e alla **custodia cauzionale 15% Cashback (SmartsBookings)**.
3. Ridurre dell'80% il data-entry manuale di Gabriela grazie a **5 metodi concreti di alimentazione dati** con validazione assistita.

---

## 2. I 5 Metodi Concreti con cui Gabriela Alimenta il Sistema con Dati Reali (`YV-mw9be3p2`)

| # | Metodo di Caricamento Dati | Come funziona nella pratica quotidiana di Gabriela | Campi Estratti / Controllati in Automatico |
| :--- | :--- | :--- | :--- |
| **1** | **Upload Fatture in PDF o Foto (Smartphone / Scanner) con Estrazione Automatica OCR/AI** | Gabriela trascina un PDF o scatta una foto da telefono a una fattura cartacea/scontrino/preventivo. Il parser OCR/AI legge il documento e precompila la scheda in 2 secondi. | Ragione Sociale Fornitore, P.IVA/CF, N° e Data Fattura, Imponibile, Aliquota IVA, Totale €, IBAN beneficiario, Data Scadenza e proposta automatica di Piano (`1–4`) e Unità. |
| **2** | **Importazione Estratti Conto Bancari (`CSV / Excel / CBI / CAMT.053`)** | Gabriela carica il file movimenti scaricato da **Intesa Sanpaolo** o **CREDEM**. Il motore confronta importi, date e causali con le fatture aperte e i payout attesi. | Data contabile/valuta, Importo (`+/-`), Ordinante/Beneficiario, Causale, CRO/TRN. Propone la **riconciliazione in 1 clic** (verde = match esatto; giallo = da confermare). |
| **3** | **Connessione Diretta Fatturazione Elettronica SDI (`XML FatturaPA`) & Banca** | Le fatture elettroniche `XML / XML.P7M` provenienti dal Cassetto Fiscale / Intermediario SDI entrano automaticamente nella coda *"Fatture da Validare — Gabriela"*. | Intero tracciato `FatturaPA v1.2.2`, linee di dettaglio, codici articolo, ritenute d'acconto, cassa previdenziale, riepilogo IVA e scadenze `MP05` (bonifico). |
| **4** | **Registrazione Manuale Rapida da Form 1-Tap** | Per piccole spese di cassa, rimborsi chilometrici, ricevute collaboratori o rettifiche, Gabriela usa il form rapido con autocompletamento fornitori e calcolo IVA istantaneo. | Tipo movimento (`Entrata / Uscita / Giroconto`), Piano di competenza (`Piano 1..4`), Centro di costo / Unità / Cantiere, Metodo di pagamento, allegato giustificativo. |
| **5** | **Caricamento Massivo Dati Storici (`CSV / Excel Multi-Foglio`)** | Per caricare lo storico dei mesi/anni precedenti o i prospetti del commercialista, Gabriela importa un unico file `.xlsx` o `.csv` mappato sulle colonne standard del gruppo. | Storico fatture attive/passive, saldi iniziali banche, storico SAL cantieri Toscan, storico rendiconti ARM ultimi 3+ mesi (con test automatico di quadratura `Task #80`). |

---

## 3. Il Processo di Validazione in 4 Passi Gestito da Gabriela

1. **Passo 1 — Controllo Formale & Blocco Anti-Duplicato Automatico (`Task #72`):**
   - Appena una fattura entra (da XML SDI, PDF/Foto OCR o form manuale), il sistema esegue `checkSupplierInvoiceDuplicate(fornitore, numeroFattura, anno)`. Se esiste già, mostra un **avviso rosso bloccante** prima di creare doppi pagamenti.
2. **Passo 2 — Ripartizione Contabile per Piano (`1–4`) e Centro di Costo / Unità (`Task #21, #25`):**
   - Gabriela assegna (o conferma il suggerimento automatico) il movimento a uno dei **4 Piani della Palazzina** (`Piano 1 · Toscan Costruzioni`, `Piano 2 · PBA`, `Piano 3 · SmartsBookings`, `Piano 4 · Itassistance` o costi generali `Holding`) e alla specifica **Unità Immobiliare / Cantiere / Sede legale Via Matteo Palmieri 20R, Firenze (o Magazzino SOLO uso interno operativo Via dell'Agnolo 72R, Firenze)**, definendo anche se il costo è **A Carico Società (80% interno)** o **Pass-Through Proprietario (ARM)**.
3. **Passo 3 — Approvazione Operativa & Soglie di Spesa (`Task #25, #76, #87`):**
   - Le bill dei fornitori operativi richiedono il visto `"Servizio Eseguito OK"` del Property Manager / Direttore Lavori.
   - Soglie di sicurezza: fino a **`500,00 €`** approvabili dal Manager/Gabriela; oltre **`500,00 €`** richiedono il visto del Titolare (**Julian**) o del Proprietario (se spesa straordinaria a suo carico).
4. **Passo 4 — Scadenziario Pagamenti, Riconciliazione & Pacchetto Commercialista (`Task #26, #29, #69, #71`):**
   - La To-Do Pagamenti di Gabriela ordina le uscite per urgenza (**Scadute in rosso in cima**, **In scadenza oggi**, **Entro 7 giorni**) con il **Totale da saldare nella settimana** sempre in evidenza.
   - Quando Gabriela clicca `"Segna come saldata"` (o importa il CSV bancario), allega la contabile CRO, sposta la voce in `"Fatte oggi"` e alimenta il **Pacchetto Mensile 1-Clic per il Commercialista** (ZIP/CSV con XML SDI, prima nota riconciliata e riepilogo IVA).

---

## 4. Come si Ripartisce l'Informazione Contabile tra i 4 Piani della Palazzina Holding

| Piano della Palazzina | Entrate (Fatture Attive & Incassi) Gestite da Gabriela | Uscite (Fatture Passive, Costi & Payout) Gestite da Gabriela | Regola di Separazione & Quadratura |
| :--- | :--- | :--- | :--- |
| **Piano 1 · `TOSCAN COSTRUZIONI`** | Fatture attive sui **5 SAL contrattuali** (`15% avvio, 25% strutture, 25% impianti, 25% finiture, 10% collaudo`) e quote **Masterclass 150 €** (scalate dal 1° SAL). | Fatture fornitori edili, materiali, subappaltatori (con verifica **DURC/Cassa Edile** obbligatoria prima dello sblocco pagamento). | Contabilità analitica per **Singolo Cantiere / Commessa** con margine operativo in tempo reale. |
| **Piano 2 · `PBA – PALAZZO BY BLUE ARROYO`** | Fatturazione B2B dei **turnover pulizie (`da 33 €`)**, lavanderia industriale 90°C e **Fattura Unica Cumulativa SDI** verso Property Manager e verso il Piano 4 (`Itassitance`). | Compensi squadra *Blue Arroyisti*, lavanderia, acquisto kit cortesia bio/spugne sigillate e affitti/utenze del **Magazzino di Via dell'Agnolo 72R, Firenze (SOLO uso interno operativo e non pubblico)** e della **Sede legale `Blue Arroyo S.r.l.` in Via Matteo Palmieri 20R, Firenze**. | Riconciliazione automatica tra **turni chiusi entro le 15:00 con 4 foto SHA-256** e bozza fattura mensile (`Task #29, #69`). |
| **Piano 3 · `SMARTSBOOKINGS.COM`** | Incassi diretti Stripe sulle prenotazioni a **0% commissioni OTA**, vendite **Empty Legs (dopo le 18:00)**, **Deposito Bagagli 20 €** ed Esperienze. | **Payout 85%** bonificato al Partner/Proprietario **entro le ore 12:00 del giorno di check-out** + restituzione **15% Cashback all'ospite a 48h** dal check-out (conto custodia CREDEM). | Separazione tra incasso lordo, fee viva Stripe (`1,5% + 0,25 €`), quota `85% Partner` e conto vincolato `15% Custodia/Cashback`. |
| **Piano 4 · `ITASSITANCE`** | Fatture attive **Canone Fisso Mensile Price Lock (`99–299 €`)**, **Commissione `+10%` Revenue Team** (solo per chi ha il servizio attivo) e interventi extra (`20 €` check-in, `30 €` manutenzione). | Pagamento fatture fornitori pass-through, compensi collaboratori P.IVA a prestazione (`Task #27`), versamento **Imposta di Soggiorno** e **Bonifico Saldo Netto ARM** ai Proprietari. | **Conti Proprietari rigorosamente separati (`Task #26`)** dal conto operativo Itassitance; formula ARM automatica (`Lordo − Comm. Canale − Variabili Pass-Through − 10% se attivo − Fisso`). |

---

## 5. Piano di Rilascio Operativo per Approvazione di Julian
1. **Fase A (Immediata — Già pronta nel codice):** attivazione del profilo **`Gabriela — Amministrazione & Contabilità Holding`** con accesso unificato a Scadenziario Fornitori, Fatture Attive/Passive SDI, Preventivi Extra e Rendiconti ARM dei 4 Piani.
2. **Fase B (Operativa):** abilitazione dei **5 canali di caricamento** (Upload PDF/Foto OCR, Import CSV Banca Intesa/CREDEM, XML FatturaPA SDI, Form Manuale 1-Tap, Import Storico Excel) con validazione anti-duplicato.
3. **Fase C (Chiusura Mensile):** generazione automatica il giorno **1 e 5 di ogni mese** dei Rendiconti ARM Proprietari, dei Consuntivi Intercompany (`PBA ↔ Itassitance`, `SmartsBookings ↔ Itassitance`, `Toscan ↔ Itassitance`) e del **Pacchetto Unico Commercialista**.
