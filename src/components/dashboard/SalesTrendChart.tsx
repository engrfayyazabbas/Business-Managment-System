'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalesTrendChartProps {
  data: { date: string; revenue: number }[];
  loading: boolean;
}

export default function SalesTrendChart({ data, loading }: SalesTrendChartProps) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Sales Revenue',
        data: data.map(d => d.revenue),
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: { parsed: { y: number } }) => `PKR ${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: string | number) => `PKR ${Number(value).toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="card chart-card">
      <h3>Sales Trend</h3>
      <div className="chart-container">
        {loading ? (
          <div className="loading">Loading chart...</div>
        ) : data.length === 0 ? (
          <div className="no-data">No data available for selected range</div>
        ) : (
          <Line data={chartData} options={options} />
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
