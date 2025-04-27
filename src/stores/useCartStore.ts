import { CartProduct, Product} from "@/generated/api/models";
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
    calculateTotal: () => number,

    openCart: () => void,
    closeCart: () => void,
    toggleCart: () => void,
    setCartItems: (item: CartProduct[]) => void, 
    clearCartItems: () => void,
    addItemToCart: (item: Product) => void,
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
                const itemsInCart = get().cartItems;
                // items trong cart vẫn có priceAfterDis
                const result =itemsInCart.reduce((total, item) => { 
                    return total + (item.product.price - (item.product.price * item.product.discount/100))},0);
                return result;
            },   

            calculateTotal: () => {
                const itemsInCart = get().cartItems;
                console.log("Item in cart:",itemsInCart)
                // items trong cart vẫn có priceAfterDis
                const result =itemsInCart.reduce((total, item) => { 
                    console.log("Item.product.price: ", item.product)
                    return total + (item.product.price - (item.product.price * item.product.discount/100))},0);
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

                    const newCartItem: CartProduct = {
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

export default useCartStore