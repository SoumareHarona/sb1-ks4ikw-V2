import { memo } from 'react';
import { Calculator, Scale, Box, Ruler, CreditCard } from 'lucide-react';
import { calculatePrice, RATES, EUR_TO_XOF } from '../../lib/pricing';
import clsx from 'clsx';

interface PriceCalculatorProps {
  mode: string;
  weights: {
    food?: number;
    nonFood?: number;
    hn7?: number;
  };
  volume?: {
    length?: number;
    width?: number;
    height?: number;
  };
  advancePayment: {
    amount: string;
    currency: 'EUR' | 'XOF';
  };
}

export const PriceCalculator = memo(function PriceCalculator({ 
  mode, 
  weights, 
  volume,
  advancePayment 
}: PriceCalculatorProps) {
  const calculation = calculatePrice(mode as any, weights, volume, advancePayment);
  const hasWeights = Object.values(weights).some(w => w && w > 0);
  const hasVolume = volume && Object.values(volume).every(v => v && v > 0);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="h-6 w-6 text-indigo-600" />
        <h3 className="text-lg font-medium text-indigo-900">Price Calculation</h3>
      </div>

      <div className="space-y-6">
        {/* Base Price */}
        <div className="bg-white rounded-lg p-4 border border-indigo-100">
          <h4 className="text-sm font-medium text-indigo-900 mb-4">Base Price</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-indigo-600 mb-1">EUR</p>
              <p className="text-xl font-bold text-indigo-900">
                €{calculation.baseAmountEUR.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-indigo-600 mb-1">XOF</p>
              <p className="text-xl font-bold text-indigo-900">
                {calculation.baseAmountXOF.toLocaleString()} CFA
              </p>
            </div>
          </div>
        </div>

        {/* Weight-based Calculation */}
        {hasWeights && (
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="h-5 w-5 text-indigo-600" />
              <h4 className="text-sm font-medium text-indigo-900">Weight-based Cost</h4>
            </div>
            <div className="space-y-2">
              {weights.food && (
                <div className="flex justify-between text-sm">
                  <span>Food ({weights.food} kg × €{RATES[mode].food})</span>
                  <span className="font-medium">€{calculation.details.foodCost.toFixed(2)}</span>
                </div>
              )}
              {weights.nonFood && (
                <div className="flex justify-between text-sm">
                  <span>Non-Food ({weights.nonFood} kg × €{RATES[mode].nonFood})</span>
                  <span className="font-medium">€{calculation.details.nonFoodCost.toFixed(2)}</span>
                </div>
              )}
              {weights.hn7 && (
                <div className="flex justify-between text-sm">
                  <span>HN7 ({weights.hn7} kg × €{RATES[mode].hn7})</span>
                  <span className="font-medium">€{calculation.details.hn7Cost.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Volume-based Calculation */}
        {mode === 'sea' && hasVolume && (
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <div className="flex items-center space-x-2 mb-4">
              <Box className="h-5 w-5 text-indigo-600" />
              <h4 className="text-sm font-medium text-indigo-900">Volume-based Cost</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Ruler className="h-4 w-4 text-indigo-400" />
                  <span>Volume:</span>
                  <span className="font-medium">
                    {calculation.details.volume?.toFixed(3)} m³
                  </span>
                </div>
                <span className="font-medium">
                  €{calculation.details.volumeBasedCost?.toFixed(2)}
                </span>
              </div>
              {calculation.details.appliedMethod && (
                <p className="text-xs text-indigo-600 italic">
                  * {calculation.details.appliedMethod === 'volume' 
                      ? 'Volume-based pricing applied (higher than weight-based)'
                      : 'Weight-based pricing applied (higher than volume-based)'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Advance Payment */}
        {calculation.advanceAmountEUR > 0 && (
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              <h4 className="text-sm font-medium text-indigo-900">Advance Payment</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-indigo-600 mb-1">EUR</p>
                <p className="text-lg font-medium text-indigo-900">
                  €{calculation.advanceAmountEUR.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-indigo-600 mb-1">XOF</p>
                <p className="text-lg font-medium text-indigo-900">
                  {calculation.advanceAmountXOF.toLocaleString()} CFA
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Remaining Amount */}
        <div className={clsx(
          "rounded-lg p-4",
          calculation.advanceAmountEUR > 0 ? "bg-green-50" : "bg-indigo-50"
        )}>
          <h4 className="text-lg font-medium text-indigo-900 mb-3">
            {calculation.advanceAmountEUR > 0 ? 'Remaining Amount' : 'Total Amount'}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-indigo-600 mb-1">EUR</p>
              <p className="text-2xl font-bold text-indigo-900">
                €{calculation.remainingEUR.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-indigo-600 mb-1">XOF</p>
              <p className="text-2xl font-bold text-indigo-900">
                {calculation.remainingXOF.toLocaleString()} CFA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});