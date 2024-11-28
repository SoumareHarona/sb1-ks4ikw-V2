import { memo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface WeightCalculatorProps {
  mode: string;
  weights: {
    food: number;
    nonFood: number;
    hn7: number;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const WeightCalculator = memo(function WeightCalculator({ mode, weights, onChange }: WeightCalculatorProps) {
  const { t } = useLanguage();

  if (mode !== 'air') {
    return null;
  }

  const totalWeight = (weights.food || 0) + (weights.nonFood || 0) + (weights.hn7 || 0);

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
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              step="0.1"
              min="0"
              name="foodWeight"
              id="foodWeight"
              value={weights.food || ''}
              onChange={onChange}
              className="block w-full rounded-lg border-teal-200 bg-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              placeholder="0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-teal-500 sm:text-sm">kg</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-teal-600">€3/kg</p>
        </div>

        <div>
          <label htmlFor="nonFoodWeight" className="block text-sm font-medium text-teal-800 mb-2">
            {t('shipment.nonFoodWeight')}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              step="0.1"
              min="0"
              name="nonFoodWeight"
              id="nonFoodWeight"
              value={weights.nonFood || ''}
              onChange={onChange}
              className="block w-full rounded-lg border-teal-200 bg-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              placeholder="0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-teal-500 sm:text-sm">kg</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-teal-600">€4.90/kg</p>
        </div>

        <div>
          <label htmlFor="hn7Weight" className="block text-sm font-medium text-teal-800 mb-2">
            {t('shipment.hn7Weight')}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              step="0.1"
              min="0"
              name="hn7Weight"
              id="hn7Weight"
              value={weights.hn7 || ''}
              onChange={onChange}
              className="block w-full rounded-lg border-teal-200 bg-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              placeholder="0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-teal-500 sm:text-sm">kg</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-teal-600">€7/kg</p>
        </div>
      </div>
    </div>
  );
});