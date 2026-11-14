const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const cloudSyncPath = path.join(ROOT_DIR, 'cloud-sync.js');
const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
const siteConfigPath = path.join(ROOT_DIR, 'site-config.js');

const cloudSyncCode = fs.readFileSync(cloudSyncPath, 'utf8');
const indexHtmlCode = fs.readFileSync(indexHtmlPath, 'utf8');
const siteConfigCode = fs.readFileSync(siteConfigPath, 'utf8');

const findings = [];

function recordFinding(category, severity, location, issue, impact, recommendation) {
  findings.push({ category, severity, location, issue, impact, recommendation });
}

console.log("=== SELF-HACKING & BUG HUNTING AUDIT (ITASSISTANCE) ===");

// 1. BACKDOOR & AUTH BYPASS CHECK
console.log("\n[TEST 1] Verifica Backdoor & Auth Bypass in loginPropertyAccount...");
if (cloudSyncCode.includes("pinOrPassword === 'holding2026'") || cloudSyncCode.includes("pinOrPassword === '2580'")) {
  recordFinding(
    'Backdoor / Leaked Credential',
    'CRITICAL',
    'cloud-sync.js:loginPropertyAccount',
    'Trovata backdoor con password hardcoded ("holding2026" / "2580") che consente il login non autorizzato a qualsiasi account proprietario.',
    'Chiunque conosca o indovini l\'email di un proprietario può accedere al suo account e visualizzare i dati sensibili senza credenziali valide.',
    'Rimuovere immediatamente i controlli hardcoded `pinOrPassword === "holding2026"` e `pinOrPassword === "2580"`.'
  );
  console.log("  ❌ VULNERABILITÀ CRITICA RILEVATA: Backdoor hardcoded presente in loginPropertyAccount!");
} else {
  console.log("  ✅ Nessuna backdoor hardcoded trovata in loginPropertyAccount.");
}

// 2. EMPTY CATCH & SILENT FAILURES CHECK
console.log("\n[TEST 2] Caccia ai Silent Failures & Empty Catch Blocks...");
const emptyCatchRegex = /catch\s*\([^)]*\)\s*\{\s*\}/g;
let match;
while ((match = emptyCatchRegex.exec(cloudSyncCode)) !== null) {
  // Find line number
  const linesUpTo = cloudSyncCode.substring(0, match.index).split('\n').length;
  // Solo se nella sezione bicefala o generale recente (dopo linea 4580)
  if (linesUpTo >= 4580 && linesUpTo <= 4900) {
    recordFinding(
      'Empty Catch Block / Silent Failure',
      'HIGH',
      `cloud-sync.js:L${linesUpTo}`,
      `Blocco catch vuoto che inghiotte eccezioni: "${match[0]}"`,
      'Errori di rete, parsing o storage fallito vengono silenziati senza logging né notifica al chiamante.',
      'Sostituire catch vuoti con logging contestualizzato (console.warn/error) e segnalazione di fallback.'
    );
    console.log(`  ❌ SILENT FAILURE: Blocco catch vuoto a riga ${linesUpTo} in cloud-sync.js`);
  }
}

const emptyPromiseCatchRegex = /\.catch\s*\(\s*(?:function\s*\([^)]*\)\s*\{\s*\}|\(\s*[^)]*\s*\)\s*=>\s*\{\s*\})\s*\)/g;
while ((match = emptyPromiseCatchRegex.exec(cloudSyncCode)) !== null) {
  const linesUpTo = cloudSyncCode.substring(0, match.index).split('\n').length;
  if (linesUpTo >= 4580 && linesUpTo <= 4900) {
    recordFinding(
      'Swallowed Promise Rejection / Silent Network Failure',
      'HIGH',
      `cloud-sync.js:L${linesUpTo}`,
      `Promise catch vuoto che inghiotte fallimenti HTTP/rete: "${match[0]}"`,
      'I fallimenti di sincronizzazione verso Supabase o webhook n8n falliscono silenziosamente.',
      'Raccogliere lo stato di risposta della chiamata (ok, status, error) e restituire cloudSyncStatus al chiamante.'
    );
    console.log(`  ❌ SILENT NETWORK FAILURE: .catch(function () {}) a riga ${linesUpTo} in cloud-sync.js`);
  }
}

// 3. FAKE PASS CODE DANGEROUS FALLBACK IN INDEX.HTML
console.log("\n[TEST 3] Verifica Fallback Pericoloso / Fake Pass in index.html...");
if (indexHtmlCode.includes("passCode: 'ITA-2026-FI' + Math.floor") || indexHtmlCode.includes("ITA-2026-FI894")) {
  recordFinding(
    'Dangerous Fallback / Fake Success',
    'HIGH',
    'index.html:handleTravelerCoverageSubmit',
    'In caso di fallimento o assenza di sync, il form genera un pass code fittizio ("ITA-2026-FI894") e notifica falsamente successo all\'utente.',
    'L\'utente è convinto di avere copertura attiva, ma la richiesta non è stata salvata né convalidata.',
    'Verificare esplicitamente `res && res.ok` e mostrare messaggio di errore all\'utente in caso di fallimento.'
  );
  console.log("  ❌ DANGEROUS FALLBACK RILEVATO: Generazione di finto pass code in caso di fallimento!");
}

