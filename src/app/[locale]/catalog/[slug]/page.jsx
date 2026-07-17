import Container from "@/utils/Container";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProductBySlug, getAllProductSlugs } from "@/lib/products";
import { toNextMetadata } from "@/lib/seo";
import ProductGallery from "@/app/components/main/Catalog/ProductGallery";
import AddToCartControl from "@/app/components/main/Catalog/AddToCartControl";

// Пререндер сторінок товарів. Slug — єдиний для обох мов.
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

// SEO/OpenGraph/Twitter/robots з CMS (fallback у lib/products) + canonical/hreflang.
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);
  if (!product) return {};
  return toNextMetadata({
    seo: product.seo,
    locale,
    ukPath: `/catalog/${product.slug}`,
    ruPath: `/ru/catalog/${product.slug}`,
  });
}

export default async function ProductPage({ params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: "ProductPage" });
  const isAvailable = product.availability === "in-stock";

  return (
    <Container className="pt-[120px] md:pt-[170px] pb-[100px] md:pb-[140px]">
      <div className="flex flex-col md:flex-row gap-8 l:gap-16">
        {/* Галерея */}
        <div className="md:w-1/2 md:sticky md:top-[110px] self-start w-full">
          <ProductGallery images={product.gallery} alt={product.title} />
        </div>

        {/* Інформація про товар */}
        <div className="md:w-1/2 flex flex-col gap-5">
          {/* Бейдж наявності */}
          <span
            className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-e-ukraine not-italic ${
              isAvailable
                ? "bg-commonBlue/10 text-commonBlue"
                : "bg-[#F31260]/10 text-[#F31260]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAvailable ? "bg-commonBlue" : "bg-[#F31260]"
              }`}
            />
            {isAvailable ? t("inStock") : t("outOfStock")}
          </span>

          <h1 className="text-2xl main-title-gradient leading-tight">
            {product.title}
          </h1>

          {product.description && (
            <p className="font-e-ukraine font-thin not-italic text-commonBlue/80 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Ціна */}
          <div className="flex items-baseline gap-2 py-2">
            <span className="main-title-gradient text-3xl font-medium font-michelin">
              {product.price}
            </span>
            <span className="font-e-ukraine not-italic text-commonBlue/70 text-lg">
              {product.unit}
            </span>
          </div>

          {product.specs.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-medium text-commonBlue">
                {t("specifications")}
              </h2>
              <ul className="flex flex-col">
                {product.specs.map((spec, index) => (
                  <li
                    key={index}
                    className="flex justify-between gap-4 py-2.5 border-b border-commonBlue/15 font-e-ukraine not-italic text-commonBlue"
                  >
                    <span className="font-thin text-commonBlue/70">
                      {spec.label}
                    </span>
                    <span className="font-medium text-right">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2">
            <AddToCartControl product={product} variant="page" />
          </div>
        </div>
      </div>
    </Container>
  );
}
