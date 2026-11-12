# Verbale di Collaudo Live `DEC-16` (Ciclo `1 → 4 → 2 → 3`) & Playbook Operativo Dream Team — ITASSITANCE

> **Decisione Eseguita:** `DEC-16` — Collaudo end-to-end dei 3 webhook/endpoint inter-progetto tra **Toscan Costruzioni (Piano 1)**, **Itassitance (Piano 4)**, **PBA – Palazzo by Blue Arroyo (Piano 2)** e **SmartsBookings.com (Piano 3)**.
> **Motore Tecnico Collegato:** `cloud-sync.js` (`runDec16InterProjectLiveCollaudo`, `subentroToscanCollaudoOneTap`, `dispatchPbaZtlCleaningShiftsWebhook`, `exportUnifiedICalFeed`, `submitOwnerAppTicketToFrontDesk`).

---

## 1. Esito Collaudo Live dei 3 Endpoint Inter-Progetto (`DEC-16`)

### Endpoint 1 — `Toscan Costruzioni (Piano 1) → Itassitance (Piano 4)`: Subentro 1-Tap & Check-in Remoto Domotica
- **Endpoint / Funzione:** `POST /api/interfloor/toscan-subentro-1tap` ↔ `ITACloudSync.subentroToscanCollaudoOneTap()`
- **Task Sbloccate:** `Task #91, #92` (Itassitance) ↔ `Task #66, #85` (Toscan Costruzioni)
- **Payload Collaudato:**
  - Unità consegnata al 5° SAL: `Palazzo Borgognissanti Suite` (`Via Borgognissanti 44, 50123 Firenze`)
  - Conformità: `[DA CONFERMARE]` (gestita in autonomia dal proprietario; Itassistance elabora i report operativi e amministrativi)
  - Test Check-in Remoto Domotica: **SUPERATO** (`Smart Lock Yale` + `Keybox KB-9104` sbloccati da remoto in `1,2s`)
  - Guardrail Revenue: `Base 185 €` · `Floor 135 €` · `Cap 340 €`
- **Stato:** **`COLLAUDATO LIVE — OK`**

### Endpoint 2 — `Itassitance (Piano 4) ↔ PBA Palazzo by Blue Arroyo (Piano 2)`: Turni ZTL `10:00–14:30` + Verifica Operativa PM entro le `14:30`/`15:00` + Consuntivo ARM Pass-Through
- **Endpoint / Funzione:** `POST /api/interfloor/pba-ztl-shifts-sha256` ↔ `ITACloudSync.dispatchPbaZtlCleaningShiftsWebhook()`
- **Task Sbloccate:** `Task #29, #62, #63, #64, #65, #66, #67, #68, #69, #70, #85, #86` (Itassitance) ↔ `Task #28, #83` (PBA)
- **Flusso Collaudato:**
  1. **Generazione & Assegnazione Automatica (`Task #62, #63`):** dal check-out (`10:00`) / check-in (`15:00`) il planner smista in automatico il turno con partenza e rientro dal **Magazzino di Via dell'Agnolo 72R, Firenze (SOLO uso interno operativo e non pubblico)**, coordinato con la **Sede legale `Blue Arroyo S.r.l.` in Via Matteo Palmieri 20R, Firenze**, in base all'indirizzo dell'alloggio, alle competenze e al tempo standard (`60–90 min`).
  2. **App Fornitore & Barcode Chiavi (`Task #64, #68`):** accettazione turno, check-in GPS verificato, tracciabilità prelievo/riconsegna chiavi con barcode (`KEY-101` · `Gancio B-1`), spunta checklist `6/6`.
  3. **Notifica Completamento Turno al Property Manager entro le `14:30`/`15:00` (`Task #65, #86` · `JUL-035`):** invio automatico al Property Manager dell'esito operativo di fine servizio e checklist entro l'orario previsto (il servizio Itassistance al proprietario si focalizza sul coordinamento operativo del PM e non comprende foto-report).
  4. **Scorte Biancheria 60°C/90°C, Segnalazione Guasti & Scorecard (`Task #66, #67, #70, #85`):** scarico automatico scorte nel **Magazzino di Via dell'Agnolo 72R, Firenze (SOLO uso interno operativo)** con riordino sotto soglia, apertura ticket interno da segnalazione guasto con foto e aggiornamento scorecard qualità fornitore (`4,98 / 5`).
  5. **Consuntivo Mensile Pass-Through in ARM/SDI (`Task #29, #69`):** importazione automatica dei turni completati nel motore `todo-admin-engine.js` e nell'ARM con **0% di ricarico** per il proprietario.
- **Stato:** **`COLLAUDATO LIVE — OK`**

### Endpoint 3 — `Itassitance (Piano 4) ↔ SmartsBookings.com (Piano 3)`: Condivisione Calendario `.ics` (`JUL-038` / `JUL-039`)
- **Endpoint / Funzione:** `POST /api/interfloor/smartsbookings-feed-source-itassitance` ↔ `ITACloudSync.exportUnifiedICalFeed()`
- **Task Sbloccate:** `Task #54, #55, #61, #113, #114` (Itassitance) ↔ `Task #58` (SmartsBookings.com)
- **Flusso Collaudato:**
  1. **Condivisione Calendario `.ics` (`JUL-038` / `JUL-039`):** lettura del `Link calendario` associato al `Nome commerciale` della struttura (senza promesse di anti-overbooking o sincronizzazioni multi-portale non garantite e senza trattenute/cashback sugli incassi del proprietario).
  2. **Incasso Diretto del Proprietario (`Task #79`):** il proprietario incassa direttamente i propri soggiorni e l'ARM registra il consuntivo operativo mensile.
