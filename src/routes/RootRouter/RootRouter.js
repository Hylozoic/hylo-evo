import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route } from 'react-router'
import { Switch } from 'react-router-dom'
import checkLogin from 'store/actions/checkLogin'
import { getAuthorized } from 'store/selectors/getSignupState'
import Loading from 'components/Loading'
import AuthLayoutRouter from 'routes/AuthLayoutRouter'
import PublicLayoutRouter from 'routes/PublicLayoutRouter'
import NonAuthLayoutRouter from 'routes/NonAuthLayoutRouter'

export default function RootRouter () {
  const dispatch = useDispatch()
  const isAuthorized = useSelector(getAuthorized)
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

  if (isAuthorized) {
    // The path matching here serves to pre-load React Router route match
    // params needed in `AuthLayoutRouter`
    return (
      <Route
        path={[
          '/:context(groups)/:groupSlug/:view(events|groups|map|members|projects|settings|stream|topics)?',
          '/:context(all|public)/:view(events|groups|map|members|projects|settings|stream|topics)?',
          '/'
        ]}
        component={AuthLayoutRouter}
      />
    )
  }

  if (!isAuthorized) {
    return (
      <Switch>
        <Route path='/public' component={PublicLayoutRouter} />
        <Route component={NonAuthLayoutRouter} />
      </Switch>
    )
  }
}
