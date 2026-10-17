# Audit hostingu a domény autopraizler.cz (fáze 1)

*Stav k 17. 10. 2026. Jen čtení: veřejné zdroje (DNS, HTTP hlavičky, veřejné REST API WordPressu, ceníky poskytovatelů) a odečet z administrace Forpsi (provedl Josef, nic neměnil, hesla neotevíral). Na FTP ani do administrace SvetHostingu a Wedosu se nikdo nepřihlašoval, viz část 5.*

## Shrnutí

1. **Web ani e-mail neběží na Forpsi, ačkoli se tam hosting platí.** Na účtu u Forpsi je doména a tarif **Webhosting PIDI+mail** (508,20 Kč/rok, Windows, bez PHP a bez databáze, 500 MB, 1 schránka). A záznam ale míří na server `px01.svethostingu.cz` (83.167.244.201, síť LHOLUB-2-CZ-MAI, Libor Holub) a MX na `mail.svethostingu.cz`. Web i příchozí pošta jsou tedy u **SvetHostingu.cz**; hosting u Forpsi je nevyužitý a jeho jediná schránka (postmaster) nedostává poštu. Předpoklad zadání, že web a e-maily běží na Forpsi minihostingu, neplatí.
2. **Tarif PIDI+mail u Forpsi WordPress neutáhne** (Windows hosting, PHP „n/a“, 0 databází, 0 subdomén, bez SSL). Starý web je už dnes WordPress (verze 5.6.22, šablona Enfold, pluginy All in One SEO, Wordfence, Complianz, WP Popups Lite) a běží na SvetHostingu, který WordPress zjevně utáhne.
3. **Web běží.** 17. 10. 2026 odpovídá 200 na `https://autopraizler.cz/`. Nedostupnost z 2. 10. 2026 byla buď přechodná, nebo souvisela se změnou v DNS zóně: sériové číslo SOA je `2026093001`, zóna byla tedy naposledy upravena **30. 9. 2026**. Web je navíc za proxy (`x-proxy-id: 01`), z této sítě se spojení občas resetuje a je nutné opakovat.
4. **Klíčové riziko: kdo vlastní hosting u SvetHostingu.** V patičce starého webu je `© FineNet – Na netu v pohodě`, tedy autor webu. Pokud je hosting (a tím i poštovní schránky servis@ a postmaster@) vedený na účet autora, nelze web jen „přesunout na Forpsi“ bez souhlasu a součinnosti autora a bez migrace e-mailů. Toto je první otázka pro Jardu.
5. **E-mail nemá SPF ani DMARC.** V zóně není žádný TXT záznam. DKIM pro SvetHostingu existuje (selektor `sh512` jako CNAME na `dkim.svethostingu.cz`), DKIM pro Forpsi je v administraci aktivní, ale v zóně chybí (bez významu, dokud se přes Forpsi neposílá). Pošta ze servis@ může padat do spamu. Netýká se fáze 1 (nic neměníme), patří do fáze 6, ať už pošta zůstane kdekoli.
6. **Doména je v pořádku:** registrovaná 24. 6. 2011, expirace 24. 6. 2027, DNSSEC zapnuto, majitel Jaroslav Praizler / AutoPraizler M.L. Hosting PIDI+mail expiruje 29. 6. 2027.

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
| `*` (wildcard) | CNAME | autopraizler.cz (potvrzeno v administraci Forpsi; proto mail, ftp, autoconfig, autodiscover i _dmarc vrací apex) | 1800 |
| sh512._domainkey | CNAME | dkim.svethostingu.cz (TXT `v=DKIM1; k=rsa; p=…`, DKIM pro odesílání přes SvetHostingu) | 1800 |
| (DKIM Forpsi) | TXT | chybí; v administraci Forpsi je DKIM pro smtp.forpsi.com aktivní, ale záznam v zóně není | |

Poznámky:
- Zóna zobrazená v administraci Forpsi má přesně 8 záznamů: A, `*` CNAME, imap, pop3, sh512._domainkey, smtp, webmail a MX. Žádný TXT. Shoduje se s veřejným DNS.
- `webmail` míří na Forpsi, zatímco MX, smtp, imap a pop3 na SvetHostingu. V administraci Forpsi je 1 schránka (postmaster), ale příchozí pošta jde podle MX na SvetHostingu. Buď pozůstatek z doby, kdy pošta běžela u Forpsi, nebo omyl. **Kde ve skutečnosti existuje servis@ a kde ho Jarda čte, je otázka pro Jardu.** Dokud to není jasné, MX ani ostatní poštovní záznamy neměnit.
- `_dmarc` jako CNAME na apex (vedlejší efekt wildcardu) znamená, že DMARC politika neexistuje.
- Historii změn zóny administrace Forpsi nezobrazuje; změnu kolem 30. 9. 2026 (SOA serial) by musela dohledat podpora Forpsi.

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

### Forpsi (kde je doména): co účet má dnes

| Položka | Zjištění z administrace (17. 10. 2026) |
|---|---|
| Tarif | **Webhosting PIDI+mail** (objednávka W00887331), 508,20 Kč/rok, stejná částka od roku 2020, expirace 29. 6. 2027 |
| Systém | Windows hosting, server c166wh.forpsi.com (81.2.194.166), PHP „n/a“ |
| Místo | 500 MB (využití se nezobrazuje) |
| Databáze | 0 (žádná MySQL ani MariaDB) |
| Subdomény, aliasy | 0 |
| FTP | ano (login autopraizlercz, WebFTP); SFTP ani SSH ne |
| SSL | žádný certifikát, DV SSL lze vydat |
| Cron | není vidět |
| E-mail | max. 10 schránek po 10 GB, vytvořena 1 (postmaster), Business mail ne |
| Doména | .cz, objednávka D00887330, expirace 24. 6. 2027, DNSSEC zapnuto, NSSET FORPSI; poslední platba 721,16 Kč (6/2023) |

