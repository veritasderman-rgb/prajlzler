# wp/ – vlastní kód pro WordPress

Vše, co do WordPressu přidáváme nad rámec jádra a pluginů, je tady a verzuje se v repu. Žádné `wp-config.php`, exporty databáze ani zálohy (hlídá `.gitignore`).

```
wp/
  themes/autopraizler/   child theme Twenty Twenty-Five (bloková šablona), viz themes/autopraizler/README.md
  tools/fetch-fonts.sh   stažení písem Barlow do šablony (lokální hosting písem, bez Google Fonts za běhu)
  README.md              tento soubor
```

Nasazení na staging a produkci (přístupy, postup instalace WordPressu, nahrání šablony přes SFTP, HTTP auth a noindex stagingu) popisuje `docs/staging.md`. Výběr šablony a pluginů zdůvodňuje `docs/navrh-sablony.md`, strukturu stránek a vzorů `docs/obsahova-mapa.md`.

Šablona se na server nahrává jako celá složka `wp/themes/autopraizler/` do `wp-content/themes/`. Rodičovská šablona Twenty Twenty-Five je součástí WordPressu a musí být nainstalovaná (nemusí být aktivní).
