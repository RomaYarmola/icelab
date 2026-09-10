import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CATEGORIES } from "@/lib/categories";
import { CITIES } from "@/lib/cities";

// Спільний блок перелінковки для каталогу, категорій і головної.
// Розкидає вагу з найвідвідуваніших сторінок на комерційні посадкові
// (категорії, опт) і на гео-лендинги, які інакше живуть лише у футері.
//
// props:
//  • locale        — поточна локаль;
//  • excludeSlug   — slug категорії, яку не показувати (поточна);
//  • withCategories / withPages / withCities — вмикають відповідні групи;
//  • variant       — "light" (на білому) або "dark" (на темному фоні).
export default async function RelatedLinks({
  locale,
  excludeSlug,
  withCategories = true,
  withPages = true,
  withCities = true,
  variant = "light",
}) {
  const t = await getTranslations({ locale, namespace: "Breadcrumbs" });
  const tcat = await getTranslations({ locale, namespace: "Categories" });
  const tf = await getTranslations({ locale, namespace: "Footer" });

  const pill =
    variant === "dark"
      ? "inline-block rounded-full border border-white/25 px-5 py-2 not-italic font-e-ukraine text-white/85 hover:bg-white/10 hover:border-white/40 transition-colors"
      : "inline-block rounded-full border border-commonBlue/30 px-5 py-2 not-italic font-e-ukraine text-commonBlue hover:bg-commonBlue/10 transition-colors";

  const heading =
    variant === "dark"
      ? "not-italic font-e-ukraine font-medium text-[18px] md:text-[20px] mb-4 text-white/90"
      : "not-italic font-e-ukraine font-medium text-[20px] md:text-[24px] mb-5 text-black";

  const categories = CATEGORIES.filter((c) => c.slug !== excludeSlug);

  return (
    <div className="flex flex-col gap-10">
      {withCategories && categories.length > 0 && (
        <section>
          <h2 className={heading}>{tf("categoriesTitle")}</h2>
          <ul className="flex flex-wrap gap-3 md:gap-4">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/catalog/c/${c.slug}`} className={pill}>
                  {tcat(`${c.msgKey}.h1`)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {withPages && (
        <section>
          <h2 className={heading}>{tf("legalTitle")}</h2>
          <ul className="flex flex-wrap gap-3 md:gap-4">
            <li>
              <Link href="/opt" className={pill}>
                {t("wholesale")}
              </Link>
            </li>
            <li>
              <Link href="/zastosuvannia-suhogo-lodu" className={pill}>
                {t("applications")}
              </Link>
            </li>
            <li>
              <Link href="/faq" className={pill}>
                {t("faq")}
              </Link>
            </li>
            <li>
              <Link href="/payment-and-delivery" className={pill}>
                {t("paymentAndDelivery")}
              </Link>
            </li>
            <li>
              <Link href="/production" className={pill}>
                {t("production")}
              </Link>
            </li>
          </ul>
        </section>
      )}

      {withCities && (
        <section>
          <h2 className={heading}>{tf("citiesTitle")}</h2>
          <ul className="flex flex-wrap gap-3 md:gap-4">
            {CITIES.map((city) => (
              <li key={city.slug}>
                {/* Повний анкор («Сухий лід у Києві»), а не назва міста:
                    анкор — сигнал, за яким лендинг ранжується. */}
                <Link href={`/${city.slug}`} className={pill}>
                  {(city[locale] || city.uk).h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
