// GROQ-запити. Локалізацію (uk/ru) виконує фронтенд у lib/*.
// Slug — ЄДИНИЙ для обох мов (генерується з української назви).

const PRODUCT_FIELDS = `
  _id,
  title,
  shortDescription,
  description,
  "slug": slug.current,
  "category": category->key,
  granuleSize,
  weight,
  availability,
  order,
  badge,
  useAutoPrice,
  manualPrice,
  mainImage,
  gallery,
  seo
`;

export const PRODUCTS_QUERY = `*[_type == "product"] | order(order asc){${PRODUCT_FIELDS}}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0]{${PRODUCT_FIELDS}}`;

// Slug кожного товару — для generateStaticParams та sitemap.
export const PRODUCT_SLUGS_QUERY = `*[_type == "product" && defined(slug.current)].slug.current`;

export const PRICE_SETTINGS_QUERY = `*[_type == "priceSettings"][0]{
  dryIceTiers[]{min, max, price},
  dryIceRange,
  granuleSizes,
  catalogWeights,
  boxPrices[]{size, price}
}`;

// Body з розкриттям внутрішніх посилань (тип + slug цілі).
const BODY_PROJECTION = `{
  ...,
  markDefs[]{
    ...,
    _type == "internalLink" => {
      "refType": @.reference->_type,
      "refSlug": @.reference->slug.current
    }
  }
}`;

const BLOG_LIST_FIELDS = `
  _id,
  title,
  excerpt,
  "slug": slug.current,
  coverImage,
  publishedAt,
  _updatedAt,
  seo
`;

export const BLOG_POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc){${BLOG_LIST_FIELDS}}`;

export const BLOG_POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0]{
  ${BLOG_LIST_FIELDS},
  "bodyUk": bodyUk[]${BODY_PROJECTION},
  "bodyRu": bodyRu[]${BODY_PROJECTION}
}`;

export const BLOG_SLUGS_QUERY = `*[_type == "blogPost" && defined(slug.current)].slug.current`;
