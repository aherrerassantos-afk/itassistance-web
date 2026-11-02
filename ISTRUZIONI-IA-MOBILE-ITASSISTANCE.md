# ISTRUZIONI PER L'IA — Versione telefono itassistance

> Da leggere **prima** di qualsiasi modifica al sito `itadreamteam.com` (repo `itassistance-web`).

---

## 1. La regola in una frase

**Sul telefono (≤ 768px) la home mostra la nuova versione itassistance "rete di property manager". Sul PC (≥ 769px) la home resta esattamente com'è oggi.**

Non modificare MAI quello che si vede da PC. Il copy nuovo vive solo dentro `<main class="ita-m">`.

### Posizionamento (cosa siamo)
itassistance è una **rete di property manager** che gestisce appartamenti turistici. Tre specialità:
1. **Front desk / supporto ospiti**: persone vere a Firenze, messaggi Airbnb e Booking IT/EN, reperibilità serale 18–23 (risposta entro 15 min), check-in in persona, reclami gestiti prima della recensione.
2. **Revenue management**: prezzi e soggiorni minimi in base a stagioni, eventi, concorrenza.
3. **Fornitori certificati con contratto d'appalto**: pulizie, biancheria, turnover. Il fornitore principale è **Blue Arroyo S.r.l.** (P.IVA 07480210488, Firenze), società di capitali che risponde del lavoro con il proprio patrimonio: è la garanzia verso il cliente.

---

## 2. Come è fatto (codice)

### 2.1 CSS nel `<head>` di index.html
```html
<style id="ita-mobile">
  .ita-m{display:none}
  @media (max-width:768px){
    .ita-d{display:none!important}
    .ita-m{display:block;padding-bottom:84px}
    /* … stili .ita-m (m-hero, m-card, m-guarantee, m-sticky …) … */
    .checkin-trigger,.pf-trigger{bottom:calc(84px + env(safe-area-inset-bottom))!important}
  }
</style>
```
- `.ita-d` = blocco **desktop** (originale). È aggiunta a tutti i blocchi della home tra la "curtain" e il footer: hero `#home`, `.photo-*`, `#modello`, `#come-funziona`, `#servizi`, `#amenities`, `#pricing`, `#contatti`.
- `.ita-m` = blocco **telefono**. Un solo `<main class="ita-m">` subito prima della sezione hero.
- Footer, chat, pulsante "Istruzioni Check-in PDF" e script restano condivisi.

### 2.2 Aggiungere o cambiare una sezione
```html
<!-- Solo PC: aggiungi ita-d alla classe del blocco di primo livello -->
<section class="ita-d" id="nuova"> … </section>

<!-- Solo telefono: dentro <main class="ita-m"> -->
<section>
  <div class="m-eyebrow">Etichetta</div>
  <h2>Titolo con <em>accento oro.</em></h2>
  <p>Testo…</p>
</section>
```
Componenti già pronti dentro `.ita-m`: `m-btn m-btn--dark`, `m-btn m-btn--line`, `m-list`, `m-card` (con `m-num` e `h3`), `m-guarantee` (sfondo scuro), `m-price`, `m-steps` (lista numerata), `m-pills`, `m-sticky` (barra fissa in basso).

### 2.3 Token di design (riusa, non inventarne di nuovi)
`--navy #111111` · `--gold #C9A84C` · `--beige2 #f5f5f5` · `--serif Playfair Display` · `--sans Inter` · `--rule-dark`, `--rule-light`.

---

## 3. Copy telefono (il 20% più importante)

Ordine: **problema → soluzione (3 pilastri) → garanzia → prezzo → 3 passi → contatti**. Barra fissa con WhatsApp + "Entra nella rete".

1. **Hero**: "La rete di property manager che risponde per te." + "In itassistance gestiamo appartamenti turistici con tre specialità…" + pulsanti Sopralluogo gratuito / Entra nella rete itassistance.
2. **I tuoi problemi** (3): ospiti che scrivono a ogni ora · prezzi fermi mentre il mercato si muove · fornitori senza garanzie.
3. **Le soluzioni itassistance** (3 card): Front desk · Revenue management · Fornitori certificati sotto contratto.
4. **La garanzia itassistance**: Blue Arroyo S.r.l., società di capitali che risponde con il proprio patrimonio. "Dall'inizio i titolari di itassistance hanno capito che…"
5. **Piano partner**: €55/mese per struttura, disdetta mensile. Incluso / a consumo (check-in €20 + IVA, manutenzione €30 + IVA) / su preventivo (revenue management, pulizie e biancheria) / mai (attivazione, commissioni, penali).
6. **Tre passi**: sopralluogo gratuito → contratto online (`contratto.html`) → parte il front desk itassistance.
7. **Contatti**: WhatsApp +39 351 038 0392 · info@itassistance.it · Firenze, risposta entro 24 ore.

