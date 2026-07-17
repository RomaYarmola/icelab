import TextList from "@/app/components/common/TextList/TextList";
import { useTranslations } from "next-intl";

export default function SelfDelivery() {
  const t = useTranslations("SelfDelivery");
  return (
    <div className="overflow-x-clip relative">
      <div className="about-card py-7 px-4 xl:p-7 relative z-[4]">
        <h3 className="text-white font-medium text-[20px] mb-5 md:text-commonBlue">
          {t("titleLine1")} <br />
          {t("titleLine2")}
        </h3>
        <TextList
          data={t.raw("items")}
          variant="self-delivery"
          textSize="12px"
          textClassName="md:text-commonBlue"
          listClassName="xl:grid xl:grid-cols-2 xl:gap-x-10"
        />
      </div>
    </div>
  );
}
