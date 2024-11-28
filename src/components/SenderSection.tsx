import { memo } from 'react';
import { User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SenderSectionProps {
  form: {
    senderName: string;
    senderPhone: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SenderSection = memo(function SenderSection({ form, onChange }: SenderSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
      <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
        <User className="h-5 w-5 mr-2 text-blue-600" />
        {t('shipment.senderInfo')}
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="senderName" className="block text-sm font-medium text-blue-800 mb-2">
            {t('shipment.fullName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="senderName"
            id="senderName"
            value={form.senderName}
            onChange={onChange}
            required
            className="block w-full rounded-lg border-blue-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="senderPhone" className="block text-sm font-medium text-blue-800 mb-2">
            {t('shipment.phoneNumber')} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="senderPhone"
            id="senderPhone"
            value={form.senderPhone}
            onChange={onChange}
            required
            className="block w-full rounded-lg border-blue-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
});