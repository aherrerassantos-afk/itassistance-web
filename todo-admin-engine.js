/**
 * todo-admin-engine.js — Modulo Condiviso To-Do List Amministrativa & Operativa (itassistance)
 *
 * Implementa in modo additivo (senza sovrascrivere il lavoro di Agente 1 su Alloggiati Web
 * e Agente 2 sul Wizard / Revenue Automatico):
 *   A. To-Do "Report Revenue Plan" (settimanale lunedì mattina e mensile giorno 1, per unità e struttura, PDF)
 *   B. To-Do "Fatture Fornitori da Saldare" (SDI/PDF, scadute in rosso in cima, oggi, <=7gg, totale settimana, anti-duplicato)
 *   C. To-Do "Approvazione Preventivi Spese Extra" (flusso Bozza -> Fatturato, soglie Manager/Titolare/Proprietario, alert >24h)
 *   D. Regole comuni To-Do List (4 sezioni con contatori, permessi per ruolo, "Fatte oggi" fino a mezzanotte,
 *      badge menu, riepilogo giornaliero ore 08:30 Europe/Rome, storico audit chi/quando/cosa).
 */
(function (root) {
  'use strict';

  var TODO_ADMIN_STORAGE_KEY = 'itassistance_todo_admin_v1';
  var OWNER_APP_STORAGE_KEY = 'itassistance_owner_app_v1';
  var OFFICIAL_LOCATIONS = {
    brandName: 'ITASSISTANCEDREAMTEAM.IT',
    companyLegalHeader: 'BLUEARROYO S.R.L. – Sede legale: Via Matteo Palmieri 20/R, 50122 Firenze (FI) · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.',
    officeName: 'Sede legale BLUEARROYO S.R.L.',
    officeAddress: 'Via Matteo Palmieri 20/R, 50122 Firenze (FI)',
    vatAndTaxCode: '07480210488',
    reaCode: 'FI-706161',
    sdiCode: 'M5UXCR1',
    pec: 'bluearroyosrl@pec.it',
    shareCapital: '€ 50.000,00 i.v.',
    paymentTerms: 'Saldo a vista / entro 5 giorni lavorativi tramite bonifico bancario',
    adminEmail: 'admin@bluearroyo.it',
    guestSupportEmail: 'itassistance@bluearroyo.it',
    guestSupportPhone: '+39 349 177 5561',
    suppliersManagerPhone: '+39 349 804 1146',
    hrSuppliersEmail: 'risorseumane@bluearroyo.it',
    warehouseName: 'Magazzino Operativo & Biancheria PBA (Solo Uso Interno)',
    warehouseAddress: 'Via dell\'Agnolo 72R, Firenze',
    internalOnly: true
  };

  /* ================================================================
     UTILITÀ DATA, ORA E VALUTA (Fuso Europe/Rome, Valuta EUR)
     ================================================================ */
  function getRomeNow() {
    return new Date();
  }

  function formatRomeDateTime(dateInput) {
    var d = dateInput ? new Date(dateInput) : getRomeNow();
    if (isNaN(d.getTime())) d = getRomeNow();
    try {
      return new Intl.DateTimeFormat('it-IT', {
        timeZone: 'Europe/Rome',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(d);
    } catch (e) {
      return d.toLocaleString('it-IT');
    }
  }

  function getRomeTodayIso() {
    try {
      var parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Rome',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(getRomeNow());
      var y = '2026', m = '11', day = '08';
      parts.forEach(function (p) {
        if (p.type === 'year') y = p.value;
        if (p.type === 'month') m = p.value;
        if (p.type === 'day') day = p.value;
      });
      return y + '-' + m + '-' + day;
    } catch (e) {
      return new Date().toISOString().slice(0, 10);
    }
  }

  function addDaysIso(baseIso, daysOffset) {
    var d = new Date(baseIso + 'T12:00:00');
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().slice(0, 10);
  }

  function diffDaysFromToday(targetIso) {
    var todayIso = getRomeTodayIso();
    var t1 = new Date(todayIso + 'T12:00:00').getTime();
    var t2 = new Date(targetIso + 'T12:00:00').getTime();
    return Math.round((t2 - t1) / 86400000);
  }

  function formatEurCurrency(val) {
    var num = Number(val || 0);
    return num.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  function formatIsoIt(isoStr) {
    if (!isoStr || isoStr.indexOf('-') === -1) return isoStr || '';
    var p = isoStr.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }

  function isSameRomeDay(isoTimestamp) {
    if (!isoTimestamp) return false;
    var todayIso = getRomeTodayIso();
    return String(isoTimestamp).slice(0, 10) === todayIso;
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ================================================================
     INTERFACCIA / STUB MODULO REVENUE (AGENTE 2)
     Legge i dati reali dal modulo Revenue di Agente 2 se presente,
     altrimenti usa il ponte ITACloudSync / stub strutturato senza
     duplicare la logica di calcolo.
     ================================================================ */
  var ITARevenueModuleAdapter = {
    isAgent2ModuleReady: function () {
      return Boolean(root.ITARevenueEngine || (root.ITACloudSync && root.ITACloudSync.computeBehavioralCalendarMatrix));
    },
    getRevenueSnapshotForReport: function () {
      if (root.ITARevenueEngine && typeof root.ITARevenueEngine.getReportData === 'function') {
        return root.ITARevenueEngine.getReportData();
      }
      var cmMatrix = (root.ITACloudSync && typeof root.ITACloudSync.computeBehavioralCalendarMatrix === 'function')
        ? root.ITACloudSync.computeBehavioralCalendarMatrix()
        : null;
      var floorRate = (cmMatrix && cmMatrix.state && cmMatrix.state.floorRate) || 118;
      var ceilingRate = (cmMatrix && cmMatrix.state && cmMatrix.state.ceilingRate) || 320;
      var avgRate = (cmMatrix && cmMatrix.kpi && cmMatrix.kpi.avgDynamicRate) || 178;

      return {
        source: 'ITARevenueModuleAdapter (Interfaccia Condivisa Agente 2)',
        weekNumber: 45,
        monthLabel: 'Novembre 2026',
        structureTotals: {
          occupancyPct: 84.5,
          adrEur: avgRate,
          revParEur: Math.round(avgRate * 0.845 * 100) / 100,
          vsPrevPeriodPct: '+11,8%',
          vsLastYearPct: '+18,5%',
          guardrailMinEur: floorRate,
          guardrailMaxEur: ceilingRate,
          appliedMinEur: Math.max(floorRate, 132),
          appliedMaxEur: Math.min(ceilingRate, 265),
          emptyNights30: 4,
          emptyNights60: 11,
          emptyNights90: 19,
          channelRevenue: {
            'Booking.com': 2640,
            'Airbnb': 2310,
            'Expedia / Vrbo': 690,
            'Motore Diretto': 1580
          }
        },
        units: [
          {
            unitId: 'unit_santo_spirito',
            unitName: 'Appartamento Santo Spirito · Camera 3',
            ownerId: 'owner_1',
            ownerName: 'Marco Rossi',
            occupancyPct: 88.0,
            adrEur: avgRate,
            revParEur: Math.round(avgRate * 0.88 * 100) / 100,
            vsPrevPeriodPct: '+14,2%',
            vsLastYearPct: '+19,4%',
            guardrailMinEur: floorRate,
            guardrailMaxEur: ceilingRate,
            appliedMinEur: 138,
            appliedMaxEur: 248,
            emptyNights30: 1,
            emptyNights60: 3,
            emptyNights90: 6,
            channelRevenue: {
              'Booking.com': 1150,
              'Airbnb': 980,
              'Expedia / Vrbo': 240,
              'Motore Diretto': 760
            },
            pendingSuggestions: [
              { id: 'sug_1', dates: '13–15 Nov 2026', currentEur: 165, suggestedEur: 198, reason: 'Picco domanda weekend centro storico (+20%)' },
              { id: 'sug_2', dates: '18 Nov 2026', currentEur: 165, suggestedEur: 142, reason: 'Sblocco notte orfana singola tra due check-in (-14%)' }
            ]
          },
          {
            unitId: 'unit_oltrarno',
            unitName: 'Suite Palazzo Oltrarno',
            ownerId: 'owner_1',
            ownerName: 'Marco Rossi',
            occupancyPct: 82.0,
            adrEur: 195,
            revParEur: 159.9,
            vsPrevPeriodPct: '+9,5%',
            vsLastYearPct: '+16,8%',
            guardrailMinEur: 140,
            guardrailMaxEur: 380,
            appliedMinEur: 152,
            appliedMaxEur: 265,
            emptyNights30: 1,
            emptyNights60: 4,
            emptyNights90: 6,
            channelRevenue: {
              'Booking.com': 890,
              'Airbnb': 840,
              'Expedia / Vrbo': 210,
              'Motore Diretto': 520
            },
            pendingSuggestions: [
              { id: 'sug_3', dates: '28–29 Nov 2026', currentEur: 195, suggestedEur: 260, reason: 'Evento Firenze Marathon: rialzo protetto entro Cap (+33%)' }
            ]
          },
          {
            unitId: 'unit_santa_croce',
            unitName: 'Santa Croce Design Loft',
            ownerId: 'owner_2',
            ownerName: 'Elena Guicciardini',
            occupancyPct: 79.5,
            adrEur: 158,
            revParEur: 125.6,
            vsPrevPeriodPct: '+10,1%',
            vsLastYearPct: '+17,2%',
            guardrailMinEur: 108,
            guardrailMaxEur: 290,
            appliedMinEur: 124,
            appliedMaxEur: 215,
            emptyNights30: 2,
            emptyNights60: 4,
            emptyNights90: 7,
            channelRevenue: {
              'Booking.com': 600,
              'Airbnb': 490,
              'Expedia / Vrbo': 240,
              'Motore Diretto': 300
            },
            pendingSuggestions: [
              { id: 'sug_4', dates: '20–22 Nov 2026', currentEur: 150, suggestedEur: 174, reason: 'Anticipo prenotazione internazionale (+16%)' }
            ]
          }
        ]
      };
    }
  };

  /* ================================================================
     STATO PREDEFINITO SCHEMA DATI (FATTURE PASSIVE, PREVENTIVI, REPORT)
     ================================================================ */
  function getDefaultTodoAdminState() {
    var todayIso = getRomeTodayIso();
    var snap = ITARevenueModuleAdapter.getRevenueSnapshotForReport();
    var twoDaysAgoIso = addDaysIso(todayIso, -2);
    var threeDaysAheadIso = addDaysIso(todayIso, 3);
    var fiveDaysAheadIso = addDaysIso(todayIso, 5);
    var urgent26hAgoIso = new Date(getRomeNow().getTime() - 26 * 3600 * 1000).toISOString();
    var urgent29hAgoIso = new Date(getRomeNow().getTime() - 29 * 3600 * 1000).toISOString();
    var normal4hAgoIso = new Date(getRomeNow().getTime() - 4 * 3600 * 1000).toISOString();

    return {
      schemaVersion: '1.0.0',
      officialLocations: OFFICIAL_LOCATIONS,
      currentRole: 'titolare', // 'titolare' | 'manager' | 'proprietario' | 'fornitore'
      currentUserLabels: {
        titolare: 'Marco Rossi (Titolare / Admin Struttura)',
        manager: 'Sofia Conti (Manager / Receptionist)',
        proprietario: 'Marco Rossi (Proprietario · Unità Santo Spirito & Oltrarno)',
        fornitore: 'Idraulica Termo Firenze SRL (Fornitore Accreditato)'
      },
      permissions: {
        managerApprovalLimitEur: 500, // Fino a 500 € approva il Manager; oltre serve il Titolare
        receptionistViewRevenueAndPayments: false, // Il receptionist non vede fatture e revenue se non abilitato
        activeOwnerId: 'owner_1' // Proprietario vede solo le proprie unità
      },
      dailySummary0830: {
        scheduledTimeRome: '08:30',
        lastSentDate: todayIso,
        lastSentChannel: 'Email + Notifica App (08:30 Europe/Rome)',
        enabled: true
      },

      /* A. SCHEMA REPORT REVENUE PLAN (Settimanale Lunedì & Mensile Giorno 1) */
      revenueReports: [
        {
          id: 'rev_week_45_2026',
          type: 'settimanale',
          scheduleRule: 'Ogni lunedì mattina ore 07:30 Europe/Rome',
          weekNumber: 45,
          periodLabel: 'Settimana 45 (Lunedì mattina)',
          title: 'Revenue plan settimana 45 pronto – da controllare',
          generatedAt: formatRomeDateTime(new Date(getRomeNow().getTime() - 2 * 3600 * 1000)),
          status: 'da_controllare',
          suggestionsApproved: false,
          completedTodayAt: null,
          snapshot: snap
        },
        {
          id: 'rev_month_11_2026',
          type: 'mensile',
          scheduleRule: 'Giorno 1 del mese ore 07:30 Europe/Rome',
          weekNumber: null,
          periodLabel: 'Mensile · Giorno 1 Novembre 2026',
          title: 'Revenue plan mensile Novembre 2026 pronto – da controllare',
          generatedAt: '01/11/2026, 07:30',
          status: 'da_controllare',
          suggestionsApproved: false,
          completedTodayAt: null,
          snapshot: snap
        }
      ],

      /* B. SCHEMA FATTURE PASSIVE FORNITORI DA SALDARE (SDI / PDF / XML) */
      supplierInvoices: [
        {
          id: 'inv_pas_1',
          supplierName: 'Lavanderia Industriale Il Giglio SRL',
          invoiceNumber: 'FPA-2026/884',
          sourceFormat: 'SDI XML',
          issueDate: addDaysIso(todayIso, -18),
          dueDate: twoDaysAgoIso, // SCADUTA (in rosso, in cima!)
          netAmount: 310.00,
          vatAmount: 68.20,
          totalAmount: 378.20,
          iban: '[DA CONFERMARE]',
          unitId: 'unit_santo_spirito',
          unitName: 'Appartamento Santo Spirito · Camera 3',
          ownerId: 'owner_1',
          costCenter: 'Biancheria & Lavanderia 60°C',
          status: 'da_saldare',
          linkedQuoteId: null,
          paymentInfo: null,
          postponeInfo: null,
          disputeInfo: null,
          completedTodayAt: null
        },
        {
          id: 'inv_pas_2',
          supplierName: 'Blue Arroyo Cleaning SRL',
          invoiceNumber: 'SDI-2026/1190',
          sourceFormat: 'SDI XML',
          issueDate: addDaysIso(todayIso, -4),
          dueDate: threeDaysAheadIso, // SCADENZA FRA 3 GIORNI (Test di accettazione!)
          netAmount: 350.00,
          vatAmount: 77.00,
          totalAmount: 427.00,
          iban: '[DA CONFERMARE]',
          unitId: 'unit_oltrarno',
          unitName: 'Suite Palazzo Oltrarno',
          ownerId: 'owner_1',
          costCenter: 'Pulizie Turnover & Sanificazione (Magazzino Via dell\'Agnolo 72R, Firenze)',
          status: 'da_saldare',
          linkedQuoteId: null,
          paymentInfo: null,
          postponeInfo: null,
          disputeInfo: null,
          completedTodayAt: null
        },
        {
          id: 'inv_pas_3',
          supplierName: 'Toscana Energia & Utenze SPA',
          invoiceNumber: 'FE-2026/4102',
          sourceFormat: 'PDF / XML',
          issueDate: addDaysIso(todayIso, -10),
          dueDate: todayIso, // IN SCADENZA OGGI
          netAmount: 200.00,
          vatAmount: 44.00,
          totalAmount: 244.00,
          iban: '[DA CONFERMARE]',
          unitId: 'unit_santo_spirito',
          unitName: 'Appartamento Santo Spirito · Camera 3',
          ownerId: 'owner_1',
          costCenter: 'Utenze Struttura',
          status: 'da_saldare',
          linkedQuoteId: null,
          paymentInfo: null,
          postponeInfo: null,
          disputeInfo: null,
          completedTodayAt: null
        },
        {
          id: 'inv_pas_4',
          supplierName: 'Forniture Alberghiere Firenze SRL',
          invoiceNumber: 'FPA-2026/912',
          sourceFormat: 'SDI XML',
          issueDate: addDaysIso(todayIso, -2),
          dueDate: fiveDaysAheadIso, // ENTRO 7 GIORNI
          netAmount: 150.00,
          vatAmount: 33.00,
          totalAmount: 183.00,
          iban: '[DA CONFERMARE]',
          unitId: 'unit_santa_croce',
          unitName: 'Santa Croce Design Loft',
          ownerId: 'owner_2',
          costCenter: 'Dotazioni & Kit Cortesia',
          status: 'da_saldare',
          linkedQuoteId: null,
          paymentInfo: null,
          postponeInfo: null,
          disputeInfo: null,
          completedTodayAt: null
        }
      ],

      /* C. SCHEMA PREVENTIVI SPESE EXTRA DA APPROVARE */
      extraQuotes: [
        {
          id: 'quo_350_idraulico',
          title: 'Preventivo €350 – Idraulico, Camera 3 – da approvare',
          interventionType: 'Idraulico',
          unitId: 'unit_santo_spirito',
          unitName: 'Camera 3 (Appartamento Santo Spirito)',
          ownerId: 'owner_1',
          amount: 350.00,
          urgency: 'urgente',
          createdAtIso: urgent26hAgoIso, // > 24h fa -> Evidenziato!
          createdBy: 'Idraulica Termo Firenze SRL (Fornitore)',
          createdByEmail: 'interventi@termofirenze.it',
          reason: 'Sostituzione urgente cartuccia miscelatore termostatico doccia e tenuta sifone a pavimento Camera 3.',
          attachments: ['foto_perdita_box_doccia_cam3.jpg', 'preventivo_idraulico_350eur.pdf'],
          chargeTo: 'struttura',
          status: 'In approvazione',
          managerApproved: false,
          titolareApproved: false,
          ownerApproved: true,
          decisionNote: '',
          linkedInvoiceId: null,
          completedTodayAt: null
        },
        {
          id: 'quo_200_manager',
          title: 'Preventivo €200 – Manutenzione Clima, Suite Oltrarno – da approvare',
          interventionType: 'Manutenzione Clima',
          unitId: 'unit_oltrarno',
          unitName: 'Suite Palazzo Oltrarno',
          ownerId: 'owner_1',
          amount: 200.00, // <= 500 € -> Approvabile direttamente dal Manager!
          urgency: 'normale',
          createdAtIso: normal4hAgoIso,
          createdBy: 'Staff Tecnico Interno (Marco B.)',
          createdByEmail: 'admin@bluearroyo.it',
          reason: 'Pulizia batterie fancoil, sanificazione antibatterica filtri e verifica pressione circuito R32.',
          attachments: ['scheda_check_clima_oltrarno.pdf'],
          chargeTo: 'struttura',
          status: 'In approvazione',
          managerApproved: false,
          titolareApproved: false,
          ownerApproved: true,
          decisionNote: '',
          linkedInvoiceId: null,
          completedTodayAt: null
        },
        {
          id: 'quo_1500_titolare',
          title: 'Preventivo €1.500 – Caldaia Condensazione, Santa Croce Loft – da approvare',
          interventionType: 'Impianto Termico',
          unitId: 'unit_santa_croce',
          unitName: 'Santa Croce Design Loft',
          ownerId: 'owner_2',
          amount: 1500.00, // > 500 € -> Serve il Titolare!
          urgency: 'urgente',
          createdAtIso: urgent29hAgoIso, // > 24h fa -> Evidenziato!
          createdBy: 'Idraulica Termo Firenze SRL (Fornitore)',
          createdByEmail: 'interventi@termofirenze.it',
          reason: 'Sostituzione integrale scheda madre e gruppo scambiatore primario caldaia a condensazione con collaudo fumi.',
          attachments: ['foto_errore_blocco_caldaia.jpg', 'preventivo_caldaia_1500eur.pdf'],
          chargeTo: 'struttura',
          status: 'In approvazione',
          managerApproved: false,
          titolareApproved: false,
          ownerApproved: true,
          decisionNote: '',
          linkedInvoiceId: null,
          completedTodayAt: null
        },
        {
          id: 'quo_420_proprietario',
          title: 'Preventivo €420 – Restauro Persiana, Camera 3 – da approvare',
          interventionType: 'Falegnameria & Infissi',
          unitId: 'unit_santo_spirito',
          unitName: 'Camera 3 (Appartamento Santo Spirito)',
          ownerId: 'owner_1',
          amount: 420.00,
          urgency: 'normale',
          createdAtIso: normal4hAgoIso,
          createdBy: 'Bottega Legno Oltrarno (Fornitore)',
          createdByEmail: 'info@bottegalegnooltrarno.it',
          reason: 'Ripristino cardini a muro e stecche persiana storica lato Via Maggio (spesa straordinaria a carico del proprietario).',
          attachments: ['foto_cardine_persiana.jpg', 'preventivo_falegname_420.pdf'],
          chargeTo: 'proprietario', // A carico del proprietario -> compare nella sua area!
          status: 'In approvazione',
          managerApproved: true,
          titolareApproved: true,
          ownerApproved: false,
          decisionNote: '',
          linkedInvoiceId: null,
          completedTodayAt: null
        }
      ],

      /* D. STORICO AZIONI (AUDIT LOG: CHI, QUANDO, COSA) & NOTIFICHE */
      auditHistory: [
        {
          id: 'aud_init_1',
          whenRome: formatRomeDateTime(new Date(getRomeNow().getTime() - 7200 * 1000)),
          who: 'Sistema Automatico itassistance',
          role: 'sistema',
          what: 'Generato automaticamente "Revenue plan settimana 45 pronto – da controllare" e "Riepilogo giornaliero ore 08:30" (fuso Europe/Rome).'
        },
        {
          id: 'aud_init_2',
          whenRome: formatRomeDateTime(new Date(getRomeNow().getTime() - 5400 * 1000)),
          who: 'Sistema SDI / Fatturazione Passiva',
          role: 'sistema',
          what: 'Acquisite 4 fatture fornitori da saldare (1 scaduta in rosso in cima, 1 in scadenza oggi, 2 entro 7 giorni — Totale settimana: 1.232,20 €).'
        }
      ],

      notificationsSent: [
        {
          id: 'notif_init_1',
          sentAtRome: 'Oggi, 08:30 (Europe/Rome)',
          recipient: 'Titolare, Manager e Proprietari abilitati',
          channel: 'Email + Notifica App 08:30',
          subject: 'Riepilogo To-Do di oggi (Ore 08:30) — Attività operative e amministrative',
          message: 'Pronti in To-Do: 2 Report Revenue Plan, 4 Fatture Fornitori da saldare e 4 Preventivi Spese Extra da approvare.'
        }
      ],

      completedOperationalToday: {}
    };
  }

  /* ================================================================
     CARICAMENTO E SALVATAGGIO STATO CONDIVISO
     ================================================================ */
  function loadTodoAdminState() {
    try {
      var raw = localStorage.getItem(TODO_ADMIN_STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.supplierInvoices) && Array.isArray(parsed.extraQuotes) && Array.isArray(parsed.revenueReports)) {
          return parsed;
        }
      }
    } catch (e) {}
    var def = getDefaultTodoAdminState();
    saveTodoAdminState(def);
    return def;
  }

  function saveTodoAdminState(stateObj) {
    try {
      localStorage.setItem(TODO_ADMIN_STORAGE_KEY, JSON.stringify(stateObj));
      if (root.ITACloudSync && typeof root.ITACloudSync.broadcastStateChange === 'function') {
        root.ITACloudSync.broadcastStateChange('todo_admin_updated', { updatedAt: new Date().toISOString() });
      }
    } catch (e) {}
    return stateObj;
  }

  function recordAuditEntry(stateObj, actionDescription) {
    var st = stateObj || loadTodoAdminState();
    var roleKey = st.currentRole || 'titolare';
    var actorLabel = (st.currentUserLabels && st.currentUserLabels[roleKey]) || roleKey;
    st.auditHistory = st.auditHistory || [];
    st.auditHistory.unshift({
      id: 'aud_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      whenRome: formatRomeDateTime(getRomeNow()),
      who: actorLabel,
      role: roleKey,
      what: actionDescription
    });
    st.auditHistory = st.auditHistory.slice(0, 80);
    return st;
  }

  function sendCreatorNotification(stateObj, recipientLabel, subjectText, bodyText) {
    var st = stateObj || loadTodoAdminState();
    st.notificationsSent = st.notificationsSent || [];
    var notif = {
      id: 'notif_' + Date.now(),
      sentAtRome: formatRomeDateTime(getRomeNow()),
      recipient: recipientLabel,
      channel: 'Email + Notifica App itassistance',
      subject: subjectText,
      message: bodyText
    };
    st.notificationsSent.unshift(notif);
    st.notificationsSent = st.notificationsSent.slice(0, 50);
    return notif;
  }

  /* ================================================================
     REGOLE DI VISIBILITÀ PER RUOLO E PERMESSI
     ================================================================ */
  function getRoleVisibility(stateObj) {
    var st = stateObj || loadTodoAdminState();
    var role = st.currentRole || 'titolare';
    var recEnabled = Boolean(st.permissions && st.permissions.receptionistViewRevenueAndPayments);

    if (role === 'titolare') {
      return {
        canSeeOperativo: true,
        canSeeRevenue: true,
        canSeePagamenti: true,
        canSeeApprovazioni: true,
        onlyOwnerUnits: false,
        ownerIdFilter: null
      };
    }
    if (role === 'manager') {
      return {
        canSeeOperativo: true,
        canSeeRevenue: recEnabled,
        canSeePagamenti: recEnabled,
        canSeeApprovazioni: true,
        onlyOwnerUnits: false,
        ownerIdFilter: null
      };
    }
    if (role === 'proprietario') {
      return {
        canSeeOperativo: true,
        canSeeRevenue: true,
        canSeePagamenti: true,
        canSeeApprovazioni: true,
        onlyOwnerUnits: true,
        ownerIdFilter: (st.permissions && st.permissions.activeOwnerId) || 'owner_1'
      };
    }
    // Ruolo 'fornitore' (accesso limitato: non vede Pagamenti né Revenue)
    return {
      canSeeOperativo: true,
      canSeeRevenue: false,
      canSeePagamenti: false,
      canSeeApprovazioni: true,
      onlyOwnerUnits: false,
      ownerIdFilter: null,
      isSupplierLimited: true
    };
  }

  /* ================================================================
     A. AZIONI REPORT REVENUE PLAN
     ================================================================ */
  function approveRevenueSuggestions(reportId) {
    var st = loadTodoAdminState();
    var target = null;
    st.revenueReports.forEach(function (r) {
      if (r.id === reportId) {
        r.suggestionsApproved = true;
        r.status = 'letto';
        r.completedTodayAt = new Date().toISOString();
        target = r;
      }
    });
    if (!target) return { ok: false };

    recordAuditEntry(
      st,
      'Approvati suggerimenti di prezzo per "' + target.title + '" e applicati entro i limiti min/max del Revenue Automatico.'
    );
    saveTodoAdminState(st);
    return { ok: true, report: target };
  }

  function markRevenueReportAsRead(reportId) {
    var st = loadTodoAdminState();
    var target = null;
    st.revenueReports.forEach(function (r) {
      if (r.id === reportId) {
        r.status = 'letto';
        r.completedTodayAt = new Date().toISOString();
        target = r;
      }
    });
    if (!target) return { ok: false };

    recordAuditEntry(st, 'Segnato come letto il report "' + target.title + '".');
    saveTodoAdminState(st);
    return { ok: true, report: target };
  }

  function exportRevenueReportPdf(reportId, unitFilterId) {
    var st = loadTodoAdminState();
    var vis = getRoleVisibility(st);
    var rep = st.revenueReports.find(function (r) { return r.id === reportId; }) || st.revenueReports[0];
    if (!rep) return { ok: false };

    var snap = rep.snapshot || ITARevenueModuleAdapter.getRevenueSnapshotForReport();
    var units = (snap.units || []).filter(function (u) {
      if (vis.onlyOwnerUnits && u.ownerId !== vis.ownerIdFilter) return false;
      if (unitFilterId && unitFilterId !== 'ALL' && u.unitId !== unitFilterId) return false;
      return true;
    });

    recordAuditEntry(
      st,
      'Esportato PDF "' + rep.title + '" (' + (vis.onlyOwnerUnits ? 'Vista Proprietario: solo proprie unità' : 'Struttura / Unità') + ').'
    );
    saveTodoAdminState(st);

    var rowsHtml = '';
    units.forEach(function (u) {
      var chText = Object.keys(u.channelRevenue || {}).map(function (k) {
        return k + ': ' + formatEurCurrency(u.channelRevenue[k]);
      }).join(' · ');
      var sugText = (u.pendingSuggestions || []).map(function (s) {
        return s.dates + ': da ' + s.currentEur + ' € a ' + s.suggestedEur + ' € (' + s.reason + ')';
      }).join(' | ') || 'Nessun suggerimento in attesa';

      rowsHtml += '<tr>' +
        '<td><strong>' + escapeHtml(u.unitName) + '</strong></td>' +
        '<td>' + u.occupancyPct + '%</td>' +
        '<td>' + formatEurCurrency(u.adrEur) + '</td>' +
        '<td>' + formatEurCurrency(u.revParEur) + '</td>' +
        '<td>' + u.vsPrevPeriodPct + ' / ' + u.vsLastYearPct + '</td>' +
        '<td>' + u.appliedMinEur + ' € – ' + u.appliedMaxEur + ' €<br/><small>(Limiti: ' + u.guardrailMinEur + ' € – ' + u.guardrailMaxEur + ' €)</small></td>' +
        '<td>30gg: ' + u.emptyNights30 + ' · 60gg: ' + u.emptyNights60 + ' · 90gg: ' + u.emptyNights90 + '</td>' +
      '</tr>' +
      '<tr><td colspan="7" style="background:#F5F3FF;font-size:12px;"><strong>Ricavo per canale:</strong> ' + chText + '<br/><strong>Suggerimenti di prezzo:</strong> ' + sugText + '</td></tr>';
    });

    var tot = snap.structureTotals || {};
    var totChannelsHtml = Object.keys(tot.channelRevenue || {}).map(function (cKey) {
      return '<span><strong>' + escapeHtml(cKey) + ':</strong> ' + formatEurCurrency(tot.channelRevenue[cKey]) + '</span>';
    }).join(' · ');

    var htmlDoc = '<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>' + escapeHtml(rep.title) + ' — ITASSISTANCEDREAMTEAM.IT</title>' +
      '<style>body{font-family:Inter,sans-serif;padding:28px;color:#1E1035;line-height:1.5;max-width:960px;margin:0 auto}' +
      'h1{font-size:22px;margin-bottom:4px}table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}' +
      'th,td{border:1px solid #7C3AED;padding:8px;text-align:left;vertical-align:top}th{background:#1E1035;color:#FFF}' +
      '.kpi-box{background:#F5F3FF;border:2px solid #7C3AED;border-radius:10px;padding:14px;margin:12px 0}</style></head><body>' +
      '<div style="font-size:12px;font-weight:700;color:#5B21B6;">ITASSISTANCEDREAMTEAM.IT · REPORT REVENUE PLAN AUTOMATICO · FUSO EUROPE/ROME</div>' +
      '<h1>' + escapeHtml(rep.title) + '</h1>' +
      '<p>Periodo: <strong>' + escapeHtml(rep.periodLabel) + '</strong> · Generato il: <strong>' + escapeHtml(rep.generatedAt) + '</strong> · Stato suggerimenti: <strong>' + (rep.suggestionsApproved ? 'Approvati' : 'In attesa di revisione') + '</strong></p>' +
      (!vis.onlyOwnerUnits ? (
        '<div class="kpi-box"><strong>Totale Struttura:</strong> Occupazione: <strong>' + tot.occupancyPct + '%</strong> · ADR: <strong>' + formatEurCurrency(tot.adrEur) + '</strong> · RevPAR: <strong>' + formatEurCurrency(tot.revParEur) + '</strong> · Vs periodo prec.: <strong>' + tot.vsPrevPeriodPct + '</strong> · Vs anno scorso: <strong>' + tot.vsLastYearPct + '</strong><br/>' +
        'Notti vuote (30 / 60 / 90 gg): <strong>' + tot.emptyNights30 + ' / ' + tot.emptyNights60 + ' / ' + tot.emptyNights90 + '</strong> · Prezzi applicati: <strong>' + tot.appliedMinEur + ' € – ' + tot.appliedMaxEur + ' €</strong> (Guardrail min/max: ' + tot.guardrailMinEur + ' € – ' + tot.guardrailMaxEur + ' €)<br/>' +
        'Ricavi per canale: ' + totChannelsHtml + '</div>'
      ) : '<div class="kpi-box"><strong>Vista Proprietario:</strong> Report filtrato esclusivamente sulle unità di tua proprietà.</div>') +
      '<table><thead><tr><th>Unità</th><th>Occupazione</th><th>ADR</th><th>RevPAR</th><th>Vs Prec. / Anno Scorso</th><th>Prezzi Applicati vs Min/Max</th><th>Notti Vuote 30/60/90gg</th></tr></thead><tbody>' +
      rowsHtml +
      '</tbody></table>' +
      '<p style="font-size:12px;color:#4C3D63;">Documento generato da ITASSISTANCEDREAMTEAM.IT (BLUEARROYO S.R.L. – Sede legale: Via Matteo Palmieri 20/R, 50122 Firenze (FI) · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.).</p>' +
      '</body></html>';

    try {
      var blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Report_Revenue_Plan_' + rep.id + '.pdf.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {}

    return { ok: true, report: rep, htmlDoc: htmlDoc };
  }

  /* ================================================================
     B. AZIONI FATTURE FORNITORI DA SALDARE (SDI / PDF)
     ================================================================ */
  function checkSupplierInvoiceDuplicate(supplierName, invoiceNumber, excludeId) {
    var st = loadTodoAdminState();
    var sClean = String(supplierName || '').trim().toLowerCase();
    var nClean = String(invoiceNumber || '').trim().toLowerCase();
    if (!sClean || !nClean) return null;

    return st.supplierInvoices.find(function (inv) {
      if (excludeId && inv.id === excludeId) return false;
      return inv.supplierName.trim().toLowerCase() === sClean &&
             inv.invoiceNumber.trim().toLowerCase() === nClean;
    }) || null;
  }

  function addPassiveSupplierInvoice(payload) {
    var p = payload || {};
    var supplier = String(p.supplierName || '').trim();
    var number = String(p.invoiceNumber || '').trim();
    if (!supplier || !number) {
      return { ok: false, error: 'Inserisci il nome del fornitore e il numero della fattura.' };
    }

    var dup = checkSupplierInvoiceDuplicate(supplier, number);
    if (dup && !p.forceDuplicate) {
      return {
        ok: false,
        isDuplicate: true,
        duplicateInvoice: dup,
        error: 'Avviso di duplicato: la fattura n. ' + dup.invoiceNumber + ' del fornitore "' + dup.supplierName + '" (' + formatEurCurrency(dup.totalAmount) + ') esiste già in archivio.'
      };
    }

    var st = loadTodoAdminState();
    var net = Math.round(Number(p.netAmount || 100) * 100) / 100;
    var vat = Math.round((p.vatAmount !== undefined ? Number(p.vatAmount) : net * 0.22) * 100) / 100;
    var tot = Math.round((net + vat) * 100) / 100;

    var unitMap = {
      unit_santo_spirito: { name: 'Appartamento Santo Spirito · Camera 3', ownerId: 'owner_1' },
      unit_oltrarno: { name: 'Suite Palazzo Oltrarno', ownerId: 'owner_1' },
      unit_santa_croce: { name: 'Santa Croce Design Loft', ownerId: 'owner_2' }
    };
    var uMeta = unitMap[p.unitId] || unitMap.unit_santo_spirito;

    var newInv = {
      id: 'inv_pas_' + Date.now(),
      supplierName: supplier,
      invoiceNumber: number,
      sourceFormat: p.sourceFormat || 'SDI XML',
      issueDate: p.issueDate || getRomeTodayIso(),
      dueDate: p.dueDate || addDaysIso(getRomeTodayIso(), 3),
      netAmount: net,
      vatAmount: vat,
      totalAmount: tot,
      iban: p.iban || 'IT60X0542811101000000123456',
      unitId: p.unitId || 'unit_santo_spirito',
      unitName: uMeta.name,
      ownerId: uMeta.ownerId,
      costCenter: p.costCenter || 'Manutenzione & Fornitori',
      status: 'da_saldare',
      linkedQuoteId: p.linkedQuoteId || null,
      paymentInfo: null,
      postponeInfo: null,
      disputeInfo: null,
      completedTodayAt: null
    };

    st.supplierInvoices.unshift(newInv);
    recordAuditEntry(
      st,
      'Acquisita fattura passiva ' + newInv.invoiceNumber + ' di ' + newInv.supplierName + ' (' + formatEurCurrency(newInv.totalAmount) + ', scadenza ' + formatIsoIt(newInv.dueDate) + ').'
    );
    saveTodoAdminState(st);
    return { ok: true, invoice: newInv };
  }

  function markSupplierInvoicePaid(invoiceId, paymentInput) {
    var pay = paymentInput || {};
    var bankRef = String(pay.bankRef || '').trim();
    if (!bankRef) {
      return { ok: false, error: 'Inserisci il riferimento del bonifico (CRO / TRN) per registrare il pagamento.' };
    }
    var st = loadTodoAdminState();
    var target = null;
    st.supplierInvoices.forEach(function (inv) {
      if (inv.id === invoiceId) {
        inv.status = 'pagata';
        inv.completedTodayAt = new Date().toISOString();
        inv.paymentInfo = {
          paidDate: pay.paidDate || getRomeTodayIso(),
          method: pay.method || 'Bonifico Bancario SEPA',
          bankRef: bankRef,
          receiptName: pay.receiptName || ('Ricevuta_' + inv.invoiceNumber.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf'),
          paidByRole: st.currentRole
        };
        target = inv;
      }
    });
    if (!target) return { ok: false, error: 'Fattura non trovata.' };

    recordAuditEntry(
      st,
      'Pagata fattura fornitore ' + target.invoiceNumber + ' (' + target.supplierName + ' · ' + formatEurCurrency(target.totalAmount) + ') in data ' + formatIsoIt(target.paymentInfo.paidDate) + ' con metodo ' + target.paymentInfo.method + ' — Riferimento bonifico: ' + target.paymentInfo.bankRef + '.'
    );
    saveTodoAdminState(st);
    return { ok: true, invoice: target };
  }

  function postponeSupplierInvoice(invoiceId, newDueDateIso, reasonText) {
    var reason = String(reasonText || '').trim();
    if (!newDueDateIso || !reason) {
      return { ok: false, error: 'Specifica la nuova data di scadenza e il motivo del rinvio.' };
    }
    var st = loadTodoAdminState();
    var target = null;
    st.supplierInvoices.forEach(function (inv) {
      if (inv.id === invoiceId) {
        inv.dueDate = newDueDateIso;
        inv.status = 'da_saldare';
        inv.postponeInfo = {
          newDueDate: newDueDateIso,
          reason: reason,
          postponedAtRome: formatRomeDateTime(getRomeNow())
        };
        target = inv;
      }
    });
    if (!target) return { ok: false, error: 'Fattura non trovata.' };

    recordAuditEntry(
      st,
      'Rimandata scadenza fattura ' + target.invoiceNumber + ' (' + target.supplierName + ') al ' + formatIsoIt(newDueDateIso) + '. Motivo: ' + reason
    );
    saveTodoAdminState(st);
    return { ok: true, invoice: target };
  }

  function contestSupplierInvoice(invoiceId, disputeNote) {
    var note = String(disputeNote || '').trim();
    if (!note) {
      return { ok: false, error: 'Inserisci una nota di contestazione obbligatoria.' };
    }
    var st = loadTodoAdminState();
    var target = null;
    st.supplierInvoices.forEach(function (inv) {
      if (inv.id === invoiceId) {
        inv.status = 'contestata';
        inv.completedTodayAt = new Date().toISOString();
        inv.disputeInfo = {
          note: note,
          disputedAtRome: formatRomeDateTime(getRomeNow()),
          disputedByRole: st.currentRole
        };
        target = inv;
      }
    });
    if (!target) return { ok: false, error: 'Fattura non trovata.' };

    recordAuditEntry(
      st,
      'Contestata fattura ' + target.invoiceNumber + ' di ' + target.supplierName + ' (' + formatEurCurrency(target.totalAmount) + '). Nota contestazione: ' + note
    );
    saveTodoAdminState(st);
    return { ok: true, invoice: target };
  }

  /* ================================================================
     C. AZIONI PREVENTIVI SPESE EXTRA (APPROVA / RIFIUTA / MODIFICA)
     ================================================================ */
  function isQuoteUrgentOver24h(quote) {
    if (!quote || quote.urgency !== 'urgente') return false;
    if (quote.status !== 'In approvazione' && quote.status !== 'Bozza') return false;
    var createdMs = new Date(quote.createdAtIso || getRomeNow()).getTime();
    var diffHours = (getRomeNow().getTime() - createdMs) / (1000 * 3600);
    return diffHours >= 24;
  }

  function canCurrentUserApproveQuote(quote, stateObj) {
    var st = stateObj || loadTodoAdminState();
    var role = st.currentRole || 'titolare';
    var limit = Number((st.permissions && st.permissions.managerApprovalLimitEur) || 500);

    if (quote.chargeTo === 'proprietario' && !quote.ownerApproved) {
      if (role === 'proprietario') {
        return { allowed: true, reason: 'Approvazione Proprietario dalla propria area' };
      }
      return {
        allowed: false,
        reason: 'Spesa a carico del Proprietario: richiede l’approvazione del Proprietario dalla sua area.'
      };
    }

    if (role === 'titolare') {
      return { allowed: true, reason: 'Titolare / Admin (autorizzato oltre soglia)' };
    }
    if (role === 'manager') {
      if (Number(quote.amount) <= limit) {
        return { allowed: true, reason: 'Approvabile dal Manager (entro ' + formatEurCurrency(limit) + ')' };
      }
      return {
        allowed: false,
        reason: 'Importo oltre soglia Manager (' + formatEurCurrency(limit) + '): serve l’approvazione del Titolare.'
      };
    }
    if (role === 'proprietario' && quote.chargeTo === 'proprietario') {
      return { allowed: true, reason: 'Approvazione Proprietario' };
    }
    return { allowed: false, reason: 'Ruolo Fornitore non abilitato ad approvare preventivi.' };
  }

  function decideExtraQuote(quoteId, decisionType, noteText) {
    var st = loadTodoAdminState();
    var role = st.currentRole || 'titolare';
    var quote = st.extraQuotes.find(function (q) { return q.id === quoteId; });
    if (!quote) return { ok: false, error: 'Preventivo non trovato.' };

    var cleanNote = String(noteText || '').trim();

    if (decisionType === 'approve') {
      var perm = canCurrentUserApproveQuote(quote, st);
      if (!perm.allowed) {
        return { ok: false, error: perm.reason };
      }

      if (role === 'proprietario') {
        quote.ownerApproved = true;
      } else if (role === 'manager') {
        quote.managerApproved = true;
      } else if (role === 'titolare') {
        quote.titolareApproved = true;
        quote.managerApproved = true;
      }

      quote.status = 'Approvato';
      quote.completedTodayAt = new Date().toISOString();
      quote.decisionNote = cleanNote || ('Approvato da ' + (st.currentUserLabels[role] || role));

      sendCreatorNotification(
        st,
        quote.createdBy + ' (' + (quote.createdByEmail || 'staff') + ')',
        'Preventivo approvato: ' + quote.title,
        'Il preventivo di ' + formatEurCurrency(quote.amount) + ' per ' + quote.unitName + ' è stato approvato da ' + st.currentUserLabels[role] + '.'
      );
      recordAuditEntry(
        st,
        'Approvato "' + quote.title + '" (' + formatEurCurrency(quote.amount) + ') da ' + (st.currentUserLabels[role] || role) + ' e inviata notifica a ' + quote.createdBy + '.'
      );
      saveTodoAdminState(st);
      return { ok: true, quote: quote };
    }

    if (decisionType === 'reject') {
      if (!cleanNote) {
        return { ok: false, error: 'Inserisci il motivo obbligatorio per rifiutare il preventivo.' };
      }
      quote.status = 'Rifiutato';
      quote.completedTodayAt = new Date().toISOString();
      quote.decisionNote = cleanNote;

      sendCreatorNotification(
        st,
        quote.createdBy + ' (' + (quote.createdByEmail || 'staff') + ')',
        'Preventivo rifiutato: ' + quote.title,
        'Il preventivo di ' + formatEurCurrency(quote.amount) + ' è stato rifiutato. Motivo: ' + cleanNote
      );
      recordAuditEntry(
        st,
        'Rifiutato "' + quote.title + '" (' + formatEurCurrency(quote.amount) + '). Motivo: ' + cleanNote + ' (Notifica inviata a ' + quote.createdBy + ').'
      );
      saveTodoAdminState(st);
      return { ok: true, quote: quote };
    }

    if (decisionType === 'request_change') {
      if (!cleanNote) {
        return { ok: false, error: 'Specifica la modifica richiesta per inviare la notifica al creatore del preventivo.' };
      }
      quote.status = 'Modifica richiesta';
      quote.completedTodayAt = new Date().toISOString();
      quote.decisionNote = cleanNote;

      sendCreatorNotification(
        st,
        quote.createdBy + ' (' + (quote.createdByEmail || 'staff') + ')',
        'Modifica richiesta sul preventivo: ' + quote.title,
        'Richiesta di modifica sul preventivo di ' + formatEurCurrency(quote.amount) + ': ' + cleanNote
      );
      recordAuditEntry(
        st,
        'Richiesta modifica per "' + quote.title + '": ' + cleanNote + ' (Notifica inviata a ' + quote.createdBy + ').'
      );
      saveTodoAdminState(st);
      return { ok: true, quote: quote };
    }

    return { ok: false, error: 'Decisione non valida.' };
  }

  function advanceApprovedQuoteToInvoiced(quoteId) {
    var st = loadTodoAdminState();
    var quote = st.extraQuotes.find(function (q) { return q.id === quoteId; });
    if (!quote) return { ok: false, error: 'Preventivo non trovato.' };

    if (quote.status === 'Approvato') {
      quote.status = 'Eseguito';
      recordAuditEntry(st, 'Intervento "' + quote.title + '" segnato come Eseguito.');
      saveTodoAdminState(st);
      return { ok: true, quote: quote, stage: 'Eseguito' };
    }

    if (quote.status === 'Eseguito') {
      var net = Math.round((quote.amount / 1.22) * 100) / 100;
      var vat = Math.round((quote.amount - net) * 100) / 100;
      var invNum = 'SDI-EXTRA-' + Math.floor(100 + Math.random() * 899);
      var newInv = {
        id: 'inv_from_quo_' + Date.now(),
        supplierName: quote.createdBy.replace(/\s*\(.*?\)\s*/g, ''),
        invoiceNumber: invNum,
        sourceFormat: 'SDI XML (Collegata a Preventivo)',
        issueDate: getRomeTodayIso(),
        dueDate: addDaysIso(getRomeTodayIso(), 4),
        netAmount: net,
        vatAmount: vat,
        totalAmount: quote.amount,
        iban: '[DA CONFERMARE]',
        unitId: quote.unitId,
        unitName: quote.unitName,
        ownerId: quote.ownerId,
        costCenter: 'Spese Extra · ' + quote.interventionType,
        status: 'da_saldare',
        linkedQuoteId: quote.id,
        paymentInfo: null,
        postponeInfo: null,
        disputeInfo: null,
        completedTodayAt: null
      };
      st.supplierInvoices.unshift(newInv);
      quote.status = 'Fatturato';
      quote.linkedInvoiceId = newInv.id;

      recordAuditEntry(
        st,
        'Preventivo "' + quote.title + '" passato a stato Fatturato e collegato alla fattura fornitore ' + invNum + ' in Pagamenti.'
      );
      saveTodoAdminState(st);
      return { ok: true, quote: quote, invoice: newInv, stage: 'Fatturato' };
    }

    return { ok: false, error: 'Stato non idoneo.' };
  }

  function createNewExtraQuote(input) {
    var inp = input || {};
    var amount = Number(inp.amount || 0);
    var reason = String(inp.reason || '').trim();
    var intervention = String(inp.interventionType || 'Manutenzione').trim();
    if (amount <= 0 || !reason) {
      return { ok: false, error: 'Inserisci importo e motivo del preventivo.' };
    }
    var st = loadTodoAdminState();
    var unitId = inp.unitId || 'unit_santo_spirito';
    var unitMap = {
      unit_santo_spirito: { name: 'Camera 3 (Appartamento Santo Spirito)', shortUnit: 'Camera 3', ownerId: 'owner_1' },
      unit_oltrarno: { name: 'Suite Palazzo Oltrarno', shortUnit: 'Suite Oltrarno', ownerId: 'owner_1' },
      unit_santa_croce: { name: 'Santa Croce Design Loft', shortUnit: 'Santa Croce Loft', ownerId: 'owner_2' }
    };
    var uMeta = unitMap[unitId] || unitMap.unit_santo_spirito;
    var chargeTo = inp.chargeTo || 'struttura';

    var newQuote = {
      id: 'quo_' + Date.now(),
      title: 'Preventivo €' + amount.toLocaleString('it-IT') + ' – ' + intervention + ', ' + uMeta.shortUnit + ' – da approvare',
      interventionType: intervention,
      unitId: unitId,
      unitName: uMeta.name,
      ownerId: uMeta.ownerId,
      amount: amount,
      urgency: inp.urgency || 'normale',
      createdAtIso: getRomeNow().toISOString(),
      createdBy: st.currentUserLabels[st.currentRole] || 'Staff / Fornitore',
      createdByEmail: 'risorseumane@bluearroyo.it',
      reason: reason,
      attachments: inp.attachmentName ? [inp.attachmentName] : ['preventivo_allegato.pdf'],
      chargeTo: chargeTo,
      status: 'In approvazione',
      managerApproved: false,
      titolareApproved: false,
      ownerApproved: chargeTo !== 'proprietario',
      decisionNote: '',
      linkedInvoiceId: null,
      completedTodayAt: null
    };

    st.extraQuotes.unshift(newQuote);
    recordAuditEntry(
      st,
      'Creato preventivo spesa extra: "' + newQuote.title + '" (' + (chargeTo === 'proprietario' ? 'A carico del Proprietario' : 'A carico Struttura') + ').'
    );
    saveTodoAdminState(st);
    return { ok: true, quote: newQuote };
  }

  /* ================================================================
     D. CALCOLO SEZIONI TO-DO E CONTATORI CONDIVISI
     ================================================================ */
  function computeUnifiedTodoSections(ownerAppStateInput) {
    var st = loadTodoAdminState();
    var vis = getRoleVisibility(st);

    var ownerApp = ownerAppStateInput;
    if (!ownerApp) {
      try {
        ownerApp = JSON.parse(localStorage.getItem(OWNER_APP_STORAGE_KEY) || 'null');
      } catch (e) {}
    }
    var bookings = (ownerApp && Array.isArray(ownerApp.bookings)) ? ownerApp.bookings : [];

    var operativoActive = [];
    var completedTodayList = [];

    bookings.forEach(function (b) {
      var doneKey = 'aw_' + b.id;
      if (!b.alloggiatiSent) {
        operativoActive.push({
          id: 'todo_op_' + b.id,
          bookingId: b.id,
          section: 'operativo',
          title: 'Alloggiati Web Polizia di Stato: ' + b.guest + ' (' + b.channel + ')',
          subtitle: 'Arrivo ' + b.checkin + ' · ' + b.guests + ' ospiti · Invio entro 24 ore dal check-in',
          badge: 'Questura 24h',
          isUrgent: true
        });
      } else if (st.completedOperationalToday && st.completedOperationalToday[doneKey]) {
        completedTodayList.push({
          id: 'done_op_' + b.id,
          sectionLabel: 'Operativo',
          title: 'Alloggiati Web inviato per ' + b.guest,
          completedAtRome: st.completedOperationalToday[doneKey]
        });
      }
    });

    var revenueActive = [];
    if (vis.canSeeRevenue) {
      st.revenueReports.forEach(function (rep) {
        if (rep.status === 'da_controllare') {
          revenueActive.push(rep);
        } else if (isSameRomeDay(rep.completedTodayAt)) {
          completedTodayList.push({
            id: 'done_rev_' + rep.id,
            sectionLabel: 'Revenue',
            title: rep.title + (rep.suggestionsApproved ? ' (Suggerimenti approvati)' : ' (Letto)'),
            completedAtRome: formatRomeDateTime(rep.completedTodayAt)
          });
        }
      });
    }

    var pagamentiActive = [];
    var paidInvoicesHistory = [];
    var weeklyTotalToPayEur = 0;

    var allRoleFilteredInvoices = st.supplierInvoices.filter(function (inv) {
      if (vis.onlyOwnerUnits && inv.ownerId !== vis.ownerIdFilter) return false;
      return true;
    });

    allRoleFilteredInvoices.forEach(function (inv) {
      if (inv.status === 'pagata') {
        paidInvoicesHistory.push(inv);
      }
      if (vis.canSeePagamenti) {
        if (inv.status === 'da_saldare') {
          var daysDiff = diffDaysFromToday(inv.dueDate);
          if (daysDiff <= 7) {
            var copy = Object.assign({}, inv, {
              daysFromToday: daysDiff,
              isOverdue: daysDiff < 0,
              isDueToday: daysDiff === 0
            });
            pagamentiActive.push(copy);
            weeklyTotalToPayEur += Number(inv.totalAmount || 0);
          }
        } else if ((inv.status === 'pagata' || inv.status === 'contestata') && isSameRomeDay(inv.completedTodayAt)) {
          completedTodayList.push({
            id: 'done_inv_' + inv.id,
            sectionLabel: 'Pagamenti',
            title: 'Fattura ' + inv.invoiceNumber + ' – ' + inv.supplierName + ' (' + formatEurCurrency(inv.totalAmount) + ') — ' +
              (inv.status === 'pagata' ? ('Pagata · Bonifico ' + (inv.paymentInfo ? inv.paymentInfo.bankRef : '')) : 'Contestata'),
            completedAtRome: formatRomeDateTime(inv.completedTodayAt)
          });
        }
      }
    });

    pagamentiActive.sort(function (a, b) {
      return a.daysFromToday - b.daysFromToday;
    });

    var approvazioniActive = [];
    var workflowFollowupQuotes = [];
    if (vis.canSeeApprovazioni) {
      st.extraQuotes.forEach(function (q) {
        if (vis.onlyOwnerUnits && q.ownerId !== vis.ownerIdFilter) return false;

        var isPending = (q.status === 'In approvazione' || q.status === 'Bozza');
        if (isPending) {
          approvazioniActive.push(Object.assign({}, q, {
            urgentOver24h: isQuoteUrgentOver24h(q),
            permissionCheck: canCurrentUserApproveQuote(q, st)
          }));
        } else {
          if (q.status === 'Approvato' || q.status === 'Eseguito' || q.status === 'Fatturato') {
            workflowFollowupQuotes.push(q);
          }
          if (isSameRomeDay(q.completedTodayAt)) {
            completedTodayList.push({
              id: 'done_quo_' + q.id,
              sectionLabel: 'Approvazioni',
              title: q.title + ' — Stato: ' + q.status + (q.decisionNote ? ' (' + q.decisionNote + ')' : ''),
              completedAtRome: formatRomeDateTime(q.completedTodayAt)
            });
          }
        }
      });

      approvazioniActive.sort(function (a, b) {
        if (a.urgentOver24h && !b.urgentOver24h) return -1;
        if (!a.urgentOver24h && b.urgentOver24h) return 1;
        return b.amount - a.amount;
      });
    }

    var totalPendingCount =
      operativoActive.length +
      revenueActive.length +
      pagamentiActive.length +
      approvazioniActive.length;

    return {
      state: st,
      visibility: vis,
      counts: {
        operativo: operativoActive.length,
        revenue: revenueActive.length,
        pagamenti: pagamentiActive.length,
        approvazioni: approvazioniActive.length,
        completedToday: completedTodayList.length,
        totalPending: totalPendingCount
      },
      weeklyTotalToPayEur: Math.round(weeklyTotalToPayEur * 100) / 100,
      operativo: operativoActive,
      revenue: revenueActive,
      pagamenti: pagamentiActive,
      paidInvoicesHistory: paidInvoicesHistory,
      approvazioni: approvazioniActive,
      workflowFollowupQuotes: workflowFollowupQuotes,
      completedToday: completedTodayList
    };
  }

  function triggerDailySummary0830Dispatch() {
    var summary = computeUnifiedTodoSections();
    var st = summary.state;
    var todayIso = getRomeTodayIso();
    st.dailySummary0830.lastSentDate = todayIso;

    var msg = 'Riepilogo giornaliero ore 08:30 (Europe/Rome) inviato via Email e Notifica: ' +
      summary.counts.operativo + ' Operativo, ' +
      summary.counts.revenue + ' Revenue Plan, ' +
      summary.counts.pagamenti + ' Fatture da saldare (' + formatEurCurrency(summary.weeklyTotalToPayEur) + '), ' +
      summary.counts.approvazioni + ' Preventivi da approvare.';

    sendCreatorNotification(
      st,
      st.currentUserLabels[st.currentRole] || 'Team Struttura',
      'Riepilogo Giornaliero 08:30 (Europe/Rome) — To-Do di Oggi',
      msg
    );
    recordAuditEntry(st, msg);
    saveTodoAdminState(st);
    return { ok: true, message: msg, summary: summary };
  }

  /* ================================================================
     COMPONENTE UI CONDIVISO IN #screen-home (Zero conflitti con Agenti 1 e 2)
     ================================================================ */
  var _uiFeedbackBanner = '';
  var _uiErrorBanner = '';

  function injectTodoAdminStylesOnce() {
    if (document.getElementById('ita-todo-admin-styles')) return;
    var style = document.createElement('style');
    style.id = 'ita-todo-admin-styles';
    style.textContent = [
      '.ita-todo-hub { margin: 20px 0 28px; border: 2px solid var(--border-control); border-radius: 14px; background: var(--bg-light); padding: 18px 14px; }',
      '.ita-btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; min-height: 48px; padding: 10px 14px; border-radius: 10px; font-family: var(--font-sans); font-size: 0.95rem; font-weight: 700; cursor: pointer; text-align: center; transition: background 0.15s ease; }',
      '.ita-btn-primary { background: var(--gold-accent); color: var(--ink-navy); border: 2px solid var(--ink-navy); }',
      '.ita-btn-secondary { background: var(--bg-light); color: var(--ink-navy); border: 2px solid var(--ink-navy); }',
      '.ita-todo-role-bar { background: var(--bg-stone); border: 1.5px solid var(--border-control); border-radius: 12px; padding: 14px; margin-bottom: 16px; }',
      '.ita-role-chips { display: grid; grid-template-columns: 1fr; gap: 8px; margin-top: 10px; }',
      '@media (min-width: 600px) { .ita-role-chips { grid-template-columns: repeat(2, minmax(0, 1fr)); } }',
      '@media (min-width: 840px) { .ita-role-chips { grid-template-columns: repeat(4, minmax(0, 1fr)); } }',
      '.ita-role-btn { min-height: 48px; padding: 10px 12px; border-radius: 10px; border: 2px solid var(--ink-navy); background: var(--bg-light); color: var(--ink-navy); font-family: var(--font-sans); font-size: 0.9375rem; font-weight: 700; cursor: pointer; text-align: left; width: 100%; }',
      '.ita-role-btn.active { background: var(--ink-navy); color: var(--bg-light); border-color: var(--ink-navy); }',
      '.ita-counters-strip { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 18px; }',
      '@media (min-width: 640px) { .ita-counters-strip { grid-template-columns: repeat(4, minmax(0, 1fr)); } }',
      '.ita-counter-box { background: var(--bg-stone); border: 1.5px solid var(--border-control); border-radius: 10px; padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; gap: 6px; min-width: 0; }',
      '.ita-counter-num { display: inline-flex; align-items: center; justify-content: center; min-width: 28px; height: 28px; padding: 0 8px; border-radius: 999px; background: var(--ink-navy); color: var(--bg-light); font-weight: 800; font-size: 0.875rem; flex-shrink: 0; }',
      '.ita-sec-block { margin-bottom: 24px; padding-top: 8px; border-top: 2px solid var(--border-control); }',
      '.ita-sec-head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }',
      '.ita-todo-card { background: var(--bg-light); border: 2px solid var(--border-control); border-radius: 12px; padding: 16px 14px; margin-bottom: 14px; width: 100%; max-width: 100%; }',
      '.ita-todo-card.overdue-red { background: #FEF2F2; border: 2.5px solid #991B1B; }',
      '.ita-todo-card.urgent-24h { background: #FFFBEB; border: 2.5px solid #B45309; }',
      '.ita-badge-red { display: inline-block; padding: 4px 10px; border-radius: 6px; background: #991B1B; color: #FFFFFF; font-size: 0.875rem; font-weight: 700; }',
      '.ita-badge-urgent { display: inline-block; padding: 4px 10px; border-radius: 6px; background: #B45309; color: #FFFFFF; font-size: 0.875rem; font-weight: 700; }',
      '.ita-badge-info { display: inline-block; padding: 4px 10px; border-radius: 6px; background: var(--bg-stone); color: var(--gold-text-light); border: 1px solid var(--border-control); font-size: 0.875rem; font-weight: 700; }',
      '.ita-actions-grid { display: grid; grid-template-columns: 1fr; gap: 8px; margin-top: 12px; }',
      '@media (min-width: 600px) { .ita-actions-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }',
      '.ita-inline-panel { background: var(--bg-stone); border: 1.5px solid var(--border-control); border-radius: 10px; padding: 14px; margin-top: 12px; display: none; }',
      '.ita-inline-panel.open { display: block; }',
      '.ita-weekly-pay-banner { background: var(--ink-navy); color: var(--bg-light); border-radius: 10px; padding: 14px 16px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }',
      '.ita-done-row { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; padding: 10px 12px; border-radius: 8px; background: var(--status-ok-bg); color: var(--status-ok-text); border: 1px solid var(--status-ok-text); margin-bottom: 8px; font-weight: 600; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  function ensureTodoMountContainer() {
    var existing = document.getElementById('ita-unified-todo-mount');
    if (existing) return existing;
    var homeScreen = document.getElementById('screen-home');
    if (!homeScreen) return null;
    var mount = document.createElement('div');
    mount.id = 'ita-unified-todo-mount';
    var sharedTodoSection = document.getElementById('home-today-todo-section');
    if (sharedTodoSection) {
      sharedTodoSection.appendChild(mount);
      return mount;
    }
    var priorityBanner = homeScreen.querySelector('.priority-banner');
    if (priorityBanner && priorityBanner.nextSibling) {
      homeScreen.insertBefore(mount, priorityBanner.nextSibling);
    } else {
      homeScreen.insertBefore(mount, homeScreen.firstChild);
    }
    return mount;
  }

  function updateMenuAndHeaderTodoBadges(totalPendingCount, completedTodayCount) {
    var navHomeSpan = document.querySelector('.bottom-nav-btn[data-nav="home"] span');
    if (navHomeSpan) {
      navHomeSpan.textContent = 'Home (' + totalPendingCount + ')';
    }
    var cntEl = document.getElementById('home-today-counter');
    if (cntEl) {
      cntEl.textContent = totalPendingCount + ' attività da fare · ' + (completedTodayCount || 0) + ' fatte oggi';
    }
  }

  function renderUnifiedTodoUI() {
    injectTodoAdminStylesOnce();
    var mount = ensureTodoMountContainer();
    if (!mount) return;

    var ownerApp = (typeof root.appState !== 'undefined' && root.appState) ? root.appState : null;
    var data = computeUnifiedTodoSections(ownerApp);
    var st = data.state;
    var vis = data.visibility;
    var counts = data.counts;

    updateMenuAndHeaderTodoBadges(counts.totalPending, counts.completedToday);

    var role = st.currentRole || 'titolare';
    var limitEur = Number((st.permissions && st.permissions.managerApprovalLimitEur) || 500);
    var recPerm = Boolean(st.permissions && st.permissions.receptionistViewRevenueAndPayments);

    var html = '<div class="ita-todo-hub" id="todo-oggi-hub" role="region" aria-label="To-Do List di Oggi">';

    // Intestazione To-Do List + Riepilogo 08:30 + Badge Contatore
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:14px;">' +
      '<div>' +
        '<span class="status-pill" style="margin-bottom:6px;">To-Do List Condivisa · Fuso Europe/Rome · Valuta EUR</span>' +
        '<h2 style="margin-bottom:4px;">To-Do di oggi (' + counts.totalPending + ' attività da completare)</h2>' +
        '<p style="color:var(--ink-muted);font-size:0.95rem;">Riepilogo giornaliero automatico ore <strong>08:30</strong> (Email e Notifica) · Completate oggi visibili fino a mezzanotte · <strong>Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1</strong>' + (!vis.onlyOwnerUnits ? ' · <em>Magazzino interno PBA: Via dell\'Agnolo 72R, Firenze (Solo uso interno)</em>' : '') + '.</p>' +
      '</div>' +
      '<button type="button" class="ita-btn ita-btn-secondary" style="width:auto;min-height:48px;padding:10px 16px;" onclick="window.ITATodoAdminUI.send0830SummaryNow()">' +
        'Invia Riepilogo 08:30 (Email/Notifica)' +
      '</button>' +
    '</div>';

    if (_uiFeedbackBanner) {
      html += '<div class="item-card" style="background:var(--status-ok-bg);border-color:var(--status-ok-text);color:var(--status-ok-text);margin-bottom:14px;padding:12px 14px;font-weight:700;" role="status">' +
        escapeHtml(_uiFeedbackBanner) +
      '</div>';
    }
    if (_uiErrorBanner) {
      html += '<div class="item-card" style="background:var(--error-bg);border-color:var(--error-text);color:var(--error-text);margin-bottom:14px;padding:12px 14px;font-weight:700;" role="alert">' +
        escapeHtml(_uiErrorBanner) +
      '</div>';
    }

    // Selettore Ruolo & Configurazione Soglia/Permessi
    html += '<div class="ita-todo-role-bar">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">' +
        '<strong>Ruolo attivo: ' + escapeHtml(st.currentUserLabels[role] || role) + '</strong>' +
        '<span class="ita-badge-info">Soglia Manager: fino a ' + formatEurCurrency(limitEur) + '</span>' +
      '</div>' +
      '<div class="ita-role-chips" role="group" aria-label="Cambia ruolo utente">' +
        '<button type="button" class="ita-role-btn ' + (role === 'titolare' ? 'active' : '') + '" id="role-btn-titolare" onclick="window.ITATodoAdminUI.switchRole(\'titolare\')">Titolare / Admin</button>' +
        '<button type="button" class="ita-role-btn ' + (role === 'manager' ? 'active' : '') + '" id="role-btn-manager" onclick="window.ITATodoAdminUI.switchRole(\'manager\')">Manager / Receptionist</button>' +
        '<button type="button" class="ita-role-btn ' + (role === 'proprietario' ? 'active' : '') + '" id="role-btn-proprietario" onclick="window.ITATodoAdminUI.switchRole(\'proprietario\')">Proprietario (Mie Unità)</button>' +
        '<button type="button" class="ita-role-btn ' + (role === 'fornitore' ? 'active' : '') + '" id="role-btn-fornitore" onclick="window.ITATodoAdminUI.switchRole(\'fornitore\')">Fornitore (Limitato)</button>' +
      '</div>' +
      '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:12px;padding-top:10px;border-top:1px solid var(--border-control);font-size:0.9rem;">' +
        '<label style="display:inline-flex;align-items:center;gap:8px;font-weight:600;cursor:pointer;">' +
          '<input type="checkbox" id="chk-rec-perm" style="width:20px;height:20px;" ' + (recPerm ? 'checked' : '') + ' onchange="window.ITATodoAdminUI.toggleRecPerm(this.checked)"/>' +
          '<span>Abilita Receptionist/Manager a vedere Pagamenti e Revenue</span>' +
        '</label>' +
        '<div style="display:inline-flex;align-items:center;gap:8px;">' +
          '<label for="inp-mgr-threshold" style="font-weight:600;">Soglia Manager (€):</label>' +
          '<input type="number" id="inp-mgr-threshold" value="' + limitEur + '" min="50" max="5000" step="50" style="width:100px;min-height:40px;padding:4px 8px;border:1.5px solid var(--border-control);border-radius:6px;font-weight:700;" onchange="window.ITATodoAdminUI.changeThreshold(this.value)"/>' +
        '</div>' +
      '</div>' +
    '</div>';

    // Contatori delle 4 Sezioni
    html += '<div class="ita-counters-strip">' +
      '<div class="ita-counter-box"><span>1. Operativo</span><span class="ita-counter-num" id="cnt-operativo">' + counts.operativo + '</span></div>' +
      '<div class="ita-counter-box"><span>2. Revenue</span><span class="ita-counter-num" id="cnt-revenue">' + (vis.canSeeRevenue ? counts.revenue : '—') + '</span></div>' +
      '<div class="ita-counter-box"><span>3. Pagamenti</span><span class="ita-counter-num" id="cnt-pagamenti">' + (vis.canSeePagamenti ? counts.pagamenti : '—') + '</span></div>' +
      '<div class="ita-counter-box"><span>4. Approvazioni</span><span class="ita-counter-num" id="cnt-approvazioni">' + counts.approvazioni + '</span></div>' +
    '</div>';

    /* ----------------------------------------------------------------
       SEZIONE 1: OPERATIVO (Condivisa con Agente 1 - Alloggiati Web)
       ---------------------------------------------------------------- */
    html += '<div class="ita-sec-block" id="todo-sec-operativo">' +
      '<div class="ita-sec-head">' +
        '<h3>Sezione 1 · Operativo (' + counts.operativo + ')</h3>' +
        '<span class="ita-badge-info">Sincronizzato con Alloggiati Web</span>' +
      '</div>';

    if (data.operativo.length === 0) {
      html += '<p style="color:var(--status-ok-text);font-weight:600;">Nessuna attività operativa in sospeso.</p>';
    } else {
      data.operativo.forEach(function (op) {
        html += '<article class="ita-todo-card">' +
          '<div class="item-card-head">' +
            '<div>' +
              '<strong>' + escapeHtml(op.title) + '</strong>' +
              '<p style="color:var(--ink-muted);font-size:0.925rem;margin-top:2px;">' + escapeHtml(op.subtitle) + '</p>' +
            '</div>' +
            '<span class="status-pill pending">' + escapeHtml(op.badge) + '</span>' +
          '</div>' +
          '<div class="ita-actions-grid">' +
            (op.bookingId ? (
              '<button type="button" class="ita-btn ita-btn-primary" onclick="navigateToOnion(\'azione-alloggiati\', { step: 1, bookingId: \'' + op.bookingId + '\' })">' +
                'Apri e invia Alloggiati Web' +
              '</button>' +
              '<button type="button" class="ita-btn ita-btn-secondary" onclick="window.ITATodoAdminUI.quickMarkAlloggiatiDone(\'' + op.bookingId + '\')">' +
                'Continua e segna come inviato' +
              '</button>'
            ) : '') +
          '</div>' +
        '</article>';
      });
    }
    html += '</div>';

    /* ----------------------------------------------------------------
       SEZIONE 2: REVENUE ("REPORT REVENUE PLAN")
       ---------------------------------------------------------------- */
    if (vis.canSeeRevenue) {
      html += '<div class="ita-sec-block" id="todo-sec-revenue">' +
        '<div class="ita-sec-head">' +
          '<h3>Sezione 2 · Revenue (' + counts.revenue + ')</h3>' +
          '<span class="ita-badge-info">' + (vis.onlyOwnerUnits ? 'Filtrato: Solo le tue unità' : 'Settimanale Lunedì & Mensile Giorno 1') + '</span>' +
        '</div>';

      if (data.revenue.length === 0) {
        html += '<p style="color:var(--status-ok-text);font-weight:600;">Tutti i report Revenue Plan sono stati controllati oggi.</p>';
      } else {
        data.revenue.forEach(function (rep) {
          var snap = rep.snapshot || ITARevenueModuleAdapter.getRevenueSnapshotForReport();
          var units = (snap.units || []).filter(function (u) {
            return !vis.onlyOwnerUnits || u.ownerId === vis.ownerIdFilter;
          });
          var tot = snap.structureTotals || {};
          var pendingSugsCount = 0;
          units.forEach(function (u) {
            pendingSugsCount += (u.pendingSuggestions ? u.pendingSuggestions.length : 0);
          });

          html += '<article class="ita-todo-card" id="card-rev-' + rep.id + '">' +
            '<div class="item-card-head">' +
              '<div>' +
                '<span class="ita-badge-info" style="margin-bottom:6px;">' + escapeHtml(rep.periodLabel) + ' · ' + escapeHtml(rep.scheduleRule) + '</span>' +
                '<h3>' + escapeHtml(rep.title) + '</h3>' +
              '</div>' +
              '<span class="status-pill pending">' + pendingSugsCount + ' suggerimenti prezzo</span>' +
            '</div>' +
            '<div class="summary-strip" style="margin:10px 0;">' +
              '<div class="summary-row"><span>Occupazione · ADR · REVPAR</span><strong>' + tot.occupancyPct + '% · ADR ' + formatEurCurrency(tot.adrEur) + ' · REVPAR ' + formatEurCurrency(tot.revParEur) + '</strong></div>' +
              '<div class="summary-row"><span>Confronto periodo prec. e anno scorso</span><strong style="color:var(--status-ok-text);">' + tot.vsPrevPeriodPct + ' vs prec. · ' + tot.vsLastYearPct + ' vs anno scorso</strong></div>' +
              '<div class="summary-row"><span>Prezzi applicati vs Limiti Min/Max</span><strong>' + tot.appliedMinEur + ' € – ' + tot.appliedMaxEur + ' € (Limiti ' + tot.guardrailMinEur + ' € – ' + tot.guardrailMaxEur + ' €)</strong></div>' +
              '<div class="summary-row"><span>Notti vuote (30 / 60 / 90 giorni)</span><strong>30gg: ' + tot.emptyNights30 + ' notti · 60gg: ' + tot.emptyNights60 + ' notti · 90gg: ' + tot.emptyNights90 + ' notti</strong></div>' +
            '</div>' +
            '<div class="ita-actions-grid">' +
              '<button type="button" class="ita-btn ita-btn-secondary" onclick="window.ITATodoAdminUI.toggleInlinePanel(\'rev-detail-' + rep.id + '\')">' +
                'Apri report' +
              '</button>' +
              '<button type="button" class="ita-btn ita-btn-primary" onclick="window.ITATodoAdminUI.approveRevenue(\'' + rep.id + '\')">' +
                'Approva suggerimenti' +
              '</button>' +
              '<button type="button" class="ita-btn ita-btn-secondary" onclick="window.ITATodoAdminUI.markRevenueRead(\'' + rep.id + '\')">' +
                'Segna come letto' +
              '</button>' +
              '<button type="button" class="ita-btn ita-btn-secondary" onclick="window.ITATodoAdminUI.exportRevenuePdf(\'' + rep.id + '\')">' +
                'Esporta PDF' +
              '</button>' +
            '</div>' +
            // Dettaglio espandibile Report per Unità e Canali
            '<div class="ita-inline-panel" id="rev-detail-' + rep.id + '">' +
              '<h4 style="margin-bottom:8px;">Dettaglio per Unità e Canali (' + (vis.onlyOwnerUnits ? 'Solo Unità Proprietario' : 'Totale Struttura e Singole Unità') + ')</h4>';

          units.forEach(function (u) {
            var chStr = Object.keys(u.channelRevenue || {}).map(function (ck) {
              return ck + ': ' + formatEurCurrency(u.channelRevenue[ck]);
            }).join(' · ');
            html += '<div style="background:var(--bg-light);border:1px solid var(--border-control);border-radius:8px;padding:10px;margin-bottom:8px;">' +
              '<strong>' + escapeHtml(u.unitName) + '</strong> — Occ: <strong>' + u.occupancyPct + '%</strong> · ADR: <strong>' + formatEurCurrency(u.adrEur) + '</strong> · REVPAR: <strong>' + formatEurCurrency(u.revParEur) + '</strong><br/>' +
              '<span style="font-size:0.875rem;color:var(--ink-muted);">Canali: ' + escapeHtml(chStr) + '</span><br/>' +
              '<span style="font-size:0.875rem;color:var(--ink-navy);">Prezzi applicati: <strong>' + u.appliedMinEur + ' € – ' + u.appliedMaxEur + ' €</strong> (Min ' + u.guardrailMinEur + ' € / Max ' + u.guardrailMaxEur + ' €) · Notti vuote 30/60/90gg: <strong>' + u.emptyNights30 + '/' + u.emptyNights60 + '/' + u.emptyNights90 + '</strong></span>';
            if (u.pendingSuggestions && u.pendingSuggestions.length > 0) {
              html += '<ul style="margin-top:6px;padding-left:18px;font-size:0.875rem;">';
              u.pendingSuggestions.forEach(function (s) {
                html += '<li><strong>' + escapeHtml(s.dates) + ':</strong> da ' + s.currentEur + ' € a <strong>' + s.suggestedEur + ' €</strong> — ' + escapeHtml(s.reason) + '</li>';
              });
              html += '</ul>';
            }
            html += '</div>';
          });

          html += '</div></article>';
        });
      }
      html += '</div>';
    } else {
      html += '<div class="ita-sec-block" id="todo-sec-revenue-hidden">' +
        '<p style="color:var(--ink-muted);font-size:0.9rem;"><em>Sezione Revenue non visibile per il ruolo ' + escapeHtml(role) + ' (permesso non abilitato).</em></p>' +
      '</div>';
    }

    /* ----------------------------------------------------------------
       SEZIONE 3: PAGAMENTI ("FATTURE FORNITORI DA SALDARE")
       ---------------------------------------------------------------- */
    if (vis.canSeePagamenti) {
      html += '<div class="ita-sec-block" id="todo-sec-pagamenti">' +
        '<div class="ita-sec-head">' +
          '<h3>Sezione 3 · Pagamenti (' + counts.pagamenti + ')</h3>' +
          '<button type="button" class="ita-btn ita-btn-secondary" style="width:auto;min-height:44px;padding:8px 14px;" onclick="window.ITATodoAdminUI.toggleInlinePanel(\'form-new-passive-inv\')">' +
            '+ Carica Fattura SDI / PDF' +
          '</button>' +
        '</div>' +
        '<div class="ita-weekly-pay-banner">' +
          '<span>Totale da pagare della settimana (scadute, oggi ed entro 7 giorni)</span>' +
          '<strong id="todo-weekly-pay-total" style="font-size:1.25rem;color:var(--gold-accent);">' + formatEurCurrency(data.weeklyTotalToPayEur) + '</strong>' +
        '</div>';

      // Form caricamento nuova fattura passiva con controllo anti-duplicato
      html += '<div class="ita-inline-panel" id="form-new-passive-inv" style="margin-bottom:16px;">' +
        '<h4 style="margin-bottom:10px;">Carica nuova fattura passiva (SDI XML / PDF) con verifica duplicato</h4>' +
        '<div class="wizard-grid-2">' +
          '<div class="field-group"><label class="field-label" for="new-inv-sup">Fornitore *</label><input type="text" id="new-inv-sup" class="field-input" value="Blue Arroyo Cleaning SRL"/></div>' +
          '<div class="field-group"><label class="field-label" for="new-inv-num">Numero fattura *</label><input type="text" id="new-inv-num" class="field-input" value="SDI-2026/1190"/></div>' +
          '<div class="field-group"><label class="field-label" for="new-inv-net">Imponibile (€) *</label><input type="number" id="new-inv-net" class="field-input" value="250"/></div>' +
          '<div class="field-group"><label class="field-label" for="new-inv-due">Scadenza *</label><input type="date" id="new-inv-due" class="field-input" value="' + addDaysIso(getRomeTodayIso(), 3) + '"/></div>' +
          '<div class="field-group"><label class="field-label" for="new-inv-iban">IBAN beneficiario</label><input type="text" id="new-inv-iban" class="field-input" value="IT42Q0200802837000105482910"/></div>' +
          '<div class="field-group"><label class="field-label" for="new-inv-unit">Unità / Centro di costo</label>' +
            '<select id="new-inv-unit" class="field-select">' +
              '<option value="unit_santo_spirito">Appartamento Santo Spirito · Camera 3</option>' +
              '<option value="unit_oltrarno">Suite Palazzo Oltrarno</option>' +
              '<option value="unit_santa_croce">Santa Croce Design Loft</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<button type="button" class="ita-btn ita-btn-primary" onclick="window.ITATodoAdminUI.submitNewPassiveInvoice()">Verifica duplicato e salva fattura in To-Do</button>' +
      '</div>';

      if (data.pagamenti.length === 0) {
        html += '<p style="color:var(--status-ok-text);font-weight:600;">Nessuna fattura fornitore in scadenza nei prossimi 7 giorni.</p>';
      } else {
        data.pagamenti.forEach(function (inv) {
          var statusTag = '';
          if (inv.isOverdue) {
            statusTag = '<span class="ita-badge-red">SCADUTA (' + formatIsoIt(inv.dueDate) + ')</span>';
          } else if (inv.isDueToday) {
            statusTag = '<span class="ita-badge-urgent">SCADE OGGI (' + formatIsoIt(inv.dueDate) + ')</span>';
          } else {
            statusTag = '<span class="ita-badge-info">Scadenza fra ' + inv.daysFromToday + ' giorni (' + formatIsoIt(inv.dueDate) + ')</span>';
          }

          html += '<article class="ita-todo-card ' + (inv.isOverdue ? 'overdue-red' : '') + '" id="card-inv-' + inv.id + '">' +
            '<div class="item-card-head">' +
              '<div>' +
                statusTag +
                '<h3 style="margin-top:6px;">' + escapeHtml(inv.supplierName) + ' · Fattura ' + escapeHtml(inv.invoiceNumber) + '</h3>' +
                '<p style="color:var(--ink-muted);font-size:0.9rem;">Unità / Centro di costo: <strong>' + escapeHtml(inv.unitName) + '</strong> (' + escapeHtml(inv.costCenter) + ')</p>' +
              '</div>' +
              '<strong style="font-size:1.25rem;color:' + (inv.isOverdue ? '#991B1B' : 'var(--ink-navy)') + ';">' + formatEurCurrency(inv.totalAmount) + '</strong>' +
            '</div>' +
            '<div class="summary-strip" style="margin:10px 0;">' +
              '<div class="summary-row"><span>Data emissione · Scadenza</span><strong>' + formatIsoIt(inv.issueDate) + ' &rarr; ' + formatIsoIt(inv.dueDate) + '</strong></div>' +
              '<div class="summary-row"><span>Imponibile + IVA = Totale</span><strong>' + formatEurCurrency(inv.netAmount) + ' + ' + formatEurCurrency(inv.vatAmount) + ' = ' + formatEurCurrency(inv.totalAmount) + '</strong></div>' +
              '<div class="summary-row"><span>IBAN per bonifico</span><strong style="word-break:break-all;">' + escapeHtml(inv.iban) + '</strong></div>' +
            '</div>' +
            '<div class="ita-actions-grid">' +
              '<button type="button" class="ita-btn ita-btn-secondary" onclick="window.ITATodoAdminUI.toggleInlinePanel(\'inv-open-' + inv.id + '\')">' +
                'Apri fattura' +
              '</button>' +
              '<button type="button" class="ita-btn ita-btn-primary" onclick="window.ITATodoAdminUI.toggleInlinePanel(\'inv-pay-' + inv.id + '\')">' +
                'Segna come pagata' +
              '</button>' +
              '<button type="button" class="ita-btn ita-btn-secondary" onclick="window.ITATodoAdminUI.toggleInlinePanel(\'inv-postpone-' + inv.id + '\')">' +
                'Rimanda' +
              '</button>' +
              '<button type="button" class="ita-btn ita-btn-secondary" onclick="window.ITATodoAdminUI.toggleInlinePanel(\'inv-contest-' + inv.id + '\')">' +
                'Contesta' +
              '</button>' +
            '</div>' +
            // Pannello 1: Apri fattura
            '<div class="ita-inline-panel" id="inv-open-' + inv.id + '">' +
              '<strong>Dettaglio Documento Passivo (' + escapeHtml(inv.sourceFormat) + '):</strong><br/>' +
              'Fornitore: ' + escapeHtml(inv.supplierName) + ' · N. ' + escapeHtml(inv.invoiceNumber) + ' del ' + formatIsoIt(inv.issueDate) + '<br/>' +
              'Imponibile: ' + formatEurCurrency(inv.netAmount) + ' · IVA 22%: ' + formatEurCurrency(inv.vatAmount) + ' · Totale: <strong>' + formatEurCurrency(inv.totalAmount) + '</strong><br/>' +
              'IBAN: <code>' + escapeHtml(inv.iban) + '</code> · Centro di costo: ' + escapeHtml(inv.unitName) +
            '</div>' +
            // Pannello 2: Segna come pagata (Data, Metodo, Riferimento bonifico, Ricevuta opzionale)
            '<div class="ita-inline-panel" id="inv-pay-' + inv.id + '">' +
              '<h4 style="margin-bottom:8px;">Registra pagamento fattura ' + escapeHtml(inv.invoiceNumber) + '</h4>' +
              '<div class="wizard-grid-2">' +
                '<div class="field-group"><label class="field-label" for="pay-date-' + inv.id + '">Data pagamento *</label><input type="date" id="pay-date-' + inv.id + '" class="field-input" value="' + getRomeTodayIso() + '"/></div>' +
                '<div class="field-group"><label class="field-label" for="pay-method-' + inv.id + '">Metodo di pagamento *</label>' +
                  '<select id="pay-method-' + inv.id + '" class="field-select">' +
                    '<option value="Bonifico Bancario SEPA">Bonifico Bancario SEPA</option>' +
                    '<option value="Addebito Diretto SDD">Addebito Diretto SDD</option>' +
                  '</select>' +
                '</div>' +
                '<div class="field-group"><label class="field-label" for="pay-ref-' + inv.id + '">Riferimento bonifico (CRO / TRN) *</label><input type="text" id="pay-ref-' + inv.id + '" class="field-input" value="CRO-IT-2026-9981204"/></div>' +
                '<div class="field-group"><label class="field-label" for="pay-rec-' + inv.id + '">Ricevuta (opzionale)</label><input type="text" id="pay-rec-' + inv.id + '" class="field-input" placeholder="Es. contabile_bonifico.pdf"/></div>' +
              '</div>' +
              '<button type="button" class="ita-btn ita-btn-primary" onclick="window.ITATodoAdminUI.confirmMarkInvoicePaid(\'' + inv.id + '\')">Conferma pagamento e sposta nello storico</button>' +
            '</div>' +
            // Pannello 3: Rimanda (nuova data con motivo)
            '<div class="ita-inline-panel" id="inv-postpone-' + inv.id + '">' +
              '<h4 style="margin-bottom:8px;">Rimanda scadenza fattura ' + escapeHtml(inv.invoiceNumber) + '</h4>' +
              '<div class="wizard-grid-2">' +
                '<div class="field-group"><label class="field-label" for="post-date-' + inv.id + '">Nuova data di scadenza *</label><input type="date" id="post-date-' + inv.id + '" class="field-input" value="' + addDaysIso(getRomeTodayIso(), 10) + '"/></div>' +
                '<div class="field-group"><label class="field-label" for="post-reason-' + inv.id + '">Motivo del rinvio *</label><input type="text" id="post-reason-' + inv.id + '" class="field-input" value="Accordo telefonico con fornitore per saldo a fine mese"/></div>' +
              '</div>' +
              '<button type="button" class="ita-btn ita-btn-primary" onclick="window.ITATodoAdminUI.confirmPostponeInvoice(\'' + inv.id + '\')">Conferma nuova scadenza</button>' +
            '</div>' +
            // Pannello 4: Contesta (con nota)
            '<div class="ita-inline-panel" id="inv-contest-' + inv.id + '">' +
              '<h4 style="margin-bottom:8px;">Contesta fattura ' + escapeHtml(inv.invoiceNumber) + '</h4>' +
              '<div class="field-group"><label class="field-label" for="cont-note-' + inv.id + '">Nota di contestazione obbligatoria *</label><input type="text" id="cont-note-' + inv.id + '" class="field-input" value="Importo non allineato al preventivo approvato: richiesta nota di credito"/></div>' +
              '<button type="button" class="ita-btn ita-btn-primary" onclick="window.ITATodoAdminUI.confirmContestInvoice(\'' + inv.id + '\')">Registra contestazione</button>' +
            '</div>' +
          '</article>';
        });
      }
      html += '</div>';
    } else {
      html += '<div class="ita-sec-block" id="todo-sec-pagamenti-hidden">' +
        '<p style="color:var(--ink-muted);font-size:0.9rem;"><em>Sezione Pagamenti non visibile per il ruolo ' + escapeHtml(role) + ' (permesso non abilitato).</em></p>' +
      '</div>';
    }

    /* ----------------------------------------------------------------
       SEZIONE 4: APPROVAZIONI ("APPROVAZIONE PREVENTIVI SPESE EXTRA")
       ---------------------------------------------------------------- */
    if (vis.canSeeApprovazioni) {
      html += '<div class="ita-sec-block" id="todo-sec-approvazioni">' +
        '<div class="ita-sec-head">' +
          '<h3>Sezione 4 · Approvazioni Preventivi Spese Extra (' + counts.approvazioni + ')</h3>' +
          '<button type="button" class="ita-btn ita-btn-secondary" style="width:auto;min-height:44px;padding:8px 14px;" onclick="window.ITATodoAdminUI.toggleInlinePanel(\'form-new-extra-quote\')">' +
            '+ Nuovo Preventivo Extra' +
          '</button>' +
        '</div>' +
        '<p style="color:var(--ink-muted);font-size:0.9rem;margin-bottom:12px;">' +
          'Regola soglie attiva: fino a <strong>' + formatEurCurrency(limitEur) + '</strong> approva il Manager; oltre <strong>' + formatEurCurrency(limitEur) + '</strong> serve il Titolare; se la spesa è a carico del Proprietario serve anche la sua approvazione dalla sua area.' +
        '</p>';

      // Form inserimento nuovo preventivo
      html += '<div class="ita-inline-panel" id="form-new-extra-quote" style="margin-bottom:16px;">' +
        '<h4 style="margin-bottom:10px;">Inserisci nuovo preventivo spesa straordinaria</h4>' +
        '<div class="wizard-grid-2">' +
          '<div class="field-group"><label class="field-label" for="new-quo-type">Intervento / Fornitore *</label><input type="text" id="new-quo-type" class="field-input" value="Fabbro Serratura Smart"/></div>' +
          '<div class="field-group"><label class="field-label" for="new-quo-amt">Importo (€) *</label><input type="number" id="new-quo-amt" class="field-input" value="280"/></div>' +
          '<div class="field-group"><label class="field-label" for="new-quo-unit">Unità *</label>' +
            '<select id="new-quo-unit" class="field-select">' +
              '<option value="unit_santo_spirito">Camera 3 (Appartamento Santo Spirito)</option>' +
              '<option value="unit_oltrarno">Suite Palazzo Oltrarno</option>' +
              '<option value="unit_santa_croce">Santa Croce Design Loft</option>' +
            '</select>' +
          '</div>' +
          '<div class="field-group"><label class="field-label" for="new-quo-charge">Spesa a carico di</label>' +
            '<select id="new-quo-charge" class="field-select">' +
              '<option value="struttura">Struttura (Gestione)</option>' +
              '<option value="proprietario">Proprietario dell’unità</option>' +
            '</select>' +
          '</div>' +
          '<div class="field-group"><label class="field-label" for="new-quo-urg">Urgenza</label>' +
            '<select id="new-quo-urg" class="field-select">' +
              '<option value="urgente">Urgente</option>' +
              '<option value="normale">Normale</option>' +
            '</select>' +
          '</div>' +
          '<div class="field-group"><label class="field-label" for="new-quo-reason">Motivo e foto/allegati *</label><input type="text" id="new-quo-reason" class="field-input" value="Riparazione cilindro di emergenza portoncino blindato"/></div>' +
        '</div>' +
        '<button type="button" class="ita-btn ita-btn-primary" onclick="window.ITATodoAdminUI.submitNewExtraQuote()">Invia preventivo in approvazione</button>' +
      '</div>';

      if (data.approvazioni.length === 0) {
        html += '<p style="color:var(--status-ok-text);font-weight:600;">Nessun preventivo in attesa di approvazione.</p>';
      } else {
        data.approvazioni.forEach(function (q) {
          var badges = '';
          if (q.urgentOver24h) {
            badges += '<span class="ita-badge-urgent" style="margin-right:6px;">URGENTE &gt; 24h Non Approvato</span> ';
          } else if (q.urgency === 'urgente') {
            badges += '<span class="ita-badge-urgent" style="margin-right:6px;">Urgente</span> ';
          }
          if (q.chargeTo === 'proprietario') {
            badges += '<span class="ita-badge-info" style="margin-right:6px;">A carico del Proprietario</span> ';
          } else if (q.amount > limitEur) {
            badges += '<span class="ita-badge-info" style="margin-right:6px;">Oltre soglia (' + formatEurCurrency(limitEur) + ') · Serve Titolare</span> ';
          } else {
            badges += '<span class="ita-badge-info" style="margin-right:6px;">Approvabile da Manager o Titolare</span> ';
          }

          var canApprove = q.permissionCheck && q.permissionCheck.allowed;

          html += '<article class="ita-todo-card ' + (q.urgentOver24h ? 'urgent-24h' : '') + '" id="card-quo-' + q.id + '">' +
            '<div class="item-card-head">' +
              '<div>' +
                '<div style="margin-bottom:6px;">' + badges + '</div>' +
                '<h3>' + escapeHtml(q.title) + '</h3>' +
                '<p style="color:var(--ink-muted);font-size:0.9rem;">Inserito da: <strong>' + escapeHtml(q.createdBy) + '</strong> · Unità: <strong>' + escapeHtml(q.unitName) + '</strong></p>' +
              '</div>' +
              '<strong style="font-size:1.25rem;color:var(--ink-navy);">' + formatEurCurrency(q.amount) + '</strong>' +
            '</div>' +
            '<div class="summary-strip" style="margin:10px 0;">' +
              '<div class="summary-row"><span>Motivo intervento</span><strong>' + escapeHtml(q.reason) + '</strong></div>' +
              '<div class="summary-row"><span>Foto e Allegati</span><strong>' + escapeHtml((q.attachments || []).join(', ')) + '</strong></div>' +
              '<div class="summary-row"><span>Stato flusso · Permesso ruolo attuale</span><strong>' + escapeHtml(q.status) + ' · ' + escapeHtml(q.permissionCheck ? q.permissionCheck.reason : '') + '</strong></div>' +
            '</div>' +
            '<div class="ita-actions-grid">' +
              '<button type="button" class="ita-btn ' + (canApprove ? 'ita-btn-primary' : 'ita-btn-secondary') + '" onclick="window.ITATodoAdminUI.approveQuoteDirect(\'' + q.id + '\')">' +
                (canApprove ? 'Approva' : 'Approva (Richiede ' + (q.chargeTo === 'proprietario' ? 'Proprietario' : 'Titolare') + ')') +
              '</button>' +
              '<button type="button" class="ita-btn ita-btn-secondary" onclick="window.ITATodoAdminUI.toggleInlinePanel(\'quo-reject-' + q.id + '\')">' +
                'Rifiuta' +
              '</button>' +
              '<button type="button" class="ita-btn ita-btn-secondary" onclick="window.ITATodoAdminUI.toggleInlinePanel(\'quo-change-' + q.id + '\')">' +
                'Chiedi modifica' +
              '</button>' +
            '</div>' +
            // Pannello Rifiuta (motivo obbligatorio)
            '<div class="ita-inline-panel" id="quo-reject-' + q.id + '">' +
              '<h4 style="margin-bottom:8px;">Rifiuta preventivo (motivo obbligatorio)</h4>' +
              '<div class="field-group"><label class="field-label" for="rej-note-' + q.id + '">Motivo del rifiuto *</label><input type="text" id="rej-note-' + q.id + '" class="field-input" placeholder="Es. Importo fuori budget, richiedere secondo preventivo"/></div>' +
              '<button type="button" class="ita-btn ita-btn-primary" onclick="window.ITATodoAdminUI.confirmRejectQuote(\'' + q.id + '\')">Conferma rifiuto e invia notifica</button>' +
            '</div>' +
            // Pannello Chiedi Modifica
            '<div class="ita-inline-panel" id="quo-change-' + q.id + '">' +
              '<h4 style="margin-bottom:8px;">Chiedi modifica al preventivo</h4>' +
              '<div class="field-group"><label class="field-label" for="chg-note-' + q.id + '">Dettaglio modifica richiesta *</label><input type="text" id="chg-note-' + q.id + '" class="field-input" placeholder="Es. Scorporare costo manodopera e specificare tempi intervento"/></div>' +
              '<button type="button" class="ita-btn ita-btn-primary" onclick="window.ITATodoAdminUI.confirmChangeQuote(\'' + q.id + '\')">Invia richiesta modifica</button>' +
            '</div>' +
          '</article>';
        });
      }

      // Avanza preventivi approvati nel flusso: Approvato -> Eseguito -> Fatturato (collegato a punto B)
      if (data.workflowFollowupQuotes.length > 0) {
        html += '<div style="margin-top:12px;padding:12px;background:var(--bg-stone);border-radius:10px;border:1px solid var(--border-control);">' +
          '<strong style="display:block;margin-bottom:8px;">Flusso Preventivi Approvati (Approvato &rarr; Eseguito &rarr; Fatturato):</strong>';
        data.workflowFollowupQuotes.forEach(function (fq) {
          html += '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding:8px 0;border-bottom:1px solid var(--border-control);">' +
            '<span><strong>' + escapeHtml(fq.title) + '</strong> — Stato attuale: <span class="status-pill">' + escapeHtml(fq.status) + '</span></span>' +
            (fq.status !== 'Fatturato' ? (
              '<button type="button" class="ita-btn ita-btn-secondary" style="width:auto;min-height:42px;padding:6px 12px;" onclick="window.ITATodoAdminUI.advanceQuoteStage(\'' + fq.id + '\')">' +
                (fq.status === 'Approvato' ? 'Segna come Eseguito' : 'Passa a Fatturato (Genera Fattura in Pagamenti)') +
              '</button>'
            ) : '<span style="font-size:0.875rem;color:var(--status-ok-text);font-weight:700;">Collegato a fattura passiva</span>') +
          '</div>';
        });
        html += '</div>';
      }

      html += '</div>';
    }

    /* ----------------------------------------------------------------
       SEZIONE "FATTE OGGI (VISIBILI FINO A MEZZANOTTE)"
       ---------------------------------------------------------------- */
    html += '<div class="ita-sec-block" id="todo-sec-fatte-oggi">' +
      '<div class="ita-sec-head">' +
        '<h3>Attività completate ("Fatte oggi" · visibili fino a mezzanotte: ' + counts.completedToday + ')</h3>' +
      '</div>';

    if (data.completedToday.length === 0) {
      html += '<p style="color:var(--ink-muted);font-size:0.9rem;">Le attività spuntate oggi appariranno qui e resteranno visibili fino alle 23:59 (Europe/Rome).</p>';
    } else {
      data.completedToday.forEach(function (doneItem) {
        html += '<div class="ita-done-row">' +
          '<span>&#10003; [' + escapeHtml(doneItem.sectionLabel) + '] ' + escapeHtml(doneItem.title) + '</span>' +
          '<small>' + escapeHtml(doneItem.completedAtRome) + '</small>' +
        '</div>';
      });
    }
    html += '</div>';

    /* ----------------------------------------------------------------
       STORICO PAGAMENTI, NOTIFICHE E REGISTRO AZIONI (CHI, QUANDO, COSA)
       ---------------------------------------------------------------- */
    html += '<details style="margin-top:16px;border:1.5px solid var(--border-control);border-radius:10px;padding:12px;background:var(--bg-stone);" id="todo-history-details" open>' +
      '<summary style="font-weight:700;cursor:pointer;">Storico Azioni, Bonifici Fatture Saldate e Notifiche (Chi · Quando · Cosa)</summary>' +
      '<div style="margin-top:12px;">';

    if (data.paidInvoicesHistory.length > 0) {
      html += '<h4 style="margin-bottom:6px;">Fatture Fornitori Saldate nello Storico (' + data.paidInvoicesHistory.length + '):</h4>';
      data.paidInvoicesHistory.forEach(function (pi) {
        var pInfo = pi.paymentInfo || {};
        html += '<div style="background:var(--bg-light);border:1px solid var(--border-control);border-radius:8px;padding:10px;margin-bottom:8px;font-size:0.9rem;">' +
          '<strong>' + escapeHtml(pi.supplierName) + ' · Fattura ' + escapeHtml(pi.invoiceNumber) + ' (' + formatEurCurrency(pi.totalAmount) + ')</strong><br/>' +
          'Pagata il: <strong>' + formatIsoIt(pInfo.paidDate) + '</strong> · Metodo: <strong>' + escapeHtml(pInfo.method) + '</strong> · Rif. Bonifico: <strong>' + escapeHtml(pInfo.bankRef) + '</strong>' +
        '</div>';
      });
    }

    html += '<h4 style="margin:10px 0 6px;">Registro Cronologico Completo (Europe/Rome):</h4>';
    (st.auditHistory || []).slice(0, 10).forEach(function (aud) {
      html += '<div style="padding:8px 0;border-bottom:1px solid var(--border-control);font-size:0.875rem;">' +
        '<strong>[' + escapeHtml(aud.whenRome) + '] ' + escapeHtml(aud.who) + ':</strong> ' + escapeHtml(aud.what) +
      '</div>';
    });

    html += '</div></details>';
    html += '</div>';

    mount.innerHTML = html;
  }

  /* ================================================================
     CONTROLLER AZIONI INTERATTIVE UI
     ================================================================ */
  var ITATodoAdminUI = {
    refresh: function () {
      renderUnifiedTodoUI();
    },
    setFeedback: function (okMsg, errMsg) {
      _uiFeedbackBanner = okMsg || '';
      _uiErrorBanner = errMsg || '';
      renderUnifiedTodoUI();
    },
    toggleInlinePanel: function (panelId) {
      var el = document.getElementById(panelId);
      if (!el) return;
      el.classList.toggle('open');
    },
    switchRole: function (roleKey) {
      root.ITATodoAdminEngine.setRole(roleKey);
      this.setFeedback('Ruolo attivo aggiornato: ' + roleKey.toUpperCase(), '');
    },
    toggleRecPerm: function (checked) {
      root.ITATodoAdminEngine.setReceptionistPermission(checked);
      this.setFeedback(
        checked
          ? 'Permesso abilitato: il Manager/Receptionist può ora vedere Pagamenti e Revenue.'
          : 'Permesso disabilitato: il Manager/Receptionist non vede le sezioni Pagamenti e Revenue.',
        ''
      );
    },
    changeThreshold: function (val) {
      var st = root.ITATodoAdminEngine.setManagerThreshold(val);
      this.setFeedback('Soglia approvazione Manager impostata a ' + formatEurCurrency(st.permissions.managerApprovalLimitEur) + '.', '');
    },
    send0830SummaryNow: function () {
      var res = triggerDailySummary0830Dispatch();
      this.setFeedback(res.message, '');
    },
    quickMarkAlloggiatiDone: function (bookingId) {
      if (typeof root.appState !== 'undefined' && root.appState && Array.isArray(root.appState.bookings)) {
        var guestName = bookingId;
        root.appState.bookings.forEach(function (b) {
          if (b.id === bookingId) {
            b.alloggiatiSent = true;
            guestName = b.guest;
          }
        });
        if (typeof root.saveState === 'function') root.saveState();
        root.ITATodoAdminEngine.recordOperationalCompletion(bookingId, guestName);
        if (typeof root.renderAll === 'function') root.renderAll();
      }
      this.setFeedback('Schedina Alloggiati Web segnata come inviata e registrata in Fatte oggi.', '');
    },
    approveRevenue: function (reportId) {
      var res = approveRevenueSuggestions(reportId);
      if (res.ok) {
        this.setFeedback('Suggerimenti di prezzo approvati per "' + res.report.title + '". Attività spostata in Fatte oggi.', '');
      }
    },
    markRevenueRead: function (reportId) {
      var res = markRevenueReportAsRead(reportId);
      if (res.ok) {
        this.setFeedback('Report "' + res.report.title + '" segnato come letto.', '');
      }
    },
    exportRevenuePdf: function (reportId) {
      var res = exportRevenueReportPdf(reportId, 'ALL');
      if (res.ok) {
        this.setFeedback('PDF esportato per "' + res.report.title + '".', '');
      }
    },
    submitNewPassiveInvoice: function () {
      var sup = (document.getElementById('new-inv-sup') && document.getElementById('new-inv-sup').value) || '';
      var num = (document.getElementById('new-inv-num') && document.getElementById('new-inv-num').value) || '';
      var net = (document.getElementById('new-inv-net') && document.getElementById('new-inv-net').value) || '250';
      var due = (document.getElementById('new-inv-due') && document.getElementById('new-inv-due').value) || getRomeTodayIso();
      var iban = (document.getElementById('new-inv-iban') && document.getElementById('new-inv-iban').value) || '';
      var unit = (document.getElementById('new-inv-unit') && document.getElementById('new-inv-unit').value) || 'unit_santo_spirito';

      var res = addPassiveSupplierInvoice({
        supplierName: sup,
        invoiceNumber: num,
        netAmount: Number(net),
        dueDate: due,
        iban: iban,
        unitId: unit
      });
      if (!res.ok) {
        this.setFeedback('', res.error);
      } else {
        this.setFeedback('Fattura ' + res.invoice.invoiceNumber + ' aggiunta nella sezione Pagamenti.', '');
      }
    },
    confirmMarkInvoicePaid: function (invId) {
      var d = (document.getElementById('pay-date-' + invId) && document.getElementById('pay-date-' + invId).value) || getRomeTodayIso();
      var m = (document.getElementById('pay-method-' + invId) && document.getElementById('pay-method-' + invId).value) || 'Bonifico Bancario SEPA';
      var r = (document.getElementById('pay-ref-' + invId) && document.getElementById('pay-ref-' + invId).value) || '';
      var rec = (document.getElementById('pay-rec-' + invId) && document.getElementById('pay-rec-' + invId).value) || '';

      var res = markSupplierInvoicePaid(invId, {
        paidDate: d,
        method: m,
        bankRef: r,
        receiptName: rec
      });
      if (!res.ok) {
        this.setFeedback('', res.error);
      } else {
        this.setFeedback(
          'Fattura ' + res.invoice.invoiceNumber + ' (' + res.invoice.supplierName + ') segnata come pagata (Rif. ' + r + ') e spostata nello storico.',
          ''
        );
      }
    },
    confirmPostponeInvoice: function (invId) {
      var d = (document.getElementById('post-date-' + invId) && document.getElementById('post-date-' + invId).value) || '';
      var r = (document.getElementById('post-reason-' + invId) && document.getElementById('post-reason-' + invId).value) || '';
      var res = postponeSupplierInvoice(invId, d, r);
      if (!res.ok) {
        this.setFeedback('', res.error);
      } else {
        this.setFeedback('Fattura ' + res.invoice.invoiceNumber + ' rimandata al ' + formatIsoIt(d) + '.', '');
      }
    },
    confirmContestInvoice: function (invId) {
      var n = (document.getElementById('cont-note-' + invId) && document.getElementById('cont-note-' + invId).value) || '';
      var res = contestSupplierInvoice(invId, n);
      if (!res.ok) {
        this.setFeedback('', res.error);
      } else {
        this.setFeedback('Fattura ' + res.invoice.invoiceNumber + ' segnata come contestata.', '');
      }
    },
    approveQuoteDirect: function (quoteId) {
      var res = decideExtraQuote(quoteId, 'approve', '');
      if (!res.ok) {
        this.setFeedback('', res.error);
      } else {
        this.setFeedback('Preventivo approvato: "' + res.quote.title + '". Notifica inviata a ' + res.quote.createdBy + '.', '');
      }
    },
    confirmRejectQuote: function (quoteId) {
      var n = (document.getElementById('rej-note-' + quoteId) && document.getElementById('rej-note-' + quoteId).value) || '';
      var res = decideExtraQuote(quoteId, 'reject', n);
      if (!res.ok) {
        this.setFeedback('', res.error);
      } else {
        this.setFeedback('Preventivo rifiutato e notifica inviata a ' + res.quote.createdBy + '.', '');
      }
    },
    confirmChangeQuote: function (quoteId) {
      var n = (document.getElementById('chg-note-' + quoteId) && document.getElementById('chg-note-' + quoteId).value) || '';
      var res = decideExtraQuote(quoteId, 'request_change', n);
      if (!res.ok) {
        this.setFeedback('', res.error);
      } else {
        this.setFeedback('Richiesta di modifica inviata a ' + res.quote.createdBy + '.', '');
      }
    },
    advanceQuoteStage: function (quoteId) {
      var res = advanceApprovedQuoteToInvoiced(quoteId);
      if (!res.ok) {
        this.setFeedback('', res.error);
      } else if (res.stage === 'Fatturato' && res.invoice) {
        this.setFeedback('Preventivo passato a Fatturato: generata fattura passiva ' + res.invoice.invoiceNumber + ' nella sezione Pagamenti.', '');
      } else {
        this.setFeedback('Preventivo aggiornato allo stato: ' + res.stage + '.', '');
      }
    },
    submitNewExtraQuote: function () {
      var t = (document.getElementById('new-quo-type') && document.getElementById('new-quo-type').value) || '';
      var a = (document.getElementById('new-quo-amt') && document.getElementById('new-quo-amt').value) || '0';
      var u = (document.getElementById('new-quo-unit') && document.getElementById('new-quo-unit').value) || 'unit_santo_spirito';
      var c = (document.getElementById('new-quo-charge') && document.getElementById('new-quo-charge').value) || 'struttura';
      var urg = (document.getElementById('new-quo-urg') && document.getElementById('new-quo-urg').value) || 'normale';
      var r = (document.getElementById('new-quo-reason') && document.getElementById('new-quo-reason').value) || '';

      var res = createNewExtraQuote({
        interventionType: t,
        amount: Number(a),
        unitId: u,
        chargeTo: c,
        urgency: urg,
        reason: r
      });
      if (!res.ok) {
        this.setFeedback('', res.error);
      } else {
        this.setFeedback('Preventivo "' + res.quote.title + '" aggiunto in Approvazioni.', '');
      }
    }
  };

  root.ITATodoAdminEngine = {
    officialLocations: OFFICIAL_LOCATIONS,
    getState: loadTodoAdminState,
    saveState: saveTodoAdminState,
    resetState: function () {
      var def = getDefaultTodoAdminState();
      saveTodoAdminState(def);
      return def;
    },
    setRole: function (roleKey) {
      var st = loadTodoAdminState();
      st.currentRole = roleKey || 'titolare';
      recordAuditEntry(st, 'Cambio vista ruolo in To-Do: ' + (st.currentUserLabels[st.currentRole] || st.currentRole));
      saveTodoAdminState(st);
      return st;
    },
    setReceptionistPermission: function (enabled) {
      var st = loadTodoAdminState();
      if (!st.permissions) st.permissions = {};
      st.permissions.receptionistViewRevenueAndPayments = Boolean(enabled);
      recordAuditEntry(
        st,
        'Aggiornato permesso Receptionist/Manager per Pagamenti e Revenue: ' + (enabled ? 'ABILITATO' : 'DISABILITATO')
      );
      saveTodoAdminState(st);
      return st;
    },
    setManagerThreshold: function (valEur) {
      var st = loadTodoAdminState();
      if (!st.permissions) st.permissions = {};
      st.permissions.managerApprovalLimitEur = Math.max(50, Number(valEur) || 500);
      recordAuditEntry(
        st,
        'Soglia approvazione autonoma Manager aggiornata a ' + formatEurCurrency(st.permissions.managerApprovalLimitEur) + '.'
      );
      saveTodoAdminState(st);
      return st;
    },
    recordOperationalCompletion: function (bookingId, guestName) {
      var st = loadTodoAdminState();
      if (!st.completedOperationalToday) st.completedOperationalToday = {};
      st.completedOperationalToday['aw_' + bookingId] = formatRomeDateTime(getRomeNow());
      recordAuditEntry(st, 'Inviata schedina Alloggiati Web per ospite ' + (guestName || bookingId) + '.');
      saveTodoAdminState(st);
      return st;
    },
    recordMaintenanceCompletionCharge: function (chargeItem) {
      var c = chargeItem || {};
      var st = loadTodoAdminState();
      if (!st.completedOperationalToday) st.completedOperationalToday = {};
      var key = 'mnt_' + (c.ticketId || Date.now());
      st.completedOperationalToday[key] = formatRomeDateTime(getRomeNow());
      recordAuditEntry(
        st,
        'Completato intervento manutenzione ' + (c.ticketId || '') + ' ("' + (c.taskTitle || 'Manutenzione') + '") e registrato addebito sul conto Proprietario per ' + formatEurCurrency(c.ownerTotalChargeEur || 30) + '.'
      );
      saveTodoAdminState(st);
      return st;
    },
    computeUnifiedTodoSections: computeUnifiedTodoSections,
    approveRevenueSuggestions: approveRevenueSuggestions,
    markRevenueReportAsRead: markRevenueReportAsRead,
    exportRevenueReportPdf: exportRevenueReportPdf,
    addPassiveSupplierInvoice: addPassiveSupplierInvoice,
    markSupplierInvoicePaid: markSupplierInvoicePaid,
    postponeSupplierInvoice: postponeSupplierInvoice,
    contestSupplierInvoice: contestSupplierInvoice,
    decideExtraQuote: decideExtraQuote,
    advanceApprovedQuoteToInvoiced: advanceApprovedQuoteToInvoiced,
    createNewExtraQuote: createNewExtraQuote,
    triggerDailySummary0830Dispatch: triggerDailySummary0830Dispatch,
    renderUnifiedTodoUI: renderUnifiedTodoUI
  };

  root.ITATodoAdminUI = ITATodoAdminUI;

  /* Auto-aggancio non invasivo a app.html (preserva 100% di Agente 1 e Agente 2) */
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      renderUnifiedTodoUI();

      // Intercetta in modo additivo renderAll() e completeAlloggiatiAction() se presenti
      if (typeof root.renderAll === 'function' && !root.renderAll._itaTodoWrapped) {
        var origRenderAll = root.renderAll;
        var wrappedRender = function () {
          var r = origRenderAll.apply(this, arguments);
          renderUnifiedTodoUI();
          return r;
        };
        wrappedRender._itaTodoWrapped = true;
        root.renderAll = wrappedRender;
      }

      if (typeof root.completeAlloggiatiAction === 'function' && !root.completeAlloggiatiAction._itaTodoWrapped) {
        var origCompleteAw = root.completeAlloggiatiAction;
        var wrappedAw = function () {
          var sel = document.getElementById('aw-booking-select');
          var bId = sel ? sel.value : '';
          var cog = (document.getElementById('aw-cognome') && document.getElementById('aw-cognome').value) || '';
          var nom = (document.getElementById('aw-nome') && document.getElementById('aw-nome').value) || '';
          var res = origCompleteAw.apply(this, arguments);
          if (bId) {
            root.ITATodoAdminEngine.recordOperationalCompletion(bId, (nom + ' ' + cog).trim());
            renderUnifiedTodoUI();
          }
          return res;
        };
        wrappedAw._itaTodoWrapped = true;
        root.completeAlloggiatiAction = wrappedAw;
      }
    });
  }
})(typeof window !== 'undefined' ? window : this);
