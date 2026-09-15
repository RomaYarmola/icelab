import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { NICHES, nicheBySlug } from "@/lib/niches";
import { nichePath } from "@/lib/nicheEngine";
import NicheLanding from "@/app/components/main/Niche/NicheLanding";

// ISR: прикріплені товари й ціни оновлюються з CMS без ребілду.
export const revalidate = 3600;

// Збираються і live-, і draft-ніші: чернетку можна вичитати за прямим URL.
// Невідомий slug — 404 (dynamicParams=false), тож сегмент не ловить сміття.
export const dynamicParams = false;

export function generateStaticParams() {
  return NICHES.map((n) => ({ niche: n.slug }));
}

export async function generateMetadata({ params }) {
  const { locale, niche: slug } = await params;
  const niche = nicheBySlug(slug);
  if (!niche) return {};
  const c = niche[locale] || niche.uk;
  const meta = pageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
    path: nichePath(niche.slug),
    locale,
  });
  // Чернетка не індексується, поки контент не вичитано.
  if (niche.status !== "live") meta.robots = { index: false, follow: true };
  return meta;
}

export default async function NichePage({ params }) {
  const { locale, niche: slug } = await params;
  setRequestLocale(locale);
  if (!nicheBySlug(slug)) notFound();
  return <NicheLanding slug={slug} locale={locale} />;
}
