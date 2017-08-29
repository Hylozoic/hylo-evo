import React, { Component } from 'react'
import { Redirect } from 'react-router'
import '../Signup.scss'

export default class LeftSidebar extends Component {
  constructor () {
    super()
    this.state = {
      fireRedirect: false
    }
    this.redirectUrl = '/signup/upload-photo'
  }
  closeSignupModal = () => {
    const changes = {settings: {'signupInProgress': false}}
    this.props.updateUserSettings(changes)
    this.setState({
      fireRedirect: true
    })
  }
  render () {
    const { header, body } = this.props
    const { fireRedirect } = this.state
    return <div styleName='sidebar'>
      { fireRedirect && <Redirect to='/' />}
      <p styleName='gray-text close-button' onClick={this.closeSignupModal}>CLOSE</p>
      <p styleName='sidebar-header'>{header}</p>
      <p styleName='gray-text'>{body}</p>
    </div>
  }
}
