import React from 'react'
import '../Signup.scss'

export default function SignupModalFooter ({previous, submit, continueText, showPrevious = true}) {
  return <div styleName='signup-modal-footer'>
    <div styleName='footer-buttons'>
      {showPrevious && <span styleName='previous-button' onClick={previous}>Previous</span>}
      <span styleName='continue-button' onClick={submit}>{continueText}</span>
    </div>
    <div styleName='press-enter'>or press Enter</div>
  </div>
}
