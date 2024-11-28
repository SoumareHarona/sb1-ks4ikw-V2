import { memo } from 'react';
import { Calculator } from 'lucide-react';
import { calculatePrice, RATES, EUR_TO_XOF } from '../lib/pricing';
import { PaymentStatus } from './PaymentStatus';
import { useLanguage } from '../contexts/LanguageContext';

// ... rest of the imports and interfaces remain the same ...

export const PriceCalculator = memo(function PriceCalculator({ 
  mode, 
  weights, 
  volume,
  advancePayment 
}: PriceCalculatorProps) {
  const { t } = useLanguage();
  const calculation = calculatePrice(mode, weights, volume, advancePayment);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="h-6 w-6 text-indigo-600" />
        <h3 className="text-lg font-medium text-indigo-900">{t('common.priceCalculation')}</h3>
      </div>

      <div className="space-y-6">
        {/* Payment Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PaymentStatus
            status={calculation.paymentStatus}
            baseAmount={calculation.baseAmountEUR}
            advanceAmount={calculation.advanceAmountEUR}
            remainingAmount={calculation.remainingEUR}
            currency="EUR"
          />
          <PaymentStatus
            status={calculation.paymentStatus}
            baseAmount={calculation.baseAmountXOF}
            advanceAmount={calculation.advanceAmountXOF}
            remainingAmount={calculation.remainingXOF}
            currency="XOF"
          />
        </div>

        {/* Rest of the price calculator components remain the same */}
        {/* ... */}
      </div>
    </div>
  );
});