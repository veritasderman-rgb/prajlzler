# Návrh WordPress šablony a pluginů (fáze 4)

*Srovnání kandidátů podle kritérií ze zadání. Ceny jsou orientační podle veřejných stránek výrobců (říjen 2026), před nákupem ověřit. Vše níže lze postavit na bezplatných verzích.*

## 1. Kritéria

1. Věrně zopakuje vizuál návrhu: oranžová `#F28C1E`, černá `#1E1E1E`, písmo Barlow / Barlow Condensed, pevná mobilní lišta „Zavolat“ + WhatsApp, karty služeb a recenzí, tisková karta.
2. Blokový editor bez page builderu, aby Jarda zvládl úpravy sám.
3. Vícejazyčnost CZ/DE/EN s `hreflang` a přepínačem jazyků.
4. Rychlost a nízké nároky (sdílený hosting SvetHostingu nebo Forpsi, PHP 8.x, 1 databáze).
5. Zdarma nebo levná licence, česká lokalizace, aktivní vývoj.

## 2. Kandidáti

| | **Twenty Twenty-Five + child theme** | **Kadence** | **Blocksy** | **GeneratePress** |
|---|---|---|---|---|
| Typ | bloková šablona (Full Site Editing), výchozí ve WordPressu | hybridní (klasická + bloky), vlastní bloky Kadence Blocks | hybridní, úpravy přes Customizer | klasická lehká šablona, bloky přes GenerateBlocks |
| Licence | GPL, zdarma, součást WordPressu | zdarma; Pro cca 129 USD/rok (není potřeba) | zdarma; Pro cca 69 USD/rok (není potřeba) | zdarma; Premium cca 59 USD/rok (pro hlavičku a patičku z bloků prakticky potřeba) |
| Barvy, písmo, mobilní lišta | vše přes `theme.json` a CSS v child theme, plně pod naší kontrolou, verzovatelné v repu | přes Customizer + Kadence Blocks; mobilní lišta jen v Pro, nebo vlastní CSS | Customizer; mobilní lišta jen v Pro, nebo vlastní CSS | Customizer; hlavička/patička z bloků jen v Premium |
| Editace pro Jardu | jednotný blokový editor, stejné ovládání pro obsah i vzory; Site Editor pro hlavičku a patičku může být matoucí (lze mu ho skrýt) | blokový editor + Kadence bloky (víc voleb, víc rozhodování) | blokový editor, nastavení vzhledu v Customizeru (dvě místa) | blokový editor, nastavení v Customizeru |
| Závislost na dodavateli | žádná, šablona je od WordPressu, child theme je náš kód | závislost na Kadence Blocks (bez nich se rozpadne rozložení) | závislost na Blocksy companion pluginu | závislost na GenerateBlocks |
| Rychlost | minimální CSS, žádný jQuery | dobrá, ale přidává vlastní CSS/JS | dobrá | nejlepší z klasických |
| Čeština | ano, součást WordPressu | ano (komunitní překlad, částečný) | ano (částečný) | ano |
| Vícejazyčnost | Polylang Free **nestačí**: přepínač jazyků jako blok v Site Editoru a překlad hlavičky, patičky a navigace jsou jen v Polylang Pro. Řešení bez pluginu viz část 3. | Polylang Free funguje (klasická menu a widgety per jazyk) | Polylang Free funguje | Polylang Free funguje |

### Hodnocení

- **Twenty Twenty-Five s vlastním child theme: doporučeno.** Jediná varianta, kde celý vzhled (barvy, Barlow, lišta Zavolat, tisková karta, karty služeb) definuje náš kód ve složce `wp/` v repu, bez prémiového pluginu a bez závislosti na třetí straně. Statický návrh má jeden CSS soubor, který se do `theme.json` + `style.css` child theme přenese skoro 1:1. Jarda pracuje jen v blokovém editoru stránek a ve vzorech; Site Editor mu lze omezit. Háček je vícejazyčnost: s blokovou šablonou Polylang Free neumí přeložit hlavičku a patičku ani vložit přepínač jazyků, proto část 3 navrhuje řešení bez překladového pluginu.
- **Kadence: záložní volba.** Nejpohodlnější, pokud bychom nechtěli psát child theme. Mobilní lišta a některé prvky ale vyžadují Pro nebo vlastní CSS, a Jardův web bude záviset na pluginu Kadence Blocks.
- **Blocksy a GeneratePress:** dobré šablony, ale vzhled žije v Customizeru (druhé místo mimo editor) a hlavičku s mobilní lištou podle návrhu bez placené verze nepostavíme čistě. Pro tento projekt nic nepřinášejí navíc.

