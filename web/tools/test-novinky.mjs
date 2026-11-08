// Testy funkcí správy aktualit (api/admin-login.js, api/admin-session.js, api/novinky.js)
// s falešným fetch – nic se neposílá na Resend ani GitHub.
// Spuštění ze složky web/:  node tools/test-novinky.mjs
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';

// falešné prostředí – musí být nastavené před prvním volání handlerů (čtou env až za běhu)
process.env.ADMIN_SECRET = 'test-secret-which-is-long-enough-0123456789';
process.env.ADMIN_EMAILS = 'Majitel@Example.cz, druhy@example.cz';
process.env.RESEND_API_KEY = 'test_resend_key';
process.env.GITHUB_TOKEN = 'test_github_token';
process.env.GITHUB_REPO = 'owner/repo';
process.env.GITHUB_BRANCH = 'main';
process.env.SITE_URL = 'https://autopraizler.cz';
delete process.env.CONTACT_FROM;

const login = (await import('../api/admin-login.js')).default;
const sessionMod = await import('../api/admin-session.js');
const session = sessionMod.default;
const novinky = (await import('../api/novinky.js')).default;
const { signToken, verifyToken, makeLoginToken, COOKIE_NAME } = sessionMod;

/* ---------- Falešné req/res ---------- */
function makeReq({ method = 'GET', url = '/', body, headers = {}, ip = '203.0.113.' + Math.floor(Math.random() * 250) } = {}) {
  const req = new EventEmitter();
  req.method = method;
  req.url = url;
  req.headers = { host: 'autopraizler.cz', 'x-forwarded-for': ip, ...headers };
  if (body !== undefined) req.headers['content-type'] = 'application/json';
  req.socket = { remoteAddress: ip };
  req.destroy = () => {};
  process.nextTick(() => {
    if (body !== undefined) req.emit('data', typeof body === 'string' ? body : JSON.stringify(body));
    req.emit('end');
  });
  return req;
}

function makeRes() {
  const res = { statusCode: 200, headers: {}, body: '' };
  res.setHeader = (k, v) => { res.headers[k.toLowerCase()] = v; };
  res.end = (chunk) => { res.body = chunk || ''; res.done(); };
  res.finished = new Promise((r) => { res.done = r; });
  return res;
}

async function run(handler, reqOpts) {
  const req = makeReq(reqOpts);
  const res = makeRes();
  await handler(req, res);
  await res.finished;
  res.json = res.body ? JSON.parse(res.body) : null;
  return res;
}

/* ---------- Falešný fetch: Resend + GitHub contents API ---------- */
const calls = [];
const github = { files: new Map(), conflictOnce: false }; // path -> { sha, content: Buffer }
let shaCounter = 0;
const newSha = () => 'sha' + String(++shaCounter).padStart(4, '0');

