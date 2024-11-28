import { memo } from 'react';
import { Package, AlertCircle } from 'lucide-react';
import type { FormData } from './types';

interface PackagingSectionProps {
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const PackagingSection = memo(function PackagingSection({ form, onChange }: PackagingSectionProps) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border border-amber-100">
      <div className="flex items-center space-x-2 mb-4">
        <Package className="h-5 w-5 text-amber-600" />
        <h3 className="text-lg font-medium text-amber-900">Package Details</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="packageType" className="block text-sm font-medium text-amber-800 mb-2">
            Package Type
          </label>
          <select
            id="packageType"
            name="packageType"
            value={form.packageType}
            onChange={onChange}
            className="block w-full rounded-lg border-amber-200 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
          >
            <option value="">Select package type...</option>
            <option value="box">Box (Carton)</option>
            <option value="bag">Bag (Sac)</option>
            <option value="pallet">Pallet</option>
            <option value="container">Container</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="packaging" className="block text-sm font-medium text-amber-800 mb-2">
            Package Description
          </label>
          <input
            type="text"
            id="packaging"
            name="packaging"
            value={form.packaging}
            onChange={onChange}
            placeholder="e.g., CD3, D49, un sac tounka"
            className="block w-full rounded-lg border-amber-200 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
          />
          <p className="mt-1 text-sm text-amber-600">
            Specify the type and quantity of packages
          </p>
        </div>

        <div>
          <label htmlFor="specialHandling" className="block text-sm font-medium text-amber-800 mb-2">
            Special Handling Requirements
          </label>
          <select
            id="specialHandling"
            name="specialHandling"
            value={form.specialHandling}
            onChange={onChange}
            multiple
            className="block w-full rounded-lg border-amber-200 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm min-h-[120px]"
          >
            <option value="fragile">Fragile</option>
            <option value="perishable">Perishable</option>
            <option value="hazardous">Hazardous Materials</option>
            <option value="temperature">Temperature Controlled</option>
            <option value="liquid">Liquid</option>
          </select>
          <p className="mt-1 text-sm text-amber-600">
            Hold Ctrl/Cmd to select multiple options
          </p>
        </div>

        <div className="mt-2 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-600">
            Special handling requirements may affect shipping costs and delivery time
          </p>
        </div>
      </div>
    </div>
  );
});