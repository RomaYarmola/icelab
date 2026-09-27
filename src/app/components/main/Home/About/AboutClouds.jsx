"use client";
import Cloud from "@/app/components/common/Cloud";
import CloudReveal from "@/app/components/common/CloudReveal";
import { useIsSafari } from "@/hooks/useIsSafari";

// Мобільні хмари (до md) — з явними розмірами в пропорціях картинки
// (1012×360), без гілок під Safari (27.09.2026). Раніше розмір рамки
// виводився з внутрішньої ширини <img>, і для Safari була окрема верстка:
// нижня хмара на iPhone стискалась до 114 px заввишки й висіла обривком під
// останньою карткою, а під нею лишалось ~230 px порожнього темного поля, яке
// вона мала заповнювати. Явна ширина дає однакову картинку в усіх рушіях;
// що виходить за край, обрізає overflow-x-clip секції.
//
// Нижня прив'язана до низу секції: під нею й зарезервовано pb-[342px]
// (About.jsx), і місце не зсувається, якщо текст карток стане довшим.
export default function AboutClouds() {
  const isSafari = useIsSafari();

  if (typeof window === "undefined" || isSafari === null) return null;

  return (
    <>
      {/* Мобільний набір */}
      <CloudReveal
        from="left"
        className="md:hidden absolute w-[742px] h-[264px] z-[3] top-[41px] right-0"
      >
        <Cloud
          side="left"
          width={812}
          height={289}
          className="h-full w-full object-cover"
        />
      </CloudReveal>
      <CloudReveal
        from="left"
        className="md:hidden absolute w-[972px] h-[346px] z-[4] bottom-[94px] xs:bottom-auto xs:top-[1337px] sm:top-[1137px] right-[64px]"
      >
        <Cloud
          side="right"
          width={812}
          height={289}
          className="h-full w-full object-cover"
        />
      </CloudReveal>

      {/* Десктопний набір */}
      <CloudReveal
        from="left"
        className="hidden md:block absolute h-[264px] z-[3] md:top-[39px] l:top-[109px] md:right-[52%] l:h-[396px] 2xl:h-[53.5%]"
      >
        <Cloud
          side="left"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </CloudReveal>
      <CloudReveal
        from="left"
        className={`hidden md:block absolute h-[346px] l:h-[396px] 2xl:h-[53.5%] z-[4] md:top-[39px] l:top-[109px] ${
          isSafari ? "right-0" : "md:right-[-35%]"
        }`}
      >
        <Cloud
          side="right"
          width={812}
          height={289}
          className={`w-full object-cover  ${
            isSafari ? "" : "object-right h-full "
          }`}
        />
      </CloudReveal>
    </>
  );
}
