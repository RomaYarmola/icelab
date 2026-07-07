import NoCompromises from "../components/common/NoCompromises/NoCompromises";
import Banner from "../components/main/PaymentAndDelivery/Banner/Banner";
import SelfDelivery from "../components/main/PaymentAndDelivery/SelfDelivery/Self.delivery";
import UkraineDelivery from "../components/main/PaymentAndDelivery/UkraineDelivery/UkraineDelivery";
import Image from "next/image";
import Container from "@/utils/Container";

export default function PaymentAndDelivery() {
  return (
    <>
      <Banner />
      <div className="relative overflow-x-clip">
        {/* <div className="bg-commonBlue -z-10 w-[1981px] 2xl:w-[2900px] h-[968px] md:h-[996px] absolute top-[955px] md:top-[582px] left-1/2 transform -translate-x-1/2  " />
        <div className="-z-10 radial-dark-gradient w-[1981px] 2xl:w-[2900px] h-[717px] absolute top-[896px] md:top-[395px] left-1/2 transform -translate-x-1/2  z-[1]" /> */}
        <Container>
          <div className="flex flex-col md:flex-row gap-5 pb-[315px] md:pb-[491px]">
            <div className="relative shrink-0 overflow-hidden h-[428px] md:h-auto md:w-[300px] l:w-[400px] xl:w-[] rounded-[14px] overflow-hidden p-7">
              <p className="relative z-10 max-w-[221px] text-white text-[24px] font-bold">
                Обирай зручний для себе варіант
              </p>
              <Image
                src="/images/payment-and-delivery/delivery-image.webp"
                alt="delivery-image"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-5">
              {" "}
              <UkraineDelivery />
              <SelfDelivery />
            </div>
          </div>
        </Container>
      </div>
      <NoCompromises variant="delivery" />
    </>
  );
}
