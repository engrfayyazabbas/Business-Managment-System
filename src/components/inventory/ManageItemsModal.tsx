'use client';

import { useState, useEffect } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  is_archived: boolean;
}

interface ManageItemsModalProps {
  onClose: () => void;
  onItemsChanged: () => void;
}

export default function ManageItemsModal({ onClose, onItemsChanged }: ManageItemsModalProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', unit: '' });
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/inventory/items');
      if (res.ok) {
        const data = await res.json();
        // Filter out finished goods from this management view if desired, 
        // but showing all might be better for full control.
        setItems(data);
      }
    } catch {
      setError('Failed to fetch items');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/inventory/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        setNewItem({ name: '', unit: '' });
        fetchItems();
        onItemsChanged();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add item');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const toggleArchive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/inventory/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_archived: !currentStatus }),
      });

      if (res.ok) {
        fetchItems();
        onItemsChanged();
      }
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card card">
        <div className="modal-header">
          <h3>Manage Inventory Items</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleAdd} className="add-item-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Item Name (e.g. Salt)"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Unit (e.g. kg)"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '...' : 'Add'}
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </form>

        <div className="items-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={item.is_archived ? 'archived' : ''}>
                  <td>{item.name}</td>
                  <td>{item.unit}</td>
                  <td>
                    <span className={`status-badge ${item.is_archived ? 'inactive' : 'active'}`}>
                      {item.is_archived ? 'Archived' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`btn-text ${item.is_archived ? 'restore' : 'archive'}`}
                      onClick={() => toggleArchive(item.id, item.is_archived)}
                    >
                      {item.is_archived ? 'Restore' : 'Archive'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
        }
        .modal-card {
          width: 100%;
          max-width: 600px;
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eee;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #999;
        }
        .add-item-form {
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 8px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 80px 80px;
          gap: 0.5rem;
        }
        .form-row input {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .items-list {
          overflow-y: auto;
          flex: 1;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        th { font-size: 0.8rem; color: #666; text-transform: uppercase; }
        .archived td { color: #999; }
        .status-badge {
          font-size: 0.7rem;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-weight: 600;
        }
        .status-badge.active { background: #e6f4ea; color: #1e7e34; }
        .status-badge.inactive { background: #f1f3f4; color: #5f6368; }
        .btn-text {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0;
        }
        .archive { color: #d93025; }
        .restore { color: var(--primary-color); }
        .error-text { color: #d93025; font-size: 0.8rem; margin-top: 0.5rem; }
      `}</style>
    </div>
  );
}
