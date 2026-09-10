import NoCompromises from "../../components/common/NoCompromises/NoCompromises";
import Banner from "../../components/main/PaymentAndDelivery/Banner/Banner";
import DeliveryOptions from "../../components/main/PaymentAndDelivery/DeliveryOptions/DeliveryOptions";
import CityPickupLinks from "../../components/common/CityPickupLinks";
import Container from "@/utils/Container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";

// Унікальні, мовозалежні метадані (раніше успадковувались від головної).
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PaymentBanner" });
  return pageMeta({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/payment-and-delivery",
    locale,
  });
}

export default async function PaymentAndDelivery({ params }) {
  const { locale } = await params;
  // Вмикаємо статичний рендеринг для поточної локалі.
  setRequestLocale(locale);
  return (
    <>
      <Banner />
      <DeliveryOptions />
      {/* Склади й міста доставки — контекстні посилання на гео-лендинги */}
      <section className="bg-white relative z-10">
        <Container>
          <div className="py-16 md:py-20">
            <CityPickupLinks locale={locale} />
          </div>
        </Container>
      </section>
      <NoCompromises variant="delivery" />
    </>
  );
}
