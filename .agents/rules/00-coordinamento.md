# REGOLA PERMANENTE – CHECKLIST MASTER ITASSITANCE (00-coordinamento.md)

> Questa regola è letta in automatico da **TUTTI** gli agenti (`manager`, `agente-1` … `agente-4`, `a1-backend` … `a7-revenue-frontdesk`) prima di qualsiasi intervento.

---

## 1. FONTE UNICA DI VERITÀ
La roadmap ufficiale del prodotto **Itassitance** (`itassistance` · `Blue Arroyo SRL`) risiede nel Foglio Google Master:
- **URL Master:** `https://docs.google.com/spreadsheets/d/1AI6WAejLEJq8fPlHaunsuYvTbBOUe_94/edit?usp=share_link&ouid=108480607176676282860&rtpof=true&sd=true`
- **Mirror locale sincronizzato:** `docs/checklist.csv` e `coordinamento/BOARD.md`
*(Se Julian fornisce un link aggiornato in formato Fogli Google, quello diventa immediatamente la fonte primaria).*

### Struttura dei 5 Fogli Ufficiali:
1. **`Riepilogo`**: `%` di completamento per fase (**formule: VIETATO modificare**).
2. **`Checklist 100`**: le 100 task ufficiali (`#`, `Fase`, `Task`, `Responsabile`, `Input`, `Output`, `Priorità`, `Stato`, `Note`).
3. **`Ruoli dream team`**: ruoli, input, output, KPI e livello di contatto col proprietario.
4. **`Flussi tra reparti`**: chi manda cosa a chi, su quale canale e con quale SLA.
5. **`Modello economico`**:
   - Canone fisso **99–299 € / mese** bloccato all'acquisto (**Price Lock**).
   - **+10%** applicato **SOLO** a chi attiva il **Revenue Team**.
   - Costi variabili (pulizie, check-in presenza, manutenzioni, bolli/tasse) **pass-through** trasparenti.
   - **Nessuna commissione sull'ospite** (zero ricarichi occulti).

---

## 2. CHI SIETE — MATRICE RESPONSABILI & AGENTI IN PARALLELO

### A. I 4 Agenti della Checklist 100 (`agente-1` … `agente-4`)
| Agente | Ruolo Responsabile ("Ruoli Dream Team") | Ambito di Ultraspecializzazione | Task Assegnate (Checklist 100) | File Ordini |
| :--- | :--- | :--- | :--- | :--- |
| **`agente-1`** *(A6 Compliance & Guest Auto)* | **Responsabile Compliance & Automazioni Ospiti** | Alloggiati Web Polizia di Stato (24h/6h), ISTAT Ross1000, Imposta di soggiorno Firenze, CIN/sicurezza, messaggi automatici pre/durante/post soggiorno, Inbox Ospiti (`/ospiti.html`) | **`9, 73, 84, 93, 94`** | `coordinamento/agente-1.md` |
| **`agente-2`** *(A7 Onboarding + A1 Anagrafiche)* | **Responsabile Onboarding, Struttura & Canali** | Wizard primo accesso 4 passi (`benvenuto.html` / `app.html`), autocompletamento indirizzo Google Maps con riempimento automatico colonne form, anagrafiche struttura/unità, canali OTA + Booking Engine, migrazione clienti | **`17, 37, 44, 54, 55, 61, 92`** *(+ Proposta `101`)* | `coordinamento/agente-2.md` |
| **`agente-3`** *(A3 Amministrazione + A4 To-Do)* | **Responsabile Amministrazione, ARM & To-Do List** | Fatture attive/passive SDI, To-Do Bill Fornitori da saldare (scadute in rosso, anti-duplicato, IBAN), To-Do Approvazione Preventivi Extra (`<=500 €` Manager / `>500 €` Titolare / alert `>24h`), To-Do Report Revenue Plan (lunedì/giorno 1), Riepilogo ore `08:30`, ARM e rendiconti proprietario | **`21–30, 46, 47, 69, 71, 72, 74–80, 87, 88`** | `coordinamento/agente-3.md` |
| **`agente-4`** *(A5 Prezzi/Modello + A2 UI/KPI)* | **Responsabile Prezzi, Inbox Proprietario (20%/80%) & Modello di Business** | Prezzi verso i canali, **Inbox Proprietario (20% visibile)** vs **Separazione 80% lavoro interno (filtro lato server)**, prezzo dinamico d'acquisizione (`99–299 €` Price Lock), misurazione dell'automazione (`L1->L4`) | **`1, 12, 13, 41, 42, 45, 52, 53, 56, 57, 58, 89, 95`** | `coordinamento/agente-4.md` |

