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

test.describe('JUL-039 & JUL-055 — Eliminazione Passi "Motore e Canali" e "Revenue" e Wizard Configurazione Struttura a 2 Soli Passi in app.html', () => {
  test('1. Verifica statica app.html, cloud-sync.js e docs: assenza di "Motore e Canali", "85%", "15% cashback", "IT60X0306902887100000007480", "12345678.ics", "87654321" e "anti-overbooking"', async () => {
    const revDoc = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'revisione-camere-unita.md'), 'utf8');
    expect(revDoc).toContain('JUL-039');
    expect(revDoc).toContain('JUL-055');
    expect(revDoc).toContain('Passo 1 di 2');
    expect(revDoc).toContain('Passo 2 di 2');

    const appHtml = fs.readFileSync(path.join(ROOT_DIR, 'app.html'), 'utf8');
    expect(appHtml).not.toMatch(/Motore e Canali/i);
    expect(appHtml).not.toMatch(/Passo 3 di 4/i);
    expect(appHtml).not.toMatch(/Passo 4 di 4/i);
    expect(appHtml).not.toMatch(/Passo 3 di 3/i);
    expect(appHtml).not.toContain('IT60X0306902887100000007480');
    expect(appHtml).not.toContain('12345678.ics');
    expect(appHtml).not.toContain('87654321');
    expect(appHtml).not.toMatch(/15%\s*cashback/i);
    expect(appHtml).not.toMatch(/payout\s*85%/i);
    expect(appHtml).not.toMatch(/anti-overbooking/i);
  });

  test('2. Verifica UI Wizard in app.html: presenza di esattamente 2 passi (Passo 1 di 2 · Struttura, Passo 2 di 2 · Camere e Link Calendario)', async ({ page }) => {
    await page.goto('file://' + path.join(ROOT_DIR, 'app.html'), { waitUntil: 'domcontentloaded' });
    const html = await page.content();

    expect(html).toMatch(/Passo 1 di 2/i);
    expect(html).toMatch(/Passo 2 di 2/i);
    expect(html).not.toMatch(/Passo 3 di 3/i);
    expect(html).not.toMatch(/Motore e Canali/i);
  });

  test('3. Check Mobile obbligatorio su 6 viewport (320x568 -> 844x390) per app.html senza overflow orizzontale', async ({ page }) => {
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('file://' + path.join(ROOT_DIR, 'app.html'), { waitUntil: 'domcontentloaded' });
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      });
      expect(overflow, `Overflow orizzontale su app.html @ ${vp.name}`).toBe(false);
    }
  });
});
