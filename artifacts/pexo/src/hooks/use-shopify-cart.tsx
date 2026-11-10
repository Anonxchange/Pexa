import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { shopifyService, formatCheckoutUrl } from '@/lib/shopify-service';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  variantId: string;
  title: string;
  price: number;
  currency: string;
  quantity: number;
  image?: string;
  availableForSale?: boolean;
}

interface CartContextType {
  cartId: string | null;
  checkoutUrl: string | null;
  items: CartItem[];
  isLoading: boolean;
  addToCart: (variantId: string, itemData: Omit<CartItem, 'id' | 'quantity'>) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'shopify_cart_id';
const CHECKOUT_URL_KEY = 'shopify_checkout_url';
const ITEMS_PREFIX = 'cart_items_';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartId, setCartId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CART_ID_KEY);
  });
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(CHECKOUT_URL_KEY);
    return stored ? formatCheckoutUrl(stored) : null;
  });
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const storedCartId = localStorage.getItem(CART_ID_KEY);
      if (storedCartId) {
        const storedItems = localStorage.getItem(`${ITEMS_PREFIX}${storedCartId}`);
        if (storedItems) {
          const parsed = JSON.parse(storedItems);
          return Array.isArray(parsed) ? [...parsed] : [];
        }
      }
    } catch (e) {
      console.error("useCart: Initial items load error", e);
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const isRefreshing = React.useRef(false);

  const itemsRef = React.useRef<CartItem[]>([]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Use a ref for checkoutUrl so refreshCart doesn't need it as a dependency
  const checkoutUrlRef = React.useRef(checkoutUrl);
  useEffect(() => {
    checkoutUrlRef.current = checkoutUrl;
  }, [checkoutUrl]);

  const clearCart = useCallback(() => {
    if (typeof window === 'undefined') return;
    const currentId = localStorage.getItem(CART_ID_KEY);
    localStorage.removeItem(CART_ID_KEY);
    localStorage.removeItem(CHECKOUT_URL_KEY);
    if (currentId) localStorage.removeItem(`${ITEMS_PREFIX}${currentId}`);

    setCartId(null);
    setCheckoutUrl(null);
    setItems([]);

    window.dispatchEvent(new CustomEvent('shopify-cart-updated', { detail: { action: 'clear', source: 'internal' } }));
  }, []);

  const refreshCart = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const currentCartId = localStorage.getItem(CART_ID_KEY);
    if (!currentCartId) return;

    if (isRefreshing.current) return;
    isRefreshing.current = true;

    if (itemsRef.current.length === 0) {
      setIsLoading(true);
    }
    try {
      const data = await shopifyService.getCart(currentCartId);

      if (data && data.items) {
        const newItems = Array.isArray(data.items) ? [...data.items] : [];

        const itemsWithInventory = newItems.map(item => {
          const localItem = itemsRef.current.find(li => li.id === item.id);
          return {
            ...item,
            availableForSale: item.availableForSale ?? localItem?.availableForSale ?? true
          };
        });

        // Don't let an empty server response wipe non-empty local state
        if (newItems.length === 0 && itemsRef.current.length > 0) {
          console.warn("useCart: Shopify returned empty cart but local state has items. Preserving local state.");
          return;
        }

        const isDifferent = JSON.stringify(itemsWithInventory) !== JSON.stringify(itemsRef.current);
        const hasNewCheckoutUrl = data.checkoutUrl && data.checkoutUrl !== checkoutUrlRef.current;

        if (isDifferent || hasNewCheckoutUrl) {
          localStorage.setItem(CHECKOUT_URL_KEY, data.checkoutUrl || '');
          localStorage.setItem(`${ITEMS_PREFIX}${currentCartId}`, JSON.stringify(itemsWithInventory));

          setCartId(currentCartId);
          setCheckoutUrl(data.checkoutUrl);
          setItems(itemsWithInventory);
        }
      } else if (data === null) {
        // Cart confirmed deleted by Shopify
        clearCart();
      }
    } catch (error) {
      console.error("useCart: Error refreshing cart:", error);
    } finally {
      setIsLoading(false);
      isRefreshing.current = false;
    }
  }, [clearCart]);

  useEffect(() => {
    const handleExternalUpdate = (e: any) => {
      // Skip events we dispatched ourselves
      if (e?.detail?.source === 'internal') return;

      const storedCartId = localStorage.getItem(CART_ID_KEY);
      const storedCheckoutUrl = localStorage.getItem(CHECKOUT_URL_KEY);

      const sanitizedCheckoutUrl = storedCheckoutUrl ? formatCheckoutUrl(storedCheckoutUrl) : storedCheckoutUrl;
      setCartId(prev => storedCartId !== prev ? storedCartId : prev);
      setCheckoutUrl(prev => sanitizedCheckoutUrl !== prev ? sanitizedCheckoutUrl : prev);

      if (storedCartId) {
        const storedItems = localStorage.getItem(`${ITEMS_PREFIX}${storedCartId}`);
        if (storedItems) {
          try {
            const parsed = JSON.parse(storedItems);
            const freshItems = Array.isArray(parsed) ? parsed : [];
            if (JSON.stringify(freshItems) !== JSON.stringify(itemsRef.current)) {
              setItems([...freshItems]);
            }
          } catch (err) {
            console.error("useCart: handleUpdate parse error", err);
          }
        }
      }
    };

    const storageListener = (e: StorageEvent) => {
      if (e.key === CART_ID_KEY || e.key === CHECKOUT_URL_KEY || (e.key && e.key.startsWith(ITEMS_PREFIX))) {
        handleExternalUpdate(e);
      }
    };

    window.addEventListener('storage', storageListener);
    window.addEventListener('cart-updated', handleExternalUpdate);
    window.addEventListener('shopify-cart-updated', handleExternalUpdate);

    // Initial fetch only if we have a cart but no items loaded
    const timer = setTimeout(() => {
      const initialCheckoutUrl = localStorage.getItem(CHECKOUT_URL_KEY);
      if (initialCheckoutUrl && !checkoutUrlRef.current) {
        setCheckoutUrl(formatCheckoutUrl(initialCheckoutUrl));
      }
      const initialCartId = localStorage.getItem(CART_ID_KEY);
      if (initialCartId && itemsRef.current.length === 0) {
        refreshCart();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', storageListener);
      window.removeEventListener('cart-updated', handleExternalUpdate);
      window.removeEventListener('shopify-cart-updated', handleExternalUpdate);
    };
  }, [refreshCart]);

  const addToCart = async (variantId: string, itemData: Omit<CartItem, 'id' | 'quantity'>) => {
    setIsLoading(true);
    try {
      const currentCartId = localStorage.getItem(CART_ID_KEY);

      if (!currentCartId) {
        const result = await shopifyService.createCart({ variantId, quantity: 1 });
        if (result && result.cartId) {
          const newItem: CartItem = {
            ...itemData,
            id: result.lineId || `temp_${Date.now()}`,
            variantId,
            quantity: 1,
            availableForSale: true
          };

          localStorage.setItem(CART_ID_KEY, result.cartId);
          localStorage.setItem(CHECKOUT_URL_KEY, result.checkoutUrl || '');
          localStorage.setItem(`${ITEMS_PREFIX}${result.cartId}`, JSON.stringify([newItem]));

          setCartId(result.cartId);
          setCheckoutUrl(result.checkoutUrl);
          setItems([newItem]);

          toast.success("Added to cart!");
          window.dispatchEvent(new CustomEvent('shopify-cart-updated', {
            detail: { action: 'add', cartId: result.cartId, source: 'internal' }
          }));
        }
      } else {
        const result = await shopifyService.addLineToCart(currentCartId, { variantId, quantity: 1 });
        if (result.success) {
          const newItem: CartItem = {
            ...itemData,
            id: result.lineId || `temp_${Date.now()}`,
            variantId,
            quantity: 1,
            availableForSale: true
          };

          const currentItems = [...itemsRef.current];
          const existingIndex = currentItems.findIndex(item => item.variantId === variantId);

          let updatedItems: CartItem[];
          if (existingIndex > -1) {
            updatedItems = currentItems.map((item, idx) =>
              idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
            );
          } else {
            updatedItems = [...currentItems, newItem];
          }

          localStorage.setItem(`${ITEMS_PREFIX}${currentCartId}`, JSON.stringify(updatedItems));
          setItems(updatedItems);

          toast.success("Added to cart!");

          // If checkout URL is missing, fetch it once
          const currentCheckoutUrl = localStorage.getItem(CHECKOUT_URL_KEY);
          if (!currentCheckoutUrl || currentCheckoutUrl === 'null' || currentCheckoutUrl === '') {
            await refreshCart();
          }

          window.dispatchEvent(new CustomEvent('shopify-cart-updated', {
            detail: { action: 'add', cartId: currentCartId, source: 'internal' }
          }));
        } else if (result.cartNotFound) {
          clearCart();
          const retryResult = await shopifyService.createCart({ variantId, quantity: 1 });
          if (retryResult && retryResult.cartId) {
            const newItem: CartItem = {
              ...itemData,
              id: retryResult.lineId || `temp_${Date.now()}`,
              variantId,
              quantity: 1
            };
            localStorage.setItem(CART_ID_KEY, retryResult.cartId);
            localStorage.setItem(CHECKOUT_URL_KEY, retryResult.checkoutUrl || '');
            localStorage.setItem(`${ITEMS_PREFIX}${retryResult.cartId}`, JSON.stringify([newItem]));
            setCartId(retryResult.cartId);
            setCheckoutUrl(retryResult.checkoutUrl);
            setItems([newItem]);
            toast.success("Added to cart!");
            window.dispatchEvent(new CustomEvent('shopify-cart-updated', {
              detail: { action: 'add', cartId: retryResult.cartId, source: 'internal' }
            }));
          }
        }
      }
    } catch (error) {
      console.error("useCart: Error in addToCart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    const currentCartId = localStorage.getItem(CART_ID_KEY);
    if (!currentCartId) return;

    const previousItems = [...itemsRef.current];
    const updatedItems = itemsRef.current.map(item =>
      item.id === lineId ? { ...item, quantity } : item
    );
    setItems(updatedItems);
    localStorage.setItem(`${ITEMS_PREFIX}${currentCartId}`, JSON.stringify(updatedItems));

    setIsLoading(true);
    try {
      const result = await shopifyService.updateCartLine(currentCartId, lineId, quantity);
      if (result.success) {
        await refreshCart();
        window.dispatchEvent(new CustomEvent('shopify-cart-updated', {
          detail: { action: 'update', lineId, quantity, source: 'internal' }
        }));
      } else if (result.cartNotFound) {
        clearCart();
      } else {
        // Revert optimistic update on failure
        setItems(previousItems);
        localStorage.setItem(`${ITEMS_PREFIX}${currentCartId}`, JSON.stringify(previousItems));
      }
    } catch (error) {
      setItems(previousItems);
      localStorage.setItem(`${ITEMS_PREFIX}${currentCartId}`, JSON.stringify(previousItems));
      toast.error("Failed to update quantity");
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    const currentCartId = localStorage.getItem(CART_ID_KEY);
    if (!currentCartId) return;

    const previousItems = [...itemsRef.current];
    const updatedItems = itemsRef.current.filter(item => item.id !== lineId);
    setItems(updatedItems);
    localStorage.setItem(`${ITEMS_PREFIX}${currentCartId}`, JSON.stringify(updatedItems));

    setIsLoading(true);
    try {
      const result = await shopifyService.removeLineFromCart(currentCartId, lineId);
      if (result.success) {
        if (updatedItems.length === 0) {
          clearCart();
        } else {
          await refreshCart();
        }
        toast.success("Item removed from cart");
        window.dispatchEvent(new CustomEvent('shopify-cart-updated', {
          detail: { action: 'remove', lineId, source: 'internal' }
        }));
      } else if (result.cartNotFound) {
        clearCart();
      } else {
        setItems(previousItems);
        localStorage.setItem(`${ITEMS_PREFIX}${currentCartId}`, JSON.stringify(previousItems));
      }
    } catch (error) {
      setItems(previousItems);
      localStorage.setItem(`${ITEMS_PREFIX}${currentCartId}`, JSON.stringify(previousItems));
      toast.error("Failed to remove item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cartId,
      checkoutUrl,
      items,
      isLoading,
      addToCart,
      updateQuantity,
      removeItem,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
