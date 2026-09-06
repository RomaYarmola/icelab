"use client";
import Container from "@/utils/Container";
import useProductStore from "@/zustand/store/productStore";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import BasketCard from "../../common/BasketCard";
import BoxUpsell from "./BoxUpsell";
import GradientButton from "../../common/GradientButton";
import { withLoader } from "@/helpers/withLoader";
import { formatPrice } from "@/utils/pricing";

function Basket() {
  const t = useTranslations("Basket");
  const products = useProductStore((state) => state.products);

  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const totalValue = products.reduce((accumulator, product) => {
    return accumulator + parseFloat(product.totalPrice);
  }, 0);

  return (
    <Container>
      <div className="mt-[100px] md:mt-[120px] mb-10 px-5 l:px-16 py-4 l:py-12 rounded-xl basket-bg w-full bg-white">
        <h2 className="text-basket-gradient text-[20px] md:text-[44px] font-bold mb-5 l:mb-8 ">
          {t("title")}
        </h2>
        {products.length === 0 ? (
          <div className="flex flex-col gap-5 items-center">
            <p>{t("empty")}</p>
            <Link href={"/"}>
              <Image
                src="/icons/logo.svg"
                alt="IceLab логотип"
                width={122}
                height={106}
              />
            </Link>
          </div>
        ) : (
          <ul className="text-commonBlue">
            {products.map((product, index) => (
              <BasketCard
                key={index}
                basket
                type={product.type}
                image={product.image}
                name={product.name}
                iceVariant={product.iceVariant}
                iceVariantEnglish={product.iceVariantEnglish}
                size={product.size}
                quantity={product.quantity}
                deleteItem={() => deleteProduct(index)}
                updateQuantity={(quantity) =>
                  useProductStore
                    .getState()
                    .updateProductQuantity(index, quantity)
                }
                totalPrice={product.totalPrice}
              />
            ))}
          </ul>
        )}
      </div>
      {products.length !== 0 && <BoxUpsell />}
      {products.length !== 0 && (
        <div className="mb-20 md:mb-[147px] px-5 l:px-16 py-6 l:py-12 rounded-xl basket-bg w-full flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10">
          {/* Підпис може переноситись, сума — ніколи: раніше «6 300 грн»
              розривалося на «6» і «300 грн» у два рядки. */}
          <div className="flex flex-wrap items-baseline gap-x-4 md:gap-x-[35px] gap-y-1">
            <p className="text-[16px] md:text-[24px] font-bold">{t("total")}</p>
            <p className="text-[16px] md:text-[24px] font-bold text-[#F31260] whitespace-nowrap">
              {formatPrice(totalValue)}&nbsp;грн
            </p>
          </div>
          <Link
            href="/delivery"
            className="w-full sm:w-[258px] md:shrink-0"
          >
            <GradientButton text={t("submit")} />
          </Link>
        </div>
      )}
    </Container>
  );
}

export default withLoader(Basket);
