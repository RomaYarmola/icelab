import Container from "@/utils/Container";
import { Link } from "@/i18n/navigation";
import Breadcrumbs from "../../common/Breadcrumbs";
import JsonLd from "../../common/JsonLd";
import FaqSection from "@/app/components/common/FaqSection";
import GeoCta from "./GeoCta";
import { GEO_LABELS, CITIES, cityBySlug } from "@/lib/cities";
import { localBusinessSchema, serviceSchema } from "@/lib/schema";

// Гео-лендинг міста «сухий лід у <місті>». Дані — з lib/cities.js.
// Верстка на всю ширину сайту (Container), у стилі проєкту.
// Розмітка: Service (завжди) + LocalBusiness (лише де є фізичний склад —
// Київ/Львів) + FAQPage (рендерить FaqSection) + BreadcrumbList (Breadcrumbs).
export default function GeoLanding({ slug, locale }) {
  const city = cityBySlug(slug);
  if (!city) return null;

  const c = city[locale] || city.uk;
  const L = GEO_LABELS[locale] || GEO_LABELS.uk;
  const path = `/${slug}`;
  const pickup = city.pickupAddress
    ? city.pickupAddress[locale] || city.pickupAddress.uk
    : null;
  const others = CITIES.filter((x) => x.slug !== slug);

  const pill =
    "inline-block rounded-full border border-commonBlue/30 px-5 py-2 not-italic font-e-ukraine text-commonBlue hover:bg-commonBlue/10 transition-colors";

  return (
    <div className="bg-white">
      {/* Service — завжди (продаж/доставка льоду в місті) */}
      <JsonLd
        data={serviceSchema({
          name: `Сухий лід ${c.cityIn}`,
          areaServed: c.city,
          url: path,
          description: c.metaDescription,
        })}
      />
      {/* LocalBusiness — лише там, де є фізична точка самовивозу */}
      {pickup && (
        <JsonLd
          data={localBusinessSchema({
            name: `IceLab — ${c.city}`,
            address: pickup,
            url: path,
            id: `localbusiness-${city.key}`,
            areaServed: c.city,
          })}
        />
      )}

      <Container className="pt-[130px] md:pt-[180px] pb-[100px] md:pb-[140px]">
        <Breadcrumbs items={[{ name: c.h1 }]} />

        <h1 className="text-3xl md:text-4xl main-title-gradient mb-6">{c.h1}</h1>

        {/* Інтро + картка доставки */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-16">
          <div className="lg:flex-1 flex flex-col gap-4">
            {c.intro.map((p, i) => (
              <p
                key={i}
                className="not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/75"
              >
                {p}
              </p>
            ))}
            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <Link
                href="/catalog"
                className="inline-flex justify-center items-center rounded-full bg-commonBlue text-white px-7 py-3 not-italic font-e-ukraine hover:opacity-90 transition-opacity"
              >
                {L.catalogCta}
              </Link>
              <GeoCta
                label={L.ctaButton}
                title={L.ctaModalTitle}
                context={c.h1}
              />
            </div>
          </div>

          <div className="lg:w-[36%] rounded-[14px] border border-commonBlue/15 bg-commonBlue/[0.02] p-6 self-start">
            <h2 className="text-lg font-medium text-commonBlue mb-3 not-italic font-e-ukraine">
              {L.deliveryTitle}
            </h2>
            <p className="not-italic font-e-ukraine font-thin text-black/80 leading-relaxed">
              {c.deliveryNote}
            </p>
          </div>
        </div>

        {/* Локальні сценарії використання (унікальний контент міста) */}
        {c.local?.length > 0 && (
          <section className="mb-16 max-w-[900px]">
            <h2 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-5 text-black">
              {c.localTitle}
            </h2>
            <div className="flex flex-col gap-4">
              {c.local.map((p, i) => (
                <p
                  key={i}
                  className="not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/75"
                >
                  {p}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Переваги */}
        <section className="mb-16">
          <h2 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-6 text-black">
            {L.uspTitle}
          </h2>
          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
            {L.usp.map((u, i) => (
              <li
                key={i}
                className="flex gap-3 not-italic font-e-ukraine font-thin text-[15px] md:text-[17px] leading-relaxed text-black/80"
              >
                <span className="mt-[10px] w-1.5 h-1.5 rounded-full bg-commonBlue shrink-0" />
                {u}
              </li>
            ))}
          </ul>
        </section>

        {/* Категорії */}
        <section className="mb-16">
          <h2 className="not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-5 text-black">
            {L.catalogTitle}
          </h2>
          <p className="not-italic font-e-ukraine font-thin text-black/70 mb-5">
            {L.catalogText}
          </p>
          <ul className="flex flex-wrap gap-4">
            {L.categories.map((cat) => (
              <li key={cat.href}>
                <Link href={cat.href} className={pill}>
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Локальний FAQ (+ FAQPage schema всередині FaqSection) */}
        {c.faq?.length > 0 && (
          <section className="mb-16 max-w-[900px]">
            <FaqSection title={L.faqTitle} items={c.faq} />
          </section>
        )}

        {/* CTA-смуга */}
        <section className="rounded-2xl bg-dark-gradient text-white p-8 md:p-10 mb-16 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div>
            <h2 className="text-white text-xl md:text-2xl mb-2 not-italic font-e-ukraine font-medium">
              {L.ctaTitle}
            </h2>
            <p className="not-italic font-e-ukraine font-thin text-white/70">
              {L.ctaText}
            </p>
          </div>
          <div className="shrink-0">
            <GeoCta label={L.ctaButton} title={L.ctaModalTitle} context={c.h1} />
          </div>
        </section>

        {/* Інші міста + корисні посилання */}
        <div className="grid md:grid-cols-2 gap-10">
          <section>
            <h2 className="not-italic font-e-ukraine font-medium text-[20px] md:text-[24px] mb-5 text-black">
              {L.otherCitiesTitle}
            </h2>
            <ul className="flex flex-wrap gap-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/${o.slug}`} className={pill}>
                    {(o[locale] || o.uk).city}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="not-italic font-e-ukraine font-medium text-[20px] md:text-[24px] mb-5 text-black">
              {L.linksTitle}
            </h2>
            <ul className="flex flex-wrap gap-3">
              {L.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={pill}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Container>
    </div>
  );
}
