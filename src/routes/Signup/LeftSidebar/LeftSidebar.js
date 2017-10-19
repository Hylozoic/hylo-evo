import React, { Component } from 'react'
import '../Signup.scss'

export default class LeftSidebar extends Component {
  render () {
    const { theme = {}, header, body, handleCloseSignupModal } = this.props
    return <div styleName={'sidebar'}>
      <p styleName='gray-text close-button' onClick={handleCloseSignupModal}>CLOSE</p>
      <p styleName={theme.sidebarHeader || 'sidebar-header'}>{header}</p>
      <p styleName={theme.sidebarText || 'gray-text sidebar-text'}>{body}</p>
    </div>
  }
}
