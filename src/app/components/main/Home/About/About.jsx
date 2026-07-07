"use client";
import Container from "@/utils/Container";
import AboutGradient from "./AboutGradients";
import AboutClouds from "./AboutClouds";
import { useIsSafari } from "@/hooks/useIsSafari";
import TextList from "@/app/components/common/TextList/TextList";
import { materials, production, decisions, expirience } from "./data";

import Image from "next/image";

export default function About() {
  const isSafari = useIsSafari();
  return (
    <div
      className={`overflow-x-clip relative  ${
        isSafari ? "about-safari" : "aboutBg"
      }`}
    >
      {!isSafari && <AboutGradient />}

      <AboutClouds />
      <Container>
        <div className="flex flex-col gap-5 pt-[142px] l:pt-[194px] pb-[342px] md:pb-[69px] relative z-10 mx-auto max-w-[328px] md:max-w-none">
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="about-card px-4 py-7 backdrop-blur-md xl:w-[478px]">
              <h3 className="text-secondary-white-gradient text-[24px] uppercase font-e-ukraine font-extralight not-italic">
                Про нас
              </h3>
              <h2 className="text-white text-[48px] font-bold leading-normal mb-[57px]">
                ICELAB
              </h2>
              <div className="flex items-center gap-5">
                <div className="w-[55px] h-[3px] bg-white" />
                <h4 className="text-white text-[16px] font-medium uppercase italic">
                  Ваш надійний постачальник сухого льоду
                </h4>
              </div>
            </div>

            <div className="relative w-full h-[264px] md:h-auto rounded-[14px] overflow-hidden xl:w-[211px]">
              <Image
                src="/images/about/about-one.webp"
                alt="about-one"
                fill
                className="object-cover"
              />
            </div>

            <div className="about-card px-4 py-7 backdrop-blur-md xl:w-[393px]">
              <h5 className="text-white text-[18px] font-medium uppercase italic mb-6">
                Сировина і потужності:
              </h5>
              <TextList data={materials} />
            </div>
          </div>

          <div className="flex flex-col gap-5 md:flex-row">
            <div className="bg-[#1E73D7] px-4 py-7 backdrop-blur-md rounded-[14px] md:w-[30%] xl:w-[373px]">
              <h5 className="text-white text-[18px] font-medium uppercase italic mb-6">
                Сучасне виробництво:
              </h5>
              <TextList data={production} variant="white" />
            </div>

            <div className="relative w-full h-[250px] md:h-auto rounded-[14px] overflow-hidden md:order-3 md:w-[25%] xl:w-[254px]">
              <Image
                src="/images/about/about-two.webp"
                alt="about-two"
                fill
                className="object-cover"
              />
            </div>

            <div className="about-card px-4 py-7 backdrop-blur-md md:order-2 md:w-[45%] xl:w-[455px]">
              <h5 className="text-white text-[18px] font-medium uppercase italic mb-6">
                Гнучкі рішення для клієнтів:
              </h5>
              <TextList data={decisions} />
            </div>
          </div>

          <div className="flex flex-col gap-5 md:flex-row">
            <div className="relative w-full h-[216px] rounded-[14px] overflow-hidden xl:w-[570px]">
              <Image
                src="/images/about/about-three.webp"
                alt="about-three"
                fill
                className="object-cover"
              />
            </div>

            <div className="about-card px-4 py-7 backdrop-blur-md xl:w-[530px]">
              <h5 className="text-white text-[18px] font-medium uppercase italic mb-6">
                Досвід та надійність:
              </h5>
              <TextList data={expirience} variant="white" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
