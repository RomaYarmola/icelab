// Налаштування цін — ЄДИНЕ джерело тарифів для калькулятора головної та каталогу.
// Джерело: Price Settings (singleton) у Sanity. Якщо CMS не налаштована/порожня —
// fallback на існуючі константи сайту (нічого не ламається).

import { sanityFetchFresh } from "@/sanity/client";
import { PRICE_SETTINGS_QUERY } from "@/sanity/queries";
import {
  DRY_ICE_PRICING,
  PRICE_PER_15,
  PRICE_PER_30,
  CATALOG_DRY_ICE_WEIGHTS,
} from "@/app/constants/constants";
import { data as homeProducts } from "@/app/components/main/Home/Products.jsx/data";

// Значення за замовчуванням з наявних констант сайту.
export function getFallbackPriceSettings() {
  const dryIce = homeProducts.find((p) => p.variant === "dryIce");
  return {
    dryIceTiers: DRY_ICE_PRICING,
    dryIceRange: { min: 5, max: 500, step: 5 },
    granuleSizes: dryIce?.sizes ?? ["19 мм", "16 мм", "3 мм"],
    catalogWeights: CATALOG_DRY_ICE_WEIGHTS,
    boxPrices: [
      { size: 15, price: PRICE_PER_15 },
      { size: 30, price: PRICE_PER_30 },
    ],
  };
}

// Асинхронно: Sanity → інакше fallback. Часткові документи доповнюються fallback.
export async function getPriceSettings() {
  const s = await sanityFetchFresh(PRICE_SETTINGS_QUERY, {}, null);
  const fb = getFallbackPriceSettings();
  if (!s) return fb;
  return {
    dryIceTiers: s.dryIceTiers?.length ? s.dryIceTiers : fb.dryIceTiers,
    dryIceRange: s.dryIceRange ?? fb.dryIceRange,
    granuleSizes: s.granuleSizes?.length ? s.granuleSizes : fb.granuleSizes,
    catalogWeights: s.catalogWeights?.length
      ? s.catalogWeights
      : fb.catalogWeights,
    boxPrices: s.boxPrices?.length ? s.boxPrices : fb.boxPrices,
  };
}

// Будує аргументи для calculateTotalPrice з налаштувань:
//   pricePerUnit.iceBox = { 15: 500, 30: 650 }, tiers = dryIceTiers.
// Ключі боксів нормалізуються до числа — щоб зіставлення ціни за розміром
// не залежало від того, як введено вагу (число чи рядок).
export function buildPricing(settings) {
  const iceBox = {};
  for (const b of settings.boxPrices || []) {
    const size = Number(b.size);
    if (!Number.isNaN(size)) iceBox[size] = Number(b.price);
  }
  return {
    pricePerUnit: { dryIce: settings.dryIceTiers, iceBox },
    tiers: settings.dryIceTiers,
  };
}
