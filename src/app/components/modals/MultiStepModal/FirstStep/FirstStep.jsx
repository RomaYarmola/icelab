import { ModalBody } from "@nextui-org/react";
import RangeInput from "../../../common/RangeInput";
import GradientButton from "@/app/components/common/GradientButton";
import FirstStepHeader from "./FirsStepHeader";
import TextPart from "./TextPart";
import BtnsBlock from "./BtnsBlock";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePriceSettings } from "@/app/components/providers/PriceSettingsProvider";
import { formatPrice } from "@/utils/pricing";

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
    if (selectedOption || !sizes?.length) return;
    if (variant === "iceBox") {
      handleFormDataChange("size", sizes[1]);
      handleFormDataChange("iceVariant", "Бокс для льоду");
    } else if (variant === "dryIce") {
      // Дефолт 16 мм (найпопулярніший розмір) — щоб на головній користувач одразу
      // бачив вибір, ціну й активний повзунок, а не шукав, що треба клікнути.
      // Шукаємо саме «16» за значенням (порядок розмірів може прийти з Sanity).
      const preferred =
        sizes.find((s) => /(^|\D)16(\D|$)/.test(String(s))) ??
        sizes[Math.floor(sizes.length / 2)];
      handleFormDataChange("size", preferred);
      handleFormDataChange("iceVariant", "Сухий лід");
    }
  }, [variant, selectedOption, sizes, handleFormDataChange]);

  // Раніше кнопка була одна («Замовити»), і вона мовчки клала товар у кошик та
  // закривала модалку — користувач не розумів, що сталося. Тепер дії розведені:
  // «У кошик» додає й показує підтвердження, «Замовити» додає й одразу веде на
  // оформлення.
  const [added, setAdded] = useState(false);

  const track = (label) => {
    if (typeof window === "undefined" || !window.dataLayer) return;
    window.dataLayer.push({
      event: "order_button_click",
      eventCategory: "engagement",
      eventAction: "click",
      eventLabel: label,
      variant,
      quantity,
      totalPrice,
      selectedOption,
    });
  };

  const handleAddToCart = () => {
    if (added) return;
    track("У кошик");
    // Коротка пауза з написом «Додано ✓» — щоб дія була видимою, а вже потім
    // модалка закривається і в шапці оновлюється лічильник.
    setAdded(true);
    setTimeout(() => {
      onSubmit();
      setAdded(false);
    }, 900);
  };

  const handleCheckout = () => {
    track("Замовити");
    onSubmit({ goToCheckout: true });
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
        <div className="px-[14px] py-[22px] rounded-xl flex flex-col gap-4 modal-bg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-[14px] md:gap-6">
            <div className="w-full md:w-[238px]">
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
              <p className="main-title-gradient text-base font-medium whitespace-nowrap">
                {formatPrice(totalPrice)}&nbsp;грн
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:flex-1">
              <GradientButton
                variant="smallOutline"
                onPress={handleAddToCart}
                isDisabled={!selectedOption}
                text={added ? t("added") : t("addToCart")}
              />
            </div>
            <div className="w-full sm:flex-1">
              <GradientButton
                variant="small"
                onPress={handleCheckout}
                isDisabled={!selectedOption}
                text={t("order")}
              />
            </div>
          </div>
        </div>
      </ModalBody>
    </>
  );
}