**Závěr: na tomto tarifu WordPress provozovat nelze** (není PHP ani databáze). Zároveň tarif dnes nic neobsluhuje: web běží na SvetHostingu a příchozí pošta jde podle MX také tam. Jarda tedy platí 508 Kč ročně za nevyužitý hosting.

### Forpsi: veřejný ceník tarifů, na které lze přejít

| Tarif | Cena | DB | PHP | Subdomény | Poznámka |
|---|---|---|---|---|---|
| Hosting Basic (prodávaný k doméně) | od 15 Kč/měs (cca 180 Kč/rok) | 1 GB pro databázi | ano | neuvedeno | na účtu není; místo něj je PIDI+mail (viz výše) |
| Easy Hosting Linux | 780 Kč/rok (první rok 390 Kč) | 1× MySQL 8.0 | 8.3–8.5 | 5 | DV SSL, FTP/FTPS, SSH, instalátor WordPressu (Softaculous). Pro WordPress dostačuje. |
| Advanced Hosting Linux | 1 800 Kč/rok | 3× MySQL | 8.3–8.5 | 15 | zbytečně velký |

Veřejný ceník Forpsi neuvádí u Hosting Basic verzi PHP ani cron. Zda na něm WordPress reálně poběží (paměťový limit, počet souborů, verze PHP) je potřeba zjistit v administraci nebo u podpory Forpsi.

### Varianty, kde bude nový web běžet

| Varianta | Roční náklad (bez domény) | Pro | Proti |
|---|---|---|---|
| A. Zůstat u SvetHostingu, převést účet na Jardu; PIDI+mail u Forpsi zrušit | 588 až 948 Kč, **úspora 508 Kč** za zbytečný PIDI | žádná migrace pošty, WordPress tam už běží, nejméně práce i rizika | závisí na součinnosti provozovatele účtu u SvetHostingu (FineNet / Libor Holub); neznámý tarif a stav účtu |
| B. Změna tarifu u Forpsi z PIDI+mail na Easy Hosting Linux, přesun webu i pošty | 780 Kč (390 Kč první rok), tedy **o 272 Kč/rok víc** než dnes | vše u jednoho poskytovatele spolu s doménou, moderní PHP, SSL v ceně | nutná migrace e-mailových schránek ze SvetHostingu včetně přenosu zpráv a změna MX, největší riziko výpadku pošty; Forpsi nabízí u změny Windows → Linux zřejmě novou službu, ne upgrade (ověřit u podpory) |
| C. Ponechat PIDI+mail a web dát jinam | 508 Kč + hosting jinde | nic | PIDI nic neobsluhuje, platit ho nemá smysl; vyřazeno |
| D. Web jinde (např. Wedos), Forpsi jen doména, pošta zůstane u SvetHostingu, PIDI zrušit | dle poskytovatele, minus 508 Kč | pošta se nedotkne | dva až tři poskytovatelé, horší správa pro Jardu |

**Doporučení:** nejdřív zjistit, komu patří účet u SvetHostingu a zda tam existuje schránka servis@ (otázka pro Jardu, případně dotaz na FineNet). Pokud lze účet převést na Jardu, je varianta A nejbezpečnější a nejlevnější. Pokud ne, varianta B s pečlivě naplánovanou migrací pošty ve fázi 6. V obou případech hosting PIDI+mail u Forpsi po migraci zrušit (ne dřív: dokud není jasné, kde je servis@, nic nerušit).

## 4. Staging (josefpavlovic.cz)

- DNS josefpavlovic.cz je u Wedosu (ns.wedos.cz/.eu/.com/.net), ale A záznam apexu i `auto.josefpavlovic.cz` míří na **216.150.1.1, což je Vercel** (web josefpavlovic.cz je nasazený na Vercelu, projekt `website-jp`). Subdoména `auto` tedy už dnes resolvuje, ale na Vercel, kde WordPress (PHP + MySQL) provozovat nelze.
- Pro WordPress staging na `auto.josefpavlovic.cz` je potřeba **webhosting u Wedosu** (nebo jinde) a změna A záznamu subdomény v DNS Wedos na IP toho hostingu. Zda účet u Wedosu webhosting má, z venku nezjistím.

## 5. Co zbývá ověřit v administraci (Forpsi, Wedos), jen čtení

Forpsi: **hotovo 17. 10. 2026** (viz část 3 a 1). Nezjištěno zůstává jen datum poslední změny zóny (podpora Forpsi) a jméno jediné schránky (administrace ho nezobrazuje, zřejmě postmaster@).

Wedos:
1. Má účet webhosting (např. NoLimit)? Pokud ano, jakou IP adresu mu Wedos přiděluje pro A záznam subdomény `auto`.

Jarda:
2. Existuje schránka servis@autopraizler.cz, kde ji čte (webmail, Outlook, telefon) a přes který server odesílá? Podle MX musí být u SvetHostingu.
3. Kdo je smluvní partner u SvetHostingu (FineNet, Libor Holub, nebo Jarda sám) a kdo ho platí?

SvetHostingu (až budou přístupy):
4. Tarif, verze PHP, FTP struktura, velikost databáze, seznam schránek, export textů (ne databáze s uživateli, repozitář je veřejný).

## 6. Co se ve fázi 1 neměnilo

Nic. Žádný DNS záznam, žádné nastavení domény ani hostingu, ani v administraci Forpsi (jen čtení, hesla neotevřena).
