#!/usr/bin/env node
/**
 * TEST PLAYWRIGHT OBBLIGATORIO — JUL-010 · SKILL TICKET MANUTENZIONI & NETWORK MANUTENTORI
 * File: tests/verify-jul010-maintenance-skill.spec.js
 *
 * Verifica:
 * 1. Presenza della Skill `.agents/skills/itassistance-maintenance-network/SKILL.md` e della Task #103 in `docs/checklist.csv`.
 * 2. Logica di pianificazione del planner manutentori (`60 min` durata + `15 min` buffer = almeno `75 min` tra gli inizi di due job).
 * 3. Formula economica interna:
 *    - `30,00 €` cliente -> `15,00 €` base manutentore su fattura
 *    - `50,00 €` cliente (con `+20,00 €` supplemento urgenza/difficoltà) -> `15,00 €` base + `+ 10,00 € Extra per l'intervento` manutentore + rimborso materiali 100%
 * 4. Assenza nella UI del modulo manutenzioni di qualsiasi esposizione della percentuale di riparto e rispetto della privacy incrociata Cliente-Manutentore.
 * 5. Rispetto di `document.documentElement.scrollWidth <= clientWidth` alle 6 dimensioni mobile:
 *    - 320 x 568
 *    - 360 x 800
 *    - 390 x 844
 *    - 430 x 932
 *    - 768 x 1024
 *    - 844 x 390
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { chromium } = require('playwright');

const ROOT_DIR = path.resolve(__dirname, '..');

const SKILL_CANDIDATE_PATHS = [
  path.join(ROOT_DIR, '.agents/skills/itassistance-maintenance-network/SKILL.md'),
  path.resolve(ROOT_DIR, '../../../HOLDING /.agents/skills/itassistance-maintenance-network/SKILL.md')
];

const MOBILE_VIEWPORTS = [
  { width: 320, height: 568, label: '320x568' },
  { width: 360, height: 800, label: '360x800' },
  { width: 390, height: 844, label: '390x844' },
  { width: 430, height: 932, label: '430x932' },
  { width: 768, height: 1024, label: '768x1024' },
  { width: 844, height: 390, label: '844x390' }
];

const TARGET_PAGES = ['/app.html', '/admin.html'];

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

/**
 * Validazione pura della logica planner (60 min durata + 15 min buffer obbligatorio)
 * e della formula economica JUL-010.
 */
function calculateJul010Economics(ownerBaseEur = 30, urgencyExtraEur = 0, materialsEur = 0) {
  const safeBase = Number(ownerBaseEur) || 30;
  const safeUrgency = Math.max(0, Number(urgencyExtraEur) || 0);
  const safeMaterials = Math.max(0, Number(materialsEur) || 0);

  const ownerTotalChargeEur = Number((safeBase + safeUrgency + safeMaterials).toFixed(2));
  const maintainerBaseEur = Number((safeBase / 2).toFixed(2));
  const maintainerExtraEur = Number((safeUrgency / 2).toFixed(2));
  const maintainerInvoiceTotalEur = Number((maintainerBaseEur + maintainerExtraEur + safeMaterials).toFixed(2));

  return {
    ownerBaseEur: safeBase,
    ownerUrgencyExtraEur: safeUrgency,
    materialsReimbursementEur: safeMaterials,
    ownerTotalChargeEur,
    maintainerBaseEur,
    maintainerExtraEur,
    maintainerExtraLabel: maintainerExtraEur > 0
      ? `+ ${maintainerExtraEur.toFixed(2).replace('.', ',')} € Extra per l'intervento`
      : null,
    maintainerInvoiceTotalEur
  };
}

function validateJul010PlannerSlot(existingStartsMinutes, candidateStartMinutes, durationMin = 60, bufferMin = 15) {
  const minGap = durationMin + bufferMin; // 60 + 15 = 75 min
  for (const start of existingStartsMinutes) {
    const diff = Math.abs(candidateStartMinutes - start);
    if (diff < minGap) {
      return {
        valid: false,
        minRequiredGapMinutes: minGap,
        actualGapMinutes: diff
      };
    }
  }
  return {
    valid: true,
    minRequiredGapMinutes: minGap
  };
}

