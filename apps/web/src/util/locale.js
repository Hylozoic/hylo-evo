/* eslint-disable no-undef */

// write a function that takes a locale and returns the emoji flag for that locale

export function localeToFlagEmoji (locale = 'en') {
  const code = locale.length > 2 ? locale.split('-')[0] : locale

  switch (code) {
    case 'en':
      return '🇬🇧'
    case 'es':
      return '🇪🇸'
    default:
      return '🇬🇧'
  }
}

export function localeLocalStorageSync (locale) {
  if (locale) localStorage.setItem('hylo-i18n-lng', locale)
  return localStorage.getItem('hylo-i18n-lng') || 'en'
}
