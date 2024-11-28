import { MoreVertical, FileText, Edit, Trash2 } from 'lucide-react';
import type { Client } from '../../types';

interface ClientActionsProps {
  client: Client;
}

export function ClientActions({ client }: ClientActionsProps) {
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex items-center p-2 border border-transparent rounded-md text-gray-400 hover:text-gray-500"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
        <div className="py-1">
          <button
            className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
            onClick={() => window.location.href = `/clients/${client.id}`}
          >
            <FileText className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            View Details
          </button>
          <button
            className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <Edit className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Edit
          </button>
          <button
            className="group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
          >
            <Trash2 className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}