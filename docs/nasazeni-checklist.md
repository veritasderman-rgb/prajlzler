# Checklist nasazení nového webu (co musí udělat Josef, co Jarda)

Stav k 8. 11. 2026: nový statický web je kompletní ve složce `web/` a sloučený
v `main`. Vercel projekt `prajlzler` je napojený na repozitář, ale nasazuje
kořen repozitáře (starý koncept z října), ne složku `web/`. Dokud se to
nepřepne, na https://prajlzler.vercel.app běží starý koncept a podstránky
nového webu vrací 404.

Hodnoty tajných proměnných nejsou v repozitáři (je veřejný). Josef je má
v dočasném souboru session (`scratchpad/vercel-env.txt`) a v Resendu.

## 1. Vercel: přepnout projekt na složku `web` (Josef, 5 minut)

Vercel → projekt **prajlzler** → **Settings**:

1. **General → Root Directory**: nastavit `web`. Framework Preset nechat
   „Other“. Node.js verze může zůstat (funkce potřebují Node 20+).
2. **Environment Variables**: přidat pro **Production** i **Preview**:

   | Proměnná | Hodnota | K čemu |
   |---|---|---|
   | `RESEND_API_KEY` | klíč Resendu (soubor vercel-env.txt) | odesílání e-mailů z formuláře a přihlašovacích odkazů |
   | `CONTACT_TO` | `veritasderman@gmail.com` (později Jardův e-mail) | kam chodí poptávky z formuláře |
   | `CONTACT_FROM` | `AutoPraizler web <web@josefpavlovic.cz>` | odesílatel; doména musí být ověřená v Resendu (josefpavlovic.cz je) |
   | `ADMIN_SECRET` | dlouhý náhodný řetězec (soubor vercel-env.txt) | podepisování přihlašovacích odkazů a cookie administrace |
   | `ADMIN_EMAILS` | `veritasderman@gmail.com` (později i Jardův e-mail, oddělit čárkou) | kdo smí do správy aktualit |
   | `GITHUB_TOKEN` | token z bodu 2 | zápis aktualit do repozitáře |
   | `SITE_URL` | `https://prajlzler.vercel.app` (po přepnutí domény `https://autopraizler.cz`) | adresa v přihlašovacím odkazu |

   Volitelné (`GITHUB_REPO`, `GITHUB_BRANCH`) mají správné výchozí hodnoty,
   nenastavovat.
3. **Deployments → poslední produkční nasazení → Redeploy** (bez cache).
4. Ověřit: https://prajlzler.vercel.app/ ukazuje nový web (červený design,
   slider), https://prajlzler.vercel.app/kontakt/ a `/pneuservis/` fungují,
   `/robots.txt` a `/sitemap.xml` se načtou.

## 2. GitHub: token pro správu aktualit (Josef, 5 minut)

GitHub → Settings → Developer settings → Personal access tokens →
**Fine-grained tokens** → Generate new token:

- Token name: `autopraizler-aktuality`
- Expiration: 1 rok (po roce vytvořit nový a vyměnit ve Vercelu)
- Repository access: **Only select repositories** → `veritasderman-rgb/prajlzler`
- Permissions → Repository permissions → **Contents: Read and write**
  (nic dalšího)

Hodnotu vložit do Vercelu jako `GITHUB_TOKEN`. Token nikam neukládat do
repozitáře.

## 3. Test po nasazení (Josef, 10 minut; Claude může pomoct)

- Odeslat poptávku z `/kontakt/`, `/pneuservis/` a `/de/`; mail musí dorazit
  na `CONTACT_TO` s odpovědí (reply-to) na adresu z formuláře.
- Odeslat formulář s vypnutým JavaScriptem (nebo přes `curl`), musí
  přesměrovat zpět s hláškou.
- `/admin/`: zadat povolený e-mail, přijde odkaz, přihlásit se, založit
  zkušební aktualitu (skrytou), pak ji zveřejnit; v repozitáři vzniknou
  commity „Aktuality: …“ a do dvou minut je aktualita na úvodu a na
  `/novinky/`. Pak ji smazat.
- Projít web na mobilu (lišta Zavolat / Objednat dole).

## 4. Doména autopraizler.cz (Josef, až Jarda odsouhlasí přepnutí)

Podle ZADANI.md je Forpsi do schválení migrace jen ke čtení a MX záznamy se
nesmí měnit. Přepnutí webu se e-mailu nedotkne, mění se jen záznamy pro web.

1. Vercel → projekt → **Settings → Domains** → přidat `autopraizler.cz`
   a `www.autopraizler.cz` (www přesměrovat na bez www). Vercel ukáže přesné
   záznamy.
2. Forpsi → DNS zóna autopraizler.cz: změnit **jen**
   - `A` záznam pro `@` (kořen) na IP, kterou ukáže Vercel (dnes
     `76.76.21.21`),
   - `CNAME` pro `www` na hodnotu, kterou ukáže Vercel (dnes
     `cname.vercel-dns.com`).
   Nemazat MX, TXT (SPF, DKIM) ani nic jiného.
