"use client";

import { useEffect, useRef } from "react";

// Виїзд декоративної хмари, коли секція потрапляє в екран — один раз.
//
// Раніше це робив framer-motion (whileInView + variants). Заради трьох
// таких блоків на головній у первинний бандл тягнувся чанк на ~154 КБ,
// і це при тому, що вся анімація — один translateX + opacity. Тут те саме
// на IntersectionObserver і CSS-переході: рух іде в композиторі, головний
// потік не задіяний.
export default function CloudReveal({ from = "left", className = "", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-visible");
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`cloud-reveal cloud-reveal-${from} ${className}`}>
      {children}
    </div>
  );
}
