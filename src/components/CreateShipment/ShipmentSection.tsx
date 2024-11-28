import { ShipmentForm } from '../ShipmentForm';
import type { FreightNumber } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ShipmentSectionProps {
  selectedFreightNumber?: string;
  freightNumbers: FreightNumber[];
  onSuccess: () => void;
}

export function ShipmentSection({ selectedFreightNumber, freightNumbers, onSuccess }: ShipmentSectionProps) {
  const { t } = useLanguage();
  
  if (!selectedFreightNumber) {
    return (
      <div className="lg:col-span-2">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500 text-center">
            {t('shipment.selectFreightNumber')}
          </p>
        </div>
      </div>
    );
  }

  const freightNumber = freightNumbers.find(f => f.id === selectedFreightNumber);
  if (!freightNumber) return null;

  return (
    <div className="lg:col-span-2">
      <ShipmentForm
        freightNumber={freightNumber}
        onSuccess={onSuccess}
      />
    </div>
  );
}