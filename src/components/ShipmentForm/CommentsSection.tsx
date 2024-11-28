import { memo } from 'react';
import { MessageSquare } from 'lucide-react';
import type { FormData } from './types';

interface CommentsSectionProps {
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const CommentsSection = memo(function CommentsSection({ form, onChange }: CommentsSectionProps) {
  return (
    <div className="bg-gradient-to-br from-violet-50 to-white p-6 rounded-xl border border-violet-100">
      <div className="flex items-center space-x-2 mb-4">
        <MessageSquare className="h-5 w-5 text-violet-600" />
        <h3 className="text-lg font-medium text-violet-900">Comments</h3>
      </div>

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
        <p className="mt-2 text-sm text-violet-600">
          These comments will be visible to handlers and recipients
        </p>
      </div>
    </div>
  );
});