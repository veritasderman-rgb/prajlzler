# Obsahová mapa pro WordPress (fáze 3)

*Převod statického návrhu (repo) do struktury WordPressu. Texty = návrh v repu, doplněné o údaje ze starého webu podle `audit/web-inventura.md`. Kde se zdroje liší, je to otázka pro Jardu, ne rozhodnutí.*

## 1. Zásady převodu

- **Jedna stránka návrhu = jedna stránka WordPressu.** Žádné vlastní typy obsahu, žádný page builder. Vše v blokovém editoru.
- **Opakované bloky jako synchronizované vzory** (Synced Patterns, dříve Reusable Blocks): upraví se na jednom místě, změna se projeví všude. Jarda mění text, ne rozložení.
- **Nesynchronizované vzory (Block Patterns)** pro věci, které se opakují tvarem, ale ne obsahem: karta služby, karta recenze, krok postupu, FAQ položka. Jarda vloží vzor a přepíše text.
- **Globální údaje** (telefon, e-mail, adresa, otevírací doba) jen na jednom místě: v synchronizovaném vzoru „Kontaktní údaje“ a v patičce. Nikde v textu stránek natvrdo.
- Vícejazyčnost: každá CZ stránka s překladem má DE a EN variantu jako samostatnou stránku pod rodičovskou stránkou `/de/` resp. `/en/`, s vlastní šablonou (hlavička a patička v daném jazyce). Propojení pro `hreflang` a přepínač jazyků řeší child theme, bez překladového pluginu (viz `docs/navrh-sablony.md`, část 3).

## 2. Mapa stránek

| URL (CZ) | Stránka | Zdroj textu | DE | EN | Poznámka |
|---|---|---|---|---|---|
| `/` | Úvod | `index.html` | `/de/` | `/en/` | úvodní stránka webu; `/de/` a `/en/` jsou rodičovské stránky DE a EN větve |
| `/pomoc-v-nouzi/` | Pomoc v nouzi | `pomoc-v-nouzi.html` | `/de/hilfe/` | `/en/help/` | hlavní stránka konceptu |
| `/sluzby/` | Služby | `sluzby.html` + doplnění ze starého webu | ne | ne | URL shodná se starým webem |
| `/cenik/` | Ceník | `obsah/puvodni/cenik.md` (ceník 2026) | ne | ne | **nová stránka**, URL shodná se starým webem |
| `/o-nas/` | O nás | `o-nas.html` | ne | ne | |
| `/recenze/` | Recenze | `recenze.html` | ne | ne | |
| `/kontakt/` | Kontakt | `kontakt.html` + formulář ze starého webu | `/de/kontakt/` | `/en/contact/` | URL shodná se starým webem |
| `/karta-pro-recepce/` | Karta pro recepce | `karta-pro-recepce.html` | ne | ne | `noindex`, tisková šablona bez hlavičky a patičky |
| `/ochrana-osobnich-udaju/` | Ochrana osobních údajů | nové (PDF ze starého webu jen jako podklad) | ne | ne | **nová stránka**, povinná kvůli formuláři |
| `/dekujeme/` | Poděkování po odeslání formuláře | nové, 3 věty | ne | ne | `noindex`, volitelné |

Přesměrování 301 ze starého webu:

| Stará URL | Cíl |
|---|---|
| `/usetrete/` | `/sluzby/` |
| `/ahoj-vsichni/` | `/` |
| `/zkusebni-stranka/` | `/` (již existuje) |
| `/wp-content/uploads/2026/03/Orientacni-cenik-2026.pdf` | `/cenik/` (nebo zachovat schválenou kopii PDF na stejné URL, pokud ho Jarda šíří tiskem nebo QR kódem, otázka 3) |
| `/wp-content/uploads/2023/12/00-Zasady-zpracovani-osobnich-udaju-aktualizovane.pdf` | `/ochrana-osobnich-udaju/` |

Ostatní URL (`/`, `/sluzby/`, `/cenik/`, `/kontakt/`) zůstávají beze změny. Odkazy na obě PDF mohou být v e-mailech nebo na tiskovinách, proto nesmí skončit na 404.

Menu (hlavní): Pomoc v nouzi, Služby, Ceník, O nás, Recenze, Kontakt, přepínač CZ/DE/EN, telefon. Menu DE a EN: Pannenhilfe / Breakdown help, Kontakt / Contact, zpět na CZ.

## 3. Co je vzor, co je obyčejný text

### Synchronizované vzory (jedna pravda pro celý web)

