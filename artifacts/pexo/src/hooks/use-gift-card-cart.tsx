import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  currency: string;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (itemData: Omit<CartItem, 'id' | 'quantity'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const GiftCardCartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'gift_card_cart';

export const GiftCardCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (itemData: Omit<CartItem, 'id' | 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === itemData.productId);
      if (existing) {
        return prev.map(i => i.productId === itemData.productId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...itemData, id: `gc_${Date.now()}`, quantity: 1 }];
    });
    toast.success("Added to cart");
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success("Removed from cart");
  };

  const clearCart = () => setItems([]);

  return (
    <GiftCardCartContext.Provider value={{ items, isLoading, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </GiftCardCartContext.Provider>
  );
};

export const useGiftCardCart = () => {
  const context = useContext(GiftCardCartContext);
  if (!context) throw new Error('useGiftCardCart must be used within a GiftCardCartProvider');
  return context;
};
