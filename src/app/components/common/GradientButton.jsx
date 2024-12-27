"use client";
import { Button } from "@nextui-org/react";

export default function GradientButton({
  text,
  variant = "normal",
  onPress,
  isDisabled,
  type,
}) {
  return (
    <Button
      type={type}
      onPress={onPress}
      isDisabled={isDisabled}
      className={`purchase-btn w-full rounded-md bg-gradient-btn ${
        variant === "small" ? "h-[40px]" : "h-[54px]"
      } flex justify-center items-center shadow-btn`}
    >
      <p
        className={`text-white ${
          variant === "small"
            ? "text-[11px] font-semibold"
            : "text-base-extended"
        }  font-montserrat not-italic`}
      >
        {text}
      </p>
    </Button>
  );
}
