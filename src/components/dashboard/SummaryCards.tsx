'use client';

import { formatPKR } from '@/utils/format';

interface SalesSummary {
  totalRevenue: number;
  totalQuantity: number;
  breakdown: Array<{
    product: string;
    quantity: number;
    revenue: number;
    unit: string;
  }>;
}

interface ExpenseSummary {
  totalExpenses: number;
  breakdown: Array<{
    category: string;
    amount: number;
  }>;
}

interface ClientDues {
  totalDues: number;
  clients: Array<{
    id: string;
    name: string;
    currentDues: number;
  }>;
}

interface InventoryStatus {
  items: Array<{
    id: string;
    name: string;
    unit: string;
    currentStock: number;
  }>;
}

interface SummaryCardsProps {
  salesSummary: SalesSummary | null;
  expenseSummary: ExpenseSummary | null;
  clientDues: ClientDues | null;
  inventoryStatus: InventoryStatus | null;
  loading: boolean;
  errors: Record<string, string>;
}

export default function SummaryCards({ 
  salesSummary, 
  expenseSummary, 
  clientDues, 
  inventoryStatus, 
  loading, 
  errors 
}: SummaryCardsProps) {
  
  const netProfit = (salesSummary?.totalRevenue || 0) - (expenseSummary?.totalExpenses || 0);
  const isProfit = netProfit >= 0;

  const renderCard = (title: string, value: string | number, subtext?: React.ReactNode, errorKey?: string) => {
    if (loading) return (
      <div className="card summary-card loading">
        <h3>{title}</h3>
        <p>Loading...</p>
      </div>
    );

    if (errorKey && errors[errorKey]) return (
      <div className="card summary-card error">
        <h3>{title}</h3>
        <p className="error-text">Error loading data</p>
      </div>
    );

    return (
      <div className="card summary-card">
        <h3>{title}</h3>
        <div className="value">{value}</div>
        {subtext && <div className="subtext">{subtext}</div>}
      </div>
    );
  };

  return (
    <div className="summary-grid">
      {renderCard(
        'Total Sales', 
        formatPKR(salesSummary?.totalRevenue), 
        <div className="breakdown">
          {salesSummary?.breakdown?.map((b) => (
            <span key={b.product}>{b.product}: {b.quantity} {b.unit}{b.quantity > 1 ? 's' : ''}</span>
          ))}
        </div>,
        'sales'
      )}

      {renderCard(
        'Total Expenses', 
        formatPKR(expenseSummary?.totalExpenses), 
        null,
        'expenses'
      )}

      {renderCard(
        'Net Profit/Loss', 
        <span style={{ color: isProfit ? 'var(--success)' : 'var(--danger)' }}>
          {formatPKR(netProfit)}
        </span>,
        null,
        'profit' // Uses both sales and expenses, but we'll map to 'profit' error if either fails handled in parent
      )}

      {renderCard(
        'Client Dues', 
        formatPKR(clientDues?.totalDues), 
        null,
        'clients'
      )}

      {renderCard(
        'Inventory Alert', 
        `${inventoryStatus?.items?.length || 0} Items`, 
        <div className="mini-list">
          {inventoryStatus?.items?.slice(0, 3).map((item) => (
            <div key={item.id} className="mini-item">
              <span>{item.name}</span>
              <span>{item.currentStock} {item.unit}</span>
            </div>
          ))}
        </div>,
        'inventory'
      )}

      <style jsx>{`
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }

        .summary-card {
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        h3 {
          margin: 0;
          font-size: 0.9rem;
          color: var(--foreground);
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .subtext {
          font-size: 0.8rem;
          color: var(--foreground);
          opacity: 0.6;
        }

        .breakdown {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mini-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 4px;
        }

        .mini-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 2px;
        }

        .error-text {
          color: var(--danger);
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
          .summary-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
