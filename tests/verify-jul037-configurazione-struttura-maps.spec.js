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

test.describe('JUL-037 — Configurazione Struttura Semplificata in app.html: Indirizzo immobile con Google Maps, Etichette Brevi, Rimozione Logo e Sezione Legale/Codici', () => {
  test('1. Verifica documento docs/revisione-adempimenti-legali.md e assenza di seed fittizi e "Sede Operativa" in app.html', async () => {
    const revDocPath = path.join(ROOT_DIR, 'docs', 'revisione-adempimenti-legali.md');
    expect(fs.existsSync(revDocPath)).toBe(true);
    const revDoc = fs.readFileSync(revDocPath, 'utf8');
    expect(revDoc).toContain('Orario check-in');
    expect(revDoc).toContain('Orario check-out');
    expect(revDoc).toContain('Domanda per Julian');

    const appHtml = fs.readFileSync(path.join(ROOT_DIR, 'app.html'), 'utf8');
    expect(appHtml).not.toMatch(/Sede Operativa/i);
    expect(appHtml).not.toMatch(/Orario limite/i);
    expect(appHtml).not.toMatch(/Orario standard/i);
    expect(appHtml).not.toContain('IT048017C2A9B8F3K1');
    expect(appHtml).not.toContain('048017-ALB-0042');
    expect(appHtml).not.toContain('FI048017_HOST01');
    expect(appHtml).not.toContain('WSKEY-QUESTURA-FI-2026-OK');
    expect(appHtml).not.toContain('ROSS1000-FI-048017');
    expect(appHtml.toLowerCase()).not.toContain('prestige living');
  });

  test('2. Verifica UI Configurazione Struttura in app.html: presenza campi essenziali, etichette brevi ("Orario check-in", "Orario check-out") e assenza URL Logo / Codici obbligatori', async ({ page }) => {
    await page.goto('file://' + path.join(ROOT_DIR, 'app.html'), { waitUntil: 'domcontentloaded' });
    const content = await page.content();

    expect(content).toMatch(/Indirizzo/i);
    expect(content).toMatch(/Telefono per coordinamenti operativi/i);
    expect(content).toMatch(/Email per (ricevere )?le fatture/i);
    expect(content).toContain('Orario check-in');
    expect(content).toContain('Orario check-out');
    expect(content).toContain('Lingue');
    expect(content).toContain('Fuso orario');
    expect(content).toContain('Valuta');

    expect(content).not.toContain('URL Logo e Foto copertina struttura');
    expect(content).not.toContain('Codici obbligatori e credenziali istituzionali');
    expect(content).not.toMatch(/Orario limite/i);
    expect(content).not.toMatch(/Orario standard/i);
  });

  test('3. Check Mobile obbligatorio su 6 viewport (320x568 -> 844x390) per app.html', async ({ page }) => {
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
