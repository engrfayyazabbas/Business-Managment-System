'use client';

interface Transaction {
  type: string;
  quantity: number;
  transaction_date: string;
  inventory_items: {
    name: string;
    unit: string;
  };
}

interface Summary {
  [name: string]: {
    quantity: number;
    unit: string;
  };
}

interface RawMaterialSummaryCardsProps {
  transactions: Transaction[];
}

export default function RawMaterialSummaryCards({ transactions }: RawMaterialSummaryCardsProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const todayTransactions = transactions.filter(t => t.transaction_date === today);
  
  const purchases = todayTransactions.filter(t => t.type === 'purchase').reduce((acc: Summary, t) => {
    const name = t.inventory_items.name;
    if (!acc[name]) acc[name] = { quantity: 0, unit: t.inventory_items.unit };
    acc[name].quantity += Number(t.quantity);
    return acc;
  }, {});

  const consumption = todayTransactions.filter(t => t.type === 'consumption').reduce((acc: Summary, t) => {
    const name = t.inventory_items.name;
    if (!acc[name]) acc[name] = { quantity: 0, unit: t.inventory_items.unit };
    acc[name].quantity += Number(t.quantity);
    return acc;
  }, {});

  return (
    <div className="summary-cards">
      <div className="grid">
        <div className="card summary-card purchase">
          <h4>Today&apos;s Purchases</h4>
          <div className="summary-list">
            {Object.entries(purchases).length === 0 ? (
              <p className="no-data">No purchases today.</p>
            ) : (
              Object.entries(purchases).map(([name, data]: [string, { quantity: number; unit: string }]) => (
                <div key={name} className="summary-item">
                  <span className="item-name">{name}</span>
                  <span className="item-value">{data.quantity} {data.unit}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card summary-card consumption">
          <h4>Today&apos;s Consumption</h4>
          <div className="summary-list">
            {Object.entries(consumption).length === 0 ? (
              <p className="no-data">No consumption today.</p>
            ) : (
              Object.entries(consumption).map(([name, data]: [string, { quantity: number; unit: string }]) => (
                <div key={name} className="summary-item">
                  <span className="item-name">{name}</span>
                  <span className="item-value">{data.quantity} {data.unit}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .summary-card {
          border-left: 4px solid var(--primary-color);
        }
        .summary-card.purchase { border-left-color: #10b981; }
        .summary-card.consumption { border-left-color: #ef4444; }
        
        h4 {
          margin-bottom: 1rem;
          text-transform: uppercase;
          font-size: 0.75rem;
          color: #666;
          letter-spacing: 0.05em;
        }
        .summary-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
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
          font-size: 1.5rem;
          font-weight: bold;
          color: #000; /* Set to black as requested */
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
