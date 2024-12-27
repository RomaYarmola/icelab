import TextList from "@/app/components/common/TextList/TextList";
import Container from "@/utils/Container";
import { data } from "./data";
import DeliveryBg from "./DeliveryBg";

export default function UkraineDelivery() {
  return (
    <div className="overflow-x-clip relative bg-white">
      <DeliveryBg />
      <Container>
        <div className="pt-[148px] pb-[292px] md:pb-[230px] max-w-[632px] mx-auto relative z-[4]">
          <h3 className="main-title-gradient font-medium text-center text-xl-heading mb-10 l:mb-[57px]">
            ДОСТАВКА ПО УКРАЇНІ&nbsp;:
          </h3>
          <TextList data={data} variant="delivery" />
        </div>
      </Container>
    </div>
  );
}
