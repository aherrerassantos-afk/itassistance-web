# Modello Economico Ufficiale — Piano 4 · Itassistance (`itassistance`)

> **Società (`JUL-009`):** `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.`
> **Riferimento Master Checklist 100:** Task `#1`, `#2`, `#3`, `#4`, `#12`, `#13`, `#56`, `#74`, `#75`, `#100`, `#107` (`JUL-028`)

---

## 1. Quota Fissa Unica `99,00 € / mese` (`1.188,00 € / anno`) — Nessun Prezzo Variabile (`Task #1`, `#56`, `#107` · `JUL-028`)
- **Canone Fisso Unico Mensile:** **`99,00 € / mese` (IVA inclusa)** per unità immobiliare. Non esistono prezzi variabili, dinamici, a scaglioni di saturazione o estratti a sorte.
- **Canone Annuale Anticipato:** **`1.188,00 € / anno` (IVA inclusa)** (pari a 12 mensilità da `99,00 € / mese`), con disdetta libera in qualsiasi momento senza penali di uscita.
- **Prezzo Bloccato a Contratto:** la quota fissa di **`99,00 € / mese`** (`1.188,00 € / anno`) è garantita e bloccata per l'intera durata contrattuale (12 mesi rinnovabili).
- **Modalità Esclusiva di Fatturazione tramite Pro-Forma in `"My Box"` (`JUL-036` / `JUL-055`):** nessun pagamento con carta; il proprietario controlla e conferma il **pro-forma** (documento non fiscale) nella sezione **`"My Box"`** della propria area riservata (`/app.html`), riceve copia del pro-forma confermato sulla propria email e l'amministrazione di `Blue Arroyo S.r.l.` emette manualmente la fattura elettronica (`SDI M5UXCR1`), con pagamento **`Saldo a vista / entro 5 giorni lavorativi tramite bonifico bancario`** (`Coordinate IBAN: [DA CONFERMARE]`).
- **Garanzia 14 Giorni Soddisfatto o Rimborsato:** rimborso integrale del **100%** tramite **bonifico bancario manuale gestito dall'amministrazione** se il proprietario recede entro i primi 14 giorni dall'attivazione.
- **Zero Commissioni sulle Prenotazioni (Piano Base `0%`) e Zero Commissioni sull'Ospite:** nel piano a quota fissa `99,00 € / mese` il proprietario non paga alcuna percentuale sulle prenotazioni (`0%`), e nessuna fee aggiuntiva di agenzia viene mai applicata all'ospite turistico.

---

## 2. Analisi Costi Fissi Reali per Unità e Sostenibilità della Quota Fissa `99,00 € / mese` (`Task #2`)
Su una capacità standard di modulo operativo pari a **24 unità gestite per pod/team base a Firenze**:

| Voce di Costo Fisso Mensile (Per Unità) | Costo Mensile Modulo (`24 unità`) | Incidenza per Unità (`€/mese`) | Note Operative |
| :--- | :---: | :---: | :--- |
| **Infrastruttura Tech & Cloud (Supabase, Automazioni, Dominio, Backup, Notifiche)** | 360,00 € | **15,00 €** | Server, sincronizzazione canali, archiviazione 5 anni |
| **Team Core & Front Desk / Coord. Turni (Quota fissa presidio 09:00–23:00)** | 960,00 € | **40,00 €** | Copertura 7/7 ticket proprietari e coordinamento |
| **Sede Legale `Blue Arroyo S.r.l.` (`Via Matteo Palmieri 20R, Firenze`) & Logistica Interna** | 360,00 € | **15,00 €** | Sede legale, gestione chiavi e logistica interna biancheria/kit |
| **Assicurazione RC Professionale (`[DA CONFERMARE]`), Commercialista, SDI (`M5UXCR1`) & Compliance** | 240,00 € | **10,00 €** | Gestione contabile, tracciati SDI e tutela legale |
| **TOTALE COSTO FISSO INDUSTRIALE PER UNITÀ** | **1.920,00 €** | **80,00 € / mese** | **Quota Fissa Ufficiale: `99,00 € / mese` (Margine operativo netto base: `+19,00 € / mese` per unità)** |

---

## 3. Tabella Costi Variabili Pass-Through e Soggetto Pagatore (`Task #3`)
I costi variabili seguono esclusivamente chi li genera, **senza ricarichi occulti (`0% markup`)** da parte di Itassistance:

