import Image from "next/image";
import RangeInput from "./RangeInput";
import { Button } from "@nextui-org/react";

export default function BasketCard({
  iceVariantEnglish,
  iceVariant,
  size,
  quantity,
  updateQuantity,
  totalPrice,
  deleteItem,
  basket,
}) {
  const prodImg = (variantEnglish) => {
    switch (variantEnglish) {
      case "dryIce":
        return "/images/products/dry-ice.png";
      case "iceBox":
        return "/images/products/ice-box.png";
      default:
        return "/images/products/dry-ice.png";
    }
  };

  return (
    <li
      className={`flex justify-between pt-5  ${
        basket
          ? "items-center l:pt-[35px] pb-5 last:pb-0 l:pb-[35px] l:last:pb-0 border-b-[0.5px] border-commonBlue last:border-b-0"
          : "pb-[27px] last:border-b border-common-blue items-start"
      }`}
    >
      <div className={`flex ${basket ? "gap-4 md:gap-8" : "gap-[14px]"} `}>
        <div
          className={`${
            basket
              ? "hidden sm:block w-[80px] h-[80px] md:w-[134px] md:h-[134px]"
              : "w-[104px] h-[104px]"
          }   overflow-hidden border border-commonBlue rounded-[10px] p-4`}
        >
          <Image
            src={prodImg(iceVariantEnglish)}
            alt={iceVariant}
            width={134}
            height={134}
            className="w-full h-auto"
          />
        </div>
        <div className={`${basket ? "max-w-[277px]" : "max-w-[147px]"} `}>
          <p className={`text-[16px] ${basket && "md:text-[24px]"}  font-bold`}>
            {iceVariant}
          </p>

          <p className="font-montserrat not-italic text-[16px]">{size}</p>

          <div className={`${!basket && "flex gap-[27px] items-end"}`}>
            <div
              className={`mt-4 md:mt-7 ${
                basket ? "w-[120px] sm:w-[156px]" : "min-w-[98px]"
              } `}
            >
              <RangeInput
                variant={iceVariantEnglish}
                value={quantity}
                handleFormDataChange={(_, quantity) => updateQuantity(quantity)}
              />
            </div>
            {!basket && (
              <p className="text-[12px] l:text-[16px] font-medium">
                {totalPrice}&nbsp;ГРН
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-5 md:gap-9 items-center ">
        {basket && (
          <p className="text-[12px] sm:text-[16px] md:text-[24px] font-medium">
            {totalPrice}&nbsp;ГРН
          </p>
        )}

        <Button
          isIconOnly
          onPress={deleteItem}
          className="bg-transparent w-10 h-10 sm:w-[60px] sm:h-[60px]"
        >
          <Image
            src="/icons/close.svg"
            alt="close icon"
            width={60}
            height={60}
            className="w-full h-auto"
          />
        </Button>
      </div>
    </li>
  );
}
