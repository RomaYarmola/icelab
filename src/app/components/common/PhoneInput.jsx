"use client";
import { Input } from "@nextui-org/react";
import { IMask } from "react-imask";

// Українська маска телефону: +38 (0XX) XXX XX XX.
// Літери не вводяться (маска приймає лише цифри), дужки та пробіли підставляються
// автоматично. Значення зберігається у маскованому вигляді — воно сумісне з наявною
// регуляркою валідації (validateField("phone", ...)).
const MASK = { mask: "+{38} (000) 000 00 00", lazy: true };

// Обгортка над NextUI Input. NextUI (react-aria) лишається єдиним джерелом істини
// (контрольований value/onChange), а IMask використовується як чиста функція
// форматування (IMask.pipe) — це уникає конфлікту за DOM-значення інпута.
export default function PhoneInput({ value = "", onValueChange, ...props }) {
  const handleChange = (e) => {
    onValueChange?.(IMask.pipe(e.target.value, MASK));
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      inputMode="tel"
      {...props}
    />
  );
}
