import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import LegalPage from "../../components/main/Legal/LegalPage";

const NS = "LegalPages.payment";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical:
        locale === routing.defaultLocale ? "/payment" : `/${locale}/payment`,
      languages: { uk: "/payment", ru: "/ru/payment", "x-default": "/payment" },
    },
  };
}

export default async function PaymentPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: NS });
  return <LegalPage title={t("h1")} body={t("body")} />;
}
