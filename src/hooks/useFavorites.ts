import { useState, useEffect } from 'react';

export interface FavoriteAnimal {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  location: string;
  image: string;
  addedDate: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteAnimal[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('pawrescue_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('pawrescue_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (animal: FavoriteAnimal) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === animal.id)) {
        return prev; // Already in favorites
      }
      return [...prev, { ...animal, addedDate: new Date().toISOString().split('T')[0] }];
    });
  };

  const removeFromFavorites = (animalId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== animalId));
  };

  const isFavorite = (animalId: string) => {
    return favorites.some(fav => fav.id === animalId);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };
};