import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(apiFunction: (...args: any[]) => Promise<T>, options: UseApiOptions<T> = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unexpected error occurred');
      setError(error);
      options.onError?.(error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options]);

  return {
    data,
    loading,
    error,
    execute,
    setData,
  };
}