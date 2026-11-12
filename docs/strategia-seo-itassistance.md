# Strategia SEO & Deep Search Multilingua — Piano 4 · Itassistance (`itadreamteam.com`) — `JUL-027` & `JUL-028`

> **Piano & Progetto:** `Piano 4 · Itassistance` (`https://www.itadreamteam.com`)
> **Riferimento Societario Pubblico Ufficiale (`JUL-009` — Regola Zero):**
> `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, 50122 Firenze (FI) · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.`
> **Contatti Ufficiali Confermati (`JUL-043` / `JUL-055`):** Assistenza Ospiti: `itassistance@bluearroyo.it` / `+39 349 177 5561` · Amministrazione: `admin@bluearroyo.it` · Collabora con noi / Fornitori: `+39 349 804 1146` / `risorseumane@bluearroyo.it`
> **Modello Tariffario Unico (`JUL-028`):** **Quota Fissa Unica `99,00 € / mese` (IVA inclusa)** · **`1.188,00 € / anno` anticipato** · **`0%` commissioni sulle prenotazioni** (opzione **Extra Revenue Team `+10%`** solo su richiesta esplicita).

---

## 1. Analisi dello Screenshot Google di Julian e Stato Attuale SERP (`itadreamteam.it` vs `itadreamteam.com`)

### 1.1 Le due voci indicizzate su Google (Screenshot SERP di Julian)
Quando si cerca su Google la query di brand/dominio `itadreamteam.it`, il motore restituisce le due pagine principali del dominio attivo `https://www.itadreamteam.com`:

| # | URL Indicizzato | `<title>` Precedente (Pre-`JUL-027`/`JUL-028`) | Nuovo `<title>` Ottimizzato e Conforme a Regola Zero (`JUL-027` + `JUL-028`) |
| :-: | :--- | :--- | :--- |
| **1 (IT)** | `https://www.itadreamteam.com/` | *"itassistance – Gestisci il tuo affitto breve a Firenze in 10 minuti al giorno \| 99 €/mese"* | **`Itassistance Firenze – Gestione Operativa Affitti Brevi e Alternativa all'Agenzia \| 99,00 €/mese (0% Commissioni)`** |
| **2 (EN)** | `https://www.itadreamteam.com/en/` | *"itassistance – Manage Your Short-Term Rental in Florence in 10 Minutes a Day \| €99/month"* | **`Itassistance Florence – Short-Term Rental Operational Management & Agency Alternative \| €99.00/month (0% Commission)`** |

### 1.2 Analisi Tecnica Dominio `itadreamteam.it` vs `itadreamteam.com`
- **Dominio Canonico Attivo:** tutti i tag `<link rel="canonical">`, `sitemap.xml`, `robots.txt`, `llms.txt` e il deploy Vercel puntano a **`https://www.itadreamteam.com`**.
- **Perché Google mostra `itadreamteam.com` cercando `itadreamteam.it`:** Google applica il matching lessicale sul radicale di brand `itadreamteam` e associa i risultati IT (`/`) ed EN (`/en/`) del dominio `.com`.
- **Azione / Proposta Tecnica per Julian (`[DA CONFERMARE]`):**
  1. Verificare con Julian se i domini **`itadreamteam.it`**, **`itassistance.it`** e **`itassistance.com`** sono già nella disponibilità di `Blue Arroyo S.r.l.` (`[DA CONFERMARE]`).
  2. In caso affermativo, configurare su DNS/Vercel un **Redirect `301 Moved Permanently`** (`https://itadreamteam.it/*` e `https://www.itadreamteam.it/*` → `https://www.itadreamteam.com/$1`), mantenendo **`https://www.itadreamteam.com`** come unico dominio canonico per non disperdere l'autorità SEO già acquisita.

---

## 2. Audit Tecnico e On-Page (Prima vs Dopo i Quick Win `JUL-027` + `JUL-028`)

