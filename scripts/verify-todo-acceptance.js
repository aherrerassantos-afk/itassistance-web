#!/usr/bin/env node
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const ARTIFACT_DIR = '/Users/julianherrera/.gemini/antigravity/brain/825dffee-2393-47cc-9dcf-59587e521e61';

function startStaticServer() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let urlPath = req.url.split('?')[0];
      if (urlPath === '/') urlPath = '/index.html';
      const filePath = path.join(ROOT, urlPath);
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const mime = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.svg': 'image/svg+xml'
      }[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', mime);
      res.end(fs.readFileSync(filePath));
    });
    srv.listen(0, '127.0.0.1', () => {
      resolve({ server: srv, port: srv.address().port });
    });
  });
}

(async () => {
  const { server, port } = await startStaticServer();
  const baseUrl = `http://127.0.0.1:${port}/app.html?view=home`;
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. DESKTOP SCREENSHOT (1280 x 900) + ACCEPTANCE TESTS
    const ctxDesktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctxDesktop.newPage();
    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    // Force Monday / Day 1 reports & clean initial state
    await page.evaluate(() => {
      localStorage.removeItem('ita_todo_admin_state_v1');
      if (window.ITATodoAdminUI) window.ITATodoAdminUI.refresh();
    });
    await page.waitForSelector('#todo-oggi-hub');

    // Scroll to #todo-oggi-hub and capture Desktop screenshot
    const todoSec = page.locator('#todo-oggi-hub');
    await page.evaluate(() => {
      const el = document.getElementById('todo-oggi-hub');
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 68);
    });
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'todo-oggi-desktop.png'),
      fullPage: false
    });
    await page.evaluate(() => {
      document.querySelectorAll('.onion-header, .bottom-nav, .mobile-action-bar, nav[aria-label]').forEach(el => { el.dataset.origDisp = el.style.display; el.style.display = 'none'; });
    });
    await todoSec.screenshot({
      path: path.join(ARTIFACT_DIR, 'todo-oggi-sezioni-desktop-full.png')
    });
    await page.evaluate(() => {
      document.querySelectorAll('.onion-header, .bottom-nav, .mobile-action-bar, nav[aria-label]').forEach(el => { el.style.display = el.dataset.origDisp || ''; });
    });

    console.log('✅ Screenshot Desktop salvati.');

    // TEST 1: Fattura scaduta in rosso in cima alla sezione Pagamenti
    const firstInvCard = page.locator('#todo-sec-pagamenti .ita-todo-card').first();
    const isOverdueRed = await firstInvCard.evaluate((el) => el.classList.contains('overdue-red'));
    const firstInvText = await firstInvCard.innerText();
    if (!isOverdueRed || !firstInvText.includes('SCADUTA')) {
      throw new Error('TEST FALLITO: Fattura scaduta non in rosso o non in cima a Pagamenti.');
    }
    console.log('✅ Test 1 OK: Fattura scaduta in rosso in cima alla sezione Pagamenti.');

    // TEST 2: Fattura con scadenza fra 3 giorni compare nella to-do -> la segno pagata -> sparisce e va nello storico coi dati del bonifico
    const invDue3Card = page.locator('#card-inv-inv_pas_2');
    if ((await invDue3Card.count()) !== 1) {
      throw new Error('TEST FALLITO: Fattura con scadenza fra 3 giorni (inv_pas_2) non trovata in To-Do.');
    }
    await page.click("button[onclick*=\"toggleInlinePanel('inv-pay-inv_pas_2')\"]");
    await page.fill('#pay-ref-inv_pas_2', 'CRO-BONIFICO-TEST-778899');
    await page.click("button[onclick*=\"confirmMarkInvoicePaid('inv_pas_2')\"]");

    const invAfterPaidCount = await page.locator('#card-inv-inv_pas_2').count();
    const historyText = await page.locator('#todo-history-details').innerText();
    const fatteOggiText = await page.locator('#todo-sec-fatte-oggi').innerText();
    if (invAfterPaidCount !== 0 || !historyText.includes('CRO-BONIFICO-TEST-778899') || !fatteOggiText.includes('SDI-2026/1190')) {
      throw new Error('TEST FALLITO: Fattura pagata non rimossa dalla to-do attiva o non presente nello storico / Fatte oggi.');
    }
    console.log('✅ Test 2 OK: Fattura a 3 giorni segnata pagata -> sparita dalla To-Do attiva, visibile in Fatte oggi e nello storico con CRO.');

    // TEST 3: Lunedì mattina compare il to-do del revenue plan con il PDF scaricabile
    const revWeek45 = page.locator('#card-rev-rev_week_45_2026');
    const revTitle = await revWeek45.innerText();
    if (!revTitle.includes('Revenue plan settimana 45 pronto – da controllare')) {
      throw new Error('TEST FALLITO: To-Do Revenue plan settimana 45 non presente.');
    }
    const pdfRes = await page.evaluate(() => {
      return window.ITATodoAdminEngine.exportRevenueReportPdf('rev_week_45_2026', 'ALL');
    });
    if (!pdfRes || !pdfRes.ok || !pdfRes.htmlDoc.includes('Revenue plan settimana 45')) {
      throw new Error('TEST FALLITO: Export PDF Revenue Plan non funzionante.');
    }
    console.log('✅ Test 3 OK: Revenue plan settimana 45 presente con PDF scaricabile.');

    // TEST 4: Preventivo da €200 approvabile dal Manager; da €1.500 serve il Titolare; a carico del proprietario compare nella sua area
    await page.click('#role-btn-manager');
    // Manager non vede Pagamenti e Revenue se non abilitato
    const revHiddenCount = await page.locator('#todo-sec-revenue-hidden').count();
    const pagHiddenCount = await page.locator('#todo-sec-pagamenti-hidden').count();
    if (revHiddenCount !== 1 || pagHiddenCount !== 1) {
      throw new Error('TEST FALLITO: Un utente senza permessi (Manager/Receptionist non abilitato) vede ancora Pagamenti o Revenue.');
    }
    console.log('✅ Test 4a OK: Utente senza permessi non vede Pagamenti e Revenue.');

    // Manager prova ad approvare €1.500 -> deve essere bloccato
    await page.click("button[onclick*=\"approveQuoteDirect('quo_1500_titolare')\"]");
    const errTextMgr = await page.locator('#todo-oggi-hub [role="alert"]').innerText();
    if (!errTextMgr.includes('Titolare')) {
      throw new Error('TEST FALLITO: Il Manager non dovrebbe poter approvare il preventivo da €1.500.');
    }
    // Manager approva preventivo da €200 -> deve riuscire
    await page.click("button[onclick*=\"approveQuoteDirect('quo_200_manager')\"]");
    const quo200CountAfter = await page.locator('#card-quo-quo_200_manager').count();
    if (quo200CountAfter !== 0) {
      throw new Error('TEST FALLITO: Il Manager non è riuscito ad approvare il preventivo da €200.');
    }
    console.log('✅ Test 4b OK: Preventivo da €200 approvato dal Manager; €1.500 bloccato perché richiede il Titolare.');

    // Passiamo al Titolare per approvare €1.500
    await page.click('#role-btn-titolare');
    await page.click("button[onclick*=\"approveQuoteDirect('quo_1500_titolare')\"]");
    if ((await page.locator('#card-quo-quo_1500_titolare').count()) !== 0) {
      throw new Error('TEST FALLITO: Il Titolare non è riuscito ad approvare il preventivo da €1.500.');
    }
    console.log('✅ Test 4c OK: Preventivo da €1.500 approvato dal Titolare.');

    // Passiamo al Proprietario -> vede solo le sue unità e può approvare il preventivo a suo carico
    await page.click('#role-btn-proprietario');
    const ownerQuoteCard = page.locator('#card-quo-quo_420_proprietario');
    if ((await ownerQuoteCard.count()) !== 1) {
      throw new Error('TEST FALLITO: Preventivo a carico del proprietario non compare nella sua area.');
    }
    await page.click("button[onclick*=\"approveQuoteDirect('quo_420_proprietario')\"]");
    if ((await page.locator('#card-quo-quo_420_proprietario').count()) !== 0) {
      throw new Error('TEST FALLITO: Il Proprietario non è riuscito ad approvare il preventivo a suo carico.');
    }
    console.log('✅ Test 4d OK: Preventivo a carico del Proprietario visibile nella sua area e approvato.');

    // TEST 5: Le attività degli altri agenti (Alloggiati Web) restano visibili e funzionanti
    const awListCount = await page.locator('#home-today-todo-list [data-todo-booking]').count();
    const secOperativoCount = await page.locator('#todo-sec-operativo').count();
    if (awListCount === 0 || secOperativoCount !== 1) {
      throw new Error('TEST FALLITO: Le attività Alloggiati Web degli altri agenti non sono visibili.');
    }
    console.log('✅ Test 5 OK: Attività Alloggiati Web degli altri agenti visibili e funzionanti nella stessa To-Do.');

    await ctxDesktop.close();

    // 2. IPHONE SCREENSHOT (390 x 844) CON STATO PULITO PER MOSTRARE TUTTE E 4 LE SEZIONI
    const ctxIphone = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    const pageIphone = await ctxIphone.newPage();
    await pageIphone.goto(baseUrl, { waitUntil: 'networkidle' });
    await pageIphone.evaluate(() => {
      localStorage.removeItem('ita_todo_admin_state_v1');
      if (window.ITATodoAdminUI) window.ITATodoAdminUI.refresh();
    });
    await pageIphone.waitForSelector('#todo-oggi-hub');
    const hubIphone = pageIphone.locator('#todo-oggi-hub');
    await pageIphone.evaluate(() => {
      const el = document.getElementById('todo-oggi-hub');
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 68);
    });
    await pageIphone.screenshot({
      path: path.join(ARTIFACT_DIR, 'todo-oggi-iphone.png'),
      fullPage: false
    });
    await pageIphone.evaluate(() => {
      document.querySelectorAll('.onion-header, .bottom-nav, .mobile-action-bar, nav[aria-label]').forEach(el => { el.dataset.origDisp = el.style.display; el.style.display = 'none'; });
    });
    await hubIphone.screenshot({
      path: path.join(ARTIFACT_DIR, 'todo-oggi-sezioni-iphone-full.png')
    });
    console.log('✅ Screenshot iPhone (390x844) salvati.');
    await ctxIphone.close();
  } finally {
    await browser.close();
    server.close();
  }
})();
