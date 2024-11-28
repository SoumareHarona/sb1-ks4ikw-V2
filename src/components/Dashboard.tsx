import { useEffect, useState } from 'react';
import { Ship, Plane, Package2, Users, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getDashboardData } from '../lib/api';
import type { DashboardData } from '../types';
import { toast } from 'react-hot-toast';
import { StatCard } from './dashboard/StatCard';
import { ShipmentTrends } from './dashboard/ShipmentTrends';
import { RevenueChart } from './dashboard/RevenueChart';
import { RecentActivity } from './dashboard/RecentActivity';

export function Dashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState<DashboardData>({
    activeShipments: 0,
    airFreight: 0,
    seaFreight: 0,
    totalClients: 0,
    recentShipments: [],
    monthlyStats: []
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const dashboardData = await getDashboardData();
      setData(dashboardData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      label: t('dashboard.activeShipments'), 
      value: data.activeShipments, 
      icon: Package2,
      color: 'text-blue-600',
      trend: 12
    },
    { 
      label: t('dashboard.airFreight'), 
      value: data.airFreight, 
      icon: Plane,
      color: 'text-indigo-600',
      trend: 8
    },
    { 
      label: t('dashboard.seaFreight'), 
      value: data.seaFreight, 
      icon: Ship,
      color: 'text-green-600',
      trend: 15
    },
    { 
      label: t('dashboard.totalClients'), 
      value: data.totalClients, 
      icon: Users,
      color: 'text-purple-600',
      trend: 5
    },
  ];

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="ml-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{t('dashboard.title')}</h1>
          <button
            onClick={fetchData}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('dashboard.refresh')}
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} index={index} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ShipmentTrends data={data.monthlyStats} />
          <RevenueChart data={data.monthlyStats} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <RecentActivity shipments={data.recentShipments} />
        </div>
      </div>
    </div>
  );
}