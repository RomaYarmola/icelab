import { create } from "zustand";
import { persist } from "zustand/middleware";

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

            const size = updatedProducts[index].size;
            const pricePerUnit =
              updatedProducts[index].pricePerUnit?.iceBox?.[
                parseInt(size, 10)
              ] || updatedProducts[index].pricePerUnit?.dryIce;

            if (pricePerUnit) {
              updatedProducts[index].totalPrice = (
                quantity * pricePerUnit
              ).toFixed(0);
            } else {
              updatedProducts[index].totalPrice = "0";
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
