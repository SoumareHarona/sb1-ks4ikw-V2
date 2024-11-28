import { memo } from 'react';
import { Wallet, AlertCircle } from 'lucide-react';
import type { FormData } from './types';

interface AdvancePaymentSectionProps {
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const AdvancePaymentSection = memo(function AdvancePaymentSection({ form, onChange }: AdvancePaymentSectionProps) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
      <div className="flex items-center space-x-2 mb-4">
        <Wallet className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-medium text-green-900">Advance Payment</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="advanceAmount" className="block text-sm font-medium text-green-800 mb-2">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="advanceAmount"
              id="advanceAmount"
              value={form.advanceAmount}
              onChange={onChange}
              className="block w-full rounded-lg border-green-200 bg-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="advanceCurrency" className="block text-sm font-medium text-green-800 mb-2">
              Currency
            </label>
            <select
              name="advanceCurrency"
              id="advanceCurrency"
              value={form.advanceCurrency}
              onChange={onChange}
              className="block w-full rounded-lg border-green-200 bg-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            >
              <option value="EUR">EUR</option>
              <option value="XOF">XOF</option>
            </select>
          </div>
        </div>

        <div className="flex items-start space-x-2 text-sm text-green-600">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            The advance payment will be automatically deducted from the total shipping cost
          </p>
        </div>
      </div>
    </div>
  );
});