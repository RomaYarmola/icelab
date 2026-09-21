// Неймспейси перекладів, які потрібні клієнтським компонентам.
//
// NextIntlClientProvider серіалізує передані messages у RSC-пейлоад
// сторінки, і браузер їх парсить під час гідратації. Якщо віддати йому
// весь словник — це ~52 КБ JSON у кожному документі (і uk, і ru) заради
// ~12 КБ, які реально читає клієнт: решта неймспейсів (Categories, Footer,
// LegalPages, Meta…) використовується лише в серверних компонентах, куди
// переклади потрапляють без участі браузера.
//
// Список має збігатися з реальним графом клієнтського бандла — його
// перераховує і перевіряє scripts/check_client_messages.py. Додав
// useTranslations("Щось") у компонент із "use client" (або в той, який
// такий компонент імпортує) — додай неймспейс сюди, інакше на проді
// замість тексту буде ключ.
export const CLIENT_NAMESPACES = [
  "About",
  "Basket",
  "Common",
  "ContactForm",
  "Contacts",
  "DeliveryForm",
  "Faq",
  "Header",
  "Modal",
  "Nav",
  "NoCompromises",
  "ProductPage",
  "Products",
  "Social",
  "Validation",
];

/** Лишає у словнику лише неймспейси з CLIENT_NAMESPACES. */
export function pickClientMessages(messages) {
  const picked = {};
  for (const name of CLIENT_NAMESPACES) {
    if (name in messages) picked[name] = messages[name];
  }
  return picked;
}
