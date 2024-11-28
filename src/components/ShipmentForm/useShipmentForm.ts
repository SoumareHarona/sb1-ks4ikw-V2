import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createClient } from '../../lib/api';
import type { FormData } from './types';
import { validateForm } from './validation';
import type { FreightNumber } from '../../types';

const initialForm: FormData = {
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
};

interface UseShipmentFormProps {
  freightNumber: FreightNumber;
  onSuccess: () => void;
}

export function useShipmentForm({ freightNumber, onSuccess }: UseShipmentFormProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [qrCodeData, setQrCodeData] = useState<{ qrCode: string; trackingNumber: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle special case for multiple select
    if (type === 'select-multiple') {
      const select = e.target as HTMLSelectElement;
      const values = Array.from(select.selectedOptions).map(option => option.value);
      setForm(prev => ({ ...prev, [name]: values }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const parseFormData = () => ({
    freightNumberId: freightNumber.id,
    ...form,
    foodWeight: form.foodWeight ? parseFloat(form.foodWeight) : undefined,
    nonFoodWeight: form.nonFoodWeight ? parseFloat(form.nonFoodWeight) : undefined,
    hn7Weight: form.hn7Weight ? parseFloat(form.hn7Weight) : undefined,
    length: form.length ? parseFloat(form.length) : undefined,
    width: form.width ? parseFloat(form.width) : undefined,
    height: form.height ? parseFloat(form.height) : undefined,
    additionalFeesAmount: form.additionalFeesAmount ? parseFloat(form.additionalFeesAmount) : undefined,
    advanceAmount: form.advanceAmount ? parseFloat(form.advanceAmount) : undefined,
    specialHandling: Array.isArray(form.specialHandling) ? form.specialHandling : []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setSubmitting(true);
    try {
      const formData = parseFormData();
      const response = await createClient(formData);

      setQrCodeData({
        qrCode: response.qrCode,
        trackingNumber: response.trackingNumber
      });

      toast.success('Shipment created successfully');
      onSuccess();
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create shipment';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    errors,
    submitting,
    qrCodeData,
    handleChange,
    handleSubmit,
    setQrCodeData
  };
}