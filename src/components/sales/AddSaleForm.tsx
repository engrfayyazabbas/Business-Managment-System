'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  sales_unit: string;
}

interface Client {
  id: string;
  name: string;
  phone: string | null;
}

interface AddSaleFormProps {
  onSaleAdded: () => void;
}

export default function AddSaleForm({ onSaleAdded }: AddSaleFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    product_id: '',
    client_id: '', // Optional
    quantity: '',
    unit_price: '',
    sale_date: new Date().toISOString().split('T')[0],
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, clientsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/clients')
        ]);
        
        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(data);
        }
        
        if (clientsRes.ok) {
          const data = await clientsRes.json();
          setClients(data);
        }
      } catch {
        setError('Network error: Could not fetch form data');
      }
    }
    fetchData();
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
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        unit_price: Number(formData.unit_price),
        client_id: formData.client_id === '' ? null : formData.client_id,
      };

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add sale');
      }

      setSuccess(true);
      setFormData({
        product_id: '',
        client_id: '',
        quantity: '',
        unit_price: '',
        sale_date: new Date().toISOString().split('T')[0],
      });
      onSaleAdded();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add sale');
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

      <div className="form-group">
        <label htmlFor="client_id">Client (Optional for Cash Sale)</label>
        <select
          id="client_id"
          name="client_id"
          value={formData.client_id}
          onChange={handleChange}
        >
          <option value="">-- Cash Sale (No Client) --</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} {client.phone ? `(${client.phone})` : ''}
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
          gap: 1.25rem;
          width: 100%;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #666;
        }
        .total-display {
          font-size: 1.1rem;
          padding: 0.85rem 1rem;
          background: var(--bg-light);
          border-radius: 6px;
          text-align: right;
        }
        .success-message {
          color: #155724;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }
        .error-message {
          color: #721c24;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }
        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
}
