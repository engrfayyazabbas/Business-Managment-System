'use client';

import { useState, useEffect, useCallback } from 'react';
import DateRangeFilter from '@/components/dashboard/DateRangeFilter';
import SummaryCards from '@/components/dashboard/SummaryCards';
import SalesTrendChart from '@/components/dashboard/SalesTrendChart';
import ExpenseBreakdownChart from '@/components/dashboard/ExpenseBreakdownChart';
import ProfitLossChart from '@/components/dashboard/ProfitLossChart';
import ClientDuesChart from '@/components/dashboard/ClientDuesChart';
import RecentActivityFeed from '@/components/dashboard/RecentActivityFeed';

export default function DashboardPage() {
  // Default range: 1st of current month to today
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const offset = firstDay.getTimezoneOffset();
  const adjustedFirstDay = new Date(firstDay.getTime() - (offset * 60 * 1000));
  
  const [dateRange, setDateRange] = useState({
    from: adjustedFirstDay.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0]
  });

  // Data states
  const [salesSummary, setSalesSummary] = useState<{ totalRevenue: number; breakdown: Array<{ product: string; quantity: number; revenue: number; unit: string }> } | null>(null);
  const [expenseSummary, setExpenseSummary] = useState<{ totalExpenses: number; breakdown: Array<{ category: string; amount: number }> } | null>(null);
  const [profitLoss, setProfitLoss] = useState<Array<{ date: string; revenue: number; expenses: number }>>([]);
  const [salesTrend, setSalesTrend] = useState<Array<{ date: string; revenue: number }>>([]);
  const [clientDues, setClientDues] = useState<{ totalDues: number; clients: Array<{ id: string; name: string; currentDues: number }> } | null>(null);
  const [inventoryStatus, setInventoryStatus] = useState<{ items: Array<{ id: string; name: string; unit: string; currentStock: number }> } | null>(null);
  const [recentActivity, setRecentActivity] = useState<Array<{ id: string; type: 'sale' | 'expense'; description: string; amount: number; date: string }>>([]);

  // Loading & Error states
  const [loadingDateDependent, setLoadingDateDependent] = useState(true);
  const [loadingStatic, setLoadingStatic] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchDateDependentData = useCallback(async (from: string, to: string) => {
    setLoadingDateDependent(true);
    try {
      const [salesRes, expenseRes, plRes, trendRes] = await Promise.all([
        fetch(`/api/dashboard/sales-summary?from=${from}&to=${to}`),
        fetch(`/api/dashboard/expense-summary?from=${from}&to=${to}`),
        fetch(`/api/dashboard/profit-loss?from=${from}&to=${to}`),
        fetch(`/api/dashboard/sales-trend?from=${from}&to=${to}`)
      ]);

      if (salesRes.ok) setSalesSummary(await salesRes.json());
      else setErrors(prev => ({ ...prev, sales: 'Failed to load sales' }));

      if (expenseRes.ok) setExpenseSummary(await expenseRes.json());
      else setErrors(prev => ({ ...prev, expenses: 'Failed to load expenses' }));

      if (plRes.ok) {
        const plData = await plRes.json();
        setProfitLoss(plData.data || []);
      }

      if (trendRes.ok) {
        const trendData = await trendRes.json();
        setSalesTrend(trendData.data || []);
      }
    } catch (err) {
      console.error('Error fetching date-dependent data:', err);
    } finally {
      setLoadingDateDependent(false);
    }
  }, []);

  const fetchStaticData = useCallback(async () => {
    setLoadingStatic(true);
    try {
      const [duesRes, inventoryRes, activityRes] = await Promise.all([
        fetch('/api/dashboard/client-dues'),
        fetch('/api/dashboard/inventory-status'),
        fetch('/api/dashboard/recent-activity')
      ]);

      if (duesRes.ok) setClientDues(await duesRes.json());
      else setErrors(prev => ({ ...prev, clients: 'Failed to load dues' }));

      if (inventoryRes.ok) setInventoryStatus(await inventoryRes.json());
      else setErrors(prev => ({ ...prev, inventory: 'Failed to load inventory' }));

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setRecentActivity(activityData.activities || []);
      }
    } catch (err) {
      console.error('Error fetching static data:', err);
    } finally {
      setLoadingStatic(false);
    }
  }, []);

  useEffect(() => {
    fetchDateDependentData(dateRange.from, dateRange.to);
  }, [dateRange, fetchDateDependentData]);

  useEffect(() => {
    fetchStaticData();
  }, [fetchStaticData]);

  const handleDateChange = (from: string, to: string) => {
    setDateRange({ from, to });
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Dashboard</h1>
        <p className="subtitle">Business Overview & Analytics</p>
      </header>

      <DateRangeFilter 
        from={dateRange.from} 
        to={dateRange.to} 
        onChange={handleDateChange} 
      />

      <SummaryCards 
        salesSummary={salesSummary}
        expenseSummary={expenseSummary}
        clientDues={clientDues}
        inventoryStatus={inventoryStatus}
        loading={loadingDateDependent || loadingStatic}
        errors={errors}
      />

      <div className="charts-grid">
        <SalesTrendChart 
          data={salesTrend} 
          loading={loadingDateDependent} 
        />
        <ExpenseBreakdownChart 
          data={expenseSummary?.breakdown || []} 
          loading={loadingDateDependent} 
        />
        <ProfitLossChart 
          data={profitLoss} 
          loading={loadingDateDependent} 
        />
        <ClientDuesChart 
          data={clientDues?.clients || []} 
          loading={loadingStatic} 
        />
      </div>

      <RecentActivityFeed 
        activities={recentActivity} 
        loading={loadingStatic} 
        error={errors.activity || ''} 
      />

      <style jsx>{`
        .dashboard-container {
          padding: var(--space-md);
          max-width: 1400px;
          margin: 0 auto;
        }

        header {
          margin-bottom: var(--space-lg);
        }

        h1 {
          margin: 0;
          font-size: 2rem;
          color: var(--primary);
        }

        .subtitle {
          margin: 4px 0 0 0;
          color: var(--foreground);
          opacity: 0.6;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }

        @media (max-width: 1024px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: var(--space-sm);
          }
          
          h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
