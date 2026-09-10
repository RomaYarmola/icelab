import Container from "@/utils/Container";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Breadcrumbs from "../../common/Breadcrumbs";
import JsonLd from "../../common/JsonLd";
import FaqSection from "@/app/components/common/FaqSection";
import CatalogList from "@/app/components/main/Catalog/CatalogList";
import PriceTiersTable from "@/app/components/common/PriceTiersTable";
import GeoCta from "./GeoCta";
import GradientButton from "../../common/GradientButton";
import { GEO_LABELS, CITIES, cityBySlug } from "@/lib/cities";
import { localBusinessSchema, itemListSchema } from "@/lib/schema";
import { getProductsByCategory } from "@/lib/products";
import { getPriceSettings } from "@/lib/priceSettings";
import { featuredDryIce } from "@/lib/featured";

// Гео-лендинг міста «сухий лід у <місті>». Дані — з lib/cities.js.
//
// Вересень 2026, після аудиту: сторінка була суцільним текстом без товарів
// і цін, а розмічена як Service. Людина з запиту «купити сухий лід львів»
// не бачила ні ціни, ні кнопки — і йшла. Тепер:
//  • товарна сітка з цінами й кошиком одразу під інтро;
//  • таблиця цін за обсягом (та сама сітка, що рахує кошик);
//  • райони доставки, як доїхати, карта складу;
//  • розмітка: ItemList із Product/Offer (сторінка ПРОДАЖУ товару) +
//    LocalBusiness з координатами і карткою GBP там, де є склад +
//    FAQPage + BreadcrumbList. Service прибрано.
const PICKUP_IMAGE = "/images/pages/facility.webp";

