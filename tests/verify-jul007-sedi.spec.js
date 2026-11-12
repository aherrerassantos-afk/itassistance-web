#!/usr/bin/env node
/**
 * TEST PLAYWRIGHT OBBLIGATORIO — JUL-007 P1 · DATI VERITIERI SULLE SEDI
 * File: tests/verify-jul007-sedi.spec.js
 *
 * Verifica:
 * 1. Sedi reali (le uniche):
 *    - Ufficio Blue Arroyo Srl: Via Matteo Palmieri 20R, 50122 Firenze
 *    - Magazzino: Via dell'Agnolo 72R, Firenze
 * 2. Assenza della dicitura "3 Hub ZTL" su tutte le pagine toccate
 *    (index.html, prezzi.html, checkout.html, app.html, admin.html) e nei documenti docs/*.
 * 3. Presenza delle sedi veritiere ("Via Matteo Palmieri 20R" e "Via dell'Agnolo 72R").
 * 4. Rispetto di document.documentElement.scrollWidth <= clientWidth alle 6 dimensioni mobile:
 *    - 320 x 568
 *    - 360 x 800
 *    - 390 x 844
 *    - 430 x 932
 *    - 768 x 1024
 *    - 844 x 390
 * 5. Integrità di docs/checklist.csv (24 Fatto e 78 In corso).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { chromium } = require('playwright');

const ROOT_DIR = path.resolve(__dirname, '..');

const TARGET_PAGES = [
  '/index.html',
  '/prezzi.html',
  '/checkout.html',
  '/app.html',
  '/admin.html'
];

const MOBILE_VIEWPORTS = [
  { width: 320, height: 568, label: '320x568' },
  { width: 360, height: 800, label: '360x800' },
  { width: 390, height: 844, label: '390x844' },
  { width: 430, height: 932, label: '430x932' },
  { width: 768, height: 1024, label: '768x1024' },
  { width: 844, height: 390, label: '844x390' }
];

const DOCS_FILES = [
  'docs/checklist.csv',
  'docs/collaudo-dec16-e-operativita.md',
  'docs/commerciale-e-posizionamento.md',
  'docs/contratti-e-accordi-legali.md',
  'docs/gdpr-e-adempimenti-struttura.md',
  'docs/modello-economico.md',
  'docs/sistema-contabile-gabriela-holding.md',
  'docs/flussi.csv',
  'docs/ruoli.csv'
];

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

function verifyDocsAndChecklist() {
  for (const rel of DOCS_FILES) {
    const full = path.join(ROOT_DIR, rel);
    assert.ok(fs.existsSync(full), `File mancante: ${rel}`);
    const content = fs.readFileSync(full, 'utf8');
    assert.ok(
      !/3\s*Hub\s*ZTL/i.test(content),
      `Trovata dicitura vietata "3 Hub ZTL" in ${rel}`
    );
    assert.ok(
      /Via Matteo Palmieri 20R/i.test(content),
      `Manca la sede reale "Via Matteo Palmieri 20R" in ${rel}`
    );
    assert.ok(
      /Via dell'Agnolo 72R/i.test(content),
      `Manca il magazzino reale "Via dell'Agnolo 72R" in ${rel}`
    );
  }

  const checklistRaw = fs.readFileSync(path.join(ROOT_DIR, 'docs/checklist.csv'), 'utf8').trim();
  const lines = checklistRaw.split(/\r?\n/).slice(1);
  let fattoCount = 0;
  let inCorsoCount = 0;
  for (const line of lines) {
    if (/,P[123],Fatto,/.test(line)) fattoCount++;
    if (/,P[123],In corso,/.test(line)) inCorsoCount++;
  }
  assert.strictEqual(fattoCount, 24, `docs/checklist.csv deve avere 24 Fatto, trovati ${fattoCount}`);
  assert.strictEqual(inCorsoCount, 78, `docs/checklist.csv deve avere 78 In corso, trovati ${inCorsoCount}`);
}

async function runJul007SediVerification() {
  console.log('=== AVVIO VERIFICA JUL-007 · DATI VERITIERI SULLE SEDI ===');
  verifyDocsAndChecklist();
  console.log('✓ Documentazione docs/* e conteggi checklist.csv (24 Fatto / 78 In corso) verificati.');

  const { server, port } = await startStaticServer(ROOT_DIR);
  const baseUrl = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch({ headless: true });

  try {
    for (const vp of MOBILE_VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2
      });
      const page = await context.newPage();

      for (const pagePath of TARGET_PAGES) {
        await page.goto(`${baseUrl}${pagePath}`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(80);

        if (pagePath === '/admin.html') {
          await page.evaluate(() => {
            if (typeof selectLoginPreset === 'function') selectLoginPreset('superadmin');
            if (typeof performAdminLogin === 'function') performAdminLogin();
          });
          await page.waitForTimeout(50);
        }

        const result = await page.evaluate(() => {
          const docEl = document.documentElement;
          const htmlText = docEl.innerHTML || '';
          const bodyText = document.body ? document.body.innerText : '';
          const cfgText = typeof window.SITE_CONFIG !== 'undefined' ? JSON.stringify(window.SITE_CONFIG) : '';
          const combined = `${bodyText}\n${htmlText}\n${cfgText}`;

          return {
            scrollWidth: docEl.scrollWidth,
            clientWidth: docEl.clientWidth,
            hasForbidden3HubZtl: /3\s*Hub\s*ZTL/i.test(bodyText) || /3\s*Hub\s*ZTL/i.test(htmlText),
            hasOfficePalmieri: /Via Matteo Palmieri 20R/i.test(combined),
            hasWarehouseAgnolo: /Via dell['’]Agnolo 72R/i.test(combined)
          };
        });

        assert.ok(
          result.scrollWidth <= result.clientWidth + 1,
          `[${vp.label}] ${pagePath}: scrollWidth (${result.scrollWidth}) > clientWidth (${result.clientWidth})`
        );
        assert.strictEqual(
          result.hasForbidden3HubZtl,
          false,
          `[${vp.label}] ${pagePath}: trovata dicitura vietata "3 Hub ZTL"`
        );
        assert.strictEqual(
          result.hasOfficePalmieri,
          true,
          `[${vp.label}] ${pagePath}: manca "Via Matteo Palmieri 20R"`
        );
        assert.strictEqual(
          result.hasWarehouseAgnolo,
          true,
          `[${vp.label}] ${pagePath}: manca "Via dell'Agnolo 72R"`
        );
      }

      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('✅ TUTTI I CONTROLLI JUL-007 SUPERATI (0 occorrenze "3 Hub ZTL", sedi veritiere presenti, 6 viewport mobile conformi).');
}

if (require.main === module) {
  runJul007SediVerification().catch((err) => {
    console.error('❌ ERRORE VERIFICA JUL-007:', err);
    process.exit(1);
  });
}

module.exports = { runJul007SediVerification, verifyDocsAndChecklist };
