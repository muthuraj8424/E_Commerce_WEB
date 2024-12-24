import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const CartContext = createContext();

// CartProvider component to wrap around your app
export const CartProvider = ({ children }) => {
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

  const [cart, setCart] = useState(storedCart);

  // Calculate total price
  const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);

  // Function to add product to cart or increase its quantity
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if the product already exists in the cart
      const existingProduct = prevCart.find((item) => item._id === product._id);
  
      if (existingProduct) {
        // If the product is already in the cart, return the current cart without changes
        return prevCart;
      } else {
        // If the product is not in the cart, add it with a default quantity of 1
        const updatedCart = [...prevCart, { ...product, quantity: 1 }];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      }
    });
  };
  

  // Function to decrease product quantity or remove it if quantity is 1
  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Function to update product quantity in the cart
  const updateQuantity = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === productId
          ? { ...item, quantity: item.quantity + 1 } // Increment the quantity
          : item
      );
  
      // Optionally, filter out items where quantity is zero (if needed)
      const filteredCart = updatedCart.filter((item) => item.quantity > 0);
  
      localStorage.setItem("cart", JSON.stringify(filteredCart)); // Store updated cart in localStorage
      return filteredCart; // Return the updated cart
    });
  };
  
  

  // Function to remove product from cart entirely
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((product) => product._id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, decreaseQuantity, updateQuantity, removeFromCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => useContext(CartContext);