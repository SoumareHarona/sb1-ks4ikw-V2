import { Search } from 'lucide-react';

interface ClientFiltersProps {
  filters: {
    search: string;
    status: string;
    dateRange: string;
  };
  onChange: (filters: any) => void;
}

export function ClientFilters({ filters, onChange }: ClientFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-10 w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Clients</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Date Range */}
        <select
          value={filters.dateRange}
          onChange={(e) => onChange({ ...filters, dateRange: e.target.value })}
          className="rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>
    </div>
  );
}