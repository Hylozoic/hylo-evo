import React, { Component } from 'react'
import '../CreateGroup.scss'
import TextInput from 'components/TextInput'
import { hyloNameWhiteBackground, happyAxolotl } from 'util/assets'
import { bgImageStyle } from 'util/index'
import ModalFooter from 'components/ModalFooter'
import ModalSidebar from 'components/ModalSidebar'

export default class Name extends Component {
  constructor (props) {
    super(props)
    this.state = {
      groupName: ''
    }
  }

  handleNameChange = (event) => {
    const groupName = event.target.value
    this.setState({
      groupName
    })
  }

  submit = () => {
    this.props.addGroupName(this.state.groupName)
    this.props.goToNextStep()
  }

  errorCheckAndSubmit = () => {
    if (this.state.groupName === '') {
      this.setState({
        error: 'Please enter a group name'
      })
    } else {
      this.submit()
    }
  }

  onEnter = event => {
    if (event.key === 'Enter') {
      this.errorCheckAndSubmit()
    }
  }

  componentWillMount = () => {
    const { groupName } = this.props
    if (groupName) this.setState({ groupName })
  }

  componentDidMount = () => {
    this.props.addParentIds()
  }

  render () {
    return <div styleName='flex-wrapper'>
      <ModalSidebar
        imageDialogOne={"Hi, I'm Hylo the Axolotl!"}
        imageDialogTwo={"It's great to meet you!"}
        imageUrl={happyAxolotl}
        onClick={this.props.goHome}
        theme={sidebarTheme}
        header="Great, let's get started"
        body="All good things start somewhere! Let's kick things off with a catchy name for your group."
      />
      <div styleName='panel'>
        <div>
          <span styleName='step-count'>STEP 1/3</span>
        </div>
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(hyloNameWhiteBackground)} />
        </div>
        <div styleName='center-vertically'>
          <span styleName='text-input-label'>{ this.state.groupName && "What's the name of your group?"}</span>
          <TextInput
            type='text'
            name='group-name'
            onChange={this.handleNameChange}
            value={this.state.groupName}
            theme={inputTheme}
            placeholder="What's the name of your group?"
            noClearButton
            onEnter={this.onEnter}
          />
          { this.state.error && <span styleName='arrow-up' /> }
          { this.state.error && <span styleName='error'>{this.state.error}</span>}
        </div>
      </div>
      <ModalFooter
        submit={this.errorCheckAndSubmit}
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