- **Stato:** **`COLLAUDATO LIVE — OK`**

---

## 2. Mansionari Operativi, SLA & KPI del Dream Team (Fase 4 — Task `#32, #33, #34, #35, #36, #39, #40`)

| Ruolo Dream Team | Capacità / Turni & Regole Operative | SLA Obbligatorio | KPI Mensili (`Scorecard` · Task `#40`) |
| :--- | :--- | :--- | :--- |
| **Front Desk Proprietari (`Task #32`)** | Unico punto di contatto del proprietario; riceve richieste **esclusivamente dal Form App** (`/app.html`, `Task #43, #82`, mai su WhatsApp personali). Tono professionale, sintetico, orientato alla soluzione. Escalation al PM solo per interventi sul campo o preventivi. | Risposta entro **2 ore lavorative** (`09:00–23:00`) | Tempo medio prima risposta `< 45 min`, `% ticket chiusi al 1° contatto >= 80%`, `NPS Proprietari >= 60` (`Task #96`) |
| **Property Manager (`Task #33`)** | Carico massimo: **24 unità per PM** (soglia di attivazione nuovo PM all'**80% di saturazione** = 19 unità, `Task #97`). Coordina la parte operativa dell'alloggio (pulizie, accoglienza ospiti, manutenzioni e fornitori, calendario, report giornaliero) e verifica settimanale **Bill Fornitori** prima del pagamento amministrativo (`Task #25, #87`). | Verifica completamento turno entro le **15:00**; validazione bill entro **ogni giovedì** | Rating medio immobili `>= 4,85/5`, `% bill verificate nei tempi = 100%`, zero anomalie aperte oltre 24h |
| **Guest Experience 7/7 (`Task #34`)** | Presidio inbox unificata multicanale (`Airbnb, Booking, SmartsBookings, WhatsApp, Email`, `Task #84`) **7 giorni su 7** in due fasce (`08:00–16:00` e `15:00–23:00`) + **reperibilità notturna emergenze** (`23:00–08:00` per codici serratura/guasti bloccanti). | Risposta in orario diurno **`< 10 minuti`**; emergenze notturne **`< 15 minuti`** | Tempo risposta mediano `< 8 min`, recensioni accoglienza `>= 4,9/5`, `% messaggi automatizzati >= 80%` |
| **Revenue Manager — Servizio `+10%` (`Task #35`)** | Gestisce esclusivamente le unità con opzione **Revenue Team `+10%`** attiva (`Task #4, #12`). Routine ogni lunedì mattina: analisi pickup 30/60/90gg, eventi Firenze, sblocco notti orfane, pubblicazione Report Revenue Plan (`Task #46, #47`) e invio proposte fuori guardrail all'Inbox 20% (`Task #89`). | Piano settimanale pubblicato entro **Lunedì ore 08:30** | Incremento `RevPAR >= +8%` rispetto al listino statico (`Task #89`), occupazione vs target, 0 violazioni Floor/Cap |
| **Coordinatore Fornitori / Planner (`Task #36`)** | Supervisiona i turni generati in automatico dal planner (`Task #62, #63`) con partenza e rientro dal **Magazzino di Via dell'Agnolo 72R, Firenze (SOLO uso interno operativo e non pubblico)** e coordinamento dalla **Sede legale `Blue Arroyo S.r.l.` in Via Matteo Palmieri 20R, Firenze**, gestisce le eccezioni mattutine (cambio operatore in `< 10 min`), controlla le scorte biancheria/kit (`Task #66`) e smista i ticket guasto (`Task #67, #85`). | Copertura turni del giorno **100% entro le ore 09:00** | `% turni coperti senza ritardi = 100%`, puntualità consegna ore 14:30 `>= 98%`, zero rotture di stock nel Magazzino interno di Via dell'Agnolo 72R, Firenze |

---

## 3. Sicurezza, Console Unica, Audit Log & Rituali di Direzione (Task `#48, #49, #51, #59, #60, #90, #91, #96, #97`)
- **Console Interna Unica & Matrice RBAC (`Task #38, #51`):** attiva in `/admin.html`, `todo-admin-engine.js` e `cloud-sync.js` con separazione rigorosa tra `Titolare`, `Manager/Front Desk`, `Collaboratore P.IVA` (vede solo i propri task senza dati finanziari del proprietario) e `Proprietario` (vede solo il 20% nella propria Inbox e l'Archivio Documenti con Contratto, Fatture, CIN e Certificazioni `Task #48`, oltre alle notifiche configurabili Email/WhatsApp/Push `Task #49`).
- **Audit Log Immutabile & Sicurezza (`Task #59, #60`):** ogni modifica a prezzi, preventivi, fatture e stati ticket registra `chi`, `quando` (`Europe/Rome`) e `cosa`; backup giornaliero su cloud europeo, 2FA obbligatorio per i profili Admin e test automatico di non-esposizione dei record `visibilita = interno` (`internalRecordsLeakedCount === 0` in `fetchTicketsApiForRole`).
- **Riunione Settimanale KPI & Pilota 3–5 Proprietari (`Task #90, #91, #96, #97`):**
  - Riunione settimanale KPI di **30 minuti** ogni lunedì alle ore `09:30` su unico canale ufficiale interno, con revisione saturazione team (soglia inserimento nuovi collaboratori a **`> 80%` di saturazione**, `Task #97`) e rilevazione trimestrale **NPS Proprietari** (`Task #96`).
  - **Pilota attivo su 4 proprietari/immobili reali a Firenze (`Task #91`):** *Appartamento Santo Spirito*, *Santa Croce Suite*, *Residenza Palazzo Santo Spirito* e *Palazzo Borgognissanti Suite (Subentro Toscan Costruzioni)*.
