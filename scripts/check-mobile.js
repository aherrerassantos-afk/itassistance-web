#!/usr/bin/env node
/**
 * REGOLA BASE PERMANENTE - IL DESIGN NON SI TAGLIA MAI
 * Test automatico obbligatorio: npm run check:mobile
 *
 * Eseguito su tutte le pagine pubbliche e interne, con menu e finestre
 * sia chiusi sia aperti, in ogni lingua (IT, EN) e ruolo disponibile.
 *
 * Dimensioni testate:
 * - 320 x 568
 * - 360 x 800
 * - 390 x 844
 * - 430 x 932
 * - 768 x 1024
 * - 844 x 390 (telefono orizzontale)
 *
 * Motori:
 * - Chromium con profilo telefono Android
 * - WebKit con profilo iPhone
 *
 * Il test fallisce se:
 * 1. document.documentElement.scrollWidth è maggiore di clientWidth.
 * 2. Un elemento visibile ha left < 0 oppure right > larghezza dello schermo, salvo contenuti dentro uno scroller intenzionale.
 * 3. Hamburger, logo o bottoni principali non sono interamente visibili (hamburger >= 48x48px).
 * 4. Un testo o controllo risulta tagliato dal contenitore.
 * 5. Un elemento cliccabile è coperto da un altro.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium, webkit, devices } = require('playwright');

const ROOT_DIR = path.resolve(__dirname, '..');

const VIEWPORTS = [
  { width: 320, height: 568, label: '320x568' },
  { width: 360, height: 800, label: '360x800' },
  { width: 390, height: 844, label: '390x844' },
  { width: 430, height: 932, label: '430x932' },
  { width: 768, height: 1024, label: '768x1024' },
  { width: 844, height: 390, label: '844x390-landscape' }
];

const ENGINES = [
  {
    name: 'chromium-android',
    launcher: chromium,
    profile: {
      userAgent: devices['Pixel 7'] ? devices['Pixel 7'].userAgent : 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2
    }
  },
  {
    name: 'webkit-iphone',
    launcher: webkit,
    profile: {
      userAgent: devices['iPhone 14'] ? devices['iPhone 14'].userAgent : 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2
    }
  }
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

function collectAllPages(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'scripts' || entry.name === 'brand' || entry.name === '_brand' || entry.name === 'merch') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectAllPages(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      if (entry.name.startsWith('google')) continue; // Google verification token file
      const rel = '/' + path.relative(ROOT_DIR, full).replace(/\\/g, '/');
      out.push(rel);
    }
  }
  return out.sort();
}

/**
 * Esegue i 5 controlli obbligatori + verifiche base tecnica dentro il browser per lo stato corrente
 */
