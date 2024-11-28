import type { FreightNumber } from '../../types';

export interface CreateShipmentProps {
  freightNumbers: FreightNumber[];
  selectedFreightNumber?: string;
  onSelect: (id: string) => void;
  onStatusChange: () => void;
}

export interface FreightNumberFormProps {
  onFreightNumberCreated: (freightNumber: FreightNumber) => void;
}

export interface ShipmentFormProps {
  freightNumber: FreightNumber;
  onSuccess: () => void;
}