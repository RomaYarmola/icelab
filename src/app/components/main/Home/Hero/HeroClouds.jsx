"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeroClouds() {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent
    );
    setIsSafari(isSafariBrowser);

    const clouds = document.querySelectorAll(".animated-cloud");

    const DURATION = 30000;

    clouds.forEach((cloud, index) => {
      if (isSafariBrowser && index >= 4) return;

      // Хмара плавно з'являється на початку циклу і розчиняється в кінці.
      // Скидання transform (-100% → 0) відбувається, поки opacity === 0,
      // тож переходу «ривком» не видно — рух виглядає безперервним.
      const keyframes = [
        { transform: "translateX(0)", opacity: 0 },
        { transform: "translateX(-8%)", opacity: 1, offset: 0.08 },
        { transform: "translateX(-92%)", opacity: 1, offset: 0.92 },
        { transform: "translateX(-100%)", opacity: 0 },
      ];

      const options = {
        duration: DURATION,
        // Від'ємна затримка розводить фази хмар — поле рухається безперервно,
        // без синхронного «пульсу» появи/зникнення.
        delay: -((index * DURATION) / clouds.length),
        iterations: Infinity,
        easing: "linear",
      };

      cloud.animate(keyframes, options);
    });
  }, []);

  return (
    <>
      {/* Cloud 1 */}
      <div className="absolute h-[289px] top-[115px] right-[-20.7%] animated-cloud">
        <Image
          src="/images/hero/cloud-right.png"
          alt="cloud"
          width={1012}
          height={289}
          className="h-full w-full object-cover"
        />
      </div>
      {/* Cloud 2 */}
      <div
        className={`absolute h-[289px] z-[2] top-[300px] md:top-[203px] ${
          isSafari ? "right-0" : "right-[-123px] md:right-[51%]"
        } animated-cloud`}
      >
        <Image
          src="/images/hero/cloud-right.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 3 */}
      <div className="absolute h-[289px] z-[2] top-[348px] right-[9.2%] animated-cloud">
        <Image
          src="/images/hero/cloud-left.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 4 */}
      <div className="absolute h-[289px] z-[3] top-[427px] right-[7.5%] animated-cloud">
        <Image
          src="/images/hero/cloud-left.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 5 */}
      <div
        className={`absolute h-[289px] z-[2] top-[729px] ${
          isSafari ? "right-0" : "right-[-8%]"
        }   animated-cloud`}
      >
        <Image
          src="/images/hero/cloud-right.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 6 */}
      <div className="hidden md:block absolute h-[289px] z-[2] top-[667px] right-[29.4%] animated-cloud">
        <Image
          src="/images/hero/cloud-right.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 7 */}
      <div className="absolute h-[289px] z-[3] top-[729px] right-[59.5%] animated-cloud">
        <Image
          src="/images/hero/cloud-left.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 8 */}
      <div
        className={`absolute h-[289px] z-[2] top-[925px] ${
          isSafari ? "right-0" : "right-[-8%]"
        }  l:hidden animated-cloud`}
      >
        <Image
          src="/images/hero/cloud-right.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 9 */}
      <div
        className={`hidden lg:block absolute h-[289px] z-[2] top-[759px] ${
          isSafari ? "right-0" : "right-[-8%]"
        }  animated-cloud`}
      >
        <Image
          src="/images/hero/cloud-right.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 10 */}
      <div className="hidden lg:block absolute h-[289px] z-[2] top-[759px] left-[8%] ">
        <Image
          src="/images/hero/cloud-right.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 11 */}
      <div className="hidden lg:block absolute h-[289px] z-[2] top-[790px] left-[-19%] ">
        <Image
          src="/images/hero/cloud-left.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 12 */}
      <div
        className={`hidden lg:block absolute h-[289px] z-[2] top-[759px] ${
          isSafari ? "right-0" : "right-[-8%]"
        } `}
      >
        <Image
          src="/images/hero/cloud-right.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 13 */}
      <div className="hidden lg:block absolute h-[289px] z-[2] top-[759px] left-[8%] ">
        <Image
          src="/images/hero/cloud-right.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 14 */}
      <div className="hidden lg:block absolute h-[289px] z-[2] top-[790px] left-[-19%] animated-cloud">
        <Image
          src="/images/hero/cloud-left.png"
          alt="cloud"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
    </>
  );
}
