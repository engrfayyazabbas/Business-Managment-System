'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import RecordPaymentForm from './RecordPaymentForm';

interface Sale {
  id: string;
  sale_date: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  products: {
    name: string;
    sales_unit: string;
  };
}

interface Payment {
  id: string;
  payment_date: string;
  amount: number;
  notes: string | null;
}

interface ClientData {
  client: {
    id: string;
    name: string;
    phone: string | null;
    total_bought: number;
    total_paid: number;
    current_dues: number;
  };
  sales: Sale[];
  payments: Payment[];
}

export default function ClientProfile({ clientId }: { clientId: string }) {
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const fetchClientData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch client details');
      }
      const result = await response.json();
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch client details');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  if (loading) return <p>Loading client details...</p>;
  if (error) return <div className="error-message">{error}</div>;
  if (!data) return <p>No client data found.</p>;

  const { client, sales, payments } = data;

  return (
    <div className="client-profile-container">
      <div className="header-actions">
        <div className="title-group">
          <Link href="/clients" className="back-link">&larr; Back to Clients</Link>
          <h2>{client.name}</h2>
          {client.phone && <p className="phone">{client.phone}</p>}
        </div>
        <button className="btn btn-primary" onClick={() => setShowPaymentForm(true)}>
          Record Payment
        </button>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <span className="label">Total Bought</span>
          <span className="value">PKR {Number(client.total_bought).toLocaleString()}</span>
        </div>
        <div className="card stat-card">
          <span className="label">Total Paid</span>
          <span className="value text-success">PKR {Number(client.total_paid).toLocaleString()}</span>
        </div>
        <div className="card stat-card dues">
          <span className="label">Current Dues</span>
          <span className={`value ${Number(client.current_dues) > 0 ? 'text-danger' : 'text-success'}`}>
            PKR {Number(client.current_dues).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="history-sections">
        <div className="card history-card">
          <h3>Order History</h3>
          {sales.length === 0 ? (
            <p className="empty-state">No orders yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.sale_date}</td>
                      <td>{sale.products?.name}</td>
                      <td>{sale.quantity} {sale.products?.sales_unit}s</td>
                      <td>{Number(sale.unit_price).toLocaleString()}</td>
                      <td>{Number(sale.total_amount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card history-card">
          <h3>Payment History</h3>
          {payments.length === 0 ? (
            <p className="empty-state">No payments yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.payment_date}</td>
                      <td className="text-success">+{Number(payment.amount).toLocaleString()}</td>
                      <td className="notes-col">{payment.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showPaymentForm && (
        <RecordPaymentForm 
          clientId={client.id}
          clientName={client.name}
          onPaymentRecorded={() => {
            setShowPaymentForm(false);
            fetchClientData();
          }}
          onCancel={() => setShowPaymentForm(false)}
        />
      )}

      <style jsx>{`
        .client-profile-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .title-group h2 {
          margin: 0.5rem 0 0.2rem 0;
          font-size: 1.8rem;
        }
        .back-link {
          color: #666;
          text-decoration: none;
          font-size: 0.9rem;
        }
        .back-link:hover {
          color: var(--primary-color);
        }
        .phone {
          color: #666;
          margin: 0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          gap: 0.5rem;
        }
        .stat-card .label {
          font-size: 0.9rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .stat-card .value {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .stat-card.dues {
          background: #fff8f8;
          border: 1px solid #f5c6cb;
        }
        .stat-card.dues .value.text-danger {
          color: #dc3545;
        }
        .stat-card.dues .value.text-success {
          color: #28a745;
        }
        .text-success { color: #28a745; }
        .text-danger { color: #dc3545; }
        
        .history-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .history-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .history-card h3 {
          margin: 0;
          font-size: 1.2rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.5rem;
        }
        .empty-state {
          color: #666;
          font-style: italic;
          padding: 1rem 0;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .data-table th, .data-table td {
          padding: 0.75rem 0.5rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        .data-table th {
          font-weight: 600;
          color: #555;
          background: var(--bg-light);
        }
        .notes-col {
          max-width: 150px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .history-sections {
            grid-template-columns: 1fr;
          }
          .header-actions {
            flex-direction: column;
            gap: 1rem;
          }
          .header-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
