import { create } from "zustand";
import { persist } from "zustand/middleware";
import { calculateTotalPrice } from "@/utils/pricing";

const useProductStore = create(
  persist(
    (set) => ({
      products: [],

      addProductToCart: (product) =>
        set((state) => ({ products: [...state.products, product] })),

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
