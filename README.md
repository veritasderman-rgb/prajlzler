# AutoPraizler M.L. – web

Statický web pro autoservis AutoPraizler M.L. v Mariánských Lázních. Koncept „Pomoc na cestách“ (hosté lázní, DE/EN) postavený na kostře klidného, důvěryhodného webu rodinného servisu.

Bez buildu, bez frameworku. Stačí nahrát obsah repozitáře na hosting.

## Struktura

| Soubor | Obsah |
|---|---|
| `index.html` | Úvod: dva vstupy (na cestách / místní), služby, proč k nám, recenze, DE/EN pásmo, kontakt |
| `pomoc-v-nouzi.html` | Hlavní stránka konceptu: kroky, s čím pomáháme, FAQ, recenze hostů, odkaz na kartu pro recepce |
| `sluzby.html` | Kompletní seznam služeb, značky, díly, vysvětlení servisu v záruce |
| `o-nas.html` | Příběh, hodnoty, dílna a vybavení, galerie |
| `recenze.html` | Výběr recenzí z Googlu a Firmy.cz, odkazy na napsání recenze |
| `kontakt.html` | Kontakt, otevírací doba, mapa, jak k nám, fakturační údaje |
| `karta-pro-recepce.html` | Tisková karta A5 pro recepce hotelů (telefon + dva QR kódy), `noindex` |
| `de/index.html`, `de/hilfe.html`, `de/kontakt.html` | Německá verze (úvod, Pannenhilfe, kontakt) |
| `en/index.html`, `en/help.html`, `en/contact.html` | Anglická verze (úvod, Breakdown help, contact) |
| `assets/css/style.css` | Jediný stylesheet |
| `assets/js/main.js` | Mobilní menu, rok v patičce |
| `assets/logo/` | Logo v křivkách (SVG), viz níže |
| `assets/img/` | Fotky zmenšené pro web (JPG + WebP), QR kódy |
| `tools/make_logo.py` | Generátor loga |
| `autopraizler_podklady.zip` | Původní podklady (texty, recenze, fotky v plném rozlišení) |

## Logo

Logo bylo rekonstruováno z bitmapy na banneru a z nápisu na budově. Všechny varianty jsou čistě vektorové, bez závislosti na fontech (nápis je převedený do křivek).

| Soubor | Použití |
|---|---|
| `autopraizler-logo.svg` | Hlavní horizontální logo: klíč v oranžovém poli + nápis se siluetou auta. Na světlé pozadí. |
| `autopraizler-logo-orange.svg` | Totéž na oranžovém panelu (styl banneru). |
| `autopraizler-wordmark.svg` | Jen nápis a silueta, tmavý, na světlé pozadí. |
| `autopraizler-wordmark-white.svg` | Jen nápis a silueta, bílý, na tmavé pozadí (patička). |
| `autopraizler-mark.svg` | Čtvercová značka s klíčem (avatar na sociální sítě, ikona aplikace). |
| `favicon.svg` | Favicon. |

Barvy: oranžová `#F28C1E` (světlá `#FBB040`, tmavá `#D9641A`), černá `#1E1E1E`.

Písmo nápisu je Liberation Sans Bold Italic (metricky shodné s Arial Bold Italic, nejbližší dostupná náhrada originálu). Pro regeneraci po úpravě:

```
pip install fonttools
python3 tools/make_logo.py
```

## Co je potřeba doplnit nebo ověřit s majitelem

Údaje na webu jsou sestavené z veřejných zdrojů (Google, Firmy.cz, ARES, starý leták). Před spuštěním je nutné ověřit:

1. **Otevírací doba.** Na webu je verze z Googlu (Po–Čt 8–17, Pá 8–15, víkend po domluvě). Firmy.cz uvádí polední pauzu 12–13. Sjednotit všude.
2. **Služby, které stále platí:** motoservis, autopůjčovna, odtah, LPG/CNG, likvidace autovraků. Na štítu budovy je také nápis **AUTOBAZAR**, v podkladech není, na web zatím nedán.
3. **Pojišťovny.** Na banneru jsou kromě ČP, Allianz a ČPP i Generali a Kooperativa. Na stránce služeb jsou uvedeny všechny, ověřit.
4. **Ceny.** Na webu nejsou žádné konkrétní ceny (leták uvádí přezutí „od 260 Kč“, pravděpodobně zastaralé). Doplnit orientační ceník u přezutí, oleje, geometrie, klimatizace a STK na klíč.
5. **Plátce DPH.** Podle ARES registrace zaniklá. Ovlivní, jak psát ceny.
6. **Chladivo klimatizace.** Uvedena jen stanice TEXA; ověřit, zda i R1234yf.
7. **Fotky lidí.** Web zatím nemá fotku majitele ani týmu. Stránka O nás na ně počítá, po nafocení přidat.
8. **Platba kartou a WhatsApp.** Na webu je obojí uvedeno jako dostupné. Ověřit, že terminál i WhatsApp na čísle 728 920 290 opravdu fungují.
9. **Doména a hosting.** Web autopraizler.cz byl při sběru podkladů nedostupný. Po nasazení zkontrolovat, že všechny kanonické URL a hreflang odkazy v hlavičkách odpovídají skutečné doméně.
10. **Odkaz „Recenze na Google“** na stránce recenzí používá Place ID odvozené z URL Google Maps. Po spuštění kliknout a ověřit, že otevře správný profil.

## Technické poznámky

- Schema.org `AutoRepair` v `index.html` (adresa, GPS, otevírací doba, telefon).
- `hreflang` propojení CZ/DE/EN na stránkách, které mají překlad.
- Mapa je vložená přes Google Maps embed bez API klíče.
- Fonty Barlow a Barlow Condensed z Google Fonts, s fallbackem na systémová písma.
- Na mobilu je dole pevná lišta „Zavolat“ + WhatsApp.
