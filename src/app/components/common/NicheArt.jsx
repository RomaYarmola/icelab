// Лінійні малюнки для карток ніш «Застосування сухого льоду»: з першого
// погляду видно, про що картка (весілля, коктейлі, лабораторія…).
// Малюнок лежить у правому нижньому куті картки, блідий і під текстом —
// картка має бути relative overflow-hidden, текст — relative.
//
// Нова ніша без малюнка просто показується без нього.
const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ART = {
  // Обручки + важкий дим по підлозі
  "vazhkyi-dym-na-vesillia": (
    <>
      <circle cx="48" cy="56" r="20" />
      <circle cx="72" cy="56" r="20" />
      <path d="M42 32l6-8 6 8-6 6z" />
      <path d="M8 98q15-12 30 0t30 0 30 0 30 0" />
      <path d="M18 111q15-10 30 0t30 0 30 0" />
    </>
  ),
  // Келих для коктейлю з паром
  "suhyi-lid-dlia-koktejliv": (
    <>
      <path d="M28 42h64L60 78z" />
      <path d="M60 78v26M44 104h32" />
      <path d="M72 50l16-30" />
      <path d="M48 34q-7-8 0-15t0-15M62 32q-7-8 0-15" />
    </>
  ),
  // Ріжок морозива + сніжинка
  "dostavka-morozyva-i-zamorozhenykh-produktiv": (
    <>
      <path d="M40 58h40a20 20 0 0 0-40 0z" />
      <path d="M42 58l18 50 18-50" />
      <path d="M50 72l20 12M54 88l10 6M68 70l-18 12" />
      <path d="M98 12v26M85 25h26M89 16l18 18M107 16l-18 18" />
    </>
  ),
  // Пістолет кріобластингу, шланг і гранули
  "suhyi-lid-dlia-krioblastyngu": (
    <>
      <path d="M14 48h50l10 6h22v10H74l-10 6H14z" />
      <path d="M30 70l-6 28h12l6-28" />
      <path d="M14 58q-12 22 6 46" />
      <circle cx="106" cy="46" r="2.5" />
      <circle cx="112" cy="60" r="2.5" />
      <circle cx="104" cy="72" r="2.5" />
    </>
  ),
  // Кулька зі знаком питання й конфеті
  "suhyi-lid-dlia-gender-pati": (
    <>
      <ellipse cx="60" cy="44" rx="23" ry="27" />
      <path d="M55 71l5 6 5-6" />
      <path d="M60 77q-9 12 0 22t0 18" />
      <path d="M52 37q0-10 8-10t8 8q0 6-8 8v6" />
      <circle cx="60" cy="58" r="1.2" />
      <path d="M92 26l7 4M100 50l4-7M22 28l-4 7M18 62l7 2" />
    </>
  ),
  // Холодильник і блискавка (відключення світла)
  "suhyi-lid-pry-vidkliuchenni-svitla": (
    <>
      <rect x="30" y="14" width="46" height="92" rx="6" />
      <path d="M30 48h46M40 26v12M40 58v16" />
      <path d="M100 30L86 56h14L88 84" />
    </>
  ),
  // Колба й пробірка
  "suhyi-lid-dlia-laboratorii-ta-farmatsii": (
    <>
      <path d="M44 16h24M50 16v30L28 92a6 6 0 0 0 6 9h44a6 6 0 0 0 6-9L62 46V16" />
      <path d="M36 78h40" />
      <circle cx="52" cy="88" r="3" />
      <circle cx="64" cy="84" r="2" />
      <path d="M96 28v52a6 6 0 0 0 12 0V28M92 28h20M96 56h12" />
    </>
  ),
  // Рефрижератор зі сніжинкою
  "avariine-okholodzhennia-produktiv": (
    <>
      <path d="M8 38h58v44H8z" />
      <path d="M66 52h22l14 16v14H66z" />
      <circle cx="26" cy="88" r="8" />
      <circle cx="84" cy="88" r="8" />
      <path d="M37 48v24M25 60h24M29 52l16 16M45 52L29 68" />
    </>
  ),
  // Полум'я + іскри чистоти
  "ochyshchennia-pislia-pozhezhi-suhym-lodom": (
    <>
      <path d="M58 106c-22 0-32-16-26-34 4-12 14-18 14-34 10 8 16 18 14 30 6-4 8-10 8-16 10 10 16 22 14 34-2 13-12 20-24 20z" />
      <path d="M58 106c-8 0-12-6-10-12 2-6 8-8 8-16 6 6 10 12 10 18 0 6-4 10-8 10z" />
      <path d="M98 20v18M89 29h18M20 30v12M14 36h12" />
    </>
  ),
};

export default function NicheArt({ slug, className = "" }) {
  const art = ART[slug];
  if (!art) return null;
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute -right-2 -bottom-2 h-[104px] w-[104px] md:h-[124px] md:w-[124px] text-commonBlue opacity-20 transition-opacity duration-300 group-hover:opacity-35 ${className}`}
      {...S}
    >
      {art}
    </svg>
  );
}
