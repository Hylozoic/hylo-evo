import React from 'react'
import '../WelcomeWizard.scss'

export default function WelcomeWizardModalFooter ({ previous, submit, continueText, showPrevious = true }) {
  return <div>
    <div styleName='modal-footer'>
      <div styleName='footer-buttons'>
        {showPrevious && <span styleName='previous-button' onClick={previous}>Back</span>}
        <span id='continue-button' styleName='continue-button' onClick={submit}>{continueText}</span>
      </div>
    </div>
  </div>
}
