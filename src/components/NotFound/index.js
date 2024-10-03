import cx from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import connector from './NotFound.connector'
import classes from './NotFound.module.scss'

function NotFound ({ goBack, className }) {
  const { t } = useTranslation()

  return (
    <div className={cx(classes.container, className)}>
      <h3>{t('Oops, there\'s nothing to see here.')}</h3>
      <a className={classes.goBack} onClick={goBack}>{t('Go back')}</a>
      <div className={classes.axolotl} />
      <span className={classes.footer}>{t('404 Not Found')}</span>
    </div>
  )
}

export default connector(NotFound)
