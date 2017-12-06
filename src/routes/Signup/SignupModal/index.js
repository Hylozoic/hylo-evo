import React from 'react'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import '../Signup.scss'

export default function SignupModal (props) {
  return <ReactCSSTransitionGroup
    transitionName='signup'
    transitionAppear
    transitionAppearTimeout={400}
    transitionEnterTimeout={400}
    transitionLeaveTimeout={300}>
    <div
      styleName='signup-modal'
      key='signup-modal'>
      <div styleName='signup-background' className='signup-background' />
      <div styleName='signup-wrapper' className='signup-wrapper'>
        {<props.child />}
      </div>
    </div>
  </ReactCSSTransitionGroup>
}