### Regole di scrittura
1. Scrivi "itassistance" il più spesso possibile in frasi naturali: "In itassistance pensiamo…", "Nella itassistance lavoriamo per…", "Dall'inizio i titolari di itassistance hanno capito che…", "Con itassistance hai…". Sempre minuscolo: `itassistance`.
2. Concentrati su soluzione e proposta di valore, non sull'estetica (divise, merchandise, città).
3. **Niente numeri o promesse non dimostrabili** sul telefono: niente "300+ partner", "5.0★", "Recensioni 5★ garantite", "24/7", Spagna/Francia/Barcellona/Parigi/Madrid finché non sono reali.
4. **Non usare la parola "assicurazione"** per Blue Arroyo: è un termine regolato. Usa "garanzia", "risponde con il proprio patrimonio". Si potrà citare il capitale sociale con la cifra esatta, o una polizza RC, solo con dati reali forniti dal titolare.
5. Frasi brevi, titoli massimo 8 parole, un'idea per blocco.

---

## 4. Analisi concorrenza: MMega Homes & Villas (mmega.com)

Da **prendere come struttura** (mai copiare i testi):
- Pagina proprietari "Affidaci il tuo immobile": **a chi ci rivolgiamo → i tuoi problemi (4) → le nostre soluzioni (4) → modulo contatto ripetuto**. È lo schema usato sopra (problemi → soluzioni).
- Messaggio chiave: gestione a 360°, team locale presente, zero stress per il proprietario, ottimizzazione prenotazioni e prezzi.
- Forza: dimensioni (~500 proprietà dichiarate), portale prenotazioni diretto, sede fisica in centro, design editoriale serif + bianco.

Dove **itassistance si differenzia** (da far emergere):
- **Canone fisso €55/mese, zero commissioni sulle prenotazioni** (i gestori tradizionali lavorano a percentuale).
- **Rete di property manager**, non un'agenzia unica: il proprietario resta partner.
- **Front desk con persone vere** come servizio specifico, non come voce generica di "assistenza".
- **Fornitori sotto contratto d'appalto** con una società di capitali che risponde del lavoro.

---

## 5. Checklist prima di consegnare

- [ ] A **1280px** la home è identica a prima (hero con "300+ / 5.0★", sezioni divise, merch): `.ita-m` ha `display:none`.
- [ ] A **375px** si vede solo `main.ita-m`; nessuno scroll orizzontale (`document.documentElement.scrollWidth === innerWidth`).
- [ ] A 375px nel testo non ci sono "300+", "24/7", "Spagna".
- [ ] La barra fissa non copre il pulsante "Istruzioni Check-in PDF".
- [ ] Link WhatsApp e `contratto.html` funzionano.
- [ ] Ogni nuovo blocco di primo livello della home ha `ita-d` (PC) oppure sta dentro `.ita-m` (telefono).

---

## 6. COMANDO "falla app mobile" — Regole Vista Utente da Telefono ("App Mobile")

Quando l'utente richiede **"falla app mobile"** per la visualizzazione da smartphone del sito/app, applicare **SEMPRE** le seguenti regole di design e architettura:

### 1. Denominazione ufficiale
- Questa modalità/modifica si chiama **"App Mobile"** (o "Vista App Mobile").

### 2. I 5 Principi di Design Mobile (dalle linee guida visive & schema a Z)
1. **Allineamento a Sinistra (Left-aligned) categorico**:
   - Mai paragrafi o blocchi descrittivi centrati su smartphone. L'allineamento a sinistra rispetta la fisiologia della lettura, crea una linea guida chiara e rende la lettura fluida, riposante ed elegante.
2. **Schema a Z & Punti di ancoraggio visivi**:
   - Sul telefono l'utente non legge parola per parola: salta da un punto all'altro cercando appigli immediati.
   - Usare punti di ancoraggio forti:
     - Numeri grandi per i prezzi (es. `€99`, `€55`).
     - Badge evidenti (es. `★ IL PIÙ SCELTO · ALL-INCLUSIVE`).
     - Elenchi puntati con la parola chiave in grassetto a inizio riga (es. `✓ Check-in: INCLUSI (0€)`).
3. **Semplicità e Contrasto (Cosa fa scappare: troppi font e poco contrasto)**:
   - Massimo 2 font coerenti (`Playfair Display` per titoli d'impatto, `Inter` per testi e numeri).
   - Contrasto netto e leggibile: testo scuro su fondo chiaro, elementi importanti in oro `#C9A84C` o nero profondo `#111111`. Mai scritte microscopiche o grigie sbiadite.
4. **Call to Action (CTA) & Pulsanti 100% entro lo Schermo**:
   - **MAI bottoni che escono lateralmente o vengono tagliati dal viewport**.
   - Tutti i pulsanti su mobile devono avere `width: 100%` o `flex: 1` con `box-sizing: border-box`.
   - Altezza minima del touch target: **48px** per facilitare il clic naturale con il pollice.
   - Barra fissa in basso (`.m-sticky`) sempre accessibile con azioni chiare (WhatsApp / Attiva).
5. **Zero Scroll Orizzontale**:
   - Nessun elemento deve forzare lo scrolling laterale: `document.documentElement.scrollWidth === window.innerWidth` garantito al 100% a 375px e 414px.

### 3. Offerta Commerciale Mobile
- Inserire sempre in evidenza il **Pacco Unico All-Inclusive 99€/mese**:
  - Tutti i servizi operativi inclusi a costo zero (check-in 0€, piccola manutenzione 0€, customer care 24/7, gestione messaggi).
  - Pagamento mese per mese da parte del proprietario, senza vincoli pluriennali né commissioni.
  - Confronto diretto con il Piano Base a consumo (55€/mese).
