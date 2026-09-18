import { Link } from "@/i18n/navigation";
import GeoCta from "@/app/components/main/Geo/GeoCta";
import { mergeTiers } from "@/lib/featured";
import {
  PLATE,
  GLASS,
  HAIRLINE,
  GLASS_PILL,
  GLASS_CHIP,
  GLOW_PRIMARY,
  GLOW_SECONDARY,
} from "@/app/components/common/glass";
import MessengerButtons from "@/app/components/common/MessengerButtons";

// Перший екран категорії (зараз — «Сухий лід», messages → Categories.<key>.hero).
//
// НАВІЩО. /catalog/c/suhyi-lid — сторінка під ВЧ «сухий лід / сухий лід
// купити», але до 17.09 її перший екран був фільтром категорій і H1 «Сухий
// лід» без жодної цифри. Google віддавав цей інтент головній, містам і навіть
// www-дублю (див. docs/SEO-DEMAND-MAP-2026-09.md, 3.3). Тепер у першому екрані
// — пряма відповідь для сніпета й AI (ціна, гранули, де забрати, доставка),
// таблиця цін за кілограм і дві дії.
//
// ЦИФРИ — лише з Price Settings (ті самі, що рахують кошик): мінімальна ціна,
// ціна до 30 кг, пороги. У текстах messages вони підставляються як {min},
// {base}, {sizes}; окремо цифри в текстах не пишемо, щоб не розійтися з кошиком.
export default function CategoryHero({ hero, settings, labels, context }) {
  const tiers = mergeTiers(settings.dryIceTiers);
  const min = tiers.length ? Math.min(...tiers.map((t) => t.price)) : null;
  const base = tiers.length ? tiers[0].price : null;
  const maxTier = tiers.length ? tiers[tiers.length - 1].max : null;
  const sizes = (settings.granuleSizes || [])
    .map((s) => String(s).replace(/\s*мм\s*/i, ""))
    .filter(Boolean)
    .sort((a, b) => Number(a) - Number(b))
    .join(", ");
  const fill = (s) =>
    String(s || "").replace(/\{(\w+)\}/g, (_, k) =>
      ({ min, base, sizes, max: maxTier }[k] ?? "")
    );

  return (
    <section className={`${PLATE} px-6 py-9 md:px-12 md:py-12 mb-10`}>
      <div aria-hidden="true" className={GLOW_PRIMARY} />
      <div aria-hidden="true" className={GLOW_SECONDARY} />

      <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
        {/* DOM: H1 → відповідь → факти → дії; на мобільному факти й дії
            піднімаються через order (як на гео-лендингах). */}
        <div className="flex flex-col gap-6 md:gap-7">
          <h1 className="order-1 not-italic font-e-ukraine font-medium text-[28px] md:text-[42px] leading-[1.1] text-white text-balance">
            {hero.h1}
          </h1>
          <p className="order-4 lg:order-2 not-italic font-e-ukraine font-thin text-[15px] md:text-[18px] leading-relaxed text-[rgba(216,236,248,0.82)] max-w-[640px]">
            {fill(hero.lead)}
          </p>
          <ul className="order-2 lg:order-3 flex flex-wrap gap-2.5">
            {hero.facts.map((f) => (
              <li key={f} className={GLASS_CHIP}>
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#6aa6ff]" />
                {fill(f)}
              </li>
            ))}
          </ul>
          <div className="order-3 lg:order-4 flex flex-col sm:flex-row gap-3">
            <a href="#tovary" className={`${GLASS_PILL} h-[54px] w-full sm:w-[260px] order-2 sm:order-1`}>
              {hero.ctaProducts}
            </a>
            <div className="order-1 sm:order-2">
              <GeoCta label={hero.ctaQuote} title={hero.modalTitle} context={context} />
            </div>
          </div>
          <MessengerButtons align="start" className="order-3 lg:order-5" />
        </div>

        {tiers.length > 0 && (
          <aside className={`${GLASS} isolate p-6 md:p-7`}>
            <h2 className="not-italic font-e-ukraine font-medium text-[17px] md:text-[18px] text-white">
              {hero.priceTitle}
            </h2>
            <dl className="mt-4 flex flex-col gap-3">
              {tiers.map((t) => (
                <div key={t.min} className="flex items-baseline justify-between gap-4">
                  <dt className="not-italic font-e-ukraine font-thin text-[15px] text-[rgba(216,236,248,0.6)]">
                    {t.min}–{t.max} {labels.kg}
                  </dt>
                  <dd className="not-italic font-e-ukraine text-[17px] text-white">
                    {t.price} {labels.kgUnit}
                  </dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4">
                <dt className="not-italic font-e-ukraine font-thin text-[15px] text-[rgba(216,236,248,0.6)]">
                  {fill(labels.over)}
                </dt>
                <dd className="not-italic font-e-ukraine text-[15px] text-white">
                  {labels.negotiable}
                </dd>
              </div>
            </dl>
            <div className={`${HAIRLINE} my-5`} />
            <p className="not-italic font-e-ukraine font-thin text-[14px] leading-relaxed text-[rgba(216,236,248,0.6)]">
              {hero.priceNote}
            </p>
            <Link href="/opt" className="mt-3 inline-block not-italic font-e-ukraine text-[14px] font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
              {hero.optLink} →
            </Link>
          </aside>
        )}
      </div>
    </section>
  );
}

// «Де купити сухий лід» — пряма відповідь на «де купити / в аптеці» з
// посиланнями на склади й доставку.
export function WhereToBuy({ hero }) {
  if (!hero.where?.length) return null;
  return (
    <section className="mb-16">
      <h2 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-3 text-black">
        {hero.whereTitle}
      </h2>
      <p className="not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/75 mb-6 max-w-[860px]">
        {hero.whereText}
      </p>
      <ul className="grid sm:grid-cols-3 gap-4">
        {hero.where.map((w) => (
          <li key={w.title} className="rounded-[14px] border border-commonBlue/15 p-5 flex flex-col gap-2">
            <h3 className="not-italic font-e-ukraine font-medium text-[17px] text-commonBlue">{w.title}</h3>
            <p className="flex-1 not-italic font-e-ukraine font-thin text-[15px] leading-relaxed text-black/75">{w.text}</p>
            <Link href={w.href} className="not-italic font-e-ukraine text-[15px] font-medium text-commonBlue underline decoration-commonBlue/30 underline-offset-4 hover:decoration-commonBlue">
              {w.cta} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
