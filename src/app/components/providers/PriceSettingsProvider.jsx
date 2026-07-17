"use client";
import { createContext, useContext } from "react";
import { getFallbackPriceSettings } from "@/lib/priceSettings";

// Контекст налаштувань цін для клієнтських компонентів (калькулятор головної).
// Значення приходить із сервера (layout), дефолт — константи сайту (fallback),
// тож калькулятор працює навіть без Sanity.
const PriceSettingsContext = createContext(getFallbackPriceSettings());

export function PriceSettingsProvider({ value, children }) {
  return (
    <PriceSettingsContext.Provider value={value || getFallbackPriceSettings()}>
      {children}
    </PriceSettingsContext.Provider>
  );
}

export function usePriceSettings() {
  return useContext(PriceSettingsContext);
}
