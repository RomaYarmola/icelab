// Єдина точка відстеження конверсій: Microsoft Clarity + dataLayer (GTM).
//
// НАВІЩО (18.09.2026). До цього Clarity не отримував жодної власної події —
// лише «розумні події», які він вгадує сам (і плутає: «Checkout» у нього
// спрацьовує на сторінці доставки, а заявки з модалок не бачить зовсім). У GTM
// конверсії Google Ads прив'язані до тексту кнопок («Отримати консультацію
// Відправити», «Отримати оптовий прайс»), тож модалки «Швидке замовлення»,
// «Термінове замовлення», «Порахувати обсяг», оренда апарата не рахувались,
// а кліки в Telegram / WhatsApp / Viber — основний канал заявок — не
// відстежувались узагалі.
//
// Що робить модуль:
//  • clarity("event", …) — подія в Clarity (фільтри, воронки, smart events);
//  • clarity("set", …)   — теги сесії (тип сторінки входу, тип заявки…),
//    за якими в Clarity можна сегментувати конверсію;
//  • clarity("upgrade", …) — запис сесії з конверсією зберігається пріоритетно;
//  • dataLayer.push({event, …}) — ті самі події для GTM з назвами GA4
//    (add_to_cart, generate_lead, begin_checkout, purchase) + contact_click.
//    Існуючі теги GTM на них поки не підписані — це не дублює поточні
//    конверсії Google Ads; підключення описане в docs/CONVERSIONS-2026-09.md.
//
// Персональні дані (ім'я, телефон) сюди не передаються ніколи.

// Clarity вантажиться afterInteractive — перші теги сторінки можуть прийти
// раніше за скрипт. Ставимо ту саму чергу, що й офіційний сніпет
// (c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}): сніпет її
// збереже, а Clarity розбере після завантаження.
function clarity(...args) {
  try {
    if (typeof window === "undefined") return;
    window.clarity =
      window.clarity ||
      function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
    window.clarity(...args);
  } catch {}
}

function dl(payload) {
  try {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  } catch {}
}

// Тег сесії в Clarity (рядок до 255 символів).
export function setTag(key, value) {
  if (value === undefined || value === null || value === "") return;
  clarity("set", key, String(value).slice(0, 255));
}

// Подія: назва + необов'язкові параметри (для GTM) і теги (для Clarity).
export function track(event, params = {}, { tags = {}, upgrade } = {}) {
  clarity("event", event);
  for (const [k, v] of Object.entries(tags)) setTag(k, v);
  if (upgrade) clarity("upgrade", upgrade);
  dl({ event, ...params });
}

// Заявка (будь-яка форма): тип заявки й назва форми — у тегах сесії.
export function trackLead(leadType, { form, value } = {}) {
  track(
    "generate_lead",
    { lead_type: leadType, lead_form: form, value, currency: "UAH" },
    { tags: { lead_type: leadType, lead_form: form }, upgrade: "lead" }
  );
}

// Тип сторінки за шляхом — для тегів page_type / entry_page_type.
export function pageType(pathname = "/") {
  const p = pathname.replace(/^\/ru(?=\/|$)/, "") || "/";
  if (p === "/") return "home";
  if (p === "/catalog") return "catalog";
  if (p.startsWith("/catalog/c/")) return "category";
  if (p.startsWith("/catalog/")) return "product";
  if (/^\/suhyi-lid-[a-z-]+$/.test(p)) return "geo";
  if (p === "/zastosuvannia-suhogo-lodu") return "niche_hub";
  if (p.startsWith("/zastosuvannia-suhogo-lodu/")) return "niche";
  if (p === "/blog" || p.startsWith("/blog/")) return "blog";
  if (p === "/opt") return "wholesale";
  if (p === "/contacts") return "contacts";
  if (p === "/basket") return "cart";
  if (p === "/delivery") return "checkout";
  if (p === "/thanks") return "thanks";
  if (p === "/faq") return "faq";
  return "info";
}

// Клік по контакту: телефон, месенджери, Instagram, пошта.
export function contactChannel(href = "") {
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("mailto:")) return "email";
  if (/t\.me\/|telegram\.me\//.test(href)) return "telegram";
  if (/wa\.me\/|whatsapp\.com\//.test(href)) return "whatsapp";
  if (href.startsWith("viber:")) return "viber";
  if (/instagram\.com\//.test(href)) return "instagram";
  return null;
}
