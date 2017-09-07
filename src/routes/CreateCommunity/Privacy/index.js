import React, { Component } from 'react'
import '../CreateCommunity.scss'
import LeftSidebar from '../../Signup/LeftSidebar'
import TextInput from 'components/TextInput'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import ModalFooter from '../ModalFooter'

const theme = {
  inputStyle: 'modal-input',
  wrapperStyle: 'center'
}
export default class Privacy extends Component {
  setState = () => {

  }
  render () {
    return <div styleName='flex-wrapper'>
      <LeftSidebar
        header='Set the privacy of your community'
        body='Hylo helps groups stay connected organized and engaged.'
      />
      <div styleName='panel'>
        <div>
          <span styleName='step-count'>STEP 3/4</span>
        </div>
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(hyloNameWhiteBackground)} />
        </div>
        <div styleName='center-vertically'>
          <TextInput
            type='text'
            name='community-name'
            onChange={this.setState('community-name')}
            inputRef={input => { this.email = input }}
            theme={theme}
            placeholder='Choose a domain name'
          />
        </div>
      </div>
      <ModalFooter
        submit={this.submit}
        previous={this.previous}
        showPrevious={false}
        continueText={'Continue'}
        />
    </div>
  }
}
