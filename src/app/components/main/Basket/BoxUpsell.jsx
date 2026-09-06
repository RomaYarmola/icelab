"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@nextui-org/react";
import useProductStore from "@/zustand/store/productStore";
import { usePriceSettings } from "@/app/components/providers/PriceSettingsProvider";
import { buildPricing } from "@/lib/priceSettings";
import { formatPrice } from "@/utils/pricing";

// Допродаж термобоксів у кошику.
//
// Сухий лід сублімує близько 10 % ваги на добу, і в звичайній тарі втрати
// більші — тому лід без бокса замовляють рідко. Раніше тут стояло лише
// посилання на категорію: щоб додати бокс, треба було піти з кошика, вибрати
// товар і повернутися. Тепер бокс додається в один клік прямо тут.
//
// Блок показується, лише поки бокса в кошику немає, — після додавання він
// зникає сам і не заважає оформленню.
export default function BoxUpsell() {
  const t = useTranslations("Basket");
  const products = useProductStore((state) => state.products);
  const addProductToCart = useProductStore((state) => state.addProductToCart);

  const settings = usePriceSettings();
  const pricing = buildPricing(settings);

  const hasBox = products.some(
    (p) =>
      p.iceVariantEnglish === "iceBox" ||
      (p.type === "catalog" && /termoboks|korobka/.test(p.slug || ""))
  );

  const boxes = (settings.boxPrices || [])
    .map((b) => ({ size: Number(b.size), price: Number(b.price) }))
    .filter((b) => b.size > 0 && b.price > 0)
    .sort((a, b) => a.size - b.size);

  if (hasBox || !boxes.length) return null;

  const addBox = (box) => {
    addProductToCart({
      iceVariant: "Бокс для льоду",
      iceVariantEnglish: "iceBox",
      // Формат «15 кг» — той самий, що з модалки головної; calculateTotalPrice
      // дістає число через parseInt, тож розрахунок у кошику не ламається.
      size: `${box.size} кг`,
      quantity: 1,
      pricePerUnit: pricing.pricePerUnit,
      tiers: pricing.tiers,
      totalPrice: String(box.price),
    });
  };

  return (
    <div className="mb-10 px-5 l:px-16 py-6 l:py-8 rounded-xl basket-bg w-full bg-white text-commonBlue">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-2">
        <h3 className="text-[16px] md:text-[24px] font-bold">
          {t("crossSellTitle")}
        </h3>
        <Link
          href="/catalog/c/termoboksy"
          className="not-italic font-e-ukraine text-sm text-commonBlue/70 underline underline-offset-4 hover:text-commonBlue transition-colors"
        >
          {t("crossSellAll")}
        </Link>
      </div>

      <p className="not-italic font-e-ukraine font-thin text-commonBlue/70 text-sm md:text-[15px] leading-relaxed mb-5 max-w-[62ch]">
        {t("crossSellHint")}
      </p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {boxes.map((box) => (
          <li
            key={box.size}
            className="flex items-center gap-4 rounded-[10px] border border-commonBlue/20 p-3 md:p-4"
          >
            <div className="w-[64px] h-[64px] md:w-[80px] md:h-[80px] shrink-0 overflow-hidden rounded-[8px] border border-commonBlue/20 p-2">
              <Image
                src="/images/products/box.png"
                alt={t("crossSellBoxName", { size: box.size })}
                width={80}
                height={80}
                className="w-full h-auto"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[15px] md:text-[17px] font-bold leading-tight">
                {t("crossSellBoxName", { size: box.size })}
              </p>
              <p className="not-italic font-e-ukraine text-[15px] md:text-[16px] mt-1 whitespace-nowrap">
                {formatPrice(box.price)}&nbsp;{t("crossSellUnit")}
              </p>
            </div>

            <Button
              onPress={() => addBox(box)}
              className="shrink-0 h-10 px-5 rounded-md bg-transparent border-[1.5px] border-solid border-commonBlue data-[hover=true]:bg-commonBlue/[0.06]"
            >
              <span className="not-italic font-e-ukraine font-medium text-[13px] text-commonBlue">
                {t("crossSellAdd")}
              </span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
