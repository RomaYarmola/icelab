"use client";
import Image from "next/image";
import { useState } from "react";

// Проста галерея товару: велике головне зображення + мініатюри.
// Мінімальний клієнтський стан для перемикання активного зображення.
export default function ProductGallery({ images, alt }) {
  const [active, setActive] = useState(0);
  const list = images && images.length > 0 ? images : [];
  const mainSrc = list[active] ?? list[0];

  if (!mainSrc) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full h-[280px] md:h-[420px] rounded-[14px] overflow-hidden bg-white border border-commonBlue/20">
        <Image
          src={mainSrc}
          alt={alt}
          fill
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {list.length > 1 && (
        <ul className="flex gap-3 flex-wrap">
          {list.map((src, index) => (
            <li key={src + index}>
              <button
                type="button"
                aria-label={alt}
                onClick={() => setActive(index)}
                className={`relative w-[72px] h-[72px] rounded-[10px] overflow-hidden border transition-colors ${
                  index === active ? "border-commonBlue" : "border-commonBlue/20"
                }`}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-contain p-2"
                  sizes="72px"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
