import { CartProduct, Product} from "@/generated/api/models";
import {create} from "zustand"
import { persist } from "zustand/middleware"

// TODO: define interface for CartItem
interface CartItem {
    id: number,
    product: Product,
    quantity: number
}

// TODO: define interface for CartStore
interface CartStore {
    isCartOpen: boolean,
    cartItems: CartItem[],

    increaseCartItemQuantity: (id: number) => void,
    decreaseCartItemQuantity: (id: number) => void,

    calculateSubtotal: () => number,
    calculateTotal: () => number,

    openCart: () => void,
    closeCart: () => void,
    toggleCart: () => void,
    setCartItems: (item: CartItem[]) => void, 
    clearCartItems: () => void,
    addItemToCart: (item: Product) => void,
    removeItemFromCart: (id: number) => void,

}

const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            isCartOpen: false,
            cartItems: [],
        
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
            calculateSubtotal: () => {
                const itemsInCart = get().cartItems;
                const result =itemsInCart.reduce((total, item) => { 
                    return total + (item.product.price - (item.product.price * item.product.discount/100))},0);
                return result;
            },   

            calculateTotal: () => {
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
            setCartItems: (item) => 
                set(() => ({
                    cartItems: item
                })),

            clearCartItems: () => 
                set(()=> ({
                    cartItems: []
                })),
            // TODO: Add 1 item to cart
            addItemToCart: (product: Product) => 
               {
                set((state) => {
                    const existingItem = state.cartItems.some(item => item.product.id === product.id);
                    console.log("existingItem: ",existingItem)
                    if(existingItem){return state}

                    const newCartItem: CartItem = {
                        id: Date.now(), // se duoc set sau
                        product: product,
                        quantity: 1,
                      };
                
                      return { cartItems: [...state.cartItems, newCartItem] };
                  })
            },
            
            removeItemFromCart: (productId: number) => 
                set((state) => ({
                cartItems:state.cartItems.filter((item) => item.id !== productId),
                })),
        }),
        {
            name: "cart-storage",
        }
    )
    
)

export default useCartStore;
