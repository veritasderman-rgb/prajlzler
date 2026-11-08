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
├── pneuservis.html               PPC vstupní stránka   (/pneuservis/)
├── klimatizace.html              PPC vstupní stránka   (/klimatizace/)
├── stk.html                      PPC vstupní stránka   (/stk/)
├── de.html                       Německá stránka       (/de/)
├── 404.html                      Stránka nenalezena
├── css/style.css                 jediný stylopis
├── js/main.js                    menu, slider, galerie, formulář, mapa (bez knihoven)
├── js/config.js                  ID pro měření konverzí (výchozí prázdné = měření vypnuté)
├── js/mereni.js                  lišta souhlasu, Consent Mode v2, Google Ads / GA4 / Sklik
├── fonts/                        Audiowide a Coda (woff2, licence OFL.txt)
├── img/                          logo (SVG), fotky provozovny, ilustrační obrázky
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
(při úpravě hlavičky/menu je potřeba upravit všechny HTML soubory; stránka
`de.html` má vlastní německé menu s kotvami). Vstupní stránky služeb a `/de/`
nejsou v hlavním menu – odkazují na ně dlaždice na úvodu („Pneuservis“,
„Klimatizace“, „STK + emise“) a malý přepínač DE/CZ v horní liště.

## Úvodní stránka

- Sekce **„Co říkají zákazníci“**: hodnocení (4,7 ★ Google / 80 recenzí,
  4,9 ★ Firmy.cz / 4. místo v Mariánských Lázních) a tři zkrácené citace.
  Čísla jsou ze dne 2. 10. 2026 a je potřeba je **ručně aktualizovat**
  (označeno HTML komentářem nad sekcí). Hodnocení záměrně není ve
  strukturovaných datech (Google zakazuje vlastní recenze v markupu firmy).
- HTML komentář `<!-- AKTUALITY -->` před galerií je místo pro sekci novinek.
- JSON-LD `AutoRepair` (název, adresa, GPS, telefon, e-mail, otevírací doba,
  odkazy na Facebook a Firmy.cz). Otevírací doba Po–Pá 8–12 a 13–17 odpovídá
  stávajícímu webu, ale **není potvrzená majitelem**.
- `hreflang` cs / de / x-default (stejně na `de.html`).

## Vstupní stránky pro PPC (/pneuservis/, /klimatizace/, /stk/)

Každá má H1 se službou a městem, krátký úvod, 3–5 bodů převzatých jen
z existujících textů webu a ceníku, výřez ceníku, fotku, velké tlačítko
„Zavolat“ a zkrácený poptávkový formulář (stejná pole a chování jako
na Kontaktu, zpráva má předvyplněný placeholder se službou). Texty bodů
neobsahují nic, co by nebylo na stávajícím webu (žádné sliby lhůt, značek
ani záruk). Při změně ceníku je nutné upravit i tabulky na těchto stránkách.

## Německá stránka (/de/)

`de.html` (`<html lang="de">`) je díky `cleanUrls` + `trailingSlash` dostupná
jako `/de/` (ve složce `web/` žádná složka `de/` neexistuje, takže nic
nekoliduje; složka `de/` v kořeni repozitáře jsou jen koncepty, které se
nenasazují). Obsah: pomoc při poruše pro lázeňské hosty (úvod, 4 kroky,
s čím pomáháme, praktické informace, kontakt s otevírací dobou Po–Pá 8–12 a
13–17, So–Ne po telefonické dohodě), německá verze poptávkového formuláře.
Formulář posílá na stejné `/api/kontakt`; protože API vrací české chybové
hlášky, stránka při chybě zobrazí obecnou německou hlášku (atributy
`data-ok` / `data-err` na formuláři). Lišta cookies se na této stránce
zobrazuje německy.

## Pevná lišta s telefonem (mobil)

Na šířce pod 768 px je dole pevná lišta „Zavolat“ (`tel:`) a „Objednat“
(`/kontakt/#formular`, na `/de/` `#anfrage`); `body` má spodní odsazení,
aby lišta nic nepřekrývala, při tisku je skrytá. Markup je v patičce každé
stránky (`<nav class="call-bar">`).

