#!/usr/bin/env node
/**
 * SUITE PLAYWRIGHT DEDICATA — JUL-003 (Agente 4 · Piano 4 ITASSITANCE)
 * File: tests/verify-jul002-mobile.spec.js
 *
 * Verifica "REGOLA BASE PERMANENTE - IL DESIGN NON SI TAGLIA MAI" (GEMINI.md)
 * sulle sezioni toccate da JUL-001 e JUL-002 in:
 *   1. /admin.html (Tab 1 #adm-overview + Tab 2 #adm-partners)
 *   2. /app.html   (#arm, #screen-home, #screen-fisco)
 *
 * Dimensioni obbligatorie testate:
 *   - 320 x 568
 *   - 360 x 800
 *   - 390 x 844
 *   - 430 x 932
 *   - 768 x 1024
 *   - 844 x 390 (telefono orizzontale)
 *
 * Controlli eseguiti per ciascun viewport:
 *   - document.documentElement.scrollWidth <= document.documentElement.clientWidth
 *   - Contenitori e griglie (#adm-tab1-arm-palazzo-module, #adm-cross-crm-arm-panel,
 *     #arm, #app-fisco-arm-palazzo-card) interamente dentro il viewport (left >= 0, right <= vw)
 *   - Input (#adm-daily-rate-input) visibile, non tagliato e funzionante
 *   - Cambio tariffa live (es. 199 -> 249,00 € / mese) -> ricalcolo istantaneo ARM
 *     (1° mese -50% = 124,50 €, Netto Proprietario = 2.685,00 € / mese, 1° mese netto = 2.809,50 €)
 *   - Presenza, visibilità e integrità geometrica del bottone:
 *     "📄 Scarica Preventivo PDF con Servizio Itassitance & Tariffa al Momento"
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');

const VIEWPORTS = [
  { width: 320, height: 568, label: '320x568' },
  { width: 360, height: 800, label: '360x800' },
  { width: 390, height: 844, label: '390x844' },
  { width: 430, height: 932, label: '430x932' },
  { width: 768, height: 1024, label: '768x1024' },
  { width: 844, height: 390, label: '844x390' }
];

const PDF_BTN_TEXT = 'Scarica Preventivo PDF con Servizio Itassitance & Tariffa al Momento';

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
    '.ico': 'image/x-icon'
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

/**
 * Verifica in-browser per admin.html (Tab 1 e Tab 2) a una specifica dimensione viewport
 */
