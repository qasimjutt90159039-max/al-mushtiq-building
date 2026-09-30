import React, { createContext, useContext, useState, useEffect } from 'react';
import { ICartItem, IProduct } from '../types';

interface CartContextType {
  cart: ICartItem[];
  addToCart: (product: IProduct, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  couponCode: string;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ICartItem[]>(() => {
    try {
      const saved = localStorage.getItem('al_mushtaq_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('al_mushtaq_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: IProduct, quantity: number = 1): boolean => {
    if (product.isQuotationRequired) {
      return false;
    }

    const qty = Math.max(product.minimumOrderQuantity || 1, quantity);

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + qty;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock)
        };
        return updated;
      } else {
        const newItem: ICartItem = {
          productId: product._id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          brand: product.brand,
          price: product.price,
          unit: product.unit,
          quantity: Math.min(qty, product.stock),
          image: product.thumbnail || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
          stock: product.stock,
          minimumOrderQuantity: product.minimumOrderQuantity || 1
        };
        return [...prev, newItem];
      }
    });
    return true;
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.productId === productId) {
          const clamped = Math.min(quantity, item.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setCouponCode('');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = subtotal >= 50000 || subtotal === 0 ? 0 : 1500;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const applyCoupon = async (code: string) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'BUILD10') {
      const d = Math.round(subtotal * 0.1);
      setDiscount(d);
      setCouponCode(upper);
      return { success: true, message: '10% contractor discount applied!' };
    } else if (upper === 'WELCOME5') {
      const d = Math.round(subtotal * 0.05);
      setDiscount(d);
      setCouponCode(upper);
      return { success: true, message: '5% welcome discount applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code. Try BUILD10.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        discount,
        total,
        couponCode,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
