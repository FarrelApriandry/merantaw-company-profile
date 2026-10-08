import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center gap-1.5 p-1 rounded-full border border-slate-200/80 bg-white/70 backdrop-blur-md shadow-xs ${className}`}
    >
      <div className="pl-1.5 pr-0.5 text-slate-400">
        <Globe size={13} className="text-slate-500" />
      </div>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2.5 py-0.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
          lang === 'en'
            ? 'bg-[#192C56] text-white shadow-xs'
            : 'text-slate-600 hover:text-[#192C56] hover:bg-slate-100/70'
        }`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('id')}
        className={`px-2.5 py-0.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
          lang === 'id'
            ? 'bg-[#192C56] text-white shadow-xs'
            : 'text-slate-600 hover:text-[#192C56] hover:bg-slate-100/70'
        }`}
        aria-pressed={lang === 'id'}
      >
        ID
      </button>
    </div>
  );
};
