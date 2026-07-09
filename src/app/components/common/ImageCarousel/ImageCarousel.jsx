"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const CYCLE_MS = 3500;

const slotClasses = [
  "carousel-right-card",
  "carousel-center-card",
  "carousel-left-card",
];

function getCardClass(idx, activeIndex, total) {
  const slot = (idx - activeIndex + total) % total;
  return slot < 3 ? slotClasses[slot] : "carousel-backstack-card";
}

export default function ImageCarousel({
  images,
  variant = "right",
  className = "relative w-full min-w-0 flex-1 h-[193px] lg:h-[252px] overflow-hidden",
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const N = images.length;
  const isExtended = N > 3;

  useEffect(() => {
    if (N <= 3) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % N);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [N]);

  const cards =
    N <= 3
      ? images.slice(0, 3).map((img, idx) => ({
          image: img,
          className: slotClasses[idx],
        }))
      : images.map((img, idx) => ({
          image: img,
          className: getCardClass(idx, activeIndex, N),
        }));

  return (
    <div className={className}>
      <div
        className={`carousel-card-stack w-full h-full min-h-[193px] lg:min-h-[252px] ${
          isExtended ? "carousel-extended" : ""
        } ${variant === "left" ? "carousel-variant-left" : ""}`}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`carousel-card-item ${card.className} w-full h-full rounded-[12px] overflow-hidden shadow-[inset_0_0_60px_rgba(0,0,0,0.2)]`}
          >
            <Image
              src={card.image.src}
              alt={card.image.alt ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 80vw, 564px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