## Měření konverzí (Google Ads, GA4, Sklik) se souhlasem

Výchozí stav: v `js/config.js` jsou všechna ID prázdná → `js/mereni.js`
nic nedělá (žádná lišta, žádné cookies, žádný požadavek na třetí strany).

Zapnutí měření – vyplnit v `js/config.js`:

| Klíč | Kde ho vzít |
|---|---|
| `googleAdsId` | Google Ads → Cíle → Konverze → Značka Google: `AW-123456789` |
| `googleAdsFormLabel` | štítek konverze „Odeslání poptávky“ (část za lomítkem v `send_to`) |
| `googleAdsCallLabel` | štítek konverze „Kliknutí na telefon“ |
| `ga4Id` | Google Analytics 4 → Datové streamy → ID měření `G-XXXXXXXXXX` (nepovinné) |
| `sklikConversionId` | Sklik → Nástroje → Konverze → ID konverze (číslo) |
| `sklikConversionValue` | hodnota konverze v Kč, `0` = bez hodnoty |

Chování po vyplnění alespoň jednoho ID:

- dole se zobrazí lišta souhlasu (Přijmout / Odmítnout / odkaz na zásady),
  volba se ukládá do `localStorage` pod klíčem `ap_consent`;
- Google Consent Mode v2: výchozí stav vše `denied`, po souhlasu `granted`;
- `gtag.js` (Google Ads / GA4) a `rc.js` (Seznam) se načtou **až po souhlasu**;
- konverze: úspěšné odeslání formuláře (`js/main.js` vyvolá událost
  `ap:form-sent`) → Google Ads konverze s `googleAdsFormLabel`, GA4 událost
  `generate_lead`, Sklik `rc.conversionHit({ id, value, consent: 1 })`;
  kliknutí na `tel:` odkaz → Google Ads konverze s `googleAdsCallLabel`,
  GA4 událost `phone_call_click`;
- v patičce se objeví odkaz „Nastavení cookies“, který lištu znovu otevře;
  když návštěvník souhlas odvolá (Odmítnout po dřívějším Přijmout), už
  načtený Google tag dostane `consent update` se vším `denied` a čekající
  konverze Sklik se zahodí.

CSP ve `vercel.json` už povoluje potřebné domény (googletagmanager.com,
google-analytics.com, analytics.google.com, stats.g.doubleclick.net,
googleads.g.doubleclick.net, google.com/.cz, td.doubleclick.net, c.seznam.cz,
h.seznam.cz). Pokud by GA4 posílala data na regionální endpoint
(`region1.google-analytics.com`), je potřeba ho do `connect-src` doplnit.
Popis měření pro návštěvníky je v článku 10 zásad zpracování osobních údajů.

## SEO a GEO (vyhledávače, lokální cílení, AI asistenti)

Web je optimalizovaný pro klasické vyhledávače (Google, Seznam), pro lokální
dotazy typu „pneuservis Mariánské Lázně“ a pro AI asistenty, které odpovídají
s odkazem na zdroj (GEO, generative engine optimization). Všechna fakta
pocházejí z textů webu a ceníku; nic se nedomýšlí.

- **Metadata**: každá stránka má unikátní `<title>` do 60 znaků a popis do
  155 znaků s místem a telefonem, canonical, Open Graph a Twitter card
  (vstupní stránky mají vlastní obrázek), hreflang cs/de na úvodu a `/de/`,
  geo meta (`geo.region`, `geo.position`, `ICBM`).
- **Strukturovaná data** (JSON-LD, `@graph`): úvod `AutoRepair` (adresa, GPS,
  otevírací doba, mapa, katalog služeb, kontaktní místo, jazyky) + `WebSite`
  + `WebPage`; podstránky `BreadcrumbList`; `/pneuservis/`, `/klimatizace/`,
  `/stk/` a `/de/` navíc `Service` a `FAQPage`; `/sluzby/` `ItemList`;
  `/kontakt/` `ContactPage`. Hodnocení (`aggregateRating`) záměrně chybí, Google je u
  vlastních recenzí na webu firmy nepovoluje.
