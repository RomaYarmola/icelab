"use client";

import { Modal, ModalContent } from "@nextui-org/react";
import { useState } from "react";
import FirstStep from "./FirstStep/FirstStep";
import useProductStore from "@/zustand/store/productStore";
import {
  PRICE_PER_UNIT,
  PRICE_PER_5,
  PRICE_PER_20,
  PRICE_PER_50,
} from "@/app/constants/constants";

export default function MultiStepModal({
  isOpen,
  resetModal,
  onOpenChange,
  variant,
  sizes,
}) {
  const [formData, setFormData] = useState({
    iceVariant: "",
    size: "",
    quantity: variant === "dryIce" ? 5 : 1,
    pricePerUnit: {
      dryIce: PRICE_PER_UNIT,
      iceBox: {
        5: PRICE_PER_5,
        20: PRICE_PER_20,
        50: PRICE_PER_50,
      },
    },
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

  const calculateTotalPrice = (quantity, size, variant) => {
    switch (variant) {
      case "dryIce":
        return (quantity * formData.pricePerUnit.dryIce).toFixed(0);
      case "iceBox": {
        const numericSize = parseInt(size, 10);
        if (!formData.pricePerUnit?.iceBox?.[numericSize]) {
          return "0";
        }
        const pricePerUnit = formData.pricePerUnit.iceBox[numericSize];
        return (quantity * pricePerUnit).toFixed(0);
      }
      default:
        return "0";
    }
  };

  const handleFormDataChange = (field, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [field]: value };

      if (field === "quantity" || field === "size") {
        const quantity = parseInt(updatedData.quantity, 10) || 0; // Приведення до числа
        const size = parseInt(updatedData.size, 10) || 0;

        updatedData.totalPrice = calculateTotalPrice(quantity, size, variant);
      }

      return updatedData;
    });
  };

  const handleClose = () => {
    resetModal();
    setFormData({
      iceVariant: "",
      size: "",
      quantity: variant === "dryIce" ? 5 : 1,
      pricePerUnit: {
        dryIce: PRICE_PER_UNIT,
        iceBox: {
          5: PRICE_PER_5,
          20: PRICE_PER_20,
          50: PRICE_PER_50,
        },
      },
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
