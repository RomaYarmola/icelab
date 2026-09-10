import Container from "@/utils/Container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/app/components/common/Breadcrumbs";
import FaqSection from "@/app/components/common/FaqSection";
import JsonLd from "@/app/components/common/JsonLd";
import GeoCta from "@/app/components/main/Geo/GeoCta";
import CityPickupLinks from "@/app/components/common/CityPickupLinks";
import { serviceSchema } from "@/lib/schema";
import { CATEGORIES } from "@/lib/categories";

const PATH = "/opt";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Wholesale" });
  return {
    ...pageMeta({
      title: t("metaTitle"),
      description: t("metaDescription"),
      path: PATH,
      locale,
    }),
    keywords: t("keywords"),
  };
}

// Посадкова під «сухий лід оптом» / B2B: ціни за обсягом, умови роботи з
// бізнесом, сегменти, FAQ (FAQPage schema) і заявка на прайс.
export default async function WholesalePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Wholesale" });
  const tu = await getTranslations({ locale, namespace: "Usp" });
  const tcat = await getTranslations({ locale, namespace: "Categories" });
  const tb = await getTranslations({ locale, namespace: "Breadcrumbs" });

  const intro = t.raw("intro");
  const prices = t.raw("prices");
  const terms = t.raw("terms");
  const segments = t.raw("segments");
  const faq = t.raw("faq");
  const usp = tu.raw("items");

  const pill =
    "inline-block rounded-full border border-commonBlue/30 px-5 py-2 not-italic font-e-ukraine text-commonBlue hover:bg-commonBlue/10 transition-colors";

  return (
    <div className="bg-white">
      <JsonLd
        data={serviceSchema({
          name: t("h1"),
          url: PATH,
          description: t("metaDescription"),
        })}
      />

      <Container className="pt-[130px] md:pt-[180px] pb-[100px] md:pb-[140px]">
        <Breadcrumbs items={[{ name: tb("wholesale") }]} />

        <h1 className="text-3xl md:text-4xl main-title-gradient mb-6">
          {t("h1")}
        </h1>

        {/* Інтро + прайс-таблиця */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-16 items-start">
          <div className="lg:flex-1 flex flex-col gap-4">
            {intro.map((p, i) => (
              <p
                key={i}
                className="not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/75"
              >
                {p}
              </p>
            ))}
            <div className="mt-3 w-full sm:w-auto">
              <GeoCta
                label={t("ctaButton")}
                title={t("ctaModalTitle")}
                context={t("h1")}
              />
            </div>
          </div>

          <div className="w-full lg:w-[42%] rounded-[14px] border border-commonBlue/15 bg-commonBlue/[0.02] p-6 shrink-0">
            <h2 className="text-lg font-medium text-commonBlue mb-2 not-italic font-e-ukraine">
              {t("pricesTitle")}
            </h2>
            <p className="not-italic font-e-ukraine font-thin text-black/65 text-[14px] leading-relaxed mb-4">
              {t("pricesNote")}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse not-italic font-e-ukraine text-[15px]">
                <thead>
                  <tr className="text-left text-commonBlue/60 text-[13px]">
                    <th className="pb-2 font-normal">{t("pricesHeadVolume")}</th>
                    <th className="pb-2 font-normal text-right">
                      {t("pricesHeadPrice")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((row, i) => (
                    <tr key={i} className="border-t border-commonBlue/15">
                      <td className="py-2.5 pr-4 font-thin text-black/80">
                        {row.volume}
                      </td>
                      <td className="py-2.5 text-right font-medium text-commonBlue">
                        {row.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 not-italic font-e-ukraine font-thin text-black/60 text-[14px] leading-relaxed">
              {t("pricesFootnote")}
            </p>
          </div>
        </div>

        {/* Умови роботи з бізнесом */}
        <section className="mb-16 max-w-[900px]">
          <h2 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-6 text-black">
            {t("termsTitle")}
          </h2>
          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
            {terms.map((item, i) => (
              <li
                key={i}
                className="relative pl-6 not-italic font-e-ukraine font-thin text-[15px] md:text-[17px] leading-relaxed text-black/75 before:absolute before:left-0 before:top-[0.6em] before:w-2 before:h-2 before:rounded-full before:bg-commonBlue"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Сегменти */}
        <section className="mb-16">
          <h2 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-6 text-black">
            {t("segmentsTitle")}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {segments.map((s, i) => (
              <li
                key={i}
                className="rounded-[14px] border border-commonBlue/15 p-5 h-full"
              >
                <h3 className="not-italic font-e-ukraine font-medium text-[17px] md:text-[19px] mb-2 text-commonBlue">
                  {s.title}
                </h3>
                <p className="not-italic font-e-ukraine font-thin text-[15px] leading-relaxed text-black/70">
                  {s.text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Переваги (спільний блок Usp) */}
        <section className="mb-16 max-w-[900px]">
          <h2 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-6 text-black">
            {tu("title")}
          </h2>
          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
            {usp.map((item, i) => (
              <li
                key={i}
                className="relative pl-6 not-italic font-e-ukraine font-thin text-[15px] md:text-[17px] leading-relaxed text-black/75 before:absolute before:left-0 before:top-[0.6em] before:w-2 before:h-2 before:rounded-full before:bg-commonBlue"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Склади відвантаження — контекстні посилання на лендинги міст */}
        <section className="mb-16">
          <CityPickupLinks locale={locale} />
        </section>

        {/* FAQ + FAQPage schema */}
        <section className="mb-16 max-w-[900px]">
          <FaqSection title={t("faqTitle")} items={faq} />
        </section>

        {/* CTA */}
        <section className="rounded-[14px] border border-commonBlue/15 bg-commonBlue/[0.02] p-6 md:p-10 mb-16">
          <h2 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-3 text-black">
            {t("ctaTitle")}
          </h2>
          <p className="not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/75 mb-6 max-w-[640px]">
            {t("ctaText")}
          </p>
          <GeoCta
            label={t("ctaButton")}
            title={t("ctaModalTitle")}
            context={t("h1")}
          />
        </section>

        {/* Перелінковка */}
        <section>
          <h2 className="not-italic font-e-ukraine font-medium text-[20px] md:text-[24px] mb-5 text-black">
            {t("linksTitle")}
          </h2>
          <ul className="flex flex-wrap gap-4">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/catalog/c/${c.slug}`} className={pill}>
                  {tcat(`${c.msgKey}.h1`)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/zastosuvannia-suhogo-lodu" className={pill}>
                {tb("applications")}
              </Link>
            </li>
            <li>
              <Link href="/payment-and-delivery" className={pill}>
                {tb("paymentAndDelivery")}
              </Link>
            </li>
            <li>
              <Link href="/faq" className={pill}>
                {tb("faq")}
              </Link>
            </li>
            <li>
              <Link href="/contacts" className={pill}>
                {tb("contacts")}
              </Link>
            </li>
          </ul>
        </section>
      </Container>
    </div>
  );
}
