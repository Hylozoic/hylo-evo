import mixpanel from 'mixpanel-browser'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router'
import { POST_DETAIL_MATCH } from 'util/navigation'
import config, { isProduction, isTest } from 'config'
import Loading from 'components/Loading'
import AuthLayoutRouter from 'routes/AuthLayoutRouter'
import PublicLayoutRouter from 'routes/PublicLayoutRouter'
import NonAuthLayoutRouter from 'routes/NonAuthLayoutRouter'
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
      <Route component={AuthLayoutRouter} />
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
            '/:context(public)/:view(map|groups)?', // so I will need to add something here to great public, non-auth group page up? and without stopping the group join mechanism detailed by Loren
            `(.*)/${POST_DETAIL_MATCH}`,
            '/:context(groups)/:groupSlug'
          ]}
          component={PublicLayoutRouter}
        />
        <Route component={NonAuthLayoutRouter} />
      </Switch>
    )
  }
}
