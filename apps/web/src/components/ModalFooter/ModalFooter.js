import React from 'react'
import { useTranslation } from 'react-i18next'
import './ModalFooter.scss'

export default function ModalFooter ({ previous, submit, continueText, showPrevious = true }) {
  const { t } = useTranslation()

  return <div>
    <div styleName='signup-modal-footer'>
      <div styleName='footer-buttons'>
        {showPrevious && <span styleName='previous-button' onClick={previous}>{t('Previous')}</span>}
        <span styleName='continue-button' onClick={submit}>{continueText}</span>
      </div>
    </div>
    <div styleName='press-enter'>{t('or press Enter')}</div>
  </div>
}
