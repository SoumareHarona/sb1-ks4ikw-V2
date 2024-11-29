import { useState, useEffect, useCallback, useRef } from 'react';
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
  const filtersRef = useRef(filters);

  const applyFilters = useCallback((data: Client[]) => {
    let filtered = data;
    
    if (filtersRef.current.search) {
      const searchLower = filtersRef.current.search.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchLower) ||
        client.phone.includes(searchLower)
      );
    }

    if (filtersRef.current.status !== 'all') {
      filtered = filtered.filter(client => 
        filtersRef.current.status === 'active' ? client.totalShipments > 0 : client.totalShipments === 0
      );
    }

    if (filtersRef.current.dateRange !== 'all') {
      const days = parseInt(filtersRef.current.dateRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      
      filtered = filtered.filter(client => 
        new Date(client.createdAt) >= cutoff
      );
    }

    return filtered;
  }, []);

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching clients...');
      const data = await getClients();
      console.log('Received clients:', data);
      
      const filtered = applyFilters(data);
      console.log('Filtered clients:', filtered);
      setClients(filtered);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError(err instanceof Error ? err : new Error('Failed to load clients'));
    } finally {
      setLoading(false);
    }
  }, [applyFilters]);

  useEffect(() => {
    filtersRef.current = filters;
    loadClients();
  }, [filters.search, filters.status, filters.dateRange, loadClients]);

  const refetch = useCallback(() => {
    console.log('Refetching clients...');
    loadClients();
  }, [loadClients]);

  return { clients, loading, error, refetch };
}
