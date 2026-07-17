import Container from "@/utils/Container";
import { Link } from "@/i18n/navigation";
import Breadcrumbs from "../../common/Breadcrumbs";
import JsonLd from "../../common/JsonLd";
import { localBusinessSchema } from "@/lib/schema";

// Гео-лендинг міста (P2-2): H1, унікальний текст, адреса, LocalBusiness schema,
// крошки, CTA у каталог. Дані — з namespace GeoPages.<city>.
export default function GeoLanding({ city, t }) {
  const name = `IceLab ${t("h1")}`;
  return (
    <div className="bg-white">
      <JsonLd
        data={localBusinessSchema({
          name,
          address: t("address"),
          url: `/${city === "kyiv" ? "suhyi-lid-kyiv" : "suhyi-lid-lviv"}`,
        })}
      />
      <Container>
        <div className="pt-[140px] md:pt-[200px] pb-[80px] md:pb-[120px] max-w-[900px] mx-auto">
          <Breadcrumbs items={[{ name: t("h1") }]} />
          <h1 className="not-italic font-e-ukraine font-medium text-[28px] md:text-[40px] leading-tight mb-6 text-black">
            {t("h1")}
          </h1>
          <p className="not-italic font-e-ukraine font-thin text-[16px] md:text-[18px] leading-relaxed text-black/75 mb-8">
            {t("intro")}
          </p>

          <div className="rounded-[14px] border border-commonBlue/15 p-5 mb-8">
            <h2 className="text-base font-medium text-commonBlue mb-2 not-italic font-e-ukraine">
              {t("addressLabel")}
            </h2>
            <p className="not-italic font-e-ukraine font-thin text-black/80">
              {t("address")}
            </p>
            <p className="not-italic font-e-ukraine font-thin text-black/70 text-sm mt-3">
              {t("deliveryNote")}
            </p>
          </div>

          <Link
            href="/catalog"
            className="inline-block rounded-full bg-commonBlue text-white px-7 py-3 not-italic font-e-ukraine hover:opacity-90 transition-opacity"
          >
            {t("cta")}
          </Link>
        </div>
      </Container>
    </div>
  );
}
