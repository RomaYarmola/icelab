"use client";
import { useEffect, useRef, useState } from "react";
import {
  FaCommentDots,
  FaPhoneAlt,
  FaTimes,
} from "react-icons/fa";
import { messengers, CONTACT_PHONE } from "@/utils/routes";
import useUiStore from "@/zustand/store/uiStore";

// Плаваюча кнопка звʼязку (fixed, справа знизу). За кліком розкриває стовпчик
// іконок месенджерів + трубку для звичайного дзвінка. Присутня на всіх сторінках
// (монтується в layout).
const actions = [
  ...messengers,
  {
    name: "Подзвонити",
    url: `tel:${CONTACT_PHONE}`,
    icon: FaPhoneAlt,
    color: "#001731",
  },
];

export default function QuickContact() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  // Ховаємо кнопку, поки відкрите мобільне бургер-меню (воно перекриває екран).
  const isMenuOpen = useUiStore((state) => state.isMenuOpen);

  // Якщо меню відкрилось при розгорнутих іконках — згортаємо їх.
  useEffect(() => {
    if (isMenuOpen) setOpen(false);
  }, [isMenuOpen]);

  // Закриття по кліку поза віджетом та по Esc.
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className={`fixed bottom-5 right-5 z-[70] flex flex-col items-center gap-3 transition-opacity duration-200 ${
        isMenuOpen
          ? "opacity-0 pointer-events-none"
          : "opacity-100 pointer-events-auto"
      }`}
      aria-hidden={isMenuOpen}
    >
      {/* Стовпчик дій — знизу вгору. За закритого стану сховані й не клікабельні. */}
      <div className="flex flex-col items-center gap-3">
        {actions.map((a, i) => {
          const isExternal = a.url.startsWith("http");
          // Порядок появи: нижні (ближчі до кнопки) зʼявляються першими.
          const delay = open ? (actions.length - 1 - i) * 45 : 0;
          return (
            <a
              key={a.name}
              href={a.url}
              aria-label={a.name}
              title={a.name}
              tabIndex={open ? 0 : -1}
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              style={{ backgroundColor: a.color, transitionDelay: `${delay}ms` }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-[0px_3px_12px_0px_rgba(0,23,49,0.35)] transition-all duration-300 ease-out hover:scale-110 ${
                open
                  ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                  : "opacity-0 translate-y-3 scale-75 pointer-events-none"
              }`}
            >
              <a.icon className="w-[22px] h-[22px]" />
            </a>
          );
        })}
      </div>

      {/* Головна кнопка-тригер. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Закрити звʼязок" : "Звʼязатися з нами"}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white bg-gradient-btn shadow-btn transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        {open ? (
          <FaTimes className="w-6 h-6" />
        ) : (
          <FaCommentDots className="w-7 h-7" />
        )}
      </button>
    </div>
  );
}
