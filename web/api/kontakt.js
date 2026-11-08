// Vercel serverless funkce: příjem kontaktního formuláře a odeslání e-mailu přes Resend.
// Node 20+, ESM. Přijímá JSON i application/x-www-form-urlencoded.
// Proměnné prostředí: RESEND_API_KEY (povinná), CONTACT_TO (povinná), CONTACT_FROM (volitelná).

const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const rateMap = new Map(); // ip -> [timestamps]

const GENERIC_ERROR = 'Zprávu se nepodařilo odeslat. Zavolejte nám prosím na +420 728 920 290.';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const list = (rateMap.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (list.length >= RATE_LIMIT.max) {
    rateMap.set(ip, list);
    return true;
  }
  list.push(now);
  rateMap.set(ip, list);
  if (rateMap.size > 5000) {
    // jednoduchý úklid, aby mapa nerostla donekonečna
    for (const [key, times] of rateMap) {
      if (!times.some((t) => now - t < RATE_LIMIT.windowMs)) rateMap.delete(key);
    }
  }
  return false;
}

async function readRawBody(req) {
  if (typeof req.body === 'string') return req.body;
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body; // už naparsované (Vercel)
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 64 * 1024) {
        reject(new Error('body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function parseBody(req) {
  const type = String(req.headers['content-type'] || '').toLowerCase();
  const raw = await readRawBody(req);
  if (raw && typeof raw === 'object') return { fields: raw, isForm: !type.includes('json') };
  if (type.includes('application/json')) {
    try {
      return { fields: JSON.parse(raw || '{}'), isForm: false };
    } catch {
      return { fields: null, isForm: false };
    }
  }
  // application/x-www-form-urlencoded (odeslání bez JavaScriptu)
  const params = new URLSearchParams(raw || '');
  const fields = {};
  for (const [k, v] of params) fields[k] = v;
  return { fields, isForm: true };
}

function str(v, max) {
  if (v === undefined || v === null) return '';
  return String(v).replace(/\r\n?/g, '\n').trim().slice(0, max);
}

function validate(fields) {
  const data = {
    jmeno: str(fields.jmeno, 200),
    email: str(fields.email, 200),
    telefon: str(fields.telefon, 60),
    termin: str(fields.termin, 200),
    zprava: str(fields.zprava, 5000),
    souhlas: str(fields.souhlas, 10),
    website: str(fields.website, 200),
  };
  const errors = [];
  if (data.jmeno.length < 2 || data.jmeno.length > 100) errors.push('Zadejte prosím jméno (2–100 znaků).');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email) || data.email.length > 150) errors.push('Zadejte prosím platný e-mail.');
  if (data.zprava.length < 5 || data.zprava.length > 3000) errors.push('Zadejte prosím zprávu (5–3000 znaků).');
  if (!data.souhlas) errors.push('Potvrďte prosím souhlas se zpracováním osobních údajů.');
  return { data, errors };
}

function respond(res, status, payload, isForm, redirectOk) {
  if (isForm) {
    // odeslání bez JavaScriptu: zpět na stránku kontaktu s informací
    const target = redirectOk ? '/kontakt/?odeslano=1#odeslano' : '/kontakt/?chyba=1#chyba';
    res.statusCode = 303;
    res.setHeader('Location', target);
    res.setHeader('Cache-Control', 'no-store');
    res.end();
    return;
  }
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: false, error: 'Metoda není povolena.' }));
    return;
  }

  let parsed;
  try {
    parsed = await parseBody(req);
  } catch {
    respond(res, 400, { ok: false, error: 'Neplatný požadavek.' }, false, false);
    return;
  }
  const { fields, isForm } = parsed;
  if (!fields || typeof fields !== 'object') {
    respond(res, 400, { ok: false, error: 'Neplatný požadavek.' }, isForm, false);
    return;
  }

  const { data, errors } = validate(fields);

  // honeypot: roboti vyplní skryté pole; odpovíme „ok“, ale nic neodešleme
  if (data.website) {
    respond(res, 200, { ok: true }, isForm, true);
    return;
  }

  if (errors.length) {
    respond(res, 400, { ok: false, error: errors.join(' ') }, isForm, false);
    return;
  }

  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    respond(res, 429, { ok: false, error: 'Příliš mnoho požadavků. Zkuste to prosím později.' }, isForm, false);
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM || 'AutoPraizler web <web@josefpavlovic.cz>';
  if (!apiKey || !to) {
    console.error('kontakt: chybí konfigurace (RESEND_API_KEY nebo CONTACT_TO)');
    respond(res, 500, { ok: false, error: GENERIC_ERROR }, isForm, false);
    return;
  }

  const lines = [
    `Jméno: ${data.jmeno}`,
    `E-mail: ${data.email}`,
    `Telefon: ${data.telefon || '-'}`,
    `Požadavek termínu: ${data.termin || '-'}`,
    '',
    'Zpráva:',
    data.zprava,
    '',
    `Souhlas se zpracováním osobních údajů: ano`,
    `Odesláno z webu autopraizler.cz, IP ${ip}`,
  ];
  const text = lines.join('\n');
  const html =
    `<h2 style="font-family:Arial,sans-serif">Poptávka z webu autopraizler.cz</h2>` +
    `<table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">` +
    `<tr><td style="padding:4px 12px 4px 0"><b>Jméno</b></td><td>${escapeHtml(data.jmeno)}</td></tr>` +
    `<tr><td style="padding:4px 12px 4px 0"><b>E-mail</b></td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>` +
    `<tr><td style="padding:4px 12px 4px 0"><b>Telefon</b></td><td>${escapeHtml(data.telefon || '-')}</td></tr>` +
    `<tr><td style="padding:4px 12px 4px 0"><b>Požadavek termínu</b></td><td>${escapeHtml(data.termin || '-')}</td></tr>` +
    `</table>` +
    `<p style="font-family:Arial,sans-serif;font-size:15px;white-space:pre-wrap"><b>Zpráva:</b><br>${escapeHtml(data.zprava).replace(/\n/g, '<br>')}</p>` +
    `<p style="font-family:Arial,sans-serif;font-size:12px;color:#666">Souhlas se zpracováním osobních údajů: ano. Odesláno z webu autopraizler.cz, IP ${escapeHtml(ip)}.</p>`;

  const payload = {
    from,
    to: [to],
    reply_to: data.email,
    subject: `Poptávka z webu autopraizler.cz: ${data.jmeno}`,
    text,
    html,
  };

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      let detail = '';
      try { detail = await r.text(); } catch { /* ignorujeme */ }
      console.error('kontakt: Resend odpověděl ' + r.status, detail.slice(0, 500));
      respond(res, 502, { ok: false, error: GENERIC_ERROR }, isForm, false);
      return;
    }
  } catch (err) {
    console.error('kontakt: odeslání selhalo', err && err.message);
    respond(res, 502, { ok: false, error: GENERIC_ERROR }, isForm, false);
    return;
  }

  respond(res, 200, { ok: true }, isForm, true);
}
