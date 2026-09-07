import { getTranslations } from "next-intl/server";

// Блок «звідки береться сировина» з посиланням на co2lab.pro.
//
// Сухий лід — це заморожений діоксид вуглецю, тож питання «з чого його
// роблять» виникає у читача природно: на сторінці виробництва, у розділі
// «про компанію» і в категорії харчового льоду, де марка вуглекислоти
// прямо визначає, чи можна ставити лід поруч із продуктами.
//
// CO₂ Lab — профільний проєкт того самого власника: постачання рідкого CO₂
// та кріогенне обладнання. Посилання відкрите (без nofollow) — це не реклама
// стороннього сайту, а продовження теми на ресурсі, який її розкриває.
//
// props:
//  • locale  — поточна локаль (uk / ru);
//  • variant — "production" | "about" | "foodIce": визначає текст і ціль.

const HREF = {
  production: {
    uk: "https://www.co2lab.pro/uk/supply",
    ru: "https://www.co2lab.pro/ru/supply",
  },
  about: {
    uk: "https://www.co2lab.pro/uk",
    ru: "https://www.co2lab.pro/ru",
  },
  foodIce: {
    uk: "https://www.co2lab.pro/uk/blog/harchova-chy-tehnichna-vuglekyslota",
    ru: "https://www.co2lab.pro/ru/blog/pishchevaya-ili-tehnicheskaya-uglekislota",
  },
};

export default async function RawMaterialNote({ locale, variant }) {
  const t = await getTranslations({ locale, namespace: `RawMaterial.${variant}` });
  const href = HREF[variant]?.[locale] ?? HREF[variant]?.uk;
  if (!href) return null;

  return (
    <aside className="mt-10 rounded-2xl border border-commonBlue/20 bg-commonBlue/[0.04] p-5 md:p-6">
      <p className="not-italic font-e-ukraine font-medium text-[16px] md:text-[18px] text-black mb-2">
        {t("title")}
      </p>
      <p className="not-italic font-e-ukraine font-thin text-[15px] md:text-[16px] leading-relaxed text-black/75">
        {t("text")}{" "}
        <a
          href={href}
          target="_blank"
          rel="noopener"
          className="text-commonBlue underline underline-offset-4 hover:opacity-80"
        >
          {t("link")}
        </a>
        .
      </p>
    </aside>
  );
}
