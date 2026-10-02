#!/usr/bin/env python3
"""Generates the AutoPraizler M.L. logo as pure-vector SVG files.

The wordmark is converted to outlines from Liberation Sans Bold Italic
(metrically compatible with Arial Bold Italic, which is the closest match
to the lettering on the original banner). The car-silhouette swoosh and the
wrench mark are hand-drawn Bézier paths. Nothing in the output depends on
fonts being installed.

Usage: python3 tools/make_logo.py  (writes into assets/logo/)
Requires: pip install fonttools
"""
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

FONT = "/usr/share/fonts/truetype/liberation/LiberationSans-BoldItalic.ttf"
OUT = Path(__file__).resolve().parent.parent / "assets" / "logo"

ORANGE = "#F28C1E"
ORANGE_DARK = "#D9641A"
ORANGE_LIGHT = "#FBB040"
INK = "#1E1E1E"
WHITE = "#FFFFFF"

TEXT = "AutoPraizler M.L."
SIZE = 100  # em size in SVG units


def text_outline(text: str, size: float, x: float, y: float) -> str:
    """Return SVG path data for `text` at baseline (x, y), em size `size`."""
    font = TTFont(FONT)
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    upem = font["head"].unitsPerEm
    hmtx = font["hmtx"]
    scale = size / upem
    pen = SVGPathPen(glyph_set)
    cursor = x
    for ch in text:
        name = cmap[ord(ch)]
        tp = TransformPen(pen, (scale, 0, 0, -scale, cursor, y))
        glyph_set[name].draw(tp)
        cursor += hmtx[name][0] * scale
    return pen.getCommands(), cursor - x


WORD_D, WORD_W = text_outline(TEXT, SIZE, 0, 0)

# --- Car silhouette swoosh -------------------------------------------------
# A single closed shape: thin at both ends, thick over the roof.
# Coordinates are in the same units as the wordmark (baseline y = 0).
SWOOSH_D = (
    "M 0 -96 "
    "C 120 -118 220 -122 300 -120 "
    "C 380 -152 470 -192 620 -198 "
    "C 760 -203 880 -172 1000 -142 "
    "C 1070 -124 1120 -110 1160 -100 "
    "C 1120 -104 1070 -114 1000 -128 "
    "C 880 -156 760 -184 620 -180 "
    "C 480 -176 400 -140 318 -106 "
    "C 240 -106 130 -104 0 -96 Z"
)

# --- Wrench mark -------------------------------------------------------------
# Drawn upright, then rotated 45° so it leans like the icon on the banner.
# Head: ring with an open jaw; handle: slightly waisted bar with rounded tip.
WRENCH_D = (
    # head (ring with open jaw) then handle, one closed contour
    "M -17 -56 L -17 -22 C -17 -11 -8 -6 0 -6 C 8 -6 17 -11 17 -22 L 17 -56 "
    "C 38 -48 50 -29 50 -8 C 50 13 39 28 24 34 "
    "L 14 34 L 14 100 C 14 110 7 116 0 116 C -7 116 -14 110 -14 100 "
    "L -14 34 L -24 34 C -39 28 -50 13 -50 -8 C -50 -29 -38 -48 -17 -56 Z"
)
WRENCH_CY = 30  # vertical centre of the upright wrench (-56 .. 116)


def svg(width, height, body, extra_defs=""):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
        f'width="{width}" height="{height}" role="img" aria-label="AutoPraizler M.L.">\n'
        f"<defs>{extra_defs}</defs>\n{body}\n</svg>\n"
    )


GRADIENT = (
    f'<linearGradient id="org" x1="0" y1="0" x2="0" y2="1">'
    f'<stop offset="0" stop-color="{ORANGE_LIGHT}"/>'
    f'<stop offset="0.55" stop-color="{ORANGE}"/>'
    f'<stop offset="1" stop-color="{ORANGE_DARK}"/></linearGradient>'
)


SWOOSH_SX = (WORD_W * 1.08) / 1160  # swoosh designed 1160 wide


