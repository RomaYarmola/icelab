"use client";
import Container from "@/utils/Container";
import Details from "./Deatails";
import { useIsSafari } from "@/hooks/useIsSafari";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import JsonLd from "@/app/components/common/JsonLd";
import { faqSchema } from "@/lib/schema";

export default function Faq() {
  const isSafari = useIsSafari();
  const t = useTranslations("Faq");
  const homeCount = t.raw("homeCount") || 5;
  const shown = t.raw("items").slice(0, homeCount);
  return (
    <div className={`${isSafari && "faq-safari"}`}>
      <Container>
        <div className="pb-[120px] md:pb-[150px] md:pt-[125px] relative z-[5]">
          <h2 className="text-center text-white-title-gradient text-2xl mb-10">
            {t("title")}
          </h2>
          <Details />
          {/* Посилання на повний список питань (P1-5/P1-11) */}
          <div className="flex justify-center mt-10">
            <Link
              href="/faq"
              className="inline-block rounded-full border border-white/40 px-6 py-2.5 not-italic font-e-ukraine text-white hover:bg-white/10 transition-colors"
            >
              {t("allQuestions")}
            </Link>
          </div>
          {/* FAQPage schema — лише показане підмножина (повний набір на /faq) */}
          <JsonLd data={faqSchema(shown)} />
        </div>
      </Container>
    </div>
  );
}
