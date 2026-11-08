# Web autopraizler.cz – statická verze pro Vercel

Rekonstrukce původního webu autopraizler.cz (struktura, texty a vzhled podle
`obsah/puvodni/stary-web-2026-11-08-struktura.md`) jako statický web s jednou
serverless funkcí pro kontaktní formulář. Kód, CSS, ikony ani grafika se
z původní šablony (Enfold) nepřebírají – vše je napsané znovu.

## Struktura

```
web/
├── index.html                    Úvod                  (/)
├── sluzby.html                   Služby                (/sluzby/)
├── usetrete.html                 Ušetřete za servis    (/usetrete/)
├── cenik.html                    Ceník (HTML tabulka)  (/cenik/)
├── kontakt.html                  Kontakt + formulář    (/kontakt/)
├── ochrana-osobnich-udaju.html   Zásady zpracování OÚ  (/ochrana-osobnich-udaju/)
├── 404.html                      Stránka nenalezena
├── css/style.css                 jediný stylopis
├── js/main.js                    menu, slider, galerie, formulář, mapa (bez knihoven)
├── fonts/                        Audiowide a Coda (woff2, licence OFL.txt)
├── img/                          logo (SVG), fotky, zástupné obrázky
├── dokumenty/                    orientacni-cenik-2026.pdf, zasady-zpracovani-osobnich-udaju.pdf
├── api/kontakt.js                serverless funkce (Vercel, Node 20+, ESM)
├── tools/placeholders.sh         vygeneruje zástupné obrázky, pokud chybí
├── tools/serve.php               router pro lokální náhled s hezkými URL
├── tools/test-api.mjs            testy funkce api/kontakt.js (bez odeslání e-mailu)
├── vercel.json                   cleanUrls, trailingSlash, 301 přesměrování, bezpečnostní hlavičky
├── package.json                  {"type":"module"} kvůli ESM ve funkci
├── robots.txt, sitemap.xml
└── README.md
```

Stránky jsou samostatné HTML soubory se sdílenou hlavičkou a patičkou
(při úpravě hlavičky/menu je potřeba upravit všech sedm souborů).

## Lokální náhled

Nejjednodušší (odkazy typu `/sluzby/` ale nefungují, stránky otevírejte jako `/sluzby.html`):

```bash
cd web
python3 -m http.server 8090
```

S hezkými URL jako na Vercelu (doporučeno):

```bash
cd web
php -S localhost:8090 tools/serve.php
```

Router mapuje `/sluzby/` → `sluzby.html`, neexistující URL vrací `404.html`.
Volání `/api/kontakt` lokální PHP server neobslouží (vrátí 503) – serverless
funkci lze spustit jen přes `vercel dev` ve složce `web/`.

Testy funkce (falešný `fetch`, nic se neodesílá):

```bash
cd web
node tools/test-api.mjs
```

## Nasazení na Vercel

1. Ve Vercelu založit projekt z tohoto repozitáře.
2. **Root Directory** nastavit na `web`. Framework Preset: *Other*, bez build
   příkazu (statické soubory + složka `api/`).
3. Nastavit proměnné prostředí (Settings → Environment Variables):

   | Proměnná | Povinná | Význam |
   |---|---|---|
   | `RESEND_API_KEY` | ano | API klíč služby Resend (resend.com) |
   | `CONTACT_TO` | ano | e-mail, kam chodí poptávky (např. `servis@autopraizler.cz`) |
   | `CONTACT_FROM` | ne | odesílatel; výchozí `AutoPraizler web <web@josefpavlovic.cz>` |

   Bez `RESEND_API_KEY` nebo `CONTACT_TO` vrací funkce 500 a obecnou českou
   hlášku; podrobnosti jde jen do logu. Klíče nikdy nepatří do repozitáře.
4. Připojit doménu autopraizler.cz (DNS u Forpsi – MX záznamy pro e-mail
   nechat beze změny, měnit jen A/CNAME pro web).

`vercel.json` zajišťuje hezké URL s lomítkem na konci (`/sluzby/`), 301
přesměrování starých cest (`/wp-content/uploads/.../Orientacni-cenik-2026.pdf`,
PDF zásad, `/ahoj-vsichni/`, `/zkusebni-stranka/`) a bezpečnostní hlavičky
včetně CSP (mapa Google je povolená v `frame-src` jen na `/kontakt/`).

