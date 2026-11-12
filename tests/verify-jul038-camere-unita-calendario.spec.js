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

test.describe('JUL-038 — Schermata "Camere e Unità" in app.html ridotta a Nome commerciale + Link calendario', () => {
  test('1. Verifica documento docs/revisione-camere-unita.md e pulizia seed / Via dell\'Agnolo da app.html e pagine pubbliche', async () => {
    const docPath = path.join(ROOT_DIR, 'docs', 'revisione-camere-unita.md');
    expect(fs.existsSync(docPath)).toBe(true);
    const docContent = fs.readFileSync(docPath, 'utf8');
    expect(docContent).toContain('Nome commerciale');
    expect(docContent).toContain('Link calendario');
    expect(docContent).toContain('Domanda');

    const filesToCheck = ['app.html', 'index.html', 'en/index.html', 'prezzi.html', 'checkout.html', 'contratto.html'];
    for (const rel of filesToCheck) {
      const html = fs.readFileSync(path.join(ROOT_DIR, rel), 'utf8');
      expect(html, `${rel} non deve contenere Via dell'Agnolo`).not.toMatch(/Via dell['’]Agnolo/i);
      expect(html, `${rel} non deve contenere Sede Operativa`).not.toMatch(/Sede Operativa/i);
    }

    const appHtml = fs.readFileSync(path.join(ROOT_DIR, 'app.html'), 'utf8');
    expect(appHtml).not.toContain('Suite 101 · Santo Spirito');
    expect(appHtml).not.toContain('KEY-101');
    expect(appHtml).not.toContain('KB-9101');
    expect(appHtml).not.toContain('TURNO-11:00-14:00-FI-01');
    expect(appHtml).not.toContain('Duplica questa scheda');
  });

  test('2. Verifica UI Camere e Unità in app.html: presenza di Nome commerciale, Link calendario, Aggiungi un\'altra struttura e Rimuovi, e assenza campi eliminati', async ({ page }) => {
    await page.goto('file://' + path.join(ROOT_DIR, 'app.html'), { waitUntil: 'domcontentloaded' });
    const content = await page.content();

    expect(content).toContain('Nome commerciale');
    expect(content).toContain('Link calendario');
    expect(content).toMatch(/Aggiungi un['’]altra struttura/i);
    expect(content).toContain('Rimuovi');

    expect(content).not.toContain('Dati operativi e collegamento 2. PBA');
    expect(content).not.toContain('Regole di soggiorno e deposito');
    expect(content).not.toContain('Duplica questa scheda');
    expect(content).not.toContain('Gancio armadio');
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
