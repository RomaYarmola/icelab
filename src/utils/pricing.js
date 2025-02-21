import { DRY_ICE_PRICING } from "@/app/constants/constants";

export const getDryIcePrice = (quantity) => {
  const pricing = DRY_ICE_PRICING.find(
    (range) => quantity >= range.min && quantity < range.max
  );
  return pricing ? pricing.price : 60;
};

export const calculateTotalPrice = (
  quantity,
  size,
  variant,
  pricePerUnit = {}
) => {
  switch (variant) {
    case "dryIce":
      return (quantity * getDryIcePrice(quantity)).toFixed(0);
    case "iceBox":
      if (!size) return "0"; // Переконуємося, що size має значення

      const numericSize = parseInt(size, 10);
      if (isNaN(numericSize)) return "0"; // Переконуємося, що numericSize коректний

      const price = pricePerUnit.iceBox?.[numericSize] || 0;
      return (quantity * price).toFixed(0);
    default:
      return "0";
  }
};
