"use client";

import { useEffect, useRef } from "react";
import Cloud from "../../../common/Cloud";

// Хмари першого екрана.
//
// Хмари першого екрана — і декор, і LCP-елемент водночас: найбільший
// контентний кандидат тут саме хмара №1 (фон Hero Chrome у кандидати не
// бере зовсім — перевірено трейсом). Тому вона одна має priority, решта
// лишається lazy.
//
// Історія питання (21.09.2026). Раніше priority на хмарах робив тільки
// гірше (LCP 5,4 → 9,4 с), і причина була не в самому priority, а у вазі
// ассетів: cloud-*.png лежали як palette-PNG, а next/image писав з них
// WebP з альфою БЕЗ втрат. Зменшена копія виходила важчою за оригінал
// (640 px → 38 КБ проти 34 КБ у 1012 px), причому quality не впливав ні
// на що. Три таких preload-и справді забивали канал на Slow 4G.
// Тепер хмари — готова статика з alpha_quality=60 (12 КБ на мобільному,
// 29 КБ на десктопі) через компонент Cloud, і один eager-запит на 12 КБ
// уже нічого не блокує: LCP збігається з появою першого екрана.
//
// Мобільний (до md), 27.09.2026. Відколи висота першого екрана на телефоні
// стала «за контентом» (~640–740 px замість 864), десктопні координати
// хмар (top 729 і 925 px) опинились під Hero — нерухомі обрізані хмари
// висіли між картками товарів. Тепер на мобільному окремий набір із трьох
// хмар: шар обрізає їх по межах Hero, розміри мають ті самі пропорції, що
// й картинка (object-cover нічого не обтинає — інакше при русі в кадр
// в'їжджав би прямий край), а нижня прив'язана до низу Hero, а не до верху.
//
// Анімація — WAAPI, лише transform (композитор, головний потік вільний):
//  • десктоп — як і раніше: хмара пливе вліво на свою ширину, розчиняється
//    і з'являється знову на місці. Але стартує з того місця, де хмару
//    намалював сервер: раніше від'ємні delay розкидали фази, і під час
//    гідратації всі хмари стрибали, а LCP-хмара зникала й проявлялась;
//  • мобільний — безперервний «вітер»: хмара виходить за лівий край і
//    заходить з правого, без згасань. На вузькому екрані хмара, що
//    розчиняється посеред екрана, виглядала б як збій.
// Коли Hero поза екраном, анімації на паузі.
const DESKTOP_DRIFT = [
  { transform: "translateX(0)", opacity: 1 },
  { transform: "translateX(-84%)", opacity: 1, offset: 0.84 },
  { transform: "translateX(-92%)", opacity: 0, offset: 0.92 },
  // Перескок назад — поки хмара невидима, швидкість руху та сама.
  { transform: "translateX(8%)", opacity: 0, offset: 0.92 },
  { transform: "translateX(0)", opacity: 1 },
];
// Різні тривалості, щоб хмари не згасали всі одночасно.
const DESKTOP_DURATIONS = [30, 36, 27, 41, 33, 38, 29, 44, 35];
// Швидкості «вітру» на мобільному, px/с.
const MOBILE_SPEEDS = [14, 11, 17];

function driftDesktop(el, i) {
  return el.animate(DESKTOP_DRIFT, {
    duration: DESKTOP_DURATIONS[i % DESKTOP_DURATIONS.length] * 1000,
    iterations: Infinity,
    easing: "linear",
  });
}

function windMobile(el, i, frame) {
  const box = el.getBoundingClientRect();
  const exit = frame.left - box.right; // до повного виходу за лівий край
  const entry = frame.right - box.left; // старт повністю за правим краєм
  const path = entry - exit;
  const at = -exit / path;
  return el.animate(
    [
      { transform: "translate3d(0,0,0)" },
      { transform: `translate3d(${exit}px,0,0)`, offset: at },
      { transform: `translate3d(${entry}px,0,0)`, offset: at },
      { transform: "translate3d(0,0,0)" },
    ],
    {
      duration: (path / MOBILE_SPEEDS[i % MOBILE_SPEEDS.length]) * 1000,
      iterations: Infinity,
      easing: "linear",
    }
  );
}

