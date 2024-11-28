import { useState } from 'react';
import { Plane, Ship, Truck, Package2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { FreightMode, Country } from '../types';
import { createFreightNumber } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';

interface FreightNumberFormProps {
  onFreightNumberCreated: (freightNumber: any) => void;
}

const transportModes = [
  { value: 'air', label: 'airFreight', icon: Plane },
  { value: 'sea', label: 'seaFreight', icon: Ship },
  { value: 'gp', label: 'gpTransport', icon: Truck },
];

const countries: Country[] = ['Mali', 'Senegal', 'Gambia', 'France'];

export function FreightNumberForm({ onFreightNumberCreated }: FreightNumberFormProps) {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    mode: 'air' as FreightMode,
    origin: '' as Country,
    destination: '' as Country,
    number: ''
  });

  const getPreviewNumber = () => {
    if (!form.origin || !form.number) return '';
    const prefix = form.origin.substring(0, 2).toUpperCase();
    const paddedNumber = form.number.padStart(4, '0');
    return `${prefix}-FRET-${paddedNumber}`;
  };

  const validateForm = () => {
    if (!form.origin) {
      setError(t('validation.originRequired'));
      return false;
    }
    if (!form.destination) {
      setError(t('validation.destinationRequired'));
      return false;
    }
    if (!form.number) {
      setError(t('validation.numberRequired'));
      return false;
    }
    if (form.origin === form.destination) {
      setError(t('validation.sameCountry'));
      return false;
    }
    if (!/^\d+$/.test(form.number)) {
      setError(t('validation.numberFormat'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const freightNumber = await createFreightNumber({
        mode: form.mode,
        origin: form.origin,
        destination: form.destination,
        number: form.number
      });

      onFreightNumberCreated(freightNumber);
      toast.success('Freight number created successfully');
      
      setForm({
        mode: 'air',
        origin: '',
        destination: '',
        number: ''
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create freight number';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-100">
      <div className="px-6 py-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Package2 className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{t('shipment.create')}</h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100">
            <h3 className="text-lg font-medium text-indigo-900 mb-4">{t('shipment.transportMode')}</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {transportModes.map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={`relative flex cursor-pointer rounded-lg border-2 p-4 focus:outline-none transition-all duration-200 ${
                    form.mode === value
                      ? 'border-indigo-600 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="mode"
                    value={value}
                    checked={form.mode === value}
                    onChange={(e) => setForm(prev => ({ ...prev, mode: e.target.value as FreightMode }))}
                    className="sr-only"
                  />
                  <div className="flex w-full items-center justify-center">
                    <Icon className={`h-6 w-6 ${
                      form.mode === value ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                    <span className={`ml-2 font-medium ${
                      form.mode === value ? 'text-indigo-900' : 'text-gray-600'
                    }`}>
                      {t(`shipment.${label}`)}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

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
                  value={form.origin}
                  onChange={(e) => setForm(prev => ({ ...prev, origin: e.target.value as Country }))}
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
                  value={form.destination}
                  onChange={(e) => setForm(prev => ({ ...prev, destination: e.target.value as Country }))}
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
                    value={form.number}
                    onChange={(e) => setForm(prev => ({ ...prev, number: e.target.value.replace(/\D/g, '') }))}
                    placeholder={t('shipment.placeholder.freightNumber')}
                    maxLength={4}
                    required
                    className="block w-full rounded-lg border-emerald-200 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  />
                  {form.number && form.origin && (
                    <p className="mt-2 text-sm text-emerald-600 font-medium">
                      {t('shipment.preview')}: <span className="text-emerald-700">{getPreviewNumber()}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              {submitting ? 'Creating...' : t('shipment.createButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}