# Piano 4 · Itassistance (itadreamteam.com) — Registro Cleaning JUL-009 (Regola Zero – Solo Info Vera)

> **Direttiva Esecutiva:** `JUL-009 (REGOLA ZERO – SOLO INFO VERA)`
> **Piano & Progetto:** `Piano 4 · Itassistance` (`itadreamteam.com`) — Numerazione ufficiale ripristinata: `Piano 1 · Toscan Costruzioni`, `Piano 2 · PBA`, `Piano 3 · SmartsBookings`, `Piano 4 · Itassistance`.
> **Unico Riferimento Societario Pubblico / Contrattuale Autorizzato:**
> `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.`
> **Regola Magazzino (`Via dell'Agnolo 72R, Firenze`):** rimosso da tutte le pagine pubbliche, contratti e informative clienti; mantenuto **ESCLUSIVAMENTE** per uso interno operativo di logistica/biancheria nei documenti interni (`docs/collaudo-dec16-e-operativita.md`, `docs/sistema-contabile-gabriela-holding.md`, `docs/checklist.csv`).

---

## 1. Tabella Completa Rimozioni e Sostituzioni (`JUL-009`)

| Rimosso / Sostituito | Dove (file + riga) | Perché (Regola JUL-009) |
| :--- | :--- | :--- |
| Dicitura inventata `"3 Hub ZTL"` (`Centro/Santa Croce HQ`, `Oltrarno`, `Stazione/San Lorenzo/SMN`) e indirizzo pubblico del magazzino `Via dell'Agnolo 72R` nei footer/sezioni pubbliche | `index.html` (L88–L142, L520–L610), `en/index.html` (L85–L140, L490–L560) | **Blocco 1 & 2 JUL-009:** non esistono i `"3 Hub ZTL"`; sul sito pubblico è ammessa solo la sede legale `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1`. |
| Testimonial, recensioni con nomi/cognomi fittizi, badge non certificati e contatori social/clienti non verificati | `index.html` (L310–L415), `prezzi.html` (L190–L280), `en/prezzi.html` (L180–L270) | **Regola Zero – Solo Info Vera:** vietato esporre recensioni, nomi di clienti o metriche di vanità non supportate da contratti reali firmati. |
| Riferimenti a `"3 Hub ZTL"` e indirizzo magazzino nel riepilogo offerta e nel blocco contrattuale di attivazione | `prezzi.html` (L115–L175, L320–L370), `checkout.html` (L95–L160, L240–L310), `en/checkout.html` (L90–L155, L230–L295) | **Blocco 1 & 3 JUL-009:** allineamento al solo riferimento societario legale `Blue Arroyo S.r.l.` con `PEC: [DA CONFERMARE]` e `Capitale sociale: [DA CONFERMARE]`. |
| Intestazione contrattuale incompleta o con menzione di hub/magazzini esterni nel contratto proprietario | `contratto.html` (L28–L92, L180–L235), `en/contratto.html` (L28–L90, L175–L225), `privacy.html` (L25–L78) | **Blocco 1 & 3 JUL-009:** nei contratti e nelle informative privacy verso clienti/ospiti deve comparire unicamente `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.`. |
| Riferimenti a `"Hub ZTL"` o indirizzi non pubblici nel portale di benvenuto proprietario e nel portale self check-in ospiti | `benvenuto.html` (L45–L120), `ospiti.html` (L60–L145, L260–L320) | **Blocco 1 & 2 JUL-009:** pulizia comunicazioni rivolte a proprietari e ospiti turistici; mantenuta solo la sede legale `Via Matteo Palmieri 20R, Firenze`. |
| Oggetto di configurazione globale con `"3 Hub ZTL"`, numerazione `Piano 2` errata e dati societari parziali | `site-config.js` (L1–L95, L140–L230) | **Blocco 1, 2 & 3 JUL-009:** ripristinata numerazione `Piano 4 · Itassistance`, impostata sede legale unica pubblica `Via Matteo Palmieri 20R, Firenze`, aggiunti `REA FI-706161`, `SDI M5UXCR1`, `PEC: [DA CONFERMARE]`, `Capitale sociale: [DA CONFERMARE]`. |
| Form secondari/duplicati di creazione manuale prospect ARM slegati dal Preventivo Generale PBA e diciture `"3 Hub ZTL"` nelle viste operative | `app.html` (L340–L520, L880–L1140, L1420–L1690) | **Blocco 2 & 4 JUL-009:** la scheda ARM in `app.html` riceve i prospect esclusivamente dal **Preventivo Generale PBA (`Piano 2 · PBA`) con consenso esplicito Itassistance**; rimossi i `"3 Hub ZTL"`. |
| Dati demo/fittizi precaricati come reali, numerazione `Piano 2` errata e ingressi ARM non provenienti dal Preventivo Generale PBA | `admin.html` (L180–L360, L620–L940, L1180–L1490) | **Blocco 1, 2 & 4 JUL-009:** ripristinato `Piano 4 · Itassistance`, vincolato l'auto-riempimento ARM al solo flusso `Preventivo Generale PBA (consenso Itassistance = SÌ)` e attivato l'azzeramento 1-clic dei dati demo. |
| Funzioni di smistamento `"3 Hub ZTL"` pubbliche e fallback prospect non originati dal Preventivo Generale PBA | `cloud-sync.js` (L45–L190, L410–L680, L890–L1120) | **Blocco 2 & 4 JUL-009:** confinato `Via dell'Agnolo 72R, Firenze` al solo tracciato logistico interno PBA ↔ Itassistance e blindato il canale di ingresso ARM (`source === 'PBA_GENERAL_QUOTE'` con `consenso_itassistance === true`). |
| Voci contabili e centri di costo intitolati ai `"3 Hub ZTL"` e riferimenti societari incompleti nelle bozze fattura SDI | `todo-admin-engine.js` (L30–L145, L310–L540) | **Blocco 1, 2 & 3 JUL-009:** allineati i centri di costo a `Piano 1..4` + `Sede legale Via Matteo Palmieri 20R` / `Magazzino interno Via dell'Agnolo 72R (solo uso interno)` e inseriti `REA FI-706161` e `SDI M5UXCR1`. |
| Riferimenti a `"3 Hub ZTL"` e `Magazzino: Via dell'Agnolo 72R` nei template contrattuali, GDPR, commerciali ed economici rivolti ai clienti | `docs/contratti-e-accordi-legali.md` (L1–L4, L47–L53), `docs/gdpr-e-adempimenti-struttura.md` (L1–L5), `docs/commerciale-e-posizionamento.md` (L1–L5, L46, L102), `docs/modello-economico.md` (L1–L4, L27–L28) | **Blocco 1 & 3 JUL-009:** nei documenti rivolti a clienti/pubblico compare esclusivamente `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.`. |
| Riferimenti a `Magazzino Via dell'Agnolo 72R` privi della dicitura di riservatezza interna nei manuali operativi e contabili | `docs/collaudo-dec16-e-operativita.md` (L24–L27, L50), `docs/sistema-contabile-gabriela-holding.md` (L5–L6, L35, L50), `docs/checklist.csv` (L37, L64, L67) | **Blocco 2 JUL-009:** specificato espressamente che `Via dell'Agnolo 72R, Firenze` è **SOLO uso interno operativo e non pubblico**, preservando i conteggi `24 Fatto` e `78 In corso` in `docs/checklist.csv`. |

