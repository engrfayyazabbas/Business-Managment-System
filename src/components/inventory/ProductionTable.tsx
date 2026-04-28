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

interface EditForm {
  quantity?: number;
  transaction_date?: string;
  notes?: string;
  type?: string;
  item_id?: string;
}

interface ProductionTableProps {
  transactions: Transaction[];
  onProductionDeleted: () => void;
  onProductionUpdated: () => void;
}

export default function ProductionTable({ transactions, onProductionDeleted, onProductionUpdated }: ProductionTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({});
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this production record?')) return;

    try {
      const response = await fetch(`/api/inventory/transactions/${id}`, { method: 'DELETE' });
      if (response.ok) {
        onProductionDeleted();
      } else {
        alert('Failed to delete record');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting record');
    }
  };

  const startEditing = (t: Transaction) => {
    setEditingId(t.id);
    setEditForm({
      transaction_date: t.transaction_date,
      quantity: t.quantity,
      type: 'production',
      notes: t.notes || '',
      item_id: t.inventory_items.id
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev: EditForm) => ({ ...prev, [name]: value }));
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
        onProductionUpdated();
      } else {
        alert('Failed to update record');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card table-container">
      <h3>Production History</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Finished Good</th>
              <th>Quantity</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>No production records found.</td>
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
                  <td data-label="Quantity">
                    {editingId === t.id ? (
                      <input
                        type="number"
                        name="quantity"
                        value={editForm.quantity}
                        onChange={handleEditChange}
                      />
                    ) : (
                      `${t.quantity} ${t.inventory_items?.unit}${t.quantity > 1 ? 's' : ''}`
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
        .actions { display: flex; gap: 0.5rem; }
        .btn-icon { background: none; border: none; cursor: pointer; font-size: 1.2rem; padding: 0.25rem; border-radius: 4px; }
        .btn-icon:hover { background-color: #f0f0f0; }
        input { padding: 0.25rem; border: 1px solid #ddd; border-radius: 4px; width: 100%; }

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
