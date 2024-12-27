import MultiStepModal from "@/app/components/modals/MultiStepModal/MultiStepModal";
import { Button, useDisclosure } from "@nextui-org/react";
import { useState } from "react";

export default function OrderBtn({ variant, sizes }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const resetModal = () => {
    setCurrentStep(1);
    onOpenChange(false);
  };
  return (
    <>
      <Button
        onPress={onOpen}
        className="w-full md:w-[197px] h-10 flex justify-center items-center border-gradient-rounded bg-transparent"
      >
        <p className="text-xs text-thin-gradient font-montserrat not-italic">
          Замовити
        </p>
      </Button>
      <MultiStepModal
        isOpen={isOpen}
        resetModal={resetModal}
        currentStep={currentStep}
        nextStep={nextStep}
        onOpenChange={onOpenChange}
        variant={variant}
        sizes={sizes}
      />
    </>
  );
}
