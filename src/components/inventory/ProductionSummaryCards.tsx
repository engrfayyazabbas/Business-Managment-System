'use client';

interface Transaction {
  quantity: number;
  transaction_date: string;
  inventory_items: {
    name: string;
    unit: string;
  };
}

interface ProductionSummaryCardsProps {
  transactions: Transaction[];
}

export default function ProductionSummaryCards({ transactions }: ProductionSummaryCardsProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const todayProduction = transactions.filter(t => t.transaction_date === today);
  
  const summary = todayProduction.reduce((acc: any, t) => {
    const name = t.inventory_items.name;
    if (!acc[name]) {
      acc[name] = { quantity: 0, unit: t.inventory_items.unit };
    }
    acc[name].quantity += Number(t.quantity);
    return acc;
  }, {});

  const items = Object.entries(summary);

  return (
    <div className="summary-cards">
      <div className="card summary-card production">
        <h4>Today's Production</h4>
        <div className="summary-grid">
          {items.length === 0 ? (
            <p className="no-data">No production recorded today.</p>
          ) : (
            items.map(([name, data]: [string, any]) => (
              <div key={name} className="summary-item">
                <span className="item-name">{name}</span>
                <span className="item-value">{data.quantity} {data.unit}{data.quantity > 1 ? 's' : ''}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .summary-cards {
          width: 100%;
        }
        .summary-card {
          border-left: 4px solid var(--primary-color);
        }
        .summary-card h4 {
          margin-bottom: 1rem;
          text-transform: uppercase;
          font-size: 0.75rem;
          color: #666;
          letter-spacing: 0.05em;
        }
        .summary-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
        }
        .summary-item {
          display: flex;
          flex-direction: column;
        }
        .item-name {
          font-size: 0.85rem;
          color: #666;
        }
        .item-value {
          font-size: 1.8rem;
          font-weight: bold;
          color: #000;
        }
        .no-data {
          font-size: 0.9rem;
          color: #999;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
