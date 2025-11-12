import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('melaCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('melaCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (course) => {
    setCart((prevCart) => {
      // Check if course already in cart
      const exists = prevCart.find((item) => item._id === course._id);
      if (exists) {
        return prevCart;
      }
      return [...prevCart, course];
    });
  };

  const removeFromCart = (courseId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== courseId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('melaCart');
  };

  const isInCart = (courseId) => {
    return cart.some((item) => item._id === courseId);
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => ({
        usd: total.usd + item.price,
        dot: total.dot + item.priceInDOT,
      }),
      { usd: 0, dot: 0 }
    );
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    getCartTotal,
    cartCount: cart.length,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
