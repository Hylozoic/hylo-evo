import React, { Component } from 'react'
import '../CreateCommunity.scss'
import LeftSidebar from '../../Signup/LeftSidebar'
import TextInput from 'components/TextInput'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import ModalFooter from '../ModalFooter'

const theme = {
  inputStyle: 'modal-input partial',
  wrapperStyle: 'center'
}
export default class Review extends Component {
  setState = () => {

  }
  render () {
    return <div styleName='flex-wrapper'>
      <LeftSidebar
        header='Everything looking good?'
        body='You can always come back and change your details at any time'
      />
      <div styleName='panel'>
        <div>
          <span styleName='step-count'>STEP 4/4</span>
        </div>
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(hyloNameWhiteBackground)} />
        </div>
        <div styleName='center-review'>
          <ReviewTextInput label={'Your Name'} />
          <ReviewTextInput label={'Your Email'} />
          <ReviewTextInput label={'Community Name'} />
          <ReviewTextInput label={'Domain'} />
        </div>
      </div>
      <ModalFooter
        submit={this.submit}
        previous={this.previous}
        showPrevious={false}
        continueText={'Finish Up'}
        />
    </div>
  }
}

export function ReviewTextInput ({label}) {
  return <div styleName='review-input-text-row'>
    <div styleName='review-input-text-label'>
      <span>{label}</span>
    </div>
    <div styleName='review-input-text'>
      <TextInput
        type='text'
        name='community-name'
        value={''}
        theme={theme}
        placeholder="What's the name of your community?"
      />
    </div>
    <div styleName='review-input-edit'>
      <span styleName='edit-button' onClick={() => this.makeEditable('name')}>Edit</span>
    </div>
  </div>
}
