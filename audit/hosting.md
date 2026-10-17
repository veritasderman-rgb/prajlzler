# Audit hostingu a domény autopraizler.cz (fáze 1)

*Stav k 17. 10. 2026. Jen čtení z veřejných zdrojů (DNS, HTTP hlavičky, veřejné REST API WordPressu, ceníky poskytovatelů). Do administrace Forpsi ani na FTP jsem se nepřihlašoval, viz část „Co zbývá ověřit v administraci“.*

## Shrnutí

1. **Web ani e-mail neběží na Forpsi.** U Forpsi je pouze registrace domény a DNS (nameservery ns.forpsi.cz/.it/.net). A záznam míří na server `px01.svethostingu.cz` (83.167.244.201) a MX na `mail.svethostingu.cz`. Hosting i pošta jsou tedy u **SvetHostingu.cz**. Předpoklad zadání, že web běží na Forpsi minihostingu, neplatí.
2. **Starý web je už dnes WordPress** (verze 5.6.22, šablona Enfold, pluginy All in One SEO, Wordfence, Complianz, WP Popups Lite). Otázka „utáhne tarif WordPress“ je tím zodpovězená: stávající hosting WordPress utáhne, protože na něm běží.
3. **Web běží.** 17. 10. 2026 odpovídá 200 na `https://autopraizler.cz/`. Nedostupnost z 2. 10. 2026 byla buď přechodná, nebo souvisela se změnou v DNS zóně: sériové číslo SOA je `2026093001`, zóna byla tedy naposledy upravena **30. 9. 2026**. Web je navíc za proxy (`x-proxy-id: 01`), z této sítě se spojení občas resetuje a je nutné opakovat.
4. **Klíčové riziko: kdo vlastní hosting u SvetHostingu.** V patičce starého webu je `© FineNet – Na netu v pohodě`, tedy autor webu. Pokud je hosting (a tím i poštovní schránky servis@ a postmaster@) vedený na účet autora, nelze web jen „přesunout na Forpsi“ bez souhlasu a součinnosti autora a bez migrace e-mailů. Toto je první otázka pro Jardu.
5. **E-mail nemá SPF, DKIM ani DMARC.** V zóně není žádný TXT záznam. Pošta ze servis@ může padat do spamu. Netýká se fáze 1 (nic neměníme), ale patří do fáze 6 k nápravě, ať už pošta zůstane kdekoli.

## 1. DNS zóna (referenční zápis, dotaz přes DNS over HTTPS 17. 10. 2026)

| Název | Typ | Hodnota | TTL |
|---|---|---|---|
| autopraizler.cz | NS | ns.forpsi.cz, ns.forpsi.it, ns.forpsi.net | 3600 |
| autopraizler.cz | SOA | ns.forpsi.net admin.forpsi.com, serial 2026093001, refresh 14400, retry 3600, expire 2592000, min 3600 | 3600 |
| autopraizler.cz | A | 83.167.244.201 (PTR: px01.svethostingu.cz) | 1800 |
| autopraizler.cz | AAAA | žádný | |
| autopraizler.cz | MX | 10 mail.svethostingu.cz | 1800 |
| autopraizler.cz | TXT | žádný (není SPF) | |
| autopraizler.cz | CAA | žádný | |
| www | CNAME | autopraizler.cz | 1800 |
| smtp | CNAME | smtp.svethostingu.cz (77.93.218.2, 83.167.244.193) | 1800 |
| imap | CNAME | imap.svethostingu.cz → mail-st.svethostingu.cz (212.158.159.123) | 1800 |
| pop3 | CNAME | pop3.svethostingu.cz → mail-st.svethostingu.cz | 1800 |
| webmail | CNAME | webmail.forpsi.com (81.2.195.208) | 1800 |
| mail, ftp, autoconfig, autodiscover, _dmarc | CNAME | autopraizler.cz (chová se jako wildcard `*` na apex) | 1800 |
| *._domainkey | TXT | žádný nalezený DKIM selektor (zkoušeno default, forpsi, mail, dkim, selector1/2, google, k1, s1, s2) | |

