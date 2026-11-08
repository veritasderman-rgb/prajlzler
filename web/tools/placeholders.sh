#!/usr/bin/env bash
# Vygeneruje dočasné zástupné obrázky do web/img/ (jen pokud soubor ještě neexistuje).
# Skutečné fotky (AI generované) se do web/img/ nahrají pod stejnými názvy a tento skript je nepřepíše.
# Použití: bash web/tools/placeholders.sh
set -euo pipefail
DIR="$(cd "$(dirname "$0")/../img" && pwd)"

# název|šířka|výška|popisek
LIST=(
  "slider-1.jpg|1920|650|Slider 1 – motor, klíč"
  "slider-2.jpg|1920|650|Slider 2 – pneumatika"
  "slider-3.jpg|1920|650|Slider 3 – mechanik a zákazník"
  "sluzba-pneuservis.jpg|900|600|Pneuservis"
  "sluzba-klimatizace.jpg|900|600|Klimatizace"
  "sluzba-autoskla.jpg|900|600|Autoskla"
  "sluzba-diagnostika.jpg|900|600|Diagnostika"
  "sluzba-lakovani.jpg|900|600|Lakování"
  "sluzba-stk.jpg|900|600|STK a emise"
  "galerie-1.jpg|900|600|Galerie 1 – autodíly"
  "galerie-2.jpg|900|600|Galerie 2 – ozubená kola"
  "galerie-3.jpg|900|600|Galerie 3 – mechanik pod autem"
  "galerie-4.jpg|900|600|Galerie 4 – žena a mechanik"
  "sluzby-ilustrace.png|1200|1200|Ilustrace služeb"
)

have_convert=0
if command -v convert >/dev/null 2>&1; then have_convert=1; fi

made=0
for item in "${LIST[@]}"; do
  IFS='|' read -r name w h label <<<"$item"
  out="$DIR/$name"
  if [ -e "$out" ]; then
    continue
  fi
  if [ "$have_convert" = 1 ]; then
    convert -size "${w}x${h}" gradient:'#3a3a3a-#161616' \
      -fill '#F53F4C' -draw "rectangle 0,$((h-14)) $w,$h" \
      -fill '#cfcfcf' -gravity center -pointsize $((w/28)) -annotate +0-20 "$label" \
      -fill '#8a8a8a' -pointsize $((w/48)) -annotate +0+40 "zástupný obrázek ${w}×${h}" \
      -quality 80 "$out"
  else
    php -r '
      [$out,$w,$h,$label] = array_slice($argv,1);
      $im = imagecreatetruecolor((int)$w,(int)$h);
      for ($y=0;$y<$h;$y++){ $c=(int)(58-(42*$y/$h)); $col=imagecolorallocate($im,$c,$c,$c); imageline($im,0,$y,$w,$y,$col);}
      $red=imagecolorallocate($im,245,63,76); imagefilledrectangle($im,0,$h-14,$w,$h,$red);
      $grey=imagecolorallocate($im,207,207,207);
      $t=$label; $f=5; $tw=imagefontwidth($f)*strlen($t); imagestring($im,$f,(int)(($w-$tw)/2),(int)($h/2)-20,$t,$grey);
      $t2="placeholder {$w}x{$h}"; $tw2=imagefontwidth(3)*strlen($t2); imagestring($im,3,(int)(($w-$tw2)/2),(int)($h/2)+10,$t2,$grey);
      if (substr($out,-4)===".png") imagepng($im,$out); else imagejpeg($im,$out,80);
    ' "$out" "$w" "$h" "$label"
  fi
  echo "vytvořeno: $out"
  made=$((made+1))
done
echo "hotovo ($made nových souborů)"