3. Po propagaci (minuty až hodiny) Vercel vystaví certifikát sám.
4. Ve Vercelu změnit `SITE_URL` na `https://autopraizler.cz` a znovu nasadit.
5. Starý web na SvetHostingu nechat běžet jako zálohu. **Hosting u
   SvetHostingu nerušit**: podle audit/hosting.md tam běží i Jardova pošta
   (MX domény míří na `mail.svethostingu.cz`, schránky jsou u SvetHostingu,
   ne u Forpsi). Přepnutí webu na Vercel ani Resend schránky nikam
   nepřenáší. Zrušit lze až poté, co se pošta prokazatelně přesune jinam
   (samostatně schválená migrace schránek, dohodnutá s Jardou), nebo co
   poskytovatel potvrdí, že lze zrušit jen web a poštu ponechat.

## 5. E-mail z Jardovy domény (Josef, později)

Dnes formulář odesílá z `web@josefpavlovic.cz`. Až má chodit z
`autopraizler.cz`:

1. Resend → Domains → Add domain `autopraizler.cz` (region EU).
2. Resend vypíše DNS záznamy: TXT pro DKIM, TXT SPF a MX pro **poddoménu**
   (např. `send.autopraizler.cz`). Ten MX se netýká hlavní domény a doručování
   Jardovy pošty neovlivní; přesto přepnutí domluvit s Jardou.
3. Po ověření změnit ve Vercelu `CONTACT_FROM` na
   `AutoPraizler web <web@autopraizler.cz>` a `CONTACT_TO` na Jardův e-mail.
4. Vyměnit `RESEND_API_KEY` za nový (dosavadní prošel chatem) a starý v
   Resendu smazat.

## 6. Měření konverzí (Jarda dodá, Josef nebo Claude doplní)

Do `web/js/config.js` doplnit a nasadit:

- Google Ads: ID značky `AW-…` a štítky dvou konverzí („Odeslání poptávky“,
  „Kliknutí na telefon“), vytvořené v Google Ads → Cíle → Konverze.
- GA4: ID měření `G-…` (nepovinné).
- Sklik: ID konverze (číslo) a případně hodnotu.

Dokud jsou ID prázdná, web nic neměří a neukazuje cookie lištu.

## 7. Po spuštění: vyhledávače (Josef, 20 minut)

- Google Search Console: ověřit `autopraizler.cz` (TXT záznam nebo přes
  Vercel), odeslat `https://autopraizler.cz/sitemap.xml`.
- Seznam Webmaster: přidat web, odeslat sitemap.
- Zkontrolovat strukturovaná data v „Test výsledků s rozšířenými funkcemi“
  (Google) na úvodu a na `/pneuservis/`.
- Firemní profil Google: stejný název, adresa, telefon a otevírací doba jako
  na webu; odkaz na web.

## 8. Otázky a rozhodnutí pro Jardu

- **Otevírací doba**: Po–Pá 8–12 a 13–17, So–Ne po dohodě. Potvrzeno 8. 11. 2026.
- **Ceník**: ceny jsou teď jen na stránce Ceník (1:1 ze starého webu, včetně
  PDF). Nechat, nebo stránku stáhnout a nechat jen „cenu řekneme po
  prohlídce“?
- **Německá a anglická stránka** (`/de/`, `/en/`): platba kartou i hotově,
  personál mluví německy a anglicky, parkování před dílnou, dvě minuty od
  nádraží. Potvrzeno 8. 11. 2026.
- **Povinné údaje podnikatele** (IČO 87674343, sídlo, živnostenský rejstřík,
  neplátce DPH) jsou podle ARES v patičce všech stránek a na Kontaktu. Hotovo.
- **Nadpis úvodu** „VÁŠ AUTOSERVIS!“ je ze starého webu; pro vyhledávače by
  pomohlo „Autoservis a pneuservis Mariánské Lázně“. Změnit?
- **Partneři a pojišťovny** na úvodu: zkontrolovat, že seznam odpovídá
  skutečnosti.
- **Recenze**: čísla (Google 4,7 z 80, Firmy.cz 4,9) jsou k 2. 10. 2026 a mění
  se ručně. Kdo je bude aktualizovat?
- **E-mail pro poptávky** a **přístup do administrace**: na jakou adresu.
- **Facebook**: odkaz v hlavičce vede na profil ze starého webu, ověřit.

## 9. Úklid repozitáře (Josef rozhodne, Claude udělá)

- V kořeni repozitáře leží starý koncept webu (`index.html`, `de/`, `en/`,
  `assets/` …) a 12 MB `autopraizler_podklady.zip`. Po přepnutí Root Directory
  se nenasazuje, ale v repozitáři zůstává. Návrh: přesunout do `archiv/` nebo
  smazat (historie v gitu zůstane).
