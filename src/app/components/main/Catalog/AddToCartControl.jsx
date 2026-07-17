"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import GradientButton from "@/app/components/common/GradientButton";
import FlyToCart from "@/app/components/common/FlyToCart";
import useProductStore from "@/zustand/store/productStore";

const MAX_QTY = 99;

// Кнопка «Додати в кошик» з миттєвим зворотним зв'язком: після додавання
// вона замінюється на лічильник кількості (−/+). Стан читається з наявного
// zustand-стора, тож лічильник у Header та сума корзини оновлюються реактивно.
//
// При додаванні фото товару «летить» у кошик (FlyToCart), і рівно в момент
// приземлення товар додається в стор (+1 у бейджі кошика).
export default function AddToCartControl({ product, variant = "card" }) {
  const t = useTranslations("ProductPage");
  const products = useProductStore((state) => state.products);
  const addProductToCart = useProductStore((state) => state.addProductToCart);
  const updateProductQuantity = useProductStore(
    (state) => state.updateProductQuantity
  );
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const wrapRef = useRef(null);
  const [fly, setFly] = useState(null);

  const isAvailable = product.availability === "in-stock";
  const index = products.findIndex(
    (p) => p.type === "catalog" && p.slug === product.slug
  );
  const inCart = index !== -1;
  const quantity = inCart ? products[index].quantity : 0;

  const addToStore = () => {
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

  const handleAdd = (e) => {
    e?.stopPropagation?.();
    if (!isAvailable || fly) return;

    // Знаходимо зображення товару поруч із контролом та іконку кошика.
    const card = wrapRef.current?.closest("[data-product-card]");
    const imgEl = card?.querySelector("img");
    const targetEl = document.querySelector('[data-cart-target="true"]');

    if (imgEl && product.mainImage && targetEl) {
      const r = imgEl.getBoundingClientRect();
      setFly({
        key: Date.now(),
        image: product.mainImage,
        startRect: { top: r.top, left: r.left, width: r.width, height: r.height },
      });
      // Додаємо в стор у момент приземлення анімації (див. onDone).
    } else {
      addToStore();
    }
  };

  const decrease = (e) => {
    e?.stopPropagation?.();
    if (quantity <= 1) deleteProduct(index);
    else updateProductQuantity(index, quantity - 1);
  };

  const increase = (e) => {
    e?.stopPropagation?.();
    if (quantity < MAX_QTY) updateProductQuantity(index, quantity + 1);
  };

  return (
    // Фіксована висота, щоб при зміні кнопка↔лічильник контент не «скакав».
    <div
      ref={wrapRef}
      className={`min-h-[54px] flex items-center ${
        variant === "page" ? "" : "w-full"
      }`}
    >
      {!inCart ? (
        <div className={variant === "page" ? "w-[240px]" : "w-full"}>
          <GradientButton
            text={t("addToCart")}
            onPress={handleAdd}
            isDisabled={!isAvailable}
          />
        </div>
      ) : (
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
      )}

      {fly && (
        <FlyToCart
          key={fly.key}
          startRect={fly.startRect}
          image={fly.image}
          onDone={() => {
            addToStore();
            setFly(null);
          }}
        />
      )}
    </div>
  );
}
