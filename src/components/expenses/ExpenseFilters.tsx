'use client';

import { useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface ExpenseFiltersProps {
  onFilterChange: (filters: { startDate: string; endDate: string; categoryId: string }) => void;
  categories: Category[];
}

export default function ExpenseFilters({ onFilterChange, categories }: ExpenseFiltersProps) {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    categoryId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="card filters-container">
      <div className="filter-group">
        <label htmlFor="startDate">From</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="endDate">To</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="categoryIdFilter">Category</label>
        <select
          id="categoryIdFilter"
          name="categoryId"
          value={filters.categoryId}
          onChange={handleChange}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <style jsx>{`
        .filters-container {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          flex-wrap: wrap;
          align-items: flex-end;
          margin-bottom: 1.5rem;
          background: #fff;
          border-left: 4px solid var(--primary-color);
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1 1 140px;
          min-width: 0;
        }
        .filter-group label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #888;
        }
        input, select {
          padding: 0.5rem 0.6rem;
          border: 1px solid #eee;
          border-radius: 6px;
          width: 100%;
          box-sizing: border-box;
          font-size: 0.9rem;
          background: #f9f9f9;
        }
        @media (max-width: 640px) {
          .filters-container {
            flex-direction: column;
            gap: 0.75rem;
          }
          .filter-group {
            flex: 1 1 100%;
          }
        }
      `}</style>
    </div>
  );
}