- Složka `wp/` (WordPress šablona z fáze 5) se už nepoužívá; nechat jako
  zálohu, nebo smazat.

## 10. Předání Jardovi: web pod jeho vlastními účty (až se rozhodne)

Cílový stav: repozitář, hosting, odesílání e-mailů i doména patří Jardovi
a nic neběží přes Josefovy účty. Všechny tajné hodnoty budou nové, Jardovy;
nic z Josefova nastavení se nekopíruje.

### Doporučený postup (asi hodina, Claude může vést na dálku)

1. **GitHub**: Jarda si založí účet (stačí bezplatný). Josef mu převede
   repozitář: GitHub → repozitář → Settings → Danger Zone → Transfer
   ownership. Historie, PR i staré odkazy zůstanou (přesměrují se). Správa
   aktualit zapisuje do repozitáře tokenem, proto má repozitář patřit tomu,
   kdo web vlastní.
2. **Resend**: Jarda si založí účet, Domains → Add domain `autopraizler.cz`
   (region EU). Resend vypíše DNS záznamy (TXT pro DKIM a SPF, MX pro
   poddoménu typu `send.autopraizler.cz`); ty se zadají ve Forpsi. MX hlavní
   domény se nemění, pošta jede dál. Pak API Keys → vytvořit klíč.
3. **GitHub token**: podle bodu 2 tohoto checklistu, jen na Jardově účtu
   (fine-grained, jen repozitář prajlzler, Contents čtení a zápis).
4. **Vercel**: Jarda si založí účet a propojí ho s GitHubem. Add New →
   Project → Import repozitáře → Root Directory `web` → Environment
   Variables podle bodu 1 tohoto checklistu, ale s jeho hodnotami:

   | Proměnná | Hodnota |
   |---|---|
   | `RESEND_API_KEY` | klíč z Jardova Resendu |
   | `CONTACT_TO` | Jardův e-mail pro poptávky |
   | `CONTACT_FROM` | `AutoPraizler web <web@autopraizler.cz>` |
   | `ADMIN_SECRET` | nový náhodný řetězec (vygeneruje Claude nebo `openssl rand -hex 32`) |
   | `ADMIN_EMAILS` | Jardův e-mail (případně více, oddělené čárkou) |
   | `GITHUB_TOKEN` | token z bodu 3 |
   | `SITE_URL` | `https://autopraizler.cz` |

   Deploy, pak test podle bodu 3.
5. **Doména**: ve Vercelu Settings → Domains → `autopraizler.cz` a
   `www.autopraizler.cz`; ve Forpsi změnit A záznam kořene a CNAME `www` na
   hodnoty od Vercelu (bod 4 tohoto checklistu). Pokud web už běží na Josefově
   Vercelu, doménu tam nejdřív odebrat, jinak ji Vercel nepustí.
6. **Úklid u Josefa**: smazat projekt prajlzler ve Vercelu, smazat doménu a
   klíč v Resendu (nebo celý klíč, pokud se už nepoužívá), zrušit GitHub
   token. Zkontrolovat, že ve Forpsi nezůstaly staré TXT záznamy pro
   josefpavlovic.cz (tam žádné nebyly, formulář zatím posílá z Josefovy
   domény přes Josefův Resend).

### Alternativa: převod hotového projektu ve Vercelu

Vercel umí projekt převést na jiný účet (Settings → General → Transfer
Project; příjemce ho musí přijmout). Přenese se nastavení, domény i
proměnné prostředí, ale propojení s GitHubem se musí znovu navázat na
repozitář, ke kterému má Jarda přístup, takže převod repozitáře je potřeba
stejně. Proměnné by navíc obsahovaly Josefův Resend klíč a GitHub token,
které by se musely hned vyměnit. Ušetří to pár minut, je to méně čisté.

### Na co dát pozor

- **Tarif Vercelu**: bezplatný Hobby je podle podmínek Vercelu jen pro
  nekomerční použití. Web firmy je komerční, Jarda by měl počítat s tarifem
  Pro (20 USD měsíčně za uživatele), nebo zvolit hosting, kde je bezplatný
  tarif pro firmy povolený (Netlify, Cloudflare Pages). Statická část webu
  je přenositelná beze změn; čtyři serverové funkce (`web/api/`) by jinde
  potřebovaly menší úpravu obálky (Netlify Functions, Cloudflare Workers).
- **Dvoufázové přepnutí**: nejdřív rozjet web na Jardově Vercelu na
  dočasné adrese `*.vercel.app`, otestovat formulář i administraci a teprve
  pak přepnout doménu. Výpadek je pak jen propagace DNS.
- **Přihlášení do administrace** je vázané na `ADMIN_SECRET`: po jeho změně
  se musí každý přihlásit znovu (přijde nový odkaz e-mailem). Nic jiného se
  neztratí, aktuality jsou v repozitáři.
