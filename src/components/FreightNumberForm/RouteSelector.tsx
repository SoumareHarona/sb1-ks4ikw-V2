import { useLanguage } from '../../contexts/LanguageContext';
import type { Country } from '../../types';

const countries: Country[] = ['Mali', 'Senegal', 'Gambia', 'France'];

interface RouteSelectorProps {
  origin: Country;
  destination: Country;
  number: string;
  onOriginChange: (origin: Country) => void;
  onDestinationChange: (destination: Country) => void;
  onNumberChange: (number: string) => void;
}

export function RouteSelector({
  origin,
  destination,
  number,
  onOriginChange,
  onDestinationChange,
  onNumberChange,
}: RouteSelectorProps) {
  const { t } = useLanguage();

  const getPreviewNumber = () => {
    if (!origin || !number) return '';
    const prefix = origin.substring(0, 2).toUpperCase();
    const paddedNumber = number.padStart(4, '0');
    return `${prefix}-FRET-${paddedNumber}`;
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-100">
      <h3 className="text-lg font-medium text-emerald-900 mb-4">{t('shipment.routeInfo')}</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-emerald-800 mb-2">
            {t('shipment.origin')}
          </label>
          <select
            id="origin"
            name="origin"
            value={origin}
            onChange={(e) => onOriginChange(e.target.value as Country)}
            required
            className="block w-full rounded-lg border-emerald-200 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          >
            <option value="">{t('shipment.placeholder.origin')}</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-emerald-800 mb-2">
            {t('shipment.destination')}
          </label>
          <select
            id="destination"
            name="destination"
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value as Country)}
            required
            className="block w-full rounded-lg border-emerald-200 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          >
            <option value="">{t('shipment.placeholder.destination')}</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="number" className="block text-sm font-medium text-emerald-800 mb-2">
            {t('shipment.freightNumber')}
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="number"
              name="number"
              value={number}
              onChange={(e) => onNumberChange(e.target.value.replace(/\D/g, ''))}
              placeholder={t('shipment.placeholder.freightNumber')}
              maxLength={4}
              required
              className="block w-full rounded-lg border-emerald-200 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
            {number && origin && (
              <p className="mt-2 text-sm text-emerald-600 font-medium">
                {t('shipment.preview')}: <span className="text-emerald-700">{getPreviewNumber()}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}