import React from 'react'
import { Route, Redirect, Link, Switch } from 'react-router-dom'
import Div100vh from 'react-div-100vh'
import Particles from 'react-particles-js'
import particlesjsConfig from './particlesjsConfig'
import Login from 'routes/NonAuthLayout/Login'
import PasswordReset from 'routes/NonAuthLayout/PasswordReset'
import SignupRouter from 'routes/NonAuthLayout/Signup/SignupRouter'
import Button from 'components/Button'
import HyloCookieConsent from 'components/HyloCookieConsent'
import './NonAuthLayout.scss'

const particlesStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
}

export default function NonAuthLayout (props) {
  const { location } = props

  return (
    <Div100vh styleName='nonAuthContainer'>
      <div styleName='background'>
        <div styleName='particlesBackgroundWrapper'>
          <Particles params={particlesjsConfig} style={particlesStyle} />
        </div>
        <div styleName='topRow'>
          <a href='/'>
            <img styleName='logo' src='/assets/hylo.svg' alt='Hylo logo' />
          </a>
        </div>
        <div styleName='signupRow'>
          <Switch>
            <Route
              path='/reset-password'
              component={routeProps => (
                <PasswordReset {...props} {...routeProps} styleName='form' />
              )}
            />
            <Route
              path='/signup'
              component={routeProps => (
                <SignupRouter {...props} {...routeProps} styleName='form' />
              )}
            />
            <Route
              path='/login'
              component={routeProps => (
                <Login {...props} {...routeProps} styleName='form' />
              )}
            />
            {/*
              NOTE: This redirects on anything unmatched including `/`. This shouldn't
              interfere with the static pages as those routes are first use `path='/(.+)'`
              to match anything BUT root if there is any issue.
            */}
            <Redirect to={{ pathname: '/login', state: { from: location } }} />
          </Switch>
        </div>
        <div styleName='below-container'>
          <Switch>
            <Route
              path='/signup'
              component={() => (
                <Link to='/login'>
                  Already have an account? <Button styleName='signupButton' color='green-white-green-border'>Sign in</Button>
                </Link>
              )}
            />
            <Route
              path='/reset-password'
              component={() => (
                <div styleName='resetPasswordBottom'>
                  <Link tabIndex={-1} to='/signup'>
                    <Button styleName='signupButton' color='green-white-green-border'>Sign Up</Button>
                  </Link>
                  or
                  <Link to='/login'>
                    <Button styleName='signupButton' color='green-white-green-border'>Log In</Button>
                  </Link>
                </div>
              )}
            />
            <Route
              path='/' component={() => (
                <Link tabIndex={-1} to='/signup'>
                  Not a member of Hylo? <Button styleName='signupButton' color='green-white-green-border'>Sign Up</Button>
                </Link>
              )}
            />
          </Switch>
        </div>
      </div>
      <HyloCookieConsent />
    </Div100vh>
  )
}