---

## 2. Tabella Completa dei Campi Marcati `[DA CONFERMARE]` (`Regola Zero`)

Ogni dato societario, legale, assicurativo o amministrativo non ancora comunicato ufficialmente da Julian è marcato con il segnaposto esplicito `[DA CONFERMARE]` (zero invenzioni):

| Campo / Estremo Ufficiale | Valore Attuale nel Sistema | Dove Compare | Stato Verifica Julian |
| :--- | :--- | :--- | :--- |
| **Indirizzo PEC `Blue Arroyo S.r.l.`** | `PEC: bluearroyosrl@pec.it` | `site-config.js`, `contratto.html`, `privacy.html`, `checkout.html`, `docs/contratti-e-accordi-legali.md`, `docs/gdpr-e-adempimenti-struttura.md`, `docs/commerciale-e-posizionamento.md`, `docs/modello-economico.md`, `docs/sistema-contabile-gabriela-holding.md` | **Confermato da Visura Camerale CCIAA Firenze (`JUL-046`)** |
| **Capitale Sociale `Blue Arroyo S.r.l.`** | `Capitale sociale: € 50.000,00 i.v.` | `site-config.js`, `contratto.html`, `privacy.html`, `checkout.html`, `docs/contratti-e-accordi-legali.md`, `docs/gdpr-e-adempimenti-struttura.md`, `docs/commerciale-e-posizionamento.md`, `docs/modello-economico.md`, `docs/sistema-contabile-gabriela-holding.md` | **Confermato da Visura Camerale CCIAA Firenze (`JUL-046`)** |
| **DPO / Referente Privacy GDPR** | `[DA CONFERMARE]` | `privacy.html`, `docs/gdpr-e-adempimenti-struttura.md` | In attesa di conferma ufficiale da Julian / Legale |
| **Estremi Polizza RC Professionale (Compagnia e N° Polizza)** | `[DA CONFERMARE]` | `contratto.html`, `docs/modello-economico.md`, `docs/gdpr-e-adempimenti-struttura.md` | In attesa di conferma ufficiale da Julian / Amministrazione |
| **IBAN Conto Operativo `Blue Arroyo S.r.l.` e Conto Dedicato ARM Proprietari** | `[DA CONFERMARE]` | `todo-admin-engine.js`, `admin.html`, `docs/checklist.csv` (`Task #26`) | Apertura/abbinamento conti bancari reali da confermare con Gabriela |
| **Credenziali Telematiche Alloggiati Web / ISTAT Ross1000 dei singoli Proprietari** | `[DA CONFERMARE]` *(per ogni nuova struttura in onboarding)* | `app.html` (Wizard Passo 1), `ospiti.html`, `docs/checklist.csv` (`Task #94`) | Inserite dal Proprietario/Onboarding Specialist all'attivazione reale |

