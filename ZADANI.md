# Zadání: nový web autopraizler.cz ve WordPressu

## Kontext

- **Klient:** autoservis Jaroslava Praizlera (AutoPraizler M.L.), U Mlékárny 844/8a, Mariánské Lázně – Úšovice. Současný web: https://autopraizler.cz/
- **Proč WordPress:** Jarda si bude web spravovat sám. Proto jednoduchá správa, blokový editor a minimum pluginů.
- **Hosting domény:** Forpsi, tarif doména + minihosting (nejlevnější). Nejde v něm založit ani subdoménu. Běží tam i e-maily (servis@, postmaster@).
- **Vývoj:** samostatný staging na josefpavlovic.cz (Wedos). Hotový web se pak přesune na Forpsi místo současného.
- **Autorská práva:** současný web nesmíme převzít 1:1. Přebíráme jen obsah (texty, fakta, kontakty, ceník, otevírací dobu). Design, kód, šablonu ani grafiku starého webu nepřebíráme.

### Co už v repozitáři je

Repo už obsahuje **hotový statický návrh webu** (viz `README.md`):

- stránky CZ (`index`, `sluzby`, `o-nas`, `recenze`, `kontakt`, `pomoc-v-nouzi`, `karta-pro-recepce`) a zkrácené verze DE a EN,
- logo ve vektoru (`assets/logo/`), barvy (oranžová `#F28C1E`, černá `#1E1E1E`), písmo Barlow,
- zmenšené fotky, QR kódy, schema.org `AutoRepair`,
- `autopraizler_podklady.zip`: sesbírané podklady (texty, recenze, fotky v plném rozlišení) a seznam otevřených otázek pro Jardu.

**Tento návrh je hlavní zdroj obsahu i vizuálního konceptu.** Starý web na Forpsi slouží jen k doplnění textů a údajů, které v návrhu chybí. Úkolem není navrhovat web znovu od nuly, ale převést návrh do WordPressu tak, aby šel snadno spravovat.

## ⚠️ Bezpečnost

- **Repozitář je veřejný.** Do repa nikdy nepatří hesla, PINy, loginy, exporty databáze s uživateli ani zálohy obsahující `wp-config.php`. Totéž platí pro commit messages a issues.
- Přihlašovací údaje si vyžádej až ve chvíli, kdy je potřebuješ (proměnná prostředí nebo zadání v terminálu). Neukládej je do souborů.
- Zálohu starého webu (fáze 2) drž mimo repo, nebo do repa dej jen vytažené texty.
- Fotky stažené z Google Maps a Firmy.cz mohou být od zákazníků, ne od Jardy. Na veřejném webu použít jen ty, u kterých je potvrzeno, že jsou Jardovy (viz fáze 2.4).

## Fáze 1: Audit Forpsi a hostingu (jen čtení, nic neměnit)

1. Zjistit, co tarif minihosting umí: PHP (verze), MySQL/MariaDB (počet databází), místo na disku, FTP/SFTP, SSL, cron. **Klíčová otázka: utáhne tarif WordPress?** Pokud ne, navrhnout varianty (vyšší tarif, nebo web jinde a na Forpsi jen doména a e-mail) včetně ročních nákladů.
2. Zjistit, jestli web autopraizler.cz vůbec běží (při sběru podkladů 2. 10. 2026 byl nedostupný). Zmapovat obsah hostingu přes FTP: jaký CMS nebo technologie, struktura souborů, databáze.
3. Zapsat DNS záznamy (A, MX, TXT/SPF/DKIM) jako referenci. **MX a e-mailová nastavení se nesmí dotknout.**
4. Výstup: `audit/hosting.md`

## Fáze 2: Inventura starého webu a srovnání s návrhem

1. Projít celý starý web (crawl) a sestavit seznam všech URL. Ten bude základem pro budoucí 301 přesměrování.
2. Z každé stránky vytáhnout čistý text do `obsah/puvodni/*.md`.
3. Porovnat se statickým návrhem a s `podklady.md`: co je na starém webu navíc (služby, ceny, údaje), co si odporuje (otevírací doba, pojišťovny, služby), co je zastaralé.
4. Inventura obrázků: u každé fotky (starý web i `assets/img/`) určit původ: Jardova vlastní, zákaznická z Google/Firmy.cz, stock, nebo grafika autora starého webu. Použít smíme jen prokazatelně Jardovy.
5. SEO stav starého webu: title, meta description, nadpisy, indexace.
6. Výstup: `audit/web-inventura.md` (tabulka URL → obsah → kam patří v novém webu → co ověřit)

## Fáze 3: Obsahová mapa pro WordPress

1. Převést strukturu statického návrhu na WordPress: které stránky, které opakované bloky (služby, recenze, kontakt, výzva „Zavolat“), co bude vzor bloku (block pattern) a co obyčejný text, který Jarda přepíše sám.
2. Doplnit texty ze starého webu podle fáze 2. Kde se údaje liší, nevybírat sám, ale zapsat jako otázku pro Jardu.
3. Aktualizovat seznam otevřených otázek (navazuje na „Co je potřeba doplnit nebo ověřit“ v `README.md`).
4. Výstup: `docs/obsahova-mapa.md`

## Fáze 4: Návrh WordPress šablony

1. Vybrat 2–3 kandidáty, např. Kadence, Blocksy, GeneratePress nebo výchozí blokovou šablonu (Twenty Twenty-Five) s child theme.
2. Kritéria:
   - věrně zopakuje vizuál návrhu (barvy, Barlow, pevná mobilní lišta „Zavolat“ + WhatsApp),
   - blokový editor, aby Jarda zvládl úpravy sám,
   - **vícejazyčnost CZ/DE/EN** a jak ji řešit (např. Polylang zdarma) včetně `hreflang`,
   - rychlost, nízké nároky na hosting (podle výsledku fáze 1), zdarma nebo levná licence, česká lokalizace.
3. Navrhnout minimální sadu pluginů: formulář poptávky, SEO (s podporou schema `AutoRepair`), cache, zálohy, antispam, vícejazyčnost. Nic navíc.
4. Výstup: `docs/navrh-sablony.md` se srovnáním a doporučením.

## Fáze 5: Staging na Wedosu (až po schválení fází 1–4)

1. Samostatná instalace WP na subdoméně (např. `autopraizler.josefpavlovic.cz`) s vlastní databází, oddělená od mého webu.
2. Staging zavřít heslem (HTTP auth) a nastavit noindex, aby ho Google neindexoval jako duplicitu.
3. Nainstalovat zvolenou šablonu a pluginy, postavit stránky z obsahové mapy a poslat k připomínkám.
4. Vlastní kód (child theme, block patterns, nastavení) verzovat v repu ve složce `wp/`.

## Fáze 6: Později

Předání Jardovi (krátký návod na správu), migrace na Forpsi, 301 přesměrování ze starých URL, kontrola e-mailů po přepnutí DNS, sjednocení údajů na Google Business profilu, Firmy.cz a Facebooku.

## Pravidla práce

- Na Forpsi pouze čtení, dokud migraci výslovně neschválím.
- Každá fáze končí výstupem v repu a mým schválením, teprve pak se pokračuje.
- Fakta o firmě (otevírací doba, služby, ceny, pojišťovny) nedomýšlet. Co není potvrzené, jde do seznamu otázek pro Jardu.
- Píše se česky, bez zbytečného marketingového nadšení; tón klidného rodinného servisu jako ve statickém návrhu.
