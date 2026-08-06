// robots.txt: дозволяє індексацію, закриває службові сторінки та вказує на sitemap.
// Явно дозволяємо AI-краулери (ChatGPT, Perplexity, Claude, Google-Extended тощо),
// щоб сайт потрапляв у відповіді AI-пошуку.
// Базовий домен задається змінною оточення NEXT_PUBLIC_SITE_URL.
export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Закриваємо лише API. Службові сторінки (/basket, /thanks, /delivery)
  // НЕ блокуємо тут: у них стоїть meta robots noindex, а краулер побачить її
  // тільки якщо йому дозволено зайти. Disallow + noindex — конфлікт, після
  // якого URL потрапляє в індекс «голим», без сніпета.
  // /_next/image теж не закриваємо: через нього віддаються ВСІ картинки сайту
  // (товари з Sanity CDN, обкладинки блогу) — блокування вимикає Google Images.
  const disallow = ["/api/"];

  // AI-краулери, яким явно дозволяємо повний доступ.
  const aiBots = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "PerplexityBot",
    "ClaudeBot",
    "anthropic-ai",
    "Google-Extended",
    "Bingbot",
  ];

  // Кожна група має власний disallow: за стандартом robots.txt краулер виконує
  // ЛИШЕ найбільш специфічну групу, що збіглася, і правила "*" при цьому
  // ігноруються повністю. Без цього AI-боти ходили б у /api/.
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
