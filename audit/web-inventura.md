# Inventura starého webu autopraizler.cz a srovnání s návrhem (fáze 2)

*Stav k 17. 10. 2026. Zdroj: veřejné stránky, sitemapy All in One SEO a veřejné REST API WordPressu. Čisté texty stránek jsou v `obsah/puvodni/`.*

## 1. Seznam URL (základ pro 301 přesměrování)

| Stará URL | Obsah | Kam patří v novém webu | Co ověřit |
|---|---|---|---|
| `/` | Úvod: slider (3 bannery), 6 dlaždic služeb, Cebia, ELTMA, „Ušetřete až 60 %“, galerie 4 fotek, patička FineNet | `/` (úvod) | nic, obsah pokrývá návrh |
| `/sluzby/` | 16 služeb s jednořádkovým popisem, výška vjezdu 3,3 m | `/sluzby/` | motoservis, autopůjčovna, likvidace autovraků (v návrhu chybí) |
| `/cenik/` | „Orientační ceník 2026“ jen jako obrázek + PDF | nová stránka `/cenik/` (v návrhu není) | Jarda: platí ceny z 3/2026? |
| `/usetrete/` | 5 odrážek o levnějších dílech, galerie 4 fotek | sloučit do `/sluzby/` (blok „Díly, se kterými pracujeme“) nebo `/o-nas/`; 301 na `/sluzby/` | tvrzení „až 60 %“ |
| `/kontakt/` | adresa, telefon, e-mail, pracovní doba, GPS, formulář, 2 fotky provozovny | `/kontakt/` | otevírací doba (liší se) |
| `/ahoj-vsichni/` | výchozí testovací příspěvek WordPressu | nikam, 301 na `/` nebo 410 | nic |
| `/zkusebni-stranka/` | slug úvodní stránky, už dnes 301 na `/` | `/` | nic |
| `/wp-content/uploads/2026/03/Orientacni-cenik-2026.pdf` | ceník PDF | 301 na `/cenik/`, nebo zachovat kopii PDF na stejné URL | zda ho Jarda někde šíří (QR, tisk); odkaz nesmí skončit na 404 |
| `/wp-content/uploads/2023/12/00-Zasady-zpracovani-osobnich-udaju-aktualizovane.pdf` | zásady zpracování osobních údajů (12/2023) | 301 na novou stránku `/ochrana-osobnich-udaju/` | obsah PDF neprošel kontrolou, stáhnout a projít |
| `/sitemap.xml`, `/post-sitemap.xml`, `/page-sitemap.xml`, `/category-sitemap.xml` | sitemapy AIOSEO | generuje nový SEO plugin | `/category-sitemap.xml` 17. 10. nedostupná |
| `/feed/`, `/comments/feed/` | RSS | vypnout nebo nechat (WordPress generuje sám) | |

Hlavní menu starého webu: Úvod, Služby, Ceník, Ušetřete, Kontakt. Žádné podstránky, žádná DE/EN verze, žádný blog.

## 2. Co je na starém webu navíc oproti návrhu

| Položka | Kde | Návrh na zařazení |
|---|---|---|
| **Orientační ceník 2026** s konkrétními cenami (viz `obsah/puvodni/cenik.md`) | /cenik/ | samostatná stránka Ceník jako tabulky (ne obrázek), s povinnou větou „Uvedené ceny jsou orientační…“ |
| **Motoservis** (motorky, skútry, čtyřkolky) | /sluzby/ | doplnit do Služeb, pokud stále platí |
| **Autopůjčovna** jako samostatná služba (návrh má jen „náhradní vozidlo po domluvě“) | /sluzby/ | otázka pro Jardu |
| **Likvidace autovraků** s certifikátem | /sluzby/ | otázka pro Jardu |
| **Cebia** („Prověřte si auto na CEBIA“) | / | drobný odkaz ve Službách, pokud spolupráce trvá |
| **ELTMA sběrné místo** (ekologická recyklace pneu) | / | doplnit k Pneuservisu, souvisí s „likvidace pneu zdarma“ v ceníku |
| Partneři dílů navíc: **Valeo, Hella, Mahle** | / | doplnit do výčtu dílů |
| „Antikorozní ochrana podvozků“, „zápis do el. servisní knihy“, „uskladnění pneu 650 Kč/sezóna“ | ceník | pneuhotel doplnit do Pneuservisu (podklady.md to měly jako otázku, ceník ji zodpovídá) |
| Zásady zpracování osobních údajů (PDF) + cookie lišta Complianz | web | nový web s formulářem potřebuje stránku se zásadami; cookie lišta jen pokud budou cookies třetích stran (mapa, analytika) |
| Kontaktní formulář (Jméno, E-mail, Telefon, Požadavek termínu, Zpráva) | /kontakt/ | převzít pole, v návrhu formulář není |
| „Pracujeme s vozidly v záruce“ (alt textu loga: „záruční a pozáruční servis“) | logo | návrh má, shoda |

## 3. Co si odporuje

