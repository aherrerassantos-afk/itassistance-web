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
| **👥 HR / 🧹 Fornitori** | Registrazione nuovo collaboratore o fornitore certificato Firenze | Desktop | 7 clic · 6 campi · 60 sec | **3 clic · 2 campi · 15 sec** | **−57% clic · −75% tempo** |

#### B. Ruoli Esterni (`Prospect`, `Cliente Attivo`, `Ospite`, `Partner / Fornitore`)

| Ruolo Esterno | Attività Ricorrente | Route / Dispositivo | PRIMA (Clic / Campi / Tempo) | DOPO (Clic / Campi / Tempo) | Risparmio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **🔍 Prospect (Proprietario)** | Capisce problema → vede soluzione/guida → passa a Checkout precompilato | `/index.html` (Mobile / Desktop) | 6 clic · 3 campi · 90 sec | **2 tap · 1 recapito · 20 sec** | **−66% clic · −77% tempo** |
| **💳 Prospect in Attivazione** | Attivazione Piano 99 €/mese (o 1.188 €/anno) con Garanzia 14 gg | `/checkout.html` (Mobile / Desktop) | 5 clic · 6 campi obbligatori · 90 sec | **2 tap · 3 campi essenziali · 30 sec** | **−60% clic · −50% campi · −66% tempo** |
| **🏠 Cliente Attivo (Proprietario)** | Login + Risoluzione problema del giorno (Check-in 20€, Guasto 30€, Documenti, CSV) | `/login.html` → `/app.html` (Mobile) | 6 clic · 3 campi login · 75 sec | **1 tap login + 1 tap azione · 0 campi · 10 sec** | **−66% clic · −100% campi · −86% tempo** |
| **🏠 Cliente Attivo (Proprietario)** | Inserimento nuova prenotazione o spesa fornitore standard | `/app.html` (Mobile / Desktop) | 5 clic · 6 campi prenotazione (3 spesa) · 60 sec | **1–2 tap · 2 campi prenotazione (0 spesa chip) · 12 sec** | **−60% clic · −80% tempo** |
| **🏠 Cliente Attivo (Proprietario)** | Preparazione & Scarico Schedina Alloggiati Web precompilata da ospite | `/app.html#view-alloggiati` | 4 clic · 12 campi visibili · 60 sec | **1 tap (`⚡ Scarica .txt + Segna Inviata`) · 0 campi · 5 sec** | **−75% clic · −91% tempo** |
| **🛂 Ospite Turistico (IT/EN)** | Self Check-in Documento (Art. 109 TULPS) + Download PDF Istruzioni | `/ospiti.html` (Mobile) | 5 tap · 12 campi · 90 sec | **2 tap (1 Chip Paese + Invio) · 5 campi · 30 sec** | **−60% clic · −58% campi · −66% tempo** |
| **🤝 Partner / Fornitore Esterno** | Richiesta accreditamento Studio Commercialista / Agenzia / Fornitore FI | `/partner.html` (Desktop / Mobile) | 4 clic · 4 campi obbligatori · 60 sec | **2 tap (1 Chip Ruolo + Invio) · 2 campi · 20 sec** | **−50% clic · −50% campi · −66% tempo** |


