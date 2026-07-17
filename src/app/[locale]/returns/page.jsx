import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import LegalPage from "../../components/main/Legal/LegalPage";

const NS = "LegalPages.returns";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical:
        locale === routing.defaultLocale ? "/returns" : `/${locale}/returns`,
      languages: { uk: "/returns", ru: "/ru/returns", "x-default": "/returns" },
    },
  };
}

export default async function ReturnsPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: NS });
  return <LegalPage title={t("h1")} body={t("body")} />;
}
