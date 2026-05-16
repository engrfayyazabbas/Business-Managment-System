'use client';

import { formatPKR } from '@/utils/format';

interface Activity {
  id: string;
  type: 'sale' | 'expense';
  description: string;
  amount: number;
  date: string;
}

interface RecentActivityFeedProps {
  activities: Activity[];
  loading: boolean;
  error: string;
}

export default function RecentActivityFeed({ activities, loading, error }: RecentActivityFeedProps) {
  return (
    <div className="card feed-card">
      <h3>Recent Activity</h3>
      
      <div className="feed-content">
        {loading ? (
          <div className="message">Loading activity...</div>
        ) : error ? (
          <div className="message error">{error}</div>
        ) : activities.length === 0 ? (
          <div className="message">No recent activity</div>
        ) : (
          <div className="activity-list">
            {activities.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="activity-item">
                <div className={`icon ${activity.type}`}>
                  {activity.type === 'sale' ? '🛒' : '💸'}
                </div>
                <div className="details">
                  <div className="description">{activity.description}</div>
                  <div className="date">{activity.date}</div>
                </div>
                <div className={`amount ${activity.type}`}>
                  {activity.type === 'sale' ? '+' : '-'} {formatPKR(activity.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .feed-card {
          padding: var(--space-md);
          margin-bottom: var(--space-md);
        }

        h3 {
          margin: 0 0 var(--space-md) 0;
          font-size: 1.1rem;
          color: var(--foreground);
        }

        .feed-content {
          min-height: 100px;
        }

        .message {
          padding: var(--space-md);
          text-align: center;
          color: var(--foreground);
          opacity: 0.5;
          font-size: 0.9rem;
        }

        .message.error {
          color: var(--danger);
          opacity: 1;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
        }

        .activity-item {
          display: flex;
          align-items: center;
          padding: var(--space-sm) 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          gap: var(--space-md);
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          background: rgba(255,255,255,0.05);
        }

        .icon.sale {
          background: rgba(255, 215, 0, 0.1);
          color: var(--primary);
        }

        .icon.expense {
          background: rgba(220, 53, 69, 0.1);
          color: var(--danger);
        }

        .details {
          flex: 1;
        }

        .description {
          font-weight: 500;
          color: var(--foreground);
        }

        .date {
          font-size: 0.75rem;
          color: var(--foreground);
          opacity: 0.5;
        }

        .amount {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .amount.sale {
          color: var(--success);
        }

        .amount.expense {
          color: var(--danger);
        }

        @media (max-width: 480px) {
          .amount {
            font-size: 0.8rem;
          }
          .description {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
