# SITE_RULES.md — Fonte di Verità e Regole Permanenti di itassistance

> Da leggere OBBLIGATORIAMENTE prima di qualsiasi modifica a codice, copy, meta tag, generatore PDF o email di `itadreamteam.com`.

## 1. Posizionamento e Modello di Business
- **Prodotto:** `itassistance` è un'app che gestisce l'appartamento in affitto breve e guida il proprietario in tutta la parte operativa, fiscale e amministrativa.
- **Target:** Proprietari che NON hanno un property manager e vogliono tenere sotto mano il proprio appartamento senza pagare commissioni (18–25%).
  - *Dati di mercato ufficiali e fonti citabili obbligatorie:*
    - **~75% degli appartamenti in affitto breve in Italia non ha un property manager** ed è gestito direttamente dal proprietario (*Fonte: Centro Studi AIGAB – Associazione Italiana Gestori Affitti Brevi / Idealista*).
    - **L'84% dei proprietari presenti sul mercato è un piccolo host (1–2 unità)** (*Fonte: Centro Studi AIGAB*).
    - **Il 25% di immobili gestiti con strumenti professionali e ottimizzazione delle tariffe genera il 37–38% del fatturato totale del mercato** (*Fonte: Politecnico di Torino / Centro Studi AIGAB*). Questo spiega perché `itassistance` dà al singolo proprietario sia l'app a **99 €/mese** sia l'opzione **Extra +10% (Revenue Management & Adempimenti di Legge)**.
- **Promessa centrale:** Il lavoro del proprietario diventa di circa **10 minuti al giorno**. L'app gestisce l'appartamento in autonomia e invia ogni giorno un report con le cose da fare per essere in regola (Alloggiati Web Polizia di Stato, pagamento fornitori, tassa di soggiorno, comunicazioni obbligatorie).
- **Prezzo e Garanzia:**
  - **99 € al mese** (IVA inclusa), fisso per appartamento. Zero commissioni sulle prenotazioni nel piano base dell'app.
  - Pagamento a scelta del proprietario: **mese per mese** oppure **tutto l'anno anticipato** (`1.188 € / anno` IVA inclusa), senza differenze di prezzo e con disdetta libera senza penali.
  - **Garanzia 14 giorni Soddisfatto o Rimborsato:** il bottone "Prova l'app" porta al pagamento (`checkout.html`); se entro 14 giorni il proprietario non è soddisfatto e disdice, riceve il rimborso integrale del 100%.
  - **Extra opzionale (+10%) — Revenue Management & Adempimenti di Legge:** se il proprietario vuole delegare anche il Revenue Management (ottimizzazione dinamica tariffe e soggiorni minimi) e l'esecuzione operativa degli adempimenti di legge (Alloggiati Web, tassa di soggiorno, ISTAT), può attivare l'extra opzionale pari al **+10%**.
- **Tre pilastri (da ripetere in tutto il sito):**
  1. **CONTROLLO** — Resti tu il proprietario, decidi tu e incassi tu sul tuo conto.
  2. **SEMPLICITÀ** — 10 minuti al giorno, guidato passo passo.
  3. **RISPARMIO** — Prezzo fisso (99 €/mese IVA inclusa) invece del 18–25% di commissione.

## 2. Fonte Unica dei Dati (`site-config.js`)
- Prezzo, IVA, garanzia 14 giorni, orari di assistenza, telefono, WhatsApp, email, ragione sociale e prezzi degli extra a richiesta risiedono ESCLUSIVAMENTE in `/site-config.js`.
- È vietato scrivere prezzi ("99 €", "55 €") o orari incoerenti a mano sparsi nell'HTML, nel generatore PDF o nei template email. Tutto deve leggere o riflettere `SITE_CONFIG`.

## 3. Regole sul Marchio (Brand)
- Scrivere SEMPRE e SOLO **`itassistance`** (tutto minuscolo, una sola parola).
- **VIETATO usare:** `it.assistance`, `it.`, `ITASSISTANCE`, `Itassistance`, `itassitance`, `Il itassistance Dream Team`.
- **"Dream Team":** ammesso solo come descrizione della squadra (*"il team di itassistance"*), mai come secondo marchio.
- **Dati societari:** `Blue Arroyo SRL`, P.IVA `07480210488`, Via Matteo Palmieri 20r, 50122 Firenze (FI) — compaiono SOLO in footer, contratto/condizioni, privacy e fatture.
- **Contatti unici:**
  - Unico numero di assistenza e WhatsApp: `+39 351 038 0392`
  - Unica email: `info@itadreamteam.com`
  - Orari assistenza reali: tutti i giorni `09:00 – 23:00` (reperibilità serale `18:00 – 23:00`).

## 4. Cosa è VIETATO scrivere (Conformità & Trasparenza)
- **Niente 55 €/mese:** il vecchio piano da 55 € è abolito ovunque.
- **Niente "24/7":** indicare sempre e solo gli orari reali di assistenza (`09:00 – 23:00`), uguali ovunque (sito, FAQ, PDF, footer).
- **Niente promesse sulle recensioni:** vietato scrivere *"Recensioni 5★ garantite"*, *"Massimizziamo le recensioni 5 stelle"*, *"Review Manager"*. Usare: *"ti aiutiamo a offrire un soggiorno impeccabile"*.
- **Niente ambiguità verso gli ospiti:** vietato scrivere *"Il turista non sa di stare in un appartamento privato"* o *"Il tuo appartamento diventa un albergo a 5 stelle"*.
- **Niente città non attive spacciate per operative:** solo **Firenze** è indicata come attiva; le altre città vanno sotto *"Prossimamente"*.
- **Niente merchandise/divise/stationery in Home Page.**
- **Niente superlativi o gergo tecnico:** dare del "tu", frasi brevi, tono da alleato concreto e prudente. Specificare sempre nelle FAQ che l'app guida e ricorda le scadenze ma **non sostituisce il commercialista**.

