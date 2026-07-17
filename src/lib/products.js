// ─────────────────────────────────────────────────────────────────────────
// Шар доступу до даних каталогу. ЄДИНЕ джерело — Sanity CMS.
//
//  • тексти двомовні (uk/ru) — резолвяться під поточну локаль;
//  • slug — окремий на кожну мову (slugUk/slugRu), обидва повертаються
//    для hreflang та роутингу;
//  • ЦІНА: useAutoPrice → існуюча формула calculateTotalPrice з Price Settings;
//    інакше — manualPrice з CMS. Другої системи розрахунку немає;
//  • alt зображень: image.alt || назва товару;
//  • SEO: поля з CMS із ланцюжком fallback (див. buildSeo).
//
// Якщо Sanity не налаштована/порожня — повертаються порожні масиви (сторінки
// не ламаються), а ціни в калькуляторі беруться з констант (див. priceSettings).
// ─────────────────────────────────────────────────────────────────────────

import { getTranslations } from "next-intl/server";
import { sanityFetch } from "@/sanity/client";
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCT_SLUGS_QUERY,
} from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import { calculateTotalPrice } from "@/utils/pricing";
import { getPriceSettings, buildPricing } from "@/lib/priceSettings";

// Резолвить двомовне поле { uk, ru } у рядок для локалі.
function loc(value, locale) {
  if (value && typeof value === "object") return value[locale] ?? value.uk ?? "";
  return value ?? "";
}

// Категорія → варіант для формули розрахунку.
function variantOf(categoryKey) {
  if (categoryKey === "ice-box") return "iceBox";
  if (categoryKey === "dry-ice") return "dryIce";
  return null; // food-ice тощо — лише ручна ціна
}

// Ціна товару. Авто-підстановка працює ЛИШЕ для категорій льоду (dry-ice,
// ice-box) і лише коли ціна реально обчислюється. У всіх інших випадках
// (не лід, вимкнена авто-ціна, невідомий розмір боксу, некоректна вага) —
// падаємо назад на ручну ціну (manualPrice). Так нові товари/розміри не
// ламають каталог: у гіршому разі використовується ручна ціна.
function resolvePrice(raw, pricing) {
  const variant = variantOf(raw.category);
  const auto = raw.useAutoPrice !== false;
  const manual = Number(raw.manualPrice ?? 0);
  const weight = Number(raw.weight);

  // Сухий лід: тарифна сітка за вагою (діапазони). Якщо вага некоректна —
  // ручна ціна.
  if (auto && variant === "dryIce" && weight > 0) {
    const price = Number(
      calculateTotalPrice(
        weight,
        raw.granuleSize,
        "dryIce",
        pricing.pricePerUnit,
        pricing.tiers
      )
    );
    return price > 0 ? price : manual;
  }

  // Бокси: ціна за конкретний розмір. Якщо цього розміру немає в Price
  // Settings (клієнт додав новий бокс, не завівши ціну) — ручна ціна,
  // а не мовчазний нуль.
  if (auto && variant === "iceBox" && weight > 0) {
    const configured = pricing.pricePerUnit?.iceBox?.[weight];
    if (configured != null) {
      const price = Number(
        calculateTotalPrice(
          1,
          weight,
          "iceBox",
          pricing.pricePerUnit,
          pricing.tiers
        )
      );
      if (price > 0) return price;
    }
    return manual;
  }

  // Не лід / авто вимкнена / не вдалося обчислити → ручна ціна.
  return manual;
}

// Зображення + alt із fallback на назву товару.
function image(source, fallbackAlt, locale) {
  const url = urlForImage(source);
  if (!url) return null;
  return { url, alt: loc(source?.alt, locale) || fallbackAlt };
}

// SEO з ланцюжком fallback: og/twitter → seo → назва/опис товару.
function buildSeo(raw, locale, title, shortDescription, mainImageUrl) {
  const s = raw.seo || {};
  const seoTitle = loc(s.title, locale) || title;
  const seoDescription = loc(s.description, locale) || shortDescription;
  const ogTitle = loc(s.ogTitle, locale) || seoTitle;
  const ogDescription = loc(s.ogDescription, locale) || seoDescription;
  const ogImage = urlForImage(s.ogImage) || mainImageUrl;
  return {
    title: seoTitle,
    description: seoDescription,
    keywords: loc(s.keywords, locale),
    canonical: loc(s.canonical, locale),
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle: loc(s.twitterTitle, locale) || ogTitle,
    twitterDescription: loc(s.twitterDescription, locale) || ogDescription,
    twitterImage: urlForImage(s.twitterImage) || ogImage,
    robots: s.robots || "index,follow",
  };
}

function normalizeProduct(raw, locale, pricing, t) {
  const title = loc(raw.title, locale);
  const shortDescription = loc(raw.shortDescription, locale);
  const description = loc(raw.description, locale);
  const variant = variantOf(raw.category);

  const main = image(raw.mainImage, title, locale);
  const gallery = Array.isArray(raw.gallery)
    ? raw.gallery.map((g) => image(g, title, locale)).filter(Boolean)
    : [];
  const galleryUrls = (gallery.length ? gallery : main ? [main] : []).map(
    (g) => g.url
  );

  const kg = t("Catalog.kg");
  const specs =
    variant === "iceBox"
      ? [{ label: t("Catalog.capacity"), value: `${raw.weight} ${kg}` }]
      : [
          ...(raw.granuleSize
            ? [{ label: t("Catalog.granuleSize"), value: raw.granuleSize }]
            : []),
          { label: t("Catalog.weight"), value: `${raw.weight} ${kg}` },
        ];

  return {
    id: raw._id,
    slug: raw.slug,
    category: raw.category ?? null,
    variant,
    availability: raw.availability ?? "in-stock",
    price: resolvePrice(raw, pricing),
    unit: t("Catalog.currency"),
    mainImage: main?.url ?? null,
    mainImageAlt: main?.alt ?? title,
    gallery: galleryUrls,
    title,
    shortDescription,
    description,
    specs,
    seo: buildSeo(raw, locale, title, shortDescription, main?.url ?? null),
  };
}

export async function getProducts(locale) {
  const [raw, settings, t] = await Promise.all([
    sanityFetch(PRODUCTS_QUERY, {}, []),
    getPriceSettings(),
    getTranslations({ locale }),
  ]);
  const pricing = buildPricing(settings);
  return (raw || [])
    .filter((p) => p.slug)
    .map((p) => normalizeProduct(p, locale, pricing, t));
}

// Товари однієї категорії (для категорійних посадкових сторінок P1-3).
export async function getProductsByCategory(locale, categoryKey) {
  const all = await getProducts(locale);
  return all.filter((p) => p.category === categoryKey);
}

export async function getProductBySlug(slug, locale) {
  const raw = await sanityFetch(PRODUCT_BY_SLUG_QUERY, { slug }, null);
  if (!raw) return null;
  const [settings, t] = await Promise.all([
    getPriceSettings(),
    getTranslations({ locale }),
  ]);
  return normalizeProduct(raw, locale, buildPricing(settings), t);
}

// Список slug для generateStaticParams / sitemap (єдиний для обох мов).
export async function getAllProductSlugs() {
  const raw = await sanityFetch(PRODUCT_SLUGS_QUERY, {}, []);
  return (raw || []).filter(Boolean);
}
