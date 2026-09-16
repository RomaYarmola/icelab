import Container from "@/utils/Container";
import { Link } from "@/i18n/navigation";
import Breadcrumbs from "@/app/components/common/Breadcrumbs";
import JsonLd from "@/app/components/common/JsonLd";
import FaqSection from "@/app/components/common/FaqSection";
import CatalogList from "@/app/components/main/Catalog/CatalogList";
import CityPickupLinks from "@/app/components/common/CityPickupLinks";
import CryoRentBlock from "@/app/components/main/Catalog/CryoRentBlock";
import EmergencySupplyBlock from "./EmergencySupplyBlock";
import GeoCta from "@/app/components/main/Geo/GeoCta";
import { itemListSchema } from "@/lib/schema";
import { getProducts } from "@/lib/products";
import { NICHES, NICHE_LABELS, NICHE_GROUPS, liveNiches } from "@/lib/niches";
import { productsForNiche, nichePath, NICHE_HUB_PATH } from "@/lib/nicheEngine";
import { formatPrice } from "@/utils/pricing";
import {
  PLATE,
  GLASS,
  HAIRLINE,
  GLASS_PILL,
  GLASS_CHIP,
  GLOW_PRIMARY,
  GLOW_SECONDARY,
} from "@/app/components/common/glass";

