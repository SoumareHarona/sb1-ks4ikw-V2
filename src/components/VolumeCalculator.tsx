import { memo } from 'react';
import type { FormData } from './types';

interface VolumeCalculatorProps {
  mode: string;
  form: {
    length: string;
    width: string;
    height: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const VolumeCalculator = memo(function VolumeCalculator({ form, onChange, mode }: VolumeCalculatorProps) {
  if (mode !== 'sea') return null;

  const volume = (parseFloat(form.length) || 0) * 
                (parseFloat(form.width) || 0) * 
                (parseFloat(form.height) || 0) / 1000000; // Convert to cubic meters

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-white p-6 rounded-xl border border-cyan-100">
      <h3 className="text-lg font-medium text-cyan-900 mb-4">
        Volume Calculation
        {volume > 0 && (
          <span className="ml-2 text-sm text-cyan-600">
            (Total: {volume.toFixed(2)} m³)
          </span>
        )}
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="length" className="block text-sm font-medium text-cyan-800 mb-2">
            Length (cm)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            name="length"
            id="length"
            value={form.length}
            onChange={onChange}
            className="block w-full rounded-lg border-cyan-200 bg-white shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="width" className="block text-sm font-medium text-cyan-800 mb-2">
            Width (cm)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            name="width"
            id="width"
            value={form.width}
            onChange={onChange}
            className="block w-full rounded-lg border-cyan-200 bg-white shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-cyan-800 mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            name="height"
            id="height"
            value={form.height}
            onChange={onChange}
            className="block w-full rounded-lg border-cyan-200 bg-white shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
});