// 4. CRASH & TYPE SAFETY SIMULATION IN CLOUD-SYNC.JS
console.log("\n[TEST 4] Stress Test Funzionale & Simulazione Crash in cloud-sync.js...");
// Mock browser environment
const localStorageMock = {
  _store: {},
  getItem: function(k) { return this._store[k] || null; },
  setItem: function(k, v) { this._store[k] = String(v); },
  removeItem: function(k) { delete this._store[k]; }
};

const windowMock = {
  localStorage: localStorageMock,
  SITE_CONFIG: {
    cloud: { supabaseUrl: '', supabaseAnonKey: '' }
  }
};

try {
  // Evaluates isolated functions from cloud-sync
  const sandbox = {
    root: windowMock,
    window: windowMock,
    localStorage: localStorageMock,
    fetch: async () => ({ ok: true, status: 200, json: async () => ({}) })
  };

  // Test getTravelerCoverageByPass with null passCode in stored profile
  localStorageMock.setItem('ita_db_profili_turisti_copertura_v1', JSON.stringify([
    { passCode: null, nome: 'Test' }
  ]));

  // Test regex on passCode.toUpperCase()
  if (cloudSyncCode.includes("p.passCode.toUpperCase()")) {
    recordFinding(
      'Unhandled TypeError Crash',
      'HIGH',
      'cloud-sync.js:getTravelerCoverageByPass',
      'Chiamata a `p.passCode.toUpperCase()` senza verificare se passCode è null/undefined.',
      'Un profilo corrotto o senza passCode in localStorage causa il crash immediato di getTravelerCoverageByPass con TypeError.',
      'Usare `(p.passCode || "").toUpperCase() === code`.'
    );
    console.log("  ❌ TYPE ERROR RISK: `p.passCode.toUpperCase()` può andare in crash su profili con passCode nullo!");
  }

} catch (err) {
  console.log("  ❌ Errore durante stress test sandbox:", err.message);
}

// 5. INPUT SANITIZATION & XSS AUDIT
console.log("\n[TEST 5] Verifica Sanitizzazione Input & XSS...");
if (!cloudSyncCode.includes("sanitize") && !cloudSyncCode.includes("stripHtml") && (cloudSyncCode.includes("p.nome || ''"))) {
  recordFinding(
    'Missing Input Sanitization / XSS Risk',
    'MEDIUM',
    'cloud-sync.js:registerTravelerCoverageProfile / registerPropertyAccount',
    'I campi stringa (`nome`, `cognome`, `email`, `citta`, `indirizzo`) non vengono sanificati prima del salvataggio nel database locale/cloud.',
    'Se questi valori vengono successivamente visualizzati in dashboard o CRM senza escaping, espongono a Stored XSS.',
    'Aggiungere funzione di sanitizzazione/escaping dei caratteri pericolosi (<, >, ", \', &).'
  );
  console.log("  ⚠️ SANITIZATION: Mancata sanitizzazione form bicefalo contro stored XSS!");
}

// 6. SAFE AREA & RESPONSIVE CHECK IN INDEX.HTML
console.log("\n[TEST 6] Verifica Safe Area Inset Right in index.html...");
if (indexHtmlCode.includes("padding: 8px max(16px, env(safe-area-inset-left));")) {
  recordFinding(
    'Design Non Si Taglia Mai / Safe Area Violation',
    'MEDIUM',
    'index.html:.audience-switcher-bar',
    'La barra `.audience-switcher-bar` usa solo `env(safe-area-inset-left)` per il padding orizzontale, ignorando `safe-area-inset-right`.',
    'Su iPhone in orizzontale o con Dynamic Island, i contenuti possono essere coperti dal bordo destro.',
    'Impostare `padding: 8px max(16px, env(safe-area-inset-right)) 8px max(16px, env(safe-area-inset-left));`.'
  );
  console.log("  ⚠️ SAFE AREA: safe-area-inset-right mancante su .audience-switcher-bar!");
}

console.log("\n=== RIEPILOGO VULNERABILITÀ RILEVATE ===");
console.log(`Totale finding: ${findings.length}`);
findings.forEach((f, idx) => {
  console.log(`\n[${idx + 1}] [${f.severity}] ${f.category} - ${f.location}`);
  console.log(`    Problema: ${f.issue}`);
  console.log(`    Impatto:  ${f.impact}`);
  console.log(`    Fix:      ${f.recommendation}`);
});

fs.writeFileSync(path.join(ROOT_DIR, 'scripts/self-hacking-report.json'), JSON.stringify(findings, null, 2));
