import { memo, useMemo } from 'react';
import type { FormData } from './types';

interface AmountCalculatorProps {
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  mode: string;
}

const RATES = {
  air: {
    food: 3, // EUR per kg
    nonFood: 4.9,
    hn7: 7
  },
  sea: {
    volumeRate: 250, // EUR per cubic meter
    minVolume: 0.5, // Minimum volume in cubic meters
    food: 4,
    nonFood: 5,
    hn7: 6
  },
  gp: {
    base: 50 // Base rate for GP transport
  }
};

const EUR_TO_XOF = 655.957; // Fixed conversion rate

export const AmountCalculator = memo(function AmountCalculator({ form, onChange, mode }: AmountCalculatorProps) {
  const calculatedAmount = useMemo(() => {
    if (mode === 'gp') {
      return RATES.gp.base;
    }

    const rates = RATES[mode as keyof typeof RATES];
    if (!rates) return 0;

    if (mode === 'sea') {
      // Calculate volume in cubic meters
      const volume = Math.max(
        (parseFloat(form.length) || 0) * 
        (parseFloat(form.width) || 0) * 
        (parseFloat(form.height) || 0) / 1000000,
        rates.minVolume
      );
      
      // Calculate volume-based cost
      const volumeCost = volume * rates.volumeRate;

      // Calculate weight-based cost
      const foodCost = (parseFloat(form.foodWeight) || 0) * rates.food;
      const nonFoodCost = (parseFloat(form.nonFoodWeight) || 0) * rates.nonFood;
      const hn7Cost = (parseFloat(form.hn7Weight) || 0) * rates.hn7;
      const weightCost = foodCost + nonFoodCost + hn7Cost;

      // Return the higher of volume-based or weight-based cost
      return Math.max(volumeCost, weightCost);
    }

    // Air freight calculation
    const foodCost = (parseFloat(form.foodWeight) || 0) * rates.food;
    const nonFoodCost = (parseFloat(form.nonFoodWeight) || 0) * rates.nonFood;
    const hn7Cost = (parseFloat(form.hn7Weight) || 0) * rates.hn7;

    return foodCost + nonFoodCost + hn7Cost;
  }, [form.foodWeight, form.nonFoodWeight, form.hn7Weight, form.length, form.width, form.height, mode]);

  const amountInXOF = calculatedAmount * EUR_TO_XOF;
  const additionalFeesEUR = form.additionalFeesCurrency === 'EUR' 
    ? parseFloat(form.additionalFeesAmount) || 0 
    : (parseFloat(form.additionalFeesAmount) || 0) / EUR_TO_XOF;
  
  const totalEUR = calculatedAmount + additionalFeesEUR;
  const totalXOF = Math.round(amountInXOF + (form.additionalFeesCurrency === 'XOF' ? parseFloat(form.additionalFeesAmount) || 0 : additionalFeesEUR * EUR_TO_XOF));

  return (
    <div className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-xl border border-rose-100">
      <h3 className="text-lg font-medium text-rose-900 mb-4">
        Calculated Amount
        <span className="ml-2 text-sm font-normal text-rose-600">
          (EUR: €{calculatedAmount.toFixed(2)} | XOF: {Math.round(amountInXOF).toLocaleString()} CFA)
        </span>
      </h3>

      {/* Rate Information */}
      {mode === 'air' && (
        <div className="mb-4 p-3 bg-rose-50 rounded-lg text-sm">
          <h4 className="font-medium text-rose-900 mb-2">Air Freight Rates (per kg):</h4>
          <div className="grid grid-cols-3 gap-2 text-rose-700">
            <div>Food: €{RATES.air.food}</div>
            <div>Non-Food: €{RATES.air.nonFood}</div>
            <div>HN7: €{RATES.air.hn7}</div>
          </div>
        </div>
      )}

      {mode === 'sea' && (
        <div className="mb-4 p-3 bg-rose-50 rounded-lg text-sm">
          <h4 className="font-medium text-rose-900 mb-2">Sea Freight Rates:</h4>
          <div className="grid grid-cols-1 gap-2 text-rose-700">
            <div>Volume Rate: €{RATES.sea.volumeRate}/m³ (minimum {RATES.sea.minVolume}m³)</div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div>Food: €{RATES.sea.food}/kg</div>
              <div>Non-Food: €{RATES.sea.nonFood}/kg</div>
              <div>HN7: €{RATES.sea.hn7}/kg</div>
            </div>
            <div className="text-xs mt-2 text-rose-600">
              Note: The higher of volume-based or weight-based cost will be applied
            </div>
          </div>
        </div>
      )}

      {/* Additional Fees Input */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="additionalFeesAmount" className="block text-sm font-medium text-rose-800 mb-2">
            Additional Fees
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              step="0.01"
              min="0"
              name="additionalFeesAmount"
              id="additionalFeesAmount"
              value={form.additionalFeesAmount}
              onChange={onChange}
              className="block w-full rounded-lg border-rose-200 bg-white shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="additionalFeesCurrency" className="block text-sm font-medium text-rose-800 mb-2">
            Currency
          </label>
          <select
            name="additionalFeesCurrency"
            id="additionalFeesCurrency"
            value={form.additionalFeesCurrency}
            onChange={onChange}
            className="block w-full rounded-lg border-rose-200 bg-white shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
          >
            <option value="XOF">XOF</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      {/* Total Amount Display */}
      <div className="mt-4 p-4 bg-rose-50 rounded-lg">
        <h4 className="text-sm font-medium text-rose-900 mb-2">Total Amount</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-rose-600">EUR</p>
            <p className="text-lg font-semibold text-rose-900">
              €{totalEUR.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-rose-600">XOF</p>
            <p className="text-lg font-semibold text-rose-900">
              {totalXOF.toLocaleString()} CFA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});