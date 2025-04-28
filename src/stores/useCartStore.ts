import { CartProduct, Product} from "@/generated/api/models";
import {create} from "zustand"
import { persist } from "zustand/middleware"
import { getCart } from "@/generated/api/endpoints/cart/cart";

const { cartControllerGetCart, cartControllerAddToCart, cartControllerDeleteCart } = getCart();

// TODO: define interface for CartItem
// TODO: define interface for CartStore
interface CartStore {
    isCartOpen: boolean,
    cartItems: CartProduct[],

    getCartFromServer: () => Promise<void>,
    increaseCartItemQuantity: (id: number) => void,
    decreaseCartItemQuantity: (id: number) => void,

    calculateSubtotalPrice: () => number,
    calculateTotalPrice: () => number,

    openCart: () => void,
    closeCart: () => void,
    toggleCart: () => void,
    clearCartItems: () => void,
    addItemToCart: (item: Product) => Promise<void>,
    removeItemFromCart: (productId: number) => Promise<void>;

}

const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            isCartOpen: false,
            cartItems: [],

            getCartFromServer: async () => {
                const response = await cartControllerGetCart();
                const cartItems = response.data.items; // Adjust according to your API response shape
                set({ cartItems });
                console.log('cartItems: ', cartItems)
            },
        
            // TODO: increase count (this is not really useful since we already had addItemToCart() )
            increaseCartItemQuantity: (id: number) => 
                set((state) => ({
                    cartItems: state.cartItems.map((item) => item.id === id ? {...item, quantity: item.quantity+1} : item),
                })),
         
        
            decreaseCartItemQuantity: (id: number) =>
                set((state) => ({
                    cartItems: state.cartItems.map((item) => item.id === id ? {...item, quantity: item.quantity-1} : item),
                })),
        
            // TODO: calculate price
            calculateSubtotalPrice: () => {
                const itemsInCart = get().cartItems;
                const result =itemsInCart.reduce((total, item) => { 
                    return total + (item.product.price - (item.product.price * item.product.discount/100))},0);
                return result;
            },   

            calculateTotalPrice: () => {
                const itemsInCart = get().cartItems;
                const result =itemsInCart.reduce((total, item) => { 
                    return total + (item.quantity * (item.product.price - (item.product.price * item.product.discount/100)))},0);
                return result;
            },
        
            // TODO: cart open/close
            openCart: () => set({isCartOpen: true}),
            closeCart: () => set({isCartOpen: false}),
            toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen})),
        
            // TODO: Add all items to cart
            clearCartItems: () => 
                set(()=> ({
                    cartItems: []
                })),

            // TODO: Add 1 item to cart with BE
            addItemToCart: async(product: Product) => {
                const { cartItems } = get()
                const existingItem = cartItems.some((item) => item.id === product.id)
                if (existingItem) return

                await cartControllerAddToCart({
                    productId: product.id,
                    quantity: 1
                });

                const newCartItem: CartProduct = {
                    id: product.id,
                    product: product,
                    quantity: 1
                }

                set({cartItems: [...cartItems, newCartItem]});
            },
            
            removeItemFromCart: async(productId: number ) =>
            {
                const {cartItems} = get();
                await cartControllerDeleteCart({id: productId})
                set({cartItems: cartItems.filter(item => item.id !== productId )});
            }
        }),
        {
            name: "cart-storage",
        }
    )
    
)

export default useCartStore;
