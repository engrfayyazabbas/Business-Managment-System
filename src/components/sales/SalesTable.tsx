'use client';

import { useState } from 'react';

interface Sale {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  sale_date: string;
  products: {
    name: string;
    sales_unit: string;
  };
}

interface SalesTableProps {
  sales: Sale[];
  onSaleDeleted: () => void;
  onSaleUpdated: () => void;
}

export default function SalesTable({ sales, onSaleDeleted, onSaleUpdated }: SalesTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Sale>>({});
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sale record?')) return;

    try {
      const response = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
      if (response.ok) {
        onSaleDeleted();
      } else {
        alert('Failed to delete sale');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting sale');
    }
  };

  const startEditing = (sale: Sale) => {
    setEditingId(sale.id);
    setEditForm(sale);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sales/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          quantity: Number(editForm.quantity),
          unit_price: Number(editForm.unit_price),
        }),
      });

      if (response.ok) {
        setEditingId(null);
        onSaleUpdated();
      } else {
        alert('Failed to update sale');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating sale');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);

  return (
    <div className="card table-container">
      <h3>Sales History</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>No sales records found.</td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id}>
                  <td>
                    {editingId === sale.id ? (
                      <input
                        type="date"
                        name="sale_date"
                        value={editForm.sale_date}
                        onChange={handleEditChange}
                      />
                    ) : (
                      new Date(sale.sale_date).toLocaleDateString()
                    )}
                  </td>
                  <td>{sale.products.name}</td>
                  <td>
                    {editingId === sale.id ? (
                      <input
                        type="number"
                        name="quantity"
                        value={editForm.quantity}
                        onChange={handleEditChange}
                        min="1"
                      />
                    ) : (
                      `${sale.quantity} ${sale.products.sales_unit}${sale.quantity > 1 ? 's' : ''}`
                    )}
                  </td>
                  <td>
                    {editingId === sale.id ? (
                      <input
                        type="number"
                        name="unit_price"
                        value={editForm.unit_price}
                        onChange={handleEditChange}
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      `PKR ${Number(sale.unit_price).toLocaleString()}`
                    )}
                  </td>
                  <td>PKR {Number(sale.total_amount).toLocaleString()}</td>
                  <td>
                    <div className="actions">
                      {editingId === sale.id ? (
                        <>
                          <button
                            className="btn-icon save"
                            onClick={() => handleUpdate(sale.id)}
                            disabled={loading}
                          >
                            💾
                          </button>
                          <button className="btn-icon cancel" onClick={() => setEditingId(null)}>
                            ❌
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn-icon edit" onClick={() => startEditing(sale)}>
                            ✏️
                          </button>
                          <button className="btn-icon delete" onClick={() => handleDelete(sale.id)}>
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {sales.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={4} style={{ textAlign: 'right' }}><strong>Grand Total:</strong></td>
                <td colSpan={2}><strong>PKR {totalRevenue.toLocaleString()}</strong></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <style jsx>{`
        .table-container {
          overflow: hidden;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        .table th, .table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .table th {
          background-color: var(--bg-light);
          font-weight: 600;
        }
        .actions {
          display: flex;
          gap: 0.5rem;
        }
        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .btn-icon:hover {
          background-color: #f0f0f0;
        }
        input {
          padding: 0.25rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100%;
        }
        tfoot {
          background-color: var(--bg-light);
        }
      `}</style>
    </div>
  );
}
