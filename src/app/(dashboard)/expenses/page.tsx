import ExpenseDashboard from '@/components/expenses/ExpenseDashboard';

export const metadata = {
  title: 'Expenses - GoldenPhoenix',
};

export default function ExpensesPage() {
  return (
    <div className="page-container">
      <ExpenseDashboard />
    </div>
  );
}
