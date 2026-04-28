'use client';

import { useState, useEffect, useCallback } from 'react';
import AddProductionForm from '@/components/inventory/AddProductionForm';
import ProductionTable from '@/components/inventory/ProductionTable';
import ProductionSummaryCards from '@/components/inventory/ProductionSummaryCards';

export default function ProductionPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory/transactions?type=production');
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
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="production-page">
      <div className="page-header">
        <h1>Production Management</h1>
        <p>Record and track daily output of Noodles and Momos.</p>
      </div>

      <div className="summary-section">
        <ProductionSummaryCards transactions={transactions} />
      </div>

      <div className="page-content">
        <div className="form-section">
          <AddProductionForm onProductionAdded={handleDataChange} />
        </div>

        <div className="history-section">
          {loading ? (
            <div className="loading-state">Loading history...</div>
          ) : (
            <ProductionTable 
              transactions={transactions} 
              onProductionDeleted={handleDataChange} 
              onProductionUpdated={handleDataChange} 
            />
          )}
        </div>
      </div>

      <style jsx>{`
        .production-page {
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
