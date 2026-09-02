import { getClientContext } from "./tracking";

// message — текст для Telegram (з контекстом сесії);
// lead    — необов'язкові структуровані поля заявки для Google Таблиці.
//           Контекст сесії (джерело, UTM, маршрут) у lead НЕ входить: у таблиці
//           потрібні тільки товар, кількість, сума й контакти.
export async function sendMessage(message, lead) {
  if (!message) {
    return { success: false, error: "Введите сообщение!" };
  }

  // Додаємо контекст клієнта (джерело, UTM, маршрут по сайту, час).
  const fullMessage = `${message}${getClientContext()}`;

  try {
    const response = await fetch("/api/sendMessageTelegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lead ? { message: fullMessage, lead } : { message: fullMessage }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || "Неизвестная ошибка" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
