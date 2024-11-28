import { memo, useMemo } from 'react';
import { Calculator } from 'lucide-react';
import { calculatePrice, RATES, EUR_TO_XOF } from '../../lib/pricing';
import type { FormData } from './types';
import type { FreightMode } from '../../types';

interface PriceDetailsProps {
  form: FormData;
  mode: FreightMode;
}

export const PriceDetails = memo(function PriceDetails({ form, mode }: PriceDetailsProps) {
  const priceCalculation = useMemo(() => {
    const weights = {
      food: parseFloat(form.foodWeight) || 0,
      nonFood: parseFloat(form.nonFoodWeight) || 0,
      hn7: parseFloat(form.hn7Weight) || 0
    };

    const dimensions = mode === 'sea' ? {
      length: parseFloat(form.length) || 0,
      width: parseFloat(form.width) || 0,
      height: parseFloat(form.height) || 0
    } : undefined;

    return calculatePrice(mode, weights, dimensions);
  }, [form, mode]);

  // Additional fees calculation
  const additionalFees = parseFloat(form.additionalFeesAmount) || 0;
  const additionalFeesEUR = form.additionalFeesCurrency === 'EUR' 
    ? additionalFees 
    : additionalFees / EUR_TO_XOF;

  // Calculate totals
  const totalEUR = priceCalculation.baseAmountEUR + additionalFeesEUR;
  const totalXOF = Math.round(totalEUR * EUR_TO_XOF);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100">
      <div className="flex items-center space-x-2 mb-4">
        <Calculator className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-medium text-indigo-900">Price Details</h3>
      </div>

      {/* Rates Information */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <h4 className="text-sm font-medium text-indigo-900 mb-2">Applied Rates:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          {mode === 'air' ? (
            <>
              <div className="text-indigo-600">Food: €{RATES.air.food}/kg</div>
              <div className="text-indigo-600">Non-Food: €{RATES.air.nonFood}/kg</div>
              <div className="text-indigo-600">HN7: €{RATES.air.hn7}/kg</div>
            </>
          ) : mode === 'sea' ? (
            <>
              <div className="text-indigo-600">Volume: €{RATES.sea.volumeRate}/m³</div>
              <div className="text-indigo-600">Min. Volume: {RATES.sea.minVolume}m³</div>
              <div className="text-indigo-600">Note: Higher of volume or weight cost applies</div>
            </>
          ) : (
            <div className="text-indigo-600">Base Rate: €{RATES.gp.base}</div>
          )}
        </div>
      </div>

      {/* Cost Breakdown */}
      {mode !== 'gp' && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-indigo-900 mb-2">Cost Breakdown:</h4>
          <div className="space-y-2 text-sm">
            {priceCalculation.details.foodCost > 0 && (
              <div className="flex justify-between">
                <span>Food ({form.foodWeight} kg × €{mode === 'air' ? RATES.air.food : RATES.sea.food})</span>
                <span className="font-medium">€{priceCalculation.details.foodCost.toFixed(2)}</span>
              </div>
            )}
            {priceCalculation.details.nonFoodCost > 0 && (
              <div className="flex justify-between">
                <span>Non-Food ({form.nonFoodWeight} kg × €{mode === 'air' ? RATES.air.nonFood : RATES.sea.nonFood})</span>
                <span className="font-medium">€{priceCalculation.details.nonFoodCost.toFixed(2)}</span>
              </div>
            )}
            {priceCalculation.details.hn7Cost > 0 && (
              <div className="flex justify-between">
                <span>HN7 ({form.hn7Weight} kg × €{mode === 'air' ? RATES.air.hn7 : RATES.sea.hn7})</span>
                <span className="font-medium">€{priceCalculation.details.hn7Cost.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Volume Calculation (Sea Freight) */}
      {mode === 'sea' && priceCalculation.details.volume > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-indigo-900 mb-2">Volume Calculation:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Dimensions</span>
              <span>{form.length}×{form.width}×{form.height} cm</span>
            </div>
            <div className="flex justify-between">
              <span>Volume ({priceCalculation.details.volume.toFixed(2)} m³ × €{RATES.sea.volumeRate})</span>
              <span className="font-medium">€{priceCalculation.details.volumeBasedCost?.toFixed(2)}</span>
            </div>
            {priceCalculation.details.appliedMethod === 'volume' && (
              <div className="text-xs text-indigo-600 mt-1">
                Volume-based cost applied (higher than weight-based)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Fees */}
      {additionalFees > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-indigo-900 mb-2">Additional Fees:</h4>
          <div className="flex justify-between text-sm">
            <span>Extra Charges</span>
            <span className="font-medium">
              {form.additionalFeesCurrency === 'EUR' 
                ? `€${additionalFees.toFixed(2)}` 
                : `${additionalFees.toLocaleString()} XOF`}
            </span>
          </div>
        </div>
      )}

      {/* Total Amount */}
      <div className="p-4 bg-indigo-50 rounded-lg">
        <h4 className="text-sm font-medium text-indigo-900 mb-3">Total Amount:</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-indigo-600 mb-1">EUR</p>
            <p className="text-2xl font-bold text-indigo-900">€{totalEUR.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-600 mb-1">XOF</p>
            <p className="text-2xl font-bold text-indigo-900">{totalXOF.toLocaleString()} CFA</p>
          </div>
        </div>
      </div>
    </div>
  );
});