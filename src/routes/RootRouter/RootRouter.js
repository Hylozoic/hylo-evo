import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route } from 'react-router'
import { Switch } from 'react-router-dom'
import checkLogin from 'store/actions/checkLogin'
import getSignupState, { SignupState } from 'store/selectors/getSignupState'
import Loading from 'components/Loading'
import AuthLayoutRouter from 'routes/AuthLayoutRouter'
import PublicLayoutRouter from 'routes/PublicLayoutRouter'
import NonAuthLayoutRouter from 'routes/NonAuthLayoutRouter'

export default function RootRouter () {
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
  if (isAuthorized) {
    // This pre-load some React Router match params for `AuthLayoutRouter`
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
