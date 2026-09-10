import Container from "@/utils/Container";
import { Link } from "@/i18n/navigation";
import Breadcrumbs from "../../common/Breadcrumbs";
import JsonLd from "../../common/JsonLd";
import FaqSection from "@/app/components/common/FaqSection";
import CatalogList from "@/app/components/main/Catalog/CatalogList";
import PriceTiersTable from "@/app/components/common/PriceTiersTable";
import GeoCta from "./GeoCta";
import { GEO_LABELS, CITIES, cityBySlug } from "@/lib/cities";
import { localBusinessSchema, itemListSchema } from "@/lib/schema";
import { getProductsByCategory } from "@/lib/products";
import { getPriceSettings } from "@/lib/priceSettings";
import { featuredDryIce, mergeTiers } from "@/lib/featured";
import {
  PLATE,
  GLASS,
  HAIRLINE,
  GLASS_PILL,
  GLASS_CHIP,
  GLOW_PRIMARY,
  GLOW_SECONDARY,
} from "@/app/components/common/glass";

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
//
// ФОТО СКЛАДУ. Блок «як доїхати» свідомо БЕЗ фотографії: у репозиторії немає
// жодного власного знімка складів у Вишгороді та Годовиці. Ставити сюди
// будь-яке інше фото не можна — сторінка й LocalBusiness стверджують, що це
// наш склад за конкретною адресою. Коли клієнт надішле реальні фото заїзду,
// додати їх сюди і в images[] у localBusinessSchema.

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

  // Чипи-факти першого екрана. Усі значення виводяться з наявних даних
  // (Price Settings + місто), тож нове місто чи зміна тарифу не потребують
  // ручного редагування контенту.
  const minPrice = Math.min(
    ...mergeTiers(settings.dryIceTiers).map((t) => t.price)
  );
  const granules = (settings.granuleSizes || [])
    .map((s) => String(s).replace(/\s*мм\s*/i, ""))
    .filter(Boolean)
    .sort((a, b) => Number(a) - Number(b))
    .join(", ");
  const fill = (s, vars) =>
    String(s || "").replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  const facts = [
    Number.isFinite(minPrice) ? fill(L.factPrice, { price: minPrice }) : null,
    granules ? fill(L.factGranules, { sizes: granules }) : null,
    pickupParts?.locality
      ? fill(L.factPickup, { locality: pickupParts.locality })
      : L.factDelivery,
    L.factNoMin,
  ].filter(Boolean);

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
          })}
        />
      )}

      <Container className="pt-[120px] md:pt-[150px] pb-[100px] md:pb-[140px]">
        <Breadcrumbs items={[{ name: c.h1 }]} />

        {/* ПЕРШИЙ ЕКРАН. Свідомо компактний: заголовок, самодостатня відповідь
            (ціна, гранула, адреса, мінімум), факти-чипи, дві дії й картка
            складу — усе в межах одного екрана. Копіювати висоту головної
            (864 px з важким фоном) сюди не можна: це виштовхнуло б ціну й
            адресу за перший екран, а саме перший абзац цитують AI-відповіді. */}
        <section className={`${PLATE} px-6 py-9 md:px-12 md:py-12 mb-14`}>
          <div aria-hidden="true" className={GLOW_PRIMARY} />
          <div aria-hidden="true" className={GLOW_SECONDARY} />

          <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
            {/* Порядок у DOM: H1 → відповідь-абзац → факти → дії. Саме така
                послідовність потрібна пошуку та AI-відповідям (абзац одразу
                під заголовком). На мобільному абзац займає ~10 рядків і
                виштовхує кнопки за екран, тому там факти й дії піднімаються
                вище через order — розмітка при цьому не змінюється. */}
            <div className="flex flex-col gap-6 md:gap-7">
              <h1 className="order-1 not-italic font-e-ukraine font-medium text-[28px] md:text-[42px] leading-[1.1] text-white text-balance">
                {c.h1}
              </h1>

              <p className="order-4 lg:order-2 not-italic font-e-ukraine font-thin text-[15px] md:text-[18px] leading-relaxed text-[rgba(216,236,248,0.82)] max-w-[640px]">
                {c.intro[0]}
              </p>

              <ul className="order-2 lg:order-3 flex flex-wrap gap-2.5">
                {facts.map((f) => (
                  <li key={f} className={GLASS_CHIP}>
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-[#6aa6ff]"
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="order-3 lg:order-4 flex flex-col sm:flex-row gap-3">
                <GeoCta
                  label={L.ctaButton}
                  title={L.ctaModalTitle}
                  context={c.h1}
                />
                <a
                  href="#tovary"
                  className={`${GLASS_PILL} h-[54px] w-full sm:w-[260px]`}
                >
                  {L.heroProductsCta}
                </a>
              </div>
            </div>

            {/* Картка доставки й видимий NAP. Адреса тут і в LocalBusiness —
                одна й та сама: Google звіряє розмітку з тим, що бачить
                користувач, інакше локальні сигнали не зараховуються. */}
            <aside className={`${GLASS} isolate p-6 md:p-7`}>
              <h2 className="not-italic font-e-ukraine font-medium text-[17px] md:text-[18px] text-white">
                {pickup ? L.deliveryTitle : L.deliveryOnlyTitle}
              </h2>
              <p className="mt-3 not-italic font-e-ukraine font-thin text-[15px] leading-relaxed text-[rgba(216,236,248,0.75)]">
                {c.deliveryNote}
              </p>

              {pickup && (
                <>
                  <div className={`${HAIRLINE} my-5`} />
                  <p className="not-italic font-e-ukraine text-[12px] uppercase tracking-wide text-[rgba(216,236,248,0.5)]">
                    {L.pickupTitle}
                  </p>
                  <address className="mt-1.5 not-italic font-e-ukraine font-thin text-[15px] leading-relaxed text-[rgba(255,255,255,0.92)]">
                    {pickup}
                  </address>
                  <p className="mt-1 not-italic font-e-ukraine font-thin text-[14px] text-[rgba(216,236,248,0.5)]">
                    {L.hoursLabel}: {L.hours}
                  </p>
                  {city.mapsUrl && (
                    <a
                      href={city.mapsUrl}
                      target="_blank"
                      rel="noopener"
                      className={`${GLASS_PILL} mt-5`}
                    >
                      {L.routeCta}
                    </a>
                  )}
                </>
              )}
            </aside>
          </div>
        </section>

        {/* Решта вступу — під першим екраном, щоб не розтягувати його. */}
        {c.intro.length > 1 && (
          <div className="flex flex-col gap-4 mb-16 max-w-[900px]">
            {c.intro.slice(1).map((t, i) => (
              <p key={i} className={p}>
                {t}
              </p>
            ))}
          </div>
        )}

        {/* Товари з цінами — те, за чим прийшли з пошуку */}
        {featured.length > 0 && (
          <section id="tovary" className="mb-16 scroll-mt-[110px]">
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
