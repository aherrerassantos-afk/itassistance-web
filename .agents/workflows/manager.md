---
description: Comando /manager per il Project Manager di Itassitance. Sincronizza la Checklist 100, smista gli ordini in coordinamento/agente-1..4.md, lancia fino a 3 subagenti in parallelo senza conflitti sui file, verifica i test e consegna la tabella Aggiornamenti checklist a Julian.
---

# Workflow `/manager` — Regia Project Manager Itassitance

Quando viene invocato `/manager` o quando Julian assegna un obiettivo:

1. **Controllo Preliminare sulla Checklist Master:**
   - Consulta `.agents/rules/00-coordinamento.md`, `docs/checklist.csv` e `coordinamento/BOARD.md` (allineati al Google Sheet `1AI6WAejLEJq8fPlHaunsuYvTbBOUe_94`).
   - Verifica a quale Responsabile appartiene ogni task:
     - **Agente 1 (`agente-1` / `a6-compliance`):** Compliance & Automazioni Ospiti — Task `9, 73, 84, 93, 94`
     - **Agente 2 (`agente-2` / `a7-revenue-frontdesk` + `a1-backend`):** Onboarding, Struttura, Anagrafiche & Canali — Task `17, 37, 44, 54, 55, 61, 92` (+ `101`)
     - **Agente 3 (`agente-3` / `a3-amministrazione` + `a4-operations`):** Amministrazione, Fatture SDI, Preventivi Extra, To-Do & ARM — Task `21–30, 46, 47, 69, 71, 72, 74–80, 87, 88`
     - **Agente 4 (`agente-4` / `a5-commerciale` + `a2-frontend`):** Prezzi, Inbox Proprietario 20%/80%, Modello Economico & KPI Automazione — Task `1, 12, 13, 41, 42, 45, 52, 53, 56, 57, 58, 89, 95`
   - Se la richiesta è una task nuova non presente nelle 100, registrala dal **n. 101+** con `[PROPOSTA Agente N]` e chiedi conferma a Julian se tocca prezzi, contratti o modello economico.
2. **Scrittura Ordini Operativi:**
   - Scrivi gli ordini dettagliati (Input, Output, SLA da `Flussi tra reparti`, file consentiti, criteri di accettazione) in `coordinamento/agente-1.md` … `coordinamento/agente-4.md` (e `coordinamento/agente-A1.md` … `agente-A7.md`).
3. **Esecuzione Parallela Sicura (Max 3 Agenti):**
   - Invoca i subagenti con `invoke_subagent` (massimo 3 in parallelo che modificano codice, mai due sugli stessi file).
4. **Verifica, Merge e Consegna in 5 Punti a Julian:**
   - Leggi `coordinamento/inbox-manager.md`, esegui i test (`npm run check:layout` e `npm run check:mobile`), aggiorna `docs/checklist.csv` e `coordinamento/BOARD.md`.
   - Consegna a Julian i **5 punti obbligatori** più la tabella **`Aggiornamenti checklist` (`# | Nuovo stato | Nota`)** pronta da incollare nel Google Sheet.
