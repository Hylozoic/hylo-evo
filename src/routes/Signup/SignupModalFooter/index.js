import React from 'react'
import '../Signup.scss'

export default function SignupModalFooter ({previous, submit, continueText, showPrevious = true}) {
  return <div>
    <div styleName='signup-modal-footer'>
      <div styleName='footer-buttons'>
        {showPrevious && <span styleName='previous-button' onClick={previous}>Previous</span>}
        <span id='continue-button' styleName='continue-button' onClick={submit}>{continueText}</span>
      </div>
    </div>
    <div styleName='press-enter text-opacity'>or press Enter</div>
  </div>
}
