import TextList from "@/app/components/common/TextList/TextList";
import { data } from "./data";
import DeliveryBg from "./DeliveryBg";

export default function UkraineDelivery() {
  return (
    <div className="overflow-x-clip relative bg-white">
      {/* <DeliveryBg /> */}

      <div className="relative z-[4] bg-[rgb(110_178_255_/_0.19)] py-7 px-4 xl:p-7 rounded-[14px] overflow-hidden">
        <h3 className="text-commonBlue font-medium text-[20px] mb-5">
          ДОСТАВКА ПО УКРАЇНІ:
        </h3>
        <TextList
          data={data}
          variant="delivery"
          textSize="12px"
          listClassName="xl:grid xl:grid-cols-2 xl:gap-x-10"
        />
      </div>
    </div>
  );
}
