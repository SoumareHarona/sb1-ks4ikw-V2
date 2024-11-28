import { memo } from 'react';
import { CreditCard } from 'lucide-react';
import type { FormData } from './types';

interface PaymentSectionProps {
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const EUR_TO_XOF = 655.957;

export const PaymentSection = memo(function PaymentSection({ form, onChange }: PaymentSectionProps) {
  const additionalFeesEUR = form.additionalFeesCurrency === 'EUR'
    ? parseFloat(form.additionalFeesAmount) || 0
    : (parseFloat(form.additionalFeesAmount) || 0) / EUR_TO_XOF;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100">
      <div className="flex items-center space-x-2 mb-4">
        <CreditCard className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-medium text-orange-900">Payment Details</h3>
      </div>

      <div className="space-y-6">
        {/* Additional Fees */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="additionalFeesAmount" className="block text-sm font-medium text-orange-800 mb-2">
              Additional Fees
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="additionalFeesAmount"
              id="additionalFeesAmount"
              value={form.additionalFeesAmount}
              onChange={onChange}
              className="block w-full rounded-lg border-orange-200 bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="additionalFeesCurrency" className="block text-sm font-medium text-orange-800 mb-2">
              Currency
            </label>
            <select
              name="additionalFeesCurrency"
              id="additionalFeesCurrency"
              value={form.additionalFeesCurrency}
              onChange={onChange}
              className="block w-full rounded-lg border-orange-200 bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            >
              <option value="EUR">EUR</option>
              <option value="XOF">XOF</option>
            </select>
          </div>
        </div>

        {/* Advance Payment */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="advanceAmount" className="block text-sm font-medium text-orange-800 mb-2">
              Advance Payment
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="advanceAmount"
              id="advanceAmount"
              value={form.advanceAmount}
              onChange={onChange}
              className="block w-full rounded-lg border-orange-200 bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="advanceCurrency" className="block text-sm font-medium text-orange-800 mb-2">
              Currency
            </label>
            <select
              name="advanceCurrency"
              id="advanceCurrency"
              value={form.advanceCurrency}
              onChange={onChange}
              className="block w-full rounded-lg border-orange-200 bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            >
              <option value="EUR">EUR</option>
              <option value="XOF">XOF</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
});