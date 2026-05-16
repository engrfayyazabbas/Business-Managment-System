'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
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

interface ClientDuesChartProps {
  data: { name: string; currentDues: number }[];
  loading: boolean;
}

export default function ClientDuesChart({ data, loading }: ClientDuesChartProps) {
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: 'Outstanding Dues',
        data: data.map(d => d.currentDues),
        backgroundColor: '#FF4500', // Phoenix
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => `PKR ${context.parsed.x?.toLocaleString() || 0}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: 'rgba(255,255,255,0.5)',
          callback: (value: string | number) => `PKR ${Number(value).toLocaleString()}`,
        },
        grid: {
          color: 'rgba(255,255,255,0.05)'
        }
      },
      y: {
        ticks: {
          color: 'rgba(255,255,255,0.7)',
        },
        grid: {
          display: false
        }
      }
    },
  };

  return (
    <div className="card chart-card">
      <h3>Top Client Dues</h3>
      <div className="chart-container">
        {loading ? (
          <div className="loading">Loading chart...</div>
        ) : data.length === 0 ? (
          <div className="no-data">No outstanding dues</div>
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
