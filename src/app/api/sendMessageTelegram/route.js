// Заявка з сайту → Telegram (основний канал) + Google Таблиця (дубль).
//
// Порядок і відповідальність жорсткі: спочатку Telegram, і саме його результат
// визначає відповідь клієнту. Запис у таблицю відбувається ПІСЛЯ успішної
// відправки, у власному try/catch і з таймаутом — щоб недоступний Google
// не міг ані зламати бота, ані підвісити форму.

import { appendLeadRow } from "@/lib/googleSheets";
import { buildLeadRow } from "@/lib/leadRow";

// node:crypto для підпису JWT сервісного акаунта.
export const runtime = "nodejs";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, lead } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
      });
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      throw new Error(telegramData.description || "Failed to send message");
    }

    // Дубль у таблицю. `lead` — необов'язковий: якщо форма його не надіслала,
    // поведінка рівно така, як була до інтеграції.
    let sheetOk = false;
    if (lead && typeof lead === "object") {
      try {
        const result = await appendLeadRow(buildLeadRow(lead));
        sheetOk = result.ok;
        if (!result.ok && result.reason !== "not-configured") {
          console.error("[sheets] заявка не записана:", result.reason);
        }
      } catch (sheetError) {
        console.error("[sheets] несподівана помилка:", sheetError.message);
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: telegramData, sheet: sheetOk }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
