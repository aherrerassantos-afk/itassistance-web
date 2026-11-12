---
description: Comando /report per gli agenti operativi (Agente 1-4 / A1-A7). Genera e salva il report standard di fine sessione in coordinamento/inbox-manager.md e produce la tabella Aggiornamenti checklist per il Google Sheet.
---

# Workflow `/report` — Consegna Standard Agente Operativo

Quando viene invocato `/report` (o al termine dell'esecuzione di un ordine in `coordinamento/agente-X.md`), esegui nell'ordine:

1. **Verifica Test e Invarianti:**
   - Controlla che le modifiche siano solo additive sui file condivisi (`CONDIVISO: <file>`).
   - Verifica fuso `Europe/Rome`, valuta `EUR`, filtro `80% interno / 20% proprietario` e registrazione nello storico azioni (Audit Log).
2. **Aggiorna `coordinamento/inbox-manager.md`:**
   Aggiungi in cima a `coordinamento/inbox-manager.md` il blocco con i **5 punti obbligatori**:
   - **1. Task lavorate con il nuovo stato (`In corso` / `Fatto` / `Bloccato`)**
   - **2. File modificati** (con tag `CONDIVISO: <file>` per i moduli condivisi)
   - **3. Test eseguiti e risultato**
   - **4. Blocchi e da chi dipendono** (`Task #` e `Agente`)
   - **5. Nuove task proposte (`n. 101+`)** con `[PROPOSTA Agente N]`
3. **Genera la Tabella `Aggiornamenti checklist` per il Google Sheet:**
   ```markdown
   | # | Nuovo stato | Nota |
   | :--- | :--- | :--- |
   | <ID> | <In corso / Fatto / Bloccato> | [Agente N – gg/mm] cosa è stato fatto · file/moduli toccati (CONDIVISO: ...) · prossimo passo |
   ```
