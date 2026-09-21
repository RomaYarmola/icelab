"""Перегенерація public/fonts/*.woff2 із вихідних .otf/.ttf.

CFF→glyf (cu2qu) + сабсет (латиниця + кирилиця) + woff2.
Потрібні пакети: fonttools, brotli, cu2qu.
"""
import os
from pathlib import Path

from fontTools import subset
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import table__g_l_y_f
from fontTools.ttLib.tables._l_o_c_a import table__l_o_c_a

FONT_DIR = Path(__file__).resolve().parent.parent / "public" / "fonts"

# Латиниця + повна кирилиця + грека + пунктуація, індекси, валюти, стрілки.
# U+2070-209F обов'язково: у текстах є «CO₂» (U+2082).
# Перевірка покриття — scripts/check_fonts.py, ганяти після кожної зміни.
UNICODES = (
    "U+0000-00FF,U+0100-017F,U+0180-024F,U+02B0-02FF,U+0300-036F,"
    "U+0370-03FF,U+0400-04FF,U+0500-052F,U+1E00-1EFF,U+2000-206F,"
    "U+2070-209F,U+20A0-20BF,U+2100-214F,U+2190-21FF,U+2200-22FF,"
    "U+2500-257F,U+25A0-25FF,U+2600-26FF,U+2700-27BF,U+FB00-FB4F,"
    "U+FEFF,U+FFFD"
)


def cff_to_glyf(font: TTFont) -> None:
    """Кубічні контури CFF → квадратичні TrueType (woff2 їх стискає краще)."""
    glyph_set = font.getGlyphSet()
    order = font.getGlyphOrder()
    max_err = font["head"].unitsPerEm / 1000.0

    glyf = table__g_l_y_f()
    glyf.glyphs = {}
    glyf.glyphOrder = order
    for name in order:
        pen = TTGlyphPen(glyph_set)
        glyph_set[name].draw(Cu2QuPen(pen, max_err, reverse_direction=True))
        glyf[name] = pen.glyph()

    font["glyf"] = glyf
    font["loca"] = table__l_o_c_a()
    maxp = font["maxp"]
    maxp.tableVersion = 0x00010000
    for attr, value in (
        ("maxZones", 1), ("maxTwilightPoints", 0), ("maxStorage", 0),
        ("maxFunctionDefs", 0), ("maxInstructionDefs", 0), ("maxStackElements", 0),
        ("maxSizeOfInstructions", 0), ("maxComponentElements", 0), ("maxComponentDepth", 0),
    ):
        setattr(maxp, attr, value)
    font.sfntVersion = "\000\001\000\000"
    for tag in ("CFF ", "VORG"):
        if tag in font:
            del font[tag]
    font["post"].formatType = 3.0  # імена гліфів у вебі не потрібні


def build(src: Path) -> tuple[int, int]:
    tmp = src.with_suffix(".tmp.ttf")
    font = TTFont(str(src))
    if "CFF " in font:
        cff_to_glyf(font)
    font.save(str(tmp))
    font.close()

    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True

    subsetted = subset.load_font(str(tmp), opts)
    subsetter = subset.Subsetter(options=opts)
    subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
    subsetter.subset(subsetted)
    dst = src.with_suffix(".woff2")
    subset.save_font(subsetted, str(dst), opts)
    subsetted.close()
    os.remove(tmp)
    return src.stat().st_size, dst.stat().st_size


def main() -> None:
    total_src = total_out = 0
    for src in sorted([*FONT_DIR.rglob("*.otf"), *FONT_DIR.rglob("*.ttf")]):
        before, after = build(src)
        total_src += before
        total_out += after
        print(f"{src.name:<30} {before / 1024:7.1f} KB -> {after / 1024:6.1f} KB")
    print(f"{'TOTAL':<30} {total_src / 1024:7.1f} KB -> {total_out / 1024:6.1f} KB")


if __name__ == "__main__":
    main()
