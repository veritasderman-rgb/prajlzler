# Staging auto.josefpavlovic.cz (plán fáze 5)

*Fáze 5 začne až po schválení fází 1 až 4. Tento dokument je příprava: co se nastaví, v jakém pořadí a co k tomu potřebuji.*

## 1. Kde staging poběží

Webhosting Wedos NoLimit josefpavlovic.cz (viz `audit/hosting.md`, část 4): Linux, PHP 8.1, MariaDB, FTP server 35745.w45.wedos.net, IP 46.28.105.77. Web josefpavlovic.cz sám běží na Vercelu, hosting Wedos je tedy pro staging volný.

## 2. DNS záznam (jediná změna v DNS, zadává Josef v Zákaznickém centru Wedos)

| Typ | Název | Hodnota | TTL |
|---|---|---|---|
| A | auto | 46.28.105.77 | 300 |
| AAAA (volitelně) | auto | 2a02:2b88:1:4::29 | 300 |

Konkrétní záznam `auto` má přednost před wildcardem `*` → 216.150.1.1, wildcard zůstává beze změny. Nic jiného v zóně se nemění (MX Google, Brevo, Resend ani DMARC se nedotýkají). Ověření: `auto.josefpavlovic.cz` musí po propagaci (TTL 300 s, wildcard má také 300 s) resolvovat na 46.28.105.77.

## 3. Postup instalace (provede Claude přes FTP a HTTP, nic na josefpavlovic.cz se nemění)

1. Přes FTP vytvořit složku `/subdom/auto/` (Wedos ji mapuje na `auto.josefpavlovic.cz`).
2. V Zákaznickém centru založit **novou databázi** jen pro staging (např. `d35745_auto`), oddělenou od tří stávajících. Pokud tarif další databázi nedovolí, dohodnout použití `d35745_test` (2 MB, zřejmě nepoužívaná). Založení databáze dělá Josef, přihlašovací údaje předá jako proměnné prostředí (níže).
3. Nahrát aktuální WordPress (česká lokalizace), vytvořit `wp-config.php` z proměnných prostředí. `wp-config.php` se nikdy neukládá do repa (`.gitignore` to hlídá).
4. Zavřít staging: HTTP auth přes `.htaccess` + `.htpasswd` mimo webroot složky, a `noindex` (Nastavení → Viditelnost pro vyhledávače + hlavička `X-Robots-Tag: noindex`). Heslo pro HTTP auth zvolí Josef, do repa nejde.
5. Ověřit HTTPS: Wedos vystavuje Let's Encrypt pro doménu; u subdomény ve složce `/subdom/` ověřit, že certifikát vznikl. Pokud ne, požádat podporu Wedos, nebo dočasně ponechat HTTP (staging je za heslem).
6. Nainstalovat šablonu Twenty Twenty-Five a child theme `autopraizler` z `wp/themes/autopraizler/` (vznikne ve fázi 5, verzuje se v repu).
7. Pluginy podle `docs/navrh-sablony.md`, část 4. Modul schema v SEO pluginu vypnout.
8. Postavit stránky podle `docs/obsahova-mapa.md`, nejdřív CZ, pak DE a EN.
9. Poslat odkaz a heslo k připomínkám (heslo mimo repo a mimo GitHub).

PHP: 8.1 pro WordPress stačí. Přepnutí na 8.3 doporučuji, ale je to změna nastavení celého hostingu, proto až po výslovném souhlasu Josefa.

## 4. Co potřebuji od Josefa před startem

Údaje jen jako proměnné prostředí cloudového prostředí (menu prostředí v titulku session, Edit, sekce Network secrets nebo environment variables), nikdy do chatu ani do souboru v repu. Načtu je v nové session.

| Proměnná | Obsah |
|---|---|
| `WEDOS_FTP_HOST` | 35745.w45.wedos.net |
| `WEDOS_FTP_USER` | FTP uživatel hostingu (ideálně samostatný FTP účet omezený na `/subdom/auto/`, pokud ho Wedos dovolí) |
| `WEDOS_FTP_PASS` | heslo |
| `WEDOS_DB_HOST` | adresa MariaDB serveru z detailu databáze |
| `WEDOS_DB_NAME` | název nové databáze |
| `WEDOS_DB_USER` | uživatel databáze |
| `WEDOS_DB_PASS` | heslo databáze |
| `STAGING_HTTP_USER` / `STAGING_HTTP_PASS` | přihlášení k zavřenému stagingu |
| `WP_ADMIN_USER` / `WP_ADMIN_PASS` | administrátor WordPressu (Josef), účet pro Jardu vznikne později |

Dále: založený DNS záznam z části 2 a souhlas s případným přepnutím PHP na 8.3.

## 5. Co se na Wedosu nemění

DNS kromě záznamu `auto`, MX a poštovní záznamy, stávající databáze a soubory ve webrootu josefpavlovic.cz, PHP verze (bez souhlasu), e-mailová schránka admin.

## 6. Po stagingu

Hosting Wedos expiruje 7. 1. 2027. Pokud bude staging potřeba i potom (připomínky, školení Jardy), prodloužit, nebo po migraci na produkci staging smazat (složka, databáze, DNS záznam).
