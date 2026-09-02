// Збірка й серіалізація sitemap.xml.
//
// ЧОМУ НЕ next-івський `app/sitemap.js`. Вбудований серіалізатор Next
// (`resolveSitemap`) вставляє значення в XML сирою інтерполяцією, без жодного
// екранування: `<image:loc>${image}</image:loc>`. URL картинок Sanity містять
// `&` (`?rect=...&fit=max&auto=format`), а голий `&` у XML — недопустимий токен.
// Через це файл переставав бути валідним XML на першому ж товарі з галереєю:
// Google повідомляв «Помилка розбору» і знаходив 0 сторінок, Ahrefs — 106
// сторінок «не в sitemap». Тому серіалізація тут своя, з обов'язковим
// екрануванням кожного значення (див. xmlEscape + тест scripts/check-sitemap.mjs).
//
// ДРУГЕ ВИПРАВЛЕННЯ: раніше в `<loc>` потрапляли лише uk-адреси, а ru-версії
// існували тільки як `<xhtml:link>`. За документацією Google кожна мовна версія
// має бути окремим записом `<url>` і перелічувати ВСІ версії, включно з собою.
// Тепер 53 сторінки дають 106 записів — рівно стільки, скільки індексується.
//
// Два свідомі рішення збережені з попередньої версії:
//  • <image:image> — абсолютні URL картинок товарів, статей і категорій, щоб
//    вони індексувались у Google Картинках;
//  • lastmod — реальна дата з Sanity (_updatedAt), а не new Date(). Якщо всім
//    URL щогодини проставляти «сьогодні», Google перестає довіряти lastmod.

import { getProductsForSitemap } from "@/lib/products";
import { getBlogPostsForSitemap } from "@/lib/blog";
import { CATEGORIES } from "@/lib/categories";
import { CITY_SLUGS } from "@/lib/cities";

// Дата останньої змістовної правки статичних сторінок. Оновлювати вручну,
// коли реально міняється контент сторінки, — це і є сенс lastmod.
const STATIC_LASTMOD = "2026-09-02";

// Статичні сторінки (спільний шлях для обох мов).
// /delivery і /basket сюди НЕ входять — вони noindex.
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

// Екранування для текстових вузлів і значень атрибутів XML.
// `&` має йти першим, інакше екрануються вже вставлені entity.
export function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Одна логічна сторінка → два записи (uk і ru), кожен з повним набором
// hreflang-альтернатив, включно з посиланням на себе.
function pair({
  ukPath,
  ruPath,
  priority,
  lastmod,
  changefreq = "monthly",
  images = [],
}) {
  const alternates = { uk: ukPath, ru: ruPath, "x-default": ukPath };
  return [ukPath, ruPath].map((loc) => ({
    loc,
    lastmod: lastmod || STATIC_LASTMOD,
    changefreq,
    priority,
    alternates,
    images,
  }));
}

export async function buildSitemapEntries(base) {
  const abs = (u) => (/^https?:\/\//.test(u) ? u : `${base}${u}`);
  const url = (path) => `${base}${path}`;

  // Статичні сторінки (однаковий slug для uk/ru).
  const staticEntries = staticPaths.flatMap((path) =>
    pair({
      ukPath: url(path === "" ? "/" : path),
      ruPath: url(`/ru${path}`),
      priority: path === "" ? 1 : 0.8,
      changefreq: changeFreqFor(path),
    })
  );

  // Категорійні посадкові — з ілюстрацією категорії.
  const categoryEntries = CATEGORIES.flatMap((c) =>
    pair({
      ukPath: url(`/catalog/c/${c.slug}`),
      ruPath: url(`/ru/catalog/c/${c.slug}`),
      priority: 0.9,
      changefreq: "weekly",
      images: c.image ? [abs(c.image)] : [],
    })
  );

  // Товари (єдиний slug для обох мов) — з усіма фото галереї.
  const products = await getProductsForSitemap();
  const productEntries = products.flatMap((p) =>
    pair({
      ukPath: url(`/catalog/${p.slug}`),
      ruPath: url(`/ru/catalog/${p.slug}`),
      priority: 0.7,
      lastmod: p.updatedAt,
      images: (p.images || []).map(abs),
    })
  );

  // Статті блогу (єдиний slug для обох мов) — з обкладинкою.
  const posts = await getBlogPostsForSitemap();
  const blogEntries = posts.flatMap((p) =>
    pair({
      ukPath: url(`/blog/${p.slug}`),
      ruPath: url(`/ru/blog/${p.slug}`),
      priority: 0.6,
      lastmod: p.updatedAt,
      images: (p.images || []).map(abs),
    })
  );

  return [
    ...staticEntries,
    ...categoryEntries,
    ...productEntries,
    ...blogEntries,
  ];
}

// ISO-дата без часу, якщо Sanity віддав повний timestamp, — sitemap приймає
// обидва формати, але короткий читабельніший у діффах.
function lastmodValue(value) {
  return value instanceof Date ? value.toISOString() : String(value);
}

export function renderSitemapXml(entries) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' +
      ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' +
      ' xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  for (const e of entries) {
    lines.push("<url>");
    lines.push(`<loc>${xmlEscape(e.loc)}</loc>`);

    for (const [lang, href] of Object.entries(e.alternates || {})) {
      lines.push(
        `<xhtml:link rel="alternate" hreflang="${xmlEscape(lang)}" href="${xmlEscape(href)}" />`
      );
    }

    for (const image of e.images || []) {
      lines.push(
        `<image:image><image:loc>${xmlEscape(image)}</image:loc></image:image>`
      );
    }

    if (e.lastmod) lines.push(`<lastmod>${xmlEscape(lastmodValue(e.lastmod))}</lastmod>`);
    if (e.changefreq) lines.push(`<changefreq>${xmlEscape(e.changefreq)}</changefreq>`);
    if (typeof e.priority === "number") lines.push(`<priority>${e.priority}</priority>`);

    lines.push("</url>");
  }

  lines.push("</urlset>");
  return lines.join("\n") + "\n";
}