### 2.1 Architettura Multilingua Attuale
- **Italiano (`/` + 24 pagine pubbliche verticali):** copre l'intero ecosistema semantico di Firenze (gestione operativa, prezzi a quota fissa `99,00 €/mese`, calcolatore risparmio, alternativa al property manager al 20–25%, Alloggiati Web, CIN/BDSR, ISTAT Ross1000, tassa di soggiorno Firenze, cedolare secca 21%/26%, pulizie e manutenzione a Firenze, check-in in presenza `20,00 €` e manutenzione `30,00 €`).
- **Inglese (`/en/index.html`):** presidia le query internazionali ad alto valore (`"florence short term rental management"`, `"airbnb management florence"`, `"florence property management alternative"`).
- **Portale Ospiti Bilingue (`/ospiti.html` IT/EN):** dedicato al self check-in Art. 109 TULPS.
- *(In conformità alla Regola Zero, nessuna lingua aggiuntiva non richiesta è stata pubblicata senza conferma di Julian; il piano di espansione ES/FR/DE ed EN esteso è pronto nella Sezione 5 — Fase P2).*

### 2.2 Matrice Audit On-Page, Tecnico & GEO (AI Search)

| Componente SEO / GEO | Stato Precedente | Intervento Eseguito (`JUL-027` + `JUL-028`) |
| :--- | :--- | :--- |
| **`<title>` & `<meta name="description">`** | Contenevano promesse non misurabili (*"in 10 minuti al giorno"*) e riferimenti a fasce variabili `99–299 €` | Riscritti con focus su **`Itassistance Firenze`**, intento **`Alternativa all'Agenzia Affitti Brevi Firenze`**, **`Quota Fissa 99,00 €/mese`** e **`0% Commissioni`** |
| **Gerarchia `H1` / `H2` e URL parlanti** | Alcuni `H2`/box citavano scaglioni di saturazione e slot rimasti | Allineati a un solo `H1` per pagina con keyword primaria + `H2` semantici su **Canone Fisso Unico `99,00 €/mese`**, servizi pass-through e conformità Firenze |
| **`canonical` & `hreflang` (`it`, `en`, `x-default`)** | Presenti sulle home ma da blindare su tutte le viste e nella sitemap | Allineati `<link rel="canonical">`, `hreflang="it"`, `hreflang="en"` e `hreflang="x-default"` tra `/` e `/en/` e dentro `sitemap.xml` |
| **`robots.txt` & `llms.txt` (GEO / AI Search)** | `llms.txt` riportava diciture miste e range prezzi | Aggiornato `robots.txt` con apertura esplicita ai crawler AI (`GPTBot`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`) e `llms.txt` con **sola Sede legale `Via Matteo Palmieri 20R, Firenze`** e **quota fissa unica `99,00 €/mese`** |
| **Dati Strutturati `JSON-LD` (`Schema.org`)** | Alcuni snippet riportavano range `99–299` o indirizzi operativi | Uniformati `Organization`, `LocalBusiness` (solo Sede legale `Via Matteo Palmieri 20R, 50122 Firenze`), `SoftwareApplication` / `Service` (`"price": "99.00"`, `"priceCurrency": "EUR"`), `FAQPage` e `BreadcrumbList`; **zero `aggregateRating` inventati** |
| **Open Graph (`og:*`) & Twitter Card** | Titoli e descrizioni non allineati a `JUL-028` | Allineati su tutte le pagine principali IT ed EN con prezzo fisso `99,00 €/mese` e 0% commissioni |
| **Core Web Vitals & Mobile Layout** | Già ottimizzati (`check:mobile` e `check:layout`) | Mantenuto zero layout shift (`CLS = 0`), font con `display=swap`, zero scroll orizzontale (`scrollWidth <= clientWidth` da `320px` a `2560px`) |

---

## 3. Avvertenza Legale & Regola Zero (Posizionamento su `"agenzia affitti brevi Firenze"`)

### 3.1 Perché Itassistance NON deve mai dichiararsi "Agenzia di Intermediazione Immobiliare"
Ai sensi del Contratto Ufficiale di Servizio (`/contratto.html` e `docs/contratti-e-accordi-legali.md`), `Blue Arroyo S.r.l.` (`Itassistance`):
1. **Esclude espressamente l'attività di intermediazione immobiliare** (ex L. 39/1989 e Codice Civile), non stipula contratti di locazione in nome proprio né incassa i canoni di soggiorno degli ospiti (che transitano direttamente sui conti del Proprietario).
2. **Non applica alcuna commissione percentuale sulle prenotazioni (`0%`)** nel piano base e non applica mai commissioni sull'ospite turistico.
3. Fornisce una **piattaforma tecnologica e un servizio di gestione operativa e coordinamento** per proprietari-gestori e strutture ricettive a Firenze.

### 3.2 Formula Editoriale e SEO Veritiera per Presidiare `"agenzia affitti brevi Firenze"`
Per intercettare con il massimo CTR tutti i proprietari che cercano su Google `"agenzia affitti brevi Firenze"`, `"property management Firenze"` o `"gestione Airbnb Firenze"` senza violare la qualifica giuridica del servizio, viene adottata su titoli, H1/H2, meta description e JSON-LD la seguente **formula ufficiale veritiera**:

> *"Itassistance — Servizio di gestione operativa e assistenza per affitti brevi a Firenze (`Blue Arroyo S.r.l.`): l'alternativa trasparente all'agenzia tradizionale a quota fissa di `99,00 €/mese` IVA inclusa (`1.188,00 €/anno`) e `0%` commissioni sulle prenotazioni."*

### 3.3 Claim Non Verificati Rimossi (`Regola Zero – Solo Info Vera`)
In esecuzione di `JUL-009`, `JUL-027` e `JUL-028`, sono stati **definitivamente rimossi** da meta tag, titoli, testi, script e JSON-LD:
- Il claim temporale non certificabile: `❌ "in 10 minuti al giorno"` / `❌ "in 10 Minutes a Day"`.
- Le statistiche di mercato non accompagnate da fonte primaria verificata: `❌ "il 75% dei proprietari gestisce..."`, `❌ "l'84% degli host..."`, `❌ "il 25% genera il 37–38%"`.
- Ogni prezzo variabile, range o contatore di scarsità: `❌ "99,00 € – 299,00 €"`, `❌ "199,00 €/mese"`, `❌ "12 slot disponibili su 24"`, `❌ "prezzo bloccato prima dello scatto di fascia"`.
- Qualsiasi menzione pubblica di sedi operative o magazzini:
  - Nei dati strutturati `JSON-LD`, nel footer, in `chi-siamo.html`, in `llms.txt` e nella FAQ inglese (`"What is your registered legal address in Florence?"` in `/en/index.html`) compare **esclusivamente**:
    **`Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, 50122 Firenze (FI) · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.`**.
  - `Via dell'Agnolo 72R, Firenze` resta confinato **esclusivamente ad uso interno operativo** e non compare mai sul sito pubblico.

---

## 4. Deep Search Competitor & Mappa Keyword → Pagina (`IT` & `EN`)

### 4.1 Analisi Competitiva SERP Firenze
I principali player posizionati su Firenze per *"gestione affitti brevi Firenze"* e *"property manager Firenze"* (es. CleanBnB, HostPlace, Apartments Florence, MMega, Geco, Halldis) operano con un modello a **commissione percentuale tra il `18%` e il `30%` + IVA** sull'incasso lordo o netto delle prenotazioni (pari a `6.000 € – 9.500 € / anno` per un appartamento nel Centro Storico di Firenze).
**Vantaggio Competitivo Unico di `Itassistance` in SERP:**
- **Prezzo chiaro nello snippet Google:** **`99,00 €/mese` fisso (`1.188,00 €/anno`)** contro il `20–25%` delle agenzie tradizionali.
- **Servizi operativi a Firenze a tariffa trasparente pass-through:** Check-in di persona a **`20,00 €`**, Piccola manutenzione a **`30,00 €`**, Pulizie e biancheria certificata **`PBA – Palazzo by Blue Arroyo`** al costo vivo senza ricarichi.

### 4.2 Tabella Master Keyword → Intento → Volume/Difficoltà → Pagina Associata (`itadreamteam.com`)

| Cluster & Keyword Target (IT / EN) | Intento di Ricerca | Volume Qualitativo | Difficoltà SEO | Pagina Canonica Associata su `itadreamteam.com` |
| :--- | :--- | :---: | :---: | :--- |
| **`itassistance`**, **`itassistance firenze`**, **`itadreamteam`**, **`blue arroyo firenze`** | Navigazionale / Brand | Alto (Brand) | Bassa | `/` (`index.html`) e `/chi-siamo.html` |
| **`agenzia affitti brevi firenze`**, **`alternativa agenzia affitti brevi firenze`**, **`alternativa property manager firenze`** | Commerciale / Transazionale | Molto Alto | Media-Alta | `/alternativa-property-manager.html` *(con redirect 301 da `/agenzia-affitti-brevi-firenze`)* e `/` |
| **`gestione affitti brevi firenze`**, **`gestione appartamento airbnb firenze`**, **`gestione casa vacanze firenze`** | Transazionale | Molto Alto | Alta | `/` (`index.html`) e `/gestire-affitto-breve-senza-property-manager.html` |
| **`prezzi gestione affitti brevi firenze`**, **`gestione airbnb canone fisso 99 euro`**, **`commissioni property manager firenze`** | Commerciale / Confronto | Medio-Alto | Media | `/prezzi.html` e `/commissioni-property-manager-firenze.html` |
| **`calcolo guadagno affitto breve firenze`**, **`simulatore risparmio property manager firenze`** | Transazionale / Tool | Medio | Bassa | `/calcola-risparmio.html` |
| **`florence short term rental management`**, **`airbnb management florence`**, **`property management florence italy`** | Transazionale Internazionale (EN) | Alto (Int.) | Media | `/en/` (`en/index.html`) |
| **`check-in affitti brevi firenze`**, **`accoglienza ospiti airbnb firenze`**, **`self check-in firenze normativa`** | Commerciale / Operativo | Medio-Alto | Media | `/servizi-check-in-e-manutenzione-firenze.html` |
| **`pulizie affitti brevi firenze`**, **`manutenzione appartamenti turistici firenze`**, **`lavanderia case vacanze firenze`** | Commerciale / Operativo | Alto | Media | `/pulizie-e-manutenzione-affitti-brevi-firenze.html` |
| **`alloggiati web firenze`**, **`invio schedine questura firenze affitti brevi`** | Informazionale / Compliance | Alto | Media-Bassa | `/registrazione-ospiti-alloggiati-web.html` e `/alloggiati-web-firenze-guida.html` |
| **`tassa di soggiorno firenze affitti brevi`**, **`imposta di soggiorno firenze calcolo`** | Informazionale / Compliance | Alto | Media-Bassa | `/tassa-soggiorno-firenze-affitti-brevi.html` e `/imposta-di-soggiorno-firenze.html` |
| **`codice cin affitti brevi firenze`**, **`bdsr cin toscana obblighi`** | Informazionale / Normativo | Molto Alto | Media | `/cin-affitti-brevi-firenze.html` e `/codice-cin-affitti-brevi-obblighi.html` |
| **`istat ross1000 firenze`**, **`flussi turistici toscana affitti brevi`** | Informazionale / Compliance | Medio | Bassa | `/istat-ross1000-firenze.html` e `/comunicazione-istat-flussi-turistici.html` |
| **`cedolare secca affitti brevi 21 26`** | Informazionale / Fiscale | Alto | Media | `/cedolare-secca-affitti-brevi-21-26.html` |
| **`contratto gestione operativa affitti brevi firenze`**, **`contratto servizio property management canone fisso firenze`** | Commerciale / Legale (`JUL-011`/`JUL-012`/`JUL-035`) | Medio | Bassa | `/contratto.html` e `/contratti/contratto-servizio-itassistance.pdf` |

---

## 5. Piano Nuove Pagine / Landing da Associare (Priorità `P1` / `P2` / `P3`)

### Priorità `P1` — Attive Subito e Ottimizzate (`JUL-027` + `JUL-028`)
1. **Cluster Principale IT (`25 pagine pubbliche` indicizzate in `sitemap.xml`):** tutte allineate alla quota fissa unica di **`99,00 €/mese` (`1.188,00 €/anno`)**, con banner di conversione editoriale aggiornato a `99,00 €/mese`, link interni incrociati verso `/prezzi.html`, `/calcola-risparmio.html` e `/checkout.html`, e redirect `301` in `vercel.json` per gli slug SEO (`/agenzia-affitti-brevi-firenze`, `/gestione-affitti-brevi-firenze`, `/property-management-firenze`).
2. **Landing Internazionale EN (`/en/index.html`):** ottimizzata con JSON-LD, FAQ sede legale corretta e quota fissa `€99.00/month` (`€1,188.00/year`).

### Priorità `P2` — Espansione Multilingua (`EN` esteso + `FR / ES / DE`) *(Proposta per Julian — `[DA CONFERMARE]`)*
Per catturare i proprietari esteri che possiedono immobili a Firenze:
1. `/en/pricing.html` — *Fixed-Fee €99/month Short-Term Rental Management Pricing in Florence*
2. `/en/florence-property-management-alternative.html` — *Why Pay 20–25% Commission? The €99/month Alternative in Florence*
3. `/en/check-in-and-maintenance-florence.html` — *In-Person Guest Check-In (€20) & On-Demand Maintenance (€30) in Florence*
4. `/en/florence-short-term-rental-laws-cin-alloggiati.html` — *Complete Guide to CIN, Alloggiati Web, Ross1000 & Tourist Tax in Florence*
5. Landing dedicate per investitori francofoni (`/fr/`), ispanofoni (`/es/`) e tedeschi (`/de/`).

### Priorità `P3` — Landing Locali per Quartieri di Firenze (`ZTL & Centro UNESCO`)
1. `/gestione-affitti-brevi-oltrarno-santo-spirito-firenze.html`
2. `/gestione-affitti-brevi-santa-croce-sant-ambrogio-firenze.html`
3. `/gestione-affitti-brevi-duomo-signoria-firenze.html`
4. `/gestione-affitti-brevi-santa-maria-novella-san-lorenzo-firenze.html`

---

## 6. KPI SEO Monitorati & Punti `[DA CONFERMARE]` con Julian

- **KPI Tecnici & Organici:**
  - `100%` pagine in `sitemap.xml` con codice `200 OK`, `<link rel="canonical">` univoco e JSON-LD valido.
  - Posizionamento Top 3 per query di brand (`itassistance`, `itassistance firenze`, `itadreamteam`) e crescita impression/clic su Google Search Console per i cluster *"alternativa agenzia affitti brevi firenze"* e *"gestione affitti brevi firenze canone fisso"*.
- **Punti `[DA CONFERMARE]` con Julian:**
  1. **Dominio `itadreamteam.it` / `itassistance.it`:** confermare se sono registrati per attivare il Redirect 301 verso `https://www.itadreamteam.com` (`[DA CONFERMARE]`).
  2. **Google Search Console & Google Business Profile:** confermare l'invio della nuova `sitemap.xml` e la verifica della scheda Google Business sulla sola Sede legale `Via Matteo Palmieri 20R, Firenze` (`[DA CONFERMARE]`).
  3. **Avvio Fase `P2` Multilingua:** confermare quali lingue/sottopagine (`EN` esteso, `ES`, `FR`, `DE`) pubblicare nel prossimo sprint (`[DA CONFERMARE]`).
