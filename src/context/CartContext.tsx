import { ReactNode, createContext, useState } from "react";

export interface IProduct {
    id: string;
    name: string;
    imgUrl: string;
    price: string;
    numberPrice: number;
    description: string;
    defaultPriceId: string
}

interface CartContextData {
    cartItems: IProduct[];
    addToCart: (product: IProduct) => void;
    checkIfItemAlreadyExists: (productId: string) => boolean;
    removeCartItem: (id: string) => void;
    cartTotal: number;
}

interface CartContextProviderProps {
    children: ReactNode;
}

export const CartContext = createContext({} as CartContextData)

export function CartContextProvider({ children }: CartContextProviderProps) {

    const [cartItems, setCartitems] = useState<IProduct[]>([])

    const cartTotal = cartItems.reduce((total, product) => {
        return total + product.numberPrice
    }, 0)

    function addToCart(product: IProduct) {
        setCartitems((state) => [...state, product])
    }

    function checkIfItemAlreadyExists(productId: string) {
        return cartItems.some((product) => product.id === productId)
    }

    function removeCartItem(id: string) {
        setCartitems((state) => state.filter(product => product.id !== id))
    }

    return (
        <CartContext.Provider value={{cartItems, addToCart, checkIfItemAlreadyExists, removeCartItem, cartTotal }}>
            {children}
        </CartContext.Provider>
    )

}
