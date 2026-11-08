// Vercel serverless funkce: správa přihlášení do administrace aktualit (/admin/).
// Node 20+, ESM, jen vestavěné moduly. Zároveň exportuje pomocné funkce
// (podpis tokenů, ověření cookie, CSRF, odpovědi), které používají api/admin-login.js a api/novinky.js.
//
//   POST   /api/admin-session  { t }  ověří token z přihlašovacího odkazu a nastaví cookie ap_admin (30 dní)
//   GET    /api/admin-session         { ok, email } pokud je cookie platná, jinak 401
//   DELETE /api/admin-session         odhlášení (smaže cookie)
//
// Proměnné prostředí: ADMIN_SECRET (povinná, náhodný řetězec 32+ znaků), ADMIN_EMAILS (povinná, čárkami oddělené).

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const COOKIE_NAME = 'ap_admin';
export const LOGIN_TOKEN_TTL_MS = 15 * 60 * 1000;
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const CSRF_HEADER_VALUE = 'ap-admin';

export const MSG = {
  badRequest: 'Neplatný požadavek.',
  unauthorized: 'Nejste přihlášen(a). Přihlaste se prosím znovu.',
  forbidden: 'Požadavek byl odmítnut. Obnovte prosím stránku a zkuste to znovu.',
  methodNotAllowed: 'Metoda není povolena.',
  serverError: 'Něco se pokazilo. Zkuste to prosím za chvíli znovu.',
  linkInvalid: 'Přihlašovací odkaz je neplatný nebo vypršel. Nechte si prosím poslat nový.',
};

/* ---------- base64url ---------- */
export function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function b64urlDecode(str) {
  const s = String(str).replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(s + '='.repeat((4 - (s.length % 4)) % 4), 'base64');
}

/* ---------- Tokeny: base64url(payload).base64url(HMAC-SHA256(payloadB64, ADMIN_SECRET)) ---------- */
function hmac(data, secret) {
  return createHmac('sha256', secret).update(data).digest();
}

export function signToken(payload, secret) {
  const body = b64url(JSON.stringify(payload));
  return body + '.' + b64url(hmac(body, secret));
}

// Vrátí payload, nebo null (špatný podpis, vypršel, jiný druh tokenu).
export function verifyToken(token, secret, kind) {
  if (typeof token !== 'string' || token.length > 2000 || !secret) return null;
  const dot = token.indexOf('.');
  if (dot <= 0 || dot === token.length - 1) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^[A-Za-z0-9_-]+$/.test(body) || !/^[A-Za-z0-9_-]+$/.test(sig)) return null;
  const expected = hmac(body, secret);
  let given;
  try {
    given = b64urlDecode(sig);
  } catch {
    return null;
  }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  let payload;
  try {
    payload = JSON.parse(b64urlDecode(body).toString('utf8'));
  } catch {
    return null;
  }
  if (!payload || typeof payload !== 'object') return null;
  if (typeof payload.e !== 'string' || typeof payload.exp !== 'number') return null;
  if (payload.k !== kind) return null;
  if (payload.exp <= Date.now()) return null;
  return payload;
}

export function makeLoginToken(email, secret) {
  return signToken({ k: 'login', e: email, exp: Date.now() + LOGIN_TOKEN_TTL_MS, n: b64url(randomBytes(12)) }, secret);
}

export function makeSessionToken(email, secret) {
  return signToken({ k: 'session', e: email, exp: Date.now() + SESSION_TTL_MS, n: b64url(randomBytes(12)) }, secret);
}

