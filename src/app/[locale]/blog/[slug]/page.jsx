import Container from "@/utils/Container";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getBlogPostBySlug, getAllBlogSlugs, getBlogPosts } from "@/lib/blog";
import { toNextMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import PortableTextRenderer from "@/app/components/main/Blog/PortableTextRenderer";
import Breadcrumbs from "@/app/components/common/Breadcrumbs";
import JsonLd from "@/app/components/common/JsonLd";
import { articleSchema } from "@/lib/schema";
import { estimateReadingTime } from "@/lib/readingTime";

// ISR: оновлення статті в CMS підхоплюється без ребілду. (P2-1)
export const revalidate = 3600;

// Пререндер сторінок статей. Slug — єдиний для обох мов.
export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale);
  if (!post) return {};
  return toNextMetadata({
    seo: post.seo,
    locale,
    ukPath: `/blog/${post.slug}`,
    ruPath: `/ru/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getBlogPostBySlug(slug, locale);
  if (!post) notFound();

  const tb = await getTranslations({ locale, namespace: "Blog" });
  const postPath = `${locale === "uk" ? "" : "/" + locale}/blog/${post.slug}`;

  // Час читання + дата + інші статті (порт логіки з monopools-блогу).
  const readMins = estimateReadingTime(post.body);
  const dateStr = post.publishedAt
    ? new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(post.publishedAt))
    : null;
  const related = (await getBlogPosts(locale))
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <Container className="pt-[120px] md:pt-[170px] pb-[100px] md:pb-[140px]">
      <JsonLd data={articleSchema(post, postPath)} />
      <article className="max-w-[760px] mx-auto">
        <Breadcrumbs
          items={[
            { name: tb("title"), href: "/blog" },
            { name: post.title },
          ]}
        />
        <h1 className="text-2xl md:text-3xl main-title-gradient leading-tight mb-4">
          {post.title}
        </h1>

        {/* Дата · час читання */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-8 font-e-ukraine not-italic text-commonBlue/60 text-sm">
          {dateStr && <span>{dateStr}</span>}
          {dateStr && <span aria-hidden="true">·</span>}
          <span>
            {readMins} {tb("readingMinutes")}
          </span>
        </div>

        {post.coverImage && (
          <div className="relative w-full h-[280px] md:h-[420px] rounded-[14px] overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.coverAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 760px"
              priority
            />
          </div>
        )}

        <div className="blog-content not-italic font-e-ukraine">
          <PortableTextRenderer
            value={post.body}
            locale={locale}
            fallbackAlt={post.title}
          />
        </div>
      </article>

      {/* Інші статті (порт «other posts» з monopools) */}
      {related.length > 0 && (
        <section className="max-w-[1100px] mx-auto mt-16 md:mt-24">
          <h2 className="text-2xl main-title-gradient mb-6">
            {tb("otherPosts")}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 l:grid-cols-3 gap-5 l:gap-8">
            {related.map((p) => (
              <li
                key={p.id}
                className="group rounded-xl overflow-hidden bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-modal"
              >
                <Link href={`/blog/${p.slug}`} className="block">
                  {p.coverImage && (
                    <div className="relative w-full h-[180px] overflow-hidden">
                      <Image
                        src={p.coverImage}
                        alt={p.coverAlt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="text-lg text-commonBlue font-medium leading-tight">
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="font-e-ukraine font-thin not-italic text-commonBlue/70 text-sm line-clamp-2">
                        {p.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
