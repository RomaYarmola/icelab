"use client";
import useProductStore from "@/zustand/store/productStore";
import BasketCard from "../../common/BasketCard";
import GradientButton from "../../common/GradientButton";
import Link from "next/link";
import Image from "next/image";

export default function Order({ handleSubmit, products, totalValue, variant }) {
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  return (
    <div
      className={`p-4 l:p-5 rounded-xl basket-bg w-full  ${
        variant === "modal" ? "md:w-[full]" : "md:w-[45.6%]"
      }`}
    >
      {products.length === 0 ? (
        <div className="flex flex-col gap-5 items-center">
          <p>Ваш кошик порожній</p>
          <Link href={"/"}>
            <Image src="/icons/logo.svg" alt="logo" width={122} height={106} />
          </Link>
        </div>
      ) : (
        <>
          {" "}
          <ul className="text-commonBlue">
            {products.map((product, index) => (
              <BasketCard
                key={index}
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
          <div className="flex gap-4 justify-between items-center mt-[14px] mb-5">
            <p className="text-[16px] font-semibold font-montserrat not-italic">
              Сума замовлення:
            </p>
            <p className="text-[20px] font-medium text-[#F31260]">
              {totalValue}&nbsp;грн
            </p>
          </div>
          <div className="w-[220px] md:w-[258px] mx-auto">
            <GradientButton
              text="Оформити замовлення"
              type="submit"
              onPress={handleSubmit}
            />
          </div>
        </>
      )}
    </div>
  );
}
