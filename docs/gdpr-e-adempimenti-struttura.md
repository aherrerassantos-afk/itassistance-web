# Documentazione GDPR & Checklist Adempimenti per Tipo Struttura — Piano 4 · Itassistance

> **Riferimento Master Checklist 100:** Task `#8` (GDPR: informative, registro trattamenti, nomine responsabili esterni) e Task `#9` (Checklist adempimenti per tipo struttura verificata con il commercialista)
> **Titolare / Responsabile del Trattamento (`JUL-009`):** `Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.` · `admin@bluearroyo.it`
> **DPO / Referente Privacy:** `[DA CONFERMARE]` · **Estremi Polizza RC Professionale:** `[DA CONFERMARE]`

---

## 1. Architettura GDPR: Informative, Registro Trattamenti e Nomine art. 28 (Task `#8`)

### A. Ruoli Privacy tra Proprietario, Itassitance e Ospiti
1. **Trattamento Dati dei Proprietari (Clienti `itassistance`):**
   - **Titolare del Trattamento:** `Blue Arroyo SRL` (finalità contrattuali, fatturazione SDI, rendicontazione ARM, supporto operativo).
   - **Informativa Proprietario:** pubblicata in `/privacy.html` e accettata con timestamp nel flusso di attivazione (`/checkout.html` e Passo 1 Wizard).
2. **Trattamento Dati degli Ospiti Turistici (`/ospiti.html`, Alloggiati Web, ISTAT):**
   - **Titolare Autonomo / Contitolare per l'immobile:** il Proprietario / Gestore titolare del CIN/SCIA della struttura ricettiva.
   - **Responsabile Esterno del Trattamento (art. 28 Reg. UE 2016/679):** `Blue Arroyo SRL`, nominata automaticamente con la sottoscrizione del Contratto di Servizio per la raccolta dei documenti d'identità al Self Check-in, la trasmissione telematica ad Alloggiati Web e la conservazione delle ricevute.

