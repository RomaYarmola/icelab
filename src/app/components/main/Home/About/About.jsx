"use client";
import Container from "@/utils/Container";
import AboutGradient from "./AboutGradients";
import AboutClouds from "./AboutClouds";
import { useIsSafari } from "@/hooks/useIsSafari";
import TextList from "@/app/components/common/TextList/TextList";
import { materials, production, decisions, expirience } from "./data";

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
        <div className="pt-[142px] l:pt-[194px] pb-[442px] md:pb-[69px] relative z-10">
          <div className="px-4 py-7 bg-[rgba(60,166,255,0.2)] rounded-[14px]">
            {" "}
            <h3 className="text-secondary-white-gradient text-[24px] uppercase font-e-ukraine font-extralight not-italic">
              Про нас
            </h3>
            <h2 className="text-white text-[48px] font-bold leading-normal mb-[57px]">
              ICELAB
            </h2>
            <div className="flex items-center gap-5">
              {" "}
              <div className="w-[55px] h-[3px] bg-white" />{" "}
              <h4 className="text-white text-[16px] font-medium uppercase italic">
                Ваш надійний постачальник сухого льоду
              </h4>
            </div>
          </div>
          <div className="flex flex-col gap-10 lg:gap-20">
            <div>
              <h5 className="text-white text-sm-responsive mb-5 l:mb-7">
                Сировина і потужності:
              </h5>
              <TextList data={materials} variant="about-us" />
            </div>

            <div>
              {" "}
              <h5 className="text-white text-sm-responsive mb-5 l:mb-7">
                Сучасне виробництво:
              </h5>
              <TextList data={production} variant="about-us" />
            </div>
            <div>
              <h5 className="text-white text-sm-responsive mb-5 l:mb-7">
                Гнучкі рішення для клієнтів:
              </h5>
              <TextList data={decisions} variant="about-us" />
            </div>
            <div>
              <h5 className="text-white text-sm-responsive mb-5 l:mb-7">
                Досвід та надійність:
              </h5>
              <TextList data={expirience} variant="about-us" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
