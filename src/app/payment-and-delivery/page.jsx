import NoCompromises from "../components/common/NoCompromises/NoCompromises";
import Banner from "../components/main/PaymentAndDelivery/Banner/Banner";
import DeliveryOptions from "../components/main/PaymentAndDelivery/DeliveryOptions/DeliveryOptions";

export default function PaymentAndDelivery() {
  return (
    <>
      <Banner />
      <DeliveryOptions />
      <NoCompromises variant="delivery" />
    </>
  );
}
