import cx from 'classnames'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import AddLocation from './AddLocation'
import UploadPhoto from './UploadPhoto'
import WelcomeExplore from './WelcomeExplore'
import classes from './WelcomeWizard.module.scss'

export default function WelcomeWizardRouter () {
  return (
    <CSSTransition
      classNames='welcome-wizard'
      timeout={{ enter: 400, exit: 300 }}
    >
      <div className={classes.modal}>
        <div className={cx(classes.background, classes.background)} />
        <div className={cx(classes.wrapper, classes.wrapper)}>
          <Routes>
            <Route path='/welcome/upload-photo' element={<UploadPhoto />} />
            <Route path='/welcome/add-location' element={<AddLocation />} />
            <Route path='/welcome/explore' element={<WelcomeExplore />} />
            <Route render={props => <Navigate to='/welcome/upload-photo' replace />} />
          </Routes>
        </div>
      </div>
    </CSSTransition>
  )
}
