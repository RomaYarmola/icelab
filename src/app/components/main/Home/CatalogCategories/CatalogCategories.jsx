import Container from "@/utils/Container";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CATEGORIES } from "@/lib/categories";

// SEO-блок «Каталог за категоріями» — окрема секція з власним темним фоном,
// щоб заголовок і картки завжди читалися (раніше залежав від градієнта Products
// і на мобільному «губився» на світлому).
//
// Ширина — як у решти секцій головної (просто Container, без власного
// max-w), інакше блок візуально вужчий за сусідні Products/Faq/NoCompromises.
//
// Плитка «Опт і B2B» стоїть шостою поруч із п'ятьма категоріями: сітка
// складається у рівні 3×2, а сторінка опту отримує контекстне посилання з
// головної. Гео-лендинги сюди НЕ дублюємо — вони вже є у футері на кожній
// сторінці, тож другий набір тих самих посилань не додає ваги, лише шум.
export default async function CatalogCategories({ locale }) {
  const t = await getTranslations({ locale, namespace: "Products" });
  const tcat = await getTranslations({ locale, namespace: "Categories" });
  const tb = await getTranslations({ locale, namespace: "Breadcrumbs" });
  const tc = await getTranslations({ locale, namespace: "Catalog" });

  const arrow = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const cardBase =
    "group flex flex-col h-full rounded-2xl border p-6 md:p-7 transition-colors duration-300";

  return (
    <section className="relative z-10 bg-dark-gradient">
      <Container>
        <div className="py-16 md:py-24">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-white text-xl md:text-2xl mb-3">
              {t("categoriesTitle")}
            </h2>
            <p className="font-e-ukraine not-italic font-thin text-white/70 text-sm-responsive max-w-[520px] mx-auto">
              {t("categoriesSubtitle")}
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/catalog/c/${c.slug}`}
                  className={`${cardBase} border-white/15 bg-white/[0.06] backdrop-blur-sm hover:bg-white/[0.12] hover:border-white/30`}
                >
                  <span className="text-white text-[20px] md:text-[22px] not-italic font-e-ukraine font-medium mb-2">
                    {tcat(`${c.msgKey}.h1`)}
                  </span>
                  <span className="flex-1 font-e-ukraine not-italic font-thin text-white/55 text-[14px] leading-relaxed mb-6">
                    {t(`categoryHints.${c.msgKey}`)}
                  </span>
                  <span className="inline-flex items-center gap-2 text-white not-italic font-e-ukraine text-[14px] font-medium">
                    {t("toCatalog")}
                    {arrow}
                  </span>
                </Link>
              </li>
            ))}

            {/* Шоста плитка — опт/B2B. Виділена рамкою й фоном, щоб читалась
                як інший тип пропозиції, а не ще одна категорія товару. */}
            <li>
              <Link
                href="/opt"
                className={`${cardBase} border-white/35 bg-white/[0.12] hover:bg-white/[0.18] hover:border-white/50`}
              >
                <span className="inline-flex self-start items-center rounded-full border border-white/30 px-3 py-1 mb-3 text-[11px] uppercase tracking-wide not-italic font-e-ukraine text-white/70">
                  B2B
                </span>
                <span className="text-white text-[20px] md:text-[22px] not-italic font-e-ukraine font-medium mb-2">
                  {tb("wholesale")}
                </span>
                <span className="flex-1 font-e-ukraine not-italic font-thin text-white/65 text-[14px] leading-relaxed mb-6">
                  {t("wholesaleHint")}
                </span>
                <span className="inline-flex items-center gap-2 text-white not-italic font-e-ukraine text-[14px] font-medium">
                  {tc("details")}
                  {arrow}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
