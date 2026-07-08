import TextList from "@/app/components/common/TextList/TextList";
import Container from "@/utils/Container";
import { data } from "./data";

export default function SelfDelivery() {
  return (
    <div className="overflow-x-clip relative">
      <div className="about-card py-7 px-4 xl:p-7 relative z-[4]">
        <h3 className="text-white font-medium text-[20px] mb-5 md:text-commonBlue">
          САМОВИВІЗ З <br />
          ВИРОБНИЦТВА:
        </h3>
        <TextList
          data={data}
          variant="self-delivery"
          textSize="12px"
          textClassName="md:text-commonBlue"
          listClassName="xl:grid xl:grid-cols-2 xl:gap-x-10"
        />
      </div>
    </div>
  );
}
