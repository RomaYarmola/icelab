"use client";
import Image from "next/image";
import Cloud from "../Cloud";
import CloudReveal from "../CloudReveal";
import { useIsSafari } from "@/hooks/useIsSafari";

export default function NoCompromisesBg() {
  const isSafari = useIsSafari();

  return (
    <>
      {!isSafari && (
        <>
          <div className="radial-vertical-gradient w-[212%] md:w-[70%] absolute right-[6%] top-[-365px] md:top-[-165px] md:right-[42%] z-[3]" />
          <div className="radial-vertical-gradient w-[212%] md:w-[70%] absolute left-[12%] md:left-[42.4%] top-[-365px] md:top-[-165px] z-[3]" />
          <div className="radial-dark-gradient w-[154.7%] h-[717px] absolute left-1/2 transform -translate-x-1/2  top-[-667px] md:top-[-311px]" />
          <div className="radial-dark-gradient w-[154.7%] h-[717px] absolute left-1/2 transform -translate-x-1/2  top-[56px] md:top-[-30px]" />
          <div className="radial-small-gradient absolute hidden md:block left-[-5.3%] top-[-150px] z-[4]" />
          <div className="radial-small-gradient absolute hidden md:block right-[-4.9%] top-[-150px] z-[4]" />
        </>
      )}

      <>
        <CloudReveal
          from="right"
          className="absolute h-[259px] md:h-[396px] z-[6] top-[-206px] md:top-[-282px] left-0 md:left-[52.3%] pointer-events-none"
        >
          <Cloud
            side="right"
            width={812}
            height={289}
            className="h-full w-full object-cover object-left"
          />
        </CloudReveal>

        <CloudReveal
          from="left"
          className="hidden md:block absolute h-[396px] z-[6] top-[-302px] right-[56.6%] pointer-events-none"
        >
          <Cloud
            side="left"
            width={812}
            height={289}
            className="h-full w-full object-cover object-right"
          />
        </CloudReveal>

        {!isSafari && (
          <>
            {" "}
            <CloudReveal
              from="left"
              className="hidden md:block absolute h-[568px] w-[20.6%] top-[-126px] left-0 z-[1]"
            >
              <Image
                src="/images/no-compromises/bg-left.png"
                alt=""
                width={200}
                height={568}
                className="h-full w-full object-cover object-left"
                quality={100}
              />
            </CloudReveal>
            <CloudReveal
              from="right"
              className="hidden md:block absolute h-[568px] w-[20.6%] top-[-126px] right-0 z-[1]"
            >
              <Image
                src="/images/no-compromises/bg-right.png"
                alt=""
                width={200}
                height={568}
                className="h-full w-full object-cover object-left"
                quality={100}
              />
            </CloudReveal>
          </>
        )}
      </>
    </>
  );
}
