"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Анімація «фото летить у кошик»: клон зображення товару рухається від картки
// до іконки кошика ([data-cart-target="true"]), зменшуючись і згасаючи, після
// чого іконка кошика пульсує. Логіку взято зі схожої анімації «в обране».
const TARGET_SELECTOR = '[data-cart-target="true"]';
const DURATION_MS = 750;

function FlyToCartInner({ startRect, image, onDone }) {
  const imgRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const targetEl = document.querySelector(TARGET_SELECTOR);
    if (!targetEl) {
      onDone?.();
      return;
    }

    const targetRect = targetEl.getBoundingClientRect();
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const endSize = Math.max(24, Math.min(targetRect.width, targetRect.height));

    const startWidth = startRect.width;
    const startHeight = startRect.height;
    const startCenterX = startRect.left + startWidth / 2;
    const startCenterY = startRect.top + startHeight / 2;
    const dx = targetCenterX - startCenterX;
    const dy = targetCenterY - startCenterY;

    const startTime = performance.now();

    const tick = (now) => {
      const t = Math.min((now - startTime) / DURATION_MS, 1);
      const eased = 1 - (1 - t) ** 3; // ease-out
      const fadeOut = t > 0.6 ? (t - 0.6) / 0.4 : 0;

      const w = startWidth + (endSize - startWidth) * eased;
      const h = startHeight + (endSize - startHeight) * eased;
      const x = startCenterX + dx * eased - w / 2;
      const y = startCenterY + dy * eased - h / 2;

      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      img.style.width = `${w}px`;
      img.style.height = `${h}px`;
      img.style.opacity = String(1 - fadeOut);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        if (targetEl instanceof HTMLElement) {
          targetEl.animate(
            [
              { transform: "scale(1)" },
              { transform: "scale(1.3)" },
              { transform: "scale(1)" },
            ],
            { duration: 300, easing: "ease-out" }
          );
        }
        onDone?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{ overflow: "visible", zIndex: 99999 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={image}
        alt=""
        className="absolute object-cover rounded-lg shadow-lg"
        style={{
          left: startRect.left,
          top: startRect.top,
          width: startRect.width,
          height: startRect.height,
        }}
      />
    </div>
  );
}

export default function FlyToCart(props) {
  if (typeof document === "undefined" || !props.image || !props.startRect) {
    return null;
  }
  return createPortal(<FlyToCartInner {...props} />, document.body);
}
