const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = '/Users/julianherrera/.gemini/antigravity/brain/60710fc3-1ef5-483a-a10c-fe00819aca14';

require('./palazzina-server.js');

(async () => {
  await new Promise((r) => setTimeout(r, 800));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();

  await page.route('**://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('**://fonts.gstatic.com/**', (route) => route.abort());

  await page.goto('http://127.0.0.1:3000/?autologin=1', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.piano-slab', { timeout: 8000 });

  // 1. Invia la richiesta di PROVA dal Form al Piano 2 — PBA Palazzo by Blue Arroyo
  await page.selectOption('#req-piano', 'piano-2-pba');
  await page.selectOption('#req-priorita', 'P1');
  await page.selectOption('#req-area', 'Operativita & Turni');
  await page.fill('#req-allegato', 'Task #5 e Task #7 (Hub ZTL Santo Spirito)');
  await page.fill('#req-titolo', 'Verifica scorte spugne sigillate Hub ZTL e allineamento consuntivo SDI');
  await page.fill(
    '#req-descrizione',
    'Confermare il reintegro kit biologici e spugne sigillate per Hub Santo Spirito e trasmettere consuntivo mensile turnover ad Amministrazione Itassitance.'
  );
  await page.click('#form-nuova-richiesta button[type="submit"]');
  await page.waitForSelector('#req-feedback.ok', { timeout: 8000 });

  // 2. Screenshot 1: Vista Palazzina Principale
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  const mainShotPath = path.join(ARTIFACT_DIR, 'palazzina-holding-vista.png');
  await page.screenshot({ path: mainShotPath, fullPage: true });
  console.log('Screenshot Vista Palazzina salvato in:', mainShotPath);

  // 3. Clicca sul Piano 2 (PBA) per aprire il Dettaglio Piano e catturare lo Screenshot 2
  await page.click('.piano-slab[data-floor-id="piano-2-pba"] .btn-open-detail');
  await page.waitForSelector('#dettaglio-piano-section.active', { timeout: 8000 });
  await page.evaluate(() => {
    document.getElementById('dettaglio-piano-section').scrollIntoView();
  });
  await page.waitForTimeout(250);
  const detailShotPath = path.join(ARTIFACT_DIR, 'palazzina-dettaglio-piano.png');
  const detailLocator = page.locator('#dettaglio-piano-section');
  await detailLocator.screenshot({ path: detailShotPath });
  console.log('Screenshot Dettaglio Piano salvato in:', detailShotPath);

  // 4. Verifica responsive a 360px, 390px, 768px, 1280px
  for (const w of [360, 390, 768, 1280]) {
    await page.setViewportSize({ width: w, height: 844 });
    await page.waitForTimeout(150);
    const check = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const culprits = [];
      if (scrollW > docW) {
        document.querySelectorAll('*').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > docW + 1) {
            culprits.push(`${el.tagName}.${el.className} (right=${Math.round(r.right)} > ${docW})`);
          }
        });
      }
      return { docW, scrollW, culprits: culprits.slice(0, 5) };
    });
    if (check.scrollW > check.docW) {
      throw new Error(`Overflow a ${w}px (${check.scrollW} > ${check.docW}): ${check.culprits.join(', ')}`);
    }
  }
  console.log('Controllo responsive 360px, 390px, 768px, 1280px: OK (zero scroll orizzontale)');

  await browser.close();
  process.exit(0);
})();
