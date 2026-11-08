// Lokální test serverless funkce api/kontakt.js bez odeslání skutečného e-mailu.
// Spuštění ze složky web/:  node tools/test-api.mjs
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import handler from '../api/kontakt.js';

function makeReq({ method = 'POST', body = '', contentType = 'application/json', ip = '203.0.113.' + Math.floor(Math.random() * 250) } = {}) {
  const req = new EventEmitter();
  req.method = method;
  req.headers = { 'content-type': contentType, 'x-forwarded-for': ip };
  req.socket = { remoteAddress: ip };
  req.destroy = () => {};
  process.nextTick(() => {
    if (body) req.emit('data', body);
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

async function run(reqOpts) {
  const req = makeReq(reqOpts);
  const res = makeRes();
  await handler(req, res);
  await res.finished;
  return res;
}

const fetchCalls = [];
globalThis.fetch = async (url, opts) => {
  fetchCalls.push({ url, opts });
  return { ok: true, status: 200, text: async () => '{"id":"test"}' };
};

const origLog = console.error;
console.error = () => {}; // očekávané chybové logy ztišíme

const valid = { jmeno: 'Jan Novák', email: 'jan@example.com', telefon: '777 000 111', termin: 'příští týden', zprava: 'Potřebuji přezout kola.', souhlas: '1', website: '' };

// 1) GET -> 405
{
  const res = await run({ method: 'GET' });
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, 'POST');
  console.log('OK  GET -> 405');
}

// 2) honeypot -> 200, nic se neodešle
{
  const res = await run({ body: JSON.stringify({ ...valid, website: 'http://spam.example' }) });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.body), { ok: true });
  assert.equal(fetchCalls.length, 0);
  console.log('OK  honeypot -> 200 bez odeslání');
}

// 3) neplatný e-mail -> 400
{
  const res = await run({ body: JSON.stringify({ ...valid, email: 'neplatny' }) });
  assert.equal(res.statusCode, 400);
  assert.equal(JSON.parse(res.body).ok, false);
  assert.equal(fetchCalls.length, 0);
  console.log('OK  neplatný e-mail -> 400');
}

// 4) chybějící konfigurace -> 500
{
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_TO;
  const res = await run({ body: JSON.stringify(valid) });
  assert.equal(res.statusCode, 500);
  assert.equal(JSON.parse(res.body).ok, false);
  assert.ok(!res.body.includes('RESEND'), 'odpověď nesmí prozradit název proměnné');
  assert.equal(fetchCalls.length, 0);
  console.log('OK  chybějící env -> 500');
}

// 5) platný JSON -> fetch na Resend s hlavičkou a poli
{
  process.env.RESEND_API_KEY = 'test_key_123';
  process.env.CONTACT_TO = 'prijemce@example.com';
  process.env.CONTACT_FROM = 'Web <web@example.com>';
  const res = await run({ body: JSON.stringify({ ...valid, zprava: 'Text <b>s</b> HTML & znaky' }) });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.body), { ok: true });
  assert.equal(fetchCalls.length, 1);
  const call = fetchCalls[0];
  assert.equal(call.url, 'https://api.resend.com/emails');
  assert.equal(call.opts.method, 'POST');
  assert.equal(call.opts.headers.Authorization, 'Bearer test_key_123');
  assert.equal(call.opts.headers['Content-Type'], 'application/json');
  const sent = JSON.parse(call.opts.body);
  assert.equal(sent.from, 'Web <web@example.com>');
  assert.deepEqual(sent.to, ['prijemce@example.com']);
  assert.equal(sent.reply_to, 'jan@example.com');
  assert.equal(sent.subject, 'Poptávka z webu autopraizler.cz: Jan Novák');
  assert.ok(sent.text.includes('Potřebuji') || sent.text.includes('Text <b>s</b> HTML & znaky'));
  assert.ok(sent.html.includes('Text &lt;b&gt;s&lt;/b&gt; HTML &amp; znaky'), 'HTML musí být escapované');
  assert.ok(!sent.html.includes('<b>s</b>'));
  console.log('OK  platný JSON -> fetch 1× se správnou hlavičkou a poli');
}

