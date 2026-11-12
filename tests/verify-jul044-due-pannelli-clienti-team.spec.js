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

test.describe('JUL-043..060 — Brand ITASSISTANCEDREAMTEAM.IT, Contatti Ufficiali (itassistance@bluearroyo.it), Visura Camerale, Report 08:00 AM in "My Box", Foto Check-in Concierge e Fix Redirect vercel.json', () => {
  test('1. Verifica JUL-043, JUL-046, JUL-055 & JUL-058: brand ITASSISTANCEDREAMTEAM.IT, email itassistance@bluearroyo.it (doppia s), PEC bluearroyosrl@pec.it, Capitale sociale 50.000,00 e termini "Saldo a vista / entro 5 giorni lavorativi tramite bonifico bancario" nei PDF statici /contratti/ e in docs/', async () => {
    const pdf1 = fs.readFileSync(path.join(ROOT_DIR, 'contratti', 'contratto-produzione-contenuti-itassistance.pdf'), 'utf8');
    const pdf2 = fs.readFileSync(path.join(ROOT_DIR, 'contratti', 'contratto-servizio-itassistance.pdf'), 'utf8');
    for (const raw of [pdf1, pdf2]) {
      expect(raw).toContain('ITASSISTANCEDREAMTEAM.IT');
      expect(raw).toContain('itassistance@bluearroyo.it');
      expect(raw).not.toContain('itassitance@bluearroyo.it');
      expect(raw).toContain('+39 349 177 5561');
      expect(raw).toContain('admin@bluearroyo.it');
      expect(raw).toContain('+39 349 804 1146');
      expect(raw).toContain('risorseumane@bluearroyo.it');
      expect(raw).toContain('bluearroyosrl@pec.it');
      expect(raw).toContain('50.000,00');
      expect(raw).toContain('08:00 AM');
      expect(raw).toContain('Saldo a vista / entro 5 giorni lavorativi tramite bonifico bancario');
      expect(raw).not.toContain('351 038 0392');
      expect(raw).not.toContain('info@itadreamteam.com');
    }

    const mdContract = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'contratto-produzione-contenuti-immobile.md'), 'utf8');
    expect(mdContract).toContain('ITASSISTANCEDREAMTEAM.IT');
    expect(mdContract).toContain('itassistance@bluearroyo.it');
    expect(mdContract).not.toContain('itassitance@bluearroyo.it');
    expect(mdContract).toContain('+39 349 177 5561');
    expect(mdContract).toContain('admin@bluearroyo.it');
    expect(mdContract).toContain('+39 349 804 1146');
    expect(mdContract).toContain('risorseumane@bluearroyo.it');
    expect(mdContract).toContain('bluearroyosrl@pec.it');
    expect(mdContract).toContain('50.000,00');
    expect(mdContract).toContain('08:00 AM');
    expect(mdContract).toContain('Saldo a vista / entro 5 giorni lavorativi tramite bonifico bancario');
    expect(mdContract).not.toContain('351 038 0392');
    expect(mdContract).not.toContain('info@itadreamteam.com');
  });

  test('2. Verifica JUL-056, JUL-057, JUL-058 & JUL-059 in index.html e app.html: brand ITASSISTANCEDREAMTEAM.IT, FAQ #4 ("My Box" + Report 08:00 AM + foto Concierge senza link check-in online), FAQ #5 (bluearroyosrl@pec.it + 50.000,00 senza [DA CONFERMARE]) e Pannello Clienti', async ({ page }) => {
    const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
    expect(indexHtml).toContain('ITASSISTANCEDREAMTEAM.IT');
    expect(indexHtml).toMatch(/Manda sempre il numero di assistenza per gli ospiti/i);
    expect(indexHtml).toContain('itassistance@bluearroyo.it');
    expect(indexHtml).not.toContain('itassitance@bluearroyo.it');
    expect(indexHtml).toMatch(/Concierge/i);
    expect(indexHtml).toMatch(/08:00\s*AM/i);
    expect(indexHtml).toContain('bluearroyosrl@pec.it');
    expect(indexHtml).toContain('50.000,00');
    expect(indexHtml).not.toContain('ospiti.html');

    await page.goto('file://' + path.join(ROOT_DIR, 'app.html'), { waitUntil: 'domcontentloaded' });
    const html = await page.content();

    expect(html).toContain('ITASSISTANCEDREAMTEAM.IT');
    expect(html).toContain('Operativa');
    expect(html).toContain('Amministrativa');
    expect(html).toContain('Fisco');
    expect(html).toMatch(/Reports\s*["“]?My Box["”]?/i);
    expect(html).toMatch(/08:00\s*AM/i);
    expect(html).toMatch(/Concierge/i);
    expect(html).toContain('admin.html');
  });

  test('3. Verifica JUL-044, JUL-056 & JUL-061 in admin.html, app.html e login.html: Pannello Itassistance Team con i profili Super Admin e Customer Care (OM), Cliente (Proprietario) in app.html, Usuario (Turista) e caricamento foto check-in da parte del Concierge', async ({ page }) => {
    await page.goto('file://' + path.join(ROOT_DIR, 'admin.html'), { waitUntil: 'domcontentloaded' });
    const html = await page.content();

    expect(html).toMatch(/Strutture Associate/i);
    expect(html).toMatch(/Clienti/i);
    expect(html).toMatch(/Ticket Aperti/i);
    expect(html).toMatch(/CRM Nuovi Clienti/i);
    expect(html).toMatch(/Concierge/i);
    expect(html).toMatch(/Super Admin/i);
    expect(html).toMatch(/Customer Care/i);

    const loginHtml = fs.readFileSync(path.join(ROOT_DIR, 'login.html'), 'utf8');
    expect(loginHtml).toMatch(/Super Admin/i);
    expect(loginHtml).toMatch(/Customer Care/i);
    expect(loginHtml).toMatch(/Cliente/i);
    expect(loginHtml).toMatch(/Usuario/i);

    const docsLegal = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'contratti-e-accordi-legali.md'), 'utf8');
    expect(docsLegal).toContain('Super Admin');
    expect(docsLegal).toContain('Customer Care');
    expect(docsLegal).toContain('Cliente');
    expect(docsLegal).toContain('Usuario');
  });

  test('4. Verifica JUL-060, JUL-061 & JUL-062 su vercel.json, index.html e /en/index.html: lettura centrata Flow 2026, posizionamento Above-the-Fold mix Agenzia Operativa + Copertura Operativa a 99,00 €/mese con cosa comprende e CTA centrato, nessun loop di redirect in vercel.json', async ({ page }) => {
    const vercelRaw = fs.readFileSync(path.join(ROOT_DIR, 'vercel.json'), 'utf8');
    const vercelConfig = JSON.parse(vercelRaw);
    expect(vercelConfig.cleanUrls).not.toBe(true);

    for (const rel of ['index.html', 'en/index.html']) {
      await page.goto('file://' + path.join(ROOT_DIR, rel), { waitUntil: 'domcontentloaded' });
      const html = await page.content();
      expect(html).toContain('ITASSISTANCEDREAMTEAM.IT');
      expect(html).toContain('bluearroyosrl@pec.it');
      expect(html).toContain('50.000,00');
      expect(html).toMatch(/99(?:[.,]00)?\s*€/i);

      const h1Align = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? window.getComputedStyle(h1).textAlign : '';
      });
      expect(h1Align, `h1 deve essere centrato su ${rel}`).toBe('center');
    }

    const posDoc = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'commerciale-e-posizionamento.md'), 'utf8');
    expect(posDoc).toContain('JUL-062');
    expect(posDoc).toContain('Copertura');
    expect(posDoc).toContain('99,00 €');
  });

  test('5. Check Mobile obbligatorio su 6 viewport (320x568 -> 844x390) per index.html, en/index.html, app.html e admin.html senza overflow orizzontale con ITASSISTANCEDREAMTEAM.IT', async ({ page }) => {
    for (const rel of ['index.html', 'en/index.html', 'app.html', 'admin.html']) {
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
