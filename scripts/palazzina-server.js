#!/usr/bin/env node
/**
 * PALAZZINA HOLDING — BLUE ARROYO GROUP
 * Server locale (sola lettura sui progetti + scrittura in coordinamento/inbox-manager.md e data/storico.json)
 * Porta fissa: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const ENV_PATH = path.join(ROOT_DIR, '.env');
const CONFIG_PATH = path.join(ROOT_DIR, 'config', 'progetti.json');
const STORICO_PATH = path.join(ROOT_DIR, 'data', 'storico.json');
const UI_HTML_PATH = path.join(ROOT_DIR, 'palazzina-holding', 'index.html');

function loadEnv() {
  const env = {
    HOLDING_PORT: 3000,
    HOLDING_PASSWORD: 'bluearroyo2026'
  };
  if (fs.existsSync(ENV_PATH)) {
    const lines = fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        env[key] = val;
      }
    }
  }
  return env;
}

const ENV = loadEnv();
const PORT = Number(process.env.HOLDING_PORT || ENV.HOLDING_PORT || 3000);

function formatRomeDateTime(dateObj = new Date()) {
  try {
    return new Intl.DateTimeFormat('it-IT', {
      timeZone: 'Europe/Rome',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj).replace(',', '');
  } catch (e) {
    return dateObj.toISOString().slice(0, 16).replace('T', ' ');
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

function parseChecklistCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    return { valid: false, reason: 'File docs/checklist.csv vuoto' };
  }
  const headers = parseCSVLine(lines[0]);
  const normHeaders = headers.map((h) =>
    h
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
  );

  const idxId = normHeaders.findIndex((h) => h === '#' || h === 'id' || h === 'n');
  const idxFase = normHeaders.findIndex((h) => h.includes('fase'));
  const idxTask = normHeaders.findIndex((h) => h.includes('task') || h.includes('attivita'));
  const idxAgente = normHeaders.findIndex((h) => h.includes('agente') || h.includes('responsabile'));
  const idxInput = normHeaders.findIndex((h) => h.includes('input'));
  const idxOutput = normHeaders.findIndex((h) => h.includes('output'));
  const idxPriorita = normHeaders.findIndex((h) => h.includes('priorita'));
  const idxStato = normHeaders.findIndex((h) => h.includes('stato'));
  const idxNote = normHeaders.findIndex((h) => h.includes('note'));

  if (idxFase === -1 || idxTask === -1 || idxStato === -1) {
    return {
      valid: false,
      reason: `Colonne obbligatorie mancanti in docs/checklist.csv (trovate: ${headers.join(', ')})`
    };
  }

  const tasks = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 3) continue;
    const rawId = idxId >= 0 ? cols[idxId] : String(i);
    const fase = idxFase >= 0 ? cols[idxFase] || 'Fase non specificata' : 'Fase 1';
    const task = idxTask >= 0 ? cols[idxTask] || '' : '';
    const agente = idxAgente >= 0 ? cols[idxAgente] || 'Non assegnato' : 'Non assegnato';
    const input = idxInput >= 0 ? cols[idxInput] || '' : '';
    const output = idxOutput >= 0 ? cols[idxOutput] || '' : '';
    const priorita = idxPriorita >= 0 ? (cols[idxPriorita] || 'P2').toUpperCase() : 'P2';
    const statoRaw = idxStato >= 0 ? cols[idxStato] || 'Da fare' : 'Da fare';
    const note = idxNote >= 0 ? cols[idxNote] || '' : '';

    let statoNorm = 'Da fare';
    const sLower = statoRaw.toLowerCase();
    if (sLower.includes('fatto') || sLower.includes('completat')) {
      statoNorm = 'Fatto';
    } else if (sLower.includes('blocc')) {
      statoNorm = 'Bloccato';
    } else if (sLower.includes('corso') || sLower.includes('progress')) {
      statoNorm = 'In corso';
    }

    const faseMatch = fase.match(/Fase\s*(\d+)/i);
    const faseNum = faseMatch ? Number(faseMatch[1]) : 1;

    tasks.push({
      id: rawId,
      numId: Number(rawId) || i,
      fase,
      faseNum,
      task,
      agente,
      input,
      output,
      priorita,
      stato: statoNorm,
      statoOriginale: statoRaw,
      note
    });
  }

  return { valid: true, headers, tasks };
}

function parseBoardMarkdown(mdText) {
  const agents = [];
  const flussi = [];
  if (!mdText) return { agents, flussi, raw: '' };

  const lines = mdText.split(/\r?\n/);
  let inTable = false;
  let inFlussi = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^##+\s+.*Flussi/i.test(trimmed)) {
      inFlussi = true;
      inTable = false;
      continue;
    }
    if (/^##+\s+/.test(trimmed) && !/Flussi/i.test(trimmed)) {
      inFlussi = false;
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.replace(/\*\*/g, '').trim());
      if (cells.length >= 3) {
        const first = cells[0].toLowerCase();
        if (first.includes('agente') && cells[1].toLowerCase().includes('ruolo')) {
          inTable = true;
          continue;
        }
        if (first.startsWith(':---') || first.startsWith('---')) {
          continue;
        }
        if (inTable) {
          const statoRaw = cells[2] || 'Attivo';
          const isPaused = /pausa|blocc|attesa/i.test(statoRaw);
          agents.push({
            nome: cells[0],
            ruolo: cells[1] || '',
            stato: isPaused ? 'In pausa' : 'Attivo',
            statoDettaglio: statoRaw,
            taskAssegnate: cells[3] || '',
            moduli: cells[4] || ''
          });
        }
      }
    } else if (inFlussi && /^\d+\.\s+/.test(trimmed)) {
      flussi.push(trimmed.replace(/^\d+\.\s+/, '').replace(/\*\*/g, ''));
    }
  }

  return { agents, flussi, raw: mdText };
}

