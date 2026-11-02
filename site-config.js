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
      yearlyEur: 1188,
      currency: '€',
      currencyCode: 'EUR',
      vatIncluded: true,
      vatLabel: 'IVA inclusa',
      monthlyFormatted: '99 €',
      yearlyFormatted: '1.188 €',
      pricePerMonthLabel: '99 € / mese',
      priceFullLabel: '99 € al mese (IVA inclusa)',
      commissionPct: 0,
      commissionLabel: 'Zero commissioni sulle prenotazioni (0%)',
      activationFeeEur: 0,
      activationLabel: 'Zero costi di attivazione',
      cancellationLabel: 'Disdetta libera in qualsiasi momento, senza penali',
      paymentModesLabel: 'Paghi mese per mese (99 €/mese) oppure tutto l’anno anticipato (1.188 €/anno), non cambia nulla.',
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
      bankIban: 'IT00X0000000000000000000000 (Richiedi coordinate aggiornate su WhatsApp +39 351 038 0392)'
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
