import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CITIES, GEO_LABELS } from "@/lib/cities";
import {
  PLATE,
  GLASS,
  HAIRLINE,
  GLASS_PILL,
  GLOW_PRIMARY,
  GLOW_SECONDARY,
} from "./glass";

// Контекстний блок «Доставка та самовивіз по містах» для головної, категорій,
// карток товарів, опту й сторінки доставки.
//
// НАВІЩО ВІН ІСНУЄ. До вересня 2026 гео-лендинги отримували посилання ЛИШЕ
// з футера з однослівним анкором («Київ»). Google практично не передає вагу
// через футерні списки, тому лендинги Києва і Львова не ранжувались, а міський
// інтент забирала головна. Цей блок дає кожному лендингу контекстне посилання
// з тіла сторінки і повним анкором («Сухий лід у Києві»), а користувачу —
// адресу й графік складу там, де він обирає товар.
//
// ЧОМУ ТАКИЙ ВИГЛЯД. Напрям — «midnight command center» (референс Authkit):
// темне навігаційне полотно, напівпрозорі матові поверхні, світло згори через
// inset-підсвітку, делікатні бордюри, пігулкові кнопки. Розмиття скла й великий
// радіус — з Dimension; радіальне синє сяйво під склом, щоб було що заломлювати,
// — з Idle Finance. Акцент лишається брендовим (#1E73D7), фіолетовий Authkit
// НЕ переноситься. Блок — самодостатня темна плита: він стоїть і на світлих
// сторінках каталогу, і на головній, не залежачи від фону секції.
//
// variant: "cards" — плита з двома скляними картками складів (головна,
// категорії, опт, доставка); "inline" — компактний світлий блок для колонки
// з характеристиками товару.
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
    <section className={`${PLATE} px-6 py-10 md:px-12 md:py-14`}>
      {/* Атмосферне сяйво: дає склу що заломлювати — без нього напівпрозорі
          картки виглядають просто сірими. Суто декоративне: ці градієнти не
          можна використовувати як фон контенту. */}
      <div
        aria-hidden="true"
        className={GLOW_PRIMARY}
      />
      <div
        aria-hidden="true"
        className={GLOW_SECONDARY}
      />

      <div className="relative">
        <h2 className="not-italic font-e-ukraine font-medium text-[24px] md:text-[32px] leading-tight text-white mb-3 text-balance">
          {heading}
        </h2>
        <p className="not-italic font-e-ukraine font-thin text-[15px] md:text-[17px] leading-relaxed text-[rgba(216,236,248,0.7)] mb-8 max-w-[720px]">
          {t("subtitle")}
        </p>

        <ul className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {pickup.map((c) => {
            const tc = text(c);
            return (
              // isolate: у Chrome дочірній елемент із власним transition
              // усередині backdrop-filter отримує окремий шар композитора,
              // і розмиття перемальовується світлішою плямою рівно по його
              // боксу. Ізоляція шару прибирає цю смугу біля заголовка.
              <li
                key={c.slug}
                className={`${GLASS} transition-colors duration-300 hover:bg-[rgba(255,255,255,0.09)] hover:border-[rgba(186,215,247,0.28)] isolate p-6 md:p-7 flex flex-col`}
              >
                <Link
                  href={`/${c.slug}`}
                  className="self-start not-italic font-e-ukraine font-medium text-[19px] md:text-[21px] text-white hover:text-[#b6d9fc]"
                >
                  {tc.h1}
                </Link>
                <p className="mt-2 not-italic font-e-ukraine font-thin text-[15px] leading-relaxed text-[rgba(216,236,248,0.72)]">
                  {tc.deliveryNote}
                </p>

                <div className={`${HAIRLINE} my-5`} />

                <address className="not-italic font-e-ukraine font-thin text-[15px] leading-relaxed text-[rgba(255,255,255,0.92)]">
                  <span className="text-[rgba(216,236,248,0.5)]">
                    {t("pickupLabel")}:{" "}
                  </span>
                  {c.pickupAddress[locale] || c.pickupAddress.uk}
                </address>
                <p className="mt-1 not-italic font-e-ukraine font-thin text-[14px] text-[rgba(216,236,248,0.5)]">
                  {L.hoursLabel}: {L.hours}
                </p>

                <Link
                  href={`/${c.slug}`}
                  className={`${GLASS_PILL} mt-6 self-start`}
                >
                  {t("cityCta", { city: tc.city })}
                </Link>
              </li>
            );
          })}
        </ul>

        {others.length > 0 && (
          <p className="mt-8 not-italic font-e-ukraine font-thin text-[15px] leading-relaxed text-[rgba(216,236,248,0.6)]">
            {t("otherInline")}{" "}
            {others.map((c, i) => (
              <span key={c.slug}>
                <Link
                  href={`/${c.slug}`}
                  className="text-[rgba(255,255,255,0.92)] underline decoration-[rgba(186,215,247,0.35)] underline-offset-4 transition-colors hover:decoration-[rgba(186,215,247,0.9)]"
                >
                  {text(c).h1}
                </Link>
                {i < others.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        )}
      </div>
    </section>
  );
}