function resolveProjectFile(piano, relPath, simulateMissingFloorId) {
  if (simulateMissingFloorId && piano.id === simulateMissingFloorId) {
    return {
      exists: false,
      usedMirror: false,
      fullPath: path.join(piano.repoPath, relPath),
      repoExists: fs.existsSync(piano.repoPath),
      reason: `Simulazione file mancante attiva per ${piano.nome} (${relPath})`
    };
  }

  const primaryPath = path.join(piano.repoPath, relPath);
  const repoExists = fs.existsSync(piano.repoPath);
  if (fs.existsSync(primaryPath)) {
    return {
      exists: true,
      usedMirror: false,
      fullPath: primaryPath,
      repoExists,
      sourceLabel: 'Repository principale'
    };
  }

  if (piano.mirrorPath) {
    const mirrorFullPath = path.join(piano.mirrorPath, relPath);
    if (fs.existsSync(mirrorFullPath)) {
      return {
        exists: true,
        usedMirror: primaryPath !== mirrorFullPath,
        fullPath: mirrorFullPath,
        primaryPath,
        repoExists,
        sourceLabel: primaryPath !== mirrorFullPath ? 'Mirror Holding locale (in attesa di sync repo)' : 'Repository principale'
      };
    }
  }

  return {
    exists: false,
    usedMirror: false,
    fullPath: primaryPath,
    repoExists,
    reason: repoExists
      ? `File ${relPath} non trovato in ${piano.repoPath}`
      : `Cartella repository ${piano.repoPath} non trovata`
  };
}

function buildPhaseBreakdown(tasks) {
  const phases = [];
  for (let n = 1; n <= 10; n++) {
    const phaseTasks = tasks.filter((t) => t.faseNum === n);
    let label = `Fase ${n}`;
    if (phaseTasks.length > 0) {
      label = phaseTasks[0].fase;
    }
    const tot = phaseTasks.length;
    const fatte = phaseTasks.filter((t) => t.stato === 'Fatto').length;
    const inCorso = phaseTasks.filter((t) => t.stato === 'In corso').length;
    const bloccate = phaseTasks.filter((t) => t.stato === 'Bloccato').length;
    const perc = tot > 0 ? Math.round((fatte / tot) * 100) : 0;
    phases.push({
      numero: n,
      nome: label,
      totale: tot,
      fatte,
      inCorso,
      bloccate,
      percentuale: perc
    });
  }
  return phases;
}

