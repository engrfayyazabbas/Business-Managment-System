'use client';

import { useState, useEffect } from 'react';

interface DateRangeFilterProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}

export default function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const [localFrom, setLocalFrom] = useState(from);
  const [localTo, setLocalTo] = useState(to);

  useEffect(() => {
    setLocalFrom(from);
    setLocalTo(to);
  }, [from, to]);

  const handleApply = () => {
    onChange(localFrom, localTo);
  };

  const setPreset = (type: 'today' | 'week' | 'month' | 'last30') => {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    let start = '';

    switch (type) {
      case 'today':
        start = end;
        break;
      case 'week':
        const monday = new Date(today);
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        monday.setDate(diff);
        start = monday.toISOString().split('T')[0];
        break;
      case 'month':
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        // Adjust for timezone offset to get correct YYYY-MM-DD
        const offset = firstDay.getTimezoneOffset();
        const adjustedFirstDay = new Date(firstDay.getTime() - (offset * 60 * 1000));
        start = adjustedFirstDay.toISOString().split('T')[0];
        break;
      case 'last30':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        start = thirtyDaysAgo.toISOString().split('T')[0];
        break;
    }

    onChange(start, end);
  };

  return (
    <div className="filter-container card">
      <div className="inputs">
        <div className="input-group">
          <label>From:</label>
          <input 
            type="date" 
            value={localFrom} 
            onChange={(e) => setLocalFrom(e.target.value)} 
          />
        </div>
        <div className="input-group">
          <label>To:</label>
          <input 
            type="date" 
            value={localTo} 
            onChange={(e) => setLocalTo(e.target.value)} 
          />
        </div>
        <button className="apply-btn" onClick={handleApply}>Apply</button>
      </div>

      <div className="presets">
        <button onClick={() => setPreset('today')}>Today</button>
        <button onClick={() => setPreset('week')}>This Week</button>
        <button onClick={() => setPreset('month')}>This Month</button>
        <button onClick={() => setPreset('last30')}>Last 30 Days</button>
      </div>

      <style jsx>{`
        .filter-container {
          padding: var(--space-md);
          margin-bottom: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .inputs {
          display: flex;
          align-items: flex-end;
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        label {
          font-size: 0.85rem;
          color: var(--foreground);
          opacity: 0.8;
        }

        input {
          padding: 8px;
          border-radius: var(--border-radius);
          border: 1px solid var(--border);
          background: var(--background);
          color: var(--foreground);
        }

        .apply-btn {
          padding: 8px 16px;
          background: var(--primary);
          color: black;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-weight: 600;
        }

        .apply-btn:hover {
          opacity: 0.9;
        }

        .presets {
          display: flex;
          gap: var(--space-sm);
          flex-wrap: wrap;
        }

        .presets button {
          padding: 4px 12px;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid var(--primary);
          color: var(--primary);
          border-radius: 20px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .presets button:hover {
          background: var(--primary);
          color: black;
        }

        @media (max-width: 768px) {
          .inputs {
            flex-direction: column;
            align-items: stretch;
          }
          
          .input-group input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
