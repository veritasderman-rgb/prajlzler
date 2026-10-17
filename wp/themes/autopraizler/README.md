# AutoPraizler – child theme Twenty Twenty-Five

Bloková šablona (Full Site Editing) pro web autoservisu AutoPraizler M.L. Přenáší statický návrh z kořene repozitáře (`index.html`, `assets/css/style.css`) do WordPressu tak, aby majitel (Jarda, role Editor) upravoval texty v blokovém editoru a vzhled zůstal pod kontrolou kódu v repu.

Požadavky: WordPress 6.7+ (testováno na 7.1), PHP 8.1+, nainstalovaná rodičovská šablona Twenty Twenty-Five.

## Co šablona obsahuje

```
style.css            hlavička šablony + CSS komponent z návrhu (karty, hero, hlavička, mobilní lišta, tisk)
theme.json           paleta (oranžová #f28c1e, černá #1e1e1e, neutrály), písma Barlow, velikosti, rozestupy,
                     šířka obsahu 1180 px, vypnuté vlastní barvy/přechody/duotone, seznam šablon a částí
functions.php        jen require souborů z inc/
inc/setup.php        načtení stylů (web i editor), kategorie vzorů, styly tlačítek, vazba "© rok",
                     schování vzorů Twenty Twenty-Five z inserteru, favicon ze šablony
inc/locale.php       přepnutí locale na de_DE / en_US pro cesty /de/ a /en/, <html lang>
inc/translations.php meta pole překladů, hreflang, jazyk stránky, automatická šablona page-de / page-en
inc/schema.php       schema.org AutoRepair (JSON-LD) na české úvodní stránce – jediný zdroj schema na webu
inc/admin.php        metabox Překlady stránky, menu Vzory pro editora, zákaz Site Editoru, noindex karty
inc/svg.php          SVG upload jen pro administrátora + kontrola na skripty
blocks/language-switcher/  blok "Přepínač jazyků CZ / DE / EN" (vykresluje server, render.php)
templates/           page, page-de, page-en, page-karta-pro-recepce (tisk, bez hlavičky a patičky), 404
parts/               header, footer, mobile-bar – každý v CZ, DE a EN variantě
patterns/            vzory (kategorie "AutoPraizler"), viz níže
assets/fonts/        Barlow a Barlow Condensed (woff2, latin + latin-ext) + licence OFL.txt
assets/img/          logo, bílý nápis do patičky, favicon, QR kódy pro kartu
assets/css/print-card.css, assets/js/print.js   tisk karty pro recepce (A5 na šířku)
```

Šablony `index.html`, `single.html`, `archive.html`, `search.html` se dědí z Twenty Twenty-Five (web nemá příspěvky, blog se nepoužívá). Úvodní stránka je obyčejná stránka nastavená v Nastavení → Čtení, používá `page.html`.

## Kdo co upravuje

### Jarda (role Editor) v blokovém editoru

- **Stránky** (menu Stránky): veškerý obsah. Nadpis H1 je součástí obsahu (vzor „Hero úvodní stránky“ nebo nadpis v první sekci), šablona ho nevypisuje zvlášť.
- **Vzory** (menu Vzory, odkaz vede na seznam synchronizovaných vzorů): texty, které se opakují na více stránkách. Postup při stavbě webu: vložit vzor ze šablony (např. „Kontaktní údaje“), označit vložené bloky → tři tečky → „Vytvořit vzor“ → zapnout **Synchronizováno**. Pak se upravuje na jednom místě a změna se projeví všude. Podle obsahové mapy takto: Kontaktní údaje, Otevírací doba, Výzva Zavolat, Pásmo DE/EN, Důvěra v číslech.
- **Překlady stránky**: panel v postranním sloupci editoru stránky (viz níže).

Vzory v inserteru (kategorie **AutoPraizler**):

