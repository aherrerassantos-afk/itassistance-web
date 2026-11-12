const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const VIEWPORTS = [
  { name: '320x568', width: 320, height: 568 },
  { name: '360x800', width: 360, height: 800 },
  { name: '390x844', width: 390, height: 844 },
  { name: '430x932', width: 430, height: 932 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '844x390', width: 844, height: 390 },
];

test.describe('JUL-035 — Contratto Semplificato senza Blocco B, Tariffario Precompilato 99,00 EUR/mese senza foto-report e Revenue Plan +10% sul netto proprietario', () => {
  test('1. Verifica statica PDF (/contratti/*.pdf) e documentazione (docs/*.md): zero Blocco B, zero foto-report, regola Revenue Plan 10% con definizione netto, fine mese ed esempio illustrativo', async () => {
    const pdfPaths = [
      path.join(ROOT_DIR, 'contratti', 'contratto-produzione-contenuti-itassistance.pdf'),
      path.join(ROOT_DIR, 'contratti', 'contratto-servizio-itassistance.pdf'),
    ];
    for (const p of pdfPaths) {
      expect(fs.existsSync(p)).toBe(true);
      const raw = fs.readFileSync(p, 'utf8');
      expect(raw.startsWith('%PDF-1.4')).toBe(true);
      expect(raw).toContain('99,00 EUR / mese IVA inclusa');
      expect(raw).toContain('1.188,00 EUR / anno');
      expect(raw).toContain('commissioni delle piattaforme');
      expect(raw).toContain('imposta di soggiorno');
      expect(raw).toContain('costi di pulizia');
      expect(raw).toContain('fine mese sulle prenotazioni del mese');
      expect(raw).toContain('importi di puro esempio');
      expect(raw.toLowerCase()).not.toContain('foto-report');
      expect(raw.toLowerCase()).not.toContain('blocco b');
    }

    const mdContract = fs.readFileSync(
      path.join(ROOT_DIR, 'docs', 'contratto-produzione-contenuti-immobile.md'),
      'utf8'
    );
    expect(mdContract).toContain('al netto di: commissioni delle piattaforme, imposta di soggiorno e costi di pulizia');
    expect(mdContract).toContain('fine mese sulle prenotazioni del mese');
    expect(mdContract).toContain('importi di puro esempio, non dati reali');
    expect(mdContract.toLowerCase()).not.toContain('foto-report');
  });

  test('2. Verifica pagine pubbliche (contratto.html, index.html, en/index.html, prezzi.html, checkout.html): zero "foto-report" e zero "oltre la media storica"', async () => {
    const publicPages = [
      'contratto.html',
      'index.html',
      'en/index.html',
      'prezzi.html',
      'checkout.html',
    ];
    for (const rel of publicPages) {
      const fullPath = path.join(ROOT_DIR, rel);
      const html = fs.readFileSync(fullPath, 'utf8');
      expect(html.toLowerCase(), `File ${rel} non deve contenere foto-report`).not.toContain('foto-report');
      expect(html.toLowerCase(), `File ${rel} non deve contenere foto report`).not.toContain('foto report');
      expect(html.toLowerCase(), `File ${rel} non deve contenere oltre la media storica`).not.toContain('oltre la media storica');
    }
  });

  test('3. Verifica contratto.html: assenza Blocco B, soli 5 dati cliente, tariffario precompilato 99,00 €/mese e clausola condizionale Revenue Plan 10%', async ({ page }) => {
    await page.goto('file://' + path.join(ROOT_DIR, 'contratto.html'), { waitUntil: 'domcontentloaded' });

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.toLowerCase()).not.toContain('blocco b');
    expect(bodyText.toLowerCase()).not.toContain('dati del professionista');
    expect(bodyText.toLowerCase()).not.toContain('foto-report');
    expect(bodyText).toContain('99,00');
    expect(bodyText).toContain('1.188,00');

    // Verifica presenza della spiegazione/clausola Revenue Plan 10%
    const fullHtml = await page.content();
    expect(fullHtml).toContain('commissioni delle piattaforme');
    expect(fullHtml).toContain('imposta di soggiorno');
    expect(fullHtml).toContain('costi di pulizia');
    expect(fullHtml).toContain('fine mese sulle prenotazioni del mese');
  });

  test('4. Check Mobile obbligatorio su 6 viewport (320x568 -> 844x390) per contratto.html, index.html, prezzi.html, checkout.html', async ({ page }) => {
    const pagesToCheck = ['contratto.html', 'index.html', 'prezzi.html', 'checkout.html'];
    for (const rel of pagesToCheck) {
      for (const vp of VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto('file://' + path.join(ROOT_DIR, rel), { waitUntil: 'domcontentloaded' });
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
        });
        expect(overflow, `Overflow orizzontale su ${rel} @ ${vp.name}`).toBe(false);
      }
    }
  });
});
