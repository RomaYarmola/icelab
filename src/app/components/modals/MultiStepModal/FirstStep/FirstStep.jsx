import { ModalBody } from "@nextui-org/react";
import RangeInput from "../../../common/RangeInput";
import GradientButton from "@/app/components/common/GradientButton";
import FirstStepHeader from "./FirsStepHeader";
import TextPart from "./TextPart";
import BtnsBlock from "./BtnsBlock";

export default function FirstStep({
  onSubmit,
  sizes,
  quantity,
  totalPrice,
  selectedOption,
  handleFormDataChange,
  variant,
}) {
  return (
    <>
      <FirstStepHeader variant={variant} />
      <ModalBody className="relative z-[1]">
        <TextPart quantity={quantity} variant={variant} />
        <BtnsBlock
          variant={variant}
          sizes={sizes}
          selectedOption={selectedOption}
          handleFormDataChange={handleFormDataChange}
        />
        <div className="px-[14px] py-[22px] rounded-xl flex items-center justify-center flex-col md:flex-row md:justify-between gap-[14px] md:gap-[44px] modal-bg">
          <div className="w-[238px]">
            <RangeInput
              value={quantity}
              handleFormDataChange={handleFormDataChange}
              isDisabled={!selectedOption}
              variant={variant}
            />
          </div>

          {selectedOption && (
            <p className="main-title-gradient text-base font-medium">
              {totalPrice}&nbsp;грн
            </p>
          )}
          <div className="w-[240px] md:w-[128px]">
            <GradientButton
              variant="small"
              onPress={onSubmit}
              isDisabled={!selectedOption}
              text="Замовити"
            />
          </div>
        </div>
      </ModalBody>
    </>
  );
}
