import { setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { cityBySlug } from "@/lib/cities";
import GeoLanding from "../../components/main/Geo/GeoLanding";

// ISR: товари з цінами на лендингу оновлюються з CMS без ребілду.
export const revalidate = 3600;

const SLUG = "suhyi-lid-chernivtsi";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const city = cityBySlug(SLUG);
  const c = city[locale];
  // og:image — перше (горизонтальне) власне фото відвантаження міста.
  const ph = city.photos?.[0];
  const meta = pageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
    path: `/${SLUG}`,
    locale,
    image: ph
      ? {
          url: ph.src,
          width: ph.width,
          height: ph.height,
          alt: (ph[locale] || ph.uk).alt,
        }
      : undefined,
  });
  return { ...meta, keywords: c.keywords };
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GeoLanding slug={SLUG} locale={locale} />;
}
