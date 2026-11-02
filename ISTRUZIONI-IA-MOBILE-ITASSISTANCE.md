# ISTRUZIONI PER L'IA — Regole Permanenti itassistance (`SITE_RULES.md`)

> Da leggere **prima** di qualsiasi modifica al sito `itadreamteam.com` (repo `itassistance-web`). Consultare sempre anche `SITE_RULES.md` e `/site-config.js`.

## 1. Il Modello di Business (Fonte di Verità)
- **Prodotto:** `itassistance` è un'app che gestisce l'appartamento in affitto breve e guida il proprietario in tutta la parte operativa, fiscale e amministrativa.
- **Per chi:** proprietari che NON hanno un property manager e vogliono tenere sotto mano il proprio appartamento senza pagare il 18–25% di commissione.
- **Promessa:** il lavoro del proprietario diventa di circa **10 minuti al giorno**. Ogni mattina alle 08:00 l'app invia il report del giorno con le cose da fare per essere in regola (Alloggiati Web Polizia di Stato, tassa di soggiorno, comunicazioni obbligatorie, pagamento fornitori).
- **Prezzo:** **99 € al mese (IVA inclusa)**, fisso per appartamento. Zero commissioni sulle prenotazioni nel piano base.
- **Extra opzionale (+10%):** disponibile come aggiunta opzionale se il cliente desidera delegare anche il **Revenue Management e gli adempimenti di legge**.
- **Pagamento e Garanzia:** pagabile mese per mese (99 €/mese) oppure annuale anticipato (1.188 €/anno IVA inclusa), senza vincoli e con disdetta libera. **Garanzia 14 giorni Soddisfatto o Rimborsato** (rimborso 100% se disdici entro 14 giorni).
- **Tre Pilastri:** **CONTROLLO** · **SEMPLICITÀ** · **RISPARMIO**.

## 2. Regole di Coerenza e Marchio
1. **Marchio:** sempre e solo `itassistance` (minuscolo, una parola). Vietati `it.assistance`, `it.`, `itassitance`, `ITASSISTANCE`.
2. **Fonte unica dati:** tutti i prezzi, orari e contatti vengono da `/site-config.js`.
3. **Orari assistenza:** `Tutti i giorni dalle 09:00 alle 23:00` (mai scrivere `24/7`).
4. **Contatti unici:** Telefono e WhatsApp `+39 351 038 0392` · Email `info@itadreamteam.com`.
5. **Ragione sociale:** `Blue Arroyo SRL`, P.IVA `07480210488`, Via Matteo Palmieri 20r, 50122 Firenze (FI) — solo nel footer, termini/contratto, privacy e fatture.
6. **PDF Check-in:** una sola lingua per documento (`it` oppure `en`), zero segnaposto vuoti (`N/A`, `()`, `—`). Se un dato manca, la riga viene omessa.

## 3. Regola Generale Obbligatoria Dopo Ogni Deploy
- **Dopo ogni deploy**, presenta sempre:
  1. **Check di cosa è stato fatto** (allineamento con la visione `itassistance`).
  2. **Suggerimento del passaggio successivo più efficace** (nuove funzioni da implementare, integrazioni backend/automazioni, o miglioramenti ad alto impatto sul funnel) per mantenere una tabella di marcia chiara ed efficace.
