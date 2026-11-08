// Vercel serverless funkce: správa aktualit.
// Zdroj pravdy (včetně nezveřejněných návrhů) je obsah/aktuality/novinky.json – leží MIMO složku web/,
// Vercel ho tedy nikdy nevystaví. Web čte jen web/data/novinky.json, kam funkce zapisuje výhradně
// zveřejněné položky. Obrázky jsou ve web/data/obrazky/ (veřejná cesta, ale bez odkazu z webu,
// dokud není položka zveřejněná; repozitář sám je veřejný).
// Zápis jde přímo do repozitáře na GitHubu přes REST API (contents API); Vercel po commitu web znovu
// nasadí, změna je na webu zhruba do minuty. Node 20+, ESM, jen vestavěné moduly + globální fetch.
//
//   GET    /api/novinky          { ok, items }      – aktuální seznam z GitHubu (jen přihlášený správce)
//   POST   /api/novinky          { id?, nadpis, datum, text, publikovano, obrazek? }  – založí nebo upraví
//                                obrazek: data URL (nový obrázek) | null (odstranit) | nevyplněno (ponechat)
//   DELETE /api/novinky?id=...   smaže aktualitu i její obrázek
//
// Mutace vyžadují cookie ap_admin, hlavičku X-Requested-With: ap-admin a Origin/Referer ze stejného hostitele.
// Proměnné prostředí: ADMIN_SECRET, ADMIN_EMAILS, GITHUB_TOKEN (povinné),
// GITHUB_REPO (výchozí veritasderman-rgb/prajlzler), GITHUB_BRANCH (výchozí main).

import { randomBytes } from 'node:crypto';
import { csrfOk, getSession, MSG, readJson, sendJson } from './admin-session.js';

const MASTER_PATH = 'obsah/aktuality/novinky.json'; // vše včetně návrhů, mimo nasazovanou složku web/
const PUBLIC_PATH = 'web/data/novinky.json'; // jen zveřejněné položky, čte ho js/novinky.js
const IMAGE_DIR = 'web/data/obrazky';
const PUBLIC_IMAGE_DIR = '/data/obrazky';
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;
const MAX_BODY_BYTES = 3 * 1024 * 1024;
const COMMITTER = { name: 'AutoPraizler web', email: 'web@josefpavlovic.cz' };
const SAVED_PUBLIC = 'Uloženo. Na webu se objeví do minuty až dvou.';
const SAVED_HIDDEN = 'Uloženo jako skrytá aktualita. Na webu se nezobrazuje, dokud ji nezveřejníte.';
const ID_RE = /^\d{4}-\d{2}-\d{2}-[a-z0-9]{4,16}$/;

class UserError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

/* ---------- GitHub contents API ---------- */
function ghConfig() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('chybí GITHUB_TOKEN');
  const repo = process.env.GITHUB_REPO || 'veritasderman-rgb/prajlzler';
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error('GITHUB_REPO má špatný tvar');
  return { token, repo, branch: process.env.GITHUB_BRANCH || 'main' };
}

