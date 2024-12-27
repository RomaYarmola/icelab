import TextList from "@/app/components/common/TextList/TextList";
import Container from "@/utils/Container";
import { data } from "./data";

export default function SelfDelivery() {
  return (
    <div className="overflow-x-clip relative">
      <div className="radial-dark-gradient w-[1981px] 2xl:w-[2900px] h-[717px] absolute top-[566px] md:top-[395px] left-1/2 transform -translate-x-1/2  z-[1]" />
      <div className="bg-commonBlue w-[1981px] 2xl:w-[2900px] h-[968px] md:h-[796px] absolute top-[-325px] md:top-[-82px] left-1/2 transform -translate-x-1/2  " />
      <Container>
        <div className=" pb-[389px] md:pb-[332px] max-w-[632px] mx-auto relative z-[4]">
          <h3 className="text-dark-gradient font-medium text-center text-xl-heading mb-[56px]">
            САМОВИВІЗ З <br />
            ВИРОБНИЦТВА&nbsp;:
          </h3>
          <TextList data={data} variant="self-delivery" />
        </div>
      </Container>
    </div>
  );
}
