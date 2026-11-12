import crypto from 'crypto';
import fs from 'fs';

const LOCAL_CREDENTIALS_PATH = '/Users/julianherrera/.gemini/antigravity/brain/a900a2b5-027f-4f0d-b569-689666741743/scratch/itassistance-credentials.local.json';
const TMP_STORE_PATH = '/tmp/ita-credentials-store.json';

function sha256Hex(input) {
  return crypto.createHash('sha256').update(String(input || ''), 'utf8').digest('hex');
}

function readJsonSafe(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {}
  return fallback;
}

function writeJsonSafe(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), { encoding: 'utf8', mode: 0o600 });
    return true;
  } catch (e) {
    return false;
  }
}

function loadSystemAccounts() {
  const localCfg = readJsonSafe(LOCAL_CREDENTIALS_PATH, { accounts: [] });
  const tmpCfg = readJsonSafe(TMP_STORE_PATH, { accounts: [] });
  const envAccounts = [];

  if (process.env.ITA_SUPERADMIN_EMAIL && process.env.ITA_SUPERADMIN_PASSWORD_HASH) {
    envAccounts.push({
      id: 'acc_env_superadmin',
      email: String(process.env.ITA_SUPERADMIN_EMAIL).trim().toLowerCase(),
      passwordHash: String(process.env.ITA_SUPERADMIN_PASSWORD_HASH).trim().toLowerCase(),
      role: 'super_admin',
      roleLabel: 'Team ITASSISTANCEDREAMTEAM.IT — Super Admin',
      fullName: 'Super Admin ITASSISTANCEDREAMTEAM.IT',
      targetDashboard: '/admin.html',
      canManageCredentials: true,
      active: true
    });
  }

  if (process.env.ITA_CUSTOMERCARE_EMAIL && process.env.ITA_CUSTOMERCARE_PASSWORD_HASH) {
    envAccounts.push({
      id: 'acc_env_customercare',
      email: String(process.env.ITA_CUSTOMERCARE_EMAIL).trim().toLowerCase(),
      passwordHash: String(process.env.ITA_CUSTOMERCARE_PASSWORD_HASH).trim().toLowerCase(),
      role: 'customer_care',
      roleLabel: 'Team ITASSISTANCEDREAMTEAM.IT — Customer Care (OM)',
      fullName: 'Customer Care (OM) ITASSISTANCEDREAMTEAM.IT',
      targetDashboard: '/admin.html',
      canManageCredentials: false,
      active: true
    });
  }

  const combined = []
    .concat(envAccounts)
    .concat(Array.isArray(localCfg.accounts) ? localCfg.accounts : [])
    .concat(Array.isArray(tmpCfg.accounts) ? tmpCfg.accounts : []);

  const byEmail = new Map();
  combined.forEach((acc) => {
    if (!acc || !acc.email) return;
    const key = String(acc.email).trim().toLowerCase();
    byEmail.set(key, {
      id: acc.id || ('acc_' + key.replace(/[^a-z0-9]/g, '_')),
      email: key,
      passwordHash: String(acc.passwordHash || '').trim().toLowerCase(),
      role: acc.role || 'cliente',
      roleLabel:
        acc.role === 'super_admin'
          ? 'Team ITASSISTANCEDREAMTEAM.IT — Super Admin'
          : acc.role === 'customer_care'
          ? 'Team ITASSISTANCEDREAMTEAM.IT — Customer Care (OM)'
          : 'Cliente (Proprietario — Fatturazione e My Box)',
      fullName: acc.fullName || acc.name || key,
      clientId: acc.clientId || null,
      structureIds: Array.isArray(acc.structureIds) ? acc.structureIds : [],
      targetDashboard: acc.role === 'super_admin' || acc.role === 'customer_care' ? '/admin.html' : '/app.html',
      canManageCredentials: acc.role === 'super_admin',
      active: acc.active !== false,
      updatedAt: acc.updatedAt || new Date().toISOString()
    });
  });

  return Array.from(byEmail.values());
}

function sanitizeAccountPublic(acc) {
  if (!acc) return null;
  return {
    id: acc.id,
    email: acc.email,
    role: acc.role,
    roleLabel: acc.roleLabel,
    fullName: acc.fullName,
    clientId: acc.clientId || null,
    structureIds: Array.isArray(acc.structureIds) ? acc.structureIds : [],
    targetDashboard: acc.targetDashboard,
    canManageCredentials: Boolean(acc.canManageCredentials),
    active: acc.active !== false,
    updatedAt: acc.updatedAt
  };
}

