import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { WeightCalculator } from './WeightCalculator';
import { VolumeCalculator } from './VolumeCalculator';
import { PriceCalculator } from './PriceCalculator';
import { SenderSection } from './SenderSection';
import { RecipientSection } from './RecipientSection';
import { AdvancePaymentSection } from './AdvancePaymentSection';
import { QRCodeModal } from './QRCodeModal';
import type { FreightNumber } from '../types';
import { createClient } from '../lib/api';
import { toast } from 'react-hot-toast';

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
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.senderName.trim()) {
      toast.error('Le nom de l\'expéditeur est requis');
      return false;
    }
    if (!form.senderPhone.trim()) {
      toast.error('Le téléphone de l\'expéditeur est requis');
      return false;
    }
    if (!form.recipientName.trim()) {
      toast.error('Le nom du destinataire est requis');
      return false;
    }
    if (!form.recipientPhone.trim()) {
      toast.error('Le téléphone du destinataire est requis');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
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
      console.error('Error creating shipment:', error);
      toast.error(error instanceof Error ? error.message : 'Échec de la création de l\'expédition');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-100">
      <div className="px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <SenderSection
            form={form}
            onChange={handleChange}
          />

          <RecipientSection
            form={form}
            onChange={handleChange}
          />

          <WeightCalculator
            mode={freightNumber.mode}
            weights={{
              food: parseFloat(form.foodWeight) || 0,
              nonFood: parseFloat(form.nonFoodWeight) || 0,
              hn7: parseFloat(form.hn7Weight) || 0
            }}
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