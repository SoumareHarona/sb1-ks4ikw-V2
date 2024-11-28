import { memo } from 'react';

interface PriceBreakdownItem {
  label: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

interface PriceBreakdownProps {
  items: PriceBreakdownItem[];
}

export const PriceBreakdown = memo(function PriceBreakdown({ items }: PriceBreakdownProps) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between text-sm">
          <span className="text-gray-600">
            {item.label} ({item.quantity} {item.unit} × €{item.rate})
          </span>
          <span className="font-medium text-indigo-900">
            €{item.amount.toFixed(2)}
          </span>
        </div>
      ))}
      
      {items.length > 1 && (
        <div className="flex justify-between text-sm pt-2 border-t border-indigo-100">
          <span className="font-medium text-indigo-900">Total</span>
          <span className="font-medium text-indigo-900">
            €{total.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
});