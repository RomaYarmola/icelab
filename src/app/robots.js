// robots.txt: дозволяє індексацію, закриває службові сторінки та вказує на sitemap.
// Явно дозволяємо AI-краулери (ChatGPT, Perplexity, Claude, Google-Extended тощо),
// щоб сайт потрапляв у відповіді AI-пошуку.
// Базовий домен задається змінною оточення NEXT_PUBLIC_SITE_URL.
export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Службові сторінки та шляхи, закриті від індексації (обидві локалі).
  const disallow = [
    "/api/",
    "/_next/image",
    "/basket",
    "/thanks",
    "/delivery",
    "/ru/basket",
    "/ru/thanks",
    "/ru/delivery",
  ];

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

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
