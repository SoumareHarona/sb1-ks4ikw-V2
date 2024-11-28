import { memo } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RemarksSectionProps {
  form: {
    comments: string;
  };
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const RemarksSection = memo(function RemarksSection({ form, onChange }: RemarksSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-violet-50 to-white p-6 rounded-xl border border-violet-100">
      <div className="flex items-center space-x-2 mb-4">
        <MessageSquare className="h-5 w-5 text-violet-600" />
        <h3 className="text-lg font-medium text-violet-900">Remarks</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-violet-800 mb-2">
            Additional Notes
          </label>
          <textarea
            id="comments"
            name="comments"
            rows={4}
            value={form.comments}
            onChange={onChange}
            placeholder="Enter any special instructions, handling requirements, or additional notes..."
            className="block w-full rounded-lg border-violet-200 bg-white shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm resize-none"
          />
        </div>

        <div className="flex items-start space-x-2 p-3 bg-violet-50 rounded-lg">
          <AlertCircle className="h-5 w-5 text-violet-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm text-violet-700 font-medium">
              Important Information
            </p>
            <ul className="text-sm text-violet-600 list-disc list-inside space-y-1">
              <li>These remarks will be visible on shipping documents</li>
              <li>Include any specific delivery instructions</li>
              <li>Note any fragile or special handling requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});