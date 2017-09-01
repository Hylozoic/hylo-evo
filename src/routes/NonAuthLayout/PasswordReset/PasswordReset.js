import React, { Component } from 'react'
import LeftSidebar from 'routes/Signup/LeftSidebar'
import '../../Signup/Signup.scss'

export default class PasswordReset extends Component {
  render () {
    return <div styleName='wrapper'>
      <LeftSidebar
        header='Reset your passwordzzzzz'
        body='Give me your emaiilz.'
      />
      <div styleName='detail'>
        Here's where the email field will go
      </div>
    </div>
  }
}
