// Карта сайту з hreflang-альтернативами для двох мовних версій.
// Статичні сторінки — у коді; товари й статті блогу — автоматично з Sanity
// (з окремими slug на кожну мову). Новий товар/стаття в CMS з'являється тут
// без змін у коді.
//
// Два свідомі рішення:
//  • <image:image> — у записів товарів, статей і категорій перелічені абсолютні
//    URL картинок, щоб вони індексувались у Google Картинках (поле images
//    підтримується Next з 14.2);
//  • lastModified — реальна дата з Sanity (_updatedAt), а не new Date().
//    Якщо всім URL щогодини проставляти «сьогодні», Google перестає довіряти
//    lastmod взагалі. Для статичних сторінок — дата останньої правки контенту.

import { getProductsForSitemap } from "@/lib/products";
import { getBlogPostsForSitemap } from "@/lib/blog";
import { CATEGORIES } from "@/lib/categories";
import { CITY_SLUGS } from "@/lib/cities";

// ISR: новий товар/стаття потрапляє в sitemap без ребілду.
export const revalidate = 3600;

// Дата останньої змістовної правки статичних сторінок. Оновлювати вручну,
// коли реально міняється контент сторінки, — це і є сенс lastmod.
const STATIC_LASTMOD = "2026-08-06";

// Статичні сторінки (спільний шлях для обох мов).
const staticPaths = [
  "",
  "/catalog",
  "/payment-and-delivery",
  "/blog",
  "/contacts",
  // Юридичні/сервісні сторінки.
  "/privacy-policy",
  "/terms",
  "/payment",
  "/returns",
  // Контентні сторінки.
  "/faq",
  "/zastosuvannia-suhogo-lodu",
  "/about",
  "/production",
  // Опт / B2B.
  "/opt",
  // Гео-лендинги по містах — з lib/cities.js.
  ...CITY_SLUGS.map((s) => `/${s}`),
];

// Як часто реально змінюється контент — за типом сторінки.
function changeFreqFor(path) {
  if (path === "" || path === "/catalog" || path === "/blog") return "weekly";
  if (path === "/privacy-policy" || path === "/terms") return "yearly";
  return "monthly";
}

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const abs = (u) => (/^https?:\/\//.test(u) ? u : `${base}${u}`);

  const entry = ({
    ukPath,
    ruPath,
    priority,
    lastModified,
    changeFrequency = "monthly",
    images = [],
  }) => ({
    url: `${base}${ukPath}`,
    lastModified: lastModified || STATIC_LASTMOD,
    changeFrequency,
    priority,
    ...(images.length ? { images: images.map(abs) } : {}),
    alternates: {
      languages: {
        uk: `${base}${ukPath}`,
        ru: `${base}${ruPath}`,
        "x-default": `${base}${ukPath}`,
      },
    },
  });

  // Статичні сторінки (однаковий slug для uk/ru).
  const staticEntries = staticPaths.map((path) =>
    entry({
      ukPath: path === "" ? "/" : path,
      ruPath: `/ru${path}`,
      priority: path === "" ? 1 : 0.8,
      changeFrequency: changeFreqFor(path),
    })
  );

  // Категорійні посадкові — з ілюстрацією категорії.
  const categoryEntries = CATEGORIES.map((c) =>
    entry({
      ukPath: `/catalog/c/${c.slug}`,
      ruPath: `/ru/catalog/c/${c.slug}`,
      priority: 0.9,
      changeFrequency: "weekly",
      images: c.image ? [c.image] : [],
    })
  );

  // Товари (єдиний slug для обох мов) — з усіма фото галереї.
  const products = await getProductsForSitemap();
  const productEntries = products.map((p) =>
    entry({
      ukPath: `/catalog/${p.slug}`,
      ruPath: `/ru/catalog/${p.slug}`,
      priority: 0.7,
      lastModified: p.updatedAt,
      images: p.images,
    })
  );

  // Статті блогу (єдиний slug для обох мов) — з обкладинкою.
  const posts = await getBlogPostsForSitemap();
  const blogEntries = posts.map((p) =>
    entry({
      ukPath: `/blog/${p.slug}`,
      ruPath: `/ru/blog/${p.slug}`,
      priority: 0.6,
      lastModified: p.updatedAt,
      images: p.images,
    })
  );

  return [
    ...staticEntries,
    ...categoryEntries,
    ...productEntries,
    ...blogEntries,
  ];
}