async function verifyAdminPageAtViewport(page, baseUrl, vp) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(`${baseUrl}/admin.html`, { waitUntil: 'domcontentloaded' });

  // Effettua login superadmin e apri Tab 1 (overview)
  await page.evaluate(() => {
    if (typeof selectLoginPreset === 'function') selectLoginPreset('superadmin');
    if (typeof performAdminLogin === 'function') performAdminLogin();
    if (typeof switchActiveRole === 'function') switchActiveRole('superadmin');
    if (typeof switchAdminTab === 'function') switchAdminTab('overview');
  });
  await page.waitForTimeout(40);

  // 1. Verifica Tab 1: layout, scrollWidth <= clientWidth, contenitori e bottone PDF
  const tab1Check = await page.evaluate((expectedBtnText) => {
    const docEl = document.documentElement;
    const vw = window.innerWidth;
    const scrollW = docEl.scrollWidth;
    const clientW = docEl.clientWidth;

    const armMod = document.getElementById('adm-tab1-arm-palazzo-module');
    const dirBox = document.getElementById('adm-direzione-vendite-domanda-firenze-box');
    const rateInput = document.getElementById('adm-daily-rate-input');

    const pdfBtn = armMod
      ? Array.from(armMod.querySelectorAll('button')).find(b => (b.textContent || '').includes(expectedBtnText))
      : null;

    function checkBox(el) {
      if (!el) return { exists: false };
      const r = el.getBoundingClientRect();
      const st = window.getComputedStyle(el);
      return {
        exists: true,
        visible: r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden',
        left: Math.round(r.left * 10) / 10,
        right: Math.round(r.right * 10) / 10,
        width: Math.round(r.width * 10) / 10,
        height: Math.round(r.height * 10) / 10,
        withinViewport: r.left >= -1 && r.right <= vw + 1
      };
    }

    return {
      vw,
      scrollW,
      clientW,
      noHorizontalOverflow: scrollW <= clientW + 1,
      dirBox: checkBox(dirBox),
      armMod: checkBox(armMod),
      rateInput: checkBox(rateInput),
      pdfBtn: checkBox(pdfBtn)
    };
  }, PDF_BTN_TEXT);

  assert.strictEqual(
    tab1Check.noHorizontalOverflow,
    true,
    `[admin.html Tab 1 @ ${vp.label}] Overflow orizzontale rilevato: scrollWidth=${tab1Check.scrollW} > clientWidth=${tab1Check.clientW}`
  );
  assert.strictEqual(
    tab1Check.armMod.exists && tab1Check.armMod.visible && tab1Check.armMod.withinViewport,
    true,
    `[admin.html Tab 1 @ ${vp.label}] #adm-tab1-arm-palazzo-module fuori schermo o non visibile: ${JSON.stringify(tab1Check.armMod)}`
  );
  assert.strictEqual(
    tab1Check.rateInput.exists && tab1Check.rateInput.visible && tab1Check.rateInput.withinViewport,
    true,
    `[admin.html Tab 1 @ ${vp.label}] #adm-daily-rate-input fuori schermo o non visibile: ${JSON.stringify(tab1Check.rateInput)}`
  );
  assert.strictEqual(
    tab1Check.pdfBtn.exists && tab1Check.pdfBtn.visible && tab1Check.pdfBtn.withinViewport,
    true,
    `[admin.html Tab 1 @ ${vp.label}] Bottone PDF non visibile o tagliato: ${JSON.stringify(tab1Check.pdfBtn)}`
  );

  // 2. Verifica cambio tariffa live -> ricalcolo istantaneo ARM in Tab 1 e Tab 2
  const liveTariffResult = await page.evaluate(() => {
    const inp = document.getElementById('adm-daily-rate-input');
    inp.value = '249';
    if (typeof adminLiveUpdateMomentTariff === 'function') {
      adminLiveUpdateMomentTariff('249');
    } else {
      inp.dispatchEvent(new Event('input', { bubbles: true }));
    }
    return {
      dailyDisplay: (document.getElementById('adm-daily-rate-display') || {}).textContent || '',
      annualDisplay: (document.getElementById('adm-daily-annual-display') || {}).textContent || '',
      t1Rate: (document.getElementById('adm-tab1-arm-moment-rate') || {}).textContent || '',
      t1FirstMonth: (document.getElementById('adm-tab1-arm-first-month') || {}).textContent || '',
      t1NetOwner: (document.getElementById('adm-tab1-arm-net-owner') || {}).textContent || '',
      formulaRate: (document.getElementById('adm-tab1-arm-formula-rate') || {}).textContent || '',
      formulaNet: (document.getElementById('adm-tab1-arm-formula-net') || {}).textContent || '',
      formulaNetM1: (document.getElementById('adm-tab1-arm-formula-net-m1') || {}).textContent || '',
      t2Net: (document.getElementById('adm-arm-t2-net-lbl') || {}).textContent || '',
      t2Rate: (document.getElementById('adm-arm-t2-rate-lbl') || {}).textContent || ''
    };
  });

  // 3.450 - 516 - 249 = 2.685,00 € | 1° mese Promo -50% = 124,50 € -> Netto 1° mese = 2.809,50 €
  assert.ok(
    liveTariffResult.t1Rate.includes('249,00') && liveTariffResult.t1FirstMonth.includes('124,50'),
    `[admin.html Live Tariff @ ${vp.label}] Tariffa 249€ non aggiornata in #adm-tab1-arm-palazzo-module: ${JSON.stringify(liveTariffResult)}`
  );
  assert.ok(
    liveTariffResult.t1NetOwner.includes('2.685,00') && liveTariffResult.formulaNetM1.includes('2.809,50'),
    `[admin.html Live ARM Calc @ ${vp.label}] Ricalcolo Netto ARM errato: ${JSON.stringify(liveTariffResult)}`
  );

  // Ripristina 199 € e verifica ritorno ai valori nominali
  await page.evaluate(() => {
    if (typeof adminLiveUpdateMomentTariff === 'function') adminLiveUpdateMomentTariff('199');
  });

  // 3. Passa a Tab 2 (#adm-partners) e verifica assenza overflow + visibilità pannello Cross-CRM ARM e bottone PDF
  await page.evaluate(() => {
    if (typeof switchAdminTab === 'function') switchAdminTab('partners');
  });
  await page.waitForTimeout(40);

  const tab2Check = await page.evaluate((expectedBtnText) => {
    const docEl = document.documentElement;
    const vw = window.innerWidth;
    const scrollW = docEl.scrollWidth;
    const clientW = docEl.clientWidth;
    const panel = document.getElementById('adm-cross-crm-arm-panel');
    const pdfBtn = panel
      ? Array.from(panel.querySelectorAll('button')).find(b => (b.textContent || '').includes(expectedBtnText))
      : null;

    function checkBox(el) {
      if (!el) return { exists: false };
      const r = el.getBoundingClientRect();
      const st = window.getComputedStyle(el);
      return {
        exists: true,
        visible: r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden',
        left: Math.round(r.left * 10) / 10,
        right: Math.round(r.right * 10) / 10,
        withinViewport: r.left >= -1 && r.right <= vw + 1
      };
    }

    return {
      scrollW,
      clientW,
      noHorizontalOverflow: scrollW <= clientW + 1,
      panel: checkBox(panel),
      pdfBtn: checkBox(pdfBtn)
    };
  }, PDF_BTN_TEXT);

  assert.strictEqual(
    tab2Check.noHorizontalOverflow,
    true,
    `[admin.html Tab 2 @ ${vp.label}] Overflow orizzontale rilevato: scrollWidth=${tab2Check.scrollW} > clientWidth=${tab2Check.clientW}`
  );
  assert.strictEqual(
    tab2Check.panel.exists && tab2Check.panel.visible && tab2Check.panel.withinViewport,
    true,
    `[admin.html Tab 2 @ ${vp.label}] #adm-cross-crm-arm-panel fuori schermo: ${JSON.stringify(tab2Check.panel)}`
  );
  assert.strictEqual(
    tab2Check.pdfBtn.exists && tab2Check.pdfBtn.visible && tab2Check.pdfBtn.withinViewport,
    true,
    `[admin.html Tab 2 @ ${vp.label}] Bottone PDF in Tab 2 fuori schermo o non visibile: ${JSON.stringify(tab2Check.pdfBtn)}`
  );
}