### B. I 7 Specialisti di Reparto (`a1-backend` … `a7-revenue-frontdesk`) coordinati dal `manager`
- **`a1-backend`** -> Responsabile Architettura Dati, Filtro Server 80%/20%, `site-config.js`, `cloud-sync.js`, Auth e Permessi RBAC (Supporto tecnico `Agente 2` e `Agente 4`).
- **`a2-frontend`** -> Responsabile Design System Viola & Bianco WCAG AAA, Sistema Cipolla `0–4`, Mobile-First e Test Playwright `check:layout` / `check:mobile` (Supporto trasversale UI).
- **`a3-amministrazione`** -> Responsabile Amministrazione, Fatture SDI, Bill Fornitori, Preventivi Extra e Rendiconti ARM (`Agente 3` — Task `21–30, 46, 47, 69, 71, 72, 74–80, 87, 88`).
- **`a4-operations`** -> Responsabile Operatività Campo Firenze (`20 €` check-in / `30 €` manutenzione), Pulizie `Blue Arroyo Cleaning` e Fornitori (Supporto operativo `Agente 3`).
- **`a5-commerciale`** -> Responsabile Modello di Business (`99–299 €` Price Lock, `+10%` solo Revenue Team), Prezzi Acquisizione, Checkout, CRM e SEO/GEO (`Agente 4` — Task `1, 12, 13, 41, 42, 45, 52, 53, 56, 57, 58, 89, 95`).
- **`a6-compliance`** -> Responsabile Compliance (Alloggiati Web, ISTAT, Tassa Soggiorno, CIN) e Automazioni Messaggi Ospiti (`Agente 1` — Task `9, 73, 84, 93, 94`).
- **`a7-revenue-frontdesk`** -> Responsabile Onboarding Wizard 4 Passi, Autocompletamento Google Maps (`Task #101`), Canali OTA, Migrazione Clienti e Revenue Plan (`Agente 2` — Task `17, 37, 44, 54, 55, 61, 92, 101`).

> **REGOLA SULLE TASK NON ASSEGNATE:** Non prendere mai task non assegnate senza la conferma esplicita di Julian. Se una task non assegnata è necessaria per sbloccare il lavoro, proponila a Julian tramite il `manager`.

---

## 3. PRIMA DI OGNI LAVORO (CONTROLLO PRELIMINARE OBBLIGATORIO)
1. **Leggi la `Checklist 100`** (`docs/checklist.csv` / Foglio Google) e controlla le tue task e le loro dipendenze.
2. **Controlla il foglio `Flussi tra reparti`**: ogni funzione deve rispettare rigorosamente `Input`, `Output`, `Canale` e `SLA` indicati.
3. **Controlla il `Modello economico`**: nessuna funzione o testo deve contraddirlo (es. **MAI** commissioni sull'ospite, **MAI** il `+10%` applicato a chi non ha attivato il Revenue Team, canone fisso bloccato all'acquisto).
4. **Segnalazione contraddizioni**: se una richiesta contraddice la checklist o il modello economico, segnalalo a Julian prima di procedere.

---

