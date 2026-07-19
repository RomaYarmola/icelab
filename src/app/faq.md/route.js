// /faq.md — часті питання у Markdown для AI-пошуковиків. Джерело — ті самі
// питання, що видно на /faq (messages/uk.json → Faq.items), очищені від HTML.
import uk from "../../../messages/uk.json";
import { stripHtml } from "@/lib/schema";

export const dynamic = "force-static";

export function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const items = uk?.Faq?.items || [];

  const qa = items
    .map((it) => `### ${stripHtml(it.question)}\n${stripHtml(it.answer)}`)
    .join("\n\n");

  const body = `# Часті питання про сухий лід — IceLab

Відповіді від виробника сухого льоду IceLab (Київ, Львів; доставка по Україні). Повна версія: ${base}/faq

${qa}

---
- Каталог і ціни: ${base}/catalog
- Застосування сухого льоду: ${base}/zastosuvannia-suhogo-lodu
- Доставка та оплата: ${base}/payment-and-delivery
- Контакти: ${base}/contacts
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
