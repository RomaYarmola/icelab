import GeoCta from "@/app/components/main/Geo/GeoCta";
import { NICHE_LABELS } from "@/lib/niches";
import { CONTACT_PHONE } from "@/utils/routes";
import {
  PLATE,
  GLASS,
  GLOW_PRIMARY,
  GLOW_SECONDARY,
} from "@/app/components/common/glass";

// «Аварійна поставка сухого льоду для бізнесу» — спільний блок для B2B-ніш
// (niche.emergency): аварійне охолодження продуктів, лабораторії та фарма,
// очищення після пожежі.
//
// Людина тут у стресі: холод зупинився, товар псується. Тому блок відповідає
// на два питання — «чи вистачить у вас льоду» і «як швидко» — лише цифрами,
// які вже підтверджені на сайті (два виробництва, до 400 кг/год, 60 т CO₂,
// доставка), і дає телефон поруч із формою: у терміновій ситуації дзвонять.
// Оціночних тверджень на кшталт «найшвидші на ринку» свідомо немає — їх
// неможливо перевірити, і пошук такі фрази не враховує.
function formatPhone(raw) {
  const d = raw.replace(/\D/g, "");
  // 380951606881 → +38 095 160 68 81
  return `+${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`;
}

export default function EmergencySupplyBlock({ locale, context }) {
  const L = NICHE_LABELS[locale] || NICHE_LABELS.uk;
  return (
    <section className={`${PLATE} px-6 py-9 md:px-12 md:py-12`}>
      <div aria-hidden="true" className={GLOW_PRIMARY} />
      <div aria-hidden="true" className={GLOW_SECONDARY} />

      <div className="relative">
        <h2 className="not-italic font-e-ukraine font-medium text-[24px] md:text-[32px] leading-tight text-white mb-3 text-balance">
          {L.emergencyTitle}
        </h2>
        <p className="not-italic font-e-ukraine font-thin text-[15px] md:text-[17px] leading-relaxed text-[rgba(216,236,248,0.78)] mb-8 max-w-[760px]">
          {L.emergencyText}
        </p>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {L.emergencyPoints.map((pt) => (
            <li key={pt.value} className={`${GLASS} isolate p-5`}>
              <p className="not-italic font-e-ukraine font-medium text-[20px] xl:text-[22px] leading-tight whitespace-nowrap text-white">
                {pt.value}
              </p>
              <p className="mt-2.5 not-italic font-e-ukraine font-thin text-[14px] leading-relaxed text-[rgba(216,236,248,0.72)]">
                {pt.label}
              </p>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <GeoCta
            label={L.emergencyCta}
            title={L.emergencyModalTitle}
            context={context}
          />
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="not-italic font-e-ukraine font-medium text-[20px] text-white underline decoration-white/30 underline-offset-[6px] hover:decoration-white"
          >
            {formatPhone(CONTACT_PHONE)}
          </a>
        </div>
      </div>
    </section>
  );
}
