import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, StaticRouter } from 'react-router'
import { Switch } from 'react-router-dom'
import { createBrowserHistory, createMemoryHistory } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import checkLogin from 'store/actions/checkLogin'
import getSignupState, { SignupState } from 'store/selectors/getSignupState'
import ErrorBoundary from 'components/ErrorBoundary'
import Loading from 'components/Loading'
import PrimaryLayout from 'routes/PrimaryLayout'
import PublicLayout from 'routes/PublicLayout'
import NonAuthLayout from 'routes/NonAuthLayout'
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

  // TODO: Revisit this in terms of returnToPath
  // On mobile we want to only store the intended URL and forward to the
  // download app modal (which is currently on the Login component/page)
  // Specifically we don't want any components to do any work but this,
  // namely JoinGroup which utilizes returnToOnAuth) and may attempt
  // to auth the user with a token and send them into sign-up.

  return (
    <ErrorBoundary>
      {!isAuthorized && (
        <Switch>
          <Route path='/public' component={PublicLayout} />
          <Route component={NonAuthLayout} />
        </Switch>
      )}
      {isAuthorized && (
        <Route
          path={[
            '/:context(groups)/:groupSlug/:view(events|groups|map|members|projects|settings|stream|topics)?',
            '/:context(all|public)/:view(events|groups|map|members|projects|settings|stream|topics)?',
            '/'
          ]}
          component={PrimaryLayout}
        />
      )}
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