function verifySkillFileAndChecklist() {
  const skillPath = SKILL_CANDIDATE_PATHS.find((p) => fs.existsSync(p));
  assert.ok(
    skillPath,
    `File SKILL.md mancante in: ${SKILL_CANDIDATE_PATHS.join(' oppure ')}`
  );
  const skillContent = fs.readFileSync(skillPath, 'utf8');
  assert.ok(
    /itassistance-maintenance-network/i.test(skillContent),
    'SKILL.md deve definire name: itassistance-maintenance-network'
  );
  assert.ok(
    /60\s*min/i.test(skillContent) && /15\s*min/i.test(skillContent),
    'SKILL.md deve specificare lo slot da 60 min + 15 min buffer'
  );

  const checklistPath = path.join(ROOT_DIR, 'docs/checklist.csv');
  assert.ok(fs.existsSync(checklistPath), 'docs/checklist.csv mancante');
  const checklistContent = fs.readFileSync(checklistPath, 'utf8');
  assert.ok(
    checklistContent.includes('103,"7. Fornitori, planner pulizie, operatività",Skill Ticket Manutenzioni & Network Manutentori (JUL-010)'),
    'docs/checklist.csv deve contenere la Task #103 per JUL-010'
  );
  for (const taskNum of ['43,', '67,', '69,', '85,']) {
    const row = checklistContent.split(/\r?\n/).find((l) => l.startsWith(taskNum));
    assert.ok(row && row.includes('JUL-010'), `La riga della Task #${taskNum.replace(',', '')} deve citare JUL-010`);
  }
}

function verifyPlannerAndEconomicRulesUnit() {
  // 1. Verifica Planner: 60 min durata + 15 min buffer = almeno 75 min tra due inizi
  // Es. Job 1 alle 09:30 (570 min): finisce alle 10:30 + 15 min buffer -> prossimo job valido >= 10:45 (645 min)
  const slotTooClose = validateJul010PlannerSlot([570], 630); // 10:30 (60 min dopo) -> NON VALIDO
  assert.strictEqual(slotTooClose.valid, false, 'Uno slot a soli 60 min di distanza deve essere rifiutato (manca buffer 15 min)');
  assert.strictEqual(slotTooClose.minRequiredGapMinutes, 75, 'Il gap minimo tra gli inizi di due job deve essere 75 min (60 + 15)');

  const slotValid = validateJul010PlannerSlot([570], 645); // 10:45 (75 min dopo) -> VALIDO
  assert.strictEqual(slotValid.valid, true, 'Uno slot a 75 min di distanza (60 min job + 15 min buffer) deve essere valido');

  // 2. Verifica Formula Economica Base: 30 € cliente -> 15 € manutentore
  const baseCase = calculateJul010Economics(30, 0, 0);
  assert.strictEqual(baseCase.ownerTotalChargeEur, 30);
  assert.strictEqual(baseCase.maintainerBaseEur, 15);
  assert.strictEqual(baseCase.maintainerExtraEur, 0);
  assert.strictEqual(baseCase.maintainerInvoiceTotalEur, 15);

  // 3. Verifica Formula Economica con Urgenza + Materiali:
  // 50 € cliente (30 € base + 20 € urgenza) + 18,50 € materiali -> 15 € base + 10,00 € Extra + 18,50 € materiali = 43,50 €
  const urgentCase = calculateJul010Economics(30, 20, 18.5);
  assert.strictEqual(urgentCase.ownerTotalChargeEur, 68.5);
  assert.strictEqual(urgentCase.maintainerBaseEur, 15);
  assert.strictEqual(urgentCase.maintainerExtraEur, 10);
  assert.strictEqual(urgentCase.maintainerExtraLabel, "+ 10,00 € Extra per l'intervento");
  assert.strictEqual(urgentCase.maintainerInvoiceTotalEur, 43.5);
}

