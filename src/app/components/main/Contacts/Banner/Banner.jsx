import Container from "@/utils/Container";
import { useTranslations } from "next-intl";

export default function Banner() {
  const t = useTranslations("ContactsBanner");
  return (
    <div className="overflow-x-clip relative bannerContactsBg ">
      <div className="absolute radial-white-gradient w-[2447px] max-h-[375px] top-[418px] left-1/2 transform -translate-x-1/2 z-[1]" />
      <Container>
        <div className="pt-[204px] relative z-[3]">
          <h1 className="text-3xl text-white-title-gradient text-center mb-[10px]">
            {t("title")}
          </h1>
          <p className="text-lg-extended text-white-title-gradient text-center">
            {t("subtitle")}
          </p>
        </div>
      </Container>
    </div>
  );
}
