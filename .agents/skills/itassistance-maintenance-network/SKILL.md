---
name: itassistance-maintenance-network
description: Governs the Itassistance Maintenance Ticket Skill & Maintainer Network (Piano 4 · Itassistance) — minimal editable maintenance tickets (task, photos, requested date/time), strict bidirectional privacy shield between property owners and maintainers, 60-minute job slot + 15-minute mandatory buffer planner validation, owner pricing (30,00 € base + optional urgency/difficulty supplement), maintainer invoice payout (15,00 € base + extra € + materials reimbursement), monthly payout reset, and automatic owner account charge.
---

# Skill: Itassistance Maintenance Ticket & Network Manutentori (`JUL-010`)

## 1. Scopo Operativo
Automatizza la gestione delle manutenzioni in **Piano 4 · Itassistance (`itadreamteam.com`)**, sostituendo il coordinamento manuale via WhatsApp con un flusso integrato tra:
1. **Area Personale Cliente / Proprietario (`app.html`)**
2. **Team Itassistance — Front Desk & Supporto PM (`app.html` e `admin.html`)**
3. **Area Dedicata Network Manutentori (`app.html` vista Manutentore)**

---

## 2. Struttura Minimal ed Editabile della Scheda Task
Ogni ticket di categoria **Manutenzione** contiene nella scheda operativa:
1. **Task / Job da fare:** titolo e descrizione essenziale dell'intervento (es. *"Sistemare 2 mensole del bagno staccate dal muro e fissare il gancio della finestra che si è staccato dalla vite"*) + zona/indirizzo operativo necessario per l'intervento (senza mai esporre l'identità del proprietario).
2. **Foto dell'intervento richiesto:** allegati fotografici del guasto o dell'elemento da riparare.
3. **Ora e Data dell'intervento richiesto:** data e orario richiesti (es. `Giovedì ore 09:30`).

**Permessi di Compilazione e Modifica:**
- I campi (Task, Foto, Data/Ora e supplemento urgenza) vengono compilati dal **Cliente Proprietario** e restano **sempre editabili sia dal Proprietario stesso sia da un membro del team Itassistance (Front Desk e Supporto PM)**.

---

## 3. Regola Ferrea di Privacy Incrociata (Cliente ↔ Manutentore)
- **Verso il Manutentore:** il manutentore **NON vede mai** il profilo del cliente/proprietario (né nome, cognome, telefono, email, codice fiscale/P.IVA, né l'importo pagato dal proprietario).
- **Verso il Proprietario:** il proprietario **NON vede mai** il profilo del manutentore (né nome/ragione sociale, telefono diretto, email, P.IVA, né il compenso percepito dal manutentore).
- **Filtro Centrale Itassistance:** Itassistance regola autonomamente per motivi di privacy i fornitori interni e protegge i dati della propria clientela.

---

## 4. Regole del Planner Manutentore (Slot `60 min` + Buffer `15 min`)
- All'accesso nell'Area Manutentori, il professionista visualizza in alto il **Banner Notifica di Nuova Task Disponibile** e la **Bacheca Interventi Richiesti**.
- **Vincoli Tecnici di Accettazione (`checkMaintainerPlannerConflict`):**
  - **Durata standard intervento:** **`60 minuti` (`1 ora`)**.
  - **Buffer obbligatorio tra una task e l'altra:** **`15 minuti`** minimi prima dell'inizio e dopo la fine di ogni job già a calendario nel planner del manutentore.
  - Se lo slot richiesto rispetta la durata di `60 min` e almeno `15 min` di margine da qualsiasi altro job accettato dal manutentore, il pulsante **"Accetta Job"** è abilitato. In caso contrario, l'accettazione è bloccata con avviso tecnico di sovrapposizione.

---

## 5. Regola Economica, Urgenza e Addebiti / Accrediti
- **Vista Cliente Proprietario:**
  - **Tariffa standard:** **`30,00 €`** per intervento di manutenzione standard (modificabile dal team Itassistance in base alla difficoltà soggettiva dell'intervento).
  - **Disponibilità Immediata / Proposta Cifra Più Alta:** il proprietario (o il team Itassistance) può aggiungere un supplemento in `€` oltre ai `30,00 €` standard per urgenza o disponibilità immediata.
  - Il proprietario visualizza esclusivamente il costo a suo carico (`Tariffa intervento € + eventuale Rimborso materiali €`).
- **Vista Partner Manutentore:**
  - **Compenso base su fattura:** **`15,00 €` a task** + **Rimborso spese materiali usati (`€`)** a piè di lista.
  - Eventuali incrementi per difficoltà o disponibilità immediata compaiono esclusivamente in valore assoluto come **`+ € X,XX Extra per l'intervento`** (senza mai mostrare il prezzo cliente né alcuna percentuale in nessun punto della UI).
- **Chiusura Job, Contatore Mensile e Addebito Proprietario:**
  1. Alla pressione di **"Completa Task"** (con eventuale inserimento del rimborso materiali in `€`), la task passa in **"Jobs Realizzati"**.
  2. Il compenso maturato (`15,00 € + Extra € + Rimborso materiali €`) incrementa in tempo reale il contatore in alto **"Importo Maturato Mese Corrente (su fattura)"** del manutentore, che si azzera mensilmente tramite la funzione di **Liquidazione Mensile Fattura**.
  3. L'importo totale lato cliente (`Prezzo intervento cliente € + Rimborso materiali €`) viene addebitato automaticamente sul **Conto del Proprietario**.
