import { DRY_ICE_PRICING } from "@/app/constants/constants";

// Форматує ціну з розділювачем тисяч (напр. 679091 → "679 091"). Значення в
// сторі лишається числом — форматуємо лише для показу.
//
// Розділювач — НЕРОЗРИВНИЙ пробіл (U+00A0). Раніше тут стояв звичайний, і в
// вузьких блоках сума рвалася на два рядки: «6» на одному, «300 грн» на
// наступному. Різні локалі віддають то вузький, то нерозривний пробіл —
// зводимо будь-який до одного.
export const formatPrice = (value) =>
  Number(value || 0)
    .toLocaleString("uk-UA")
    .replace(/[\s\u00A0\u202F]/g, "\u00A0");

// Тарифи можна передати ззовні (з Price Settings у Sanity). Якщо не передані —
// використовуються існуючі константи сайту. Логіка розрахунку одна.
export const getDryIcePrice = (quantity, tiers = DRY_ICE_PRICING) => {
  const list = Array.isArray(tiers) && tiers.length ? tiers : DRY_ICE_PRICING;
  const pricing = list.find(
    (range) => quantity >= range.min && quantity <= range.max
  );

  return pricing ? pricing.price : 60;
};

export const calculateTotalPrice = (
  quantity,
  size,
  variant,
  pricePerUnit = {},
  tiers = DRY_ICE_PRICING
) => {
  switch (variant) {
    case "dryIce":
      return (quantity * getDryIcePrice(quantity, tiers)).toFixed(0);
    case "iceBox":
      if (!size) return "0";

      const numericSize = parseInt(size, 10);
      if (isNaN(numericSize)) return "0";

      const price = pricePerUnit.iceBox?.[numericSize] || 0;
      return (quantity * price).toFixed(0);
    default:
      return "0";
  }
};