## 4. COME AGGIORNARE IL FOGLIO GOOGLE E LA CHECKLIST
- Modifica **SOLO** le colonne **`Stato`** e **`Note`** delle tue task.
- **Valori ammessi per `Stato`:**
  - `In corso` — quando inizi a lavorare sulla task.
  - `Fatto` — **SOLO** dopo aver superato i test di accettazione (`check:layout`, `check:mobile` e test funzionali).
  - `Bloccato` — quando serve un output da un altro agente o da Julian: nelle `Note` scrivi **cosa serve**, **da chi**, e il **numero della task (`#`) che blocca**.
- **Formato obbligatorio delle `Note`:**
  `[Agente N – gg/mm] cosa è stato fatto · file/moduli toccati · prossimo passo`
  *(Aggiungi sempre in coda con ` | `, non cancellare mai le note precedenti).*
- **DIVIETI ASSOLUTI SUL FOGLIO:**
  - **NON** modificare le colonne `#`, `Fase`, `Task`, `Responsabile`, `Input`, `Output` e `Priorità`.
  - **NON** toccare il foglio `Riepilogo` e le sue formule.
  - **NON** riordinare, **NON** cancellare righe, **NON** cambiare i nomi dei fogli.
- **Nuove task (`n. 101+`):**
  - Aggiungile esclusivamente in fondo a partire dal **n. 101**, con la `Fase` corretta e nella colonna `Note` il prefisso **`[PROPOSTA Agente N]`**.
  - Diventano operative solo dopo l'approvazione di Julian.
- **Tabella di fine lavoro per Google Sheet:**
  - Se non hai accesso diretto in scrittura al Google Sheet, a fine lavoro consegna sempre a Julian una tabella pronta da incollare:
    **`Aggiornamenti checklist` (`# | Nuovo stato | Nota`)**.

---

## 5. COORDINAMENTO TRA AGENTI & FILE CONDIVISI
- **File e moduli condivisi** (`todo-admin-engine.js`, `cloud-sync.js`, `site-config.js`, `app.html`, `admin.html`, `style.css`, to-do list, inbox, anagrafiche, permessi, branding):
  - Sono ammesse **SOLO modifiche additive** (mai sovrascrivere funzioni o sezioni di altri agenti).
  - Segnala ogni modifica a un file condiviso nelle `Note` con la dicitura: **`CONDIVISO: <file>`**.
- **Gestione delle dipendenze tra agenti:**
  - Se la tua task dipende da quella di un altro agente, **NON duplicare la logica**: usa un'interfaccia o uno stub pulito e metti la tua task in stato **`Bloccato`**, indicando la dipendenza nelle `Note`.
- **Invarianti tecnici permanenti:**
  - Branding unico (`itassistance` / `Itassitance` come da specifica, zero vecchi prezzi `55 €` o `24/7`).
  - Design **mobile-first** (*"Il Design Non Si Taglia Mai"*, `GEMINI.md`).
  - Fuso orario **`Europe/Rome`**, valuta **`EUR`**.
  - **Regola 80% / 20% (Separazione lato server):** i dati operativi interni (**80%**) non devono **MAI** essere visibili al proprietario; il proprietario vede solo il **20%** di propria pertinenza (filtrato lato server/stato).
  - **Audit Trail:** ogni azione viene registrata nello storico (`chi`, `quando` in `Europe/Rome`, `cosa`).

---

## 6. STRUTTURA DI CONSEGNA OBBLIGATORIA DI OGNI SESSIONE
Ogni sessione di lavoro (sia degli agenti operativi in `coordinamento/inbox-manager.md`, sia del `manager` verso Julian) deve concludersi con questi **5 punti numerati**:
1. **Task lavorate con il nuovo stato** (più la tabella `Aggiornamenti checklist`: `# | Nuovo stato | Nota`).
2. **File modificati**, indicando esplicitamente quelli condivisi (`CONDIVISO: <file>`).
3. **Test eseguiti e risultato** (`check:layout`, `check:mobile`, test di accettazione).
4. **Blocchi e da chi dipendono** (numero task bloccante e responsabile).
5. **Nuove task proposte (`n. 101+`)** con `[PROPOSTA Agente N]`.
