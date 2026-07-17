"use client";
import Container from "@/utils/Container";
import AboutGradient from "./AboutGradients";
import AboutClouds from "./AboutClouds";
import { useIsSafari } from "@/hooks/useIsSafari";
import TextList from "@/app/components/common/TextList/TextList";
import ImageCarousel from "@/app/components/common/ImageCarousel/ImageCarousel";
import { useTranslations } from "next-intl";

import Image from "next/image";

export default function About() {
  const isSafari = useIsSafari();
  const t = useTranslations("About");
  const materials = t.raw("materials");
  const production = t.raw("production");
  const decisions = t.raw("decisions");
  const expirience = t.raw("experience");
  return (
    <div
      className={`overflow-x-clip relative  ${
        isSafari ? "about-safari" : "aboutBg"
      }`}
    >
      {!isSafari && <AboutGradient />}

      <AboutClouds />
      <Container className="relative">
        <div className="hidden md:block absolute z-10 bottom-[-73px] right-[-201px] w-[483px] h-[482px]">
          <Image
            src="/images/about/about-decor.webp"
            alt=""
            aria-hidden="true"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-5 pt-[142px] l:pt-[194px] pb-[342px] md:pb-[69px] relative z-10 mx-auto max-w-[328px] md:max-w-none">
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="about-card px-4 py-7 md:py-4 xl:p-7 backdrop-blur-md xl:w-[478px]">
              <h2 className="text-secondary-white-gradient text-[24px] uppercase font-e-ukraine font-extralight not-italic">
                {t("subtitle")}
              </h2>
              <p className="text-white text-[48px] font-bold leading-normal mb-[57px]">
                ICELAB
              </p>
              <div className="flex items-center gap-5">
                <div className="w-[55px] h-[3px] bg-white" />
                <p className="text-white text-[16px] font-medium uppercase italic">
                  {t("tagline")}
                </p>
              </div>
            </div>

            <div className="relative w-full h-[264px] md:h-auto rounded-[14px] overflow-hidden xl:w-[211px]">
              <Image
                src="/images/about/about-one.webp"
                alt="Виробництво сухого льоду IceLab"
                fill
                className="object-cover"
              />
            </div>

            <div className="about-card px-4 py-7 md:py-4 xl:p-7 backdrop-blur-md xl:w-[393px]">
              <h3 className="text-white text-[18px] font-medium uppercase italic mb-6">
                {t("rawMaterialsTitle")}
              </h3>
              <TextList data={materials} />
            </div>
          </div>

          <div className="flex flex-col gap-5 md:flex-row">
            <div className="bg-[#1E73D7] px-4 py-7 md:py-4 xl:p-7 backdrop-blur-md rounded-[14px] md:w-[30%] xl:w-[373px]">
              <h3 className="xl:max-w-[180px] text-white text-[18px] font-medium uppercase italic mb-6">
                {t("productionTitle")}
              </h3>
              <TextList data={production} bulletVariant="white" />
            </div>

            <div className="relative w-full h-[250px] md:h-auto rounded-[14px] overflow-hidden md:order-3 md:w-[25%] xl:w-[254px]">
              <Image
                src="/images/about/about-two.webp"
                alt="Гранули сухого льоду IceLab"
                fill
                className="object-cover"
              />
            </div>

            <div className="about-card px-4 py-7 md:py-4 xl:p-7 backdrop-blur-md md:order-2 md:w-[45%] xl:w-[455px]">
              <h3 className="text-white text-[18px] font-medium uppercase italic mb-6">
                {t("decisionsTitle")}
              </h3>
              <TextList data={decisions} />
            </div>
          </div>

          <div className="flex flex-col gap-5 md:flex-row">
            <ImageCarousel
              variant="right"
              className="relative w-full h-[216px] rounded-[14px] overflow-hidden xl:w-[570px]"
              images={[
                {
                  src: "/images/about/carousel-one.webp",
                  alt: "Виробництво сухого льоду IceLab",
                },
                {
                  src: "/images/about/carousel-two.webp",
                  alt: "Обладнання для виробництва сухого льоду",
                },
                {
                  src: "/images/about/carousel-three.webp",
                  alt: "Термобокси для сухого льоду",
                },
                {
                  src: "/images/about/carousel-four.webp",
                  alt: "Склад сировини IceLab",
                },
              ]}
            />

            <div className="about-card px-4 py-7 md:py-4 xl:p-7 backdrop-blur-md xl:w-[530px]">
              <h3 className="text-white text-[18px] font-medium uppercase italic mb-6">
                {t("experienceTitle")}
              </h3>
              <TextList data={expirience} bulletVariant="white" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
