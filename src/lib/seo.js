// Перетворює нормалізований SEO-об'єкт (з lib/products або lib/blog) у формат
// Next Metadata: title/description/keywords/robots/canonical/hreflang/OG/Twitter.
//
// ukPath / ruPath — шляхи сторінки для кожної мови (для canonical та hreflang).
// Брендовий OG-fallback для сторінок без власної картинки.
const DEFAULT_OG_IMAGE = "/og-default.jpg";

export function toNextMetadata({ seo, locale, ukPath, ruPath }) {
  const canonicalAuto = locale === "ru" ? ruPath : ukPath;
  const canonical = seo?.canonical || canonicalAuto;

  // Fallback на брендову картинку, якщо у товару/статті немає власної.
  const ogImages = [seo?.ogImage || DEFAULT_OG_IMAGE];
  const twitterImages = [seo?.twitterImage || seo?.ogImage || DEFAULT_OG_IMAGE];

  const metadata = {
    title: seo?.title,
    description: seo?.description,
    robots: seo?.robots || "index,follow",
    alternates: {
      canonical,
      languages: { uk: ukPath, ru: ruPath, "x-default": ukPath },
    },
    openGraph: {
      type: "website",
      siteName: "IceLab",
      locale: locale === "ru" ? "ru_RU" : "uk_UA",
      url: canonical,
      title: seo?.ogTitle || seo?.title,
      description: seo?.ogDescription || seo?.description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle || seo?.ogTitle || seo?.title,
      description: seo?.twitterDescription || seo?.ogDescription || seo?.description,
      images: twitterImages,
    },
  };

  if (seo?.keywords) metadata.keywords = seo.keywords;
  return metadata;
}
