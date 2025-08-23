
import React from 'react';
import { Language } from '../types.ts';

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: Language;
  onSelectLanguage: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguage,
  onSelectLanguage,
}) => {
  return (
    <div className="bg-gray-100/80 rounded-full p-1 backdrop-blur-sm">
      <div className="flex items-center space-x-1">
        {languages.map((lang) => {
          const isSelected = selectedLanguage === lang;
          return (
            <button
              key={lang}
              onClick={() => onSelectLanguage(lang)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#3B74B8] ${
                !isSelected && 'text-slate-600 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: isSelected ? '#3B74B8' : 'transparent',
                color: isSelected ? 'white' : undefined,
              }}
            >
              {lang}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelector;