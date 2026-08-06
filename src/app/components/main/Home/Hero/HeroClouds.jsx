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

    // На мобільному не запускаємо нескінченну анімацію хмар — вона тримає
    // головний потік/композитор зайнятим і гальмує LCP. Хмари лишаються
    // статичними (верстка не змінюється), рух — лише на десктопі.
    if (window.matchMedia("(max-width: 767px)").matches) return;

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

  // Хмари 1–4 потрапляють у перший екран (top 115/300/348/427 при висоті
  // в'юпорта ~812), і саме одну з них Chrome обирає LCP-елементом — вона
  // більша за все інше, що встигає намалюватись. Поки вони були lazy, LCP
  // тримався на 5,4 с: браузер дізнавався про картинку лише після розбору
  // всього документа. Тому їм — priority (eager + fetchpriority=high +
  // preload). Решта хмар нижче згину лишаються lazy.
  // quality 60 — м'які білі форми, різниці на око немає, а ваги менше.
  return (
    <>
      {/* Cloud 1 */}
      <div className="absolute h-[289px] top-[115px] right-[-20.7%] animated-cloud">
        <Image
          src="/images/hero/cloud-right.png"
          alt=""
          quality={60}
          priority
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
          alt=""
          quality={60}
          priority
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 3 */}
      <div className="absolute h-[289px] z-[2] top-[348px] right-[9.2%] animated-cloud">
        <Image
          src="/images/hero/cloud-left.png"
          alt=""
          quality={60}
          priority
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 4 */}
      <div className="absolute h-[289px] z-[3] top-[427px] right-[7.5%] animated-cloud">
        <Image
          src="/images/hero/cloud-left.png"
          alt=""
          quality={60}
          priority
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
          alt=""
          quality={60}
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 6 */}
      <div className="hidden md:block absolute h-[289px] z-[2] top-[667px] right-[29.4%] animated-cloud">
        <Image
          src="/images/hero/cloud-right.png"
          alt=""
          quality={60}
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 7 */}
      <div className="absolute h-[289px] z-[3] top-[729px] right-[59.5%] animated-cloud">
        <Image
          src="/images/hero/cloud-left.png"
          alt=""
          quality={60}
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
          alt=""
          quality={60}
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
          alt=""
          quality={60}
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 10 */}
      <div className="hidden lg:block absolute h-[289px] z-[2] top-[759px] left-[8%] ">
        <Image
          src="/images/hero/cloud-right.png"
          alt=""
          quality={60}
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 11 */}
      <div className="hidden lg:block absolute h-[289px] z-[2] top-[790px] left-[-19%] ">
        <Image
          src="/images/hero/cloud-left.png"
          alt=""
          quality={60}
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
          alt=""
          quality={60}
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 13 */}
      <div className="hidden lg:block absolute h-[289px] z-[2] top-[759px] left-[8%] ">
        <Image
          src="/images/hero/cloud-right.png"
          alt=""
          quality={60}
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 14 */}
      <div className="hidden lg:block absolute h-[289px] z-[2] top-[790px] left-[-19%] animated-cloud">
        <Image
          src="/images/hero/cloud-left.png"
          alt=""
          quality={60}
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
    </>
  );
}
