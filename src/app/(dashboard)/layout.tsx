import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <input type="checkbox" id="mobile-sidebar-toggle" className="mobile-sidebar-toggle" />
      <label htmlFor="mobile-sidebar-toggle" className="sidebar-overlay"></label>
      <Sidebar />
      <Header />
      <main className="main-content">
        {children}
      </main>
    </>
  );
}
