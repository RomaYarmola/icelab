// Карта сайту з hreflang-альтернативами для двох мовних версій.
// Статичні сторінки — у коді; товари й статті блогу — автоматично з Sanity
// (з окремими slug на кожну мову). Новий товар/стаття в CMS з'являється тут
// без змін у коді.

import { getAllProductSlugs } from "@/lib/products";
import { getAllBlogSlugs } from "@/lib/blog";
import { CATEGORY_SLUGS } from "@/lib/categories";

// ISR: новий товар/стаття потрапляє в sitemap без ребілду. (P2-1)
export const revalidate = 3600;

// Статичні сторінки (спільний шлях для обох мов).
const staticPaths = [
  "",
  "/catalog",
  "/payment-and-delivery",
  "/blog",
  "/contacts",
  // Юридичні/сервісні сторінки (P0-3).
  "/privacy-policy",
  "/terms",
  "/payment",
  "/returns",
  // Контентні сторінки (P1-5, P1-8).
  "/faq",
  "/zastosuvannia-suhogo-lodu",
  "/about",
  "/production",
  // Гео-лендинги (P2-2).
  "/suhyi-lid-kyiv",
  "/suhyi-lid-lviv",
  // Категорійні посадкові (P1-3).
  ...CATEGORY_SLUGS.map((slug) => `/catalog/c/${slug}`),
];

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const lastModified = new Date();

  const entry = (ukPath, ruPath, priority) => ({
    url: `${base}${ukPath}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
    alternates: {
      languages: { uk: `${base}${ukPath}`, ru: `${base}${ruPath}` },
    },
  });

  // Статичні сторінки (однаковий slug для uk/ru).
  const staticEntries = staticPaths.map((path) =>
    entry(path === "" ? "/" : path, `/ru${path}`, path === "" ? 1 : 0.8)
  );

  // Товари (єдиний slug для обох мов).
  const productSlugs = await getAllProductSlugs();
  const productEntries = productSlugs.map((slug) =>
    entry(`/catalog/${slug}`, `/ru/catalog/${slug}`, 0.7)
  );

  // Статті блогу (єдиний slug для обох мов).
  const blogSlugs = await getAllBlogSlugs();
  const blogEntries = blogSlugs.map((slug) =>
    entry(`/blog/${slug}`, `/ru/blog/${slug}`, 0.6)
  );

  return [...staticEntries, ...productEntries, ...blogEntries];
}
