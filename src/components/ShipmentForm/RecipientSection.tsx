import { memo } from 'react';
import { User, MapPin, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { FormData } from './types';

interface RecipientSectionProps {
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: Record<string, string>;
}

export const RecipientSection = memo(function RecipientSection({ form, onChange, errors }: RecipientSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
      <div className="flex items-center space-x-2 mb-6">
        <User className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-medium text-purple-900">{t('shipment.recipientInfo')}</h3>
      </div>

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
              className={`block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${
                errors.recipientName ? 'border-red-300' : ''
              }`}
            />
            {errors.recipientName && (
              <p className="mt-1 text-sm text-red-600">{errors.recipientName}</p>
            )}
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
              className={`block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${
                errors.recipientPhone ? 'border-red-300' : ''
              }`}
            />
            {errors.recipientPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.recipientPhone}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="recipientEmail" className="block text-sm font-medium text-purple-800 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="recipientEmail"
            id="recipientEmail"
            value={form.recipientEmail}
            onChange={onChange}
            className={`block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${
              errors.recipientEmail ? 'border-red-300' : ''
            }`}
          />
          {errors.recipientEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.recipientEmail}</p>
          )}
          <p className="mt-1 text-sm text-purple-600">
            Used for delivery notifications (optional)
          </p>
        </div>

        {/* Shipping Address */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-purple-600" />
            <h4 className="text-sm font-medium text-purple-900">Shipping Address</h4>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="recipientStreet" className="block text-sm font-medium text-purple-800 mb-2">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="recipientStreet"
                id="recipientStreet"
                value={form.recipientStreet}
                onChange={onChange}
                required
                className={`block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${
                  errors.recipientStreet ? 'border-red-300' : ''
                }`}
              />
              {errors.recipientStreet && (
                <p className="mt-1 text-sm text-red-600">{errors.recipientStreet}</p>
              )}
            </div>

            <div>
              <label htmlFor="recipientCity" className="block text-sm font-medium text-purple-800 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="recipientCity"
                id="recipientCity"
                value={form.recipientCity}
                onChange={onChange}
                required
                className={`block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${
                  errors.recipientCity ? 'border-red-300' : ''
                }`}
              />
              {errors.recipientCity && (
                <p className="mt-1 text-sm text-red-600">{errors.recipientCity}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="recipientLandmark" className="block text-sm font-medium text-purple-800 mb-2">
              Landmark / Delivery Instructions
            </label>
            <textarea
              name="recipientLandmark"
              id="recipientLandmark"
              rows={2}
              value={form.recipientLandmark}
              onChange={onChange}
              placeholder="Nearby landmarks, building name, or specific delivery instructions..."
              className="block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label htmlFor="recipientNotes" className="block text-sm font-medium text-purple-800 mb-2">
            Additional Notes
          </label>
          <textarea
            name="recipientNotes"
            id="recipientNotes"
            rows={3}
            value={form.recipientNotes}
            onChange={onChange}
            placeholder="Any additional information about the recipient or delivery..."
            className="block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
          <div className="mt-2 flex items-center text-sm text-purple-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>This information will be used for delivery purposes only</span>
          </div>
        </div>
      </div>
    </div>
  );
});