| Vzor | Použití |
|---|---|
| Hero úvodní stránky | tmavé pásmo s H1 a dvěma vstupními kartami; fotku pozadí nastavit u skupiny v panelu Pozadí |
| Dvě vstupní karty | „Jsem na cestách“ / „Jsem z Mariánek“ |
| Důvěra v číslech | 4,7 ★ · 15 let · 3,3 m · 2 min |
| Karta služby | nadpis + věty + volitelný seznam; karty se vkládají do skupiny s rozložením **Mřížka** |
| Karta recenze | hvězdy, citace, jméno · zdroj, volitelná odpověď majitele |
| Krok postupu | číslo, nadpis, věta (číslo se přepisuje ručně) |
| FAQ položka | rozbalovací otázka a odpověď |
| Tabulka ceníku | nadpis kategorie + tabulka služba / cena již od |
| Kontaktní údaje | telefon, WhatsApp, e-mail, adresa, GPS, tlačítka Navigovat |
| Otevírací doba | tabulka Po–Čt / Pá / So–Ne |
| Pásmo DE/EN pro hosty | oranžové pásmo s odkazy na německou a anglickou pomoc |
| Výzva Zavolat | závěrečné pásmo s tlačítky Zavolat a WhatsApp |
| Galerie 2×2 | čtyři fotky 4:3 |
| Karta pro recepce (tisk) | obsah stránky s tiskovou kartou |

Sekce stránky je vždy **Skupina** zarovnaná „na celou šířku“ s vnitřním odsazením „Sekce“ (nebo „Sekce úzká“) a barvou pozadí Písková / Černá / Oranžový přechod. Text na černém a oranžovém pozadí se obarví sám.

Styly tlačítek: výchozí (oranžové), Obrysové, Tmavé, Obrysové světlé (na tmavém pozadí), WhatsApp (zelené s ikonou). Tlačítko s třídou `btn-phone` (Pokročilé → Další třídy CSS) dostane ikonu telefonu.

### Správce webu (Site Editor, soubory v repu)

Hlavička, patička a mobilní lišta Zavolat + WhatsApp (části šablony `parts/`), šablony stránek, barvy a písma (`theme.json`), CSS, PHP. Jarda na Site Editor nemá oprávnění (role Editor nemá `edit_theme_options`; `inc/admin.php` to navíc hlídá). Změny dělat v repu a nahrát na server, ne v Site Editoru: úpravy uložené v Site Editoru se ukládají do databáze a přebíjejí soubory šablony.

Texty v hlavičce a patičce (telefon, otevírací doba, menu) jsou ve vzorech `patterns/hlavicka*.php` a `patterns/paticka*.php`.

## Vícejazyčnost CZ / DE / EN (bez pluginu)

- Česká větev je výchozí. Německé stránky jsou podstránky rodičovské stránky se slugem **`de`** (`/de/`, `/de/hilfe/`, `/de/kontakt/`), anglické pod **`en`** (`/en/`, `/en/help/`, `/en/contact/`). Rodičovská stránka je zároveň úvod daného jazyka.
- Šablony **Stránka DE** / **Stránka EN** (`page-de.html`, `page-en.html`) mají německou/anglickou hlavičku, patičku a lištu. Stránky pod `/de/` a `/en/` ji dostanou automaticky (filtr `page_template_hierarchy`); rodiče `de` a `en` ji mají od WordPressu podle slugu. V editoru ji lze také vybrat ručně v panelu Šablona.
- Pro cesty `/de/…` a `/en/…` se přepne locale celého požadavku na `de_DE` / `en_US` (`switch_to_locale`), takže řetězce jádra a pluginů jsou v jazyce stránky. Jazykové balíčky de_DE a en_US doinstalovat v Nastavení → Obecné (dočasně přepnout jazyk webu a vrátit zpět na češtinu, nebo `wp language core install de_DE en_US`).
- **Propojení překladů**: na stránce v panelu **Překlady stránky** vybrat stejnou stránku v ostatních jazycích. Stačí vyplnit z jedné strany (typicky na české stránce DE a EN), opačný směr i vazba DE↔EN přes českou stránku se dohledají samy. Pole se ukládají jako meta `ap_translation_cs|de|en` (ID stránky).
- Z propojení se tvoří `<link rel="alternate" hreflang="cs|de|en|x-default">` (x-default = česká verze) a blok **Přepínač jazyků** v hlavičce. Stránka bez překladu hreflang nemá a přepínač vede na úvod daného jazyka (`/`, `/de/`, `/en/`).

