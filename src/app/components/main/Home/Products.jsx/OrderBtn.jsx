import MultiStepModal from "@/app/components/modals/MultiStepModal/MultiStepModal";
import { Button, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function OrderBtn({ variant, sizes }) {
  const t = useTranslations("Products");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const resetModal = () => {
    setCurrentStep(1);
    onClose();
  };

  // `onOpenChange` з useDisclosure — це ПЕРЕМИКАЧ, який ігнорує аргумент.
  // Якщо віддати його модалці напряму, вона при закритті повідомляє
  // onOpenChange(false), перемикач бачить isOpen === false і відкриває вікно
  // назад. Тому передаємо власний обробник у стилі сеттера.
  const handleOpenChange = (open) => {
    if (!open) resetModal();
  };
  return (
    <>
      <Button
        onPress={onOpen}
        className="w-full md:w-[197px] h-10 flex justify-center items-center border-gradient-rounded bg-transparent"
      >
        <p className="text-xs text-thin-gradient font-e-ukraine font-normal not-italic">
          {t("order")}
        </p>
      </Button>
      <MultiStepModal
        isOpen={isOpen}
        resetModal={resetModal}
        currentStep={currentStep}
        nextStep={nextStep}
        onOpenChange={handleOpenChange}
        variant={variant}
        sizes={sizes}
      />
    </>
  );
}