| Vzor | Obsah | Kde se používá |
|---|---|---|
| **Kontaktní údaje** | telefon (odkaz `tel:`), WhatsApp, e-mail, adresa, GPS | Úvod, Pomoc v nouzi, Kontakt, patička, karta pro recepce |
| **Otevírací doba** | tabulka Po–Čt / Pá / So–Ne | Úvod, Kontakt, patička, karta |
| **Výzva „Zavolat“** | oranžové tlačítko Zavolat + WhatsApp + jedna věta | konec každé stránky |
| **Pásmo DE/EN** | „Autopanne in Marienbad? Car trouble?“ s odkazy na DE/EN | Úvod (CZ) |
| **Důvěra v číslech** | 4,7 ★ Google · 80 recenzí, 15 let, 3,3 m, 2 min od nádraží | Úvod, O nás |
| **Patička** | logo, popis, kontakt, otevřeno, odkazy, fakturační adresa, Facebook | všude (jako template part šablony) |
| **Mobilní lišta Zavolat + WhatsApp** | pevná lišta dole na mobilu | všude (template part nebo CSS šablony) |

### Nesynchronizované vzory (Jarda vloží a přepíše)

| Vzor | Pole | Kde |
|---|---|---|
| Karta služby | ikona/nadpis, 1 až 2 věty, volitelně seznam odrážek | Úvod (6×), Služby (13×) |
| Karta recenze | 5 hvězd, citace, jméno · zdroj, rok, volitelně odpověď majitele | Úvod (3×), Recenze (12×), Pomoc v nouzi (4×) |
| Krok postupu | číslo, nadpis, věta | Pomoc v nouzi (4×) |
| FAQ položka | otázka (details/summary), odpověď | Pomoc v nouzi (5×) |
| Tabulka ceníku | kategorie, řádky služba / cena od | Ceník (4 tabulky) |
| Dvě vstupní karty | „Jsem na cestách“ / „Jsem z Mariánek“ | Úvod |
| Galerie 2×2 | 4 fotky | O nás |

### Obyčejný text (Jarda přepisuje přímo v editoru)

Úvodní odstavce stránek, příběh v O nás, popisy služeb, texty FAQ, poznámka pod ceníkem, zásady osobních údajů.

### Co Jarda sám měnit nebude (součást šablony / child theme)

Barvy a písmo, hlavička a patička (jen texty v nich přes vzor), mobilní lišta, tisková verze karty pro recepce, schema.org, hreflang, přesměrování.

## 4. Obsah stránek po doplnění

### Úvod
Beze změn proti návrhu. Doplnit do sekce služeb odkaz na Ceník. Do bloku „Proč k nám“ doplnit Valeo, Hella, Mahle k dílům (ze starého webu). Hero fotka až po potvrzení původu.

### Pomoc v nouzi
Beze změn. Odpověď na otázku „Pomůžete i o víkendu?“ závisí na otevírací době (otázka 1).

### Služby
Návrh + ze starého webu:
- **Pneuservis:** doplnit „uskladnění pneu (pneuhotel)“ a „ekologická likvidace pneu zdarma, sběrné místo ELTMA“ (ceník 2026 + starý úvod). Ověřit (otázka 7).
- **Klimatizace:** doplnit „dezinfekce ozonem“ (starý web i ceník).
- **Diagnostika:** doplnit „zápis do elektronické servisní knihy“ (ceník).
- **Karosárna:** doplnit „antikorozní ochrana podvozků“ (ceník).
- **Motoservis** (motorky, skútry, čtyřkolky): zařadit jen po potvrzení (otázka 4).
- **Autopůjčovna** vs. náhradní vozidlo: po potvrzení (otázka 4).
- **Likvidace autovraků:** po potvrzení (otázka 4).
- **Cebia:** krátká věta s odkazem, po potvrzení (otázka 7).
- Blok „Díly, se kterými pracujeme“ převezme smysl stránky Ušetřete (kvalita srovnatelná s originálem, nižší cena, sezónní akce). Číslo „až 60 %“ jen pokud Jarda trvá (otázka 5).
- Pojišťovny: ponechat výčet z návrhu jen po potvrzení (otázka 6).

### Ceník (nová stránka)
Čtyři tabulky z `obsah/puvodni/cenik.md` v pořadí: Mechanické a ostatní práce, Servis klimatizace, Diagnostika, Pneuservis. Pod ně odstavec „Výhody pro nové a firemní zákazníky“ a povinná věta: „Uvedené ceny jsou orientační. Přesná kalkulace bude stanovena na základě stavu vozidla a náročnosti úkonu.“ Jak psát ceny (s DPH / bez / neplátce) závisí na otázce 8.