| Servizio Variabile | Tariffa / Listino Ufficiale Firenze | Chi lo paga (Flusso Economico) | Gestione in ARM (`Task #72, #75`) |
| :--- | :--- | :--- | :--- |
| **Pulizia Turnover + Biancheria Lavata a 60°C (`PBA Blue Arroyo`)** | Listino ufficiale per tipologia immobile (es. `86,00 €` trilocale 2 camere / 2 bagni) | Ospite (Cleaning Fee in prenotazione) / Pass-Through Proprietario | Addebito automatico pass-through (`0%` ricarico) su soggiorno e saldo fornitore PBA |
| **Kit Cortesia Ospite (Sapone, Shampoo, Carta, Welcome Kit)** | Da listino fornitore / incluso nei pack convenzionati `PBA` | Proprietario (pass-through da incasso soggiorno) | Rendicontato al costo vivo nel prospetto ARM mensile |
| **Check-in di Persona in Presenza a Firenze (su richiesta)** | **`20,00 €`** (IVA inclusa) a intervento | Proprietario o Ospite (se richiesto come extra) | Pass-through per il servizio di accoglienza in presenza |
| **Piccola Manutenzione Ordinaria a Firenze (`JUL-010`)** | **`30,00 €`** (IVA inclusa) base a uscita + eventuale urgenza/materiali | Proprietario (con approvazione in Inbox se sopra soglia) | Gestito tramite Skill Ticket Manutenzioni (`JUL-010`) e addebitato su conto proprietario |
| **Manutenzione Straordinaria / Ristrutturazione (`Toscan Costruzioni`)** | Su preventivo approvato in 1-tap nell'Inbox Proprietario | Proprietario (`<= 500 €` validato Manager, `> 500 €` Titolare + Proprietario) | Tracciato in To-Do Approvazioni e fatturato da fornitore |
| **Imposta di Soggiorno Comune di Firenze** | Tariffa comunale vigente (max 7 notti, zero ricarichi) | Ospite turistico (incassata a parte o via OTA) | Calcolata e accantonata per versamento giorno 16 (`Task #73, #84`) |

---

## 4. Regola Ufficiale Opzione Revenue Plan `+10%` (`Task #4`, `#12`, `#74`, `#110` · `JUL-035`)
- **Applicazione Esclusiva su Richiesta:** la commissione opzionale del **`+10%`** si applica **ESCLUSIVAMENTE** ai proprietari che attivano espressamente il **Revenue Plan (Revenue Management & Gestione Completa Adempimenti)**. Chi utilizza il piano base paga solo la quota fissa di **`99,00 € / mese`** (`1.188,00 € / anno`) e **`0%` di commissioni**.
- **Base di Calcolo Contrattuale (`JUL-035`):** qualora il Cliente scelga di attivare il **Revenue Plan**, si applica una **commissione del `10%` (dieci per cento) calcolata sul netto che spetta al proprietario prima delle sue tasse personali**, ossia sull'**incasso dell'ospite al netto di: commissioni delle piattaforme, imposta di soggiorno e costi di pulizia**. Non si applica **MAI** sulle tasse di soggiorno né sui costi di pulizia.
- **Maturazione e Fatturazione (`JUL-035` / `JUL-055`):** **mensile**, la fattura si emette **a fine mese sulle prenotazioni del mese** (termini di pagamento della fattura: **`Saldo a vista / entro 5 giorni lavorativi tramite bonifico bancario`**).
- **Esempio illustrativo di calcolo *(importi di puro esempio, non dati reali)*:** `Incasso ospite 1.000,00 € − Commissioni delle piattaforme 150,00 € − Imposta di soggiorno 40,00 € − Costi di pulizia 60,00 € = Netto spettante al proprietario prima delle tasse personali 750,00 € → Commissione Revenue Plan 10% = 75,00 €, fatturata a fine mese sulle prenotazioni del mese.`
- **Focus Operativo del Canone Fisso (`JUL-035`):** il canone fisso di `99,00 € / mese` è focalizzato sul **coordinamento della parte operativa del Property Manager (PM)** (pulizie e preparazione alloggio, accoglienza ospiti, manutenzioni e fornitori, messaggistica ospiti, sincronizzazione calendari, report giornaliero e promemoria operativi, supporto adempimenti burocratici), senza includere la produzione/invio di foto-report.
- **Attivazione e Disdetta:** attivabile o disattivabile liberamente dal Checkout, dal Contratto (`/contratto.html`) o dall'Area Proprietario (`/app.html`) senza penali sul canone fisso di `99,00 € / mese`.

