'use client';

import { useState, useEffect } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  current_stock: number;
}

interface AddProductionFormProps {
  onProductionAdded: () => void;
}

export default function AddProductionForm({ onProductionAdded }: AddProductionFormProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    inventory_item_id: '',
    type: 'production',
    quantity: '',
    transaction_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch('/api/inventory');
        if (res.ok) {
          const data = await res.json();
          // Filter for finished goods (Noodles/Momos)
          const finishedGoods = data.filter((item: InventoryItem) => 
            ['Noodles Pack', 'Momos'].includes(item.name)
          );
          setItems(finishedGoods);
        }
      } catch {
        setError('Failed to fetch finished goods');
      }
    }
    fetchItems();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/inventory/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity)
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to record production');
      }

      setSuccess(true);
      setFormData({
        inventory_item_id: '',
        type: 'production',
        quantity: '',
        transaction_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      onProductionAdded();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card production-form">
      <h3>Record Production</h3>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Production recorded successfully!</div>}

      <div className="form-group">
        <label htmlFor="inventory_item_id">Finished Good</label>
        <select
          id="inventory_item_id"
          name="inventory_item_id"
          value={formData.inventory_item_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Item</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.unit})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity Produced</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="transaction_date">Production Date</label>
        <input
          type="date"
          id="transaction_date"
          name="transaction_date"
          value={formData.transaction_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Shift details or quality notes..."
          rows={2}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : 'Record Production'}
      </button>

      <style jsx>{`
        .production-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          width: 100%;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #666;
        }
        textarea {
          padding: 0.6rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-family: inherit;
        }
        .success-message {
          color: #155724;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }
        .error-message {
          color: #721c24;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }
      `}</style>
    </form>
  );
}
