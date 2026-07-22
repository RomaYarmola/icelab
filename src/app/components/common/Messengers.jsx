import { messengers } from "@/utils/routes";

// Ряд іконок месенджерів (Telegram / WhatsApp / Viber). Використовується у блоці
// контактів і футері. Стилістика збігається з SocLinks (білі іконки на темному фоні).
export default function Messengers({ className = "", iconClassName = "w-8 h-8" }) {
  return (
    <div className={`flex gap-[14px] ${className}`}>
      {messengers.map((m) => {
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
            className="text-white hover:drop-shadow-[0_4px_8px_rgba(255,255,255,0.7)] transition-shadow duration-300 ease-in-out"
          >
            <m.icon className={iconClassName} />
          </a>
        );
      })}
    </div>
  );
}
