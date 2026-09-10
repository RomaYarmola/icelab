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
import CategoryGuide from "@/app/components/common/CategoryGuide";
import CityPickupLinks from "@/app/components/common/CityPickupLinks";
import PriceTiersTable from "@/app/components/common/PriceTiersTable";
import JsonLd from "@/app/components/common/JsonLd";
import { itemListSchema } from "@/lib/schema";
import { getPriceSettings } from "@/lib/priceSettings";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

// Категорії льоду показують таблицю цін за обсягом (та сама сітка, що й кошик).
const PRICE_TABLE_CATEGORIES = ["dry-ice", "food-ice"];

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
  const tc = await getTranslations({ locale, namespace: "Catalog" });
  const [products, settings] = await Promise.all([
    getProductsByCategory(locale, cat.key),
    getPriceSettings(),
  ]);

  // Гід покупця (необов'язковий у messages) і «часто беруть разом» —
  // по 2 позиції з кожної суміжної категорії (lib/categories → crossSell).
  const guide = t.has(`${cat.msgKey}.guide`) ? t.raw(`${cat.msgKey}.guide`) : [];
  const crossSell = (
    await Promise.all(
      (cat.crossSell || []).map((key) => getProductsByCategory(locale, key))
    )
  )
    .flatMap((list) => list.slice(0, 2))
    .slice(0, 4);
  const priceLabels = {
    headVolume: tc("pricesHeadVolume"),
    headPrice: tc("pricesHeadPrice"),
    over: tc("pricesOver"),
    negotiable: tc("pricesNegotiable"),
    box: tc("pricesBox"),
    boxUnit: tc("pricesBoxUnit"),
    kgUnit: tc("pricesKgUnit"),
  };
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

      {products.length > 0 ? (
        <CatalogList products={products} />
      ) : (
        <p className="not-italic font-e-ukraine text-black/60">
          {t("emptyList")}
        </p>
      )}

      {/* SEO-текст категорії — під списком товарів: користувач бачить
          спочатку сам каталог, а розгорнутий опис читає нижче. */}
      <div className="flex flex-col lg:flex-row gap-8 mt-16 mb-12 items-start">
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

      {/* Таблиця цін за обсягом — лише для категорій льоду */}
      {PRICE_TABLE_CATEGORIES.includes(cat.key) && (
        <section className="mb-16 max-w-[760px]">
          <h2 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-5 text-black">
            {tc("pricesTitle")}
          </h2>
          <PriceTiersTable
            tiers={settings.dryIceTiers}
            boxes={settings.boxPrices}
            labels={priceLabels}
            caption={tc("pricesTitle")}
          />
          <p className="not-italic font-e-ukraine font-thin text-[15px] md:text-[16px] leading-relaxed text-black/75 mt-4">
            {tc("pricesNote")}
          </p>
        </section>
      )}

      {/* Гід покупця: яку гранулу, скільки брати, як зберігати */}
      {guide.length > 0 && (
        <div className="mb-16">
          <CategoryGuide sections={guide} />
        </div>
      )}

      {/* Часто беруть разом — товари суміжних категорій */}
      {crossSell.length > 0 && (
        <section className="mb-16">
          <h2 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-6 text-black">
            {tc("boughtTogether")}
          </h2>
          <CatalogList products={crossSell} />
        </section>
      )}

      {/* Доставка та самовивіз по містах — контекстні посилання на гео */}
      <div className="mb-16">
        <CityPickupLinks locale={locale} />
      </div>

      {/* Перелінковка: інші категорії, опт, застосування, гео */}
      <div className="mt-16 md:mt-24">
        <RelatedLinks locale={locale} excludeSlug={cat.slug} withCities={false} />
      </div>
    </Container>
  );
}
