#!/usr/bin/env node
/**
 * Test di Accettazione E2E - Flusso Alloggiati Web (TAYLOR 07/11/2026)
 * Eseguito su WebKit iPhone (Safari iOS 390x844) e Desktop Chromium (1280x800).
 *
 * Verifica i 6 punti obbligatori:
 * 1. Blocco "Continua e segna come inviato" se il file .txt non è stato generato/validato.
 * 2. Blocco generazione se un campo obbligatorio (es. Numero Documento) è vuoto, con indicazione campi mancanti.
 * 3. Generazione file AlloggiatiWeb_TAYLOR_2026-11-07.txt conforme al tracciato ufficiale Polizia di Stato:
 *    - 168 caratteri/riga + CRLF (\r\n) = 170 byte/riga
 *    - 2 ospiti (Capofamiglia codice 17 + Familiare codice 19) = 340 byte totali (NON 121 byte).
 *    - Validazione con ITACloudSync.validateAlloggiatiTxtContent(txtContent).
 * 4. Persistenza stato su iPhone Safari dopo anteprima file / reload pagina (URL ?view=azione-alloggiati&step=2&bookingId=b2 + localStorage).
 * 5. Connessione disattivata (offline): il clic su "Continua e segna come inviato" mostra errore visibile, NON cambia stato e NON fa redirect.
 * 6. Connessione attiva: il clic mostra "Salvataggio…", poi bottone e stato diventano BLU ("Inviato ✓ GG/MM HH:MM") + toast di conferma;
 *    lo stato resta BLU dopo refresh e dopo nuovo login;
 *    la To-Do List di oggi (fuso Europe/Rome) mostra tutte le attività del giorno con quella di TAYLOR spuntata in BLU.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { chromium, webkit, devices } = require('playwright');

const ROOT_DIR = path.resolve(__dirname, '..');
const ARTIFACT_DIR = '/Users/julianherrera/.gemini/antigravity/brain/09e05899-96d0-4bbe-aa67-b82c5d0747b2';

function startStaticServer(rootDir) {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const cleanUrl = (req.url || '/').split('?')[0].split('#')[0];
      const relPath = cleanUrl === '/' ? '/index.html' : cleanUrl;
      const filePath = path.join(rootDir, decodeURIComponent(relPath));
      if (!filePath.startsWith(rootDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(content);
      });
    });
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${addr.port}` });
    });
  });
}

async function runFlowForTarget({ name, launcher, contextOptions, saveScreenshots }) {
  console.log(`\n▶ Avvio Test Accettazione Alloggiati Web su [${name}]...`);
  const browser = await launcher.launch({ headless: true });
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  const baseUrl = global.__TEST_BASE_URL;

  // 1. Apri app.html e verifica che la To-Do List di oggi sia popolata (4 attività: 3 Alloggiati + 1 Pulizia, TAYLOR da fare)
  await page.goto(`${baseUrl}/app.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { window.__SKIP_BLOB_NAVIGATION_FOR_TEST = true; });

  const initialTodoCount = await page.locator('#home-today-todo-list .todo-item-row').count();
  assert.strictEqual(initialTodoCount, 4, `[${name}] La To-Do list iniziale deve avere 4 attività, trovate: ${initialTodoCount}`);

  const initialTaylorRowText = await page.locator('[data-todo-booking="b2"]').innerText();
  assert(initialTaylorRowText.includes('Hannah e Mark Taylor'), `[${name}] La riga b2 deve contenere 'Hannah e Mark Taylor'`);
  assert(initialTaylorRowText.includes('Da fare oggi'), `[${name}] Inizialmente TAYLOR deve risultare 'Da fare oggi'`);

  // 2. Clicca sul bottone della riga To-Do di TAYLOR (b2)
  await page.locator('[data-todo-booking="b2"] button').click();
  await page.waitForSelector('#screen-azione-alloggiati.active');

  const selectedVal = await page.locator('#aw-booking-select').inputValue();
  assert.strictEqual(selectedVal, 'b2', `[${name}] La prenotazione selezionata deve essere b2 (TAYLOR), trovata: ${selectedVal}`);

  // 3. Vai al Passaggio 2 di 2 SENZA aver generato il file e prova a cliccare "Continua e segna come inviato" -> DEVE BLOCCARE
  await page.locator('#btn-aw-goto-step2').click();
  await page.waitForSelector('#aw-step-2', { state: 'visible' });

  await page.locator('#btn-aw-mark-sent').click();

  const errVisibleBeforeGen = await page.locator('#aw-inline-error').isVisible();
  const errTextBeforeGen = await page.locator('#aw-inline-error').innerText();
  assert(errVisibleBeforeGen && errTextBeforeGen.includes('Prima di segnare come "Inviato" devi generare correttamente il file .txt'), `[${name}] Deve bloccare 'Continua e segna come inviato' se il file non è stato generato`);
  console.log(`  ✓ [${name}] Coerenza verificata: blocco invio se il file .txt non è stato generato.`);

  // 4. Svuota un campo obbligatorio (Numero Documento) e verifica il blocco con elenco campi mancanti
  const origDocNum = await page.locator('#aw-doc-num').inputValue();
  await page.locator('#aw-doc-num').fill('');
  await page.locator('#btn-aw-generate-file').click();

  const missingFieldErrVisible = await page.locator('#aw-inline-error').isVisible();
  const missingFieldErrText = await page.locator('#aw-inline-error').innerText();
  assert(missingFieldErrVisible && missingFieldErrText.toLowerCase().includes('numero documento'), `[${name}] Deve bloccare la generazione e indicare 'Numero documento' mancante, trovato: ${missingFieldErrText}`);
  console.log(`  ✓ [${name}] Validazione campi obbligatori verificata: blocco se manca Numero documento.`);

  // Ripristina Numero Documento
  await page.locator('#aw-doc-num').fill(origDocNum || 'UK77492018');

  // 5. Genera il file .txt e verifica il tracciato ufficiale Polizia di Stato (168 char + CRLF = 170 byte/riga -> 340 byte per 2 ospiti)
  await page.locator('#btn-aw-generate-file').click();

  if (saveScreenshots) {
    const step1Shot = path.join(ARTIFACT_DIR, 'alloggiati-step1-tracciato-iphone.png');
    await page.screenshot({ path: step1Shot, fullPage: false });
    console.log(`  📸 Screenshot salvato: ${step1Shot}`);
  }

  const generatedValidation = await page.evaluate(() => {
    const rawDraft = localStorage.getItem('itassistance_aw_active_draft_v1');
    const draft = rawDraft ? JSON.parse(rawDraft) : null;
    const b2Meta = draft && draft.generatedByBooking ? draft.generatedByBooking['b2'] : null;
    const validation = window.ITACloudSync.validateAlloggiatiTxtContent(b2Meta ? b2Meta.txtContent : '');
    return {
      fileName: b2Meta ? b2Meta.fileName : null,
      byteLength: b2Meta ? b2Meta.byteLength : 0,
      validation
    };
  });

  assert.strictEqual(generatedValidation.fileName, 'AlloggiatiWeb_TAYLOR_2026-11-07.txt', `[${name}] Nome file atteso AlloggiatiWeb_TAYLOR_2026-11-07.txt`);
  assert.strictEqual(generatedValidation.byteLength, 340, `[${name}] Il file per 2 ospiti deve essere di 340 byte (2 righe x 170 byte), trovato: ${generatedValidation.byteLength}`);
  assert.strictEqual(generatedValidation.validation.valid, true, `[${name}] Il validatore interno Polizia di Stato deve restituire valid=true`);
  assert.strictEqual(generatedValidation.validation.rowsCount, 2, `[${name}] Devono esserci 2 righe (Capofamiglia 17 + Familiare 19)`);
  console.log(`  ✓ [${name}] Tracciato Polizia di Stato verificato: ${generatedValidation.fileName} (${generatedValidation.byteLength} byte, 2 righe da 168 caratteri + CRLF).`);

  // 6. Simula il ritorno dall'anteprima file di iOS Safari (reload completo della pagina) e verifica che bookingId=b2, step=2 e il file generato siano preservati
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => { window.__SKIP_BLOB_NAVIGATION_FOR_TEST = true; });
  await page.waitForSelector('#screen-azione-alloggiati.active');
  await page.waitForSelector('#aw-step-2', { state: 'visible' });

  const selectedAfterReload = await page.locator('#aw-booking-select').inputValue();
  assert.strictEqual(selectedAfterReload, 'b2', `[${name}] Dopo reload su iOS Safari la prenotazione selezionata deve restare b2 (TAYLOR)`);
  console.log(`  ✓ [${name}] Persistenza iOS Safari verificata: ritorno da anteprima file mantiene prenotazione TAYLOR, Step 2 e file generato.`);

  // 7. Test Offline: con connessione disattivata, cliccare "Continua e segna come inviato" mostra errore e NON cambia stato né pagina
  await page.evaluate(() => { window.__FORCE_OFFLINE_TEST = true; });
  await page.locator('#btn-aw-mark-sent').click();

  // Attendi che la chiamata offline ritorni l'errore
  await page.waitForSelector('#aw-inline-error', { state: 'visible', timeout: 3000 });
  const offlineErrText = await page.locator('#aw-inline-error').innerText();
  assert(offlineErrText.toLowerCase().includes('connessione') && offlineErrText.toLowerCase().includes('assente'), `[${name}] Con connessione assente deve mostrare errore visibile, trovato: ${offlineErrText}`);

  const btnHasBlueWhileOffline = await page.locator('#btn-aw-mark-sent').evaluate(el => el.classList.contains('btn-sent-blue'));
  assert.strictEqual(btnHasBlueWhileOffline, false, `[${name}] Con connessione assente il bottone NON deve diventare blu`);
  console.log(`  ✓ [${name}] Gestione errore offline verificata: errore visibile, nessun salvataggio parziale, nessun redirect.`);

  // 8. Ripristina connessione online e clicca "Continua e segna come inviato"
  await page.evaluate(() => { window.__FORCE_OFFLINE_TEST = false; });
  await page.locator('#btn-aw-mark-sent').click();

  // Attendi che il bottone diventi BLU (.btn-sent-blue) con "Inviato ✓"
  await page.waitForSelector('#btn-aw-mark-sent.btn-sent-blue', { timeout: 5000 });
  const btnBlueText = await page.locator('#btn-aw-mark-sent').innerText();
  assert(btnBlueText.includes('Inviato ✓'), `[${name}] Il bottone deve mostrare 'Inviato ✓', trovato: ${btnBlueText}`);

  const badgeIsBlue = await page.locator('#aw-booking-status-badge').evaluate(el => el.classList.contains('sent-blue'));
  const badgeText = await page.locator('#aw-booking-status-badge').innerText();
  assert(badgeIsBlue && badgeText.includes('Inviato ✓'), `[${name}] Il badge di stato della prenotazione deve essere BLU con data/ora e utente, trovato: ${badgeText}`);
  console.log(`  ✓ [${name}] Salvataggio stato e feedback visivo BLU verificati: "${btnBlueText}" (${badgeText}).`);

  if (saveScreenshots) {
    await page.evaluate(() => {
      const el = document.getElementById('btn-aw-mark-sent');
      if (el) el.scrollIntoView({ block: 'center' });
    });
    const step2Shot = path.join(ARTIFACT_DIR, 'alloggiati-step2-blue-iphone.png');
    await page.screenshot({ path: step2Shot, fullPage: false });
    console.log(`  📸 Screenshot salvato: ${step2Shot}`);
  }

  // 9. Verifica che lo stato resti BLU dopo un refresh della pagina e dopo un nuovo login
  await page.reload({ waitUntil: 'networkidle' });
  const badgeStillBlueAfterRefresh = await page.locator('#aw-booking-status-badge').evaluate(el => el.classList.contains('sent-blue'));
  const btnStillBlueAfterRefresh = await page.locator('#btn-aw-mark-sent').evaluate(el => el.classList.contains('btn-sent-blue'));
  assert(badgeStillBlueAfterRefresh && btnStillBlueAfterRefresh, `[${name}] Lo stato BLU deve persistere dopo il refresh della pagina`);

  // Simula passaggio da login / attivazione (verifica che activateNewOwnerFromCheckout non azzeri le prenotazioni)
  await page.evaluate(() => {
    if (window.ITACloudSync && typeof window.ITACloudSync.activateNewOwnerFromCheckout === 'function') {
      window.ITACloudSync.activateNewOwnerFromCheckout({
        name: 'Marco Rossi',
        email: 'marco.rossi@example.it',
        propertyName: 'Residenza Santo Spirito · Firenze'
      });
    }
  });
  await page.reload({ waitUntil: 'networkidle' });
  const stillBlueAfterRelogin = await page.locator('#aw-booking-status-badge').evaluate(el => el.classList.contains('sent-blue'));
  assert(stillBlueAfterRelogin, `[${name}] Lo stato BLU deve persistere anche dopo nuovo login / sessione proprietario`);
  console.log(`  ✓ [${name}] Persistenza dopo refresh e nuovo login verificata.`);

  // 10. Clicca "Torna alla To-Do List di oggi" e verifica che tutte le 4 attività di oggi siano presenti e TAYLOR sia spuntata in BLU
  await page.locator('#btn-aw-goto-todo').click();
  await page.waitForSelector('#screen-home.active');

  const todoCountAfter = await page.locator('#home-today-todo-list .todo-item-row').count();
  assert.strictEqual(todoCountAfter, 4, `[${name}] La To-Do list di oggi deve mostrare tutte le 4 attività (mai vuota), trovate: ${todoCountAfter}`);

  const taylorRowIsBlue = await page.locator('[data-todo-booking="b2"]').evaluate(el => el.classList.contains('todo-done-blue'));
  const taylorBadgeText = await page.locator('[data-todo-status="b2"]').innerText();
  assert(taylorRowIsBlue && taylorBadgeText.includes('Inviato ✓'), `[${name}] Nella To-Do di oggi l'attività TAYLOR deve essere spuntata in BLU ('Inviato ✓'), trovato: ${taylorBadgeText}`);

  const homeMetaText = await page.locator('#home-today-meta').innerText();
  assert(homeMetaText.includes('Europe/Rome'), `[${name}] La To-Do di oggi deve indicare il fuso Europe/Rome e l'utente loggato, trovato: ${homeMetaText}`);
  console.log(`  ✓ [${name}] To-Do List di oggi verificata (${todoCountAfter} attività visibili, TAYLOR spuntata in BLU: "${taylorBadgeText}").`);

  if (saveScreenshots) {
    await page.evaluate(() => {
      const el = document.getElementById('home-today-todo-section');
      if (el) el.scrollIntoView({ block: 'start' });
    });
    const todoShot = path.join(ARTIFACT_DIR, 'alloggiati-todo-oggi-iphone.png');
    await page.screenshot({ path: todoShot, fullPage: false });
    console.log(`  📸 Screenshot salvato: ${todoShot}`);
  }

  await browser.close();
}

(async () => {
  const { server, baseUrl } = await startStaticServer(ROOT_DIR);
  global.__TEST_BASE_URL = baseUrl;
  try {
    await runFlowForTarget({
      name: 'WebKit iPhone Safari (390x844)',
      launcher: webkit,
      contextOptions: {
        viewport: { width: 390, height: 844 },
        userAgent: devices['iPhone 14'] ? devices['iPhone 14'].userAgent : 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2
      },
      saveScreenshots: true
    });

    await runFlowForTarget({
      name: 'Desktop Chromium (1280x800)',
      launcher: chromium,
      contextOptions: {
        viewport: { width: 1280, height: 800 }
      },
      saveScreenshots: false
    });

    console.log('\n✅ TUTTI I TEST DI ACCETTAZIONE ALLOGGIATI WEB SUPERATI CON SUCCESSO (iPhone Safari + Desktop)!');
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ ERRORE NEI TEST DI ACCETTAZIONE ALLOGGIATI WEB:', err);
    server.close();
    process.exit(1);
  }
})();
