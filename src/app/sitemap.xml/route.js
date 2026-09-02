// /sitemap.xml — власний route-хендлер замість метадата-файлу `app/sitemap.js`.
// Причина заміни й механіка екранування описані в lib/sitemap.js.

import { buildSitemapEntries, renderSitemapXml } from "@/lib/sitemap";

// ISR: новий товар/стаття потрапляє в sitemap без ребілду.
export const revalidate = 3600;

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const entries = await buildSitemapEntries(base.replace(/\/$/, ""));

  return new Response(renderSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