- **Časté dotazy**: viditelné sekce FAQ (rozbalovací `<details>`) na vstupních
  stránkách a na `/de/` odpovídají přesně na otázky, které lidé kladou
  vyhledávačům i AI asistentům; odpovědi vždy obsahují název firmy a místo.
  Stejný obsah je ve `FAQPage`.
- **Ceny záměrně nikde mimo stránku Ceník**: v popisech, FAQ, strukturovaných
  datech, `llms.txt` ani na vstupních stránkách nejsou konkrétní částky. Cena
  je citlivý údaj a stanovuje se až po prohlídce vozu; texty to říkají a
  odkazují na orientační ceník.
- **Interní odkazy**: dlaždice na úvodu, seznam služeb na `/sluzby/` i boxy
  „Další služby“ na vstupních stránkách vedou na `/pneuservis/`,
  `/klimatizace/`, `/stk/`. V patičce každé stránky je adresa, telefon a
  e-mail (konzistentní NAP pro lokální SEO).
- **Pro AI asistenty**: `llms.txt` v kořeni webu shrnuje firmu, služby, ceny,
  otevírací dobu a stránky v prostém Markdownu; `robots.txt` výslovně
  povoluje GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended
  a Applebot (a zakazuje `/api/` a `/admin/`).
- **Technika**: fonty jsou vlastní s `font-display: swap` a preloadem, obrázky
  mají rozměry (žádný posun layoutu), ty pod ohybem `loading="lazy"`, hlavní
  obrázek `fetchpriority="high"`; sitemap má `lastmod` a hreflang alternativy.

Co SEO ještě zlepší, ale vyžaduje rozhodnutí majitele nebo data, která nemáme:
H1 na úvodu „VÁŠ AUTOSERVIS!“ je převzato ze starého webu a klíčové slovo
nenese; založení/aktualizace Firemního profilu Google se stejným NAP a
otevírací dobou; potvrzení otevírací doby; rok založení firmy do schématu;
tvrzení na `/de/` (platba kartou, jazyky personálu, parkování, dvě minuty od
nádraží) nejsou doložena v podkladech a je třeba je s majitelem potvrdit.

## Společné části stránek (hlavička, patička, ikony)

Stránky jsou statické HTML, ale hlavička, horní lišta, patička, sada SVG ikon
a společná část `<head>` jsou jen v `tools/partials/` a do stránek je vkládá
`node tools/build.mjs`. Stránka má místo označené dvojicí komentářů, např.
`<!-- @header --> … <!-- /header -->`; obsah mezi nimi build přepíše.
Partial se hledá jako `<název>-<jazyk>.html` podle `<html lang>` (cs, de, en),
jinak `<název>.html`. Aktivní položku menu (`aria-current`) doplní build podle
`<link rel="canonical">`.

- Změna menu nebo patičky: upravit soubor v `tools/partials/`, spustit
  `node tools/build.mjs`, commitnout změněné stránky i partial.
- `node tools/build.mjs --check` nic nezapisuje, jen ohlásí stránky, které
  neodpovídají partials (hodí se před commitem).
- Administrace (`admin/`) má vlastní hlavičku a do skládání nevstupuje.

## Jazykové verze

Česky je celý web. Německá stránka `/de/` a anglická `/en/` jsou jednostránkové
verze pro hosty lázní (pomoc při poruše, služby, kontakt, formulář) se stejnou
strukturou; mají vlastní hlavičku a patičku (`header-de`, `footer-de`,
`header-en`, `footer-en`), hreflang na úvodu i mezi sebou a přepínač jazyků
v horní liště. Formulář z nich posílá `zpet=/de/` nebo `/en/`, podle toho
`api/kontakt.js` volí jazyk hlášek a stránku pro návrat bez JavaScriptu;
`js/mereni.js` volí jazyk cookie lišty podle `<html lang>`.

## Responzivní obrázky