async function auditCurrentDOMState(page, stateLabel) {
  return await page.evaluate((label) => {
    const errors = [];
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const docEl = document.documentElement;
    const body = document.body;

    // 0. Verifica Meta Viewport e divieto overflow:hidden su html/body
    const metaVp = document.querySelector('meta[name="viewport"]');
    const vpContent = metaVp ? (metaVp.getAttribute('content') || '') : '';
    if (!vpContent.includes('width=device-width') || !vpContent.includes('initial-scale=1') || !vpContent.includes('viewport-fit=cover')) {
      errors.push(`[Base Tecnica - Viewport] meta viewport non conforme: "${vpContent}"`);
    }
    if (/user-scalable\s*=\s*no/i.test(vpContent) || /maximum-scale\s*=\s*1(\.0)?(\b|$)/i.test(vpContent)) {
      errors.push(`[Vietato - Blocco Zoom] meta viewport blocca lo zoom: "${vpContent}"`);
    }

    const htmlStyle = window.getComputedStyle(docEl);
    const bodyStyle = body ? window.getComputedStyle(body) : null;
    if (htmlStyle.overflowX === 'hidden' || htmlStyle.overflow === 'hidden' || (bodyStyle && (bodyStyle.overflowX === 'hidden' || bodyStyle.overflow === 'hidden'))) {
      errors.push(`[Vietato - Overflow Hidden] html(${htmlStyle.overflowX}) o body(${bodyStyle ? bodyStyle.overflowX : ''}) usa overflow-x: hidden`);
    }

    function isVisible(el) {
      if (!el || el.nodeType !== 1) return false;
      if (el.closest('[hidden], [aria-hidden="true"].skip-link')) return false;
      let dCheck = el;
      while (dCheck && dCheck.nodeType === 1) {
        const parentDetails = dCheck.parentElement ? dCheck.parentElement.closest('details') : null;
        if (!parentDetails) break;
        if (!parentDetails.hasAttribute('open')) {
          const directSummary = parentDetails.querySelector(':scope > summary');
          if (!directSummary || !directSummary.contains(el)) {
            return false;
          }
        }
        dCheck = parentDetails;
      }
      let cur = el;
      while (cur && cur.nodeType === 1) {
        const st = window.getComputedStyle(cur);
        if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(styleOpacity(st)) === 0) {
          return false;
        }
        cur = cur.parentElement;
      }
      const r = el.getBoundingClientRect();
      return r.width > 0.5 && r.height > 0.5;
    }

    function styleOpacity(st) {
      return st.opacity === '' || st.opacity === undefined ? '1' : st.opacity;
    }

    function isInsideIntentionalScroller(el) {
      let cur = el.parentElement;
      while (cur && cur !== body && cur !== docEl) {
        const st = window.getComputedStyle(cur);
        if (
          cur.hasAttribute('data-intentional-scroller') ||
          cur.classList.contains('table-wrap') ||
          cur.classList.contains('intentional-scroller') ||
          st.overflowX === 'auto' ||
          st.overflowX === 'scroll'
        ) {
          const cr = cur.getBoundingClientRect();
          if (cr.left >= -1 && cr.right <= vw + 1) {
            return true;
          }
        }
        cur = cur.parentElement;
      }
      return false;
    }

    function describeEl(el) {
      const tag = el.tagName.toLowerCase();
      const id = el.id ? `#${el.id}` : '';
      const cls = el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
        : '';
      const txt = (el.innerText || el.textContent || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 28);
      return `<${tag}${id}${cls}${txt ? ` "${txt}"` : ''}>`;
    }

    // 1. document.documentElement.scrollWidth > clientWidth
    const scrollW = docEl.scrollWidth;
    const clientW = docEl.clientWidth;
    if (scrollW > clientW + 1) {
      errors.push(`[#1 ScrollWidth > ClientWidth] scrollWidth=${scrollW}px > clientWidth=${clientW}px (vw=${vw}px)`);
    }

    // 2. Ogni elemento visibile con left < 0 oppure right > larghezza schermo (salvo scroller intenzionale)
    const allElements = Array.from(document.querySelectorAll('body *'));
    for (const el of allElements) {
      if (!isVisible(el)) continue;
      if (el.classList.contains('skip-link')) continue;
      if (isInsideIntentionalScroller(el)) continue;

      const r = el.getBoundingClientRect();
      if (r.left < -1 || r.right > vw + 1) {
        errors.push(`[#2 Fuori Schermo] ${describeEl(el)} left=${Math.round(r.left)}px right=${Math.round(r.right)}px (schermo=${vw}px)`);
        if (errors.length > 25) break;
      }
    }

    // 3. Hamburger, logo o bottoni principali interamente visibili
    const criticalSelectors = [
      '.brand-mark', '.brand', '.admin-brand', '.onion-header-brand', '.login-brand',
      '.mobile-menu-toggle', '#mobile-menu-open-btn', '#mobile-menu-close-btn',
      '.header-login-btn', '.hdr-left-action', '.hdr-right-action', '.back-btn', '.back-link',
      '.btn', '.mob-admin-btn', '.bottom-nav-btn'
    ];
    const criticalEls = Array.from(document.querySelectorAll(criticalSelectors.join(', '))).filter(isVisible);
    for (const el of criticalEls) {
      if (isInsideIntentionalScroller(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.left < -0.5 || r.right > vw + 0.5 || r.width < 16 || r.height < 16) {
        errors.push(`[#3 Elemento Principale Non Visibile] ${describeEl(el)} rect=(${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.width)}x${Math.round(r.height)}) su ${vw}x${vh}`);
      }
      // Hamburger deve essere almeno 48x48px
      if (el.matches('.mobile-menu-toggle, #mobile-menu-open-btn, #mobile-menu-close-btn')) {
        if (r.width < 47.5 || r.height < 47.5) {
          errors.push(`[#3 Hamburger < 48x48px] ${describeEl(el)} misura ${Math.round(r.width)}x${Math.round(r.height)}px (minimo richiesto 48x48px)`);
        }
      }
    }

    // 4. Testo o controllo tagliato dal contenitore
    const textAndControlEls = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, p, a, button, .btn, label, .kicker, .eyebrow, .badge, .status-pill, .level-tag, .card, .panel-card, .item-card, .guide-card')
    ).filter(isVisible);

    for (const el of textAndControlEls) {
      if (isInsideIntentionalScroller(el)) continue;
      const st = window.getComputedStyle(el);
      const isControlOrBtn = el.matches('button, .btn, a.btn, .badge, .status-pill, .kicker, .eyebrow, h1, h2, h3');
      // Se un elemento ha overflow-x hidden o clip e il suo scrollWidth supera il clientWidth senza text-overflow: ellipsis intenzionale
      if ((st.overflowX === 'hidden' || st.overflowX === 'clip') && st.textOverflow !== 'ellipsis') {
        if (el.scrollWidth > el.clientWidth + 2) {
          errors.push(`[#4 Testo/Controllo Tagliato] ${describeEl(el)} scrollWidth=${el.scrollWidth}px > clientWidth=${el.clientWidth}px`);
        }
      }
      // Se è un bottone o titolo o badge con white-space: nowrap che esce dal genitore
      if (isControlOrBtn && st.whiteSpace === 'nowrap' && st.textOverflow !== 'ellipsis') {
        if (el.scrollWidth > el.clientWidth + 3) {
          errors.push(`[#4 Controllo Nowrap Tagliato] ${describeEl(el)} scrollWidth=${el.scrollWidth}px > clientWidth=${el.clientWidth}px`);
        }
      }
    }

    // Verifica finestre / pannelli / menu aperti: max-height <= 90dvh (o 100dvh per fullscreen menu con scroll interno) e bottone di chiusura raggiungibile
    const openModals = Array.from(
      document.querySelectorAll('.mobile-fullscreen-menu[data-open="true"], .bottom-sheet-backdrop.open .bottom-sheet, #pba-chat[data-state="open"] .pba-chat__panel')
    ).filter(isVisible);
    for (const modal of openModals) {
      const mr = modal.getBoundingClientRect();
      if (mr.left < -1 || mr.right > vw + 1 || mr.width > vw + 1) {
        errors.push(`[#4 Finestra/Menu Fuori Schermo] ${describeEl(modal)} left=${Math.round(mr.left)} right=${Math.round(mr.right)} su vw=${vw}`);
      }
      if (!modal.classList.contains('mobile-fullscreen-menu')) {
        if (mr.height > vh * 0.92 + 2) {
          errors.push(`[#4 Finestra > 90dvh] ${describeEl(modal)} height=${Math.round(mr.height)}px > 90% di vh(${vh}px)`);
        }
      }
    }

    // 5. Elemento cliccabile coperto da un altro
    // Verifica: (A) tra elementi cliccabili dello stesso contesto (header, hero, card, barra fissa) non devono esserci sovrapposizioni geometriche
    // (B) il widget flottante #pba-chat non deve coprire la barra inferiore fissa o bottoni principali
    const activeModal = document.querySelector('.mobile-fullscreen-menu[data-open="true"], .bottom-sheet-backdrop.open, .login-screen:not(.hidden), #pba-chat[data-state="open"] .pba-chat__panel');
    const clickablesScope = activeModal || document.body;
    const clickables = Array.from(
      clickablesScope.querySelectorAll('a[href], button, input, select, textarea, summary, [role="button"], .btn')
    ).filter(isVisible);

    function rectsOverlap(r1, r2, tol = 2) {
      return !(
        r1.right <= r2.left + tol ||
        r1.left >= r2.right - tol ||
        r1.bottom <= r2.top + tol ||
        r1.top >= r2.bottom - tol
      );
    }

    function isFixedOrSticky(el) {
      let cur = el;
      while (cur && cur !== document.body && cur !== docEl) {
        const pos = window.getComputedStyle(cur).position;
        if (pos === 'fixed' || pos === 'sticky') return cur;
        cur = cur.parentElement;
      }
      return null;
    }

    // 5A. Sovrapposizione tra elementi cliccabili nello stesso piano (entrambi nel flusso oppure nello stesso contenitore fisso)
    for (let i = 0; i < clickables.length; i++) {
      for (let j = i + 1; j < clickables.length; j++) {
        const a = clickables[i];
        const b = clickables[j];
        if (a.contains(b) || b.contains(a)) continue;
        const fixA = isFixedOrSticky(a);
        const fixB = isFixedOrSticky(b);
        if (fixA !== fixB) continue; // Gestito nel controllo 5B/5C tra layer fissi e contenuto
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        if (rectsOverlap(ra, rb, 2)) {
          errors.push(`[#5 Elementi Cliccabili Sovrapposti] ${describeEl(a)} copre/interseca ${describeEl(b)}`);
          break;
        }
      }
    }

    // 5B. Sovrapposizione tra elementi fissi (es. #pba-chat, .mobile-action-bar, .onion-bottom-nav, .mob-admin-bar, header)
    const fixedBars = Array.from(
      document.querySelectorAll('header, .site-header, .navbar, .onion-header, .admin-header, .app-header, .mobile-action-bar, .onion-bottom-nav, .mob-admin-bar, #pba-chat .pba-chat__toggle')
    ).filter(isVisible);
    for (let i = 0; i < fixedBars.length; i++) {
      for (let j = i + 1; j < fixedBars.length; j++) {
        const a = fixedBars[i];
        const b = fixedBars[j];
        if (a.contains(b) || b.contains(a)) continue;
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        if (rectsOverlap(ra, rb, 1)) {
          errors.push(`[#5 Barra/Controllo Fisso Coperto] ${describeEl(a)} si sovrappone a ${describeEl(b)}`);
        }
      }
    }

    // 5C. Hit-test con elementFromPoint sui controlli principali dell'header, del menu aperto o della finestra aperta
    const hitTargets = Array.from(
      (activeModal || document).querySelectorAll(
        '.mobile-menu-toggle, #mobile-menu-open-btn, #mobile-menu-close-btn, .brand, .brand-mark, .header-login-btn, .hdr-left-action, .hdr-right-action, .back-btn, .back-link, .pba-chat__close, .bottom-sheet button'
      )
    ).filter(isVisible);

    for (const target of hitTargets) {
      if (!activeModal && isFixedOrSticky(target) === null) continue;
      const r = target.getBoundingClientRect();
      if (r.top < 0 || r.bottom > vh || r.left < 0 || r.right > vw) continue;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const topEl = document.elementFromPoint(cx, cy);
      if (topEl && !target.contains(topEl) && !topEl.contains(target)) {
        errors.push(`[#5 Controllo Coperto al Click] ${describeEl(target)} è coperto da ${describeEl(topEl)} a (${Math.round(cx)},${Math.round(cy)})`);
      }
    }

    return errors.map(e => `${label} -> ${e}`);
  }, stateLabel);
}

