import Container from "@/utils/Container";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/blog";
import { toNextMetadata } from "@/lib/seo";
import PortableTextRenderer from "@/app/components/main/Blog/PortableTextRenderer";
import Breadcrumbs from "@/app/components/common/Breadcrumbs";
import JsonLd from "@/app/components/common/JsonLd";
import { articleSchema } from "@/lib/schema";

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
        <h1 className="text-2xl md:text-3xl main-title-gradient leading-tight mb-6">
          {post.title}
        </h1>

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
    </Container>
  );
}
