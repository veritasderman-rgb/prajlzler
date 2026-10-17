#!/usr/bin/env sh
# Stáhne písma Barlow (400/500/600/700) a Barlow Condensed (600/700) jako woff2
# (podmnožiny latin + latin-ext kvůli češtině) z Google Fonts do složky
# themes/autopraizler/assets/fonts. Web pak písma servíruje sám a za běhu
# nevolá Google (GDPR). Spustit při změně řezů; licence je v OFL.txt vedle písem.
#
# Pozor: theme.json má u každého řezu "unicodeRange" opsaný z CSS Google Fonts.
# Když se rozsahy změní, upravit i theme.json (skript rozsahy vypíše).
set -eu

DIR="$(cd "$(dirname "$0")/../themes/autopraizler/assets/fonts" && pwd)"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
URL='https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700&display=swap'

CSS="$(curl -sS -A "$UA" "$URL")"

printf '%s\n' "$CSS" | awk '
	/^\/\* /         { subset = $2 }
	/font-family:/   { fam = $0; sub(/.*font-family: '\''/, "", fam); sub(/'\''.*/, "", fam); fam = tolower(fam); gsub(/ /, "-", fam) }
	/font-weight:/   { w = $2; sub(/;/, "", w) }
	/unicode-range:/ { if (subset == "latin" || subset == "latin-ext") ranges[subset] = $0 }
	/src: url\(/     { url = $0; sub(/.*url\(/, "", url); sub(/\).*/, "", url)
	                   if (subset == "latin" || subset == "latin-ext") print fam "-" w "-" subset " " url }
	END { for (s in ranges) print "RANGE " s " " ranges[s] > "/dev/stderr" }
' | while read -r name url; do
	curl -sS -A "$UA" -o "$DIR/$name.woff2" "$url"
	echo "ok $name.woff2"
done

echo "Hotovo. Zkontrolujte unicode-range (výše na stderr) proti theme.json."
