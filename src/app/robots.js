// robots.txt: дозволяє індексацію та вказує на sitemap.
// Базовий домен задається змінною оточення NEXT_PUBLIC_SITE_URL.
export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
