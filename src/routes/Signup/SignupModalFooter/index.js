import React from 'react'
import Button from 'components/Button'
import '../Signup.scss'

export default function SignupModalFooter ({previous, submit, showPrevious = true}) {
  showPrevious = true
  return <div styleName='signup-modal-footer'>
    <div styleName='footer-buttons'>
      {showPrevious && <Button styleName='previous-button' label='Previous' onClick={previous} />}
      <Button styleName='continue-button' label='Continue' onClick={submit} />
    </div>
    <div styleName='press-enter'>or press Enter</div>
  </div>
}
