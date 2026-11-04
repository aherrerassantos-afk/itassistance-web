# ISTRUZIONI PER L'IA — Regole Permanenti itassistance (`SITE_RULES.md`)

> Da leggere **prima** di qualsiasi modifica al sito `itadreamteam.com` (repo `itassistance-web`). Consultare sempre anche `SITE_RULES.md` e `/site-config.js`.

## 1. Il Modello di Business (Fonte di Verità)
- **Prodotto:** `itassistance` è un'app che gestisce l'appartamento in affitto breve e guida il proprietario in tutta la parte operativa, fiscale e amministrativa.
- **Per chi:** proprietari che NON hanno un property manager e vogliono tenere sotto mano il proprio appartamento senza pagare il 18–25% di commissione.
- **Promessa:** il lavoro del proprietario diventa di circa **10 minuti al giorno**. Ogni mattina alle 08:00 l'app invia il report del giorno con le cose da fare per essere in regola (Alloggiati Web Polizia di Stato, tassa di soggiorno, comunicazioni obbligatorie, pagamento fornitori).
- **Prezzo:** **99 € al mese (IVA inclusa)**, fisso per appartamento. Zero commissioni sulle prenotazioni nel piano base.
- **Extra opzionale (+10%):** disponibile come aggiunta opzionale se il cliente desidera delegare anche il **Revenue Management e gli adempimenti di legge**.
- **Pagamento e Garanzia:** pagabile mese per mese (99 €/mese) oppure annuale anticipato (1.188 €/anno IVA inclusa), senza vincoli e con disdetta libera. **Garanzia 14 giorni Soddisfatto o Rimborsato** (rimborso 100% se disdici entro 14 giorni).
- **Tre Pilastri:** **CONTROLLO** · **SEMPLICITÀ** · **RISPARMIO**.

## 2. Regole di Coerenza e Marchio
1. **Marchio:** sempre e solo `itassistance` (minuscolo, una parola). Vietati `it.assistance`, `it.`, `itassitance`, `ITASSISTANCE`.
2. **Fonte unica dati:** tutti i prezzi, orari e contatti vengono da `/site-config.js`.
3. **Orari assistenza:** `Tutti i giorni dalle 09:00 alle 23:00` (mai scrivere `24/7`).
4. **Contatti unici:** Telefono e WhatsApp `+39 351 038 0392` · Email `info@itadreamteam.com`.
5. **Ragione sociale:** `Blue Arroyo SRL`, P.IVA `07480210488`, Via Matteo Palmieri 20r, 50122 Firenze (FI) — solo nel footer, termini/contratto, privacy e fatture.
6. **PDF Check-in:** una sola lingua per documento (`it` oppure `en`), zero segnaposto vuoti (`N/A`, `()`, `—`). Se un dato manca, la riga viene omessa.

## 3. Regola Generale Obbligatoria Dopo Ogni Deploy
- **Dopo ogni deploy**, presenta sempre:
  1. **Check di cosa è stato fatto** (allineamento con la visione `itassistance`).
  2. **Suggerimento del passaggio successivo più efficace** (nuove funzioni da implementare, integrazioni backend/automazioni, o miglioramenti ad alto impatto sul funnel) per mantenere una tabella di marcia chiara ed efficace.
