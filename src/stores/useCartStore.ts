import {
  CartProduct,
  Product,
  UserSuccessMessageFinalResponseDTO,
} from '@/generated/api/models';
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
  totalItemCount: number;
  isCartOpen: boolean;
  cartItems: CartProduct[];
  subtotalPrice: number;
  totalPrice: number;

  getCartFromServer: () => Promise<void>;
  increaseCartItemQuantity: (id: number) => Promise<void>;
  decreaseCartItemQuantity: (id: number) => Promise<void>;

  updateCartState: () => void;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCartItems: () => Promise<UserSuccessMessageFinalResponseDTO | void>;
  addItemToCart: (item: Product) => Promise<void>;
  removeItemFromCart: (productId: number) => Promise<void>;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      totalItemCount: 0,
      isCartOpen: false,
      cartItems: [],
      subtotalPrice: 0,
      totalPrice: 0,

      // TODO: Add all items to cart

      updateCartState: () => {
        const itemsInCart = get().cartItems;

        const subtotalPrice = itemsInCart.reduce((total, item) => {
          const discountedPrice =
            item.product.price -
            (item.product.price * item.product.discount) / 100;
          return total + discountedPrice;
        }, 0);

        const totalPrice = itemsInCart.reduce((total, item) => {
          const discountedPrice =
            item.product.price -
            (item.product.price * item.product.discount) / 100;
          return total + item.quantity * discountedPrice;
        }, 0);

        const totalItemCount = itemsInCart.reduce(
          (total, item) => total + item.quantity,
          0,
        );
        set({ subtotalPrice, totalPrice, totalItemCount });
      },

      getCartFromServer: async () => {
        localStorage.removeItem('cart-storage');
        const response = await cartControllerGetCart();
        const cartItems = response.data.items;
        set({ cartItems });
        get().updateCartState();
        console.log('cartItems: ', cartItems);
      },
      // TODO: increase count
      increaseCartItemQuantity: async (id: number) => {
        await cartControllerIncreaseQuantity({ id: id });
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }));
        get().updateCartState();
      },

      decreaseCartItemQuantity: async (id: number) => {
        await cartControllerDecreaseQuantity({ id: id });
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
          ),
        }));
        get().updateCartState();
      },

      // TODO: cart open/close
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      clearCartItems: async () => {
        await cartControllerClearCart(), set({ cartItems: [] });
        get().updateCartState()
      },

      // TODO: Add 1 item to cart with BE
      addItemToCart: async (product: Product) => {
        const { cartItems } = get();
        // const existingItem = cartItems.some((item) => item.id === product.id);
        // if (existingItem) return;

        await cartControllerAddToCart({
          productId: product.id,
          quantity: 1,
        });

        const newCartItem: CartProduct = {
          id: product.id,
          product: product,
          quantity: 1,
        };

        set({ cartItems: [...cartItems, newCartItem] });
        get().updateCartState();
      },

      // TODO: Remove an item from the cart
      removeItemFromCart: async (productId: number) => {
        const itemsInCart = get().cartItems;
        await cartControllerDeleteCart({ id: productId });
        set({ cartItems: itemsInCart.filter((item) => item.id !== productId) });
        get().updateCartState();
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);

export default useCartStore;