// Шаблон нішевої посадкової «сухий лід для <задачі>». Дані — lib/niches.js,
// товари підбираються правилами з lib/nicheEngine.js.
//
// Порядок блоків іде за тим, як людина вирішує покупку під конкретну задачу:
//  1. перший екран — пряма відповідь («скільки, яка гранула, скільки коштує»)
//     і готовий набір, щоб можна було замовити одразу;
//  2. товари — те, що прикріплено до задачі, з цінами й кошиком;
//  3. як це працює — кроки, щоб зняти страх «не впораюсь сам»;
//  4. скільки брати — таблиця під масштаб задачі;
//  5. безпека — окремим блоком, бо це головне заперечення в побутових нішах;
//  6. FAQ (FAQPage), CTA, схожі задачі й склади по містах.
//
// Перший абзац (lead) пишеться як самодостатня відповідь на 40–60 слів:
// саме його цитують AI-відповіді й сніпети.
export default async function NicheLanding({ slug, locale }) {
  const niche = NICHES.find((n) => n.slug === slug);
  if (!niche) return null;

  const c = niche[locale] || niche.uk;
  const L = NICHE_LABELS[locale] || NICHE_LABELS.uk;
  const group = NICHE_GROUPS[niche.group];
  const g = group ? group[locale] || group.uk : null;
  const path = nichePath(niche.slug);

  const all = await getProducts(locale);
  const products = productsForNiche(niche, all, 9);
  const minPrice = products.length
    ? Math.min(...products.map((p) => Number(p.price) || Infinity))
    : null;

  // Схожі задачі: спершу з тієї ж групи, потім інші — щоб ніші підсилювали
  // одна одну, а не висіли окремими URL.
  // niche.related — ручний пріоритет (напр. аварійне охолодження ↔ доставка
  // ↔ лабораторії), щоб сусідні сторінки ділили запити, а не конкурували.
  const live = liveNiches().filter((n) => n.slug !== niche.slug);
  const pinned = (niche.related || [])
    .map((s) => live.find((n) => n.slug === s))
    .filter(Boolean);
  const rest = live.filter((n) => !pinned.includes(n));
  const related = [
    ...pinned,
    ...rest.filter((n) => n.group === niche.group),
    ...rest.filter((n) => n.group !== niche.group),
  ].slice(0, 6);

  const h2 =
    "not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-5 text-black";
  const p =
    "not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/75";
  const cell = "px-4 py-3 not-italic font-e-ukraine text-[15px] md:text-[16px]";

  return (
    <div className="bg-white">
      {products.length > 0 && (
        <JsonLd
          data={itemListSchema({ name: c.h1, products, url: path })}
        />
      )}

      <Container className="pt-[120px] md:pt-[150px] pb-[100px] md:pb-[140px]">
        <Breadcrumbs
          items={[
            { name: L.hubCrumb, href: NICHE_HUB_PATH },
            { name: c.title },
          ]}
        />

        {/* ПЕРШИЙ ЕКРАН — та сама мова, що й гео-лендинги (components/common/glass.js). */}
        <section className={`${PLATE} px-6 py-9 md:px-12 md:py-12 mb-14`}>
          <div aria-hidden="true" className={GLOW_PRIMARY} />
          <div aria-hidden="true" className={GLOW_SECONDARY} />

          <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
            {/* Порядок у DOM: H1 → відповідь → факти → дії. На мобільному
                факти й кнопки піднімаються вище через order (див. GeoLanding). */}
            <div className="flex flex-col gap-6 md:gap-7">
              {g && (
                <p className="order-1 not-italic font-e-ukraine text-[12px] uppercase tracking-[0.08em] text-[rgba(216,236,248,0.55)]">
                  {g.title}
                </p>
              )}
              <h1 className="order-1 -mt-3 not-italic font-e-ukraine font-medium text-[28px] md:text-[42px] leading-[1.1] text-white text-balance">
                {c.h1}
              </h1>
              <p className="order-4 lg:order-2 not-italic font-e-ukraine font-thin text-[15px] md:text-[18px] leading-relaxed text-[rgba(216,236,248,0.82)] max-w-[640px]">
                {c.lead}
              </p>
              {c.facts?.length > 0 && (
                <ul className="order-2 lg:order-3 flex flex-wrap gap-2.5">
                  {c.facts.map((f) => (
                    <li key={f} className={GLASS_CHIP}>
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#6aa6ff]" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              <div className="order-3 lg:order-4 flex flex-col sm:flex-row gap-3">
                <GeoCta label={L.ctaButton} title={L.ctaModalTitle} context={c.h1} />
                {products.length > 0 && (
                  <a href="#tovary" className={`${GLASS_PILL} h-[54px] w-full sm:w-[260px]`}>
                    {L.productsCta}
                  </a>
                )}
              </div>
            </div>

            {/* Готовий набір під задачу — те, що людина може назвати менеджеру. */}
            {c.set?.length > 0 && (
              <aside className={`${GLASS} isolate p-6 md:p-7`}>
                <h2 className="not-italic font-e-ukraine font-medium text-[17px] md:text-[18px] text-white">
                  {c.setTitle || L.setTitle}
                </h2>
                <dl className="mt-4 flex flex-col gap-3">
                  {c.set.map((row) => (
                    <div key={row.label} className="flex items-baseline justify-between gap-4">
                      <dt className="not-italic font-e-ukraine font-thin text-[14px] text-[rgba(216,236,248,0.55)]">
                        {row.label}
                      </dt>
                      <dd className="not-italic font-e-ukraine text-[15px] text-right text-[rgba(255,255,255,0.92)]">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {Number.isFinite(minPrice) && (
                  <>
                    <div className={`${HAIRLINE} my-5`} />
                    <p className="not-italic font-e-ukraine font-thin text-[14px] text-[rgba(216,236,248,0.55)]">
                      {L.fromPrice}
                    </p>
                    <p className="mt-1 not-italic font-e-ukraine font-medium text-[28px] leading-none text-white">
                      {formatPrice(minPrice)}
                      <span className="ml-1 text-[15px] font-thin text-[rgba(216,236,248,0.7)]">
                        {L.currency}
                      </span>
                    </p>
                  </>
                )}
              </aside>
            )}
          </div>
        </section>

        {/* Товари під задачу */}
        {products.length > 0 && (
          <section id="tovary" className="mb-16 scroll-mt-[110px]">
            <h2 className={h2}>{c.productsTitle || L.productsTitle}</h2>
            {c.productsText && <p className={`${p} mb-6 max-w-[860px]`}>{c.productsText}</p>}
            <CatalogList products={products} />
          </section>
        )}

        {/* Аварійна поставка — B2B-ніші, де лід потрібен терміново й багато */}
        {niche.emergency && (
          <div className="mb-16">
            <EmergencySupplyBlock locale={locale} context={c.h1} />
          </div>
        )}

        {/* Сценарії: коли саме бізнес шукає це рішення */}
        {c.scenarios?.length > 0 && (
          <section className="mb-16">
            <h2 className={h2}>{c.scenariosTitle || L.scenariosTitle}</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {c.scenarios.map((s) => (
                <li key={s.title} className="rounded-[14px] border border-commonBlue/15 p-5 md:p-6">
                  <h3 className="not-italic font-e-ukraine font-medium text-[17px] text-black mb-1.5">
                    {s.title}
                  </h3>
                  <p className="not-italic font-e-ukraine font-thin text-[15px] md:text-[16px] leading-relaxed text-black/75">
                    {s.text}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Кріобластинг: апарат не у всіх — оренда через партнерів */}
        {niche.rent && (
          <div className="mb-16">
            <CryoRentBlock locale={locale} />
          </div>
        )}

        {/* Як це працює */}
        {c.steps?.length > 0 && (
          <section className="mb-16">
            <h2 className={h2}>{c.stepsTitle}</h2>
            <ol className="grid md:grid-cols-2 gap-4 md:gap-6">
              {c.steps.map((s, i) => (
                <li key={s.title} className="rounded-[14px] border border-commonBlue/15 p-5 md:p-6 flex gap-4">
                  <span className="shrink-0 grid place-items-center h-9 w-9 rounded-full bg-commonBlue/10 text-commonBlue not-italic font-e-ukraine font-medium tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="not-italic font-e-ukraine font-medium text-[17px] text-black mb-1.5">
                      {s.title}
                    </h3>
                    <p className="not-italic font-e-ukraine font-thin text-[15px] md:text-[16px] leading-relaxed text-black/75">
                      {s.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Скільки брати */}
        {c.dosage?.rows?.length > 0 && (
          <section className="mb-16 max-w-[900px]">
            <h2 className={h2}>{c.dosageTitle}</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse rounded-[14px] overflow-hidden border border-commonBlue/15">
                <thead>
                  <tr className="bg-commonBlue/[0.06] text-left">
                    {c.dosage.head.map((h) => (
                      <th key={h} className={`${cell} font-medium text-commonBlue`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.dosage.rows.map((row, i) => (
                    <tr key={i} className="border-t border-commonBlue/10 align-top">
                      {row.map((v, k) => (
                        <td key={k} className={`${cell} ${k === 0 ? "font-medium text-black" : "font-thin text-black/80"}`}>
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {c.dosageNote && <p className={`${p} mt-4 text-[15px] md:text-[16px]`}>{c.dosageNote}</p>}
          </section>
        )}

        {/* Безпека — окремий блок: головне заперечення в побутових нішах */}
        {c.safety?.length > 0 && (
          <section className="mb-16 max-w-[900px] rounded-[18px] border border-[#F5A524]/35 bg-[#F5A524]/[0.06] p-6 md:p-8">
            <h2 className="not-italic font-e-ukraine font-medium text-[20px] md:text-[24px] mb-4 text-black">
              {c.safetyTitle || L.safetyTitle}
            </h2>
            <ul className="flex flex-col gap-3">
              {c.safety.map((s) => (
                <li key={s} className="flex gap-3 not-italic font-e-ukraine font-thin text-[15px] md:text-[17px] leading-relaxed text-black/80">
                  <span aria-hidden="true" className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#C4841D]" />
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}

        {c.faq?.length > 0 && (
          <section className="mb-16 max-w-[900px]">
            <FaqSection title={L.faqTitle} items={c.faq} />
          </section>
        )}

        {/* CTA-смуга */}
        <section className="rounded-2xl bg-dark-gradient text-white p-8 md:p-10 mb-16 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div>
            <h2 className="text-white text-xl md:text-2xl mb-2 not-italic font-e-ukraine font-medium">
              {c.ctaTitle || L.ctaTitle}
            </h2>
            <p className="not-italic font-e-ukraine font-thin text-white/70">{c.ctaText || L.ctaText}</p>
          </div>
          <div className="shrink-0">
            <GeoCta label={L.ctaButton} title={L.ctaModalTitle} context={c.h1} />
          </div>
        </section>

        {/* Схожі задачі — ніші підсилюють одна одну */}
        {related.length > 0 && (
          <section className="mb-16">
            <h2 className={h2}>{L.relatedTitle}</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((n) => {
                const rc = n[locale] || n.uk;
                return (
                  <li key={n.slug}>
                    <Link
                      href={nichePath(n.slug)}
                      className="group flex h-full flex-col rounded-[14px] border border-commonBlue/15 p-5 transition-colors hover:border-commonBlue/40 hover:bg-commonBlue/[0.03]"
                    >
                      <span className="not-italic font-e-ukraine font-medium text-[17px] text-black group-hover:text-commonBlue">
                        {rc.h1}
                      </span>
                      <span className="mt-1.5 not-italic font-e-ukraine font-thin text-[14px] leading-relaxed text-black/65">
                        {rc.cardText}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <CityPickupLinks locale={locale} />
      </Container>
    </div>
  );
}
