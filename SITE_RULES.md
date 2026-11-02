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
