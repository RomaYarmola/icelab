import { ModalBody } from "@nextui-org/react";
import FirstStepHeader from "./FirsStepHeader";

export default function IceBox({ nextStep }) {
  return (
    <>
      <FirstStepHeader />
      <ModalBody className="relative z-[1]">
        {/* <TextPart quantity={quantity} />
        <BtnsBlock
          sizes={sizes}
          selectedOption={selectedOption}
          handleFormDataChange={handleFormDataChange}
        />
        <div className="px-[14px] py-[22px] rounded-xl flex items-center justify-center flex-col md:flex-row gap-[14px] md:gap-[44px] modal-bg">
         
          {selectedOption && (
            <p className="main-title-gradient text-base font-medium">
              {totalPrice}&nbsp;грн
            </p>
          )}
          <div className="w-[240px] md:w-[128px]">
            <GradientButton
              variant="small"
              onPress={nextStep}
              isDisabled={!selectedOption}
              text="Замовити"
            />
          </div>
        </div> */}
      </ModalBody>
    </>
  );
}
