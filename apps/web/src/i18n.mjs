import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import Backend from 'i18next-http-backend'
i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // detect user language
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    backend: {
      loadPath: `${process.env.PUBLIC_URL}/locales/{{lng}}.json`
    },
    debug: true,
    detection: {
      caches: ['localStorage'],
      order: ['cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      lookupCookie: 'hylo-i18n-lng',
      lookupLocalStorage: 'hylo-i18n-lng',
      lookupSessionStorage: 'hylo-i18n-lng'
    },
    fallbackLng: 'en',
    keySeparator: false,
    nsSeparator: false,
    supportedLngs: ['en', 'es'],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    defaultNS: false,
    preload: ['en', 'es']
  })

export default i18n
