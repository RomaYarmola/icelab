import GeoCta from "@/app/components/main/Geo/GeoCta";
import { mergeTiers } from "@/lib/featured";
import {
  PLATE,
  GLASS,
  HAIRLINE,
  GLASS_CHIP,
  GLOW_PRIMARY,
  GLOW_SECONDARY,
} from "@/app/components/common/glass";

// Перший екран /opt.
//
// НАВІЩО. Google тримав /opt у статусі «Копія, канонічний варіант не вибрано
// користувачем»: перший екран і формулювання про ціну та фасування
// збігалися з категорією й головною. Тепер перший екран суто B2B — оптові
// пороги, договір, два виробництва, графік — і не повторює роздрібну
// категорію (див. docs/SEO-DEMAND-MAP-2026-09.md, 5.6).
//
// ЦІНИ — з Price Settings (ті самі, що рахують кошик). Роздрібний поріг
// (перший рядок тарифу) тут не показуємо: оптові ціни — це решта рядків.
// До 17.09 сторінка писала «від 100 кг / від 300 кг», а кошик рахував
// 60 грн/кг уже від 31 кг — текст розходився з реальною ціною.
export default function WholesaleHero({ t, settings, context }) {
  const all = mergeTiers(settings.dryIceTiers);
  const opt = all.length > 1 ? all.slice(1) : all;
  const maxTier = all.length ? all[all.length - 1].max : null;
  const rows = opt
    .map((r) => t.heroRow.replace("{price}", r.price).replace("{max}", r.max))
    .join(", ");
  const lead = String(t.heroLead)
    .replace("{from}", opt.length ? opt[0].min : "")
    .replace("{rows}", rows)
    .replace("{max}", maxTier ?? "");

  return (
    <section className={`${PLATE} px-6 py-9 md:px-12 md:py-12 mb-14`}>
      <div aria-hidden="true" className={GLOW_PRIMARY} />
      <div aria-hidden="true" className={GLOW_SECONDARY} />

      <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
        <div className="flex flex-col gap-6 md:gap-7">
          <h1 className="order-1 not-italic font-e-ukraine font-medium text-[28px] md:text-[42px] leading-[1.1] text-white text-balance">
            {t.heroH1}
          </h1>
          <p className="order-4 lg:order-2 not-italic font-e-ukraine font-thin text-[15px] md:text-[18px] leading-relaxed text-[rgba(216,236,248,0.82)] max-w-[640px]">
            {lead}
          </p>
          <ul className="order-2 lg:order-3 flex flex-wrap gap-2.5">
            {t.heroFacts.map((f) => (
              <li key={f} className={GLASS_CHIP}>
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#6aa6ff]" />
                {f}
              </li>
            ))}
          </ul>
          <div className="order-3 lg:order-4">
            <GeoCta label={t.ctaButton} title={t.ctaModalTitle} context={context} />
          </div>
        </div>

        {opt.length > 0 && (
          <aside className={`${GLASS} isolate p-6 md:p-7`}>
            <h2 className="not-italic font-e-ukraine font-medium text-[17px] md:text-[18px] text-white">
              {t.heroPriceTitle}
            </h2>
            <dl className="mt-4 flex flex-col gap-3">
              {opt.map((r) => (
                <div key={r.min} className="flex items-baseline justify-between gap-4">
                  <dt className="not-italic font-e-ukraine font-thin text-[15px] text-[rgba(216,236,248,0.6)]">
                    {r.min}–{r.max} {t.kg}
                  </dt>
                  <dd className="not-italic font-e-ukraine text-[17px] text-white">
                    {r.price} {t.kgUnit}
                  </dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4">
                <dt className="not-italic font-e-ukraine font-thin text-[15px] text-[rgba(216,236,248,0.6)]">
                  {t.heroOver.replace("{max}", maxTier ?? "")}
                </dt>
                <dd className="not-italic font-e-ukraine text-[15px] text-white text-right">
                  {t.heroNegotiable}
                </dd>
              </div>
            </dl>
            <div className={`${HAIRLINE} my-5`} />
            <p className="not-italic font-e-ukraine font-thin text-[14px] leading-relaxed text-[rgba(216,236,248,0.6)]">
              {t.pricesFootnote}
            </p>
          </aside>
        )}
      </div>
    </section>
  );
}
