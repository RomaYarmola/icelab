// Спільна мова «midnight command center» для темних плит сайту
// (блок складів, перший екран гео-лендингів).
//
// Напрям зібраний із референсів Refero: Authkit — напівпрозорі поверхні,
// inset-відблиск згори (світло над сценою), делікатні бордюри, пігулкові
// кнопки; Dimension — backdrop-blur і великий радіус замість важких тіней;
// Idle Finance — радіальне сяйво під склом, щоб склу було що заломлювати.
// Брендовий акцент — #1E73D7; фіолетовий CTA з Authkit НЕ переноситься.

// Темна плита-основа. Самодостатня: працює і на світлій сторінці каталогу,
// і на головній, не залежачи від фону секції.
export const PLATE =
  "relative overflow-hidden rounded-[28px] md:rounded-[32px] bg-[linear-gradient(160deg,#0B1526_0%,#0E1B33_55%,#0A1424_100%)] shadow-[inset_0_1px_0_0_rgba(186,215,247,0.16)]";

// Скляна поверхня. Тільки для карток рівня секції — на дрібних елементах
// розмиття не читається й дає артефакти композитора.
export const GLASS =
  "rounded-[20px] border border-[rgba(186,215,247,0.16)] bg-[rgba(255,255,255,0.06)] backdrop-blur-[14px] shadow-[inset_0_1px_1px_0_rgba(199,211,234,0.22),inset_0_24px_48px_0_rgba(199,211,234,0.05),0_20px_32px_0_rgba(5,9,20,0.45)]";

// Роль — лише роздільник усередині скляної картки.
export const HAIRLINE =
  "h-px w-full bg-[linear-gradient(90deg,transparent,rgba(186,215,247,0.22),transparent)]";

// Пігулкова кнопка на темному (вторинна дія).
export const GLASS_PILL =
  "inline-flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.34)] bg-[rgba(186,214,247,0.08)] px-6 py-2.5 not-italic font-e-ukraine text-[14px] font-medium text-white transition-colors hover:bg-[rgba(186,214,247,0.18)] hover:border-[rgba(255,255,255,0.5)]";

// Чип-факт: коротка перевірювана характеристика під заголовком.
export const GLASS_CHIP =
  "inline-flex items-center gap-2 rounded-full border border-[rgba(186,215,247,0.18)] bg-[rgba(255,255,255,0.05)] px-4 py-2 not-italic font-e-ukraine text-[13px] md:text-[14px] text-[rgba(216,236,248,0.92)]";

// Декоративні сяйва плити. Суто атмосфера — не використовувати як фон контенту.
export const GLOW_PRIMARY =
  "pointer-events-none absolute -top-[180px] -left-[120px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(30,115,215,0.55)_0%,rgba(30,115,215,0.18)_42%,rgba(30,115,215,0)_70%)]";

export const GLOW_SECONDARY =
  "pointer-events-none absolute -bottom-[220px] -right-[100px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(86,168,255,0.34)_0%,rgba(86,168,255,0.1)_45%,rgba(86,168,255,0)_72%)]";
