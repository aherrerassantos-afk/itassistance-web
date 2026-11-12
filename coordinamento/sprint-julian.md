# Sprint Julian — Piano 4: ITASSISTANCE (`itadreamteam.com`)

> **Numerazione Ufficiale (`JUL-009`..`JUL-047`):** **Piano 4 · Itassistance** (`Piano 1 Toscan Costruzioni`, `Piano 2 PBA`, `Piano 3 SmartsBookings`, `Piano 4 Itassistance`)
> **Ordini Attivi e Completati nello Sprint Corrente:**
> - `JUL-035` — Semplificare il Form/Contratto Cliente (via Blocco B, soli 5 gruppi dati cliente), Tariffario Precompilato 99,00 €/mese senza Foto-Report, Clausola condizionale 10% Revenue Plan sul netto spettante al proprietario prima delle tasse personali (= incasso ospite meno commissioni piattaforme, imposta di soggiorno e costi di pulizia · fatturazione mensile a fine mese + esempio illustrativo)
> - `JUL-036` — Eliminazione Pagamento con Carta / Stripe / Apple Pay: Solo Fattura con Pro-Forma da controllare e confermare nell'area "My Box" del cliente + Coda manuale "Pro-forma confermati da fatturare" in `admin.html`
> - `JUL-037` — Configurazione Struttura semplificata in `app.html` (solo Indirizzo immobile con Google Maps, Telefono per coordinamenti operativi, Email per ricevere le fatture, etichette brevi Orario check-in / Orario check-out, rimozione URL Logo e sezione Codici istituzionali/legali, pulizia seed fittizi + `docs/revisione-adempimenti-legali.md`)
> - `JUL-038` — "Camere e Unità" ridotta a `Nome commerciale` + `Link calendario` con "Aggiungi un'altra struttura" e "Rimuovi", rimozione esposizione interna `Via dell'Agnolo` e seed fittizi + `docs/revisione-camere-unita.md`
> - `JUL-039` — Eliminazione del "Passo 3 di 4 · Motore e Canali" e passaggio del Wizard a 3 passi (`Passo 1 di 3 · Struttura`, `Passo 2 di 3 · Camere e Unità`, `Passo 3 di 3 · Revenue`), rimozione "85%", "15% cashback", IBAN/iCal di seed e promesse "anti-overbooking"
> - `JUL-040` — Redesign Flow 2026 del modulo Manutenzioni in `app.html` e `admin.html` (`<textarea>` e input a `width: 100%`, segmented control 3 ruoli, etichette brevi, rimozione sigle interne `JUL-0xx` e bottoni demo)
> - `JUL-041` — Menu inferiore di navigazione (`bottom-nav`) di `app.html` a 4 voci ufficiali: `1. Operativa · 2. Amministrativa · 3. Fisco · 4. Reports "My Box"`
> - `JUL-042` — Rimozione dei 4 pulsanti blu ridondanti (PBA / SHA-256 / SmartsBookings) e numeri non confermati dalla schermata "Servizi Firenze e Crescita" in `app.html`
> - `JUL-043` — Contatti Ufficiali confermati da Julian (`itassitance@bluearroyo.it` / `+39 349 177 5561`, `admin@bluearroyo.it`, `+39 349 804 1146` / `risorseumane@bluearroyo.it`)
> - `JUL-044` — Separazione netta in 2 pannelli: `Pannello Clienti` (`app.html`) vs `Pannello Itassistance Team` (`admin.html` con le 4 sezioni `1. Strutture Associate · 2. Clienti · 3. Ticket Aperti · 4. CRM Nuovi Clienti`)
> - `JUL-045` — Flusso End-to-End Form "Sono interessato" → `POST /api/lead-submit` + `4. CRM Nuovi Clienti` + Email automatica di presa in carico al cliente + Trigger chiamata vocale Yarvis a Julian
> - `JUL-046` — Dati ufficiali da Visura Camerale CCIAA Firenze di `BLUEARROYO S.R.L.` (`PEC: bluearroyosrl@pec.it`, `Capitale sociale: € 50.000,00 i.v.`) e sostituzione 100% di `351 038 0392` e `info@itadreamteam.com`
> - `JUL-047` — Passo 2 Homepage IT/EN e separazione flusso Ospiti: al proprietario viene detto `"Manda sempre il numero di assistenza per gli ospiti (+39 349 177 5561 · itassitance@bluearroyo.it)"`, mentre solo il Team Itassistance in `admin.html` ha accesso al modulo/link da riempire per conto degli ospiti
> **Avanzamento Sprint (`JUL-035`..`JUL-047`):** **100%** (`Chiusi: 100%` · `In corso: 0%`)
> **Stato Deploy:** `DEPLOY-READY itassitance 100%`

## Tabella Micro-Task Sprint Attivo (`JUL-035` .. `JUL-047`)

| Micro-task | JUL | Agente | Peso % | Stato |
|---|---|---|---|---|
| **Documentazione (`docs/revisione-adempimenti-legali.md`, `docs/revisione-camere-unita.md`, contratti MD), PDF Statici `/contratti/*.pdf`, Master Checklist `docs/checklist.csv` (`#110`–`#122`) e Suite Playwright:** allineamento completo `JUL-035..047` | JUL-035..047 | agente-1 | 25% | Chiuso |
| **Pannello Clienti (`app.html`), Pannello Itassistance Team (`admin.html`) e `checkout.html`:** Pro-Forma `"My Box"`, Wizard 3 passi semplificato (`JUL-037/038/039`), Flow 2026 (`JUL-040`), Bottom Nav 4 voci (`JUL-041`), rimozione 4 bottoni blu (`JUL-042`), separazione 2 pannelli + 4 sezioni Team (`JUL-044`), CRM `/api/lead-submit` (`JUL-045`), dati Visura (`JUL-046`) e regola link ospiti (`JUL-047`) | JUL-035..047 | agente-2 | 30% | Chiuso |
| **Motori JS (`cloud-sync.js`, `todo-admin-engine.js`), Serverless Function `api/lead-submit.js`, `llms.txt` e 25 Pagine Guida/Supporto HTML:** generatori PDF senza Blocco B e con clausola 10% Revenue Plan + Pro-Forma `"My Box"`, metodi condivisi Team/CRM/Calendari, endpoint lead + email automatica + chiamata Yarvis, dati Visura e pulizia vecchi contatti | JUL-035..047 | agente-3 | 25% | Chiuso |
| **Pagine Pubbliche Principali (`index.html`, `en/index.html`, `prezzi.html`, `contratto.html`) e `site-config.js`:** contratto/form cliente semplificato senza Blocco B, clausola condizionale Revenue Plan 10% sul netto con esempio illustrativo, rimozione foto-report e pagamento carta/Stripe, contatti ufficiali `JUL-043`, dati Visura `JUL-046`, form "Sono interessato" `JUL-045` e Passo 2 `JUL-047` | JUL-035..047 | agente-4 | 20% | Chiuso |