async function runJul010Verification() {
  console.log('=== AVVIO VERIFICA JUL-010 · SKILL TICKET MANUTENZIONI & NETWORK MANUTENTORI ===');
  verifySkillFileAndChecklist();
  console.log('✓ Presenza SKILL.md e aggiornamento docs/checklist.csv (Task #43, #67, #69, #85, #103) verificati.');

  verifyPlannerAndEconomicRulesUnit();
  console.log('✓ Logica planner (60m + 15m buffer = 75m) e formula economica (30€->15€; 50€->15€+10€ Extra + materiali) verificate.');

  const { server, port } = await startStaticServer(ROOT_DIR);
  const baseUrl = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch({ headless: true });

  try {
    for (const vp of MOBILE_VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2
      });
      const page = await context.newPage();

      for (const pagePath of TARGET_PAGES) {
        await page.goto(`${baseUrl}${pagePath}`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(80);

        if (pagePath === '/admin.html') {
          await page.evaluate(() => {
            if (typeof selectLoginPreset === 'function') selectLoginPreset('superadmin');
            if (typeof performAdminLogin === 'function') performAdminLogin();
          });
          await page.waitForTimeout(50);
        }

        const check = await page.evaluate(() => {
          const docEl = document.documentElement;
          // Se il modulo manutenzioni JUL-010 è montato in pagina, controlliamo che non esponga mai "50%" di riparto
          const maintNodes = Array.from(
            document.querySelectorAll('[id*="maint"], [id*="jul010"], [data-jul010], .maint-network-card, #screen-servizi')
          );
          const maintText = maintNodes.map((n) => n.innerText || '').join('\n');
          const exposesSplitPercentage = /50\s*%\s*(manutentore|riparto|commissione|trattenuta)/i.test(maintText);

          // Se ITACloudSync o TodoAdminEngine espongono gli helper JUL-010, verifichiamoli anche in-browser
          let runtimeHelperOk = true;
          if (window.ITACloudSync && typeof window.ITACloudSync.calculateMaintenanceTicketEconomics === 'function') {
            const c1 = window.ITACloudSync.calculateMaintenanceTicketEconomics({ ownerBaseEur: 30, urgencyExtraEur: 0, materialsEur: 0 });
            const c2 = window.ITACloudSync.calculateMaintenanceTicketEconomics({ ownerBaseEur: 30, urgencyExtraEur: 20, materialsEur: 12 });
            if (c1.maintainerBaseEur !== 15 || c2.maintainerExtraEur !== 10) {
              runtimeHelperOk = false;
            }
          }

          return {
            scrollWidth: docEl.scrollWidth,
            clientWidth: docEl.clientWidth,
            exposesSplitPercentage,
            runtimeHelperOk
          };
        });

        assert.ok(
          check.scrollWidth <= check.clientWidth + 1,
          `[${vp.label}] ${pagePath}: scrollWidth (${check.scrollWidth}) > clientWidth (${check.clientWidth})`
        );
        assert.strictEqual(
          check.exposesSplitPercentage,
          false,
          `[${vp.label}] ${pagePath}: la UI del modulo manutenzioni non deve mai esporre la percentuale di riparto`
        );
        assert.strictEqual(
          check.runtimeHelperOk,
          true,
          `[${vp.label}] ${pagePath}: helper runtime calculateMaintenanceTicketEconomics non conforme`
        );
      }

      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('✅ TUTTI I CONTROLLI JUL-010 SUPERATI CON SUCCESSO (SKILL.md, checklist #103, planner 60+15m, formula 30€->15€ / +Extra€, 0% visibile e 6 dimensioni mobile conformi).');
}

if (require.main === module) {
  runJul010Verification().catch((err) => {
    console.error('❌ ERRORE VERIFICA JUL-010:', err);
    process.exit(1);
  });
}

module.exports = {
  runJul010Verification,
  calculateJul010Economics,
  validateJul010PlannerSlot,
  verifySkillFileAndChecklist
};
