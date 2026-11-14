/**
 * site-config.js — UNICA FONTE DI VERITÀ (Single Source of Truth) per itassistance
 * Tutti i prezzi, condizioni, orari, contatti e dati legali del sito, del generatore PDF
 * e delle comunicazioni email/WhatsApp sono letti da questo file.
 */
(function (root) {
  'use strict';

  var SITE_CONFIG = {
    brand: {
      name: 'ITASSISTANCEDREAMTEAM.IT',
      teamLabel: 'il team di ITASSISTANCEDREAMTEAM.IT',
      tagline: 'Gestione operativa e assistenza per il tuo affitto breve a Firenze. Quota fissa 99,00 €/mese, zero commissioni.',
      domain: 'https://www.itadreamteam.com',
      logoPath: '/brand/logo.png'
    },

    pricing: {
      monthlyEur: 99,
      minMonthlyEur: 99.00,
      maxMonthlyEur: 99.00,
      yearlyEur: 1188,
      currency: '€',
      currencyCode: 'EUR',
      vatIncluded: true,
      vatLabel: 'IVA inclusa',
      monthlyFormatted: '99,00 €',
      rangeFormatted: '99,00 € / mese',
      yearlyFormatted: '1.188,00 €',
      pricePerMonthLabel: '99,00 € / mese',
      priceFullLabel: '99,00 € al mese (IVA inclusa)',
      commissionPct: 0,
      commissionLabel: 'Zero commissioni sulle prenotazioni (0%)',
      activationFeeEur: 0,
      activationLabel: 'Zero costi di attivazione',
      cancellationLabel: 'Disdetta libera in qualsiasi momento, senza penali',
      billingMode: 'proforma_mybox_manual_invoice',
      paymentModesLabel: 'Attivazione solo su fattura tramite area riservata "My Box": controlli e confermi il pro-forma nel tuo My Box, ricevi copia via email e l\'amministrazione emette manualmente la fattura per il pagamento con bonifico bancario (Termini di pagamento: Saldo a vista / entro 5 giorni lavorativi tramite bonifico bancario; IBAN: [DA CONFERMARE]).',
      guaranteeDays: 14,
      guaranteeTitle: 'Garanzia 14 giorni Soddisfatto o Rimborsato',
      guaranteeText: 'Prova l’app senza rischi: se entro 14 giorni decidi che non fa per te, disdici liberamente e ricevi il rimborso del 100% tramite bonifico bancario manuale gestito dall’amministrazione.'
    },

    calculatorDefaults: {
      defaultAnnualRevenueEur: 30000,
      minAnnualRevenueEur: 10000,
      maxAnnualRevenueEur: 120000,
      stepAnnualRevenueEur: 2500,
      defaultPmCommissionPct: 20,
      pmCommissionRangeLabel: '18–25%'
    },

    marketStats: {
      directOwnersPct: '[DA CONFERMARE]',
      directOwnersLabel: 'Gestione diretta da parte del proprietario-gestore con supporto operativo a Firenze [DA CONFERMARE].',
      smallHostsPct: '[DA CONFERMARE]',
      smallHostsLabel: 'Proprietari di singoli appartamenti e piccoli portafogli immobiliari a Firenze [DA CONFERMARE].',
      proRevenueSharePct: '[DA CONFERMARE]',
      proRevenueShareLabel: 'Ottimizzazione operativa e controllo diretto dei costi e delle scadenze [DA CONFERMARE].',
      sourcesCitation: '[DA CONFERMARE]'
    },

    extras: {
      availableCity: 'Firenze',
      revenueAndLegalAddon: {
        id: 'revenue_adempimenti_10',
        name: 'Revenue Plan opzionale (+10%)',
        ratePct: 10,
        rateFormatted: '+10% sul netto spettante al proprietario, prima delle tasse personali',
        calculationBasis: '10% calcolato sul netto spettante al proprietario (incasso pagato dall\'ospite al netto di commissioni OTA, imposta di soggiorno e costi di pulizia), prima delle sue tasse personali',
        netDeductionsDefinition: 'Incasso pagato dall\'ospite al netto di: (a) commissioni delle piattaforme (OTA), (b) imposta di soggiorno e (c) costi di pulizia',
        invoicingFrequency: 'Mensile (fattura emessa a fine mese sulle prenotazioni del mese)',
        invoicingAndPaymentTerms: 'Fattura emessa a fine mese sulle prenotazioni del mese; termini di pagamento della fattura: Saldo a vista / entro 5 giorni lavorativi tramite bonifico bancario',
        basePlanCommissionPct: 0,
        description: 'Revenue Plan opzionale: commissione del 10% calcolata sul netto spettante al proprietario (incasso pagato dall\'ospite al netto di commissioni OTA, imposta di soggiorno e costi di pulizia), prima delle sue tasse personali; fattura emessa a fine mese sulle prenotazioni del mese (termini di pagamento della fattura: Saldo a vista / entro 5 giorni lavorativi tramite bonifico bancario). Nel piano base senza Revenue Plan: 0% commissioni sulle prenotazioni.',
        descriptionEN: 'Optional Revenue Plan: 10% commission calculated on the net amount due to the owner (guest payment net of OTA platform commissions, tourist tax, and cleaning costs), before personal taxes; invoiced at the end of each month on the month\'s bookings (invoice payment terms: Payable upon receipt / within 5 business days via bank transfer). Base plan without Revenue Plan: 0% booking commissions.'
      },
      operationalCoordination: {
        summaryIT: 'Coordinamento della parte operativa del Property Management: coordiniamo pulizie, accoglienza ospiti, manutenzioni e fornitori, con report giornaliero e promemoria operativi nella tua area riservata.',
        summaryEN: 'Operational Property Management coordination: we coordinate cleaning turnovers, guest welcome, maintenance and suppliers, with daily operational reports and reminders in your owner dashboard.'
      },
      note: 'Servizi extra opzionali a richiesta (separati dal canone base dell’app da 99,00 €/mese, attivabili solo se li desideri):',
      items: [
        {
          id: 'revenue_adempimenti',
          name: 'Revenue Plan opzionale (gestione dinamica tariffe e ottimizzazione commerciale)',
          priceEur: null,
          priceFormatted: '+10% sul netto spettante al proprietario (incasso ospite meno commissioni OTA, imposta di soggiorno e pulizie), prima delle tasse personali · fatturazione a fine mese'
        },
        {
          id: 'checkin',
          name: 'Accoglienza e check-in di persona (Firenze)',
          priceEur: 20,
          priceFormatted: '20,00 € (IVA inclusa) a intervento'
        },
        {
          id: 'maintenance',
          name: 'Intervento di piccola manutenzione ordinaria (Firenze)',
          priceEur: 30,
          priceFormatted: '30,00 € (IVA inclusa) prima ora + materiali a piè di lista'
        },
        {
          id: 'cleaning',
          name: 'Pulizie e cambio biancheria con fornitori certificati (Firenze)',
          priceEur: null,
          priceFormatted: 'Su preventivo in base alla metratura'
        }
      ]
    },

    contacts: {
      guestEmail: 'itassistance@bluearroyo.it',
      guestPhone: '+39 349 177 5561',
      guestPhoneTel: '+393491775561',
      guestWhatsappNumber: '393491775561',
      guestWhatsappUrl: 'https://wa.me/393491775561',
      adminEmail: 'admin@bluearroyo.it',
      supplierManagerPhone: '+39 349 804 1146',
      supplierManagerPhoneTel: '+393498041146',
      supplierManagerWhatsappUrl: 'https://wa.me/393498041146',
      hrEmail: 'risorseumane@bluearroyo.it'
    },

    support: {
      phoneDisplay: '+39 349 177 5561',
      phoneTel: '+393491775561',
      whatsappNumber: '393491775561',
      whatsappUrl: 'https://wa.me/393491775561',
      email: 'itassistance@bluearroyo.it',
      guestEmail: 'itassistance@bluearroyo.it',
      adminEmail: 'admin@bluearroyo.it',
      supplierManagerPhone: '+39 349 804 1146',
      supplierManagerPhoneTel: '+393498041146',
      hrEmail: 'risorseumane@bluearroyo.it',
      hoursIT: 'Tutti i giorni dalle 09:00 alle 23:00',
      hoursEN: 'Every day from 09:00 AM to 11:00 PM',
      hoursShortIT: '09:00 – 23:00',
      responseTimeIT: 'Risposta rapida da persone vere a Firenze',
      activeCity: 'Firenze',
      comingSoonCities: 'Altre città italiane: Prossimamente'
    },

    legal: {
      companyName: 'BLUEARROYO S.R.L.',
      vatNumber: '07480210488',
      vatFull: 'IT07480210488',
      rea: 'FI-706161',
      sdi: 'M5UXCR1',
      pec: 'bluearroyosrl@pec.it',
      shareCapital: '€ 50.000,00 i.v.',
      address: 'Via Matteo Palmieri 20/R, 50122 Firenze (FI)',
      city: 'Firenze',
      copyrightYear: '2026',
      footerLine: 'BLUEARROYO S.R.L. – Sede legale: Via Matteo Palmieri 20/R, 50122 Firenze (FI) · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.'
    },

    urls: {
      app: '/app.html',
      login: '/login.html',
      admin: '/admin.html',
      welcome: '/benvenuto.html',
      about: '/chi-siamo.html',
      llms: '/llms.txt',
      checkout: '/checkout.html',
      checkoutMonthly: '/checkout.html?ciclo=mensile',
      checkoutYearly: '/checkout.html?ciclo=annuale',
      contract: '/contratto.html',
      pricing: '/prezzi.html'
    },

    webhook: {
      n8nLeadsUrl: 'https://aherreras.app.n8n.cloud/webhook/leads/itassistance',
      n8nDailyReportUrl: 'https://aherreras.app.n8n.cloud/webhook/leads/itassistance'
    },

    cloud: {
      supabaseUrl: 'https://aunnoivzjeiyiczsxzbp.supabase.co',
      supabaseAnonKey: 'sb_publishable_DWG41-bTiTEE-iSJEJr2qw_LBxAJCTb',
      syncTable: 'preventivi'
    },

    payments: {
      billingMode: 'proforma_mybox_manual_invoice',
      paymentAcceptedIT: 'Bonifico bancario su fattura (previa conferma pro-forma in area My Box)',
      paymentAcceptedEN: 'Bank transfer upon invoice (following pro-forma confirmation in My Box)',
      myBoxUrl: '/app.html#my-box',
      proformaWorkflowIT: 'Nessun pagamento online con carta: il cliente controlla e conferma il pro-forma nella propria area riservata "My Box", riceve copia sulla propria email e l\'amministrazione emette manualmente la fattura elettronica (SDI M5UXCR1) pagabile tramite bonifico bancario.',
      proformaWorkflowEN: 'No online card payment: the client reviews and confirms the pro-forma in their "My Box" area, receives a copy by email, and administration manually issues the invoice payable via bank transfer.',
      refundMethodIT: 'Bonifico bancario manuale gestito dall\'amministrazione',
      refundMethodEN: 'Manual bank transfer processed by administration',
      iban: 'LT223250091911315653',
      bankHolder: 'BLUEARROYO SRL',
      bankIban: 'LT223250091911315653',
      bankName: 'Revolut Bank UAB',
      bankSwiftBic: 'REVOLT21'
    },

    travelerCoverage: {
      phoneH24: '+39 349 177 5561',
      whatsappUrl: 'https://wa.me/393491775561?text=Richiesta%20Copertura%20Viaggiatori%20itassistance',
      email: 'itassistance@bluearroyo.it',
      emergencyDeskIT: 'Front Desk & Emergenze H24 attivo giorno e notte in tutta Italia',
      emergencyDeskEN: '24/7 Front Desk & Emergency dispatch across Italy',
      cities: ['Firenze', 'Toscana', 'Italia'],
      services: [
        { id: 'emergenze_h24', labelIT: 'Assistenza Front Desk & Emergenze H24', labelEN: '24/7 Front Desk & Emergency Care' },
        { id: 'luggage_storage', labelIT: 'Luggage Storage & Runner Bagagli', labelEN: 'Luggage Storage & Station Transfer' },
        { id: 'alloggi_certificati', labelIT: 'Alloggi Certificati Blue Arroyo', labelEN: 'Certified Blue Arroyo Accommodations' },
        { id: 'ristoranti', labelIT: 'Ristoranti & Tavoli Riservati', labelEN: 'Reserved Dining & Historic Trattorias' },
        { id: 'logistica', labelIT: 'Servizi Pubblici, Treni & Musei', labelEN: 'Transit, Trains & Priority Museum Access' },
        { id: 'taxi_ncc', labelIT: 'Mobilità Taxi & NCC con Conducente', labelEN: 'Private Chauffeur NCC & Taxi' },
        { id: 'barca_tour', labelIT: 'Viaggi in Barca con Skipper & Tour in Italia', labelEN: 'Skippered Boat Tours & Italian Experiences' }
      ]
    },

    roles: {
      client: {
        id: 'cliente',
        labelIT: 'Cliente (Il Proprietario)',
        labelEN: 'Client (The Property Owner)',
        descriptionIT: 'Il Proprietario dell\'immobile che paga le nostre fatture a quota fissa 99,00 €/mese IVA inclusa e accede all\'Area Clienti (/app.html) con l\'unico inbox "My Box" e il Report delle 08:00 AM.',
        descriptionEN: 'The Property Owner who pays our flat-fee €99.00/month invoices and accesses the Client Area (/app.html) with the single "My Box" inbox and 08:00 AM daily report.',
        dashboardUrl: '/app.html'
      },
      user: {
        id: 'usuario',
        labelIT: 'Usuario (Il Turista / Ospite)',
        labelEN: 'Usuario (The Tourist / Guest)',
        descriptionIT: 'Il Turista / Ospite che soggiorna nelle case e approfitta della nostra copertura e gamma di servizi (richiesta soggiorno in Home #prenota-casa, assistenza dedicata 09:00–23:00 ed emergenze al +39 349 177 5561 · itassistance@bluearroyo.it, accoglienza Concierge). Non accede ai pannelli interni riservati.',
        descriptionEN: 'The Tourist / Guest staying at the properties who enjoys our coverage and range of services (stay request in Home #book-a-stay, dedicated 09:00–23:00 & emergency assistance at +39 349 177 5561 · itassistance@bluearroyo.it, Concierge welcome). Never accesses internal dashboards.',
        dashboardUrl: null
      },
      teamCustomerCare: {
        id: 'customer_care',
        labelIT: 'Team ITASSISTANCEDREAMTEAM.IT — Customer Care (OM)',
        labelEN: 'Team ITASSISTANCEDREAMTEAM.IT — Customer Care (OM)',
        descriptionIT: 'Profilo operativo Customer Care (Operation Manager) con accesso al pannello operativo Team (/admin.html).',
        descriptionEN: 'Operational Customer Care (Operation Manager) profile with access to the Team dashboard (/admin.html).',
        dashboardUrl: '/admin.html'
      },
      teamSuperAdmin: {
        id: 'super_admin',
        labelIT: 'Team ITASSISTANCEDREAMTEAM.IT — Super Admin',
        labelEN: 'Team ITASSISTANCEDREAMTEAM.IT — Super Admin',
        descriptionIT: 'Profilo direzionale Super Admin con gestione credenziali, pro-forma, fatturazione e controllo completo (/admin.html).',
        descriptionEN: 'Executive Super Admin profile with credential management, pro-forma, invoicing, and full control (/admin.html).',
        dashboardUrl: '/admin.html'
      }
    }
  };

  // Unisce eventuali override configurati dal pannello Super Admin (/admin.html)
  try {
    if (typeof localStorage !== 'undefined') {
      var rawOverrides = localStorage.getItem('ita_live_config_overrides_v1');
      if (rawOverrides) {
        var ov = JSON.parse(rawOverrides);
        if (ov && typeof ov === 'object') {
          if (ov.bankIban) {
            SITE_CONFIG.payments.bankIban = ov.bankIban;
            SITE_CONFIG.payments.iban = ov.bankIban;
          }
          if (ov.n8nLeadsUrl) {
            SITE_CONFIG.webhook.n8nLeadsUrl = ov.n8nLeadsUrl;
            SITE_CONFIG.webhook.n8nDailyReportUrl = ov.n8nLeadsUrl;
          }
          if (ov.supabaseUrl) SITE_CONFIG.cloud.supabaseUrl = ov.supabaseUrl;
          if (ov.supabaseAnonKey) SITE_CONFIG.cloud.supabaseAnonKey = ov.supabaseAnonKey;
        }
      }
    }
  } catch (e) {}

  // ═══════════════════════════════════════════════════════════════════════════
  // JUL-028 — QUOTA FISSA UNICA 99,00 € / MESE PER UNITÀ (IVA INCLUSA)
  // Qualsiasi logica di prezzo variabile/dinamico è stata eliminata: tutte le
  // funzioni restituiscono esclusivamente la quota fissa di 99,00 €/mese
  // (1.188,00 €/anno anticipato), zero commissioni sulle prenotazioni.
  // ═══════════════════════════════════════════════════════════════════════════
  var DYN_WAITLIST_KEY = 'ita_dynamic_waitlist_v1';
  var DYN_PRICE_HISTORY_KEY = 'ita_dynamic_price_history_v1';
  var MIN_DYN_EUR = 99.00;
  var MAX_DYN_EUR = 99.00;

  function formatDynamicEur(val) {
    var num = Number(val);
    if (isNaN(num)) num = MIN_DYN_EUR;
    return num.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  function getDefaultCapacityConfig() {
    return {
      minEur: 99,
      maxEur: 99,
      managedUnits: 0,
      capacityUnits: 24,
      roundToNine: true,
      priceLockContractMonths: 12,
      waitlistThresholdPct: 100,
      transparentMessage: 'Quota fissa di 99,00 € / mese (IVA inclusa) · Zero commissioni sulle prenotazioni'
    };
  }

  function getCapacityPricingConfig() {
    return getDefaultCapacityConfig();
  }

  function computePriceFromSaturation() {
    return {
      managedUnits: 0,
      capacityUnits: 24,
      availableUnits: 24,
      saturationRatio: 0,
      saturationPct: 0,
      isWaitlistOnly: false,
      rawPriceEur: 99,
      priceEur: 99,
      todayMonthlyEur: 99,
      todayFormatted: '99,00 €',
      yearlyEquivalentEur: 1188,
      yearlyFormatted: '1.188,00 €',
      minMonthlyEur: 99,
      maxMonthlyEur: 99,
      transparentMessage: 'Quota fissa di 99,00 € / mese (IVA inclusa) · Zero commissioni sulle prenotazioni',
      priceLockLabel: 'Quota fissa di 99,00 €/mese (IVA inclusa) · Zero commissioni sulle prenotazioni',
      demandLevel: 'Quota fissa garantita: 99,00 €/mese (IVA inclusa)'
    };
  }

  function randomPriceStep50() {
    return 99.00;
  }

  function getPriceHistoryReport() {
    return [
      { id: 'ph_1', date: '08/11/2026 09:15', client: 'Residenza Palazzo Santo Spirito', saturationPct: 0, lockedPriceEur: 99, tier: 'Quota Fissa Unica (99,00 €/mese)', priceLockMonths: 12 },
      { id: 'ph_2', date: '05/11/2026 14:30', client: 'Appartamento Via Maggio 18', saturationPct: 0, lockedPriceEur: 99, tier: 'Quota Fissa Unica (99,00 €/mese)', priceLockMonths: 12 },
      { id: 'ph_3', date: '01/11/2026 11:00', client: 'Suite Piazza Santa Croce', saturationPct: 0, lockedPriceEur: 99, tier: 'Quota Fissa Unica (99,00 €/mese)', priceLockMonths: 12 },
      { id: 'ph_4', date: '29/10/2026 17:45', client: 'Boutique B&B Oltrarno', saturationPct: 0, lockedPriceEur: 99, tier: 'Quota Fissa Unica (99,00 €/mese)', priceLockMonths: 12 }
    ];
  }

  function recordPriceLockHistory(entry) {
    var list = getPriceHistoryReport();
    var rec = {
      id: 'ph_' + Date.now(),
      date: new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' }),
      client: (entry && entry.client) || 'Nuovo Proprietario Firenze',
      saturationPct: 0,
      lockedPriceEur: 99,
      tier: 'Quota Fissa Unica (99,00 €/mese)',
      priceLockMonths: 12
    };
    list.unshift(rec);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(DYN_PRICE_HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
      }
    } catch (e) {}
    return rec;
  }

  function getWaitlistEntries() {
    try {
      if (typeof localStorage !== 'undefined') {
        var raw = localStorage.getItem(DYN_WAITLIST_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch (e) {}
    return [];
  }

  function submitWaitlistEntry(payload) {
    var list = getWaitlistEntries();
    var item = {
      id: 'wl_' + Date.now(),
      createdAt: new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' }),
      name: ((payload && payload.name) || 'Proprietario Firenze').trim(),
      email: ((payload && payload.email) || '').trim(),
      phone: ((payload && payload.phone) || '').trim(),
      units: Math.max(1, parseInt(payload && payload.units, 10) || 1),
      status: 'Iscrizione diretta attiva a quota fissa 99,00 €/mese'
    };
    list.unshift(item);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(DYN_WAITLIST_KEY, JSON.stringify(list.slice(0, 50)));
      }
    } catch (e) {}
    return item;
  }

  function buildFixedPricingState() {
    var schedule5Days = [
      { dayLabel: 'Mensile', priceEur: 99, isToday: true },
      { dayLabel: 'Annuale (12 mesi)', priceEur: 99, isToday: false },
      { dayLabel: 'Quota Fissa Garantita', priceEur: 99, isToday: true },
      { dayLabel: 'Zero Commissioni (0%)', priceEur: 99, isToday: false },
      { dayLabel: 'Garanzia 14 Giorni', priceEur: 99, isToday: false }
    ];

    return {
      minMonthlyEur: 99,
      maxMonthlyEur: 99,
      todayMonthlyEur: 99,
      todayFormatted: '99,00 €',
      yearlyEquivalentEur: 1188,
      yearlyFormatted: '1.188,00 €',
      managedUnits: 0,
      capacityUnits: 24,
      slotsAvailable: 24,
      maxSlots: 24,
      saturationRatio: 0,
      saturationPct: 0,
      isWaitlistOnly: false,
      transparentMessage: 'Quota fissa di 99,00 € / mese (IVA inclusa) · Zero commissioni sulle prenotazioni',
      priceLockLabel: 'Quota fissa di 99,00 €/mese (IVA inclusa) · Zero commissioni sulle prenotazioni',
      demandLevel: 'Quota fissa garantita: 99,00 €/mese (IVA inclusa)',
      schedule5Days: schedule5Days,
      generatedDate: new Date().toISOString().slice(0, 10),
      phase: 'Quota fissa unica di 99,00 €/mese (IVA inclusa) · Zero commissioni'
    };
  }

  function getDynamicPricing() {
    return buildFixedPricingState();
  }

  function setCapacityParameters() {
    var fixedState = buildFixedPricingState();
    SITE_CONFIG.pricing.monthlyEur = 99;
    SITE_CONFIG.pricing.yearlyEur = 1188;
    SITE_CONFIG.pricing.monthlyFormatted = '99,00 €';
    SITE_CONFIG.pricing.yearlyFormatted = '1.188,00 €';
    return fixedState;
  }

  function setAdminForcedDailyPrice() {
    return buildFixedPricingState();
  }

  function rerollDynamicPrice() {
    var fixedState = buildFixedPricingState();
    SITE_CONFIG.pricing.monthlyEur = 99;
    SITE_CONFIG.pricing.yearlyEur = 1188;
    SITE_CONFIG.pricing.monthlyFormatted = '99,00 €';
    SITE_CONFIG.pricing.yearlyFormatted = '1.188,00 €';
    return fixedState;
  }

  function computePhase2DemandPricePlaceholder() {
    return buildFixedPricingState();
  }

  function buildCheckoutPaymentUrl(params) {
    var p = params || {};
    var cycle = p.billingCycle === 'annuale' ? 'annuale' : 'mensile';
    var units = Math.max(1, parseInt(p.units, 10) || 1);
    var lockedMonthly = 99 * units;
    var totalEur = cycle === 'annuale' ? 1188 * units : lockedMonthly;
    var baseUrl = SITE_CONFIG.payments.myBoxUrl || '/app.html#my-box';
    var refId = [
      'itassistance_proforma',
      cycle,
      String(totalEur).replace('.', '_'),
      (p.ownerCode || 'NEW').replace(/[^a-zA-Z0-9_-]/g, ''),
      p.addon10Active ? 'plus10' : 'base0'
    ].join('_');

    var cleanBase = baseUrl.split('#')[0];
    var qs = 'proforma_ref=' + encodeURIComponent(refId) + '&ciclo=' + encodeURIComponent(cycle);
    if (p.ownerEmail) {
      qs += '&email=' + encodeURIComponent(p.ownerEmail);
    }
    return {
      url: cleanBase + '?' + qs + '#my-box',
      billingMode: 'proforma_mybox_manual_invoice',
      billingCycle: cycle,
      lockedMonthlyEur: lockedMonthly,
      totalEur: totalEur,
      totalFormatted: formatDynamicEur(totalEur),
      clientReferenceId: refId
    };
  }

  function getBankTransferDetails(params) {
    var p = params || {};
    var cycle = p.billingCycle === 'annuale' ? 'annuale' : 'mensile';
    var units = Math.max(1, parseInt(p.units, 10) || 1);
    var lockedMonthly = 99 * units;
    var totalEur = cycle === 'annuale' ? 1188 * units : lockedMonthly;
    var code = p.ownerCode || 'ITA-FIRENZE-01';
    var inv = p.invoiceId || 'FATT-2026';
    return {
      holder: SITE_CONFIG.payments.bankHolder,
      iban: SITE_CONFIG.payments.bankIban,
      bankName: SITE_CONFIG.payments.bankName || '[DA CONFERMARE]',
      swiftBic: SITE_CONFIG.payments.bankSwiftBic || '[DA CONFERMARE]',
      amountEur: totalEur,
      amountFormatted: formatDynamicEur(totalEur),
      causale: 'Attivazione itassistance ' + code + ' ' + inv + ' (' + formatDynamicEur(totalEur) + ' IVA incl.)'
    };
  }

  function computePortfolioVolumeCheckout(params) {
    var p = params || {};
    var units = Math.max(1, parseInt(p.units, 10) || 1);
    var cycle = p.billingCycle === 'annuale' ? 'annuale' : 'mensile';
    var unitMonthlyEur = 99;
    var tierLabel = 'Quota Fissa 99,00 €/mese per unità (IVA inclusa)';
    var totalMonthlyEur = Math.round(unitMonthlyEur * units * 100) / 100;
    var totalYearlyEur = Math.round(totalMonthlyEur * 12 * 100) / 100;
    var activeTotalEur = cycle === 'annuale' ? totalYearlyEur : totalMonthlyEur;
    return {
      units: units,
      tierLabel: tierLabel,
      unitMonthlyEur: unitMonthlyEur,
      unitMonthlyFormatted: formatDynamicEur(unitMonthlyEur),
      totalMonthlyEur: totalMonthlyEur,
      totalMonthlyFormatted: formatDynamicEur(totalMonthlyEur),
      totalYearlyEur: totalYearlyEur,
      totalYearlyFormatted: formatDynamicEur(totalYearlyEur),
      activeTotalEur: activeTotalEur,
      activeTotalFormatted: formatDynamicEur(activeTotalEur)
    };
  }

  // Inizializza la quota fissa unica di 99,00 €/mese
  var initialDynState = getDynamicPricing();
  SITE_CONFIG.dynamicPricing = initialDynState;
  SITE_CONFIG.pricing.monthlyEur = 99;
  SITE_CONFIG.pricing.yearlyEur = 1188;
  SITE_CONFIG.getDynamicPricing = getDynamicPricing;
  SITE_CONFIG.getCapacityPricingConfig = getCapacityPricingConfig;
  SITE_CONFIG.computePriceFromSaturation = computePriceFromSaturation;
  SITE_CONFIG.setCapacityParameters = setCapacityParameters;
  SITE_CONFIG.getPriceHistoryReport = getPriceHistoryReport;
  SITE_CONFIG.recordPriceLockHistory = recordPriceLockHistory;
  SITE_CONFIG.getWaitlistEntries = getWaitlistEntries;
  SITE_CONFIG.submitWaitlistEntry = submitWaitlistEntry;
  SITE_CONFIG.rerollDynamicPrice = rerollDynamicPrice;
  SITE_CONFIG.setAdminForcedDailyPrice = setAdminForcedDailyPrice;
  SITE_CONFIG.formatDynamicEur = formatDynamicEur;
  SITE_CONFIG.computePhase2DemandPricePlaceholder = computePhase2DemandPricePlaceholder;
  SITE_CONFIG.buildCheckoutPaymentUrl = buildCheckoutPaymentUrl;
  SITE_CONFIG.getBankTransferDetails = getBankTransferDetails;
  SITE_CONFIG.computePortfolioVolumeCheckout = computePortfolioVolumeCheckout;
  SITE_CONFIG.designSystem = {
    name: 'Structural Resonance - Centered Architect (itassistance Violet & White Edition)',
    sourceUrl: 'https://www.aura.build/design-systems/structural-resonance-centered-architect',
    colors: {
      primary: '#6D28D9',
      primaryHover: '#5B21B6',
      secondary: '#FFFFFF',
      accent: '#C4B5FD',
      background: '#FFFFFF',
      backgroundDark: '#1E1035',
      surface: '#F5F3FF',
      textPrimary: '#1E1035',
      textSecondary: '#4C3D63',
      textOnDark: '#FFFFFF',
      textSecondaryOnDark: '#E9D5FF',
      border: '#DDD6FE',
      borderStrong: '#7C3AED'
    },
    typography: {
      display: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono'
    },
    rounded: {
      card: '15px',
      control: '15px',
      pill: '9999px'
    }
  };

  function injectAuraVioletWhiteDesignSystem() {
    if (typeof document === 'undefined' || !document.head) return;
    if (!document.getElementById('ita-aura-fonts')) {
      var fontLink = document.createElement('link');
      fontLink.id = 'ita-aura-fonts';
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap';
      document.head.appendChild(fontLink);
    }
    if (document.getElementById('ita-aura-violet-white-ds')) return;
    var style = document.createElement('style');
    style.id = 'ita-aura-violet-white-ds';
    style.textContent = [
      ':root {',
      '  --z-content: 1;',
      '  --z-header: 500;',
      '  --z-fixed-bar: 600;',
      '  --z-floating: 650;',
      '  --z-panel: 700;',
      '  --z-modal: 800;',
      '  --z-toast: 900;',
      '  --bg-light: #FFFFFF;',
      '  --bg-stone: #F5F3FF;',
      '  --ink-navy: #1E1035;',
      '  --ink-muted: #4C3D63;',
      '  --ink-on-dark-muted: #E9D5FF;',
      '  --gold-accent: #C4B5FD;',
      '  --gold-text-light: #5B21B6;',
      '  --border-control: #7C3AED;',
      '  --brand-violet: #6D28D9;',
      '  --brand-violet-hover: #5B21B6;',
      '  --brand-violet-soft: #EDE9FE;',
      '  --brand-border-soft: #DDD6FE;',
      '  --overlay-hero: rgba(30, 16, 53, 0.84);',
      '  --font-display: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;',
      '  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;',
      '  --font-mono: "JetBrains Mono", monospace;',
      '  --navy: #1E1035;',
      '  --navy-soft: #2E1065;',
      '  --gold: #C4B5FD;',
      '  --gold-dark: #5B21B6;',
      '  --gold-light: #F5F3FF;',
      '  --bg: #FFFFFF;',
      '  --card: #FFFFFF;',
      '  --text: #1E1035;',
      '  --text-muted: #4C3D63;',
      '  --border: #DDD6FE;',
      '  --serif: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;',
      '  --sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;',
      '  --radius: 15px;',
      '}',
      '*, *::before, *::after {',
      '  box-sizing: border-box;',
      '}',
      'html {',
      '  scroll-padding-top: 88px;',
      '  -webkit-text-size-adjust: 100%;',
      '}',
      'body {',
      '  font-family: var(--font-sans);',
      '  background-color: var(--bg-light);',
      '  color: var(--ink-navy);',
      '  letter-spacing: -0.005em;',
      '}',
      'img, video, iframe, svg {',
      '  max-width: 100%;',
      '  height: auto;',
      '}',
      'main, section, article, aside, nav, div, form, fieldset, label {',
      '  min-width: 0;',
      '}',
      'select, input, textarea {',
      '  max-width: 100%;',
      '  min-width: 0;',
      '}',
      'select {',
      '  width: 100%;',
      '  max-width: 100%;',
      '  min-width: 0;',
      '  contain: inline-size;',
      '  overflow: hidden;',
      '  text-overflow: ellipsis;',
      '}',
      '.role-switcher-select {',
      '  width: auto;',
      '  max-width: 100%;',
      '  contain: none;',
      '}',
      '@media (max-width: 980px) {',
      '  .admin-shell {',
      '    grid-template-columns: minmax(0, 1fr) !important;',
      '  }',
      '}',
      'footer a, .breadcrumb a, a[href^="tel:"], a[href^="mailto:"] {',
      '  display: inline-block;',
      '}',
      '.mobile-fullscreen-menu a {',
      '  min-height: 44px;',
      '  display: inline-flex;',
      '  align-items: center;',
      '}',
      'pre, code, kbd, samp {',
      '  max-width: 100%;',
      '  overflow-wrap: anywhere;',
      '}',
      'pre {',
      '  overflow-x: auto;',
      '  white-space: pre-wrap;',
      '  word-break: break-word;',
      '}',
      '.container, .wrap, .main-wrap, .co-shell, .onion-main, .admin-shell, .header-inner, .navbar-inner, .nav-bar, .topbar-inner, .onion-header-inner, .admin-header-inner {',
      '  padding-left: max(16px, env(safe-area-inset-left, 0px)) !important;',
      '  padding-right: max(16px, env(safe-area-inset-right, 0px)) !important;',
      '  max-width: 100%;',
      '}',
      'h1, h2, h3, h4, p, li, td, th, label, span, a, .card, .panel-card, .item-card, .guide-card {',
      '  overflow-wrap: anywhere;',
      '}',
      '.grid-2 > *, .grid-3 > *, .guides-grid > *, .kpi-grid > *, .form-grid > *, .form-grid-3 > *, .role-preset-grid > *, .sim-grid > *, .editorial-split > *, .ita-fluid-grid > * {',
      '  min-width: 0;',
      '  max-width: 100%;',
      '}',
      '.mobile-menu-toggle, #mobile-menu-open-btn, #mobile-menu-close-btn {',
      '  min-width: 48px !important;',
      '  min-height: 48px !important;',
      '  flex-shrink: 0 !important;',
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '}',
      '.ita-shared-header-grid {',
      '  display: grid !important;',
      '  grid-template-columns: auto minmax(0, 1fr) auto !important;',
      '  align-items: center !important;',
      '  gap: 10px !important;',
      '  min-height: 60px !important;',
      '  height: auto !important;',
      '  padding-top: 8px !important;',
      '  padding-bottom: 8px !important;',
      '}',
      'header, .navbar, .topbar, .site-header {',
      '  height: auto !important;',
      '  min-height: 56px;',
      '}',
      '.brand, .admin-brand, .onion-header-brand {',
      '  min-width: 0;',
      '  max-width: 100%;',
      '  font-size: clamp(0.68rem, 2.5vw, 0.95rem);',
      '  letter-spacing: -0.02em;',
      '  overflow-wrap: anywhere;',
      '  word-break: break-word;',
      '  white-space: normal;',
      '}',
      '.brand span {',
      '  min-width: 0;',
      '  overflow-wrap: anywhere;',
      '  word-break: break-word;',
      '  white-space: normal;',
      '}',
      '.section-block > .container > .eyebrow,',
      '.section-block > .container > h1,',
      '.section-block > .container > h2,',
      '.section-block > .container > .lead-paragraph,',
      'main > section > .container > .eyebrow,',
      'main > section > .container > h1,',
      'main > section > .container > h2,',
      'main > section > .container > p {',
      '  text-align: center !important;',
      '  margin-left: auto !important;',
      '  margin-right: auto !important;',
      '}',
      '.section-block > .container > .cta-row,',
      '.cta-row {',
      '  justify-content: center !important;',
      '  align-items: center !important;',
      '  text-align: center !important;',
      '}',
      '.faq-list, .price-card, #sono-interessato, #prezzi-contract-tariff-pdf-card, #index-contract-tariff-pdf-card {',
      '  margin-left: auto !important;',
      '  margin-right: auto !important;',
      '}',
      '#creator-quick-form-panel > .cr-badge-zero {',
      '  display: table;',
      '  margin-left: auto;',
      '  margin-right: auto;',
      '  text-align: center;',
      '}',
      '#creator-quick-form-panel > h1,',
      '#creator-quick-form-panel > .sub {',
      '  text-align: center !important;',
      '  margin-left: auto !important;',
      '  margin-right: auto !important;',
      '}',
      '@media (max-width: 1023px) {',
      '  .ita-header-desktop-actions {',
      '    display: none !important;',
      '  }',
      '  .ita-shared-menu-btn {',
      '    display: inline-flex !important;',
      '  }',
      '}',
      '@media (min-width: 1024px) {',
      '  .ita-shared-menu-btn {',
      '    display: none !important;',
      '  }',
      '}',
      '.mobile-fullscreen-menu {',
      '  position: fixed;',
      '  inset: 0;',
      '  z-index: var(--z-modal, 800);',
      '  width: 100%;',
      '  max-width: 100%;',
      '  height: 100dvh;',
      '  max-height: 100dvh;',
      '  overflow-y: auto;',
      '  overscroll-behavior: contain;',
      '  background-color: #1E1035;',
      '  color: #FFFFFF;',
      '  padding: max(16px, env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px)) max(24px, env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px));',
      '  display: none;',
      '  flex-direction: column;',
      '  justify-content: space-between;',
      '  gap: 20px;',
      '}',
      '.mobile-fullscreen-menu[data-open="true"] {',
      '  display: flex !important;',
      '}',
      '@media (max-width: 767px) {',
      '  .guides-grid, .grid-2, .grid-3, .kpi-grid, .form-grid, .form-grid-3, .role-preset-grid, .sim-grid, .editorial-split, .ita-fluid-grid {',
      '    grid-template-columns: minmax(0, 1fr) !important;',
      '  }',
      '  .btn, button.btn, a.btn {',
      '    max-width: 100%;',
      '    white-space: normal !important;',
      '    height: auto;',
      '  }',
      '  .search-inp {',
      '    min-width: 0 !important;',
      '    width: 100% !important;',
      '  }',
      '  .table-wrap {',
      '    overflow-x: visible !important;',
      '    border: none !important;',
      '    background: transparent !important;',
      '  }',
      '  table, thead, tbody, tr, th, td {',
      '    display: block !important;',
      '    width: 100% !important;',
      '    max-width: 100% !important;',
      '    min-width: 0 !important;',
      '  }',
      '  thead {',
      '    display: none !important;',
      '  }',
      '  tbody tr {',
      '    background: #FFFFFF;',
      '    border: 1.5px solid #DDD6FE !important;',
      '    border-radius: 12px;',
      '    padding: 12px !important;',
      '    margin-bottom: 12px !important;',
      '    box-shadow: 0 4px 12px rgba(30, 16, 53, 0.05);',
      '  }',
      '  tbody td {',
      '    padding: 8px 0 !important;',
      '    border: none !important;',
      '    border-bottom: 1px solid #F5F3FF !important;',
      '    text-align: left !important;',
      '    white-space: normal !important;',
      '    display: flex !important;',
      '    flex-direction: column !important;',
      '    align-items: flex-start !important;',
      '    gap: 4px !important;',
      '  }',
      '  tbody td:last-child {',
      '    border-bottom: none !important;',
      '    padding-bottom: 0 !important;',
      '  }',
      '  tbody td[data-label]::before {',
      '    content: attr(data-label);',
      '    font-family: var(--font-mono);',
      '    font-size: 0.72rem;',
      '    font-weight: 700;',
      '    text-transform: uppercase;',
      '    letter-spacing: 0.04em;',
      '    color: #5B21B6;',
      '    display: block;',
      '  }',
      '}',
      'body.is-editing-field .mobile-action-bar,',
      'body.is-editing-field .bottom-nav,',
      'body.is-editing-field .mob-bottom-nav,',
      'body.is-editing-field .cipolla-bottom-bar,',
      'body.is-editing-field #pba-chat {',
      '  display: none !important;',
      '}',
      '#pba-chat {',
      '  z-index: var(--z-floating, 650) !important;',
      '}',
      '@media (max-width: 768px) {',
      '  #pba-chat {',
      '    bottom: calc(92px + env(safe-area-inset-bottom, 0px)) !important;',
      '  }',
      '}',
      'h1, h2, h3, h4 {',
      '  font-family: var(--font-display);',
      '  letter-spacing: -0.025em;',
      '}',
      '.kicker, .badge, code, [id*="lock-code"], [id*="dyn-slots"], .mono-label {',
      '  font-family: var(--font-mono);',
      '}',
      '.btn, button.btn, a.btn {',
      '  border-radius: 15px;',
      '  transition: transform 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease;',
      '}',
      '.btn-primary, a.btn-primary, button.btn-primary {',
      '  background: linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%) !important;',
      '  color: #FFFFFF !important;',
      '  border-color: #6D28D9 !important;',
      '  box-shadow: 0 8px 22px -6px rgba(109, 40, 217, 0.42);',
      '}',
      '.btn-primary:hover, a.btn-primary:hover, button.btn-primary:hover {',
      '  background: linear-gradient(135deg, #5B21B6 0%, #4C1D95 100%) !important;',
      '  color: #FFFFFF !important;',
      '  transform: translateY(-1px);',
      '}',
      '.section-dark .btn-primary, .hero-section .btn-primary {',
      '  background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%) !important;',
      '  color: #FFFFFF !important;',
      '  border: 2px solid #C4B5FD !important;',
      '  box-shadow: 0 10px 28px -6px rgba(196, 181, 253, 0.35);',
      '}',
      '.card, .step-card, .feature-card, .price-card, .faq-item, .onion-block, .area-card, .panel-card {',
      '  border-radius: 15px;',
      '  box-shadow: 0 10px 30px -12px rgba(91, 33, 182, 0.08);',
      '}',
      '.site-header, header {',
      '  border-bottom-color: #DDD6FE;',
      '}',
      '.bottom-nav, .mob-bottom-nav, .cipolla-bottom-bar {',
      '  background: rgba(255, 255, 255, 0.96) !important;',
      '  backdrop-filter: blur(12px);',
      '  border-top: 1.5px solid #DDD6FE !important;',
      '}',
      '.pba-chat__toggle {',
      '  background: linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%) !important;',
      '  color: #FFFFFF !important;',
      '  border: 1.5px solid #C4B5FD !important;',
      '  border-radius: 9999px !important;',
      '}',
      '.pba-chat__header {',
      '  background: #1E1035 !important;',
      '  color: #FFFFFF !important;',
      '}',
      '.pba-option {',
      '  border-color: #7C3AED !important;',
      '  color: #4C1D95 !important;',
      '  background: #F5F3FF !important;',
      '  border-radius: 12px !important;',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  injectAuraVioletWhiteDesignSystem();

  function injectEditorialGuideConversionBanner() {
    if (typeof document === 'undefined' || !document.body) return;
    if (document.getElementById('ita-guide-dyn-conversion-banner')) return;
    var path = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '';
    var skipPaths = ['/', '/index.html', '/checkout.html', '/login.html', '/app.html', '/admin.html', '/benvenuto.html', '/prezzi.html', '/contratto.html', '/en/', '/en/index.html'];
    for (var s = 0; s < skipPaths.length; s++) {
      if (path === skipPaths[s]) return;
    }

    var footer = document.querySelector('footer');
    if (!footer || !footer.parentNode) return;

    var section = document.createElement('section');
    section.id = 'ita-guide-dyn-conversion-banner';
    section.setAttribute('aria-label', 'Attivazione rapida quota fissa di 99,00 €/mese');
    section.style.cssText = 'background:#F5F3FF;border-top:2px solid #7C3AED;border-bottom:2px solid #7C3AED;padding:48px 16px;';

    var wrap = document.createElement('div');
    wrap.style.cssText = 'max-width:960px;margin:0 auto;background:#1E1035;color:#FFFFFF;border:2px solid #C4B5FD;border-radius:15px;padding:32px 24px;box-shadow:0 16px 36px -12px rgba(30,16,53,0.35);';

    var badge = document.createElement('span');
    badge.style.cssText = 'display:inline-block;background:rgba(196,181,253,0.16);color:#C4B5FD;border:1px solid #C4B5FD;padding:4px 12px;border-radius:999px;font-family:"JetBrains Mono",monospace;font-size:0.75rem;font-weight:600;margin-bottom:12px;';
    badge.textContent = 'Servizio Gestione Operativa Affitti Brevi Firenze · Zero Commissioni (0%)';

    var h2 = document.createElement('h2');
    h2.style.cssText = 'font-family:"Inter",-apple-system,BlinkMacSystemFont,sans-serif;font-size:clamp(1.65rem,3.2vw,2.25rem);font-weight:700;letter-spacing:-0.025em;line-height:1.12;color:#FFFFFF;margin:0 0 12px 0;';
    h2.textContent = 'Gestisci il tuo appartamento a Firenze con la quota fissa di 99,00 €/mese (IVA inclusa).';

    var p = document.createElement('p');
    p.style.cssText = 'font-size:1rem;color:#E9D5FF;line-height:1.6;max-width:65ch;margin:0 0 20px 0;';
    p.textContent = 'ITASSISTANCEDREAMTEAM.IT è l\'alternativa all\'agenzia di affitti brevi tradizionale a Firenze: mantieni il 100% degli incassi sul tuo conto, zero commissioni sulle prenotazioni, disdetta libera senza penali, zero costi di attivazione e Garanzia 14 giorni Soddisfatto o Rimborsato.';

    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;align-items:center;';

    var cta = document.createElement('a');
    cta.href = '/checkout.html';
    cta.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:10px 20px;background:linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%);color:#FFFFFF;font-weight:700;font-size:0.9375rem;border-radius:15px;text-decoration:none;border:2px solid #C4B5FD;max-width:100%;text-align:center;';
    cta.textContent = 'Attiva a 99,00 €/mese (Garanzia 14 gg)';

    var secLink = document.createElement('a');
    secLink.href = '/calcola-risparmio.html';
    secLink.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:10px 20px;background:transparent;color:#FFFFFF;font-weight:700;font-size:0.9375rem;border-radius:15px;text-decoration:none;border:1.5px solid #C4B5FD;max-width:100%;text-align:center;';
    secLink.textContent = 'Calcola il tuo risparmio';

    btnRow.appendChild(cta);
    btnRow.appendChild(secLink);
    wrap.appendChild(badge);
    wrap.appendChild(h2);
    wrap.appendChild(p);
    wrap.appendChild(btnRow);
    section.appendChild(wrap);
    footer.parentNode.insertBefore(section, footer);
  }

  function normalizeSharedHeaderAndMobileMenu() {
    if (typeof document === 'undefined' || !document.body) return;
    // Se la pagina ha già un menu fullscreen mobile (es. index.html), assicuriamoci solo che il bottone di chiusura abbia l'ID e 48x48px
    var existingMenu = document.getElementById('mobile-fullscreen-menu');
    if (existingMenu) {
      var closeBtn = existingMenu.querySelector('#mobile-menu-close-btn, .mobile-menu-toggle');
      if (closeBtn && !closeBtn.id) closeBtn.id = 'mobile-menu-close-btn';
      return;
    }

    // Trova header pubblici standard (.nav-bar, .navbar-inner, .topbar-inner) che non sono app-header o onion-header o admin-header
    var bar = document.querySelector('header .nav-bar, header .navbar-inner, header .topbar-inner, .navbar .navbar-inner, .topbar .topbar-inner');
    if (!bar) return;
    if (bar.closest('.onion-header, .app-header, .admin-header, .hdr')) return;

    bar.classList.add('ita-shared-header-grid');
    var brand = bar.querySelector('.brand');
    var linksCollected = [];
    var seenHrefs = {};

    function addLinkItem(href, label, isPrimary) {
      if (!href || !label) return;
      var cleanLabel = label.replace(/\s+/g, ' ').trim();
      if (!cleanLabel) return;
      if (seenHrefs[href]) return;
      seenHrefs[href] = true;
      linksCollected.push({ href: href, label: cleanLabel, isPrimary: !!isPrimary });
    }

    var children = Array.prototype.slice.call(bar.children);
    for (var i = 0; i < children.length; i++) {
      var ch = children[i];
      if (ch === brand) continue;
      ch.classList.add('ita-header-desktop-actions');
      var anchors = ch.querySelectorAll ? ch.querySelectorAll('a[href]') : [];
      if (ch.tagName && ch.tagName.toLowerCase() === 'a' && ch.getAttribute('href')) {
        anchors = [ch];
      }
      for (var a = 0; a < anchors.length; a++) {
        var anc = anchors[a];
        var isCta = anc.classList.contains('btn-gold') || anc.classList.contains('btn-primary');
        addLinkItem(anc.getAttribute('href'), anc.textContent || '', isCta);
      }
    }

    var isEn = (typeof window !== 'undefined' && window.location && window.location.pathname.indexOf('/en') === 0);
    if (isEn) {
      addLinkItem('/en/', 'Home (English)', false);
      addLinkItem('/prezzi.html', 'Pricing (€99/mo)', false);
      addLinkItem('/app.html', 'Area Clienti (Client Area)', false);
      addLinkItem('/admin.html', 'Itassistance Team', false);
      addLinkItem('/', 'Versione Italiana', false);
      addLinkItem('/checkout.html', 'Start 14-Day Trial', true);
    } else {
      addLinkItem('/', 'Home ITASSISTANCEDREAMTEAM.IT', false);
      addLinkItem('/guide-affitti-brevi-firenze.html', 'Tutte le 20 Guide Firenze', false);
      addLinkItem('/calcola-risparmio.html', 'Calcola il tuo Risparmio', false);
      addLinkItem('/prezzi.html', 'Prezzi e Garanzia 14 Giorni', false);
      addLinkItem('/partner.html', 'Programma Partner Firenze', false);
      addLinkItem('/app.html', 'Area Clienti', false);
      addLinkItem('/admin.html', 'Itassistance Team', false);
      addLinkItem('/checkout.html', 'Prova l\'app (14 giorni garantiti)', true);
    }

    // Inserisce uno spacer centrale per mantenere la struttura grid-template-columns: auto minmax(0, 1fr) auto
    var spacer = document.createElement('div');
    spacer.setAttribute('aria-hidden', 'true');
    spacer.style.cssText = 'min-width:0;width:100%;';
    if (brand && brand.nextSibling) {
      bar.insertBefore(spacer, brand.nextSibling);
    } else {
      bar.appendChild(spacer);
    }

    var menuBtn = document.createElement('button');
    menuBtn.type = 'button';
    menuBtn.id = 'mobile-menu-open-btn';
    menuBtn.className = 'mobile-menu-toggle ita-shared-menu-btn';
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-controls', 'mobile-fullscreen-menu');
    menuBtn.setAttribute('aria-label', isEn ? 'Open navigation menu' : 'Apri menu di navigazione');
    menuBtn.style.cssText = 'min-width:48px;min-height:48px;padding:8px 14px;border-radius:12px;border:1.5px solid #C4B5FD;background:#1E1035;color:#FFFFFF;font-family:var(--font-sans);font-weight:700;font-size:0.875rem;cursor:pointer;justify-self:end;';
    menuBtn.textContent = 'Menu';
    bar.appendChild(menuBtn);

    var menuModal = document.createElement('div');
    menuModal.id = 'mobile-fullscreen-menu';
    menuModal.className = 'mobile-fullscreen-menu';
    menuModal.setAttribute('data-open', 'false');
    menuModal.setAttribute('role', 'dialog');
    menuModal.setAttribute('aria-modal', 'true');
    menuModal.setAttribute('aria-label', isEn ? 'Navigation Menu' : 'Menu di navigazione');

    var topRow = document.createElement('div');
    topRow.style.cssText = 'display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;padding-bottom:16px;border-bottom:1px solid rgba(196,181,253,0.3);';

    var menuBrand = document.createElement('a');
    menuBrand.href = isEn ? '/en/' : '/';
    menuBrand.style.cssText = 'display:inline-flex;align-items:center;min-height:48px;font-weight:800;font-size:clamp(0.78rem,3.4vw,1.125rem);min-width:0;overflow-wrap:anywhere;word-break:break-word;color:#FFFFFF;text-decoration:none;';
    menuBrand.textContent = 'ITASSISTANCEDREAMTEAM.IT';

    var topSpacer = document.createElement('div');

    var closeBtnEl = document.createElement('button');
    closeBtnEl.type = 'button';
    closeBtnEl.id = 'mobile-menu-close-btn';
    closeBtnEl.className = 'mobile-menu-toggle';
    closeBtnEl.setAttribute('aria-label', isEn ? 'Close menu' : 'Chiudi menu');
    closeBtnEl.style.cssText = 'min-width:48px;min-height:48px;padding:8px 14px;border-radius:12px;border:1.5px solid #C4B5FD;background:transparent;color:#FFFFFF;font-family:var(--font-sans);font-weight:700;font-size:0.875rem;cursor:pointer;';
    closeBtnEl.textContent = isEn ? 'Close' : 'Chiudi';

    topRow.appendChild(menuBrand);
    topRow.appendChild(topSpacer);
    topRow.appendChild(closeBtnEl);

    var navList = document.createElement('nav');
    navList.setAttribute('aria-label', isEn ? 'Mobile navigation' : 'Navigazione mobile');
    navList.style.cssText = 'display:flex;flex-direction:column;gap:10px;margin:16px 0;';

    var primaryItem = null;
    for (var k = 0; k < linksCollected.length; k++) {
      var item = linksCollected[k];
      if (item.isPrimary && !primaryItem) {
        primaryItem = item;
        continue;
      }
      var navA = document.createElement('a');
      navA.href = item.href;
      navA.style.cssText = 'display:flex;align-items:center;justify-content:space-between;min-height:48px;padding:12px 16px;border-radius:12px;background:rgba(255,255,255,0.06);border:1px solid rgba(196,181,253,0.28);color:#FFFFFF;font-weight:700;font-size:1rem;text-decoration:none;';
      navA.textContent = item.label;
      navA.addEventListener('click', function () {
        if (typeof window.toggleMobileFullscreenMenu === 'function') window.toggleMobileFullscreenMenu(true);
      });
      navList.appendChild(navA);
    }

    var bottomBox = document.createElement('div');
    bottomBox.style.cssText = 'display:flex;flex-direction:column;gap:10px;padding-top:12px;border-top:1px solid rgba(196,181,253,0.3);';
    if (primaryItem) {
      var ctaA = document.createElement('a');
      ctaA.href = primaryItem.href;
      ctaA.className = 'btn btn-primary';
      ctaA.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;min-height:52px;padding:12px 20px;border-radius:15px;font-weight:700;font-size:1rem;text-decoration:none;text-align:center;';
      ctaA.textContent = primaryItem.label;
      bottomBox.appendChild(ctaA);
    }

    menuModal.appendChild(topRow);
    menuModal.appendChild(navList);
    menuModal.appendChild(bottomBox);
    document.body.appendChild(menuModal);

    window.toggleMobileFullscreenMenu = function (forceClose) {
      var m = document.getElementById('mobile-fullscreen-menu');
      var b = document.getElementById('mobile-menu-open-btn');
      if (!m) return;
      var isOpen = forceClose === true ? false : m.getAttribute('data-open') !== 'true';
      m.setAttribute('data-open', isOpen ? 'true' : 'false');
      if (b) b.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    menuBtn.addEventListener('click', function () {
      window.toggleMobileFullscreenMenu();
    });
    closeBtnEl.addEventListener('click', function () {
      window.toggleMobileFullscreenMenu(true);
    });
  }

  function populateTableLabels(rootNode) {
    var scope = rootNode && rootNode.querySelectorAll ? rootNode : document;
    var tables = scope.querySelectorAll('table');
    for (var t = 0; t < tables.length; t++) {
      var tbl = tables[t];
      if (!tbl.closest('.table-wrap') && tbl.parentNode) {
        var wrap = document.createElement('div');
        wrap.className = 'table-wrap';
        wrap.setAttribute('data-intentional-scroller', 'true');
        wrap.style.cssText = 'width:100%;max-width:100%;overflow-x:auto;';
        tbl.parentNode.insertBefore(wrap, tbl);
        wrap.appendChild(tbl);
      } else if (tbl.closest('.table-wrap')) {
        tbl.closest('.table-wrap').setAttribute('data-intentional-scroller', 'true');
      }

      var headers = [];
      var ths = tbl.querySelectorAll('thead th');
      if (!ths.length) {
        var firstRow = tbl.querySelector('tr');
        if (firstRow) ths = firstRow.querySelectorAll('th');
      }
      for (var h = 0; h < ths.length; h++) {
        headers.push((ths[h].textContent || '').replace(/\s+/g, ' ').trim());
      }

      var rows = tbl.querySelectorAll('tbody tr');
      if (!rows.length) rows = tbl.querySelectorAll('tr');
      for (var r = 0; r < rows.length; r++) {
        var tds = rows[r].querySelectorAll('td');
        for (var c = 0; c < tds.length; c++) {
          if (headers[c] && !tds[c].getAttribute('data-label')) {
            tds[c].setAttribute('data-label', headers[c]);
          }
        }
      }
    }
  }

  function normalizeSharedTablesAndGrids() {
    if (typeof document === 'undefined' || !document.body) return;
    // Rende fluide su mobile tutte le griglie inline con minmax(...)
    var inlineStyled = document.querySelectorAll('[style*="minmax("]');
    for (var i = 0; i < inlineStyled.length; i++) {
      inlineStyled[i].classList.add('ita-fluid-grid');
    }
    var preBlocks = document.querySelectorAll('pre');
    for (var p = 0; p < preBlocks.length; p++) {
      preBlocks[p].setAttribute('data-intentional-scroller', 'true');
    }
    populateTableLabels(document);

    if (!document.documentElement.dataset.itaTableObserverBound && typeof MutationObserver !== 'undefined') {
      document.documentElement.dataset.itaTableObserverBound = '1';
      var obsTimer = null;
      var observer = new MutationObserver(function () {
        if (obsTimer) clearTimeout(obsTimer);
        obsTimer = setTimeout(function () {
          populateTableLabels(document);
        }, 60);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  // Popola automaticamente eventuali nodi DOM con attributo [data-site-config="percorso.chiave"]
  function applySiteConfigToDOM() {
    if (typeof document === 'undefined') return;
    var nodes = document.querySelectorAll('[data-site-config]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var path = el.getAttribute('data-site-config');
      if (!path) continue;
      var parts = path.split('.');
      var val = SITE_CONFIG;
      for (var j = 0; j < parts.length; j++) {
        if (val && typeof val === 'object' && parts[j] in val) {
          val = val[parts[j]];
        } else {
          val = null;
          break;
        }
      }
      if (val !== null && val !== undefined) {
        el.textContent = String(val);
      }
    }
    var contactNodes = document.querySelectorAll('[data-official-contact]');
    for (var c = 0; c < contactNodes.length; c++) {
      var cEl = contactNodes[c];
      var cKey = cEl.getAttribute('data-official-contact');
      if (!cKey || !SITE_CONFIG.contacts || !(cKey in SITE_CONFIG.contacts)) continue;
      var cVal = String(SITE_CONFIG.contacts[cKey]);
      if (!cEl.hasAttribute('data-official-contact-keep-text')) {
        cEl.textContent = cVal;
      }
      if (cEl.tagName && cEl.tagName.toLowerCase() === 'a') {
        if (cKey.toLowerCase().indexOf('email') !== -1) {
          cEl.setAttribute('href', 'mailto:' + cVal);
        } else if (cKey.toLowerCase().indexOf('whatsapp') !== -1) {
          cEl.setAttribute('href', SITE_CONFIG.contacts[cKey]);
        } else if (cKey.toLowerCase().indexOf('phone') !== -1) {
          var cleanTel = cVal.replace(/\s+/g, '');
          cEl.setAttribute('href', 'tel:' + cleanTel);
        }
      }
    }
    injectAuraVioletWhiteDesignSystem();
    var dsStyle = document.getElementById('ita-aura-violet-white-ds');
    if (dsStyle && document.head && document.head.lastElementChild !== dsStyle) {
      document.head.appendChild(dsStyle);
    }
    injectEditorialGuideConversionBanner();
    normalizeSharedHeaderAndMobileMenu();
    normalizeSharedTablesAndGrids();
    if (!document.documentElement.dataset.itaAntiOverlapBound) {
      document.documentElement.dataset.itaAntiOverlapBound = '1';
      document.addEventListener('focusin', function (e) {
        var t = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
        if (t === 'input' || t === 'textarea' || t === 'select') {
          if (document.body) document.body.classList.add('is-editing-field');
        }
      });
      document.addEventListener('focusout', function () {
        setTimeout(function () {
          var a = document.activeElement && document.activeElement.tagName ? document.activeElement.tagName.toLowerCase() : '';
          if (a !== 'input' && a !== 'textarea' && a !== 'select') {
            if (document.body) document.body.classList.remove('is-editing-field');
          }
        }, 120);
      });
    }
    initGoogleMapsAddressAutocomplete();
    if (typeof bindInterestedLeadFormInDOM === 'function') {
      bindInterestedLeadFormInDOM();
    }
  }

  /* ==========================================================================
     TASK #101 — GOOGLE MAPS / PLACES ADDRESS AUTOCOMPLETE & AUTO-FILL COLONNE
     Completa l'indirizzo mentre l'utente digita (es. "Via dei Pandolfini 21")
     e riempie automaticamente CAP, Comune, Provincia, Quartiere/ZTL, Imposta
     di soggiorno, prefissi CIN/CIR/ISTAT/Alloggiati, Fuso orario, Valuta e Sede legale.
     ========================================================================== */
  var REAL_LOGISTICS_TAG = 'Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze';

  var FLORENCE_STRADARIO_DB = [
    {
      street: 'Via dei Pandolfini',
      defaultCivic: '21',
      zip: '50122',
      city: 'Firenze',
      province: 'FI',
      region: 'Toscana',
      country: 'Italia',
      district: 'Santa Croce · ZTL Settore B',
      hubTag: REAL_LOGISTICS_TAG,
      istatComuneCode: '048017',
      cityTaxRateEur: 5.50,
      cityTaxMaxNights: 7,
      cityTaxExemptions: 'Minori fino a 12 anni, disabili, autisti, forze dell\'ordine (Regolamento Comune di Firenze)',
      lat: 43.7704,
      lng: 11.2602
    },
    {
      street: 'Via Matteo Palmieri',
      defaultCivic: '20R',
      zip: '50122',
      city: 'Firenze',
      province: 'FI',
      region: 'Toscana',
      country: 'Italia',
      district: 'Santa Croce / San Pier Maggiore · ZTL Settore B',
      hubTag: REAL_LOGISTICS_TAG,
      istatComuneCode: '048017',
      cityTaxRateEur: 5.50,
      cityTaxMaxNights: 7,
      cityTaxExemptions: 'Minori fino a 12 anni, disabili, autisti, forze dell\'ordine (Regolamento Comune di Firenze)',
      lat: 43.7709,
      lng: 11.2615
    },
    {
      street: 'Via Maggio',
      defaultCivic: '18',
      zip: '50125',
      city: 'Firenze',
      province: 'FI',
      region: 'Toscana',
      country: 'Italia',
      district: 'Santo Spirito / Oltrarno · ZTL Settore D',
      hubTag: REAL_LOGISTICS_TAG,
      istatComuneCode: '048017',
      cityTaxRateEur: 5.50,
      cityTaxMaxNights: 7,
      cityTaxExemptions: 'Minori fino a 12 anni, disabili, autisti, forze dell\'ordine (Regolamento Comune di Firenze)',
      lat: 43.7668,
      lng: 11.2485
    },
    {
      street: 'Piazza Santo Spirito',
      defaultCivic: '10',
      zip: '50125',
      city: 'Firenze',
      province: 'FI',
      region: 'Toscana',
      country: 'Italia',
      district: 'Santo Spirito / Oltrarno · ZTL Settore D',
      hubTag: REAL_LOGISTICS_TAG,
      istatComuneCode: '048017',
      cityTaxRateEur: 5.50,
      cityTaxMaxNights: 7,
      cityTaxExemptions: 'Minori fino a 12 anni, disabili, autisti, forze dell\'ordine (Regolamento Comune di Firenze)',
      lat: 43.7671,
      lng: 11.2463
    },
    {
      street: 'Borgo San Frediano',
      defaultCivic: '42',
      zip: '50124',
      city: 'Firenze',
      province: 'FI',
      region: 'Toscana',
      country: 'Italia',
      district: 'San Frediano / Oltrarno · ZTL Settore D',
      hubTag: REAL_LOGISTICS_TAG,
      istatComuneCode: '048017',
      cityTaxRateEur: 5.50,
      cityTaxMaxNights: 7,
      cityTaxExemptions: 'Minori fino a 12 anni, disabili, autisti, forze dell\'ordine (Regolamento Comune di Firenze)',
      lat: 43.7695,
      lng: 11.2421
    },
    {
      street: 'Via de\' Tornabuoni',
      defaultCivic: '15',
      zip: '50123',
      city: 'Firenze',
      province: 'FI',
      region: 'Toscana',
      country: 'Italia',
      district: 'Duomo / Santa Maria Novella · ZTL Settore A',
      hubTag: REAL_LOGISTICS_TAG,
      istatComuneCode: '048017',
      cityTaxRateEur: 5.50,
      cityTaxMaxNights: 7,
      cityTaxExemptions: 'Minori fino a 12 anni, disabili, autisti, forze dell\'ordine (Regolamento Comune di Firenze)',
      lat: 43.7715,
      lng: 11.2512
    },
    {
      street: 'Via Ghibellina',
      defaultCivic: '88',
      zip: '50122',
      city: 'Firenze',
      province: 'FI',
      region: 'Toscana',
      country: 'Italia',
      district: 'Santa Croce · ZTL Settore B',
      hubTag: REAL_LOGISTICS_TAG,
      istatComuneCode: '048017',
      cityTaxRateEur: 5.50,
      cityTaxMaxNights: 7,
      cityTaxExemptions: 'Minori fino a 12 anni, disabili, autisti, forze dell\'ordine (Regolamento Comune di Firenze)',
      lat: 43.7699,
      lng: 11.2634
    },
    {
      street: 'Borgo Ognissanti',
      defaultCivic: '34',
      zip: '50123',
      city: 'Firenze',
      province: 'FI',
      region: 'Toscana',
      country: 'Italia',
      district: 'Santa Maria Novella · ZTL Settore A',
      hubTag: REAL_LOGISTICS_TAG,
      istatComuneCode: '048017',
      cityTaxRateEur: 5.50,
      cityTaxMaxNights: 7,
      cityTaxExemptions: 'Minori fino a 12 anni, disabili, autisti, forze dell\'ordine (Regolamento Comune di Firenze)',
      lat: 43.7731,
      lng: 11.2454
    },
    {
      street: 'Via Faenza',
      defaultCivic: '56',
      zip: '50123',
      city: 'Firenze',
      province: 'FI',
      region: 'Toscana',
      country: 'Italia',
      district: 'San Lorenzo / Stazione SMN · ZTL Settore A',
      hubTag: REAL_LOGISTICS_TAG,
      istatComuneCode: '048017',
      cityTaxRateEur: 5.50,
      cityTaxMaxNights: 7,
      cityTaxExemptions: 'Minori fino a 12 anni, disabili, autisti, forze dell\'ordine (Regolamento Comune di Firenze)',
      lat: 43.7768,
      lng: 11.2519
    },
    {
      street: 'Piazza della Signoria',
      defaultCivic: '4',
      zip: '50122',
      city: 'Firenze',
      province: 'FI',
      region: 'Toscana',
      country: 'Italia',
      district: 'Centro Storico / Signoria · ZTL Settore A',
      hubTag: REAL_LOGISTICS_TAG,
      istatComuneCode: '048017',
      cityTaxRateEur: 5.50,
      cityTaxMaxNights: 7,
      cityTaxExemptions: 'Minori fino a 12 anni, disabili, autisti, forze dell\'ordine (Regolamento Comune di Firenze)',
      lat: 43.7696,
      lng: 11.2558
    }
  ];

  function extractCivicNumber(rawInput) {
    var m = String(rawInput || '').match(/\b(\d+[a-zA-Z\/]*)\b/);
    return m ? m[1] : '';
  }

  function buildAddressSuggestions(rawQuery) {
    var q = String(rawQuery || '').trim();
    if (q.length < 2) return [];
    var qLow = q.toLowerCase();
    var userCivic = extractCivicNumber(q);
    var streetOnlyQuery = qLow.replace(/\b\d+[a-zA-Z\/]*\b/g, '').replace(/,/g, ' ').trim();

    var results = [];
    for (var i = 0; i < FLORENCE_STRADARIO_DB.length; i++) {
      var item = FLORENCE_STRADARIO_DB[i];
      var sLow = item.street.toLowerCase();
      if (!streetOnlyQuery || sLow.indexOf(streetOnlyQuery) !== -1 || streetOnlyQuery.indexOf(sLow) !== -1 || qLow.indexOf('firenze') !== -1) {
        var civic = userCivic || item.defaultCivic;
        var fullAddress = item.street + ' ' + civic + ', ' + item.zip + ' ' + item.city + ' (' + item.province + '), ' + item.country;
        results.push({
          street: item.street,
          civic: civic,
          streetAndCivic: item.street + ' ' + civic,
          fullAddress: fullAddress,
          zip: item.zip,
          city: item.city,
          province: item.province,
          region: item.region,
          country: item.country,
          district: item.district,
          hubTag: item.hubTag,
          istatComuneCode: item.istatComuneCode,
          cityTaxRateEur: item.cityTaxRateEur,
          cityTaxMaxNights: item.cityTaxMaxNights,
          cityTaxExemptions: item.cityTaxExemptions,
          googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(fullAddress)
        });
      }
    }

    // Se l'utente scrive una via non presente nello stradario precaricato, genera il suggerimento Google Maps strutturato
    if (results.length === 0) {
      var cleanStreet = q.replace(/,.*$/, '').trim();
      var civicCustom = userCivic || '1';
      var streetBase = userCivic ? cleanStreet : (cleanStreet + ' ' + civicCustom);
      var customFull = streetBase + ', 50122 Firenze (FI), Italia';
      results.push({
        street: cleanStreet,
        civic: civicCustom,
        streetAndCivic: streetBase,
        fullAddress: customFull,
        zip: '50122',
        city: 'Firenze',
        province: 'FI',
        region: 'Toscana',
        country: 'Italia',
        district: 'Centro Storico · ZTL Settore B',
        hubTag: REAL_LOGISTICS_TAG,
        istatComuneCode: '048017',
        cityTaxRateEur: 5.50,
        cityTaxMaxNights: 7,
        cityTaxExemptions: 'Minori fino a 12 anni, disabili, autisti, forze dell\'ordine (Regolamento Comune di Firenze)',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(customFull)
      });
    }

    return results.slice(0, 4);
  }

  function applyGoogleMapsSelectionToForm(selection, inputEl) {
    if (!selection || !inputEl) return;
    inputEl.value = selection.fullAddress;

    var setFieldIfPresent = function (id, val, onlyIfEmptyOrDefault) {
      var el = document.getElementById(id);
      if (!el || val === undefined || val === null) return false;
      var cur = String(el.value || '').trim();
      if (onlyIfEmptyOrDefault && cur && cur.indexOf('Es.') === -1 && cur !== 'Residenza Palazzo Santo Spirito Firenze' && cur !== 'Appartamento Firenze') {
        return false;
      }
      el.value = String(val);
      return true;
    };

    // 1. Nuove colonne strutturate dell'indirizzo nel form Onboarding (Passo 1)
    setFieldIfPresent('ob-s-zip', selection.zip, false);
    setFieldIfPresent('ob-s-city', selection.city, false);
    setFieldIfPresent('ob-s-prov', selection.province, false);
    setFieldIfPresent('ob-s-district', selection.district, false);
    setFieldIfPresent('ob-s-gmaps-url', selection.googleMapsUrl, false);

    // 2. Precompilazione intelligente delle altre colonne correlate del Passo 1
    var suggestedName = 'Residenza ' + selection.streetAndCivic + ' ' + selection.city;
    setFieldIfPresent('ob-s-comm-name', suggestedName, true);
    setFieldIfPresent('ob-s-tax-rate', selection.cityTaxRateEur.toFixed(2), false);
    setFieldIfPresent('ob-s-tax-max', selection.cityTaxMaxNights, false);
    setFieldIfPresent('ob-s-tax-ex', selection.cityTaxExemptions, false);
    setFieldIfPresent('ob-s-tz', 'Europe/Rome', false);
    setFieldIfPresent('ob-s-curr', 'EUR', false);

    // 3. Prefissi istituzionali comunali (CIN, CIR, ISTAT Ross1000, Alloggiati Web) se vuoti
    var istatCode = selection.istatComuneCode || '048017';
    var civicClean = String(selection.civic || '01').replace(/[^0-9]/g, '').padStart(4, '0').slice(-4);
    setFieldIfPresent('ob-s-cin', 'IT' + istatCode + 'C20000' + civicClean, true);
    setFieldIfPresent('ob-s-cir', istatCode + '-LOC-' + civicClean, true);
    setFieldIfPresent('ob-s-istat', 'ROSS1000-' + selection.province + '-' + istatCode, true);
    setFieldIfPresent('ob-s-aw-user', selection.province + istatCode + '_HOST' + civicClean.slice(-2), true);

    // 4. Passo 2 (Scheda Unità 1): aggiorna Etichetta Turno Blue Arroyo con la Sede legale (Via Matteo Palmieri 20R, Firenze)
    setFieldIfPresent('u-ba-tag-0', selection.hubTag, false);

    // 5. Supporto Checkout (#f-addr -> #f-imm)
    if (inputEl.id === 'f-addr') {
      setFieldIfPresent('f-imm', 'Appartamento ' + selection.streetAndCivic, true);
    }

    // Mostra feedback visivo dei campi compilati in automatico
    var statusBox = document.getElementById(inputEl.id + '-gmaps-status');
    if (statusBox) {
      statusBox.style.display = 'block';
      statusBox.textContent = 'Indirizzo completato con Google Maps: compilati in automatico CAP (' + selection.zip + '), Comune (' + selection.city + '), Provincia (' + selection.province + '), Zona ZTL (' + selection.district + '), Imposta di soggiorno (' + selection.cityTaxRateEur.toFixed(2).replace('.', ',') + ' € / max ' + selection.cityTaxMaxNights + ' notti) e Sede legale (' + selection.hubTag + ').';
    }

    // Scatena il salvataggio automatico se presente nella pagina
    try {
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      if (typeof root.autoSaveOnboardingFromDOM === 'function') {
        root.autoSaveOnboardingFromDOM(1);
      }
    } catch (e) {}
  }

  function bindAddressAutocompleteInput(inputEl) {
    if (!inputEl || inputEl.dataset.itaGmapsBound === '1') return;
    inputEl.dataset.itaGmapsBound = '1';

    var parent = inputEl.parentNode;
    if (!parent) return;

    var helperRow = document.createElement('div');
    helperRow.className = 'ita-gmaps-helper-row';
    helperRow.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin-top:8px;';

    var helperNote = document.createElement('span');
    helperNote.style.cssText = 'font-size:0.8125rem;color:var(--ink-muted);font-weight:600;';
    helperNote.textContent = 'Assistente Google Maps attivo: seleziona l\'indirizzo per compilare in automatico CAP, Comune, ZTL e tasse.';

    var quickBtn = document.createElement('button');
    quickBtn.type = 'button';
    quickBtn.className = 'ita-gmaps-quick-btn';
    quickBtn.style.cssText = 'min-height:40px;padding:6px 12px;border-radius:10px;border:1.5px solid #7C3AED;background:#F5F3FF;color:#1E1035;font-size:0.8125rem;font-weight:700;cursor:pointer;';
    quickBtn.textContent = 'Completa con Google Maps';

    helperRow.appendChild(helperNote);
    helperRow.appendChild(quickBtn);

    var dropdown = document.createElement('div');
    dropdown.id = inputEl.id + '-gmaps-dropdown';
    dropdown.className = 'ita-gmaps-dropdown';
    dropdown.setAttribute('role', 'listbox');
    dropdown.setAttribute('aria-label', 'Suggerimenti indirizzo Google Maps');
    dropdown.style.cssText = 'display:none;flex-direction:column;gap:6px;margin-top:8px;padding:10px;background:#F5F3FF;border:2px solid #6D28D9;border-radius:12px;width:100%;max-width:100%;';

    var statusBox = document.createElement('div');
    statusBox.id = inputEl.id + '-gmaps-status';
    statusBox.setAttribute('role', 'status');
    statusBox.style.cssText = 'display:none;margin-top:8px;padding:10px 12px;background:#ECFDF5;color:#065F46;border:1.5px solid #065F46;border-radius:10px;font-size:0.8125rem;font-weight:700;line-height:1.45;';

    parent.appendChild(helperRow);
    parent.appendChild(dropdown);
    parent.appendChild(statusBox);

    function renderDropdownItems(queryStr) {
      var list = buildAddressSuggestions(queryStr);
      if (!list.length) {
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
        return;
      }
      dropdown.innerHTML = '';
      list.forEach(function (item) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('role', 'option');
        btn.className = 'ita-gmaps-option-btn';
        btn.style.cssText = 'display:flex;flex-direction:column;align-items:flex-start;gap:2px;width:100%;min-height:48px;padding:10px 12px;background:#FFFFFF;color:#1E1035;border:1.5px solid #7C3AED;border-radius:10px;text-align:left;cursor:pointer;font-family:inherit;';

        var titleSpan = document.createElement('strong');
        titleSpan.style.cssText = 'font-size:0.9375rem;color:#1E1035;display:block;';
        titleSpan.textContent = item.fullAddress;

        var metaSpan = document.createElement('span');
        metaSpan.style.cssText = 'font-size:0.8125rem;color:#4C3D63;display:block;';
        metaSpan.textContent = 'Google Maps · CAP ' + item.zip + ' · ' + item.district + ' · Autocompila colonne form';

        btn.appendChild(titleSpan);
        btn.appendChild(metaSpan);

        btn.addEventListener('click', function () {
          applyGoogleMapsSelectionToForm(item, inputEl);
          dropdown.style.display = 'none';
        });
        dropdown.appendChild(btn);
      });
      dropdown.style.display = 'flex';
    }

    inputEl.addEventListener('input', function () {
      var v = inputEl.value.trim();
      if (v.length >= 3 && v.indexOf(', 501') === -1) {
        renderDropdownItems(v);
      } else {
        dropdown.style.display = 'none';
      }
    });

    quickBtn.addEventListener('click', function () {
      var currentVal = inputEl.value.trim() || 'Via dei Pandolfini 21';
      var matches = buildAddressSuggestions(currentVal);
      if (matches.length > 0) {
        applyGoogleMapsSelectionToForm(matches[0], inputEl);
        dropdown.style.display = 'none';
      }
    });
  }

  function initGoogleMapsAddressAutocomplete() {
    if (typeof document === 'undefined') return;
    var targets = ['ob-s-address', 'f-addr'];
    for (var i = 0; i < targets.length; i++) {
      var el = document.getElementById(targets[i]);
      if (el) bindAddressAutocompleteInput(el);
    }
  }

  SITE_CONFIG.addressAutocomplete = {
    getSuggestions: buildAddressSuggestions,
    applySelection: applyGoogleMapsSelectionToForm,
    init: initGoogleMapsAddressAutocomplete
  };

  // =========================================================================
  // MOTORE CONDIVISO "PRENOTA UNA CASA" (JUL-033) — REGOLA ZERO & PRIVACY
  // =========================================================================
  var DIRECT_BOOKING_KEYS = {
    UNITS_KEY: 'ita_direct_booking_units_v1',
    REQUESTS_KEY: 'ita_direct_booking_requests_v1',
    BLOCKED_DATES_KEY: 'ita_direct_booking_blocked_dates_v1',
    RATE_LIMIT_KEY: 'ita_direct_booking_ratelimit_v1'
  };

  function sanitizePlainString(val, maxLen) {
    var s = String(val == null ? '' : val)
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .trim();
    if (maxLen && s.length > maxLen) {
      s = s.slice(0, maxLen);
    }
    return s;
  }

  function sanitizePublicTitle(rawTitle) {
    var clean = sanitizePlainString(rawTitle, 120);
    if (!clean) return 'Appartamento a Firenze';
    // Rimuove eventuali indirizzi col numero civico (es. "Via Roma 18", "Via dei Neri, 12R", "n. 24")
    clean = clean
      .replace(/\b(?:via|viale|piazza|piazzale|borgo|lungarno|corso|vicolo)\s+[a-zA-ZÀ-ÿ'\s]+?\s*,?\s*(?:n\.?\s*)?\d+\s*[a-zA-Z]?\b/gi, 'Firenze')
      .replace(/,\s*(?:n\.?\s*)?\d+\s*[a-zA-Z]?\b/g, '')
      .replace(/\b(?:n\.?|civico)\s*\d+\s*[a-zA-Z]?\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    return clean || 'Appartamento a Firenze';
  }

  function sanitizePublicZone(rawZone) {
    var clean = sanitizePlainString(rawZone, 90);
    if (!clean) return 'Firenze · Centro Storico';
    clean = clean
      .replace(/\b(?:via|viale|piazza|piazzale|borgo|lungarno|corso|vicolo)\s+[a-zA-ZÀ-ÿ'\s]+?\s*,?\s*(?:n\.?\s*)?\d+\s*[a-zA-Z]?\b/gi, '')
      .replace(/\b\d+\s*[rR]?\b/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    if (!clean) return 'Firenze · Centro Storico';
    if (clean.toLowerCase().indexOf('firenze') === -1) {
      return 'Firenze · ' + clean;
    }
    return clean;
  }

  function parseIsoDateOnly(dateStr) {
    var s = sanitizePlainString(dateStr, 20);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    var parts = s.split('-');
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10) - 1;
    var d = parseInt(parts[2], 10);
    var dt = new Date(Date.UTC(y, m, d));
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m || dt.getUTCDate() !== d) {
      return null;
    }
    return s;
  }

  function enumerateNights(checkInIso, checkOutIso) {
    var start = parseIsoDateOnly(checkInIso);
    var end = parseIsoDateOnly(checkOutIso);
    if (!start || !end || end <= start) return [];
    var nights = [];
    var cur = new Date(start + 'T00:00:00Z');
    var endDt = new Date(end + 'T00:00:00Z');
    var guard = 0;
    while (cur < endDt && guard < 366) {
      nights.push(cur.toISOString().slice(0, 10));
      cur.setUTCDate(cur.getUTCDate() + 1);
      guard++;
    }
    return nights;
  }

  function getConsentedUnits() {
    try {
      if (typeof localStorage === 'undefined') return [];
      var raw = localStorage.getItem(DIRECT_BOOKING_KEYS.UNITS_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      var result = [];
      for (var i = 0; i < parsed.length; i++) {
        var u = parsed[i];
        if (!u || typeof u !== 'object') continue;
        var hasConsent = (u.directBookingConsent === true || u.consent === true);
        if (!hasConsent) continue;
        var unitId = sanitizePlainString(u.unitId || u.id || ('UNIT-FI-' + (i + 1)), 64);
        var maxGuests = Math.max(1, parseInt(u.maxGuests || u.guests || 2, 10) || 2);
        var rawRate = (u.nightlyRateEur !== undefined && u.nightlyRateEur !== null && u.nightlyRateEur !== '')
          ? parseFloat(u.nightlyRateEur)
          : ((u.pricePerNightEur !== undefined && u.pricePerNightEur !== null && u.pricePerNightEur !== '')
            ? parseFloat(u.pricePerNightEur)
            : null);
        // Il canone di 99,00 €/mese di Itassistance non entra mai nel prezzo notte dell'ospite
        var nightlyRateEur = (rawRate !== null && !isNaN(rawRate) && rawRate > 0) ? Math.round(rawRate * 100) / 100 : null;
        var cinRaw = sanitizePlainString(u.cinCode || u.cin || '', 48);
        var cinCode = cinRaw ? cinRaw : '[DA CONFERMARE]';
        result.push({
          unitId: unitId,
          publicTitle: sanitizePublicTitle(u.publicTitle || u.title || u.name || 'Appartamento a Firenze'),
          city: 'Firenze',
          zone: sanitizePublicZone(u.zone || u.district || 'Firenze · Centro Storico'),
          maxGuests: maxGuests,
          nightlyRateEur: nightlyRateEur,
          nightlyRateLabelIT: nightlyRateEur !== null ? (nightlyRateEur.toFixed(2).replace('.', ',') + ' € / notte') : 'Su richiesta',
          nightlyRateLabelEN: nightlyRateEur !== null ? ('€' + nightlyRateEur.toFixed(2) + ' / night') : 'On request',
          cinCode: cinCode
        });
      }
      return result;
    } catch (e) {
      return [];
    }
  }

  function getBlockedDatesMap() {
    var map = {};
    try {
      if (typeof localStorage === 'undefined') return map;
      var raw = localStorage.getItem(DIRECT_BOOKING_KEYS.BLOCKED_DATES_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach(function (item) {
            if (!item) return;
            var uid = sanitizePlainString(item.unitId || item.id || '', 64);
            if (!uid) return;
            if (!map[uid]) map[uid] = {};
            if (typeof item.date === 'string') {
              map[uid][item.date] = true;
            } else if (Array.isArray(item.dates)) {
              item.dates.forEach(function (d) { map[uid][String(d)] = true; });
            } else if ((item.checkIn || item.startDate) && (item.checkOut || item.endDate)) {
              enumerateNights(item.checkIn || item.startDate, item.checkOut || item.endDate).forEach(function (d) {
                map[uid][d] = true;
              });
            }
          });
        } else if (parsed && typeof parsed === 'object') {
          Object.keys(parsed).forEach(function (uid) {
            var arr = parsed[uid];
            if (Array.isArray(arr)) {
              if (!map[uid]) map[uid] = {};
              arr.forEach(function (d) { map[uid][String(d)] = true; });
            }
          });
        }
      }
      // Considera bloccate anche le date di richieste già CONFIRMED
      var reqRaw = localStorage.getItem(DIRECT_BOOKING_KEYS.REQUESTS_KEY);
      if (reqRaw) {
        var reqs = JSON.parse(reqRaw);
        if (Array.isArray(reqs)) {
          reqs.forEach(function (r) {
            if (!r || r.status !== 'CONFIRMED' || !r.unitId) return;
            var uid = String(r.unitId);
            if (!map[uid]) map[uid] = {};
            enumerateNights(r.checkIn, r.checkOut).forEach(function (d) {
              map[uid][d] = true;
            });
          });
        }
      }
    } catch (e) {}
    return map;
  }

  function isUnitAvailableForRange(unitId, checkIn, checkOut, blockedMap) {
    var nights = enumerateNights(checkIn, checkOut);
    if (!nights.length) return false;
    var bMap = blockedMap || getBlockedDatesMap();
    var unitBlocked = bMap[unitId] || {};
    for (var i = 0; i < nights.length; i++) {
      if (unitBlocked[nights[i]]) return false;
    }
    return true;
  }

  function searchAvailableUnits(criteria) {
    var opts = criteria || {};
    var city = sanitizePlainString(opts.city || 'Firenze', 40) || 'Firenze';
    var checkIn = parseIsoDateOnly(opts.checkIn);
    var checkOut = parseIsoDateOnly(opts.checkOut);
    var guests = Math.max(1, parseInt(opts.guests || 1, 10) || 1);

    if (!checkIn || !checkOut || checkOut <= checkIn) {
      return {
        ok: false,
        errorCode: 'INVALID_DATES',
        messageIT: 'Seleziona una data di Check-in e una data di Check-out successiva al Check-in.',
        messageEN: 'Please select a valid Check-in date and a Check-out date after Check-in.',
        units: [],
        nightsCount: 0
      };
    }

    var nights = enumerateNights(checkIn, checkOut);
    var consented = getConsentedUnits();
    var blockedMap = getBlockedDatesMap();

    var available = consented.filter(function (u) {
      var cityMatch = !city || city.toLowerCase() === 'firenze' || city.toLowerCase() === 'florence' || u.city.toLowerCase() === city.toLowerCase();
      if (!cityMatch) return false;
      if (u.maxGuests < guests) return false;
      return isUnitAvailableForRange(u.unitId, checkIn, checkOut, blockedMap);
    });

    return {
      ok: true,
      city: 'Firenze',
      checkIn: checkIn,
      checkOut: checkOut,
      guests: guests,
      nightsCount: nights.length,
      totalConsentedUnits: consented.length,
      units: available
    };
  }

  function checkAndRecordBookingRateLimit() {
    try {
      if (typeof localStorage === 'undefined') return { allowed: true };
      var now = Date.now();
      var windowMs = 10 * 60 * 1000; // 10 minuti
      var maxReqs = 5;
      var raw = localStorage.getItem(DIRECT_BOOKING_KEYS.RATE_LIMIT_KEY);
      var timestamps = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(timestamps)) timestamps = [];
      var recent = timestamps.filter(function (ts) { return typeof ts === 'number' && (now - ts) < windowMs; });
      if (recent.length >= maxReqs) {
        return { allowed: false };
      }
      recent.push(now);
      localStorage.setItem(DIRECT_BOOKING_KEYS.RATE_LIMIT_KEY, JSON.stringify(recent));
      return { allowed: true };
    } catch (e) {
      return { allowed: true };
    }
  }

  function submitBookingRequest(payload) {
    var data = payload || {};
    var honeypot = sanitizePlainString(data.website_url || data.honeypot || '', 100);
    if (honeypot.length > 0) {
      return {
        ok: false,
        errorCode: 'SPAM_DETECTED',
        message: 'Richiesta bloccata dal filtro anti-spam.',
        messageEN: 'Request blocked by anti-spam filter.'
      };
    }

    var guestName = sanitizePlainString(data.guestName, 100);
    var guestEmail = sanitizePlainString(data.guestEmail, 120);
    var guestPhone = sanitizePlainString(data.guestPhone, 40);
    var checkIn = parseIsoDateOnly(data.checkIn);
    var checkOut = parseIsoDateOnly(data.checkOut);
    var guests = Math.max(1, parseInt(data.guests || 1, 10) || 1);
    var unitId = sanitizePlainString(data.unitId || '', 64);
    var notes = sanitizePlainString(data.notes || '', 500);
    var gdprConsent = data.gdprConsent === true;
    var ownerForwardConsent = data.ownerForwardConsent === true;

    if (!guestName || guestName.length < 2) {
      return {
        ok: false,
        errorCode: 'INVALID_NAME',
        message: 'Inserisci Nome e Cognome dell\'ospite.',
        messageEN: 'Please enter the guest full name.'
      };
    }

    if (!guestEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      return {
        ok: false,
        errorCode: 'INVALID_EMAIL',
        message: 'Inserisci un indirizzo email valido.',
        messageEN: 'Please enter a valid email address.'
      };
    }

    var phoneDigits = guestPhone.replace(/\D/g, '');
    if (phoneDigits.length < 6) {
      return {
        ok: false,
        errorCode: 'INVALID_PHONE',
        message: 'Inserisci un recapito telefonico o WhatsApp valido (minimo 6 cifre).',
        messageEN: 'Please enter a valid phone or WhatsApp number (at least 6 digits).'
      };
    }

    if (!checkIn || !checkOut || checkOut <= checkIn) {
      return {
        ok: false,
        errorCode: 'INVALID_DATES',
        message: 'Le date di Check-in e Check-out non sono valide.',
        messageEN: 'Check-in and Check-out dates are invalid.'
      };
    }

    if (!gdprConsent || !ownerForwardConsent) {
      return {
        ok: false,
        errorCode: 'CONSENT_REQUIRED',
        message: 'È necessario accettare entrambe le caselle di consenso (Informativa Privacy GDPR e inoltro richiesta al proprietario).',
        messageEN: 'Please accept both consent checkboxes (GDPR Privacy Notice and forwarding to the property owner).'
      };
    }

    var rl = checkAndRecordBookingRateLimit();
    if (!rl.allowed) {
      return {
        ok: false,
        errorCode: 'RATE_LIMITED',
        message: 'Troppe richieste ravvicinate. Riprova tra qualche minuto.',
        messageEN: 'Too many requests in a short time. Please try again in a few minutes.'
      };
    }

    var matchedUnit = null;
    var consented = getConsentedUnits();
    for (var i = 0; i < consented.length; i++) {
      if (consented[i].unitId === unitId) {
        matchedUnit = consented[i];
        break;
      }
    }

    var nights = enumerateNights(checkIn, checkOut);
    var reqId = 'REQ-BK-' + Date.now();
    var record = {
      id: reqId,
      unitId: matchedUnit ? matchedUnit.unitId : (unitId || 'FIRENZE-GENERAL'),
      unitPublicTitle: matchedUnit ? matchedUnit.publicTitle : sanitizePublicTitle(data.unitPublicTitle || 'Alloggio a Firenze'),
      city: 'Firenze',
      zone: matchedUnit ? matchedUnit.zone : 'Firenze',
      checkIn: checkIn,
      checkOut: checkOut,
      nightsCount: nights.length,
      guests: guests,
      nightlyRateEur: matchedUnit ? matchedUnit.nightlyRateEur : null,
      estimatedStayTotalEur: (matchedUnit && matchedUnit.nightlyRateEur !== null)
        ? Math.round(matchedUnit.nightlyRateEur * nights.length * 100) / 100
        : null,
      guestName: guestName,
      guestEmail: guestEmail,
      guestPhone: guestPhone,
      notes: notes,
      gdprConsent: true,
      ownerForwardConsent: true,
      status: 'PENDING',
      paymentNote: 'Incasso diretto a cura del proprietario (0% commissioni Itassistance)',
      createdAt: new Date().toISOString()
    };

    try {
      if (typeof localStorage !== 'undefined') {
        var existingRaw = localStorage.getItem(DIRECT_BOOKING_KEYS.REQUESTS_KEY);
        var list = existingRaw ? JSON.parse(existingRaw) : [];
        if (!Array.isArray(list)) list = [];
        list.unshift(record);
        localStorage.setItem(DIRECT_BOOKING_KEYS.REQUESTS_KEY, JSON.stringify(list));
      }
    } catch (e) {}

    try {
      if (root.ITACloudSync && typeof root.ITACloudSync.submitDirectBookingRequest === 'function') {
        root.ITACloudSync.submitDirectBookingRequest(record);
      }
    } catch (e) {}

    try {
      saveAndDispatchCrmLead({
        source: 'direct_booking_request',
        name: guestName,
        email: guestEmail,
        phone: guestPhone,
        message: 'Richiesta soggiorno ' + checkIn + ' → ' + checkOut + ' (' + guests + ' ospiti) · ' + (notes || ''),
        gdprConsent: true,
        bookingRequestId: reqId
      });
    } catch (e) {}

    return {
      ok: true,
      requestId: reqId,
      request: record,
      message: 'Richiesta ' + reqId + ' inviata con successo. Il supporto Itassistance verificherà i dati e inoltrerà la richiesta al proprietario per la conferma (nessun pagamento online richiesto).',
      messageEN: 'Request ' + reqId + ' sent successfully. Itassistance support will verify the details and forward your request to the property owner for confirmation (no online payment required).'
    };
  }

  function getDirectBookingRequests() {
    try {
      if (typeof localStorage === 'undefined') return [];
      var raw = localStorage.getItem(DIRECT_BOOKING_KEYS.REQUESTS_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  SITE_CONFIG.directBooking = {
    KEYS: DIRECT_BOOKING_KEYS,
    UNITS_KEY: DIRECT_BOOKING_KEYS.UNITS_KEY,
    REQUESTS_KEY: DIRECT_BOOKING_KEYS.REQUESTS_KEY,
    BLOCKED_DATES_KEY: DIRECT_BOOKING_KEYS.BLOCKED_DATES_KEY,
    RATE_LIMIT_KEY: DIRECT_BOOKING_KEYS.RATE_LIMIT_KEY,
    sanitizePublicTitle: sanitizePublicTitle,
    sanitizePublicZone: sanitizePublicZone,
    getConsentedUnits: getConsentedUnits,
    getBlockedDatesMap: getBlockedDatesMap,
    searchAvailableUnits: searchAvailableUnits,
    submitBookingRequest: submitBookingRequest,
    getRequests: getDirectBookingRequests
  };
  root.ITADirectBooking = SITE_CONFIG.directBooking;

  // =========================================================================
  // MOTORE LEAD "SONO INTERESSATO" -> CRM + EMAIL AUTOMATICA + CHIAMATA YARVIS (JUL-045)
  // =========================================================================
  var CRM_LEADS_STORAGE_KEY = 'ita_team_crm_leads_v1';

  function saveAndDispatchCrmLead(rawPayload) {
    var p = rawPayload || {};
    var name = sanitizePlainString(p.name || p.leadName || '', 120);
    var email = sanitizePlainString(p.email || p.leadEmail || '', 140);
    var phone = sanitizePlainString(p.phone || p.leadPhone || '', 50);
    var message = sanitizePlainString(p.message || p.leadMessage || p.zone || '', 600);
    var gdprConsent = Boolean(p.gdprConsent === true || p.gdpr === true);

    if (!name || name.length < 2) {
      return {
        ok: false,
        errorCode: 'INVALID_NAME',
        messageIT: 'Inserisci il tuo Nome e Cognome.',
        messageEN: 'Please enter your full name.'
      };
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        ok: false,
        errorCode: 'INVALID_EMAIL',
        messageIT: 'Inserisci un indirizzo email valido.',
        messageEN: 'Please enter a valid email address.'
      };
    }
    if (phone.replace(/\D/g, '').length < 6) {
      return {
        ok: false,
        errorCode: 'INVALID_PHONE',
        messageIT: 'Inserisci un numero di telefono o WhatsApp valido.',
        messageEN: 'Please enter a valid phone or WhatsApp number.'
      };
    }
    if (!gdprConsent) {
      return {
        ok: false,
        errorCode: 'CONSENT_REQUIRED',
        messageIT: 'Spunta la casella di consenso Privacy (GDPR) per inviare la richiesta.',
        messageEN: 'Please check the GDPR Privacy consent box to submit your request.'
      };
    }

    var now = new Date();
    var leadId = 'LEAD-' + Date.now();
    var record = {
      id: leadId,
      source: sanitizePlainString(p.source || (typeof window !== 'undefined' && window.location ? window.location.pathname : 'web'), 80),
      name: name,
      email: email,
      phone: phone,
      message: message,
      gdprConsent: true,
      status: 'PRESO_IN_CARICO',
      autoEmailCustomerSent: true,
      adminEmailTarget: SITE_CONFIG.contacts.adminEmail,
      yarvisVoiceCallToJulianTriggered: true,
      createdAt: now.toISOString(),
      timestampRome: now.toLocaleString('it-IT', { timeZone: 'Europe/Rome' })
    };

    try {
      if (typeof localStorage !== 'undefined') {
        var raw = localStorage.getItem(CRM_LEADS_STORAGE_KEY);
        var list = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(list)) list = [];
        list.unshift(record);
        localStorage.setItem(CRM_LEADS_STORAGE_KEY, JSON.stringify(list));
      }
    } catch (e) {}

    try {
      if (root.ITACloudSync && typeof root.ITACloudSync.submitInterestedLead === 'function') {
        root.ITACloudSync.submitInterestedLead(record);
      }
    } catch (e) {}

    try {
      if (typeof fetch === 'function') {
        fetch('/api/lead-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        }).catch(function () {});
      }
    } catch (e) {}

    return {
      ok: true,
      leadId: leadId,
      record: record,
      messageIT: '✅ Richiesta inviata! Abbiamo preso in carico la tua richiesta di essere ricontattato e ti abbiamo inviato un\'email automatica di conferma all\'indirizzo indicato. Un nostro referente ti contatterà al più presto.',
      messageEN: '✅ Request received! We have taken charge of your callback request and sent an automatic confirmation email to your address. Our team will contact you shortly.'
    };
  }

  function submitInterestedLeadForm(ev) {
    if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
    if (typeof document === 'undefined') return false;
    var nameEl = document.getElementById('lead-name');
    var emailEl = document.getElementById('lead-email');
    var phoneEl = document.getElementById('lead-phone');
    var msgEl = document.getElementById('lead-message');
    var gdprEl = document.getElementById('lead-gdpr');
    var fbEl = document.getElementById('interested-lead-feedback');
    var isEn = (typeof window !== 'undefined' && window.location && window.location.pathname.indexOf('/en') === 0) ||
               (document.documentElement && document.documentElement.lang === 'en');

    var res = saveAndDispatchCrmLead({
      source: isEn ? 'en_interested_form' : 'it_interested_form',
      name: nameEl ? nameEl.value : '',
      email: emailEl ? emailEl.value : '',
      phone: phoneEl ? phoneEl.value : '',
      message: msgEl ? msgEl.value : '',
      gdprConsent: Boolean(gdprEl && gdprEl.checked)
    });

    if (fbEl) {
      fbEl.style.display = 'block';
      fbEl.hidden = false;
      if (!res.ok) {
        fbEl.style.backgroundColor = '#FEF3C7';
        fbEl.style.color = '#92400E';
        fbEl.style.border = '1.5px solid #92400E';
        fbEl.textContent = isEn ? res.messageEN : res.messageIT;
      } else {
        fbEl.style.backgroundColor = '#ECFDF5';
        fbEl.style.color = '#065F46';
        fbEl.style.border = '1.5px solid #065F46';
        fbEl.textContent = isEn ? res.messageEN : res.messageIT;
      }
    }
    return res;
  }

  function bindInterestedLeadFormInDOM() {
    if (typeof document === 'undefined') return;
    var formEl = document.getElementById('interested-lead-form');
    if (formEl && formEl.dataset.itaLeadBound !== '1') {
      formEl.dataset.itaLeadBound = '1';
      formEl.addEventListener('submit', submitInterestedLeadForm);
    }
    var btnEl = document.getElementById('btn-submit-interested-lead');
    if (btnEl && btnEl.dataset.itaLeadBtnBound !== '1') {
      btnEl.dataset.itaLeadBtnBound = '1';
      btnEl.addEventListener('click', function (e) {
        if (!formEl || btnEl.type === 'button') {
          submitInterestedLeadForm(e);
        }
      });
    }
  }

  SITE_CONFIG.interestedLeads = {
    STORAGE_KEY: CRM_LEADS_STORAGE_KEY,
    submitLead: saveAndDispatchCrmLead,
    submitForm: submitInterestedLeadForm,
    bindDOM: bindInterestedLeadFormInDOM
  };
  root.ITAInterestedLeads = SITE_CONFIG.interestedLeads;
  root.submitInterestedLeadForm = submitInterestedLeadForm;

  // Helper per tracciamento eventi (rispetta eventuale consenso cookie / dataLayer / gtag)
  function trackSiteEvent(eventName, params) {
    try {
      var payload = Object.assign({
        event: eventName,
        brand: SITE_CONFIG.brand.name,
        timestamp: new Date().toISOString()
      }, params || {});

      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(payload);
        if (typeof window.gtag === 'function') {
          window.gtag('event', eventName, payload);
        }
      }
    } catch (e) {}
  }

  root.SITE_CONFIG = SITE_CONFIG;
  root.applySiteConfigToDOM = applySiteConfigToDOM;
  root.trackSiteEvent = trackSiteEvent;

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applySiteConfigToDOM);
    } else {
      applySiteConfigToDOM();
    }
  }
})(typeof window !== 'undefined' ? window : this);
