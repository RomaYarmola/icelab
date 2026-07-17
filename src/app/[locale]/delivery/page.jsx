import Delivery from "../../components/main/Delivery/Delivery";

// Рішення P0-5: /delivery — це функціональна сторінка оформлення замовлення
// (форма checkout, куди веде кошик), а НЕ дубль контентної /payment-and-delivery.
// Тому не видаляємо і не редіректимо, а закриваємо від індексації як службову —
// щоб уникнути канібалізації з /payment-and-delivery.
export const metadata = { robots: { index: false, follow: false } };

export default function DeliveryPage() {
  return <Delivery />;
}
