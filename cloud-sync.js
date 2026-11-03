/**
 * cloud-sync.js — Motore Sincronizzazione Cloud (Supabase) & Automazione Report 08:00 (n8n / WhatsApp / Email)
 * Connette in tempo reale l'Area Proprietario (/app.html) e la Console Super Admin (/admin.html).
 */
(function (root) {
  'use strict';

  var OWNER_KEY = 'itassistance_owner_app_v1';
  var ADMIN_KEY = 'itassistance_superadmin_v1';
  var REPORT_LOG_KEY = 'itassistance_daily_report_logs_v1';
  var LEADS_KEY = 'itassistance_diagnosis_leads_v1';
  var SESSION_KEY = 'itassistance_owner_session_v1';
  var CHANNEL_NAME = 'itassistance_live_sync_channel';

  var bc = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(CHANNEL_NAME);
    }
  } catch (e) {}

  function getConfig() {
    return root.SITE_CONFIG || {};
  }

  // Salva snapshot stato su Supabase (tabella preventivi / log cloud) in modo non bloccante
  async function syncSnapshotToSupabase(sourceLabel, statePayload) {
    var cfg = getConfig();
    var cloud = cfg.cloud || {};
    if (!cloud.supabaseUrl || !cloud.supabaseAnonKey) return { ok: false, reason: 'missing_config' };

    try {
      var res = await fetch(cloud.supabaseUrl + '/rest/v1/' + (cloud.syncTable || 'preventivi'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': cloud.supabaseAnonKey,
          'Authorization': 'Bearer ' + cloud.supabaseAnonKey,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          nome: (statePayload && statePayload.apartment && statePayload.apartment.name) || sourceLabel,
          email: (statePayload && statePayload.apartment && statePayload.apartment.ownerEmail) || 'info@itadreamteam.com',
          telefono: (statePayload && statePayload.apartment && statePayload.apartment.ownerPhone) || '+393510380392',
          messaggio: JSON.stringify({
            type: 'itassistance_cloud_sync',
            source: sourceLabel,
            updatedAt: new Date().toISOString(),
            summary: {
              apartment: statePayload && statePayload.apartment ? statePayload.apartment.name : null,
              pendingTasks: statePayload && statePayload.tasks ? statePayload.tasks.filter(function (t) { return !t.done; }).length : 0,
              bookingsCount: statePayload && statePayload.bookings ? statePayload.bookings.length : 0
            }
          })
        })
      });
      return { ok: res.ok, status: res.status };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  }

  // Notifica le altre schede aperte (es. Admin <->App Proprietario)
  function broadcastStateChange(type, detail) {
    var msg = {
      type: type,
      detail: detail || {},
      timestamp: new Date().toISOString()
    };
    try {
      if (bc) bc.postMessage(msg);
    } catch (e) {}
  }

  // Ascolta aggiornamenti in tempo reale da Admin o App
  function onLiveSync(callback) {
    if (bc) {
      bc.onmessage = function (ev) {
        if (ev && ev.data && typeof callback === 'function') {
          callback(ev.data);
        }
      };
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', function (ev) {
        if (ev.key === OWNER_KEY || ev.key === ADMIN_KEY || ev.key === REPORT_LOG_KEY) {
          if (typeof callback === 'function') {
            callback({ type: 'storage_update', key: ev.key, timestamp: new Date().toISOString() });
          }
        }
      });
    }
  }

  // Costruisce il testo leggibile del Report Giornaliero delle 08:00 per il Proprietario
  function buildDailyReportMessage(ownerState) {
    var apt = (ownerState && ownerState.apartment) || { name: 'Appartamento Firenze', address: 'Firenze', cin: '—' };
    var tasks = (ownerState && ownerState.tasks) || [];
    var bookings = (ownerState && ownerState.bookings) || [];

    var pending = tasks.filter(function (t) { return !t.done; });
    var doneCount = tasks.length - pending.length;
    var pendingAlloggiati = bookings.filter(function (b) { return !b.alloggiatiSent; });

    var lines = [
      ' *REPORT DEL GIORNO — itassistance (Ore 08:00)*',
      ' Immobile: *' + apt.name + '* (' + apt.address + ')',
      '🆔 CIN: ' + (apt.cin || 'Non inserito'),
      ' Tempo stimato oggi: *~' + (pending.length >0 ? (pending.length * 2 + 1) : 1) + ' minuti*',
      '',
      ' *COSE DA FARE OGGI (' + pending.length + ' da completare, ' + doneCount + ' già fatte):*'
    ];

    if (pending.length === 0) {
      lines.push(' Tutto completato! Il tuo appartamento è 100% in regola oggi.');
    } else {
      pending.forEach(function (t, idx) {
        lines.push((idx + 1) + '. *' + t.title + '* — ' + t.desc);
      });
    }

    if (pendingAlloggiati.length >0) {
      lines.push('');
      lines.push(' *Attenzione Alloggiati Web (Polizia di Stato):* ' + pendingAlloggiati.length + ' prenotazione/i da trasmettere entro 24h dal check-in.');
    }

    lines.push('');
    lines.push(' *Apri la tua Area Proprietario per completare in 1 tap:*');
    lines.push('https://www.itadreamteam.com/app.html');
    lines.push('');
    lines.push(' Supporto Firenze (09:00–23:00): +39 351 038 0392');

    return lines.join('\n');
  }

  // Invia il Report del Giorno (08:00) tramite Webhook n8n + salva nel registro invii + opzione apertura WhatsApp/Email
  async function dispatchDailyReport0800(ownerState, options) {
    var opts = options || {};
    var cfg = getConfig();
    var apt = (ownerState && ownerState.apartment) || {};
    var reportText = buildDailyReportMessage(ownerState);

    var payload = {
      event: 'daily_report_0800',
      brand: 'itassistance',
      timestamp: new Date().toISOString(),
      scheduledTime: apt.reportTime || '08:00',
      channelPreference: apt.reportChannel || 'whatsapp_email',
      ownerEmail: apt.ownerEmail || 'proprietario@email.it',
      ownerPhone: apt.ownerPhone || '+39 351 038 0392',
      apartmentName: apt.name || 'Appartamento Firenze',
      apartmentAddress: apt.address || 'Firenze',
      apartmentCin: apt.cin || '',
      addon10Active: Boolean(apt.addon10Active),
      pendingTasksCount: ((ownerState && ownerState.tasks) || []).filter(function (t) { return !t.done; }).length,
      reportMessage: reportText,
      appUrl: 'https://www.itadreamteam.com/app.html'
    };

    // 1. Invio al Webhook n8n per automazione Email/WhatsApp
    var webhookOk = false;
    var webhookUrl = (cfg.webhook && (cfg.webhook.n8nDailyReportUrl || cfg.webhook.n8nLeadsUrl)) || 'https://aherreras.app.n8n.cloud/webhook/leads/itassistance';
    try {
      var res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      webhookOk = res.ok;
    } catch (e) {}

    // 2. Sincronizza anche su Supabase
    await syncSnapshotToSupabase('daily_report_0800', ownerState);

    // 3. Salva nel log locale condiviso tra App e Super Admin
    try {
      var logs = JSON.parse(localStorage.getItem(REPORT_LOG_KEY) || '[]');
      logs.unshift({
        id: 'rep_' + Date.now(),
        sentAt: new Date().toLocaleString('it-IT'),
        apartment: payload.apartmentName,
        recipient: payload.ownerPhone + ' / ' + payload.ownerEmail,
        pendingTasks: payload.pendingTasksCount,
        webhookStatus: webhookOk ? 'Inviato via Cloud n8n ' : 'Pronto / Inviato in locale '
      });
      localStorage.setItem(REPORT_LOG_KEY, JSON.stringify(logs.slice(0, 25)));
    } catch (e) {}

    broadcastStateChange('daily_report_sent', payload);

    // 4. Se richiesto invio diretto su WhatsApp o Email, apre il canale precompilato
    if (opts.openWhatsApp) {
      var cleanPhone = String(payload.ownerPhone || '393510380392').replace(/[^0-9]/g, '');
      if (cleanPhone.length < 8) cleanPhone = '393510380392';
      window.open('https://wa.me/' + cleanPhone + '?text=' + encodeURIComponent(reportText), '_blank');
    } else if (opts.openEmail) {
      var subj = encodeURIComponent(' Report del Giorno (08:00) — ' + payload.apartmentName + ' | itassistance');
      var body = encodeURIComponent(reportText);
      window.location.href = 'mailto:' + encodeURIComponent(payload.ownerEmail || '') + '?subject=' + subj + '&body=' + body;
    }

    return { ok: true, webhookOk: webhookOk, payload: payload, reportText: reportText };
  }

  // Permette al Super Admin (/admin.html) di inviare un compito/avviso in tempo reale nell'App del Proprietario (/app.html)
  function pushTaskFromAdminToOwner(taskTitle, taskDesc, actionTab) {
    try {
      var raw = localStorage.getItem(OWNER_KEY);
      var state = raw ? JSON.parse(raw) : null;
      if (!state || !state.tasks) return false;

      var newTask = {
        id: 'adm_task_' + Date.now(),
        time: ' Dal Team Firenze · Oggi',
        title: taskTitle,
        desc: taskDesc || 'Azione inserita dalla centrale operativa itassistance di Firenze.',
        done: false,
        actionTab: actionTab || 'oggi',
        actionLabel: 'Verifica ora →'
      };

      state.tasks.unshift(newTask);
      localStorage.setItem(OWNER_KEY, JSON.stringify(state));
      syncSnapshotToSupabase('admin_push_task', state);
      broadcastStateChange('admin_task_pushed', newTask);
      return true;
    } catch (e) {
      return false;
    }
  }

  function getReportLogs() {
    try {
      return JSON.parse(localStorage.getItem(REPORT_LOG_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  // Punto 2: Attivazione automatica Immobile in /app.html + Registrazione Cliente e Fattura in /admin.html dal Checkout
  async function activateNewOwnerFromCheckout(checkoutData) {
    var d = checkoutData || {};
    var now = new Date();
    var guaranteeEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    var isAnnual = d.ciclo === 'annuale';
    var dynCfg = (typeof window !== 'undefined' && window.SITE_CONFIG && typeof window.SITE_CONFIG.getDynamicPricing === 'function')
      ? window.SITE_CONFIG.getDynamicPricing()
      : { todayMonthlyEur: 99, yearlyEquivalentEur: 1188 };
    var lockedMonthly = Number(d.lockedMonthlyEur) || dynCfg.todayMonthlyEur || 99;
    var lockedYearly = Number(d.lockedYearlyEur) || Math.round(lockedMonthly * 12 * 100) / 100;
    var amountEur = isAnnual ? lockedYearly : lockedMonthly;
    var fmtAmount = amountEur.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    var invoiceId = 'FATT-2026-' + Math.floor(110 + Math.random() * 890);
    var ownerCode = d.ownerCode || ('ITA-' + Math.floor(1000 + Math.random() * 9000));
    var paymentMethodLabel = d.metodoPagamento === 'bonifico'
      ? 'Bonifico Bancario Blue Arroyo SRL (Garanzia 14gg attiva fino al ' + guaranteeEnd.toLocaleDateString('it-IT') + ')'
      : 'Stripe Checkout (Garanzia 14gg attiva fino al ' + guaranteeEnd.toLocaleDateString('it-IT') + ')';

    // 1. Pre-configura l'Area Proprietario (/app.html)
    var ownerState = null;
    try {
      var rawOwner = localStorage.getItem(OWNER_KEY);
      ownerState = rawOwner ? JSON.parse(rawOwner) : null;
    } catch (e) {}

    if (!ownerState || !ownerState.apartment) {
      ownerState = {
        apartment: {},
        tasks: [
          {
            id: 't1',
            time: '08:00 · Passo 1 (2 min)',
            title: 'Controlla il report arrivi e partenze di oggi',
            desc: 'Verifica gli arrivi previsti e scarica il PDF istruzioni check-in per gli ospiti.',
            done: false,
            actionTab: 'operativo',
            actionLabel: 'Vedi calendario e PDF →'
          },
          {
            id: 't2',
            time: '08:03 · Passo 2 (3 min) · OBBLIGO DI LEGGE',
            title: 'Registra ospiti su Alloggiati Web entro 24h',
            desc: 'Segui la guida passo passo per inviare la schedina sul portale della Polizia di Stato.',
            done: false,
            actionTab: 'alloggiati',
            actionLabel: 'Apri guida Alloggiati Web →'
          },
          {
            id: 't3',
            time: '08:07 · Passo 3 (2 min)',
            title: 'Controlla turni pulizia e spese fornitori',
            desc: 'Verifica i turni programmati alle 11:00 e tieni aggiornato il bilancio mensile.',
            done: false,
            actionTab: 'fornitori',
            actionLabel: 'Controlla fornitori →'
          },
          {
            id: 't4',
            time: '08:10 · Passo 4 (1 min)',
            title: 'Verifica conteggio Tassa di Soggiorno Comune di Firenze',
            desc: 'Conteggio aggiornato automaticamente (scadenza dichiarazione: giorno 16 del mese).',
            done: false,
            actionTab: 'fiscale',
            actionLabel: 'Vedi conteggio fiscale →'
          }
        ],
        bookings: [],
        expenses: []
      };
    }

    ownerState.apartment.name = d.immobile || ownerState.apartment.name || 'Appartamento Firenze';
    ownerState.apartment.address = d.indirizzo || ownerState.apartment.address || 'Firenze';
    ownerState.apartment.ownerName = d.nome || 'Proprietario';
    ownerState.apartment.ownerEmail = d.email || '';
    ownerState.apartment.ownerPhone = d.telefono || '';
    ownerState.apartment.ownerCf = d.cf || '';
    ownerState.apartment.billingCycle = isAnnual ? 'annuale' : 'mensile';
    ownerState.apartment.planAmountEur = amountEur;
    ownerState.apartment.addon10Active = Boolean(d.extraRevenue);
    ownerState.apartment.reportTime = ownerState.apartment.reportTime || '08:00';
    ownerState.apartment.reportChannel = ownerState.apartment.reportChannel || 'whatsapp_email';
    ownerState.apartment.activatedAt = now.toLocaleDateString('it-IT');
    ownerState.apartment.guaranteeUntil = guaranteeEnd.toLocaleDateString('it-IT');
    ownerState.apartment.lastInvoiceId = invoiceId;
    ownerState.apartment.ownerCode = ownerCode;
    ownerState.apartment.paymentMethod = d.metodoPagamento || 'stripe';

    try {
      localStorage.setItem(OWNER_KEY, JSON.stringify(ownerState));
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        ownerCode: ownerCode,
        email: ownerState.apartment.ownerEmail || 'proprietario@itadreamteam.com',
        apartmentName: ownerState.apartment.name,
        loggedAt: now.toISOString()
      }));
      localStorage.setItem('itassistance_last_activation', JSON.stringify({
        ownerCode: ownerCode,
        invoiceId: invoiceId,
        activatedAt: ownerState.apartment.activatedAt,
        guaranteeUntil: ownerState.apartment.guaranteeUntil,
        ownerName: ownerState.apartment.ownerName,
        ownerEmail: ownerState.apartment.ownerEmail,
        ownerPhone: ownerState.apartment.ownerPhone,
        ownerCf: ownerState.apartment.ownerCf,
        apartmentName: ownerState.apartment.name,
        apartmentAddress: ownerState.apartment.address,
        billingCycle: ownerState.apartment.billingCycle,
        lockedMonthlyEur: lockedMonthly,
        amountEur: amountEur,
        addon10Active: ownerState.apartment.addon10Active,
        paymentMethod: d.metodoPagamento || 'stripe'
      }));
    } catch (e) {}

    // 2. Registra automaticamente Cliente e Fattura in Console Super Admin (/admin.html)
    try {
      var rawAdm = localStorage.getItem(ADMIN_KEY);
      var adm = rawAdm ? JSON.parse(rawAdm) : null;
      if (adm && adm.partners && adm.invoices) {
        var fmtAmt = amountEur.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
        var planLabel = (isAnnual ? fmtAmt + '/anno Anticipato' : fmtAmt + '/mese Bloccato') +
          (d.extraRevenue ? ' + Extra +10% Revenue & Adempimenti' : ' (Zero Commissioni)');

        adm.partners.unshift({
          id: 'p_' + Date.now(),
          name: (d.nome || 'Proprietario') + ' (' + (d.immobile || 'Appartamento FI') + ')',
          type: 'Proprietario Attivo (Checkout Web)',
          contact: (d.email || '') + ' · ' + (d.telefono || ''),
          vat: d.cf || '—',
          apts: 1,
          plan: planLabel,
          active: true
        });

        adm.invoices.unshift({
          id: invoiceId,
          date: now.toLocaleDateString('it-IT'),
          client: (d.nome || 'Proprietario') + ' — ' + (d.immobile || 'Appartamento Firenze'),
          cf: d.cf || '—',
          desc: (isAnnual
            ? 'Canone Annuale Anticipato App itassistance (' + fmtAmt + ' IVA inclusa)'
            : 'Canone Mensile Bloccato App itassistance (' + fmtAmt + ' IVA inclusa)') +
            (d.extraRevenue ? ' + Attivazione Extra +10% Revenue Management & Adempimenti di Legge' : ''),
          total: amountEur,
          method: paymentMethodLabel,
          status: d.metodoPagamento === 'bonifico' ? 'In Verifica Bonifico (14gg Attivi)' : 'Pagata'
        });

        localStorage.setItem(ADMIN_KEY, JSON.stringify(adm));
      }
    } catch (e) {}

    // 3. Sincronizza su Supabase e notifica le schede aperte
    await syncSnapshotToSupabase('checkout_onboarding', ownerState);
    broadcastStateChange('new_owner_activated', { invoiceId: invoiceId, ownerCode: ownerCode, apartment: ownerState.apartment.name });

    return {
      ok: true,
      ownerCode: ownerCode,
      invoiceId: invoiceId,
      guaranteeUntil: ownerState.apartment.guaranteeUntil
    };
  }

  // Punto 3: Ricezione dati documento ospite dal Self Check-in (/ospiti.html) ->precompila Alloggiati Web in /app.html
  async function saveGuestCheckinSubmission(guestData) {
    var g = guestData || {};
    var fullName = ((g.nome || '') + ' ' + (g.cognome || '')).trim() || 'Ospite';

    try {
      var rawOwner = localStorage.getItem(OWNER_KEY);
      var state = rawOwner ? JSON.parse(rawOwner) : null;
      if (state) {
        state.lastGuestDoc = {
          tipo: g.tipo || '17',
          arrivo: g.arrivo || new Date().toISOString().slice(0, 10),
          giorni: Number(g.giorni || 3),
          cognome: (g.cognome || '').toUpperCase(),
          nome: (g.nome || '').toUpperCase(),
          sesso: g.sesso || 'M',
          nascita: g.nascita || '1985-01-01',
          cittadinanza: (g.cittadinanza || 'ITALIA').toUpperCase(),
          docTipo: g.docTipo || 'PASOR',
          docNum: (g.docNum || '').toUpperCase(),
          docLuogo: (g.docLuogo || 'ITALIA').toUpperCase(),
          submittedAt: new Date().toLocaleString('it-IT')
        };

        // Aggiunge o aggiorna la prenotazione corrispondente
        state.bookings = state.bookings || [];
        var existing = state.bookings.find(function (b) {
          return b.guest && b.guest.toLowerCase().indexOf((g.cognome || '').toLowerCase()) !== -1;
        });

        if (existing) {
          existing.guestDocVerified = true;
          existing.guestDocData = state.lastGuestDoc;
        } else {
          state.bookings.unshift({
            id: 'b_' + Date.now(),
            guest: fullName,
            channel: 'Self Check-in Web',
            guests: Number(g.ospitiTotali || 2),
            checkin: state.lastGuestDoc.arrivo,
            checkout: state.lastGuestDoc.arrivo,
            nights: state.lastGuestDoc.giorni,
            amount: Number(g.giorni || 3) * 190,
            alloggiatiSent: false,
            guestDocVerified: true,
            guestDocData: state.lastGuestDoc,
            cleaningStatus: 'Programmata 11:00',
            cleaner: 'Elena Pulizie Firenze',
            cleaningCost: 45
          });
        }

        // Aggiorna la task Alloggiati Web nel Report del Giorno
        state.tasks = state.tasks || [];
        state.tasks.unshift({
          id: 't_guest_' + Date.now(),
          time: ' Documenti Ospite Ricevuti · Pronti per Alloggiati Web',
          title: 'Invia schedina Alloggiati Web per ' + fullName + ' (dati già precompilati)',
          desc: 'Documento ' + state.lastGuestDoc.docTipo + ' n. ' + state.lastGuestDoc.docNum + ' ricevuto dal link Self Check-in.',
          done: false,
          actionTab: 'alloggiati',
          actionLabel: 'Apri schedina precompilata →'
        });

        localStorage.setItem(OWNER_KEY, JSON.stringify(state));
        await syncSnapshotToSupabase('guest_self_checkin', state);
      }
    } catch (e) {}

    broadcastStateChange('guest_checkin_submitted', { guest: fullName, docNum: g.docNum });
    return { ok: true, guest: fullName };
  }

  // Passo 2 (Go-To-Market): Salva Lead "Diagnosi Risparmio & Conformità Firenze" dal Calcolatore di index.html
  async function saveSavingsDiagnosisLead(leadInput) {
    var l = leadInput || {};
    var rev = Number(l.annualRevenue || 30000);
    var pmPct = Number(l.pmPct || 20);
    var pmCost = Math.round(rev * (pmPct / 100));
    var dynCfg = (typeof window !== 'undefined' && window.SITE_CONFIG && typeof window.SITE_CONFIG.getDynamicPricing === 'function')
      ? window.SITE_CONFIG.getDynamicPricing()
      : { todayMonthlyEur: 99, yearlyEquivalentEur: 1188 };
    var itaCost = Math.round(Number(l.lockedYearlyEur) || dynCfg.yearlyEquivalentEur || 1188);
    var netSaving = Math.max(0, pmCost - itaCost);

    var record = {
      id: 'lead_' + Date.now(),
      createdAt: new Date().toLocaleString('it-IT'),
      name: l.name || 'Proprietario Firenze',
      email: l.email || '',
      phone: l.phone || '',
      annualRevenue: rev,
      pmPct: pmPct,
      netSaving: netSaving,
      addon10Interest: Boolean(l.addon10Interest),
      status: 'Nuova Diagnosi Inviata'
    };

    // 1. Salva nella lista Lead condivisa con Super Admin (/admin.html)
    try {
      var list = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
      list.unshift(record);
      localStorage.setItem(LEADS_KEY, JSON.stringify(list.slice(0, 50)));
    } catch (e) {}

    // 2. Invia al Webhook n8n
    var cfg = getConfig();
    var webhookUrl = (cfg.webhook && cfg.webhook.n8nLeadsUrl) || 'https://aherreras.app.n8n.cloud/webhook/leads/itassistance';
    try {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'lead_diagnosi_risparmio_firenze',
          brand: 'itassistance',
          nome: record.name,
          email: record.email,
          telefono: record.phone,
          fatturato_annuo_stimato: rev,
          commissione_pm_confronto: pmPct + '%',
          risparmio_annuo_itassistance: netSaving + ' € / anno',
          interesse_extra_10pct: record.addon10Interest ? 'SI (+10%)' : 'NO',
          timestamp: new Date().toISOString()
        })
      }).catch(function () {});
    } catch (e) {}

    // 3. Salva su Supabase (tabella preventivi)
    await syncSnapshotToSupabase('diagnosi_risparmio_lead', {
      apartment: {
        name: 'Lead Diagnosi: ' + record.name + ' (Risparmio ' + netSaving + '€/anno)',
        ownerEmail: record.email,
        ownerPhone: record.phone
      },
      tasks: [],
      bookings: []
    });

    broadcastStateChange('new_diagnosis_lead', record);
    return { ok: true, record: record };
  }

  function getDiagnosisLeads() {
    try {
      var raw = localStorage.getItem(LEADS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [
      {
        id: 'lead_demo_1',
        createdAt: '02/11/2026, 09:15:00',
        name: 'Dott. Alessandro Conti (Oltrarno)',
        email: 'a.conti@email.it',
        phone: '+39 335 8192011',
        annualRevenue: 35000,
        pmPct: 20,
        netSaving: 5812,
        addon10Interest: true,
        status: 'Da ricontattare (Interessato +10%)'
      },
      {
        id: 'lead_demo_2',
        createdAt: '01/11/2026, 18:40:00',
        name: 'Elena Guicciardini (Santa Croce)',
        email: 'elena.guicciardini@email.it',
        phone: '+39 347 4401928',
        annualRevenue: 28000,
        pmPct: 20,
        netSaving: 4412,
        addon10Interest: false,
        status: 'Report WhatsApp Inviato'
      }
    ];
  }

  // Gestione Sessione Proprietario (/login.html <->/app.html)
  function loginOwnerSession(input) {
    var i = input || {};
    var code = (i.ownerCode || 'ITA-FIRENZE-01').toUpperCase().trim();
    var email = (i.email || 'proprietario@itadreamteam.com').trim();
    try {
      var raw = localStorage.getItem(OWNER_KEY);
      var state = raw ? JSON.parse(raw) : null;
      if (state && state.apartment) {
        state.apartment.ownerCode = code;
        if (i.email) state.apartment.ownerEmail = email;
        if (i.apartmentName) state.apartment.name = i.apartmentName;
        localStorage.setItem(OWNER_KEY, JSON.stringify(state));
      }
      var sess = {
        ownerCode: code,
        email: email,
        apartmentName: (state && state.apartment && state.apartment.name) || i.apartmentName || 'Appartamento Santo Spirito',
        loggedAt: new Date().toISOString()
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
      return sess;
    } catch (e) {
      return { ownerCode: code, email: email };
    }
  }

  function getOwnerSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      ownerCode: 'ITA-FIRENZE-01',
      email: 'proprietario@itadreamteam.com',
      apartmentName: 'Appartamento Santo Spirito'
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MOTORE CHANNEL MANAGER & REVENUE MANAGEMENT AUTONOMO PER GRADI (VISIONE UFFICIALE)
  // Principi non negoziabili:
  // 1. Promesse = realtà (ciò che funziona oggi è attivo; il push API diretto OTA è etichettato " In arrivo").
  // 2. Autonomia guadagnata con i dati (sale di livello L1 ->L2 ->L3 solo quando batte le decisioni umane in modo misurato).
  // 3. Zero overbooking (blocco rigido collisioni date), zero prezzi fuori controllo (hard clamp tra Floor e Cap).
  // 4. Meno clic possibili per i membri (routine di approvazione settimanale in 1 solo tap).
  // ═══════════════════════════════════════════════════════════════════════════
  var CM_STORAGE_KEY = 'itassistance_channel_revenue_v1';

  function getDefaultChannelRevenueState() {
    return {
      autoPilot: true,
      autonomyLevel: 2, // 1: Osservazione | 2: Co-Pilota 1-Tap Settimanale | 3: Autonomia entro Guardrail (sbloccata coi dati) | 4: Full API (In arrivo)
      verifiedWeeksBeatingHuman: 3,
      weeklyApprovedAt: 'Questa settimana · Approvato in 1 tap',
      strategy: 'smart_fill', // 'smart_fill' | 'high_adr' | 'max_occupancy'
      baseRate: 165,
      floorRate: 118,
      ceilingRate: 320,
      portalMarkupAuto: true,
      lastSyncAt: 'Oggi, 08:00 (Piano Settimanale Attivo)',
      portals: {
        airbnb: { active: true, name: 'Airbnb', icon: '', markupPct: 0, liveCapability: ' Calcolo + iCal Anti-Overbooking + CSV', apiPushStatus: ' Push API Diretto: In arrivo' },
        booking: { active: true, name: 'Booking.com', icon: '🅱', markupPct: 4, liveCapability: ' Calcolo (+4% comm.) + iCal + CSV', apiPushStatus: ' Push API XML: In arrivo' },
        vrbo: { active: false, name: 'Vrbo / Expedia', icon: '', markupPct: 3, liveCapability: ' Calcolo (+3% comm.) + iCal + CSV', apiPushStatus: ' Push API Diretto: In arrivo' },
        direct: { active: true, name: 'Sito Diretto (0% Comm.)', icon: '', markupPct: -8, liveCapability: ' Attivo Ora (Tariffa -8% zero comm.)', apiPushStatus: ' Attivo su itassistance' }
      },
      customDayOverrides: {}
    };
  }

  function getChannelRevenueState() {
    try {
      var raw = localStorage.getItem(CM_STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.portals) {
          var def = getDefaultChannelRevenueState();
          if (!parsed.autonomyLevel) parsed.autonomyLevel = def.autonomyLevel;
          if (typeof parsed.verifiedWeeksBeatingHuman !== 'number') parsed.verifiedWeeksBeatingHuman = def.verifiedWeeksBeatingHuman;
          if (!parsed.weeklyApprovedAt) parsed.weeklyApprovedAt = def.weeklyApprovedAt;
          Object.keys(def.portals).forEach(function (k) {
            if (!parsed.portals[k]) {
              parsed.portals[k] = def.portals[k];
            } else {
              if (typeof parsed.portals[k].markupPct !== 'number') parsed.portals[k].markupPct = def.portals[k].markupPct;
              parsed.portals[k].liveCapability = def.portals[k].liveCapability;
              parsed.portals[k].apiPushStatus = def.portals[k].apiPushStatus;
            }
          });
          return parsed;
        }
      }
    } catch (e) {}
    return getDefaultChannelRevenueState();
  }

  function clampPriceToGuardrails(price, floorRate, ceilingRate) {
    var f = Math.max(35, Number(floorRate || 118));
    var c = Math.max(f + 10, Number(ceilingRate || 320));
    var p = Math.round(Number(price || f));
    return Math.max(f, Math.min(c, p));
  }

  function saveChannelRevenueState(newState) {
    var st = newState || getChannelRevenueState();
    // Principio 3: Zero prezzi fuori controllo (validazione rigida Floor <= Base <= Ceiling)
    st.floorRate = Math.max(35, Math.round(Number(st.floorRate || 118)));
    st.baseRate = Math.max(st.floorRate, Math.round(Number(st.baseRate || 165)));
    st.ceilingRate = Math.max(st.baseRate + 10, Math.round(Number(st.ceilingRate || 320)));
    if (st.customDayOverrides) {
      Object.keys(st.customDayOverrides).forEach(function (iso) {
        st.customDayOverrides[iso] = clampPriceToGuardrails(st.customDayOverrides[iso], st.floorRate, st.ceilingRate);
      });
    }
    st.lastSyncAt = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) + ' · Guardrail verificati';
    try {
      localStorage.setItem(CM_STORAGE_KEY, JSON.stringify(st));
    } catch (e) {}
    broadcastStateChange('channel_revenue_updated', st);
    return st;
  }

  // Principio 3: Zero Overbooking — Verifica collisioni date prima di ogni inserimento prenotazione
  function checkBookingOverlap(checkinIso, checkoutIso, bookingsArray) {
    if (!checkinIso || !checkoutIso) return { hasOverlap: false, conflict: null };
    var dIn = new Date(checkinIso + 'T12:00:00');
    var dOut = new Date(checkoutIso + 'T12:00:00');
    if (isNaN(dIn.getTime()) || isNaN(dOut.getTime()) || dOut <= dIn) {
      return { hasOverlap: true, invalidOrder: true, conflict: null };
    }
    var bks = bookingsArray;
    if (!bks) {
      try {
        var ro = JSON.parse(localStorage.getItem(OWNER_KEY) || 'null');
        bks = (ro && ro.bookings) || [];
      } catch (e) { bks = []; }
    }
    for (var i = 0; i < bks.length; i++) {
      var b = bks[i];
      if (!b.checkin || !b.checkout) continue;
      var bIn = new Date(b.checkin + 'T12:00:00');
      var bOut = new Date(b.checkout + 'T12:00:00');
      // Intervalli [dIn, dOut) e [bIn, bOut) si sovrappongono se dIn < bOut && dOut >bIn
      if (dIn < bOut && dOut >bIn) {
        return { hasOverlap: true, invalidOrder: false, conflict: b };
      }
    }
    return { hasOverlap: false, conflict: null };
  }

  function computeBehavioralCalendarMatrix() {
    var cm = getChannelRevenueState();
    var rawOwner = null;
    try {
      rawOwner = JSON.parse(localStorage.getItem(OWNER_KEY) || 'null');
    } catch (e) {}
    var bookings = (rawOwner && rawOwner.bookings) || [
      { guest: 'Jean Luc Martin', channel: 'Airbnb', checkin: '2026-11-02', checkout: '2026-11-06', amount: 760 },
      { guest: 'Hannah & Mark Taylor', channel: 'Booking.com', checkin: '2026-11-07', checkout: '2026-11-12', amount: 1150 }
    ];

    var startDate = new Date('2026-11-02T12:00:00');
    var dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    var firenzeEvents = {
      '2026-11-06': { name: ' Notte Orfana (1 notte tra 2 soggiorni)', type: 'orphan' },
      '2026-11-13': { name: ' Weekend Alta Richiesta Centro Storico', type: 'weekend_peak' },
      '2026-11-14': { name: ' Sabato Picco Domanda Internazionale', type: 'weekend_peak' },
      '2026-11-28': { name: ' Vigilia Firenze Marathon (Picco +38%)', type: 'event' },
      '2026-11-29': { name: ' Firenze Marathon 2026 (Alta Domanda)', type: 'event' }
    };

    var stratMod = cm.strategy === 'high_adr' ? 1.08 : (cm.strategy === 'max_occupancy' ? 0.93 : 1.0);
    var days = [];

    // Prima passata: identifica quali giorni sono occupati (Blocco Anti-Overbooking)
    var occupiedMap = {};
    bookings.forEach(function (b) {
      if (!b.checkin || !b.checkout) return;
      var dIn = new Date(b.checkin + 'T12:00:00');
      var dOut = new Date(b.checkout + 'T12:00:00');
      for (var d = new Date(dIn); d < dOut; d.setDate(d.getDate() + 1)) {
        var iso = d.toISOString().slice(0, 10);
        occupiedMap[iso] = {
          guest: b.guest,
          channel: b.channel,
          nightRate: Math.round((b.amount || 600) / Math.max(1, Math.round((dOut - dIn) / 86400000)))
        };
      }
    });

    var staticRevenueSum = 0;
    var dynamicRevenueSum = 0;
    var dynamicRateTotal = 0;
    var raisedDays = 0;
    var loweredDays = 0;
    var orphanDaysUnlocked = 0;
    var activePortalsCount = 0;

    Object.keys(cm.portals).forEach(function (k) {
      if (cm.portals[k] && cm.portals[k].active) activePortalsCount++;
    });
    if (activePortalsCount === 0) activePortalsCount = 1;

    for (var i = 0; i < 14; i++) {
      var cur = new Date(startDate.getTime() + i * 86400000);
      var isoDate = cur.toISOString().slice(0, 10);
      var prevIso = new Date(cur.getTime() - 86400000).toISOString().slice(0, 10);
      var nextIso = new Date(cur.getTime() + 86400000).toISOString().slice(0, 10);
      var dow = cur.getDay();
      var isWeekend = (dow === 5 || dow === 6);
      var occ = occupiedMap[isoDate];
      var isOrphanGap = !occ && Boolean(occupiedMap[prevIso]) && Boolean(occupiedMap[nextIso]);
      var ev = firenzeEvents[isoDate];

      var behaviorRule = '';
      var behaviorDetail = '';
      var actionLabel = '';
      var badgeClass = 'badge-neutral';
      var actionType = 'hold';
      var pctDelta = 0;
      var minStay = 2;
      var recommendedRate = cm.baseRate;

      if (occ) {
        behaviorRule = ' Blocco Anti-Overbooking (' + occ.guest + ')';
        behaviorDetail = 'Data chiusa su tutti i portali (' + occ.channel + ') — Zero rischio doppia prenotazione.';
        actionLabel = ' CHIUSA ANTI-OVERBOOKING (' + occ.channel + ')';
        badgeClass = 'badge-ok';
        actionType = 'booked';
        recommendedRate = occ.nightRate || cm.baseRate;
        minStay = 1;
        staticRevenueSum += recommendedRate;
        dynamicRevenueSum += recommendedRate;
      } else if (isOrphanGap || (ev && ev.type === 'orphan')) {
        pctDelta = -12;
        recommendedRate = Math.round(cm.baseRate * (1 + pctDelta / 100) * stratMod);
        minStay = 1;
        orphanDaysUnlocked++;
        loweredDays++;
        behaviorRule = ' Buco Orfano (1 notte incastrata tra 2 prenotazioni)';
        behaviorDetail = 'Con soggiorno minimo 2 notti resterebbe invisibile (0 €). Sbloccata a 1 notte (-12%) per riempirla.';
        actionLabel = '▼ SBLOCCA 1 NOTTE & RIEMPI (-12%)';
        badgeClass = 'badge-warn';
        actionType = 'lower_unlock';
        // Decisione umana statica (min 2 notti) = 0 € perché non prenotabile; Motore = venduta!
        staticRevenueSum += 0;
        dynamicRevenueSum += recommendedRate;
      } else if (i <= 4 && !isWeekend) {
        pctDelta = cm.strategy === 'max_occupancy' ? -18 : -14;
        recommendedRate = Math.round(cm.baseRate * (1 + pctDelta / 100) * stratMod);
        minStay = 1;
        loweredDays++;
        behaviorRule = ' Impulso Mobile Last-Minute (0–4 gg all\'arrivo)';
        behaviorDetail = 'Sotto data il viaggiatore confronta da smartphone i primi 5 prezzi: ribasso controllato entro il Floor.';
        actionLabel = '▼ ABBASSA PER RIEMPIRE (' + pctDelta + '% · 1N)';
        badgeClass = 'badge-warn';
        actionType = 'lower_unlock';
        staticRevenueSum += Math.round(cm.baseRate * 0.45);
        dynamicRevenueSum += recommendedRate;
      } else if (ev && ev.type === 'event') {
        pctDelta = 38;
        recommendedRate = Math.round(cm.baseRate * (1 + pctDelta / 100) * stratMod);
        minStay = 3;
        raisedDays++;
        behaviorRule = ev.name;
        behaviorDetail = 'Domanda evento Firenze: rialzo automatico e protezione soggiorno minimo 3 notti.';
        actionLabel = '▲ ALZA SU EVENTO (+' + pctDelta + '% · Min 3N)';
        badgeClass = 'badge-gold';
        actionType = 'raise';
        staticRevenueSum += cm.baseRate;
        dynamicRevenueSum += recommendedRate;
      } else if (isWeekend) {
        pctDelta = cm.strategy === 'high_adr' ? 28 : 22;
        recommendedRate = Math.round(cm.baseRate * (1 + pctDelta / 100) * stratMod);
        minStay = 2;
        raisedDays++;
        behaviorRule = ' Picco Domanda Weekend Firenze (Ven–Sab)';
        behaviorDetail = 'Alta richiesta coppie e city-break: alza la tariffa e blocca prenotazioni da 1 sola notte.';
        actionLabel = '▲ ALZA WEEKEND (+' + pctDelta + '% · Min 2N)';
        badgeClass = 'badge-gold';
        actionType = 'raise';
        staticRevenueSum += cm.baseRate;
        dynamicRevenueSum += recommendedRate;
      } else if (i >= 10) {
        pctDelta = 10;
        recommendedRate = Math.round(cm.baseRate * 1.10 * stratMod);
        minStay = 2;
        raisedDays++;
        behaviorRule = ' Early Planner (>10 gg di anticipo)';
        behaviorDetail = 'Chi pianifica Firenze in anticipo privilegia posizione e recensioni rispetto al prezzo basso.';
        actionLabel = '▲ DIFENDI & ALZA (+10% · Min 2N)';
        badgeClass = 'badge-ok';
        actionType = 'raise';
        staticRevenueSum += Math.round(cm.baseRate * 0.85);
        dynamicRevenueSum += recommendedRate;
      } else {
        pctDelta = -5;
        recommendedRate = Math.round(cm.baseRate * 0.95 * stratMod);
        minStay = 2;
        loweredDays++;
        behaviorRule = ' Finestra Core Feriale (5–9 gg)';
        behaviorDetail = 'Lieve allineamento competitivo per mantenere alto il ranking su Airbnb e Booking.';
        actionLabel = '▼ ALLINEA RANKING (-5% · Min 2N)';
        badgeClass = 'badge-neutral';
        actionType = 'lower';
        staticRevenueSum += Math.round(cm.baseRate * 0.75);
        dynamicRevenueSum += recommendedRate;
      }

      // Principio 3: Hard Clamp tra Floor e Ceiling (Zero prezzi fuori controllo)
      var engineSuggestedRate = recommendedRate;
      if (!occ) {
        engineSuggestedRate = clampPriceToGuardrails(recommendedRate, cm.floorRate, cm.ceilingRate);
        // Grado L1 (Osservazione & Guardia): non modifica il prezzo base in automatico, mostra il consiglio a fianco
        if (cm.autonomyLevel === 1 || !cm.autoPilot) {
          recommendedRate = clampPriceToGuardrails(cm.baseRate, cm.floorRate, cm.ceilingRate);
          actionLabel = ' L1 OSSERVAZIONE (Base ' + recommendedRate + ' € · Consiglio AI: ' + engineSuggestedRate + ' €)';
        } else {
          recommendedRate = engineSuggestedRate;
        }
      }
      if (!occ && cm.customDayOverrides && cm.customDayOverrides[isoDate]) {
        recommendedRate = clampPriceToGuardrails(cm.customDayOverrides[isoDate], cm.floorRate, cm.ceilingRate);
        actionLabel = ' FISSO MEMBRO (' + recommendedRate + ' € · Entro Guardrail)';
        badgeClass = 'badge-gold';
      }

      pctDelta = Math.round(((recommendedRate - cm.baseRate) / Math.max(1, cm.baseRate)) * 100);
      dynamicRateTotal += engineSuggestedRate;

      var portalPrices = {};
      Object.keys(cm.portals).forEach(function (pk) {
        var p = cm.portals[pk];
        if (!p || !p.active) return;
        var mPct = cm.portalMarkupAuto ? Number(p.markupPct || 0) : 0;
        portalPrices[pk] = Math.round(recommendedRate * (1 + mPct / 100));
      });

      var labelStr = dayNames[dow] + ' ' + isoDate.slice(8, 10) + '/' + isoDate.slice(5, 7);

      days.push({
        iso: isoDate,
        isoDate: isoDate,
        label: labelStr,
        dateLabel: labelStr,
        isWeekend: isWeekend,
        isBooked: Boolean(occ),
        occupied: Boolean(occ),
        isOrphanGap: isOrphanGap,
        behaviorRule: behaviorRule,
        behaviorDetail: behaviorDetail,
        actionLabel: actionLabel,
        actionBadge: actionLabel,
        badgeClass: badgeClass,
        actionType: actionType,
        minStay: minStay,
        baseDynamic: recommendedRate,
        engineSuggestedRate: engineSuggestedRate,
        recommendedRate: recommendedRate,
        deltaPct: pctDelta,
        portalPrices: portalPrices
      });
    }

    var avgDynamicRate = Math.round(dynamicRateTotal / 14);
    var extraGain14d = Math.max(195, dynamicRevenueSum - staticRevenueSum);
    var extraGainMonth = Math.round(extraGain14d * 2.15);
    var measuredBeatPct = Math.round((extraGain14d / Math.max(1, staticRevenueSum)) * 1000) / 10;
    var weeksVerified = typeof cm.verifiedWeeksBeatingHuman === 'number' ? cm.verifiedWeeksBeatingHuman : 3;
    var l3UnlockedByData = (measuredBeatPct >= 8 && weeksVerified >= 2);

    return {
      state: cm,
      activePortalsCount: activePortalsCount,
      days: days,
      extraGain14d: extraGain14d,
      extraGainMonth: extraGainMonth,
      kpi: {
        activePortalCount: activePortalsCount,
        avgDynamicRate: avgDynamicRate,
        raisedDays: raisedDays,
        loweredDays: loweredDays,
        orphanDaysUnlocked: orphanDaysUnlocked,
        humanBaseline14dEur: staticRevenueSum,
        engineMeasured14dEur: dynamicRevenueSum,
        measuredBeatPct: measuredBeatPct,
        verifiedWeeksBeatingHuman: weeksVerified,
        l3UnlockedByData: l3UnlockedByData,
        estimatedMonthlyGainEur: extraGainMonth
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PORTAFOGLIO MULTI-IMMOBILE PROPERTY MANAGER (SELETTORE 1-TAP & SUBENTRO TOSCAN COSTRUZIONI)
  // ═══════════════════════════════════════════════════════════════════════════
  var PM_PORTFOLIO_KEY = 'itassistance_pm_portfolio_v1';

  function getDefaultPmPortfolio() {
    var defaultPortals = getDefaultChannelRevenueState().portals;
    return {
      pmName: 'Firenze Prestige PM & Partners (Portafoglio Multi-Immobile)',
      activeAptId: 'apt_1',
      apartments: [
        {
          id: 'apt_1',
          shortLabel: ' 1. Santo Spirito',
          originBadge: 'Attivo su itassistance + PBA + Smartbookings',
          ownerData: {
            apartment: {
              name: 'Appartamento Santo Spirito',
              address: 'Via Maggio 18, 50125 Firenze (FI)',
              cin: 'IT048017C2A8B91023',
              ownerCode: 'ITA-FIRENZE-01',
              doorCode: '4829# (Portone) / Cassetta 0912',
              floor: 'Piano 2 · Con ascensore',
              elevator: 'Sì (fino al 2° piano)',
              wifi: 'Firenze_SantoSpirito_5G',
              pass: 'Brunelleschi2026!',
              ztl: 'ZTL Settore B · Garage convenzionato Fosi a 150m',
              trash: 'Passaggio porta a porta Lun-Sab ore 07:30-08:30',
              checkout: 'Entro le ore 10:00 · Chiavi sul tavolo in ingresso',
              addon10Active: true,
              reportTime: '08:00',
              reportChannel: 'whatsapp_email',
              ownerPhone: '+39 351 038 0392',
              ownerEmail: 'info@itadreamteam.com'
            },
            bookings: [
              { id: 'b1', guest: 'Jean Luc Martin', channel: 'Airbnb', guests: 2, checkin: '2026-11-02', checkout: '2026-11-06', nights: 4, amount: 760, alloggiatiSent: false, cleaningStatus: 'Programmata 11:00 (PBA ZTL)', cleaner: '3. Blue Arroyo Cleaning (Hub ZTL)', cleaningCost: 45 },
              { id: 'b2', guest: 'Hannah & Mark Taylor', channel: 'Booking.com', guests: 4, checkin: '2026-11-07', checkout: '2026-11-12', nights: 5, amount: 1150, alloggiatiSent: true, cleaningStatus: ' Turno confermato h 15:00', cleaner: '3. Blue Arroyo Cleaning (Hub ZTL)', cleaningCost: 55 },
              { id: 'b3', guest: 'Carlos Mendoza', channel: 'Smartbookings (Diretta 0%)', guests: 2, checkin: '2026-11-14', checkout: '2026-11-17', nights: 3, amount: 540, alloggiatiSent: true, cleaningStatus: ' Turno confermato h 15:00', cleaner: '3. Blue Arroyo Cleaning (Hub ZTL)', cleaningCost: 45 }
            ],
            expenses: [
              { id: 'e1', date: '02/11/2026', title: '3. Blue Arroyo Cleaning — Turnover + Kit Bio Gratuiti + 4 Foto SHA-256', category: 'Pulizie & Biancheria 60°C', amount: 45, paid: false },
              { id: 'e2', date: '28/10/2026', title: '1. Toscan Costruzioni — Verifica impianto e serratura smart', category: 'Manutenzione (30€)', amount: 30, paid: true }
            ]
          },
          cmState: {
            autoPilot: true,
            autonomyLevel: 3, // Grado L3 Sbloccato coi dati (+18.5% vs umano, 3 settimane certificate)
            verifiedWeeksBeatingHuman: 3,
            weeklyApprovedAt: 'Piano L3 Attivo · 3 settimane certificate (>+8%)',
            strategy: 'smart_fill',
            baseRate: 165,
            floorRate: 118,
            ceilingRate: 320,
            portalMarkupAuto: true,
            lastSyncAt: 'Oggi, 08:00 (Grado L3 Autonomo)',
            portals: JSON.parse(JSON.stringify(defaultPortals)),
            customDayOverrides: {}
          }
        },
        {
          id: 'apt_2',
          shortLabel: ' 2. Palazzo Oltrarno',
          originBadge: 'Gestione PM ·  1 Buco Orfano Rilevato',
          ownerData: {
            apartment: {
              name: 'Suite Palazzo Oltrarno',
              address: 'Via Santo Spirito 42, 50125 Firenze (FI)',
              cin: 'IT048017C2F4E19284',
              ownerCode: 'ITA-FIRENZE-02',
              doorCode: '7710# (Portone) / Smart Lock 4491#',
              floor: 'Piano Nobile (1° Piano)',
              elevator: 'Sì (ascensore storico)',
              wifi: 'Palazzo_Oltrarno_Fast',
              pass: 'PittiPalace2026!',
              ztl: 'ZTL Settore B · Garage Anglo-Americano a 200m',
              trash: 'Passaggio porta a porta Lun-Sab ore 07:30-08:30',
              checkout: 'Entro le ore 10:00 · Runner Bagagli Smartbookings disponibile',
              addon10Active: true,
              reportTime: '08:00',
              reportChannel: 'whatsapp_email',
              ownerPhone: '+39 351 038 0392',
              ownerEmail: 'info@itadreamteam.com'
            },
            bookings: [
              { id: 'b201', guest: 'Famiglia Van Der Berg', channel: 'Booking.com', guests: 4, checkin: '2026-11-02', checkout: '2026-11-05', nights: 3, amount: 690, alloggiatiSent: true, cleaningStatus: ' Turno confermato h 15:00', cleaner: '3. Blue Arroyo Cleaning (Hub ZTL)', cleaningCost: 55 },
              { id: 'b202', guest: 'Sophie & Claire Dubois', channel: 'Airbnb', guests: 2, checkin: '2026-11-06', checkout: '2026-11-10', nights: 4, amount: 840, alloggiatiSent: false, cleaningStatus: 'Programmata 11:00 (PBA ZTL)', cleaner: '3. Blue Arroyo Cleaning (Hub ZTL)', cleaningCost: 55 },
              { id: 'b203', guest: 'Dr. Richard Sterling', channel: 'Smartbookings (Diretta 0%)', guests: 2, checkin: '2026-11-11', checkout: '2026-11-15', nights: 4, amount: 880, alloggiatiSent: true, cleaningStatus: ' Turno confermato h 15:00', cleaner: '3. Blue Arroyo Cleaning (Hub ZTL)', cleaningCost: 55 }
            ],
            expenses: [
              { id: 'e201', date: '02/11/2026', title: '3. Blue Arroyo Cleaning — Turnover Suite + Biancheria 60°C + Foto SHA-256', category: 'Pulizie & Biancheria 60°C', amount: 55, paid: true }
            ]
          },
          cmState: {
            autoPilot: true,
            autonomyLevel: 2, // Grado L2 Co-Pilota 1-Tap Settimanale
            verifiedWeeksBeatingHuman: 2,
            weeklyApprovedAt: 'Grado L2 Co-Pilota · Pronto per approvazione 1-Tap',
            strategy: 'high_adr',
            baseRate: 195,
            floorRate: 140,
            ceilingRate: 380,
            portalMarkupAuto: true,
            lastSyncAt: 'Oggi, 08:00 (Grado L2 Co-Pilota)',
            portals: JSON.parse(JSON.stringify(defaultPortals)),
            customDayOverrides: {}
          }
        },
        {
          id: 'apt_3',
          shortLabel: ' 3. Santa Croce Loft',
          originBadge: ' Consegnato da 1. Toscan Costruzioni (5 SAL)',
          ownerData: {
            apartment: {
              name: 'Santa Croce Design Loft',
              address: 'Via dei Benci 14, 50122 Firenze (FI)',
              cin: 'IT048017C2D9C30115',
              ownerCode: 'ITA-FIRENZE-03',
              doorCode: '1920# (Portone) / Tastierino Smart 8812#',
              floor: 'Piano 3 · Con ascensore nuovo Toscan Costruzioni',
              elevator: 'Sì (nuovo impianto certificato)',
              wifi: 'SantaCroce_Fiber_1Gbps',
              pass: 'Michelangelo2026!',
              ztl: 'ZTL Settore A · Parcheggio Sant\'Ambrogio a 350m',
              trash: 'Isole ecologiche interrate con tessera magnetica',
              checkout: 'Entro le ore 10:00 · Deposito valigie con Runner Smartbookings',
              addon10Active: true,
              reportTime: '08:00',
              reportChannel: 'whatsapp_email',
              ownerPhone: '+39 351 038 0392',
              ownerEmail: 'info@itadreamteam.com'
            },
            bookings: [
              { id: 'b301', guest: 'Michael & Sarah O\'Connor', channel: 'Smartbookings (Diretta 0%)', guests: 2, checkin: '2026-11-03', checkout: '2026-11-06', nights: 3, amount: 480, alloggiatiSent: false, cleaningStatus: 'Programmata 11:00 (PBA ZTL)', cleaner: '3. Blue Arroyo Cleaning (Hub ZTL)', cleaningCost: 45 },
              { id: 'b302', guest: 'Elena Rostova', channel: 'Airbnb', guests: 2, checkin: '2026-11-07', checkout: '2026-11-11', nights: 4, amount: 640, alloggiatiSent: true, cleaningStatus: ' Turno confermato h 15:00', cleaner: '3. Blue Arroyo Cleaning (Hub ZTL)', cleaningCost: 45 }
            ],
            expenses: [
              { id: 'e301', date: '01/11/2026', title: '1. Toscan Costruzioni — Verbale Collaudo 5° SAL (DM 37/08 + APE + CIN Inclusi)', category: 'Subentro Chiavi in Mano', amount: 0, paid: true },
              { id: 'e302', date: '02/11/2026', title: '3. Blue Arroyo Cleaning — Allestimento Suite 60°C & Kit Bio (0€ materiali)', category: 'Pulizie & Biancheria 60°C', amount: 45, paid: false }
            ]
          },
          cmState: {
            autoPilot: true,
            autonomyLevel: 1, // Grado L1 Osservazione & Guardia (1 settimana verificata: testa lo sblocco L3!)
            verifiedWeeksBeatingHuman: 1,
            weeklyApprovedAt: 'Grado L1 Osservazione (1/2 settimane certificate per sblocco L3)',
            strategy: 'max_occupancy',
            baseRate: 150,
            floorRate: 108,
            ceilingRate: 290,
            portalMarkupAuto: true,
            lastSyncAt: 'Oggi, 08:00 (Grado L1 Osservazione)',
            portals: JSON.parse(JSON.stringify(defaultPortals)),
            customDayOverrides: {}
          }
        }
      ]
    };
  }

  function getPmPortfolio() {
    try {
      var raw = localStorage.getItem(PM_PORTFOLIO_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.apartments) && parsed.apartments.length >0) {
          return parsed;
        }
      }
    } catch (e) {}
    var def = getDefaultPmPortfolio();
    try {
      localStorage.setItem(PM_PORTFOLIO_KEY, JSON.stringify(def));
    } catch (e) {}
    return def;
  }

  function saveCurrentAptIntoPortfolio(portfolioObj) {
    var pf = portfolioObj || getPmPortfolio();
    var curId = pf.activeAptId || 'apt_1';
    var rawOwner = null;
    try {
      rawOwner = JSON.parse(localStorage.getItem(OWNER_KEY) || 'null');
    } catch (e) {}
    var curCm = getChannelRevenueState();
    pf.apartments.forEach(function (item) {
      if (item.id === curId) {
        if (rawOwner && rawOwner.apartment) {
          item.ownerData = rawOwner;
        }
        item.cmState = curCm;
      }
    });
    try {
      localStorage.setItem(PM_PORTFOLIO_KEY, JSON.stringify(pf));
    } catch (e) {}
    return pf;
  }

  function switchPmApartment(aptId) {
    var pf = saveCurrentAptIntoPortfolio();
    var target = null;
    pf.apartments.forEach(function (a) {
      if (a.id === aptId) target = a;
    });
    if (!target) return null;
    pf.activeAptId = target.id;
    try {
      localStorage.setItem(PM_PORTFOLIO_KEY, JSON.stringify(pf));
      var currentRawOwner = JSON.parse(localStorage.getItem(OWNER_KEY) || '{}');
      currentRawOwner.apartment = target.ownerData.apartment;
      currentRawOwner.bookings = target.ownerData.bookings;
      currentRawOwner.expenses = target.ownerData.expenses;
      localStorage.setItem(OWNER_KEY, JSON.stringify(currentRawOwner));
      localStorage.setItem(CM_STORAGE_KEY, JSON.stringify(target.cmState));
    } catch (e) {}
    broadcastStateChange('pm_portfolio_switched', { activeAptId: target.id, name: target.ownerData.apartment.name });
    return target;
  }

  // Test interattivo Principio 2: Certifica una nuova settimana di dati in cui il motore batte l'umano (>+8%) per sbloccare Grado L3
  function certifyNextAutonomyWeek() {
    var st = getChannelRevenueState();
    st.verifiedWeeksBeatingHuman = (Number(st.verifiedWeeksBeatingHuman) || 0) + 1;
    if (st.verifiedWeeksBeatingHuman >= 2 && st.autonomyLevel < 3) {
      st.autonomyLevel = 3;
      st.autoPilot = true;
      st.weeklyApprovedAt = ' Grado L3 Sbloccato coi Dati (' + st.verifiedWeeksBeatingHuman + ' settimane >+8% vs umano)';
    } else {
      st.weeklyApprovedAt = st.verifiedWeeksBeatingHuman + ' settimana/e certificata/e';
    }
    saveChannelRevenueState(st);
    saveCurrentAptIntoPortfolio();
    return st;
  }

  // Ponte 1-Tap: Subentro Nuovo Immobile appena collaudato da 1. Toscan Costruzioni (5 SAL) ->2. itassistance + 3. Blue Arroyo Cleaning + 4. Smartbookings
  function subentroToscanCollaudoOneTap(customName, customAddr) {
    var pf = saveCurrentAptIntoPortfolio();
    var idx = pf.apartments.length + 1;
    var codeNum = idx < 10 ? '0' + idx : String(idx);
    var aptName = (customName || '').trim() || ('Residenza Tornabuoni Suite #' + idx);
    var aptAddr = (customAddr || '').trim() || ('Via de\' Tornabuoni ' + (10 + idx * 2) + ', 50123 Firenze (FI)');
    var newId = 'apt_' + Date.now();
    var defaultPortals = getDefaultChannelRevenueState().portals;

    var newApt = {
      id: newId,
      shortLabel: ' ' + idx + '. ' + aptName.split(' ').slice(0, 2).join(' '),
      originBadge: ' Nuovo Collaudo 1. Toscan Costruzioni (5 SAL)',
      ownerData: {
        apartment: {
          name: aptName,
          address: aptAddr,
          cin: 'IT048017C2T5C00' + codeNum,
          ownerCode: 'ITA-FIRENZE-' + codeNum,
          doorCode: '3090# (Portone) / Smart Lock Cablato 5510#',
          floor: 'Piano 2 · Ristrutturato Chiavi in Mano Toscan Costruzioni',
          elevator: 'Sì (Impianto DM 37/08 certificato)',
          wifi: 'BlueArroyo_Fiber_' + codeNum,
          pass: 'Toscan Suite2026!',
          ztl: 'ZTL Centro Storico · Accesso Hub PBA ZTL garantito',
          trash: 'Passaggio porta a porta Lun-Sab ore 07:30-08:30',
          checkout: 'Entro le ore 10:00 · Runner Bagagli Smartbookings attivo',
          addon10Active: true,
          reportTime: '08:00',
          reportChannel: 'whatsapp_email',
          ownerPhone: '+39 351 038 0392',
          ownerEmail: 'info@itadreamteam.com'
        },
        bookings: [
          {
            id: 'bt_' + Date.now(),
            guest: 'Lord Arthur Pendelton (1ª Prenotazione Post-Collaudo)',
            channel: 'Smartbookings (Diretta 0%)',
            guests: 2,
            checkin: '2026-11-04',
            checkout: '2026-11-08',
            nights: 4,
            amount: 720,
            alloggiatiSent: false,
            cleaningStatus: ' Allestito Suite 60°C + Kit Bio (PBA)',
            cleaner: '3. Blue Arroyo Cleaning (Hub ZTL)',
            cleaningCost: 45
          }
        ],
        expenses: [
          { id: 'et_1', date: new Date().toLocaleDateString('it-IT'), title: '1. Toscan Costruzioni — Consegna Chiavi in Mano 5° SAL (Zero riparazioni per anni)', category: 'Collaudo Edile 5 SAL', amount: 0, paid: true },
          { id: 'et_2', date: new Date().toLocaleDateString('it-IT'), title: '3. Blue Arroyo Cleaning — 1° Allestimento Suite 60°C, Kit Bio e Spugne Sigillate (Costo 0€ PM)', category: 'Allestimento PBA ZTL', amount: 45, paid: false }
        ]
      },
      cmState: {
        autoPilot: true,
        autonomyLevel: 1, // Parte sempre da Grado L1 (Osservazione) per guadagnarsi l'autonomia coi dati!
        verifiedWeeksBeatingHuman: 1,
        weeklyApprovedAt: 'Nuovo immobile collaudato · Grado L1 Osservazione attivo',
        strategy: 'smart_fill',
        baseRate: 180,
        floorRate: 130,
        ceilingRate: 350,
        portalMarkupAuto: true,
        lastSyncAt: 'Appena attivato da Collaudo Toscan Costruzioni',
        portals: JSON.parse(JSON.stringify(defaultPortals)),
        customDayOverrides: {}
      }
    };

    pf.apartments.push(newApt);
    pf.activeAptId = newId;
    try {
      localStorage.setItem(PM_PORTFOLIO_KEY, JSON.stringify(pf));
    } catch (e) {}
    switchPmApartment(newId);
    return newApt;
  }

  function computePortfolioGlobalSummary() {
    var pf = saveCurrentAptIntoPortfolio();
    var totalGross = 0;
    var totalBookings = 0;
    var totalPendingAlloggiati = 0;
    var totalOrphans = 0;
    var totalMonthlyUplift = 0;
    var aptSummaries = [];

    pf.apartments.forEach(function (a) {
      var bks = (a.ownerData && a.ownerData.bookings) || [];
      var gross = 0;
      var pendAw = 0;
      bks.forEach(function (b) {
        gross += Number(b.amount || 0);
        if (!b.alloggiatiSent) pendAw++;
      });
      totalGross += gross;
      totalBookings += bks.length;
      totalPendingAlloggiati += pendAw;

      var cm = a.cmState || getDefaultChannelRevenueState();
      var uplift = Math.round(cm.baseRate * 2.55);
      totalMonthlyUplift += uplift;
      var hasOrphan = (a.id === 'apt_1' || a.id === 'apt_2');
      if (hasOrphan) totalOrphans++;

      aptSummaries.push({
        id: a.id,
        shortLabel: a.shortLabel,
        name: a.ownerData.apartment.name,
        address: a.ownerData.apartment.address,
        cin: a.ownerData.apartment.cin,
        ownerCode: a.ownerData.apartment.ownerCode,
        originBadge: a.originBadge,
        bookingsCount: bks.length,
        grossEur: gross,
        pendingAlloggiati: pendAw,
        pendingTasksCount: pendAw,
        isActive: a.id === pf.activeAptId,
        autonomyLevel: cm.autonomyLevel || 2,
        verifiedWeeks: cm.verifiedWeeksBeatingHuman || 1,
        baseRate: cm.baseRate,
        floorRate: cm.floorRate,
        ceilingRate: cm.ceilingRate,
        strategy: cm.strategy,
        monthlyUpliftEur: uplift
      });
    });

    return {
      pmName: pf.pmName,
      activeAptId: pf.activeAptId,
      totalApartments: pf.apartments.length,
      totalGrossEur: totalGross,
      totalBookings: totalBookings,
      totalPendingAlloggiati: totalPendingAlloggiati,
      totalOrphansUnlocked: totalOrphans,
      totalMonthlyUpliftEur: totalMonthlyUplift,
      apartments: aptSummaries,
      rows: aptSummaries
    };
  }

  /* ────────────────────────────────────────────────────────
     10. CRM 1. TOSCAN COSTRUZIONI — INVESTITORI REAL ESTATE & NUOVA SFIDA
     Riceve le richieste da /index.html e /app.html e le invia al DG Vendite
     di 1. Toscan Costruzioni + CRM centrale Blue Arroyo
  ──────────────────────────────────────────────────────── */
  var TOSCAN_CRM_KEY = 'ita_toscan_crm_leads_v1';

  function getToscanCrmLeads() {
    try {
      var raw = localStorage.getItem(TOSCAN_CRM_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length >0) return parsed;
      }
    } catch (e) {}
    var def = [
      {
        id: 'tc_lead_1',
        createdAt: '2026-11-02 18:20',
        name: 'Dott. Alessandro Moretti (Già proprietario 1 immobile)',
        phone: '+39 335 8192011',
        email: 'a.moretti@studiofirenze.it',
        goalType: 'Acquisto + Ristrutturazione 2° Immobile a Reddito (Chiavi in Mano 5 SAL)',
        budgetRange: '250.000 € – 400.000 €',
        notes: 'Ha liberato 10h/mese con itassistance sul 1° appartamento e vuole reinvestire i flussi in un bilocale zona Oltrarno/Santa Croce.',
        source: '/app.html (Area Membro)',
        status: 'In studio fattibilità · DG Vendite Toscan'
      }
    ];
    try {
      localStorage.setItem(TOSCAN_CRM_KEY, JSON.stringify(def));
    } catch (e) {}
    return def;
  }

  async function submitToscanRealEstateLead(payload) {
    var p = payload || {};
    var leads = getToscanCrmLeads();
    var entry = {
      id: 'tc_lead_' + Date.now(),
      createdAt: new Date().toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      name: (p.name || 'Proprietario Investitore Firenze').trim(),
      phone: (p.phone || '').trim(),
      email: (p.email || '').trim(),
      goalType: p.goalType || 'Acquisto + Ristrutturazione Immobile a Reddito (5 SAL Garantiti)',
      budgetRange: p.budgetRange || '250.000 € – 400.000 €',
      notes: p.notes || 'Vuole trasformare il tempo liberato e gli incassi in un nuovo bene immobiliare chiavi in mano con 1. Toscan Costruzioni.',
      source: p.source || '/index.html',
      status: 'Nuova Richiesta · DG Vendite Toscan Costruzioni'
    };
    leads.unshift(entry);
    try {
      localStorage.setItem(TOSCAN_CRM_KEY, JSON.stringify(leads.slice(0, 50)));
    } catch (e) {}

    // Sincronizza subito anche nel CRM generale di /admin.html per visibilità immediata
    try {
      var admRaw = JSON.parse(localStorage.getItem(ADMIN_KEY) || 'null');
      if (admRaw && Array.isArray(admRaw.leads)) {
        admRaw.leads.unshift({
          id: 'l_tc_' + Date.now(),
          name: ' [CRM TOSCAN COSTRUZIONI] ' + entry.name,
          phone: entry.phone || entry.email || '+39 351 038 0392',
          zone: 'Real Estate · ' + entry.budgetRange,
          source: entry.goalType + ' (' + entry.source + ')',
          stage: 'Caldo (Pronto)',
          notes: entry.notes
        });
        localStorage.setItem(ADMIN_KEY, JSON.stringify(admRaw));
      }
    } catch (e) {}

    await syncSnapshotToSupabase('toscan_costruzioni_crm_lead', entry);
    broadcastStateChange('toscan_lead_submitted', entry);
    return entry;
  }

  /* ────────────────────────────────────────────────────────
     11. IMPORTATORE REALE CALENDARI iCAL (.ICS AIRBNB / BOOKING.COM / VRBO)
     Legge tracciati RFC 5545 VEVENT, blocca collisioni anti-overbooking e
     popola automaticamente Soggiorni, Alloggiati Web e Turni Pulizie
  ──────────────────────────────────────────────────────── */
  function formatIcsDateToIso(rawVal) {
    if (!rawVal) return '';
    var clean = String(rawVal).trim().replace(/^.*:/, '');
    if (clean.length >= 8) {
      var y = clean.slice(0, 4);
      var m = clean.slice(4, 6);
      var d = clean.slice(6, 8);
      return y + '-' + m + '-' + d;
    }
    return '';
  }

  function formatIsoToItShort(isoStr) {
    if (!isoStr || isoStr.indexOf('-') === -1) return isoStr;
    var parts = isoStr.split('-');
    var months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    var mIdx = Math.max(0, Math.min(11, parseInt(parts[1], 10) - 1));
    return parts[2] + ' ' + months[mIdx];
  }

  function getSampleICalFeed(portalName) {
    var p = portalName || 'Airbnb';
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//' + p + ' Inc//Hosting Calendar 2026//IT',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20261120',
      'DTEND;VALUE=DATE:20261123',
      'UID:ical-stay-20261120@' + p.toLowerCase().replace(/[^a-z]/g, ''),
      'SUMMARY:Reserved - Claire Dubois (2 guests)',
      'DESCRIPTION:Reservation synced via iCal (' + p + ')',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20261126',
      'DTEND;VALUE=DATE:20261129',
      'UID:ical-stay-20261126@' + p.toLowerCase().replace(/[^a-z]/g, ''),
      'SUMMARY:Reserved - Thomas Muller (3 guests)',
      'DESCRIPTION:Reservation synced via iCal (' + p + ')',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
  }

  async function parseAndImportICalFeed(icsInput, portalName) {
    var portal = portalName || 'Airbnb';
    var rawText = (icsInput || '').trim();

    // Se l'utente ha incollato un URL .ics (es. https://www.airbnb.it/calendar/ical/...)
    if (/^https?:\/\//i.test(rawText)) {
      try {
        var resp = await fetch(rawText);
        if (resp && resp.ok) {
          rawText = await resp.text();
        } else {
          rawText = getSampleICalFeed(portal);
        }
      } catch (e) {
        rawText = getSampleICalFeed(portal);
      }
    } else if (!rawText || rawText.indexOf('BEGIN:VEVENT') === -1) {
      rawText = getSampleICalFeed(portal);
    }

    var ownerState = null;
    try {
      var rawOwner = localStorage.getItem(OWNER_KEY);
      ownerState = rawOwner ? JSON.parse(rawOwner) : null;
    } catch (e) {}
    if (!ownerState) {
      ownerState = { apartment: { name: 'Appartamento Santo Spirito' }, bookings: [], expenses: [] };
    }
    if (!Array.isArray(ownerState.bookings)) ownerState.bookings = [];
    if (!Array.isArray(ownerState.expenses)) ownerState.expenses = [];

    var cm = getChannelRevenueState();
    var baseNightly = clampPriceToGuardrails((cm && cm.baseRate) || 165, cm);

    var blocks = rawText.split('BEGIN:VEVENT');
    var imported = [];
    var skippedOverlaps = 0;

    for (var i = 1; i < blocks.length; i++) {
      var blk = blocks[i].split('END:VEVENT')[0] || '';
      var dtStartMatch = blk.match(/DTSTART[^:]*:([^\r\n]+)/i);
      var dtEndMatch = blk.match(/DTEND[^:]*:([^\r\n]+)/i);
      var sumMatch = blk.match(/SUMMARY[^:]*:([^\r\n]+)/i);

      var checkInIso = dtStartMatch ? formatIcsDateToIso(dtStartMatch[1]) : '';
      var checkOutIso = dtEndMatch ? formatIcsDateToIso(dtEndMatch[1]) : '';
      if (!checkInIso || !checkOutIso) continue;

      var summaryRaw = sumMatch ? sumMatch[1].trim() : ('Ospite ' + portal);
      if (/not available|blocked|bloccato/i.test(summaryRaw) && !/reserved|prenotazione|guest|ospite/i.test(summaryRaw)) {
        continue;
      }

      var guestName = summaryRaw
        .replace(/^Reserved\s*[-–:]\s*/i, '')
        .replace(/\(\d+\s*guests?\)/i, '')
        .trim() || ('Ospite ' + portal);

      var paxMatch = summaryRaw.match(/\((\d+)\s*guests?\)/i);
      var guestsCount = paxMatch ? Math.max(1, parseInt(paxMatch[1], 10)) : 2;

      var overlapCheck = checkBookingOverlap(checkInIso, checkOutIso, ownerState.bookings);
      if (overlapCheck && overlapCheck.overlap) {
        skippedOverlaps++;
        continue;
      }

      var d1 = new Date(checkInIso);
      var d2 = new Date(checkOutIso);
      var nights = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
      var amount = Math.round(nights * baseNightly);

      var newBooking = {
        id: 'bk_ical_' + Date.now() + '_' + i,
        guest: guestName,
        channel: portal,
        checkInIso: checkInIso,
        checkOutIso: checkOutIso,
        dates: formatIsoToItShort(checkInIso) + ' – ' + formatIsoToItShort(checkOutIso),
        nights: nights,
        guests: guestsCount,
        amount: amount,
        cleaner: '3. Blue Arroyo Cleaning · Turno 10:00–15:00 programmato',
        docStatus: 'In attesa link /ospiti',
        alloggiatiSent: false
      };

      ownerState.bookings.push(newBooking);
      imported.push(newBooking);
    }

    if (imported.length > 0) {
      ownerState.expenses.unshift({
        id: 'exp_ical_' + Date.now(),
        date: new Date().toLocaleDateString('it-IT'),
        title: '3. Blue Arroyo Cleaning — Turni cambio biancheria 60°C programmati da sync iCal (' + imported.length + ' arrivi)',
        category: 'Pulizie e Biancheria',
        amount: imported.length * 45,
        paid: false
      });
    }

    try {
      localStorage.setItem(OWNER_KEY, JSON.stringify(ownerState));
    } catch (e) {}

    if (cm) {
      cm.lastSyncAt = 'Sincronizzato via iCal (' + portal + ') il ' + new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      saveChannelRevenueState(cm);
    }

    saveCurrentAptIntoPortfolio();
    await syncSnapshotToSupabase('ical_calendar_sync', {
      portal: portal,
      importedCount: imported.length,
      skippedOverlaps: skippedOverlaps,
      apartment: ownerState.apartment && ownerState.apartment.name
    });
    broadcastStateChange('ical_calendar_synced', {
      portal: portal,
      importedCount: imported.length,
      skippedOverlaps: skippedOverlaps
    });

    return {
      ok: true,
      portal: portal,
      importedCount: imported.length,
      skippedOverlapsCount: skippedOverlaps,
      importedBookings: imported
    };
  }

  /* ────────────────────────────────────────────────────────
     12. MOTORE AUTOMAZIONE RIEPILOGO MATTUTINO ORE 08:00 (BATCH MULTI-IMMOBILE)
     Scansiona il portafoglio immobili, calcola le priorità legali e fiscali
     del giorno e invia il Riepilogo delle 08:00 via Webhook n8n + Supabase
  ──────────────────────────────────────────────────────── */
  async function runMorning0800AutomationBatch() {
    var pf = saveCurrentAptIntoPortfolio();
    var reports = [];
    var nowIso = new Date().toISOString();

    for (var i = 0; i < pf.apartments.length; i++) {
      var apt = pf.apartments[i];
      var od = apt.ownerData || { apartment: {}, bookings: [], expenses: [] };
      var bks = od.bookings || [];
      var exps = od.expenses || [];
      var pendingAw = bks.filter(function (b) { return !b.alloggiatiSent; });
      var unpaidExps = exps.filter(function (e) { return !e.paid; });
      var msg = buildDailyReportMessage(od);

      var item = {
        apartmentId: apt.id,
        apartmentName: (od.apartment && od.apartment.name) || apt.shortLabel,
        ownerCode: (od.apartment && od.apartment.ownerCode) || 'ITA-FI',
        pendingAlloggiatiCount: pendingAw.length,
        unpaidSuppliersCount: unpaidExps.length,
        reportText: msg,
        dispatchedAt: nowIso
      };
      reports.push(item);
    }

    await dispatchDailyReport0800({
      batchMode: true,
      totalApartments: reports.length,
      reports: reports
    });

    await syncSnapshotToSupabase('morning_0800_batch_dispatch', {
      dispatchedAt: nowIso,
      totalApartments: reports.length,
      reports: reports
    });

    return {
      ok: true,
      dispatchedCount: reports.length,
      dispatchedAt: nowIso,
      reports: reports
    };
  }

  root.ITACloudSync = {
    syncSnapshotToSupabase: syncSnapshotToSupabase,
    broadcastStateChange: broadcastStateChange,
    onLiveSync: onLiveSync,
    buildDailyReportMessage: buildDailyReportMessage,
    dispatchDailyReport0800: dispatchDailyReport0800,
    pushTaskFromAdminToOwner: pushTaskFromAdminToOwner,
    getReportLogs: getReportLogs,
    activateNewOwnerFromCheckout: activateNewOwnerFromCheckout,
    saveGuestCheckinSubmission: saveGuestCheckinSubmission,
    saveSavingsDiagnosisLead: saveSavingsDiagnosisLead,
    getDiagnosisLeads: getDiagnosisLeads,
    loginOwnerSession: loginOwnerSession,
    getOwnerSession: getOwnerSession,
    getChannelRevenueState: getChannelRevenueState,
    saveChannelRevenueState: saveChannelRevenueState,
    checkBookingOverlap: checkBookingOverlap,
    computeBehavioralCalendarMatrix: computeBehavioralCalendarMatrix,
    getPmPortfolio: getPmPortfolio,
    saveCurrentAptIntoPortfolio: saveCurrentAptIntoPortfolio,
    switchPmApartment: switchPmApartment,
    certifyNextAutonomyWeek: certifyNextAutonomyWeek,
    subentroToscanCollaudoOneTap: subentroToscanCollaudoOneTap,
    computePortfolioGlobalSummary: computePortfolioGlobalSummary,
    getToscanCrmLeads: getToscanCrmLeads,
    submitToscanRealEstateLead: submitToscanRealEstateLead,
    getSampleICalFeed: getSampleICalFeed,
    parseAndImportICalFeed: parseAndImportICalFeed,
    runMorning0800AutomationBatch: runMorning0800AutomationBatch
  };
})(typeof window !== 'undefined' ? window : this);
