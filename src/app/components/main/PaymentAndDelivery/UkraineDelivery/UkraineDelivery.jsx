import TextList from "@/app/components/common/TextList/TextList";
import DeliveryBg from "./DeliveryBg";
import { useTranslations } from "next-intl";

export default function UkraineDelivery() {
  const t = useTranslations("UkraineDelivery");
  return (
    <div className="overflow-x-clip relative bg-white">
      {/* <DeliveryBg /> */}

      <div className="relative z-[4] bg-[rgb(110_178_255_/_0.19)] py-7 px-4 xl:p-7 rounded-[14px] overflow-hidden">
        <h3 className="text-commonBlue font-medium text-[20px] mb-5">
          {t("title")}
        </h3>
        <TextList
          data={t.raw("items")}
          variant="delivery"
          textSize="12px"
          listClassName="xl:grid xl:grid-cols-2 xl:gap-x-10"
        />
      </div>
    </div>
  );
}
