"use client";
import Container from "@/utils/Container";
import useProductStore from "@/zustand/store/productStore";
import Image from "next/image";
import Link from "next/link";
import BasketCard from "../../common/BasketCard";
import GradientButton from "../../common/GradientButton";
import { withLoader } from "@/helpers/withLoader";

function Basket() {
  const products = useProductStore((state) => state.products);

  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const totalValue = products.reduce((accumulator, product) => {
    return accumulator + parseFloat(product.totalPrice);
  }, 0);
  console.log("🚀 ~ Basket ~ products:", products);

  return (
    <Container>
      <div className="mt-[100px] md:mt-[120px] mb-10 px-5 l:px-16 py-4 l:py-12 rounded-xl basket-bg w-full bg-white">
        <h2 className="text-basket-gradient text-[20px] md:text-[44px] font-bold mb-5 l:mb-8 ">
          Кошик
        </h2>
        {products.length === 0 ? (
          <div className="flex flex-col gap-5 items-center">
            <p>Ваш кошик порожній</p>
            <Link href={"/"}>
              <Image
                src="/icons/logo.svg"
                alt="logo"
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
      {products.length !== 0 && (
        <div className="mb-20 md:mb-[147px] px-5 l:px-16 py-4 l:py-12 rounded-xl basket-bg w-full  flex flex-col md:flex-row justify-between gap-10 items-center">
          <div className="flex gap-4 md:gap-[35px] items-center">
            <p className="text-[16px] md:text-[24px] font-bold">
              Сума замовлення:
            </p>
            <p className="text-[16px] md:text-[24px] font-bold text-[#F31260]">
              {totalValue}&nbsp;грн
            </p>
          </div>
          <Link href="/delivery" className="w-[220px] md:w-[258px]">
            <GradientButton text="Оформити замовлення" />
          </Link>
        </div>
      )}
    </Container>
  );
}

export default withLoader(Basket);
