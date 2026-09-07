import Container from "@/utils/Container";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { getProductsByCategory } from "@/lib/products";
import { CATEGORIES, categoryBySlug } from "@/lib/categories";
import CatalogList from "@/app/components/main/Catalog/CatalogList";
import Breadcrumbs from "@/app/components/common/Breadcrumbs";
import RawMaterialNote from "@/app/components/common/RawMaterialNote";
import RelatedLinks from "@/app/components/common/RelatedLinks";
import JsonLd from "@/app/components/common/JsonLd";
import { itemListSchema } from "@/lib/schema";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

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
  return pageMeta({
    title: t(`${cat.msgKey}.metaTitle`),
    description: t(`${cat.msgKey}.metaDescription`),
    path: `/catalog/c/${cat.slug}`,
    locale,
  });
}

export default async function CategoryPage({ params }) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const cat = categoryBySlug(category);
  if (!cat) notFound();

  const t = await getTranslations({ locale, namespace: "Categories" });
  const products = await getProductsByCategory(locale, cat.key);

  const tc = await getTranslations({ locale, namespace: "Catalog" });
  const crumbs = [
    { name: tc("title"), href: "/catalog" },
    { name: t(`${cat.msgKey}.h1`) },
  ];

  const pillBase =
    "inline-block rounded-full px-6 py-2.5 not-italic font-e-ukraine transition-colors";
  const pillInactive =
    "border border-commonBlue/30 text-commonBlue hover:bg-commonBlue/10";
  const pillActive = "bg-commonBlue text-white hover:opacity-90";

  return (
    <Container className="pt-[130px] md:pt-[180px] pb-[100px] md:pb-[140px]">
      {/* ItemList: структурований перелік товарів категорії */}
      <JsonLd
        data={itemListSchema({ name: t(`${cat.msgKey}.h1`), products })}
      />
      <Breadcrumbs items={crumbs} />

      {/* Фільтр за категоріями (активна — поточна) */}
      <ul className="flex flex-wrap gap-3 md:gap-4 mb-8">
        <li>
          <Link href="/catalog" className={`${pillBase} ${pillInactive}`}>
            {tc("all")}
          </Link>
        </li>
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/catalog/c/${c.slug}`}
              aria-current={c.slug === cat.slug ? "page" : undefined}
              className={`${pillBase} ${
                c.slug === cat.slug ? pillActive : pillInactive
              }`}
            >
              {t(`${c.msgKey}.h1`)}
            </Link>
          </li>
        ))}
      </ul>

      <h1 className="text-3xl main-title-gradient mb-6">{t(`${cat.msgKey}.h1`)}</h1>

      <div className="flex flex-col lg:flex-row gap-8 mb-12 items-start">
        {/* SEO-текст категорії. whitespace-pre-line — щоб абзаци з \n\n
            залишались абзацами, а не злипались у суцільне полотно. */}
        <div className="not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/75 lg:flex-1 whitespace-pre-line">
          {t(`${cat.msgKey}.intro`)}
        </div>
        {cat.image && (
          <div className="relative w-full lg:w-[42%] aspect-[4/3] rounded-2xl overflow-hidden shrink-0">
            <Image
              src={cat.image}
              alt={t(`${cat.msgKey}.h1`)}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Харчовий лід: пояснюємо, звідки береться марка сировини, і ведемо
          читача на матеріал, який розбирає різницю харчової й технічної CO₂. */}
      {cat.slug === "harchovyi-lid" && (
        <div className="mb-12">
          <RawMaterialNote locale={locale} variant="foodIce" />
        </div>
      )}

      {products.length > 0 ? (
        <CatalogList products={products} />
      ) : (
        <p className="not-italic font-e-ukraine text-black/60">
          {t("emptyList")}
        </p>
      )}

      {/* Перелінковка: інші категорії, опт, застосування, гео */}
      <div className="mt-16 md:mt-24">
        <RelatedLinks locale={locale} excludeSlug={cat.slug} />
      </div>
    </Container>
  );
}
