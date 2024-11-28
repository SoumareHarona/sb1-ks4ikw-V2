import { FreightNumberForm } from '../FreightNumberForm';
import { FreightNumberList } from '../FreightNumberList';
import type { FreightNumber } from '../../types';

interface FreightNumberSectionProps {
  freightNumbers: FreightNumber[];
  selectedFreightNumber?: string;
  onFreightNumberCreated: (freightNumber: FreightNumber) => void;
  onSelect: (id: string) => void;
  onStatusChange: () => void;
}

export function FreightNumberSection({
  freightNumbers,
  selectedFreightNumber,
  onFreightNumberCreated,
  onSelect,
  onStatusChange
}: FreightNumberSectionProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <FreightNumberForm onFreightNumberCreated={onFreightNumberCreated} />
      {freightNumbers.length > 0 && (
        <FreightNumberList
          freightNumbers={freightNumbers}
          selectedFreightNumber={selectedFreightNumber}
          onSelect={onSelect}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
}