---

## 5. Simulazione Mensile Ufficiale: `Itassistance (99,00 €/mese)` vs `Agenzia Tradizionale (20%)` (`Task #13, #75`)

### 5.1 Confronto Standard su Appartamento a Firenze (`4.000,00 €` Lordo Mensile)

| Voce Economica Mensile (1 Unità a Firenze) | **Itassistance (`99,00 €/mese`)** | **Agenzia Tradizionale (20%)** | Note & Regole di Calcolo (`JUL-028`) |
| :--- | :---: | :---: | :--- |
| **Incasso lordo prenotazioni (€)** | `4.000,00 €` | `4.000,00 €` | Incasso mensile lordo soggiorni |
| **Commissioni canali OTA (15%)** | `- 600,00 €` | `- 600,00 €` | Media portali OTA (`0%` su canale diretto SmartsBookings) |
| **Netto canali (€)** | **`3.400,00 €`** | **`3.400,00 €`** | Base imponibile post-commissioni OTA |
| **Costi variabili pass-through: pulizie + biancheria + kit (€)** | `- 600,00 €` | `- 600,00 €` | Pass-through trasparenti (`0%` ricarico Itassistance) |
| **Opzione Revenue Team (`+10%` solo se attivo) vs Agenzia (`20%`)** | **`0,00 €`** *(oppure `- 340,00 €` con Revenue Team)* | `- 680,00 €` *(20%)* | Nel piano base `Itassistance` la commissione è **`0%`** |
| **Canone Fisso Unico Mensile (`JUL-028`)** | **`- 99,00 €`** | `0,00 €` | **Quota Fissa Unica `99,00 €/mese` (`1.188,00 €/anno`)** |
| **SALDO FINALE NETTO PROPRIETARIO (€)** | **`2.701,00 €`** *(solo App)* · **`2.361,00 €`** *(con +10% Revenue)* | **`2.120,00 €`** | Formula ARM: `Lordo − Comm. Canale − Variabili − 10% (se attivo) − 99,00 €` |
| **Vantaggio netto a favore del proprietario** | **`+ 581,00 € / mese`** *(solo App)* · **`+ 241,00 € / mese`** *(con Revenue Team)* | — | **Risparmio annuo: `+ 6.972,00 € / anno` (solo App) o `+ 2.892,00 € / anno` (con Revenue Team)** |

### 5.2 Caso Reale Prospect `ARM-2026-MP86` (Marco Palumbo — Trilocale 2 Camere, 2 Bagni, Turnover PBA `86,00 €`)
- **Incasso Lordo Mensile Stimato:** `€ 2.850,00`
- **Commissioni OTA stimate (`15%`):** `- € 427,50` → **Netto Canali:** `€ 2.422,50`
- **Costi Pulizia Turnover PBA (`4 cambi × 86,00 €` pass-through `0%`):** `- € 344,00`
- **Opzione Revenue Team (`+10%` su Netto Canali netto pulizie `€ 2.078,50` / configurazione ARM):** `- € 290,25`
- **Canone Fisso Unico Mensile `Itassistance` (`JUL-028`):** **`- € 99,00`** (`€ 1.188,00 / anno`)
- **Netto Proprietario Stimato Mensile (`ARM-2026-MP86`):** **`€ 1.689,25 / mese`**

---

## 6. Regola 80% Interno (`ITASSISTANCEDREAMTEAM.IT`) / 20% Unico Inbox `"My Box"` con Report `08:00 AM` (`JUL-057` / `JUL-058`)
- **80% Lavoro Operativo Quotidiano gestito da `ITASSISTANCEDREAMTEAM.IT`:** coordinamento pulizie, accoglienza, manutenzioni, prenotazioni last-minute, assistenze notturne e risoluzione problemi operativi, filtrato lato server (`visibilita = interno`) e mai scaricato sul proprietario.
- **20% Unico Inbox `"My Box"` del Proprietario — Report delle `08:00 AM` & To-Do List (`JUL-057`):**
  1. **Il giorno seguente al check-in (ore `08:00 AM`):** task nella To-Do List con le **foto dei documenti presi al check-in caricate dal Concierge**, pronte per gli adempimenti di legge del proprietario;
  2. **Il giorno seguente alla chiusura contabile di fine mese (ore `08:00 AM`):** spunta e conferma dei **Pro-Forma** da controllare e saldare (`Saldo a vista / entro 5 giorni lavorativi tramite bonifico bancario`).
