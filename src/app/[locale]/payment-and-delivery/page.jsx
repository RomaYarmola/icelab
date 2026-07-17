import NoCompromises from "../../components/common/NoCompromises/NoCompromises";
import Banner from "../../components/main/PaymentAndDelivery/Banner/Banner";
import DeliveryOptions from "../../components/main/PaymentAndDelivery/DeliveryOptions/DeliveryOptions";
import { setRequestLocale } from "next-intl/server";

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
