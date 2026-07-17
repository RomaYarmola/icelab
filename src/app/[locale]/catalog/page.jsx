import Container from "@/utils/Container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProducts } from "@/lib/products";
import CatalogList from "@/app/components/main/Catalog/CatalogList";
import { routing } from "@/i18n/routing";

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
  const products = await getProducts(locale);

  return (
    <Container className="pt-[130px] md:pt-[180px] pb-[100px] md:pb-[140px]">
      <h1 className="text-3xl main-title-gradient text-center mb-10 md:mb-14">
        {t("title")}
      </h1>
      <CatalogList products={products} />
    </Container>
  );
}
