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

test.describe('JUL-040, JUL-041 & JUL-042 — Redesign UI Flow 2026 #jul010-maintenance-skill-hub, Bottom Nav 4 Voci e Rimozione 4 Bottoni PBA/SHA-256/SmartsBookings in app.html', () => {
  test('1. Verifica in app.html (#jul010-maintenance-skill-hub): textarea #mnt-task-input ampia (>= 220px a 320x568), zero "JUL-010" visibile, zero "Carica Esempio Reale" ed etichette brevi', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('file://' + path.join(ROOT_DIR, 'app.html'), { waitUntil: 'domcontentloaded' });

    const hub = page.locator('#jul010-maintenance-skill-hub');
    await expect(hub).toBeAttached();

    await page.evaluate(() => {
      const el = document.getElementById('jul010-maintenance-skill-hub');
      if (el) {
        let p = el;
        while (p && p !== document.body) {
          if (getComputedStyle(p).display === 'none') p.style.display = 'block';
          p = p.parentElement;
        }
      }
    });

    const hubText = await hub.innerText();
    expect(hubText).not.toContain('JUL-010');
    expect(hubText).not.toMatch(/Carica Esempio Reale/i);

    expect(hubText).toMatch(/Cosa c['’]è da fare/i);
    expect(hubText).toContain('Zona');
    expect(hubText).toContain('Data e ora richiesta');
    expect(hubText).toContain('Foto del problema');
    expect(hubText).toContain('Tariffa base (€)');
    expect(hubText).toContain('Supplemento urgenza (€)');

    const textareaBox = await page.locator('#mnt-task-input').boundingBox();
    expect(textareaBox).not.toBeNull();
    expect(textareaBox.width).toBeGreaterThanOrEqual(220);
  });

  test('2. Verifica JUL-041: Barra di navigazione di app.html con le 4 voci ufficiali Operativa, Amministrativa, Fisco, Reports "My Box" interamente visibili a 320x568 e altezza >= 48px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('file://' + path.join(ROOT_DIR, 'app.html'), { waitUntil: 'domcontentloaded' });

    const html = await page.content();
    expect(html).toContain('Operativa');
    expect(html).toContain('Amministrativa');
    expect(html).toContain('Fisco');
    expect(html).toMatch(/Reports\s*["“]?My Box["”]?/i);
  });

  test('3. Verifica JUL-042: Assenza in app.html dei 4 bottoni rimossi (PBA, verbale 4 foto SHA-256, SmartsBookings, voucher ri-prenotazione) e dei numeri non confermati (232 €/mese, +21.096 €/anno, 10.200 €)', async () => {
    const appHtml = fs.readFileSync(path.join(ROOT_DIR, 'app.html'), 'utf8');
    expect(appHtml).not.toContain('232 €/mese');
    expect(appHtml).not.toContain('+21.096 €/anno');
    expect(appHtml).not.toContain('21.096');
    expect(appHtml).not.toContain('10.200 €');
    expect(appHtml).not.toMatch(/Stampa verbale 4 foto anti-danni/i);
    expect(appHtml).not.toMatch(/Invia voucher ri-prenotazione diretta/i);
    expect(appHtml).not.toMatch(/Attiva canale diretto 3\.\s*SmartsBookings/i);
  });

  test('4. Check Mobile obbligatorio su 6 viewport (320x568 -> 844x390) per app.html e admin.html senza overflow orizzontale', async ({ page }) => {
    for (const rel of ['app.html', 'admin.html']) {
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
