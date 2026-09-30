import React, { createContext, useContext, useState } from 'react';
import { IProduct } from '../types';

interface CompareContextType {
  compareList: IProduct[];
  addToCompare: (product: IProduct) => boolean;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<IProduct[]>([]);

  const isInCompare = (productId: string) => {
    return compareList.some(item => item._id === productId);
  };

  const addToCompare = (product: IProduct): boolean => {
    if (isInCompare(product._id)) {
      removeFromCompare(product._id);
      return false;
    }
    if (compareList.length >= 4) {
      alert('You can compare a maximum of 4 products at a time.');
      return false;
    }
    setCompareList(prev => [...prev, product]);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(item => item._id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within a CompareProvider');
  return ctx;
};
