"""Перегенерація public/images/hero/cloud-*.webp із вихідних cloud-*.png.

Навіщо окремий крок замість next/image: вихідні хмари — palette-PNG з
альфою, і оптимізатор next/image писав з них WebP із альфа-каналом БЕЗ
втрат. Через це зменшена копія важила більше за оригінал (640 px → 38 КБ
проти 34 КБ у 1012 px), а параметр quality не впливав ні на що.

Тут альфа кодується з втратами (alpha_quality=60) — на м'якій димці різниці
не видно, а вага падає втричі:
    1012 px → ~28 КБ (десктоп)
     640 px → ~12 КБ (мобільний; це і є LCP-елемент головної)

Компонент, який їх віддає: src/app/components/common/Cloud.jsx
Потрібен пакет Pillow.
"""
from pathlib import Path

from PIL import Image

HERO_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "hero"
WIDTHS = (1012, 640)  # 1012 — нативна ширина вихідників
QUALITY = 70
ALPHA_QUALITY = 60


def main() -> None:
    for name in ("cloud-right", "cloud-left"):
        source = HERO_DIR / f"{name}.png"
        image = Image.open(source).convert("RGBA")
        for width in WIDTHS:
            height = round(image.size[1] * width / image.size[0])
            resized = (
                image
                if width == image.size[0]
                else image.resize((width, height), Image.LANCZOS)
            )
            suffix = "" if width == image.size[0] else f"-{width}"
            destination = HERO_DIR / f"{name}{suffix}.webp"
            resized.save(
                destination,
                "WEBP",
                quality=QUALITY,
                method=6,
                alpha_quality=ALPHA_QUALITY,
            )
            print(
                f"{destination.name:<26} {width}x{height:<5} "
                f"{destination.stat().st_size / 1024:6.1f} KB"
            )


if __name__ == "__main__":
    main()