`python3 tools/obrazky.py` vytvoří k velkým fotkám WebP varianty
(`img/<název>-<šířka>.webp`) a v HTML obalí `<img>` do `<picture>` se `srcset`
a `sizes` podle místa použití (slider 100vw, dlaždice, galerie, vstupní
stránky). Původní JPEG zůstává jako záloha. Po přidání nové fotky stačí
doplnit ji do `VARIANTS` ve skriptu a skript spustit; už obalené obrázky
přeskočí.

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
včetně CSP (mapa Google je povolená v `frame-src` jen na `/kontakt/`; domény
pro měření konverzí jsou povolené všude, viz „Měření konverzí“).

## Kontaktní formulář

- Pole: Jméno*, Email*, Telefon, Požadavek termínu, Zpráva*, souhlas se
  zpracováním OÚ*, skryté pole `website` (honeypot). Stejný formulář je na
  vstupních stránkách služeb a německy na `/de/`; obsluha v `js/main.js`
  funguje pro každý `<form class="form" data-endpoint>` na stránce.
- S JavaScriptem se odesílá JSON na `/api/kontakt` a výsledek se zobrazí na
  stránce. Bez JavaScriptu proběhne běžný POST a funkce přesměruje na
  `/kontakt/?odeslano=1#odeslano` nebo `/kontakt/?chyba=1#chyba` – i z
  vstupních stránek a `/de/`: formuláře posílají skryté pole `zpet`
  (např. `/pneuservis/`) a funkce přesměruje zpět na tuto stránku, pokud je
  v povoleném seznamu (`/kontakt/`, `/pneuservis/`, `/klimatizace/`, `/stk/`,
  `/de/`); jinak na `/kontakt/`. Pro `/de/` vrací funkce hlášky německy.
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

Loga partnerů a značek dílů v `img/partneri/` jsou převzatá ze starého webu
autopraizler.cz (banner Cebia, plaketa ELTMA a 16 log výrobců dílů z karuselu),
kde je majitel už používal. Jde o ochranné známky jejich vlastníků; na webu
jsou jen jako informace, které díly servis používá a s kým spolupracuje.


Fotky provozovny pocházejí z firemního profilu na Googlu a Firmy.cz
(slider 1–3, dlaždice Pneuservis, první dvě fotky galerie, obě fotky na
Kontaktu). Zbylé dlaždice služeb, dvě fotky galerie a ilustrace na Službách
jsou ilustrační obrázky vytvořené pro tento web (bez licencí třetích stran).
Chybí-li některý soubor, skript `tools/placeholders.sh` vytvoří zástupný
JPG/PNG se správnými rozměry. Nové fotky stačí nahrát do `web/img/` pod
těmito názvy:

| Soubor | Rozměr | Kde | Původ |
|---|---|---|---|
| `slider-1.jpg`, `slider-2.jpg`, `slider-3.jpg` | 1920×650 | slider na úvodu | budova v zimě (Firmy.cz), budova z ulice a dílna (Google) |
| `sluzba-pneuservis.jpg` | 900×600 | dlaždice na úvodu a Ceníku | vyvažovačka (Google) |
| `sluzba-klimatizace.jpg`, `sluzba-autoskla.jpg`, `sluzba-diagnostika.jpg`, `sluzba-lakovani.jpg`, `sluzba-stk.jpg` | 900×600 | dlaždice služeb na úvodu, diagnostika i na Ceníku | ilustrační |
| `galerie-1.jpg`, `galerie-2.jpg` | 900×600 | galerie na Úvodu a Ušetřete | vjezdy a dílna (Google) |
| `galerie-3.jpg`, `galerie-4.jpg` | 900×600 | galerie na Úvodu a Ušetřete | ilustrační (autodíly, převodovka) |
| `sluzby-ilustrace.png` | 1024×1024 | prostřední sloupec na Službách | ilustrace |
| `provozovna-1.jpg`, `provozovna-2.jpg` | libovolný | Kontakt | budova a vjezdy (Google) |

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

## Aktuality a jejich správa (/admin/)

Majitel může na web přidávat krátké aktuality (nadpis, datum, text, volitelně
jedna fotka) bez zásahu do kódu. Zveřejněné aktuality se zobrazují na úvodní
stránce (poslední tři, sekce AKTUALITY) a všechny na `/novinky/`.

