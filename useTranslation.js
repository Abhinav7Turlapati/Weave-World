import { useLanguage } from '../contexts/LanguageContext';
import enTranslations from '../data/translations/en.json';
import hiTranslations from '../data/translations/hi.json';
import zhTranslations from '../data/translations/zh.json';

const translations = {
  en: enTranslations,
  hi: hiTranslations,
  zh: zhTranslations,
};

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return { t, language };
};

