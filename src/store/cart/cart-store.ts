import { ProductCart } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SumaryData {
  subTotal: number;
  tax: number;
  total: number;
  itemsInCart: number;
}

interface State {
  cart: ProductCart[];

  getTotalItems: () => number;
  getSummaryInformation: () => SumaryData;

  addProductCart: (product: ProductCart) => void;
  removeProductCart: (product: ProductCart) => void;
  updateProductCart: (product: ProductCart, quantity: number) => void;

  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      // Methods

      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSummaryInformation: () => {
        const { cart, getTotalItems } = get();
        const subTotal = cart.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        const tax = subTotal * 0.15;
        const total = subTotal + tax;

        const itemsInCart = getTotalItems();

        return {
          subTotal,
          tax,
          total,
          itemsInCart,
        };
      },

      addProductCart: (product) => {
        const { cart } = get();

        // 1. Revisar si el producto existe en el carrito con el talle seleccionado
        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );

        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        // 2. Se que el producto existe por talle
        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          }

          return item;
        });

        set({ cart: updatedCartProducts });
      },
      updateProductCart: (product, quantity) => {
        const { cart } = get();

        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity };
          }
          return item;
        });
        set({ cart: updatedCartProducts });
      },
      removeProductCart: (product) => {
        console.log("Product", product);

        const { cart } = get();
        const updatedCartProducts = cart.filter(
          (item) => item.id !== product.id || item.size !== product.size
        );
        // console.log(updatedCartProducts);

        set({ cart: updatedCartProducts });
      },

      clearCart: () => {
        set({ cart: [] })
      },
    }),

    {
      name: "shopping-cart",
    }
  )
);
