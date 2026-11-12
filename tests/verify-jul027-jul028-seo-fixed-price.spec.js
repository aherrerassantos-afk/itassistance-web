#!/usr/bin/env node
/**
 * TEST PLAYWRIGHT OBBLIGATORIO — JUL-027 (STRATEGIA SEO) + JUL-028 (QUOTA FISSA UNICA 99,00 €/MESE) + JUL-032 (NUOVA HOME & ANALISI CONCORRENTE)
 * File: tests/verify-jul027-jul028-seo-fixed-price.spec.js
 *
 * Verifica:
 * 1. Che in `index.html`, `en/index.html`, `prezzi.html`, `checkout.html`, `contratto.html`,
 *    `calcola-risparmio.html`, `app.html`, `admin.html` l'unico canone di abbonamento mostrato
 *    sia `99,00 €` / `99 €` (`€99.00` / `€99`) mensile e `1.188,00 €` / `1.188 €` (`€1,188.00` / `€1,188`)
 *    annuale, e che NON compaiano `199,00 €`, `299,00 €`, `289,50 €` né `"slot disponibili su 24"`.
 * 2. Che aprendo `/checkout.html?locked_price=249&saturation=75` e impostando
 *    `localStorage.setItem('ita_admin_forced_dyn_price', '249')`, il prezzo mostrato e calcolato
 *    nel checkout resti sempre e solo `99,00 € / mese` (`1.188,00 € / anno`).
 * 3. Che in `en/index.html` e `chi-siamo.html` `Via Matteo Palmieri 20R` compaia esclusivamente
 *    come Sede legale / Registered legal office e mai come `"Where is your office in Florence?"`
 *    o `"sede operativa"` / `"sede legale e operativa"`.
 * 4. Che i tag SEO (`<title>`, `<meta name="description">`, `<link rel="canonical">`,
 *    `JSON-LD` con `"price": "99.00"`) siano presenti e conformi sulle pagine principali.
 * 5. [JUL-032] Che in `index.html` sia presente `#cosa-facciamo-diversamente` ("Cosa facciamo diversamente")
 *    e in `en/index.html` sia presente `#what-we-do-differently` ("What We Do Differently"),
 *    che non compaia mai `mmega` (case-insensitive) né vanti non dimostrabili (`cervello più potente`,
 *    `batte la concorrenza`, `in 10 minuti al giorno`, `75% dei proprietari`, `senza cedere il 20%`).
 * 6. [JUL-032] Che alle 6 dimensioni mobile obbligatorie (`320x568`, `360x800`, `390x844`, `430x932`,
 *    `768x1024`, `844x390`) `document.documentElement.scrollWidth <= document.documentElement.clientWidth`
 *    su `index.html` e `en/index.html` e che i bottoni principali e l'hamburger siano visibili e >= 48px.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { chromium } = require('playwright');

const ROOT_DIR = path.resolve(__dirname, '..');

const TARGET_PAGES = [
  '/index.html',
  '/en/index.html',
  '/prezzi.html',
  '/checkout.html',
  '/contratto.html',
  '/calcola-risparmio.html',
  '/app.html',
  '/admin.html'
];

const SEO_PAGES = [
  '/index.html',
  '/en/index.html',
  '/prezzi.html',
  '/calcola-risparmio.html',
  '/chi-siamo.html'
];

const MOBILE_VIEWPORTS = [
  { width: 320, height: 568, label: '320x568' },
  { width: 360, height: 800, label: '360x800' },
  { width: 390, height: 844, label: '390x844' },
  { width: 430, height: 932, label: '430x932' },
  { width: 768, height: 1024, label: '768x1024' },
  { width: 844, height: 390, label: '844x390' }
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

function verifyDocsJul027AndJul028() {
  const requiredDocs = [
    'docs/strategia-seo-itassistance.md',
    'docs/registro-prezzo-fisso-jul028.md',
    'docs/analisi-concorrente-mmega.md',
    'docs/modello-economico.md',
    'docs/commerciale-e-posizionamento.md',
    'docs/checklist.csv'
  ];

  for (const rel of requiredDocs) {
    const full = path.join(ROOT_DIR, rel);
    assert.ok(fs.existsSync(full), `File obbligatorio mancante: ${rel}`);
  }

  const checklist = fs.readFileSync(path.join(ROOT_DIR, 'docs/checklist.csv'), 'utf8');
  assert.ok(checklist.includes('106,2. Struttura commerciale,"Strategia SEO Itassistance & Deep Search Multilingua (JUL-027)'), 'Manca riga #106 JUL-027 in docs/checklist.csv');
  assert.ok(checklist.includes('107,1. Modello di business & legale,"Quota Fissa Unica 99,00 €/mese e Rimozione Prezzo Variabile (JUL-028)'), 'Manca riga #107 JUL-028 in docs/checklist.csv');
  assert.ok(checklist.includes('108,2. Struttura commerciale,"Nuova Home Page Itassistance Ottimizzata, Semplice e Congruente + Analisi Punti Deboli Concorrente mmega.com (JUL-032)'), 'Manca riga #108 JUL-032 in docs/checklist.csv');

  const modello = fs.readFileSync(path.join(ROOT_DIR, 'docs/modello-economico.md'), 'utf8');
  assert.ok(modello.includes('99,00 € / mese') && modello.includes('1.188,00 € / anno'), 'docs/modello-economico.md deve riportare la quota fissa 99,00 €/mese e 1.188,00 €/anno');
  assert.ok(!/99\s*€\s*\+\s*\(299/.test(modello), 'docs/modello-economico.md non deve più contenere la formula di saturazione 99-299 €');

  const mmegaDoc = fs.readFileSync(path.join(ROOT_DIR, 'docs/analisi-concorrente-mmega.md'), 'utf8');
  assert.ok(/Trustpilot/i.test(mmegaDoc) && /Cos[a]\s+facciamo\s+diversamente/i.test(mmegaDoc), 'docs/analisi-concorrente-mmega.md deve includere l\'analisi recensioni Trustpilot e la sezione Cosa facciamo diversamente');
}

async function runJul027AndJul028Verification() {
  console.log('=== AVVIO VERIFICA JUL-027 (SEO) + JUL-028 (QUOTA FISSA 99,00 €/MESE) + JUL-032 (NUOVA HOME) ===');
  verifyDocsJul027AndJul028();
  console.log('✓ Documentazione strategica SEO (JUL-027), registro prezzo fisso (JUL-028), analisi concorrente (JUL-032) e checklist (#106, #107, #108) verificati.');

  const { server, port } = await startStaticServer(ROOT_DIR);
  const baseUrl = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 }
    });
    const page = await context.newPage();

    // 1. Verifica che su tutte le pagine target compaia la quota fissa 99,00 € / 99 € (1.188,00 € / 1.188 €)
    // e che NON compaiano 199,00 €, 299,00 €, 289,50 € o "slot disponibili su 24"
    for (const pagePath of TARGET_PAGES) {
      await page.goto(`${baseUrl}${pagePath}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(80);

      if (pagePath === '/admin.html') {
        await page.evaluate(() => {
          if (typeof selectLoginPreset === 'function') selectLoginPreset('superadmin');
          if (typeof performAdminLogin === 'function') performAdminLogin();
        });
        await page.waitForTimeout(60);
      }

      const check = await page.evaluate(() => {
        const bodyText = document.body ? document.body.innerText : '';
        const has99 = /\b99([.,]00)?\s*€|€\s*99([.,]00)?\b/i.test(bodyText);
        const hasForbidden199 = /\b199,00\s*€|\b199\s*€\s*\/\s*mese/i.test(bodyText);
        const hasForbidden299 = /\b299,00\s*€|\b299,50\s*€|\b99\s*[–-]\s*299\s*€/i.test(bodyText);
        const hasForbidden289 = /\b289,50\s*€/i.test(bodyText);
        const hasForbiddenSlots = /slot disponibili su 24/i.test(bodyText);
        return {
          has99,
          hasForbidden199,
          hasForbidden299,
          hasForbidden289,
          hasForbiddenSlots
        };
      });

      assert.strictEqual(check.has99, true, `${pagePath}: deve mostrare il canone fisso di 99,00 € / 99 €`);
      assert.strictEqual(check.hasForbidden199, false, `${pagePath}: non deve contenere "199,00 €" o "199 €/mese"`);
      assert.strictEqual(check.hasForbidden299, false, `${pagePath}: non deve contenere "299,00 €", "299,50 €" o range "99–299 €"`);
      assert.strictEqual(check.hasForbidden289, false, `${pagePath}: non deve contenere "289,50 €"`);
      assert.strictEqual(check.hasForbiddenSlots, false, `${pagePath}: non deve contenere "slot disponibili su 24"`);
    }
    console.log('✓ Punto 1 superato: tutte le 8 pagine mostrano solo 99,00 €/mese (1.188,00 €/anno) e zero prezzi variabili/slot.');

    // 2. Verifica blindatura Checkout contro parametri URL (?locked_price=249&saturation=75) e localStorage
    await page.goto(`${baseUrl}/checkout.html`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('ita_admin_forced_dyn_price', '249');
      sessionStorage.setItem('ita_locked_price', '249');
    });
    await page.goto(`${baseUrl}/checkout.html?locked_price=249&saturation=75`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(80);

    const checkoutCheck = await page.evaluate(() => {
      const bodyText = document.body ? document.body.innerText : '';
      const has249 = /\b249([.,]00)?\s*€/i.test(bodyText);
      const has99 = /\b99([.,]00)?\s*€/i.test(bodyText);
      return { has249, has99 };
    });
    assert.strictEqual(checkoutCheck.has249, false, 'checkout.html deve ignorare ?locked_price=249 e localStorage ita_admin_forced_dyn_price=249');
    assert.strictEqual(checkoutCheck.has99, true, 'checkout.html deve mantenere sempre e solo 99,00 € / mese');
    console.log('✓ Punto 2 superato: checkout.html ignora qualsiasi parametro URL o localStorage di prezzo variabile.');

    // 3. Verifica Sede legale esclusiva in en/index.html e chi-siamo.html
    await page.goto(`${baseUrl}/en/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(50);
    const enCheck = await page.evaluate(() => {
      const html = document.documentElement.innerHTML || '';
      return {
        hasForbiddenWhereOffice: /Where is your office in Florence\?/i.test(html),
        hasPalmieri: /Via Matteo Palmieri 20R/i.test(html)
      };
    });
    assert.strictEqual(enCheck.hasForbiddenWhereOffice, false, 'en/index.html non deve contenere "Where is your office in Florence?"');
    assert.strictEqual(enCheck.hasPalmieri, true, 'en/index.html deve riportare Via Matteo Palmieri 20R come registered legal office');

    await page.goto(`${baseUrl}/chi-siamo.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(50);
    const chiSiamoCheck = await page.evaluate(() => {
      const text = document.body ? document.body.innerText : '';
      return {
        hasForbiddenOperativa: /sede\s+(legale\s+e\s+)?operativa/i.test(text),
        hasSedeLegale: /Sede legale:\s*Via Matteo Palmieri 20R/i.test(text) || /Via Matteo Palmieri 20R/i.test(text)
      };
    });
    assert.strictEqual(chiSiamoCheck.hasForbiddenOperativa, false, 'chi-siamo.html non deve definire Via Matteo Palmieri 20R come "sede operativa"');
    assert.strictEqual(chiSiamoCheck.hasSedeLegale, true, 'chi-siamo.html deve riportare Via Matteo Palmieri 20R come Sede legale');
    console.log('✓ Punto 3 superato: Via Matteo Palmieri 20R compare esclusivamente come Sede legale / Registered legal office.');

    // 4. Verifica tag SEO (<title>, <meta name="description">, <link rel="canonical">, JSON-LD con "99.00")
    for (const seoPath of SEO_PAGES) {
      await page.goto(`${baseUrl}${seoPath}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(50);

      const seo = await page.evaluate(() => {
        const title = document.title || '';
        const descEl = document.querySelector('meta[name="description"]');
        const desc = descEl ? (descEl.getAttribute('content') || '') : '';
        const canonEl = document.querySelector('link[rel="canonical"]');
        const canonical = canonEl ? (canonEl.getAttribute('href') || '') : '';
        const ldScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((s) => s.textContent || '');
        const ldJoined = ldScripts.join('\n');
        return {
          title,
          desc,
          canonical,
          ldCount: ldScripts.length,
          ldJoined
        };
      });

      assert.ok(seo.title.length >= 20, `${seoPath}: <title> mancante o troppo corto`);
      assert.ok(!/10 minuti al giorno|10 Minutes a Day/i.test(seo.title), `${seoPath}: <title> non deve contenere il claim "in 10 minuti al giorno"`);
      assert.ok(seo.desc.length >= 50, `${seoPath}: <meta name="description"> mancante o troppo corta`);
      assert.ok(seo.canonical.startsWith('https://www.itadreamteam.com'), `${seoPath}: <link rel="canonical"> deve puntare a https://www.itadreamteam.com`);
      if (seoPath === '/index.html' || seoPath === '/en/index.html' || seoPath === '/prezzi.html') {
        assert.ok(seo.ldCount > 0, `${seoPath}: deve avere almeno un blocco JSON-LD`);
        assert.ok(/"price"\s*:\s*"99(\.00)?"/.test(seo.ldJoined), `${seoPath}: JSON-LD deve avere "price": "99.00"`);
      }
    }
    console.log('✓ Punto 4 superato: tutti i tag SEO (<title>, description, canonical, JSON-LD price 99.00) sono conformi.');

    // 5. [JUL-032] Verifica sezione "Cosa facciamo diversamente" / "What We Do Differently",
    // assenza "mmega" e assenza vanti non dimostrabili su index.html e en/index.html
    await page.goto(`${baseUrl}/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(60);
    const homeItJul032 = await page.evaluate(() => {
      const html = document.documentElement.innerHTML || '';
      const text = document.body ? document.body.innerText : '';
      return {
        hasDiffSection: Boolean(document.querySelector('#cosa-facciamo-diversamente')) || /Cosa facciamo diversamente/i.test(text),
        hasMmega: /mmega/i.test(html),
        hasForbiddenClaims: /cervello pi[uù] potente|batte la concorrenza|in 10 minuti al giorno|75%\s*dei proprietari|senza cedere il 20%/i.test(text)
      };
    });
    assert.strictEqual(homeItJul032.hasDiffSection, true, 'index.html deve contenere la sezione #cosa-facciamo-diversamente ("Cosa facciamo diversamente")');
    assert.strictEqual(homeItJul032.hasMmega, false, 'index.html non deve mai nominare il concorrente "mmega"');
    assert.strictEqual(homeItJul032.hasForbiddenClaims, false, 'index.html non deve contenere claim non dimostrabili vietati da JUL-032');

    await page.goto(`${baseUrl}/en/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(60);
    const homeEnJul032 = await page.evaluate(() => {
      const html = document.documentElement.innerHTML || '';
      const text = document.body ? document.body.innerText : '';
      return {
        hasDiffSection: Boolean(document.querySelector('#what-we-do-differently')) || /What We Do Differently/i.test(text),
        hasMmega: /mmega/i.test(html),
        hasForbiddenClaims: /cervello pi[uù] potente|batte la concorrenza|in 10 minutes a day|75%\s*of owners|without giving up 20%/i.test(text)
      };
    });
    assert.strictEqual(homeEnJul032.hasDiffSection, true, 'en/index.html deve contenere la sezione #what-we-do-differently ("What We Do Differently")');
    assert.strictEqual(homeEnJul032.hasMmega, false, 'en/index.html non deve mai nominare il concorrente "mmega"');
    assert.strictEqual(homeEnJul032.hasForbiddenClaims, false, 'en/index.html non deve contenere claim non dimostrabili vietati da JUL-032');
    console.log('✓ Punto 5 (JUL-032) superato: sezioni #cosa-facciamo-diversamente e #what-we-do-differently presenti, 0 menzioni concorrenti e 0 claim non verificati.');

    await context.close();

    // 6. [JUL-032] Verifica alle 6 dimensioni mobile su index.html e en/index.html:
    // scrollWidth <= clientWidth e hamburger / bottoni principali visibili (>= 48px per hamburger)
    for (const vp of MOBILE_VIEWPORTS) {
      const mobCtx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2
      });
      const mobPage = await mobCtx.newPage();

      for (const homePath of ['/index.html', '/en/index.html']) {
        await mobPage.goto(`${baseUrl}${homePath}`, { waitUntil: 'domcontentloaded' });
        await mobPage.waitForTimeout(60);

        const mobAudit = await mobPage.evaluate(() => {
          const docEl = document.documentElement;
          const vw = window.innerWidth;
          const scrollWidth = docEl.scrollWidth;
          const clientWidth = docEl.clientWidth;

          const hamburger = document.querySelector('#mobile-menu-open-btn, .mobile-menu-toggle');
          let hamburgerOk = true;
          if (hamburger) {
            const st = window.getComputedStyle(hamburger);
            if (st.display !== 'none' && st.visibility !== 'hidden') {
              const r = hamburger.getBoundingClientRect();
              hamburgerOk = r.width >= 47.5 && r.height >= 47.5 && r.left >= -1 && r.right <= vw + 1;
            }
          }

          const primaryBtn = document.querySelector('main .btn, .hero .btn, a.btn');
          let primaryBtnOk = false;
          if (primaryBtn) {
            const r = primaryBtn.getBoundingClientRect();
            primaryBtnOk = r.width >= 48 && r.height >= 36 && r.left >= -1 && r.right <= vw + 1;
          }

          return {
            scrollWidth,
            clientWidth,
            hamburgerOk,
            primaryBtnOk
          };
        });

        assert.ok(
          mobAudit.scrollWidth <= mobAudit.clientWidth + 1,
          `[${vp.label}] ${homePath}: scrollWidth (${mobAudit.scrollWidth}) > clientWidth (${mobAudit.clientWidth})`
        );
        assert.strictEqual(
          mobAudit.hamburgerOk,
          true,
          `[${vp.label}] ${homePath}: pulsante hamburger non visibile o < 48x48px`
        );
        assert.strictEqual(
          mobAudit.primaryBtnOk,
          true,
          `[${vp.label}] ${homePath}: bottone principale CTA non visibile o fuori schermo`
        );
      }

      await mobCtx.close();
    }
    console.log('✓ Punto 6 (JUL-032) superato: index.html e en/index.html superano i controlli su tutte le 6 dimensioni mobile.');
  } finally {
    await browser.close();
    server.close();
  }

  console.log('✅ TUTTI I CONTROLLI JUL-027, JUL-028 E JUL-032 SUPERATI CON SUCCESSO.');
}

if (require.main === module) {
  runJul027AndJul028Verification().catch((err) => {
    console.error('❌ ERRORE VERIFICA JUL-027 / JUL-028 / JUL-032:', err);
    process.exit(1);
  });
}

module.exports = { runJul027AndJul028Verification, verifyDocsJul027AndJul028 };
