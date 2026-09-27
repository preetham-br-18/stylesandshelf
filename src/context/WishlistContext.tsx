import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { trackEvent } from '../lib/analytics';

const WISHLIST_KEY = 'style-shelf-wishlist';
const WISHLIST_MODIFIED_FLAG = 'style-shelf-wishlist-user-modified';

interface WishlistContextType {
  wishlistIds: string[];
  isWishlisted: (id: number | string) => boolean;
  toggleWishlist: (id: number | string, productName?: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // If the stored value was the old legacy default ['1', '8'] and the user hasn't explicitly added them, reset to empty
          const wasUserModified = localStorage.getItem(WISHLIST_MODIFIED_FLAG);
          if (!wasUserModified && parsed.length === 2 && parsed.includes('1') && parsed.includes('8')) {
            localStorage.setItem(WISHLIST_KEY, JSON.stringify([]));
            return [];
          }
          return parsed.map(String);
        }
      }
    } catch (e) {
      console.warn('Failed to load wishlist from localStorage:', e);
    }
    return []; // Wishlist is empty by default
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage:', e);
    }
  }, [wishlistIds]);

  const isWishlisted = useCallback(
    (id: number | string) => wishlistIds.includes(String(id)),
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    (id: number | string, productName?: string) => {
      try {
        localStorage.setItem(WISHLIST_MODIFIED_FLAG, 'true');
      } catch {}
      const stringId = String(id);
      setWishlistIds(prev => {
        const exists = prev.includes(stringId);
        const next = exists ? prev.filter(item => item !== stringId) : [...prev, stringId];
        trackEvent(exists ? 'wishlist_remove' : 'wishlist_add', {
          productId: id,
          productName: productName || `Product #${id}`
        });
        return next;
      });
    },
    []
  );

  const clearWishlist = useCallback(() => {
    try {
      localStorage.setItem(WISHLIST_MODIFIED_FLAG, 'true');
    } catch {}
    setWishlistIds([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isWishlisted,
        toggleWishlist,
        clearWishlist,
        wishlistCount: wishlistIds.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
