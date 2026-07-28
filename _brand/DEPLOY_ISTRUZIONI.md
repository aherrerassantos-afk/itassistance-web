# DEPLOY ISTRUZIONI — itadreamteam.com

## Credenziali Vercel
> ⚠️ Le credenziali reali sono conservate in modo sicuro (non su GitHub).
> Recuperale da: Vercel Dashboard → Settings → Tokens
```
TOKEN:      [VERCEL_TOKEN — vedi Vercel Dashboard]
TEAM_ID:    team_wYE2yw3QXaxi9R3rcreyqVWM
PROJECT_ID: prj_Qd2zNA1kNTJufUyEmZkSznCsKq0Z
```

## Procedura deploy (copia-incolla nel terminale)

```bash
VERCEL_TOKEN="[INSERISCI_QUI_IL_TUO_VERCEL_TOKEN]"
ORG_ID="team_wYE2yw3QXaxi9R3rcreyqVWM"
PROJECT_ID="prj_Qd2zNA1kNTJufUyEmZkSznCsKq0Z"

upload() {
  local f="$1" ct="$2"
  local sha=$(shasum -a 1 "$f" | awk '{print $1}')
  local sz=$(wc -c < "$f" | tr -d ' ')
  curl -s -X POST "https://api.vercel.com/v2/files?teamId=$ORG_ID" \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: $ct" \
    -H "x-vercel-digest: $sha" \
    --data-binary "@$f" > /dev/null
  echo "$sha $sz"
}

cd /Users/andresjulianherrerasantos/itassistance

# 1. Uplodare TUTTI i file modificati prima del deploy
read HTML_SHA HTML_SZ <<< $(upload index.html "text/html; charset=utf-8")
read CSS_SHA  CSS_SZ  <<< $(upload style.css  "text/css; charset=utf-8")
# aggiungere altri file modificati con la stessa sintassi...

# 2. Creare il deployment
curl -s -X POST "https://api.vercel.com/v13/deployments?teamId=$ORG_ID" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'   # vedere index.html per la lista file completa con SHA
```

## SHA file statici (non cambiano)
```
chat-widget.js:       3842d8b75430cbf6e36c9589dd5b51f47f288f38  (12163 bytes)
robots.txt:           df64114fd6cd1082395a0e952c1414578ac87267  (69 bytes)
sitemap.xml:          5d8cb28c20bdaffd96e03d569f94d7ef6284f99c  (216 bytes)
vercel.json:          febb4253edcee9937c13a4c57f33c313c2e5e589  (50 bytes)
favicon.ico:          f6249d1e1c44d0b68c83bfb9c8f3eda5f368b4d6  (5214 bytes)
favicon-32.png:       52aeb61be04ecb1f4fbad977da65da881784df4d  (1499 bytes)
favicon-192.png:      c804a93bf8a456f268ad5f51019614ec7a394f6b  (29808 bytes)
apple-touch-icon.png: de75c18dea8f27f83c924b4d8b5661be76357a06  (26976 bytes)
hero.png:             8d4b0e6b161083fd1115785ebc0e1dd567b2d9fa  (861197 bytes)
logo.png:             38b987e3a326c3ca5ce7fc7f5570d0a93cdddbbb  (94607 bytes)
art-checkin.png:      1a4c81bde2c4499b29e968ed90fdbc7bdf22e53d
art-phone.png:        dc11d3a097b32e6b3337c11f68533c888daed1a4
art-maintenance.png:  f9892b4b83f933587dc239e3dfbb23f0c140e57a
art-emergency.png:    6bcc52da6111f982a664f2b759fe722a0f4fa8de
```

## Collegare dominio itadreamteam.com
1. Accedere a GoDaddy → DNS settings per `itadreamteam.com`
2. Aggiungere record CNAME: `@` → `cname.vercel-dns.com`
3. Oppure usare API Vercel: `POST /v10/projects/{PROJECT_ID}/domains`
   con body `{"name": "itadreamteam.com"}`
