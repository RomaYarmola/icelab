import { mergeTiers } from "@/lib/featured";
import { formatPrice } from "@/utils/pricing";

// Таблиця цін за обсягом: тарифна сітка сухого льоду (Price Settings у
// Sanity → fallback константи) + термобокси. ЄДИНЕ джерело цифр — ті самі
// налаштування, що рахують ціну в кошику, тож таблиця не розійдеться з
// картками. Використовується на гео-лендингах і в категорії «Сухий лід».
//
// labels: { headVolume, headPrice, over, negotiable, box, boxUnit, kgUnit }
// (рядки з {max} / {size} — підставляються тут).
export default function PriceTiersTable({
  tiers = [],
  boxes = [],
  labels,
  caption,
  className = "",
}) {
  const merged = mergeTiers(tiers);
  if (!merged.length) return null;
  const maxTier = merged[merged.length - 1].max;
  const fill = (s, vars) =>
    String(s || "").replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

  const cell = "px-4 py-3 not-italic font-e-ukraine text-[15px] md:text-[16px]";

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[420px] border-collapse rounded-[14px] overflow-hidden border border-commonBlue/15">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="bg-commonBlue/[0.06] text-left">
            <th className={`${cell} font-medium text-commonBlue`}>
              {labels.headVolume}
            </th>
            <th className={`${cell} font-medium text-commonBlue`}>
              {labels.headPrice}
            </th>
          </tr>
        </thead>
        <tbody>
          {merged.map((t) => (
            <tr key={t.min} className="border-t border-commonBlue/10">
              <td className={`${cell} font-thin text-black/80`}>
                {t.min}–{t.max} кг
              </td>
              <td className={`${cell} font-medium text-black`}>
                {t.price} {labels.kgUnit}
              </td>
            </tr>
          ))}
          <tr className="border-t border-commonBlue/10">
            <td className={`${cell} font-thin text-black/80`}>
              {fill(labels.over, { max: maxTier })}
            </td>
            <td className={`${cell} font-medium text-black`}>
              {labels.negotiable}
            </td>
          </tr>
          {boxes.map((b) => (
            <tr key={b.size} className="border-t border-commonBlue/10">
              <td className={`${cell} font-thin text-black/80`}>
                {fill(labels.box, { size: b.size })}
              </td>
              <td className={`${cell} font-medium text-black`}>
                {formatPrice(b.price)} {labels.boxUnit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
