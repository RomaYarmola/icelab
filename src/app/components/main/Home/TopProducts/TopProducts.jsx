import Container from "@/utils/Container";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProducts } from "@/lib/products";
import { featuredDryIce, firstOfCategories } from "@/lib/featured";
import CatalogList from "@/app/components/main/Catalog/CatalogList";

// Реальні товари з цінами на головній. До вересня 2026 головна показувала
// дві статичні картки («Сухий лід» / «Бокс») без жодного посилання на
// картку товару: 0 внутрішніх посилань на 24 товарні сторінки з
// найавторитетнішої сторінки сайту. Тепер — шість позицій із каталогу:
// три ходові фасування льоду 16 мм + термобокс + готовий набір + апарат.
export default async function TopProducts({ locale }) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const all = await getProducts(locale);
  if (!all.length) return null;

  const ice = featuredDryIce(
    all.filter((p) => p.category === "dry-ice"),
    3
  );
  const rest = firstOfCategories(all, ["ice-box", "dry-ice-box", "krioblasting"]);
  const products = [...ice, ...rest].slice(0, 6);
  if (!products.length) return null;

  return (
    <section className="bg-white relative z-10">
      <Container>
        <div className="py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
            <div>
              <h2 className="not-italic font-e-ukraine font-medium text-[24px] md:text-[32px] text-black mb-2">
                {t("topProductsTitle")}
              </h2>
              <p className="not-italic font-e-ukraine font-thin text-black/70 max-w-[640px]">
                {t("topProductsText")}
              </p>
            </div>
            <Link
              href="/catalog"
              className="inline-block self-start rounded-full border border-commonBlue/30 px-6 py-2.5 not-italic font-e-ukraine text-commonBlue hover:bg-commonBlue/10 transition-colors"
            >
              {t("allCatalog")}
            </Link>
          </div>
          <CatalogList products={products} />
        </div>
      </Container>
    </section>
  );
}
