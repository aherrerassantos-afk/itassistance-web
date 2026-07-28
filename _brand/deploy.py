#!/usr/bin/env python3
"""Deploy itassistance a Vercel — solo file pubblici, niente .git o _brand"""
import os, json, hashlib, urllib.request, urllib.error

TOKEN  = "[VERCEL_TOKEN_PRIVATO]"
TEAM   = "team_wYE2yw3QXaxi9R3rcreyqVWM"
PROJ   = "prj_Qd2zNA1kNTJufUyEmZkSznCsKq0Z"
ROOT   = "/Users/andresjulianherrerasantos/itassistance"

# Cartelle da escludere completamente
EXCLUDE_DIRS  = {".git", "_brand", "__pycache__", "node_modules", ".DS_Store"}
EXCLUDE_FILES = {".DS_Store", ".gitignore"}

CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css":  "text/css; charset=utf-8",
    ".js":   "application/javascript; charset=utf-8",
    ".json": "application/json",
    ".xml":  "application/xml",
    ".txt":  "text/plain",
    ".png":  "image/png",
    ".ico":  "image/x-icon",
    ".jpg":  "image/jpeg",
    ".svg":  "image/svg+xml",
}

def sha1(path):
    h = hashlib.sha1()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()

def upload(path, content_type):
    digest = sha1(path)
    size   = os.path.getsize(path)
    with open(path, "rb") as f:
        data = f.read()
    req = urllib.request.Request(
        f"https://api.vercel.com/v2/files?teamId={TEAM}",
        data=data,
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": content_type,
            "x-vercel-digest": digest,
            "Content-Length": str(size),
        },
        method="POST"
    )
    try:
        urllib.request.urlopen(req)
    except urllib.error.HTTPError as e:
        if e.code not in (200, 201, 409):
            body = e.read().decode()
            print(f"  ⚠️  {e.code}: {body[:150]}")
    return digest, size

def collect_files():
    files = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        # Rimuovi cartelle escluse in-place
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for fname in filenames:
            if fname in EXCLUDE_FILES:
                continue
            full = os.path.join(dirpath, fname)
            rel  = os.path.relpath(full, ROOT)
            ext  = os.path.splitext(fname)[1].lower()
            ct   = CONTENT_TYPES.get(ext, "application/octet-stream")
            files.append((rel, full, ct))
    return sorted(files)

print("🚀 itassistance Deploy — Vercel (solo file pubblici)")
print("=" * 55)

all_files = collect_files()
print(f"📁 File da deployare: {len(all_files)}")
for rel, _, _ in all_files:
    print(f"   {rel}")

print("\n📤 Upload in corso...")
payload_files = []
for rel, full, ct in all_files:
    print(f"   ⬆ {rel}...", end="", flush=True)
    digest, size = upload(full, ct)
    payload_files.append({"file": rel, "sha": digest, "size": size})
    print(f" ✓ ({size:,} b)")

print(f"\n🏗️  Creazione deployment ({len(payload_files)} file)...")
deploy_body = {
    "name":      "itadreamteam-site",
    "projectId": PROJ,
    "target":    "production",
    "files":     payload_files,
}
req = urllib.request.Request(
    f"https://api.vercel.com/v13/deployments?teamId={TEAM}",
    data=json.dumps(deploy_body).encode(),
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json",
    },
    method="POST"
)
try:
    res  = urllib.request.urlopen(req)
    data = json.loads(res.read())
    url  = data.get("url", "")
    did  = data.get("id", "")
    state= data.get("readyState", "")
    print(f"\n✅ Deployment creato!")
    print(f"   ID:    {did}")
    print(f"   URL:   https://{url}")
    print(f"   Stato: {state}")

    # Aggiungi dominio itadreamteam.com
    print("\n🌐 Aggiunta dominio itadreamteam.com...")
    dom_req = urllib.request.Request(
        f"https://api.vercel.com/v10/projects/{PROJ}/domains?teamId={TEAM}",
        data=json.dumps({"name": "itadreamteam.com"}).encode(),
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": "application/json",
        },
        method="POST"
    )
    try:
        dom_res = urllib.request.urlopen(dom_req)
        dom_data = json.loads(dom_res.read())
        print(f"   ✅ Dominio aggiunto: {dom_data.get('name','')}")
        print(f"   Verifica DNS: {dom_data.get('verified', False)}")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"   ⚠️  Dominio: {e.code} — {body[:300]}")

except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"\n❌ Errore deployment: {e.code}")
    print(body[:3000])

print("\n✅ Script completato.")
