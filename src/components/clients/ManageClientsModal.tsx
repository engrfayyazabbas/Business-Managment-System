'use client';

import { useState, useEffect } from 'react';

interface Client {
  id: string;
  name: string;
  phone: string | null;
  is_archived: boolean;
}

interface ManageClientsModalProps {
  onClose: () => void;
  onClientsChanged: () => void;
}

export default function ManageClientsModal({ onClose, onClientsChanged }: ManageClientsModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '' });
  const [error, setError] = useState('');

  const fetchAllClients = async () => {
    try {
      // Create a specific endpoint for all clients or handle via query param
      // For now, we'll fetch all by not using the default filtered route if possible,
      // or we can use a separate query here.
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');
      
      if (error) throw new Error(error.message);
      if (data) setClients(data);
    } catch {
      setError('Failed to fetch clients');
    }
  };

  useEffect(() => {
    fetchAllClients();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });

      if (res.ok) {
        setNewClient({ name: '', phone: '' });
        fetchAllClients();
        onClientsChanged();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add client');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const toggleArchive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_archived: !currentStatus }),
      });

      if (res.ok) {
        fetchAllClients();
        onClientsChanged();
      }
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card card">
        <div className="modal-header">
          <h3>Manage Clients</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleAdd} className="add-client-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Client Name"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Phone (Optional)"
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '...' : 'Add'}
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </form>

        <div className="clients-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className={client.is_archived ? 'archived' : ''}>
                  <td>{client.name}</td>
                  <td>{client.phone || '-'}</td>
                  <td>
                    <span className={`status-badge ${client.is_archived ? 'inactive' : 'active'}`}>
                      {client.is_archived ? 'Archived' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`btn-text ${client.is_archived ? 'restore' : 'archive'}`}
                      onClick={() => toggleArchive(client.id, client.is_archived)}
                    >
                      {client.is_archived ? 'Restore' : 'Archive'}
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
        .add-client-form {
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 8px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 80px;
          gap: 0.5rem;
        }
        .form-row input {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .clients-list {
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
