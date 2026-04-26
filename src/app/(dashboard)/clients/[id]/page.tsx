import ClientProfile from '@/components/clients/ClientProfile';

export function generateMetadata({ params: _params }: { params: { id: string } }) {
  return {
    title: 'Client Profile - GoldenPhoenix',
  };
}

export default function ClientPage({ params }: { params: { id: string } }) {
  return (
    <div className="page-container">
      <ClientProfile clientId={params.id} />
    </div>
  );
}
