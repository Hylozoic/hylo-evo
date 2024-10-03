import React from 'react'
import { useTranslation } from 'react-i18next'

import classes from './Privacy.module.scss'

export default function PrivacyWidget (props) {
  const { t } = useTranslation()

  return (
    <div className={classes.privacyContainer}>
      {t('group privacy settings')}
    </div>
  )
}
