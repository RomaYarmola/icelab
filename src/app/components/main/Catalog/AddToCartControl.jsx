"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import GradientButton from "@/app/components/common/GradientButton";
import FlyToCart from "@/app/components/common/FlyToCart";
import useProductStore from "@/zustand/store/productStore";

const MAX_QTY = 99;

// Іконки лічильника. SVG замість текстових «−»/«+»: гліфи в різних шрифтах
// мають різну ширину й оптичний центр, через що кнопки виглядали кривими.
const Minus = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 7h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const Plus = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M7 3v8M3 7h8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

// На кількості 1 «мінус» перетворюється на кошик: інакше незрозуміло, що
// наступний клік не зменшить кількість, а прибере товар із замовлення.
const Trash = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M2.5 4h9M5.5 4V2.8h3V4M3.6 4l.5 7.2h5.8L10.4 4M6 6.2v3.4M8 6.2v3.4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

  // Картка стоїть на темному градієнті, сторінка товару — на білому, тож
  // лічильник має два набори кольорів. Раніше він був білою «цеглинкою» з
  // синьою рамкою і на картці читався як чужорідний елемент.
  const onDark = variant === "card";
  const isLast = quantity <= 1;

  const stepper = onDark
    ? "border-white/30 bg-white/10 text-white"
    : "border-commonBlue/30 bg-white text-commonBlue";
  const stepBtn = `h-full aspect-square flex items-center justify-center rounded-full transition-colors duration-150 active:scale-95 disabled:opacity-35 disabled:pointer-events-none ${
    onDark ? "hover:bg-white/20" : "hover:bg-commonBlue/10"
  }`;

  return (
    // Фіксована висота, щоб при зміні кнопка↔лічильник контент не «скакав».
    <div
      ref={wrapRef}
      className={`${onDark ? "min-h-[40px]" : "min-h-[54px]"} flex items-center ${
        variant === "page" ? "" : "w-full"
      }`}
    >
      {!inCart ? (
        <div className={variant === "page" ? "w-[240px]" : "w-full"}>
          <GradientButton
            text={t("addToCart")}
            onPress={handleAdd}
            isDisabled={!isAvailable}
            variant={onDark ? "small" : "normal"}
          />
        </div>
      ) : (
        <div className={`flex items-center gap-3 ${onDark ? "w-full" : ""}`}>
          <div
            className={`flex items-center justify-between rounded-full border p-[3px] ${
              onDark ? "h-[40px] w-full max-w-[150px]" : "h-[48px] w-[150px]"
            } ${stepper}`}
          >
            <button
              type="button"
              aria-label={isLast ? t("remove") : t("decrease")}
              title={isLast ? t("remove") : t("decrease")}
              onClick={decrease}
              className={stepBtn}
            >
              {isLast ? <Trash /> : <Minus />}
            </button>
            <span className="flex-1 text-center font-e-ukraine not-italic font-medium text-[15px] tabular-nums select-none">
              {quantity}
            </span>
            <button
              type="button"
              aria-label={t("increase")}
              title={t("increase")}
              onClick={increase}
              disabled={quantity >= MAX_QTY}
              className={stepBtn}
            >
              <Plus />
            </button>
          </div>
          {/* На картці поруч стоїть друга кнопка — підпис «Додано» там зайвий:
              зворотний зв'язок дає анімація польоту фото і лічильник кошика. */}
          {!onDark && (
            <span className="font-e-ukraine not-italic text-sm whitespace-nowrap text-commonBlue">
              {t("added")}
            </span>
          )}
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