function fill(s, vars) {
  return String(s || "").replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export default async function GeoLanding({ slug, locale }) {
  const city = cityBySlug(slug);
  if (!city) return null;

  const c = city[locale] || city.uk;
  const L = GEO_LABELS[locale] || GEO_LABELS.uk;
  const path = `/${slug}`;
  const pickup = city.pickupAddress
    ? city.pickupAddress[locale] || city.pickupAddress.uk
    : null;
  const pickupParts = city.pickupLocality
    ? city.pickupLocality[locale] || city.pickupLocality.uk
    : null;
  const served = city.areaServed
    ? city.areaServed[locale] || city.areaServed.uk
    : c.city;
  const others = CITIES.filter((x) => x.slug !== slug);

  const [dryIce, settings] = await Promise.all([
    getProductsByCategory(locale, "dry-ice"),
    getPriceSettings(),
  ]);
  const featured = featuredDryIce(dryIce, 6);
  const priceLabels = {
    headVolume: L.pricesHeadVolume,
    headPrice: L.pricesHeadPrice,
    over: L.pricesOver,
    negotiable: L.pricesNegotiable,
    box: L.pricesBox,
    boxUnit: L.pricesBoxUnit,
    kgUnit: L.pricesKgUnit,
  };

  const pill =
    "inline-block rounded-full border border-commonBlue/30 px-5 py-2 not-italic font-e-ukraine text-commonBlue hover:bg-commonBlue/10 transition-colors";
  const h2 =
    "not-italic font-e-ukraine font-medium text-[22px] md:text-[28px] mb-5 text-black";
  const p =
    "not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/75";

  const mapEmbed = city.geo
    ? `https://www.google.com/maps?q=${city.geo.lat},${city.geo.lng}&z=13&hl=${locale}&output=embed`
    : null;

  return (
    <div className="bg-white">
      {/* Сторінка продає товар → Product/Offer списком, з областю продажу */}
      <JsonLd
        data={itemListSchema({
          name: c.h1,
          products: featured,
          areaServed: c.city,
          url: path,
        })}
      />
      {/* LocalBusiness — лише там, де є фізична точка самовивозу */}
      {pickup && (
        <JsonLd
          data={localBusinessSchema({
            name: `IceLab — ${c.city}`,
            address: pickup,
            addressLocality: pickupParts?.locality,
            addressRegion: pickupParts?.region,
            postalCode: city.postalCode,
            url: path,
            id: `localbusiness-${city.key}`,
            areaServed: served,
            geo: city.geo,
            hasMap: city.mapsUrl,
            sameAs: city.mapsUrl ? [city.mapsUrl] : undefined,
            images: [PICKUP_IMAGE, "/og-icelab.jpg"],
          })}
        />
      )}

      <Container className="pt-[130px] md:pt-[180px] pb-[100px] md:pb-[140px]">
        <Breadcrumbs items={[{ name: c.h1 }]} />

        <h1 className="text-3xl md:text-4xl main-title-gradient mb-6">{c.h1}</h1>

        {/* Інтро + картка доставки */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-14">
          <div className="lg:flex-1 flex flex-col gap-4">
            {c.intro.map((t, i) => (
              <p key={i} className={p}>
                {t}
              </p>
            ))}
            <div className="flex flex-col sm:flex-row gap-4 mt-3">
              <GeoCta
                label={L.ctaButton}
                title={L.ctaModalTitle}
                context={c.h1}
              />
              <Link href="/catalog/c/suhyi-lid" className="flex w-full sm:w-[300px]">
                <GradientButton variant="outline" text={L.catalogCta} />
              </Link>
            </div>
          </div>

          <div className="lg:w-[36%] rounded-[14px] border border-commonBlue/15 bg-commonBlue/[0.02] p-6 self-start">
            <h2 className="text-lg font-medium text-commonBlue mb-3 not-italic font-e-ukraine">
              {L.deliveryTitle}
            </h2>
            <p className="not-italic font-e-ukraine font-thin text-black/80 leading-relaxed">
              {c.deliveryNote}
            </p>

            {/* Видимий NAP там, де є фізичний склад (Київ, Львів). Та сама
                адреса йде в LocalBusiness — розмітка й видимий текст мають
                збігатися, інакше локальні сигнали не зараховуються. */}
            {pickup && (
              <div className="mt-5 pt-5 border-t border-commonBlue/15 flex flex-col gap-1.5">
                <p className="not-italic font-e-ukraine text-[13px] uppercase tracking-wide text-commonBlue/60">
                  {L.pickupTitle}
                </p>
                <address className="not-italic font-e-ukraine font-thin text-black/85 leading-relaxed">
                  {pickup}
                </address>
                <p className="not-italic font-e-ukraine font-thin text-black/60 text-[15px]">
                  {L.hoursLabel}: {L.hours}
                </p>
                {city.mapsUrl && (
                  <a
                    href={city.mapsUrl}
                    target="_blank"
                    rel="noopener"
                    className="mt-2 self-start text-[14px] not-italic font-e-ukraine text-commonBlue underline decoration-commonBlue/30 underline-offset-4 hover:decoration-commonBlue"
                  >
                    {L.routeCta}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Товари з цінами — те, за чим прийшли з пошуку */}
        {featured.length > 0 && (
          <section className="mb-16">
            <h2 className={h2}>{fill(L.productsTitle, { cityIn: c.cityIn })}</h2>
            <p className={`${p} mb-6 max-w-[860px]`}>{L.productsText}</p>
            <CatalogList products={featured} />
            <div className="mt-6">
              <Link href="/catalog" className={pill}>
                {L.allProductsCta}
              </Link>
            </div>
          </section>
        )}

        {/* Таблиця цін за обсягом */}
        <section className="mb-16 max-w-[760px]">
          <h2 className={h2}>{fill(L.pricesTitle, { cityIn: c.cityIn })}</h2>
          <PriceTiersTable
            tiers={settings.dryIceTiers}
            boxes={settings.boxPrices}
            labels={priceLabels}
            caption={fill(L.pricesTitle, { cityIn: c.cityIn })}
          />
          <p className={`${p} mt-4 text-[15px] md:text-[16px]`}>{L.pricesNote}</p>
        </section>

        {/* Райони доставки + як доїхати + карта (лише міста зі складом) */}
        {c.zones?.length > 0 && (
          <section className="mb-16">
            <h2 className={h2}>{fill(L.zonesTitle, { cityIn: c.cityIn })}</h2>
            <ul className="grid sm:grid-cols-3 gap-4 md:gap-6 mb-5">
              {c.zones.map((z, i) => (
                <li
                  key={i}
                  className="rounded-[14px] border border-commonBlue/15 p-5 flex flex-col gap-2"
                >
                  <h3 className="not-italic font-e-ukraine font-medium text-[17px] text-commonBlue">
                    {z.name}
                  </h3>
                  <p className="not-italic font-e-ukraine font-thin text-[15px] leading-relaxed text-black/75">
                    {z.areas}
                  </p>
                </li>
              ))}
            </ul>
            {c.zonesNote && <p className={`${p} max-w-[900px]`}>{c.zonesNote}</p>}

            {pickup && (
              <div className="grid lg:grid-cols-2 gap-8 mt-10 items-start">
                <div className="flex flex-col gap-4">
                  <h3 className="not-italic font-e-ukraine font-medium text-[20px] md:text-[22px] text-black">
                    {L.directionsTitle}
                  </h3>
                  {(c.directions || []).map((t, i) => (
                    <p key={i} className={p}>
                      {t}
                    </p>
                  ))}
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mt-2">
                    <Image
                      src={PICKUP_IMAGE}
                      alt={`${L.pickupTitle} — ${pickup}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                {mapEmbed && (
                  <div className="rounded-2xl overflow-hidden border border-commonBlue/15 aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[420px]">
                    <iframe
                      title={L.mapTitle}
                      src={mapEmbed}
                      width="100%"
                      height="100%"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                      className="w-full h-full min-h-[320px] border-0"
                    />
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Локальні сценарії використання (унікальний контент міста) */}
        {c.local?.length > 0 && (
          <section className="mb-16 max-w-[900px]">
            <h2 className={h2}>{c.localTitle}</h2>
            <div className="flex flex-col gap-4">
              {c.local.map((t, i) => (
                <p key={i} className={p}>
                  {t}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Переваги */}
        <section className="mb-16">
          <h2 className={h2}>{L.uspTitle}</h2>
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

        {/* Категорії + опт, інші міста (анкор — повний H1 міста, не назва) */}
        <div className="grid md:grid-cols-2 gap-10">
          <section>
            <h2 className="not-italic font-e-ukraine font-medium text-[20px] md:text-[24px] mb-5 text-black">
              {L.categoriesTitle}
            </h2>
            <ul className="flex flex-wrap gap-3">
              {L.categories.map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} className={pill}>
                    {cat.label}
                  </Link>
                </li>
              ))}
              {L.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={pill}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="not-italic font-e-ukraine font-medium text-[20px] md:text-[24px] mb-5 text-black">
              {L.otherCitiesTitle}
            </h2>
            <ul className="flex flex-wrap gap-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/${o.slug}`} className={pill}>
                    {(o[locale] || o.uk).h1}
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
