import { Link } from "@/i18n/navigation";
import { NICHE_LABELS, liveNiches } from "@/lib/niches";
import { NICHE_HUB_PATH, nichePath } from "@/lib/nicheEngine";

// Контекстні посилання на нішеві посадкові «сухий лід для задачі».
//
// НАВІЩО. До 16.09 живі ніші мали посилання лише з хабу й карток товарів:
// ні шапка, ні головна, ні категорії, ні гео-лендинги на них не вели, тож
// сторінки існували, але на сайті їх не можна було знайти (і Google бачив
// їх лише з sitemap). Блок стоїть на головній, у категоріях і на гео.
//
// props:
//  • niches  — список ніш (за замовчуванням усі живі);
//  • variant — "cards" (сітка карток з описом) або "pills" (компактні анкори);
//  • title / text — заголовок і підзаголовок; withHub — посилання на хаб.
export default function NicheLinks({
  locale,
  niches,
  title,
  text,
  variant = "cards",
  withHub = true,
}) {
  const L = NICHE_LABELS[locale] || NICHE_LABELS.uk;
  const list = niches || liveNiches();
  if (!list.length) return null;

  const hubLink = withHub && (
    <Link
      href={NICHE_HUB_PATH}
      className="inline-block not-italic font-e-ukraine text-[15px] font-medium text-commonBlue underline decoration-commonBlue/30 underline-offset-4 hover:decoration-commonBlue"
    >
      {L.hubAll} →
    </Link>
  );

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 mb-6">
        <div className="max-w-[760px]">
          <h2 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] leading-tight text-black text-balance">
            {title || L.sectionTitle}
          </h2>
          {text && (
            <p className="mt-2 not-italic font-e-ukraine font-thin text-[15px] md:text-[17px] leading-relaxed text-black/70">
              {text}
            </p>
          )}
        </div>
        {variant === "cards" && hubLink}
      </div>

      {variant === "pills" ? (
        <>
          <ul className="flex flex-wrap gap-3">
            {list.map((n) => (
              <li key={n.slug}>
                <Link
                  href={nichePath(n.slug)}
                  className="inline-block rounded-full border border-commonBlue/30 px-5 py-2 not-italic font-e-ukraine text-commonBlue hover:bg-commonBlue/10 transition-colors"
                >
                  {(n[locale] || n.uk).h1}
                </Link>
              </li>
            ))}
          </ul>
          {withHub && <div className="mt-5">{hubLink}</div>}
        </>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((n) => {
            const c = n[locale] || n.uk;
            return (
              <li key={n.slug}>
                <Link
                  href={nichePath(n.slug)}
                  className="group flex h-full flex-col rounded-[16px] border border-commonBlue/15 bg-white p-6 transition-colors hover:border-commonBlue/40 hover:bg-commonBlue/[0.03]"
                >
                  <span className="not-italic font-e-ukraine font-medium text-[18px] leading-snug text-black group-hover:text-commonBlue">
                    {c.h1}
                  </span>
                  <span className="mt-2 flex-1 not-italic font-e-ukraine font-thin text-[15px] leading-relaxed text-black/65">
                    {c.cardText}
                  </span>
                  <span className="mt-4 not-italic font-e-ukraine text-[14px] font-medium text-commonBlue">
                    {L.hubMore} →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
