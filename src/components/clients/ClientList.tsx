import { useState } from 'react';
import { ClientTable } from './ClientTable';
import { ClientFilters } from './ClientFilters';
import { ClientStats } from './ClientStats';
import { useClients } from '../../hooks/useClients';
import { ErrorMessage } from '../ErrorMessage';
import { LoadingSpinner } from '../LoadingSpinner';

export function ClientList() {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: '30'
  });

  const { clients, loading, error, refetch } = useClients(filters);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Error Loading Clients" 
        message={error.message} 
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ClientStats clients={clients} />
      <ClientFilters filters={filters} onChange={setFilters} />
      <ClientTable clients={clients} />
    </div>
  );
}