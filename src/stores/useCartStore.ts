import { CartProduct, Product, UserSuccessMessageFinalResponseDTO} from "@/generated/api/models";
import {create} from "zustand"
import { persist } from "zustand/middleware"
import { getCart } from "@/generated/api/endpoints/cart/cart";

const { cartControllerGetCart, cartControllerAddToCart, cartControllerDeleteCart, cartControllerClearCart, cartControllerIncreaseQuantity, cartControllerDecreaseQuantity } = getCart();

// TODO: define interface for CartItem
// TODO: define interface for CartStore
interface CartStore {
    itemCount: number,
    isCartOpen: boolean,
    cartItems: CartProduct[],
    subtotalPrice: number,
    totalPrice: number,

    getCartFromServer: () => Promise<void>,
    increaseCartItemQuantity: (id: number) => Promise<void>,
    decreaseCartItemQuantity: (id: number) => Promise<void>,

    calculatePrices: () => void

    openCart: () => void,
    closeCart: () => void,
    toggleCart: () => void,
    clearCartItems: () => Promise<UserSuccessMessageFinalResponseDTO | void>,
    addItemToCart: (item: Product) => Promise<void>,
    removeItemFromCart: (productId: number) => Promise<void>;

}

const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            itemCount: 0,
            isCartOpen: false,
            cartItems: [],
            subtotalPrice: 0,
            totalPrice: 0,

            getCartFromServer: async () => {
                const response = await cartControllerGetCart();
                const cartItems = response.data.items; // Adjust according to your API response shape
                set({ cartItems });
                console.log('cartItems: ', cartItems)
            },

                        // TODO: calculate price
            calculatePrices: () => {
                const itemsInCart = get().cartItems;

                const subtotalPrice = itemsInCart.reduce((total, item) => {
                    const discountedPrice = item.product.price - (item.product.price * item.product.discount / 100);
                    return total + discountedPrice;
                }, 0);

                const totalPrice = itemsInCart.reduce((total, item) => {
                    const discountedPrice = item.product.price - (item.product.price * item.product.discount / 100);
                    return total + (item.quantity * discountedPrice);
                }, 0);

                set({ subtotalPrice, totalPrice });

            },
        
            // TODO: increase count (this is not really useful since we already had addItemToCart() )
            increaseCartItemQuantity: async(id: number) => {
                await cartControllerIncreaseQuantity({id: id});
                set((state) => ({
                    cartItems: state.cartItems.map((item) => item.id === id ? {...item, quantity: item.quantity+1} : item),
                }))
                get().calculatePrices()},
         
        
            decreaseCartItemQuantity: async(id: number) =>{
                await cartControllerDecreaseQuantity({id: id})
                set((state) => ({
                    cartItems: state.cartItems.map((item) => item.id === id ? {...item, quantity: item.quantity-1} : item),
                }))
                get().calculatePrices()},
        

        
            // TODO: cart open/close
            openCart: () => set({isCartOpen: true}),
            closeCart: () => set({isCartOpen: false}),
            toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen})),
        
            // TODO: Add all items to cart
            clearCartItems: async() => {
                await cartControllerClearCart(),
                set({cartItems: []})
            },

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
                get().calculatePrices()
            },
            
            removeItemFromCart: async(productId: number ) =>
            {
                const itemsInCart = get().cartItems;
                await cartControllerDeleteCart({id: productId})
                set({cartItems: itemsInCart.filter(item => item.id !== productId )});
                get().calculatePrices();
            }
        }),
        {
            name: "cart-storage",
        }
    )
    
)

export default useCartStore;
