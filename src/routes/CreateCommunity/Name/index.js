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
export default class Name extends Component {
  setState = () => {

  }
  render () {
    return <div styleName='flex-wrapper'>
      <LeftSidebar
        header="Great, let's get started"
        body="All good things start somewhere! Let's kick things off with a catchy name for your community."
      />
      <div styleName='panel'>
        <div>
          <span styleName='step-count'>STEP 1/4</span>
        </div>
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(hyloNameWhiteBackground)} />
        </div>
        <div styleName='center-vertically'>
          <span styleName='text-input-label'>What's the name of your community?</span>
          <TextInput
            type='text'
            name='community-name'
            onChange={this.setState('community-name')}
            inputRef={input => { this.email = input }}
            theme={theme}
            placeholder="What's the name of your community?"
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
