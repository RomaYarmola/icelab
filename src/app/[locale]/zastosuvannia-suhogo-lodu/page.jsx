import Container from "@/utils/Container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Breadcrumbs from "@/app/components/common/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { CATEGORIES } from "@/lib/categories";

const PATH = "/zastosuvannia-suhogo-lodu";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Applications" });
  const canonical = locale === routing.defaultLocale ? PATH : `/${locale}${PATH}`;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical,
      languages: { uk: PATH, ru: `/ru${PATH}`, "x-default": PATH },
    },
  };
}

export default async function ApplicationsPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Applications" });
  const tcat = await getTranslations({ locale, namespace: "Categories" });
  const sections = t.raw("sections");

  return (
    <div className="bg-white">
      <Container>
        <div className="pt-[140px] md:pt-[200px] pb-[80px] md:pb-[120px] max-w-[900px] mx-auto">
          <Breadcrumbs items={[{ name: t("h1") }]} />
          <h1 className="not-italic font-e-ukraine font-medium text-[28px] md:text-[40px] leading-tight mb-6 text-black">
            {t("h1")}
          </h1>
          <p className="not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/75 mb-8">
            {t("intro")}
          </p>

          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-12">
            <Image
              src="/images/pages/applications.webp"
              alt={t("h1")}
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-10">
            {sections.map((s, i) => (
              <section key={i}>
                <h2 className="not-italic font-e-ukraine font-medium text-[20px] md:text-[26px] mb-3 text-black">
                  {s.title}
                </h2>
                <p className="not-italic font-e-ukraine font-thin text-[15px] md:text-[17px] leading-relaxed text-black/75">
                  {s.text}
                </p>
              </section>
            ))}
          </div>

          {/* Перелінковка на категорії/товари (P1-11) */}
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
