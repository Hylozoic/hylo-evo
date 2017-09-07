import React, { Component } from 'react'
import '../Signup.scss'

export default class LeftSidebar extends Component {
  closeSignupModal = () => {
    const changes = {settings: {signupInProgress: 'false'}}
    this.props.updateUserSettings(changes)
    this.props.redirectHome()
  }
  render () {
    const { theme = {}, header, body } = this.props
    return <div styleName={'sidebar'}>
      <p styleName='gray-text close-button' onClick={this.closeSignupModal}>CLOSE</p>
      <p styleName={theme.sidebarHeader || 'sidebar-header'}>{header}</p>
      <p styleName={theme.sidebarText || 'gray-text sidebar-text'}>{body}</p>
    </div>
  }
}
