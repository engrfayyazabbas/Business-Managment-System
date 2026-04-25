'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
}

interface SalesFiltersProps {
  onFilterChange: (filters: { startDate: string; endDate: string; productId: string }) => void;
}

export default function SalesFilters({ onFilterChange }: SalesFiltersProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    productId: '',
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch products for filters', err);
      }
    }
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="card filters-container">
      <div className="filter-group">
        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="endDate">End Date</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="productIdFilter">Product</label>
        <select
          id="productIdFilter"
          name="productId"
          value={filters.productId}
          onChange={handleChange}
        >
          <option value="">All Products</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <style jsx>{`
        .filters-container {
          display: flex;
          gap: 1.5rem;
          padding: 1rem;
          flex-wrap: wrap;
          align-items: flex-end;
          margin-bottom: 1.5rem;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        input, select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
