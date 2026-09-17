import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { MOCK_WARDROBE } from '../data/mockData';

const WardrobeContext = createContext();

export function WardrobeProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWardrobe() {
      try {
        const data = await api.wardrobe.getItems();
        setItems(data || MOCK_WARDROBE);
      } catch {
        setItems(MOCK_WARDROBE);
      } finally {
        setLoading(false);
      }
    }
    loadWardrobe();
  }, []);

  const addItem = async (newItem) => {
    const created = await api.wardrobe.addItem(newItem);
    setItems(prev => [created, ...prev]);
    return created;
  };

  const removeItem = async (id) => {
    await api.wardrobe.deleteItem(id);
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const incrementWear = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, wearCount: (item.wearCount || 0) + 1 } : item));
  };

  return (
    <WardrobeContext.Provider value={{ items, loading, addItem, removeItem, incrementWear }}>
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
}
