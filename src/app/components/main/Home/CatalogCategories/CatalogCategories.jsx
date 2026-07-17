"use client";
import Container from "@/utils/Container";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CATEGORIES } from "@/lib/categories";

// SEO-блок «Каталог за категоріями» — окрема секція з власним темним фоном,
// щоб заголовок і картки завжди читалися (раніше залежав від градієнта Products
// і на мобільному «губився» на світлому).
export default function CatalogCategories() {
  const t = useTranslations("Products");
  const tcat = useTranslations("Categories");

  return (
    <section className="bg-dark-gradient">
      <Container>
        <div className="py-16 md:py-24">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-white-title-gradient text-xl md:text-2xl mb-3">
              {t("categoriesTitle")}
            </h2>
            <p className="font-e-ukraine not-italic font-thin text-white/60 text-sm-responsive max-w-[520px] mx-auto">
              {t("categoriesSubtitle")}
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-[1000px] mx-auto">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/catalog/c/${c.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-sm p-6 md:p-7 hover:bg-white/[0.12] hover:border-white/30 transition-colors"
                >
                  <span className="text-white text-[20px] md:text-[22px] not-italic font-e-ukraine font-medium mb-2">
                    {tcat(`${c.msgKey}.h1`)}
                  </span>
                  <span className="flex-1 font-e-ukraine not-italic font-thin text-white/55 text-[14px] leading-relaxed mb-6">
                    {t(`categoryHints.${c.msgKey}`)}
                  </span>
                  <span className="inline-flex items-center gap-2 text-white not-italic font-e-ukraine text-[14px] font-medium">
                    {t("toCatalog")}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
