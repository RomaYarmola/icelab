"use client";
import { Button } from "@nextui-org/react";

export default function GradientButton({
  text,
  variant = "normal",
  onPress,
  isDisabled,
  type,
}) {
  // Розмір і стиль — незалежні осі: "smallOutline" = невисока кнопка з обведенням
  // (вторинна дія поруч із основною, напр. «У кошик» біля «Замовити»).
  const isSmall = variant === "small" || variant === "smallOutline";
  const isOutline = variant === "outline" || variant === "smallOutline";

  return (
    <Button
      type={type}
      onPress={onPress}
      isDisabled={isDisabled}
      className={`w-full rounded-md flex justify-center items-center ${
        isSmall ? "h-[40px]" : "h-[54px]"
      } ${
        isOutline
          ? "!bg-transparent !border-[1.5px] !border-solid !border-commonBlue !shadow-none data-[hover=true]:!bg-commonBlue/[0.06]"
          : "purchase-btn bg-gradient-btn shadow-btn"
      }`}
    >
      <p
        className={`font-e-ukraine not-italic ${
          isSmall ? "text-[11px]" : "text-base"
        } ${isOutline ? "text-commonBlue font-medium" : "text-white font-normal"}`}
      >
        {text}
      </p>
    </Button>
  );
}
