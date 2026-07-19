import { createClient } from "@sanity/client";

// Конфіг Sanity зі змінних оточення (див. .env.local.example).
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

// Чи налаштований Sanity (є projectId). Дозволяє graceful fallback:
// поки CMS не підключена — каталог/блог порожні, а ціни беруться з констант.
export const isSanityConfigured = Boolean(projectId);

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

// Окремий клієнт без CDN — для даних, які мають бути свіжими негайно
// (Price Settings: зміна тарифів має одразу впливати на ціни).
export const sanityClientFresh = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: "published",
    })
  : null;

// Усі запити тегуються "sanity" → вебхук Sanity може миттєво скинути кеш
// (revalidateTag) при публікації будь-якого документа. Див. /api/revalidate.
const SANITY_TAG = "sanity";

// Безпечний fetch: якщо Sanity не налаштований або сталася помилка —
// повертає fallback замість того, щоб зламати рендер сторінки.
export async function sanityFetch(query, params = {}, fallback = null) {
  if (!sanityClient) return fallback;
  try {
    return await sanityClient.fetch(query, params, {
      next: { tags: [SANITY_TAG] },
    });
  } catch (error) {
    console.error("Sanity fetch error:", error?.message || error);
    return fallback;
  }
}

// Свіжий fetch (без CDN) — для Price Settings. Теж тегується, щоб вебхук
// оновлював і ціни при зміні Price Settings.
export async function sanityFetchFresh(query, params = {}, fallback = null) {
  if (!sanityClientFresh) return fallback;
  try {
    return await sanityClientFresh.fetch(query, params, {
      next: { tags: [SANITY_TAG] },
    });
  } catch (error) {
    console.error("Sanity fresh fetch error:", error?.message || error);
    return fallback;
  }
}
