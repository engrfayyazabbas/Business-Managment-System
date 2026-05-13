'use client';

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

interface ExpensesTableProps {
  expenses: Expense[];
  onExpenseDeleted: () => void;
  loading: boolean;
}

export default function ExpensesTable({ expenses, onExpenseDeleted, loading }: ExpensesTableProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const response = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (response.ok) {
        onExpenseDeleted();
      } else {
        alert('Failed to delete expense');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting expense');
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  return (
    <div className="card table-container">
      <h3>Expense History</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>Loading expenses...</td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>No expenses found.</td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id}>
                  <td data-label="Date">
                    {new Date(expense.expense_date).toLocaleDateString()}
                  </td>
                  <td data-label="Category">{expense.category?.name || 'Uncategorized'}</td>
                  <td data-label="Description">
                    <span className="description-text">{expense.description || '-'}</span>
                  </td>
                  <td data-label="Amount" className="amount-col">
                    PKR {Math.floor(Number(expense.amount)).toLocaleString()}
                  </td>
                  <td data-label="Actions">
                    <button 
                      className="btn-icon delete" 
                      onClick={() => handleDelete(expense.id)}
                      title="Delete Expense"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {expenses.length > 0 && !loading && (
            <tfoot>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right' }}><strong>Total:</strong></td>
                <td colSpan={2}><strong>PKR {totalAmount.toLocaleString()}</strong></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <style jsx>{`
        .table-container {
          overflow: hidden;
          width: 100%;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        .table th, .table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .table th {
          background-color: var(--bg-light);
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          color: #666;
        }
        .amount-col {
          font-weight: 500;
        }
        .description-text {
          font-size: 0.9rem;
          color: #555;
        }
        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .btn-icon:hover {
          background-color: #fceaea;
        }
        tfoot {
          background-color: var(--bg-light);
        }
        tfoot td {
          border-top: 2px solid #eee;
        }

        @media (max-width: 600px) {
          .table thead { display: none; }
          .table, .table tbody, .table tr, .table td { display: block; width: 100%; }
          .table tr { margin-bottom: 1rem; border: 1px solid #eee; border-radius: 8px; padding: 0.5rem; }
          .table td { text-align: right; border-bottom: 1px solid #f9f9f9; display: flex; justify-content: space-between; align-items: center; }
          .table td:last-child { border-bottom: none; }
          .table td::before { content: attr(data-label); font-weight: bold; text-align: left; font-size: 0.8rem; color: #888; }
        }
      `}</style>
    </div>
  );
}
