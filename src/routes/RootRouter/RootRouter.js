import mixpanel from 'mixpanel-browser'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router'
import { POST_DETAIL_MATCH } from 'util/navigation'
import config, { isProduction, isTest } from 'config'
import Loading from 'components/Loading'
import AuthLayoutRouter from 'routes/AuthLayoutRouter'
import NonAuthLayoutRouter from 'routes/NonAuthLayoutRouter'
import OAuthLogin from 'routes/OAuth/Login'
import PublicLayoutRouter from 'routes/PublicLayoutRouter'
import checkLogin from 'store/actions/checkLogin'
import { getAuthorized } from 'store/selectors/getAuthState'

if (!isTest) {
  mixpanel.init(config.mixpanel.token, { debug: !isProduction })
}

export default function RootRouter () {
  const dispatch = useDispatch()
  const isAuthorized = useSelector(getAuthorized)
  const [loading, setLoading] = useState(true)

  // This should be the only place we check for a session from the API.
  // Routes will not be available until this check is complete.
  useEffect(() => {
    (async function () {
      setLoading(true)
      await dispatch(checkLogin())
      setLoading(false)
    }())
  }, [dispatch, checkLogin, setLoading])

  if (loading) {
    return (
      <Loading type='fullscreen' />
    )
  }

  if (isAuthorized) {
    return (
      <Switch>
        {/* If authenticated and trying to do an oAuth login we need to still get an auth code from the server and redirect to redirect_url */}
        <Route path='/oauth/login/:uid'>
          <OAuthLogin authenticated />
        </Route>
        {/* If authenticated and need to ask for oAuth consent again do so */}
        <Route
          path='/oauth/consent/:uid'
          component={routeProps => (
            <NonAuthLayoutRouter {...routeProps} skipAuthCheck />
          )}
        />

        <Route component={AuthLayoutRouter} />
      </Switch>
    )
  }
  if (!isAuthorized) {
    return (
      <Switch>
        <Route
          path='/:context(groups)/:groupSlug/join/:accessCode'
          component={NonAuthLayoutRouter}
        />
        <Route
          path={[
            '/:context(public)/:view(map|groups)?',
            `(.*)/${POST_DETAIL_MATCH}`,
            '/:context(groups)/:groupSlug?'
          ]}
          component={PublicLayoutRouter}
        />
        <Route component={NonAuthLayoutRouter} />
      </Switch>
    )
  }
}
