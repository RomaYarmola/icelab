"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordVisit } from "@/utils/tracking";
import { track, setTag, pageType, contactChannel } from "@/utils/analytics";

// 1) Логує перегляд кожної сторінки в sessionStorage (для контексту заявок).
// 2) Теги Clarity: тип поточної сторінки й тип сторінки входу (один раз за
//    сесію) — щоб конверсію можна було порівнювати «гео vs категорія vs ніша».
// 3) Кроки воронки за маршрутом: кошик → оформлення → «дякуємо».
// 4) Кліки по контактах (телефон, Telegram, WhatsApp, Viber, Instagram, пошта)
//    одним слухачем на документі — і в плаваючій кнопці, і в шапці, і в тексті.
export default function TrackingProvider() {
  const pathname = usePathname();

  useEffect(() => {
    recordVisit(pathname);
    const type = pageType(pathname);
    setTag("page_type", type);
    setTag("lang", pathname.startsWith("/ru") ? "ru" : "uk");
    try {
      if (!sessionStorage.getItem("icelab_entry_type")) {
        sessionStorage.setItem("icelab_entry_type", type);
        setTag("entry_page_type", type);
        setTag("entry_path", pathname);
      }
    } catch {}
    if (type === "cart") track("view_cart");
    if (type === "checkout") track("begin_checkout");
  }, [pathname]);

  useEffect(() => {
    const onClick = (e) => {
      const a = e.target?.closest?.("a[href]");
      if (!a) return;
      const channel = contactChannel(a.getAttribute("href") || "");
      if (!channel) return;
      track(
        "contact_click",
        { contact_channel: channel, page_type: pageType(window.location.pathname) },
        { tags: { contact_channel: channel }, upgrade: "contact" }
      );
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
