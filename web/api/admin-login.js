// Vercel serverless funkce: pošle přihlašovací odkaz (magic link) do administrace aktualit.
// Node 20+, ESM, jen vestavěné moduly + globální fetch.
//
//   POST /api/admin-login  { email }
//
// Odpověď je vždy 200 se stejnou českou hláškou, ať je e-mail povolený, nebo ne
// (neprozrazujeme, kdo má přístup). E-mail se posílá přes Resend jen povoleným adresám.
//
// Proměnné prostředí: ADMIN_SECRET, ADMIN_EMAILS, RESEND_API_KEY (povinné),
// CONTACT_FROM (volitelná, výchozí "AutoPraizler web <web@josefpavlovic.cz>"),
// SITE_URL (volitelná, výchozí https://autopraizler.cz; na preview nasazení Vercelu se použije VERCEL_URL).

import { adminEmails, clientIp, isValidEmail, makeLoginToken, MSG, normalizeEmail, readJson, sendJson } from './admin-session.js';

const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 };
const rateMap = new Map(); // ip -> [timestamps]

const GENERIC_OK = 'Pokud je tato adresa povolená, poslali jsme na ni přihlašovací odkaz. Zkontrolujte prosím poštu (i složku Spam). Odkaz platí 15 minut.';

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
    for (const [key, times] of rateMap) {
      if (!times.some((t) => now - t < RATE_LIMIT.windowMs)) rateMap.delete(key);
    }
  }
  return false;
}

export function siteUrl() {
  if (process.env.SITE_URL) return String(process.env.SITE_URL).replace(/\/+$/, '');
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://autopraizler.cz';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendMagicLink(email, link) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM || 'AutoPraizler web <web@josefpavlovic.cz>';
  if (!apiKey) throw new Error('chybí RESEND_API_KEY');

  const text = [
    'Dobrý den,',
    '',
    'kliknutím na tento odkaz se přihlásíte do správy aktualit webu autopraizler.cz:',
    link,
    '',
    'Odkaz platí 15 minut a lze ho použít jen jednou v tomto prohlížeči.',
    'Pokud jste o přihlášení nežádali, tento e-mail ignorujte – nic se nestane.',
    '',
    'AutoPraizler M.L. – web',
  ].join('\n');
  const html =
    `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#222">` +
    `<p>Dobrý den,</p>` +
    `<p>kliknutím na tlačítko se přihlásíte do správy aktualit webu autopraizler.cz:</p>` +
    `<p style="margin:24px 0"><a href="${escapeHtml(link)}" style="display:inline-block;background:#f53f4c;color:#fff;text-decoration:none;font-weight:bold;padding:14px 24px;border-radius:4px">Přihlásit se do správy aktualit</a></p>` +
    `<p style="font-size:13px;color:#555">Pokud tlačítko nefunguje, zkopírujte do prohlížeče tuto adresu:<br><a href="${escapeHtml(link)}">${escapeHtml(link)}</a></p>` +
    `<p style="font-size:13px;color:#555">Odkaz platí 15 minut. Pokud jste o přihlášení nežádali, tento e-mail ignorujte – nic se nestane.</p>` +
    `</div>`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'Přihlášení do správy aktualit – autopraizler.cz',
      text,
      html,
    }),
  });
  if (!r.ok) {
    let detail = '';
    try { detail = await r.text(); } catch { /* ignorujeme */ }
    throw new Error('Resend odpověděl ' + r.status + ' ' + detail.slice(0, 300));
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: MSG.methodNotAllowed }, { Allow: 'POST' });
    return;
  }

  const body = await readJson(req, 16 * 1024);
  if (!body) {
    sendJson(res, 400, { ok: false, error: MSG.badRequest });
    return;
  }
  const email = normalizeEmail(body.email);
  if (!isValidEmail(email)) {
    sendJson(res, 400, { ok: false, error: 'Zadejte prosím platný e-mail.' });
    return;
  }

  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    sendJson(res, 429, { ok: false, error: 'Příliš mnoho pokusů. Zkuste to prosím později.' });
    return;
  }

  const secret = process.env.ADMIN_SECRET;
  const allowed = adminEmails();
  if (!secret || secret.length < 16 || allowed.length === 0) {
    console.error('admin-login: chybí konfigurace (ADMIN_SECRET nebo ADMIN_EMAILS)');
    sendJson(res, 500, { ok: false, error: MSG.serverError });
    return;
  }

  if (allowed.includes(email)) {
    try {
      const link = `${siteUrl()}/admin/?t=${encodeURIComponent(makeLoginToken(email, secret))}`;
      await sendMagicLink(email, link);
    } catch (err) {
      console.error('admin-login: odeslání odkazu selhalo', err && err.message);
      sendJson(res, 502, { ok: false, error: 'Odkaz se nepodařilo odeslat. Zkuste to prosím za chvíli znovu.' });
      return;
    }
  } else {
    console.warn('admin-login: pokus o přihlášení nepovoleného e-mailu z IP ' + ip);
  }

  sendJson(res, 200, { ok: true, message: GENERIC_OK });
}
