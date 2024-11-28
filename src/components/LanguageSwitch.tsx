import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../types';

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 text-gray-300 hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    >
      <Globe className="h-4 w-4" />
      <span>{language === 'fr' ? 'EN' : 'FR'}</span>
    </button>
  );
}