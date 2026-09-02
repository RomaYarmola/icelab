// Перетворення заявки з сайту в рядок Google Таблиці.
//
// У таблицю йде тільки те, з чим працює менеджер: що замовили, скільки, на яку
// суму, ім'я, телефон, месенджер, спосіб отримання й коментар. Джерело переходу,
// UTM і маршрут по сайту лишаються тільки в повідомленні Telegram — у таблиці
// вони перетворюють корисний рядок на полотно.
//
// Дані приходять з клієнта, тому кожне поле обрізається за довжиною і
// чиститься від керуючих символів: у таблицю не має потрапити ні перенос
// рядка, що ламає клітинку, ні мегабайт тексту.

const TYPE_LABELS = {
  order: "Замовлення",
  request: "Заявка",
  consult: "Консультація",
};

const MAX = 500;

function clean(value, max = MAX) {
  if (value === null || value === undefined) return "";
  return String(value)
    // керуючі символи + переноси рядків → пробіл
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

// Суму віддаємо числом, щоб колонка сумувалась у Таблиці. Решта полів —
// рядки: запис іде в режимі RAW, і рядок «+380…» лишається телефоном,
// а не перетворюється на число.
function asNumber(value) {
  const n = Number(String(value ?? "").replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : "—";
}

// Дата у київському часі — менеджер читає таблицю в тому ж поясі, що й Telegram.
export function kyivTimestamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t)?.value || "";
  return `${get("day")}.${get("month")}.${get("year")} ${get("hour")}:${get("minute")}`;
}

// items: [{ title, quantity, unit, price }]
function describeItems(items) {
  if (!Array.isArray(items) || !items.length) return { what: "", qty: "" };

  const what = items
    .map((it) => {
      const title = clean(it?.title, 120);
      if (!title) return null;
      const q = clean(it?.quantity, 20);
      const u = clean(it?.unit, 10);
      return q ? `${title} — ${q}${u ? ` ${u}` : ""}` : title;
    })
    .filter(Boolean)
    .join("; ");

  // Підсумок за одиницями виміру: «50 кг, 2 шт» — так видно обсяг замовлення
  // без розбору попередньої колонки.
  const totals = new Map();
  for (const it of items) {
    const n = Number(String(it?.quantity ?? "").replace(",", "."));
    if (!Number.isFinite(n) || n <= 0) continue;
    const u = clean(it?.unit, 10) || "шт";
    totals.set(u, (totals.get(u) || 0) + n);
  }
  const qty = [...totals.entries()]
    .map(([unit, sum]) => `${Number(sum.toFixed(2))} ${unit}`)
    .join(", ");

  return { what: clean(what, MAX), qty: clean(qty, 60) };
}

export function buildLeadRow(lead, now = new Date()) {
  const type = TYPE_LABELS[lead?.type] || TYPE_LABELS.request;
  const { what, qty } = describeItems(lead?.items);

  return [
    kyivTimestamp(now),
    type,
    // Для заявки «що замовили» — це товар, з картки якого відкрили модалку.
    what || clean(lead?.context, MAX) || "—",
    qty || "—",
    asNumber(lead?.total),
    clean(lead?.name, 120) || "—",
    clean(lead?.phone, 40) || "—",
    clean(lead?.telegram, 80) || "—",
    clean(lead?.delivery, 200) || "—",
    clean(lead?.comment, MAX) || "—",
  ];
}