## 5. Regole Generatore PDF Check-in
- **Una sola lingua per documento:** l'utente sceglie se generare il PDF in Italiano (`🇮🇹 Italiano`) o in Inglese (`🇬🇧 English` — mai doppia bandiera `🇬🇧🇺🇸`).
- **Zero segnaposto vuoti:** se un campo (codice portone, piano, ascensore, note ZTL, Wi-Fi, rifiuti, checkout) non è compilato, la relativa riga NON deve comparire nel PDF. Vietati `"N/A"`, `"()"`, `"—"`, `"Benvenuto in !"`.
- **Dati assistenza dal config:** telefono, WhatsApp, email e orari nel footer del PDF vengono letti da `SITE_CONFIG`.

## 6. Checklist di Verifica Obbligatoria (Post-Modifica)
- [ ] `grep` conferma zero occorrenze di `55`, `24/7`, `it.assistance`, `itassitance`, `5★ garantite`, `albergo a 5 stelle`.
- [ ] Prezzo (`99 €` IVA inclusa), orari (`09:00 – 23:00`), telefono (`+39 351 038 0392`), email (`info@itadreamteam.com`) e marchio (`itassistance`) identici in tutte le pagine, PDF ed email.
- [ ] Nessun testo in lingua mista nella stessa pagina o nello stesso PDF.
- [ ] Test responsive verificato a `360px`, `390px`, `768px` e `1280px` (zero scroll orizzontale).
- [ ] JSON-LD valido con `SoftwareApplication` (offer `99 EUR`), `Organization` e `FAQPage`.

## 7. Regola Generale Obbligatoria: Dopo Ogni Deploy (Check + Prossimo Passo Strategico)
Dopo **OGNI deploy** in produzione, la risposta all'utente deve SEMPRE concludersi con un blocco strutturato **"🧭 Visione & Prossimo Passo Consigliato"** che contiene:
1. **Check dello stato attuale (Cosa è fatto e live):** sintesi rapida dei blocchi chiusi rispetto alla visione complessiva di `itassistance`.
2. **Proposta del passaggio successivo più efficace:** suggerire proattivamente 2–3 opzioni concrete ordinate per impatto sul business (es. collegamento database reale Supabase / autenticazione utenti, automazione invio report mattutino ore 08:00 via WhatsApp/Email con n8n, link Stripe live definitivi per i piani `99 €` / `1.188 €` / `+10%`, o ottimizzazione conversione) per guidare la decisione sul prossimo step.

---

## 8. REGOLA PERMANENTE — VISIBILITÀ ORGANICA: SEO + POSIZIONAMENTO SULLE IA (GEO)

### Obiettivo
`itassistance` (`https://www.itadreamteam.com`, Blue Arroyo SRL, Firenze) deve essere trovato e citato in modo organico su:
1. Motori di ricerca classici: Google, Bing, Google Maps / Bing Places (Firenze).
2. Motori di risposta basati su IA: ChatGPT Search, Perplexity, Google AI Overviews / Gemini, Microsoft Copilot, Claude.

### Regole Tecniche e Contenutistiche Obbligatorie a ogni Modifica e Deploy
1. **Indicizzazione & Sitemap:**
   - Ogni pagina pubblica di marketing/guida deve avere `<meta name="robots" content="index, follow">`, `<link rel="canonical">`, un solo `<h1>`, `<title>` e `<meta name="description">` unici, ed essere inclusa in `/sitemap.xml`.
   - Le pagine applicative private (`/admin.html`, `/benvenuto.html`, `/login.html`) devono avere `noindex` e non comparire in `/sitemap.xml`.
   - Zero pagine 404, zero redirect a catena, tutto in HTTPS.
2. **Contenuto nell'HTML statico (Senza dipendenza da JS):**
   - Prezzi (`99 €/mese IVA inclusa`, `1.188 €/anno`, opzione `+10% Revenue & Adempimenti`, extra a Firenze `20 €` check-in e `30 €` manutenzione), statistiche (`75%` senza PM, `84%` piccoli host, `37–38%` ricavi — Fonti: AIGAB, Idealista, Politecnico di Torino), contatti e FAQ devono essere scritti direttamente nell'HTML sorgente affinché i crawler IA che non eseguono JS li leggano integralmente.
