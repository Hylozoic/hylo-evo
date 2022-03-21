import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StaticRouter } from 'react-router'
import { Switch } from 'react-router-dom'
import { createBrowserHistory, createMemoryHistory } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import checkLogin from 'store/actions/checkLogin'
import Loading from 'components/Loading'
import PrimaryLayout from 'routes/PrimaryLayout'
import AuthRoute from './AuthRoute'
import JoinGroup from 'routes/JoinGroup'
import NonAuthLayout from 'routes/NonAuthLayout'
import ErrorBoundary from 'components/ErrorBoundary'
import '../css/global/index.scss'
import getSignupState, { SignupState } from 'store/selectors/getSignupState'
import RedirectRoute from './RedirectRoute'

function Router () {
  const dispatch = useDispatch()
  const signupState = useSelector(getSignupState)
  const signupInProgress = signupState === SignupState.InProgress
  const signupComplete = signupState === SignupState.Complete
  const [loading, setLoading] = useState(true)

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
        {/* TODO: Confirm that the "|" route match works, confirm that join group works with returnToOnAuth */}
        <AuthRoute path='/:context(groups)/:groupSlug/join/:accessCode|/h/use-invitation' component={JoinGroup} returnToOnAuth />
        <AuthRoute path='/login' component={NonAuthLayout} />
        <AuthRoute path='/reset-password' exact component={NonAuthLayout} />
        <AuthRoute path='/signup' component={NonAuthLayout} />
        {!signupComplete && (
          <AuthRoute path='/:context(public)' component={NonAuthLayout} />
        )}
        {/* TODO: Confirm that join group works with returnToOnAuth */}
        {(signupInProgress || signupComplete) && (
          <AuthRoute path='/' component={PrimaryLayout} returnToOnAuth />
        )}
        {/* TODO: Will this break the proxy webpage situation, probably? Hmm... Maybe we don't need a root route here */}
        <RedirectRoute path='/' to='/login' />
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
