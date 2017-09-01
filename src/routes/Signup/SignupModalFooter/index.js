import React from 'react'
import Button from 'components/Button'
import '../Signup.scss'

export default function SignupModalFooter ({previous, submit, showPrevious = true}) {
  return <div styleName='float-right bottom'>
    <div>
      {showPrevious && <Button styleName='previous-button inline-buttons' label='Previous' onClick={previous} />}
      <Button styleName='continue-button inline-buttons continue-button-inline' label='Continue' onClick={submit} />
    </div>
    <div styleName='instruction'>or press Enter</div>
  </div>
}