## 3. Vícejazyčnost

Rozsah: CZ je výchozí a úplný (9 stránek), DE a EN mají po 3 stránkách (úvod, pomoc v nouzi, kontakt). Nové DE/EN stránky budou vznikat výjimečně.

Omezení zjištěné při revizi (dokumentace Polylangu, 17. 10. 2026): u blokové šablony (Site Editor) je přepínač jazyků jako blok, přepínač v navigačním bloku i překlad šablonových částí (hlavička, patička) dostupný **jen v Polylang Pro**. Ve free verzi zůstává klasická položka menu, widget a PHP funkce `pll_the_languages()`, což u blokové šablony nepomůže.

| Řešení | Cena | Hodnocení |
|---|---|---|
| **Bez překladového pluginu, řešeno v child theme** | zdarma | DE a EN stránky jsou obyčejné stránky pod rodiči `/de/` a `/en/` (stejná struktura jako statický návrh). Child theme má tři šablony stránky (`page`, `page-de`, `page-en`), každá s vlastní hlavičkou, patičkou a mobilní lištou v daném jazyce. Propojení překladů drží jedno pole u stránky (vlastní pole „překlad CZ / DE / EN“), z něj `functions.php` vypisuje `hreflang` a přepínač jazyků. Žádná licence, žádná závislost, Jarda edituje DE/EN stránky stejně jako české. **Doporučeno** pro 6 přeložených stránek. |
| Twenty Twenty-Five + **Polylang Pro** | cca 99 EUR/rok (1 web) | plná integrace se Site Editorem (přepínač, překlad hlavičky a patičky, synchronizovaných vzorů a menu). Smysl má, až kdyby DE/EN verze rostla na desítky stránek nebo přibyl další jazyk. |
| Kadence + Polylang Free | zdarma | funguje, protože Kadence je klasická šablona (menu a texty hlavičky/patičky per jazyk přes Polylang „Strings translation“). Vzhled ale žije v Customizeru a hlavička s mobilní lištou podle návrhu by vyžadovala Kadence Pro nebo vlastní CSS. Záložní varianta, pokud by child theme nebylo žádoucí. |
| WPML | cca 99 EUR/rok | zbytečně silný a placený pro 9 stránek |
| TranslatePress | free jen 1 jazyk navíc | potřebujeme 2 jazyky navíc, tedy placená verze |

Postup u doporučeného řešení: rodičovské stránky `/de/` a `/en/` jsou zároveň DE a EN úvod; podstránky `/de/hilfe/`, `/de/kontakt/`, `/en/help/`, `/en/contact/`. Šablona `page-de` / `page-en` se přiřadí při založení stránky (předpřipravíme). Stránky bez překladu (Služby, Ceník, O nás, Recenze) `hreflang` nedostanou. Atribut `lang` dokumentu se nastaví podle šablony. Otevírací doba a kontakt v DE/EN patičce jsou samostatné synchronizované vzory „Kontaktní údaje DE“ a „Kontaktní údaje EN“ (tři vzory místo jednoho, při změně doby se upraví tři místa; při 3 jazycích přijatelné).

## 4. Minimální sada pluginů

