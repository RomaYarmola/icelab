"use client";
import Cloud from "@/app/components/common/Cloud";
import CloudReveal from "@/app/components/common/CloudReveal";
import { useIsSafari } from "@/hooks/useIsSafari";

// Мобільні хмари (до md) — цілі, у пропорціях картинки (1012×360), без
// гілок під Safari і без заходу за край екрана (28.09.2026). Раніше обидві
// були великими шматками, які різав край екрана: нижня лежала обрізаною
// брилою під останньою карткою, а під нею лишалось порожнє темне поле.
// Тепер верхня стоїть у відступі над першою карткою (pt-[142px] в About.jsx),
// нижня — посередині зарезервованого під неї поля pb-[342px]; обидві не
// заходять на картки. До 360 px — трохи менші, щоб влазили з полями.
export default function AboutClouds() {
  const isSafari = useIsSafari();

  if (typeof window === "undefined" || isSafari === null) return null;

  return (
    <>
      {/* Мобільний набір */}
      <CloudReveal
        from="left"
        className="md:hidden absolute w-[260px] h-[92px] min-[360px]:w-[280px] min-[360px]:h-[100px] z-[3] top-[22px] right-4"
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
        className="md:hidden absolute w-[300px] h-[107px] min-[360px]:w-[340px] min-[360px]:h-[121px] z-[4] bottom-[112px] left-4"
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
