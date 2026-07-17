// Відстеження сесії відвідувача для заявок у Telegram: джерело переходу
// (ChatGPT, Instagram-реклама, Google тощо), UTM-мітки, перша сторінка,
// маршрут по сайту та час на сайті. Дані живуть у sessionStorage (одна сесія).

const KEY = "icelab_session";

function read() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

function write(s) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

// Людяна назва джерела за реферером/UTM.
function detectSource(referrer, utm) {
  if (utm.utm_source) {
    return utm.utm_source + (utm.utm_medium ? ` / ${utm.utm_medium}` : "");
  }
  if (!referrer) return "Прямий захід / закладка";

  let host = "";
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer;
  }

  const map = [
    ["chatgpt.com", "ChatGPT"],
    ["chat.openai.com", "ChatGPT"],
    ["openai.com", "ChatGPT"],
    ["perplexity.ai", "Perplexity"],
    ["claude.ai", "Claude"],
    ["gemini.google", "Gemini"],
    ["copilot.microsoft", "Copilot"],
    ["instagram.com", "Instagram"],
    ["facebook.com", "Facebook"],
    ["fb.com", "Facebook"],
    ["tiktok.com", "TikTok"],
    ["youtube.com", "YouTube"],
    ["t.me", "Telegram"],
    ["t.co", "Twitter/X"],
    ["twitter.com", "Twitter/X"],
    ["x.com", "Twitter/X"],
    ["google.", "Google (пошук)"],
    ["bing.com", "Bing"],
    ["duckduckgo.com", "DuckDuckGo"],
  ];
  for (const [k, v] of map) if (host.includes(k)) return v;
  return host;
}

// Викликається на кожній зміні маршруту.
export function recordVisit(pathname) {
  if (typeof window === "undefined") return;
  const now = Date.now();
  let s = read();

  if (!s) {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "gclid",
      "fbclid",
    ].forEach((k) => {
      const v = params.get(k);
      if (v) utm[k] = v;
    });

    s = {
      start: now,
      referrer: document.referrer || "",
      source: detectSource(document.referrer, utm),
      utm,
      landing: pathname,
      pages: [],
    };
  }

  const last = s.pages[s.pages.length - 1];
  if (!last || last.p !== pathname) {
    s.pages.push({ p: pathname, t: now });
    if (s.pages.length > 50) s.pages = s.pages.slice(-50);
  }
  write(s);
}

// Форматований блок для повідомлення менеджеру.
export function getClientContext() {
  if (typeof window === "undefined") return "";
  const s = read();
  if (!s) return "";

  const mins = Math.max(1, Math.round((Date.now() - s.start) / 60000));
  const utmStr = Object.keys(s.utm || {}).length
    ? Object.entries(s.utm)
        .map(([k, v]) => `${k}=${v}`)
        .join(", ")
    : "";
  const path = (s.pages || [])
    .slice(-15)
    .map((x) => x.p)
    .join(" → ");

  const lines = [
    "— — — — —",
    `🔎 Джерело: ${s.source}`,
    s.referrer ? `↩️ Реферер: ${s.referrer}` : null,
    utmStr ? `🏷️ UTM: ${utmStr}` : null,
    `🚪 Перша сторінка: ${s.landing}`,
    `📄 Переглянуто сторінок: ${s.pages.length}`,
    `🧭 Шлях: ${path}`,
    `📍 Зараз: ${window.location.pathname}`,
    `⏱️ На сайті: ~${mins} хв`,
  ].filter(Boolean);

  return "\n" + lines.join("\n");
}
