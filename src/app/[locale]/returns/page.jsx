import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import LegalPage from "../../components/main/Legal/LegalPage";
import Breadcrumbs from "../../components/common/Breadcrumbs";

const NS = "LegalPages.returns";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return pageMeta({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/returns",
    locale,
  });
}

export default async function ReturnsPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: NS });
  return (
    <LegalPage
      title={t("h1")}
      body={t("body")}
      breadcrumbs={<Breadcrumbs items={[{ name: t("h1") }]} />}
    />
  );
}
