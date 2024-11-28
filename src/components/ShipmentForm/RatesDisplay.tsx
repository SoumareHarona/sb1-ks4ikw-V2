import { memo } from 'react';
import { Info } from 'lucide-react';
import { RATES } from '../../lib/pricing';

interface RatesDisplayProps {
  mode: string;
}

export const RatesDisplay = memo(function RatesDisplay({ mode }: RatesDisplayProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-indigo-100">
      <div className="flex items-center space-x-2 mb-3">
        <Info className="h-4 w-4 text-indigo-600" />
        <h4 className="text-sm font-medium text-indigo-900">Applied Rates</h4>
      </div>

      {mode === 'air' && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-2 bg-indigo-50 rounded">
            <p className="text-xs text-indigo-600 mb-1">Food</p>
            <p className="font-medium text-indigo-900">€{RATES.air.food}/kg</p>
          </div>
          <div className="p-2 bg-indigo-50 rounded">
            <p className="text-xs text-indigo-600 mb-1">Non-Food</p>
            <p className="font-medium text-indigo-900">€{RATES.air.nonFood}/kg</p>
          </div>
          <div className="p-2 bg-indigo-50 rounded">
            <p className="text-xs text-indigo-600 mb-1">HN7</p>
            <p className="font-medium text-indigo-900">€{RATES.air.hn7}/kg</p>
          </div>
        </div>
      )}

      {mode === 'sea' && (
        <div className="space-y-3">
          <div className="p-2 bg-indigo-50 rounded">
            <p className="text-xs text-indigo-600 mb-1">Volume Rate</p>
            <p className="font-medium text-indigo-900">€{RATES.sea.volumeRate}/m³</p>
          </div>
          <p className="text-xs text-indigo-600">
            Minimum volume: {RATES.sea.minVolume}m³
          </p>
        </div>
      )}

      {mode === 'gp' && (
        <div className="p-2 bg-indigo-50 rounded">
          <p className="text-xs text-indigo-600 mb-1">Base Rate</p>
          <p className="font-medium text-indigo-900">€{RATES.gp.base}</p>
        </div>
      )}
    </div>
  );
});