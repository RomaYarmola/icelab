"use client";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// Галерея товару: велике головне зображення + мініатюри, клік по головному
// відкриває повноекранний лайтбокс (yet-another-react-lightbox) із зумом,
// лічильником і стрічкою мініатюр.
//
// НАВІЩО. Фото льоду й боксів — це те, за чим оцінюють якість гранули й
// пакування, а на сторінці вони жили в кадрі 280–420 px. Тепер їх можна
// розглянути в повний розмір, не залишаючи сторінку.
export default function ProductGallery({ images, alt, fit = "contain" }) {
  const t = useTranslations("ProductPage");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const list = images && images.length > 0 ? images : [];
  const mainSrc = list[active] ?? list[0];

  if (!mainSrc) return null;

  // Реальні фото — на весь кадр (cover), рендери товарів — вписуємо (contain).
  const isCover = fit === "cover";

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("zoomPhoto")}
        title={t("zoomPhoto")}
        className="group relative w-full h-[280px] md:h-[420px] rounded-[14px] overflow-hidden bg-white border border-commonBlue/20 cursor-zoom-in"
      >
        <Image
          src={mainSrc}
          alt={alt}
          fill
          className={`transition-transform duration-500 group-hover:scale-[1.03] ${
            isCover ? "object-cover" : "object-contain p-6"
          }`}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {/* Підказка про збільшення — з'являється на наведення, щоб не
            перекривати фото у звичайному стані. */}
        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[12px] not-italic font-e-ukraine text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M10.4 10.4 14 14M7 5.2v3.6M5.2 7h3.6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {t("zoomPhoto")}
        </span>
      </button>

      {list.length > 1 && (
        <ul className="flex gap-3 flex-wrap">
          {list.map((src, index) => (
            <li key={src + index}>
              <button
                type="button"
                aria-label={alt}
                onClick={() => setActive(index)}
                onDoubleClick={() => setOpen(true)}
                className={`relative w-[72px] h-[72px] rounded-[10px] overflow-hidden border transition-colors ${
                  index === active ? "border-commonBlue" : "border-commonBlue/20"
                }`}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className={isCover ? "object-cover" : "object-contain p-2"}
                  sizes="72px"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={active}
        on={{ view: ({ index }) => setActive(index) }}
        slides={list.map((src) => ({ src, alt }))}
        plugins={list.length > 1 ? [Zoom, Counter, Thumbnails] : [Zoom]}
        carousel={{ finite: list.length <= 1 }}
        zoom={{ maxZoomPixelRatio: 3 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: "rgba(7,12,22,0.94)" },
          thumbnailsContainer: { backgroundColor: "rgba(7,12,22,0.94)" },
        }}
      />
    </div>
  );
}