| Účel | Plugin | Verze | Proč tento |
|---|---|---|---|
| Formulář poptávky | **Contact Form 7** nebo **WPForms Lite** | zdarma | CF7 je nejlehčí a česky lokalizovaný; WPForms Lite má pohodlnější editor pro Jardu. Vybrat při stagingu, ne oba. |
| Antispam formuláře | **Cloudflare Turnstile** (plugin „Simple Cloudflare Turnstile“) nebo honeypot v CF7 (Flamingo není nutné) | zdarma | bez reCAPTCHA a bez sledování uživatelů |
| SEO (title, description, sitemapa) | **Rank Math (free)** nebo **Yoast SEO (free)** | zdarma | jen na title, meta description, sitemapu a Open Graph. **Modul schema v pluginu vypnout**: strukturovaná data `AutoRepair` generuje výhradně child theme (viz níže), aby na stránce nebyly dva zdroje s různými údaji. Rank Math by uměl AutoRepair i sám (modul Local SEO ve free verzi), ale pak by musel být jediným zdrojem a údaje (otevírací doba, telefon) by Jarda spravoval v nastavení pluginu místo ve vzoru. Volba zdroje schema je tedy buď/anebo; doporučeno child theme. |
| Cache | **WP Super Cache** nebo cache hostingu | zdarma | na malém webu stačí; LiteSpeed Cache jen pokud hosting běží na LiteSpeed |
| Zálohy | **UpdraftPlus (free)** | zdarma | záloha do Google Drive / e-mailu, jednoduché obnovení; **zálohy nikdy do repa** |
| Bezpečnost | **Wordfence (free)** nebo pouze **Limit Login Attempts Reloaded** | zdarma | Wordfence je už na starém webu a Jarda ho zná; lehčí volba je LLAR + aktualizace |
| Přesměrování | **Redirection** | zdarma | 301 ze starých URL (`/usetrete/`, `/ahoj-vsichni/`, obě PDF z `/wp-content/uploads/…`, viz `docs/obsahova-mapa.md`); alternativně `.htaccess`/nginx pravidla, ale na SvetHostingu je nginx bez přístupu ke konfiguraci |
| SVG logo | **Safe SVG** | zdarma | WordPress jinak SVG nepřijme; nebo logo jako PNG a plugin vynechat |

Celkem 6 až 7 pluginů (bez překladového pluginu). Vynechat: page buildery, slidery, popupy (WP Popups Lite ze starého webu), cookie lištu, pokud web nebude mít analytiku ani cookies třetích stran (mapu Google vložit až po kliknutí, nebo nahradit statickým obrázkem s odkazem).

Nepoužívat: Enfold (licence autora starého webu), All in One SEO (nahrazuje Rank Math), Complianz (není potřeba bez cookies).

## 5. Nároky na hosting (vstup pro rozhodnutí ve fázi 1)

PHP 8.1 nebo novější, MySQL 5.7+/MariaDB 10.4+, 1 databáze, cca 200 MB místa (WordPress 70 MB + fotky), HTTPS, cron přes WP-Cron (skutečný cron není nutný). Všechny tarify SvetHostingu i Forpsi Easy Hosting Linux to splňují; Forpsi Hosting Basic nutno ověřit.

## 6. Co bude v repu ve složce `wp/` (fáze 5)

```
wp/
  themes/autopraizler/        child theme Twenty Twenty-Five
    style.css                 hlavička child theme + CSS z assets/css/style.css
    theme.json                barvy, písma Barlow, rozestupy
    functions.php             enqueue, povolení SVG pro admina, schema.org AutoRepair (jediný zdroj schema na webu), hreflang a přepínač jazyků z pole „překlad“, omezení Site Editoru
    patterns/                 vzory: karta služby, karta recenze, krok, FAQ, tabulka ceníku, výzva Zavolat
    parts/                    hlavička, patička, mobilní lišta, každá v CZ, DE a EN variantě
    templates/                page, page-de, page-en, page-karta-pro-recepce (tisk)
  README.md                   jak nasadit na staging a produkci
```

Žádné `wp-config.php`, žádné exporty databáze (`.gitignore` to už hlídá).

## 7. Doporučení ke schválení

1. Šablona **Twenty Twenty-Five + child theme `autopraizler`** v repu.
2. Vícejazyčnost **bez překladového pluginu**: DE/EN jako stránky pod `/de/` a `/en/` s vlastními šablonami, `hreflang` a přepínač z child theme. Polylang Pro jen jako budoucí varianta, kdyby DE/EN rostlo.
3. Pluginy: Contact Form 7 (nebo WPForms Lite), Simple Cloudflare Turnstile, Rank Math (modul schema vypnutý), WP Super Cache, UpdraftPlus, Redirection, Safe SVG. Schema `AutoRepair` výhradně z child theme. Bezpečnost: Wordfence free, pokud Jarda chce zachovat, co zná; jinak Limit Login Attempts Reloaded.
4. Žádný page builder, žádný slider, žádná cookie lišta.