// 6) form-encoded (bez JS) -> 303 přesměrování
{
  fetchCalls.length = 0;
  const body = new URLSearchParams(valid).toString();
  const res = await run({ body, contentType: 'application/x-www-form-urlencoded' });
  assert.equal(res.statusCode, 303);
  assert.equal(res.headers.location, '/kontakt/?odeslano=1#odeslano');
  assert.equal(fetchCalls.length, 1);
  const bad = await run({ body: new URLSearchParams({ ...valid, email: 'x' }).toString(), contentType: 'application/x-www-form-urlencoded' });
  assert.equal(bad.statusCode, 303);
  assert.equal(bad.headers.location, '/kontakt/?chyba=1#chyba');
  console.log('OK  form-encoded -> 303 na /kontakt/?odeslano=1 resp. ?chyba=1');

  // zpet: povolená stránka -> přesměrování na ni; nepovolená -> /kontakt/
  const okZpet = await run({ body: new URLSearchParams({ ...valid, zpet: '/pneuservis/' }).toString(), contentType: 'application/x-www-form-urlencoded' });
  assert.equal(okZpet.statusCode, 303);
  assert.equal(okZpet.headers.location, '/pneuservis/?odeslano=1#odeslano');
  const badZpet = await run({ body: new URLSearchParams({ ...valid, zpet: 'https://evil.example/' }).toString(), contentType: 'application/x-www-form-urlencoded' });
  assert.equal(badZpet.headers.location, '/kontakt/?odeslano=1#odeslano');
  console.log('OK  zpet: povolená stránka ano, cizí URL -> /kontakt/');

  // /de/: chybové hlášky německy
  const de = await run({ body: JSON.stringify({ ...valid, email: 'spatne', zpet: '/de/' }) });
  assert.equal(de.statusCode, 400);
  assert.match(JSON.parse(de.body).error, /E-Mail-Adresse/);
  console.log('OK  /de/ -> německé hlášky');

  // /en/: chybové hlášky anglicky, návrat bez JavaScriptu na /en/
  const en = await run({ body: JSON.stringify({ ...valid, email: 'spatne', zpet: '/en/' }) });
  assert.equal(en.statusCode, 400);
  assert.match(JSON.parse(en.body).error, /valid e-mail address/);
  const enForm = await run({ body: new URLSearchParams({ ...valid, zpet: '/en/' }).toString(), contentType: 'application/x-www-form-urlencoded' });
  assert.equal(enForm.headers.location, '/en/?odeslano=1#odeslano');
  console.log('OK  /en/ -> anglické hlášky, návrat na /en/');
}

// 7) výchozí CONTACT_FROM
{
  delete process.env.CONTACT_FROM;
  fetchCalls.length = 0;
  await run({ body: JSON.stringify(valid) });
  assert.equal(JSON.parse(fetchCalls[0].opts.body).from, 'AutoPraizler web <web@josefpavlovic.cz>');
  console.log('OK  výchozí CONTACT_FROM');
}

// 8) rate limit: 6. požadavek ze stejné IP -> 429
{
  fetchCalls.length = 0;
  const ip = '198.51.100.7';
  let last;
  for (let i = 0; i < 6; i++) last = await run({ body: JSON.stringify(valid), ip });
  assert.equal(last.statusCode, 429);
  assert.equal(fetchCalls.length, 5);
  console.log('OK  rate limit -> 429 po 5 požadavcích');
}

// 9) chyba Resendu -> 502, generická hláška
{
  globalThis.fetch = async () => ({ ok: false, status: 422, text: async () => 'bad' });
  const res = await run({ body: JSON.stringify(valid) });
  assert.equal(res.statusCode, 502);
  assert.equal(JSON.parse(res.body).ok, false);
  console.log('OK  chyba Resendu -> 502');
}

console.error = origLog;
console.log('\nVšechny testy prošly.');
