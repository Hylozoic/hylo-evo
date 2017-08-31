import React, { Component } from 'react'
import '../Signup.scss'

export default class LeftSidebar extends Component {
  closeSignupModal = () => {
    console.log('home')
    const changes = {settings: {'signupInProgress': false}}
    this.props.updateUserSettings(changes)
    this.props.redirectHome()
  }
  render () {
    const { header, body } = this.props
    return <div styleName='sidebar'>
      <p styleName='gray-text close-button' onClick={this.closeSignupModal}>CLOSE</p>
      <p styleName='sidebar-header'>{header}</p>
      <p styleName='gray-text'>{body}</p>
    </div>
  }
}
