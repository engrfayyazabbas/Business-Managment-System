'use client';

import Link from 'next/link';
import InventoryStatusCards from '@/components/inventory/InventoryStatusCards';

export default function InventoryDashboard() {
  return (
    <div className="inventory-dashboard">
      <div className="page-header">
        <h1>Inventory Overview</h1>
        <p>Manage your production line and raw material stocks.</p>
      </div>

      <div className="quick-actions">
        <Link href="/inventory/production" className="action-card">
          <div className="icon">🏗️</div>
          <div className="content">
            <h3>Production</h3>
            <p>Record daily output of finished goods.</p>
          </div>
        </Link>
        <Link href="/inventory/raw-materials" className="action-card">
          <div className="icon">📦</div>
          <div className="content">
            <h3>Raw Materials</h3>
            <p>Track ingredients and supplies stock.</p>
          </div>
        </Link>
      </div>

      <div className="status-section">
        <h3>Current Stock Levels</h3>
        <InventoryStatusCards />
      </div>

      <style jsx>{`
        .inventory-dashboard {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .page-header h1 {
          margin-bottom: 0.25rem;
        }
        .page-header p {
          font-size: 0.9rem;
          color: #666;
        }
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .action-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #eee;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-color: var(--primary-color);
        }
        .action-card .icon {
          font-size: 2.5rem;
        }
        .action-card h3 {
          margin: 0 0 0.25rem 0;
          color: var(--primary-color);
        }
        .action-card p {
          margin: 0;
          font-size: 0.9rem;
          color: #666;
        }
        .status-section h3 {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
