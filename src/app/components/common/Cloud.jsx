// Декоративна хмара першого екрана.
//
// Навмисно звичайний <img>, а не next/image. Причина — альфа-канал:
// вихідні cloud-*.png були palette-PNG, і оптимізатор next/image писав з них
// WebP з альфою без втрат. Через це зменшена копія важила БІЛЬШЕ за
// оригінал (640 px → 38 КБ проти 34 КБ у 1012 px), а quality на це не
// впливав узагалі. Готові файли з alpha_quality=60 важать 12 КБ (640 px)
// і 29 КБ (1012 px), тож статика тут краща за оптимізатор — ще й без
// зайвого раунд-тріпу до /_next/image.
//
// sizes: ширина самого елемента — 1012 px (її задає атрибут width), але на
// телефоні видно лише ~412 px м'якої димки. 320px×DPR потрапляє в копію
// 640w і при DPR 1.75 (Moto G Power у Lighthouse), і при DPR 2. Брали було
// 366px — на 1.75 це давало рівно 640.5 px, браузер округляв угору й тягнув
// 1012w, тобто 29 КБ замість 12 КБ. На десктопі береться 1012w.
export default function Cloud({
  side,
  width = 812,
  height = 289,
  className = "",
  priority = false,
}) {
  const base = `/images/hero/cloud-${side}`;

  return (
    <img
      alt=""
      aria-hidden="true"
      width={width}
      height={height}
      src={`${base}.webp`}
      srcSet={`${base}-640.webp 640w, ${base}.webp 1012w`}
      sizes="(max-width: 767px) 320px, 1012px"
      // priority — лише для тієї хмари, яку Chrome обирає LCP-елементом
      // (перша, top-[115px]). Решта лишається lazy: фон Hero і без них
      // забирає канал на початку завантаження.
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      className={className}
    />
  );
}
