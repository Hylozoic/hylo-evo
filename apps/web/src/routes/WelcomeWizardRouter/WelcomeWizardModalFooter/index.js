import React from 'react'
import { useTranslation } from 'react-i18next'
import '../WelcomeWizard.scss'

export default function WelcomeWizardModalFooter ({ previous, submit, continueText, showPrevious = true }) {
  const { t } = useTranslation()
  return <div>
    <div styleName='modal-footer'>
      <div styleName='footer-buttons'>
        {showPrevious && <span styleName='previous-button' onClick={previous}>{t('Back')}</span>}
        <span id='continue-button' styleName='continue-button' onClick={submit}>{continueText}</span>
      </div>
    </div>
  </div>
}
