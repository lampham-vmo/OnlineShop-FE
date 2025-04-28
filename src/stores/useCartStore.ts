import { ProductResponseCategoryName } from '@/generated/api/models';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// TODO: define interface for CartItem
interface CartItem {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  discount: number;
  rating: number | null;
  image: string;
  createdAt: string;
  priceAfterDis: number;
  categoryName: ProductResponseCategoryName;
}

// TODO: define interface for CartStore
interface CartStore {
  CartAmountCount: number;

  CartSubtotal: number;

  isCartOpen: boolean;
  cartItems: CartItem[];

  increase: () => void;
  decrease: () => void;

  calculateSubtotal: () => void;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setCartItem: (item: CartItem[]) => void;
  addItemToCart: (item: CartItem) => void;
  removeItemFromCart: (id: number) => void;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      CartAmountCount: 0,
      CartSubtotal: 0,
      isCartOpen: false,
      cartItems: [],

      // TODO: increase count (this is not really useful since we already had addItemToCart() )
      increase: () =>
        set((state) => ({ CartAmountCount: state.CartAmountCount + 1 })),

      decrease: () =>
        set((state) => ({ CartAmountCount: state.CartAmountCount - 1 })),

      // TODO: calculate price
      calculateSubtotal: () =>
        set((state) => ({
          CartSubtotal: state.cartItems.reduce(
            (total, item) => total + item.priceAfterDis,
            0,
          ),
        })),

      // TODO: cart open/close
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      // TODO: Add all items to cart
      setCartItem: (item) =>
        set(() => ({
          cartItems: item,
        })),
      // TODO: Add 1 item to cart
      addItemToCart: (item) =>
        set((state) => ({
          cartItems: [...state.cartItems, item],
        })),

      removeItemFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'cart-storage',
    },
  ),
);

export default useCartStore;
