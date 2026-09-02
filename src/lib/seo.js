// Перетворює нормалізований SEO-об'єкт (з lib/products або lib/blog) у формат
// Next Metadata: title/description/keywords/robots/canonical/hreflang/OG/Twitter.
//
// ukPath / ruPath — шляхи сторінки для кожної мови (для canonical та hreflang).
// Брендовий OG-fallback для сторінок без власної картинки.
const DEFAULT_OG_IMAGE = "/og-icelab.jpg";
const OG_SIZE = 600;

// Дефолтні robots-директиви.
//
// `max-snippet:-1`, `max-image-preview:large`, `max-video-preview:-1` — це не
// косметика: саме ці директиви керують тим, скільки тексту й яку картинку
// Google має право показати в розширених сніпетах, AI Overviews та AI Mode.
// Окремого «opt-in для AI» не існує — Google керує появою в AI-відповідях
// звичайними preview-директивами. Без max-snippet сніпет обрізається за
// дефолтною довжиною, і сторінка гірше цитується.
// Джерело: developers.google.com/search/docs/appearance/ai-features
export const ROBOTS_INDEXABLE = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

// Нормалізує robots із CMS: рядок "noindex..." лишаємо як є (це свідома
// заборона), усе інше — повний індексований набір із preview-директивами.
function resolveRobots(value) {
  if (typeof value === "string" && /noindex/i.test(value)) return value;
  if (value && typeof value === "object") return value;
  return ROBOTS_INDEXABLE;
}

// Квадратне 600×600 прев'ю для картки summary → у Telegram/соцмережах невелике
// фото праворуч, а не величезний банер. Картинки товарів/статей приходять уже
// квадратно обрізаними (urlForImageSquare), тож 600×600 тут коректні.
function ogImageObject(url, alt) {
  return {
    url: url || DEFAULT_OG_IMAGE,
    width: OG_SIZE,
    height: OG_SIZE,
    alt: alt || "IceLab",
  };
}

export function toNextMetadata({ seo, locale, ukPath, ruPath }) {
  const canonicalAuto = locale === "ru" ? ruPath : ukPath;
  const canonical = seo?.canonical || canonicalAuto;

  const ogImg = ogImageObject(seo?.ogImage, seo?.ogTitle || seo?.title);
  const twUrl = seo?.twitterImage || seo?.ogImage || DEFAULT_OG_IMAGE;

  const metadata = {
    title: seo?.title,
    description: seo?.description,
    robots: resolveRobots(seo?.robots),
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
      images: [ogImg],
    },
    // Компактна картка (маленьке фото праворуч), а не summary_large_image.
    twitter: {
      card: "summary",
      title: seo?.twitterTitle || seo?.ogTitle || seo?.title,
      description: seo?.twitterDescription || seo?.ogDescription || seo?.description,
      images: [twUrl],
    },
  };

  if (seo?.keywords) metadata.keywords = seo.keywords;
  return metadata;
}

// Повні метадані для сторінок із локалізованими title/description (з messages).
// Гарантує УНІКАЛЬНІ, мовозалежні OpenGraph/Twitter із компактною карткою
// summary — інакше сторінка успадкувала б OG головної (title/description).
// path — шлях без локалі (напр. "/catalog"); ru-версія отримує префікс /ru.
export function pageMeta({ title, description, path, locale, image }) {
  const uk = path;
  const ru = `/ru${path}`;
  const canonical = locale === "ru" ? ru : uk;
  const og = image || ogImageObject();
  return {
    title,
    description,
    robots: ROBOTS_INDEXABLE,
    alternates: { canonical, languages: { uk, ru, "x-default": uk } },
    openGraph: {
      type: "website",
      siteName: "IceLab",
      locale: locale === "ru" ? "ru_RU" : "uk_UA",
      url: canonical,
      title,
      description,
      images: [og],
    },
    twitter: { card: "summary", title, description, images: [og.url] },
  };
}
