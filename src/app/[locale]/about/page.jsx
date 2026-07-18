import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import LegalPage from "../../components/main/Legal/LegalPage";
import Breadcrumbs from "../../components/common/Breadcrumbs";

const NS = "Pages.about";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return pageMeta({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/about",
    locale,
  });
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: NS });
  const tb = await getTranslations({ locale, namespace: "Breadcrumbs" });
  return (
    <LegalPage
      title={t("h1")}
      body={t("intro")}
      breadcrumbs={<Breadcrumbs items={[{ name: tb("about") }]} />}
      image={{ src: "/images/products/ice-4.webp", alt: t("h1") }}
    />
  );
}
