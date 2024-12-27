"use client";
import Container from "@/utils/Container";
import AboutGradient from "./AboutGradients";
import AboutClouds from "./AboutClouds";
import { useIsSafari } from "@/hooks/useIsSafari";

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
          <p className="text-xs-responsive text-white text-center font-montserrat mb-[12px] l:mb-6 not-italic max-w-[98%] md:max-w-[62%] mx-auto">
            ICELAB створений, щоб забезпечити клієнтів якісним сухим льодом для
            різноманітних потреб: охолодження, транспортування, створення
            спецефектів та вирішення нестандартних завдань.
          </p>
          <p className="text-xs-responsive text-white text-center font-montserrat not-italic max-w-[98%] md:max-w-[62%] mx-auto mb-[12px]">
            Ми робимо акцент на оперативній доставці, стабільній якості та
            зручному сервісі. Розуміємо, що кожен клієнт має свої унікальні
            запити, тому підлаштовуємося до ваших потреб.
          </p>
          <p className="text-xs-responsive text-white text-center font-montserrat not-italic max-w-[98%] md:max-w-[62%] mx-auto mb-[12px]">
            Обираючи ICELAB, ви отримуєте не просто продукт, а надійного
            партнера, на якого можна покластися у важливих моментах.
          </p>
          <p className="text-xs-responsive text-white text-center font-montserrat not-italic max-w-[98%] md:max-w-[62%] mx-auto font-bold">
            Сухий лід від ICELAB — практичне рішення для бізнесу та особистих
            потреб.
          </p>
        </div>
      </Container>
    </div>
  );
}
