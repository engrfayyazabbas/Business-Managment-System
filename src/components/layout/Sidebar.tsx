'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import './layout.css';

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link href="/">
          <h2>GoldenPhoenix</h2>
        </Link>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>
            <Link href="/sales">Sales</Link>
          </li>
          <li>
            <Link href="/expenses">Expenses</Link>
          </li>
          <li>
            <Link href="/inventory">Inventory</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