### Jak přidat novou DE/EN stránku

1. Stránky → Vytvořit. V panelu Stránka → Rodičovská stránka vybrat **de** (nebo **en**), slug zvolit v daném jazyce (`kontakt`, `contact`).
2. Šablona se přiřadí sama; kontrola: panel Šablona má ukazovat „Stránka DE“ / „Stránka EN“.
3. Na české stránce (nebo na nové) v panelu **Překlady stránky** vybrat protějšek.
4. Odkaz do menu DE/EN hlavičky doplní správce v `patterns/hlavicka-de.php` / `hlavicka-en.php` (menu DE a EN má jen Pannenhilfe / Leistungen / Kontakt, resp. Breakdown help / Services / Contact).

## Karta pro recepce

Stránka se slugem `karta-pro-recepce` dostane šablonu bez hlavičky, patičky a lišty automaticky (nebo ručně šablona „Karta pro recepce (tisk)“). Obsah = vzor „Karta pro recepce (tisk)“. Stránka má `noindex` (filtr `wp_robots`) a při tisku se použije A5 na šířku (`assets/css/print-card.css`). Tlačítko Vytisknout je odkaz s třídou `ap-print` (obsluhuje `assets/js/print.js`).

## Schema.org

`inc/schema.php` vypisuje JSON-LD `AutoRepair` jen na české úvodní stránce. Je to jediný zdroj strukturovaných dat na webu; v SEO pluginu modul schema vypnout. Otevírací doba v něm je **nepotvrzená** (otázka č. 1 v `docs/obsahova-mapa.md`), po potvrzení upravit ve `inc/schema.php`, ve vzoru Otevírací doba a ve třech patičkách (`patterns/paticka*.php`). Jako `image` je zatím logo; po potvrzení původu fotek nahradit fotkou budovy (otázka č. 10).

## Písma

Barlow a Barlow Condensed se servírují ze šablony (`assets/fonts/`, deklarace `fontFace` v `theme.json`), web za běhu nevolá Google Fonts. Licence SIL Open Font License 1.1 je v `assets/fonts/OFL.txt`. Nové stažení (např. jiné řezy): `sh wp/tools/fetch-fonts.sh` – skript stáhne woff2 z Google Fonts přes CSS API s UA prohlížeče Chrome a vypíše `unicode-range`, který musí odpovídat hodnotám v `theme.json`.

## SVG

Logo a QR kódy jsou součástí šablony, nahrávat je do médií není nutné. Pokud bude třeba nahrát SVG do knihovny médií, smí to jen administrátor; soubor se odmítne, když obsahuje `<script>` nebo jiný aktivní obsah (`inc/svg.php`). Pro SVG z cizích zdrojů použít plugin Safe SVG.

## Co se liší od statického návrhu

- Ikony v nadpisech karet služeb (inline SVG) nejsou: nadpis bloku ikonu neunese, karta je jen nadpis + text.
- Menu se na mobilu otevírá přes blok Navigace WordPressu (tlačítko Menu), přepínač jazyků stojí vedle něj v hlavičce, ne uvnitř rozbaleného menu.
- Mapa Google není součástí vzorů (GDPR, viz `docs/navrh-sablony.md`): místo iframe je v sekci kontaktu fotka a tlačítka Navigovat / Mapy.com. Iframe lze vložit blokem Vlastní HTML, až bude rozhodnuto o cookie liště.
- Rok v patičce dodává vazba bloku `autopraizler/copyright` (není potřeba JavaScript).
