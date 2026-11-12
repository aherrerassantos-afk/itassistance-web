# Ordini Operativi — Agente 2 (`agente-2` / `a7-revenue-frontdesk` + `a1-backend`)
**Ruolo Responsabile:** Onboarding e Struttura (Wizard primo accesso, Anagrafiche, Canali, Migrazione clienti)

## Task Assegnate dalla `Checklist 100` + Nuove Proposte (`101+`)
- **Task #17:** **Wizard di Primo Accesso** guidato in 4 passi (`benvenuto.html` e `app.html?view=onboarding`) con salvataggio progressivo sul server e ripresa dal punto interrotto.
- **Task #37:** **Anagrafica Struttura Ricettiva** completa (tipo struttura, ragione sociale, P.IVA/CF, indirizzo, CIN, CIR, credenziali Alloggiati Web/ISTAT, tassa di soggiorno, orari check-in/out, lingue IT/EN, fuso `Europe/Rome`, valuta `EUR`).
- **Task #44:** **Schede Unità / Camere** (una per unità, duplicabile in 1 clic, dotazioni, foto, codici chiave/portone/keybox, collegamento turni ed etichette `2. PBA – Palazzo by Blue Arroyo`).
- **Task #54:** Configurazione **Motore di Prenotazione Diretta (`3. SmartsBookings.com`)** (0% commissioni OTA sull'ospite, payout 85% entro le ore 12:00 del check-out).
- **Task #55:** Collegamento e sincronizzazione **Canali OTA** (Airbnb, Booking.com, Vrbo via iCal `.ics` con blocco anti-overbooking).
- **Task #61:** Attivazione **Regole Revenue Automatico** nel Wizard (tariffa base, guardrail Floor/Cap, grado di autonomia `L1–L3`, sblocco notti orfane).
- **Task #92:** **Migrazione Clienti** e importazione rapida portafoglio / prenotazioni storiche (incluso subentro 1-tap da `1. Toscan Costruzioni`).
- **Task #101 (`[PROPOSTA Agente 2]` — Approvata definitivamente da Julian con `DEC-01`):** **Autocompletamento Indirizzo Google Maps** (`#ob-s-address` e `#f-addr`) con **riempimento automatico delle altre colonne del form** (`CAP`, `Comune`, `Provincia`, `Quartiere/ZTL`, `Imposta di soggiorno`, `Prefissi CIN/CIR/ISTAT/Alloggiati`, `Fuso orario`, `Valuta` e collegamento al **Magazzino Operativo & Biancheria PBA** `Via dell'Agnolo 72R, Firenze` + **Ufficio Blue Arroyo Srl** `Via Matteo Palmieri 20R, 50122 Firenze`).
- **Direttiva `JUL-007 P1 · DATI VERITIERI SULLE SEDI` (Completata su `app.html` e `admin.html`):**
  1. Rimossi integralmente tutti i riferimenti ai falsi "3 Hub ZTL" (`Hub 1 Oltrarno`, `Hub 2 Santa Croce`, `Hub 3 SMN Centro`, `3 Hub ZTL Firenze`, `3 hub logistici ZTL`) da `app.html` e `admin.html`.
  2. Allineate ovunque le uniche due sedi reali del gruppo:
     - **Ufficio Blue Arroyo Srl:** `Via Matteo Palmieri 20R, 50122 Firenze`
     - **Magazzino Operativo & Biancheria PBA:** `Via dell'Agnolo 72R, Firenze` (da cui partono e rientrano tutti i turni PBA e la biancheria)
  3. Aggiornati in `app.html` il campo `#ob-s-district`, l'autocompletamento CAP (`50122`, `50123`, `50125`), l'etichetta `#u-ba-tag-0` / `#u-hook-0` nel Wizard di Onboarding, i riepiloghi operativi PBA e la scheda Cross-CRM ARM, mantenendo invariati i quartieri degli alloggi dei proprietari.
  4. Aggiornati in `admin.html` la Mappa Ecosistema (`3. Blue Arroyo Cleaning`), l'anagrafica fornitore `s0`/`s4` (con sanificazione automatica in `loadAdminState()`), i dati fiscali/NAP e la scheda Cross-CRM PBA.
