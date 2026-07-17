import Container from "@/utils/Container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProducts } from "@/lib/products";
import CatalogList from "@/app/components/main/Catalog/CatalogList";
import Breadcrumbs from "@/app/components/common/Breadcrumbs";
import { CATEGORIES } from "@/lib/categories";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// ISR: новий товар у Sanity з'являється без ребілду (в межах revalidate). (P2-1)
export const revalidate = 3600;

// Метадані каталогу (локалізовані) + canonical/hreflang.
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Catalog" });
  const path = locale === routing.defaultLocale ? "/catalog" : `/${locale}/catalog`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: path,
      languages: {
        uk: "/catalog",
        ru: "/ru/catalog",
        "x-default": "/catalog",
      },
    },
  };
}

export default async function CatalogPage({ params }) {
  const { locale } = await params;
  // Вмикаємо статичний рендеринг для поточної локалі.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Catalog" });
  const tcat = await getTranslations({ locale, namespace: "Categories" });
  const products = await getProducts(locale);

  return (
    <Container className="pt-[130px] md:pt-[180px] pb-[100px] md:pb-[140px]">
      <Breadcrumbs items={[{ name: t("title") }]} />

      <h1 className="text-3xl main-title-gradient text-center mb-10 md:mb-14">
        {t("title")}
      </h1>

      {/* Фільтр за категоріями. «Всі» — активна (показує всі товари),
          решта ведуть на категорійні посадкові (P1-3/P1-11). */}
      <ul className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 md:mb-16">
        <li>
          <Link
            href="/catalog"
            aria-current="page"
            className="inline-block rounded-full bg-commonBlue text-white px-6 py-2.5 not-italic font-e-ukraine hover:opacity-90 transition-opacity"
          >
            {t("all")}
          </Link>
        </li>
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/catalog/c/${c.slug}`}
              className="inline-block rounded-full border border-commonBlue/30 px-6 py-2.5 not-italic font-e-ukraine text-commonBlue hover:bg-commonBlue/10 transition-colors"
            >
              {tcat(`${c.msgKey}.h1`)}
            </Link>
          </li>
        ))}
      </ul>

      <CatalogList products={products} />
    </Container>
  );
}
