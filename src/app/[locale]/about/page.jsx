import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import LegalPage from "../../components/main/Legal/LegalPage";
import Breadcrumbs from "../../components/common/Breadcrumbs";

const NS = "Pages.about";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === routing.defaultLocale ? "/about" : `/${locale}/about`,
      languages: { uk: "/about", ru: "/ru/about", "x-default": "/about" },
    },
  };
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
    />
  );
}
