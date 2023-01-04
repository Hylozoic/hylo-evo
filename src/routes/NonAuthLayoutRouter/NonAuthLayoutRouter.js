import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Redirect, Link, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Div100vh from 'react-div-100vh'
import Particles from 'react-tsparticles'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import setReturnToPath from 'store/actions/setReturnToPath'
import { getAuthenticated } from 'store/selectors/getAuthState'
import particlesjsConfig from './particlesjsConfig'
import Button from 'components/Button'
import HyloCookieConsent from 'components/HyloCookieConsent'
import JoinGroup from 'routes/JoinGroup'
import Login from 'routes/NonAuthLayoutRouter/Login'
import OAuthConsent from 'routes/OAuth/Consent'
import OAuthLogin from 'routes/OAuth/Login'
import PasswordReset from 'routes/NonAuthLayoutRouter/PasswordReset'
import SignupRouter from 'routes/NonAuthLayoutRouter/Signup/SignupRouter'
import './NonAuthLayoutRouter.scss'

const particlesStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
}

export default function NonAuthLayoutRouter (props) {
  const { location } = props
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(getAuthenticated)
  const returnToPathFromQueryString = getQuerystringParam('returnToUrl', null, props)
  const returnToNavigationState = props.location?.state?.from
  const returnToPath = returnToNavigationState
    ? returnToNavigationState.pathname + returnToNavigationState.search
    : returnToPathFromQueryString

  useEffect(() => {
    if (returnToPath && returnToPath !== '/') {
      // Clears location state on page reload
      props.history.replace({ state: null })
      dispatch(setReturnToPath(returnToPath))
    }

    if (!props.skipAuthCheck && isAuthenticated) {
      props.history.replace('/signup')
    }
  }, [dispatch, setReturnToPath, returnToPath])

  return (
    <Div100vh styleName='nonAuthContainer'>
      <Helmet>
        <title>Hylo</title>
        <meta name='description' content='Prosocial Coordination for a Thriving Planet' />
      </Helmet>
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
            <Route
              path='/login'
              component={routeProps => (
                <Login {...props} {...routeProps} styleName='form' />
              )}
            />
            <Route
              path='/signup'
              component={routeProps => (
                <SignupRouter {...props} {...routeProps} styleName='form' />
              )}
            />
            <Route
              path='/reset-password'
              component={routeProps => (
                <PasswordReset {...props} {...routeProps} styleName='form' />
              )}
            />
            <Route
              path={[
                '/:context(groups)/:groupSlug/join/:accessCode',
                '/h/use-invitation'
              ]}
              component={JoinGroup}
            />
            <Route path='/oauth/login/:uid'>
              <OAuthLogin styleName='form' />
            </Route>
            <Route
              path='/oauth/consent/:uid'
              component={routeProps => (
                <OAuthConsent {...routeProps} styleName='form' />
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
        <Switch>
          <Route
            path='/signup'
            exact
            component={() => (
              <div styleName='below-container'>
                <Link to='/login'>
                  Already have an account? <Button styleName='signupButton' color='green-white-green-border'>Sign in</Button>
                </Link>
              </div>
            )}
          />
          <Route
            path='/reset-password'
            component={() => (
              <div styleName='below-container'>
                <div styleName='resetPasswordBottom'>
                  <Link tabIndex={-1} to='/signup'>
                    <Button styleName='signupButton' color='green-white-green-border'>Sign Up</Button>
                  </Link>
                  or
                  <Link to='/login'>
                    <Button styleName='signupButton' color='green-white-green-border'>Log In</Button>
                  </Link>
                </div>
              </div>
            )}
          />
          <Route
            path='/login'
            exact
            component={() => (
              <div styleName='below-container'>
                <Link tabIndex={-1} to='/signup'>
                  Not a member of Hylo? <Button styleName='signupButton' color='green-white-green-border'>Sign Up</Button>
                </Link>
              </div>
            )}
          />
          <Route
            path='/oauth/login'
            component={(props) => (
              <div styleName='below-container'>
                <p>Use your Hylo account to access {getQuerystringParam('name', {}, props) || 'this application'}.</p>
              </div>
            )}
          />
          <Route
            path='/oauth/consent'
            component={(props) => (
              <div styleName='below-container'>
                <p>Make sure you trust {getQuerystringParam('name', {}, props) || 'this application'} with your information.</p>
              </div>
            )}
          />
        </Switch>
        <div styleName='below-container'>
          <a href='https://hylo.com/terms/' target='_blank' rel='noreferrer'>Terms of Service</a> +&nbsp;
          <a href='https://hylo.com/terms/privacy' target='_blank' rel='noreferrer'>Privacy Policy</a>
        </div>
      </div>
      <HyloCookieConsent />
    </Div100vh>
  )
}
