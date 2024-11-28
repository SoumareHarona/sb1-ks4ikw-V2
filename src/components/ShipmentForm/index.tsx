import { useState } from 'react';
import { User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { WeightCalculator } from './WeightCalculator';
import { VolumeCalculator } from './VolumeCalculator';
import { PriceCalculator } from './PriceCalculator';
import { AdvancePaymentSection } from './AdvancePaymentSection';
import { QRCodeModal } from '../QRCodeModal';
import type { FreightNumber } from '../../types';
import { createClient } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { validateForm } from './validation';

interface ShipmentFormProps {
  freightNumber: FreightNumber;
  onSuccess: () => void;
}

export function ShipmentForm({ freightNumber, onSuccess }: ShipmentFormProps) {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{ qrCode: string; trackingNumber: string } | null>(null);
  const [form, setForm] = useState({
    senderName: '',
    senderPhone: '',
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
    recipientStreet: '',
    recipientCity: '',
    recipientLandmark: '',
    recipientNotes: '',
    foodWeight: '',
    nonFoodWeight: '',
    hn7Weight: '',
    length: '',
    width: '',
    height: '',
    packageType: '',
    packaging: '',
    specialHandling: [] as string[],
    comments: '',
    additionalFeesAmount: '',
    additionalFeesCurrency: 'EUR' as 'EUR' | 'XOF',
    advanceAmount: '',
    advanceCurrency: 'EUR' as 'EUR' | 'XOF'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'select-multiple') {
      const select = e.target as HTMLSelectElement;
      const values = Array.from(select.selectedOptions).map(option => option.value);
      setForm(prev => ({ ...prev, [name]: values }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(form);
    
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors).join('\n');
      toast.error(errorMessages);
      return;
    }

    setSubmitting(true);

    try {
      const response = await createClient({
        freightNumberId: freightNumber.id,
        ...form,
        foodWeight: form.foodWeight ? parseFloat(form.foodWeight) : undefined,
        nonFoodWeight: form.nonFoodWeight ? parseFloat(form.nonFoodWeight) : undefined,
        hn7Weight: form.hn7Weight ? parseFloat(form.hn7Weight) : undefined,
        length: form.length ? parseFloat(form.length) : undefined,
        width: form.width ? parseFloat(form.width) : undefined,
        height: form.height ? parseFloat(form.height) : undefined,
        additionalFeesAmount: form.additionalFeesAmount ? parseFloat(form.additionalFeesAmount) : undefined,
        advanceAmount: form.advanceAmount ? parseFloat(form.advanceAmount) : undefined
      });

      if (response.qrCode && response.trackingNumber) {
        setQrCodeData({
          qrCode: response.qrCode,
          trackingNumber: response.trackingNumber
        });
      }

      toast.success('Expédition créée avec succès');
      onSuccess();
      
      // Reset form
      setForm({
        senderName: '',
        senderPhone: '',
        recipientName: '',
        recipientPhone: '',
        recipientEmail: '',
        recipientStreet: '',
        recipientCity: '',
        recipientLandmark: '',
        recipientNotes: '',
        foodWeight: '',
        nonFoodWeight: '',
        hn7Weight: '',
        length: '',
        width: '',
        height: '',
        packageType: '',
        packaging: '',
        specialHandling: [],
        comments: '',
        additionalFeesAmount: '',
        additionalFeesCurrency: 'EUR',
        advanceAmount: '',
        advanceCurrency: 'EUR'
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'expédition:', error);
      toast.error(error instanceof Error ? error.message : 'Échec de la création de l\'expédition');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-100">
      <div className="px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sender Information */}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-blue-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
            <h3 className="text-lg font-medium text-purple-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-purple-600" />
              {t('shipment.recipientInfo')}
            </h3>
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-purple-200 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <WeightCalculator
            mode={freightNumber.mode}
            form={form}
            onChange={handleChange}
          />

          <VolumeCalculator
            mode={freightNumber.mode}
            form={form}
            onChange={handleChange}
          />

          <AdvancePaymentSection
            form={form}
            onChange={handleChange}
          />

          <PriceCalculator
            mode={freightNumber.mode}
            weights={{
              food: parseFloat(form.foodWeight) || 0,
              nonFood: parseFloat(form.nonFoodWeight) || 0,
              hn7: parseFloat(form.hn7Weight) || 0
            }}
            volume={freightNumber.mode === 'sea' ? {
              length: parseFloat(form.length) || 0,
              width: parseFloat(form.width) || 0,
              height: parseFloat(form.height) || 0
            } : undefined}
            advancePayment={{
              amount: form.advanceAmount,
              currency: form.advanceCurrency
            }}
          />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              {submitting ? 'Création...' : t('shipment.createButton')}
            </button>
          </div>
        </form>
      </div>

      {qrCodeData && (
        <QRCodeModal
          qrCode={qrCodeData.qrCode}
          trackingNumber={qrCodeData.trackingNumber}
          onClose={() => setQrCodeData(null)}
        />
      )}
    </div>
  );
}