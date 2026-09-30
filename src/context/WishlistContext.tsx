import React, { createContext, useContext, useState, useEffect } from 'react';
import { IProduct } from '../types';

interface WishlistContextType {
  wishlist: IProduct[];
  addToWishlist: (product: IProduct) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: IProduct) => void;
  totalWishlist: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<IProduct[]>(() => {
    try {
      const saved = localStorage.getItem('al_mushtaq_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('al_mushtaq_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item._id === productId);
  };

  const addToWishlist = (product: IProduct) => {
    if (!isInWishlist(product._id)) {
      setWishlist(prev => [...prev, product]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item._id !== productId));
  };

  const toggleWishlist = (product: IProduct) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        totalWishlist: wishlist.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};
