import React from 'react'

import { useTranslation } from 'react-i18next'
import './StewardsWidget.scss'

export default function StewardsWidget (props) {
  const { t } = useTranslation()

  return (
    <div styleName='container'>
      {t('The stewards go here')}
    </div>
  )
}
