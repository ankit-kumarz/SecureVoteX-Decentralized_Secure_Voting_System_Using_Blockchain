import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2 backdrop-blur-xl bg-white/5 p-2 rounded-lg border border-white/10">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
          i18n.language === 'en'
            ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-blue'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('hi')}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
          i18n.language === 'hi'
            ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-neon-purple'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
};

export default LanguageSwitcher;