### Jak to funguje

```
obsah/aktuality/novinky.json      zdroj pravdy: všechny aktuality včetně skrytých (mimo web/, Vercel ho nenasazuje)
web/
├── data/novinky.json             veřejný výpis: jen zveřejněné položky (zapisuje ho funkce api/novinky.js)
├── data/obrazky/<id>.jpg         fotky k aktualitám (zmenšené v prohlížeči na max. 1200 px)
├── js/novinky.js                 veřejný skript: načte /data/novinky.json a vykreslí položky
├── css/novinky.css               styly sekce AKTUALITY a stránky /novinky/
├── novinky.html                  stránka /novinky/ se všemi zveřejněnými aktualitami
├── admin/index.html, admin.js, admin.css   administrace (/admin/), noindex
├── api/admin-login.js            POST – pošle přihlašovací odkaz e-mailem (Resend)
├── api/admin-session.js          POST výměna odkazu za cookie, GET stav, DELETE odhlášení
├── api/novinky.js                GET seznam, POST uložení, DELETE smazání (zápis na GitHub)
└── tools/test-novinky.mjs        testy všech tří funkcí s falešným fetch
```

- Web je statický: `js/novinky.js` si stáhne `/data/novinky.json` (bez cache)
  a vykreslí položky. Soubor obsahuje **jen zveřejněné** aktuality; skryté
  návrhy v něm nejsou, takže je návštěvník nemůže stáhnout. Když žádná
  zveřejněná není, sekce na úvodu zůstane skrytá a stránka vypadá jako dřív.
  Text je prostý (odstavce oddělené prázdným řádkem), vše se escapuje, HTML
  v textu se nevykládá.
- Administrace nemá databázi. Každé uložení zapíše změnu **přímo do
  repozitáře na GitHubu** (REST API `contents`): funkce načte
  `obsah/aktuality/novinky.json` (všechny položky včetně skrytých) včetně
  `sha`, upraví ho a odešle commit `Aktuality: <nadpis>` (autor
  „AutoPraizler web <web@josefpavlovic.cz>“). Potom z něj odvodí veřejný
  `web/data/novinky.json` a zapíše ho dalším commitem `… (web)` – ale jen
  když se jeho obsah změnil; uložení skrytého návrhu tedy web nemění.
  Fotka se uloží jako `web/data/obrazky/<id>.jpg` samostatným commitem před
  JSONem, aby web nikdy neodkazoval na chybějící soubor. Smazání položku
  odstraní z obou JSONů a smaže i soubor fotky.
- Pokud hlavní soubor `obsah/aktuality/novinky.json` neexistuje (první
  nasazení), funkce převezme položky z veřejného souboru a hlavní založí.
- Veřejný soubor se vždy odvozuje z **čerstvě načteného** hlavního souboru,
  ne z dat požadavku, a jeho zápis je idempotentní: když zápis hlavního
  souboru projde a veřejného ne (výpadek GitHubu), dorovná ho kterýkoli
  další požadavek, včetně pouhého načtení seznamu v administraci. Smazání
  už neexistující položky vrací úspěch a jen dorovná veřejný soubor.
- Repozitář je veřejný, takže skryté návrhy jsou technicky vidět na GitHubu
  (a jejich fotky na `/data/obrazky/`, i když na ně web neodkazuje). Na webu
  samotném se nezobrazují. Do aktualit proto nepatří nic důvěrného.
- Vercel po každém commitu web znovu nasadí, změna je tedy na webu zhruba
  do minuty až dvou. Administrace to po uložení majiteli říká.
- Konflikt verzí (někdo mezitím zapsal do stejného souboru, GitHub vrátí
  409/422) funkce řeší tím, že soubor jednou znovu načte a zápis zopakuje.

Identifikátor položky je `RRRR-MM-DD-xxxxxx` (datum založení + náhodná část);
při úpravě se nemění, i když se změní datum.

### Přihlášení (odkaz e-mailem, bez hesla)

