import { memo } from 'react';
import { Package, AlertCircle } from 'lucide-react';
import type { FormData } from './types';

interface PackageDetailsSectionProps {
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const PackageDetailsSection = memo(function PackageDetailsSection({ form, onChange }: PackageDetailsSectionProps) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border border-amber-100">
      <div className="flex items-center space-x-2 mb-4">
        <Package className="h-5 w-5 text-amber-600" />
        <h3 className="text-lg font-medium text-amber-900">Package Details</h3>
      </div>

      <div className="space-y-6">
        {/* Package Type */}
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

        {/* Package Description */}
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

        {/* Special Handling */}
        <div>
          <label htmlFor="specialHandling" className="block text-sm font-medium text-amber-800 mb-2">
            Special Handling Instructions
          </label>
          <div className="mt-1 flex items-center">
            <select
              id="specialHandling"
              name="specialHandling"
              value={form.specialHandling}
              onChange={onChange}
              className="block w-full rounded-lg border-amber-200 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              multiple
            >
              <option value="fragile">Fragile</option>
              <option value="perishable">Perishable</option>
              <option value="hazardous">Hazardous Materials</option>
              <option value="temperature">Temperature Controlled</option>
              <option value="liquid">Liquid</option>
            </select>
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-amber-800 mb-2">
            Additional Comments
          </label>
          <textarea
            id="comments"
            name="comments"
            rows={4}
            value={form.comments}
            onChange={onChange}
            placeholder="Enter any special instructions, handling requirements, or additional notes..."
            className="block w-full rounded-lg border-amber-200 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm resize-none"
          />
          <div className="mt-2 flex items-center text-sm text-amber-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>This information will be visible to handlers and recipients</span>
          </div>
        </div>
      </div>
    </div>
  );
});