'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProfitLossChartProps {
  data: { date: string; revenue: number; expenses: number }[];
  loading: boolean;
}

export default function ProfitLossChart({ data, loading }: ProfitLossChartProps) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Revenue',
        data: data.map(d => d.revenue),
        backgroundColor: '#FFD700',
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: data.map(d => d.expenses),
        backgroundColor: '#dc3545',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255,255,255,0.7)',
          font: { size: 11 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: { dataset: { label?: string }; parsed: { y: number } }) => 
            `${context.dataset.label}: PKR ${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgba(255,255,255,0.5)',
          callback: (value: string | number) => `PKR ${Number(value).toLocaleString()}`,
        },
        grid: {
          color: 'rgba(255,255,255,0.05)'
        }
      },
      x: {
        ticks: {
          color: 'rgba(255,255,255,0.5)',
        },
        grid: {
          display: false
        }
      }
    },
  };

  return (
    <div className="card chart-card">
      <h3>Revenue vs Expenses</h3>
      <div className="chart-container">
        {loading ? (
          <div className="loading">Loading chart...</div>
        ) : data.length === 0 ? (
          <div className="no-data">No data available</div>
        ) : (
          <Bar data={chartData} options={options} />
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
      `}</style>
    </div>
  );
}
