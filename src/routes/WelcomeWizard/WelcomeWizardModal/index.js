import React from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import '../WelcomeWizard.scss'

export default function WelcomeWizardModal (props) {
  return <CSSTransitionGroup
    transitionName='welcome-wizard'
    transitionAppear
    transitionAppearTimeout={400}
    transitionEnterTimeout={400}
    transitionLeaveTimeout={300}>
    <div
      styleName='modal'
      key='modal'>
      <div styleName='background' className='background' />
      <div styleName='wrapper' className='wrapper'>
        {<props.child />}
      </div>
    </div>
  </CSSTransitionGroup>
}
