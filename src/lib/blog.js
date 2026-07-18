// Шар доступу до блогу. ЄДИНЕ джерело — Sanity CMS.
// Двомовні тексти, окремі slug на кожну мову, тіло — Portable Text (uk/ru).

import { sanityFetch } from "@/sanity/client";
import {
  BLOG_POSTS_QUERY,
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_SLUGS_QUERY,
} from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";

function loc(value, locale) {
  if (value && typeof value === "object") return value[locale] ?? value.uk ?? "";
  return value ?? "";
}

function buildSeo(raw, locale, title, excerpt, coverUrl) {
  const s = raw.seo || {};
  const seoTitle = loc(s.title, locale) || title;
  const seoDescription = loc(s.description, locale) || excerpt;
  const ogTitle = loc(s.ogTitle, locale) || seoTitle;
  const ogDescription = loc(s.ogDescription, locale) || seoDescription;
  const ogImage = urlForImage(s.ogImage) || coverUrl;
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

function normalizeListItem(raw, locale) {
  const title = loc(raw.title, locale);
  const excerpt = loc(raw.excerpt, locale);
  const cover = urlForImage(raw.coverImage);
  return {
    id: raw._id,
    slug: raw.slug,
    title,
    excerpt,
    coverImage: cover,
    coverAlt: loc(raw.coverImage?.alt, locale) || title,
    publishedAt: raw.publishedAt ?? null,
    // Дата останньої зміни документа в Sanity — для dateModified у schema.
    updatedAt: raw._updatedAt ?? null,
    seo: buildSeo(raw, locale, title, excerpt, cover),
  };
}

export async function getBlogPosts(locale) {
  const raw = await sanityFetch(BLOG_POSTS_QUERY, {}, []);
  return (raw || [])
    .filter((p) => p.slug)
    .map((p) => normalizeListItem(p, locale));
}

export async function getBlogPostBySlug(slug, locale) {
  const raw = await sanityFetch(BLOG_POST_BY_SLUG_QUERY, { slug }, null);
  if (!raw) return null;
  const base = normalizeListItem(raw, locale);
  return {
    ...base,
    body: locale === "ru" ? raw.bodyRu : raw.bodyUk,
  };
}

export async function getAllBlogSlugs() {
  const raw = await sanityFetch(BLOG_SLUGS_QUERY, {}, []);
  return (raw || []).filter(Boolean);
}
