import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import classes from '../WelcomeWizard.module.scss'

export default function WelcomeWizardModalFooter ({ previous, submit, continueText, showPrevious = true }) {
  const { t } = useTranslation()
  return <div>
    <div className={classes.modalFooter}>
      <div className={classes.footerButtons}>
        {showPrevious && <span className={cx(classes.previousButton)} onClick={previous}>{t('Back')}</span>}
        <span id='continue-button' className={classes.continueButton} onClick={submit}>{continueText}</span>
      </div>
    </div>
  </div>
}