function readFloorData(piano, options = {}) {
  const simulateMissingFloorId = options.simulateMissingFloorId || null;
  const strictRepoOnly = Boolean(options.strictRepoOnly);

  const effectivePiano = strictRepoOnly ? { ...piano, mirrorPath: null } : piano;

  const chkFile = resolveProjectFile(effectivePiano, piano.checklistPath || 'docs/checklist.csv', simulateMissingFloorId);
  const modFile = resolveProjectFile(effectivePiano, piano.modelloEconomicoPath || 'docs/modello-economico.md', simulateMissingFloorId);
  const brdFile = resolveProjectFile(effectivePiano, piano.boardPath || 'coordinamento/BOARD.md', simulateMissingFloorId);
  const inbFile = resolveProjectFile(effectivePiano, piano.inboxPath || 'coordinamento/inbox-manager.md', simulateMissingFloorId);

  const pathDiagnostics = {
    repoPath: piano.repoPath,
    repoExists: fs.existsSync(piano.repoPath),
    hasNativeChecklist: fs.existsSync(path.join(piano.repoPath, piano.checklistPath || 'docs/checklist.csv')),
    usedMirror: chkFile.usedMirror || false,
    sourceLabel: chkFile.sourceLabel || (chkFile.exists ? 'Repository principale' : 'Non disponibile')
  };

  if (!chkFile.exists) {
    return {
      ...piano,
      disponibile: false,
      motivoIndisponibilita: chkFile.reason || `File ${piano.checklistPath} non trovato`,
      pathDiagnostics,
      statoColore: 'giallo',
      statoEtichetta: 'Dati non disponibili',
      percentuale: 0,
      totaleTask: 0,
      fatte: 0,
      inCorso: 0,
      bloccate: 0,
      daFare: 0,
      p1Aperte: 0,
      agentiAttivi: 0,
      agentiInPausa: 0,
      agenti: [],
      flussi: [],
      fasi: [],
      tasks: [],
      modelloEconomico: '',
      inboxRecenti: [],
      ultimoAggiornamento: 'N/D'
    };
  }

  const csvContent = fs.readFileSync(chkFile.fullPath, 'utf8');
  const parsedCSV = parseChecklistCSV(csvContent);
  if (!parsedCSV.valid) {
    return {
      ...piano,
      disponibile: false,
      motivoIndisponibilita: parsedCSV.reason,
      pathDiagnostics,
      statoColore: 'giallo',
      statoEtichetta: 'Colonne non conformi',
      percentuale: 0,
      totaleTask: 0,
      fatte: 0,
      inCorso: 0,
      bloccate: 0,
      daFare: 0,
      p1Aperte: 0,
      agentiAttivi: 0,
      agentiInPausa: 0,
      agenti: [],
      flussi: [],
      fasi: [],
      tasks: [],
      modelloEconomico: '',
      inboxRecenti: [],
      ultimoAggiornamento: 'N/D'
    };
  }

  const tasks = parsedCSV.tasks;
  const totaleTask = tasks.length;
  const fatte = tasks.filter((t) => t.stato === 'Fatto').length;
  const inCorso = tasks.filter((t) => t.stato === 'In corso').length;
  const bloccate = tasks.filter((t) => t.stato === 'Bloccato').length;
  const daFare = tasks.filter((t) => t.stato === 'Da fare').length;
  const p1Aperte = tasks.filter((t) => t.priorita === 'P1' && t.stato !== 'Fatto').length;
  const percentuale = totaleTask > 0 ? Math.round((fatte / totaleTask) * 100) : 0;

  let statoColore = 'verde';
  let statoEtichetta = 'Regolare (Nessun blocco P1)';
  if (bloccate > 0) {
    statoColore = 'rosso';
    statoEtichetta = `${bloccate} Task Bloccate`;
  } else if (p1Aperte > 0) {
    statoColore = 'giallo';
    statoEtichetta = `${p1Aperte} Task P1 Aperte`;
  }

  const boardContent = brdFile.exists ? fs.readFileSync(brdFile.fullPath, 'utf8') : '';
  const parsedBoard = parseBoardMarkdown(boardContent);
  let agenti = parsedBoard.agents;
  if (agenti.length === 0) {
    const uniqueAg = [...new Set(tasks.map((t) => t.agente).filter(Boolean))];
    agenti = uniqueAg.map((nome) => {
      const agTasks = tasks.filter((t) => t.agente === nome);
      const hasBlocked = agTasks.some((t) => t.stato === 'Bloccato');
      return {
        nome,
        ruolo: 'Responsabile Operativo',
        stato: hasBlocked ? 'In pausa' : 'Attivo',
        statoDettaglio: hasBlocked ? 'In pausa su blocco' : 'Attivo',
        taskAssegnate: agTasks.map((t) => `#${t.id}`).join(', '),
        moduli: ''
      };
    });
  }

  const agentiAttivi = agenti.filter((a) => a.stato === 'Attivo').length;
  const agentiInPausa = agenti.filter((a) => a.stato !== 'Attivo').length;

  const modelloEconomico = modFile.exists
    ? fs.readFileSync(modFile.fullPath, 'utf8')
    : 'Documento docs/modello-economico.md non presente.';

  let inboxContent = '';
  let inboxRecenti = [];
  if (inbFile.exists) {
    inboxContent = fs.readFileSync(inbFile.fullPath, 'utf8');
    const blocks = inboxContent
      .split(/\n(?=### \[HOLDING|## \[HOLDING|\[HOLDING)/g)
      .map((b) => b.trim())
      .filter((b) => b.includes('[HOLDING'));
    inboxRecenti = blocks.slice(-10).reverse();
  }

  const mtimes = [chkFile, modFile, brdFile, inbFile]
    .filter((f) => f.exists)
    .map((f) => fs.statSync(f.fullPath).mtimeMs);
  const latestMtime = mtimes.length > 0 ? new Date(Math.max(...mtimes)) : new Date();

  return {
    ...piano,
    disponibile: true,
    motivoIndisponibilita: null,
    pathDiagnostics,
    statoColore,
    statoEtichetta,
    percentuale,
    totaleTask,
    fatte,
    inCorso,
    bloccate,
    daFare,
    p1Aperte,
    agentiAttivi,
    agentiInPausa,
    agenti,
    flussi: parsedBoard.flussi,
    boardRaw: boardContent,
    fasi: buildPhaseBreakdown(tasks),
    tasks,
    modelloEconomico,
    inboxRecenti,
    inboxFullPath: inbFile.fullPath,
    ultimoAggiornamento: formatRomeDateTime(latestMtime)
  };
}

function buildHoldingState(options = {}) {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const sortedPiani = [...(config.piani || [])].sort((a, b) => (b.ordine || b.piano) - (a.ordine || a.piano));
  const floors = sortedPiani.map((p) => readFloorData(p, options));

  const availableFloors = floors.filter((f) => f.disponibile);
  let weightedSum = 0;
  let totalWeight = 0;
  let totaleFatte = 0;
  let totaleInCorso = 0;
  let totaleBloccate = 0;
  let totaleDaFare = 0;
  let totaleTask = 0;

  const allBlocked = [];
  const allDecisions = [];

  for (const f of availableFloors) {
    const w = Number(f.pesoHolding) || 1;
    weightedSum += f.percentuale * w;
    totalWeight += w;
    totaleFatte += f.fatte;
    totaleInCorso += f.inCorso;
    totaleBloccate += f.bloccate;
    totaleDaFare += f.daFare;
    totaleTask += f.totaleTask;

    for (const t of f.tasks) {
      if (t.stato === 'Bloccato') {
        allBlocked.push({
          pianoId: f.id,
          pianoNome: f.nome,
          etichettaPiano: f.etichettaPiano,
          colore: f.colore,
          taskId: t.id,
          fase: t.fase,
          task: t.task,
          agente: t.agente,
          priorita: t.priorita,
          note: t.note
        });
      }
      const combinedText = `${t.task} ${t.note}`.toLowerCase();
      if (
        combinedText.includes('decisione') ||
        combinedText.includes('da approvare') ||
        combinedText.includes('[proposta')
      ) {
        allDecisions.push({
          id: `${f.id}::task-${t.id}`,
          pianoId: f.id,
          pianoNome: f.nome,
          etichettaPiano: f.etichettaPiano,
          colore: f.colore,
          taskId: t.id,
          fase: t.fase,
          titolo: t.task,
          agente: t.agente,
          priorita: t.priorita,
          stato: t.stato,
          note: t.note
        });
      }
    }
  }

  allBlocked.sort((a, b) => {
    if (a.priorita === 'P1' && b.priorita !== 'P1') return -1;
    if (a.priorita !== 'P1' && b.priorita === 'P1') return 1;
    return 0;
  });

  const mediaPonderata = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  let storico = [];
  if (fs.existsSync(STORICO_PATH)) {
    try {
      storico = JSON.parse(fs.readFileSync(STORICO_PATH, 'utf8'));
    } catch (e) {
      storico = [];
    }
  }

  return {
    timestamp: formatRomeDateTime(new Date()),
    holding: {
      ...config.holding,
      mediaPonderata,
      totaleTask,
      totaleFatte,
      totaleInCorso,
      totaleBloccate,
      totaleDaFare,
      top5Blocchi: allBlocked.slice(0, 5),
      decisioniInAttesa: allDecisions,
      sinergie: config.sinergie || []
    },
    piani: floors,
    storico
  };
}

function appendToFloorInbox(piano, formattedEntry) {
  const writtenPaths = [];
  const inboxRel = piano.inboxPath || 'coordinamento/inbox-manager.md';

  // 1. Se la cartella del repository principale esiste, scrive nel suo coordinamento/inbox-manager.md
  if (piano.repoPath && fs.existsSync(piano.repoPath)) {
    try {
      const targetPrimary = path.join(piano.repoPath, inboxRel);
      fs.mkdirSync(path.dirname(targetPrimary), { recursive: true });
      if (!fs.existsSync(targetPrimary)) {
        fs.writeFileSync(
          targetPrimary,
          `# Inbox Manager — ${piano.nome}\n\nRegistro comunicazioni dalla Palazzina Holding.\n`,
          'utf8'
        );
      }
      fs.appendFileSync(targetPrimary, `\n${formattedEntry}\n`, 'utf8');
      writtenPaths.push(targetPrimary);
    } catch (err) {
      // Continua sul mirror se il repo esterno non è scrivibile
    }
  }

  // 2. Scrive anche nel mirror locale se diverso dal primario
  if (piano.mirrorPath) {
    const targetMirror = path.join(piano.mirrorPath, inboxRel);
    if (!writtenPaths.includes(targetMirror)) {
      fs.mkdirSync(path.dirname(targetMirror), { recursive: true });
      if (!fs.existsSync(targetMirror)) {
        fs.writeFileSync(
          targetMirror,
          `# Inbox Manager — ${piano.nome}\n\nRegistro comunicazioni dalla Palazzina Holding.\n`,
          'utf8'
        );
      }
      fs.appendFileSync(targetMirror, `\n${formattedEntry}\n`, 'utf8');
      writtenPaths.push(targetMirror);
    }
  }

  return writtenPaths;
}

function saveStoricoEntry(entry) {
  let storico = [];
  if (fs.existsSync(STORICO_PATH)) {
    try {
      storico = JSON.parse(fs.readFileSync(STORICO_PATH, 'utf8'));
    } catch (e) {
      storico = [];
    }
  }
  storico.unshift(entry);
  fs.mkdirSync(path.dirname(STORICO_PATH), { recursive: true });
  fs.writeFileSync(STORICO_PATH, JSON.stringify(storico, null, 2), 'utf8');
  return storico;
}

// SSE Clients per aggiornamento automatico (watch)
const sseClients = new Set();
function broadcastReload(reason = 'file-change') {
  for (const res of sseClients) {
    try {
      res.write(`data: ${JSON.stringify({ type: 'reload', reason, time: formatRomeDateTime() })}\n\n`);
    } catch (e) {
      sseClients.delete(res);
    }
  }
}

function setupWatchers() {
  const watchedDirs = new Set([
    path.join(ROOT_DIR, 'docs'),
    path.join(ROOT_DIR, 'coordinamento'),
    path.join(ROOT_DIR, 'config'),
    path.join(ROOT_DIR, 'holding-mirrors')
  ]);

  for (const dir of watchedDirs) {
    if (fs.existsSync(dir)) {
      try {
        fs.watch(dir, { recursive: true }, (eventType, filename) => {
          if (filename && !filename.endsWith('.tmp')) {
            broadcastReload(`${eventType}: ${filename}`);
          }
        });
      } catch (e) {
        // Ignora se fs.watch recursive non supportato su una sottocartella
      }
    }
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString('utf8');
      if (body.length > 2 * 1024 * 1024) {
        reject(new Error('Payload troppo grande'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function renderStandaloneChecklistHtml(floor) {
  const rowsHtml = (floor.tasks || [])
    .map(
      (t) => `
      <tr>
        <td class="mono">#${t.id}</td>
        <td>${t.fase}</td>
        <td><strong>${t.task}</strong></td>
        <td><span class="badge">${t.agente}</span></td>
        <td class="mono">${t.priorita}</td>
        <td><span class="status status-${t.stato.toLowerCase().replace(/\s+/g, '-')}">${t.stato}</span></td>
        <td class="note">${t.note || '—'}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Checklist Locale — ${floor.nome} (${floor.etichettaPiano})</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background: #F8FAFC;
      color: #0F172A;
      padding: 24px max(16px, env(safe-area-inset-right)) 48px max(16px, env(safe-area-inset-left));
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-left: 6px solid ${floor.colore};
      border-radius: 15px;
      padding: 24px;
      margin-bottom: 24px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .mono { font-family: 'JetBrains Mono', monospace; font-size: 13px; }
    h1 { margin: 4px 0 8px; font-size: 24px; }
    p { margin: 0; color: #475569; line-height: 1.5; }
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 10px 16px;
      background: ${floor.colore};
      color: #FFFFFF;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 14px;
    }
    .table-wrap {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 15px;
      overflow-x: auto;
    }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th, td { padding: 14px 16px; border-bottom: 1px solid #E2E8F0; font-size: 14px; vertical-align: top; }
    th { background: #F1F5F9; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; color: #475569; }
    .badge { background: #F1F5F9; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
    .status { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .status-fatto { background: #DCFCE7; color: #166534; }
    .status-in-corso { background: #FEF3C7; color: #92400E; }
    .status-bloccato { background: #FEE2E2; color: #991B1B; }
    .note { color: #475569; font-size: 13px; max-width: 360px; overflow-wrap: anywhere; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="mono" style="color:${floor.colore};font-weight:600;">${floor.etichettaPiano} · PORTA LOCALE ${floor.portaChecklist}</div>
        <h1>${floor.nome} — Checklist Operativa</h1>
        <p>${floor.modelloBreve}</p>
      </div>
      <div>
        <a class="btn" href="http://localhost:${PORT}">Torna alla Palazzina Holding (3000)</a>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Fase</th>
            <th>Task</th>
            <th>Responsabile</th>
            <th>Priorita</th>
            <th>Stato</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;
}

// Avvia micro-server per le pagine /checklist sulle porte 3001, 3002, 3003, 3004
function startChecklistPorts() {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    for (const piano of config.piani || []) {
      const pPort = Number(piano.portaChecklist);
      if (!pPort || pPort === PORT) continue;
      const srv = http.createServer((req, res) => {
        const floor = readFloorData(piano);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(renderStandaloneChecklistHtml(floor));
      });
      srv.on('error', () => {
        // Porta già occupata dal server nativo del singolo progetto: ok
      });
      srv.listen(pPort, '127.0.0.1');
    }
  } catch (e) {
    // Ignora errori avvio porte secondarie
  }
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Holding-Password');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // 1. Verifica Password Locale
  if (pathname === '/api/login' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const currentEnv = loadEnv();
      const expected = currentEnv.HOLDING_PASSWORD || 'bluearroyo2026';
      if (body.password === expected) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: true, token: 'holding-local-auth-ok' }));
      }
      res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: false, error: 'Password locale non valida. Controlla il file .env.' }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: false, error: err.message }));
    }
  }

  // 2. Server-Sent Events per live watch
  if (pathname === '/api/events' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    res.write(`data: ${JSON.stringify({ type: 'connected', time: formatRomeDateTime() })}\n\n`);
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // 3. Stato completo della Palazzina Holding
  if (pathname === '/api/state' && req.method === 'GET') {
    try {
      const simulateMissingFloorId = parsedUrl.query.simulateMissing || null;
      const strictRepoOnly = parsedUrl.query.strictRepo === '1';
      const state = buildHoldingState({ simulateMissingFloorId, strictRepoOnly });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(state));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: false, error: err.message }));
    }
  }

  // 4. Invio "Nuova richiesta" (scrive in coordinamento/inbox-manager.md + data/storico.json)
  if (pathname === '/api/request' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { pianoId, titolo, descrizione, priorita, area, allegato } = body;
      if (!titolo || !descrizione) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: false, error: 'Titolo e descrizione sono obbligatori.' }));
      }

      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      const nowStr = formatRomeDateTime(new Date());
      const prio = (priorita || 'P1').toUpperCase();
      const areaLabel = area || 'Generale';
      const allegatoLabel = allegato ? `\n- **Allegato / Riferimento:** ${allegato}` : '';

      const targetFloors =
        pianoId === 'holding' || pianoId === 'tutti'
          ? config.piani
          : config.piani.filter((p) => p.id === pianoId);

      if (targetFloors.length === 0) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: false, error: 'Piano selezionato non trovato.' }));
      }

      const markdownEntry = [
        `### [HOLDING – ${nowStr}] Nuova richiesta: ${titolo.trim()}`,
        `- **Destinatario:** ${pianoId === 'holding' ? 'HOLDING (Tutti i Piani)' : targetFloors.map((f) => f.nome).join(', ')}`,
        `- **Priorità:** ${prio} · **Area:** ${areaLabel}`,
        `- **Descrizione:** ${descrizione.trim()}${allegatoLabel}`,
        `- **Stato:** Da valutare dal Manager`
      ].join('\n');

      const allWrittenFiles = [];
      for (const floor of targetFloors) {
        const written = appendToFloorInbox(floor, markdownEntry);
        allWrittenFiles.push(...written);
      }

      const record = {
        id: `REQ-${Date.now()}`,
        tipo: 'Nuova richiesta',
        dataOra: nowStr,
        pianoId,
        destinatario: pianoId === 'holding' ? 'HOLDING (Tutti i Piani)' : targetFloors.map((f) => f.nome).join(', '),
        titolo: titolo.trim(),
        descrizione: descrizione.trim(),
        priorita: prio,
        area: areaLabel,
        allegato: allegato || '',
        stato: 'Da valutare dal Manager',
        fileAggiornati: allWrittenFiles
      };

      saveStoricoEntry(record);
      broadcastReload('new-request');

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, record, state: buildHoldingState() }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: false, error: err.message }));
    }
  }

  // 5. Invio "Decisione presa" da Julian all'inbox del Manager di quel progetto
  if (pathname === '/api/decision' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { pianoId, taskId, titoloDecisione, esito } = body;
      if (!pianoId || !esito) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: false, error: 'Seleziona una decisione e scrivi l\'esito.' }));
      }

      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      const floor = config.piani.find((p) => p.id === pianoId);
      if (!floor) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: false, error: 'Piano non trovato.' }));
      }

      const nowStr = formatRomeDateTime(new Date());
      const rifTask = taskId ? ` (Task #${taskId})` : '';
      const markdownEntry = [
        `### [HOLDING – ${nowStr}] Decisione presa da Julian${rifTask}: ${titoloDecisione || 'Decisione Direzionale'}`,
        `- **Piano:** ${floor.nome} (${floor.etichettaPiano})`,
        `- **Esito Decisione di Julian:** ${esito.trim()}`,
        `- **Stato:** Da valutare dal Manager (Esecuzione autorizzata)`
      ].join('\n');

      const written = appendToFloorInbox(floor, markdownEntry);
      const record = {
        id: `DEC-${Date.now()}`,
        tipo: 'Decisione presa',
        dataOra: nowStr,
        pianoId: floor.id,
        destinatario: `${floor.nome} (${floor.etichettaPiano})`,
        titolo: `Decisione${rifTask}: ${titoloDecisione || 'Direzione'}`,
        descrizione: esito.trim(),
        priorita: 'P1',
        area: 'Direzione Holding',
        allegato: taskId ? `Task #${taskId}` : '',
        stato: 'Da valutare dal Manager',
        fileAggiornati: written
      };

      saveStoricoEntry(record);
      broadcastReload('decision-recorded');

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, record, state: buildHoldingState() }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: false, error: err.message }));
    }
  }

  // 6. Riordino configurabile dei Piani o Aggiunta 5° Piano
  if (pathname === '/api/floors/reorder' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { floorId, direction } = body;
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      const sorted = [...config.piani].sort((a, b) => (b.ordine || b.piano) - (a.ordine || a.piano));
      const idx = sorted.findIndex((p) => p.id === floorId);
      if (idx !== -1) {
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx >= 0 && swapIdx < sorted.length) {
          const tempOrd = sorted[idx].ordine;
          sorted[idx].ordine = sorted[swapIdx].ordine;
          sorted[swapIdx].ordine = tempOrd;
          config.piani = sorted;
          fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
          broadcastReload('floors-reordered');
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, state: buildHoldingState() }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: false, error: err.message }));
    }
  }

  if (pathname === '/api/floors/add' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { nome, modelloBreve, colore, repoPath, portaChecklist, produzioneUrl } = body;
      if (!nome || !modelloBreve) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: false, error: 'Nome e modello di business sono obbligatori.' }));
      }
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      const nextNum = config.piani.length + 1;
      const maxOrdine = Math.max(0, ...config.piani.map((p) => p.ordine || p.piano || 0));
      const slug = nome.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const port = Number(portaChecklist) || 3000 + nextNum;

      const newFloor = {
        id: `piano-${nextNum}-${slug}`,
        piano: nextNum,
        ordine: maxOrdine + 1,
        etichettaPiano: `PIANO ${nextNum}`,
        nome: nome.trim().toUpperCase(),
        modelloBreve: modelloBreve.trim(),
        colore: colore || '#334155',
        coloreBg: '#F8FAFC',
        coloreBordo: '#CBD5E1',
        repoPath: repoPath ? repoPath.trim() : path.join(ROOT_DIR, 'holding-mirrors', slug),
        mirrorPath: path.join(ROOT_DIR, 'holding-mirrors', slug),
        checklistPath: 'docs/checklist.csv',
        modelloEconomicoPath: 'docs/modello-economico.md',
        boardPath: 'coordinamento/BOARD.md',
        inboxPath: 'coordinamento/inbox-manager.md',
        portaChecklist: port,
        localhostChecklistUrl: `http://localhost:${port}/checklist`,
        produzioneUrl: produzioneUrl || '',
        googleSheetUrl: config.holding.googleSheetMaster,
        pesoHolding: 1.0
      };

      config.piani.push(newFloor);
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
      broadcastReload('floor-added');

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, floor: newFloor, state: buildHoldingState() }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: false, error: err.message }));
    }
  }

  // 7. Pagina /checklist?piano=... anche sulla porta 3000
  if (pathname === '/checklist' && req.method === 'GET') {
    const pianoId = parsedUrl.query.piano || 'piano-4-itassitance';
    const state = buildHoldingState();
    const floor = state.piani.find((p) => p.id === pianoId) || state.piani[0];
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(renderStandaloneChecklistHtml(floor));
  }

  // 8. UI Principale Palazzina Holding
  if (pathname === '/' || pathname === '/index.html') {
    if (fs.existsSync(UI_HTML_PATH)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(UI_HTML_PATH, 'utf8'));
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('File palazzina-holding/index.html non trovato.');
  }

  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: 'Endpoint non trovato' }));
});

setupWatchers();
startChecklistPorts();

function startMainServer(retried = false) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && !retried) {
      try {
        const pids = execSync(`lsof -ti tcp:${PORT}`, { encoding: 'utf8' })
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter((s) => s && Number(s) !== process.pid);
        for (const pid of pids) {
          try {
            process.kill(Number(pid), 'SIGTERM');
          } catch (e) {}
        }
      } catch (e) {}
      setTimeout(() => startMainServer(true), 400);
      return;
    }
    console.error('Errore avvio porta 3000:', err.message);
    process.exit(1);
  });

  server.listen(PORT, '127.0.0.1', () => {
    console.log('================================================================');
    console.log(' PALAZZINA HOLDING — BLUE ARROYO GROUP (SOLO LOCALE)');
    console.log(` URL Dashboard : http://localhost:${PORT}`);
    console.log(' Checklist Piani: 3001 (Toscan), 3002 (SmartsBookings), 3003 (PBA), 3004 (Itassitance)');
    console.log(' Password (.env): configurata in .env (HOLDING_PASSWORD)');
    console.log('================================================================');
  });
}

startMainServer();
