import './layout.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-title">
        <label htmlFor="mobile-sidebar-toggle" className="menu-toggle-btn">
          ☰
        </label>
        <h1>BMS</h1>
      </div>
      <div className="header-user">
        <span>User Name</span>
        <button className="logout-btn">Logout</button>
      </div>
    </header>
  );
}
