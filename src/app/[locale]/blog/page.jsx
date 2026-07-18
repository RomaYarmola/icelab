import Container from "@/utils/Container";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { getBlogPosts } from "@/lib/blog";
import Breadcrumbs from "@/app/components/common/Breadcrumbs";

// ISR: нова стаття у Sanity з'являється без ребілду. (P2-1)
export const revalidate = 3600;

// Метадані блогу (локалізовані) + canonical/hreflang.
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return pageMeta({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/blog",
    locale,
  });
}

export default async function BlogPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Blog" });
  const posts = await getBlogPosts(locale);

  const fmtDate = (iso) =>
    iso
      ? new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "uk-UA", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(iso))
      : null;

  return (
    <Container className="pt-[130px] md:pt-[180px] pb-[100px] md:pb-[160px]">
      <Breadcrumbs items={[{ name: t("title") }]} />
      <h1 className="text-3xl main-title-gradient text-center mb-10 md:mb-14">
        {t("title")}
      </h1>

      {posts.length === 0 ? (
        <p className="text-center font-e-ukraine font-thin not-italic text-commonBlue text-md-responsive">
          {t("empty")}
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 l:grid-cols-3 gap-5 l:gap-8">
          {posts.map((post) => (
            <li
              key={post.id}
              className="group rounded-xl overflow-hidden bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-modal"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                {post.coverImage && (
                  <div className="relative w-full h-[200px] overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.coverAlt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col gap-2">
                  <h2 className="text-lg text-commonBlue font-medium leading-tight">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="font-e-ukraine font-thin not-italic text-commonBlue/70 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.publishedAt && (
                    <p className="mt-1 font-e-ukraine not-italic text-commonBlue/50 text-xs">
                      {fmtDate(post.publishedAt)}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
