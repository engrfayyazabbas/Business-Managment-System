'use client';

import { useEffect, useState } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  current_stock: number;
  unit: string;
}

export default function InventoryStatusCards() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/inventory');
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.id} className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-bold">{item.name}</h3>
          <p className="text-2xl">{item.current_stock} <span className="text-sm">{item.unit}</span></p>
        </div>
      ))}
    </div>
  );
}