| Údaj | Starý web | Návrh (repo) | Jiné zdroje | Řešení |
|---|---|---|---|---|
| **Otevírací doba** | Po–Pá 8:00–17:00, polední pauza 12:00–13:00; So–Ne po telefonické dohodě | Po–Čt 8–17, Pá 8–15, víkend po domluvě (z Googlu) | Firmy.cz: Po–Pá 8–12, 13–17; Živéfirmy: Po–Čt 8–17, Pá 8–15 | **Otázka pro Jardu.** Nerozhodovat. |
| **Cena přezutí** | alt text „Pneuservis na počkání od 260 Kč“ (2021), ceník 2026: 450 Kč | bez cen | leták: od 260 Kč | 260 Kč je zastaralé, platí ceník 2026 (ověřit) |
| **Pojišťovny** | nejmenuje žádné („zařídíme rychlou likvidaci“) | ČP (Generali), Allianz, ČPP, Kooperativa | banner: ČP, Allianz, ČPP (+ Generali, Kooperativa) | otázka pro Jardu |
| **Autopůjčovna / náhradní vozidlo** | „Půjčíme Vám vozidlo a v případě servisu také náhradní vozidlo“ | jen náhradní vůz při delší opravě | | otázka pro Jardu |
| **Úspora dílů** | „Ušetřete až 60 % z ceny!!!“ | „srovnatelné s originálem, výrazně levnější“ | leták: „až 60 %“ | držet se návrhu, číslo jen pokud ho Jarda chce a umí doložit |
| **GPS** | 49.9561919 N, 12.6933308 E | 49.95620 N, 12.69333 E | | shoda (zaokrouhlení) |
| **Adresa** | U Mlékárny 844/8A | U Mlékárny 844/8a | | shoda |
| **Telefon, e-mail** | 728 920 290, servis@autopraizler.cz | stejné | | shoda |
| **Dodávky** | „do výšky 3,3 m“ | stejné | | shoda |
| **Klimatizace** | „ozonová dezinfekce“, ceník: dezinfekce standard i ozonem | „dezinfekce stanicí TEXA“ | | doplnit ozon do návrhu, chladivo R1234yf stále nejasné |

## 4. Co je zastaralé nebo k vyřazení

- Testovací příspěvek „Ahoj všichni!“ (2019) a slug úvodu `zkusebni-stranka`.
- WordPress 5.6.22 (větev z roku 2020), Complianz 6.5.6, WP Popups Lite 2.1.4.5.
- Tvrzení „Pneuservis na počkání od 260 Kč“ v alt textech.
- Patička „© 2020/2021 FineNet“ a copyright roky.
- Stránka Ušetřete jako samostatná položka menu (obsah je 5 odrážek, patří do Služeb).
- Ceník jako obrázek: nečitelný pro vyhledávače i čtečky, Jarda ho nemůže sám upravit. V novém webu tabulka.

## 5. Inventura obrázků

Pravidlo ze zadání: na veřejný web jen prokazatelně Jardovy fotky. Rozlišení 626 px na šířku je typické pro bezplatné stažení z Freepiku a názvy souborů s příponou `_123456-7890` jsou Freepik ID.

### Knihovna médií starého webu (53 položek)

| Soubor(y) | Původ (odhad) | Použít? |
|---|---|---|
| `Titul1x.jpg`, `Titul2x.jpg`, `Titul6.jpg` (1920×650, slider) | grafika autora webu, zřejmě koláž ze stocku | **ne** |
| `servicing-car-air-conditioner…_179755-5020.jpg`, `mechanic-examining-car-tyre…_1170-1595.jpg`, `detail-polishing-car…_55997-1387.jpg`, `kit-timing-belt…_168171-317.jpg`, `computer-diagnostics…_266732-15393.jpg`, `car-refuel-lpg…_39704-869.jpg`, `blue-car-parked…towbar_127089-42.jpg` (626×417) | **stock Freepik**, licence autora webu | **ne** |
| `020.jpg`, `047.jpg`, `061.jpg`, `071.jpg`, `074.jpg`, `077.jpg`, `078.jpg`, `00071.jpg` a varianty `020-1`, `047x`, `061-1`, `061x`, `071xy` (626×417 nebo 650×433) | stejné rozměry jako Freepik, bez metadat: **pravděpodobně stock** | **ne**, pokud Jarda nepotvrdí opak |
| `Grafika3.png` (872×872) | grafika autora webu | **ne** |
| `logo.jpg`, `logo3.jpg`, `logo3x.jpg` | bitmapa loga (autor: FineNet, značka: Jarda) | ne, v repu je logo ve vektoru |
| `favicon.png` | totéž | ne |
| `IMG_20210311_143348-x.jpg`, `IMG_20210311_143757x.jpg` (1500 px, foceno mobilem 11. 3. 2021, na stránce Kontakt) | fotky provozovny, **pravděpodobně vlastní** (Jardovy nebo autora webu) | ano po potvrzení |
| `Provozovna.jpg` (1200×904) | fotka budovy, **pravděpodobně vlastní** | ano po potvrzení |
| `Ate`, `Bosch`, `Bosal`, `Castrol`, `Febi`, `Fram`, `Gates`, `LUK`, `Mahle`, `Mann_filter`, `Moog`, `QH`, `Sachs`, `SKF`, `ABS`, `Valeo`, `Hella` (250×100) | loga výrobců dílů, ochranné známky třetích stran | nepřebírat soubory; návrh používá jen názvy textem, což stačí |
| `Cebia300x300.png`, `Sberne-misto-ELTMA.png` | loga partnerských programů | jen pokud spolupráce trvá, ideálně aktuální soubor od partnera |
| `Cenik-2026.jpg`, `Orientacni-cenik-2026.pdf` | Jardův ceník | obsah ano (jako tabulka), obrázek ne |
| `00-Zasady-zpracovani-osobnich-udaju-aktualizovane.pdf` | dokument | projít a přepsat jako stránku |

