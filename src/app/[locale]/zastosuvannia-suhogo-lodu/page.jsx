import Container from "@/utils/Container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/app/components/common/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { CATEGORIES } from "@/lib/categories";
import { NICHE_GROUPS, NICHE_LABELS, liveNiches } from "@/lib/niches";
import { nichePath } from "@/lib/nicheEngine";

const PATH = "/zastosuvannia-suhogo-lodu";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Applications" });
  return pageMeta({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: PATH,
    locale,
  });
}

// Хаб «Застосування сухого льоду». Раніше — п'ять абзаців без жодного
// посилання на задачу чи товар. Тепер — точка входу в нішеві посадкові:
// групи з lib/niches.js, у кожній — картки живих ніш. Нова ніша зі status
// "live" з'являється тут автоматично; група без живих ніш показує короткий
// опис, щоб хаб лишався корисним і до запуску сторінок.
export default async function ApplicationsPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Applications" });
  const tcat = await getTranslations({ locale, namespace: "Categories" });
  const L = NICHE_LABELS[locale] || NICHE_LABELS.uk;
  const live = liveNiches();

  const groups = Object.entries(NICHE_GROUPS)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([key, g]) => ({
      key,
      ...(g[locale] || g.uk),
      niches: live.filter((n) => n.group === key),
    }));

  return (
    <div className="bg-white">
      <Container>
        <div className="pt-[140px] md:pt-[200px] pb-[80px] md:pb-[120px]">
          <Breadcrumbs items={[{ name: t("h1") }]} />
          <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8 lg:gap-12 items-center mb-16">
            <div>
              <h1 className="not-italic font-e-ukraine font-medium text-[28px] md:text-[40px] leading-tight mb-6 text-black text-balance">
                {t("h1")}
              </h1>
              <p className="not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/75">
                {t("intro")}
              </p>
            </div>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/pages/applications.webp"
                alt={t("h1")}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <h2 className="sr-only">{L.hubGroupsTitle}</h2>
          <div className="flex flex-col gap-14">
            {groups.map((g) => (
              <section key={g.key}>
                <h2 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-2 text-black">
                  {g.title}
                </h2>
                <p className="not-italic font-e-ukraine font-thin text-[15px] md:text-[17px] leading-relaxed text-black/70 mb-6 max-w-[760px]">
                  {g.text}
                </p>
                {g.niches.length > 0 ? (
                  <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {g.niches.map((n) => {
                      const c = n[locale] || n.uk;
                      return (
                        <li key={n.slug}>
                          <Link
                            href={nichePath(n.slug)}
                            className="group flex h-full flex-col rounded-[16px] border border-commonBlue/15 p-6 transition-colors hover:border-commonBlue/40 hover:bg-commonBlue/[0.03]"
                          >
                            <span className="not-italic font-e-ukraine font-medium text-[18px] text-black group-hover:text-commonBlue">
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
                ) : (
                  <p className="not-italic font-e-ukraine font-thin text-[14px] text-black/50">
                    {L.hubSoon}
                  </p>
                )}
              </section>
            ))}
          </div>

          <div className="mt-16">
            <ul className="flex flex-wrap gap-4">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/catalog/c/${c.slug}`}
                    className="inline-block rounded-full border border-commonBlue/30 px-5 py-2 not-italic font-e-ukraine text-commonBlue hover:bg-commonBlue/10 transition-colors"
                  >
                    {tcat(`${c.msgKey}.h1`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}
