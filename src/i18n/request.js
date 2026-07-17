import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// Конфігурація запиту для серверної частини next-intl.
// Для кожного запиту визначає активну локаль та підвантажує відповідний
// словник перекладів із каталогу /messages. Якщо локаль невідома —
// використовується мова за замовчуванням.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
