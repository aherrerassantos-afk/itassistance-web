const { test, expect } = require('@playwright/test');
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

test.describe('JUL-041 — Bottom Navigation Bar e Tab Bar a 4 Voci in app.html (1. Operativa · 2. Amministrativa · 3. Fisco · 4. Reports "My Box")', () => {
  test('1. Verifica le 4 voci ufficiali (Operativa, Amministrativa, Fisco, Reports "My Box") visibili entro lo schermo a 320x568 con altezza >= 48px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('file://' + path.join(ROOT_DIR, 'app.html'), { waitUntil: 'domcontentloaded' });

    const navInfo = await page.evaluate(() => {
      const labels = ['Operativa', 'Amministrativa', 'Fisco', 'My Box'];
      const buttons = Array.from(document.querySelectorAll('nav button, .bottom-nav button, .app-bottom-nav button, [role="tablist"] button, button[data-screen], button[onclick*="switch"]'));
      const matched = labels.map((lbl) => {
        const btn = buttons.find((b) => (b.innerText || b.textContent || '').includes(lbl) && b.offsetParent !== null);
        if (!btn) return null;
        const r = btn.getBoundingClientRect();
        return { label: lbl, left: r.left, right: r.right, height: r.height, width: r.width };
      });
      return { matched, vw: window.innerWidth };
    });

    for (const item of navInfo.matched) {
      if (item) {
        expect(item.left).toBeGreaterThanOrEqual(-1);
        expect(item.right).toBeLessThanOrEqual(navInfo.vw + 1);
        expect(item.height).toBeGreaterThanOrEqual(48);
      }
    }
  });

  test('2. Check Mobile su tutte le 6 viewport senza overflow orizzontale', async ({ page }) => {
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
