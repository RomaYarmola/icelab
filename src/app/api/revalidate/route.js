import { revalidateTag } from "next/cache";

// On-demand ревалідація для контенту Sanity.
//
// Вебхук Sanity (sanity.io/manage → API → Webhooks) б'є сюди при кожній
// публікації документа, і ми миттєво скидаємо кеш усіх сторінок, що беруть
// дані з CMS (товари, категорії, блог, ціни). Усі fetch-и позначені тегом
// "sanity" (див. src/sanity/client.js), тому один revalidateTag оновлює все.
//
// Захист — секрет (SANITY_REVALIDATE_SECRET). Передається у query (?secret=…)
// або заголовку x-revalidate-secret. Той самий секрет має бути у Vercel і в
// URL вебхука Sanity.

const TAG = "sanity";

function check(req) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return { ok: false, status: 500, message: "SANITY_REVALIDATE_SECRET не налаштований" };
  }
  const provided =
    new URL(req.url).searchParams.get("secret") ||
    req.headers.get("x-revalidate-secret");
  if (provided !== secret) {
    return { ok: false, status: 401, message: "Невірний секрет" };
  }
  return { ok: true };
}

async function handle(req) {
  const c = check(req);
  if (!c.ok) {
    return Response.json({ revalidated: false, message: c.message }, { status: c.status });
  }
  revalidateTag(TAG);
  return Response.json({ revalidated: true, tag: TAG, now: Date.now() });
}

// Sanity шле POST; GET лишаємо для ручної перевірки з браузера.
export async function POST(req) {
  return handle(req);
}
export async function GET(req) {
  return handle(req);
}
