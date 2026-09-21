"use client";
import Cloud from "@/app/components/common/Cloud";
import CloudReveal from "@/app/components/common/CloudReveal";
import { useIsSafari } from "@/hooks/useIsSafari";

export default function AboutClouds() {
  const isSafari = useIsSafari();

  if (typeof window === "undefined" || isSafari === null) return null;

  return (
    <>
      <CloudReveal
        from="left"
        className="hidden md:block absolute h-[264px] z-[3] top-[58px] md:top-[39px] l:top-[109px] right-[41px] md:right-[52%] l:h-[396px] 2xl:h-[53.5%]"
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
        className={`absolute h-[264px] z-[3] top-[41px] ${
          isSafari ? "right-0" : "right-[-608px]"
        }  md:hidden`}
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
        className={`absolute h-[346px] l:h-[396px] 2xl:h-[53.5%] z-[4] top-[2307px] xs:top-[1337px] sm:top-[1137px] md:top-[39px] l:top-[109px] ${
          isSafari ? "right-0" : "right-[64px] md:right-[-35%]"
        }  `}
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
