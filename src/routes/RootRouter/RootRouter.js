import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import mixpanel from 'mixpanel-browser'
import { Route } from 'react-router'
import { Switch } from 'react-router-dom'
import checkLogin from 'store/actions/checkLogin'
import { getAuthorized } from 'store/selectors/getAuthState'
import Loading from 'components/Loading'
import AuthLayoutRouter from 'routes/AuthLayoutRouter'
import PublicLayoutRouter from 'routes/PublicLayoutRouter'
import NonAuthLayoutRouter from 'routes/NonAuthLayoutRouter'
import HyloAppRouter from 'routes/HyloAppRouter'
import config, { isProduction, isTest } from 'config'

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
        <Route path='/hyloApp' component={HyloAppRouter} />
        <Route component={AuthLayoutRouter} />
      </Switch>
    )
  }

  if (!isAuthorized) {
    return (
      <Switch>
        <Route path='/public/groups' exact component={NonAuthLayoutRouter} />
        <Route path='/public' component={PublicLayoutRouter} />
        <Route path='/hyloApp' component={HyloAppRouter} />
        <Route component={NonAuthLayoutRouter} />
      </Switch>
    )
  }
}
