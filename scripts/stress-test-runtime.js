const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("=== RUNTIME STRESS & RED TEAM SIMULATION ===");

// Build a browser-like sandbox
class LocalStorageMock {
  constructor() {
    this.store = {};
    this.throwOnSet = false;
  }
  getItem(key) { return this.store[key] || null; }
  setItem(key, val) {
    if (this.throwOnSet) {
      const err = new Error('QuotaExceededError: DOM Exception 22');
      err.name = 'QuotaExceededError';
      throw err;
    }
    this.store[key] = String(val);
  }
  removeItem(key) { delete this.store[key]; }
  clear() { this.store = {}; }
}

const mockLocalStorage = new LocalStorageMock();
let fetchMockBehavior = 'normal'; // 'normal' | 'reject' | 'http_500'

const mockFetch = async (url, options) => {
  if (fetchMockBehavior === 'reject') {
    throw new Error('TypeError: Failed to fetch (Network connection lost / DNS failure)');
  }
  if (fetchMockBehavior === 'http_500') {
    return { ok: false, status: 500, json: async () => ({ error: 'Internal Server Error' }) };
  }
  return { ok: true, status: 200, json: async () => ({ ok: true }) };
};

const sandbox = {
  window: {},
  root: {},
  document: {
    addEventListener: () => {},
    getElementById: () => null,
    querySelector: () => null
  },
  localStorage: mockLocalStorage,
  fetch: mockFetch,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Date: Date,
  Math: Math,
  JSON: JSON,
  Array: Array,
  Object: Object,
  String: String,
  Boolean: Boolean,
  parseInt: parseInt,
  parseFloat: parseFloat,
  RegExp: RegExp,
  crypto: {
    subtle: {
      digest: async (algo, data) => {
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(Buffer.from(data)).digest();
      }
    }
  }
};
sandbox.root = sandbox.window;
sandbox.window.SITE_CONFIG = {
  cloud: {
    supabaseUrl: 'https://test-project.supabase.co',
    supabaseAnonKey: 'test-anon-key'
  }
};

const cloudSyncCode = fs.readFileSync(path.join(__dirname, '../cloud-sync.js'), 'utf8');
vm.createContext(sandbox);
vm.runInContext(cloudSyncCode, sandbox);

