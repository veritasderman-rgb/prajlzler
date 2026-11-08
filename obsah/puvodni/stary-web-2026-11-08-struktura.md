# autopraizler.cz – obsah a struktura starého webu

Staženo 8. 11. 2026 z https://autopraizler.cz (WordPress 5.6, šablona Enfold, stavěno v Avia Layout Builderu).
Texty jsou převzaté doslova i s překlepy (seznam je v části D). U každého obrázku je uvedený soubor, místo na stránce a popis.

Obsah:
- A. Struktura a vzhled webu
- B. Stránky po sekcích (rozložení, texty, obrázky)
- C. Katalog obrázků
- D. Překlepy a nesrovnalosti

---

# A. Struktura a vzhled webu

## Mapa webu

```
autopraizler.cz
├── Úvod                       /
├── Služby                     /sluzby/
├── Ušetřete za servis !!!     /usetrete/
├── Ceník                      /cenik/
│     └── PDF Orientační ceník 2026
└── Kontakt | Objednávka       /kontakt/

Mimo menu:
- PDF Zásady zpracování osobních údajů (odkaz z cookie lišty)
- /ahoj-vsichni/ (výchozí ukázkový příspěvek WordPressu, nikde odkázaný, prázdný)
```

Web je plochý, nemá podstránky druhé úrovně, blog ani aktuality. Žádná stránka nemá vyplněný meta description.

| Stránka | URL | Titulek (title) |
|---|---|---|
| Úvod | / | Auto Praizler Mariánské Lázně |
| Služby | /sluzby/ | Služby - Auto Praizler Mariánské Lázně |
| Ušetřete | /usetrete/ | Ušetřete - Auto Praizler Mariánské Lázně |
| Ceník | /cenik/ | Ceník - Auto Praizler Mariánské Lázně |
| Kontakt | /kontakt/ | Kontakt - Auto Praizler Mariánské Lázně |

## Vzhled

- **Barvy:** červená #F53F4C (hlavička, zvýrazněné sekce, nadpisy), téměř černá #111111 s jemnou šumovou texturou (tmavé sekce), tmavě šedá #242424 (horní lišta, pruh s copyrightem), bílá a světle šedá (světlé sekce, pruh v patičce)
- **Písma (Google Fonts):** Audiowide na nadpisy (hranaté „technické“ písmo), Coda na běžný text
- **Ikony:** fontové ikony šablony Enfold u služeb, odrážek a boxů v patičce
- **Animace:** prvky se při rolování postupně objevují, slider na úvodu se sám přepíná

## Společné prvky na všech stránkách