/**
 * Serverless Endpoint: /api/auth
 * Gestisce l'autenticazione interna e i profili di ITASSISTANCEDREAMTEAM.IT (JUL-061):
 *   1. super_admin   -> Team ITASSISTANCEDREAMTEAM.IT — Super Admin (/admin.html + gestione credenziali)
 *   2. customer_care -> Team ITASSISTANCEDREAMTEAM.IT — Customer Care (OM) (/admin.html operativo, senza gestione credenziali)
 *   3. cliente       -> Cliente = Il Proprietario, chi paga le nostre fatture (/app.html + "My Box")
 *   Nota: Usuario = Il Turista / Ospite che approfitta della copertura e gamma di servizi pubblici (nessun login interno).
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const taxonomy = {
    brand: 'ITASSISTANCEDREAMTEAM.IT',
    company: 'BLUEARROYO S.R.L. – Sede legale: Via Matteo Palmieri 20/R, 50122 Firenze (FI)',
    profiles: {
      super_admin: {
        role: 'super_admin',
        label: 'Team ITASSISTANCEDREAMTEAM.IT — Super Admin',
        dashboard: '/admin.html',
        canManageCredentials: true,
        description: 'Dashboard completa ITASSISTANCEDREAMTEAM.IT + gestione credenziali e permessi.'
      },
      customer_care: {
        role: 'customer_care',
        label: 'Team ITASSISTANCEDREAMTEAM.IT — Customer Care (OM)',
        dashboard: '/admin.html',
        canManageCredentials: false,
        description: 'Stessa dashboard operativa del Super Admin (chiamata Customer Care per l\'OM), profilo distinto senza gestione credenziali.'
      },
      cliente: {
        role: 'cliente',
        label: 'Cliente (Il Proprietario — chi paga le nostre fatture)',
        dashboard: '/app.html',
        canManageCredentials: false,
        description: 'Accesso esclusivo all\'Area Proprietario (app.html), alle proprie strutture e al proprio Inbox "My Box" (Report 08:00 AM, foto check-in del Concierge e Pro-Forma).'
      },
      usuario: {
        role: 'usuario',
        label: 'Usuario (Il Turista / Ospite)',
        dashboard: null,
        requiresLogin: false,
        description: 'Il turista che soggiorna nelle strutture e approfitta della nostra copertura e gamma di servizi (+39 349 177 5561 · itassistance@bluearroyo.it).'
      }
    }
  };

  if (req.method === 'GET') {
    const accounts = loadSystemAccounts().map(sanitizeAccountPublic);
    return res.status(200).json({
      ok: true,
      taxonomy,
      accounts
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const action = String(body.action || 'login').trim();

    if (action === 'login') {
      const email = String(body.email || '').trim().toLowerCase();
      const rawPassword = String(body.password || '');
      const providedHash = String(body.passwordHash || (rawPassword ? sha256Hex(rawPassword) : '')).trim().toLowerCase();

      if (!email || !providedHash) {
        return res.status(400).json({
          ok: false,
          error: 'Inserisci email e password per accedere.'
        });
      }

      const accounts = loadSystemAccounts();
      const matched = accounts.find((a) => a.email === email);
      if (!matched || matched.active === false || matched.passwordHash !== providedHash) {
        return res.status(401).json({
          ok: false,
          error: 'Credenziali non valide o profilo disattivato.'
        });
      }

      const pub = sanitizeAccountPublic(matched);
      return res.status(200).json({
        ok: true,
        session: {
          token: 'ita_sess_' + sha256Hex(matched.email + ':' + Date.now()).slice(0, 32),
          user: pub,
          loggedAt: new Date().toISOString()
        },
        taxonomy
      });
    }

    if (action === 'upsert_account') {
      const actorRole = String(body.actorRole || 'super_admin').trim();
      if (actorRole !== 'super_admin') {
        return res.status(403).json({
          ok: false,
          error: 'Solo il profilo Super Admin può creare o modificare le credenziali di accesso.'
        });
      }

      const email = String(body.email || '').trim().toLowerCase();
      const role = ['super_admin', 'customer_care', 'cliente'].includes(body.role) ? body.role : 'cliente';
      const fullName = String(body.fullName || body.name || email).trim();
      const rawPassword = String(body.password || '');
      const passwordHash = String(body.passwordHash || (rawPassword ? sha256Hex(rawPassword) : '')).trim().toLowerCase();

      if (!email) {
        return res.status(400).json({ ok: false, error: 'Email obbligatoria.' });
      }

      const store = readJsonSafe(TMP_STORE_PATH, { accounts: [] });
      if (!Array.isArray(store.accounts)) store.accounts = [];
      const existingIdx = store.accounts.findIndex((a) => a && String(a.email).toLowerCase() === email);
      const prev = existingIdx !== -1 ? store.accounts[existingIdx] : {};

      const record = {
        id: body.id || prev.id || ('acc_' + Date.now()),
        email,
        passwordHash: passwordHash || prev.passwordHash || '',
        role,
        fullName,
        clientId: body.clientId !== undefined ? body.clientId : (prev.clientId || null),
        structureIds: Array.isArray(body.structureIds) ? body.structureIds : (prev.structureIds || []),
        active: body.active !== undefined ? Boolean(body.active) : (prev.active !== false),
        updatedAt: new Date().toISOString()
      };

      if (existingIdx !== -1) {
        store.accounts[existingIdx] = record;
      } else {
        store.accounts.push(record);
      }
      writeJsonSafe(TMP_STORE_PATH, store);

      const allAccounts = loadSystemAccounts().map(sanitizeAccountPublic);
      return res.status(200).json({
        ok: true,
        account: sanitizeAccountPublic(record),
        accounts: allAccounts
      });
    }

    return res.status(400).json({ ok: false, error: 'Azione non supportata.' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}
