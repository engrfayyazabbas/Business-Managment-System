import ClientList from '@/components/clients/ClientList';

export const metadata = {
  title: 'Clients & Dues - GoldenPhoenix',
};

export default function ClientsPage() {
  return (
    <div className="page-container">
      <ClientList />
    </div>
  );
}
