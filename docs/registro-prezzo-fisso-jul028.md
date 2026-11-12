# Piano 4 · Itassistance (`itadreamteam.com`) — Registro Eliminazione Prezzo Variabile e Allineamento Quota Fissa Unica `99,00 €/mese` (`JUL-028`)

> **Direttiva Esecutiva:** `JUL-028` — *"Itassistance ha UNA SOLA QUOTA FISSA: `99,00 € / mese` (IVA inclusa) · `1.188,00 € / anno` anticipato. Non esiste più alcun prezzo variabile, dinamico, a scaglioni di saturazione o estratto a sorte."*
> **Riferimento Societario Pubblico Unico (`JUL-009` + `JUL-028` + `JUL-043`):**
> `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, 50122 Firenze (FI) · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.`
> **Recapiti Ufficiali Confermati (`JUL-043` / `JUL-055`):** Assistenza Ospiti: `itassistance@bluearroyo.it` / `+39 349 177 5561` · Amministrazione: `admin@bluearroyo.it` · Collabora con noi / Fornitori: `+39 349 804 1146` / `risorseumane@bluearroyo.it`

---

## 1. Tabella Completa: Cosa è Stato Rimosso / Sostituito, Dove e Perché (`JUL-028`)

| Cosa è stato rimosso / sostituito | Dove (File) | Perché (`Regola JUL-028`) |
| :--- | :--- | :--- |
| Configurazione `minMonthlyEur: 99`, `maxMonthlyEur: 299`, `currentDynamicMonthlyEur: 199`, `managedUnitsCount: 12`, `maxTeamCapacityUnits: 24`, formula saturazione `99 + (299 - 99) * saturazione`, scaglioni volume (`79,00 €`, `59,00 €`) e banner editoriale *"Quotazione Acquisizione Firenze di Oggi · 12 slot disponibili su 24 · 199,00 €/mese"* (`injectEditorialGuideConversionBanner`) | `site-config.js` | **Prezzo Fisso Unico:** `Itassistance` applica esclusivamente la quota fissa di **`99,00 €/mese` IVA inclusa** (`1.188,00 €/anno`). Eliminata ogni logica di prezzo variabile, sconto multi-unità non autorizzato o contatore di slot/saturazione. |
| Riferimenti a range `99,00 € – 299,00 €`, citazioni di canoni medi a `199,00 €/mese`, claim non verificati (*"in 10 minuti al giorno"*, statistiche `75%`, `84%`, `25%`) e FAQ inglese *"Where is your office in Florence?"* | `index.html`, `en/index.html` | **Chiarezza Commerciale & Regola Zero:** le home IT ed EN espongono unicamente **`99,00 €/mese` (`€99.00/month`)** e **`1.188,00 €/anno` (`€1,188.00/year`)**, 0% commissioni sulle prenotazioni e `Via Matteo Palmieri 20R, Firenze` esclusivamente come **Sede legale / Registered legal office**. |
| Box di prezzo dinamico in tempo reale basato sulla saturazione del team, lista d'attesa da saturazione slot e fasce `99–299 €` | `prezzi.html`, `calcola-risparmio.html` | **Trasparenza Listino:** il listino e il simulatore calcolano il risparmio esclusivamente sulla quota fissa unica di **`99,00 €/mese` (`1.188,00 €/anno`)** + eventuale opzione `+10%` Revenue Team solo se attivata dal proprietario. |
| Lettura di parametri URL (`?locked_price=`, `?saturation=`), override da `localStorage` (`ita_admin_forced_dyn_price`) / `sessionStorage` e scaglioni volume (`79 €`, `59 €`) nel calcolo del totale | `checkout.html` | **Blindatura Checkout:** qualsiasi tentativo di passare parametri URL o valori in `localStorage` viene ignorato; il checkout addebita **sempre e solo `99,00 €/mese`** (`1.188,00 €/anno`) per unità. |
| Clausola contrattuale con forbice `99,00 € – 299,00 € / mese determinata dalla saturazione degli slot` | `contratto.html` | **Certezza Contrattuale:** l'Articolo sul Canone nel contratto proprietario e nel modulo `JUL-012` riporta esclusivamente il canone fisso di **`99,00 €/mese` IVA inclusa (`1.188,00 €/anno`)**. |
| Dicitura non conforme su `Via Matteo Palmieri 20R` e range prezzi variabili nelle guide e nei file AI | `chi-siamo.html`, `llms.txt`, `sitemap.xml` + guide editoriali `.html` | **Precisione Legale (`JUL-009` + `JUL-028`):** `Via Matteo Palmieri 20R, Firenze` è indicata **esclusivamente come Sede legale** di `Blue Arroyo S.r.l.`. |
| Pannello *"CONTROLLO DOMANDA FIRENZE (FASE 1 RANDOM) — Quotazione Giornaliera Acquisizione Nuovi Immobili: 199,00 € / mese (2.388,00 € / anno)"*, bottone *"Estrai random (99–299,50 €)"*, funzione `randomPriceStep50` (`Math.random()`) e calcolo ARM a `199,00 €/mese` o `289,50 €` | `admin.html`, `app.html`, `cloud-sync.js`, `todo-admin-engine.js` | **Eliminazione Totale Prezzo Variabile & Random:** rimosso ogni generatore casuale o cursore di prezzo dinamico; la Regia Admin, l'Area Proprietario e la scheda/PDF **Marco Palumbo (`ARM-2026-MP86`)** utilizzano esclusivamente la **Quota Fissa Unica di `99,00 €/mese` (`1.188,00 €/anno`)** (con Netto Proprietario stimato aggiornato a **`€ 1.689,25 / mese`**). |
| Formula matematica di saturazione `99 € + (299 € - 99 €) × (Unità / Capacità)`, esempi a `199,00 €/mese` e fascio `79,00 €/mese` nella documentazione ufficiale | `docs/modello-economico.md`, `docs/commerciale-e-posizionamento.md`, `docs/checklist.csv` | **Allineamento Documentale Master:** tutta la documentazione economica, commerciale e la `Checklist 100` riflettono la sola quota fissa di **`99,00 €/mese` (`1.188,00 €/anno`)**. |

