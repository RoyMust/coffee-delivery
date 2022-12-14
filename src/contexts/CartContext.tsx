import { createContext, ReactNode, useState } from "react";
import { CoffeeProps } from "../Pages/home/components/Card";
import { produce } from 'immer'

export interface CartItem extends CoffeeProps {
  quantity: number
}
interface CartContextType {
  cartItems: CartItem[]
  cartQuantity: number
  cartItemsTotal: number
  addCoffeeToCart: (coffee: CartItem) => void
  changeCartItemQuantity: (cartItemId: number, type: 'increase' | 'decrease') => void
  removeCartItem: (cartItemId: number) => void
}
interface CartContextProviderProps {
  children: ReactNode
}

export const CartContext = createContext({} as CartContextType)

export function CartContextProvider({ children }: CartContextProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const cartQuantity = cartItems.length

  const cartItemsTotal = cartItems.reduce((total, cartItem) => {
    return total + cartItem.price * cartItem.quantity
  }, 0)

  function addCoffeeToCart(coffee: CartItem) {
    const coffeeAlreadyExistsInCart = cartItems.findIndex(cartItem => cartItem.id === coffee.id
    )
    const newCart = produce(cartItems, (draft) => {
      if (coffeeAlreadyExistsInCart < 0) {
        draft.push(coffee)
      } else {
        draft[coffeeAlreadyExistsInCart].quantity += coffee.quantity;
      }
    })

    setCartItems(newCart)
  }

  function changeCartItemQuantity(cartItemId: number, type: "increase" | "decrease") {
    const newCart = produce(cartItems, (draft) => {
      const coffeeExistsInCart = cartItems.findIndex(
        (cartItem) => cartItem.id === cartItemId
      )
      if (coffeeExistsInCart >= 0) {
        const item = draft[coffeeExistsInCart];
        draft[coffeeExistsInCart].quantity =
          type === 'increase' ? item.quantity + 1 : item.quantity - 1
      }
    })
    setCartItems(newCart)
  }

  function removeCartItem(cartItemId: number) {
    const newCart = produce(cartItems, (draft) => {
      const coffeeExistsInCart = cartItems.findIndex(
        (cartItem) => cartItem.id == cartItemId)
      if (coffeeExistsInCart >= 0) {
        draft.splice(coffeeExistsInCart, 1)
      }
    })

    setCartItems(newCart)
  }

  return (
    <CartContext.Provider value={{
      cartItems, 
      cartQuantity,
      cartItemsTotal, 
      addCoffeeToCart, 
      changeCartItemQuantity, 
      removeCartItem
    }} >
      {children}
    </CartContext.Provider>
  )
}