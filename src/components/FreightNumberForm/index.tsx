import { useState } from 'react';
import { Package2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { FreightMode, Country, FreightNumber } from '../../types';
import { createFreightNumber } from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { TransportModeSelector } from './TransportModeSelector';
import { RouteSelector } from './RouteSelector';

interface FreightNumberFormProps {
  onFreightNumberCreated: (freightNumber: FreightNumber) => void;
}

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

  const validateForm = () => {
    if (!form.origin || !form.destination || !form.number) {
      setError(t('validation.allFieldsRequired'));
      return false;
    }

    if (form.origin === form.destination) {
      setError(t('validation.sameCountry'));
      return false;
    }

    if (!/^\d{1,4}$/.test(form.number)) {
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
      toast.success(t('success.freightNumberCreated'));
      
      setForm({
        mode: 'air',
        origin: '',
        destination: '',
        number: ''
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : t('error.createFreightNumber');
      setError(message);
      toast.error(message);
      console.error('Error creating freight number:', error);
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
          <TransportModeSelector
            mode={form.mode}
            onChange={(mode) => setForm(prev => ({ ...prev, mode }))}
          />

          <RouteSelector
            origin={form.origin}
            destination={form.destination}
            number={form.number}
            onOriginChange={(origin) => setForm(prev => ({ ...prev, origin }))}
            onDestinationChange={(destination) => setForm(prev => ({ ...prev, destination }))}
            onNumberChange={(number) => setForm(prev => ({ ...prev, number }))}
          />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? t('common.creating') : t('shipment.createButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}