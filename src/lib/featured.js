// Підбір «популярних» і «схожих» товарів для головної, гео-лендингів і
// карток. Чисті функції над нормалізованими товарами з lib/products.
//
// Логіка свідомо проста й детермінована (без «переглядів» чи рандому):
//  • для сухого льоду — спершу універсальна гранула 16 мм у ходових вагах
//    (5 → 10 → 20 → 50 кг), потім решта гранул за вагою;
//  • «схожі» — найближчі за вагою в тій самій категорії; та сама гранула
//    має пріоритет при рівній відстані.

const WEIGHT_ORDER = [5, 10, 20, 50, 30, 15, 100];

function weightRank(w) {
  const i = WEIGHT_ORDER.indexOf(Number(w));
  return i === -1 ? 100 + Number(w || 0) : i;
}

function isGranule(p, mm) {
  return String(p.granuleSize || "").replace(/\s/g, "").startsWith(`${mm}мм`);
}

// n популярних фасувань сухого льоду: 16 мм у ходових вагах, далі 19 і 3 мм.
export function featuredDryIce(products = [], n = 6) {
  const inStock = products.filter((p) => p.availability !== "out-of-stock");
  const byRank = (a, b) => weightRank(a.weight) - weightRank(b.weight);
  const g16 = inStock.filter((p) => isGranule(p, 16)).sort(byRank);
  const rest = inStock.filter((p) => !isGranule(p, 16)).sort(byRank);
  return [...g16, ...rest].slice(0, n);
}

// Найближчі за вагою товари тієї ж категорії (без поточного).
export function closestByWeight(products = [], current, n = 3) {
  if (!current) return products.slice(0, n);
  return products
    .filter((p) => p.slug !== current.slug)
    .sort((a, b) => {
      const da = Math.abs((a.weight || 0) - (current.weight || 0));
      const db = Math.abs((b.weight || 0) - (current.weight || 0));
      if (da !== db) return da - db;
      // При рівній відстані — та сама гранула першою.
      const ga = a.granuleSize === current.granuleSize ? 0 : 1;
      const gb = b.granuleSize === current.granuleSize ? 0 : 1;
      return ga - gb;
    })
    .slice(0, n);
}

// Перший товар кожної з категорій у заданому порядку (для «популярних» на
// головній: по одному боксу, набору, апарату поруч із трьома фасуваннями льоду).
export function firstOfCategories(products = [], keys = []) {
  return keys
    .map((key) =>
      products.find(
        (p) => p.category === key && p.availability !== "out-of-stock"
      )
    )
    .filter(Boolean);
}

// Об'єднує суміжні тарифи з однаковою ціною: [31–100: 60, 101–300: 60] →
// [31–300: 60]. Для таблиць цін, щоб не показувати два рядки з одним числом.
export function mergeTiers(tiers = []) {
  const sorted = [...tiers]
    .filter((t) => t && Number.isFinite(Number(t.price)))
    .sort((a, b) => a.min - b.min);
  const out = [];
  for (const t of sorted) {
    const last = out[out.length - 1];
    if (last && Number(last.price) === Number(t.price) && last.max + 1 >= t.min) {
      last.max = Math.max(last.max, t.max);
    } else {
      out.push({ min: t.min, max: t.max, price: Number(t.price) });
    }
  }
  return out;
}
