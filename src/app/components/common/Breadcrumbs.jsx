import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import JsonLd from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

// Хлібні крошки: UI (<nav aria-label="breadcrumb">) + BreadcrumbList JSON-LD.
// items — хвіст крошок [{ name, href }] БЕЗ головної (вона додається першою).
// Останній елемент — поточна сторінка (без посилання).
export default function Breadcrumbs({ items = [] }) {
  const t = useTranslations("Breadcrumbs");

  // Повний список для розмітки (перший — Головна → /).
  const all = [{ name: t("home"), href: "/" }, ...items];

  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] md:text-[14px] font-e-ukraine not-italic text-black/60">
        {all.map((item, i) => {
          const isLast = i === all.length - 1;
          return (
            <li key={i} className="flex items-center gap-x-2">
              {isLast || !item.href ? (
                <span aria-current="page" className="text-black/80">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="hover:text-commonBlue transition-colors"
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={breadcrumbSchema(all)} />
    </nav>
  );
}
