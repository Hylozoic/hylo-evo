import React from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import '../Signup.scss'

export default function SignupModal (props) {
  return <CSSTransitionGroup
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
  </CSSTransitionGroup>
}
