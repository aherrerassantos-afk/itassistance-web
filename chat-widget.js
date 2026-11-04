(function () {
  'use strict';

  var cfg = (typeof window !== 'undefined' && window.SITE_CONFIG) ? window.SITE_CONFIG : null;
  var WA_NUMBER = (cfg && cfg.support && cfg.support.whatsappNumber) ? cfg.support.whatsappNumber : '393510380392';
  var PHONE_TEL = (cfg && cfg.support && cfg.support.phoneTel) ? cfg.support.phoneTel : '+393510380392';
  var PHONE_DISPLAY = (cfg && cfg.support && cfg.support.phoneDisplay) ? cfg.support.phoneDisplay : '+39 351 038 0392';
  var EMAIL_ADDR = (cfg && cfg.support && cfg.support.email) ? cfg.support.email : 'info@itadreamteam.com';
  var STORAGE_KEY = 'ita_chat_seen_v2';

  function el(tag, props) {
    var e = document.createElement(tag);
    var children = Array.prototype.slice.call(arguments, 2);
    if (props) {
      for (var k in props) {
        if (k === 'class') e.className = props[k];
        else if (k === 'html') e.innerHTML = props[k];
        else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2).toLowerCase(), props[k]);
        else e.setAttribute(k, props[k]);
      }
    }
    children.forEach(function (c) {
      if (Array.isArray(c)) {
        c.forEach(function (item) {
          if (item != null && item !== false) {
            e.appendChild(typeof item === 'string' ? document.createTextNode(item) : item);
          }
        });
      } else if (c != null && c !== false) {
        e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      }
    });
    return e;
  }

  function buildShell() {
    var root = el('div', { id: 'pba-chat', class: 'pba-chat', 'data-state': 'closed' });

    var toggle = el('button', {
      class: 'pba-chat__toggle',
      type: 'button',
      'aria-label': 'Apri supporto itassistance',
      onclick: function () { openChat(); }
    },
      el('span', { class: 'pba-chat__toggle-mark' }, 'it'),
      el('span', { class: 'pba-chat__toggle-text' }, 'Chiedi a itassistance')
    );

    var panel = el('div', {
      class: 'pba-chat__panel',
      role: 'dialog',
      'aria-modal': 'false',
      'aria-label': 'Supporto itassistance'
    },
      el('header', { class: 'pba-chat__header' },
        el('div', { class: 'pba-chat__title' },
          el('p', { class: 'pba-chat__brand' }, 'itassistance'),
          el('p', { class: 'pba-chat__brand-sub' }, 'Supporto proprietari · Firenze (09:00–23:00)')
        ),
        el('button', {
          class: 'pba-chat__close',
          type: 'button',
          'aria-label': 'Chiudi chat',
          onclick: function () { closeChat(); }
        }, '×')
      ),
      el('div', { class: 'pba-chat__body', id: 'pba-chat-body' })
    );

    root.appendChild(toggle);
    root.appendChild(panel);
    document.body.appendChild(root);

    return root;
  }

  function openChat() {
    var root = document.getElementById('pba-chat');
    if (!root) return;
    root.setAttribute('data-state', 'open');
    document.body.classList.add('pba-chat-open');
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (_) {}
    if (!root.dataset.bootstrapped) {
      renderWelcome();
      root.dataset.bootstrapped = '1';
    }
  }

  function closeChat() {
    var root = document.getElementById('pba-chat');
    if (!root) return;
    root.setAttribute('data-state', 'closed');
    document.body.classList.remove('pba-chat-open');
  }

  function bot(text) {
    return el('div', { class: 'pba-msg pba-msg--bot' }, el('div', { class: 'pba-msg__bubble' }, text));
  }

  function user(text) {
    return el('div', { class: 'pba-msg pba-msg--user' }, el('div', { class: 'pba-msg__bubble' }, text));
  }

  function options(list) {
    var c = el('div', { class: 'pba-options' });
    list.forEach(function (o) {
      c.appendChild(el('button', {
        class: 'pba-option',
        type: 'button',
        onclick: o.onclick
      }, o.label));
    });
    return c;
  }

  function append() {
    var body = document.getElementById('pba-chat-body');
    if (!body) return;
    Array.prototype.slice.call(arguments).forEach(function (n) {
      if (n) body.appendChild(n);
    });
    body.scrollTop = body.scrollHeight;
  }

  function reset() {
    var body = document.getElementById('pba-chat-body');
    if (body) body.innerHTML = '';
  }

  function openWA(message) {
    if (typeof window.trackSiteEvent === 'function') {
      window.trackSiteEvent('click_whatsapp', { source: 'chat_widget' });
    }
    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank', 'noopener');
  }

  function renderWelcome() {
    reset();
    var liveCfg = (typeof window !== 'undefined' && window.SITE_CONFIG) ? window.SITE_CONFIG : cfg;
    var dp = (liveCfg && typeof liveCfg.getDynamicPricing === 'function')
      ? liveCfg.getDynamicPricing()
      : { todayMonthlyEur: 99, todayFormatted: '99,00 €', slotsAvailable: 4 };
    var checkoutUrl = '/checkout.html?locked_price=' + encodeURIComponent(dp.todayMonthlyEur);
    append(
      bot('Ciao! Con itassistance gestisci il tuo appartamento in affitto breve in 10 minuti al giorno. La quotazione di acquisizione di oggi su Firenze è ' + dp.todayFormatted + '/mese (IVA inclusa, range 99,00 € – 289,50 €) con zero commissioni.'),
      bot('Cosa vorresti approfondire?'),
      options([
        {
          label: 'Blocca ' + dp.todayFormatted + '/mese (Prova 14 gg Soddisfatto o Rimborsato)',
          onclick: function () {
            if (typeof window.trackSiteEvent === 'function') {
              window.trackSiteEvent('click_prova_app', { source: 'chat_widget', locked_price: dp.todayMonthlyEur });
            }
            window.location.href = checkoutUrl;
          }
        },
        {
          label: 'Come funzionano i 10 minuti al giorno',
          onclick: function () {
            append(user('Come funzionano i 10 minuti al giorno'));
            append(
              bot('Ogni mattina alle 08:00 ricevi il report del giorno: vedi chi arriva, segui la guida per Alloggiati Web, approvi i fornitori e controlli le scadenze della tassa di soggiorno.'),
              options([
                { label: 'Blocca ' + dp.todayFormatted + '/mese (IVA incl.) →', onclick: function () { window.location.href = checkoutUrl; } },
                { label: 'Chiedi su WhatsApp', onclick: function () { openWA('Ciao itassistance, vorrei capire come funziona il report giornaliero e bloccare la quota di oggi (' + dp.todayFormatted + '/mese) per il mio appartamento.'); } },
                { label: '← Indietro', onclick: renderWelcome }
              ])
            );
          }
        },
        {
          label: 'Parlare con il team a Firenze',
          onclick: function () {
            append(user('Parlare con il team a Firenze'));
            append(
              bot('Siamo operativi tutti i giorni dalle 09:00 alle 23:00.'),
              options([
                { label: 'WhatsApp ' + PHONE_DISPLAY, onclick: function () { openWA('Ciao itassistance, vorrei informazioni per il mio appartamento in affitto breve.'); } },
                { label: 'Chiama ' + PHONE_DISPLAY, onclick: function () { window.location.href = 'tel:' + PHONE_TEL; } },
                { label: 'Email ' + EMAIL_ADDR, onclick: function () { window.location.href = 'mailto:' + EMAIL_ADDR; } },
                { label: '← Indietro', onclick: renderWelcome }
              ])
            );
          }
        }
      ])
    );
  }

  function boot() {
    if (document.getElementById('pba-chat')) return;
    buildShell();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  }
})();
