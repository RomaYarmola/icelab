import Container from "@/utils/Container";
import Image from "next/image";
import SelfDelivery from "../SelfDelivery/Self.delivery";
import UkraineDelivery from "../UkraineDelivery/UkraineDelivery";
import { useTranslations } from "next-intl";

export default function DeliveryOptions() {
  const t = useTranslations("DeliveryOptions");
  return (
    <div className="relative overflow-x-clip">
      <>
        <div className="md:hidden bg-commonBlue -z-10 w-[1981px] 2xl:w-[2900px] h-[968px] md:h-[996px] absolute top-[955px] md:top-[582px] left-1/2 transform -translate-x-1/2  " />
        <div className="md:hidden -z-10 radial-dark-gradient w-[1981px] 2xl:w-[2900px] h-[817px] absolute top-[896px] sm:top-[766px] md:top-[395px] left-1/2 transform -translate-x-1/2  z-[1]" />
      </>

      <Container>
        <div className="flex flex-col md:flex-row gap-5 pb-[315px] md:pb-[491px]">
          <div className="relative shrink-0 overflow-hidden h-[428px] md:h-auto md:w-[300px] l:w-[400px] xl:w-[466px] rounded-[14px] overflow-hidden p-7">
            <p className="relative z-10 max-w-[221px] text-white text-[24px] font-bold">
              {t("chooseOption")}
            </p>
            <Image
              src="/images/pages/delivery.webp"
              alt="Доставка сухого льоду IceLab"
              fill
              className="object-cover object-center brightness-[0.85]"
            />
          </div>
          <div className="flex flex-col gap-5">
            <UkraineDelivery />
            <SelfDelivery />

            {/* Як ми пакуємо — реальне фото відвантаження (упаковка + стретч ICELAB) */}
            <div className="relative z-[4] rounded-[14px] overflow-hidden border border-commonBlue/15 bg-white">
              <div className="relative w-full h-[220px] md:h-[260px]">
                <Image
                  src="/images/pages/packaging.webp"
                  alt={t("packagingTitle")}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-5">
                <h3 className="text-commonBlue font-medium text-[20px] mb-2">
                  {t("packagingTitle")}
                </h3>
                <p className="font-e-ukraine not-italic font-thin text-commonBlue/75 text-[13px] leading-relaxed">
                  {t("packagingText")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
