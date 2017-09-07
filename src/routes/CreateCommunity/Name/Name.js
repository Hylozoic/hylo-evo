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

const sidebarTheme = {
  sidebarHeader: 'sidebar-header-full-page',
  sidebarText: 'gray-text sidebar-text-full-page'
}

export default class Name extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'name': ''
    }
  }

  handleNameChange = (event) => {
    const name = event.target.value
    this.setState({
      name
    })
  }

  render () {
    return <div styleName='flex-wrapper'>
      <LeftSidebar
        theme={sidebarTheme}
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
            onChange={this.handleNameChange}
            inputRef={input => { this.email = input }}
            value={this.state.name}
            theme={theme}
            placeholder="What's the name of your community?"
          />
        </div>
      </div>
      <ModalFooter
        submit={this.props.goToNextStep}
        showPrevious={false}
        continueText={'Continue'}
        />
    </div>
  }
}
