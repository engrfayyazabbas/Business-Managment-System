import Link from 'next/link';
import './layout.css';

export default function Sidebar() {
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
