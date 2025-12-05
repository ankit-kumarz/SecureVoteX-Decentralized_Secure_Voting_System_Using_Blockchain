import React from 'react';
import LanguageSwitcher from './Settings/LanguageSwitcher';
import ThemeToggle from './Settings/ThemeToggle';

const TopHeader = () => {
  return (
    <div className="w-full flex justify-end gap-3 px-6 py-4 absolute top-0 right-0 z-50">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
};

export default TopHeader;
