import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StaticRouter } from 'react-router'
import { Switch } from 'react-router-dom'
import { createBrowserHistory, createMemoryHistory } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import checkLogin from 'store/actions/checkLogin'
import getSignupState, { SignupState } from 'store/selectors/getSignupState'
import PrimaryLayout from 'routes/PrimaryLayout'
import AuthRoute from './AuthRoute'
import JoinGroup from 'routes/JoinGroup'
import NonAuthLayout from 'routes/NonAuthLayout'
import Loading from 'components/Loading'
import ErrorBoundary from 'components/ErrorBoundary'
import RedirectRoute from './RedirectRoute'
import '../css/global/index.scss'

function Router () {
  const dispatch = useDispatch()
  const signupState = useSelector(getSignupState)
  const [loading, setLoading] = useState(true)
  const isAuthorized = [SignupState.InProgress, SignupState.Complete].includes(signupState)

  // This should be the only place we check for a session from the API
  // and it should not load the router until that check is complete
  useEffect(() => {
    const asyncFunc = async () => {
      setLoading(true)
      await dispatch(checkLogin())
      setLoading(false)
    }
    asyncFunc()
  }, [dispatch, checkLogin, setLoading])

  if (loading) {
    return (
      <Loading type='fullscreen' />
    )
  }

  return (
    <ErrorBoundary>
      <Switch>
        <AuthRoute path='/:context(groups)/:groupSlug/join/:accessCode' component={JoinGroup} returnToOnAuth />
        <AuthRoute path='/h/use-invitation' component={JoinGroup} returnToOnAuth />
        {!isAuthorized && (
          <>
            <AuthRoute path='/login' component={NonAuthLayout} />
            <AuthRoute path='/reset-password' exact component={NonAuthLayout} />
            <AuthRoute path='/signup' component={NonAuthLayout} />
            <AuthRoute path='/:context(public)' component={NonAuthLayout} />
            {/*
              NOTE: This redirects on `/` (and any other path not matched earlier), but shouldn't
              interfere with the static pages as those routes are first use `path='/(.+)'`
              to match anything BUT root if there is any issue.
            */}
            <RedirectRoute path='/' to='/login' />
          </>
        )}
        {isAuthorized && (
          <>
            <RedirectRoute path='/(login|reset-password|signup)' to='/' />
            <AuthRoute path='/' component={PrimaryLayout} returnToOnAuth />
          </>
        )}
      </Switch>
    </ErrorBoundary>
  )
}

export const history = typeof window !== 'undefined'
  ? createBrowserHistory()
  : createMemoryHistory()

export function clientRouter () {
  require('client/rollbar') // set up handling of uncaught errors

  return (
    <ConnectedRouter history={history}>
      <Router />
    </ConnectedRouter>
  )
}

// Current SSR setup is deprecated and to be removed. See https://github.com/Hylozoic/hylo-evo/issues/1069
export function serverRouter (req, context) {
  return (
    <StaticRouter location={req.url} context={context}>
      <Router />
    </StaticRouter>
  )
}
