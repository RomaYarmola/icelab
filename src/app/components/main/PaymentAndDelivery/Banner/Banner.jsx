import Container from "@/utils/Container";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Banner() {
  const t = useTranslations("PaymentBanner");
  return (
    <div className="overflow-x-clip relative bannerPaymentBg ">
      {/* LCP-елемент сторінки: пріоритетне зображення замість CSS-фону,
          щоб його знаходив preload-сканер. Вихідник — webp. */}
      <Image
        src="/images/payment-and-delivery/banner.webp"
        alt=""
        fill
        priority
        quality={70}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute radial-white-gradient w-[1615px] md:w-[3130px] top-[332px] left-1/2 transform -translate-x-1/2" />
      <Container>
        <div className="pt-[202px] md:pt-[176px] relative z-[3]">
          <h1 className="text-3xl text-violet-gradient text-center mb-[10px]">
            {t("titleLine1")}
            <br /> {t("titleLine2")}
          </h1>
          <p className="text-lg-extended text-blue-gradient text-center">
            {t("subtitle")}
          </p>
        </div>
      </Container>
    </div>
  );
}
