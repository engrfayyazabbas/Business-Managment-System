'use client';

import { useState } from 'react';

interface Transaction {
  id: string;
  transaction_date: string;
  type: string;
  quantity: number;
  notes: string | null;
  inventory_items: {
    id: string;
    name: string;
    unit: string;
  };
}

interface RawMaterialTableProps {
  transactions: Transaction[];
  onTransactionDeleted: () => void;
  onTransactionUpdated: () => void;
}

export default function RawMaterialTable({ transactions, onTransactionDeleted, onTransactionUpdated }: RawMaterialTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const response = await fetch(`/api/inventory/transactions/${id}`, { method: 'DELETE' });
      if (response.ok) {
        onTransactionDeleted();
      } else {
        alert('Failed to delete transaction');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting transaction');
    }
  };

  const startEditing = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      transaction_date: transaction.transaction_date,
      quantity: transaction.quantity,
      type: transaction.type,
      notes: transaction.notes || '',
      item_id: transaction.inventory_items.id
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/inventory/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          quantity: Number(editForm.quantity),
        }),
      });

      if (response.ok) {
        setEditingId(null);
        onTransactionUpdated();
      } else {
        alert('Failed to update transaction');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card table-container">
      <h3>Transaction History</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>No transactions found.</td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td data-label="Date">
                    {editingId === t.id ? (
                      <input
                        type="date"
                        name="transaction_date"
                        value={editForm.transaction_date}
                        onChange={handleEditChange}
                      />
                    ) : (
                      new Date(t.transaction_date).toLocaleDateString()
                    )}
                  </td>
                  <td data-label="Item">{t.inventory_items?.name}</td>
                  <td data-label="Type">
                    {editingId === t.id ? (
                      <select name="type" value={editForm.type} onChange={handleEditChange}>
                        <option value="purchase">Purchase</option>
                        <option value="consumption">Consumption</option>
                      </select>
                    ) : (
                      <span className={`badge ${t.type}`}>
                        {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                      </span>
                    )}
                  </td>
                  <td data-label="Quantity">
                    {editingId === t.id ? (
                      <input
                        type="number"
                        name="quantity"
                        value={editForm.quantity}
                        onChange={handleEditChange}
                        step="0.01"
                      />
                    ) : (
                      `${t.quantity} ${t.inventory_items?.unit}`
                    )}
                  </td>
                  <td data-label="Notes">
                    {editingId === t.id ? (
                      <input
                        type="text"
                        name="notes"
                        value={editForm.notes}
                        onChange={handleEditChange}
                      />
                    ) : (
                      t.notes || '-'
                    )}
                  </td>
                  <td data-label="Actions">
                    <div className="actions">
                      {editingId === t.id ? (
                        <>
                          <button className="btn-icon save" onClick={() => handleUpdate(t.id)} disabled={loading}>💾</button>
                          <button className="btn-icon cancel" onClick={() => setEditingId(null)}>❌</button>
                        </>
                      ) : (
                        <>
                          <button className="btn-icon edit" onClick={() => startEditing(t)}>✏️</button>
                          <button className="btn-icon delete" onClick={() => handleDelete(t.id)}>🗑️</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .table-container { overflow: hidden; }
        .table-responsive { overflow-x: auto; }
        .table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .table th, .table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #eee; }
        .table th { background-color: var(--bg-light); font-weight: 600; }
        .badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
        .badge.purchase { background: #e6f4ea; color: #1e7e34; }
        .badge.consumption { background: #feecef; color: #d93025; }
        .actions { display: flex; gap: 0.5rem; }
        .btn-icon { background: none; border: none; cursor: pointer; font-size: 1.2rem; padding: 0.25rem; border-radius: 4px; }
        .btn-icon:hover { background-color: #f0f0f0; }
        input, select { padding: 0.25rem; border: 1px solid #ddd; border-radius: 4px; width: 100%; }

        @media (max-width: 600px) {
          .table thead { display: none; }
          .table, .table tbody, .table tr, .table td { display: block; width: 100%; }
          .table tr { margin-bottom: 1rem; border: 1px solid #eee; border-radius: 8px; padding: 0.5rem; }
          .table td { text-align: right; border-bottom: none; display: flex; justify-content: space-between; }
          .table td::before { content: attr(data-label); font-weight: bold; }
        }
      `}</style>
    </div>
  );
}