async function runMobileChecks() {
  console.log('=== AVVIO CONTROLLO MOBILE OBBLIGATORIO (npm run check:mobile) ===');
  const allPages = collectAllPages(ROOT_DIR);
  console.log(`Pagine trovate (${allPages.length}):`, allPages.join(', '));

  const { server, port } = await startStaticServer(ROOT_DIR);
  const baseUrl = `http://127.0.0.1:${port}`;
  const allErrors = [];
  let totalChecks = 0;

  try {
    for (const eng of ENGINES) {
      let browser;
      try {
        browser = await eng.launcher.launch({ headless: true });
      } catch (err) {
        console.error(`Impossibile avviare ${eng.name}:`, err.message);
        allErrors.push(`[Engine ${eng.name}] Impossibile avviare il browser: ${err.message}`);
        continue;
      }

      try {
        for (const vp of VIEWPORTS) {
          const context = await browser.newContext({
            ...eng.profile,
            viewport: { width: vp.width, height: vp.height }
          });
          const page = await context.newPage();

          for (const pagePath of allPages) {
            const baseLabel = `[${eng.name}][${vp.label}] ${pagePath}`;
            await page.goto(`${baseUrl}${pagePath}`, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(60);

            // Stato 1: Pagina stato iniziale (menu e finestre chiusi)
            totalChecks++;
            const closedErrs = await auditCurrentDOMState(page, `${baseLabel} (closed)`);
            allErrors.push(...closedErrs);

            // Stato 2: Se presente menu hamburger mobile (#mobile-menu-open-btn o .mobile-menu-toggle), aprilo e controlla
            const menuBtn = page.locator('#mobile-menu-open-btn, .mobile-menu-toggle').first();
            if (await menuBtn.count() > 0 && await menuBtn.isVisible()) {
              await menuBtn.click();
              await page.waitForTimeout(50);
              totalChecks++;
              const menuOpenErrs = await auditCurrentDOMState(page, `${baseLabel} (menu-open)`);
              allErrors.push(...menuOpenErrs);

              // Verifica che il bottone di chiusura e tutte le voci del menu siano raggiungibili tramite scroll verticale
              const menuReachErrs = await page.evaluate((lbl) => {
                const errs = [];
                const menu = document.querySelector('.mobile-fullscreen-menu[data-open="true"]');
                if (!menu) {
                  errs.push(`${lbl} -> [#3 Menu Hamburger] Il menu non risulta aperto dopo il click`);
                  return errs;
                }
                const closeBtn = menu.querySelector('#mobile-menu-close-btn, .mobile-menu-close, button');
                if (!closeBtn) {
                  errs.push(`${lbl} -> [#3 Menu Hamburger] Bottone di chiusura assente nel menu aperto`);
                }
                const links = Array.from(menu.querySelectorAll('a'));
                for (const a of links) {
                  a.scrollIntoView({ block: 'nearest' });
                  const r = a.getBoundingClientRect();
                  if (r.left < -1 || r.right > window.innerWidth + 1 || r.height < 36) {
                    errs.push(`${lbl} -> [#3 Voce Menu Non Raggiungibile] "${a.textContent.trim()}" rect=(${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.width)}x${Math.round(r.height)})`);
                  }
                }
                menu.scrollTop = 0;
                return errs;
              }, `${baseLabel} (menu-open)`);
              allErrors.push(...menuReachErrs);

              const closeBtn = page.locator('#mobile-menu-close-btn, .mobile-menu-close').first();
              if (await closeBtn.count() > 0 && await closeBtn.isVisible()) {
                await closeBtn.click();
                await page.waitForTimeout(40);
              }
            }

            // Stato 3: Se presente widget chat (#pba-chat), testalo aperto sulla home IT/EN
            if (pagePath === '/index.html' || pagePath === '/en/index.html') {
              const chatToggle = page.locator('#pba-chat .pba-chat__toggle').first();
              if (await chatToggle.count() > 0 && await chatToggle.isVisible()) {
                await chatToggle.click();
                await page.waitForTimeout(50);
                totalChecks++;
                const chatErrs = await auditCurrentDOMState(page, `${baseLabel} (chat-open)`);
                allErrors.push(...chatErrs);
                const chatClose = page.locator('#pba-chat .pba-chat__close').first();
                if (await chatClose.count() > 0 && await chatClose.isVisible()) {
                  await chatClose.click();
                  await page.waitForTimeout(40);
                }
              }
            }

            // Stato 4: Pagine multi-lingua / multi-ruolo / multi-finestra
            if (pagePath === '/ospiti.html') {
              // Test lingua EN e Step 2
              await page.evaluate(() => {
                if (typeof setGuestLang === 'function') setGuestLang('en');
              });
              await page.waitForTimeout(30);
              totalChecks++;
              allErrors.push(...(await auditCurrentDOMState(page, `${baseLabel} (lang=en step-1)`)));

              await page.evaluate(() => {
                if (typeof goGuestStep === 'function') goGuestStep(2);
              });
              await page.waitForTimeout(30);
              totalChecks++;
              allErrors.push(...(await auditCurrentDOMState(page, `${baseLabel} (lang=en step-2)`)));

              await page.evaluate(() => {
                if (typeof setGuestLang === 'function') setGuestLang('it');
                if (typeof goGuestStep === 'function') goGuestStep(2);
              });
              await page.waitForTimeout(30);
              totalChecks++;
              allErrors.push(...(await auditCurrentDOMState(page, `${baseLabel} (lang=it step-2)`)));
            }

            if (pagePath === '/checkout.html') {
              for (const step of [2, 3]) {
                await page.evaluate((s) => {
                  if (typeof renderCheckoutStep === 'function') renderCheckoutStep(s);
                }, step);
                await page.waitForTimeout(30);
                totalChecks++;
                allErrors.push(...(await auditCurrentDOMState(page, `${baseLabel} (step-${step})`)));
              }
            }

            if (pagePath === '/app.html') {
              // Finestra Bottom Sheet Cambio Immobile (Ruolo Property Manager Multi-Immobile) aperta
              await page.evaluate(() => {
                if (typeof openPortfolioSheet === 'function') openPortfolioSheet();
              });
              await page.waitForTimeout(40);
              totalChecks++;
              allErrors.push(...(await auditCurrentDOMState(page, `${baseLabel} (portfolio-sheet-open)`)));

              await page.evaluate(() => {
                if (typeof closePortfolioSheet === 'function') closePortfolioSheet();
              });
              await page.waitForTimeout(30);

              // Controlla tutti i livelli principali della Cipolla in app.html
              const appViews = ['ospiti', 'prezzi', 'fisco', 'servizi', 'dettaglio-calendario', 'azione-alloggiati', 'azione-prenotazione', 'azione-guardrail', 'azione-toscan'];
              for (const v of appViews) {
                await page.evaluate((viewName) => {
                  if (typeof navigateToOnion === 'function') navigateToOnion(viewName, { skipHistory: true });
                }, v);
                await page.waitForTimeout(25);
                totalChecks++;
                allErrors.push(...(await auditCurrentDOMState(page, `${baseLabel} (view=${v})`)));
              }
            }

            if (pagePath === '/admin.html') {
              // Stato login screen aperto già testato in (closed); ora effettua login e testa tutti i 4 ruoli e le 6 tab + form aperti
              const roles = ['superadmin', 'hr', 'billing', 'partners'];
              for (const role of roles) {
                await page.evaluate((r) => {
                  if (typeof selectLoginPreset === 'function') selectLoginPreset(r);
                  if (typeof performAdminLogin === 'function') performAdminLogin();
                  if (typeof switchActiveRole === 'function') switchActiveRole(r);
                }, role);
                await page.waitForTimeout(35);
                totalChecks++;
                allErrors.push(...(await auditCurrentDOMState(page, `${baseLabel} (role=${role})`)));
              }

              // Testa tutte le tab di admin + form modali aperti
              const tabs = [
                { tab: 'overview', form: null },
                { tab: 'partners', form: 'form-new-partner' },
                { tab: 'hr', form: 'form-new-hr' },
                { tab: 'fornitori', form: 'form-new-supplier' },
                { tab: 'fatturazione', form: 'form-new-invoice' },
                { tab: 'accounts', form: 'form-new-account' }
              ];
              for (const t of tabs) {
                await page.evaluate((cfg) => {
                  if (typeof switchActiveRole === 'function') switchActiveRole('superadmin');
                  if (typeof switchAdminTab === 'function') switchAdminTab(cfg.tab);
                  if (cfg.form && typeof toggleForm === 'function') {
                    const f = document.getElementById(cfg.form);
                    if (f && f.style.display !== 'block') toggleForm(cfg.form);
                  }
                }, t);
                await page.waitForTimeout(30);
                totalChecks++;
                allErrors.push(...(await auditCurrentDOMState(page, `${baseLabel} (tab=${t.tab}${t.form ? '+form' : ''})`)));
              }
            }
          }

          await context.close();
        }
      } finally {
        await browser.close();
      }
    }
  } finally {
    server.close();
  }

  try {
    fs.writeFileSync('/tmp/check-mobile-report.json', JSON.stringify(allErrors, null, 2));
  } catch (_) {}

  console.log(`\nControlli totali eseguiti: ${totalChecks} (su ${allPages.length} pagine × ${VIEWPORTS.length} dimensioni × ${ENGINES.length} motori + menu/finestre/ruoli/lingue).`);

  if (allErrors.length > 0) {
    // Raggruppa errori unici per leggibilità
    const uniqueErrors = Array.from(new Set(allErrors));
    console.error(`\n❌ TEST FALLITO CON ${allErrors.length} ERRORI (${uniqueErrors.length} tipi unici):`);
    for (const err of uniqueErrors.slice(0, 120)) {
      console.error('  x', err);
    }
    if (uniqueErrors.length > 120) {
      console.error(`  ... e altri ${uniqueErrors.length - 120} errori.`);
    }
    process.exit(1);
  } else {
    console.log('\n✅ TUTTI I TEST MOBILE SUPERATI CON SUCCESSO (0 errori).');
    process.exit(0);
  }
}

runMobileChecks().catch((err) => {
  console.error('Errore fatale durante check:mobile:', err);
  process.exit(1);
});
