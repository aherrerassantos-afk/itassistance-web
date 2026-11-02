/**
 * cloud-sync.js — Motore Sincronizzazione Cloud (Supabase) & Automazione Report 08:00 (n8n / WhatsApp / Email)
 * Connette in tempo reale l'Area Proprietario (/app.html) e la Console Super Admin (/admin.html).
 */
(function (root) {
  'use strict';

  var OWNER_KEY = 'itassistance_owner_app_v1';
  var ADMIN_KEY = 'itassistance_superadmin_v1';
  var REPORT_LOG_KEY = 'itassistance_daily_report_logs_v1';
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

  // Notifica le altre schede aperte (es. Admin <-> App Proprietario)
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
      '☀️ *REPORT DEL GIORNO — itassistance (Ore 08:00)*',
      '🏠 Immobile: *' + apt.name + '* (' + apt.address + ')',
      '🆔 CIN: ' + (apt.cin || 'Non inserito'),
      '⏱️ Tempo stimato oggi: *~' + (pending.length > 0 ? (pending.length * 2 + 1) : 1) + ' minuti*',
      '',
      '📋 *COSE DA FARE OGGI (' + pending.length + ' da completare, ' + doneCount + ' già fatte):*'
    ];

    if (pending.length === 0) {
      lines.push('✅ Tutto completato! Il tuo appartamento è 100% in regola oggi.');
    } else {
      pending.forEach(function (t, idx) {
        lines.push((idx + 1) + '. *' + t.title + '* — ' + t.desc);
      });
    }

    if (pendingAlloggiati.length > 0) {
      lines.push('');
      lines.push('🛂 *Attenzione Alloggiati Web (Polizia di Stato):* ' + pendingAlloggiati.length + ' prenotazione/i da trasmettere entro 24h dal check-in.');
    }

    lines.push('');
    lines.push('👉 *Apri la tua Area Proprietario per completare in 1 tap:*');
    lines.push('https://www.itadreamteam.com/app.html');
    lines.push('');
    lines.push('💬 Supporto Firenze (09:00–23:00): +39 351 038 0392');

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
        webhookStatus: webhookOk ? 'Inviato via Cloud n8n ✓' : 'Pronto / Inviato in locale ✓'
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
      var subj = encodeURIComponent('☀️ Report del Giorno (08:00) — ' + payload.apartmentName + ' | itassistance');
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
        time: '🔔 Dal Team Firenze · Oggi',
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
    var amountEur = isAnnual ? 1188 : 99;
    var invoiceId = 'FATT-2026-' + Math.floor(110 + Math.random() * 890);

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

    try {
      localStorage.setItem(OWNER_KEY, JSON.stringify(ownerState));
      localStorage.setItem('itassistance_last_activation', JSON.stringify({
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
        amountEur: amountEur,
        addon10Active: ownerState.apartment.addon10Active
      }));
    } catch (e) {}

    // 2. Registra automaticamente Cliente e Fattura in Console Super Admin (/admin.html)
    try {
      var rawAdm = localStorage.getItem(ADMIN_KEY);
      var adm = rawAdm ? JSON.parse(rawAdm) : null;
      if (adm && adm.partners && adm.invoices) {
        var planLabel = (isAnnual ? '1.188 €/anno Anticipato' : '99 €/mese Base') +
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
            ? 'Canone Annuale Anticipato App itassistance (1.188,00 € IVA inclusa)'
            : 'Canone Mensile App itassistance (99,00 € IVA inclusa)') +
            (d.extraRevenue ? ' + Attivazione Extra +10% Revenue Management & Adempimenti di Legge' : ''),
          total: amountEur,
          method: 'Stripe Checkout (Garanzia 14gg attiva fino al ' + guaranteeEnd.toLocaleDateString('it-IT') + ')',
          status: 'Pagata'
        });

        localStorage.setItem(ADMIN_KEY, JSON.stringify(adm));
      }
    } catch (e) {}

    // 3. Sincronizza su Supabase e notifica le schede aperte
    await syncSnapshotToSupabase('checkout_onboarding', ownerState);
    broadcastStateChange('new_owner_activated', { invoiceId: invoiceId, apartment: ownerState.apartment.name });

    return {
      ok: true,
      invoiceId: invoiceId,
      guaranteeUntil: ownerState.apartment.guaranteeUntil
    };
  }

  // Punto 3: Ricezione dati documento ospite dal Self Check-in (/ospiti.html) -> precompila Alloggiati Web in /app.html
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
          time: '🛂 Documenti Ospite Ricevuti · Pronti per Alloggiati Web',
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

  root.ITACloudSync = {
    syncSnapshotToSupabase: syncSnapshotToSupabase,
    broadcastStateChange: broadcastStateChange,
    onLiveSync: onLiveSync,
    buildDailyReportMessage: buildDailyReportMessage,
    dispatchDailyReport0800: dispatchDailyReport0800,
    pushTaskFromAdminToOwner: pushTaskFromAdminToOwner,
    getReportLogs: getReportLogs,
    activateNewOwnerFromCheckout: activateNewOwnerFromCheckout,
    saveGuestCheckinSubmission: saveGuestCheckinSubmission
  };
})(typeof window !== 'undefined' ? window : this);
