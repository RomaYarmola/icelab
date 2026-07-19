// Єдине джерело мапінгу категорій каталогу.
//  • key      — значення Sanity product.category;
//  • slug     — URL-слаг категорійної сторінки (/catalog/c/<slug>);
//  • msgKey   — ключ у namespace "Categories" (messages/*.json).
export const CATEGORIES = [
  {
    key: "dry-ice",
    slug: "suhyi-lid",
    msgKey: "dryIce",
    image: "/images/products/ice-1.webp",
  },
  {
    key: "food-ice",
    slug: "harchovyi-lid",
    msgKey: "foodIce",
    image: "/images/products/ice-2.webp",
  },
  {
    key: "ice-box",
    slug: "termoboksy",
    msgKey: "iceBox",
    image: "/images/pages/ice-box-real.webp",
  },
  {
    key: "dry-ice-box",
    slug: "korobka-z-suhym-lodom",
    msgKey: "dryIceBox",
    image: "/images/pages/korobka-suhyi-lid.webp",
  },
  {
    key: "krioblasting",
    slug: "chystka-suhym-lodom",
    msgKey: "dryIceCleaning",
    image: "/images/pages/chystka-suhym-lodom.webp",
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export function categoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || null;
}

export function categoryByKey(key) {
  return CATEGORIES.find((c) => c.key === key) || null;
}
