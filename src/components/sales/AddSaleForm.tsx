'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  sales_unit: string;
}

interface AddSaleFormProps {
  onSaleAdded: () => void;
}

export default function AddSaleForm({ onSaleAdded }: AddSaleFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    unit_price: '',
    sale_date: new Date().toISOString().split('T')[0],
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch products');
        }
      } catch (err) {
        setError('Network error: Could not fetch products');
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const product = products.find((p) => p.id === formData.product_id);
    setSelectedProduct(product || null);
  }, [formData.product_id, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
          unit_price: Number(formData.unit_price),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add sale');
      }

      setSuccess(true);
      setFormData({
        product_id: '',
        quantity: '',
        unit_price: '',
        sale_date: new Date().toISOString().split('T')[0],
      });
      onSaleAdded();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = Number(formData.quantity) * Number(formData.unit_price);

  return (
    <form onSubmit={handleSubmit} className="card sale-form">
      <h3>Record New Sale</h3>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Sale recorded successfully!</div>}

      <div className="form-group">
        <label htmlFor="product_id">Product</label>
        <select
          id="product_id"
          name="product_id"
          value={formData.product_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quantity">
            Quantity {selectedProduct ? `(${selectedProduct.sales_unit}s)` : ''}
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="unit_price">Unit Price (PKR)</label>
          <input
            type="number"
            id="unit_price"
            name="unit_price"
            value={formData.unit_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="sale_date">Sale Date</label>
        <input
          type="date"
          id="sale_date"
          name="sale_date"
          value={formData.sale_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="total-display">
        <strong>Total Amount: </strong>
        <span>PKR {totalAmount.toLocaleString()}</span>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : 'Record Sale'}
      </button>

      <style jsx>{`
        .sale-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 500px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .total-display {
          font-size: 1.2rem;
          padding: 1rem;
          background: var(--bg-light);
          border-radius: 4px;
          text-align: right;
        }
        .success-message {
          color: #155724;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          padding: 0.75rem;
          border-radius: 4px;
        }
        .error-message {
          color: #721c24;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          padding: 0.75rem;
          border-radius: 4px;
        }
      `}</style>
    </form>
  );
}
