import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { urlForImage } from "@/sanity/image";

// Рендер Portable Text статті блогу у стилі сайту.
// locale потрібен для двомовних alt/caption та побудови внутрішніх посилань.
export default function PortableTextRenderer({ value, locale, fallbackAlt }) {
  if (!Array.isArray(value) || value.length === 0) return null;

  const loc = (v) =>
    v && typeof v === "object" ? v[locale] ?? v.uk ?? "" : v ?? "";

  const components = {
    block: {
      normal: ({ children }) => (
        <p className="font-e-ukraine font-thin not-italic text-commonBlue/90 leading-relaxed mb-4">
          {children}
        </p>
      ),
      h2: ({ children }) => (
        <h2 className="text-2xl main-title-gradient mt-10 mb-4">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-xl text-commonBlue font-medium mt-8 mb-3">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-lg text-commonBlue font-medium mt-6 mb-2">
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-commonBlue pl-4 my-6 italic text-commonBlue/80 font-e-ukraine">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc pl-6 mb-4 flex flex-col gap-2 font-e-ukraine font-thin not-italic text-commonBlue/90">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal pl-6 mb-4 flex flex-col gap-2 font-e-ukraine font-thin not-italic text-commonBlue/90">
          {children}
        </ol>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      underline: ({ children }) => <span className="underline">{children}</span>,
      link: ({ value, children }) => {
        const href = value?.href || "";
        const isExternal =
          /^(https?:)?\/\//.test(href) ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:");
        // Відносні (внутрішні) посилання — через locale-aware Link (додає /ru).
        if (!isExternal && href.startsWith("/")) {
          return (
            <Link
              href={href}
              className="text-commonBlue underline hover:opacity-80"
            >
              {children}
            </Link>
          );
        }
        return (
          <a
            href={href}
            target={value?.blank ? "_blank" : undefined}
            rel={value?.blank ? "noopener noreferrer" : undefined}
            className="text-commonBlue underline hover:opacity-80"
          >
            {children}
          </a>
        );
      },
      internalLink: ({ value, children }) => {
        const slug = value?.refSlug;
        if (!slug) return <span>{children}</span>;
        const base = value?.refType === "blogPost" ? "/blog" : "/catalog";
        return (
          <Link
            href={`${base}/${slug}`}
            className="text-commonBlue underline hover:opacity-80"
          >
            {children}
          </Link>
        );
      },
    },
    types: {
      image: ({ value }) => {
        const url = urlForImage(value);
        if (!url) return null;
        const alt = loc(value?.alt) || fallbackAlt;
        const caption = loc(value?.caption);
        return (
          <figure className="my-6">
            <div className="relative w-full h-[320px] rounded-[14px] overflow-hidden">
              <Image src={url} alt={alt} fill className="object-cover" sizes="100vw" />
            </div>
            {caption && (
              <figcaption className="mt-2 text-sm text-commonBlue/60 font-e-ukraine not-italic text-center">
                {caption}
              </figcaption>
            )}
          </figure>
        );
      },
      tableBlock: ({ value }) => {
        const rows = Array.isArray(value?.rows) ? value.rows : [];
        if (rows.length === 0) return null;
        const [head, ...body] = rows;
        return (
          <div className="my-6 overflow-x-auto">
            <table className="w-full border-collapse font-e-ukraine not-italic text-commonBlue text-sm">
              <thead>
                <tr>
                  {(head?.cells || []).map((cell, i) => (
                    <th
                      key={i}
                      className="border border-commonBlue/20 px-3 py-2 text-left font-medium bg-commonBlue/5"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, r) => (
                  <tr key={r}>
                    {(row?.cells || []).map((cell, c) => (
                      <td
                        key={c}
                        className="border border-commonBlue/20 px-3 py-2 font-thin"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      },
    },
  };

  return <PortableText value={value} components={components} />;
}
