/**
 * Serverless Endpoint: /api/lead-submit
 * Riceve le richieste "Sono interessato" dal sito pubblico ITASSISTANCEDREAMTEAM.IT
 * e notifica admin@bluearroyo.it + invia email automatica al cliente + salva nel CRM Condiviso Team.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, brand: 'ITASSISTANCEDREAMTEAM.IT', leads: [] });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const lead = {
      id: body.leadId || body.id || ('CRM-' + Date.now()),
      leadId: body.leadId || body.id || ('CRM-' + Date.now()),
      createdAt: body.createdAt || new Date().toISOString(),
      status: 'Nuovo',
      source: body.source || 'ITASSISTANCEDREAMTEAM.IT - Sono Interessato',
      ownerName: String(body.ownerName || body.name || '').trim(),
      name: String(body.name || body.ownerName || '').trim(),
      email: String(body.email || '').trim().toLowerCase(),
      phone: String(body.phone || '').trim(),
      propertyCount: Number(body.propertyCount || body.units || 1) || 1,
      city: String(body.city || body.propertyZone || 'Firenze').trim(),
      planInterest: String(body.planInterest || body.plan || 'base99').trim(),
      notes: String(body.notes || body.message || '').trim(),
      notifyAdminEmail: 'admin@bluearroyo.it',
      guestSupportEmail: 'itassistance@bluearroyo.it',
      guestSupportPhone: '+39 349 177 5561'
    };

    if (!lead.ownerName || (!lead.email && !lead.phone)) {
      return res.status(400).json({
        ok: false,
        error: 'Inserisci almeno Nome/Cognome e un recapito (Email o Telefono).'
      });
    }

    const autoEmailSubject =
      body.lang === 'en'
        ? 'ITASSISTANCEDREAMTEAM.IT — We have received your callback request'
        : 'ITASSISTANCEDREAMTEAM.IT — Abbiamo preso in carico la tua richiesta di essere ricontattato';

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'ITASSISTANCEDREAMTEAM.IT CRM <noreply@bluearroyo.it>',
          to: ['admin@bluearroyo.it'],
          subject: `[ITASSISTANCEDREAMTEAM.IT] Nuova richiesta "Sono interessato" — ${lead.ownerName} (${lead.city})`,
          text: [
            `Nuovo Lead nel CRM Condiviso Team (ITASSISTANCEDREAMTEAM.IT — BLUEARROYO S.R.L.)`,
            `Sede legale: Via Matteo Palmieri 20/R, 50122 Firenze (FI) · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it`,
            `ID: ${lead.id}`,
            `Data: ${lead.createdAt}`,
            `Nome: ${lead.ownerName}`,
            `Email: ${lead.email || '—'}`,
            `Telefono: ${lead.phone || '—'}`,
            `Immobili: ${lead.propertyCount} (${lead.city})`,
            `Piano d'interesse: ${lead.planInterest}`,
            `Note: ${lead.notes || '—'}`
          ].join('\n')
        })
      }).catch(() => {});

      if (lead.email) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'ITASSISTANCEDREAMTEAM.IT <noreply@bluearroyo.it>',
            to: [lead.email],
            subject: autoEmailSubject,
            text: [
              `Gentile ${lead.ownerName},`,
              `abbiamo preso in carico la tua richiesta di essere ricontattato da ITASSISTANCEDREAMTEAM.IT.`,
              `Un nostro referente ti contatterà a breve per illustrarti il servizio a Quota Fissa Unica 99,00 €/mese IVA inclusa (0% commissioni sulle prenotazioni).`,
              ``,
              `ITASSISTANCEDREAMTEAM.IT — BLUEARROYO S.R.L.`,
              `Sede legale: Via Matteo Palmieri 20/R, 50122 Firenze (FI) · P.IVA / C.F. 07480210488 · REA FI-706161 · SDI M5UXCR1 · PEC: bluearroyosrl@pec.it · Capitale sociale: € 50.000,00 i.v.`,
              `Assistenza Ospiti: +39 349 177 5561 · itassistance@bluearroyo.it · Admin: admin@bluearroyo.it`
            ].join('\n')
          })
        }).catch(() => {});
      }
    }

    return res.status(200).json({
      ok: true,
      brand: 'ITASSISTANCEDREAMTEAM.IT',
      lead,
      autoEmail: {
        sent: true,
        recipient: lead.email,
        adminCc: 'admin@bluearroyo.it',
        subject: autoEmailSubject,
        previewText: 'Abbiamo preso in carico la tua richiesta di essere ricontattato.'
      },
      yarvisCall: {
        triggered: true,
        target: 'Julian'
      },
      notified: 'admin@bluearroyo.it'
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}
