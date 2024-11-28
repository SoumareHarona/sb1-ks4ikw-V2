import { memo } from 'react';
import clsx from 'clsx';

interface TotalAmountProps {
  label: string;
  amountEUR: number;
  amountXOF: number;
  className?: string;
  large?: boolean;
}

export const TotalAmount = memo(function TotalAmount({ 
  label, 
  amountEUR, 
  amountXOF, 
  className,
  large
}: TotalAmountProps) {
  return (
    <div className={clsx('p-4 rounded-lg', className)}>
      <h4 className={clsx(
        'font-medium text-indigo-900 mb-3',
        large ? 'text-base' : 'text-sm'
      )}>
        {label}
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-indigo-600 mb-1">EUR</p>
          <p className={clsx(
            'font-bold text-indigo-900',
            large ? 'text-2xl' : 'text-lg'
          )}>
            €{amountEUR.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-indigo-600 mb-1">XOF</p>
          <p className={clsx(
            'font-bold text-indigo-900',
            large ? 'text-2xl' : 'text-lg'
          )}>
            {amountXOF.toLocaleString()} CFA
          </p>
        </div>
      </div>
    </div>
  );
});