function ghUrl(cfg, path) {
  return `https://api.github.com/repos/${cfg.repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
}

async function ghRequest(cfg, method, url, body) {
  const r = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'autopraizler-web-admin',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await r.json(); } catch { /* prázdná odpověď */ }
  return { ok: r.ok, status: r.status, data };
}

// Vrátí { sha, content: Buffer } nebo null, když soubor neexistuje.
async function ghGetFile(cfg, path) {
  const r = await ghRequest(cfg, 'GET', `${ghUrl(cfg, path)}?ref=${encodeURIComponent(cfg.branch)}`);
  if (r.status === 404) return null;
  if (!r.ok || !r.data || typeof r.data.sha !== 'string') {
    throw new Error(`GitHub GET ${path} -> ${r.status}`);
  }
  const content = typeof r.data.content === 'string' ? Buffer.from(r.data.content, 'base64') : Buffer.alloc(0);
  return { sha: r.data.sha, content };
}

async function ghPutFile(cfg, path, buffer, message, sha) {
  const body = { message, content: Buffer.from(buffer).toString('base64'), branch: cfg.branch, committer: COMMITTER };
  if (sha) body.sha = sha;
  return ghRequest(cfg, 'PUT', ghUrl(cfg, path), body);
}

async function ghDeleteFile(cfg, path, sha, message) {
  return ghRequest(cfg, 'DELETE', ghUrl(cfg, path), { message, sha, branch: cfg.branch, committer: COMMITTER });
}

function isConflict(status) {
  return status === 409 || status === 422;
}

function parseItems(file, label) {
  if (!file) return [];
  try {
    const parsed = JSON.parse(file.content.toString('utf8'));
    if (parsed && Array.isArray(parsed.items)) return parsed.items.filter((it) => it && typeof it === 'object');
  } catch (err) {
    console.error(`novinky: ${label} není platný JSON, bude přepsán`, err && err.message);
  }
  return [];
}

// Načte hlavní soubor (včetně návrhů). Když ještě neexistuje, převezme položky z veřejného souboru
// (jednorázová migrace ze starší verze, kdy byl veřejný soubor jediný).
async function readNews(cfg) {
  const master = await ghGetFile(cfg, MASTER_PATH);
  if (master) return { items: parseItems(master, MASTER_PATH), sha: master.sha };
  const pub = await ghGetFile(cfg, PUBLIC_PATH);
  return { items: parseItems(pub, PUBLIC_PATH), sha: undefined };
}

function sortItems(items) {
  return items.slice().sort((a, b) => {
    if (a.datum !== b.datum) return a.datum < b.datum ? 1 : -1;
    return String(a.id) < String(b.id) ? 1 : String(a.id) > String(b.id) ? -1 : 0;
  });
}

function serialize(items) {
  return Buffer.from(JSON.stringify({ items: sortItems(items) }, null, 2) + '\n', 'utf8');
}

// Veřejná podoba: jen zveřejněné položky a jen pole, která web potřebuje (žádné návrhy).
function publicItems(items) {
  return items
    .filter((it) => it.publikovano === true)
    .map((it) => ({ id: it.id, datum: it.datum, nadpis: it.nadpis, text: it.text, obrazek: it.obrazek || null, publikovano: true }));
}

// Přečte hlavní soubor, aplikuje `mutate(items)` a uloží; při konfliktu sha (409/422) to jednou zopakuje.
// Potom přepíše veřejný soubor, pokud se jeho obsah změnil (uložení návrhu tak nevyvolá nové nasazení).
async function updateNews(cfg, message, mutate) {
  let result = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const { items, sha } = await readNews(cfg);
    result = mutate(items.map((it) => ({ ...it })));
    const r = await ghPutFile(cfg, MASTER_PATH, serialize(result.items), message, sha);
    if (r.ok) break;
    result = null;
    if (isConflict(r.status) && attempt === 0) {
      console.warn('novinky: konflikt sha při zápisu, zkouším znovu');
      continue;
    }
    throw new Error(`GitHub PUT ${MASTER_PATH} -> ${r.status}`);
  }
  if (!result) throw new Error('GitHub PUT: opakovaný konflikt');
  result.publicChanged = await publishNews(cfg, message);
  return result;
}

// Srovná web/data/novinky.json s hlavním souborem: zapíše jen zveřejněné položky. Vrací true, když se
// veřejný soubor změnil. Hlavní soubor čte vždy znovu (ne z paměti požadavku), aby pomalejší požadavek
// nepřepsal web starším stavem; při konfliktu obě strany načte znovu. Operace je idempotentní, takže
// po nezdařeném zápisu ji dokončí kterýkoli další požadavek (včetně načtení administrace).
async function publishNews(cfg, message, knownItems) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const items = attempt === 0 && knownItems ? knownItems : (await readNews(cfg)).items;
    const wanted = serialize(publicItems(items));
    const existing = await ghGetFile(cfg, PUBLIC_PATH);
    if (existing && existing.content.equals(wanted)) return false;
    const r = await ghPutFile(cfg, PUBLIC_PATH, wanted, `${message} (web)`, existing ? existing.sha : undefined);
    if (r.ok) return true;
    if (isConflict(r.status) && attempt === 0) continue;
    throw new Error(`GitHub PUT ${PUBLIC_PATH} -> ${r.status}`);
  }
  throw new Error('GitHub PUT: opakovaný konflikt (veřejný soubor)');
}

// Zapíše (nebo přepíše) soubor; při konfliktu sha jednou znovu načte sha a zopakuje.
async function putFileRetry(cfg, path, buffer, message) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const existing = await ghGetFile(cfg, path);
    const r = await ghPutFile(cfg, path, buffer, message, existing ? existing.sha : undefined);
    if (r.ok) return;
    if (isConflict(r.status) && attempt === 0) continue;
    throw new Error(`GitHub PUT ${path} -> ${r.status}`);
  }
}

// Smaže soubor, pokud existuje; neúspěch jen zaloguje (osiřelý obrázek nic nerozbije).
async function deleteFileQuiet(cfg, path, message) {
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const existing = await ghGetFile(cfg, path);
      if (!existing) return;
      const r = await ghDeleteFile(cfg, path, existing.sha, message);
      if (r.ok) return;
      if (isConflict(r.status) && attempt === 0) continue;
      throw new Error(`GitHub DELETE ${path} -> ${r.status}`);
    }
  } catch (err) {
    console.error('novinky: smazání souboru selhalo', err && err.message);
  }
}

/* ---------- Validace ---------- */
function str(v, max) {
  if (v === undefined || v === null) return '';
  return String(v).replace(/\r\n?/g, '\n').trim().slice(0, max);
}

function isValidDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s && s >= '2000-01-01' && s <= '2100-12-31';
}

export function validateItem(body) {
  const errors = [];
  const data = {
    id: str(body.id, 60),
    nadpis: str(body.nadpis, 500),
    datum: str(body.datum, 20),
    text: str(body.text, 10000),
    publikovano: body.publikovano,
  };
  if (data.id && !ID_RE.test(data.id)) errors.push('Neplatné označení aktuality.');
  if (data.nadpis.length < 3 || data.nadpis.length > 120) errors.push('Nadpis musí mít 3 až 120 znaků.');
  if (data.text.length < 1 || data.text.length > 5000) errors.push('Text musí mít 1 až 5000 znaků.');
  if (!isValidDate(data.datum)) errors.push('Zadejte prosím platné datum.');
  if (typeof data.publikovano !== 'boolean') errors.push('Chybí údaj, zda aktualitu zveřejnit.');
  return { data, errors };
}

// data URL -> { buffer, ext } ; vyhodí UserError při špatném formátu nebo velikosti.
export function parseImage(dataUrl) {
  if (typeof dataUrl !== 'string') throw new UserError('Obrázek má neplatný formát.');
  const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=\s]+)$/.exec(dataUrl);
  if (!m) throw new UserError('Obrázek musí být JPEG, PNG nebo WebP.');
  const buffer = Buffer.from(m[2], 'base64');
  if (buffer.length < 100) throw new UserError('Obrázek je poškozený.');
  if (buffer.length > MAX_IMAGE_BYTES) throw new UserError('Obrázek je příliš velký (max. 1,5 MB). Zkuste menší fotku.');
  return { buffer, ext: m[1] === 'jpeg' ? 'jpg' : m[1] };
}

function newId(datum) {
  return `${datum}-${randomBytes(4).toString('hex').slice(0, 6)}`;
}

function imageRepoPath(publicPath) {
  // "/data/obrazky/x.jpg" -> "web/data/obrazky/x.jpg"; cizí cesty ignorujeme
  if (typeof publicPath !== 'string' || !publicPath.startsWith(PUBLIC_IMAGE_DIR + '/')) return null;
  const name = publicPath.slice(PUBLIC_IMAGE_DIR.length + 1);
  if (!/^[a-z0-9-]+\.(jpg|png|webp)$/.test(name)) return null;
  return `${IMAGE_DIR}/${name}`;
}

function queryParam(req, name) {
  if (req.query && typeof req.query[name] === 'string') return req.query[name];
  try {
    return new URL(req.url || '', 'http://localhost').searchParams.get(name);
  } catch {
    return null;
  }
}

/* ---------- Operace ---------- */
async function handleGet(cfg, res) {
  const { items } = await readNews(cfg);
  // Načtení administrace zároveň dorovná veřejný soubor, kdyby předchozí zápis skončil v půli
  // (hlavní soubor zapsán, veřejný ne). Neúspěch seznam neblokuje, jen se zaloguje.
  try {
    if (await publishNews(cfg, 'Aktuality: srovnání veřejného souboru', items)) console.warn('novinky: veřejný soubor dorovnán podle hlavního');
  } catch (err) {
    console.error('novinky: dorovnání veřejného souboru selhalo', err && err.message);
  }
  sendJson(res, 200, { ok: true, items: sortItems(items) });
}

async function handlePost(cfg, req, res) {
  const body = await readJson(req, MAX_BODY_BYTES);
  if (!body) throw new UserError(MSG.badRequest);
  const { data, errors } = validateItem(body);
  if (errors.length) throw new UserError(errors.join(' '));

  const hasImageField = Object.prototype.hasOwnProperty.call(body, 'obrazek');
  const newImage = hasImageField && typeof body.obrazek === 'string' ? parseImage(body.obrazek) : null;
  const removeImage = hasImageField && body.obrazek === null;

  const id = data.id || newId(data.datum);
  const isUpdate = Boolean(data.id);
  const label = data.nadpis.length > 60 ? data.nadpis.slice(0, 57) + '…' : data.nadpis;

  // 1) obrázek nahrajeme dřív než JSON, aby web nikdy neodkazoval na chybějící soubor
  let newImagePath = null;
  if (newImage) {
    newImagePath = `${PUBLIC_IMAGE_DIR}/${id}.${newImage.ext}`;
    await putFileRetry(cfg, imageRepoPath(newImagePath), newImage.buffer, `Aktuality: obrázek k „${label}“`);
  }

  // 2) JSON
  let oldImagePath = null;
  const result = await updateNews(cfg, `Aktuality: ${label}`, (items) => {
    const idx = items.findIndex((it) => it.id === id);
    if (isUpdate && idx === -1) throw new UserError('Aktualita nebyla nalezena – možná ji mezitím někdo smazal. Obnovte prosím stránku.', 404);
    const current = idx >= 0 ? items[idx] : { id, obrazek: null };
    oldImagePath = current.obrazek || null;
    let obrazek = current.obrazek || null;
    if (newImagePath) obrazek = newImagePath;
    else if (removeImage) obrazek = null;
    const item = { id, datum: data.datum, nadpis: data.nadpis, text: data.text, obrazek, publikovano: data.publikovano };
    if (idx >= 0) items[idx] = item;
    else items.push(item);
    return { items, item };
  });

  // 3) starý obrázek, který už nic nepoužívá
  if (oldImagePath && oldImagePath !== result.item.obrazek) {
    const repoPath = imageRepoPath(oldImagePath);
    if (repoPath) await deleteFileQuiet(cfg, repoPath, `Aktuality: odstraněn starý obrázek k „${label}“`);
  }

  const message = result.item.publikovano ? SAVED_PUBLIC : (result.publicChanged ? 'Uloženo a skryto. Z webu zmizí do minuty až dvou.' : SAVED_HIDDEN);
  sendJson(res, 200, { ok: true, item: result.item, message });
}

async function handleDelete(cfg, req, res) {
  const id = str(queryParam(req, 'id'), 60);
  if (!ID_RE.test(id)) throw new UserError(MSG.badRequest);

  // Mazání je idempotentní: když položka v hlavním souboru už není (např. opakování po částečném
  // selhání), jen se dorovná veřejný soubor a odpoví se úspěchem.
  let removed = null;
  const result = await updateNews(cfg, `Aktuality: smazáno ${id}`, (items) => {
    const idx = items.findIndex((it) => it.id === id);
    if (idx >= 0) {
      removed = items[idx];
      items.splice(idx, 1);
    }
    return { items };
  });

  const repoPath = imageRepoPath(removed && removed.obrazek);
  if (repoPath) await deleteFileQuiet(cfg, repoPath, `Aktuality: smazán obrázek k ${id}`);

  sendJson(res, 200, { ok: true, message: result.publicChanged ? 'Smazáno. Z webu zmizí do minuty až dvou.' : 'Smazáno.' });
}

/* ---------- Handler ---------- */
export default async function handler(req, res) {
  if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
    sendJson(res, 405, { ok: false, error: MSG.methodNotAllowed }, { Allow: 'GET, POST, DELETE' });
    return;
  }

  const session = getSession(req);
  if (!session) {
    sendJson(res, 401, { ok: false, error: MSG.unauthorized });
    return;
  }
  if (req.method !== 'GET' && !csrfOk(req)) {
    sendJson(res, 403, { ok: false, error: MSG.forbidden });
    return;
  }

  let cfg;
  try {
    cfg = ghConfig();
  } catch (err) {
    console.error('novinky: chybí konfigurace GitHubu –', err && err.message);
    sendJson(res, 500, { ok: false, error: MSG.serverError });
    return;
  }

  try {
    if (req.method === 'GET') await handleGet(cfg, res);
    else if (req.method === 'POST') await handlePost(cfg, req, res);
    else await handleDelete(cfg, req, res);
  } catch (err) {
    if (err instanceof UserError) {
      sendJson(res, err.status, { ok: false, error: err.message });
      return;
    }
    console.error(`novinky: ${req.method} selhal (${session.email})`, err && err.message);
    sendJson(res, 502, { ok: false, error: 'Uložení se nepodařilo. Zkuste to prosím za chvíli znovu; pokud problém trvá, ozvěte se správci webu.' });
  }
}
