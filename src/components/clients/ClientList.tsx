'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddClientForm from './AddClientForm';
import RecordPaymentForm from './RecordPaymentForm';

interface ClientSummary {
  id: string;
  name: string;
  phone: string | null;
  created_at: string;
  total_bought: number;
  total_paid: number;
  current_dues: number;
}

export default function ClientList() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentClient, setPaymentClient] = useState<{id: string, name: string} | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/clients');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setClients(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleClientAdded = () => {
    setShowAddForm(false);
    fetchClients();
  };

  const handlePaymentRecorded = () => {
    setPaymentClient(null);
    fetchClients();
  };

  return (
    <div className="client-list-container">
      <div className="header-actions">
        <h2>Clients & Dues</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          Add Client
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Loading clients...</p>
      ) : clients.length === 0 ? (
        <div className="card empty-state">No clients found. Add one to get started.</div>
      ) : (
        <div className="clients-grid">
          {clients.map((client) => (
            <div key={client.id} className="card client-card">
              <div className="client-info">
                <h3>
                  <Link href={`/clients/${client.id}`}>{client.name}</Link>
                </h3>
                <p className="phone">{client.phone || 'No phone'}</p>
              </div>
              
              <div className="client-stats">
                <div className="stat">
                  <span className="label">Total Bought</span>
                  <span className="value">PKR {Number(client.total_bought).toLocaleString()}</span>
                </div>
                <div className="stat">
                  <span className="label">Total Paid</span>
                  <span className="value">PKR {Number(client.total_paid).toLocaleString()}</span>
                </div>
                <div className="stat dues">
                  <span className="label">Current Dues</span>
                  <span className={`value ${Number(client.current_dues) > 0 ? 'text-danger' : 'text-success'}`}>
                    PKR {Number(client.current_dues).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="client-actions">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPaymentClient({ id: client.id, name: client.name })}
                >
                  Record Payment
                </button>
                <Link href={`/clients/${client.id}`} className="btn btn-outline btn-sm">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <AddClientForm 
          onClientAdded={handleClientAdded} 
          onCancel={() => setShowAddForm(false)} 
        />
      )}

      {paymentClient && (
        <RecordPaymentForm 
          clientId={paymentClient.id}
          clientName={paymentClient.name}
          onPaymentRecorded={handlePaymentRecorded}
          onCancel={() => setPaymentClient(null)}
        />
      )}

      <style jsx>{`
        .client-list-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .clients-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .client-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .client-info h3 {
          margin: 0;
        }
        .client-info h3 a {
          color: var(--primary-color);
          text-decoration: none;
        }
        .client-info h3 a:hover {
          text-decoration: underline;
        }
        .phone {
          color: #666;
          font-size: 0.9rem;
          margin: 0.2rem 0 0 0;
        }
        .client-stats {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: var(--bg-light);
          padding: 1rem;
          border-radius: 6px;
        }
        .stat {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }
        .stat.dues {
          font-weight: 700;
          font-size: 1.05rem;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-color);
        }
        .text-danger { color: #dc3545; }
        .text-success { color: #28a745; }
        .client-actions {
          display: flex;
          gap: 0.8rem;
          margin-top: auto;
        }
        .btn-sm {
          padding: 0.4rem 0.8rem;
          font-size: 0.85rem;
          flex: 1;
          text-align: center;
        }
        .btn-outline {
          border: 1px solid var(--primary-color);
          color: var(--primary-color);
          background: transparent;
          text-decoration: none;
          border-radius: 4px;
        }
        .btn-outline:hover {
          background: var(--primary-color);
          color: white;
        }
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #666;
        }
        @media (max-width: 768px) {
          .clients-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
