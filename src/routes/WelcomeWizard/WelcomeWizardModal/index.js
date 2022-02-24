import React from 'react'
import { CSSTransition } from 'react-transition-group'
import '../WelcomeWizard.scss'

export default function WelcomeWizardModal (props) {
  return <CSSTransition
    classNames='welcome-wizard'
    timeout={{ enter: 400, exit: 300 }}
  >
    <div styleName='modal'>
      <div styleName='background' className='background' />
      <div styleName='wrapper' className='wrapper'>
        {<props.child />}
      </div>
    </div>
  </CSSTransition>
}
