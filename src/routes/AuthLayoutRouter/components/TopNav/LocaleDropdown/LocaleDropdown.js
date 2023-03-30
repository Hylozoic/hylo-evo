
// react functional component that is a locale dropdown menu with two options: English and Spanish
import React from 'react'
import { localeLocalStorageSync } from 'util/locale'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Dropdown from 'components/Dropdown'
import updateUserSettings from 'store/actions/updateUserSettings'

export default function LocaleDropdown ({ renderToggleChildren, currentUser }) {
  const dispatch = useDispatch()
  const { i18n } = useTranslation()

  const handleLocaleChange = (locale) => {
    i18n.changeLanguage(locale)
    dispatch(updateUserSettings({ settings: { locale } }))
      .then(() => localeLocalStorageSync(locale))
  }

  return (
    <Dropdown
      toggleChildren={renderToggleChildren}
      items={[
        {
          key: 'en',
          label: '🇬🇧 English',
          onClick: () => handleLocaleChange('en')
        },
        {
          key: 'es',
          label: '🇪🇸 Español',
          onClick: () => handleLocaleChange('es')
        }
      ]}
    />
  )
}
