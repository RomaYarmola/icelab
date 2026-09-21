"""Чи не загубив сабсет символи, які реально є в текстах сайту.

Порівнює cmap кожного public/fonts/*.woff2 з cmap вихідного .otf/.ttf
на множині символів із messages/*.json і docs/**/*.md.
Запускати після scripts/build_fonts.py.
"""
import glob
import json
import sys
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent


def content_chars() -> set[str]:
    chars: set[str] = set()

    def walk(node):
        if isinstance(node, str):
            chars.update(node)
        elif isinstance(node, dict):
            for value in node.values():
                walk(value)
        elif isinstance(node, list):
            for value in node:
                walk(value)

    for path in glob.glob(str(ROOT / "messages" / "*.json")):
        with open(path, encoding="utf-8") as fh:
            walk(json.load(fh))
    for path in (ROOT / "docs").rglob("*.md"):
        if path.is_file():
            try:
                chars.update(path.read_text(encoding="utf-8", errors="ignore"))
            except OSError:
                pass
    return {c for c in chars if ord(c) > 31}


def main() -> int:
    chars = content_chars()
    failed = False
    for woff2 in sorted((ROOT / "public" / "fonts").rglob("*.woff2")):
        source = woff2.with_suffix(".otf")
        if not source.exists():
            source = woff2.with_suffix(".ttf")
        subset_cmap = set(TTFont(str(woff2)).getBestCmap())
        source_cmap = set(TTFont(str(source)).getBestCmap())
        lost = sorted(
            c for c in chars if ord(c) not in subset_cmap and ord(c) in source_cmap
        )
        status = "ok" if not lost else "LOST " + " ".join(f"U+{ord(c):04X}" for c in lost)
        print(f"{woff2.name:<30} cmap={len(subset_cmap):<4} {status}")
        failed |= bool(lost)
    print("FAIL: сабсет викинув потрібні символи" if failed else "усі символи контенту на місці")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
