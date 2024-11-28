import { CreditCard, Check, Clock } from 'lucide-react';
import clsx from 'clsx';

interface PaymentStatusProps {
  status: 'pending' | 'completed';
  baseAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  currency?: 'EUR' | 'XOF';
  showRemainingOnly?: boolean;
}

export function PaymentStatus({ 
  status, 
  baseAmount, 
  advanceAmount, 
  remainingAmount,
  currency = 'EUR',
  showRemainingOnly = false
}: PaymentStatusProps) {
  const formatAmount = (amount: number) => {
    if (currency === 'XOF') {
      return Math.round(amount).toLocaleString();
    }
    return amount.toFixed(2);
  };

  const formatCurrency = (amount: string) => {
    return currency === 'EUR' ? `€${amount}` : `${amount} XOF`;
  };

  const isPaid = remainingAmount <= 0;
  const hasAdvance = advanceAmount > 0;

  if (showRemainingOnly) {
    if (isPaid) {
      return (
        <div className="flex items-center text-green-600 text-sm font-medium">
          <Check className="h-4 w-4 mr-1" />
          <span>Paid</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-red-500" />
        <div className="text-sm font-medium text-red-600">
          {formatCurrency(formatAmount(remainingAmount))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isPaid ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <CreditCard className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-900">Total</span>
        </div>
        <span className="text-sm font-medium text-gray-900">
          {formatCurrency(formatAmount(baseAmount))}
        </span>
      </div>

      {hasAdvance && (
        <>
          <div className="flex items-center justify-between pl-6">
            <span className="text-sm text-green-600">Advance</span>
            <span className="text-sm font-medium text-green-600">
              {formatCurrency(formatAmount(advanceAmount))}
            </span>
          </div>
          {!isPaid && (
            <div className="flex items-center justify-between pl-6">
              <span className="text-sm text-red-600">Remaining</span>
              <span className="text-sm font-medium text-red-600">
                {formatCurrency(formatAmount(remainingAmount))}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}