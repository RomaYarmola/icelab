import Container from "@/utils/Container";
import Image from "next/image";
import GradientButton from "../../../common/GradientButton";
import HeroClouds from "./HeroClouds";
import Link from "next/link";
import { Link as LocaleLink } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Hero");
  return (
    <div className="overflow-x-clip relative h-[864px] ">
      {/* LCP-фон: пріоритетне оптимізоване зображення (preload), а не CSS-фон */}
      <Image
        src="/images/hero/main-bg.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-right"
      />
      {/* Градієнтне перекриття над фото */}
      <div className="absolute inset-0 heroBg" />
      <div className="absolute inset-0">
        <HeroClouds />
      </div>
      <Container>
        <div className="pt-[218px] md:pt-[200px] z-[9999]">
          <h1 className="text-3xl md:text-4xl main-title-gradient text-center mb-[53px] md:mb-[22px] relative z-[1] md:z-[3] px-2 break-words">
            {t("title")}
          </h1>
          <p className="text-lg-extended text-blue-gradient text-center mb-8 md:mb-12 max-w-[98%] sm:max-w-[66%] mx-auto relative z-10">
            {t("subtitle")}
          </p>
          <p className="font-e-ukraine font-thin not-italic text-sm-responsive text-center mb-8 md:mb-12 max-w-[86%] sm:max-w-[41.7%] mx-auto relative z-10">
            {t("description")}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-[73px] md:mb-[52px] relative z-10">
            <Link href="#products" className="flex w-[279px] max-w-full">
              <GradientButton text={t("quickOrder")} />
            </Link>
            <LocaleLink href="/catalog" className="flex w-[279px] max-w-full">
              <GradientButton variant="outline" text={t("catalog")} />
            </LocaleLink>
          </div>
        </div>
      </Container>
    </div>
  );
}
