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
    name: "IceLab",
    url: SITE,
    logo: abs("/icons/white-logo.svg"),
    sameAs: ["https://instagram.com/icelabua", "https://www.co2lab.pro/"],
  };
}

// city: { name, address, url } — дані з messages.Contacts.cities.
export function localBusinessSchema({ name, address, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressCountry: "UA",
    },
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
    dateModified: post.publishedAt || undefined,
    author: { "@type": "Organization", name: "IceLab" },
    publisher: {
      "@type": "Organization",
      name: "IceLab",
      logo: { "@type": "ImageObject", url: abs("/icons/white-logo.svg") },
    },
    mainEntityOfPage: abs(path),
  };
}
