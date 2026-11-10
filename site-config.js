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
      maxMonthlyEur: 299.00,
      yearlyEur: 1188,
      currency: '€',
      currencyCode: 'EUR',
      vatIncluded: true,
      vatLabel: 'IVA inclusa',
      monthlyFormatted: 'da 99,00 €',
      rangeFormatted: '99,00 € – 299,00 € / mese',
      yearlyFormatted: '1.188 €',
      pricePerMonthLabel: 'da 99,00 € a 299,00 € / mese',
      priceFullLabel: 'da 99,00 € a 299,00 € al mese (IVA inclusa)',
      commissionPct: 0,
      commissionLabel: 'Zero commissioni sulle prenotazioni (0%)',
      activationFeeEur: 0,
      activationLabel: 'Zero costi di attivazione',
      cancellationLabel: 'Disdetta libera in qualsiasi momento, senza penali',
      paymentModesLabel: 'Prezzo attuale in base ai posti disponibili nel team (99 € – 299 € / mese per unità); chi firma blocca il prezzo per la durata contrattuale (price lock).',
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
      companyName: 'Blue Arroyo S.r.l.',
      vatNumber: '07480210488',
      vatFull: 'IT07480210488',
      rea: 'FI-706161',
      sdi: 'M5UXCR1',
      pec: '[DA CONFERMARE]',
      shareCapital: '[DA CONFERMARE]',
      address: 'Via Matteo Palmieri 20R, Firenze',
      city: 'Firenze',
      copyrightYear: '2026',
      footerLine: 'Blue Arroyo S.r.l. – Sede legale: Via Matteo Palmieri 20R, Firenze · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: [DA CONFERMARE] · Capitale sociale: [DA CONFERMARE]'
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
      bankHolder: 'Blue Arroyo S.r.l.',
      bankIban: '[DA CONFERMARE]',
      bankName: '[DA CONFERMARE]',
      bankSwiftBic: '[DA CONFERMARE]'
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
  // D. PREZZO DINAMICO DELL'ABBONAMENTO (99 € – 299 € / mese per unità)
  // - Parametro di capacità: unità gestibili dal team attuale (configurabile dalla Direzione)
  //   e unità attualmente gestite.
  // - Saturazione = unità gestite / capacità.
  // - Prezzo per nuovi clienti = 99 € + (299 € − 99 €) × saturazione, arrotondato (es. a 9 €).
  // - Chi firma blocca il prezzo per la durata contrattuale (price lock).
  // - Saturazione al 100%: niente iscrizione diretta, lista d'attesa con notifica quando si libera capacità.
  // ═══════════════════════════════════════════════════════════════════════════
  var DYN_PRICE_STORAGE_KEY = 'itassistance_dynamic_price_v1';
  var DYN_CAPACITY_CFG_KEY = 'ita_dynamic_capacity_config_v1';
  var DYN_WAITLIST_KEY = 'ita_dynamic_waitlist_v1';
  var DYN_PRICE_HISTORY_KEY = 'ita_dynamic_price_history_v1';
  var MIN_DYN_EUR = 99.00;
  var MAX_DYN_EUR = 299.00;

  function formatDynamicEur(val) {
    var num = Number(val);
    if (isNaN(num)) num = MIN_DYN_EUR;
    return num.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  function getDefaultCapacityConfig() {
    return {
      minEur: 99,
      maxEur: 299,
      managedUnits: 12,
      capacityUnits: 24,
      roundToNine: true,
      priceLockContractMonths: 12,
      waitlistThresholdPct: 100,
      transparentMessage: 'Prezzo attuale in base ai posti disponibili nel team'
    };
  }

  function getCapacityPricingConfig() {
    var def = getDefaultCapacityConfig();
    try {
      if (typeof localStorage !== 'undefined') {
        var raw = localStorage.getItem(DYN_CAPACITY_CFG_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            return {
              minEur: typeof parsed.minEur === 'number' ? parsed.minEur : def.minEur,
              maxEur: typeof parsed.maxEur === 'number' ? parsed.maxEur : def.maxEur,
              managedUnits: typeof parsed.managedUnits === 'number' ? Math.max(0, parsed.managedUnits) : def.managedUnits,
              capacityUnits: typeof parsed.capacityUnits === 'number' ? Math.max(1, parsed.capacityUnits) : def.capacityUnits,
              roundToNine: parsed.roundToNine !== false,
              priceLockContractMonths: Number(parsed.priceLockContractMonths) || 12,
              waitlistThresholdPct: Number(parsed.waitlistThresholdPct) || 100,
              transparentMessage: parsed.transparentMessage || def.transparentMessage
            };
          }
        }
      }
    } catch (e) {}
    return def;
  }

  function computePriceFromSaturation(managedUnits, capacityUnits, roundToNine, minEur, maxEur) {
    var minP = typeof minEur === 'number' ? minEur : MIN_DYN_EUR;
    var maxP = typeof maxEur === 'number' ? maxEur : MAX_DYN_EUR;
    var cap = Math.max(1, Number(capacityUnits) || 24);
    var mng = Math.max(0, Math.min(cap, Number(managedUnits) || 0));
    var sat = mng / cap; // 0.0 -> 1.0
    var rawPrice = minP + (maxP - minP) * sat;
    var finalPrice = rawPrice;
    if (roundToNine !== false) {
      if (sat <= 0) {
        finalPrice = minP;
      } else if (sat >= 1) {
        finalPrice = maxP;
      } else {
        // Arrotonda al decimo terminante in 9 più vicino (es. 50% -> 99 + 100 = 199 €)
        finalPrice = Math.round((rawPrice - 9) / 10) * 10 + 9;
      }
    } else {
      finalPrice = Math.round(rawPrice * 2) / 2;
    }
    finalPrice = Math.max(minP, Math.min(maxP, finalPrice));
    return {
      managedUnits: mng,
      capacityUnits: cap,
      availableUnits: Math.max(0, cap - mng),
      saturationRatio: sat,
      saturationPct: Math.round(sat * 100),
      isWaitlistOnly: sat >= 1,
      rawPriceEur: Math.round(rawPrice * 100) / 100,
      priceEur: finalPrice
    };
  }

  function randomPriceStep50() {
    var totalSteps = Math.round((MAX_DYN_EUR - MIN_DYN_EUR) * 2);
    var step = Math.floor(Math.random() * (totalSteps + 1));
    var val = MIN_DYN_EUR + (step * 0.50);
    return Math.round(val * 100) / 100;
  }

  function getPriceHistoryReport() {
    try {
      if (typeof localStorage !== 'undefined') {
        var raw = localStorage.getItem(DYN_PRICE_HISTORY_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch (e) {}
    return [
      { id: 'ph_1', date: '08/11/2026 09:15', client: 'Residenza Palazzo Santo Spirito', saturationPct: 50, lockedPriceEur: 199, tier: 'Fascia Media (150–219 €)', priceLockMonths: 12 },
      { id: 'ph_2', date: '05/11/2026 14:30', client: 'Appartamento Via Maggio 18', saturationPct: 25, lockedPriceEur: 149, tier: 'Fascia Ingresso (99–149 €)', priceLockMonths: 12 },
      { id: 'ph_3', date: '01/11/2026 11:00', client: 'Suite Piazza Santa Croce', saturationPct: 0, lockedPriceEur: 99, tier: 'Fascia Ingresso (99–149 €)', priceLockMonths: 12 },
      { id: 'ph_4', date: '29/10/2026 17:45', client: 'Boutique B&B Oltrarno', saturationPct: 75, lockedPriceEur: 249, tier: 'Fascia Alta Domanda (220–299 €)', priceLockMonths: 12 }
    ];
  }

  function recordPriceLockHistory(entry) {
    var list = getPriceHistoryReport();
    var p = Number(entry && entry.lockedPriceEur) || 199;
    var tier = p <= 149 ? 'Fascia Ingresso (99–149 €)' : (p <= 219 ? 'Fascia Media (150–219 €)' : 'Fascia Alta Domanda (220–299 €)');
    var rec = {
      id: 'ph_' + Date.now(),
      date: new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' }),
      client: (entry && entry.client) || 'Nuovo Proprietario Firenze',
      saturationPct: entry && typeof entry.saturationPct === 'number' ? entry.saturationPct : 50,
      lockedPriceEur: p,
      tier: tier,
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
    return [
      { id: 'wl_1', createdAt: '08/11/2026 10:20', name: 'Ginevra Capponi', email: 'g.capponi@firenze.it', phone: '+39 340 9918273', units: 2, status: 'In attesa di slot libero (Notifica automatica attiva)' }
    ];
  }

  function submitWaitlistEntry(payload) {
    var list = getWaitlistEntries();
    var item = {
      id: 'wl_' + Date.now(),
      createdAt: new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' }),
      name: ((payload && payload.name) || 'Proprietario in Lista d\'Attesa').trim(),
      email: ((payload && payload.email) || '').trim(),
      phone: ((payload && payload.phone) || '').trim(),
      units: Math.max(1, parseInt(payload && payload.units, 10) || 1),
      status: 'In attesa di slot libero (Notifica automatica attiva)'
    };
    list.unshift(item);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(DYN_WAITLIST_KEY, JSON.stringify(list.slice(0, 50)));
      }
    } catch (e) {}
    return item;
  }

  function buildDynamicStateFromPrice(priceVal, customSatMeta) {
    var capCfg = getCapacityPricingConfig();
    var calc = customSatMeta || computePriceFromSaturation(capCfg.managedUnits, capCfg.capacityUnits, capCfg.roundToNine, capCfg.minEur, capCfg.maxEur);
    var p = (typeof priceVal === 'number' && !isNaN(priceVal))
      ? Math.max(MIN_DYN_EUR, Math.min(MAX_DYN_EUR, priceVal))
      : calc.priceEur;
    var ratio = (p - MIN_DYN_EUR) / (MAX_DYN_EUR - MIN_DYN_EUR); // 0.0 -> 1.0
    var maxSlots = calc.capacityUnits || 24;
    var slotsAvailable = customSatMeta
      ? calc.availableUnits
      : Math.max(0, Math.min(maxSlots, Math.round(maxSlots * (1 - ratio))));
    var saturationPct = customSatMeta ? calc.saturationPct : Math.round(ratio * 100);
    var isWaitlistOnly = saturationPct >= (capCfg.waitlistThresholdPct || 100) || slotsAvailable <= 0;

    var demandLevel = 'Prezzo attuale in base ai posti disponibili nel team (' + slotsAvailable + ' unità disponibili su ' + maxSlots + ')';
    if (isWaitlistOnly) {
      demandLevel = 'Saturazione 100% · Capacità team completa: iscrizione in Lista d\'Attesa con notifica automatica';
    } else if (saturationPct >= 70) {
      demandLevel = 'Prezzo attuale in base ai posti disponibili nel team · Ultimi ' + slotsAvailable + ' posti prima della lista d\'attesa';
    }

    var yearlyEq = Math.round(p * 12 * 100) / 100;
    var schedule5Days = [
      { dayLabel: 'Saturazione 0%', priceEur: 99, isToday: saturationPct === 0 },
      { dayLabel: 'Saturazione 25%', priceEur: 149, isToday: saturationPct === 25 },
      { dayLabel: 'Oggi (' + saturationPct + '% · Bloccabile)', priceEur: p, isToday: true },
      { dayLabel: 'Saturazione 75%', priceEur: 249, isToday: saturationPct === 75 },
      { dayLabel: 'Saturazione 100% (Lista Attesa)', priceEur: MAX_DYN_EUR, isToday: isWaitlistOnly }
    ];

    return {
      minMonthlyEur: MIN_DYN_EUR,
      maxMonthlyEur: MAX_DYN_EUR,
      todayMonthlyEur: p,
      todayFormatted: formatDynamicEur(p),
      yearlyEquivalentEur: yearlyEq,
      yearlyFormatted: formatDynamicEur(yearlyEq),
      managedUnits: calc.managedUnits,
      capacityUnits: maxSlots,
      slotsAvailable: slotsAvailable,
      maxSlots: maxSlots,
      saturationRatio: saturationPct / 100,
      saturationPct: saturationPct,
      isWaitlistOnly: isWaitlistOnly,
      transparentMessage: capCfg.transparentMessage,
      priceLockLabel: 'Price Lock Garantito: chi firma blocca ' + formatDynamicEur(p) + '/mese per tutta la durata contrattuale (' + capCfg.priceLockContractMonths + ' mesi)',
      demandLevel: demandLevel,
      schedule5Days: schedule5Days,
      generatedDate: new Date().toISOString().slice(0, 10),
      phase: 'Formula Saturazione Capacità Team: 99 € + (299 € − 99 €) × saturazione (' + saturationPct + '%)'
    };
  }

  function getDynamicPricing() {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        var q = new URLSearchParams(window.location.search);
        var qSat = parseFloat(q.get('saturation'));
        if (!isNaN(qSat) && qSat >= 0 && qSat <= 100) {
          var capCfgQ = getCapacityPricingConfig();
          var mUnits = Math.round((qSat / 100) * capCfgQ.capacityUnits);
          var satMetaQ = computePriceFromSaturation(mUnits, capCfgQ.capacityUnits, capCfgQ.roundToNine, capCfgQ.minEur, capCfgQ.maxEur);
          return buildDynamicStateFromPrice(satMetaQ.priceEur, satMetaQ);
        }
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
        if (localStorage.getItem(DYN_CAPACITY_CFG_KEY)) {
          var cfgNow = getCapacityPricingConfig();
          var calcNow = computePriceFromSaturation(cfgNow.managedUnits, cfgNow.capacityUnits, cfgNow.roundToNine, cfgNow.minEur, cfgNow.maxEur);
          return buildDynamicStateFromPrice(calcNow.priceEur, calcNow);
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
    var defCfg = getCapacityPricingConfig();
    var defCalc = computePriceFromSaturation(defCfg.managedUnits, defCfg.capacityUnits, defCfg.roundToNine, defCfg.minEur, defCfg.maxEur);
    var fresh = buildDynamicStateFromPrice(defCalc.priceEur, defCalc);
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(DYN_PRICE_STORAGE_KEY, JSON.stringify(fresh));
      }
    } catch (e) {}
    return fresh;
  }

  function setCapacityParameters(params) {
    var p = params || {};
    var cur = getCapacityPricingConfig();
    var nextCfg = {
      minEur: typeof p.minEur === 'number' ? p.minEur : cur.minEur,
      maxEur: typeof p.maxEur === 'number' ? p.maxEur : cur.maxEur,
      capacityUnits: Math.max(1, parseInt(p.capacityUnits != null ? p.capacityUnits : cur.capacityUnits, 10) || 24),
      managedUnits: Math.max(0, parseInt(p.managedUnits != null ? p.managedUnits : cur.managedUnits, 10) || 0),
      roundToNine: p.roundToNine !== undefined ? Boolean(p.roundToNine) : cur.roundToNine,
      priceLockContractMonths: Number(p.priceLockContractMonths) || cur.priceLockContractMonths || 12,
      waitlistThresholdPct: Number(p.waitlistThresholdPct) || 100,
      transparentMessage: p.transparentMessage || cur.transparentMessage
    };
    if (typeof p.saturationPct === 'number' && !isNaN(p.saturationPct)) {
      nextCfg.managedUnits = Math.round(Math.max(0, Math.min(100, p.saturationPct)) / 100 * nextCfg.capacityUnits);
    }
    nextCfg.managedUnits = Math.min(nextCfg.capacityUnits, nextCfg.managedUnits);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('ita_admin_forced_dyn_price');
        localStorage.setItem(DYN_CAPACITY_CFG_KEY, JSON.stringify(nextCfg));
      }
    } catch (e) {}
    var calc = computePriceFromSaturation(nextCfg.managedUnits, nextCfg.capacityUnits, nextCfg.roundToNine, nextCfg.minEur, nextCfg.maxEur);
    var nextState = buildDynamicStateFromPrice(calc.priceEur, calc);
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

  function computePhase2DemandPricePlaceholder(metrics) {
    if (metrics && typeof metrics.managedUnits === 'number' && typeof metrics.capacityUnits === 'number') {
      return setCapacityParameters(metrics);
    }
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
      '  overflow: hidden;',
      '  text-overflow: ellipsis;',
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
    p.textContent = 'Prezzo attuale in base ai posti disponibili nel team (tra 99,00 € e 299,00 €/mese per unità). Attivando adesso blocchi per tutta la durata contrattuale la tariffa di oggi (' + dp.todayFormatted + '/mese IVA inclusa, zero commissioni sulle prenotazioni) protetta dalla Garanzia 14 giorni Soddisfatto o Rimborsato.';

    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;align-items:center;';

    var cta = document.createElement('a');
    cta.href = '/checkout.html?locked_price=' + encodeURIComponent(dp.todayMonthlyEur);
    cta.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:10px 20px;background:linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%);color:#FFFFFF;font-weight:700;font-size:0.9375rem;border-radius:15px;text-decoration:none;border:2px solid #C4B5FD;max-width:100%;text-align:center;';
    cta.textContent = 'Blocca ' + dp.todayFormatted + '/mese';

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
      addLinkItem('/ospiti.html?lang=en', 'Guest Check-in Demo', false);
      addLinkItem('/login.html', 'Owner Sign In', false);
      addLinkItem('/', 'Versione Italiana', false);
      addLinkItem('/checkout.html', 'Start 14-Day Trial', true);
    } else {
      addLinkItem('/', 'Home itassistance', false);
      addLinkItem('/guide-affitti-brevi-firenze.html', 'Tutte le 20 Guide Firenze', false);
      addLinkItem('/calcola-risparmio.html', 'Calcola il tuo Risparmio', false);
      addLinkItem('/prezzi.html', 'Prezzi e Garanzia 14 Giorni', false);
      addLinkItem('/partner.html', 'Programma Partner Firenze', false);
      addLinkItem('/login.html', 'Accedi Area Proprietario', false);
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
    menuBrand.style.cssText = 'display:inline-flex;align-items:center;min-height:48px;font-weight:800;font-size:1.125rem;color:#FFFFFF;text-decoration:none;';
    menuBrand.textContent = 'itassistance';

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
