import { messengers } from "@/utils/routes";

// Круглі іконки Telegram / Viber / WhatsApp поруч із основними діями.
//
// НАВІЩО (18.09.2026, docs/CONVERSIONS-2026-09.md). Нові відвідувачі з
// органіки частіше пишуть у месенджер, ніж оформлюють кошик, а месенджери
// були лише в плаваючій кнопці (закрита за замовчуванням) і в футері. Тепер
// вони стоять поряд із «Швидке замовлення» — на головній, гео-сторінках,
// у категорії й картці товару. Кліки рахує TrackingProvider (contact_*).
//
// Лише іконки у фірмових кольорах, без підписів: назва — в aria-label/title.
const ORDER = ["Telegram", "Viber", "WhatsApp"];

export default function MessengerButtons({ align = "center", className = "" }) {
  const list = ORDER.map((n) => messengers.find((m) => m.name === n)).filter(
    Boolean
  );

  return (
    <div
      className={`flex items-center gap-3 ${
        align === "center" ? "justify-center" : "justify-start"
      } ${className}`}
    >
      {list.map((m) => {
        const isExternal = m.url.startsWith("http");
        return (
          <a
            key={m.name}
            href={m.url}
            aria-label={m.name}
            title={m.name}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            style={{ backgroundColor: m.color }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-[0_3px_10px_rgba(0,23,49,0.25)] transition-transform duration-200 hover:scale-110"
          >
            <m.icon aria-hidden="true" className="h-[21px] w-[21px]" />
          </a>
        );
      })}
    </div>
  );
}