def wordmark_group(fill, stroke, stroke_w, tx, ty, scale=1.0):
    """Wordmark + swoosh, outlined with a contrasting halo like the banner."""
    sw = f'<path d="{SWOOSH_D}" transform="translate(-10 0) scale({SWOOSH_SX:.4f} 1)"/>'
    halo = (
        f'<g fill="none" stroke="{stroke}" stroke-width="{stroke_w}" '
        f'stroke-linejoin="round"><path d="{WORD_D}"/>{sw}</g>'
    )
    # a thin stroke in the fill colour fattens the lettering towards Arial Black
    body = (
        f'<g fill="{fill}" stroke="{fill}" stroke-width="5" stroke-linejoin="round">'
        f'<path d="{WORD_D}"/>{sw}</g>'
    )
    return f'<g transform="translate({tx} {ty}) scale({scale})">{halo}{body}</g>'


def wrench_group(fill, stroke, stroke_w, cx, cy, scale=1.0):
    return (
        f'<g transform="translate({cx} {cy}) scale({scale}) rotate(-45) '
        f'translate(0 {-WRENCH_CY})">'
        f'<path d="{WRENCH_D}" fill="{fill}" stroke="{stroke}" '
        f'stroke-width="{stroke_w}" stroke-linejoin="round"/></g>'
    )


def write(name, content):
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / name).write_text(content, encoding="utf-8")
    print("wrote", OUT / name)


# 1) Wordmark on transparent background, dark lettering (for light pages).
W, H = round(WORD_W * 1.08 + 30), 250
write(
    "autopraizler-wordmark.svg",
    svg(W, H, wordmark_group(INK, WHITE, 14, 20, 212)),
)

# 2) Wordmark inverted (white lettering, dark halo) for dark/orange surfaces.
write(
    "autopraizler-wordmark-white.svg",
    svg(W, H, wordmark_group(WHITE, INK, 14, 20, 212)),
)

# 3) Full horizontal logo: wrench badge + wordmark, as on the banner.
badge = 220
gap = 30
FW = badge + gap + W
FH = 250
full_body = (
    f'<rect x="0" y="15" width="{badge}" height="{badge}" rx="28" fill="url(#org)" '
    f'stroke="{WHITE}" stroke-width="8"/>'
    + wrench_group(WHITE, INK, 7, badge / 2, badge / 2 + 15, 0.9)
    + wordmark_group(INK, WHITE, 14, badge + gap + 20, 212)
)
write("autopraizler-logo.svg", svg(FW, FH, full_body, GRADIENT))

# 4) Full logo on orange panel (banner style).
panel_body = (
    f'<rect width="{FW + 60}" height="{FH + 40}" rx="24" fill="url(#org)"/>'
    + f'<g transform="translate(30 20)">'
    + f'<rect x="0" y="15" width="{badge}" height="{badge}" rx="28" fill="{INK}" opacity="0.12"/>'
    + wrench_group(WHITE, INK, 7, badge / 2, badge / 2 + 15, 0.9)
    + wordmark_group(INK, WHITE, 14, badge + gap + 20, 212)
    + "</g>"
)
write("autopraizler-logo-orange.svg", svg(FW + 60, FH + 40, panel_body, GRADIENT))

# 5) Square mark (app icon / favicon / social avatar).
mark_body = (
    f'<rect width="256" height="256" rx="48" fill="url(#org)"/>'
    + wrench_group(WHITE, INK, 8, 128, 128, 1.0)
)
write("autopraizler-mark.svg", svg(256, 256, mark_body, GRADIENT))

# 6) Favicon: same mark, no halo stroke (reads better at 16-32 px).
fav_body = (
    f'<rect width="64" height="64" rx="14" fill="{ORANGE}"/>'
    + f'<g transform="translate(32 32) scale(0.27) rotate(-45) translate(0 {-WRENCH_CY})">'
    + f'<path d="{WRENCH_D}" fill="{WHITE}"/></g>'
)
write("favicon.svg", svg(64, 64, fav_body))
