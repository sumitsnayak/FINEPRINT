import React, { createContext, useContext, useState } from 'react';
import { ScanResult, ProductCatalogItem } from '../types';

interface ScanContextType {
  activeScan: ScanResult | null;
  setActiveScan: (scan: ScanResult | null) => void;
  compareList: ProductCatalogItem[];
  addToCompare: (product: ProductCatalogItem) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScan, setActiveScan] = useState<ScanResult | null>(null);
  const [compareList, setCompareList] = useState<ProductCatalogItem[]>([]);

  const addToCompare = (product: ProductCatalogItem) => {
    if (compareList.length >= 4) {
      alert('You can compare a maximum of 4 products at a time.');
      return;
    }
    if (!compareList.find((p) => p.id === product.id)) {
      setCompareList([...compareList, product]);
    }
  };

  const removeFromCompare = (productId: number) => {
    setCompareList(compareList.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <ScanContext.Provider
      value={{
        activeScan,
        setActiveScan,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
};

