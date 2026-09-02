// Дублювання заявок у Google Таблицю.
//
// Навіщо своя реалізація, а не `googleapis`: потрібен рівно один виклик —
// `values.append`. Пакет googleapis тягне десятки мегабайтів у бандл серверної
// функції заради цього. Тут — підпис JWT через вбудований node:crypto і два
// HTTP-запити до REST API.
//
// ГОЛОВНЕ ПРАВИЛО: цей модуль не має права зламати відправку в Telegram.
// Усі помилки він ковтає і повертає { ok:false, reason }, а не кидає виняток.
// Якщо змінних оточення немає — просто нічого не робить.
//
// Змінні оточення (.env.local локально + Vercel → Settings → Environment Variables;
// файли .env у git не потрапляють, тому на проді їх треба завести окремо):
//   GOOGLE_SHEETS_ID              — id з URL таблиці
//   GOOGLE_SERVICE_ACCOUNT_EMAIL  — ...@....iam.gserviceaccount.com
//   GOOGLE_PRIVATE_KEY            — приватний ключ одним рядком, переноси як \n
//   GOOGLE_SHEETS_TAB             — назва аркуша, за замовчуванням «Аркуш1»
// Сервісний акаунт має бути доданий у доступ до таблиці з правами «Редактор».

import { createSign } from "node:crypto";

const TOKEN_URI = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SA_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// У .env приватний ключ зберігається одним рядком із літеральними \n.
const SA_KEY = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
const SHEET_NAME = process.env.GOOGLE_SHEETS_TAB || "Аркуш1";
const TIMEOUT_MS = 6000;

export const HEADER = [
  "Дата",
  "Тип",
  "Що замовили",
  "Кількість",
  "Сума, грн",
  "Ім'я",
  "Телефон",
  "Telegram",
  "Доставка",
  "Коментар",
];

export function isSheetsConfigured() {
  return Boolean(SHEET_ID && SA_EMAIL && SA_KEY);
}

const b64url = (input) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

// Токен живе годину; тримаємо його в пам'яті інстансу й перевипускаємо
// за хвилину до закінчення, щоб не ходити за ним на кожну заявку.
let cachedToken = null;

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: SA_EMAIL,
      scope: SCOPE,
      aud: TOKEN_URI,
      exp: now + 3600,
      iat: now,
    })
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const assertion = `${header}.${claim}.${b64url(signer.sign(SA_KEY))}`;

  const res = await fetch(TOKEN_URI, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    // Заявка вже пішла в Telegram і користувач чекає на відповідь — не даємо
    // повільному Google підвісити форму.
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `token ${res.status}: ${data.error_description || data.error || "unknown"}`
    );
  }

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  };
  return cachedToken.value;
}

async function sheetsFetch(path, token, init = {}) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}${path}`,
    {
      ...init,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `sheets ${res.status}: ${data?.error?.message || "unknown"}`
    );
  }
  return data;
}

// Заголовок дописується один раз — коли лист порожній. Так таблиця
// самоініціалізується й на проді, і на новому листі, без ручної підготовки.
async function ensureHeader(token) {
  const range = `${SHEET_NAME}!A1:J1`;
  const data = await sheetsFetch(
    `/values/${encodeURIComponent(range)}`,
    token
  );
  if (data.values?.[0]?.length) return;

  await sheetsFetch(
    `/values/${encodeURIComponent(range)}?valueInputOption=RAW`,
    token,
    { method: "PUT", body: JSON.stringify({ values: [HEADER] }) }
  );
}

export async function appendLeadRow(row) {
  if (!isSheetsConfigured()) {
    return { ok: false, reason: "not-configured" };
  }
  try {
    const token = await getAccessToken();
    await ensureHeader(token);
    await sheetsFetch(
      // RAW, а не USER_ENTERED: інакше Таблиця «розумно» розбирає значення
      // і телефон +380989982525 перетворюється на число 380989982525 —
      // менеджер копіює його без плюса й не може подзвонити.
      `/values/${encodeURIComponent(`${SHEET_NAME}!A:J`)}:append` +
        `?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      token,
      { method: "POST", body: JSON.stringify({ values: [row] }) }
    );
    return { ok: true };
  } catch (error) {
    // Свідомо не кидаємо далі: заявка вже пішла в Telegram, і таблиця
    // не повинна впливати ні на відповідь клієнту, ні на бота.
    return { ok: false, reason: error.message };
  }
}