### O nás
Beze změn. Galerie až po potvrzení původu fotek. Fotky týmu doplnit po nafocení.

### Recenze
Beze změn. Odkazy „Recenze na Google“ a „Hodnocení na Firmy.cz“ ověřit po spuštění (README bod 10).

### Kontakt
Návrh + kontaktní formulář ze starého webu: Jméno*, E-mail*, Telefon, Požadovaný termín, Zpráva*, souhlas se zpracováním (odkaz na zásady), antispam. Odesílat na servis@autopraizler.cz. Otevírací doba podle otázky 1.

### Ochrana osobních údajů (nová stránka)
Správce: Jaroslav Praizler, IČO 87674343, sídlo U Hřiště 280, Velká Hleďsebe. Účel: vyřízení poptávky z formuláře a komunikace. Doba uchování, práva subjektu, kontakt. Cookies: jen technické, pokud nebude analytika; mapa Google jako vložený obsah třetí strany (uvést). Starý PDF z 12/2023 projít jako podklad, nepřebírat slepě (otázka 9).

### Karta pro recepce
Beze změn, tisková stránka A5 na šířku, dva QR kódy (`assets/img/qr-tel.svg`, `qr-hilfe.svg`), `noindex`.

### DE a EN stránky
Beze změn proti `de/*.html` a `en/*.html`. Otevírací doba v kartě a na DE/EN kontaktech musí odpovídat rozhodnutí v otázce 1.

## 5. Média

Do WordPressu nahrát jen: logo (SVG z `assets/logo/`, povolit SVG upload pro administrátora nebo převést na PNG), QR kódy, a fotky s potvrzeným původem. Fotky ze starého webu (stock Freepik, slider, grafika) se nepřenášejí. Viz `audit/web-inventura.md`, část 5.

## 6. Otevřené otázky pro Jardu (sloučeno z README.md, podklady.md a inventury)

| # | Otázka | Ovlivní |
|---|---|---|
| 1 | **Otevírací doba.** Starý web: Po–Pá 8–17 s pauzou 12–13. Google a návrh: Po–Čt 8–17, Pá 8–15. Firmy.cz: 8–12, 13–17. Co platí? | Úvod, Kontakt, patička, karta, DE/EN, schema.org, Google profil |
| 2 | **Hosting a e-mail.** Komu patří účet u SvetHostingu (web i příchozí pošta tam běží)? Platí ho Jarda, nebo FineNet? Existuje tam schránka servis@ a kde ji Jarda čte? Ví, že zároveň platí u Forpsi nevyužitý Windows hosting PIDI+mail (508 Kč/rok)? | kde nový web poběží, migrace pošty, zrušení PIDI |
| 3 | **Ceník.** Platí ceny z března 2026? Smí být na webu jako text? Šíří Jarda někde odkaz na PDF ceníku (tisk, QR), aby zůstalo PDF na původní URL? | Ceník, přesměrování |
| 4 | **Služby.** Trvá motoservis, autopůjčovna, likvidace autovraků, LPG/CNG (Elpigas), odtah, tažná zařízení? Autobazar (nápis na štítu)? | Služby, Úvod |
| 5 | **„Až 60 %“** úspory na dílech: chce to Jarda na webu? | Služby |
| 6 | **Pojišťovny**, se kterými spolupracuje. | Služby, Pomoc v nouzi |
| 7 | **Cebia a ELTMA**, trvá spolupráce? Pneuhotel? | Služby |
| 8 | **Plátce DPH.** ARES: registrace zaniklá. Ceny psát jako konečné? | Ceník |
| 9 | **Zásady osobních údajů.** Kdo připravil PDF z 12/2023, platí? | nová stránka |
| 10 | **Fotky.** Které z fotek v `audit/web-inventura.md` jsou jeho? Termín nafocení týmu a dílny. | všechny stránky |
| 11 | **Chladivo** klimatizace: jen R134a, nebo i R1234yf? | Služby, Pomoc v nouzi |
| 12 | **Platba kartou a WhatsApp** na 728 920 290 opravdu fungují? | Pomoc v nouzi, Kontakt, mobilní lišta |
| 13 | **Formulář:** kam mají chodit poptávky (servis@)? Chce i SMS/WhatsApp notifikaci? | Kontakt |
| 14 | **Google Business profil**: má k němu přístup? (sjednocení údajů ve fázi 6) | fáze 6 |
