"""Перегенерація важких банерів public/images/**/banner.webp із вихідних .png.

Обидва банери — непрозорі фотографії 2560 px, які лежали у репозиторії як
PNG на 1,3 і 3,8 МБ і підключались через background: url() у globals.css.
CSS-фон не бачить preload-сканер, тому LCP на /contacts був 13,7 с, а на
/payment-and-delivery — 22,8 с.

Зараз вони підключені через next/image (fill + priority), а вихідник —
WebP: оптимізатор роздає з нього потрібну ширину, не перечитуючи мегабайти.

Потрібен пакет Pillow.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "public" / "images"
SOURCES = (
    ROOT / "contacts" / "banner.png",
    ROOT / "payment-and-delivery" / "banner.png",
)
QUALITY = 70


def main() -> None:
    for source in SOURCES:
        image = Image.open(source)
        if image.mode != "RGB":
            # альфа в обох банерах суцільно непрозора — прибираємо її, інакше
            # WebP пише альфа-канал без втрат і файл роздувається втричі
            image = image.convert("RGB")
        destination = source.with_suffix(".webp")
        image.save(destination, "WEBP", quality=QUALITY, method=6)
        print(
            f"{source.relative_to(ROOT)}  {source.stat().st_size / 1024:8.1f} KB"
            f"  ->  {destination.name}  {destination.stat().st_size / 1024:6.1f} KB"
        )


if __name__ == "__main__":
    main()
