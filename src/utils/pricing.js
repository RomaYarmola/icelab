import { DRY_ICE_PRICING } from "@/app/constants/constants";

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