/**
 * Verifica in-browser per app.html (#screen-home + #arm e #screen-fisco + #app-fisco-arm-palazzo-card)
 */
async function verifyAppPageAtViewport(page, baseUrl, vp) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(`${baseUrl}/app.html?role=owner&client=PROSPECT-MARCO-PALUMBO-2026&email=mr.mpalumbo@gmail.com#arm`, {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(50);

  // 1. Verifica #screen-home e #arm
  const homeArmCheck = await page.evaluate((expectedBtnText) => {
    const docEl = document.documentElement;
    const vw = window.innerWidth;
    const scrollW = docEl.scrollWidth;
    const clientW = docEl.clientWidth;

    const hub = document.getElementById('app-cross-crm-marco-hub');
    const arm = document.getElementById('arm');
    const pdfBtn = arm
      ? Array.from(arm.querySelectorAll('button')).find(b => (b.textContent || '').includes(expectedBtnText))
      : null;

    function checkBox(el) {
      if (!el) return { exists: false };
      const r = el.getBoundingClientRect();
      const st = window.getComputedStyle(el);
      return {
        exists: true,
        visible: r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden',
        left: Math.round(r.left * 10) / 10,
        right: Math.round(r.right * 10) / 10,
        withinViewport: r.left >= -1 && r.right <= vw + 1
      };
    }

    return {
      scrollW,
      clientW,
      noHorizontalOverflow: scrollW <= clientW + 1,
      hub: checkBox(hub),
      arm: checkBox(arm),
      pdfBtn: checkBox(pdfBtn)
    };
  }, PDF_BTN_TEXT);

  assert.strictEqual(
    homeArmCheck.noHorizontalOverflow,
    true,
    `[app.html #screen-home/#arm @ ${vp.label}] Overflow orizzontale: scrollWidth=${homeArmCheck.scrollW} > clientWidth=${homeArmCheck.clientW}`
  );
  assert.strictEqual(
    homeArmCheck.arm.exists && homeArmCheck.arm.visible && homeArmCheck.arm.withinViewport,
    true,
    `[app.html #arm @ ${vp.label}] #arm fuori schermo o non visibile: ${JSON.stringify(homeArmCheck.arm)}`
  );
  assert.strictEqual(
    homeArmCheck.pdfBtn.exists && homeArmCheck.pdfBtn.visible && homeArmCheck.pdfBtn.withinViewport,
    true,
    `[app.html #arm @ ${vp.label}] Bottone PDF in #arm non visibile o fuori schermo: ${JSON.stringify(homeArmCheck.pdfBtn)}`
  );

  // 2. Verifica propagazione live della tariffa in app.html (es. 249,00 €/mese -> Netto 2.685,00 €/mese)
  const appLiveCalc = await page.evaluate(() => {
    if (window.ITACloudSync && typeof ITACloudSync.setCurrentItassitanceMomentTariff === 'function') {
      ITACloudSync.setCurrentItassitanceMomentTariff(249, 'Test Playwright Mobile');
    }
    if (typeof renderAppMomentTariffInArm === 'function') {
      renderAppMomentTariffInArm();
    }
    const homeRate = (document.getElementById('app-arm-live-moment-rate') || {}).textContent || '';
    const homeFirst = (document.getElementById('app-arm-live-first-month') || {}).textContent || '';
    const homeSummary = (document.getElementById('app-arm-live-summary-line') || {}).textContent || '';

    // Ripristina 199,00 €
    if (window.ITACloudSync && typeof ITACloudSync.setCurrentItassitanceMomentTariff === 'function') {
      ITACloudSync.setCurrentItassitanceMomentTariff(199, 'Reset Playwright Mobile');
    }
    if (typeof renderAppMomentTariffInArm === 'function') {
      renderAppMomentTariffInArm();
    }
    return { homeRate, homeFirst, homeSummary };
  });

  assert.ok(
    appLiveCalc.homeRate.includes('249,00') &&
      appLiveCalc.homeFirst.includes('124,50') &&
      appLiveCalc.homeSummary.includes('2.685,00'),
    `[app.html Live Tariff Sync @ ${vp.label}] Ricalcolo live ARM in app.html non conforme: ${JSON.stringify(appLiveCalc)}`
  );

  // 3. Naviga a #screen-fisco e verifica #app-fisco-arm-palazzo-card + bottone PDF
  await page.evaluate(() => {
    if (typeof navigateToOnion === 'function') {
      navigateToOnion('fisco', { skipHistory: true });
    }
  });
  await page.waitForTimeout(40);

  const fiscoArmCheck = await page.evaluate((expectedBtnText) => {
    const docEl = document.documentElement;
    const vw = window.innerWidth;
    const scrollW = docEl.scrollWidth;
    const clientW = docEl.clientWidth;

    const card = document.getElementById('app-fisco-arm-palazzo-card');
    const pdfBtn = card
      ? Array.from(card.querySelectorAll('button')).find(b => (b.textContent || '').includes(expectedBtnText))
      : null;

    function checkBox(el) {
      if (!el) return { exists: false };
      const r = el.getBoundingClientRect();
      const st = window.getComputedStyle(el);
      return {
        exists: true,
        visible: r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden',
        left: Math.round(r.left * 10) / 10,
        right: Math.round(r.right * 10) / 10,
        withinViewport: r.left >= -1 && r.right <= vw + 1
      };
    }

    return {
      scrollW,
      clientW,
      noHorizontalOverflow: scrollW <= clientW + 1,
      card: checkBox(card),
      pdfBtn: checkBox(pdfBtn)
    };
  }, PDF_BTN_TEXT);

  assert.strictEqual(
    fiscoArmCheck.noHorizontalOverflow,
    true,
    `[app.html #screen-fisco @ ${vp.label}] Overflow orizzontale: scrollWidth=${fiscoArmCheck.scrollW} > clientWidth=${fiscoArmCheck.clientW}`
  );
  assert.strictEqual(
    fiscoArmCheck.card.exists && fiscoArmCheck.card.visible && fiscoArmCheck.card.withinViewport,
    true,
    `[app.html #screen-fisco @ ${vp.label}] #app-fisco-arm-palazzo-card fuori schermo: ${JSON.stringify(fiscoArmCheck.card)}`
  );
  assert.strictEqual(
    fiscoArmCheck.pdfBtn.exists && fiscoArmCheck.pdfBtn.visible && fiscoArmCheck.pdfBtn.withinViewport,
    true,
    `[app.html #screen-fisco @ ${vp.label}] Bottone PDF in #app-fisco-arm-palazzo-card non visibile: ${JSON.stringify(fiscoArmCheck.pdfBtn)}`
  );
}

/**
 * Esecuzione diretta tramite Node + Playwright (o runner @playwright/test se presente)
 */
async function runStandaloneSuite() {
  const { chromium } = require('playwright');
  const { server, port } = await startStaticServer(ROOT_DIR);
  const baseUrl = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch({ headless: true });

  console.log('=== AVVIO SUITE PLAYWRIGHT JUL-003 (verify-jul002-mobile.spec.js) ===');
  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    for (const vp of VIEWPORTS) {
      await verifyAdminPageAtViewport(page, baseUrl, vp);
      await verifyAppPageAtViewport(page, baseUrl, vp);
      console.log(`  ✅ Viewport ${vp.label}: admin.html (Tab 1 & Tab 2) + app.html (#arm, #screen-home, #screen-fisco) OK`);
    }

    await context.close();
    console.log('=== TUTTI I 6 VIEWPORT SUPERATI CON ZERO OVERFLOW E LIVE SYNC ARM VERIFICATO ===');
  } finally {
    await browser.close();
    server.close();
  }
}