Poznámky:
- `webmail` míří na Forpsi, zatímco MX, smtp, imap a pop3 na SvetHostingu. Buď pozůstatek z doby, kdy pošta běžela u Forpsi, nebo omyl. **Ověřit v administraci Forpsi, kde fyzicky leží schránky.** Dokud to není jasné, MX ani ostatní poštovní záznamy neměnit.
- `_dmarc` jako CNAME na apex znamená, že DMARC politika neexistuje.

## 2. Co běží na hostingu (zjištěno z venku)

| Položka | Zjištění |
|---|---|
| Poskytovatel | SvetHostingu.cz (hlavička `x-powered-by: SvetHostingu.cz`, server nginx za proxy) |
| CMS | WordPress 5.6.22 (meta generator i RSS feed). Větev 5.6 je z prosince 2020, dostává jen bezpečnostní záplaty. |
| Šablona | Enfold (komerční šablona od Kriesi, licence patří tomu, kdo ji koupil, tedy zřejmě autorovi webu; **nelze převzít**) |
| Pluginy viditelné z venku | All in One SEO (sitemapy), Wordfence (REST namespace), Complianz GDPR 6.5.6 (cookie lišta), WP Popups Lite 2.1.4.5 |
| PHP verze | z venku nezjistitelná (hlavička skrytá). SvetHostingu nabízí PHP 5.2 až 8.3. |
| HTTPS | funguje, `http://` → 301 na `https://`, `www` → 301 na bez www. Vydavatele certifikátu nelze z této sítě ověřit (proxy). |
| REST API | veřejně otevřené (`/wp-json/`), výpis uživatelů správně blokován (401). XML-RPC zapnuté (`x-pingback`). |
| Formulář | kontaktní formulář na /kontakt/ (Jméno, E-mail, Telefon, Požadavek termínu, Zpráva) |
| Obsah | 5 stránek, 1 testovací příspěvek „Ahoj všichni!“, 53 položek v knihovně médií. Detail ve `audit/web-inventura.md`. |

Struktura souborů na FTP a databáze: **neověřeno**, vyžaduje přístup k hostingu u SvetHostingu (ne k Forpsi).

## 3. Tarify a náklady (veřejné ceníky k 17. 10. 2026, ceny bez DPH, před objednáním ověřit)

### SvetHostingu.cz (kde web běží dnes)

| Tarif | Cena | Prostor | DB | PHP | Poznámka |
|---|---|---|---|---|---|
| BASIC | 49 Kč/měs (588 Kč/rok) | 1 500 MB | neomezeně | 5.2–8.3, memory_limit 256 MB | WordPress podporován |
| STANDARD | 79 Kč/měs (948 Kč/rok) | neomezený | neomezeně | memory_limit 512 MB | |
| PROFI | 129 Kč/měs (1 548 Kč/rok) | neomezený | neomezeně | memory_limit 1 024 MB | |

Který tarif má autopraizler.cz, z venku nezjistím. Pro malý WordPress stačí BASIC nebo STANDARD.

### Forpsi (kde je doména)

| Tarif | Cena | DB | PHP | Subdomény | Poznámka |
|---|---|---|---|---|---|
| Hosting Basic (prodávaný k doméně) | od 15 Kč/měs (cca 180 Kč/rok) | 1 GB pro databázi | ano | neuvedeno | zřejmě to, čemu zadání říká „minihosting“. **Ověřit v administraci, zda ho účet vůbec má a jaké má limity.** |
| Easy Hosting Linux | 780 Kč/rok (první rok 390 Kč) | 1× MySQL 8.0 | 8.3–8.5 | 5 | DV SSL, FTP/FTPS, SSH, instalátor WordPressu (Softaculous). Pro WordPress dostačuje. |
| Advanced Hosting Linux | 1 800 Kč/rok | 3× MySQL | 8.3–8.5 | 15 | zbytečně velký |

