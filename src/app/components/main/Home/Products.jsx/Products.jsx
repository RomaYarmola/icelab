"use client";
import Container from "@/utils/Container";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { data } from "./data";
import ProductCard from "./ProductCard";
import { useIsSafari } from "@/hooks/useIsSafari";
import { usePriceSettings } from "@/app/components/providers/PriceSettingsProvider";
import { CATEGORIES } from "@/lib/categories";

export default function Products() {
  const isSafari = useIsSafari();
  const settings = usePriceSettings();
  const t = useTranslations("Products");
  const tcat = useTranslations("Categories");

  // Розміри/ваги беруться з Price Settings (Sanity → fallback константи).
  const sizesFor = (variant) => {
    if (variant === "dryIce") return settings.granuleSizes;
    if (variant === "iceBox")
      return (settings.boxPrices || []).map((b) => `${b.size} кг`);
    return [];
  };

  return (
    <div
      id="products"
      className={`overflow-x-clip relative ${
        isSafari && "dark-gradient-safari"
      }`}
    >
      {/* gradient */}
      {!isSafari && (
        <div className="w-[1981px] h-[768px] md:h-[717px] radial-dark-gradient absolute bottom-[-238px] md:bottom-[-280px] left-1/2 transform -translate-x-1/2 z-[3] 2xl:w-[2900px]" />
      )}

      {/* /gradient */}
      <Container>
        <h2 className="sr-only">{t("sectionTitle")}</h2>
        <ul className="pt-[111px] pb-[124px] l:pt-[122px] 2xl:pt-[200px] l:pb-[112px] relative z-[4] flex flex-col md:flex-row gap-[88.6px] md:gap-5 items-center justify-center">
          {data.map(({ img, variant }, index) => (
            <ProductCard
              key={index}
              img={img}
              sizes={sizesFor(variant)}
              variant={variant}
            />
          ))}
        </ul>

        {/* SEO-блок «Каталог за категоріями» — перелінковка на посадкові (P1-11) */}
        <section className="relative z-[4] pb-[100px] md:pb-[112px]">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-white-title-gradient text-xl md:text-2xl mb-3">
              {t("categoriesTitle")}
            </h2>
            <p className="font-e-ukraine not-italic font-thin text-white/60 text-sm-responsive max-w-[520px] mx-auto">
              {t("categoriesSubtitle")}
            </p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-[1000px] mx-auto">
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
        </section>
      </Container>
    </div>
  );
}