1. Majitel na `/admin/` zadá e-mail a klikne na „Poslat přihlašovací odkaz“.
2. Funkce `api/admin-login` odpoví vždy stejně („pokud je adresa povolená,
   poslali jsme odkaz…“), aby se nedalo zjistit, které e-maily mají přístup.
   Odkaz se skutečně pošle (přes Resend) jen adresám z `ADMIN_EMAILS`.
   Omezení: 5 pokusů za hodinu z jedné IP.
3. Odkaz má tvar `${SITE_URL}/admin/?t=<token>`; token je
   `base64url(payload).base64url(HMAC-SHA256(payload, ADMIN_SECRET))`,
   platí 15 minut.
4. Administrace token vymění (`POST /api/admin-session`) za cookie
   `ap_admin` (podepsaná stejně, platnost 30 dní, `HttpOnly; Secure;
   SameSite=Strict; Path=/`) a token z adresy odstraní.
5. Všechny zápisy (`POST`/`DELETE /api/novinky`, odhlášení) vyžadují cookie
   **a** hlavičku `X-Requested-With: ap-admin` **a** `Origin`/`Referer`
   ze stejného hostitele (ochrana proti CSRF). Bez cookie vrací API 401, bez
   hlaviček 403. Hodnoty proměnných prostředí se v odpovědích nikdy neobjeví,
   podrobnosti chyb jdou jen do logu funkcí ve Vercelu.

### Proměnné prostředí (Vercel → Settings → Environment Variables)

| Proměnná | Povinná | Význam |
|---|---|---|
| `ADMIN_SECRET` | ano | Náhodný řetězec **alespoň 32 znaků** pro podpis tokenů a cookie. Vygenerovat např. `openssl rand -base64 48` nebo `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`. Změna odhlásí všechny. |
| `ADMIN_EMAILS` | ano | E-maily, které se smějí přihlásit, oddělené čárkou (velikost písmen nehraje roli), např. `majitel@autopraizler.cz, web@josefpavlovic.cz`. |
| `GITHUB_TOKEN` | ano | Fine-grained personal access token GitHubu (viz níže). |
| `GITHUB_REPO` | ne | `vlastník/repozitář`; výchozí `veritasderman-rgb/prajlzler`. |
| `GITHUB_BRANCH` | ne | Větev, do které se zapisuje a ze které Vercel nasazuje; výchozí `main`. |
| `SITE_URL` | ne | Adresa webu pro odkaz v e-mailu; výchozí `https://autopraizler.cz`. Na preview nasazeních Vercelu se bez `SITE_URL` použije `https://$VERCEL_URL`. |
| `RESEND_API_KEY` | ano | Stejný klíč jako pro kontaktní formulář (odesílání e-mailů). |
| `CONTACT_FROM` | ne | Odesílatel e-mailů; výchozí `AutoPraizler web <web@josefpavlovic.cz>`. |

Bez `ADMIN_SECRET`/`ADMIN_EMAILS` vrací funkce 500 a obecnou hlášku; bez
`GITHUB_TOKEN` jde přihlášení, ale ukládání vrátí 500.

#### Jak vytvořit `GITHUB_TOKEN`

Na GitHubu jako vlastník repozitáře: *Settings → Developer settings →
Personal access tokens → Fine-grained tokens → Generate new token*.

- **Resource owner:** účet/organizace, kde je repozitář (`veritasderman-rgb`).
- **Repository access:** *Only select repositories* → vybrat jen `prajlzler`.
- **Permissions → Repository permissions:** `Contents` = **Read and write**.
  Nic dalšího (Metadata read-only se přidá automaticky).
- **Expiration:** zvolit nejdelší přijatelnou (max. 1 rok); po vypršení je
  nutné token obnovit a ve Vercelu nahradit, jinak ukládání přestane fungovat
  (přihlášení a web běží dál).

Token vložit do Vercelu jako `GITHUB_TOKEN` (Production, případně Preview) a
znovu nasadit. Má-li větev `main` zapnutou ochranu (branch protection), musí
pravidla povolit přímé commity bez pull requestu, jinak GitHub zápis odmítne.