- **REGOLA PERMANENTE SEO + GEO (POSIZIONAMENTO MOTORI DI RICERCA E IA)**:
  - Tutte le pagine pubbliche devono avere contenuto principale scritto nell'HTML statico (leggibile senza JS), struttura "Risposta Prima" in apertura, data di aggiornamento visibile, FAQ reali e Schema.org JSON-LD (`Organization`, `LocalBusiness`, `SoftwareApplication`, `Article`, `FAQPage`, `BreadcrumbList`).
  - `robots.txt` consente esplicitamente i bot di ricerca e IA (`Googlebot`, `Bingbot`, `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `PerplexityBot`, `Claude-SearchBot`, `Claude-User`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`) e rimanda a `sitemap.xml` e `/llms.txt`.
  - Dopo ogni deploy eseguire la checklist SEO/GEO e includere nel riepilogo la riga **`SEO/GEO: ok`** (o l'elenco dei problemi risolti).

## 4. REGOLA BASE PERMANENTE — IL DESIGN NON SI TAGLIA MAI
Questa regola vale per ogni progetto, pagina, componente e modifica, e ha priorità su qualsiasi scelta estetica. Rileggila prima di ogni intervento.

- **OBIETTIVO:** Su ogni schermo devono restare completamente visibili e utilizzabili: logo, menu hamburger, bottoni, testi, bordi, schede, immagini importanti, tabelle e finestre. Se un elemento non entra, il layout deve adattarsi: va a capo, si impila o passa al livello successivo della cipolla. Non deve mai essere tagliato, rimpicciolito fino a diventare illeggibile o spinto fuori schermo.
- **FASE 1 — CONTROLLO INIZIALE (Prima di modificare il codice):**
  1. Apri il progetto alle larghezze indicate sotto.
  2. Trova ogni elemento che esce dallo schermo o viene tagliato.
  3. Identifica la causa nel codice.
  4. Correggi la causa nel componente condiviso, non con eccezioni pagina per pagina.
- **BASE TECNICA OBBLIGATORIA:**
  - Meta viewport: `width=device-width, initial-scale=1, viewport-fit=cover`.
  - Imposta `box-sizing: border-box` su tutti gli elementi.
  - Progetta prima per il telefono, poi amplia per schermi maggiori.
  - Usa `flex` e `grid` con `gap`, `min-width: 0` sui figli e dimensioni fluide.
  - Immagini, video, iframe e SVG: `max-width: 100%`.
  - Margini laterali della pagina: `max(16px, env(safe-area-inset-left))` a sinistra e `max(16px, env(safe-area-inset-right))` a destra.
  - Rispetta anche le aree sicure in alto e in basso.
  - Altezze a schermo intero: usa `dvh` o `svh`.
- **VIETATO:**
  - Usare `100vw` per la larghezza dei contenitori.
  - Impostare `width` o `min-width` fissi che superano lo schermo.
  - Usare margini negativi o `transform` che portano contenuti fuori dallo schermo.
  - Usare `overflow: hidden` o `overflow-x: hidden` su `html` e `body` per nascondere il problema.
  - Usare `white-space: nowrap` su testi lunghi senza verificare che entrino.
  - Posizionare header, menu o bottoni con coordinate fisse o `position: absolute`.
  - Bloccare lo zoom con `user-scalable=no` o `maximum-scale=1`.
- **HEADER E MENU HAMBURGER:**
  - Struttura consigliata: `grid-template-columns: auto minmax(0, 1fr) auto`.
  - Hamburger: area di almeno `48 x 48 px`, sempre interamente visibile e con `flex-shrink: 0`.
  - Logo: si adatta allo spazio disponibile senza spingere l'hamburger fuori.
  - Header e icone rispettano i margini laterali e le aree sicure.
  - Il menu aperto occupa la larghezza disponibile e scorre verticalmente se le voci sono tante.
  - Il bottone di chiusura e tutte le voci restano raggiungibili anche con schermo basso o in orizzontale.
- **BORDI, SCHEDE E COMPONENTI LARGHI:**
  - Schede e pannelli: `width: 100%`, `max-width: 100%`. Tutti e quattro i bordi devono restare visibili.
  - Le ombre non devono essere tagliate dai contenitori.
  - Tabelle: su telefono diventano schede. Se una tabella deve restare tale, solo la tabella scorre dentro il proprio contenitore.
  - Calendari, tab e filtri: adattali al telefono oppure rendi chiaro lo scorrimento interno, senza far scorrere la pagina.
  - Finestre e pannelli: larghezza entro lo schermo, altezza massima `90dvh`, scroll interno e chiusura sempre visibile.
  - Testi lunghi, URL e codici: usa `overflow-wrap: anywhere` dove serve.
  - Immagini importanti: non usare `object-fit: cover` se taglia volti, prodotti o testi. Prevedi un'inquadratura per telefono o usa `object-fit: contain`.
- **TEST OBBLIGATORI DOPO OGNI MODIFICA (`npm run check:mobile`):**
  - Eseguire `npm run check:mobile` con Playwright su tutte le pagine pubbliche e interne, con menu e finestre sia chiusi sia aperti, in ogni lingua e ruolo disponibile.
  - Dimensioni: `320 x 568`, `360 x 800`, `390 x 844`, `430 x 932`, `768 x 1024`, `844 x 390` (telefono orizzontale).
  - Motori: Chromium con profilo telefono Android e WebKit con profilo iPhone.
  - Il test deve fallire se: (1) `document.documentElement.scrollWidth > clientWidth`; (2) un elemento visibile ha `left < 0` o `right > larghezza dello schermo`, salvo contenuti dentro uno scroller intenzionale; (3) hamburger, logo o bottoni principali non sono interamente visibili; (4) un testo o controllo risulta tagliato dal contenitore; (5) un elemento cliccabile è coperto da un altro.

