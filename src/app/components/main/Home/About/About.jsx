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
          <h3 className="text-center text-secondary-white-gradient text-xl-heading font-normal">
            Про нас
          </h3>
          <h2 className="text-light-blue-gradient text-4xl text-center leading-normal mb-[44px] l:mb-[80px]">
            ICELAB
          </h2>
          <h4 className="text-white text-lg-responsive text-center mb-7 l:mb-[58px]">
            Ваш надійний постачальник сухого льоду
          </h4>
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
