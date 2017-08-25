import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import CreateCommunity from '../CreateCommunity'
import '../Signup.scss'
export default function SignupModal (props) {
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
        {getChild(props.location.pathname)}
      </div>
    </div>
  </ReactCSSTransitionGroup>
}

export function getChild (location) {
  switch (location) {
    case '/signup/create-community':
      return <CreateCommunity />
    default:
      return null
  }
}
