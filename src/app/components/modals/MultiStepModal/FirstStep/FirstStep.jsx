import { ModalBody } from "@nextui-org/react";
import RangeInput from "../../../common/RangeInput";
import GradientButton from "@/app/components/common/GradientButton";
import FirstStepHeader from "./FirsStepHeader";
import TextPart from "./TextPart";
import BtnsBlock from "./BtnsBlock";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePriceSettings } from "@/app/components/providers/PriceSettingsProvider";

export default function FirstStep({
  onSubmit,
  sizes,
  quantity,
  totalPrice,
  selectedOption,
  handleFormDataChange,
  variant,
}) {
  const t = useTranslations("Modal");
  const settings = usePriceSettings();
  // Діапазон повзунка ваги сухого льоду — з Price Settings (fallback константи).
  const dryRange = variant === "dryIce" ? settings.dryIceRange : undefined;
  useEffect(() => {
    if (variant === "iceBox" && !selectedOption) {
      handleFormDataChange("size", sizes[1]);
      handleFormDataChange("iceVariant", "Бокс для льоду");
    }
  }, [variant, selectedOption, sizes, handleFormDataChange]);

  const handleOrderClick = () => {
    // Відправка події в Google Tag Manager
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "order_button_click",
        eventCategory: "engagement",
        eventAction: "click",
        eventLabel: "Замовити",
        variant: variant,
        quantity: quantity,
        totalPrice: totalPrice,
        selectedOption: selectedOption,
      });
    }
    // Виклик оригінальної функції onSubmit
    onSubmit();
  };
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
              minValue={dryRange?.min}
              maxValue={dryRange?.max}
              step={dryRange?.step}
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
              onPress={handleOrderClick}
              isDisabled={!selectedOption}
              text={t("order")}
            />
          </div>
        </div>
      </ModalBody>
    </>
  );
}
