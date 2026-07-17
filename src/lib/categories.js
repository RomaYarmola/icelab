// Єдине джерело мапінгу категорій каталогу.
//  • key      — значення Sanity product.category;
//  • slug     — URL-слаг категорійної сторінки (/catalog/c/<slug>);
//  • msgKey   — ключ у namespace "Categories" (messages/*.json).
export const CATEGORIES = [
  { key: "dry-ice", slug: "suhyi-lid", msgKey: "dryIce" },
  { key: "food-ice", slug: "harchovyi-lid", msgKey: "foodIce" },
  { key: "ice-box", slug: "termoboksy", msgKey: "iceBox" },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export function categoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || null;
}

export function categoryByKey(key) {
  return CATEGORIES.find((c) => c.key === key) || null;
}
