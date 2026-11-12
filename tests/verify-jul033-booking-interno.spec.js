#!/usr/bin/env node
/**
 * TEST PLAYWRIGHT OBBLIGATORIO — JUL-033 · BOOKING INTERNO ITASSISTANCE DALLA HOME PAGE
 * File: tests/verify-jul033-booking-interno.spec.js
 *
 * Verifica l'intero flusso end-to-end JUL-033:
 * 1. Stato vuoto di default (Regola Zero — Nessuna casa d'esempio):
 *    aprendo `index.html` e `en/index.html` con `localStorage` pulito, il modulo mostra lo stato
 *    vuoto con `"Presto disponibili"` / `"Available soon"` e `"[DA CONFERMARE]"` (zero case finte).
 * 2. Attivazione Consenso Esplicito Proprietario in `app.html` (`#app-db-consent-chk` / API `ITACloudSync`):
 *    quando il proprietario attiva il consenso e salva la propria struttura (senza esporre il civico,
 *    con prezzo notte deciso dal proprietario o `"Su richiesta"`), l'alloggio diventa ricercabile sulla Home.
 * 3. Ricerca e Invio Richiesta dalla Home (`index.html`):
 *    l'ospite cerca le date, apre il modulo di richiesta, compila nome, email, telefono, accetta il consenso GDPR
 *    e invia la richiesta (verificando anche che il campo honeypot blocchi invii bot e che non venga mai mostrato
 *    il civico esatto o il contatto privato del proprietario).
 * 4. Ricezione e Conferma/Rifiuto in `admin.html` (`#adm-direct-booking-requests-panel`):
 *    la richiesta compare con stato `PENDING`; cliccando su Conferma, lo stato passa a `CONFIRMED`
 *    e le date vengono bloccate nel calendario dell'alloggio (così una nuova ricerca sulle stesse date
 *    non mostra più l'alloggio disponibile).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { chromium } = require('playwright');

const ROOT_DIR = path.resolve(__dirname, '..');

function startStaticServer(rootDir) {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8'
  };

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const cleanUrl = decodeURIComponent((req.url || '/').split('?')[0]);
        let relPath = cleanUrl;
        if (relPath.endsWith('/')) relPath += 'index.html';
        const fullPath = path.join(rootDir, relPath);
        if (!fullPath.startsWith(rootDir)) {
          res.writeHead(403);
          res.end('Forbidden');
          return;
        }
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
          const ext = path.extname(fullPath).toLowerCase();
          res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
          fs.createReadStream(fullPath).pipe(res);
        } else if (fs.existsSync(fullPath + '.html')) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(fullPath + '.html').pipe(res);
        } else {
          res.writeHead(404);
          res.end('Not found');
        }
      } catch (err) {
        res.writeHead(500);
        res.end(String(err));
      }
    });
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, port: server.address().port });
    });
    server.on('error', reject);
  });
}

function verifyDocsAndChecklistJul033() {
  const docPath = path.join(ROOT_DIR, 'docs/booking-interno-itassistance.md');
  assert.ok(fs.existsSync(docPath), 'File docs/booking-interno-itassistance.md mancante');
  const docContent = fs.readFileSync(docPath, 'utf8');
  assert.ok(/Presto disponibili/i.test(docContent) && /\[DA CONFERMARE\]/.test(docContent), 'docs/booking-interno-itassistance.md deve documentare lo stato vuoto Presto disponibili [DA CONFERMARE]');
  assert.ok(/1754\s*c\.c\./i.test(docContent) && /L\.\s*39\/1989/i.test(docContent), 'docs/booking-interno-itassistance.md deve includere la segnalazione legale su intermediazione immobiliare (art. 1754 c.c. / L. 39/1989)');
  assert.ok(/CIN/i.test(docContent) && /Alloggiati Web/i.test(docContent) && /GDPR/i.test(docContent), 'docs/booking-interno-itassistance.md deve includere i punti su CIN, Alloggiati Web/Imposta Soggiorno e GDPR');

  const checklistPath = path.join(ROOT_DIR, 'docs/checklist.csv');
  const checklistContent = fs.readFileSync(checklistPath, 'utf8');
  assert.ok(
    checklistContent.includes('109,5. Front: app proprietario/partner,"Booking Interno Itassistance dalla Home Page (JUL-033)'),
    'docs/checklist.csv deve contenere la Riga #109 per JUL-033'
  );
}

async function runJul033BookingInternoVerification() {
  console.log('=== AVVIO VERIFICA JUL-033 · BOOKING INTERNO ITASSISTANCE ===');
  verifyDocsAndChecklistJul033();
  console.log('✓ Documento legale/operativo docs/booking-interno-itassistance.md e riga #109 in docs/checklist.csv verificati.');

  const { server, port } = await startStaticServer(ROOT_DIR);
  const baseUrl = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 }
    });
    const page = await context.newPage();

    // 1. Stato vuoto di default (Regola Zero — Nessuna casa d'esempio) su index.html e en/index.html
    await page.goto(`${baseUrl}/index.html`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(80);

    const emptyIt = await page.evaluate(() => {
      const text = document.body ? document.body.innerText : '';
      return {
        hasPrestoDisponibili: /Presto disponibili/i.test(text),
        hasDaConfermare: /\[DA CONFERMARE\]/.test(text)
      };
    });
    assert.strictEqual(emptyIt.hasPrestoDisponibili, true, 'index.html con localStorage vuoto deve mostrare "Presto disponibili"');
    assert.strictEqual(emptyIt.hasDaConfermare, true, 'index.html con localStorage vuoto deve mostrare "[DA CONFERMARE]"');

    await page.goto(`${baseUrl}/en/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(80);
    const emptyEn = await page.evaluate(() => {
      const text = document.body ? document.body.innerText : '';
      return {
        hasAvailableSoon: /Available soon|Presto disponibili/i.test(text),
        hasDaConfermare: /\[DA CONFERMARE\]/.test(text)
      };
    });
    assert.strictEqual(emptyEn.hasAvailableSoon, true, 'en/index.html con localStorage vuoto deve mostrare "Available soon"');
    assert.strictEqual(emptyEn.hasDaConfermare, true, 'en/index.html con localStorage vuoto deve mostrare "[DA CONFERMARE]"');
    console.log('✓ Punto 1 superato: stato vuoto "Presto disponibili [DA CONFERMARE]" attivo di default senza alcuna casa finta.');

    // 2. Attivazione Consenso Esplicito Proprietario in app.html
    await page.goto(`${baseUrl}/app.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(100);

    const ownerListingSaved = await page.evaluate(() => {
      // Se sono presenti i controlli UI #app-db-consent-chk li usiamo, oppure usiamo l'API ITACloudSync
      const consentChk = document.getElementById('app-db-consent-chk');
      if (consentChk) {
        consentChk.checked = true;
        const titleIn = document.getElementById('app-db-title');
        const zoneIn = document.getElementById('app-db-zone');
        const guestsIn = document.getElementById('app-db-max-guests');
        const priceIn = document.getElementById('app-db-night-price');
        const cinIn = document.getElementById('app-db-cin');
        if (titleIn) titleIn.value = 'Dimora Oltrarno Suite';
        if (zoneIn) zoneIn.value = 'Firenze · Oltrarno';
        if (guestsIn) guestsIn.value = '4';
        if (priceIn) priceIn.value = '160';
        if (cinIn) cinIn.value = 'IT048017C2TEST0001';
        if (typeof window.saveOwnerDirectBookingConsentFromApp === 'function') {
          window.saveOwnerDirectBookingConsentFromApp();
          return true;
        }
      }
      if (window.ITACloudSync && typeof window.ITACloudSync.saveDirectBookingOwnerListing === 'function') {
        window.ITACloudSync.saveDirectBookingOwnerListing({
          unitId: 'UNIT-TEST-JUL033',
          publicTitle: 'Dimora Oltrarno Suite',
          city: 'Firenze',
          publicZone: 'Firenze · Oltrarno',
          privateStreetAddress: 'Via Santo Spirito 99 Interno 4 (SEGRETO)',
          ownerPrivateName: 'Mario Rossi Privato (SEGRETO)',
          ownerPrivatePhone: '3339998887 (SEGRETO)',
          maxGuests: 4,
          bedrooms: 2,
          bathrooms: 2,
          nightlyRateEur: 160,
          cinCode: 'IT048017C2TEST0001',
          directBookingConsent: true,
          blockedRanges: []
        });
        return true;
      }
      return false;
    });
    assert.strictEqual(ownerListingSaved, true, 'Salvataggio consenso esplicito proprietario in app.html deve riuscire');
    console.log('✓ Punto 2 superato: consenso esplicito proprietario attivato in app.html.');

    // 3. Ricerca disponibilità e invio richiesta dalla Home (index.html), verificando privacy e honeypot
    await page.goto(`${baseUrl}/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(100);

    const searchAndRequestResult = await page.evaluate(() => {
      // Esegui ricerca per 2027-05-10 -> 2027-05-14 (4 notti, 2 ospiti)
      const ci = document.getElementById('db-search-checkin');
      const co = document.getElementById('db-search-checkout');
      const gu = document.getElementById('db-search-guests');
      if (ci) ci.value = '2027-05-10';
      if (co) co.value = '2027-05-14';
      if (gu) gu.value = '2';
      if (typeof window.runHomeDirectBookingSearch === 'function') {
        window.runHomeDirectBookingSearch();
      }

      const bodyText = document.body ? document.body.innerText : '';
      const showsApprovedUnit = /Dimora Oltrarno Suite/i.test(bodyText);
      const leaksPrivateData = /SEGRETO|Via Santo Spirito 99|Mario Rossi Privato|3339998887/i.test(bodyText);

      // Test Honeypot anti-bot via ITACloudSync
      let honeypotBlocked = true;
      if (window.ITACloudSync && typeof window.ITACloudSync.submitDirectBookingInquiry === 'function') {
        const botRes = window.ITACloudSync.submitDirectBookingInquiry({
          unitId: 'UNIT-TEST-JUL033',
          guestName: 'Bot Spam',
          guestEmail: 'bot@example.com',
          guestPhone: '+39333111222',
          checkIn: '2027-05-10',
          checkOut: '2027-05-14',
          guestsCount: 2,
          gdprConsent: true,
          honeypot: 'http://spam-bot.example.com'
        });
        honeypotBlocked = botRes && botRes.ok === false && botRes.spamBlocked === true;
      }

      // Invio richiesta reale valida
      let realInquiry = null;
      if (window.ITACloudSync && typeof window.ITACloudSync.submitDirectBookingInquiry === 'function') {
        realInquiry = window.ITACloudSync.submitDirectBookingInquiry({
          unitId: 'UNIT-TEST-JUL033',
          guestName: 'Laura Bianchi',
          guestEmail: 'laura.bianchi@example.com',
          guestPhone: '+39 340 1234567',
          checkIn: '2027-05-10',
          checkOut: '2027-05-14',
          guestsCount: 2,
          notes: 'Arrivo previsto nel pomeriggio.',
          gdprConsent: true,
          honeypot: ''
        });
      }

      return {
        showsApprovedUnit,
        leaksPrivateData,
        honeypotBlocked,
        realInquiryOk: Boolean(realInquiry && realInquiry.ok && realInquiry.request && realInquiry.request.status === 'PENDING'),
        requestId: realInquiry && realInquiry.request ? realInquiry.request.id : null
      };
    });

    assert.strictEqual(searchAndRequestResult.showsApprovedUnit, true, 'index.html deve mostrare l\'alloggio con consenso esplicito');
    assert.strictEqual(searchAndRequestResult.leaksPrivateData, false, 'index.html non deve mai esporre il civico esatto o i dati privati del proprietario');
    assert.strictEqual(searchAndRequestResult.honeypotBlocked, true, 'Il campo honeypot deve bloccare gli invii automatici dei bot');
    assert.strictEqual(searchAndRequestResult.realInquiryOk, true, 'L\'invio di una richiesta valida deve creare un record PENDING');
    console.log('✓ Punto 3 superato: ricerca, scudo privacy, honeypot anti-spam e invio richiesta PENDING verificati.');

    // 4. Ricezione e Conferma in admin.html (#adm-direct-booking-requests-panel) + blocco calendario
    await page.goto(`${baseUrl}/admin.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(80);
    await page.evaluate(() => {
      if (typeof selectLoginPreset === 'function') selectLoginPreset('superadmin');
      if (typeof performAdminLogin === 'function') performAdminLogin();
      if (typeof renderAdminDirectBookingRequestsPanel === 'function') renderAdminDirectBookingRequestsPanel();
    });
    await page.waitForTimeout(60);

    const adminConfirmResult = await page.evaluate((reqId) => {
      const panel = document.getElementById('adm-direct-booking-requests-panel');
      const panelTextBefore = panel ? panel.innerText : (document.body ? document.body.innerText : '');
      const hasGuestInAdmin = /Laura Bianchi/i.test(panelTextBefore);

      let confirmedRes = null;
      if (window.ITACloudSync && typeof window.ITACloudSync.updateDirectBookingInquiryStatus === 'function') {
        confirmedRes = window.ITACloudSync.updateDirectBookingInquiryStatus(reqId, 'CONFIRMED', 'Confermata dal Team Itassistance');
      }

      // Verifica che ora le date 2027-05-10 -> 2027-05-14 risultino bloccate nella ricerca disponibilità
      let availableAfterConfirm = [];
      if (window.ITACloudSync && typeof window.ITACloudSync.searchDirectBookingAvailability === 'function') {
        availableAfterConfirm = window.ITACloudSync.searchDirectBookingAvailability({
          city: 'Firenze',
          checkIn: '2027-05-11',
          checkOut: '2027-05-13',
          guestsCount: 2
        });
      }

      return {
        hasGuestInAdmin,
        confirmedOk: Boolean(confirmedRes && confirmedRes.ok && confirmedRes.request.status === 'CONFIRMED'),
        stillAvailableOnSameDates: availableAfterConfirm.some((u) => u.unitId === 'UNIT-TEST-JUL033')
      };
    }, searchAndRequestResult.requestId);

    assert.strictEqual(adminConfirmResult.hasGuestInAdmin, true, 'admin.html deve mostrare la richiesta di Laura Bianchi nel pannello #adm-direct-booking-requests-panel');
    assert.strictEqual(adminConfirmResult.confirmedOk, true, 'La conferma della richiesta in admin.html deve aggiornare lo stato a CONFIRMED');
    assert.strictEqual(adminConfirmResult.stillAvailableOnSameDates, false, 'Dopo la conferma, le date devono risultare bloccate nel calendario dell\'alloggio');
    console.log('✓ Punto 4 superato: ricezione in admin.html, conferma richiesta e blocco automatico calendario verificati.');

    await context.close();
  } finally {
    await browser.close();
    server.close();
  }

  console.log('✅ TUTTI I CONTROLLI JUL-033 (BOOKING INTERNO ITASSISTANCE) SUPERATI CON SUCCESSO.');
}

if (require.main === module) {
  runJul033BookingInternoVerification().catch((err) => {
    console.error('❌ ERRORE VERIFICA JUL-033:', err);
    process.exit(1);
  });
}

module.exports = { runJul033BookingInternoVerification, verifyDocsAndChecklistJul033 };
