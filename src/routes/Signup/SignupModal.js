import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Signup from './Signup'
import './Signup.scss'

export default class SignupModal extends Component {
  render () {
    return <ReactCSSTransitionGroup
      transitionName='post-editor'
      transitionAppear
      transitionAppearTimeout={400}
      transitionEnterTimeout={400}
      transitionLeaveTimeout={300}>
      <Signup />
    </ReactCSSTransitionGroup>
  }
}