// Supporto dual-mode: eseguibile sia con `npx playwright test` (se @playwright/test è installato) sia con `node tests/verify-jul002-mobile.spec.js`
let pwTest = null;
try {
  pwTest = require('@playwright/test');
} catch (_) {
  pwTest = null;
}

if (pwTest && typeof pwTest.test === 'function' && process.env.PLAYWRIGHT_TEST_RUNNER) {
  const { test } = pwTest;
  let srvObj = null;
  let baseUrl = '';

  test.beforeAll(async () => {
    srvObj = await startStaticServer(ROOT_DIR);
    baseUrl = `http://127.0.0.1:${srvObj.port}`;
  });

  test.afterAll(async () => {
    if (srvObj && srvObj.server) srvObj.server.close();
  });

  for (const vp of VIEWPORTS) {
    test(`JUL-003 Mobile & Responsive Check @ ${vp.label} (admin.html + app.html)`, async ({ page }) => {
      await verifyAdminPageAtViewport(page, baseUrl, vp);
      await verifyAppPageAtViewport(page, baseUrl, vp);
    });
  }
} else if (require.main === module) {
  runStandaloneSuite().catch((err) => {
    console.error('❌ Errore in verify-jul002-mobile.spec.js:', err);
    process.exit(1);
  });
}

module.exports = {
  VIEWPORTS,
  verifyAdminPageAtViewport,
  verifyAppPageAtViewport,
  runStandaloneSuite
};