Veřejný ceník Forpsi neuvádí u Hosting Basic verzi PHP ani cron. Zda na něm WordPress reálně poběží (paměťový limit, počet souborů, verze PHP) je potřeba zjistit v administraci nebo u podpory Forpsi.

### Varianty, kde bude nový web běžet

| Varianta | Roční náklad (bez domény) | Pro | Proti |
|---|---|---|---|
| A. Zůstat u SvetHostingu, převést účet na Jardu | 588 až 948 Kč | žádná migrace pošty, WordPress tam už běží, nejméně práce i rizika | závisí na součinnosti autora starého webu (FineNet); neznámý tarif a stav účtu |
| B. Forpsi Easy Hosting Linux, přesun webu i pošty | 780 Kč (390 Kč první rok) | vše u jednoho poskytovatele spolu s doménou, moderní PHP | nutná migrace e-mailových schránek (servis@, postmaster@) včetně přenosu zpráv a změna MX, největší riziko výpadku pošty |
| C. Forpsi Hosting Basic („minihosting“) | cca 180 Kč | nejlevnější | neověřeno, že WordPress unese; žádné subdomény; stejná migrace pošty jako B |
| D. Web jinde (např. Wedos), Forpsi jen doména, pošta zůstane u SvetHostingu | dle poskytovatele | pošta se nedotkne | dva až tři poskytovatelé, horší správa pro Jardu |

**Doporučení:** nejdřív zjistit, komu patří účet u SvetHostingu (otázka pro Jardu, případně dotaz na FineNet). Pokud ho lze převést na Jardu, je varianta A nejbezpečnější. Pokud ne, varianta B s pečlivě naplánovanou migrací pošty ve fázi 6.

## 4. Staging (josefpavlovic.cz)

- DNS josefpavlovic.cz je u Wedosu (ns.wedos.cz/.eu/.com/.net), ale A záznam apexu i `auto.josefpavlovic.cz` míří na **216.150.1.1, což je Vercel** (web josefpavlovic.cz je nasazený na Vercelu, projekt `website-jp`). Subdoména `auto` tedy už dnes resolvuje, ale na Vercel, kde WordPress (PHP + MySQL) provozovat nelze.
- Pro WordPress staging na `auto.josefpavlovic.cz` je potřeba **webhosting u Wedosu** (nebo jinde) a změna A záznamu subdomény v DNS Wedos na IP toho hostingu. Zda účet u Wedosu webhosting má, z venku nezjistím.

## 5. Co zbývá ověřit v administraci (Forpsi, Wedos), jen čtení

Forpsi (admin.forpsi.com):
1. Seznam služeb na účtu: jen doména, nebo i hosting či e-mail? Název tarifu, datum expirace domény i hostingu.
2. Pokud je tam hosting: verze PHP, počet a typ databází, místo na disku, FTP/SFTP, SSL, cron.
3. Kde jsou vedené schránky servis@ a postmaster@: v sekci e-mail u Forpsi, nebo nikde (pak jsou u SvetHostingu)?
4. DNS zóna tak, jak ji Forpsi zobrazuje: zejména zda existuje záznam `*` (wildcard) CNAME na apex a proč `webmail` míří na Forpsi.
5. Kdo je uvedený jako vlastník a technický kontakt domény (Jarda, nebo FineNet).

Wedos:
6. Má účet webhosting (např. NoLimit)? Pokud ano, jakou IP adresu mu Wedos přiděluje pro A záznam subdomény.

SvetHostingu (až budou přístupy):
7. Tarif, verze PHP, FTP struktura, velikost databáze, export textů (ne databáze s uživateli, repozitář je veřejný).

## 6. Co se ve fázi 1 neměnilo

Nic. Žádný DNS záznam, žádné nastavení domény ani hostingu.