### Jak administraci používá majitel

1. Otevřít `https://autopraizler.cz/admin/` (stránka je `noindex`, v menu
   není). Zadat svůj e-mail, kliknout „Poslat přihlašovací odkaz“.
2. V poště (i ve Spamu) otevřít e-mail „Přihlášení do správy aktualit“ a
   kliknout na tlačítko. Odkaz platí 15 minut; přihlášení pak v daném
   prohlížeči drží 30 dní.
3. **Nová aktualita:** tlačítko „+ Nová aktualita“, vyplnit Nadpis
   (3–120 znaků), Datum (předvyplněné dnešní), Text (do 5000 znaků, odstavce
   oddělit prázdným řádkem), volitelně vybrat Obrázek (fotka z telefonu je
   v pořádku, zmenší se automaticky) a zaškrtnout „Zveřejnit na webu“.
   Bez zaškrtnutí zůstane aktualita skrytá (koncept) a jde zveřejnit později.
4. **Uložit** → hláška „Uloženo. Na webu se objeví do minuty až dvou.“
   Po této době se aktualita objeví na úvodu a na `/novinky/`.
5. **Upravit / Smazat** u položky v seznamu. Smazání se potvrzuje a nelze
   vrátit (zůstane jen v historii Gitu). „Odstranit obrázek“ ve formuláři
   smaže fotku při dalším uložení.
6. **Odhlásit se** vpravo nahoře (smaže cookie v prohlížeči).

### Omezení

- Fotka: JPEG/PNG/WebP, v prohlížeči se zmenší na max. 1200 px šířky
  (JPEG, kvalita 0,82); po zmenšení max. 1,5 MB, jinak funkce uložení odmítne.
  Jedna fotka na aktualitu. Průhledné PNG dostane bílé pozadí.
- V jednu chvíli má editovat **jeden člověk**. Souběžný zápis se jednou
  zopakuje, ale dva lidé, kteří současně upravují tutéž položku, si mohou
  přepsat změny.
- Každé uložení = commit a nové nasazení Vercelu (fotka + JSON = dva commity).
  Hromadné změny tedy raději po jedné a s rozvahou; nasazení trvá ~1 minutu.
- `novinky.json` musí zůstat pod 1 MB (limit contents API GitHubu); to je
  řádově stovky aktualit. Staré položky lze mazat.
- Při lokálním náhledu (`php -S … tools/serve.php`) funkce `/api/*` neběží
  (503), administrace jen zobrazí přihlášení s upozorněním; skutečně
  vyzkoušet jde přes `vercel dev` s nastavenými proměnnými, nebo na preview
  nasazení.
- Hlavička/menu administrace a stránky `/novinky/` je kopie z `index.html`;
  při změně menu je potřeba upravit i `novinky.html` a `admin/index.html`.

### Odebrání nebo změna přístupu

- **Odebrat člověka:** smazat jeho e-mail z `ADMIN_EMAILS` ve Vercelu a znovu
  nasadit (Deployments → Redeploy). Jeho stávající cookie přestane platit
  okamžitě – funkce ověřují e-mail z cookie proti seznamu při každém
  požadavku.
- **Odhlásit úplně všechny** (např. podezření na únik odkazu): změnit
  `ADMIN_SECRET` a znovu nasadit.
- **Ukradený/unikající GitHub token:** na GitHubu token zrušit (*Fine-grained
  tokens → Delete*) a vytvořit nový; ukládání do té doby nefunguje, web běží.
- **Vypnout administraci dočasně:** stačí smazat `ADMIN_EMAILS` (nikdo se
  nepřihlásí) nebo `GITHUB_TOKEN` (přihlášení jde, ukládání ne).

### Testy

```bash
cd web
node tools/test-novinky.mjs
```

Testy používají falešný `fetch` (Resend i GitHub) a falešné proměnné
prostředí: přihlášení povolené/nepovolené, platnost a podpis tokenů, cookie,
CSRF, ukládání s kontrolou odeslaného JSONu a `sha`, opakování při konfliktu,
mazání položky i obrázku, validace.
