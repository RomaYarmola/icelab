import JsonLd from "./JsonLd";
import { faqSchema } from "@/lib/schema";

// Серверний FAQ-блок: доступний список питань (<details>/<summary>) +
// FAQPage JSON-LD. items — [{ question, answer }]; answer може містити
// прості HTML-теги (<br>, <b>) — рендеримо через dangerouslySetInnerHTML,
// а в schema вони очищуються (stripHtml у faqSchema).
export default function FaqSection({ title, items = [], withSchema = true }) {
  if (!items.length) return null;
  return (
    <section className="w-full">
      {title && (
        <h2 className="not-italic font-e-ukraine font-medium text-[24px] md:text-[32px] mb-6 text-black">
          {title}
        </h2>
      )}
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-[14px] border border-black/10 bg-black/[0.02] px-5 py-4"
          >
            <summary className="not-italic font-e-ukraine font-medium text-[16px] md:text-[18px] cursor-pointer list-none text-black marker:hidden">
              {item.question}
            </summary>
            <div
              className="not-italic font-e-ukraine font-thin text-[15px] md:text-[16px] leading-relaxed text-black/70 mt-3"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </details>
        ))}
      </div>
      {withSchema && <JsonLd data={faqSchema(items)} />}
    </section>
  );
}
