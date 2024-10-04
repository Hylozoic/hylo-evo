import React from 'react'
import { useTranslation } from 'react-i18next'
import classes from './ModalFooter.module.scss'

export default function ModalFooter ({ previous, submit, continueText, showPrevious = true }) {
  const { t } = useTranslation()

  return <div>
    <div className={classes.signupModalFooter}>
      <div className={classes.footerButtons}>
        {showPrevious && <span className={classes.previousButton} onClick={previous}>{t('Previous')}</span>}
        <span className={classes.continueButton} onClick={submit}>{continueText}</span>
      </div>
    </div>
    <div className={classes.pressEnter}>{t('or press Enter')}</div>
  </div>
}
