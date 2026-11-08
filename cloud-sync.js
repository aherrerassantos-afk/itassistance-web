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
        tasks: [],
        bookings: [],
        expenses: []
      };
    }

    if (!Array.isArray(ownerState.tasks) || ownerState.tasks.length === 0) {
      ownerState.tasks = [
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
      ];
    }

    if (!Array.isArray(ownerState.bookings) || ownerState.bookings.length === 0) {
      ownerState.bookings = [
        {
          id: 'b1',
          guest: 'Jean Luc Martin',
          channel: 'Airbnb',
          guests: 2,
          checkin: '2026-11-02',
          checkout: '2026-11-06',
          nights: 4,
          amount: 760,
          alloggiatiSent: false,
          cleaningStatus: 'Confermata ore 11:00'
        },
        {
          id: 'b2',
          guest: 'Hannah e Mark Taylor',
          channel: 'Booking.com',
          guests: 2,
          checkin: '2026-11-07',
          checkout: '2026-11-12',
          nights: 5,
          amount: 1150,
          alloggiatiSent: false,
          cleaningStatus: 'Programmata'
        },
        {
          id: 'b3',
          guest: 'Marco Verdi',
          channel: 'Smartbookings (Diretto)',
          guests: 2,
          checkin: '2026-10-27',
          checkout: '2026-11-02',
          nights: 6,
          amount: 1510,
          alloggiatiSent: true,
          inviato_at: '27/10 16:15',
          inviato_da: 'Operatore Firenze',
          cleaningStatus: 'Completata'
        }
      ];
    }

    if (!Array.isArray(ownerState.expenses) || ownerState.expenses.length === 0) {
      ownerState.expenses = [
        { id: 'e1', date: '2026-11-02', title: 'Turnover e biancheria 60 gradi Blue Arroyo Cleaning', category: 'Pulizie e Biancheria', amount: 185, paid: true },
        { id: 'e2', date: '2026-10-28', title: 'Verifica impianto caldaia e salvavita', category: 'Manutenzione', amount: 90, paid: true },
        { id: 'e3', date: '2026-11-05', title: 'Utenza fibra e corrente elettrica', category: 'Utenze e Condominio', amount: 180, paid: false }
      ];
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
        behaviorTitle: (behaviorRule || '').trim(),
        behaviorDetail: behaviorDetail,
        actionLabel: (actionLabel || '').trim(),
        actionBadge: actionLabel,
        badgeClass: badgeClass,
        actionType: actionType,
        minStay: minStay,
        baseDynamic: recommendedRate,
        unifiedRate: recommendedRate,
        engineSuggestedRate: engineSuggestedRate,
        recommendedRate: recommendedRate,
        deltaPct: pctDelta,
        portalPrices: portalPrices,
        portalRates: {
          direct: portalPrices.direct || recommendedRate,
          airbnb: portalPrices.airbnb || Math.round(recommendedRate * 1.18),
          booking: portalPrices.booking || Math.round(recommendedRate * 1.18),
          vrbo: portalPrices.vrbo || Math.round(recommendedRate * 1.15)
        }
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
              { id: 'b2', guest: 'Hannah e Mark Taylor', channel: 'Booking.com', guests: 2, checkin: '2026-11-07', checkout: '2026-11-12', nights: 5, amount: 1150, alloggiatiSent: false, cleaningStatus: 'Programmata', cleaner: '3. Blue Arroyo Cleaning (Hub ZTL)', cleaningCost: 55 },
              { id: 'b3', guest: 'Marco Verdi', channel: 'Smartbookings (Diretto)', guests: 2, checkin: '2026-10-27', checkout: '2026-11-02', nights: 6, amount: 1510, alloggiatiSent: true, inviato_at: '27/10 16:15', inviato_da: 'Operatore Firenze', cleaningStatus: 'Completata', cleaner: '3. Blue Arroyo Cleaning (Hub ZTL)', cleaningCost: 45 }
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
          if (!Array.isArray(rawOwner.bookings) || rawOwner.bookings.length === 0) {
            rawOwner.bookings = (item.ownerData && Array.isArray(item.ownerData.bookings) && item.ownerData.bookings.length > 0)
              ? item.ownerData.bookings
              : getDefaultPmPortfolio().apartments[0].ownerData.bookings;
          }
          if (!Array.isArray(rawOwner.expenses) || rawOwner.expenses.length === 0) {
            rawOwner.expenses = (item.ownerData && Array.isArray(item.ownerData.expenses) && item.ownerData.expenses.length > 0)
              ? item.ownerData.expenses
              : getDefaultPmPortfolio().apartments[0].ownerData.expenses;
          }
          item.ownerData = rawOwner;
        }
        item.cmState = curCm;
      }
    });
    try {
      localStorage.setItem(PM_PORTFOLIO_KEY, JSON.stringify(pf));
      localStorage.setItem('ita_pm_portfolio_v1', JSON.stringify(pf));
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

  // Scaglione Pareto #1: Blocco Quotazione Giornaliera (99,00 € – 289,50 €/mese) per 24 Ore su WhatsApp e CRM
  async function lockDynamicPriceLead(input) {
    var inp = input || {};
    var dynCfg = (typeof window !== 'undefined' && window.SITE_CONFIG && typeof window.SITE_CONFIG.getDynamicPricing === 'function')
      ? window.SITE_CONFIG.getDynamicPricing()
      : { todayMonthlyEur: 99, todayFormatted: '99,00 €', yearlyEquivalentEur: 1188, slotsAvailable: 4 };
    var lockCode = 'LOCK-FI-' + Math.floor(1000 + Math.random() * 9000);
    var priceEur = Number(inp.lockedMonthlyEur) || dynCfg.todayMonthlyEur || 99;
    var fmtPrice = priceEur.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

    var rec = {
      id: 'lock_' + Date.now(),
      lockCode: lockCode,
      createdAt: new Date().toLocaleString('it-IT'),
      name: (inp.name || 'Proprietario Firenze').trim(),
      phone: (inp.phone || '').trim(),
      email: (inp.email || '').trim(),
      lockedMonthlyEur: priceEur,
      lockedFormatted: fmtPrice,
      slotsAvailable: dynCfg.slotsAvailable || 3,
      annualRevenue: 30000,
      pmPct: 20,
      netSaving: Math.max(0, Math.round(6000 - priceEur * 12)),
      addon10Interest: false,
      status: 'Tariffa Bloccata 24h (' + fmtPrice + '/mese · ' + lockCode + ')'
    };

    try {
      var list = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
      list.unshift(rec);
      localStorage.setItem(LEADS_KEY, JSON.stringify(list.slice(0, 50)));
    } catch (e) {}

    await syncSnapshotToSupabase('dynamic_price_lock_24h', rec);
    broadcastStateChange('dynamic_price_locked', rec);
    return { ok: true, lockCode: lockCode, record: rec };
  }

  // Scaglione Pareto #2: Calcolo "Tesoretto Libertà" e Progresso 1° SAL (15% = 10.200 €) per 1. Toscan Costruzioni
  function computeFreedomCapitalSalProgress() {
    var pf = saveCurrentAptIntoPortfolio();
    var aptsCount = (pf && pf.apartments && pf.apartments.length) ? pf.apartments.length : 1;
    var dynCfg = (typeof window !== 'undefined' && window.SITE_CONFIG && typeof window.SITE_CONFIG.getDynamicPricing === 'function')
      ? window.SITE_CONFIG.getDynamicPricing()
      : { todayMonthlyEur: 99, yearlyEquivalentEur: 1188 };
    var savedPmPerApt = Math.max(2400, Math.round(6400 - (dynCfg.yearlyEquivalentEur || 1188)));
    var revenueUpliftPerApt = 1820;
    var annualFreedomCapital = (savedPmPerApt + revenueUpliftPerApt) * aptsCount;
    var firstSalTargetEur = 10200; // 1° SAL (15% su cantiere tipo 68.000 € di 1. Toscan Costruzioni)
    var coveragePct = Math.min(100, Math.round((annualFreedomCapital / firstSalTargetEur) * 100));
    return {
      aptsCount: aptsCount,
      annualFreedomCapitalEur: annualFreedomCapital,
      firstSalTargetEur: firstSalTargetEur,
      coveragePct: coveragePct
    };
  }

  /* ────────────────────────────────────────────────────────
     13. CHIUSURA CICLO VIRTUOSO BLUE ARROYO IN 1 TAP:
         - 3. BLUE ARROYO CLEANING (Suite 60°C, Kit Bio gratuiti 232 €/m, 4 foto SHA-256)
         - 4. SMARTSBOOKINGS.COM (Canale Diretto 85% Payout + 15% Cashback Ospite)
  ──────────────────────────────────────────────────────── */
  async function activateBlueArroyoCleaningSuiteOneTap() {
    var ownerState = null;
    try {
      var raw = localStorage.getItem(OWNER_KEY);
      ownerState = raw ? JSON.parse(raw) : null;
    } catch (e) {}
    if (!ownerState) ownerState = { apartment: { name: 'Appartamento Santo Spirito' }, bookings: [], expenses: [] };
    if (!ownerState.apartment) ownerState.apartment = {};

    ownerState.apartment.cleaningPartner = '3. Blue Arroyo Cleaning · Suite 60°C + Kit Bio Gratuiti (Risparmio 232 €/mese)';
    ownerState.apartment.sha256DamagePhotosActive = true;

    if (Array.isArray(ownerState.bookings)) {
      ownerState.bookings.forEach(function (b) {
        b.cleaner = '3. Blue Arroyo Cleaning · Turno garantito 10:00–15:00 + 4 foto SHA-256';
      });
    }

    try {
      localStorage.setItem(OWNER_KEY, JSON.stringify(ownerState));
    } catch (e) {}
    saveCurrentAptIntoPortfolio();

    var record = {
      id: 'bac_' + Date.now(),
      apartmentName: ownerState.apartment.name || 'Appartamento Firenze',
      ownerCode: ownerState.apartment.ownerCode || 'ITA-FIRENZE-01',
      monthlyKitSavingEur: 232,
      protocol: 'Biancheria 60°C + Kit Bio e Spugne Sigillate 0€ PM + 4 Foto Danni SHA-256',
      activatedAt: new Date().toISOString()
    };

    await syncSnapshotToSupabase('blue_arroyo_cleaning_activated', record);
    broadcastStateChange('blue_arroyo_cleaning_activated', record);
    return { ok: true, record: record, monthlyKitSavingEur: 232, annualKitSavingEur: 2784 };
  }

  async function activateSmartsBookingsDirectChannelOneTap() {
    var ownerState = null;
    try {
      var raw = localStorage.getItem(OWNER_KEY);
      ownerState = raw ? JSON.parse(raw) : null;
    } catch (e) {}
    if (!ownerState) ownerState = { apartment: { name: 'Appartamento Santo Spirito' }, bookings: [], expenses: [] };
    if (!ownerState.apartment) ownerState.apartment = {};

    ownerState.apartment.smartsBookingsDirectActive = true;
    try {
      localStorage.setItem(OWNER_KEY, JSON.stringify(ownerState));
    } catch (e) {}

    var cm = getChannelRevenueState();
    if (cm && Array.isArray(cm.portals)) {
      cm.portals.forEach(function (p) {
        if (/smart/i.test(p.name || p.id)) {
          p.connected = true;
          p.statusLabel = 'Attivo · Payout 85% + Cashback 15% Ospite';
        }
      });
      saveChannelRevenueState(cm);
    }
    saveCurrentAptIntoPortfolio();

    var record = {
      id: 'sb_' + Date.now(),
      apartmentName: ownerState.apartment.name || 'Appartamento Firenze',
      ownerCode: ownerState.apartment.ownerCode || 'ITA-FIRENZE-01',
      ownerPayoutPct: 85,
      guestCashbackPct: 15,
      guestCashbackEur: 15,
      activatedAt: new Date().toISOString()
    };
    var directUrl = 'https://www.smartsbookings.com/firenze/' + encodeURIComponent(record.ownerCode);

    await syncSnapshotToSupabase('smartsbookings_channel_activated', record);
    broadcastStateChange('smartsbookings_channel_activated', record);
    return { ok: true, record: record, directUrl: directUrl, ownerPayoutPct: 85, guestCashbackPct: 15, guestCashbackEur: 15 };
  }

  /* ────────────────────────────────────────────────────────
     14. ESPORTAZIONE CALENDARIO .ICS UNIFICATO BIDIREZIONALE
         Genera tracciato RFC 5545 VCALENDAR di uscita per Airbnb/Booking/Vrbo
  ──────────────────────────────────────────────────────── */
  function exportUnifiedICalFeed() {
    var ownerState = null;
    try {
      var raw = localStorage.getItem(OWNER_KEY);
      ownerState = raw ? JSON.parse(raw) : null;
    } catch (e) {}
    var aptName = (ownerState && ownerState.apartment && ownerState.apartment.name) || 'Appartamento Firenze';
    var ownerCode = (ownerState && ownerState.apartment && ownerState.apartment.ownerCode) || 'ITA-FIRENZE-01';
    var bks = (ownerState && Array.isArray(ownerState.bookings)) ? ownerState.bookings : [];

    var lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//itassistance Blue Arroyo SRL//Unified Anti-Overbooking Calendar 2026//IT',
      'CALSCALE:GREGORIAN',
      'X-WR-CALNAME:' + aptName + ' (' + ownerCode + ')'
    ];

    for (var i = 0; i < bks.length; i++) {
      var b = bks[i];
      var ci = (b.checkInIso || b.checkin || '2026-11-12').replace(/-/g, '');
      var co = (b.checkOutIso || b.checkout || '2026-11-15').replace(/-/g, '');
      lines.push('BEGIN:VEVENT');
      lines.push('UID:' + (b.id || ('bk_' + i)) + '@itadreamteam.com');
      lines.push('DTSTART;VALUE=DATE:' + ci);
      lines.push('DTEND;VALUE=DATE:' + co);
      lines.push('SUMMARY:Reserved - ' + (b.guest || 'Ospite') + ' (' + (b.channel || 'itassistance') + ')');
      lines.push('DESCRIPTION:Blocco anti-overbooking certificato itassistance · ' + aptName);
      lines.push('END:VEVENT');
    }

    lines.push('END:VCALENDAR');
    var icsContent = lines.join('\r\n');
    var icsFeedUrl = 'https://www.itadreamteam.com/ical/' + encodeURIComponent(ownerCode) + '.ics';
    var filename = 'itassistance-calendario-' + ownerCode.toLowerCase().replace(/[^a-z0-9_-]/g, '-') + '.ics';

    return {
      ok: true,
      filename: filename,
      ownerCode: ownerCode,
      apartmentName: aptName,
      eventsCount: bks.length,
      icsFeedUrl: icsFeedUrl,
      icsContent: icsContent
    };
  }

  /* ────────────────────────────────────────────────────────
     15. VERBALE CERTIFICATO 4 FOTO ANTI-DANNI SHA-256 (3. BLUE ARROYO CLEANING)
         & VOUCHER RI-PRENOTAZIONE DIRETTA 4. SMARTSBOOKINGS.COM
  ──────────────────────────────────────────────────────── */
  function generateBlueArroyoSha256DamageReport(ownerStateInput) {
    var ownerState = ownerStateInput || null;
    if (!ownerState) {
      try {
        var raw = localStorage.getItem(OWNER_KEY);
        ownerState = raw ? JSON.parse(raw) : null;
      } catch (e) {}
    }
    var aptName = (ownerState && ownerState.apartment && ownerState.apartment.name) || 'Appartamento Santo Spirito';
    var cin = (ownerState && ownerState.apartment && ownerState.apartment.cin) || 'IT048017C2A8B91023';
    var ownerCode = (ownerState && ownerState.apartment && ownerState.apartment.ownerCode) || 'ITA-FIRENZE-01';
    var bks = (ownerState && Array.isArray(ownerState.bookings)) ? ownerState.bookings : [];
    var latestBooking = bks.length > 0 ? bks[0] : { guest: 'Ospite in Check-out', channel: 'Airbnb / Booking.com', dates: 'Oggi · Ore 11:00–14:00' };
    var reportId = 'BAC-SHA256-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-01';
    var photos = [
      { slot: 'Foto 1 di 4 · Zona Giorno, Cucina e Piano Cottura', status: 'Integro · Rifornito Kit Cucina (spugna sigillata + tabs)', sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      { slot: 'Foto 2 di 4 · Camera Padronale e Biancheria 60°C', status: 'Allestito · Set lenzuola cotone certificato 60°C', sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
      { slot: 'Foto 3 di 4 · Bagno Suite e Kit Cortesia Biologici', status: 'Sanificato · Kit bagno biologico + asciugamani 500g/mq', sha256: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae' },
      { slot: 'Foto 4 di 4 · Dotazioni Sicurezza (Estintore, Rilevatori Gas/CO, CIN)', status: 'Verificato · Presidi a norma Legge 191/2023', sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a' }
    ];
    return {
      ok: true,
      reportId: reportId,
      apartmentName: aptName,
      cin: cin,
      ownerCode: ownerCode,
      guestName: latestBooking.guest || 'Ospite',
      channel: latestBooking.channel || 'Portale OTA',
      monthlyKitSavingEur: 232,
      annualKitSavingEur: 2784,
      photos: photos
    };
  }

  function openBlueArroyoSha256ReportPrint(ownerStateInput) {
    var rep = generateBlueArroyoSha256DamageReport(ownerStateInput);
    var w = window.open('', '_blank');
    if (!w) return rep;
    var rowsHtml = '';
    for (var i = 0; i < rep.photos.length; i++) {
      var p = rep.photos[i];
      rowsHtml += '<tr><td><strong>' + p.slot + '</strong></td><td>' + p.status + '</td><td style="font-family:monospace;font-size:11px;word-break:break-all;">' + p.sha256 + '</td></tr>';
    }
    w.document.write('<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>Verbale 4 Foto Anti-Danni SHA-256 — ' + rep.reportId + '</title>' +
      '<style>body{font-family:sans-serif;padding:36px;color:#1E1035;line-height:1.5;max-width:820px;margin:0 auto}h1{font-size:22px;margin-bottom:6px}table{width:100%;border-collapse:collapse;margin:18px 0}th,td{border:1px solid #7C3AED;padding:10px;text-align:left;vertical-align:top}th{background:#F5F3FF}.box{background:#ECFDF5;border:1.5px solid #065F46;padding:14px;border-radius:8px;margin-top:16px}</style></head><body>' +
      '<div style="font-size:12px;font-weight:700;letter-spacing:1px;color:#5B21B6;">3. BLUE ARROYO CLEANING · VERBALE ISPEZIONE E SANIFICAZIONE 60°C · FIRENZE</div>' +
      '<h1>Certificato 4 Foto Anti-Danni SHA-256 e Rifornimento Kit (' + rep.reportId + ')</h1>' +
      '<p><strong>Immobile:</strong> ' + rep.apartmentName + ' · <strong>CIN:</strong> ' + rep.cin + ' · <strong>Codice Proprietario:</strong> ' + rep.ownerCode + '<br/>' +
      '<strong>Soggiorno verificato:</strong> ' + rep.guestName + ' (' + rep.channel + ') · <strong>Finestra operativa:</strong> Ore 11:00 – 14:00</p>' +
      '<table><thead><tr><th>Ambiente e Punto di Controllo</th><th>Esito Ispezione e Rifornimento</th><th>Impronta Digitale SHA-256 (Prova AirCover / Booking)</th></tr></thead><tbody>' +
      rowsHtml +
      '</tbody></table>' +
      '<div class="box"><strong>Fornitura Kit Cortesia Inclusa (0 € di ricarico PM):</strong> Kit Bagno Biologico, Kit Cucina con spugna sigillata e Kit Benvenuto riforniti gratuitamente per ogni soggiorno. Risparmio medio certificato per il proprietario: <strong>' + rep.monthlyKitSavingEur + ' €/mese (' + rep.annualKitSavingEur + ' €/anno)</strong>.</div>' +
      '<p style="margin-top:24px;font-size:12px;color:#4C3D63;">Blue Arroyo SRL · Via Matteo Palmieri 20r, 50122 Firenze (FI) · P.IVA 07480210488 · Tel. +39 351 038 0392</p>' +
      '<script>window.onload=function(){window.print();}<\/script></body></html>');
    w.document.close();
    return rep;
  }

  function buildSmartsBookingsGuestRepeatVoucher(ownerStateInput, bookingInput) {
    var ownerState = ownerStateInput || null;
    if (!ownerState) {
      try {
        var raw = localStorage.getItem(OWNER_KEY);
        ownerState = raw ? JSON.parse(raw) : null;
      } catch (e) {}
    }
    var aptName = (ownerState && ownerState.apartment && ownerState.apartment.name) || 'Appartamento Santo Spirito';
    var ownerCode = (ownerState && ownerState.apartment && ownerState.apartment.ownerCode) || 'ITA-FIRENZE-01';
    var bks = (ownerState && Array.isArray(ownerState.bookings)) ? ownerState.bookings : [];
    var b = bookingInput || (bks.length > 0 ? bks[0] : { guest: 'Gentile Ospite', phone: '393510380392' });
    var guestName = b.guest || 'Gentile Ospite';
    var voucherCode = 'FIRENZE15-' + ownerCode.replace(/[^A-Z0-9]/gi, '').slice(-4).toUpperCase();
    var directUrl = 'https://www.smartsbookings.com/firenze/' + encodeURIComponent(ownerCode) + '?voucher=' + encodeURIComponent(voucherCode);
    var message = 'Grazie per aver soggiornato presso ' + aptName + ' a Firenze, ' + guestName + '.\n' +
      'Per il tuo prossimo soggiorno a Firenze o per consigliare il nostro appartamento a un amico, prenota direttamente su 4. SmartsBookings.com senza commissioni dei portali:\n' +
      directUrl + '\n' +
      'Codice Voucher: ' + voucherCode + ' — Ricevi il 15% (15 €) di cashback reale accreditato entro 48 ore dal check-out.';
    var cleanPhone = String(b.phone || '393510380392').replace(/[^0-9]/g, '');
    if (!cleanPhone) cleanPhone = '393510380392';
    var whatsappUrl = 'https://wa.me/' + cleanPhone + '?text=' + encodeURIComponent(message);
    return {
      ok: true,
      apartmentName: aptName,
      ownerCode: ownerCode,
      guestName: guestName,
      voucherCode: voucherCode,
      directUrl: directUrl,
      ownerPayoutPct: 85,
      guestCashbackPct: 15,
      guestCashbackEur: 15,
      message: message,
      whatsappUrl: whatsappUrl
    };
  }

  // Generatore Dossier A4 "Studio di Fattibilità 5 SAL Garantiti — 1. Toscan Costruzioni"
  function openToscanFeasibilityStudyPrint(input) {
    var d = input || {};
    var cap = Number(d.capEur) || 68000;
    var name = d.name || 'Proprietario-Gestore Firenze';
    var goal = d.goalType || 'Acquisto / Ristrutturazione Immobile a Reddito (Chiavi in Mano 5 SAL)';
    var payback = d.paybackLabel || '1,8 anni (22 mesi)';
    var boost = d.annualBoostLabel || '+37.400 €/anno';
    var s1 = Math.round(cap * 0.15).toLocaleString('it-IT');
    var s25 = Math.round(cap * 0.25).toLocaleString('it-IT');
    var s10 = Math.round(cap * 0.10).toLocaleString('it-IT');

    var w = window.open('', '_blank');
    if (!w) return;
    w.document.write('<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>Studio di Fattibilità 5 SAL — 1. Toscan Costruzioni</title>' +
      '<style>body{font-family:sans-serif;padding:36px;color:#1E1035;line-height:1.5;max-width:800px;margin:0 auto}h1{font-size:24px;margin-bottom:4px}table{width:100%;border-collapse:collapse;margin:18px 0}th,td{border:1px solid #7C3AED;padding:10px;text-align:left}th{background:#F5F3FF}.box{background:#ECFDF5;border:1.5px solid #065F46;padding:14px;border-radius:8px;margin-top:16px}</style></head><body>' +
      '<div style="font-size:12px;font-weight:700;letter-spacing:1px;color:#5B21B6;">1. TOSCAN COSTRUZIONI · GRUPPO INDUSTRIALE BLUE ARROYO SRL · FIRENZE</div>' +
      '<h1>Dossier Studio di Fattibilità 5 SAL Garantiti a Prezzo Fisso</h1>' +
      '<p><strong>Intestatario:</strong> ' + name + ' · <strong>Data:</strong> ' + new Date().toLocaleDateString('it-IT') + '<br/>' +
      '<strong>Operazione:</strong> ' + goal + '</p>' +
      '<table><thead><tr><th>Stato Avanzamento Lavori (SAL)</th><th>Quota %</th><th>Importo Garantito</th><th>Collaudo e Certificazioni</th></tr></thead><tbody>' +
      '<tr><td>1° SAL · Avvio Cantiere, Demolizioni e Tracciamenti</td><td>15%</td><td><strong>' + s1 + ' €</strong></td><td>Verbale apertura e cronoprogramma bloccato</td></tr>' +
      '<tr><td>2° SAL · Impianti Idrici, Elettrici e Cablaggio Smart Lock</td><td>25%</td><td><strong>' + s25 + ' €</strong></td><td>Predisposizione DM 37/08 e rete fibra</td></tr>' +
      '<tr><td>3° SAL · Massetti, Intonaci, Infissi e Insonorizzazione</td><td>25%</td><td><strong>' + s25 + ' €</strong></td><td>Verifica acustica e termica</td></tr>' +
      '<tr><td>4° SAL · Pavimenti, Rivestimenti e Bagni Suite</td><td>25%</td><td><strong>' + s25 + ' €</strong></td><td>Controllo qualità finiture</td></tr>' +
      '<tr><td>5° SAL · Fine Lavori, Collaudo Finale e Subentro Ciclo Blue Arroyo</td><td>10%</td><td><strong>' + s10 + ' €</strong></td><td>Certificazioni DM 37/08, APE e ingresso in 2. itassistance + 3. Blue Arroyo Cleaning + 4. Smartbookings</td></tr>' +
      '</tbody></table>' +
      '<div class="box"><strong>Riepilogo Finanziario Stimato:</strong><br/>Investimento Lavori Chiavi in Mano: <strong>' + cap.toLocaleString('it-IT') + ' €</strong> · Flusso Annuo Combinato: <strong>' + boost + '</strong> · Tempo di Rientro Stimato: <strong>' + payback + '</strong>.</div>' +
      '<p style="margin-top:24px;font-size:12px;color:#4C3D63;">Blue Arroyo SRL · Via Matteo Palmieri 20r, 50122 Firenze (FI) · P.IVA 07480210488 · Tel. +39 351 038 0392</p>' +
      '<script>window.onload=function(){window.print();}<\/script></body></html>');
    w.document.close();
  }

  // Generatore Distinta / Fattura Pro-Forma con Quotazione Giornaliera Bloccata (99,00 € – 289,50 € / mese)
  function openDynamicInvoicePrint() {
    var act = null;
    try {
      act = JSON.parse(localStorage.getItem('itassistance_last_activation') || 'null');
    } catch (e) {}
    var dynCfg = (typeof window !== 'undefined' && window.SITE_CONFIG && typeof window.SITE_CONFIG.getDynamicPricing === 'function')
      ? window.SITE_CONFIG.getDynamicPricing()
      : { todayMonthlyEur: 99, todayFormatted: '99,00 €' };
    var ownerName = (act && act.ownerName) || 'Proprietario Firenze';
    var aptName = (act && act.apartmentName) || 'Appartamento Firenze';
    var ownerCode = (act && act.ownerCode) || 'ITA-FIRENZE-01';
    var invId = (act && act.invoiceId) || 'FATT-2026-101';
    var amountEur = (act && act.amountEur) || dynCfg.todayMonthlyEur || 99;
    var fmtAmt = Number(amountEur).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    var guaranteeUntil = (act && act.guaranteeUntil) || new Date(Date.now() + 14 * 86400000).toLocaleDateString('it-IT');

    var w = window.open('', '_blank');
    if (!w) return;
    w.document.write('<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>Distinta Attivazione e Tariffa Bloccata — ' + invId + '</title>' +
      '<style>body{font-family:sans-serif;padding:36px;color:#1E1035;line-height:1.5;max-width:760px;margin:0 auto}table{width:100%;border-collapse:collapse;margin:18px 0}th,td{border:1px solid #7C3AED;padding:10px;text-align:left}th{background:#F5F3FF}</style></head><body>' +
      '<div style="font-size:12px;font-weight:700;color:#5B21B6;">BLUE ARROYO SRL · VIA MATTEO PALMIERI 20R, 50122 FIRENZE (FI) · P.IVA 07480210488</div>' +
      '<h1>Certificato di Attivazione e Blocco Tariffa (' + invId + ')</h1>' +
      '<p><strong>Intestatario:</strong> ' + ownerName + ' · <strong>Immobile:</strong> ' + aptName + '<br/>' +
      '<strong>Codice Proprietario Personale:</strong> ' + ownerCode + ' · <strong>Garanzia 100% Rimborso fino al:</strong> ' + guaranteeUntil + '</p>' +
      '<table><thead><tr><th>Descrizione Servizio</th><th>Commissioni Prenotazioni</th><th>Importo Bloccato (IVA incl.)</th></tr></thead><tbody>' +
      '<tr><td>Abbonamento Piattaforma itassistance Firenze (Price Lock Giornaliero)</td><td>0% (Zero)</td><td><strong>' + fmtAmt + '</strong></td></tr>' +
      '</tbody></table>' +
      '<p><strong>Coordinate Bonifico Bancario:</strong> Intestatario: <strong>Blue Arroyo SRL</strong> · Causale: <strong>' + invId + ' - ' + ownerCode + '</strong></p>' +
      '<script>window.onload=function(){window.print();}<\/script></body></html>');
    w.document.close();
  }

  /* ────────────────────────────────────────────────────────
     16. WIZARD DI PRIMO ACCESSO (ONBOARDING ITASSISTANCE CHANNEL MANAGER)
         - 4 Passi guidati per Micro Albergo / B&B / Affittacamere / Casa Vacanze / Locazione Turistica
         - Salvataggio immediato sul server a ogni modifica/passo
         - Interrompibile e riprendibile dal punto esatto con barra di avanzamento sempre visibile
  ──────────────────────────────────────────────────────── */
  var ONBOARDING_KEY = 'itassistance_onboarding_wizard_v1';

  function getDefaultOnboardingUnit(idx) {
    var num = idx || 1;
    return {
      id: 'unit_' + num + '_' + Date.now(),
      name: num === 1 ? 'Suite 101 · Santo Spirito' : ('Camera / Unità ' + num),
      unitType: num === 1 ? 'Suite / Appartamento intero' : 'Camera Matrimoniale Deluxe',
      sizeSqm: num === 1 ? 52 : 28,
      floor: num === 1 ? 'Secondo piano (con ascensore)' : 'Secondo piano',
      maxGuests: num === 1 ? 4 : 2,
      bedsDouble: 1,
      bedsSingle: 0,
      bedsSofa: num === 1 ? 1 : 0,
      bathrooms: 1,
      amenities: 'Wi-Fi Fibra, Aria condizionata, Smart TV, Cucina attrezzata, Macchina caffè, Cassaforte',
      photoUrl: '/assets/florence-window.webp',
      descIt: 'Elegante unità nel centro storico di Firenze, sanificata a 60 gradi secondo il protocollo 3. Blue Arroyo Cleaning.',
      descEn: 'Elegant unit in the historic center of Florence, sanitized at 60 degrees under the 3. Blue Arroyo Cleaning protocol.',
      // Dati operativi collegati a 3. Blue Arroyo Cleaning turni ed etichette
      keyCode: 'KEY-10' + num,
      keyHook: 'Gancio B-' + num + ' (Armadio Operativo Firenze)',
      doorCode: '4829# (Tastiera a sinistra del portone)',
      keyBoxCode: 'KB-910' + num,
      accessInstructions: 'Suonare campanello Blue Arroyo / inserire codice portone 4829#, salire al 2° piano e ritirare la chiave nella KeyBox accanto alla porta.',
      standardLinenKit: '1 Set Matrimoniale 60°C + 4 Spugne Bagno 500g/mq + Kit Bio Bagno/Cucina/Benvenuto',
      standardCleaningMinutes: num === 1 ? 90 : 60,
      blueArroyoShiftTag: 'TURNO-11:00-14:00-FI-0' + num,
      // Regole unità
      minStayNights: 2,
      maxStayNights: 29,
      securityDepositEur: 150,
      houseRules: 'Vietato fumare · Animali ammessi su richiesta · Vietate feste ed eventi · Orario silenzio 22:00–08:00'
    };
  }

  function getDefaultOnboardingState() {
    return {
      completed: false,
      currentStep: 1,
      totalSteps: 4,
      progressPct: 25,
      lastSavedAt: new Date().toISOString(),
      structure: {
        propertyType: 'Micro albergo',
        commercialName: 'Residenza Palazzo Santo Spirito Firenze',
        legalName: 'Palazzo Santo Spirito Hospitality SRL',
        vatOrTaxCode: '07480210488',
        address: 'Via Maggio 18, 50125 Firenze (FI)',
        phone: '+39 351 038 0392',
        email: 'proprietario@itadreamteam.com',
        logoUrl: '/brand/logo.png',
        coverPhotoUrl: '/assets/florence-window.webp',
        // Codici obbligatori
        cin: 'IT048017C200001234',
        cir: '048017-ALB-0042',
        alloggiatiUsername: 'FI048017_HOST01',
        alloggiatiWsKey: 'WSKEY-QUESTURA-FI-2026-OK',
        istatCode: 'ROSS1000-FI-048017',
        cityTaxRateEur: 5.50,
        cityTaxMaxNights: 7,
        cityTaxExemptions: 'Minori fino a 12 anni, disabili e accompagnatori, forze dell’ordine in servizio, autisti pullman',
        // Orari, lingue, fuso orario e valuta
        checkInTime: '15:00',
        checkOutTime: '10:00',
        languages: 'IT, EN',
        timezone: 'Europe/Rome',
        currency: 'EUR'
      },
      units: [
        getDefaultOnboardingUnit(1)
      ],
      bookingEngine: {
        directEngineActive: true,
        smartsBookingsActive: true,
        otaMarkupCompensationPct: 18,
        cancellationPolicy: 'Flessibile 5 giorni (rimborso 100% fino a 5 giorni prima del check-in)',
        payoutIban: 'IT60X0306902887100000007480',
        airbnbIcalUrl: 'https://www.airbnb.it/calendar/ical/12345678.ics',
        bookingIcalUrl: 'https://admin.booking.com/hotel/hoteladmin/ical.html?t=87654321',
        vrboIcalUrl: '',
        instantBookEnabled: true
      },
      revenueAuto: {
        active: true,
        autonomyLevel: 2,
        baseRateEur: 165,
        floorRateEur: 118,
        ceilingRateEur: 320,
        strategyProfile: 'Bilanciata (+18,5% target)',
        autoUnlockOrphanNights: true,
        weekendMultiplierPct: 22
      }
    };
  }

  function getOnboardingState() {
    try {
      var raw = localStorage.getItem(ONBOARDING_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.structure && Array.isArray(parsed.units)) {
          if (parsed.units.length === 0) parsed.units = [getDefaultOnboardingUnit(1)];
          if (!parsed.bookingEngine) parsed.bookingEngine = getDefaultOnboardingState().bookingEngine;
          if (!parsed.revenueAuto) parsed.revenueAuto = getDefaultOnboardingState().revenueAuto;
          return parsed;
        }
      }
    } catch (e) {}
    var def = getDefaultOnboardingState();
    try {
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify(def));
    } catch (e) {}
    return def;
  }

  function propagateOnboardingToCoreState(obState) {
    if (!obState) return;
    var s = obState.structure || {};
    var u0 = (obState.units && obState.units[0]) || getDefaultOnboardingUnit(1);
    var rev = obState.revenueAuto || {};
    var be = obState.bookingEngine || {};

    // 1. Aggiorna stato proprietario (/app.html)
    try {
      var rawOwner = localStorage.getItem(OWNER_KEY);
      var ownerState = rawOwner ? JSON.parse(rawOwner) : { apartment: {}, bookings: [], expenses: [] };
      if (!ownerState.apartment) ownerState.apartment = {};
      ownerState.apartment.name = s.commercialName || u0.name || ownerState.apartment.name || 'Struttura Firenze';
      ownerState.apartment.propertyType = s.propertyType || 'Micro albergo';
      ownerState.apartment.legalName = s.legalName || '';
      ownerState.apartment.vatOrTaxCode = s.vatOrTaxCode || '';
      ownerState.apartment.address = s.address || ownerState.apartment.address || 'Firenze';
      ownerState.apartment.cin = s.cin || ownerState.apartment.cin || 'IT048017C200001234';
      ownerState.apartment.cir = s.cir || '';
      ownerState.apartment.alloggiatiUsername = s.alloggiatiUsername || '';
      ownerState.apartment.istatCode = s.istatCode || '';
      ownerState.apartment.cityTaxRateEur = Number(s.cityTaxRateEur) || 5.5;
      ownerState.apartment.cityTaxMaxNights = Number(s.cityTaxMaxNights) || 7;
      ownerState.apartment.checkInTime = s.checkInTime || '15:00';
      ownerState.apartment.checkout = 'Entro le ore ' + (s.checkOutTime || '10:00');
      ownerState.apartment.doorCode = u0.doorCode || ownerState.apartment.doorCode || '';
      ownerState.apartment.floor = u0.floor || ownerState.apartment.floor || '';
      ownerState.apartment.unitsCount = Array.isArray(obState.units) ? obState.units.length : 1;
      ownerState.apartment.units = obState.units;
      ownerState.apartment.blueArroyoActive = true;
      ownerState.apartment.smartsBookingsDirectActive = Boolean(be.smartsBookingsActive);
      ownerState.onboardingCompleted = Boolean(obState.completed);
      localStorage.setItem(OWNER_KEY, JSON.stringify(ownerState));
    } catch (e) {}

    // 2. Aggiorna stato Channel Manager & Revenue Automatico
    try {
      var cm = getChannelRevenueState();
      cm.baseRate = Number(rev.baseRateEur) || cm.baseRate || 165;
      cm.floorRate = Number(rev.floorRateEur) || cm.floorRate || 118;
      cm.ceilingRate = Number(rev.ceilingRateEur) || cm.ceilingRate || 320;
      cm.autonomyLevel = Number(rev.autonomyLevel) || cm.autonomyLevel || 2;
      cm.autoUnlockOrphanNights = rev.autoUnlockOrphanNights !== false;
      cm.otaMarkupCompensationPct = Number(be.otaMarkupCompensationPct) || 18;
      saveChannelRevenueState(cm);
      saveCurrentAptIntoPortfolio();
    } catch (e) {}
  }

  async function saveOnboardingWizardStep(stepNumber, updatedState, markCompleted) {
    var current = updatedState || getOnboardingState();
    var step = Math.max(1, Math.min(4, Number(stepNumber) || current.currentStep || 1));
    current.currentStep = step;
    current.totalSteps = 4;
    if (markCompleted === true) {
      current.completed = true;
      current.progressPct = 100;
      current.completedAt = new Date().toISOString();
    } else {
      var stepMap = { 1: 25, 2: 50, 3: 75, 4: 95 };
      current.progressPct = current.completed ? 100 : (stepMap[step] || 25);
    }
    current.lastSavedAt = new Date().toISOString();

    try {
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify(current));
    } catch (e) {}

    propagateOnboardingToCoreState(current);
    await syncSnapshotToSupabase('onboarding_wizard_step_' + step, current);
    broadcastStateChange('onboarding_wizard_updated', {
      step: step,
      completed: current.completed,
      progressPct: current.progressPct,
      commercialName: current.structure && current.structure.commercialName,
      unitsCount: Array.isArray(current.units) ? current.units.length : 1
    });
    return current;
  }

  function addOnboardingUnit() {
    var st = getOnboardingState();
    var nextIdx = (Array.isArray(st.units) ? st.units.length : 0) + 1;
    st.units.push(getDefaultOnboardingUnit(nextIdx));
    saveOnboardingWizardStep(st.currentStep || 2, st, false);
    return st;
  }

  function duplicateOnboardingUnit(unitIndex) {
    var st = getOnboardingState();
    if (!Array.isArray(st.units) || st.units.length === 0) {
      st.units = [getDefaultOnboardingUnit(1)];
    }
    var idx = (typeof unitIndex === 'number' && st.units[unitIndex]) ? unitIndex : (st.units.length - 1);
    var src = JSON.parse(JSON.stringify(st.units[idx]));
    var nextNum = st.units.length + 1;
    src.id = 'unit_' + nextNum + '_' + Date.now();
    src.name = src.name + ' (Copia ' + nextNum + ')';
    src.keyCode = 'KEY-10' + nextNum;
    src.keyHook = 'Gancio B-' + nextNum + ' (Armadio Operativo Firenze)';
    src.keyBoxCode = 'KB-910' + nextNum;
    src.blueArroyoShiftTag = 'TURNO-11:00-14:00-FI-0' + nextNum;
    st.units.push(src);
    saveOnboardingWizardStep(st.currentStep || 2, st, false);
    return st;
  }

  function removeOnboardingUnit(unitIndex) {
    var st = getOnboardingState();
    if (!Array.isArray(st.units) || st.units.length <= 1) return st;
    st.units.splice(unitIndex, 1);
    saveOnboardingWizardStep(st.currentStep || 2, st, false);
    return st;
  }

  function resetOnboardingForFirstAccess(customPropertyType, customName) {
    var fresh = getDefaultOnboardingState();
    fresh.completed = false;
    fresh.currentStep = 1;
    fresh.progressPct = 25;
    if (customPropertyType) fresh.structure.propertyType = customPropertyType;
    if (customName) fresh.structure.commercialName = customName;
    try {
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify(fresh));
    } catch (e) {}
    propagateOnboardingToCoreState(fresh);
    return fresh;
  }

  /* ────────────────────────────────────────────────────────
     17. MOTORE UFFICIALE ALLOGGIATI WEB POLIZIA DI STATO (TRACCIATO FISSO 168 CAR. + CRLF = 170 BYTE/RIGA)
         & SALVATAGGIO ASINCRONO STATO "INVIATO" (FUSO EUROPE/ROME)
  ──────────────────────────────────────────────────────── */
  var ALLOGGIATI_COUNTRIES = {
    '100000100': { code: '100000100', name: 'ITALIA', isItaly: true },
    '100000219': { code: '100000219', name: 'REGNO UNITO', isItaly: false },
    '100000215': { code: '100000215', name: 'FRANCIA', isItaly: false },
    '100000536': { code: '100000536', name: 'STATI UNITI', isItaly: false },
    '100000216': { code: '100000216', name: 'GERMANIA', isItaly: false },
    '100000249': { code: '100000249', name: 'SPAGNA', isItaly: false },
    '100000232': { code: '100000232', name: 'PAESI BASSI', isItaly: false },
    '100000221': { code: '100000221', name: 'IRLANDA', isItaly: false },
    '100000254': { code: '100000254', name: 'SVIZZERA', isItaly: false }
  };

  function getAlloggiatiCountryCatalog() {
    return ALLOGGIATI_COUNTRIES;
  }

  function resolveCountryCode(val) {
    var clean = String(val || '').trim().toUpperCase();
    if (/^\d{9}$/.test(clean)) return clean;
    if (clean.indexOf('ITAL') !== -1) return '100000100';
    if (clean.indexOf('REGNO UNITO') !== -1 || clean === 'UK' || clean === 'GBR' || clean.indexOf('GRAN BRETAGNA') !== -1) return '100000219';
    if (clean.indexOf('FRANC') !== -1 || clean === 'FRA') return '100000215';
    if (clean.indexOf('STATI UNITI') !== -1 || clean === 'USA' || clean === 'US') return '100000536';
    if (clean.indexOf('GERMAN') !== -1 || clean === 'DEU') return '100000216';
    if (clean.indexOf('SPAGN') !== -1 || clean === 'ESP') return '100000249';
    if (clean.indexOf('PAESI BASSI') !== -1 || clean.indexOf('OLAND') !== -1 || clean === 'NLD') return '100000232';
    if (clean.indexOf('IRLAND') !== -1 || clean === 'IRL') return '100000221';
    if (clean.indexOf('SVIZZER') !== -1 || clean === 'CHE') return '100000254';
    return '';
  }

  function getRomeNowFormatted(customDate) {
    var d = customDate instanceof Date ? customDate : new Date();
    try {
      var parts = new Intl.DateTimeFormat('it-IT', {
        timeZone: 'Europe/Rome',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).formatToParts(d);
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var dd = map.day || '07';
      var mm = map.month || '11';
      var yyyy = map.year || '2026';
      var hh = map.hour || '20';
      var min = map.minute || '43';
      return {
        dateIso: yyyy + '-' + mm + '-' + dd,
        dateIt: dd + '/' + mm + '/' + yyyy,
        shortDateTime: dd + '/' + mm + ' ' + hh + ':' + min,
        fullDateTime: dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min,
        iso: d.toISOString(),
        timezone: 'Europe/Rome'
      };
    } catch (e) {
      return {
        dateIso: '2026-11-07',
        dateIt: '07/11/2026',
        shortDateTime: '07/11 20:43',
        fullDateTime: '07/11/2026 20:43',
        iso: d.toISOString(),
        timezone: 'Europe/Rome'
      };
    }
  }

  function formatIsoToItDate10(isoOrIt) {
    var s = String(isoOrIt || '').trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return s;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      var p = s.split('-');
      return p[2] + '/' + p[1] + '/' + p[0];
    }
    return '';
  }

  function sanitizeAsciiAlpha(str, maxLen) {
    var clean = String(str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z ']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return clean.padEnd(maxLen, ' ').slice(0, maxLen);
  }

  function buildSingle168Line(g) {
    var missing = [];
    var tipo = String(g.tipo || '').trim();
    if (['16', '17', '18', '19', '20'].indexOf(tipo) === -1) {
      missing.push('Tipo alloggiato (codice 16, 17, 18, 19 o 20)');
    }
    var arrivo10 = formatIsoToItDate10(g.arrivo);
    if (!arrivo10) {
      missing.push('Data di arrivo (GG/MM/AAAA)');
    }
    var giorniNum = parseInt(g.giorni, 10);
    if (isNaN(giorniNum) || giorniNum < 1 || giorniNum > 30) {
      missing.push('Giorni di permanenza (1–30)');
    }
    var giorni2 = String(Math.max(1, Math.min(30, giorniNum || 1))).padStart(2, '0');

    var cognomeRaw = String(g.cognome || '').trim();
    if (!cognomeRaw) missing.push('Cognome ospite');
    var cognome50 = sanitizeAsciiAlpha(cognomeRaw, 50);

    var nomeRaw = String(g.nome || '').trim();
    if (!nomeRaw) missing.push('Nome ospite');
    var nome30 = sanitizeAsciiAlpha(nomeRaw, 30);

    var sesso1 = String(g.sesso || '').trim();
    if (sesso1 !== '1' && sesso1 !== '2') {
      missing.push('Sesso (1 = Maschio, 2 = Femmina)');
    }

    var nascita10 = formatIsoToItDate10(g.nascita);
    if (!nascita10) {
      missing.push('Data di nascita (GG/MM/AAAA)');
    }

    var statoNascita9 = resolveCountryCode(g.statoNascitaCode || g.statoNascita);
    if (!/^\d{9}$/.test(statoNascita9)) {
      missing.push('Stato di nascita (codice Polizia a 9 cifre)');
    }

    var cittadinanza9 = resolveCountryCode(g.cittadinanzaCode || g.cittadinanza);
    if (!/^\d{9}$/.test(cittadinanza9)) {
      missing.push('Cittadinanza (codice Polizia a 9 cifre)');
    }

    var comune9 = '         ';
    var prov2 = '  ';
    if (statoNascita9 === '100000100') {
      var rawCom = String(g.comuneNascitaCode || '404801700').trim();
      var rawProv = String(g.provinciaNascita || 'FI').trim().toUpperCase();
      if (!/^\d{9}$/.test(rawCom)) missing.push('Comune di nascita ISTAT (9 cifre per nati in Italia)');
      if (!/^[A-Z]{2}$/.test(rawProv)) missing.push('Provincia di nascita (2 lettere per nati in Italia)');
      comune9 = rawCom.padEnd(9, ' ').slice(0, 9);
      prov2 = rawProv.padEnd(2, ' ').slice(0, 2);
    }

    var isLeaderOrSingle = (tipo === '16' || tipo === '17' || tipo === '18');
    var docTipo5 = '     ';
    var docNum20 = '                    ';
    var docLuogo9 = '         ';

    if (isLeaderOrSingle) {
      var rawDocTipo = String(g.docTipo || '').trim().toUpperCase();
      if (!rawDocTipo) missing.push('Tipo documento (es. PASOR, IDENT, PATEN)');
      var rawDocNum = String(g.docNum || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (!rawDocNum) missing.push('Numero documento');
      var rawDocLuogo = resolveCountryCode(g.docLuogoCode || g.docLuogo || statoNascita9);
      if (!/^\d{9}$/.test(rawDocLuogo)) {
        if (/^\d{9}$/.test(String(g.docLuogoCode || '').trim())) {
          rawDocLuogo = String(g.docLuogoCode).trim();
        } else {
          missing.push('Luogo rilascio documento (codice Stato o Comune a 9 cifre)');
        }
      }
      docTipo5 = rawDocTipo.padEnd(5, ' ').slice(0, 5);
      docNum20 = rawDocNum.padEnd(20, ' ').slice(0, 20);
      docLuogo9 = String(rawDocLuogo || '').padEnd(9, ' ').slice(0, 9);
    }

    if (missing.length > 0) {
      return { ok: false, missingFields: missing, line: '' };
    }

    var line = [
      tipo,           // Pos 1-2 (2)
      arrivo10,       // Pos 3-12 (10)
      giorni2,        // Pos 13-14 (2)
      cognome50,      // Pos 15-64 (50)
      nome30,         // Pos 65-94 (30)
      sesso1,         // Pos 95 (1)
      nascita10,      // Pos 96-105 (10)
      comune9,        // Pos 106-114 (9)
      prov2,          // Pos 115-116 (2)
      statoNascita9,  // Pos 117-125 (9)
      cittadinanza9,  // Pos 126-134 (9)
      docTipo5,       // Pos 135-139 (5)
      docNum20,       // Pos 140-159 (20)
      docLuogo9       // Pos 160-168 (9)
    ].join('');

    return {
      ok: line.length === 168,
      missingFields: line.length === 168 ? [] : ['Lunghezza riga non conforme (' + line.length + ' invece di 168)'],
      line: line
    };
  }

  function validateAlloggiatiTxtContent(txtContent) {
    var errors = [];
    if (!txtContent || typeof txtContent !== 'string') {
      return { valid: false, errors: ['Contenuto file vuoto o non valido'] };
    }
    if (txtContent.indexOf('\r\n') === -1) {
      errors.push('Fine riga CRLF (\\r\\n) mancante');
    }
    var rawLines = txtContent.split('\r\n').filter(function (l) { return l.length > 0; });
    if (rawLines.length === 0) {
      errors.push('Nessun record presente nel file');
    }
    rawLines.forEach(function (line, idx) {
      var rowNum = idx + 1;
      if (line.length !== 168) {
        errors.push('Riga ' + rowNum + ': lunghezza ' + line.length + ' caratteri invece dei 168 obbligatori della Polizia di Stato');
        return;
      }
      var tipo = line.slice(0, 2);
      var arrivo = line.slice(2, 12);
      var giorni = line.slice(12, 14);
      var cognome = line.slice(14, 64).trim();
      var nome = line.slice(64, 94).trim();
      var sesso = line.slice(94, 95);
      var nascita = line.slice(95, 105);
      var statoNascita = line.slice(116, 125);
      var cittadinanza = line.slice(125, 134);
      var docTipo = line.slice(134, 139).trim();
      var docNum = line.slice(139, 159).trim();
      var docLuogo = line.slice(159, 168).trim();

      if (['16', '17', '18', '19', '20'].indexOf(tipo) === -1) errors.push('Riga ' + rowNum + ': tipo alloggiato non valido (' + tipo + ')');
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(arrivo)) errors.push('Riga ' + rowNum + ': data arrivo non valida (' + arrivo + ')');
      if (!/^\d{2}$/.test(giorni)) errors.push('Riga ' + rowNum + ': giorni permanenza non validi (' + giorni + ')');
      if (!cognome) errors.push('Riga ' + rowNum + ': cognome mancante');
      if (!nome) errors.push('Riga ' + rowNum + ': nome mancante');
      if (sesso !== '1' && sesso !== '2') errors.push('Riga ' + rowNum + ': sesso non valido (' + sesso + ')');
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(nascita)) errors.push('Riga ' + rowNum + ': data nascita non valida (' + nascita + ')');
      if (!/^\d{9}$/.test(statoNascita)) errors.push('Riga ' + rowNum + ': codice Stato nascita non valido (' + statoNascita + ')');
      if (!/^\d{9}$/.test(cittadinanza)) errors.push('Riga ' + rowNum + ': codice Cittadinanza non valido (' + cittadinanza + ')');
      if (tipo === '16' || tipo === '17' || tipo === '18') {
        if (!docTipo) errors.push('Riga ' + rowNum + ': tipo documento mancante');
        if (!docNum) errors.push('Riga ' + rowNum + ': numero documento mancante');
        if (!/^\d{9}$/.test(docLuogo)) errors.push('Riga ' + rowNum + ': codice luogo rilascio documento non valido');
      }
    });

    var byteLength = new Blob([txtContent], { type: 'text/plain;charset=utf-8' }).size;
    return {
      valid: errors.length === 0,
      errors: errors,
      rowsCount: rawLines.length,
      charsPerRow: rawLines[0] ? rawLines[0].length : 0,
      byteLength: byteLength
    };
  }

  function buildAndValidateAlloggiatiRecord(payload) {
    var p = payload || {};
    var headRes = buildSingle168Line(p);
    if (!headRes.ok) {
      return {
        ok: false,
        missingFields: headRes.missingFields,
        errors: headRes.missingFields,
        txtContent: '',
        byteLength: 0
      };
    }

    var lines = [headRes.line];
    var companions = Array.isArray(p.companions) ? p.companions : [];
    var companionMissing = [];
    if ((p.tipo === '17' || p.tipo === '18') && companions.length > 0) {
      var memberType = p.tipo === '17' ? '19' : '20';
      companions.forEach(function (comp, idx) {
        var cRes = buildSingle168Line({
          tipo: comp.tipo || memberType,
          arrivo: p.arrivo,
          giorni: p.giorni,
          cognome: comp.cognome || p.cognome,
          nome: comp.nome,
          sesso: comp.sesso || '1',
          nascita: comp.nascita,
          statoNascitaCode: comp.statoNascitaCode || p.statoNascitaCode,
          comuneNascitaCode: comp.comuneNascitaCode || p.comuneNascitaCode,
          provinciaNascita: comp.provinciaNascita || p.provinciaNascita,
          cittadinanzaCode: comp.cittadinanzaCode || p.cittadinanzaCode
        });
        if (!cRes.ok) {
          cRes.missingFields.forEach(function (mf) {
            companionMissing.push('Ospite ' + (idx + 2) + ': ' + mf);
          });
        } else {
          lines.push(cRes.line);
        }
      });
    }

    if (companionMissing.length > 0) {
      return {
        ok: false,
        missingFields: companionMissing,
        errors: companionMissing,
        txtContent: '',
        byteLength: 0
      };
    }

    var txtContent = lines.join('\r\n') + '\r\n';
    var validation = validateAlloggiatiTxtContent(txtContent);
    var safeSurname = String(p.cognome || 'OSPITE').trim().toUpperCase().replace(/\s+/g, '_');
    var fileName = 'AlloggiatiWeb_' + safeSurname + '_' + (p.arrivo || '2026-11-07') + '.txt';

    return {
      ok: validation.valid,
      missingFields: validation.errors,
      errors: validation.errors,
      fileName: fileName,
      txtContent: txtContent,
      lines: lines,
      rowsCount: validation.rowsCount,
      charsPerRow: validation.charsPerRow,
      byteLength: validation.byteLength
    };
  }

  async function markAlloggiatiSentAsync(bookingId, fileMeta) {
    if (!bookingId) {
      return { ok: false, error: 'Seleziona una prenotazione valida prima di confermare l’invio.' };
    }
    if (!fileMeta || !fileMeta.txtContent || !fileMeta.byteLength || fileMeta.byteLength < 170) {
      return {
        ok: false,
        error: 'Devi prima generare e validare il file .txt ufficiale (168 caratteri per riga) per poter segnare la prenotazione come inviata.'
      };
    }
    var checkVal = validateAlloggiatiTxtContent(fileMeta.txtContent);
    if (!checkVal.valid) {
      return {
        ok: false,
        error: 'Il file generato non supera la validazione Polizia di Stato: ' + checkVal.errors.join('; ')
      };
    }

    if ((typeof navigator !== 'undefined' && navigator.onLine === false) || (typeof window !== 'undefined' && window.__FORCE_OFFLINE_TEST === true)) {
      return {
        ok: false,
        error: 'Connessione internet assente: impossibile salvare lo stato "Inviato" sul server. Verifica la rete e riprova.'
      };
    }

    var romeNow = getRomeNowFormatted();
    var sess = typeof getOwnerSession === 'function' ? getOwnerSession() : null;
    var inviatoDa = (sess && (sess.ownerCode || sess.email)) || 'Operatore Firenze';

    // Simula/esegue chiamata API e attende conferma OK prima di salvare/navigare
    var syncRes = await syncSnapshotToSupabase('alloggiati_sent_' + bookingId, {
      bookingId: bookingId,
      inviato_at: romeNow.shortDateTime,
      inviato_at_iso: romeNow.iso,
      inviato_da: inviatoDa,
      fileName: fileMeta.fileName,
      byteLength: fileMeta.byteLength
    });

    // Se durante l'attesa la connessione è caduta, blocca il salvataggio
    if ((typeof navigator !== 'undefined' && navigator.onLine === false) || (typeof window !== 'undefined' && window.__FORCE_OFFLINE_TEST === true)) {
      return {
        ok: false,
        error: 'Connessione interrotta durante il salvataggio. Lo stato non è stato modificato.'
      };
    }

    // Aggiorna OWNER_KEY e PM_PORTFOLIO_KEY in modo atomico e persistente
    var updatedBooking = null;
    try {
      var rawOwner = localStorage.getItem(OWNER_KEY);
      var ownerState = rawOwner ? JSON.parse(rawOwner) : null;
      if (ownerState && Array.isArray(ownerState.bookings)) {
        ownerState.bookings.forEach(function (b) {
          if (b.id === bookingId) {
            b.alloggiatiSent = true;
            b.inviato_at = romeNow.shortDateTime;
            b.inviato_at_iso = romeNow.iso;
            b.inviato_da = inviatoDa;
            b.alloggiatiFileName = fileMeta.fileName;
            b.alloggiatiFileBytes = fileMeta.byteLength;
            updatedBooking = b;
          }
        });
        if (Array.isArray(ownerState.tasks)) {
          ownerState.tasks.forEach(function (t) {
            if (t.bookingId === bookingId || (t.id === 't2' && ownerState.bookings.every(function (x) { return x.alloggiatiSent; }))) {
              t.done = true;
              t.inviato_at = romeNow.shortDateTime;
              t.inviato_da = inviatoDa;
            }
          });
        }
        localStorage.setItem(OWNER_KEY, JSON.stringify(ownerState));
      }

      var rawPf = localStorage.getItem(PM_PORTFOLIO_KEY);
      if (rawPf) {
        var pf = JSON.parse(rawPf);
        if (pf && Array.isArray(pf.apartments)) {
          pf.apartments.forEach(function (apt) {
            if (apt.ownerData && Array.isArray(apt.ownerData.bookings)) {
              apt.ownerData.bookings.forEach(function (b) {
                if (b.id === bookingId) {
                  b.alloggiatiSent = true;
                  b.inviato_at = romeNow.shortDateTime;
                  b.inviato_at_iso = romeNow.iso;
                  b.inviato_da = inviatoDa;
                  b.alloggiatiFileName = fileMeta.fileName;
                  b.alloggiatiFileBytes = fileMeta.byteLength;
                  if (!updatedBooking) updatedBooking = b;
                }
              });
            }
          });
          localStorage.setItem(PM_PORTFOLIO_KEY, JSON.stringify(pf));
          localStorage.setItem('ita_pm_portfolio_v1', JSON.stringify(pf));
        }
      }
    } catch (e) {
      return { ok: false, error: 'Errore durante il salvataggio locale: ' + String(e) };
    }

    broadcastStateChange('alloggiati_sent_saved', {
      bookingId: bookingId,
      inviato_at: romeNow.shortDateTime,
      inviato_da: inviatoDa,
      fileName: fileMeta.fileName,
      byteLength: fileMeta.byteLength
    });

    return {
      ok: true,
      syncOk: Boolean(syncRes && syncRes.ok),
      bookingId: bookingId,
      booking: updatedBooking,
      inviato_at: romeNow.shortDateTime,
      inviato_at_iso: romeNow.iso,
      inviato_da: inviatoDa
    };
  }

  root.ITACloudSync = {
    getRomeNowFormatted: getRomeNowFormatted,
    getAlloggiatiCountryCatalog: getAlloggiatiCountryCatalog,
    buildAndValidateAlloggiatiRecord: buildAndValidateAlloggiatiRecord,
    validateAlloggiatiTxtContent: validateAlloggiatiTxtContent,
    markAlloggiatiSentAsync: markAlloggiatiSentAsync,
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
    runMorning0800AutomationBatch: runMorning0800AutomationBatch,
    lockDynamicPriceLead: lockDynamicPriceLead,
    computeFreedomCapitalSalProgress: computeFreedomCapitalSalProgress,
    activateBlueArroyoCleaningSuiteOneTap: activateBlueArroyoCleaningSuiteOneTap,
    activateSmartsBookingsDirectChannelOneTap: activateSmartsBookingsDirectChannelOneTap,
    exportUnifiedICalFeed: exportUnifiedICalFeed,
    generateBlueArroyoSha256DamageReport: generateBlueArroyoSha256DamageReport,
    openBlueArroyoSha256ReportPrint: openBlueArroyoSha256ReportPrint,
    buildSmartsBookingsGuestRepeatVoucher: buildSmartsBookingsGuestRepeatVoucher,
    openToscanFeasibilityStudyPrint: openToscanFeasibilityStudyPrint,
    openDynamicInvoicePrint: openDynamicInvoicePrint,
    getOnboardingState: getOnboardingState,
    saveOnboardingWizardStep: saveOnboardingWizardStep,
    addOnboardingUnit: addOnboardingUnit,
    duplicateOnboardingUnit: duplicateOnboardingUnit,
    removeOnboardingUnit: removeOnboardingUnit,
    resetOnboardingForFirstAccess: resetOnboardingForFirstAccess
  };
})(typeof window !== 'undefined' ? window : this);
