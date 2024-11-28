import { useState, useEffect } from 'react';
import { getClients } from '../lib/api';
import type { Client } from '../types';

interface UseClientsFilters {
  search: string;
  status: string;
  dateRange: string;
}

export function useClients(filters: UseClientsFilters) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getClients();
        
        // Apply filters
        let filtered = data;
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(client => 
            client.name.toLowerCase().includes(searchLower) ||
            client.phone.includes(searchLower)
          );
        }

        if (filters.status !== 'all') {
          filtered = filtered.filter(client => 
            filters.status === 'active' ? client.totalShipments > 0 : client.totalShipments === 0
          );
        }

        if (filters.dateRange !== 'all') {
          const days = parseInt(filters.dateRange);
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - days);
          
          filtered = filtered.filter(client => 
            new Date(client.createdAt) >= cutoff
          );
        }

        setClients(filtered);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load clients'));
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [filters]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    // Re-run the effect
  };

  return { clients, loading, error, refetch };
}