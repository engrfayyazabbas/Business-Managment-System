'use client';

import { useState, useEffect, useCallback } from 'react';
import AddExpenseForm from './AddExpenseForm';
import ExpensesTable from './ExpensesTable';
import ExpenseFilters from './ExpenseFilters';
import ExpenseSummaryCards from './ExpenseSummaryCards';
import ManageCategoriesModal from './ManageCategoriesModal';

interface Category {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  category_id: string;
  description: string | null;
  amount: number;
  expense_date: string;
  category: {
    name: string;
  };
}

export default function ExpenseDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManageCategories, setShowManageCategories] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    categoryId: '',
  });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/expenses/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);

      const res = await fetch(`/api/expenses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, [fetchCategories, fetchExpenses]);

  const handleRefresh = () => {
    fetchExpenses();
  };

  const handleCategoriesChanged = () => {
    fetchCategories();
    fetchExpenses(); // Refresh list in case names changed or categories archived
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  return (
    <div className="expense-dashboard">
      <div className="header-actions">
        <h2>Business Expenses</h2>
        <button 
          className="btn-manage" 
          onClick={() => setShowManageCategories(true)}
        >
          Manage Categories
        </button>
      </div>

      <ExpenseSummaryCards 
        totalAmount={totalAmount} 
        filteredCount={expenses.length} 
      />

      <div className="dashboard-grid">
        <div className="form-section">
          <AddExpenseForm 
            onExpenseAdded={handleRefresh} 
            categories={categories} 
          />
        </div>
        
        <div className="table-section">
          <ExpenseFilters 
            categories={categories} 
            onFilterChange={setFilters} 
          />
          <ExpensesTable 
            expenses={expenses} 
            onExpenseDeleted={handleRefresh} 
            loading={loading}
          />
        </div>
      </div>

      {showManageCategories && (
        <ManageCategoriesModal 
          onClose={() => setShowManageCategories(false)} 
          onCategoriesChanged={handleCategoriesChanged}
        />
      )}

      <style jsx>{`
        .expense-dashboard {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .header-actions h2 {
          margin: 0;
          color: var(--primary-color);
          font-weight: 700;
        }
        .btn-manage {
          background: var(--primary);
          border: 1px solid var(--primary-hover);
          color: #000;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-manage:hover {
          background: var(--primary-hover);
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .form-section {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}