/* ---------- Konfigurace ---------- */
export function adminEmails() {
  return String(process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function normalizeEmail(v) {
  return String(v || '').trim().toLowerCase().slice(0, 200);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 150;
}

/* ---------- Požadavek / odpověď ---------- */
export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

export function sendJson(res, status, payload, extraHeaders) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (extraHeaders) for (const [k, v] of Object.entries(extraHeaders)) res.setHeader(k, v);
  res.end(JSON.stringify(payload));
}

async function readRawBody(req, limit) {
  if (typeof req.body === 'string') return req.body;
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body; // už naparsované (Vercel)
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > limit) {
        reject(new Error('body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

// Přečte JSON tělo; vrátí objekt, nebo null při chybě.
export async function readJson(req, limit = 64 * 1024) {
  try {
    const raw = await readRawBody(req, limit);
    if (raw && typeof raw === 'object') return raw;
    const parsed = JSON.parse(raw || '{}');
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function parseCookies(req) {
  const out = {};
  const header = req.headers.cookie;
  if (typeof header !== 'string') return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i <= 0) continue;
    const k = part.slice(0, i).trim();
    if (!(k in out)) out[k] = part.slice(i + 1).trim();
  }
  return out;
}

export function sessionCookie(token) {
  return `${COOKIE_NAME}=${token}; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}; Path=/; HttpOnly; Secure; SameSite=Strict`;
}
export function clearCookie() {
  return `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`;
}

// Vrátí { email } přihlášeného správce, nebo null.
export function getSession(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return null;
  const token = parseCookies(req)[COOKIE_NAME];
  if (!token) return null;
  const payload = verifyToken(token, secret, 'session');
  if (!payload) return null;
  const email = normalizeEmail(payload.e);
  if (!adminEmails().includes(email)) return null; // přístup lze odebrat smazáním e-mailu z ADMIN_EMAILS
  return { email };
}

function requestHost(req) {
  const fwd = req.headers['x-forwarded-host'];
  const host = (typeof fwd === 'string' && fwd.split(',')[0].trim()) || req.headers.host || '';
  return String(host).toLowerCase();
}

function urlHost(value) {
  try {
    return new URL(String(value)).host.toLowerCase();
  } catch {
    return '';
  }
}

// Ochrana proti CSRF: vlastní hlavička + Origin/Referer ze stejného hostitele.
export function csrfOk(req) {
  if (req.headers['x-requested-with'] !== CSRF_HEADER_VALUE) return false;
  const host = requestHost(req);
  if (!host) return false;
  const origin = req.headers.origin;
  if (typeof origin === 'string' && origin) return urlHost(origin) === host;
  const referer = req.headers.referer;
  if (typeof referer === 'string' && referer) return urlHost(referer) === host;
  return false;
}

/* ---------- Handler ---------- */
export default async function handler(req, res) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 16 || adminEmails().length === 0) {
    console.error('admin-session: chybí konfigurace (ADMIN_SECRET nebo ADMIN_EMAILS)');
    sendJson(res, 500, { ok: false, error: MSG.serverError });
    return;
  }

  if (req.method === 'GET') {
    const session = getSession(req);
    if (!session) {
      sendJson(res, 401, { ok: false, error: MSG.unauthorized });
      return;
    }
    sendJson(res, 200, { ok: true, email: session.email });
    return;
  }

  if (req.method === 'POST') {
    if (!csrfOk(req)) {
      sendJson(res, 403, { ok: false, error: MSG.forbidden });
      return;
    }
    const body = await readJson(req, 16 * 1024);
    if (!body || typeof body.t !== 'string') {
      sendJson(res, 400, { ok: false, error: MSG.badRequest });
      return;
    }
    const payload = verifyToken(body.t, secret, 'login');
    const email = payload ? normalizeEmail(payload.e) : '';
    if (!payload || !adminEmails().includes(email)) {
      sendJson(res, 401, { ok: false, error: MSG.linkInvalid });
      return;
    }
    const token = makeSessionToken(email, secret);
    sendJson(res, 200, { ok: true, email }, { 'Set-Cookie': sessionCookie(token) });
    return;
  }

  if (req.method === 'DELETE') {
    if (!csrfOk(req)) {
      sendJson(res, 403, { ok: false, error: MSG.forbidden });
      return;
    }
    sendJson(res, 200, { ok: true }, { 'Set-Cookie': clearCookie() });
    return;
  }

  sendJson(res, 405, { ok: false, error: MSG.methodNotAllowed }, { Allow: 'GET, POST, DELETE' });
}
