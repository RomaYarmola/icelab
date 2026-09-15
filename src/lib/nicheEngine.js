// Двигун нішевих посадкових «сухий лід для <задачі>».
//
// ЯК ЗАПУСТИТИ НОВУ НІШУ (≈30 хвилин, без розробника в шаблоні):
//  1. Додати об'єкт у lib/niches.js: slug, group, status, products (правила),
//     тексти uk/ru за схемою нижче.
//  2. status: "draft" — сторінка збирається й відкривається за прямим URL, але
//     noindex, не потрапляє в sitemap, хаб і перелінковку. Так контент можна
//     вичитати на проді до публікації.
//  3. status: "live" — сторінка автоматично з'являється в: sitemap.xml (uk+ru),
//     хабі /zastosuvannia-suhogo-lodu (картка у своїй групі), блоці «Для яких
//     задач беруть» на картках підходящих товарів, llms.txt і в «Схожих
//     задачах» інших ніш.
//
// ПРИКРІПЛЕННЯ ТОВАРІВ — ПРАВИЛАМИ, А НЕ SLUG-АМИ. Товари живуть у Sanity;
// якщо прикріпити конкретні slug, нова фасовка чи перейменування мовчки
// вибивають товар зі сторінки. Правило описує, ЯКИЙ товар підходить:
//   { category: "dry-ice", granule: "16", weights: [5, 10] }
//   { category: "ice-box" }                    — усі термобокси
//   { slug: "aparat-chystky-suhym-lodom-wc60-pro" } — точковий товар
// Порядок правил = порядок товарів на сторінці. Той самий матчер працює у
// зворотний бік: картка товару знаходить ніші, до яких вона підходить.

export const NICHE_HUB_PATH = "/zastosuvannia-suhogo-lodu";

export function nichePath(slug) {
  return `${NICHE_HUB_PATH}/${slug}`;
}

// Нормалізований розмір гранули з рядка Sanity («16 мм», «16mm», «16»).
function granuleOf(product) {
  const m = String(product.granuleSize || "").match(/\d+/);
  return m ? m[0] : null;
}

export function matchesRule(product, rule) {
  if (!product || !rule) return false;
  if (rule.slug) return product.slug === rule.slug;
  if (rule.category && product.category !== rule.category) return false;
  if (rule.granule && granuleOf(product) !== String(rule.granule)) return false;
  if (rule.weights?.length && !rule.weights.includes(Number(product.weight)))
    return false;
  return true;
}

// Товари для ніші: у порядку правил, без дублів, лише в наявності першими.
export function productsForNiche(niche, allProducts = [], limit = 9) {
  const seen = new Set();
  const out = [];
  for (const rule of niche.products || []) {
    const matched = allProducts
      .filter((p) => matchesRule(p, rule) && !seen.has(p.slug))
      .sort((a, b) => (Number(a.weight) || 0) - (Number(b.weight) || 0));
    for (const p of matched) {
      seen.add(p.slug);
      out.push(p);
    }
  }
  const inStock = out.filter((p) => p.availability !== "out-of-stock");
  const rest = out.filter((p) => p.availability === "out-of-stock");
  return [...inStock, ...rest].slice(0, limit);
}

// Зворотний бік: для картки товару — живі ніші, куди він підходить.
export function nichesForProduct(product, niches = []) {
  return niches.filter(
    (n) => n.status === "live" && (n.products || []).some((r) => matchesRule(product, r))
  );
}
