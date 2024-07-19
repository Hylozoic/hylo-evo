import React from 'react'

import { useTranslation } from 'react-i18next'
import './Moderators.scss'

export default function ModeratorsWidget (props) {
  const { t } = useTranslation()

  return (
    <div styleName='moderators-container'>
      {t('The moderators go here')}
    </div>
  )
}
