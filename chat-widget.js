(function () {
  'use strict';

  const WA_NUMBER = '393510380392';
  const STORAGE_KEY = 'pba_chat_seen_v1';
  const AUTO_OPEN_DELAY_MS = 1800;
  const NOTIFY_WEBHOOK = 'https://aherreras.app.n8n.cloud/webhook/palazzo-notify';

  /* ---------- Notify backend ---------- */
  function notify(payload) {
    try {
      fetch(NOTIFY_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => { /* silent */ });
    } catch (_) { /* silent */ }
  }

  /* ---------- Helpers ---------- */
  function el(tag, props, ...children) {
    const e = document.createElement(tag);
    if (props) {
      for (const k in props) {
        if (k === 'class') e.className = props[k];
        else if (k === 'html') e.innerHTML = props[k];
        else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), props[k]);
        else e.setAttribute(k, props[k]);
      }
    }
    children.flat().forEach(c => {
      if (c == null || c === false) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }

  /* ---------- Widget shell ---------- */
  function buildShell() {
    const root = el('div', { id: 'pba-chat', class: 'pba-chat', 'data-state': 'closed' });

    const toggle = el('button', {
      class: 'pba-chat__toggle',
      type: 'button',
      'aria-label': 'Apri chat con Palazzo Blue Arroyo',
      onclick: () => openChat()
    },
      el('span', { class: 'pba-chat__toggle-mark' }, 'P'),
      el('span', { class: 'pba-chat__toggle-text' }, 'Parla con noi')
    );

    const panel = el('div', {
      class: 'pba-chat__panel',
      role: 'dialog',
      'aria-modal': 'false',
      'aria-label': 'Chat Palazzo Blue Arroyo'
    },
      el('header', { class: 'pba-chat__header' },
        el('div', { class: 'pba-chat__title' },
          el('p', { class: 'pba-chat__brand' }, 'Palazzo'),
          el('p', { class: 'pba-chat__brand-sub' }, 'Blue Arroyo · Firenze')
        ),
        el('button', {
          class: 'pba-chat__close',
          type: 'button',
          'aria-label': 'Chiudi chat',
          onclick: () => closeChat()
        }, '×')
      ),
      el('div', { class: 'pba-chat__body', id: 'pba-chat-body' })
    );

    root.appendChild(toggle);
    root.appendChild(panel);
    document.body.appendChild(root);

    return root;
  }

  /* ---------- State + open/close ---------- */
  function openChat() {
    const root = document.getElementById('pba-chat');
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
    const root = document.getElementById('pba-chat');
    if (!root) return;
    root.setAttribute('data-state', 'closed');
    document.body.classList.remove('pba-chat-open');
  }

  /* ---------- Rendering helpers ---------- */
  function bot(text) {
    return el('div', { class: 'pba-msg pba-msg--bot' }, el('div', { class: 'pba-msg__bubble' }, text));
  }
  function botGroup(...texts) {
    const wrap = el('div', { class: 'pba-msg pba-msg--bot' });
    texts.forEach(t => wrap.appendChild(el('div', { class: 'pba-msg__bubble' }, t)));
    return wrap;
  }
  function user(text) {
    return el('div', { class: 'pba-msg pba-msg--user' }, el('div', { class: 'pba-msg__bubble' }, text));
  }
  function options(list) {
    const c = el('div', { class: 'pba-options' });
    list.forEach(o => {
      c.appendChild(el('button', {
        class: 'pba-option',
        type: 'button',
        onclick: o.onclick
      }, o.label));
    });
    return c;
  }
  function backBar(onclick) {
    return el('button', {
      class: 'pba-back',
      type: 'button',
      onclick: onclick
    }, '← Cambia argomento');
  }
  function append(...nodes) {
    const body = document.getElementById('pba-chat-body');
    nodes.flat().forEach(n => body.appendChild(n));
    body.scrollTop = body.scrollHeight;
  }
  function reset() {
    const body = document.getElementById('pba-chat-body');
    if (body) body.innerHTML = '';
  }

  /* ---------- Flows ---------- */
  function renderWelcome() {
    reset();
    append(
      bot('Ciao. Sono Palazzo Blue Arroyo, il marchio di qualità delle case vacanze a Firenze.'),
      bot('Come ti aiuto?'),
      options([
        { label: 'Prenotare una casa', onclick: flowBooking },
        { label: 'Entrare nella rete (sono PM)', onclick: flowNetwork },
        { label: 'Calcolare un preventivo', onclick: flowQuote },
        { label: 'Parlare con qualcuno', onclick: flowContact }
      ])
    );
  }

  /* --- A: Booking --- */
  function flowBooking() {
    append(user('Voglio prenotare'));
    append(
      bot('Le case sotto il marchio sono prenotabili direttamente sul nostro canale unificato, senza commissioni di piattaforma.'),
      bot('Vuoi vedere il catalogo o parlare con noi prima?'),
      options([
        { label: 'Apri il catalogo →', onclick: () => { window.open('https://smartsbookings.com', '_blank', 'noopener'); } },
        { label: 'Vai alla pagina Prenota', onclick: () => { window.location.href = '/prenota'; } },
        { label: 'Scrivimi su WhatsApp', onclick: () => openWA('Ciao Palazzo, vorrei prenotare una casa. Avete disponibilità per…') },
        { label: '← Cambia argomento', onclick: renderWelcome }
      ])
    );
  }

  /* --- B: Network / PM qualification --- */
  function flowNetwork() {
    append(user('Sono un PM'));
    append(
      bot('Perfetto. Per capire come posso aiutarti, una domanda veloce.'),
      bot('Quante proprietà gestisci a Firenze?'),
      options([
        { label: '1-4 proprietà', onclick: () => networkAnswer('1-4') },
        { label: '5-15 proprietà', onclick: () => networkAnswer('5-15') },
        { label: '16-50 proprietà', onclick: () => networkAnswer('16-50') },
        { label: 'Oltre 50', onclick: () => networkAnswer('50+') }
      ])
    );
  }
  function networkAnswer(range) {
    append(user(range + ' proprietà'));
    if (range === '1-4') {
      append(
        bot('La rete parte da 5 proprietà. Ma se vuoi, lasciami la tua email: ti scriviamo quando avrai raggiunto la soglia, con le condizioni dedicate per chi entra presto.'),
        emailForm('Email (per quando sarai pronto)', (email) => {
          notify({
            source: 'chat_widget · email-followup',
            nome: '—',
            telefono: '—',
            email: email,
            contesto: 'PM ' + range + ' proprietà a Firenze · vuole essere ricontattato quando supera la soglia 5+',
            messaggio: ''
          });
          openWA('Ciao Palazzo, sono un PM con ' + range + ' proprietà a Firenze. Email: ' + email + '. Vorrei restare in contatto per la rete.');
        }),
        backBar(renderWelcome)
      );
    } else {
      append(
        bot('Sei nel range giusto per entrare nella rete. Come preferisci essere ricontattato?'),
        options([
          { label: 'WhatsApp diretto', onclick: () => openWA('Ciao Palazzo, sono un PM con ' + range + ' proprietà a Firenze. Vorrei valutare l\'ingresso nella rete e capire le condizioni.') },
          { label: 'Email', onclick: () => { window.location.href = 'mailto:hello@bluearroyo.it?subject=' + encodeURIComponent('PM ' + range + ' proprietà - ingresso rete') + '&body=' + encodeURIComponent('Ciao Palazzo, sono un PM con ' + range + ' proprietà a Firenze. Vorrei valutare l\'ingresso nella rete.\n\nNome:\nTelefono:\nPortfolio:\n'); } },
          { label: 'Chiamatemi voi', onclick: () => phoneForm(range) },
          { label: '← Cambia argomento', onclick: renderWelcome }
        ])
      );
    }
  }
  function phoneForm(rangeContext) {
    append(user('Chiamatemi voi'));
    append(
      bot('Lasciami nome e numero. Ti chiamiamo entro la giornata lavorativa.'),
      nameAndPhoneForm((nome, tel) => {
        notify({
          source: 'chat_widget · richiesta richiamo',
          nome: nome,
          telefono: tel,
          email: '—',
          contesto: 'PM ' + (rangeContext || '5+') + ' proprietà a Firenze · richiede ricontatto telefonico',
          messaggio: 'Vuole valutare ingresso nella rete Palazzo Blue Arroyo'
        });
        openWA('Richiesta ricontatto dalla chat:\nNome: ' + nome + '\nTelefono: ' + tel + '\nMi piacerebbe valutare l\'ingresso nella rete Palazzo Blue Arroyo.');
      })
    );
  }

  /* --- C: Quote --- */
  function flowQuote() {
    append(user('Calcolare preventivo'));
    append(
      bot('Per un preventivo dettagliato ti porto al calcolatore completo: bastano cinque domande, ricevi totale + PDF.'),
      options([
        { label: 'Apri il calcolatore →', onclick: () => { window.location.href = '/preventivo'; } },
        { label: 'Preferisco WhatsApp', onclick: () => openWA('Ciao Palazzo, vorrei un preventivo per il turnover di una mia proprietà a Firenze. Posso darti i dettagli qui?') },
        { label: '← Cambia argomento', onclick: renderWelcome }
      ])
    );
  }

  /* --- D: Contact --- */
  function flowContact() {
    append(user('Parlare con voi'));
    append(
      bot('Tre canali, scegli quello che ti viene meglio.'),
      options([
        { label: 'WhatsApp (più rapido)', onclick: () => openWA('Ciao Palazzo, vorrei parlare con voi.') },
        { label: 'Telefono 055 9865792', onclick: () => { window.location.href = 'tel:+390559865792'; } },
        { label: 'Email hello@bluearroyo.it', onclick: () => { window.location.href = 'mailto:hello@bluearroyo.it'; } },
        { label: '← Cambia argomento', onclick: renderWelcome }
      ])
    );
  }

  /* ---------- Forms ---------- */
  function emailForm(label, onsubmit) {
    const form = el('form', { class: 'pba-form', onsubmit: (e) => {
      e.preventDefault();
      const v = form.querySelector('input').value.trim();
      if (!v) return;
      append(user(v));
      append(bot('Grazie. Ti scrivo io quando è il momento. Buon lavoro a Firenze.'));
      onsubmit(v);
    } },
      el('label', { class: 'pba-form__label' }, label),
      el('input', { type: 'email', required: 'required', autocomplete: 'email', placeholder: 'tua@email.it' }),
      el('button', { class: 'pba-form__submit', type: 'submit' }, 'Invia')
    );
    return form;
  }
  function nameAndPhoneForm(onsubmit) {
    const form = el('form', { class: 'pba-form', onsubmit: (e) => {
      e.preventDefault();
      const inputs = form.querySelectorAll('input');
      const nome = inputs[0].value.trim();
      const tel = inputs[1].value.trim();
      if (!nome || !tel) return;
      append(user(nome + ' · ' + tel));
      append(bot('Ricevuto. Ti chiamiamo a breve.'));
      onsubmit(nome, tel);
    } },
      el('label', { class: 'pba-form__label' }, 'Nome'),
      el('input', { type: 'text', required: 'required', autocomplete: 'name', placeholder: 'Mario Rossi' }),
      el('label', { class: 'pba-form__label' }, 'Telefono'),
      el('input', { type: 'tel', required: 'required', autocomplete: 'tel', placeholder: '+39 333…' }),
      el('button', { class: 'pba-form__submit', type: 'submit' }, 'Conferma')
    );
    return form;
  }

  /* ---------- WhatsApp ---------- */
  function openWA(message) {
    const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank', 'noopener');
  }

  /* ---------- Boot ---------- */
  function boot() {
    if (document.getElementById('pba-chat')) return;
    buildShell();
    const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';
    let seen = false;
    try { seen = localStorage.getItem(STORAGE_KEY) === '1'; } catch (_) {}
    if (isHome && !seen) {
      setTimeout(() => openChat(), AUTO_OPEN_DELAY_MS);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
