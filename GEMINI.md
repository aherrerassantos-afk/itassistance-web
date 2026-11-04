# REGOLA BASE PERMANENTE - IL DESIGN NON SI TAGLIA MAI

Questa regola vale per ogni progetto, pagina, componente e modifica, e ha priorità su qualsiasi scelta estetica. Rileggila prima di ogni intervento (insieme a `SITE_RULES.md`).

## OBIETTIVO
Su ogni schermo devono restare completamente visibili e utilizzabili: logo, menu hamburger, bottoni, testi, bordi, schede, immagini importanti, tabelle e finestre.

Se un elemento non entra, il layout deve adattarsi: va a capo, si impila o passa al livello successivo della cipolla. Non deve mai essere tagliato, rimpicciolito fino a diventare illeggibile o spinto fuori schermo.

## FASE 1 - CONTROLLO INIZIALE
Prima di modificare il codice:
1. Apri il progetto alle larghezze indicate sotto.
2. Trova ogni elemento che esce dallo schermo o viene tagliato.
3. Identifica la causa nel codice.
4. Correggi la causa nel componente condiviso, non con eccezioni pagina per pagina.

## BASE TECNICA OBBLIGATORIA
- Meta viewport: `width=device-width, initial-scale=1, viewport-fit=cover`.
- Imposta `box-sizing: border-box` su tutti gli elementi.
- Progetta prima per il telefono, poi amplia per schermi maggiori.
- Usa `flex` e `grid` con `gap`, `min-width: 0` sui figli e dimensioni fluide.
- Immagini, video, iframe e SVG: `max-width: 100%`.
- Margini laterali della pagina: `max(16px, env(safe-area-inset-left))` a sinistra e `max(16px, env(safe-area-inset-right))` a destra.
- Rispetta anche le aree sicure in alto e in basso.
- Altezze a schermo intero: usa `dvh` o `svh`.

## VIETATO
- Usare `100vw` per la larghezza dei contenitori.
- Impostare `width` o `min-width` fissi che superano lo schermo.
- Usare margini negativi o `transform` che portano contenuti fuori dallo schermo.
- Usare `overflow: hidden` o `overflow-x: hidden` su `html` e `body` per nascondere il problema.
- Usare `white-space: nowrap` su testi lunghi senza verificare che entrino.
- Posizionare header, menu o bottoni con coordinate fisse o `position: absolute`.
- Bloccare lo zoom con `user-scalable=no` o `maximum-scale=1`.

## HEADER E MENU HAMBURGER
- Struttura consigliata: `grid-template-columns: auto minmax(0, 1fr) auto`.
- Hamburger: area di almeno `48 x 48 px`, sempre interamente visibile e con `flex-shrink: 0`.
- Logo: si adatta allo spazio disponibile senza spingere l'hamburger fuori.
- Header e icone rispettano i margini laterali e le aree sicure.
- Il menu aperto occupa la larghezza disponibile e scorre verticalmente se le voci sono tante.
- Il bottone di chiusura e tutte le voci restano raggiungibili anche con schermo basso o in orizzontale.

## BORDI, SCHEDE E COMPONENTI LARGHI
- Schede e pannelli: `width: 100%`, `max-width: 100%`. Tutti e quattro i bordi devono restare visibili.
- Le ombre non devono essere tagliate dai contenitori.
- Tabelle: su telefono diventano schede. Se una tabella deve restare tale, solo la tabella scorre dentro il proprio contenitore.
- Calendari, tab e filtri: adattali al telefono oppure rendi chiaro lo scorrimento interno, senza far scorrere la pagina.
- Finestre e pannelli: larghezza entro lo schermo, altezza massima `90dvh`, scroll interno e chiusura sempre visibile.
- Testi lunghi, URL e codici: usa `overflow-wrap: anywhere` dove serve.
- Immagini importanti: non usare `object-fit: cover` se taglia volti, prodotti o testi. Prevedi un'inquadratura per telefono o usa `object-fit: contain`.

## TEST OBBLIGATORI DOPO OGNI MODIFICA
Esegui il comando `npm run check:mobile` con Playwright su tutte le pagine pubbliche e interne, con menu e finestre sia chiusi sia aperti, in ogni lingua e ruolo disponibile.

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
