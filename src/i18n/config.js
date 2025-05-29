// src/i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // Optional: for detecting browser language

// Import translation files
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector) // Optional: remove if you don't want browser language detection
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true, // Set to false in production
    fallbackLng: 'en', // Fallback language if selected language or detected language is not available
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: enTranslations,
      },
      fr: {
        translation: frTranslations,
      },
    },
    // Optional: Set order for language detection if LanguageDetector is used
    // detection: {
    //   order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    //   caches: ['localStorage'], // Cache the language in localStorage
    // },
  });

export default i18n;
