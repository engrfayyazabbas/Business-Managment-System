'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
}

interface AddExpenseFormProps {
  onExpenseAdded: () => void;
  categories: Category[]; // Passed from parent or fetched here
}

export default function AddExpenseForm({ onExpenseAdded, categories: initialCategories }: AddExpenseFormProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    description: '',
    expense_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (initialCategories.length > 0) {
      setCategories(initialCategories);
    } else {
      // If categories aren't passed, fetch active ones
      const fetchCategories = async () => {
        try {
          const res = await fetch('/api/expenses/categories');
          if (res.ok) {
            const data = await res.json();
            setCategories(data);
          }
        } catch {
          setError('Failed to fetch categories');
        }
      };
      fetchCategories();
    }
  }, [initialCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add expense');
      }

      setSuccess(true);
      setFormData({
        category_id: '',
        amount: '',
        description: '',
        expense_date: new Date().toISOString().split('T')[0],
      });
      onExpenseAdded();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card expense-form">
      <h3>Record New Expense</h3>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Expense recorded successfully!</div>}

      <div className="form-group">
        <label htmlFor="category_id">Category</label>
        <select
          id="category_id"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Amount (PKR)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="1"
            step="1"
            required
            placeholder="e.g. 500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="expense_date">Date</label>
          <input
            type="date"
            id="expense_date"
            name="expense_date"
            value={formData.expense_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description (Optional)</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What was this for?"
          rows={2}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : 'Record Expense'}
      </button>

      <style jsx>{`
        .expense-form {
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
        .form-group input, 
        .form-group select, 
        .form-group textarea {
          padding: 0.6rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.95rem;
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