---

## 2. Riepilogo Listino Ufficiale Unico di `Itassistance` (`JUL-028`)

| Voce di Listino Ufficiale | Importo Ufficiale Unico | Regola di Applicazione |
| :--- | :---: | :--- |
| **Canone Mensile Piattaforma & Coordinamento Operativo PM (`Itassistance` · `JUL-035`)** | **`99,00 € / mese`** *(IVA inclusa)* | Quota fissa unica precompilata per ogni proprietario, focalizzata sul coordinamento della parte operativa del PM (senza foto-report) e con `0%` commissioni sulle prenotazioni nel piano base. |
| **Canone Annuale Anticipato (`Itassistance`)** | **`1.188,00 € / anno`** *(IVA inclusa)* | Pari a 12 mensilità a `99,00 €/mese`, con 14 giorni di prova gratuita / Garanzia 14 giorni Soddisfatto o Rimborsato (100%) e disdetta libera senza penali. |
| **Opzione Extra Revenue Plan (`JUL-035`)** | **`+10%` sul netto spettante al proprietario prima delle sue tasse personali** *(Opzionale)* | Applicata **solo se il proprietario sceglie il Revenue Plan** (incasso dell'ospite al netto di commissioni delle piattaforme, imposta di soggiorno e costi di pulizia; fattura emessa a fine mese sulle prenotazioni del mese). Se non attivata: **`0%`**. |
| **Check-in di Persona in Presenza a Firenze** *(a consumo)* | **`20,00 €`** *(IVA inclusa)* | Tariffa trasparente pass-through a singolo intervento su richiesta. |
| **Piccola Manutenzione Ordinaria a Firenze (`JUL-010`)** *(a consumo)* | **`30,00 €`** *(IVA inclusa)* | Tariffa base a uscita (+ eventuale supplemento urgenza/materiali approvato). |
| **Pulizie Turnover & Biancheria Certificata (`PBA – Palazzo by Blue Arroyo`)** | **100% Pass-Through (0% ricarico)** | Addebitate al costo vivo del listino `PBA` (es. `86,00 €` trilocale Marco Palumbo `ARM-2026-MP86`). |

---

## 3. Verifica Automatica Playwright (`tests/verify-jul027-jul028-seo-fixed-price.spec.js`)

Il test automatico certifica ad ogni rilascio che:
1. Su `index.html`, `en/index.html`, `prezzi.html`, `checkout.html`, `contratto.html`, `calcola-risparmio.html`, `app.html` e `admin.html` l'unico canone mostrato è **`99,00 €/mese`** (`1.188,00 €/anno`) e non compaiono mai `199,00 €`, `299,00 €`, `289,50 €` né `"slot disponibili su 24"`.
2. Anche forzando `/checkout.html?locked_price=249&saturation=75` e `localStorage.setItem('ita_admin_forced_dyn_price', '249')`, il checkout mantiene **sempre e solo `99,00 €/mese` (`1.188,00 €/anno`)**.
3. `Via Matteo Palmieri 20R` compare esclusivamente come **Sede legale / Registered legal office** in `en/index.html` e `chi-siamo.html`.
4. I tag SEO (`<title>`, `<meta name="description">`, `<link rel="canonical">`, `JSON-LD` con `"price": "99.00"`) sono presenti e validi.
