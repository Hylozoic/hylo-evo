import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import getSignupState, { SignupState } from 'store/selectors/getSignupState'
import RedirectRoute from 'router/RedirectRoute'
import Signup from './Signup'
import VerifyEmail from './VerifyEmail'
import FinishRegistration from './FinishRegistration'
import './Signup.scss'

export default function SignupRouter (props) {
  const signupState = useSelector(getSignupState)
  let redirectTo

  switch (signupState) {
    case SignupState.None: {
      redirectTo = '/signup'
      break
    }
    case SignupState.EmailValidation: {
      redirectTo = '/signup/verify-email'
      break
    }
    case SignupState.Registration: {
      redirectTo = '/signup/finish'
      break
    }
    case SignupState.InProgress: {
      redirectTo = '/'
      break
    }
  }

  return (
    <Switch>
      {(redirectTo !== props.location.pathname) && (
        <RedirectRoute to={redirectTo} />
      )}
      <Route
        exact
        path='/signup'
        component={() => (
          <Signup {...props} styleName='form' />
        )}
      />
      <Route
        exact
        path='/signup/verify-email'
        component={() => (
          <VerifyEmail {...props} styleName='form' />
        )}
      />
      <Route
        exact
        path='/signup/finish'
        component={() => (
          <FinishRegistration {...props} styleName='form' />
        )}
      />
    </Switch>
  )
}