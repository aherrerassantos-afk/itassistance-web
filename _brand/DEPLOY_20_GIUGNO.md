# 📅 DEPLOY PIANIFICATO — 20 Giugno 2026

## Obiettivo
Completare il collegamento del dominio `itadreamteam.com` a Vercel dopo il trasferimento da Wix a GoDaddy.

## Data prevista
**Venerdì 20 Giugno 2026 — ore 15:20**

## Stato attuale (13 Giugno 2026)
- [x] Sito deployato su Vercel (production) ✅
- [x] Dominio aggiunto a Vercel (itadreamteam.com + www) ✅
- [x] Trasferimento dominio da Wix → GoDaddy AVVIATO ✅
  - Codice EPP usato: `3v+;R%pl).2C`
  - Aggiornamento WHOIS: 13/06/2026 13:13 UTC
- [ ] Attesa completamento trasferimento (5-7 giorni)
- [ ] Aggiornamento DNS su GoDaddy → Vercel
- [ ] Verifica sito live su https://www.itadreamteam.com

## Azioni da eseguire il 20 Giugno

### 1. Verifica trasferimento
```bash
whois itadreamteam.com | grep -i registrar
# Deve mostrare: GoDaddy (non più Wix)
```

### 2. Aggiorna DNS su GoDaddy (API Production)
Serve chiave GoDaddy **Production** (non OTE):
- A record: `@` → `76.76.21.21`
- CNAME: `www` → `cname.vercel-dns.com`

### 3. Deploy sito
```bash
cd /Users/andresjulianherrerasantos/itassistance
python3 _brand/deploy.py
```

### 4. Verifica
Aprire https://www.itadreamteam.com e confermare che mostri il sito itassistance (non quello Wix).

## Note
- Preview URL Vercel attuale: https://itadreamteam-site-6gtg6iy4l-aherrerassantos-8970s-projects.vercel.app
- Il sito è già pronto su Vercel — manca solo il DNS
- Ricordare: creare chiave GoDaddy **Production** (non OTE) per l'aggiornamento DNS automatico
