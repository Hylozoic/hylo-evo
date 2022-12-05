import React from 'react'
import { useTranslation } from 'react-i18next'

import './Privacy.scss'

export default function PrivacyWidget (props) {
  const { t } = useTranslation()

  return (
    <div styleName='privacy-container'>
      {t('PrivacyWidget.groupPrivacySettings')}
    </div>
  )
}
