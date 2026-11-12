# Ordine Operativo — Agente A7 (`a7-revenue-frontdesk`)

## Task #101 — Autocompletamento Indirizzo Google Maps & Precompilazione Automatica Colonne Form
- **Origine:** Richiesta di Julian con screenshot mobile del Passo 1 del Wizard (`Indirizzo completo struttura *` con `"Via dei Pandolfini 21"`).
- **Obiettivo:**
  1. Assistere l'utente mentre digita in `Indirizzo completo struttura *` (`#ob-s-address` in `app.html` e `#f-addr` in `checkout.html`) con suggerimenti indirizzo completo tramite Google Maps / Geocoding stradario.
  2. Quando l'utente seleziona un suggerimento (o clicca su `"Completa con Google Maps"`), riempire in automatico l'indirizzo formattato completo (es. `Via dei Pandolfini 21, 50122 Firenze (FI), Italia`) e **tutte le colonne collegate del form**:
     - `CAP *` (`#ob-s-zip`), `Comune / Città *` (`#ob-s-city`), `Provincia *` (`#ob-s-prov`), `Quartiere e Zona ZTL / Hub Blue Arroyo` (`#ob-s-district`)
     - `Nome commerciale struttura *` (`#ob-s-comm-name`, se vuoto o predefinito)
     - `Imposta di soggiorno (€/notte)` (`#ob-s-tax-rate`), `Massimo notti imponibili` (`#ob-s-tax-max`), `Esenzioni imposta di soggiorno` (`#ob-s-tax-ex`)
     - Prefissi istituzionali comunali per `Codice CIN` (`#ob-s-cin`), `Codice CIR` (`#ob-s-cir`), `Utente Alloggiati Web` (`#ob-s-aw-user`), `Codice ISTAT / Ross1000` (`#ob-s-istat`)
     - `Fuso orario struttura` (`Europe/Rome`), `Valuta predefinita` (`EUR`) ed `Etichetta Turno Blue Arroyo` nel Passo 2.
- **Vincoli:** Rispettare `GEMINI.md` ("Il Design Non Si Taglia Mai"), zero emoji, bottoni/voci touch-friendly anche con tastiera telefono aperta.