### Fotky v repu (`assets/img/`) a v `autopraizler_podklady.zip`

| Soubor v repu | Zdroj | Původ | Použít? |
|---|---|---|---|
| `hero-budova.jpg/.webp` | `05_budova_zima_zapad_slunce` (Firmy.cz) | upravená fotka budovy na profilu Firmy.cz; profilové fotky zpravidla nahrává majitel, **ale není potvrzeno** | po potvrzení |
| `budova-ulice.jpg/.webp` | `01_budova_exterier_dodavka_LASSA` (Google) | Google Maps, může být od zákazníka | po potvrzení |
| `vjezdy-dilny.jpg/.webp` | `02_vjezdy_autoservis_pneuservis` (Google) | totéž | po potvrzení |
| `pneuservis-vyvazovacka.jpg/.webp` | `03_pneuservis_vyvazovacka_detail` (Google, 1280×720) | totéž, nízké rozlišení | po potvrzení |
| `dilna-zvedak.jpg/.webp` | `04_dilna_zvedak_Seat_Ateca` (Google) | totéž; na fotce je cizí auto s čitelným typem, SPZ zkontrolovat | po potvrzení |
| `qr-tel.svg`, `qr-hilfe.svg` | generováno | vlastní | ano |
| `06_leták`, `07_reklamni_banner` (jen v zipu) | Firmy.cz | Jardovy tiskoviny (grafika možná od tiskárny) | jen jako podklad |

**Závěr:** žádná fotka ze starého webu ani z repa zatím nemá potvrzený původ. Pro spuštění je potřeba buď Jardovo potvrzení u fotek označených „po potvrzení“, nebo nafocení nové sady (podklady.md to už doporučují).

## 6. SEO stav starého webu

| Oblast | Stav |
|---|---|
| Title | vzor „Název stránky - Auto Praizler Mariánské Lázně“, úvod jen „Auto Praizler Mariánské Lázně“. Bez klíčových slov (autoservis, pneuservis). |
| Meta description | **chybí na všech stránkách** (jen testovací příspěvek má výchozí text WordPressu) |
| H1 | **chybí na všech stránkách** (Enfold používá h2/h3), jediný H1 je na testovacím příspěvku |
| Robots | `index, follow` všude, robots.txt povoluje vše kromě /wp-admin/ |
| Sitemapy | AIOSEO, index + 3 dílčí; `category-sitemap.xml` nedostupná |
| Canonical | nastavený správně na každé stránce |
| Přesměrování | http → https 301, www → bez www 301, `/zkusebni-stranka/` → `/` 301; 404 vrací 404 |
| Strukturovaná data | žádná (JSON-LD nenalezen); návrh v repu má schema.org `AutoRepair` |
| Jazyk | `content-language: cs`, žádný hreflang, žádná DE/EN verze |
| Indexace | neověřeno (vyžaduje Search Console). Odhad podle 6 URL v sitemapě: 5 až 6 stránek. |
| Obrázky | alt texty z roku 2021 typu „Levný autoservis Mariánské Lázně“ (keyword stuffing), ceník jako obrázek bez textu |
| Výkon | nemeřeno; úvod 78 kB HTML + Enfold (jQuery, slider) |

Doporučení pro nový web: zachovat URL `/sluzby/`, `/cenik/`, `/kontakt/`; `/usetrete/`, `/ahoj-vsichni/` a obě PDF přesměrovat; doplnit meta description, jeden H1 na stránku, hreflang pro DE/EN, schema.org z návrhu.

## 7. Otázky pro Jardu vyplývající z inventury

1. Komu patří hosting u SvetHostingu a kdo ho platí (Jarda nebo FineNet)? Jsou tam i e-maily servis@ a postmaster@?
2. Otevírací doba: platí polední pauza 12–13 a pátek do 17, nebo pátek do 15?
3. Platí ceník z března 2026 beze změn? Může být na webu jako tabulka?
4. Které služby trvají: motoservis, autopůjčovna, likvidace autovraků, LPG/CNG, odtah?
5. Pojišťovny, se kterými spolupracuje (ČP/Generali, Allianz, ČPP, Kooperativa?).
6. Které fotky jsou jeho (seznam v části 5), svolení k použití, případně termín nafocení.
7. Trvá spolupráce s Cebia a sběrné místo ELTMA?
8. Má PDF se zásadami zpracování osobních údajů od právníka, nebo ho připravil autor webu?
