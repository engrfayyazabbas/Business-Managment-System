'use client';

import { useState, useEffect, useCallback } from 'react';
import AddSaleForm from '@/components/sales/AddSaleForm';
import SalesTable from '@/components/sales/SalesTable';
import SalesFilters from '@/components/sales/SalesFilters';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    productId: '',
  });

  const fetchSales = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.productId) params.append('productId', filters.productId);

    try {
      const response = await fetch(`/api/sales?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSales(data);
      }
    } catch (err) {
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleFilterChange = (newFilters: { startDate: string; endDate: string; productId: string }) => {
    setFilters(newFilters);
  };

  return (
    <div className="sales-page">
      <div className="page-header">
        <h1>Sales Management</h1>
        <p>Record and track your daily sales for Noodles and Momos.</p>
      </div>

      <div className="sales-content">
        <div className="form-section">
          <AddSaleForm onSaleAdded={fetchSales} />
        </div>

        <div className="history-section">
          <SalesFilters onFilterChange={handleFilterChange} />
          {loading ? (
            <div className="loading-state">Loading sales history...</div>
          ) : (
            <SalesTable 
              sales={sales} 
              onSaleDeleted={fetchSales} 
              onSaleUpdated={fetchSales} 
            />
          )}
        </div>
      </div>

      <style jsx>{`
        .sales-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .page-header h1 {
          margin-bottom: 0.25rem;
        }
        .page-header p {
          font-size: 0.9rem;
          color: #666;
        }
        .sales-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 1024px) {
          .sales-content {
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
        @media (max-width: 640px) {
          .sales-page {
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
