import mixpanel from 'mixpanel-browser'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import config, { isProduction, isTest } from 'config/index'
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
  }, [dispatch, setLoading])

  if (loading) {
    return (
      <Loading type='fullscreen' />
    )
  }

  if (isAuthorized) {
    return (
      <Routes>
        {/* If authenticated and trying to do an oAuth login we need to still get an auth code from the server and redirect to redirect_url */}
        <Route path='/oauth/login/:uid' element={<OAuthLogin authenticated />} />
        {/* If authenticated and need to ask for oAuth consent again do so */}
        <Route
          path='/oauth/consent/:uid'
          element={<NonAuthLayoutRouter skipAuthCheck />}
        />

        <Route path='*' element={<AuthLayoutRouter />} />
      </Routes>
    )
  }
  if (!isAuthorized) {
    return (
      <Routes>
        <Route
          path='/:context(groups)/:groupSlug/join/:accessCode'
          element={<NonAuthLayoutRouter />}
        />
        <Route
          path='/:context(public)'
          element={<PublicLayoutRouter />}
        />
        <Route
          path='/:context(public)/:view(map|groups)'
          element={<PublicLayoutRouter />}
        />
        {/* TODO route: how to do this? know each route that is possible? <Route
          path={`(.*)/${POST_DETAIL_MATCH}`}
          element={<PublicLayoutRouter />}
        /> */}
        <Route
          path='/:context(groups)'
          element={<PublicLayoutRouter />}
        />
        <Route
          path='/:context(groups)/:groupSlug'
          element={<PublicLayoutRouter />}
        />
        <Route path='*' element={<NonAuthLayoutRouter />} />
      </Routes>
    )
  }
}
