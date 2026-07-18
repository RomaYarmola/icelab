import NoCompromises from "../../components/common/NoCompromises/NoCompromises";
import Banner from "../../components/main/PaymentAndDelivery/Banner/Banner";
import DeliveryOptions from "../../components/main/PaymentAndDelivery/DeliveryOptions/DeliveryOptions";
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
      <NoCompromises variant="delivery" />
    </>
  );
}