const ITACloudSync = sandbox.window.ITACloudSync;
if (!ITACloudSync) {
  console.error("❌ ERRORE: ITACloudSync non esportato correttamente!");
  process.exit(1);
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    failed++;
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

async function runTests() {
  console.log("\n--- TEST SUITE 1: FORM TURISTI & XSS / INJECTION ---");
  // 1.1 Test Malicious XSS Payload in traveler profile
  const xssPayload = {
    nome: "<script>alert('XSS')</script>",
    cognome: "Rossi' OR '1'='1",
    email: "test.turista@example.com",
    telefonoWhatsapp: "+39 333 <img src=x onerror=alert(1)>",
    citta: "Firenze<svg onload=alert(1)>",
    indirizzo: "Via de' Bardi \" ; DROP TABLE --",
    note: "<script>document.cookie</script>"
  };
  const xssRes = await ITACloudSync.registerTravelerCoverageProfile(xssPayload);
  assert(xssRes.ok === true, "Registrazione con caratteri speciali completata");
  assert(!xssRes.profilo.nome.includes("<script>"), "Tag <script> sanificato nel nome: " + xssRes.profilo.nome);
  assert(xssRes.profilo.nome.includes("&lt;script&gt;"), "Tag <script> convertito in entità sicure");
  assert(!xssRes.profilo.telefonoWhatsapp.includes("<img"), "Tag <img> sanificato nel telefono");
  assert(!xssRes.profilo.noteConcierge.includes("<script>"), "Tag <script> sanificato nelle note concierge");

  // 1.2 Test Empty / Missing Required Fields
  const emptyRes = await ITACloudSync.registerTravelerCoverageProfile({});
  assert(emptyRes.ok === false, "Rifiutata registrazione turista con payload vuoto");
  assert(emptyRes.error && emptyRes.error.includes("email"), "Errore esplicito su email mancante: " + emptyRes.error);

  const noPhoneRes = await ITACloudSync.registerTravelerCoverageProfile({ email: "turista@test.com", nome: "Mario" });
  assert(noPhoneRes.ok === false, "Rifiutata registrazione turista senza numero di telefono");

  console.log("\n--- TEST SUITE 2: RETE OFFLINE & SIMULAZIONE FALLIMENTO SUPABASE / WEBHOOK ---");
  // 2.1 Fetch rejecting (Offline / DNS down)
  fetchMockBehavior = 'reject';
  const offlineRes = await ITACloudSync.registerTravelerCoverageProfile({
    email: "turista.offline@example.com",
    nome: "Offline User",
    telefonoWhatsapp: "+393339998888"
  });
  assert(offlineRes.ok === true, "Registrazione locale riuscita anche con rete completamente assente");
  assert(offlineRes.cloudSync && offlineRes.cloudSync.supabase.startsWith('network_error'), "cloudSync.supabase segnala network_error senza crash");
  assert(offlineRes.cloudSync && offlineRes.cloudSync.webhook.startsWith('network_error'), "cloudSync.webhook segnala network_error senza crash");

  // 2.2 Fetch returning HTTP 500
  fetchMockBehavior = 'http_500';
  const http500Res = await ITACloudSync.registerTravelerCoverageProfile({
    email: "turista.500@example.com",
    nome: "HTTP 500 User",
    telefonoWhatsapp: "+393339998888"
  });
  assert(http500Res.ok === true, "Registrazione locale riuscita anche con server cloud 500");
  assert(http500Res.cloudSync && http500Res.cloudSync.supabase === 'http_error_500', "cloudSync.supabase traccia correttamente HTTP 500: " + http500Res.cloudSync.supabase);
  assert(http500Res.cloudSync && http500Res.cloudSync.webhook === 'http_error_500', "cloudSync.webhook traccia correttamente HTTP 500: " + http500Res.cloudSync.webhook);

  fetchMockBehavior = 'normal';

  console.log("\n--- TEST SUITE 3: ROBUSTEZZA STORAGE & FALLBACK IN-MEMORY ---");
  // 3.1 LocalStorage QuotaExceededError
  mockLocalStorage.throwOnSet = true;
  const storageFailRes = await ITACloudSync.registerTravelerCoverageProfile({
    email: "turista.quota@example.com",
    nome: "Quota User",
    telefonoWhatsapp: "+393331112222"
  });
  assert(storageFailRes.ok === true, "Salvataggio riuscito su fallback in-memory quando localStorage è saturo");
  const storedByPass = ITACloudSync.getTravelerCoverageByPass(storageFailRes.profilo.passCode);
  assert(storedByPass.ok === true && storedByPass.profilo.email === "turista.quota@example.com", "Profilo recuperabile da fallback in-memory");
  mockLocalStorage.throwOnSet = false;

  console.log("\n--- TEST SUITE 4: VALIDAZIONE & CRASH TEST PASS_CODE ---");
  // 4.1 Null / Undefined / Malformed Pass Codes
  assert(ITACloudSync.getTravelerCoverageByPass(null).ok === false, "getTravelerCoverageByPass(null) gestito senza crash");
  assert(ITACloudSync.getTravelerCoverageByPass(undefined).ok === false, "getTravelerCoverageByPass(undefined) gestito senza crash");
  assert(ITACloudSync.getTravelerCoverageByPass("").ok === false, "getTravelerCoverageByPass('') gestito senza crash");
  assert(ITACloudSync.getTravelerCoverageByPass(12345).ok === false, "getTravelerCoverageByPass(12345 non-string) gestito senza crash");
  assert(ITACloudSync.getTravelerCoverageByPass("NON_ESISTENTE").ok === false, "Pass inesistente restituisce ok: false");

  // 4.2 Case Insensitive & Trim Match
  const validPass = storageFailRes.profilo.passCode;
  const matchRes = ITACloudSync.getTravelerCoverageByPass("  " + validPass.toLowerCase() + "  ");
  assert(matchRes.ok === true, "Pass code trovato con spazi e minuscolo: " + validPass);

  // 4.3 Service Request Updates
  const srvLuggage = ITACloudSync.updateTravelerServiceRequest(validPass, 'luggage', { richiesto: true, colli: 3 });
  assert(srvLuggage.ok === true && srvLuggage.profilo.luggageStorage.colli === 3, "Aggiornamento luggage storage applicato correttamente");

  const srvTaxi = ITACloudSync.updateTravelerServiceRequest(validPass, 'taxi', { richiesto: true, tratta: 'SMN -> Aeroporto Peretola' });
  assert(srvTaxi.ok === true && srvTaxi.profilo.trasferimentiTaxiNcc.tratta.includes('Aeroporto'), "Aggiornamento transfer taxi applicato correttamente");

  console.log("\n--- TEST SUITE 5: FORM PROPRIETARI & ANTI-BACKDOOR AUDIT ---");
  // 5.1 Register Property Account with Sanitize & Validations
  const propRes = await ITACloudSync.registerPropertyAccount({
    email: "proprietario.firenze@example.com",
    nome: "Lorenzo <script>",
    cognome: "De' Medici",
    telefono: "+39 055 123456",
    pin: "9876",
    cf: "dmclrn80a01d612x"
  });
  assert(propRes.ok === true, "Registrazione proprietario riuscita");
  assert(!propRes.account.nome.includes("<script>"), "Nome proprietario sanificato: " + propRes.account.nome);
  assert(propRes.account.canoneMensileEur === 99.00, "Canone contabile 99.00 € verificato");

  // 5.2 Attempt Backdoor Bypass
  const backdoor1 = await ITACloudSync.loginPropertyAccount("proprietario.firenze@example.com", "holding2026");
  assert(backdoor1.ok === false, "Bypass con 'holding2026' BLOCCATO con successo!");

  const backdoor2 = await ITACloudSync.loginPropertyAccount("proprietario.firenze@example.com", "2580");
  assert(backdoor2.ok === false, "Bypass con '2580' BLOCCATO con successo!");

  const wrongPwd = await ITACloudSync.loginPropertyAccount("proprietario.firenze@example.com", "wrong-pin");
  assert(wrongPwd.ok === false, "PIN errato rifiutato");

  const legitLogin = await ITACloudSync.loginPropertyAccount("proprietario.firenze@example.com", "9876");
  assert(legitLogin.ok === true, "Login legittimo con PIN '9876' autorizzato");

  console.log(`\n========================================`);
  console.log(`RISULTATI FINALI: ${passed} passati, ${failed} falliti.`);
  console.log(`PERCENTUALE SUCCESSO: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log(`========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("FATAL ERROR IN RUNTIME SUITE:", err);
  process.exit(1);
});
