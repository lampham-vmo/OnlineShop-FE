import { CartProduct} from "@/generated/api/models";
import {create} from "zustand"
import { persist } from "zustand/middleware"

// TODO: define interface for CartItem


// TODO: define interface for CartStore
interface CartStore {
    CartItemCount: number,

    CartSubtotal: number,
    
    isCartOpen: boolean,
    cartItems: CartProduct[],

    increase: () => void,
    decrease: () => void,

    calculateSubtotal: () => number,

    openCart: () => void,
    closeCart: () => void,
    toggleCart: () => void,
    setCartItems: (item: CartProduct[]) => void, 
    addItemToCart: (item: CartProduct) => void,
    removeItemFromCart: (id: number) => void,

}

const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            CartItemCount: 0,
            CartSubtotal: 0,
            isCartOpen: false,
            cartItems: [],
        
            // TODO: increase count (this is not really useful since we already had addItemToCart() )
            increase: () => 
                set((state) => ({ CartItemCount: state.CartItemCount + 1 })),
        
            decrease: () =>
                set((state) => ({ CartItemCount: state.CartItemCount - 1})),
        
            // TODO: calculate price
            calculateSubtotal: () => {
                const items = get().cartItems;
                const result =items.reduce((total, item) => total + item.priceAfterDis,0);
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
            // TODO: Add 1 item to cart
            addItemToCart: (item:CartProduct) => 
               {
                console.log("Item added", item) 
                set((state) => ({
                cartItems: [...state.cartItems, item],
                }))
            },
            
            removeItemFromCart: (id) => 
                set((state) => ({
                cartItems:state.cartItems.filter((item) => item.id !== id),
                })),
        }),
        {
            name: "cart-storage",
        }
    )
    
)

export default useCartStore