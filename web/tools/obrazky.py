# -*- coding: utf-8 -*-
"""Responzivní obrázky: vytvoří WebP varianty (img/<název>-<šířka>.webp) a v HTML obalí <img> do <picture>
se srcset a sizes podle místa použití. Idempotentní: už obalené obrázky přeskočí, varianty přegeneruje
jen když chybí. Spouštět ze složky web/:  python3 tools/obrazky.py
Vyžaduje Pillow (pip install pillow). Originální JPEG/PNG zůstává jako záloha pro prohlížeče bez WebP."""
import os, re, sys
from PIL import Image

# zdroj -> šířky variant
VARIANTS = {
    'slider-1.jpg': (960, 1440, 1920), 'slider-2.jpg': (960, 1440, 1920), 'slider-3.jpg': (960, 1440, 1920),
    'provozovna-1.jpg': (800, 1200, 1600), 'provozovna-2.jpg': (700, 1400),
    'sluzby-ilustrace.png': (512, 1024),
}
for n in ('sluzba-pneuservis', 'sluzba-klimatizace', 'sluzba-autoskla', 'sluzba-diagnostika', 'sluzba-lakovani', 'sluzba-stk',
          'galerie-1', 'galerie-2', 'galerie-3', 'galerie-4'):
    VARIANTS[n + '.jpg'] = (450, 900)

# sizes podle stránky a obrázku (šířka obrázku v layoutu); výchozí hodnota podle názvu
SIZES_DEFAULT = {
    'slider': '100vw',
    'sluzba': '(max-width: 520px) 50vw, (max-width: 1000px) 33vw, 17vw',   # dlaždice na úvodu
    'galerie': '(max-width: 600px) 50vw, 25vw',
    'provozovna': '(max-width: 900px) 100vw, 50vw',
    'sluzby-ilustrace': '(max-width: 900px) 100vw, 33vw',
}
SIZES_PAGE = {
    ('pneuservis.html', 'sluzba'): '(max-width: 900px) 100vw, 45vw',
    ('klimatizace.html', 'sluzba'): '(max-width: 900px) 100vw, 45vw',
    ('stk.html', 'sluzba'): '(max-width: 900px) 100vw, 45vw',
    ('cenik.html', 'sluzba'): '(max-width: 900px) 100vw, 40vw',
    ('de.html', 'provozovna'): '(max-width: 900px) 100vw, 45vw',
    ('en.html', 'provozovna'): '(max-width: 900px) 100vw, 45vw',
}

def key(name):
    return 'sluzby-ilustrace' if name.startswith('sluzby-ilustrace') else name.split('-')[0]

def make_variants():
    made = 0
    for src, widths in VARIANTS.items():
        path = os.path.join('img', src)
        if not os.path.exists(path):
            print('chybí', path); continue
        with Image.open(path) as im:
            im = im.convert('RGB')
            for w in widths:
                out = os.path.join('img', f'{os.path.splitext(src)[0]}-{w}.webp')
                if os.path.exists(out): continue
                h = round(im.height * w / im.width)
                im.resize((w, h), Image.LANCZOS).save(out, 'WEBP', quality=82, method=6)
                made += 1
    print(f'variant vytvořeno: {made}')

IMG_RE = re.compile(r'<img\b([^>]*?)\bsrc="/img/([a-z0-9-]+\.(?:jpg|png))"([^>]*)>')

def patch_html():
    for page in sorted(f for f in os.listdir('.') if f.endswith('.html')):
        s = open(page, encoding='utf-8').read()
        out = []
        pos = 0
        n = 0
        regions = [(r.start(), r.end()) for r in re.finditer(r'<!-- @([a-z][a-z0-9-]*) -->[\s\S]*?<!-- /\1 -->', s)]
        for m in IMG_RE.finditer(s):
            name = m.group(2)
            if name not in VARIANTS:
                continue
            if any(a <= m.start() < b for a, b in regions):
                continue  # společná část stránky (partial), tu spravuje tools/build.mjs
            before = s[max(0, m.start() - 9):m.start()]
            if '<picture>' in before:
                continue  # už obaleno
            stem = os.path.splitext(name)[0]
            srcset = ', '.join(f'/img/{stem}-{w}.webp {w}w' for w in VARIANTS[name])
            sizes = SIZES_PAGE.get((page, key(stem)), SIZES_DEFAULT[key(stem)])
            out.append(s[pos:m.start()])
            out.append(f'<picture><source type="image/webp" srcset="{srcset}" sizes="{sizes}">{m.group(0)}</picture>')
            pos = m.end()
            n += 1
        if n:
            out.append(s[pos:])
            open(page, 'w', encoding='utf-8').write(''.join(out))
            print(f'{page}: obaleno {n}')

if __name__ == '__main__':
    make_variants()
    patch_html()
