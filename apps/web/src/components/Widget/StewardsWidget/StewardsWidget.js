import React from 'react'

import { useTranslation } from 'react-i18next'
import classes from './StewardsWidget.module.scss'

export default function StewardsWidget (props) {
  const { t } = useTranslation()

  return (
    <div className={classes.container}>
      {t('The stewards go here')}
    </div>
  )
}
