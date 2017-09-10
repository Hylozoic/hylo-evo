import React, { Component } from 'react'
import '../CreateCommunity.scss'
import LeftSidebar from '../../Signup/LeftSidebar'
import TextInput from 'components/TextInput'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import ModalFooter from '../ModalFooter'

export default class Name extends Component {
  constructor (props) {
    super(props)
    this.state = {
      communityName: ''
    }
  }

  handleNameChange = (event) => {
    const communityName = event.target.value
    this.setState({
      communityName
    })
  }

  submit = () => {
    this.props.addCommunityName(this.state.communityName)
    this.props.goToNextStep()
  }

  onEnter = event => {
    if (event.key === 'Enter') {
      this.submit()
    }
  }

  componentWillMount = () => {
    const { communityName } = this.props
    if (communityName) this.setState({name: communityName})
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
          <span styleName='step-count'>STEP 1/3</span>
        </div>
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(hyloNameWhiteBackground)} />
        </div>
        <div styleName='center-vertically'>
          <span styleName='text-input-label'>{ this.state.communityName && "What's the name of your community?"}</span>
          <TextInput
            type='text'
            name='community-name'
            onChange={this.handleNameChange}
            value={this.state.communityName}
            theme={inputTheme}
            placeholder="What's the name of your community?"
            showClearButton={false}
            onEnter={this.onEnter}
          />
        </div>
      </div>
      <ModalFooter
        submit={this.submit}
        showPrevious={false}
        continueText={'Continue'}
        />
    </div>
  }
}

const inputTheme = {
  inputStyle: 'modal-input',
  wrapperStyle: 'center'
}

const sidebarTheme = {
  sidebarHeader: 'sidebar-header-full-page',
  sidebarText: 'gray-text sidebar-text-full-page'
}