## Kontaktní formulář

- Pole: Jméno*, Email*, Telefon, Požadavek termínu, Zpráva*, souhlas se
  zpracováním OÚ*, skryté pole `website` (honeypot).
- S JavaScriptem se odesílá JSON na `/api/kontakt` a výsledek se zobrazí na
  stránce. Bez JavaScriptu proběhne běžný POST a funkce přesměruje na
  `/kontakt/?odeslano=1#odeslano` nebo `/kontakt/?chyba=1#chyba`.
- Funkce validuje (jméno 2–100 znaků, platný e-mail, zpráva 5–3000 znaků,
  souhlas, prázdný honeypot), escapuje HTML, omezuje počet požadavků
  (5 za 10 minut z jedné IP; počítadlo je v paměti instance) a posílá
  e-mail přes REST API Resendu s `reply_to` nastaveným na e-mail odesílatele.

### Přepnutí odesílání na vlastní doménu majitele

Výchozí odesílatel `web@josefpavlovic.cz` je dočasné řešení. Až bude doména
autopraizler.cz ověřená v Resendu:

1. V Resendu přidat doménu `autopraizler.cz` (Domains → Add) a do DNS u Forpsi
   doplnit záznamy, které Resend vypíše (DKIM TXT, případně SPF/Return-Path).
   Stávající MX záznamy se nemění.
2. Po ověření nastavit ve Vercelu `CONTACT_FROM` na např.
   `AutoPraizler web <web@autopraizler.cz>` a znovu nasadit (nebo jen
   restartovat funkce – proměnné se načítají při startu).
3. Volitelně vytvořit nový API klíč omezený jen na odesílání a nahradit
   `RESEND_API_KEY`.

## Obrázky

Všechny fotografie kromě dvou snímků provozovny jsou **vygenerované umělou
inteligencí** (ilustrační) – patička to uvádí a alt texty končí
„(ilustrační foto, AI)“. Dokud finální obrázky nejsou k dispozici, skript
`tools/placeholders.sh` vytvoří zástupné JPG/PNG se správnými rozměry
(jen pokud soubor neexistuje). Finální soubory stačí nahrát do `web/img/`
pod těmito názvy:

| Soubor | Rozměr | Kde |
|---|---|---|
| `slider-1.jpg`, `slider-2.jpg`, `slider-3.jpg` | 1920×650 | slider na úvodu |
| `sluzba-pneuservis.jpg`, `sluzba-klimatizace.jpg`, `sluzba-autoskla.jpg`, `sluzba-diagnostika.jpg`, `sluzba-lakovani.jpg`, `sluzba-stk.jpg` | 900×600 | dlaždice služeb na úvodu, dvě z nich i na Ceníku |
| `galerie-1.jpg` … `galerie-4.jpg` | 900×600 | galerie na Úvodu a Ušetřete |
| `sluzby-ilustrace.png` | 1200×1200 | prostřední sloupec na Službách |
| `provozovna-1.jpg`, `provozovna-2.jpg` | libovolný | **skutečné fotky budovy** (kopie `assets/img/budova-ulice.jpg` a `vjezdy-dilny.jpg`) |

Loga: `img/autopraizler-wordmark-white.svg` (hlavička), `favicon.svg`,
`autopraizler-logo.svg`, `autopraizler-mark.svg` – vlastní vektory z `assets/logo/`.

Značky dílů jsou jen textové odznaky (žádná cizí loga). Boxy Cebia a ELTMA
jsou textové s původním zněním a odkazy; oficiální bannery lze doplnit, až bude
partnerství potvrzené (místo je označené HTML komentářem v `index.html`).

## Písma

Audiowide (nadpisy) a Coda (text) jsou z Google Fonts pod licencí SIL OFL 1.1,
uložené lokálně ve `fonts/` (podmnožiny latin + latin-ext), licence ve
`fonts/OFL.txt`. Web za běhu nic nestahuje z Googlu; mapa se načte až po
kliknutí na „Zobrazit mapu“.
