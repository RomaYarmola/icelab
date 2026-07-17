import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import GeoLanding from "../../components/main/Geo/GeoLanding";

const PATH = "/suhyi-lid-lviv";
const NS = "GeoPages.lviv";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === routing.defaultLocale ? PATH : `/${locale}${PATH}`,
      languages: { uk: PATH, ru: `/ru${PATH}`, "x-default": PATH },
    },
  };
}

export default async function LvivPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: NS });
  return <GeoLanding city="lviv" t={t} />;
}
