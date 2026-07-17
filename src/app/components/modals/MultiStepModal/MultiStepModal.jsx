"use client";

import { Modal, ModalContent } from "@nextui-org/react";
import { useState } from "react";
import FirstStep from "./FirstStep/FirstStep";
import useProductStore from "@/zustand/store/productStore";
import { calculateTotalPrice } from "@/utils/pricing";
import { usePriceSettings } from "@/app/components/providers/PriceSettingsProvider";
import { buildPricing } from "@/lib/priceSettings";

export default function MultiStepModal({
  isOpen,
  resetModal,
  onOpenChange,
  variant,
  sizes,
}) {
  // Тарифи/ціни з Price Settings (Sanity → fallback константи). Джерело одне.
  const settings = usePriceSettings();
  const pricing = buildPricing(settings);

  const [formData, setFormData] = useState({
    iceVariant: "",
    size: "",
    quantity: variant === "dryIce" ? 5 : 1,
    pricePerUnit: pricing.pricePerUnit,
    totalPrice: "0",
  });

  const addProductToCart = useProductStore((state) => state.addProductToCart);

  const mapVariantToEnglish = (ukrainianVariant) => {
    const variantMap = {
      "Сухий лід": "dryIce",
      "Бокс для льоду": "iceBox",
    };

    return variantMap[ukrainianVariant] || "unknown";
  };

  const handleFormDataChange = (field, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [field]: value };

      if (field === "quantity" || field === "size") {
        const quantity = parseInt(updatedData.quantity, 10) || 0; // Приведення до числа
        const size = parseInt(updatedData.size, 10) || 0;

        updatedData.totalPrice = calculateTotalPrice(
          quantity,
          size,
          variant,
          updatedData.pricePerUnit,
          pricing.tiers
        );
      }

      return updatedData;
    });
  };

  const handleClose = () => {
    resetModal();
    setFormData({
      iceVariant: "",
      size: "",
      quantity: variant === "dryIce" ? settings.dryIceRange?.min ?? 5 : 1,
      pricePerUnit: pricing.pricePerUnit,
      totalPrice: "0",
    });
  };

  const handleSubmit = () => {
    const product = {
      iceVariant: formData.iceVariant,
      iceVariantEnglish: mapVariantToEnglish(formData.iceVariant),
      size: formData.size,
      quantity: formData.quantity,
      pricePerUnit: formData.pricePerUnit,
      // Тарифи для перерахунку ціни в корзині (dryIce) — щоб джерело було одне.
      tiers: pricing.tiers,
      totalPrice: formData.totalPrice,
    };

    addProductToCart(product);
    handleClose();
  };

  return (
    <Modal
      placement="center"
      size="2xl"
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      onClose={handleClose}
      aria-labelledby="order-modal"
      className="mx-4 rounded-lg shadow-modal relative"
      classNames={{
        header: "p-0",
        body: "p-5 pb-[26px] md:px-10",
        backdrop: "rgba(0, 23, 49, 0.58)",
        base: "w-[583px]",
        closeButton: "hidden",
      }}
    >
      <ModalContent>
        <FirstStep
          variant={variant}
          sizes={sizes}
          selectedOption={formData.size}
          handleFormDataChange={handleFormDataChange}
          quantity={formData.quantity}
          totalPrice={formData.totalPrice}
          onSubmit={handleSubmit}
        />
      </ModalContent>
    </Modal>
  );
}
