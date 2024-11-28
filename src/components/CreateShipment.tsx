import { useState, useEffect } from 'react';
import { Package2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import { getFreightNumbers } from '../lib/api';
import type { FreightNumber } from '../types';
import { FreightNumberForm } from './FreightNumberForm';
import { FreightNumberList } from './FreightNumberList';
import { ShipmentForm } from './ShipmentForm';

export function CreateShipment() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [freightNumbers, setFreightNumbers] = useState<FreightNumber[]>([]);
  const [selectedFreightNumber, setSelectedFreightNumber] = useState<string | undefined>(undefined);

  const loadFreightNumbers = async () => {
    try {
      setLoading(true);
      const response = await getFreightNumbers();
      // Ensure we always have an array, even if empty
      const numbers = Array.isArray(response) ? response : [];
      setFreightNumbers(numbers);
    } catch (error) {
      console.error('Error loading freight numbers:', error);
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
    // Ensure we're properly spreading the array and adding the new item
    setFreightNumbers(prev => [freightNumber, ...prev]);
    setSelectedFreightNumber(freightNumber.id);
  };

  const handleStatusChange = async () => {
    await loadFreightNumbers();
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedFreight = freightNumbers.find(f => f.id === selectedFreightNumber);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 mb-6">
          <Package2 className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">{t('shipment.create')}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <FreightNumberForm onFreightNumberCreated={handleFreightNumberCreated} />
            {freightNumbers.length > 0 && (
              <FreightNumberList
                freightNumbers={freightNumbers}
                selectedFreightNumber={selectedFreightNumber}
                onSelect={setSelectedFreightNumber}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>

          <div className="lg:col-span-2">
            {selectedFreight ? (
              <ShipmentForm
                freightNumber={selectedFreight}
                onSuccess={loadFreightNumbers}
              />
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-500 text-center">
                  {t('shipment.selectFreightNumber')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}