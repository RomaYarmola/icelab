import NoCompromises from "../components/common/NoCompromises/NoCompromises";
import Banner from "../components/main/PaymentAndDelivery/Banner/Banner";
import SelfDelivery from "../components/main/PaymentAndDelivery/SelfDelivery/Self.delivery";
import UkraineDelivery from "../components/main/PaymentAndDelivery/UkraineDelivery/UkraineDelivery";

export default function PaymentAndDelivery() {
  return (
    <>
      <Banner />
      <UkraineDelivery />
      <SelfDelivery />
      <NoCompromises variant="delivery" />
    </>
  );
}
