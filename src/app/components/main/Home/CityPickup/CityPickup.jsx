import Container from "@/utils/Container";
import { getTranslations } from "next-intl/server";
import CityPickupLinks from "@/app/components/common/CityPickupLinks";

// Блок «Склади та самовивіз» на головній. Головна лишається національною
// (title без міст), але саме звідси лендинги Києва і Львова отримують
// контекстні посилання з повним анкором і видимий NAP обох складів — раніше
// вони жили лише у футері й не мали ваги. Див. docs/SEO-KYIV-LVIV-TOP1.md.
export default async function CityPickup({ locale }) {
  const t = await getTranslations({ locale, namespace: "Home" });
  return (
    <section className="bg-white relative z-10 border-t border-commonBlue/10">
      <Container>
        <div className="py-16 md:py-20">
          <CityPickupLinks locale={locale} title={t("pickupTitle")} />
        </div>
      </Container>
    </section>
  );
}
