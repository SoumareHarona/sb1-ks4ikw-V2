import { Package2, Plane, Ship, Truck, CheckCircle } from 'lucide-react';
import type { FreightNumber } from '../types';
import { updateFreightStatus } from '../lib/api';
import { toast } from 'react-hot-toast';

interface FreightNumberListProps {
  freightNumbers: FreightNumber[];
  selectedFreightNumber?: string;
  onSelect: (id: string) => void;
  onStatusChange: () => void;
}

const getIcon = (mode: FreightNumber['mode']) => {
  switch (mode) {
    case 'air':
      return Plane;
    case 'sea':
      return Ship;
    case 'gp':
      return Truck;
    default:
      return Package2;
  }
};

const getStatusColor = (status: FreightNumber['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'in_transit':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function FreightNumberList({ freightNumbers, selectedFreightNumber, onSelect, onStatusChange }: FreightNumberListProps) {
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateFreightStatus(id, newStatus);
      toast.success('Status updated successfully');
      onStatusChange();
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Freight Numbers</h3>
        <p className="mt-1 text-sm text-gray-500">Select a freight number to add clients</p>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {freightNumbers.map((freight) => {
            const Icon = getIcon(freight.mode);
            const statusColor = getStatusColor(freight.status);
            const isSelected = selectedFreightNumber === freight.id;

            return (
              <li key={freight.id}>
                <div className={`px-4 py-4 flex items-center hover:bg-gray-50 ${
                  isSelected ? 'bg-indigo-50' : ''
                }`}>
                  <button
                    onClick={() => onSelect(freight.id)}
                    className="flex-1 flex items-center"
                  >
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                          {freight.number}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                          {freight.status}
                        </span>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-500">
                          {freight.origin} → {freight.destination}
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  {freight.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(freight.id, 'in_transit')}
                      className="ml-4 p-2 text-indigo-600 hover:text-indigo-800"
                      title="Mark as In Transit"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}