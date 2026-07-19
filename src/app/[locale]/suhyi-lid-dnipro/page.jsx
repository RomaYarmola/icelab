import { setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { cityBySlug } from "@/lib/cities";
import GeoLanding from "../../components/main/Geo/GeoLanding";

const SLUG = "suhyi-lid-dnipro";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const c = (cityBySlug(SLUG))[locale];
  const meta = pageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
    path: `/${SLUG}`,
    locale,
  });
  return { ...meta, keywords: c.keywords };
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GeoLanding slug={SLUG} locale={locale} />;
}
