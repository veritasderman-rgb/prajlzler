#!/usr/bin/env node
// Skládání společných částí stránek (ikony, lišta, hlavička, patička, společná část <head>).
//
//   node tools/build.mjs          vloží aktuální obsah partials do všech stránek ve web/
//   node tools/build.mjs --check  nic nezapisuje; skončí chybou, když některá stránka neodpovídá
//
// Stránka označí místo pro partial dvojicí komentářů, například:
//   <!-- @header -->  ...cokoli, bude přepsáno...  <!-- /header -->
// Partial se hledá v tools/partials/ nejdřív jako <název>-<jazyk>.html (jazyk z <html lang="…">),
// potom jako <název>.html. V hlavičce dostane odkaz na aktuální stránku (podle <link rel="canonical">)
// atribut aria-current="page". Administrace (admin/) se neskládá, je to samostatná aplikace.
//
// Bez závislostí, jen Node 18+. Po změně partialu spusťte build a změny commitněte – web je statický,
// Vercel nic nebuildí.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PARTIALS = path.join(ROOT, 'tools', 'partials');
const check = process.argv.includes('--check');

const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).sort();
const cache = new Map();

function partial(name, lang) {
  for (const candidate of [`${name}-${lang}.html`, `${name}.html`]) {
    const file = path.join(PARTIALS, candidate);
    if (fs.existsSync(file)) {
      if (!cache.has(file)) cache.set(file, fs.readFileSync(file, 'utf8').trim());
      return cache.get(file);
    }
  }
  throw new Error(`chybí partial „${name}“ pro jazyk „${lang}“ (tools/partials/${name}-${lang}.html ani ${name}.html)`);
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}

let changed = 0;
let failed = 0;
for (const page of pages) {
  const file = path.join(ROOT, page);
  const html = fs.readFileSync(file, 'utf8');
  const lang = (html.match(/<html[^>]*\blang="([a-z]{2})"/) || [])[1] || 'cs';
  const canonical = (html.match(/<link rel="canonical" href="https:\/\/autopraizler\.cz(\/[^"]*)"/) || [])[1] || null;

  const out = html.replace(/<!-- @([a-z][a-z0-9-]*) -->[\s\S]*?<!-- \/\1 -->/g, (m, name) => {
    let body = partial(name, lang);
    if (name === 'header' && canonical) {
      body = body.replace(new RegExp(`(<a href="${escapeRe(canonical)}")(>)`), '$1 aria-current="page"$2');
    }
    return `<!-- @${name} -->\n${body}\n<!-- /${name} -->`;
  });

  if (out !== html) {
    if (check) {
      failed++;
      console.error(`NESOUHLASÍ  ${page} (spusťte node tools/build.mjs)`);
    } else {
      fs.writeFileSync(file, out);
      changed++;
      console.log(`zapsáno     ${page}`);
    }
  }
}

if (check) {
  if (failed) {
    console.error(`\n${failed} stránek není aktuálních.`);
    process.exit(1);
  }
  console.log(`OK  všech ${pages.length} stránek odpovídá partials`);
} else {
  console.log(`hotovo, změněno ${changed} z ${pages.length} stránek`);
}
