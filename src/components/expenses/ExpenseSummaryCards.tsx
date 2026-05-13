'use client';

interface ExpenseSummaryCardsProps {
  totalAmount: number;
  filteredCount: number;
}

export default function ExpenseSummaryCards({ totalAmount, filteredCount }: ExpenseSummaryCardsProps) {
  return (
    <div className="summary-cards">
      <div className="card summary-card">
        <div className="summary-icon">💸</div>
        <div className="summary-info">
          <span className="summary-label">Total Expenses (Filtered)</span>
          <h2 className="summary-value">PKR {totalAmount.toLocaleString()}</h2>
          <span className="summary-sub">Across {filteredCount} records</span>
        </div>
      </div>

      <style jsx>{`
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .summary-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s ease;
        }
        .summary-card:hover {
          transform: translateY(-2px);
        }
        .summary-icon {
          font-size: 2.5rem;
          background: #fff5f5;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }
        .summary-info {
          display: flex;
          flex-direction: column;
        }
        .summary-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .summary-value {
          margin: 0.2rem 0;
          font-size: 1.75rem;
          color: #333;
          font-weight: 700;
        }
        .summary-sub {
          font-size: 0.8rem;
          color: #666;
        }
        @media (max-width: 480px) {
          .summary-card {
            padding: 1rem;
            gap: 1rem;
          }
          .summary-icon {
            width: 48px;
            height: 48px;
            font-size: 1.75rem;
          }
          .summary-value {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
