import { memo } from 'react';
import { Wallet } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdvancePaymentSectionProps {
  form: {
    advanceAmount: string;
    advanceCurrency: 'EUR' | 'XOF';
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const AdvancePaymentSection = memo(function AdvancePaymentSection({ form, onChange }: AdvancePaymentSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
      <h3 className="text-lg font-medium text-green-900 mb-4 flex items-center">
        <Wallet className="h-5 w-5 mr-2 text-green-600" />
        Avance de paiement
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="advanceAmount" className="block text-sm font-medium text-green-800 mb-2">
            Montant
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
          />
        </div>
        <div>
          <label htmlFor="advanceCurrency" className="block text-sm font-medium text-green-800 mb-2">
            Devise
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
    </div>
  );
});