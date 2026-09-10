import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CITIES, GEO_LABELS } from "@/lib/cities";

// Контекстний блок «Доставка та самовивіз по містах» для головної, категорій,
// карток товарів, опту й сторінки доставки.
//
// НАВІЩО. До вересня 2026 гео-лендинги отримували посилання ЛИШЕ з футера
// з однослівним анкором («Київ»). Google практично не передає вагу через
// футерні списки, тому лендинги Києва і Львова не ранжувались, а міський
// інтент забирала головна. Цей блок дає кожному лендингу контекстне посилання
// з тіла сторінки і повним анкором («Сухий лід у Києві»), а користувачу —
// адресу й графік складу там, де він обирає товар.
//
// variant: "cards" — дві картки складів + рядок інших міст (головна,
// категорії, опт); "inline" — компактний рядок для картки товару.
// excludeSlug — не показувати поточне місто (на самих лендингах).
export default async function CityPickupLinks({
  locale,
  variant = "cards",
  excludeSlug,
  title,
}) {
  const t = await getTranslations({ locale, namespace: "CityLinks" });
  const L = GEO_LABELS[locale] || GEO_LABELS.uk;
  const pickup = CITIES.filter((c) => c.pickupAddress && c.slug !== excludeSlug);
  const others = CITIES.filter((c) => !c.pickupAddress && c.slug !== excludeSlug);
  const text = (c) => c[locale] || c.uk;
  const heading = title || t("title");

  if (variant === "inline") {
    return (
      <div className="rounded-[14px] border border-commonBlue/15 p-5">
        <h2 className="text-base font-medium text-commonBlue mb-3 not-italic font-e-ukraine">
          {heading}
        </h2>
        <ul className="flex flex-col gap-2">
          {pickup.map((c) => (
            <li
              key={c.slug}
              className="font-e-ukraine font-thin not-italic text-commonBlue/80 text-sm leading-relaxed"
            >
              <Link
                href={`/${c.slug}`}
                className="font-medium text-commonBlue underline decoration-commonBlue/30 underline-offset-4 hover:decoration-commonBlue"
              >
                {text(c).h1}
              </Link>
              {" — "}
              {t("pickupLabel")}: {c.pickupAddress[locale] || c.pickupAddress.uk}
            </li>
          ))}
          {others.length > 0 && (
            <li className="font-e-ukraine font-thin not-italic text-commonBlue/80 text-sm leading-relaxed">
              {t("otherInline")}{" "}
              {others.map((c, i) => (
                <span key={c.slug}>
                  <Link
                    href={`/${c.slug}`}
                    className="text-commonBlue underline decoration-commonBlue/30 underline-offset-4 hover:decoration-commonBlue"
                  >
                    {text(c).city}
                  </Link>
                  {i < others.length - 1 ? ", " : "."}
                </span>
              ))}
            </li>
          )}
        </ul>
      </div>
    );
  }

  return (
    <section>
      <h2 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-2 text-black">
        {heading}
      </h2>
      <p className="not-italic font-e-ukraine font-thin text-black/70 mb-6 max-w-[760px]">
        {t("subtitle")}
      </p>
      <ul className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-6">
        {pickup.map((c) => {
          const tc = text(c);
          return (
            <li
              key={c.slug}
              className="rounded-[14px] border border-commonBlue/15 bg-commonBlue/[0.02] p-6 flex flex-col gap-2"
            >
              <Link
                href={`/${c.slug}`}
                className="not-italic font-e-ukraine font-medium text-[18px] md:text-[20px] text-commonBlue hover:underline underline-offset-4"
              >
                {tc.h1}
              </Link>
              <p className="not-italic font-e-ukraine font-thin text-black/75 text-[15px] leading-relaxed">
                {tc.deliveryNote}
              </p>
              <address className="not-italic font-e-ukraine font-thin text-black/85 text-[15px] mt-1">
                {t("pickupLabel")}: {c.pickupAddress[locale] || c.pickupAddress.uk}
              </address>
              <p className="not-italic font-e-ukraine font-thin text-black/60 text-[14px]">
                {L.hoursLabel}: {L.hours}
              </p>
              <Link
                href={`/${c.slug}`}
                className="mt-2 self-start rounded-full border border-commonBlue/30 px-5 py-2 not-italic font-e-ukraine text-[14px] text-commonBlue hover:bg-commonBlue/10 transition-colors"
              >
                {t("cityCta", { city: tc.city })}
              </Link>
            </li>
          );
        })}
      </ul>
      {others.length > 0 && (
        <p className="not-italic font-e-ukraine font-thin text-black/70 text-[15px] leading-relaxed">
          {t("otherInline")}{" "}
          {others.map((c, i) => (
            <span key={c.slug}>
              <Link
                href={`/${c.slug}`}
                className="text-commonBlue underline decoration-commonBlue/30 underline-offset-4 hover:decoration-commonBlue"
              >
                {text(c).h1}
              </Link>
              {i < others.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
