import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Redirect, Link, Switch } from 'react-router-dom'
import Div100vh from 'react-div-100vh'
import Particles from 'react-tsparticles'
import particlesjsConfig from './particlesjsConfig'
import JoinGroup from 'routes/JoinGroup'
import Login from 'routes/NonAuthLayout/Login'
import PasswordReset from 'routes/NonAuthLayout/PasswordReset'
import SignupRouter from 'routes/NonAuthLayout/Signup/SignupRouter'
import Button from 'components/Button'
import HyloCookieConsent from 'components/HyloCookieConsent'
import './NonAuthLayout.scss'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import setReturnToPath from 'store/actions/setReturnToPath'

const particlesStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
}

export default function NonAuthLayout (props) {
  const { location } = props
  const dispatch = useDispatch()
  const returnToPathFromQueryString = getQuerystringParam('returnToUrl', null, props)
  const returnToNavigationState = props.location?.state?.from
  const returnToPath = returnToNavigationState
    ? returnToNavigationState.pathname + returnToNavigationState.search
    : returnToPathFromQueryString

  useEffect(() => {
    if (returnToPath && returnToPath !== '/') {
      // Clears location state on page reload
      props.history.replace()
      dispatch(setReturnToPath(returnToPath))
    }
  }, [dispatch, setReturnToPath, returnToPath])

  return (
    <Div100vh styleName='nonAuthContainer'>
      <div styleName='background'>
        <div styleName='particlesBackgroundWrapper'>
          <Particles options={particlesjsConfig} style={particlesStyle} />
        </div>
        <div styleName='topRow'>
          <a href='/'>
            <img styleName='logo' src='/assets/hylo.svg' alt='Hylo logo' />
          </a>
        </div>
        <div styleName='signupRow'>
          <Switch>
            <Route path='/:context(groups)/:groupSlug/join/:accessCode' component={JoinGroup} />
            <Route path='/h/use-invitation' component={JoinGroup} />
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
              Default route
              NOTE: This passes the unmatched location for anything unmatched except `/`
              into `location.state.from` which persists navigation and will be set as the
              returnToPath in the `useEffect` in this component. This shouldn't interfere
              with the static pages as those routes are first use `path='/(.+)'` to match
              anything BUT root if there is any issue.
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