- **Collaudo Live `DEC-16` (`Ciclo 1-4-2-3` — Completato in Ciclo 2):**
  1. **Subentro 1-Tap & Check-in Remoto Domotica (`Toscan Costruzioni → Itassitance`, Task `#91, #92` ↔ Toscan `#66, #85`)**;
  2. **Feed Alloggi e Calendari iCal su porta dedicata `SOURCE_ITASSITANCE` (`DEC-04`) + Payout `85%` ore `12:00` + Cashback `15%` a `48h` (`Itassitance ↔ SmartsBookings.com`, Task `#54, #55, #61` ↔ SB `#58`)**;
  3. **Task `#43, #48, #68, #82, #96`:** Form Ticket App Proprietario, Archivio Documenti, Barcode Chiavi e NPS Proprietari (`cloud-sync.js`, `docs/collaudo-dec16-e-operativita.md`).

## Regole di Esecuzione
1. Lavora sul branch `agente-2` e rispetta `.agents/rules/00-coordinamento.md`.
2. Non prendere task non assegnate senza conferma di Julian.
3. Su file condivisi (`app.html`, `site-config.js`, `cloud-sync.js`), applica solo modifiche additive e segnala `CONDIVISO: <file>`.
4. A fine sessione esegui `/report` salvando l'esito in `coordinamento/inbox-manager.md`.
5. **[Task #102 · Trasloco Admin Centrale 2FA `/amministrazione`]:** invia in modalità solo additiva il report canali OTA/Diretto SmartsBookings e la quota opzionale `+10% Revenue Team` verso `http://localhost:3000/api/amministrazione/company-input` (`azienda_id: 'itassitance'`).

---

## Esecuzione ORDINE ESECUTIVO MASTER `JUL-009` (REGOLA ZERO – SOLO INFO VERA)
- **Numerazione ufficiale ripristinata:** `Piano 1 Toscan Costruzioni`, `Piano 2 PBA`, `Piano 3 SmartsBookings`, `Piano 4 Itassistance`.
- **BLOCCO 4 – ARM di Itassistance (`admin.html` `#adm-tab1-arm-palazzo-module`, `#adm-cross-crm-arm-panel` e `app.html` `#arm`, `#app-cross-crm-marco-hub`, `#app-fisco-arm-palazzo-card`):**
  - Badge consenso esplicito: `✅ Consenso Esplicito Preventivo Generale PBA: VERIFICATO` (`itassistanceRequested: true` · `itassistanceConsent: true`).
  - Regola tassativa e blocco JS (`renderAdminCrossCrmArmPanel` / `renderAppMarcoCrossCrmHub`): `🔒 Canale unico di ingresso: Preventivo Generale PBA con consenso esplicito Itassistance` (nessun inserimento manuale nell'ARM).
- **BLOCCO 1 & 2 – Dati Societari e Uso Interno Magazzino:**
  - In `app.html` (vista proprietari/clienti): rimosso ogni riferimento a `Via dell'Agnolo 72R`; esposto unicamente `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: [DA CONFERMARE] · Capitale sociale: [DA CONFERMARE]`.
  - In `admin.html` (uso interno): `Via dell'Agnolo 72R, Firenze` mantenuto esclusivamente marcato come `(Uso Interno Operativo)` e rimosso dal PDF fattura destinato a terzi e dalla scheda pubblica NAP.
  - Verificato `0` occorrenze di `Corridoni` / `Via Filippo Corridoni 76` in `app.html` e `admin.html`.

### Tabella Rimozioni e Rettifiche (`JUL-009`)
| Rimosso | Dove (file + riga) | Perché |
| :--- | :--- | :--- |
| Riferimenti `Magazzino: Via dell'Agnolo 72R` in vista cliente | `app.html` (righe `1000`, `1045`, `1526`, `2274`, `2562`, `4801-4802`, `4930-4954`, `5253-5255`) | `Via dell'Agnolo 72R` è a esclusivo uso interno operativo e non va esposto nella vista proprietari/clienti (`BLOCCO 2 JUL-009`). |
| Numerazione non allineata (`2. itassistance`, `3. Blue Arroyo Cleaning`, `4. SmartsBookings.com`) | `app.html` (righe `1265`, `1526-1545`, `2404`, `2428-2433`, `3604`, `4616-4684`, `5190`) e `admin.html` (righe `1130-1237`, `2298-2300`, `2456-2460`) | Ripristino numerazione ufficiale dei 4 Piani: `Piano 1 Toscan Costruzioni`, `Piano 2 PBA`, `Piano 3 SmartsBookings`, `Piano 4 Itassistance`. |
| `Magazzino PBA: Via dell'Agnolo 72R` nel PDF fattura e scheda pubblica NAP | `admin.html` (righe `1418-1430`, `3114-3117`) | Documenti destinati a terzi/pubblico devono riportare solo la Sede legale `Via Matteo Palmieri 20R, Firenze` e i dati societari ufficiali (`BLOCCO 1 & 2 JUL-009`). |
| Dicitura generica `"da Chat di Palazzo"` senza vincolo consenso esplicito | `app.html` (righe `877-915`, `1440-1458`, `5359-5370`) e `admin.html` (righe `820-835`, `1488-1505`, `3983-3995`) | L'ARM di Itassistance accetta esclusivamente lead provenienti dal Preventivo Generale PBA (`preventivo.html`) con consenso esplicito verificato (`itassistanceRequested: true` · `itassistanceConsent: true`) (`BLOCCO 4 JUL-009`). |

### Campi Ufficiali `[DA CONFERMARE]` (`BLOCCO 1 JUL-009`)
- **PEC Blue Arroyo S.r.l.:** `[DA CONFERMARE]`
- **Capitale sociale Blue Arroyo S.r.l.:** `[DA CONFERMARE]`

---

## Esecuzione ORDINE IMMEDIATO `JUL-010 — SKILL TICKET MANUTENZIONI & NETWORK MANUTENTORI` (`app.html`)
- **Modulo completo `#jul010-maintenance-skill-hub` in `#screen-home` + scorciatoia rapida `#servizi-jul010-shortcut-card` in `#screen-servizi`** con selettore rapido in 1 clic delle 3 prospettive:
  1. `👤 Vista Area Personale Cliente / Proprietario` (`role = 'owner'`)
  2. `🔧 Vista App Partner Manutentore (Bacheca, Planner 60m+15m & Jobs Realizzati)` (`role = 'maintainer'`)
  3. `🎧 Vista Team Itassistance (Front Desk / Supporto PM)` (`role = 'support'`)
- **Scheda Task Minimal ed Editabile:**
  - **1. Task / Job da fare:** pre-caricato con l'esempio reale (*"Sistemare 2 mensole del bagno che si sono staccate dal muro e fissare il gancio della finestra che si è staccato dalla vite"*) + zona operativa senza dati personali del proprietario, sempre modificabile dal Proprietario e dal Team Itassistance.
  - **2. Foto dell'intervento richiesto:** 2 foto SVG nitide pre-caricate (mensole bagno staccate dal muro e gancio finestra staccato dalla vite) + upload file da dispositivo (`FileReader`) o aggiunta tramite URL/didascalia.
  - **3. Ora e Data dell'intervento richiesto:** es. `Giovedì 12/11/2026 · ore 09:30`.
- **Regola Economica & Privacy Incrociata Assoluta (Zero Percentuali in UI):**
  - **Versante Proprietario:** tariffa standard `30,00 €` (adeguabile dal Supporto Itassistance per difficoltà) + opzione `"⚡ Disponibilità Immediata / Proponi Cifra Più Alta (+ €)"` + Riepilogo Addebiti Conto Proprietario (`Prezzo intervento cliente + materiali`). Profilo manutentore schermato.
  - **Versante Manutentore:** banner notifica `"Nuova Task Disponibile"`, contatore in alto `"Importo Maturato Mese Corrente (su fattura)"` con bottone `"🔄 Liquidazione Mensile Fattura (Azzera Contatore Mese)"`, Bacheca `"Interventi Richiesti"` con compenso base `15,00 €` + eventuale `+ € X,XX Extra per l'intervento` (calcolato internamente con `* 0.5`, senza mai scrivere `"50%"` o `"50/50"`) + rimborso spese materiali. Profilo proprietario schermato.
  - **Planner Manutentore (60 min + 15 min buffer) & Jobs Realizzati:** validazione anti-sovrapposizione automatica (`jul010CheckPlannerConflict`: durata `60 min` + `15 min` buffer prima e dopo), completamento task con inserimento rimborso materiali, spostamento in `"Jobs Realizzati"`, incremento del contatore mensile su fattura e addebito automatico sul conto del Proprietario.

---

## Esecuzione ORDINE IMMEDIATO `JUL-011 — RICHIAMO CONTRATTO PRODUZIONE CONTENUTI & LIBERATORIA IMMOBILE DA APP.HTML`
- Aggiunta in **`#screen-home` (`#jul011-home-creator-contract-card`)** e in **`#screen-servizi` (`#jul011-servizi-creator-contract-card`)** di `app.html` la card dedicata:
  - **`🎬 Contratto Produzione Contenuti & Liberatoria Immobile (Creator / Shooting · JUL-011)`**
  - Descrizione: *"Location Release & Licenza Commerciale L. 633/1941 (Art. 1–14 + Doppia Firma 1341–1342 c.c. + Allegati A/B) con tutela totale della privacy del Proprietario · Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze"*.
  - Bottoni rapidi:
    1. **`📝 Apri & Compila Contratto Produzione Contenuti (PDF / Firma)`** (`/contratto.html?type=creator`)
    2. **`🖨️ Stampa Rapida Modello Contratto Creator (PDF)`** (`openCreatorContractRapidPrintInApp()` -> richiama `ITACloudSync.openCreatorPropertyReleaseContractPrint()` con fallback su `/contratto.html?type=creator&print=1`).

---

## Esecuzione ORDINE IMMEDIATO `JUL-012 — FORM COMPILABILE CON TARIFFARIO E DATI CLIENTE + SCARICA CONTRATTO PDF DENTRO APP.HTML`
- Integrato direttamente dentro `#jul011-home-creator-contract-card` (in `#screen-home`) e collegato da `#jul011-servizi-creator-contract-card` (in `#screen-servizi`) il **Form Compilabile in 4 Blocchi con Tariffario e Download PDF (`.pdf`)**:
  - **BLOCCO A — Dati Cliente (Proprietario o Gestore Autorizzato Airbnb) & Immobile:** Nome/Ragione Sociale, C.F./P.IVA, Qualifica firmatario (`Proprietario dell'immobile` vs `Gestore / Property Manager / Intermediario Airbnb autorizzato dal proprietario`), Domicilio/Sede, Email/PEC, Telefono, Nome alloggio, Indirizzo immobile, CIN/CIR, Durata accesso (`[DURATA]`), Giorni/Orari sessioni, Durata licenza utilizzo contenuti + bottone `⚡ Auto-Compila da Immobile Attivo`.
  - **BLOCCO B — Dati Professionista (Content Creator / Fotografo / Videomaker / Marketing):** Nome/Ragione Sociale, C.F./P.IVA, Qualifica giuridica (`Contratto d'opera ex art. 2222 c.c.` vs `Appalto di servizi ex art. 1655 c.c.`), Sede, Email/PEC, Telefono, Troupe/Modelli autorizzati.
  - **BLOCCO C — Tariffario & Condizioni Economiche:** Selettore modalità (`1. Collaborazione Gratuita`, `2. Collaborazione Retribuita (Tariffario)`, `3. Scambio di Servizi / Permuta`), bottoni rapidi 1-clic per le **Tariffe Ufficiali Itassistance** (`99,00 €/mese`, `1.188,00 €/anno`, `Extra Revenue +10%`, `Check-in 20,00 €`, `Manutenzione 30,00 €`), **4 voci editabili del Tariffario Produzione Contenuti / Shooting & Marketing** con ricalcolo live del **Totale Tariffario (€)**, regime fiscale (`Forfettario L. 190/2014`, `IVA 22%`, `IVA inclusa`), IBAN `[DA CONFERMARE]` e termini di pagamento.
  - **BLOCCO D — Scarica Contratto in Formato PDF (`.pdf`):**
    1. **`📥 Scarica Contratto Compilato in PDF (.pdf)`** (`jul012DownloadCompiledContractPdf()` -> invoca `ITACloudSync.downloadCreatorContractCompiledPdf(formData)` oppure genera direttamente il file binario `.pdf` valido `Contratto_Produzione_Contenuti_Itassistance.pdf` tramite `jul012BuildBinaryPdfBlob()`).
    2. **`📄 Scarica Modello PDF in Bianco (.pdf)`** (`/contratti/contratto-produzione-contenuti-itassistance.pdf`).
    3. **`📝 Apri Pagina Contratto Completa (/contratto.html?type=creator)`**.