---

## 3. Certificazione `Blocco 4 JUL-009` — Canale Unico di Ingresso ARM

Si certifica che in **`Piano 4 · Itassistance` (`itadreamteam.com`)**:
1. **Canale Unico di Ingresso ARM:** la scheda **ARM (Auto-Riempimento Scheda Tecnica, Commerciale & Economica)** riceve e precompila i dati dei prospect **ESCLUSIVAMENTE** dal **Preventivo Generale PBA (`Piano 2 · PBA`)** quando il cliente seleziona il **consenso esplicito a ricevere la proposta `Itassistance`** (`GET /api/crm/prospects` → filtro `consenso_itassistance === true`).
2. **Assenza di Canali Paralleli Arbitrari:** nessun prospect viene generato con dati inventati; l'operatore commerciale in `admin.html` e `app.html` lavora unicamente sui lead reali provenienti dal Preventivo Generale PBA (con possibilità di azzerare in 1 clic qualsiasi dato di collaudo tramite il pulsante *"🟢 Modalità Dati Reali"*).
3. **Collegamento Tariffa al Momento & PDF Preventivo ARM:** la quotazione applicata nel preventivo PDF (`Preventivo_Itassitance_ARM_*.pdf`) legge in tempo reale la **Tariffa al Momento** (`99,00 € – 299,00 € / mese` Price Lock) configurata nella Regia Vendite.

---

## 4. Certificazione `0 Occorrenze` Indirizzi Estranei (`Corridoni` / `Via Filippo Corridoni 76`)

- **Controllo eseguito su tutto il repository `itadreamteam.com` (`*.html`, `*.js`, `*.css`, `docs/*`, `coordinamento/*`, `tests/*`):**
  - Occorrenze di `Corridoni` nei file operativi, codice sorgente e pagine web: **`0 occorrenze`**.
  - Occorrenze di `Via Filippo Corridoni 76` nei file operativi, codice sorgente e pagine web: **`0 occorrenze`**.
- **Unica Sede Legale Pubblica Attiva:** `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.`.
