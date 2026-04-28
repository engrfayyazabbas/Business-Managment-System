'use client';

import { useState, useEffect, useCallback } from 'react';
import RawMaterialSummaryCards from '@/components/inventory/RawMaterialSummaryCards';
import AddRawMaterialForm from '@/components/inventory/AddRawMaterialForm';
import RawMaterialTable from '@/components/inventory/RawMaterialTable';

export default function RawMaterialsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory/transactions?type=raw_material');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, refreshKey]);

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1); // Trigger refresh of table and stock cards
  };

  return (
    <div className="raw-materials-page">
      <div className="page-header">
        <h1>Raw Materials Management</h1>
        <p>Track purchases and consumption of flour, oil, and other ingredients.</p>
      </div>

      <div className="status-section">
        <RawMaterialSummaryCards transactions={transactions} />
      </div>

      <div className="page-content">
        <div className="form-section">
          <AddRawMaterialForm onTransactionAdded={handleDataChange} />
        </div>

        <div className="history-section">
          {loading ? (
            <div className="loading-state">Loading history...</div>
          ) : (
            <RawMaterialTable 
              transactions={transactions} 
              onTransactionDeleted={handleDataChange} 
              onTransactionUpdated={handleDataChange} 
            />
          )}
        </div>
      </div>

      <style jsx>{`
        .raw-materials-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1rem;
        }
        .page-header h1 {
          margin-bottom: 0.25rem;
        }
        .page-header p {
          font-size: 0.9rem;
          color: #666;
        }
        .status-section {
          margin-bottom: 0.5rem;
        }
        .page-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 1024px) {
          .page-content {
            grid-template-columns: 380px 1fr;
            gap: 2rem;
          }
        }
        .loading-state {
          padding: 2rem;
          text-align: center;
          background: white;
          border-radius: 8px;
          border: 1px solid #eee;
          color: #666;
        }
      `}</style>
    </div>
  );
}
