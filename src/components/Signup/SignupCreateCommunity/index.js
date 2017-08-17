import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import '../Signup.scss'

export default class SignupCreateCommunity extends Component {
  render () {
    return <ReactCSSTransitionGroup
      transitionName='post-editor'
      transitionAppear
      transitionAppearTimeout={400}
      transitionEnterTimeout={400}
      transitionLeaveTimeout={300}>
      <div
        styleName='signup-modal'
        key='signup-modal'>
        <div styleName='signup-background' className='signup-background' />
        <div styleName='signup-wrapper' className='signup-wrapper'>
          <TestComp />
        </div>
      </div>
    </ReactCSSTransitionGroup>
  }
}

export function TestComp () {
  return <div styleName='wrapper'>
    <div styleName='left-sidebar'>
      <p>First</p>
      <p>Second</p>
      <p>Third</p>
      <p>Fourth</p>
      <p>Fifth</p>
    </div>
    <div styleName='center'>right</div>
  </div>
}
