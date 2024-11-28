import { memo } from 'react';
import { User, Package } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RecipientSectionProps {
  form: {
    recipientName: string;
    recipientPhone: string;
    recipientEmail: string;
    recipientStreet: string;
    recipientCity: string;
    recipientLandmark: string;
    recipientNotes: string;
    packaging: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const RecipientSection = memo(function RecipientSection({ form, onChange }: RecipientSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
      <h3 className="text-lg font-medium text-purple-900 mb-4 flex items-center">
        <User className="h-5 w-5 mr-2 text-purple-600" />
        {t('shipment.recipientInfo')}
      </h3>
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="recipientName" className="block text-sm font-medium text-purple-800 mb-2">
              {t('shipment.fullName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="recipientName"
              id="recipientName"
              value={form.recipientName}
              onChange={onChange}
              required
              className="block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="recipientPhone" className="block text-sm font-medium text-purple-800 mb-2">
              {t('shipment.phoneNumber')} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="recipientPhone"
              id="recipientPhone"
              value={form.recipientPhone}
              onChange={onChange}
              required
              className="block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Packaging Information */}
        <div>
          <label htmlFor="packaging" className="block text-sm font-medium text-purple-800 mb-2">
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-1 text-purple-600" />
              Description du colis <span className="text-red-500">*</span>
            </div>
          </label>
          <input
            type="text"
            name="packaging"
            id="packaging"
            value={form.packaging}
            onChange={onChange}
            required
            placeholder="ex: CD3, D49, un sac tounka"
            className="block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
          <p className="mt-1 text-sm text-purple-600">
            Précisez le type et la quantité de colis
          </p>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="recipientEmail" className="block text-sm font-medium text-purple-800 mb-2">
            Email
          </label>
          <input
            type="email"
            name="recipientEmail"
            id="recipientEmail"
            value={form.recipientEmail}
            onChange={onChange}
            className="block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
        </div>

        {/* Address Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="recipientStreet" className="block text-sm font-medium text-purple-800 mb-2">
              Adresse
            </label>
            <input
              type="text"
              name="recipientStreet"
              id="recipientStreet"
              value={form.recipientStreet}
              onChange={onChange}
              className="block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="recipientCity" className="block text-sm font-medium text-purple-800 mb-2">
              Ville
            </label>
            <input
              type="text"
              name="recipientCity"
              id="recipientCity"
              value={form.recipientCity}
              onChange={onChange}
              className="block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <label htmlFor="recipientLandmark" className="block text-sm font-medium text-purple-800 mb-2">
            Point de repère
          </label>
          <input
            type="text"
            name="recipientLandmark"
            id="recipientLandmark"
            value={form.recipientLandmark}
            onChange={onChange}
            className="block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="recipientNotes" className="block text-sm font-medium text-purple-800 mb-2">
            Notes supplémentaires
          </label>
          <textarea
            name="recipientNotes"
            id="recipientNotes"
            rows={3}
            value={form.recipientNotes}
            onChange={onChange}
            className="block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
});