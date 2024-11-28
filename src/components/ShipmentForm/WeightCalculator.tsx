import { memo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { FormData } from './types';

interface WeightCalculatorProps {
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mode: string;
}

export const WeightCalculator = memo(function WeightCalculator({ form, onChange, mode }: WeightCalculatorProps) {
  const { t } = useLanguage();

  if (mode === 'gp') return null;

  const totalWeight = [form.foodWeight, form.nonFoodWeight, form.hn7Weight]
    .map(w => parseFloat(w) || 0)
    .reduce((a, b) => a + b, 0);

  return (
    <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border border-teal-100">
      <h3 className="text-lg font-medium text-teal-900 mb-4">
        {t('shipment.weightInfo')}
        {totalWeight > 0 && (
          <span className="ml-2 text-sm text-teal-600">
            (Total: {totalWeight.toFixed(1)} kg)
          </span>
        )}
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="foodWeight" className="block text-sm font-medium text-teal-800 mb-2">
            {t('shipment.foodWeight')}
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            name="foodWeight"
            id="foodWeight"
            value={form.foodWeight}
            onChange={onChange}
            className="block w-full rounded-lg border-teal-200 bg-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="nonFoodWeight" className="block text-sm font-medium text-teal-800 mb-2">
            {t('shipment.nonFoodWeight')}
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            name="nonFoodWeight"
            id="nonFoodWeight"
            value={form.nonFoodWeight}
            onChange={onChange}
            className="block w-full rounded-lg border-teal-200 bg-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="hn7Weight" className="block text-sm font-medium text-teal-800 mb-2">
            {t('shipment.hn7Weight')}
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            name="hn7Weight"
            id="hn7Weight"
            value={form.hn7Weight}
            onChange={onChange}
            className="block w-full rounded-lg border-teal-200 bg-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
});