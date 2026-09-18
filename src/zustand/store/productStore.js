import { create } from "zustand";
import { persist } from "zustand/middleware";
import { calculateTotalPrice } from "@/utils/pricing";
import { track } from "@/utils/analytics";

const useProductStore = create(
  persist(
    (set) => ({
      products: [],

      addProductToCart: (product) => {
        // Конверсія «додав у кошик» — тут, а не в кожній кнопці: так її не
        // пропустить жодне джерело (каталог, модалка головної, допродаж).
        track(
          "add_to_cart",
          {
            currency: "UAH",
            value: Number(product.totalPrice) || undefined,
            item_name: product.name || product.iceVariant,
            item_variant: product.size || undefined,
          },
          { tags: { cart_item: product.slug || product.iceVariantEnglish } }
        );
        set((state) => ({ products: [...state.products, product] }));
      },

      clearProducts: () => set({ products: [] }),

      updateProductQuantity: (index, quantity) =>
        set((state) => {
          const updatedProducts = [...state.products];
          const product = updatedProducts[index];
          if (product) {
            product.quantity = quantity;

            if (product.type === "catalog") {
              // Узагальнений товар каталогу: проста ціна = ціна × кількість.
              product.totalPrice = (product.price * quantity).toFixed(0);
            } else {
              // Наявна логіка розрахунку для сухого льоду / боксів.
              // tiers (з Price Settings) прокидуються, щоб джерело цін було одне.
              const { size, iceVariantEnglish, pricePerUnit, tiers } = product;
              product.totalPrice = calculateTotalPrice(
                quantity,
                size,
                iceVariantEnglish,
                pricePerUnit,
                tiers
              );
            }
          }
          return { products: updatedProducts };
        }),

      deleteProduct: (index) =>
        set((state) => {
          const updatedProducts = state.products.filter((_, i) => i !== index);
          return { products: updatedProducts };
        }),
    }),
    {
      name: "product-storage",
    }
  )
);

export default useProductStore;
