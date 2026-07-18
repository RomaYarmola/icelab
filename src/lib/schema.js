// ─────────────────────────────────────────────────────────────────────────
// Білдери Schema.org (JSON-LD). Чисті функції → повертають JS-об'єкти, які
// рендеряться через <JsonLd data={...} />.
//
// Правила:
//  • Абсолютні URL будуються від SITE (NEXT_PUBLIC_SITE_URL), як у sitemap.
//  • Контент НЕ дублюється — беремо вже наявні дані (Sanity product/post,
//    messages.Contacts/Faq).
//  • Product БЕЗ aggregateRating — відгуків поки немає.
// ─────────────────────────────────────────────────────────────────────────

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Стабільний @id організації — щоб вузли Organization (глобальний у layout та
// той, що з рейтингом на головній) зливались пошуковиками в одну сутність.
const ORG_ID = `${SITE}/#organization`;

// Телефони бізнесу в форматі E.164 — єдине джерело для розмітки (Organization,
// LocalBusiness). Відображувані копії з форматуванням — у ContactsBlock.jsx.
export const CONTACT_PHONES = ["+380951606881", "+380502795031"];

// Офсайт-лінки сутності: соцмережі, суміжний бренд і картка Google Maps (GBP) —
// зв'язують Organization із зовнішніми профілями (сигнал довіри для пошуку/AI).
const ORG_SAME_AS = [
  "https://instagram.com/icelabua",
  "https://www.co2lab.pro/",
  "https://maps.google.com/?cid=10392293426580711670",
];

// Абсолютний URL із відносного шляху ("/contacts" → "https://site/contacts").
export function abs(path = "") {
  if (!path) return SITE;
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Прибирає HTML-теги (<br>, <b> тощо) з тексту відповідей FAQ.
export function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "IceLab",
    url: SITE,
    logo: abs("/icons/white-logo.svg"),
    telephone: CONTACT_PHONES[0],
    contactPoint: CONTACT_PHONES.map((tel) => ({
      "@type": "ContactPoint",
      telephone: tel,
      contactType: "sales",
      areaServed: "UA",
      availableLanguage: ["uk", "ru"],
    })),
    sameAs: ORG_SAME_AS,
  };
}

// aggregateRating + окремі відгуки для Organization. Джерело — РЕАЛЬНІ дані
// Google Places (lib/reviews). Той самий @id, що й у organizationSchema, тож
// пошуковики зливають рейтинг у ту саму сутність. Рендериться ЛИШЕ на сторінці,
// де відгуки реально видно (головна) і ЛИШЕ на реальних даних (не fallback).
export function organizationRatingSchema({ rating, total, reviews = [] } = {}) {
  if (!rating || !total) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "IceLab",
    url: SITE,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(rating).toFixed(1),
      reviewCount: total,
      bestRating: 5,
      worstRating: 1,
    },
    ...(reviews.length
      ? {
          review: reviews.slice(0, 5).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author || "Google" },
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating || 5,
              bestRating: 5,
              worstRating: 1,
            },
            ...(r.text ? { reviewBody: r.text } : {}),
          })),
        }
      : {}),
  };
}

// city: { name, address, url, telephone? } — дані з messages.Contacts.cities.
// telephone за замовчуванням — основний номер бізнесу (CONTACT_PHONES[0]).
export function localBusinessSchema({ name, address, url, telephone }) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressCountry: "UA",
    },
    telephone: telephone || CONTACT_PHONES[0],
    openingHours: "Mo-Fr 09:00-17:00",
    areaServed: "UA",
    url: abs(url),
  };
}

// product — нормалізований об'єкт із lib/products.
export function productSchema(product, path) {
  const images = (product.gallery && product.gallery.length
    ? product.gallery
    : product.mainImage
    ? [product.mainImage]
    : []
  ).map((u) => abs(u));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    ...(images.length ? { image: images } : {}),
    ...(product.description ? { description: product.description } : {}),
    brand: { "@type": "Brand", name: "IceLab" },
    offers: {
      "@type": "Offer",
      price: String(product.price),
      priceCurrency: "UAH",
      availability:
        product.availability === "in-stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: abs(path),
    },
  };
}

// items: [{ name, href }] — останній елемент без item (поточна сторінка).
export function breadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(i < items.length - 1 && it.href ? { item: abs(it.href) } : {}),
    })),
  };
}

// items: [{ question, answer }] — answer очищується від HTML.
export function faqSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: stripHtml(it.question),
      acceptedAnswer: { "@type": "Answer", text: stripHtml(it.answer) },
    })),
  };
}

// post — нормалізований об'єкт із lib/blog.
export function articleSchema(post, path) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.coverImage ? { image: [abs(post.coverImage)] } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    // Реальна дата останньої зміни (_updatedAt із Sanity) — сигнал свіжості.
    // Fallback на дату публікації, якщо оновлення ще не було.
    dateModified: post.updatedAt || post.publishedAt || undefined,
    author: { "@type": "Organization", name: "IceLab" },
    publisher: {
      "@type": "Organization",
      name: "IceLab",
      logo: { "@type": "ImageObject", url: abs("/icons/white-logo.svg") },
    },
    mainEntityOfPage: abs(path),
  };
}
