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

test.describe('JUL-036 — Rimozione Pagamento con Carta / Stripe / Apple Pay e Flusso Esclusivo Pro-Forma in "My Box" + Coda Manuale Admin', () => {
  test('1. Nessuna pagina pubblica contiene riferimenti a Stripe, Apple Pay o pagamento con carta di credito', async () => {
    const pages = ['index.html', 'en/index.html', 'prezzi.html', 'checkout.html', 'contratto.html'];
    for (const rel of pages) {
      const content = fs.readFileSync(path.join(ROOT_DIR, rel), 'utf8');
      expect(content, `${rel} non deve contenere Stripe`).not.toMatch(/stripe/i);
      expect(content, `${rel} non deve contenere Apple Pay`).not.toMatch(/apple\s*pay/i);
      expect(content, `${rel} non deve contenere carta di credito`).not.toMatch(/carta di credito/i);
    }
  });

  test('2. checkout.html mostra il flusso di conferma e apertura area riservata "My Box" senza pagamento con carta', async ({ page }) => {
    await page.goto('file://' + path.join(ROOT_DIR, 'checkout.html'), { waitUntil: 'domcontentloaded' });
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toMatch(/stripe/i);
    expect(bodyText).not.toMatch(/apple\s*pay/i);
    expect(bodyText.toLowerCase()).toContain('pro-forma');
    expect(bodyText.toLowerCase()).toContain('my box');
  });

  test('3. app.html include la sezione "My Box" con il Pro-Forma (documento non fiscale), IBAN [DA CONFERMARE] e conferma pro-forma + admin.html include la coda "Pro-forma confermati da fatturare"', async ({ page }) => {
    const appHtml = fs.readFileSync(path.join(ROOT_DIR, 'app.html'), 'utf8');
    expect(appHtml).toContain('My Box');
    expect(appHtml.toLowerCase()).toContain('pro-forma');
    expect(appHtml.toLowerCase()).toContain('documento non fiscale');
    expect(appHtml).toContain('[DA CONFERMARE]');

    const adminHtml = fs.readFileSync(path.join(ROOT_DIR, 'admin.html'), 'utf8');
    expect(adminHtml.toLowerCase()).toContain('pro-forma');
    expect(adminHtml).toContain('Da fatturare');
    expect(adminHtml).toContain('Fattura emessa');
    expect(adminHtml).toContain('Pagato');
  });

  test('4. Check Mobile obbligatorio su 6 viewport (320x568 -> 844x390) per checkout.html, app.html e admin.html', async ({ page }) => {
    const pagesToCheck = ['checkout.html', 'app.html', 'admin.html'];
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
