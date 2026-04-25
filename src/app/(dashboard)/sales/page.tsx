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
          gap: 2rem;
        }
        .page-header h1 {
          margin-bottom: 0.5rem;
        }
        .sales-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 1024px) {
          .sales-content {
            grid-template-columns: 400px 1fr;
          }
        }
        .loading-state {
          padding: 2rem;
          text-align: center;
          background: white;
          border-radius: 8px;
          border: 1px solid #eee;
        }
      `}</style>
    </div>
  );
}