function ghPath(url) {
  const u = new URL(url);
  return decodeURIComponent(u.pathname.replace(/^\/repos\/owner\/repo\/contents\//, ''));
}

globalThis.fetch = async (url, opts = {}) => {
  const method = opts.method || 'GET';
  const body = opts.body ? JSON.parse(opts.body) : null;
  calls.push({ url, method, headers: opts.headers || {}, body });
  const json = (status, data) => ({ ok: status >= 200 && status < 300, status, json: async () => data, text: async () => JSON.stringify(data) });

  if (url.startsWith('https://api.resend.com/')) return json(200, { id: 'mail_1' });

  if (url.startsWith('https://api.github.com/repos/owner/repo/contents/')) {
    assert.equal(opts.headers.Authorization, 'Bearer test_github_token');
    const path = ghPath(url);
    const file = github.files.get(path);
    if (method === 'GET') {
      if (!file) return json(404, { message: 'Not Found' });
      return json(200, { sha: file.sha, content: file.content.toString('base64').replace(/(.{60})/g, '$1\n'), encoding: 'base64' });
    }
    if (method === 'PUT') {
      assert.equal(body.branch, 'main');
      assert.deepEqual(body.committer, { name: 'AutoPraizler web', email: 'web@josefpavlovic.cz' });
      if (file && body.sha !== file.sha) return json(409, { message: 'sha mismatch' });
      if (!file && body.sha) return json(422, { message: 'sha given for new file' });
      if (github.conflictOnce) { github.conflictOnce = false; return json(409, { message: 'simulated conflict' }); }
      const entry = { sha: newSha(), content: Buffer.from(body.content, 'base64') };
      github.files.set(path, entry);
      return json(file ? 200 : 201, { content: { sha: entry.sha }, commit: { sha: 'c' + entry.sha } });
    }
    if (method === 'DELETE') {
      if (!file) return json(404, { message: 'Not Found' });
      if (body.sha !== file.sha) return json(409, { message: 'sha mismatch' });
      github.files.delete(path);
      return json(200, { commit: { sha: 'del' } });
    }
  }
  throw new Error('neočekávaný fetch: ' + method + ' ' + url);
};

const resendCalls = () => calls.filter((c) => c.url.startsWith('https://api.resend.com/'));
const ghCalls = (method, pathPart) => calls.filter((c) => c.url.startsWith('https://api.github.com/') && c.method === method && (!pathPart || ghPath(c.url).includes(pathPart)));

function seedNews(items) {
  github.files.set('web/data/novinky.json', { sha: newSha(), content: Buffer.from(JSON.stringify({ items }, null, 2) + '\n') });
}
function readNews() {
  return JSON.parse(github.files.get('web/data/novinky.json').content.toString('utf8'));
}

const origErr = console.error, origWarn = console.warn;
console.error = () => {};
console.warn = () => {};

const csrf = { 'x-requested-with': 'ap-admin', origin: 'https://autopraizler.cz' };
let cookie; // nastaví test přihlášení

/* ===================== admin-login ===================== */

// 1) povolený e-mail -> 200 a jeden fetch na Resend s odkazem /admin/?t=
{
  calls.length = 0;
  const res = await run(login, { method: 'POST', body: { email: 'majitel@example.cz' } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json.ok, true);
  assert.equal(resendCalls().length, 1);
  const mail = resendCalls()[0];
  assert.equal(mail.headers.Authorization, 'Bearer test_resend_key');
  assert.deepEqual(mail.body.to, ['majitel@example.cz']);
  assert.equal(mail.body.from, 'AutoPraizler web <web@josefpavlovic.cz>');
  const m = /https:\/\/autopraizler\.cz\/admin\/\?t=([A-Za-z0-9_.%-]+)/.exec(mail.body.text);
  assert.ok(m, 'e-mail musí obsahovat odkaz /admin/?t=');
  const token = decodeURIComponent(m[1]);
  const payload = verifyToken(token, process.env.ADMIN_SECRET, 'login');
  assert.ok(payload && payload.e === 'majitel@example.cz');
  assert.ok(payload.exp - Date.now() <= 15 * 60 * 1000 + 1000);
  assert.ok(!res.body.includes('majitel'), 'odpověď nesmí potvrzovat e-mail');
  console.log('OK  login povolený e-mail -> 200 + Resend 1×');
}

// 2) nepovolený e-mail -> stejná 200, žádný fetch
{
  calls.length = 0;
  const res = await run(login, { method: 'POST', body: { email: 'cizi@example.com' } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json.ok, true);
  assert.equal(resendCalls().length, 0);
  const ok = await run(login, { method: 'POST', body: { email: 'majitel@example.cz' } });
  assert.equal(ok.json.message, res.json.message, 'hláška musí být pro obě varianty stejná');
  console.log('OK  login nepovolený e-mail -> 200 bez odeslání, stejná hláška');
}

// 3) velikost e-mailu nehraje roli; neplatný e-mail -> 400; GET -> 405
{
  calls.length = 0;
  await run(login, { method: 'POST', body: { email: 'DRUHY@EXAMPLE.CZ' } });
  assert.equal(resendCalls().length, 1);
  const bad = await run(login, { method: 'POST', body: { email: 'neplatny' } });
  assert.equal(bad.statusCode, 400);
  const get = await run(login, { method: 'GET' });
  assert.equal(get.statusCode, 405);
  console.log('OK  login velká písmena / neplatný e-mail -> 400 / GET -> 405');
}

// 4) rate limit 5/hod z jedné IP -> 6. požadavek 429
{
  const ip = '198.51.100.9';
  let last;
  for (let i = 0; i < 6; i++) last = await run(login, { method: 'POST', body: { email: 'cizi@example.com' }, ip });
  assert.equal(last.statusCode, 429);
  console.log('OK  login rate limit -> 429 po 5 požadavcích');
}

// 5) SITE_URL nenastavená: preview Vercel -> VERCEL_URL, jinak autopraizler.cz
{
  const { siteUrl } = await import('../api/admin-login.js');
  delete process.env.SITE_URL;
  process.env.VERCEL_ENV = 'preview';
  process.env.VERCEL_URL = 'web-abc123.vercel.app';
  assert.equal(siteUrl(), 'https://web-abc123.vercel.app');
  process.env.VERCEL_ENV = 'production';
  assert.equal(siteUrl(), 'https://autopraizler.cz');
  process.env.SITE_URL = 'https://autopraizler.cz/';
  assert.equal(siteUrl(), 'https://autopraizler.cz');
  console.log('OK  SITE_URL / VERCEL_URL');
}

/* ===================== tokeny ===================== */

// 6) platný / vypršelý / pozměněný / jiný druh
{
  const secret = process.env.ADMIN_SECRET;
  const valid = makeLoginToken('majitel@example.cz', secret);
  assert.ok(verifyToken(valid, secret, 'login'));
  assert.equal(verifyToken(valid, secret, 'session'), null, 'přihlašovací token nesmí projít jako session');

  const expired = signToken({ k: 'login', e: 'majitel@example.cz', exp: Date.now() - 1000, n: 'x' }, secret);
  assert.equal(verifyToken(expired, secret, 'login'), null);

  const [body, sig] = valid.split('.');
  const tamperedBody = Buffer.from(JSON.stringify({ k: 'login', e: 'utocnik@example.com', exp: Date.now() + 60000, n: 'x' })).toString('base64url');
  assert.equal(verifyToken(tamperedBody + '.' + sig, secret, 'login'), null, 'změněný payload');
  assert.equal(verifyToken(body + '.' + (sig[0] === 'A' ? 'B' : 'A') + sig.slice(1), secret, 'login'), null, 'změněný podpis');
  assert.equal(verifyToken(valid, 'jiny-secret-jiny-secret-jiny-secret', 'login'), null, 'jiný klíč');
  assert.equal(verifyToken('nesmysl', secret, 'login'), null);
  assert.equal(verifyToken('', secret, 'login'), null);
  console.log('OK  token platný / vypršelý / pozměněný / jiný druh');
}

/* ===================== admin-session ===================== */

// 7) POST s platným tokenem -> Set-Cookie ap_admin (HttpOnly, Secure, SameSite=Strict)
{
  const t = makeLoginToken('majitel@example.cz', process.env.ADMIN_SECRET);
  const res = await run(session, { method: 'POST', body: { t }, headers: csrf });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json.email, 'majitel@example.cz');
  const sc = res.headers['set-cookie'];
  assert.ok(sc.startsWith(COOKIE_NAME + '='));
  for (const flag of ['HttpOnly', 'Secure', 'SameSite=Strict', 'Path=/', 'Max-Age=2592000']) assert.ok(sc.includes(flag), 'cookie musí mít ' + flag);
  cookie = sc.split(';')[0];
  const sessionToken = cookie.slice(COOKIE_NAME.length + 1);
  assert.ok(verifyToken(sessionToken, process.env.ADMIN_SECRET, 'session'));

  const me = await run(session, { method: 'GET', headers: { cookie } });
  assert.equal(me.statusCode, 200);
  assert.deepEqual(me.json, { ok: true, email: 'majitel@example.cz' });
  console.log('OK  session POST -> cookie, GET -> { ok, email }');
}

// 8) POST bez CSRF hlavičky -> 403; vypršelý/nepovolený token -> 401; GET bez cookie -> 401; DELETE maže cookie
{
  const t = makeLoginToken('majitel@example.cz', process.env.ADMIN_SECRET);
  const noCsrf = await run(session, { method: 'POST', body: { t } });
  assert.equal(noCsrf.statusCode, 403);
  const foreignOrigin = await run(session, { method: 'POST', body: { t }, headers: { ...csrf, origin: 'https://evil.example' } });
  assert.equal(foreignOrigin.statusCode, 403);
  const expired = signToken({ k: 'login', e: 'majitel@example.cz', exp: Date.now() - 1, n: 'x' }, process.env.ADMIN_SECRET);
  assert.equal((await run(session, { method: 'POST', body: { t: expired }, headers: csrf })).statusCode, 401);
  const notAllowed = makeLoginToken('cizi@example.com', process.env.ADMIN_SECRET);
  assert.equal((await run(session, { method: 'POST', body: { t: notAllowed }, headers: csrf })).statusCode, 401);
  assert.equal((await run(session, { method: 'GET' })).statusCode, 401);
  const out = await run(session, { method: 'DELETE', headers: { cookie, ...csrf } });
  assert.equal(out.statusCode, 200);
  assert.ok(out.headers['set-cookie'].includes('Max-Age=0'));
  console.log('OK  session CSRF 403 / neplatné tokeny 401 / logout maže cookie');
}

// 9) e-mail odebraný z ADMIN_EMAILS -> session přestane platit
{
  const saved = process.env.ADMIN_EMAILS;
  process.env.ADMIN_EMAILS = 'druhy@example.cz';
  assert.equal((await run(session, { method: 'GET', headers: { cookie } })).statusCode, 401);
  process.env.ADMIN_EMAILS = saved;
  assert.equal((await run(session, { method: 'GET', headers: { cookie } })).statusCode, 200);
  console.log('OK  odebrání e-mailu z ADMIN_EMAILS zneplatní přihlášení');
}

/* ===================== novinky ===================== */

// 10) GET bez cookie -> 401; GET s cookie -> seznam z GitHubu
{
  seedNews([{ id: '2026-11-01-aaaaaa', datum: '2026-11-01', nadpis: 'Starší', text: 'T', obrazek: null, publikovano: true }]);
  calls.length = 0;
  assert.equal((await run(novinky, { method: 'GET' })).statusCode, 401);
  assert.equal(ghCalls('GET').length, 0, 'bez přihlášení se na GitHub nesahá');
  const res = await run(novinky, { method: 'GET', headers: { cookie } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json.items.length, 1);
  assert.equal(res.json.items[0].nadpis, 'Starší');
  console.log('OK  novinky GET bez cookie -> 401, s cookie -> seznam');
}

// 11) POST bez CSRF hlavičky -> 403 (i s cookie); s cizím Origin -> 403
{
  calls.length = 0;
  const item = { nadpis: 'Nová akce', datum: '2026-11-08', text: 'Text', publikovano: true };
  assert.equal((await run(novinky, { method: 'POST', body: item, headers: { cookie } })).statusCode, 403);
  assert.equal((await run(novinky, { method: 'POST', body: item, headers: { cookie, 'x-requested-with': 'ap-admin', origin: 'https://evil.example' } })).statusCode, 403);
  assert.equal((await run(novinky, { method: 'POST', body: item, headers: csrf })).statusCode, 401);
  assert.equal(ghCalls('PUT').length, 0);
  console.log('OK  novinky POST bez CSRF -> 403, bez cookie -> 401');
}

// 12) POST platná položka -> GitHub PUT s base64 JSON obsahujícím položku, správné sha, seřazeno
{
  calls.length = 0;
  const oldSha = github.files.get('web/data/novinky.json').sha;
  const item = { nadpis: 'Zimní pneu – akce', datum: '2026-11-08', text: 'První odstavec.\r\n\r\nDruhý odstavec.', publikovano: true };
  const res = await run(novinky, { method: 'POST', body: item, headers: { cookie, ...csrf } });
  assert.equal(res.statusCode, 200, res.body);
  assert.equal(res.json.ok, true);
  assert.equal(res.json.message, 'Uloženo. Na webu se objeví do minuty až dvou.');
  assert.match(res.json.item.id, /^2026-11-08-[a-z0-9]{6}$/);
  const puts = ghCalls('PUT', 'novinky.json');
  assert.equal(puts.length, 1);
  assert.equal(puts[0].body.sha, oldSha, 'PUT musí poslat sha aktuálního souboru');
  assert.equal(puts[0].body.message, 'Aktuality: Zimní pneu – akce');
  const written = JSON.parse(Buffer.from(puts[0].body.content, 'base64').toString('utf8'));
  assert.equal(written.items.length, 2);
  assert.equal(written.items[0].nadpis, 'Zimní pneu – akce', 'nejnovější první');
  assert.equal(written.items[0].text, 'První odstavec.\n\nDruhý odstavec.');
  assert.equal(written.items[0].obrazek, null);
  assert.equal(written.items[0].publikovano, true);
  assert.equal(written.items[1].id, '2026-11-01-aaaaaa');
  console.log('OK  novinky POST -> GitHub PUT s base64 JSON a sha');
}

// 13) POST s obrázkem -> nejdřív PUT obrázku, pak JSON s cestou; úprava položky zachová obrázek
let imageItemId;
{
  calls.length = 0;
  const jpegBytes = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(300, 1), Buffer.from([0xff, 0xd9])]);
  const dataUrl = 'data:image/jpeg;base64,' + jpegBytes.toString('base64');
  const res = await run(novinky, { method: 'POST', body: { nadpis: 'S obrázkem', datum: '2026-11-09', text: 'T', publikovano: false, obrazek: dataUrl }, headers: { cookie, ...csrf } });
  assert.equal(res.statusCode, 200, res.body);
  imageItemId = res.json.item.id;
  assert.equal(res.json.item.obrazek, `/data/obrazky/${imageItemId}.jpg`);
  const puts = calls.filter((c) => c.method === 'PUT');
  assert.equal(puts.length, 2);
  assert.ok(ghPath(puts[0].url).startsWith('web/data/obrazky/'), 'obrázek se ukládá první');
  assert.ok(github.files.get(`web/data/obrazky/${imageItemId}.jpg`).content.equals(jpegBytes));
  assert.equal(readNews().items[0].obrazek, `/data/obrazky/${imageItemId}.jpg`);

  // úprava bez pole obrazek -> obrázek zůstává
  calls.length = 0;
  const upd = await run(novinky, { method: 'POST', body: { id: imageItemId, nadpis: 'S obrázkem (upraveno)', datum: '2026-11-09', text: 'T2', publikovano: true }, headers: { cookie, ...csrf } });
  assert.equal(upd.statusCode, 200);
  assert.equal(upd.json.item.obrazek, `/data/obrazky/${imageItemId}.jpg`);
  assert.equal(readNews().items.length, 3, 'úprava nesmí přidat položku');
  assert.equal(ghCalls('DELETE').length, 0);

  // obrazek: null -> JSON bez obrázku a soubor smazán
  const rm = await run(novinky, { method: 'POST', body: { id: imageItemId, nadpis: 'S obrázkem (bez)', datum: '2026-11-09', text: 'T3', publikovano: true, obrazek: null }, headers: { cookie, ...csrf } });
  assert.equal(rm.statusCode, 200);
  assert.equal(rm.json.item.obrazek, null);
  assert.equal(github.files.has(`web/data/obrazky/${imageItemId}.jpg`), false, 'starý obrázek se maže');
  console.log('OK  novinky POST s obrázkem / úprava / odebrání obrázku');
}

// 14) validace: krátký nadpis, špatné datum, velký obrázek, špatný typ, neexistující id
{
  calls.length = 0;
  const base = { nadpis: 'Platný nadpis', datum: '2026-11-08', text: 'T', publikovano: true };
  assert.equal((await run(novinky, { method: 'POST', body: { ...base, nadpis: 'ab' }, headers: { cookie, ...csrf } })).statusCode, 400);
  assert.equal((await run(novinky, { method: 'POST', body: { ...base, datum: '2026-13-40' }, headers: { cookie, ...csrf } })).statusCode, 400);
  assert.equal((await run(novinky, { method: 'POST', body: { ...base, publikovano: 'ano' }, headers: { cookie, ...csrf } })).statusCode, 400);
  assert.equal((await run(novinky, { method: 'POST', body: { ...base, text: '' }, headers: { cookie, ...csrf } })).statusCode, 400);
  const big = 'data:image/jpeg;base64,' + Buffer.alloc(1.6 * 1024 * 1024, 7).toString('base64');
  const bigRes = await run(novinky, { method: 'POST', body: { ...base, obrazek: big }, headers: { cookie, ...csrf } });
  assert.equal(bigRes.statusCode, 400);
  assert.ok(bigRes.json.error.includes('1,5 MB'));
  assert.equal((await run(novinky, { method: 'POST', body: { ...base, obrazek: 'data:image/gif;base64,R0lGODlh' }, headers: { cookie, ...csrf } })).statusCode, 400);
  assert.equal((await run(novinky, { method: 'POST', body: { ...base, id: '2026-01-01-neexist' }, headers: { cookie, ...csrf } })).statusCode, 404);
  assert.equal(ghCalls('PUT').length, 0, 'při chybě validace se nic nezapisuje');
  console.log('OK  novinky validace -> 400 / 404 bez zápisu');
}

// 15) konflikt sha (409) -> znovu načte a zopakuje, výsledek uložen
{
  calls.length = 0;
  github.conflictOnce = true;
  const res = await run(novinky, { method: 'POST', body: { nadpis: 'Po konfliktu', datum: '2026-11-10', text: 'T', publikovano: true }, headers: { cookie, ...csrf } });
  assert.equal(res.statusCode, 200, res.body);
  assert.equal(ghCalls('PUT', 'novinky.json').length, 2, 'po 409 následuje druhý PUT');
  assert.equal(ghCalls('GET', 'novinky.json').length, 2, 'před druhým PUT se soubor znovu načte');
  assert.equal(readNews().items[0].nadpis, 'Po konfliktu');
  console.log('OK  novinky konflikt sha -> opakování 1×');
}

// 16) DELETE odstraní položku i obrázek; bez CSRF 403; neznámé id 404
{
  // položka s obrázkem
  const jpeg = 'data:image/jpeg;base64,' + Buffer.alloc(400, 3).toString('base64');
  const created = await run(novinky, { method: 'POST', body: { nadpis: 'Ke smazání', datum: '2026-11-11', text: 'T', publikovano: true, obrazek: jpeg }, headers: { cookie, ...csrf } });
  const id = created.json.item.id;
  assert.ok(github.files.has(`web/data/obrazky/${id}.jpg`));
  const before = readNews().items.length;

  assert.equal((await run(novinky, { method: 'DELETE', url: `/api/novinky?id=${id}`, headers: { cookie } })).statusCode, 403);
  assert.equal((await run(novinky, { method: 'DELETE', url: `/api/novinky?id=${id}`, headers: csrf })).statusCode, 401);

  calls.length = 0;
  const res = await run(novinky, { method: 'DELETE', url: `/api/novinky?id=${id}`, headers: { cookie, ...csrf } });
  assert.equal(res.statusCode, 200, res.body);
  const after = readNews();
  assert.equal(after.items.length, before - 1);
  assert.ok(!after.items.some((it) => it.id === id));
  assert.equal(github.files.has(`web/data/obrazky/${id}.jpg`), false, 'obrázek musí být smazán');
  const del = ghCalls('DELETE');
  assert.equal(del.length, 1);
  assert.equal(ghPath(del[0].url), `web/data/obrazky/${id}.jpg`);
  assert.ok(del[0].body.sha);

  assert.equal((await run(novinky, { method: 'DELETE', url: '/api/novinky?id=2026-01-01-neexist', headers: { cookie, ...csrf } })).statusCode, 404);
  assert.equal((await run(novinky, { method: 'DELETE', url: '/api/novinky?id=../../etc', headers: { cookie, ...csrf } })).statusCode, 400);
  console.log('OK  novinky DELETE -> položka i obrázek pryč, CSRF 403, neznámé id 404');
}

// 17) chybějící GITHUB_TOKEN -> 500 s obecnou hláškou (bez názvu proměnné); PUT -> 405
{
  const saved = process.env.GITHUB_TOKEN;
  delete process.env.GITHUB_TOKEN;
  const res = await run(novinky, { method: 'GET', headers: { cookie } });
  assert.equal(res.statusCode, 500);
  assert.ok(!res.body.includes('GITHUB'));
  process.env.GITHUB_TOKEN = saved;
  assert.equal((await run(novinky, { method: 'PUT', headers: { cookie, ...csrf } })).statusCode, 405);
  console.log('OK  novinky chybějící konfigurace -> 500, PUT -> 405');
}

console.error = origErr;
console.warn = origWarn;
console.log('\nVšechny testy prošly.');
