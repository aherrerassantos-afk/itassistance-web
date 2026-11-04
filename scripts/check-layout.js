#!/usr/bin/env node
/**
 * CONTROLLO AUTOMATICO ANTI-SOVRAPPOSIZIONE, SPAZIATURA E CONTRASTO (Playwright + axe-core)
 * Comando: npm run check:layout
 *
 * Larghezze testate:
 * - Telefono e tablet: 320, 360, 390, 430, 768 px
 * - PC: 1024, 1280, 1440, 1920, 2560 px
 *
 * Il test fallisce (exit code 1) se:
 * 1. La pagina ha scroll orizzontale.
 * 2. Un elemento visibile esce dallo schermo.
 * 3. Testi, logo, bottoni o link si intersecano.
 * 4. Una voce di menu o un bottone (.btn) va su più righe quando non previsto.
 * 5. Un elemento fisso copre testi o comandi o non si nasconde durante l'editing di un input.
 * 6. Un testo risulta tagliato dal suo contenitore.
 * 7. Il contrasto dei testi non è conforme (WCAG 4.5:1 testo normale, 3:1 testo grande + axe-core).
 * 8. Il testo contiene errori di spaziatura (minuscola seguita da maiuscola, parentesi/simbolo seguito da lettere, parole del glossario attaccate).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const ARTIFACT_DIR = process.env.ARTIFACT_DIR || '/Users/julianherrera/.gemini/antigravity/brain/472b1a01-1709-4a9f-9b56-2a4debef4453';

const VIEWPORT_WIDTHS = [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920, 2560];
const PAGES_TO_CHECK = [
  { path: '/index.html', name: 'home-it', checkAllWidths: true },
  { path: '/en/index.html', name: 'home-en', checkAllWidths: true },
  { path: '/login.html', name: 'login', checkAllWidths: false, widths: [390, 1440] },
  { path: '/prezzi.html', name: 'prezzi', checkAllWidths: false, widths: [390, 1440] },
  { path: '/checkout.html', name: 'checkout', checkAllWidths: false, widths: [390, 1440] }
];

// Lista di eccezioni ufficiali per i nomi di marchio con CamelCase interno
const BRAND_CAMEL_EXCEPTIONS = new Set([
  'WhatsApp',
  'SmartBookings',
  'AirBnB',
  'PayPal',
  'YouTube',
  'LinkedIn',
  'JavaScript',
  'GitHub',
  'OneDrive',
  'AlloggiatiWeb',
  'McKinsey',
  'iPhone',
  'iPad',
  'iOS',
  'macOS',
  'eBay',
  'FedEx',
  'MasterCard',
  ' Postepay',
  'LibreOffice'
]);

const GLOSSARY_WORDS = [
  'itassistance',
  'Firenze',
  'Questura',
  'Alloggiati',
  'Ross1000',
  'commissioni',
  'Toscan',
  'Arroyo',
  'Smartbookings'
];

const VALID_COMPOUND_WORDS = new Set([
  'soggiorni',
  'soggiorno',
  'Quotazione',
  'quotazione',
  'Quotazioni',
  'quotazioni',
  'commissionata',
  'commissionate',
  'commissionato',
  'AlloggiatiWeb'
]);

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

function collectHtmlFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'scripts') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function auditAllHtmlFilesStaticSpacing() {
  const htmlFiles = collectHtmlFiles(ROOT_DIR);
  const errors = [];
  const tagCloseGluedRe = /<\/(strong|b|em|i|a|code|mark|small|span)>([A-Za-zÀ-ÿ0-9])/g;
  const tagOpenGluedRe = /([A-Za-zÀ-ÿ0-9])<(strong|b|em|i|a|code|mark|small)\b/g;

  for (const file of htmlFiles) {
    const rel = path.relative(ROOT_DIR, file);
    const raw = fs.readFileSync(file, 'utf8');
    // Rimuove script e style per controllare il markup testuale
    const bodyOnly = raw
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '');

    let m;
    while ((m = tagCloseGluedRe.exec(bodyOnly)) !== null) {
      const ctx = bodyOnly.slice(Math.max(0, m.index - 20), Math.min(bodyOnly.length, m.index + 35)).replace(/\s+/g, ' ');
      errors.push(`[Static Spacing] ${rel}: tag di chiusura incollato a parola -> "${ctx}"`);
    }
    while ((m = tagOpenGluedRe.exec(bodyOnly)) !== null) {
      const ctx = bodyOnly.slice(Math.max(0, m.index - 20), Math.min(bodyOnly.length, m.index + 35)).replace(/\s+/g, ' ');
      errors.push(`[Static Spacing] ${rel}: parola incollata a tag di apertura -> "${ctx}"`);
    }
  }
  return { count: htmlFiles.length, errors };
}

function checkTextSpacingErrors(text, pageLabel) {
  const errors = [];
  if (!text) return errors;

  // 1. Minuscola seguita da maiuscola (es. "giornisoddisfatto", "Firenzein")
  const tokens = text.split(/[\s\/]+/);
  const camelRegex = /[a-zàèéìòù][A-ZÀÈÉÌÒÙ]/;
  for (const rawToken of tokens) {
    const cleanToken = rawToken.replace(/^[^A-Za-zÀ-ÿ0-9]+|[^A-Za-zÀ-ÿ0-9]+$/g, '');
    if (!cleanToken) continue;
    if (BRAND_CAMEL_EXCEPTIONS.has(cleanToken) || VALID_COMPOUND_WORDS.has(cleanToken)) continue;
    if (/^(https?:\/\/|www\.|IT07480210488)/i.test(cleanToken)) continue;
    if (camelRegex.test(cleanToken)) {
      errors.push(`[Spaziatura #8 - minuscolaMaiuscola] ${pageLabel}: "${cleanToken}"`);
    }
  }

  // 2. Parentesi chiusa o simbolo (€, %) seguito direttamente da lettera (es. "€)Quota", "%Sulle", "€Quota")
  const symbolLetterRegex = /([)\%€])([A-Za-zÀ-ÿ]{2,})/g;
  let match;
  while ((match = symbolLetterRegex.exec(text)) !== null) {
    errors.push(`[Spaziatura #8 - simboloLettera] ${pageLabel}: "${match[0]}"`);
  }

  // 3. Parole del glossario attaccate ad altre lettere (es. "itassistancemantieni", "commissionisulle", "giornisoddisfatto", "Firenzein")
  const specificGluedRe = /(itassistance[A-Za-zÀ-ÿ]+|[A-Za-zÀ-ÿ]+itassistance|commissioni[A-Za-zÀ-ÿ]+|giorni[A-Za-zÀ-ÿ]+|Firenze[A-Za-zÀ-ÿ]+)/g;
  let sgm;
  while ((sgm = specificGluedRe.exec(text)) !== null) {
    if (!BRAND_CAMEL_EXCEPTIONS.has(sgm[0]) && !VALID_COMPOUND_WORDS.has(sgm[0])) {
      errors.push(`[Spaziatura #8 - glossarioIncollato] ${pageLabel}: "${sgm[0]}"`);
    }
  }
  for (const gw of GLOSSARY_WORDS) {
    const reLeft = new RegExp(`[A-Za-zÀ-ÿ]{2,}${gw}`, 'g');
    const reRight = new RegExp(`${gw}[A-Za-zÀ-ÿ]{2,}`, 'g');
    let gm;
    while ((gm = reLeft.exec(text)) !== null) {
      if (!BRAND_CAMEL_EXCEPTIONS.has(gm[0]) && !VALID_COMPOUND_WORDS.has(gm[0])) {
        errors.push(`[Spaziatura #8 - glossarioIncollato] ${pageLabel}: "${gm[0]}"`);
      }
    }
    while ((gm = reRight.exec(text)) !== null) {
      if (!BRAND_CAMEL_EXCEPTIONS.has(gm[0]) && !VALID_COMPOUND_WORDS.has(gm[0])) {
        errors.push(`[Spaziatura #8 - glossarioIncollato] ${pageLabel}: "${gm[0]}"`);
      }
    }
  }

  return errors;
}

async function runLayoutChecks() {
  console.log('=== AVVIO CONTROLLO AUTOMATICO ANTI-SOVRAPPOSIZIONE (Playwright + axe-core) ===');

  // Step A: Audit statico su tutte le 33 pagine HTML
  const staticAudit = auditAllHtmlFilesStaticSpacing();
  console.log(`[1/3] Audit statico spaziatura tag eseguito su ${staticAudit.count} file HTML.`);
  if (staticAudit.errors.length > 0) {
    console.error('Errori statici trovati:', staticAudit.errors);
  }

  const { chromium, webkit } = require('playwright');
  const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const { server, port } = await startStaticServer(ROOT_DIR);
  const baseUrl = `http://127.0.0.1:${port}`;
  const allErrors = [...staticAudit.errors];
  const reportRows = [];

  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch (_) {
    try {
      browser = await chromium.launch({ headless: true });
    } catch (__) {
      browser = await webkit.launch({ headless: true });
    }
  }

  try {
    for (const pageCfg of PAGES_TO_CHECK) {
      const widths = pageCfg.checkAllWidths ? VIEWPORT_WIDTHS : pageCfg.widths;
      for (const width of widths) {
        const height = width < 768 ? 844 : 900;
        const context = await browser.newContext({
          viewport: { width, height },
          deviceScaleFactor: 1
        });
        const page = await context.newPage();
        const url = `${baseUrl}${pageCfg.path}`;
        const label = `${pageCfg.name}@${width}px`;

        await page.goto(url, { waitUntil: 'networkidle' });
        await page.waitForTimeout(150);

        // Esegue i controlli geometrici e tipografici nel browser
        const domCheck = await page.evaluate((vw) => {
          const errs = [];

          function isVisible(el) {
            if (!el) return false;
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
              return false;
            }
            const r = el.getBoundingClientRect();
            return r.width > 0.5 && r.height > 0.5;
          }

          function rectsOverlap(r1, r2, tolerance = 2) {
            return !(
              r1.right <= r2.left + tolerance ||
              r1.left >= r2.right - tolerance ||
              r1.bottom <= r2.top + tolerance ||
              r1.top >= r2.bottom - tolerance
            );
          }

          // 1. Scroll orizzontale
          const docScrollWidth = document.documentElement.scrollWidth;
          if (docScrollWidth > vw + 1) {
            errs.push(`[#1 Scroll Orizzontale] scrollWidth=${docScrollWidth}px > viewport=${vw}px`);
          }

          // 2. Elementi visibili fuori schermo orizzontalmente
          const keySelectors = 'header, .brand-mark, .brand, .nav-links a, .en-nav-links a, .header-actions > *, h1, h2, h3, p, .btn, .hero-meta-item, .kpi-box';
          const nodes = Array.from(document.querySelectorAll(keySelectors)).filter(isVisible);
          for (const el of nodes) {
            const r = el.getBoundingClientRect();
            if (r.left < -2 || r.right > vw + 2) {
              const idOrCls = el.id ? `#${el.id}` : (el.className || el.tagName);
              errs.push(`[#2 Fuori Schermo] <${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 28)}"> (${idOrCls}) left=${Math.round(r.left)}px right=${Math.round(r.right)}px su viewport ${vw}px`);
            }
          }

          // 3. Sovrapposizione / intersezione tra elementi dell'header, hero e bottoni
          const headerItems = Array.from(
            document.querySelectorAll('.header-inner > *, .navbar-inner > *, .onion-header-inner > *, .nav-links > li > a, .en-nav-links > li > a, .header-actions > *')
          ).filter(isVisible);

          for (let i = 0; i < headerItems.length; i++) {
            for (let j = i + 1; j < headerItems.length; j++) {
              const a = headerItems[i];
              const b = headerItems[j];
              if (a.contains(b) || b.contains(a)) continue;
              const ra = a.getBoundingClientRect();
              const rb = b.getBoundingClientRect();
              if (rectsOverlap(ra, rb, 1)) {
                errs.push(`[#3 Intersezione Header] "${a.textContent.trim().slice(0, 20)}" si sovrappone a "${b.textContent.trim().slice(0, 20)}"`);
              }
            }
          }

          const heroChildren = Array.from(
            document.querySelectorAll('.hero-content > *, .hero-meta-strip > .hero-meta-item')
          ).filter(isVisible);
          for (let i = 0; i < heroChildren.length; i++) {
            for (let j = i + 1; j < heroChildren.length; j++) {
              const a = heroChildren[i];
              const b = heroChildren[j];
              if (a.contains(b) || b.contains(a)) continue;
              if (rectsOverlap(a.getBoundingClientRect(), b.getBoundingClientRect(), 1)) {
                errs.push(`[#3 Intersezione Hero] "${a.textContent.trim().slice(0, 20)}" si sovrappone a "${b.textContent.trim().slice(0, 20)}"`);
              }
            }
          }

          // 4. Voci di menu e bottoni (.btn) devono restare su UNA sola riga
          const singleLineItems = Array.from(
            document.querySelectorAll('.nav-links a, .en-nav-links a, .brand-mark, .brand, .header-login-btn, .mobile-menu-toggle, .btn')
          ).filter(isVisible);

          for (const el of singleLineItems) {
            const range = document.createRange();
            range.selectNodeContents(el);
            const clientRects = Array.from(range.getClientRects()).filter(r => r.width > 1 && r.height > 1);
            if (clientRects.length > 1) {
              // Verifica se ci sono rect su righe verticali diverse
              const firstTop = clientRects[0].top;
              const hasSecondLine = clientRects.some(r => Math.abs(r.top - firstTop) > 10);
              if (hasSecondLine) {
                errs.push(`[#4 Voce/Bottone su Più Righe] "${el.textContent.trim().replace(/\s+/g, ' ')}" va su più righe`);
              }
            }
          }

          // 6. Testo tagliato dal contenitore o semitrasparente
          const textContainers = Array.from(
            document.querySelectorAll('h1, h2, h3, .lead-paragraph, .kicker, .nav-links a, .btn')
          ).filter(isVisible);

          for (const el of textContainers) {
            const st = window.getComputedStyle(el);
            if (parseFloat(st.opacity) < 0.95) {
              errs.push(`[#6 Testo Semitrasparente] "${el.textContent.trim().slice(0, 25)}" ha opacity=${st.opacity}`);
            }
            if ((st.overflowX === 'hidden' || st.overflowX === 'clip') && el.scrollWidth > el.clientWidth + 3) {
              errs.push(`[#6 Testo Tagliato] "${el.textContent.trim().slice(0, 25)}" scrollWidth=${el.scrollWidth} > clientWidth=${el.clientWidth}`);
            }
          }

          // 7. Contrasto esplicito su Hero (testo sopra foto con velo scuro)
          function parseRgba(str) {
            const m = (str || '').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
            if (!m) return { r: 255, g: 255, b: 255, a: 1 };
            return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
          }
          function relLuminance({ r, g, b }) {
            const srgb = [r, g, b].map(v => {
              const c = v / 255;
              return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
          }
          function contrastRatio(c1, c2) {
            const l1 = relLuminance(c1);
            const l2 = relLuminance(c2);
            return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          }

          const heroEl = document.querySelector('.hero-editorial');
          if (heroEl && isVisible(heroEl)) {
            // Sul punto peggiore dell'immagine (bianco puro #FFFFFF sotto il velo rgba(20,10,38,0.88))
            const worstCaseBgUnderVeil = { r: 48, g: 39, b: 64 }; // bianco #FFF filtrato da rgba(20,10,38,0.88)
            for (const sel of ['.hero-editorial h1', '.hero-editorial .lead-paragraph', '.hero-editorial .kicker', '.hero-meta-strip strong']) {
              const target = document.querySelector(sel);
              if (target && isVisible(target)) {
                const fg = parseRgba(window.getComputedStyle(target).color);
                const ratio = contrastRatio(fg, worstCaseBgUnderVeil);
                if (ratio < 4.5) {
                  errs.push(`[#7 Contrasto Hero Insufficiente] ${sel} rapporto=${ratio.toFixed(2)}:1 (minimo richiesto 4.5:1 sul punto più chiaro della foto)`);
                }
              }
            }
          }

          return {
            errors: errs,
            bodyText: document.body ? document.body.innerText : ''
          };
        }, width);

        allErrors.push(...domCheck.errors.map(e => `${label} -> ${e}`));

        // 8. Controllo spaziatura testo renderizzato
        const spacingErrs = checkTextSpacingErrors(domCheck.bodyText, label);
        allErrors.push(...spacingErrs);

        // 5. Verifica che gli elementi fissi si nascondano quando un input ha il focus
        const hasInput = await page.locator('input:visible').count();
        if (hasInput > 0) {
          await page.locator('input:visible').first().focus();
          await page.waitForTimeout(50);
          const fixedHiddenDuringFocus = await page.evaluate(() => {
            if (!document.body.classList.contains('is-editing-field')) return false;
            const bar = document.querySelector('.mobile-action-bar');
            if (bar && window.getComputedStyle(bar).display !== 'none') return false;
            return true;
          });
          if (!fixedHiddenDuringFocus) {
            allErrors.push(`${label} -> [#5 Elementi Fissi] La barra fissa non si è nascosta durante il focus su un campo input`);
          }
          await page.evaluate(() => {
            if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
            document.body.classList.remove('is-editing-field');
            window.scrollTo(0, 0);
          });
          await page.waitForTimeout(150);
        }

        // Riporta sempre lo scroll in cima prima di axe-core e degli screenshot
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(100);

        // 7b. Esegue axe-core per il contrasto colori e accessibilità
        await page.addScriptTag({ content: axeSource });
        const axeResults = await page.evaluate(async () => {
          const res = await window.axe.run(document, {
            runOnly: {
              type: 'rule',
              values: ['color-contrast']
            }
          });
          return res.violations.map(v => ({
            id: v.id,
            nodes: v.nodes.map(n => n.html.slice(0, 90))
          }));
        });
        for (const v of axeResults) {
          allErrors.push(`${label} -> [#7 axe-core ${v.id}] ${v.nodes.join(' | ')}`);
        }

        // Salva gli screenshot per la home in tutte le larghezze (inclusi 390, 1440, 2560 px richiesti)
        if (pageCfg.name === 'home-it') {
          const shotPath = path.join(ARTIFACT_DIR, `after_${width}px.png`);
          await page.screenshot({ path: shotPath, fullPage: false });
        }

        // Se siamo su mobile (width < 1024) e sulla home-it, testiamo anche lo stato aperto del menu a tutto schermo
        if (pageCfg.name === 'home-it' && width === 390) {
          const menuBtn = page.locator('#mobile-menu-open-btn');
          if (await menuBtn.isVisible()) {
            await menuBtn.click();
            await page.waitForTimeout(120);
            const menuOpenOk = await page.evaluate(() => {
              const menu = document.getElementById('mobile-fullscreen-menu');
              return menu && menu.getAttribute('data-open') === 'true' && window.getComputedStyle(menu).display !== 'none';
            });
            if (!menuOpenOk) {
              allErrors.push(`${label} -> [#4 Menu Mobile] Il menu a tutto schermo non si apre correttamente`);
            }
            const menuShot = path.join(ARTIFACT_DIR, `after_390px_menu_open.png`);
            await page.screenshot({ path: menuShot, fullPage: false });
          }
        }

        const pageErrCount = allErrors.filter(e => e.startsWith(label) || e.includes(label)).length;
        reportRows.push({ page: pageCfg.path, width: `${width}px`, status: pageErrCount === 0 ? 'PASS (0 errori)' : `FAIL (${pageErrCount})` });
        await context.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n=== RIEPILOGO MATRICE LARGHEZZE (Playwright + axe-core) ===');
  for (const r of reportRows) {
    console.log(` - ${r.page.padEnd(16)} | ${r.width.padEnd(8)} | ${r.status}`);
  }

  if (allErrors.length > 0) {
    console.error(`\nCONTROLLO FALLITO CON ${allErrors.length} ERRORI:`);
    for (const err of allErrors) {
      console.error('  x', err);
    }
    process.exit(1);
  } else {
    console.log(`\nTUTTI I CONTROLLI SUPERATI CON SUCCESSO (0 errori su tutte le ${reportRows.length} viste e 33 pagine HTML).`);
    process.exit(0);
  }
}

runLayoutChecks().catch(err => {
  console.error('Errore fatale durante check:layout:', err);
  process.exit(1);
});
