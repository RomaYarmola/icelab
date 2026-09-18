import { useLocale } from "next-intl";
import { messengers } from "@/utils/routes";

// Кнопки «Написати в Telegram / Viber / WhatsApp» поруч із основними діями.
//
// НАВІЩО (18.09.2026, docs/CONVERSIONS-2026-09.md). Нові відвідувачі з
// органіки частіше пишуть у месенджер, ніж оформлюють кошик, а месенджери
// були лише в плаваючій кнопці (закрита за замовчуванням) і в футері. Тепер
// вони стоять поряд із «Швидке замовлення» — на головній, гео-сторінках,
// у категорії й картці товару. Кліки рахує TrackingProvider (contact_*).
//
// label — підпис перед кнопками (за замовчуванням «Або напишіть нам:» мовою
// сторінки; null — без підпису); tone — dark (на темному фоні) або light.
const ORDER = ["Telegram", "Viber", "WhatsApp"];
const DEFAULT_LABEL = { uk: "Або напишіть нам:", ru: "Или напишите нам:" };

export default function MessengerButtons({
  label,
  tone = "dark",
  align = "center",
  className = "",
}) {
  const locale = useLocale();
  if (label === undefined) label = DEFAULT_LABEL[locale] || DEFAULT_LABEL.uk;
  const list = ORDER.map((n) => messengers.find((m) => m.name === n)).filter(
    Boolean
  );
  const onDark = tone === "dark";

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${
        align === "center" ? "justify-center" : "justify-start"
      } ${className}`}
    >
      {label && (
        <span
          className={`w-full sm:w-auto not-italic font-e-ukraine text-[13px] ${
            align === "center" ? "text-center" : ""
          } ${onDark ? "text-[rgba(216,236,248,0.8)]" : "text-commonBlue/80"}`}
        >
          {label}
        </span>
      )}
      {list.map((m) => {
        const isExternal = m.url.startsWith("http");
        return (
          <a
            key={m.name}
            href={m.url}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3 sm:px-4 not-italic font-e-ukraine text-[13px] font-medium transition-colors ${
              onDark
                ? "border border-white/25 bg-white/[0.07] text-white hover:bg-white/15"
                : "border border-commonBlue/25 bg-white text-commonBlue hover:bg-commonBlue/[0.06]"
            }`}
          >
            <m.icon
              aria-hidden="true"
              className="h-[18px] w-[18px] shrink-0"
              style={{ color: m.color }}
            />
            {m.name}
          </a>
        );
      })}
    </div>
  );
}