### B. Registro delle Attività di Trattamento (Art. 30 GDPR)
| Categoria di Trattamento | Interessati | Dati Trattati | Base Giuridica | Tempi di Conservazione (Retention) | Misure di Sicurezza Tecniche |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Self Check-in & Schedine Alloggiati Web (Art. 109 TULPS)** | Ospiti turistici | Nome, cognome, data/luogo nascita, cittadinanza, estremi documento (solo per capogruppo/ospite singolo) | Obbligo di legge (Art. 109 TULPS e DM Interno 07/01/2013) | **Cancellazione automatica immagini documento** subito dopo l'invio; **conservazione ricevuta digitale `.pdf` per 5 anni** | HTTPS TLS 1.3, accesso RBAC, tracciato 168 caratteri validato |
| **2. Statistica Turistica ISTAT / Ross1000 & Imposta Soggiorno** | Ospiti turistici | Provenienza (comune/stato), date arrivo/partenza, esenzioni tassa di soggiorno | Obbligo di legge regionale/comunale (Regione Toscana / Comune di Firenze) | **5 anni** (per verifiche tributarie sul versamento dell'imposta di soggiorno) | Dati aggregati/pseudonimizzati nell'export XML/CSV Ross1000 |
| **3. Gestione Contrattuale, Fatturazione SDI e ARM Proprietari** | Proprietari e Partner | Anagrafica, CF/P.IVA, IBAN, contratti, fatture XML/PDF, rendiconti ARM | Esecuzione di un contratto e obblighi fiscali (DPR 633/72) | **10 anni** (obbligo civilistico e fiscale art. 2220 c.c.) | Separazione lato server `80% interno / 20% proprietario`, 2FA Admin |
| **4. Coordinamento Collaboratori P.IVA e Fornitori Field** | Collaboratori e Fornitori | Anagrafica P.IVA, IBAN, log attività, foto-report fine pulizia | Esecuzione del contratto quadro professionale | **10 anni** per documenti contabili; **12 mesi** per log operativi di turno | Profilo RBAC isolato (`COLLABORATOR_ASSIGNED_ONLY`) |

### C. Elenco Sub-Responsabili Esterni Nominati (Art. 28 GDPR)
- **Supabase Inc. (Data Center UE - Francoforte):** database cloud e autenticazione crittografata.
- **Commercialista & Intermediario SDI Abilitato (Firenze):** trasmissione fatture elettroniche XML al Sistema di Interscambio dell'Agenzia delle Entrate (`SDI M5UXCR1`) previa conferma del Pro-Forma nell'area `"My Box"` del Cliente (`JUL-036`).

---

## 2. Checklist Adempimenti per Tipo Struttura — Verificata con il Commercialista (Task `#9`)

| Adempimento Obbligatorio | **Locazione Turistica Breve** (Art. 4 DL 50/2017 · Non Imprenditoriale) | **CAV – Casa e Appartamenti per Vacanze** (Imprenditoriale / P.IVA) | **Affittacamere / B&B / Micro-Hotel** (1–10 unità) | Automazione attiva in `itassistance` |
| :--- | :--- | :--- | :--- | :--- |
| **1. CIN (Codice Identificativo Nazionale – BDSR Ministero Turismo)** | **Obbligatorio** (esposto all'esterno dello stabile e su tutti gli annunci OTA + sito diretto) | **Obbligatorio** (esposto all'esterno e su tutti i portali/canali) | **Obbligatorio** (esposto all'esterno e su tutti i canali) | Verifica formato `IT048017...` nel Passo 1 del Wizard (`Task #37, #101`) |
| **2. CIR / Codice Regionale Toscana (`048017...`) e SCIA / Comunicazione SUAP** | Comunicazione telematica locazioni turistiche al Comune di Firenze | SCIA al SUAP del Comune di Firenze | SCIA al SUAP + classificazione stelle/requisiti | Precompilazione prefisso `048017` con Google Maps Autocomplete (`Task #101`) |
| **3. Dotazioni di Sicurezza (Art. 13-ter DL 145/2023)** | Rilevatori gas combustibili + monossido di carbonio (CO) + estintore portatile omologato ogni `200 mq` / piano | Rilevatori gas + CO + estintori + cartellonistica e piano emergenza | Rilevatori gas + CO + estintori + revisione semestrale | Checklist dotazioni sicurezza in Scheda Unità (`Task #44`) |
| **4. Alloggiati Web Polizia di Stato (Art. 109 TULPS)** | Invio entro **24 ore** dall'arrivo (entro **6 ore** per soggiorni di 1 sola notte) + conservazione ricevuta **5 anni** | Invio entro **24h** (**6h** se 1 notte) + ricevuta **5 anni** | Invio entro **24h** (**6h** se 1 notte) + ricevuta **5 anni** | Generatore tracciato `.txt` 168 crt + archivio PDF 5 anni (`Task #9, #94`) |
| **5. Flussi Statistici ISTAT / Ross1000 (Città Metropolitana di Firenze)** | Trasmissione mensile arrivi e presenze entro la scadenza regionale | Trasmissione giornaliera/mensile su portale Ross1000 | Trasmissione giornaliera/mensile su portale Ross1000 | Esportazione 1-tap tracciato Ross1000 (`Task #73, #94`) |
| **6. Imposta di Soggiorno Comune di Firenze** | Calcolo su max **7 notti** consecutive, gestione esenzioni, dichiarazione e riversamento entro il **giorno 16 del mese successivo** | Dichiarazione mensile entro il **16 del mese successivo** + Conto Giudiziale Mod. 21 entro il **30 gennaio** | Dichiarazione mensile entro il **16 del mese** + Mod. 21 annuale | Calcolatore automatico Firenze senza ricarichi (`Task #73, #84`) |
| **7. Regime Fiscale degli Incassi & Ritenuta 21%** | **Cedolare Secca 21%** (1° immobile destinato a locazione breve) / **26%** (dal 2° al 4° immobile) o IRPEF ordinaria; verifica CU portali OTA | Fatturazione elettronica SDI (IVA 10% ricettività o regime forfettario se applicabile) | Fatturazione elettronica SDI / Corrispettivi telematici (IVA 10%) | Prospetto ARM + Export mensile per il Commercialista (`Task #21–29, #75`) |
