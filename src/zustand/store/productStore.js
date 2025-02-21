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
          if (updatedProducts[index]) {
            updatedProducts[index].quantity = quantity;

            const { size, iceVariantEnglish, pricePerUnit } =
              updatedProducts[index];

            updatedProducts[index].totalPrice = calculateTotalPrice(
              quantity,
              size,
              iceVariantEnglish,
              pricePerUnit
            );
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
