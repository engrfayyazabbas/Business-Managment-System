'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseBreakdownChartProps {
  data: { category: string; amount: number }[];
  loading: boolean;
}

export default function ExpenseBreakdownChart({ data, loading }: ExpenseBreakdownChartProps) {
  const chartData = {
    labels: data.map(d => d.category),
    datasets: [
      {
        data: data.map(d => d.amount),
        backgroundColor: [
          '#FFD700', // Gold
          '#FF4500', // Phoenix
          '#28a745', // Success
          '#17a2b8', // Info
          '#6f42c1', // Purple
          '#fd7e14', // Orange
          '#20c997', // Teal
          '#e83e8c'  // Pink
        ],
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          color: 'rgba(255,255,255,0.7)',
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: PKR ${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="card chart-card">
      <h3>Expense Breakdown</h3>
      <div className="chart-container">
        {loading ? (
          <div className="loading">Loading chart...</div>
        ) : data.length === 0 ? (
          <div className="no-data">No data available</div>
        ) : (
          <Doughnut data={chartData} options={options} />
        )}
      </div>

      <style jsx>{`
        .chart-card {
          padding: var(--space-md);
          height: 350px;
          display: flex;
          flex-direction: column;
        }

        h3 {
          margin: 0 0 var(--space-md) 0;
          font-size: 1rem;
          color: var(--foreground);
        }

        .chart-container {
          flex: 1;
          position: relative;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading, .no-data {
          color: var(--foreground);
          opacity: 0.5;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .chart-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
