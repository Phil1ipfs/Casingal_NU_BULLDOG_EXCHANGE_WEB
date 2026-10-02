// src/context/FavoritesContext.jsx
// Saved items (wishlist) persisted to localStorage, like the cart.
import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();
const STORAGE_KEY = 'nuWishlist';

const loadFavorites = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(loadFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage unavailable (private mode etc.) — keep in-memory state only.
    }
  }, [favorites]);

  const isFavorite = (id) => favorites.includes(id);

  // Returns true when the item is now saved.
  const toggleFavorite = (id) => {
    const willSave = !favorites.includes(id);
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
    return willSave;
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
