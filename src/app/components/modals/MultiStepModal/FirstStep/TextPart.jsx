import { useTranslations } from "next-intl";
import { usePriceSettings } from "@/app/components/providers/PriceSettingsProvider";

export default function TextPart({ quantity, variant }) {
  const t = useTranslations("Modal");
  const tp = useTranslations("Products");
  const settings = usePriceSettings();
  const isDryIce = variant === "dryIce";
  // Табличка тарифів будується з Price Settings (Sanity → fallback константи),
  // тож при зміні тарифів вона оновлюється разом із розрахунком ціни.
  const tiers = settings.dryIceTiers || [];
  const mid = Math.ceil(tiers.length / 2);
  const columns = [tiers.slice(0, mid), tiers.slice(mid)];
  return (
    <>
      <div className="mt-[-45px] flex gap-[19px] items-center">
        <h3 className="main-title-gradient text-[24px] leading-[1.08] font-medium">
          {isDryIce ? tp("dryIceName") : tp("iceBoxName")}
        </h3>
        <p className="text-[20px] font-e-ukraine not-italic font-medium leadong-[1.3] text-commonBlue">
          {isDryIce ? (
            <>
              {quantity} <span>{t("dryIceUnit")}</span>
            </>
          ) : (
            quantity
          )}
        </p>
      </div>
      <p className="mb-4 font-e-ukraine font-thin text-[#686466] leading-normal not-italic text-[12px]">
        {isDryIce ? (
          <>
            {t("dryIceDescLine1")}
            <br />
            {t("dryIceDescLine2")}
          </>
        ) : (
          t("iceBoxDescription")
        )}
      </p>
      {isDryIce && (
        <div className="flex flex-col xs:flex-row xs:gap-8 main-title-gradient font-bold font-e-ukraine mb-4">
          {columns.map((col, i) => (
            <div key={i}>
              {col.map((tier, j) => (
                <p key={j}>
                  {tier.min} - {tier.max} кг - {tier.price} грн/кг
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
