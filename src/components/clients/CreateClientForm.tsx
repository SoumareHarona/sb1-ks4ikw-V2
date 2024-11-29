import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createClient } from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';

interface CreateClientFormProps {
  onSuccess: () => void;
}

export function CreateClientForm({ onSuccess }: CreateClientFormProps) {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error(t('clients.error.nameRequired'));
      return;
    }

    setSubmitting(true);

    try {
      await createClient({
        name: form.name.trim(),
        phone: form.phone.trim(),
        location: form.location.trim() || undefined
      });

      toast.success(t('clients.success'));
      onSuccess();
      
      // Reset form
      setForm({
        name: '',
        phone: '',
        location: ''
      });
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error(t('clients.error.createFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
      <h3 className="text-lg font-medium text-blue-900 mb-4">{t('clients.createClient')}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-blue-800 mb-1">
            {t('clients.fullName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="block w-full rounded-lg border-blue-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-blue-800 mb-1">
            {t('clients.phoneNumber')} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="block w-full rounded-lg border-blue-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-blue-800 mb-1">
            {t('clients.location')} <span className="text-gray-400 text-xs">({t('clients.optional')})</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="block w-full rounded-lg border-blue-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? t('common.loading') : t('clients.createButton')}
          </button>
        </div>
      </form>
    </div>
  );
}
