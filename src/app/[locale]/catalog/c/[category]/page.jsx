import Container from "@/utils/Container";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getProductsByCategory } from "@/lib/products";
import { CATEGORIES, categoryBySlug } from "@/lib/categories";
import CatalogList from "@/app/components/main/Catalog/CatalogList";
import Breadcrumbs from "@/app/components/common/Breadcrumbs";
import { Link } from "@/i18n/navigation";

// ISR: список товарів категорії оновлюється без ребілду. (P2-1)
export const revalidate = 3600;

// Пререндер трьох категорій (обидві локалі — через сегмент [locale]).
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { locale, category } = await params;
  const cat = categoryBySlug(category);
  if (!cat) return {};
  const t = await getTranslations({ locale, namespace: "Categories" });
  const path = `/catalog/c/${cat.slug}`;
  const canonical = locale === routing.defaultLocale ? path : `/${locale}${path}`;
  return {
    title: t(`${cat.msgKey}.metaTitle`),
    description: t(`${cat.msgKey}.metaDescription`),
    alternates: {
      canonical,
      languages: { uk: path, ru: `/ru${path}`, "x-default": path },
    },
  };
}

export default async function CategoryPage({ params }) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const cat = categoryBySlug(category);
  if (!cat) notFound();

  const t = await getTranslations({ locale, namespace: "Categories" });
  const products = await getProductsByCategory(locale, cat.key);

  const crumbs = [
    { name: (await getTranslations({ locale, namespace: "Catalog" }))("title"), href: "/catalog" },
    { name: t(`${cat.msgKey}.h1`) },
  ];

  // Інші категорії для перелінковки.
  const others = CATEGORIES.filter((c) => c.slug !== cat.slug);

  return (
    <Container className="pt-[130px] md:pt-[180px] pb-[100px] md:pb-[140px]">
      <Breadcrumbs items={crumbs} />

      <h1 className="text-3xl main-title-gradient mb-6">{t(`${cat.msgKey}.h1`)}</h1>

      {/* SEO-текст категорії (заготовка з TODO на копірайт) */}
      <p className="not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/75 max-w-[900px] mb-12">
        {t(`${cat.msgKey}.intro`)}
      </p>

      {products.length > 0 ? (
        <CatalogList products={products} />
      ) : (
        <p className="not-italic font-e-ukraine text-black/60">
          {t("emptyList")}
        </p>
      )}

      {/* Перелінковка: інші категорії + pillar «Застосування» */}
      <div className="mt-16">
        <h2 className="not-italic font-e-ukraine font-medium text-[20px] md:text-[24px] mb-5 text-black">
          {t("otherCategories")}
        </h2>
        <ul className="flex flex-wrap gap-4">
          {others.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/catalog/c/${c.slug}`}
                className="inline-block rounded-full border border-commonBlue/30 px-5 py-2 not-italic font-e-ukraine text-commonBlue hover:bg-commonBlue/10 transition-colors"
              >
                {t(`${c.msgKey}.h1`)}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/zastosuvannia-suhogo-lodu"
              className="inline-block rounded-full border border-commonBlue/30 px-5 py-2 not-italic font-e-ukraine text-commonBlue hover:bg-commonBlue/10 transition-colors"
            >
              {t("applicationsLink")}
            </Link>
          </li>
        </ul>
      </div>
    </Container>
  );
}
