"use client";
import { useTranslations } from "next-intl";
import GradientButton from "@/app/components/common/GradientButton";
import useProductStore from "@/zustand/store/productStore";

const MAX_QTY = 99;

// Кнопка «Додати в кошик» з миттєвим зворотним зв'язком: після додавання
// вона замінюється на лічильник кількості (−/+), який керує саме цим товаром
// у корзині. Стан читається з наявного zustand-стора, тож лічильник у Header
// та сума корзини оновлюються реактивно, без перезавантаження.
//
// Використовує наявну корзину без переписування: товар додається як
// узагальнений елемент type: "catalog" (ціна × кількість рахується стором).
export default function AddToCartControl({ product, variant = "card" }) {
  const t = useTranslations("ProductPage");
  const products = useProductStore((state) => state.products);
  const addProductToCart = useProductStore((state) => state.addProductToCart);
  const updateProductQuantity = useProductStore(
    (state) => state.updateProductQuantity
  );
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const isAvailable = product.availability === "in-stock";
  const index = products.findIndex(
    (p) => p.type === "catalog" && p.slug === product.slug
  );
  const inCart = index !== -1;
  const quantity = inCart ? products[index].quantity : 0;

  const handleAdd = () => {
    addProductToCart({
      type: "catalog",
      slug: product.slug,
      name: product.title,
      iceVariant: product.title,
      iceVariantEnglish: "catalog",
      image: product.mainImage,
      size: "",
      price: product.price,
      unit: product.unit,
      quantity: 1,
      totalPrice: product.price.toFixed(0),
    });
  };

  const decrease = () => {
    if (quantity <= 1) deleteProduct(index);
    else updateProductQuantity(index, quantity - 1);
  };

  const increase = () => {
    if (quantity < MAX_QTY) updateProductQuantity(index, quantity + 1);
  };

  if (!inCart) {
    return (
      <div className={variant === "page" ? "w-[240px]" : "w-full"}>
        <GradientButton
          text={t("addToCart")}
          onPress={handleAdd}
          isDisabled={!isAvailable}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-md border border-commonBlue overflow-hidden bg-white">
        <button
          type="button"
          aria-label={t("decrease")}
          onClick={decrease}
          className="w-10 h-10 flex items-center justify-center text-commonBlue text-xl leading-none hover:bg-commonBlue/5 transition-colors"
        >
          −
        </button>
        <span className="w-12 h-10 flex items-center justify-center font-e-ukraine not-italic text-commonBlue border-x border-commonBlue">
          {quantity}
        </span>
        <button
          type="button"
          aria-label={t("increase")}
          onClick={increase}
          disabled={quantity >= MAX_QTY}
          className="w-10 h-10 flex items-center justify-center text-commonBlue text-xl leading-none hover:bg-commonBlue/5 transition-colors disabled:opacity-40"
        >
          +
        </button>
      </div>
      <span
        className={`font-e-ukraine not-italic text-sm whitespace-nowrap ${
          variant === "card" ? "text-white" : "text-commonBlue"
        }`}
      >
        {t("added")}
      </span>
    </div>
  );
}
