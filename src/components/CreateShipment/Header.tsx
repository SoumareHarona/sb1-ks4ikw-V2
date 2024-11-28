import React from 'react';
import { Package2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function Header() {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center space-x-2 mb-6">
      <Package2 className="h-6 w-6 text-indigo-600" />
      <h2 className="text-xl font-semibold text-gray-900">{t('shipment.create')}</h2>
    </div>
  );
}