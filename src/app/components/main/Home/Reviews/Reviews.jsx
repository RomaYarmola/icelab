import { getTranslations } from "next-intl/server";
import Container from "@/utils/Container";
import { getGoogleReviews } from "@/lib/reviews";

function Stars({ n, size = 16 }) {
  const rounded = Math.round(n);
  return (
    <div className="flex gap-0.5" aria-label={`${n} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= rounded ? "#FBBC04" : "#E2E5EC"}
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// Секція відгуків Google на головній. Дані тягне сервер (ключ прихований).
export default async function Reviews({ locale }) {
  const t = await getTranslations({ locale, namespace: "Reviews" });
  const data = await getGoogleReviews(locale);
  if (!data || !data.reviews?.length) return null;

  return (
    <section className="relative z-20 bg-white pt-8 md:pt-12 pb-20 md:pb-28">
      <Container>
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl main-title-gradient mb-4">{t("title")}</h2>
          <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span className="font-e-ukraine not-italic font-bold text-2xl text-commonBlue">
              {data.rating.toFixed(1)}
            </span>
            <Stars n={data.rating} size={20} />
            <span className="font-e-ukraine not-italic text-commonBlue/60 text-sm">
              {data.total} {t("reviewsLabel")} · Google
            </span>
          </div>
        </div>

        <ul className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-pl-4 -mx-4 px-4 pb-2 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:snap-none scrollbar-hidden">
          {data.reviews.map((r, i) => (
            <li
              key={i}
              className="snap-start shrink-0 w-[80%] sm:w-[320px] md:w-auto rounded-2xl border border-commonBlue/15 bg-white p-6 flex flex-col gap-3 shadow-card"
            >
              <div className="flex items-center gap-3">
                {r.photo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={r.photo}
                    alt={r.author}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-commonBlue/10 flex items-center justify-center font-e-ukraine not-italic text-commonBlue font-medium">
                    {r.author.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-e-ukraine not-italic font-medium text-commonBlue leading-tight">
                    {r.author}
                  </p>
                  <p className="font-e-ukraine not-italic text-commonBlue/50 text-xs">
                    {r.relativeTime}
                  </p>
                </div>
              </div>
              <Stars n={r.rating} />
              <p className="font-e-ukraine font-thin not-italic text-commonBlue/80 text-sm leading-relaxed line-clamp-6">
                {r.text}
              </p>
            </li>
          ))}
        </ul>

        <div className="text-center mt-10">
          <a
            href={data.mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-commonBlue/30 px-6 py-3 not-italic font-e-ukraine text-commonBlue hover:bg-commonBlue/10 transition-colors"
          >
            {t("onGoogle")}
          </a>
        </div>
      </Container>
    </section>
  );
}