export default function HeroClouds() {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || typeof layer.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    let anims = [];
    let inView = true;
    let width = window.innerWidth;

    const start = () => {
      anims.forEach((a) => a.cancel());
      // Лише ті, що зараз показані: display:none не має рамок.
      const clouds = [...layer.querySelectorAll("[data-drift]")].filter(
        (el) => el.getClientRects().length > 0
      );
      if (window.matchMedia("(max-width: 767px)").matches) {
        const frame = layer.getBoundingClientRect();
        anims = clouds.map((el, i) => windMobile(el, i, frame));
      } else {
        // У десктопному Safari рухаються лише перші чотири — як і раніше.
        anims = (isSafari ? clouds.slice(0, 4) : clouds).map(driftDesktop);
      }
      if (!inView) anims.forEach((a) => a.pause());
    };

    start();

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      anims.forEach((a) => (inView ? a.play() : a.pause()));
    });
    io.observe(layer);

    // Шлях мобільної хмари порахований у пікселях від ширини екрана —
    // перераховуємо після повороту. Зміну лише висоти (панель Safari)
    // ігноруємо.
    let timer;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      clearTimeout(timer);
      timer = setTimeout(start, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
      anims.forEach((a) => a.cancel());
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden md:overflow-visible pointer-events-none"
    >
      {/* Cloud 1 — LCP-елемент і на мобільному, і на десктопі. На мобільному
          рамка 560×199 — пропорції картинки, тож хмара ціла. */}
      <div
        data-drift
        className="absolute w-[560px] h-[199px] top-[96px] right-[-150px] md:w-auto md:h-[289px] md:top-[115px] md:right-[-20.7%]"
      >
        <Cloud
          side="right"
          width={1012}
          height={289}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      {/* Мобільний набір (до md) */}
      <div
        data-drift
        className="md:hidden absolute w-[500px] h-[178px] top-[292px] left-[-190px]"
      >
        <Cloud
          side="left"
          width={812}
          height={289}
          className="h-full w-full object-cover"
        />
      </div>
      <div
        data-drift
        className="md:hidden absolute w-[520px] h-[185px] bottom-[18px] right-[-230px]"
      >
        <Cloud
          side="right"
          width={812}
          height={289}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Десктопний набір (з md) — розкладка без змін */}
      {/* Cloud 2 */}
      <div
        data-drift
        className="hidden md:block absolute h-[289px] z-[2] top-[203px] right-[51%]"
      >
        <Cloud
          side="right"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 3 */}
      <div
        data-drift
        className="hidden md:block absolute h-[289px] z-[2] top-[348px] right-[9.2%]"
      >
        <Cloud
          side="left"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 4 */}
      <div
        data-drift
        className="hidden md:block absolute h-[289px] z-[3] top-[427px] right-[7.5%]"
      >
        <Cloud
          side="left"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 5 */}
      <div
        data-drift
        className="hidden md:block absolute h-[289px] z-[2] top-[729px] right-[-8%]"
      >
        <Cloud
          side="right"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 6 */}
      <div
        data-drift
        className="hidden md:block absolute h-[289px] z-[2] top-[667px] right-[29.4%]"
      >
        <Cloud
          side="right"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 7 */}
      <div
        data-drift
        className="hidden md:block absolute h-[289px] z-[3] top-[729px] right-[59.5%]"
      >
        <Cloud
          side="left"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 8 */}
      <div
        data-drift
        className="hidden md:block l:hidden absolute h-[289px] z-[2] top-[925px] right-[-8%]"
      >
        <Cloud
          side="right"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 9 */}
      <div
        data-drift
        className="hidden lg:block absolute h-[289px] z-[2] top-[759px] right-[-8%]"
      >
        <Cloud
          side="right"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 10 */}
      <div className="hidden lg:block absolute h-[289px] z-[2] top-[759px] left-[8%]">
        <Cloud
          side="right"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 11 */}
      <div className="hidden lg:block absolute h-[289px] z-[2] top-[790px] left-[-19%]">
        <Cloud
          side="left"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 12 */}
      <div className="hidden lg:block absolute h-[289px] z-[2] top-[759px] right-[-8%]">
        <Cloud
          side="right"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 13 */}
      <div className="hidden lg:block absolute h-[289px] z-[2] top-[759px] left-[8%]">
        <Cloud
          side="right"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
      {/* Cloud 14 */}
      <div
        data-drift
        className="hidden lg:block absolute h-[289px] z-[2] top-[790px] left-[-19%]"
      >
        <Cloud
          side="left"
          width={812}
          height={289}
          className="h-full w-full object-cover object-right"
        />
      </div>
    </div>
  );
}
