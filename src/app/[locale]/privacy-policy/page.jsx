import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import LegalPage from "../../components/main/Legal/LegalPage";

const NS = "LegalPages.privacy";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical:
        locale === routing.defaultLocale
          ? "/privacy-policy"
          : `/${locale}/privacy-policy`,
      languages: {
        uk: "/privacy-policy",
        ru: "/ru/privacy-policy",
        "x-default": "/privacy-policy",
      },
    },
  };
}

export default async function PrivacyPolicyPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: NS });
  return <LegalPage title={t("h1")} body={t("body")} />;
}