3. **Accesso Crawler IA (`/robots.txt` e `/llms.txt`):**
   - `/robots.txt` deve sempre consentire esplicitamente i crawler di ricerca, citazione e addestramento IA (`Googlebot`, `Bingbot`, `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `PerplexityBot`, `Claude-SearchBot`, `Claude-User`, `ClaudeBot`, `Google-Extended`, `Applebot`, `Applebot-Extended`, `CCBot`).
   - `/llms.txt` (e `/llms-full.txt`) devono essere mantenuti aggiornati con la sintesi ufficiale di `itassistance` e i link alle pagine chiave.
4. **Struttura "Risposta Prima" (Answer-First) e Citabilità:**
   - Ogni pagina di servizio o guida deve aprirsi con un blocco di 2–3 frasi che risponde subito alla domanda del proprietario (cosa facciamo, per chi, dove, a che prezzo esatto), seguito da fatti verificabili, data di ultimo aggiornamento visibile, autore (`itassistance · Blue Arroyo SRL`) e sezione FAQ reale.
5. **Dati Strutturati (Schema.org JSON-LD) e Coerenza NAP:**
   - Mantenere JSON-LD validi (`Organization`, `LocalBusiness`, `SoftwareApplication`, `FAQPage`, `Article`, `BreadcrumbList`).
   - Nome, indirizzo e telefono (NAP) identici ovunque: `itassistance` (prodotto di `Blue Arroyo SRL`, P.IVA `07480210488`), `Via Matteo Palmieri 20r, 50122 Firenze (FI)`, Tel/WhatsApp `+39 351 038 0392`, Email `info@itadreamteam.com`, Orari `09:00–23:00`.
6. **Correttezza Assoluta:**
   - Vietati keyword stuffing, testi nascosti, pagine duplicate prive di valore, recensioni false o promesse non verificabili.
7. **Checklist Obbligatoria Post-Deploy (Sezione SEO/GEO):**
   - Dopo ogni deploy verificare: (a) nuove pagine in `sitemap.xml` con title, description, H1, canonical e JSON-LD validi; (b) contenuto leggibile nell'HTML senza JS; (c) `robots.txt` e `llms.txt` accessibili; (d) dati aziendali identici a `site-config.js`.
   - Nel riepilogo di ogni deploy riportare sempre la riga **`SEO/GEO: ok`** (oppure l'elenco dei problemi trovati e risolti).

---

## 9. REGOLA PERMANENTE — METODO E MATRICE DEL "PIANO DEGLI INPUT" (RUOLI INTERNI & ESTERNI)

### Metodo Obbligatorio (5 Fasi in Ordine)
1. **FASE 1 – CONTROLLA (Audit):** Misura per ogni ruolo e attività ricorrente: clic/tap, campi da compilare, schermate attraversate, tempo stimato, duplicati e blocchi.
2. **FASE 2 – TOGLI (Meno è meglio):** Elimina/nascondi funzioni e tab non essenziali per il ruolo; rendi facoltativo tutto ciò che non serve subito; applica la regola **"OGNI DATO SI INSERISCE UNA SOLA VOLTA"** (CRM → Cliente → Fattura → Report App; Lavoro Field → App Proprietario → Saldo Fornitore → Fattura).
3. **FASE 3 – OTTIMIZZA IL RIMANENTE:** Una "Home" per ruolo (vede per primo solo ciò che deve fare oggi), valori predefiniti intelligenti, scelte a chip/tap al posto del testo libero.
4. **FASE 4 – VELOCIZZA:** Obiettivo misurabile di **almeno −50% di clic e di tempo** rispetto alla Fase 1 tramite azioni 1-tap, precompilazione da dati esistenti e passaggi automatici di stato.
5. **FASE 5 – CREA (Solo ciò che manca davvero):** Aggiungere nuove funzioni solo se emerge un bisogno reale non risolto dalle Fasi 2–4, specificando ruolo, problema risolto, clic/tempo risparmiati e costo di sviluppo.

### Matrice Ufficiale del Piano degli Input (Ruoli × Attività: Prima vs Dopo)

#### A. Ruoli Interni (`Blue Arroyo SRL` / `itassistance` — `/admin.html`)

| Ruolo Interno | Attività Ricorrente | Dispositivo | PRIMA (Clic / Campi / Tempo) | DOPO (Clic / Campi / Tempo) | Risparmio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **👑 Direzione / Super Admin** | Accesso + Controllo KPI reali & Broadcast 08:00 | Mobile / Desktop | 4 clic · 2 campi · 45 sec | **1–2 tap · 0 campi · 10 sec** | **−62% clic · −77% tempo** |
| **🛠️ Operativo / Field FI** | Chiusura Check-in (20 €) o Manutenzione (30 €) (`App` + `Fornitore` + `Fattura`) | Mobile (sul campo) | 10 clic · 5 campi · 3 schermate · 210 sec | **1 tap · 0 campi · 1 schermata · 5 sec** | **−90% clic · −97% tempo** |
| **💬 Assistenza 09:00–23:00** | Invio link `/ospiti`, Wi-Fi/ZTL o Check-out SMN IT/EN su WhatsApp | Mobile / Desktop | 8 clic · 3 schermate · 90 sec | **1 tap · 0 campi · 1 schermata · 5 sec** | **−87% clic · −94% tempo** |
| **🤝 Vendite (CRM & Partner)** | Conversione Lead → Cliente + Fattura + Codice Immobile + WhatsApp | Mobile / Desktop | 7 clic · 2 tab · 120 sec | **1 tap · 0 campi · 1 schermata · 10 sec** | **−85% clic · −91% tempo** |
| **🧾 Amministrazione (`billing`)** | Emissione Fattura da Cliente attivo + Download PDF | Desktop | 7 clic · 6 campi · 50 sec | **2 clic · 1 selezione · 10 sec** | **−71% clic · −80% tempo** |
| **🧾 Amministrazione (`billing`)** | Rimborso Garanzia 14 gg + Sospensione automatica Cliente | Desktop | 5 clic · 2 tab · 40 sec | **1 tap · 0 campi · 5 sec** | **−80% clic · −87% tempo** |
| **🧾 Amministrazione (`billing`)** | Emissione Fattura Unica Cumulativa Portafoglio Property Manager (`N × 99 €` + `+10%`) | Desktop / Mobile | 35 clic (5 fatture separate) · 25 campi · 15 min | **1 tap (`🧾 1-Tap Fattura Unica Cumulativa PM`) · 0 campi · 5 sec** | **−97% clic · −99% tempo** |
| **👥 HR / 🧹 Fornitori** | Registrazione nuovo collaboratore o fornitore certificato Firenze | Desktop | 7 clic · 6 campi · 60 sec | **3 clic · 2 campi · 15 sec** | **−57% clic · −75% tempo** |
| **📈 Revenue Manager (+10%)** | Regia Prezzi Variabili, Sblocco Grado `L3` coi Dati & Subentro 1-Tap da `1. Toscan Costruzioni` (`/admin.html`) | Mobile / Desktop | 18 clic su 3 portali · 14 campi data · 15 min | **1 tap strategia / 1 tap Subentro Toscan / 1 tap Certifica Dati · 0 campi · 5 sec** | **−94% clic · −99% tempo** |

#### B. Ruoli Esterni (`Prospect`, `Cliente Attivo`, `Property Manager Multi-Immobile`, `Ospite`, `Partner / Fornitore`)

| Ruolo Esterno | Attività Ricorrente | Route / Dispositivo | PRIMA (Clic / Campi / Tempo) | DOPO (Clic / Campi / Tempo) | Risparmio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **🏢 Property Manager (3–10 Immobili)** | Passaggio tra appartamenti + Approvazione Settimanale Prezzi & Scarico Unico CSV Bulk | `/app.html` (Mobile / Desktop) | 75 clic · 5 login/logout · 45 min/settimana | **1 tap Switcher Immobile + 1 tap (`⚡ 1-Tap Bulk CSV Tutti gli Immobili`) · 0 campi · 30 sec/sett.** | **−96% clic · −98% tempo** |
| **🔍 Prospect (Proprietario)** | Capisce problema → vede soluzione/guida → passa a Checkout precompilato | `/index.html` (Mobile / Desktop) | 6 clic · 3 campi · 90 sec | **2 tap · 1 recapito · 20 sec** | **−66% clic · −77% tempo** |
| **💳 Prospect in Attivazione** | Attivazione Piano 99 €/mese (o 1.188 €/anno) con Garanzia 14 gg | `/checkout.html` (Mobile / Desktop) | 5 clic · 6 campi obbligatori · 90 sec | **2 tap · 3 campi essenziali · 30 sec** | **−60% clic · −50% campi · −66% tempo** |
| **🏠 Cliente Attivo (Proprietario)** | Login + Risoluzione problema del giorno (Check-in 20€, Guasto 30€, Documenti, CSV) | `/login.html` → `/app.html` (Mobile) | 6 clic · 3 campi login · 75 sec | **1 tap login + 1 tap azione · 0 campi · 10 sec** | **−66% clic · −100% campi · −86% tempo** |
| **🏠 Cliente Attivo (Proprietario)** | Inserimento nuova prenotazione o spesa fornitore standard | `/app.html` (Mobile / Desktop) | 5 clic · 6 campi prenotazione (3 spesa) · 60 sec | **1–2 tap · 2 campi prenotazione (0 spesa chip) · 12 sec** | **−60% clic · −80% tempo** |
| **🏠 Cliente Attivo (Proprietario)** | Gestione Prezzi Variabili & Channel Manager su 1 o più portali (`Airbnb`, `Booking`, `Vrbo`, `Diretto`) | `/app.html?tab=extra` | 15–20 clic su 2–3 portali diversi · 14 campi · 15 min | **0–1 tap in Auto-Pilot da un unico punto · 0 campi · 5 sec** | **−95% clic · −99% tempo** |
| **🏠 Cliente Attivo (Proprietario)** | Preparazione & Scarico Schedina Alloggiati Web precompilata da ospite | `/app.html#view-alloggiati` | 4 clic · 12 campi visibili · 60 sec | **1 tap (`⚡ Scarica .txt + Segna Inviata`) · 0 campi · 5 sec** | **−75% clic · −91% tempo** |
| **🛂 Ospite Turistico (IT/EN)** | Self Check-in Documento (Art. 109 TULPS) + Download PDF Istruzioni | `/ospiti.html` (Mobile) | 5 tap · 12 campi · 90 sec | **2 tap (1 Chip Paese + Invio) · 5 campi · 30 sec** | **−60% clic · −58% campi · −66% tempo** |
| **🤝 Partner / Fornitore Esterno** | Richiesta accreditamento Studio Commercialista / Agenzia / Fornitore FI | `/partner.html` (Desktop / Mobile) | 4 clic · 4 campi obbligatori · 60 sec | **2 tap (1 Chip Ruolo + Invio) · 2 campi · 20 sec** | **−50% clic · −50% campi · −66% tempo** |

---

## 10. REGOLA PERMANENTE — VISIONE E 4 PRINCIPI NON NEGOZIABILI DEL CHANNEL MANAGER & REVENUE MANAGEMENT AUTONOMO

Obiettivo finale per i membri e i Property Manager di `itassistance`: un sistema di **Revenue Management Autonomo** che decide prezzi, soggiorni minimi e sblocco buchi orfani su tutti i portali collegati (1 o più portali) massimizzando il ricavo entro i limiti stabiliti dal proprietario, con un intervento umano di pochi minuti a settimana.

### I 4 Principi Non Negoziabili (Sempre Applicati in Codice e Testi)
1. **Promesse = Realtà:** Il sito e l'app dichiarano come attive solo le funzioni realmente operative oggi (`✅ Attivo Ora`: motore calcolo prezzi comportamentali e soggiorni minimi, blocco rigido anti-overbooking su calendario, compensazione commissioni OTA, approvazione settimanale in 1 tap con export listino CSV e sincronizzazione iCal). Ciò che non è ancora attivo (es. scrittura automatica H24 via API diretta sui server Airbnb/Booking/Vrbo senza CSV — `Livello L4`) deve essere sempre etichettato esplicitamente **`⏳ In arrivo`**.
2. **Autonomia Guadagnata con i Dati (`L1` → `L2` → `L3` → `L4`):** Il sistema sale di livello di autonomia (`L1 Osservazione` → `L2 Co-Pilota 1-Tap Settimanale` → `L3 Autonomia entro Guardrail`) solo quando batte le decisioni umane/statiche in modo misurato e verificabile (`> +8%`).
3. **Zero Overbooking, Zero Prezzi Fuori Controllo:** Ogni inserimento prenotazione verifica preventivamente le collisioni di date (`ITACloudSync.checkBookingOverlap`) bloccando doppie prenotazioni; ogni prezzo (calcolato o inserito a mano) è vincolato matematicamente (`clampPriceToGuardrails`) tra il `Floor Minimo` e il `Cap Massimo` decisi dal proprietario.
4. **Meno Clic Possibili per i Membri:** L'interazione ordinaria del membro o del Property Manager si riduce a **1 solo tap a settimana** (`⚡ Approva Piano Settimanale & Scarica Listino CSV`).

---

## 11. REGOLA PERMANENTE — IL CICLO VIRTUOSO DEL GRUPPO BLUE ARROYO (1 → 2 → 3 → 4) E I 12 GENERAL DIRECTORS

Ogni General Director ha il suo cruscotto, i suoi numeri e i suoi obiettivi autonomi, ma **tutto il valore rimane all'interno del Gruppo Blue Arroyo** secondo il **Ciclo Virtuoso in 4 Azioni**:

```
1. TOSCAN COSTRUZIONI crea il bene (Cliente: Investitori)
   └─► Consegna un appartamento nuovo, cablato e collaudato che non ha bisogno di riparazioni per anni.
        │
2. itassistance lo protegge (Cliente: Property Manager)
   └─► Lo rende immediatamente conforme alla legge (Questura e Comune) e ne ottimizza le tariffe dinamiche.
        │
3. BLUE ARROYO CLEANING lo allestisce (Cliente: Property Manager)
   └─► Lo trasforma in una suite d'albergo con biancheria a 60°C, kit biologici e spugne sigillate a costo zero per il PM.
        │
4. SMARTBOOKINGS lo riempie di turisti (Cliente: Turisti / Ospiti)
   └─► Vende le notti senza regalare il 20% alle multinazionali OTA, restituisce 15€ (15%) di cashback all'ospite e bonifica l'85% al proprietario.
```

| Azienda del Gruppo | 🎯 Cliente | 🛠️ 1. General Director Operatività | 🧾 2. General Director Amministrazione | 🤝 3. General Director Vendite |
| :--- | :--- | :--- | :--- | :--- |
| **1. Toscan Costruzioni** *(Crea il bene)* | **Investitori & Proprietari in Espansione** | Cantieri, 5 SAL (`15+25+25+25+10%`), collaudi e cablaggio self check-in | Contratti d'appalto a prezzo fisso, DURC, Polizze CAR e fatturazione SAL | Acquisizione investitori immobiliari e studi di fattibilità (alimentato dai form Real Estate di `/index.html` e `/app.html`) |
| **2. itassistance** *(Lo protegge & Libera il Tempo)* | **Proprietari-Gestori Diretti (75% del mercato, 1–2 immobili) & PM** | Alloggiati Web (24h), ISTAT Ross1000, Tassa Soggiorno, Channel Manager e schedine | Piani `99 €/m` (`0%`) e `+10%`, rimborsi 14gg e fatturazione elettronica SDI | Onboarding Proprietari-Gestori e PM; vende la **libertà del tempo senza rinunciare agli incassi** e apre la sfida successiva: investire in un nuovo immobile con `1. Toscan Costruzioni` |
| **3. Blue Arroyo Cleaning** *(Lo allestisce)* | **Proprietari-Gestori Diretti (75%) & PM** | Cleaners, turni chiusi entro le 15:00, 4 foto danni SHA-256 e 3 hub logistici ZTL | Consuntivi mensili, Fattura unica SDI 1-clic, pagamenti HR e magazzino kit gratuiti (`232 €/m` risparmio) | Contratti turnover B2B per pacchetti di alloggi dei PM |
| **4. SmartsBookings.com** *(Lo riempie di turisti)* | **Turisti / Ospiti** | Guida mobile, Runner bagagli casa-a-casa e Concierge 7/7 | Custodia 15%, Payout 85% entro le 12:00 del check-out e Cashback 15% (15€) in 48h | Campagne Grand Tour, acquisizione turisti diretti e SEO/GEO in 5 lingue |

---

## 12. SETTINGS CORE — REGOLE PERMANENTI DI DESIGN EDITORIALE 2026

1. **Flow 2026, non 2000 (Aura `Structural Resonance - Centered Architect`):** Il sito è un racconto continuo in cui ogni sezione porta in modo naturale alla successiva. Layout editoriali e applicativi centrati (`https://www.aura.build/design-systems/structural-resonance-centered-architect`), ampi spazi, tipografia forte e immagini grandi. Vietati caroselli automatici, pop-up all'ingresso, muri di testo, griglie di card tutte uguali, icone generiche, ombre pesanti e gradienti decorativi superflui.
2. **Blocco Clean (Moderno e Pulito):** Una sola idea per sezione e una sola azione principale per schermata. Griglia coerente e spaziatura costante basata su multipli di 8 px (`base: 8px`, `gap: 16px`, `card-padding: 24px`, `section-padding: 80px`, `rounded: 15px`). Tipografia Aura `Structural Resonance`: **`Inter`** per titoli e corpo del testo e **`JetBrains Mono`** per etichette tecniche, codici e tariffe dinamiche. Rimuovere tutto ciò che non aiuta l'utente a capire o ad agire.
3. **Niente Emoji:** Nessuna emoji in testi, titoli, bottoni, menu o messaggi. Usare icone solo se migliorano la comprensione e sempre nello stesso stile.
4. **Testi Chiari:** Frasi brevi e parole semplici. Il titolo deve far capire in 3 secondi cosa offriamo e a chi. Testo base di almeno 16 px, 18 px nei paragrafi lunghi, interlinea di almeno 1,5 e massimo 70 caratteri per riga (`65ch`). Niente frasi intere in maiuscolo.
5. **Bottoni Grandi:** Altezza minima 56 px su telefono e 48 px su desktop, raggio `15px`. Testo di almeno 16 px con un verbo chiaro (`Attiva la prova di 14 giorni`, `Richiedi lo studio di fattibilità`, non `Scopri di più`). Spazio di almeno 8 px tra elementi cliccabili. Stati `:hover`, `:focus-visible`, `:active` e `:disabled` sempre visibili.
6. **Colori e Contrasto (Brand Viola & Bianco — WCAG AAA):** Usare solo i colori della palette Viola & Bianco definiti come variabili CSS (`--bg-light: #FFFFFF`, `--bg-stone: #F5F3FF`, `--ink-navy: #1E1035`, `--ink-muted: #4C3D63`, `--ink-on-dark-muted: #E9D5FF`, `--brand-violet: #6D28D9`, `--gold-accent: #C4B5FD`, `--gold-text-light: #5B21B6`, `--border-control: #7C3AED`, `--status-ok-bg: #ECFDF5`, `--status-ok-text: #065F46`). Contrasto minimo 4.5:1 per il testo normale e 3:1 per testo grande e bordi dei controlli. Velo di contrasto obbligatorio sopra foto e video (`rgba(30, 16, 53, 0.84)`). Il colore da solo non trasmette mai un'informazione.
7. **Telefono Prima di Tutto:** Progettazione mobile-first testata a 320, 360, 390, 430, 768, 1024 e 1440 px senza scroll orizzontale (`overflow-x: clip`). Dimensioni fluide con `%`, `clamp()`, `flex` e `grid`. Altezze a tutto schermo in `svh` / `dvh` e rispetto delle safe area dei telefoni.
8. **Immagini Organiche:** Foto reali da `/brand/` in formato `.webp` con dimensioni `width` e `height` dichiarate (`welcome.webp`, `staff.webp`, `window.webp`, `suv.webp`, `stationery.webp`).
9. **Scroll, Video e Movimento:** Rivelazioni allo scroll e transizioni animate su `transform` e `opacity` a 60 fps, senza alterare la velocità naturale dello scroll. Video in autoplay solo muti con `playsinline`, `loop` e `poster`. Versione statica completa per `prefers-reduced-motion: reduce`.
10. **Marchio e Vocabolario:** Uso strategico di `itassistance` e del glossario ufficiale (`Proprietario-Gestore`, `Riepilogo delle 08:00`, `Gradi di Autonomia`, `Guardrail di Prezzo`, `Ciclo Blue Arroyo`, `Formula 5 SAL Garantiti`).
11. **Qualità Tecnica:** Immagini `.webp` con dimensioni dichiarate, `loading="lazy"` sotto la prima schermata, HTML semantico, testi alternativi, navigazione da tastiera e contenuto leggibile anche senza JavaScript.

---

## 13. SETTINGS CORE — SISTEMA CIPOLLA E REGOLE PERMANENTI PER L'AREA RISERVATA DA TELEFONO

Non mostrare mai tutto subito: l'utente apre un livello alla volta e vede solo ciò che gli serve in quel momento.

1. **I 5 Livelli della Cipolla (`Livello 0` -> `Livello 4`):**
   - **Livello 0 (Sito pubblico e Accesso):** Spiega cosa offriamo e porta al login (`/login.html`) o all'attivazione guidata (`/checkout.html`).
   - **Livello 1 (Home dopo il login):** Saluto breve, una sola riga che indica lo stato o la cosa più importante da fare oggi, una sola azione principale (`56px`) e da 3 a 5 grandi blocchi (uno per area, con titolo, riga descrittiva e un dato chiave).
   - **Livello 2 (Pagina dell'area):** Titolo chiaro, una frase che spiega a cosa serve, riepilogo essenziale e massimo 4 o 5 bottoni dedicati a quell'area.
   - **Livello 3 (Dettaglio):** Solo le informazioni dell'elemento scelto; contenuti secondari raccolti in sezioni espandibili (`<details>`); azioni pertinenti a quel dettaglio.
   - **Livello 4 (Azione):** Una sola attività per schermata (compilare, confermare, scaricare o pagare); moduli lunghi divisi in passaggi con indicazione `"Passaggio X di Y"`; dopo l'azione mostra una conferma chiara e il passo successivo.
2. **Navigazione Multi-Livello e URL Propri:**
   - Barra inferiore fissa (`min-height: 64px` + `env(safe-area-inset-bottom)`) con massimo 5 voci sempre uguali, ciascuna con icona SVG ed etichetta.
   - Header contestuale di `56px` con titolo della pagina e freccia `<- Indietro` (`48x48px`) nei livelli interni (`Livelli 2, 3, 4`).
   - Ogni livello/vista ha un URL proprio (`?view=...`) gestito tramite `History API` (`pushState` / `popstate`) così il tasto Indietro del telefono riporta sempre al livello precedente conservando posizione di scroll, filtri e dati inseriti.
   - Transizioni brevi e coerenti (entrata da destra scendendo di livello, ritorno verso destra risalendo), disattivate con `prefers-reduced-motion: reduce`.
3. **Misure da Telefono e Stati Obbligatori:**
   - Progettato da `360px` e verificato a `320, 360, 390, 430, 768, 1024 e 1440 px` con margini laterali di `16px`, una sola colonna su telefono, tabelle trasformate in schede verticali e pannelli dal basso (`max-height: 90dvh`) con scroll interno e chiusura sempre visibile.
   - Prevedere sempre i 4 stati: **Caricamento** (struttura stabile), **Stato vuoto** (spiegazione + azione utile), **Errore** (messaggio semplice + soluzione) e **Conferma** (dopo ogni azione importante con passo successivo).

---

## 14. SISTEMA DI PREZZI VARIABILI GIORNALIERI DI ACQUISIZIONE IMMOBILI (99,00 € – 289,50 € / MESE)

1. **Fascia Ufficiale di Quota Mensile (`99,00 € – 289,50 € / mese`):**
   - Il canone mensile di ingresso per nuovi appartamenti in `itassistance` oscilla ogni giorno tra un minimo garantito di **99,00 € / mese** e un massimo di **289,50 € / mese** (IVA inclusa, step di `0,50 €`).
2. **Posizionamento di Marketing (Controllo della Domanda e Slot Acquisizione Firenze):**
   - A livello di comunicazione sul sito (`index.html`, `prezzi.html`, `checkout.html`), la variazione giornaliera è legata alla **disponibilità di slot di acquisizione di nuovi immobili a Firenze** (capacità operativa del team cittadino, Hub ZTL e code di onboarding) per controllare la domanda e garantire la qualità del servizio.
   - Chi attiva l'abbonamento blocca la quotazione del giorno per tutta la durata dell'iscrizione (**Price Lock**).
3. **Architettura in 2 Fasi (Startup -> Scaleup):**
   - **Fase 1 (Attiva ora in `site-config.js`):** Generatore randomico variabile calibrato tra `99,00 €` e `289,50 €` (`SITE_CONFIG.getDynamicPricing()` e `SITE_CONFIG.rerollDynamicPrice()`), persistito nella sessione di navigazione e dotato di calcolo inverso degli slot disponibili (`1–6 slot su 6 a Firenze`) e striscia previsionale di 5 giorni.
   - **Fase 2 (In Roadmap):** Architettura di controllo reale della domanda (`SITE_CONFIG.computePhase2DemandPricePlaceholder()`) che collegherà l'indice di prezzo al carico effettivo di nuovi immobili acquisiti su Supabase quando i volumi della startup lo richiederanno.

---

## 15. SETTINGS CORE — REGOLE PERMANENTI ANTI-SOVRAPPOSIZIONE, SPAZIATURA E CONTROLLO AUTOMATICO (`npm run check:layout`)

Nessun elemento deve mai sovrapporsi, tagliarsi o uscire dallo schermo, né da PC né da telefono. Queste regole vanno applicate dopo ogni variazione.

### 15.1 Layout Anti-Sovrapposizione
- Usa `flex` e `grid` con `gap`. Lascia che il contenuto determini lo spazio.
- Non usare `position: absolute` per disporre testi, logo, menu o bottoni. È ammesso solo per elementi decorativi senza contenuto (`aria-hidden="true"`).
- Non usare margini negativi per correggere il layout.
- Non impostare altezze fisse (`height`) su contenitori con testo: usa sempre `min-height`.
- Sui figli di `flex` e `grid` che contengono testo usa `min-width: 0`.
- Non usare `overflow: hidden` per nascondere un elemento che sborda.
- Definisci una sola scala di `z-index` nei token globali (`:root` in `site-config.js` e `index.html`):
  - `--z-content: 1` (contenuto)
  - `--z-header: 500` (header fisso)
  - `--z-fixed-bar: 600` (barra azione mobile / barra cipolla)
  - `--z-floating: 650` (bottone supporto/AI)
  - `--z-panel: 700` (pannelli laterali/inferiori)
  - `--z-modal: 800` (finestre/menu a tutto schermo)
  - `--z-toast: 900` (avvisi)

### 15.2 Header e Menu
- Struttura a 3 zone con `display: grid; grid-template-columns: auto 1fr auto`: **logo**, **navigazione**, **azioni**.
- Logo (`.brand-mark`) e bottone `Accedi` (`.header-login-btn`) hanno `flex-shrink: 0` e `white-space: nowrap` e restano sempre su una sola riga.
- Ogni voce di menu resta su una sola riga (`white-space: nowrap`), con etichette brevi.
- Massimo **5 voci principali** da PC (`Riepilogo 08:00`, `Risparmio`, `Autonomia`, `Gruppo Blue Arroyo`, `Guide Firenze`).
- Il menu mobile si attiva prima che le voci manchino di spazio (`1024px`).
- Su telefono: logo, azione principale e bottone `Menu`. Tutte le voci vanno nel menu a tutto schermo (`#mobile-fullscreen-menu`).
- L'header ha una larghezza massima adatta al suo contenuto (`max-width: 1360px`), mai più stretta.
- Con header fisso, `html { scroll-padding-top: 88px; }` garantisce che i titoli delle ancore non finiscano mai sotto l'header.

### 15.3 Testi e Spazi
- Parole, numeri e simboli devono mantenere gli spazi in ogni lingua. È vietato attaccare tag inline (`<strong>`, `<em>`, `<a>`, `<span>`) alle parole adiacenti senza spazio.
- Non affidare lo spazio tra testi a elementi separati senza `gap`.
- Per i dati (`.hero-meta-strip`, `.kpi-row`), usa valore e descrizione in un unico testo oppure su due righe con `display: flex; flex-direction: column; gap: 4px`.
- Il testo va a capo senza tagli. Usa `overflow-wrap: anywhere` solo per parole o codici lunghi.

### 15.4 Testo sopra Immagini e Video
- Le immagini di sfondo non devono mai contenere testo, logo o numeri di telefono nell'area dei contenuti (`/brand/hero-clean.webp`, `/brand/welcome.webp`, `/brand/window.webp`).
- Velo scuro obbligatorio (`--overlay-hero: linear-gradient(180deg, rgba(20, 10, 38, 0.90) 0%, rgba(30, 16, 53, 0.88) 55%, rgba(20, 10, 38, 0.94) 100%)`) capace di garantire leggibilità in ogni punto.
- Testo normale: contrasto minimo **4.5:1**. Testo grande e icone: minimo **3:1**.
- Il testo non deve mai restare semitrasparente nello stato finale né dipendere da JavaScript per diventare visibile (`opacity: 1` garantita anche su `.reveal-on-scroll:not(.is-visible)`).

### 15.5 Elementi Fissi
- Bottone AI/Supporto (`#pba-chat`), barre fisse mobile (`.mobile-action-bar`, `.cipolla-bottom-bar`) hanno posizioni riservate e non si sovrappongono tra loro.
- Su telefono viene aggiunto spazio in fondo alla pagina (`padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px))`).
- Quando un campo `input`, `textarea` o `select` riceve il focus (`body.is-editing-field`), gli elementi fissi inferiori e flottanti si nascondono automaticamente per non coprire mai testi, campi o comandi con la tastiera aperta.

### 15.6 Controllo Automatico Obbligatorio (`npm run check:layout`)
- Prima di ogni pubblicazione va eseguito `npm run check:layout` (Playwright + axe-core) sulle larghezze:
  - **PC:** `1024, 1280, 1440, 1920, 2560 px`
  - **Telefono e Tablet:** `320, 360, 390, 430, 768 px`
- Il controllo fallisce se rileva: (1) scroll orizzontale, (2) elementi visibili fuori schermo, (3) intersezioni tra testi/logo/bottoni/link, (4) voci di menu o bottoni su più righe quando non previsto, (5) elementi fissi che coprono testi o comandi, (6) testo tagliato dal contenitore, (7) contrasto non conforme, (8) errori di spaziatura (`minuscolaMaiuscola`, simboli `€/%/)` attaccati a lettere o parole del glossario incollate).

---

## 16. REGOLA BASE PERMANENTE — IL DESIGN NON SI TAGLIA MAI

Questa regola vale per ogni progetto, pagina, componente e modifica, e ha priorità su qualsiasi scelta estetica. Va riletta prima di ogni intervento.

### OBIETTIVO
Su ogni schermo devono restare completamente visibili e utilizzabili: logo, menu hamburger, bottoni, testi, bordi, schede, immagini importanti, tabelle e finestre.

Se un elemento non entra, il layout deve adattarsi: va a capo, si impila o passa al livello successivo della cipolla. Non deve mai essere tagliato, rimpicciolito fino a diventare illeggibile o spinto fuori schermo.

### FASE 1 — CONTROLLO INIZIALE
Prima di modificare il codice:
1. Apri il progetto alle larghezze indicate sotto.
2. Trova ogni elemento che esce dallo schermo o viene tagliato.
3. Identifica la causa nel codice.
4. Correggi la causa nel componente condiviso, non con eccezioni pagina per pagina.

### BASE TECNICA OBBLIGATORIA
- Meta viewport: `width=device-width, initial-scale=1, viewport-fit=cover`.
- Imposta `box-sizing: border-box` su tutti gli elementi.
- Progetta prima per il telefono, poi amplia per schermi maggiori.
- Usa `flex` e `grid` con `gap`, `min-width: 0` sui figli e dimensioni fluide.
- Immagini, video, iframe e SVG: `max-width: 100%`.
- Margini laterali della pagina: `max(16px, env(safe-area-inset-left))` a sinistra e `max(16px, env(safe-area-inset-right))` a destra.
- Rispetta anche le aree sicure in alto e in basso.
- Altezze a schermo intero: usa `dvh` o `svh`.

### VIETATO
- Usare `100vw` per la larghezza dei contenitori.
- Impostare `width` o `min-width` fissi che superano lo schermo.
- Usare margini negativi o `transform` che portano contenuti fuori dallo schermo.
- Usare `overflow: hidden` o `overflow-x: hidden` (o `clip`) su `html` e `body` per nascondere il problema.
- Usare `white-space: nowrap` su testi lunghi senza verificare che entrino.
- Posizionare header, menu o bottoni con coordinate fisse o `position: absolute`.
- Bloccare lo zoom con `user-scalable=no` o `maximum-scale=1`.

### HEADER E MENU HAMBURGER
- Struttura consigliata: `grid-template-columns: auto minmax(0, 1fr) auto`.
- Hamburger: area di almeno `48 x 48 px`, sempre interamente visibile e con `flex-shrink: 0`.
- Logo: si adatta allo spazio disponibile senza spingere l'hamburger fuori.
- Header e icone rispettano i margini laterali e le aree sicure.
- Il menu aperto occupa la larghezza disponibile e scorre verticalmente se le voci sono tante.
- Il bottone di chiusura e tutte le voci restano raggiungibili anche con schermo basso o in orizzontale.

### BORDI, SCHEDE E COMPONENTI LARGHI
- Schede e pannelli: `width: 100%`, `max-width: 100%`. Tutti e quattro i bordi devono restare visibili.
- Le ombre non devono essere tagliate dai contenitori.
- Tabelle: su telefono diventano schede. Se una tabella deve restare tale, solo la tabella scorre dentro il proprio contenitore.
- Calendari, tab e filtri: adattali al telefono oppure rendi chiaro lo scorrimento interno, senza far scorrere la pagina.
- Finestre e pannelli: larghezza entro lo schermo, altezza massima `90dvh`, scroll interno e chiusura sempre visibile.
- Testi lunghi, URL e codici: usa `overflow-wrap: anywhere` dove serve.
- Immagini importanti: non usare `object-fit: cover` se taglia volti, prodotti o testi. Prevedi un'inquadratura per telefono o usa `object-fit: contain`.

### TEST OBBLIGATORI DOPO OGNI MODIFICA (`npm run check:mobile`)
Crea ed esegui il comando `npm run check:mobile` con Playwright su tutte le pagine pubbliche e interne, con menu e finestre sia chiusi sia aperti, in ogni lingua e ruolo disponibile.

Dimensioni:
- `320 x 568`
- `360 x 800`
- `390 x 844`
- `430 x 932`
- `768 x 1024`
- `844 x 390` (telefono orizzontale)

Motori:
- Chromium con profilo telefono Android
- WebKit con profilo iPhone

Il test deve fallire se:
1. `document.documentElement.scrollWidth` è maggiore di `clientWidth`.
2. Un elemento visibile ha `left < 0` oppure `right > larghezza dello schermo`, salvo contenuti dentro uno scroller intenzionale.
3. Hamburger, logo o bottoni principali non sono interamente visibili.
4. Un testo o controllo risulta tagliato dal contenitore.
5. Un elemento cliccabile è coperto da un altro.










