/**
 * site-config.js — UNICA FONTE DI VERITÀ (Single Source of Truth) per itassistance
 * Tutti i prezzi, condizioni, orari, contatti e dati legali del sito, del generatore PDF
 * e delle comunicazioni email/WhatsApp sono letti da questo file.
 */
(function (root) {
  'use strict';

  var SITE_CONFIG = {
    brand: {
      name: 'itassistance',
      teamLabel: 'il team di itassistance',
      tagline: 'Il tuo appartamento, sotto controllo. In 10 minuti al giorno.',
      domain: 'https://www.itadreamteam.com',
      logoPath: '/brand/logo.png'
    },

    pricing: {
      monthlyEur: 99,
      minMonthlyEur: 99.00,
      maxMonthlyEur: 289.50,
      yearlyEur: 1188,
      currency: '€',
      currencyCode: 'EUR',
      vatIncluded: true,
      vatLabel: 'IVA inclusa',
      monthlyFormatted: 'da 99,00 €',
      rangeFormatted: '99,00 € – 289,50 € / mese',
      yearlyFormatted: '1.188 €',
      pricePerMonthLabel: 'da 99,00 € a 289,50 € / mese',
      priceFullLabel: 'da 99,00 € a 289,50 € al mese (IVA inclusa)',
      commissionPct: 0,
      commissionLabel: 'Zero commissioni sulle prenotazioni (0%)',
      activationFeeEur: 0,
      activationLabel: 'Zero costi di attivazione',
      cancellationLabel: 'Disdetta libera in qualsiasi momento, senza penali',
      paymentModesLabel: 'La quota mensile varia ogni giorno tra 99,00 € e 289,50 € in base agli slot di acquisizione disponibili su Firenze; una volta attivata resta bloccata per il tuo appartamento.',
      guaranteeDays: 14,
      guaranteeTitle: 'Garanzia 14 giorni Soddisfatto o Rimborsato',
      guaranteeText: 'Prova l’app senza rischi: se entro 14 giorni decidi che non fa per te, disdici con un clic e ti rimborsiamo il 100% di quanto versato.'
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
      directOwnersPct: '75%',
      directOwnersLabel: 'Circa il 75% degli appartamenti in affitto breve in Italia non ha un property manager ed è gestito direttamente dal proprietario.',
      smallHostsPct: '84%',
      smallHostsLabel: 'I piccoli host (1–2 unità) rappresentano circa l’84% del totale dei proprietari presenti sul mercato.',
      proRevenueSharePct: '37–38%',
      proRevenueShareLabel: 'Chi utilizza strumenti professionali e ottimizzazione dinamica delle tariffe (pur essendo il 25% degli immobili) genera il 37–38% del fatturato totale del mercato.',
      sourcesCitation: 'Fonti: Centro Studi AIGAB (Associazione Italiana Gestori Affitti Brevi), Idealista e Politecnico di Torino.'
    },

    extras: {
      availableCity: 'Firenze',
      revenueAndLegalAddon: {
        id: 'revenue_adempimenti_10',
        name: 'Extra Revenue Management & Adempimenti di Legge',
        ratePct: 10,
        rateFormatted: '+10%',
        description: 'Opzionale: se oltre all’app vuoi delegare a noi anche l’ottimizzazione dinamica dei prezzi (Revenue Management) e la compilazione/gestione operativa degli adempimenti di legge (Alloggiati Web, flussi ISTAT/Ross1000, dichiarazioni imposta di soggiorno).'
      },
      note: 'Servizi extra opzionali a richiesta (separati dal canone base dell’app da 99 €/mese, attivabili solo se li desideri):',
      items: [
        {
          id: 'revenue_adempimenti',
          name: 'Revenue Management + Gestione completa Adempimenti di Legge',
          priceEur: null,
          priceFormatted: '+10% (extra opzionale su richiesta)'
        },
        {
          id: 'checkin',
          name: 'Accoglienza e check-in di persona (Firenze)',
          priceEur: 20,
          priceFormatted: '20 € (IVA inclusa) a intervento'
        },
        {
          id: 'maintenance',
          name: 'Intervento di piccola manutenzione ordinaria (Firenze)',
          priceEur: 30,
          priceFormatted: '30 € (IVA inclusa) a intervento'
        },
        {
          id: 'cleaning',
          name: 'Pulizie e cambio biancheria con fornitori certificati (Firenze)',
          priceEur: null,
          priceFormatted: 'Su preventivo in base alla metratura'
        }
      ]
    },

    support: {
      phoneDisplay: '+39 351 038 0392',
      phoneTel: '+393510380392',
      whatsappNumber: '393510380392',
      whatsappUrl: 'https://wa.me/393510380392',
      email: 'info@itadreamteam.com',
      hoursIT: 'Tutti i giorni dalle 09:00 alle 23:00',
      hoursEN: 'Every day from 09:00 AM to 11:00 PM',
      hoursShortIT: '09:00 – 23:00',
      responseTimeIT: 'Risposta rapida da persone vere a Firenze',
      activeCity: 'Firenze',
      comingSoonCities: 'Altre città italiane: Prossimamente'
    },

    legal: {
      companyName: 'Blue Arroyo SRL',
      vatNumber: '07480210488',
      vatFull: 'IT07480210488',
      address: 'Via Matteo Palmieri 20r, 50122 Firenze (FI), Italia',
      city: 'Firenze',
      copyrightYear: '2026',
      footerLine: 'itassistance è un prodotto di Blue Arroyo SRL · P.IVA 07480210488 · Via Matteo Palmieri 20r, 50122 Firenze (FI)'
    },

    urls: {
      app: '/app.html',
      login: '/login.html',
      admin: '/admin.html',
      welcome: '/benvenuto.html',
      guestCheckin: '/ospiti.html',
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
      stripeMonthlyUrl: 'https://buy.stripe.com/test_eVaeV0aW5gWvg8M7ss?client_reference_id=itassistance_99_mensile',
      stripeYearlyUrl: 'https://buy.stripe.com/test_eVaeV0aW5gWvg8M7ss?client_reference_id=itassistance_1188_annuale',
      bankHolder: 'Blue Arroyo SRL',
      bankIban: 'IT60X0306902887100000007480',
      bankName: 'Intesa Sanpaolo · Filiale Imprese Firenze Centro (Via Bufalini 4, 50122 Firenze)',
      bankSwiftBic: 'BCITITMM'
    }
  };

  // Unisce eventuali override configurati dal pannello Super Admin (/admin.html)
  try {
    if (typeof localStorage !== 'undefined') {
      var rawOverrides = localStorage.getItem('ita_live_config_overrides_v1');
      if (rawOverrides) {
        var ov = JSON.parse(rawOverrides);
        if (ov && typeof ov === 'object') {
          if (ov.stripeMonthlyUrl) SITE_CONFIG.payments.stripeMonthlyUrl = ov.stripeMonthlyUrl;
          if (ov.stripeYearlyUrl) SITE_CONFIG.payments.stripeYearlyUrl = ov.stripeYearlyUrl;
          if (ov.bankIban) SITE_CONFIG.payments.bankIban = ov.bankIban;
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
  // MOTORE PREZZI VARIABILI GIORNALIERI DI ACQUISIZIONE IMMOBILI (99,00 € – 289,50 € / mese)
  // - Marketing: La quota di ingresso per nuovi appartamenti a Firenze oscilla ogni giorno
  //   tra 99,00 € e 289,50 € / mese in base alla disponibilità di slot di acquisizione nel sistema
  //   (capacità operativa cittadina, squadre check-in e Hub ZTL) per controllare la domanda.
  // - Fase 1 Startup (ATTIVA): Generazione random variabile tra 99,00 € e 289,50 € (step 0,50 €),
  //   con persistenza nella sessione corrente e possibilità di simulare nuove estrazioni giornaliere.
  // - Fase 2 Scala (IN ROADMAP): Architettura di controllo reale della domanda collegata al carico
  //   effettivo di nuovi immobili acquisiti su Supabase.
  // ═══════════════════════════════════════════════════════════════════════════
  var DYN_PRICE_STORAGE_KEY = 'itassistance_dynamic_price_v1';
  var MIN_DYN_EUR = 99.00;
  var MAX_DYN_EUR = 289.50;

  function formatDynamicEur(val) {
    var num = Number(val);
    if (isNaN(num)) num = MIN_DYN_EUR;
    return num.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  function randomPriceStep50() {
    // 99.00 to 289.50 in steps of 0.50 -> (289.50 - 99.00) * 2 = 381 steps (0..381)
    var totalSteps = Math.round((MAX_DYN_EUR - MIN_DYN_EUR) * 2);
    var step = Math.floor(Math.random() * (totalSteps + 1));
    var val = MIN_DYN_EUR + (step * 0.50);
    return Math.round(val * 100) / 100;
  }

  function buildDynamicStateFromPrice(priceVal) {
    var p = Math.max(MIN_DYN_EUR, Math.min(MAX_DYN_EUR, Number(priceVal) || MIN_DYN_EUR));
    p = Math.round(p * 2) / 2;
    var ratio = (p - MIN_DYN_EUR) / (MAX_DYN_EUR - MIN_DYN_EUR); // 0.0 -> 1.0
    var maxSlots = 6;
    // Più alto il prezzo estratto, meno slot di acquisizione risultano liberi a livello di marketing
    var slotsAvailable = Math.max(1, Math.min(maxSlots, Math.round(maxSlots - (ratio * (maxSlots - 1)))));
    var demandLevel = 'Disponibilità alta · Finestra di ingresso agevolata';
    if (p >= 215) {
      demandLevel = 'Domanda elevata su Firenze · Ultimi slot di acquisizione disponibili oggi';
    } else if (p >= 145) {
      demandLevel = 'Domanda moderata · Slot di acquisizione in progressivo esaurimento';
    }

    var yearlyEq = Math.round(p * 12 * 100) / 100;
    var schedule5Days = [
      { dayLabel: 'Ieri', priceEur: randomPriceStep50(), isToday: false },
      { dayLabel: 'Oggi (Bloccabile ora)', priceEur: p, isToday: true },
      { dayLabel: 'Domani (Stima)', priceEur: randomPriceStep50(), isToday: false },
      { dayLabel: 'Tra 2 giorni', priceEur: randomPriceStep50(), isToday: false },
      { dayLabel: 'Soglia Max Sistema', priceEur: MAX_DYN_EUR, isToday: false }
    ];

    return {
      minMonthlyEur: MIN_DYN_EUR,
      maxMonthlyEur: MAX_DYN_EUR,
      todayMonthlyEur: p,
      todayFormatted: formatDynamicEur(p),
      yearlyEquivalentEur: yearlyEq,
      yearlyFormatted: formatDynamicEur(yearlyEq),
      slotsAvailable: slotsAvailable,
      maxSlots: maxSlots,
      demandLevel: demandLevel,
      schedule5Days: schedule5Days,
      generatedDate: new Date().toISOString().slice(0, 10),
      phase: 'Fase 1 Startup: Quotazione Variabile Random (99,00 € – 289,50 €) · Fase 2 Controllo Domanda in roadmap'
    };
  }

  function getDynamicPricing() {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        var q = new URLSearchParams(window.location.search);
        var qp = parseFloat(q.get('locked_price'));
        if (!isNaN(qp) && qp >= MIN_DYN_EUR && qp <= MAX_DYN_EUR) {
          var lockedState = buildDynamicStateFromPrice(qp);
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(DYN_PRICE_STORAGE_KEY, JSON.stringify(lockedState));
          }
          return lockedState;
        }
      }
      if (typeof localStorage !== 'undefined') {
        var forcedRaw = localStorage.getItem('ita_admin_forced_dyn_price');
        if (forcedRaw) {
          var forcedVal = parseFloat(forcedRaw);
          if (!isNaN(forcedVal) && forcedVal >= MIN_DYN_EUR && forcedVal <= MAX_DYN_EUR) {
            return buildDynamicStateFromPrice(forcedVal);
          }
        }
      }
      if (typeof sessionStorage !== 'undefined') {
        var raw = sessionStorage.getItem(DYN_PRICE_STORAGE_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && typeof parsed.todayMonthlyEur === 'number') {
            return parsed;
          }
        }
      }
    } catch (e) {}
    var fresh = buildDynamicStateFromPrice(randomPriceStep50());
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(DYN_PRICE_STORAGE_KEY, JSON.stringify(fresh));
      }
    } catch (e) {}
    return fresh;
  }

  function setAdminForcedDailyPrice(priceOrNull) {
    try {
      if (typeof localStorage !== 'undefined') {
        if (priceOrNull === null || priceOrNull === undefined || priceOrNull === '') {
          localStorage.removeItem('ita_admin_forced_dyn_price');
        } else {
          var clamped = Math.max(MIN_DYN_EUR, Math.min(MAX_DYN_EUR, Number(priceOrNull) || MIN_DYN_EUR));
          localStorage.setItem('ita_admin_forced_dyn_price', String(Math.round(clamped * 2) / 2));
        }
      }
    } catch (e) {}
    return rerollDynamicPrice(priceOrNull ? Number(priceOrNull) : undefined);
  }

  function rerollDynamicPrice(forcedPrice) {
    var nextPrice = (typeof forcedPrice === 'number' && !isNaN(forcedPrice)) ? forcedPrice : randomPriceStep50();
    var nextState = buildDynamicStateFromPrice(nextPrice);
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(DYN_PRICE_STORAGE_KEY, JSON.stringify(nextState));
      }
    } catch (e) {}
    SITE_CONFIG.pricing.monthlyEur = nextState.todayMonthlyEur;
    SITE_CONFIG.pricing.yearlyEur = nextState.yearlyEquivalentEur;
    SITE_CONFIG.pricing.monthlyFormatted = nextState.todayFormatted;
    SITE_CONFIG.pricing.yearlyFormatted = nextState.yearlyFormatted;
    return nextState;
  }

  // Architettura Fase 2 (Predisposta per il futuro controllo reale della domanda)
  function computePhase2DemandPricePlaceholder(metrics) {
    // Nella Fase 2 questo metodo calcolerà il prezzo tra 99,00 € e 289,50 € in base a:
    // - metrics.dailyNewApartmentsCount
    // - metrics.ztlLaundryCapacityLoadPct
    // - metrics.activeFieldOperatorsCount
    return getDynamicPricing();
  }

  function buildCheckoutPaymentUrl(params) {
    var p = params || {};
    var cycle = p.billingCycle === 'annuale' ? 'annuale' : 'mensile';
    var dp = getDynamicPricing();
    var lockedMonthly = Number(p.lockedMonthlyEur) || dp.todayMonthlyEur || 99;
    var totalEur = cycle === 'annuale' ? Math.round(lockedMonthly * 12 * 100) / 100 : lockedMonthly;
    var baseUrl = cycle === 'annuale' ? SITE_CONFIG.payments.stripeYearlyUrl : SITE_CONFIG.payments.stripeMonthlyUrl;
    var refId = [
      'itassistance',
      cycle,
      String(totalEur).replace('.', '_'),
      (p.ownerCode || 'NEW').replace(/[^a-zA-Z0-9_-]/g, ''),
      p.addon10Active ? 'plus10' : 'base0'
    ].join('_');

    var cleanBase = baseUrl.split('?')[0];
    var qs = 'client_reference_id=' + encodeURIComponent(refId);
    if (p.ownerEmail) {
      qs += '&prefilled_email=' + encodeURIComponent(p.ownerEmail);
    }
    return {
      url: cleanBase + '?' + qs,
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
    var dp = getDynamicPricing();
    var lockedMonthly = Number(p.lockedMonthlyEur) || dp.todayMonthlyEur || 99;
    var totalEur = cycle === 'annuale' ? Math.round(lockedMonthly * 12 * 100) / 100 : lockedMonthly;
    var code = p.ownerCode || 'ITA-FIRENZE-01';
    var inv = p.invoiceId || 'FATT-2026';
    return {
      holder: SITE_CONFIG.payments.bankHolder,
      iban: SITE_CONFIG.payments.bankIban,
      bankName: SITE_CONFIG.payments.bankName || 'Intesa Sanpaolo · Firenze',
      swiftBic: SITE_CONFIG.payments.bankSwiftBic || 'BCITITMM',
      amountEur: totalEur,
      amountFormatted: formatDynamicEur(totalEur),
      causale: 'Attivazione itassistance ' + code + ' ' + inv + ' (' + formatDynamicEur(totalEur) + ' IVA incl.)'
    };
  }

  function computePortfolioVolumeCheckout(params) {
    var p = params || {};
    var units = Math.max(1, parseInt(p.units, 10) || 1);
    var cycle = p.billingCycle === 'annuale' ? 'annuale' : 'mensile';
    var dp = getDynamicPricing();
    var baseSingleMonthly = Number(p.lockedMonthlyEur) || dp.todayMonthlyEur || 99;
    var unitMonthlyEur = baseSingleMonthly;
    var tierLabel = 'Fascia 1–3 Immobili (Quotazione bloccata)';
    if (units >= 11) {
      unitMonthlyEur = 59;
      tierLabel = 'Fascia Volume Enterprise 11+ Immobili (59,00 €/mese cad.)';
    } else if (units >= 4) {
      unitMonthlyEur = 79;
      tierLabel = 'Fascia Volume Pro 4–10 Immobili (79,00 €/mese cad.)';
    }
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

  // Inizializza la quotazione variabile del giorno nella sessione
  var initialDynState = getDynamicPricing();
  SITE_CONFIG.dynamicPricing = initialDynState;
  SITE_CONFIG.pricing.monthlyEur = initialDynState.todayMonthlyEur;
  SITE_CONFIG.pricing.yearlyEur = initialDynState.yearlyEquivalentEur;
  SITE_CONFIG.getDynamicPricing = getDynamicPricing;
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
      'html {',
      '  scroll-padding-top: 88px;',
      '  overflow-x: clip;',
      '}',
      'body {',
      '  font-family: var(--font-sans);',
      '  background-color: var(--bg-light);',
      '  color: var(--ink-navy);',
      '  letter-spacing: -0.005em;',
      '  overflow-x: clip;',
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
    var skipPaths = ['/', '/index.html', '/checkout.html', '/login.html', '/app.html', '/admin.html', '/ospiti.html', '/benvenuto.html', '/prezzi.html', '/contratto.html', '/en/', '/en/index.html'];
    for (var s = 0; s < skipPaths.length; s++) {
      if (path === skipPaths[s]) return;
    }

    var footer = document.querySelector('footer');
    if (!footer || !footer.parentNode) return;

    var dp = getDynamicPricing();
    var section = document.createElement('section');
    section.id = 'ita-guide-dyn-conversion-banner';
    section.setAttribute('aria-label', 'Attivazione rapida quota bloccata di oggi');
    section.style.cssText = 'background:#F5F3FF;border-top:2px solid #7C3AED;border-bottom:2px solid #7C3AED;padding:48px 16px;';

    var wrap = document.createElement('div');
    wrap.style.cssText = 'max-width:960px;margin:0 auto;background:#1E1035;color:#FFFFFF;border:2px solid #C4B5FD;border-radius:15px;padding:32px 24px;box-shadow:0 16px 36px -12px rgba(30,16,53,0.35);';

    var badge = document.createElement('span');
    badge.style.cssText = 'display:inline-block;background:rgba(196,181,253,0.16);color:#C4B5FD;border:1px solid #C4B5FD;padding:4px 12px;border-radius:999px;font-family:"JetBrains Mono",monospace;font-size:0.75rem;font-weight:600;margin-bottom:12px;';
    badge.textContent = 'Quotazione Acquisizione Firenze di Oggi · ' + dp.slotsAvailable + ' slot disponibili su ' + dp.maxSlots;

    var h2 = document.createElement('h2');
    h2.style.cssText = 'font-family:"Inter",-apple-system,BlinkMacSystemFont,sans-serif;font-size:clamp(1.65rem,3.2vw,2.25rem);font-weight:700;letter-spacing:-0.025em;line-height:1.12;color:#FFFFFF;margin:0 0 12px 0;';
    h2.textContent = 'Metti in regola il tuo appartamento in 10 minuti al giorno: blocca ora la quota di ' + dp.todayFormatted + '/mese.';

    var p = document.createElement('p');
    p.style.cssText = 'font-size:1rem;color:#E9D5FF;line-height:1.6;max-width:65ch;margin:0 0 20px 0;';
    p.textContent = 'La quota di ingresso oscilla ogni giorno tra 99,00 € e 289,50 €/mese in base agli slot operativi disponibili su Firenze. Attivando adesso blocchi per sempre la tariffa di oggi (' + dp.todayFormatted + '/mese IVA inclusa, zero commissioni sulle prenotazioni) protetta dalla Garanzia 14 giorni Soddisfatto o Rimborsato.';

    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;align-items:center;';

    var cta = document.createElement('a');
    cta.href = '/checkout.html?locked_price=' + encodeURIComponent(dp.todayMonthlyEur);
    cta.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:10px 20px;background:linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%);color:#FFFFFF;font-weight:700;font-size:0.9375rem;border-radius:15px;text-decoration:none;border:2px solid #C4B5FD;white-space:nowrap;';
    cta.textContent = 'Blocca ' + dp.todayFormatted + '/mese';

    var secLink = document.createElement('a');
    secLink.href = '/calcola-risparmio.html';
    secLink.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:10px 20px;background:transparent;color:#FFFFFF;font-weight:700;font-size:0.9375rem;border-radius:15px;text-decoration:none;border:1.5px solid #C4B5FD;white-space:nowrap;';
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
    injectAuraVioletWhiteDesignSystem();
    var dsStyle = document.getElementById('ita-aura-violet-white-ds');
    if (dsStyle && document.head && document.head.lastElementChild !== dsStyle) {
      document.head.appendChild(dsStyle);
    }
    injectEditorialGuideConversionBanner();
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
  }

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
