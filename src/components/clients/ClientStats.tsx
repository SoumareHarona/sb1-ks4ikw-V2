import { Users, Package2, TrendingUp } from 'lucide-react';
import type { Client } from '../../types';

interface ClientStatsProps {
  clients: Client[];
}

export function ClientStats({ clients }: ClientStatsProps) {
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.totalShipments > 0).length,
    totalShipments: clients.reduce((sum, c) => sum + c.totalShipments, 0)
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Clients</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Active Clients</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Package2 className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Shipments</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalShipments}</p>
          </div>
        </div>
      </div>
    </div>
  );
}