import { useState, useEffect } from 'react';
import { Package2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../contexts/LanguageContext';
import { getFreightNumbers } from '../../lib/api';
import type { FreightNumber } from '../../types';
import { LoadingState } from './LoadingState';
import { FreightNumberSection } from './FreightNumberSection';
import { ShipmentSection } from './ShipmentSection';

export function CreateShipment() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [freightNumbers, setFreightNumbers] = useState<FreightNumber[]>([]);
  const [selectedFreightNumber, setSelectedFreightNumber] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  const loadFreightNumbers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFreightNumbers();
      setFreightNumbers(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Error loading freight numbers:', err);
      setError('Failed to load freight numbers');
      toast.error('Failed to load freight numbers');
      setFreightNumbers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFreightNumbers();
  }, []);

  const handleFreightNumberCreated = (freightNumber: FreightNumber) => {
    setFreightNumbers(prev => [freightNumber, ...prev]);
    setSelectedFreightNumber(freightNumber.id);
    toast.success('Freight number created successfully');
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Package2 className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Freight Numbers</h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <button
                  onClick={loadFreightNumbers}
                  className="mt-3 text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 mb-6">
          <Package2 className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">{t('shipment.create')}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FreightNumberSection
            freightNumbers={freightNumbers}
            selectedFreightNumber={selectedFreightNumber}
            onFreightNumberCreated={handleFreightNumberCreated}
            onSelect={setSelectedFreightNumber}
            onStatusChange={loadFreightNumbers}
          />

          <ShipmentSection
            selectedFreightNumber={selectedFreightNumber}
            freightNumbers={freightNumbers}
            onSuccess={loadFreightNumbers}
          />
        </div>
      </div>
    </div>
  );
}