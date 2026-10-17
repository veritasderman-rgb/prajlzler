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
| Vícejazyčnost | Polylang funguje; Site Editor části (hlavička/patička) se překládají přes vzory | Polylang funguje | Polylang funguje | Polylang funguje |

### Hodnocení

- **Twenty Twenty-Five s vlastním child theme: doporučeno.** Jediná varianta, kde celý vzhled (barvy, Barlow, lišta Zavolat, tisková karta, karty služeb) definuje náš kód ve složce `wp/` v repu, bez prémiového pluginu a bez závislosti na třetí straně. Statický návrh má jeden CSS soubor, který se do `theme.json` + `style.css` child theme přenese skoro 1:1. Jarda pracuje jen v blokovém editoru stránek a ve vzorech; Site Editor mu lze omezit.
- **Kadence: záložní volba.** Nejpohodlnější, pokud bychom nechtěli psát child theme. Mobilní lišta a některé prvky ale vyžadují Pro nebo vlastní CSS, a Jardův web bude záviset na pluginu Kadence Blocks.
- **Blocksy a GeneratePress:** dobré šablony, ale vzhled žije v Customizeru (druhé místo mimo editor) a hlavičku s mobilní lištou podle návrhu bez placené verze nepostavíme čistě. Pro tento projekt nic nepřinášejí navíc.

## 3. Vícejazyčnost

| Řešení | Cena | Hodnocení |
|---|---|---|
| **Polylang (free)** | zdarma | překládá stránky, menu, vzory a média; `hreflang` generuje sám; URL `/de/`, `/en/` jako adresářový prefix (odpovídá návrhu); přepínač jazyků jako blok. **Doporučeno.** |
| WPML | cca 99 EUR/rok | zbytečně silný a placený pro 9 stránek |
| TranslatePress | free omezený na 1 jazyk navíc | potřebujeme 2 jazyky navíc, tedy placená verze |
| Bez pluginu: DE/EN jako obyčejné stránky `/de/…` | zdarma | nejjednodušší, ale `hreflang` a přepínač ručně v child theme; při 6 přeložených stránkách by to šlo, Polylang je ale pro Jardu přehlednější |

Postup s Polylangem: jazyky cs (výchozí, bez prefixu), de, en; URL jako adresář; stránky bez překladu (Služby, Ceník, O nás, Recenze) zůstanou jen česky a `hreflang` se na ně negeneruje.

## 4. Minimální sada pluginů

| Účel | Plugin | Verze | Proč tento |
|---|---|---|---|
| Formulář poptávky | **Contact Form 7** nebo **WPForms Lite** | zdarma | CF7 je nejlehčí a česky lokalizovaný; WPForms Lite má pohodlnější editor pro Jardu. Vybrat při stagingu, ne oba. |
| Antispam formuláře | **Cloudflare Turnstile** (plugin „Simple Cloudflare Turnstile“) nebo honeypot v CF7 (Flamingo není nutné) | zdarma | bez reCAPTCHA a bez sledování uživatelů |
| SEO + schema | **Rank Math (free)** nebo **Yoast SEO (free)** | zdarma | Rank Math má v bezplatné verzi modul Local SEO s typem podniku AutoRepair; Yoast ho nabízí až v placeném doplňku Local SEO. Proto **Rank Math**. Alternativa: schema natvrdo v child theme z `index.html` a SEO plugin jen na title/description/sitemapu. |
| Vícejazyčnost | **Polylang** | zdarma | viz výše |
| Cache | **WP Super Cache** nebo cache hostingu | zdarma | na malém webu stačí; LiteSpeed Cache jen pokud hosting běží na LiteSpeed |
| Zálohy | **UpdraftPlus (free)** | zdarma | záloha do Google Drive / e-mailu, jednoduché obnovení; **zálohy nikdy do repa** |
| Bezpečnost | **Wordfence (free)** nebo pouze **Limit Login Attempts Reloaded** | zdarma | Wordfence je už na starém webu a Jarda ho zná; lehčí volba je LLAR + aktualizace |
| Přesměrování | **Redirection** | zdarma | 301 ze starých URL (`/usetrete/`, `/ahoj-vsichni/`); alternativně `.htaccess`/nginx pravidla, ale na SvetHostingu je nginx bez přístupu ke konfiguraci |
| SVG logo | **Safe SVG** | zdarma | WordPress jinak SVG nepřijme; nebo logo jako PNG a plugin vynechat |

Celkem 7 až 8 pluginů. Vynechat: page buildery, slidery, popupy (WP Popups Lite ze starého webu), cookie lištu, pokud web nebude mít analytiku ani cookies třetích stran (mapu Google vložit až po kliknutí, nebo nahradit statickým obrázkem s odkazem).

Nepoužívat: Enfold (licence autora starého webu), All in One SEO (nahrazuje Rank Math), Complianz (není potřeba bez cookies).

## 5. Nároky na hosting (vstup pro rozhodnutí ve fázi 1)

PHP 8.1 nebo novější, MySQL 5.7+/MariaDB 10.4+, 1 databáze, cca 200 MB místa (WordPress 70 MB + fotky), HTTPS, cron přes WP-Cron (skutečný cron není nutný). Všechny tarify SvetHostingu i Forpsi Easy Hosting Linux to splňují; Forpsi Hosting Basic nutno ověřit.

## 6. Co bude v repu ve složce `wp/` (fáze 5)

```
wp/
  themes/autopraizler/        child theme Twenty Twenty-Five
    style.css                 hlavička child theme + CSS z assets/css/style.css
    theme.json                barvy, písma Barlow, rozestupy
    functions.php             enqueue, povolení SVG pro admina, schema.org AutoRepair, omezení Site Editoru
    patterns/                 vzory: karta služby, karta recenze, krok, FAQ, tabulka ceníku, výzva Zavolat
    parts/                    hlavička, patička, mobilní lišta
    templates/                page, page-karta-pro-recepce (tisk)
  README.md                   jak nasadit na staging a produkci
```

Žádné `wp-config.php`, žádné exporty databáze (`.gitignore` to už hlídá).

## 7. Doporučení ke schválení

1. Šablona **Twenty Twenty-Five + child theme `autopraizler`** v repu.
2. Vícejazyčnost **Polylang free**, URL `/de/` a `/en/`.
3. Pluginy: Contact Form 7 (nebo WPForms Lite), Simple Cloudflare Turnstile, Rank Math, Polylang, WP Super Cache, UpdraftPlus, Redirection, Safe SVG. Bezpečnost: Wordfence free, pokud Jarda chce zachovat, co zná; jinak Limit Login Attempts Reloaded.
4. Žádný page builder, žádný slider, žádná cookie lišta.
