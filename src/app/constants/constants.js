export const DRY_ICE_PRICING = [
  { min: 5, max: 30, price: 75 },
  { min: 31, max: 100, price: 60 },
  { min: 101, max: 300, price: 60 },
  { min: 301, max: 500, price: 55 },
];

// Дискретні ваги сухого льоду для каталогу (штучні фасування).
// Ціна кожного НЕ зберігається окремо, а рахується існуючою функцією
// calculateTotalPrice за цією ж тарифною сіткою DRY_ICE_PRICING.
export const CATALOG_DRY_ICE_WEIGHTS = [5, 10, 20, 50];

// export const PRICE_PER_5 = 250;

export const PRICE_PER_15 = 500;

export const PRICE_PER_30 = 650;

// export const PRICE_PER_50 = 350;
