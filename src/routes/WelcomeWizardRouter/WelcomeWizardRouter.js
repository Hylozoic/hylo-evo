import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import AddLocation from './AddLocation'
import UploadPhoto from './UploadPhoto'
import WelcomeExplore from './WelcomeExplore'
import './WelcomeWizard.scss'

export default function WelcomeWizardRouter () {
  return (
    <CSSTransition
      classNames='welcome-wizard'
      timeout={{ enter: 400, exit: 300 }}
    >
      <div styleName='modal'>
        <div styleName='background' className='background' />
        <div styleName='wrapper' className='wrapper'>
          <Switch>
            <Route path='/welcome/upload-photo' component={UploadPhoto} />
            <Route path='/welcome/add-location' component={AddLocation} />
            <Route path='/welcome/explore' component={WelcomeExplore} />
          </Switch>
        </div>
      </div>
    </CSSTransition>
  )
}
