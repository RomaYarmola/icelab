// Перетворює нормалізований SEO-об'єкт (з lib/products або lib/blog) у формат
// Next Metadata: title/description/keywords/robots/canonical/hreflang/OG/Twitter.
//
// ukPath / ruPath — шляхи сторінки для кожної мови (для canonical та hreflang).
export function toNextMetadata({ seo, locale, ukPath, ruPath }) {
  const canonicalAuto = locale === "ru" ? ruPath : ukPath;
  const canonical = seo?.canonical || canonicalAuto;

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
      title: seo?.ogTitle || seo?.title,
      description: seo?.ogDescription || seo?.description,
      images: seo?.ogImage ? [seo.ogImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle || seo?.ogTitle || seo?.title,
      description: seo?.twitterDescription || seo?.ogDescription || seo?.description,
      images: seo?.twitterImage ? [seo.twitterImage] : [],
    },
  };

  if (seo?.keywords) metadata.keywords = seo.keywords;
  return metadata;
}