1. **Horní lišta** (tmavě šedá, úzká, vpravo): „+420 728 920 290 | servis@autopraizler.cz“ a ikony sociálních sítí:
   - Facebook → facebook.com/AutoPraizler-ML-104299981555466
   - ikona RSS → odkaz na Google vyhledávání (nejspíš měl vést na profil firmy na Googlu)
   - Mail → /#kontakt
   - Instagram → mrtvý odkaz (#)
2. **Hlavička** (červená, při rolování zůstává nahoře): vlevo logo (logo3x.jpg), vpravo menu ÚVOD · SLUŽBY · UŠETŘETE ZA SERVIS !!! · CENÍK · KONTAKT | OBJEDNÁVKA a ikona lupy (vyhledávání)
3. **Patička, pruh se třemi boxy** (světle šedý, kromě stránky Kontakt). Každý box má červenou ikonu a vede na /kontakt/:
   - ikona monitoru: OBJEDNEJTE SE K NÁM
   - ikona mobilu: ZAVOLEJTE NÁM
   - ikona špendlíku: NAVŠTIVTE NÁS
4. **Copyright** (tmavý pruh): © 2020 FineNet – Na netu v pohodě (na Službách © 2021), odkaz na finenet.cz
5. Tlačítko „nahoru“ vpravo dole, cookie lišta (plugin Complianz) s odkazem na PDF Zásady zpracování osobních údajů

---

# B. Stránky po sekcích

## 1. Úvod (/)

### Sekce 1: Slider přes celou šířku (3 snímky, střídají se samy, šipky a tečky)

| Snímek | Soubor | Alt | Co je na fotce |
|---|---|---|---|
| 1 | Titul1x.jpg | Autoservis Mariánské Lázně | Ruka v šedé pracovní rukavici povoluje klíčem šroub v motorovém prostoru, tmavě tónovaná fotka |
| 2 | Titul2x.jpg | Pneuservis Mariánské Lázně | Ruce v rukavicích drží pneumatiku, detail dezénu |
| 3 | Titul6.jpg | STK - emise Mariánské Lázně | Mechanik v montérkách s deskami na papíry mluví se zákazníkem, oba jsou vidět jen od pasu |

Text přes snímek (bílý, vlevo):

**VÁŠ AUTOSERVIS!**
AutoPraizler M.L. Mariánské Lázně
Volejte nám 728 920 290 *(podtržený odkaz)*

### Sekce 2: Pás šesti dlaždic se službami (šedé pozadí, přes celou šířku)

Šest fotek vedle sebe, přes každou je bílý popisek. Všechny dlaždice vedou na /sluzby/.

| Popisek | Soubor | Co je na fotce |
|---|---|---|
| Pneuservis - prodej pneu | 00071.jpg | Kolo s pneumatikou nasazené na modré vyvažovačce s displejem |
| Klimatizace a ozonová dezifekce | servicing-car-air-conditioner-…jpg | Zelený servisní přístroj na klimatizace s manometry, hadice vedou do motorového prostoru |
| Autoskla + vyřízení pojistných událostí | 020-1.jpg | Dva mechanici v modrých rukavicích usazují čelní sklo do auta |
| Elektro a diagnostika | computer-diagnostics-car-auto-service_266732-15393.jpg | Mechanik v modré vestě pracuje na notebooku u otevřené kapoty červeného auta |
| Opravy karoserií - lakování | detail-polishing-car-…jpg | Ruka s leštičkou leští šedý lak auta u zrcátka |
| STK + emise, geometrie | mechanic-examining-car-tyre-using-flashlight_1170-1595.jpg | Mladý mechanik pod zvednutým autem si baterkou prohlíží kolo a podvozek |

### Sekce 3: Partneři (bílé pozadí, tři sloupce 1/4 – 1/2 – 1/4)

- **Levý sloupec:** nadpis s červenou šipkou „Prověřte si auto na CEBIA“, pod ním banner **Cebia300x300.png** (odkaz na cz.cebia.com). Tmavě modrý čtverec s textem „JSME SMLUVNÍ PARTNER CEBIA – cebia – Prověřte si auto ještě před koupí“, ikonou dokumentu s autem a zeleným tlačítkem „PROVĚŘIT AUTO“.
- **Prostřední sloupec:** karusel log značek dílů, vidět jsou vždy 4 a postupně se posouvají: Ate, Castrol, LUK, Bosal, Bosch, Fram, Sachs, Mann Filter, Febi, ABS, Gates, Moog, QH, SKF, Valeo, Hella.
- **Pravý sloupec:** nadpis s červenou šipkou „Zajišťujeme ekologickou recyklaci pneu » ELTMA“, pod ním **Sberne-misto-ELTMA.png** (odkaz na eltma.cz). Kulatá šedá plaketa s nápisem „místo zpětného odběru pneumatik“ a zeleným logem eltma.

Pod nadpisem úvodu je navíc seznam služeb (v HTML jako text, vizuálně jsou to popisky dlaždic ze sekce 2):
- Pneuservis - prodej pneu
- Klimatizace a ozonová dezifekce
- Autoskla + vyřízení pojistných událostí
- Elektro a diagnostika
- Opravy karoserií - lakování
- STK + emise, geometrie

### Sekce 4: Nadpis „Ušetřete“ (tmavý pruh)

Ikona palce nahoru + **UŠETŘETE AŽ 60% Z CENY!!!** (bílé písmo Audiowide)

### Sekce 5: Výhody (červené pozadí, seznam s ikonami)

- (ikona ozubeného kola) Oproti originálním autoservisům používáme k opravám díly, které jsou svou kvalitou zcela srovnatelné s díly originálními, avšak nesrovnatelně levnější.
- (ikona) Společně s příznivou cenou práce tak výrazně ušetříte!
- (ikona skupiny lidí) Na zakázkách pracují vyškolení odborníci. Náš servis je vybaven moderním zařízením a přístroji.
- (ikona) Ke každému zákazníkovi přistupujeme individuálně!
- (ikona) Pravidelně také připravujeme výhodné sezónní akce zaměřené na údržbu či opravu vozidla.

### Sekce 6: Galerie (bílé pozadí, 4 fotky vedle sebe, po kliknutí se zvětší)

| Soubor | Co je na fotce |
|---|---|
| 061.jpg | Autodíly rozložené na bílém podkladu: brzdové kotouče, spojková sada, destičky, filtry, modrá nádobka |
| 078.jpg | Černobílý detail ozubených kol a ložisek (převodovka, diferenciál) |
| 047.jpg | Mechanik pod zvednutým autem montuje díly podvozku |
| 071.jpg | Usměvavá žena v modré košili se založenýma rukama, za ní mechanik u otevřené kapoty bílého auta |

Všechno jsou to fotky z fotobanky, ne z provozovny.

### Sekce 7: Patička (společná)

---

## 2. Služby (/sluzby/)

Celá stránka je na tmavém texturovaném pozadí.

### Sekce 1: Úvod (na střed)

Červená ikona (kruhové šipky)

**POSKYTUJEME KOMPLEXNÍ SLUŽBY**

Opravy, prohlídky a údržbu osobních, dodávkových a nákladních vozidel (do výšky 3,3 m).
Naším cílem je dlouhodobá spokojenost zákazníka, jak jednotlivce, tak firmy.

### Sekce 2: Služby ve třech sloupcích

Každá služba má malou červenou ikonu, bílý název a šedý popis.

**Levý sloupec (8 služeb):**
- **Autoservis** – Víceznačkový servis , záruční a pozáruční opravy
- **Pneuservis** – Odborná výměna pneumatik včetně přesného vyvážení
- **Motoservis** – Svěřte svou motorku, skútr nebo čtyřkolku odborníkům
- **STK a emise** – Služba na klíč – příprava, případná oprava, provedení kontroly
- **LPG - CNG** – Přestavby a servis s ohledem na technické možnosti vozidla
- **Opravy laku, karosárna** – Pro kvalitní výsledek používáme ověřené materiály a postupy
- **Autodíly, doplňky** – Kvaliní díly za nesrovnatelně nižší ceny (až o 60%!)
- **Servis klimatizace** – Prodloužení životnosti, odstranění pachů a plísní nechte na nás

**Prostřední sloupec:** ilustrace **Grafika3.png** (alt „Služby autoservisu, motoservisu a pneuservisu Mariánské Lázně“). Plochá vektorová grafika: ruka drží velkou lupu, v ní je vidět auto v garáži, kolem ve dvou půlkruzích šest kulatých ikon (auto na zvedáku, pneumatiky a disky, brzdový kotouč a tlumič, motor a autobaterie, olej a svíčky, mechanik s cedulkou „OK“ u diagnostiky, auto s klíči a „24h“).

**Pravý sloupec (8 služeb):**
- **Geometrie náprav** – Geometrii kol je nezbytné kontrolovat minimálně jednou ročně
- **Diagnostika, elektronika** – Provádíme instalace, opravy a servis autoelektroniky vč. diagnostiky
- **Autoskla** – Vyměníme jakékoli rozbité sklo na Vašem vozidle
- **Tažná zařízení** – Prodej a montáž tažných zařízení na osobní, terénní a dodávkové vozy
- **Odtahová služba** – Pokud máte na cestách problém s vozidlem jsme k dispozici
- **Pojistné události** – Zařídíme za Vás rychlou likvidaci pojistné události
- **Autopůjčovna** – Půjčíme Vám vozidlo a v případě servisu také náhradní vozidlo
- **Likvidace autovraků** – Zajistíme certifikát o ekologické likvidaci nepojízdného vozidla

### Sekce 3: Patička (společná, © 2021)

---

## 3. Ušetřete (/usetrete/)

Stránka je kopií sekcí 4–6 z úvodu.

### Sekce 1: Nadpis (tmavý pruh, na střed)

**UŠETŘETE AŽ 60% Z CENY!!!**

### Sekce 2: Výhody (červené pozadí, seznam s ikonami)

- Oproti originálním autoservisům používáme k opravám díly, které jsou svou kvalitou zcela srovnatelné s díly originálními, avšak nesrovnatelně levnější.
- Společně s příznivou cenou práce tak výrazně ušetříte!
- Na zakázkách pracují vyškolení odborníci. Náš servis je vybaven moderním zařízením a přístroji.
- Ke každému zákazníkovi přistupujeme individuálně!
- Pravidelně také připravujeme výhodné sezónní akce zaměřené na údržbu či opravu vozidla.

### Sekce 3: Galerie (4 fotky, stejné jako na úvodu)

061.jpg (autodíly), 078.jpg (ozubená kola), 047.jpg (mechanik pod autem), 071.jpg (žena v košili).

### Sekce 4: Patička (společná)

---

## 4. Ceník (/cenik/)

### Sekce 1: Nadpis (tmavý pruh, na střed)

**ORIENTAČNÍ CENÍK**

### Sekce 2: Ceník (bílé pozadí, dva sloupce)

**Levý sloupec:** červený nadpis **ORIENTAČNÍ CENÍK 2026** a pod ním obrázek **Cenik-2026.jpg**. Je to sken stránky A4 s ceníkem a po kliknutí se otevře PDF (wp-content/uploads/2026/03/Orientacni-cenik-2026.pdf). Text z obrázku:

> **Orientační ceník 2026**
>
> **MECHANICKÉ A OSTATNÍ PRÁCE**
>
> | Služba | Cena (již od) |
> |---|---|
> | Mechanické práce – Osobní vozy | 450 Kč / hod |
> | Mechanické práce – Nové vozy | 650 Kč / hod |
> | Mechanické práce – Dodávky (LUV) | 750 Kč / hod |
> | Elektromechanické a karosářské práce | 890 Kč / hod |
> | Lepení a montáž autoskel | 1500 Kč (dle náročnosti a materiálu) |
> | Oprava scelování autoskel | 500 Kč (dle druhu poškození) |
> | Antikorozní ochrana podvozků | Individuální |
> | Výměna oleje | 540,- |
> | Zápis do El.servisní knihy | (bez ceny) |
>
> **SERVIS KLIMATIZACE**
>
> | Služba | Cena (již od) |
> |---|---|
> | Dezinfekce klimatizace (standard) | 400 Kč |
> | Dezinfekce klimatizace (OZONEM) | 490 Kč |
> | Kontrola těsnosti systému | 500 Kč |
> | Tlaková zkouška systému | 600 Kč |
> | Vakuace a plnění klimatizace | 750 Kč |
> | Klimatizační hodina (práce mechanika) | 800 Kč |
>
> **DIAGNOSTIKA**
>
> | Služba | Cena (již od) |
> |---|---|
> | Základní diagnostika (čtení závad) | 490 Kč |
> | Kontrola technického stavu (zjištění závad) | 600 Kč |
> | Příprava na STK + Emise | 1 200 Kč (+ poplatky) |
> | Diagnostická hodina (specialista) | 950 Kč |
>
> **PNEUSERVIS**
>
> | Služba | Cena (již od) |
> |---|---|
> | Rychlooprava pneu (lepení knotem) | 250 Kč (NA POČKÁNÍ) |
> | Přezutí kol vč. vyvážení (do 17" plech) | 450 Kč |
> | Geometrie a sbíhavost náprav | 800 Kč (dle obtížnosti) |
> | Uskladnění pneu | 650 Kč (sezona) |
> | Likvidace pneu | zdarma |
>
> **VÝHODY PRO NOVÉ A FIREMNÍ ZÁKAZNÍKY**
>
> Zvýhodnění pro nové klienty: Individuální ceny na práci i díly dle dohody.

**Pravý sloupec:** dvě fotky pod sebou.
- **computer-diagnostics-car-auto-service_266732-15393.jpg**, alt „STK a emise na klíč Mariánské Lázně“. Mechanik v modré vestě s notebookem u otevřené kapoty, stejná fotka jako na dlaždici „Elektro a diagnostika“ na úvodu.
- **00071.jpg**, alt „Pneuservis na počkání od 260,- Kč Mariánské Lázně“. Kolo na modré vyvažovačce. Alt už neodpovídá ceníku 2026.

### Sekce 3: Patička (společná)

---

## 5. Kontakt (/kontakt/)

### Sekce 1: Kontakt a objednávka (tmavé pozadí, tři sloupce)

**Levý sloupec, kontaktní údaje:**

**AutoPraizler M.L.**
U Mlékárny 844/8A
353 01 Mariánské Lázně

**Telefon:** +420 728 920 290
**Email:** servis@autopraizler.cz

**Pracovní doba**
Po – Pá: 8.00 – 17.00, polední pauza 12.00 – 13.00
So – Ne: po telefonické dohodě

**GPS:** 49.9561919N, 12.6933308E

**Prostřední sloupec, objednávkový formulář:**

**Objednejte se k nám**

Pole: Jméno * · Email * · Telefon · Požadavek termínu · Zpráva * (víceřádkové), tlačítko **Odeslat**.

**Pravý sloupec, dvě fotky provozovny pod sebou** (jediné vlastní fotky, které jsou na webu vidět):
- **IMG_20210311_143348-x.jpg**: budova servisu z nároží za soumraku, dlouhá přízemní hala s několika sekčními vraty a nápisy na fasádě, před ní poutač s logem LASSA (pneumatiky) a zaparkované auto. Přes fotku je efekt padajícího sněhu.
- **IMG_20210311_143757x.jpg**: čelní pohled na troje šedá sekční vrata v oranžově orámované fasádě, nad nimi tmavý pás s logem a nápisy „AUTOSERVIS“ a „PNEUSERVIS“, na vratech cedule se službami. Také s efektem sněhu.

### Sekce 2: Mapa (přes celou šířku)

Vložená Google mapa se špendlíkem „AutoPraizler M.L.“ (U Mlékárny 844) a kartou firmy s hodnocením a tlačítkem „Otevřít v Mapách“.

### Sekce 3: Copyright

Na této stránce chybí pruh se třemi boxy, je tu jen řádek s copyrightem.

---

# C. Katalog obrázků

Typ: **vlastní** = fotka provozovny, **fotobanka** = podle názvu souboru nejspíš Freepik (na novém webu jen s ověřenou licencí), **značka** = logo cizí firmy nebo partnera.

## Použité na webu

| Soubor | Typ | Kde je | Popis |
|---|---|---|---|
| logo3x.jpg | logo | hlavička všech stránek | Nápis „AutoPraizler M.L.“ tučnou kurzívou s tmavým stínem na červeném podkladu |
| favicon.png | logo | ikona v záložce prohlížeče | Bílo-černé písmeno „A“ na červeném čtverci |
| Titul1x.jpg | fotobanka | Úvod, slider, snímek 1 | Ruka v rukavici s klíčem v motorovém prostoru |
| Titul2x.jpg | fotobanka | Úvod, slider, snímek 2 | Ruce v rukavicích drží pneumatiku |
| Titul6.jpg | fotobanka | Úvod, slider, snímek 3 | Mechanik s deskami mluví se zákazníkem |
| 00071.jpg | fotobanka | Úvod, dlaždice „Pneuservis“; Ceník, pravý sloupec | Kolo na modré vyvažovačce |
| servicing-car-air-conditioner-service-station_179755-5020.jpg | fotobanka | Úvod, dlaždice „Klimatizace“ | Zelený přístroj na plnění klimatizace s manometry |
| 020-1.jpg | fotobanka | Úvod, dlaždice „Autoskla“ | Dva mechanici usazují čelní sklo |
| computer-diagnostics-car-auto-service_266732-15393.jpg | fotobanka | Úvod, dlaždice „Elektro a diagnostika“; Ceník, pravý sloupec | Mechanik s notebookem u otevřené kapoty |
| detail-polishing-car-preparing-car-surface-before-coating-ceramics_55997-1387.jpg | fotobanka | Úvod, dlaždice „Opravy karoserií“ | Leštění laku leštičkou |
| mechanic-examining-car-tyre-using-flashlight_1170-1595.jpg | fotobanka | Úvod, dlaždice „STK + emise, geometrie“ | Mechanik s baterkou pod zvednutým autem |
| Cebia300x300.png | značka | Úvod, sekce Partneři, vlevo | Banner „Jsme smluvní partner Cebia – Prověřte si auto ještě před koupí“ |
| Sberne-misto-ELTMA.png | značka | Úvod, sekce Partneři, vpravo | Plaketa „místo zpětného odběru pneumatik“, logo eltma |
| Ate, Castrol, LUK, Bosal, Bosch, Fram-logo, Sachs, Mann_filter, Febi, ABS, Gates, Moog, QH, SKF, Valeo, Hella (.jpg, Bosal .jpeg) | značka | Úvod, sekce Partneři, karusel uprostřed | Loga výrobců dílů na bílém podkladu |
| 061.jpg | fotobanka | Úvod a Ušetřete, galerie | Rozložené autodíly na bílém |
| 078.jpg | fotobanka | Úvod a Ušetřete, galerie | Černobílá ozubená kola a ložiska |
| 047.jpg | fotobanka | Úvod a Ušetřete, galerie | Mechanik pod zvednutým autem |
| 071.jpg | fotobanka | Úvod a Ušetřete, galerie | Žena v modré košili, v pozadí mechanik u auta |
| Grafika3.png | fotobanka (ilustrace) | Služby, prostřední sloupec | Ruka s lupou nad autem, kolem ikony servisních služeb |
| Cenik-2026.jpg | dokument | Ceník, levý sloupec (proklik na PDF) | Sken ceníku 2026 |
| IMG_20210311_143348-x.jpg | **vlastní** | Kontakt, pravý sloupec nahoře | Budova servisu z nároží za soumraku, poutač LASSA, efekt sněhu |
| IMG_20210311_143757x.jpg | **vlastní** | Kontakt, pravý sloupec dole | Troje vrata s nápisy AUTOSERVIS / PNEUSERVIS, efekt sněhu |

## V knihovně médií, ale na webu nepoužité

| Soubor | Typ | Popis |
|---|---|---|
| Provozovna.jpg | **vlastní** | Budova servisu za denního světla, modrá obloha, šikmý pohled podél fasády s vraty a nápisem AUTOSERVIS, vpředu plot. Na novém webu nejspíš nejpoužitelnější fotka provozovny |
| 077.jpg | fotobanka | Ruce s klíči opravují motocykl s červeným rámem (hodí se k motoservisu) |
| 074.jpg | fotobanka | Tlakové mytí kola auta, oblaka páry |
| kit-timing-belt-with-rollers-white-wall_168171-317.jpg | fotobanka | Rozvodový řemen s kladkami a vodní pumpou na bílém |
| car-refuel-lpg-liquefied-petroleum-gas_39704-869.jpg | fotobanka | Tankovací pistole LPG v plnicím hrdle auta (hodí se k LPG/CNG) |
| blue-car-parked-sunny-street-red-stop-lights-hook-dragging-trailer-tow-hitch-towbar_127089-42.jpg | fotobanka | Tažné zařízení na zadní části modrého auta (hodí se k tažným zařízením) |
| 061x.jpg, 061-1.jpg | fotobanka | Jiné ořezy fotky 061 (autodíly) |
| 047x.jpg | fotobanka | Jiný ořez fotky 047 (mechanik pod autem) |
| 071xy.jpg | fotobanka | Jiný ořez fotky 071 (žena v košili) |
| 020.jpg | fotobanka | Jiný ořez fotky 020-1 (čelní sklo) |
| logo.jpg, logo3.jpg | logo | Varianty loga „AutoPraizler M.L.“ na červeném podkladu |
| Mahle.jpg | značka | Logo Mahle, v karuselu chybí |

## Dokumenty (PDF)

- 2026/03/Orientacni-cenik-2026.pdf: ceník 2026, proklik z obrázku na stránce Ceník
- 2023/12/00-Zasady-zpracovani-osobnich-udaju-aktualizovane.pdf: zásady GDPR, odkaz z cookie lišty

Všechny soubory leží v https://autopraizler.cz/wp-content/uploads/ v podsložkách podle roku a měsíce (2021/01, 2021/02, 2021/03, 2023/12, 2024/04, 2024/05, 2026/03).

---

# D. Překlepy a nesrovnalosti na starém webu

- „ozonová **dezifekce**“ → dezinfekce (Úvod)
- „**Kvaliní** díly“ → Kvalitní (Služby)
- „Víceznačkový servis **,** záruční…“ → mezera před čárkou (Služby)
- „UŠETŘETE AŽ **60%**“ → v češtině 60 %
- „Pokud máte na cestách problém s vozidlem**,** jsme k dispozici“ → chybí čárka
- V ceníku nemá „Zápis do El.servisní knihy“ cenu; „Oprava scelování autoskel“ zní kostrbatě
- Alt obrázku na Ceníku uvádí „pneuservis od 260 Kč“, ceník 2026 má rychloopravu od 250 Kč a přezutí od 450 Kč
- Fotka mechanika s notebookem má na Ceníku alt „STK a emise na klíč“, na úvodu je u ní popisek „Elektro a diagnostika“
- Stránka Ušetřete je jen kopie bloků z úvodu
- Ikona Instagramu v horní liště vede na „#“ a ikona RSS na Google vyhledávání
- Na webu jsou vidět jen dvě vlastní fotky provozovny, všechno ostatní je z fotobanky
- Copyright 2020/2021 a patička FineNet jsou zastaralé
