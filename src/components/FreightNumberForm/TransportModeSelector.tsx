import { Plane, Ship, Truck } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { FreightMode } from '../../types';

const transportModes = [
  { value: 'air', label: 'airFreight', icon: Plane },
  { value: 'sea', label: 'seaFreight', icon: Ship },
  { value: 'gp', label: 'gpTransport', icon: Truck },
] as const;

interface TransportModeSelectorProps {
  mode: FreightMode;
  onChange: (mode: FreightMode) => void;
}

export function TransportModeSelector({ mode, onChange }: TransportModeSelectorProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100">
      <h3 className="text-lg font-medium text-indigo-900 mb-4">{t('shipment.transportMode')}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {transportModes.map(({ value, label, icon: Icon }) => (
          <label
            key={value}
            className={`relative flex cursor-pointer rounded-lg border-2 p-4 focus:outline-none transition-all duration-200 ${
              mode === value
                ? 'border-indigo-600 bg-indigo-50 shadow-md'
                : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50'
            }`}
          >
            <input
              type="radio"
              name="mode"
              value={value}
              checked={mode === value}
              onChange={(e) => onChange(e.target.value as FreightMode)}
              className="sr-only"
            />
            <div className="flex w-full items-center justify-center">
              <Icon className={`h-6 w-6 ${
                mode === value ? 'text-indigo-600' : 'text-gray-400'
              }`} />
              <span className={`ml-2 font-medium ${
                mode === value ? 'text-indigo-900' : 'text-gray-600'
              }`}>
                {t(`shipment.${label}`)}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}