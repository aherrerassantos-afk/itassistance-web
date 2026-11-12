# Ordini Operativi — Agente 4 (`agente-4` / `a5-commerciale` + `a2-frontend`) · Piano 4 · Itassistance
**Ruolo Responsabile:** Prezzi, Inbox Proprietario (20% vs 80%) e Modello di Business (Prezzi verso i canali, Inbox 20%, Separazione 80% interno, Prezzo dinamico, Misurazione dell'automazione)

## Task Assegnate dalla `Checklist 100`
- **Task #1, #12, #13:** **Modello Economico Ufficiale & Prezzo Dinamico d'Acquisizione** — canone fisso mensile **99–299 €** bloccato all'acquisto (**Price Lock**), opzione **+10%** applicata **SOLO** con attivazione del **Revenue Team**, costi variabili **pass-through** trasparenti, **nessuna commissione sull'ospite**.
- **Task #41, #42, #45:** **Separazione Rigorosa 80% Interno vs 20% Inbox Proprietario** — filtro lato server/stato che nasconde al proprietario l'80% del lavoro operativo interno del team `itassistance` e mostra nell'Inbox Proprietario solo il **20%** ad alto valore (Riepilogo delle `08:00`, approvazioni richieste, rendiconti e conferme).
- **Task #52, #53, #56, #57, #58:** **Prezzi verso i Canali OTA & Guardrail** — pubblicazione listini differenziati per canale con compensazione commissioni OTA, vincolo matematico tra `Floor Minimo` e `Cap Massimo`, sblocco notti orfane e sincronizzazione listino CSV/iCal.
- **Task #89, #95:** **Misurazione dell'Automazione (`L1 -> L4`)** — telemetria dei clic risparmiati (Piano degli Input), percentuale di task chiuse in autonomia dal sistema e certificazione del rendimento `> +8%` per lo sblocco del grado `L3`.
- **Task `#2–5, #10–11, #14–16, #32, #35, #38, #51, #60, #97, #100` (Completate in Ciclo 2):** Modello economico completo (`docs/modello-economico.md`), Contratti e Posizionamento/CRM (`docs/contratti-e-accordi-legali.md`, `docs/commerciale-e-posizionamento.md`), Console Unica RBAC, Sicurezza 2FA e Piano Capacità `> 80%` (`docs/collaudo-dec16-e-operativita.md`).

## Regole di Esecuzione
1. Lavora sul branch `agente-4` (`Piano 4 · Itassistance`) e rispetta `.agents/rules/00-coordinamento.md`.
2. Non prendere task fuori da `1, 12, 13, 41, 42, 45, 52, 53, 56, 57, 58, 89, 95` senza conferma di Julian.
3. Su file condivisi (`site-config.js`, `cloud-sync.js`, `app.html`, `admin.html`), applica solo modifiche additive e segnala `CONDIVISO: <file>`.
4. A fine sessione esegui `/report` salvando l'esito in `coordinamento/inbox-manager.md`.
5. **[Task #102 · Trasloco Admin Centrale 2FA `/amministrazione`]:** trasmetti in modalità solo additiva i nuovi contratti attivi Price Lock `99–299 €/mese` e il riepilogo MRR/Garanzia 14gg verso `http://localhost:3000/api/amministrazione/company-input` (`azienda_id: 'itassitance'`).

---

## Report Esecuzione `JUL-009 (REGOLA ZERO – SOLO INFO VERA)` — Peso 20%

1. **Numerazione ufficiale ripristinata:** `Piano 1 Toscan Costruzioni`, `Piano 2 PBA`, `Piano 3 SmartsBookings`, `Piano 4 Itassistance`.
2. **Unico riferimento societario e di indirizzo ammesso sui file pubblici (`site-config.js`, `index.html`, `prezzi.html`, `checkout.html`, `contratto.html`, `benvenuto.html`, `ospiti.html`):**
   - `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze`
   - Dati tecnici verificati: `P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: [DA CONFERMARE] · Capitale sociale: [DA CONFERMARE]`.
3. **Verifica assenza `Corridoni` / `Via Filippo Corridoni 76`:** 0 occorrenze in tutti i file di competenza.

### Tabella `"Rimosso / Dove (file + riga) / Perché"`

| Rimosso | Dove (file + riga) | Perché |
|---|---|---|
| `officeAddress: 'Via Matteo Palmieri 20R, 50122 Firenze'`, `warehouseAddress: 'Via dell\'Agnolo 72R, Firenze'` e `Magazzino: Via dell'Agnolo 72R, Firenze` in `SITE_CONFIG.legal` | `site-config.js` (righe 114–126) | `Via dell'Agnolo 72R` è solo per uso interno; sui file pubblici è ammessa esclusivamente la dicitura `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze` + dati tecnici verificati. |
| `bankIban: 'IT60X0306902887100000007480'`, `bankName: 'Intesa Sanpaolo · Filiale Imprese Firenze Centro (Via Bufalini 4, 50122 Firenze)'`, `bankSwiftBic: 'BCITITMM'` | `site-config.js` (righe 154–160 e 579–585) | Coordinate bancarie di esempio non confermate da Julian: sostituite con `[DA CONFERMARE]`. |
| `REAL_LOGISTICS_TAG = 'Magazzino Via dell\'Agnolo 72R, Firenze · Ufficio Via Matteo Palmieri 20R, 50122 Firenze'` + voce `Via dell'Agnolo 72R` in `FLORENCE_STRADARIO_DB` + `3 Hub ZTL` (`Hub 1 Oltrarno`, `Hub 2 Santa Croce`, `Hub 3 SMN`) | `site-config.js` (righe 1335–1390 e 1622–1635) | Rimossi i 3 Hub ZTL inesistenti e rimosso il riferimento pubblico al magazzino interno; impostato `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze`. |
| `Sedi a Firenze: Ufficio Via Matteo Palmieri 20R · Magazzino Via dell'Agnolo 72R` e didascalia `Magazzino operativo in Via dell'Agnolo 72R, Firenze` | `index.html` (righe 1139, 1161–1164, 1179–1180) | Rimosso riferimento pubblico al magazzino interno e alle sedi operative; sostituito con `Sede legale a Firenze: Via Matteo Palmieri 20R, Firenze` e `Piano 4 · Itassistance`. |
| Numerazione invertita (`2. Lo protegge itassistance`, `3. Lo allestisce Blue Arroyo Cleaning`, `4. Lo riempie di turisti Smartbookings`) e menzione `partenza e rientro dal Magazzino di Via dell'Agnolo 72R` | `index.html` (righe 1388–1428) | Ripristinata numerazione ufficiale (`Piano 1 Toscan Costruzioni`, `Piano 2 PBA`, `Piano 3 SmartsBookings`, `Piano 4 Itassistance`) e rimossa menzione pubblica del magazzino interno. |
| Footer `Ufficio: Via Matteo Palmieri 20R, 50122 Firenze (FI) · Magazzino: Via dell'Agnolo 72R, Firenze` | `index.html` (righe 1639–1641, 1680–1682) | Sostituito con `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: [DA CONFERMARE] · Capitale sociale: [DA CONFERMARE]`. |
| Footer `Ufficio: Via Matteo Palmieri 20R, 50122 Firenze (FI) · Magazzino: Via dell'Agnolo 72R, Firenze` | `prezzi.html` (riga 276) | Sostituito con la dicitura societaria ufficiale e i dati tecnici verificati. |
| Footer `Ufficio: Via Matteo Palmieri 20R, 50122 Firenze (FI) · Magazzino: Via dell'Agnolo 72R, Firenze` | `checkout.html` (riga 605) | Sostituito con la dicitura societaria ufficiale e i dati tecnici verificati. |
| `con ufficio in Via Matteo Palmieri 20R, 50122 Firenze (FI) e magazzino in Via dell'Agnolo 72R, Firenze` e `PEC bluearroyosrl@pec.it` | `contratto.html` (righe 234, 243, 361) | Rimosso riferimento pubblico al magazzino e marcata la PEC non confermata come `[DA CONFERMARE]`. |
| `IBAN: IT60X0306902887100000007480` e `Ufficio: Via Matteo Palmieri 20R... · Magazzino: Via dell'Agnolo 72R` (box bonifico, footer, PDF ricevuta) | `benvenuto.html` (righe 387–391, 484, 547, 562, 641–643) | Rimosso riferimento pubblico al magazzino e marcato l'IBAN di esempio con `[DA CONFERMARE]`. |
| Footer `Ufficio: Via Matteo Palmieri 20R, 50122 Firenze (FI) · Magazzino: Via dell'Agnolo 72R, Firenze` | `ospiti.html` (riga 471) | Sostituito con `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: [DA CONFERMARE] · Capitale sociale: [DA CONFERMARE]`. |

### Elenco dei campi marcati `[DA CONFERMARE]`
- **PEC societaria (`PEC: [DA CONFERMARE]`):** in `site-config.js` (`SITE_CONFIG.legal.pec` e `footerLine`), `index.html` (footer), `prezzi.html` (footer), `checkout.html` (footer), `contratto.html` (epigrafe Parti art. 1 e art. 17 Comunicazioni), `benvenuto.html` (footer e PDF ricevuta), `ospiti.html` (footer).
- **Capitale sociale (`Capitale sociale: [DA CONFERMARE]`):** in `site-config.js` (`SITE_CONFIG.legal.shareCapital` e `footerLine`), `index.html` (footer), `prezzi.html` (footer), `checkout.html` (footer), `contratto.html` (epigrafe Parti), `benvenuto.html` (footer e PDF ricevuta), `ospiti.html` (footer).
- **Coordinate bancarie (`bankIban`, `bankName`, `bankSwiftBic`: `[DA CONFERMARE]`):** in `site-config.js` (`SITE_CONFIG.payments` e `getBankTransferDetails`) e `benvenuto.html` (`#w-bonifico-iban` e fallback JS).


---

## Aggiornamento `JUL-010 — SKILL TICKET MANUTENZIONI & NETWORK MANUTENTORI` (Peso 15% · Completato 100%)

- **Ruolo:** `agente-4` (Spec Regia Admin, Contabilità & Pagine Pubbliche/Legali).
- **File modificati:** `admin.html`, `coordinamento/agente-4.md` (senza toccare `app.html` né `cloud-sync.js`).
- **Pannello Regia Operativa (`#adm-overview` -> `#adm-maint-skill-network-panel`) e Mirror Tab 4 (`#adm-fornitori` -> `#adm-fornitori-maint-skill-mirror`):**
  1. **Creazione e Modifica Ticket da Front Desk / Supporto PM:** form completo (`#adm-maint-skill-form`) con *Compito da realizzare*, *Foto allegate*, *Data e Ora richiesta* (es. `Giovedì ore 09:30` + slot ISO per verifica Planner), *Zona / Riferimento Operativo*, *Tariffa Base Proprietario* (`30,00 €` standard o superiore per difficoltà) e *Supplemento Disponibilità Immediata (`+ €`)*.
  2. **3 Code & Planner in Tempo Reale:**
     - **Interventi Richiesti (`#adm-maint-list-requested`):** ticket in attesa di presa in carico da parte di un manutentore, con stato notifica alla rete e pulsante di assegnazione/accettazione nel Planner.
     - **Planner Manutentori Attivo (`#adm-maint-list-planner`):** verifica automatica slot `60 min + 15 min buffer` pre/post intervento (`admCheckPlannerBufferConflict`) per impedire sovrapposizioni sulla stessa risorsa, modifica ticket in qualsiasi momento e completamento intervento con inserimento *Rimborso materiali usati (€)*.
     - **Jobs Realizzati & Contabilità Automatica (`#adm-maint-list-completed`):** mostra **Importo Maturato Mese Corrente Manutentori (su fattura)** (`15,00 €` base + `+ € X,XX Extra per l'intervento` + `Rimborso materiali €`), pulsante **"🔄 Esegui Liquidazione Mensile Fattura (Azzera Contatore Mese)"** (`admLiquidateMaintainerMonth`) e **Addebito Automatico su Conto Proprietario** (`30,00 €` base + supplemento + materiali).
  3. **Privacy Incrociata & Regola Segreta:**
     - Badge visibile in regia: *"🔒 Privacy Incrociata Attiva: il Manutentore non vede mai il profilo/prezzo del Proprietario · il Proprietario non vede mai il profilo/compenso del Manutentore"*.
     - Calcolo interno dell'extra manutentore tramite moltiplicatore `* 0.5` in `admComputeTicketEconomics`, con **zero riferimenti a percentuali (`50%`, `50/50`, `percentuale`) nell'interfaccia o nel testo HTML/JS**.
     - Integrazione diretta con i metodi di `window.ITACloudSync` (`getMaintenanceNetworkTicketsForRole`, `createOrUpdateMaintenanceSkillTicket`, `acceptMaintenanceJobByMaintainer`, `completeMaintenanceJobByMaintainer`, `liquidateAndResetMaintainerMonthlyCounter`) e fallback autonomo sincronizzato.


---

## Aggiornamento `JUL-011 — GENERATORE CONTRATTO PRODUZIONE CONTENUTI & LIBERATORIA IMMOBILE IN CONTRATTO.HTML` (Peso 35% · Completato 100%)

- **Ruolo:** `agente-4` (Spec Regia Admin, Contabilità & Pagine Pubbliche/Legali).
- **File modificati:** `contratto.html`, `coordinamento/agente-4.md`.
- **Implementazione in `contratto.html`:**
  1. **Selettore Modello Contrattuale (`#contract-model-tabs`):**
     - **Tab 1 (`#tab-btn-owner` → `#contract-owner-service-section`):** `🏠 1. Contratto di Servizio Proprietario (Gestione & Price Lock)` — preservato integralmente al 100%.
     - **Tab 2 (`#tab-btn-creator` → `#contract-creator-release-section`):** `🎬 2. Contratto Produzione Contenuti & Liberatoria Immobile (Creator / Marketing · JUL-011)` — attivabile anche tramite parametri URL `?type=creator` o `?model=produzione-contenuti` (con precompilazione opzionale di `?unit=`, `?immobile=`, `?creator=`, `?slot=`).
  2. **Generatore Interattivo e Pannello di Compilazione Rapida (`#creator-quick-form-panel`):**
     - Qualifica contrattuale della controparte: selettore tra `Professionista / Creator autonomo (Contratto d'opera ex art. 2222 c.c.)` e `Agenzia / Impresa di produzione (Appalto di servizi ex art. 1655 c.c.)`.
     - Campi con segnaposto conformi a **Regola Zero** (`[DA COMPILARE]` / `[DA CONFERMARE]`): Nome/Ragione Sociale Creator, C.F., P.IVA, Indirizzo/Sede, Email/PEC, Proprietario (con Scudo Privacy), Codice Unità (`[es. ST-APT-... / DA COMPILARE]`), Indirizzo Immobile, Data e Fascia Oraria Autorizzata, Referente Presidio, Tipologia Accordo Economico (`Opzione A — Corrispettivo monetario (€ [DA CONFERMARE])`, `Opzione B — Collaborazione promozionale / Scambio visibilità`, `Opzione C — Licenza gratuita in mandato commerciale`), Regime Licenza (`Non esclusiva` / `Esclusiva`), Deliverable (N° foto HD, N° video/reel 9:16, N° video 16:9, giorni di consegna), Attrezzature autorizzate ed Elenco nominativo Troupe/Modelli.
     - Dati societari verificati `Blue Arroyo S.r.l.`: `Sede legale: Via Matteo Palmieri 20R, Firenze · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: [DA CONFERMARE] · Capitale sociale: [DA CONFERMARE]`.
  3. **Testo Legale Integrale Visibile e Stampabile (`#creator-legal-printable-doc`):**
     - **Nota Legale Preliminare di Inquadramento** (art. 2222 c.c. vs art. 1655 c.c., contratto atipico misto ex art. 1322 c.c., *Location/Property Release*, L. 633/1941 artt. 2, 12-bis, 87–92, 96–97, art. 10 c.c., GDPR Reg. UE 2016/679 e D.Lgs. 196/2003).
     - **Articoli 1–14 integrali:** Art. 1 (Premesse, Allegati e Definizioni), Art. 2 (Oggetto), Art. 3 (Modalità, Orari e Regole di Accesso – Location Release, Custodia e Divieti di Sicurezza), Art. 4 (Responsabilità per Danni ex artt. 2043, 2049, 2051 c.c., Manleva e Polizza RCT), Art. 5 (Titolarità dei Diritti e Licenza d'Uso Commerciale L. 633/1941 su web, OTA, social, ADV), Art. 6 (Regole di Pubblicazione per il Creator, Approvazione Preventiva e Divieto Geolocalizzazione Civico), Art. 7 (Liberatoria Immagine Modelli e Troupe ex artt. 10 c.c. e 96–97 L. 633/1941), Art. 8 (Termini di Consegna e Standard Tecnici), Art. 9 (Corrispettivo o Accordo di Collaborazione – Opzioni A/B/C), Art. 10 (Obbligo di Riservatezza / NDA e Scudo Privacy Proprietario), Art. 11 (Trattamento Dati Personali GDPR e D.Lgs. 196/2003), Art. 12 (Clausola Risolutiva Espressa ex art. 1456 c.c. e Rimozione entro 12 ore), Art. 13 (Legge Applicabile e Foro Esclusivo di Firenze), Art. 14 (Disposizioni Finali).
     - **Sezione 1 — Sottoscrizione Generale delle Parti** (`Blue Arroyo S.r.l.`, `Proprietario [se applicabile]`, `Creator / Produttore`).
     - **Sezione 2 — Doppia Sottoscrizione Specifica delle Clausole Vessatorie ex artt. 1341 e 1342 c.c.** (Artt. 3, 4, 5, 6, 7, 10, 12, 13).
     - **Allegato A** (Scheda Tecnica dell'Immobile, Finestra di Accesso, Attrezzature Autorizzate e Deliverable) e **Allegato B** (Elenco Nominativo Troupe, Collaboratori e Modelli Autorizzati all'Accesso + Liberatoria Ritratto/Immagine).
  4. **Bottoni Azione & Persistenza:**
     - `🖨️ Stampa / Salva PDF Contratto Produzione Contenuti & Liberatoria Immobile` (`#btn-print-creator-contract`, `window.print()` con regole `@media print` dedicate).
     - `✍️ Registra Firma Digitale Contratto Creator` (`#btn-sign-creator-contract`, con timestamp `Europe/Rome` e salvataggio in `localStorage` `'ita_creator_contracts_v1'`).


---

## Aggiornamento `JUL-012 — FORM 4 BLOCCHI CON TARIFFARIO & DATI CLIENTE + DOWNLOAD PDF DIRETTO IN CONTRATTO.HTML, INDEX.HTML E PREZZI.HTML` (Peso 35% · Completato 100%)

- **Ruolo:** `agente-4` (Spec Regia Admin, Contabilità & Pagine Pubbliche/Legali).
- **File modificati:** `contratto.html`, `index.html`, `prezzi.html`, `coordinamento/agente-4.md`.
- **1. Form 4 Blocchi con Tariffario, Dati Cliente & Download `.pdf` in `contratto.html` (`#contract-creator-release-section`):**
  - Inclusi script `pdfmake.min.js` e `vfs_fonts.min.js` + generatore binario nativo `%PDF-1.4` (`buildRawPdf14Bytes`) in `window.downloadCompiledCreatorContractPdf()` per garantire il download immediato del file `Contratto_Produzione_Contenuti_Itassistance_Compilato.pdf` con 1 clic in qualsiasi browser/condizione.
  - **BLOCCO A — Dati Cliente (Proprietario o Gestore Autorizzato Airbnb) & Immobile:** `#cr-client-name`, `#cr-client-tax`, `#cr-client-address`, `#cr-client-contact`, `#cr-client-role`, `#cr-prop-address`, `#cr-prop-name`, `#cr-prop-cin`, `#cr-access-duration`, `#cr-slot`, `#cr-license-duration` (`Illimitata / Indefinita` o `[DURATA]`), `#cr-referente`.
  - **BLOCCO B — Dati Professionista (Content Creator / Fotografo / Videomaker / Marketing):** `#cr-legal-type` (`Contratto d'opera ex art. 2222 c.c.` vs `Appalto di servizi ex art. 1655 c.c.`), `#cr-name`, `#cr-cf`, `#cr-piva`, `#cr-addr`, `#cr-email`, `#cr-phone`, deliverable (`#cr-deliv-foto`, `#cr-deliv-reel`, `#cr-deliv-video169`, `#cr-deliv-giorni`), `#cr-attrezzature`, `#cr-troupe-list`.
  - **BLOCCO C — Tariffario & Condizioni Economiche (Selezionabile e Compilabile):**
    - Selettore Modalità Collaborazione (`#cr-collab-mode`: `1. Collaborazione Gratuita`, `2. Collaborazione Retribuita (Tariffario)`, `3. Scambio di Servizi / Permuta`).
    - 4 Preset 1-Clic Tariffe Ufficiali Itassistance (`#cr-preset-1..4`: `Abbonamento App Itassistance: 99,00 € / mese (o 1.188,00 € / anno Price Lock)`, `Extra Revenue Management & Adempimenti: +10% (opzionale)`, `Check-in in presenza a Firenze: 20,00 € / intervento`, `Piccola manutenzione ordinaria: 30,00 € / intervento`).
    - Tabella Voci Tariffario Produzione Contenuti / Shooting & Marketing (`#cr-tar-1-amt`, `#cr-tar-2-amt`, `#cr-tar-3-amt`, `#cr-tar-4-desc` + `#cr-tar-4-amt`).
    - Calcolo automatico del Totale Tariffario (`#cr-tariff-total-lbl`), selettore Regime Fiscale (`#cr-tax-regime`), IBAN (`#cr-iban`), Termini di pagamento (`#cr-pay-terms`) e Regime Licenza (`#cr-licenza-regime`).
  - **BLOCCO D — Scarica Contratto in Formato PDF (`.pdf` diretto + Modello in Bianco + Stampa):**
    - `📥 Scarica Contratto Compilato in PDF (.pdf)` (`#btn-download-compiled-pdf` / `#btn-download-compiled-pdf-bottom`)
    - `📄 Scarica Modello Contratto PDF in Bianco (.pdf)` (`href="/contratti/contratto-produzione-contenuti-itassistance.pdf" download="Contratto_Produzione_Contenuti_Itassistance.pdf"`)
    - `🖨️ Stampa / Salva PDF Nativo` (`#btn-print-creator-contract-top` / `#btn-print-creator-contract`).
- **2. Sezione/Card Pubblica in `index.html` e `prezzi.html`:**
  - Inserita la card `📄 Contratto & Form Tariffario / Dati Cliente (Scaricabile in PDF · JUL-012)` (`#index-contract-tariff-pdf-card` e `#prezzi-contract-tariff-pdf-card`) con i bottoni `📝 Compila Form Dati Cliente & Tariffario + Scarica PDF` (`href="/contratto.html?type=creator"`) e `📥 Scarica Direttamente Contratto PDF (.pdf)` (`href="/contratti/contratto-produzione-contenuti-itassistance.pdf" download="Contratto_Produzione_Contenuti_Itassistance.pdf"`).
