import React from 'react'
import { useTranslation } from 'react-i18next'
import connector from './NotFound.connector'
import './NotFound.scss'

function NotFound ({ goBack, className }) {
  const { t } = useTranslation()

  return (
    <div styleName='container' className={className}>
      <h3>{t('Oops, there\'s nothing to see here.')}</h3>
      <a styleName='go-back' onClick={goBack}>{t('Go back')}</a>
      <div styleName='axolotl' />
      <span styleName='footer'>{t('404 Not Found')}</span>
    </div>
  )
}

export default connector(NotFound)
