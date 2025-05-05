import { CartProduct } from '@/generated/api/models';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCart } from '@/generated/api/endpoints/cart/cart';

const {
  cartControllerGetCart,
  cartControllerAddToCart,
  cartControllerDeleteCart,
  cartControllerClearCart,
  cartControllerIncreaseQuantity,
  cartControllerDecreaseQuantity,
} = getCart();

// TODO: define interface for CartStore
interface CartStore {
  isCartModalOpen: boolean;
  cartItems: CartProduct[];
  subTotal: number;
  total: number;

  closeCartModal: () => void;
  toggleCartModal: () => void;

  calculateTotal: () => void;
  getCartFromServer: () => Promise<void>;
  clearCartStorage: () => void;

  addItemToCart: (id: number, quantity?: number) => Promise<void>;
  removeItemFromCart: (cartProductId: number) => Promise<void>;
  clearCartItems: () => Promise<void>;
  increaseCartItemQuantity: (id: number) => Promise<void>;
  decreaseCartItemQuantity: (id: number) => Promise<void>;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      isCartModalOpen: false,
      cartItems: [],
      subTotal: 0,
      total: 0,

      // TODO: ToggleCartModal
      closeCartModal: () => set({ isCartModalOpen: false }),
      toggleCartModal: () =>
        set((state) => ({ isCartModalOpen: !state.isCartModalOpen })),

      // TODO: Calculate total
      calculateTotal: () => {
        const itemsInCart = get().cartItems;
        const total = itemsInCart.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );
        const subtotal = itemsInCart.reduce(
          (sum, item) =>
            sum +
            item.product.price *
              (1 - item.product.discount / 100) *
              item.quantity,
          0,
        );
        set({ subTotal: subtotal, total: total });
      },

      // TODO: getCartFromServer
      getCartFromServer: async () => {
        const response = await cartControllerGetCart();
        set({
          cartItems: response.data.items,
          total: response.data.total,
          subTotal: response.data.subtotal,
        });
      },

      // TODO: Clear cart in local storage
      clearCartStorage: () => {
        set({
          isCartModalOpen: false,
          cartItems: [],
          subTotal: 0,
          total: 0,
        });
      },

      // TODO: Add new item to cart
      addItemToCart: async (id: number, quantity = 1) => {
        await cartControllerAddToCart({ productId: id, quantity: quantity });
        await get().getCartFromServer();
      },

      // TODO: Remove an item from the cart
      removeItemFromCart: async (id: number) => {
        const itemsInCart = get().cartItems;
        await cartControllerDeleteCart({ id: id });
        set({ cartItems: itemsInCart.filter((item) => item.id !== id) });
        get().calculateTotal();
      },

      // TODO: Clear all items in cart
      clearCartItems: async () => {
        await cartControllerClearCart();
        get().clearCartStorage();
      },

      // TODO: Increase item in cart
      increaseCartItemQuantity: async (id: number) => {
        await cartControllerIncreaseQuantity({ id: id });
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }));
        get().calculateTotal();
      },

      // TODO: Decrease item in cart
      decreaseCartItemQuantity: async (id: number) => {
        await cartControllerDecreaseQuantity({ id: id });
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
          ),
        }));
        get().calculateTotal();
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        isCartModalOpen: state.isCartModalOpen,
        cartItems: state.cartItems,
        subTotal: state.subTotal,
        total: state.total,
      }),
    },
  ),
);

export default useCartStore;
