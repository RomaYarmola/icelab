import { defineRouting } from "next-intl/routing";

// Налаштування маршрутизації next-intl.
// - locales: перелік підтримуваних мов;
// - defaultLocale: українська — мова за замовчуванням;
// - localePrefix: "as-needed" — мова за замовчуванням (uk) віддається без
//   префікса ("/"), решта мов — з префіксом ("/ru").
// - localeDetection: false — вимкнено автовизначення мови: ані заголовок
//   accept-language, ані cookie не впливають на вибір мови. Джерело істини
//   лише URL: "/" → uk, "/ru" → ru, без автоматичних редиректів.
// - localeCookie: false — cookie мови не встановлюється й не читається,
//   тож вибір мови не зберігається між відвідуваннями.
export const routing = defineRouting({
  locales: ["uk", "ru"],
  defaultLocale: "uk",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
});
