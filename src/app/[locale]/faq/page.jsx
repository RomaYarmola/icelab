import Container from "@/utils/Container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/app/components/common/Breadcrumbs";
import FaqSection from "@/app/components/common/FaqSection";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Faq" });
  return pageMeta({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/faq",
    locale,
  });
}

export default async function FaqPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Faq" });
  const items = t.raw("items");

  return (
    <div className="bg-white">
      <Container>
        <div className="pt-[140px] md:pt-[200px] pb-[80px] md:pb-[120px] max-w-[900px] mx-auto">
          <Breadcrumbs items={[{ name: t("title") }]} />
          <h1 className="not-italic font-e-ukraine font-medium text-[28px] md:text-[40px] leading-tight mb-10 text-black">
            {t("h1")}
          </h1>
          {/* Повний набір питань + FAQPage schema (на головній — підмножина) */}
          <FaqSection items={items} />
        </div>
      </Container>
    </div>
  );
}
