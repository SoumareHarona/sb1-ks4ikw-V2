import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export function EmptyState() {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <p className="text-gray-500 text-center">
        {t('shipment.selectFreightNumber')}
      </p>
    </div>
  );
}