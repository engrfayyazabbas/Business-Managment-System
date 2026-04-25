'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import './layout.css';

export default function Header() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <header className="header">
      <div className="header-title">
        <label htmlFor="mobile-sidebar-toggle" className="menu-toggle-btn">
          ☰
        </label>
        <h1>BMS</h1>
      </div>
      <div className="header-user">
        <span>{user?.email}</span>
        <button className="logout-btn" onClick={signOut}>Logout</button>
      </div>
    </header>
  );
}
