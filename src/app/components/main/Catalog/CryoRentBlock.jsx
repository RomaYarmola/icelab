import { getTranslations } from "next-intl/server";
import GeoCta from "@/app/components/main/Geo/GeoCta";

// «Потрібен апарат на кілька днів?» — для категорії кріобластингу й картки
// апарата. Послуг очищення IceLab не надає, але партнери здають кріобластери
// в оренду: заявка йде менеджеру з контекстом «Оренда апарата», той з'єднує
// з партнером, а лід 3 мм постачає IceLab.
//
// Навіщо окремий блок: частина запитів кластера («криобластинг цена за м2»,
// «чистка двигуна сухим льодом») — це людина без апарата. Раніше єдиний
// сценарій на сторінці був «купити за 679 тис.», і такий відвідувач ішов.
export default async function CryoRentBlock({ locale, compact = false }) {
  const t = await getTranslations({ locale, namespace: "Catalog" });
  return (
    <section
      className={`rounded-[14px] border border-commonBlue/20 bg-commonBlue/[0.03] ${
        compact ? "p-5" : "p-6 md:p-8"
      } flex flex-col ${compact ? "" : "md:flex-row md:items-center"} gap-5 justify-between`}
    >
      <div className="max-w-[640px]">
        <h2
          className={`not-italic font-e-ukraine font-medium text-black mb-2 ${
            compact ? "text-base text-commonBlue" : "text-[20px] md:text-[24px]"
          }`}
        >
          {t("rentTitle")}
        </h2>
        <p className="not-italic font-e-ukraine font-thin text-[15px] md:text-[16px] leading-relaxed text-black/75">
          {t("rentText")}
        </p>
      </div>
      <div className="shrink-0">
        <GeoCta
          label={t("rentCta")}
          title={t("rentModalTitle")}
          context={t("rentModalTitle")}
        />
      </div>
    </section>
  );
}
