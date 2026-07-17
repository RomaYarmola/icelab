"use client";
import Container from "@/utils/Container";
import { useTranslations } from "next-intl";
import { data } from "./data";
import ProductCard from "./ProductCard";
import { useIsSafari } from "@/hooks/useIsSafari";
import { usePriceSettings } from "@/app/components/providers/PriceSettingsProvider";

export default function Products() {
  const isSafari = useIsSafari();
  const settings = usePriceSettings();
  const t = useTranslations("Products");

  // Розміри/ваги беруться з Price Settings (Sanity → fallback константи).
  const sizesFor = (variant) => {
    if (variant === "dryIce") return settings.granuleSizes;
    if (variant === "iceBox")
      return (settings.boxPrices || []).map((b) => `${b.size} кг`);
    return [];
  };

  return (
    <div
      id="products"
      className={`overflow-x-clip relative ${
        isSafari && "dark-gradient-safari"
      }`}
    >
      {/* gradient */}
      {!isSafari && (
        <div className="w-[1981px] h-[768px] md:h-[717px] radial-dark-gradient absolute bottom-[-238px] md:bottom-[-280px] left-1/2 transform -translate-x-1/2 z-[3] 2xl:w-[2900px]" />
      )}

      {/* /gradient */}
      <Container>
        <h2 className="sr-only">{t("sectionTitle")}</h2>
        <ul className="pt-[111px] pb-[124px] l:pt-[122px] 2xl:pt-[200px] l:pb-[112px] relative z-[4] flex flex-col md:flex-row gap-[88.6px] md:gap-5 items-center justify-center">
          {data.map(({ img, variant }, index) => (
            <ProductCard
              key={index}
              img={img}
              sizes={sizesFor(variant)}
              variant={variant}
            />
          ))}
        </ul>

      </Container>
    </div>
  );
}
